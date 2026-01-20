package com.clothingstore.server.controller;

import com.clothingstore.server.entity.AboutUs;
import com.clothingstore.server.repository.AboutUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/about")
@CrossOrigin(origins = "*")
public class AboutUsController {

    @Autowired
    private AboutUsRepository aboutUsRepository;

    @GetMapping
    public ResponseEntity<?> getAboutUs() {
        List<AboutUs> list = aboutUsRepository.findAll();
        if (list.isEmpty()) {
            return ResponseEntity.ok(new AboutUs()); // Trả về đối tượng trống nếu chưa có dữ liệu
        }
        return ResponseEntity.ok(list.get(0)); // Thường chỉ có 1 bài giới thiệu
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateAboutUs(@RequestBody AboutUs aboutUs) {
        // Xóa dữ liệu cũ để luôn chỉ giữ 1 bản ghi duy nhất
        aboutUsRepository.deleteAll();
        aboutUsRepository.save(aboutUs);
        return ResponseEntity.ok("Cập nhật thông tin giới thiệu thành công!");
    }
}