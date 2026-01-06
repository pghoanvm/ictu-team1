package com.clothingstore.server.repository;

import com.clothingstore.server.entity.Order;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // Tìm đơn hàng của 1 user cụ thể
    List<Order> findByUsername(String username);
}
