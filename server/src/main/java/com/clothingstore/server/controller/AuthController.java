package com.clothingstore.server.controller;

import com.clothingstore.server.entity.User;
import com.clothingstore.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. Đăng ký
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Tài khoản đã tồn tại!");
        }
        user.setRole("USER"); // Mặc định là khách hàng
        userRepository.save(user);
        return "Đăng ký thành công!";
    }

    // 2. Đăng nhập
    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sai tài khoản!"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Sai mật khẩu!");
        }
        return user; // Trả về thông tin user nếu đúng
    }

    // 3. Quên mật khẩu (Reset về mật khẩu ngẫu nhiên)
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        // Tạo mật khẩu mới ngẫu nhiên (lấy 6 ký tự đầu)
        String newPassword = UUID.randomUUID().toString().substring(0, 6);
        user.setPassword(newPassword);
        userRepository.save(user);

        // GIẢ LẬP GỬI EMAIL (In ra console của Server)
        System.out.println("==================================");
        System.out.println("EMAIL GỬI ĐẾN: " + email);
        System.out.println("MẬT KHẨU MỚI LÀ: " + newPassword);
        System.out.println("==================================");

        return "Mật khẩu mới đã được gửi vào Console Server!";
    }
}