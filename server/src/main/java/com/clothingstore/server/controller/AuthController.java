package com.clothingstore.server.controller;

// --- CÁC DÒNG IMPORT CẦN THIẾT (Sửa lỗi gạch đỏ) ---
import com.clothingstore.server.entity.User;
import com.clothingstore.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Chức năng Đăng ký (Có mã hóa)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        if (newUser.getEmail() == null || !newUser.getEmail().contains("@")) {
            return ResponseEntity.badRequest().body("❌ Email không hợp lệ!");
        }

        if (userRepository.existsByUsername(newUser.getUsername())) {
            return ResponseEntity.badRequest().body("❌ Tên đăng nhập này đã tồn tại!");
        }

        // --- MÃ HÓA MẬT KHẨU TRƯỚC KHI LƯU ---
        String encodedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(encodedPassword);

        userRepository.save(newUser);
        return ResponseEntity.ok("Đăng ký thành công !");
    }

    // 2. Chức năng Đăng nhập (Kiểm tra mật khẩu mã hóa)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String rawPassword = data.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Sai tài khoản!");
        }

        User user = userOpt.get();

        // --- KIỂM TRA MẬT KHẨU KHÔNG KHỚP ---
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("❌ Sai mật khẩu!");
        }

        user.setPassword(""); // Xóa hash mật khẩu trước khi gửi về Client
        return ResponseEntity.ok(user);
    }

    // 3. Chức năng Quên mật khẩu (Trả về pass mới luôn)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Email không tồn tại trong hệ thống!");
        }

        User user = userOpt.get();
        // Tạo mật khẩu ngẫu nhiên 6 ký tự
        String newPassword = UUID.randomUUID().toString().substring(0, 6);

        // Mã hóa để lưu vào Database
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 👇 QUAN TRỌNG: Trả về mật khẩu mới cho người dùng xem
        return ResponseEntity.ok("Mật khẩu mới của bạn là: " + newPassword);
    }
}