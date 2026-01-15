package com.clothingstore.server.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String identifier; // email hoặc username
    private String password;
}
