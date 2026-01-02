package com.clothingstore.server.controller;

import com.clothingstore.server.entity.Product;
import com.clothingstore.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/init")
    public Product createDummy() {
        Product p = new Product();
        p.setName("Áo Thun Basic");
        p.setPrice(150000.0);
        p.setDescription("Áo thun cotton thoáng mát");
        p.setImageUrl(
                "https://th.bing.com/th/id/R.2fc5cd3d6e303d346f7142af5ae01841?rik=%2bkfMBowDmQq%2bbg&pid=ImgRaw&r=0");
        return productRepository.save(p);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}