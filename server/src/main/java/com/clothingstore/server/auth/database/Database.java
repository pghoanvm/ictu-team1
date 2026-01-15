package com.clothingstore.server.auth.database;


import com.clothingstore.server.auth.model.Role;
import com.clothingstore.server.auth.model.User;
import com.clothingstore.server.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class Database {
    @Bean
    CommandLineRunner init(UserRepository userRepo, PasswordEncoder encoder) {
        return args -> {
            // kiểm tra theo email không phân biệt hoa/thường
            userRepo.findByEmailIgnoreCase("lvhmod@gmail.com")
                    .ifPresentOrElse(
                            user -> {
                                System.out.println("Admin mặc định đã tồn tại: " + user.getEmail());
                            },
                            () -> {
                                User admin = new User();
                                admin.setUsername("lvh");
                                admin.setEmail("lvhmod@gmail.com");
                                admin.setPassword(encoder.encode("a"));
                                admin.setRole(Role.ADMIN);
                                userRepo.save(admin);
                            }
                    );
        };
    }
}
