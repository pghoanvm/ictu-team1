package com.clothingstore.server.controller;

import com.clothingstore.server.entity.Collection;
import com.clothingstore.server.repository.CollectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "*")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @GetMapping
    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addCollection(@RequestBody Collection collection) {
        collectionRepository.save(collection);
        return ResponseEntity.ok("Thêm bộ sưu tập thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollection(@PathVariable String id) {
        collectionRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa bộ sưu tập!");
    }

    @PostMapping("/{collectionId}/add-product/{productId}")
    public ResponseEntity<?> addProduct(@PathVariable String collectionId, @PathVariable String productId) {
        Collection collection = collectionRepository.findById(collectionId).orElse(null);
        if (collection == null)
            return ResponseEntity.badRequest().body("Không tìm thấy bộ sưu tập");

        if (!collection.getProductIds().contains(productId)) {
            collection.getProductIds().add(productId);
            collectionRepository.save(collection);
        }
        return ResponseEntity.ok(collection);
    }

    // API: Xóa sản phẩm khỏi bộ sưu tập
    @PostMapping("/{collectionId}/remove-product/{productId}")
    public ResponseEntity<?> removeProduct(@PathVariable String collectionId, @PathVariable String productId) {
        Collection collection = collectionRepository.findById(collectionId).orElse(null);
        if (collection == null)
            return ResponseEntity.badRequest().body("Không tìm thấy bộ sưu tập");

        collection.getProductIds().remove(productId);
        collectionRepository.save(collection);

        return ResponseEntity.ok(collection);
    }
}