package com.clothingstore.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
// Thêm dòng này để ép nó tìm Repository đúng chỗ (phòng trường hợp lỗi package)
@EnableMongoRepositories(basePackages = "com.clothingstore.server.repository")
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}