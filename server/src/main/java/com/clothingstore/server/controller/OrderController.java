package com.clothingstore.server.controller;

import com.clothingstore.server.entity.Order;
import com.clothingstore.server.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // API nhận đơn hàng (Code cũ)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    // --- THÊM ĐOẠN NÀY ĐỂ XEM DANH SÁCH ĐƠN HÀNG ---
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/my-orders/{username}")
    public List<Order> getMyOrders(@PathVariable String username) {
        return orderRepository.findByUsername(username);
    }

    @PutMapping("/{id}")
    public Order updateOrderStatus(@PathVariable String id, @RequestParam String status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
