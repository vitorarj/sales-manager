package com.salesmanagement.controller;

import com.salesmanagement.dto.LoginRequest;
import com.salesmanagement.dto.LoginResponse;
import com.salesmanagement.entity.User;
import com.salesmanagement.repository.UserRepository;
import com.salesmanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Buscar usuário por email
            Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Usuário não encontrado"));
            }

            User user = optionalUser.get();

            // Verificar senha (simplificado para demonstração)
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.badRequest().body(createErrorResponse("Senha incorreta"));
            }

            // Gerar token JWT
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString(), user.getId());

            // Criar resposta de sucesso
            LoginResponse response = new LoginResponse(
                    token,
                    user.getEmail(),
                    user.getRole().toString(),
                    user.getId(),
                    user.getName(),
                    "Login realizado com sucesso!"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Erro interno: " + e.getMessage()));
        }
    }

    // Login simplificado via GET para testes
    @GetMapping("/login-test/{email}")
    public ResponseEntity<?> loginTest(@PathVariable String email) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Usuário não encontrado"));
            }

            User user = optionalUser.get();
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString(), user.getId());

            LoginResponse response = new LoginResponse(
                    token,
                    user.getEmail(),
                    user.getRole().toString(),
                    user.getId(),
                    user.getName(),
                    "Login de teste realizado com sucesso!"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Erro interno: " + e.getMessage()));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");

            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Token não fornecido"));
            }

            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            Long userId = jwtUtil.extractUserId(token);

            if (jwtUtil.isTokenExpired(token)) {
                return ResponseEntity.badRequest().body(createErrorResponse("Token expirado"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("email", email);
            response.put("role", role);
            response.put("userId", userId);
            response.put("message", "Token válido");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse("Token inválido: " + e.getMessage()));
        }
    }

    @GetMapping("/users-for-login")
    public ResponseEntity<?> getUsersForLogin() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuários disponíveis para login de teste:");
        response.put("admin", "admin@sistema.com (senha: 123456)");
        response.put("client", "cliente@teste.com (senha: 123456)");
        response.put("seller", "vendedor@teste.com (senha: 123456)");
        response.put("client2", "maria@email.com (senha: 123456)");

        response.put("loginTestExamples", Map.of(
                "admin", "/api/auth/login-test/admin@sistema.com",
                "client", "/api/auth/login-test/cliente@teste.com",
                "seller", "/api/auth/login-test/vendedor@teste.com"
        ));

        return ResponseEntity.ok(response);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("success", "false");
        return error;
    }
}