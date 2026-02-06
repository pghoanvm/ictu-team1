package com.clothingstore.server.repository;

import com.clothingstore.server.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Nhớ import List

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUsername(String username);
}