package com.clothingstore.server.repository;

import com.clothingstore.server.entity.AboutUs;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AboutUsRepository extends MongoRepository<AboutUs, String> {
}