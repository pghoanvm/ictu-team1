package com.clothingstore.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "products") // Đánh dấu đây là Document của MongoDB
@Data // Lombok tự sinh code getter/setter
public class Product {
    @Id
    private String id; // ID trong Mongo luôn là String

    private String name;
    private Double price;
    private String description;
    private String imageUrl;
}