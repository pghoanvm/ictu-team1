package com.clothingstore.server.controller;

import com.clothingstore.server.entity.Order;
import com.clothingstore.server.entity.User; // Import User Entity
import com.clothingstore.server.repository.OrderRepository;
import com.clothingstore.server.repository.UserRepository; // Import UserRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository; // 1. Tiêm UserRepository để tra cứu

    /**
     * Helper: Lấy Email từ Google Login
     */
    private String getEmailFromPrincipal(Principal principal) {
        if (principal == null)
            return null;
        if (principal instanceof org.springframework.security.authentication.AbstractAuthenticationToken) {
            Object p = ((org.springframework.security.authentication.AbstractAuthenticationToken) principal)
                    .getPrincipal();
            if (p instanceof OAuth2User) {
                return ((OAuth2User) p).getAttribute("email");
            }
        }
        return principal.getName();
    }

    /**
     * HÀM QUAN TRỌNG: Từ Email Google -> Tìm ra Username "lvh" trong DB
     */
    private String getRealUsername(Principal principal) {
        String email = getEmailFromPrincipal(principal);
        if (email == null)
            return null;

        // Tìm user trong DB xem email này ứng với username nào
        // Giả sử bạn có hàm findByEmail trong UserRepository
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return user.get().getUsername(); // Trả về "lvh"
        }

        // Nếu không tìm thấy trong DB, fallback về email
        return email;
    }

    // 1. TẠO ĐƠN HÀNG
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order, Principal principal) {
        String realUsername = getRealUsername(principal); // Lấy "lvh"

        if (realUsername == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập!");
        }

        order.setUsername(realUsername); // Lưu đơn hàng với tên "lvh"
        order.setOrderDate(LocalDateTime.now().toString());
        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    // 2. LẤY ĐƠN HÀNG CỦA TÔI
    @GetMapping("/mine")
    public ResponseEntity<?> getMyOrders(Principal principal) {
        String realUsername = getRealUsername(principal); // Lấy "lvh"

        if (realUsername == null) {
            return ResponseEntity.status(401).body("Bạn chưa đăng nhập!");
        }

        // Tìm đơn hàng theo "lvh" -> Sẽ ra kết quả đúng
        List<Order> orders = orderRepository.findByUsername(realUsername);
        return ResponseEntity.ok(orders);
    }
}