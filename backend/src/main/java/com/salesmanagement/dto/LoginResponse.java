package com.salesmanagement.dto;

public class LoginResponse {

    private String token;
    private String email;
    private String role;
    private Long userId;
    private String name;
    private String message;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, String email, String role, Long userId, String name, String message) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.name = name;
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}