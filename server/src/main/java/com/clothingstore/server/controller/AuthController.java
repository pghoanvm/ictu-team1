package com.clothingstore.server.controller;

// --- CÁC DÒNG IMPORT CẦN THIẾT (Sửa lỗi gạch đỏ) ---
import com.clothingstore.server.entity.User;
import com.clothingstore.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép React gọi API
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. Chức năng Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        // --- KIỂM TRA ĐỊNH DẠNG EMAIL ---
        if (newUser.getEmail() == null || !newUser.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body("❌ Email không hợp lệ (phải có ký tự @)!");
        }

        // --- KIỂM TRA TRÙNG USERNAME ---
        if (userRepository.existsByUsername(newUser.getUsername())) {
            return ResponseEntity.badRequest().body("❌ Tên đăng nhập này đã tồn tại!");
        }

        // Lưu trực tiếp mật khẩu (Không mã hóa theo yêu cầu của bạn)
        userRepository.save(newUser);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 2. Chức năng Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Sai tài khoản!");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            return ResponseEntity.badRequest().body("❌ Sai mật khẩu!");
        }

        user.setPassword(""); // Xóa mật khẩu trước khi gửi về Client để bảo mật
        return ResponseEntity.ok(user);
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
        user.setPassword(newPassword);
        userRepository.save(user);

        // Giả lập gửi mail (In ra Console của Server)
        System.out.println("==================================");
        System.out.println("MẬT KHẨU MỚI CỦA " + email + " LÀ: " + newPassword);
        System.out.println("==================================");

        return ResponseEntity.ok("Mật khẩu mới đã được gửi! (Kiểm tra Console của Server)");
    }
}