package com.clothingstore.server.auth.controller;

// --- CÁC DÒNG IMPORT CẦN THIẾT (Sửa lỗi gạch đỏ) ---
import com.clothingstore.server.auth.dto.AuthResponse;
import com.clothingstore.server.auth.dto.LoginRequest;
import com.clothingstore.server.auth.dto.RegisterRequest;
import com.clothingstore.server.auth.model.Role;
import com.clothingstore.server.auth.model.User;
import com.clothingstore.server.auth.service.JwtService;
import com.clothingstore.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép React gọi API
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtService jwtService;


    // 1. Chức năng Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest newUser) {
        // --- KIỂM TRA ĐỊNH DẠNG EMAIL ---
        if (newUser.getEmail() == null || !newUser.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body("❌ Email không hợp lệ (phải có ký tự @)!");
        }

        // Kiểm tra email trùng và lưu user mới với mật khẩu đã mã hóa
        if (userRepository.existsByEmail(newUser.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }
        User user = new User();
        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
        user.setRole(Role.USER); // mặc định USER
        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 2. Chức năng Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            return performLogin(req.getIdentifier(), req.getPassword(), null);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity
                    .badRequest()
                    .body("❌ Tài khoản không tồn tại");
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .badRequest()
                    .body("❌ Sai mật khẩu");
        }
    }

    // 3. Chức năng Quên mật khẩu
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Email không tồn tại trên hệ thống!");
        }

        User user = userOpt.get();
        // Tạo mật khẩu mới ngẫu nhiên 6 ký tự
        String newPassword = UUID.randomUUID().toString().substring(0, 6);
        user.setPassword(passwordEncoder.encode(newPassword)); // ✅

        userRepository.save(user);

        // Giả lập gửi mail (In ra Console của Server)
        System.out.println("==================================");
        System.out.println("MẬT KHẨU MỚI CỦA " + email + " LÀ: " + newPassword);
        System.out.println("==================================");

        return ResponseEntity.ok("Mật khẩu mới đã được gửi! (Kiểm tra Console của Server)");
    }

// Xử lý logic đăng nhập chung cho user và admin (xác thực + sinh JWT)

    private ResponseEntity<?> performLogin(String identifier, String password, Role requiredRole) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(identifier, identifier);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại");

        User user = userOpt.get();
        if (requiredRole != null && user.getRole() != requiredRole) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Vai trò không hợp lệ cho endpoint này");
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), password)
        );

        String token = jwtService.generateToken((UserDetails) auth.getPrincipal(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}