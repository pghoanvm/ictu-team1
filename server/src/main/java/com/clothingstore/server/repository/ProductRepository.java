// server/src/main/java/com/clothingstore/server/repository/ProductRepository.java
package com.clothingstore.server.repository;

import com.clothingstore.server.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // Tìm theo tên, không phân biệt hoa thường, có phân trang
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
}