package com.clothingstore.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "about_us")
public class AboutUs {
    @Id
    private String id;
    private String title;
    private String content; // Nội dung giới thiệu
    private String mission; // Sứ mệnh
    private String vision; // Tầm nhìn
    private String contactEmail;
}