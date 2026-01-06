package com.clothingstore.server.controller;

import com.clothingstore.server.entity.Product;
import com.clothingstore.server.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // @GetMapping("/init")
    // public Product createDummy() {
    // Product p = new Product();
    // p.setName("Áo Thun Basic");
    // p.setPrice(150000.0);
    // p.setDescription("Áo thun cotton thoáng mát");
    // p.setImageUrl(
    // "https://th.bing.com/th/id/R.2fc5cd3d6e303d346f7142af5ae01841?rik=%2bkfMBowDmQq%2bbg&pid=ImgRaw&r=0");
    // return productRepository.save(p);
    // }
    @GetMapping("/newest")
    public List<Product> getNewestProducts() {
        // Sắp xếp theo ID giảm dần (cái nào tạo sau ID sẽ lớn hơn) và lấy 10 cái đầu
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .limit(10)
                .collect(Collectors.toList());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow();

        // Cập nhật thông tin mới
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());

        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
    }
}