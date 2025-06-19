package com.salesmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "🚀 Sales Management System - Backend funcionando!";
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("message", "Sistema de vendas operacional");
        status.put("version", "1.0.0");
        return status;
    }

    @GetMapping("/test")
    public String test() {
        return "✅ API funcionando - Ready para desenvolvimento!";
    }

    @GetMapping("/setup-demo")
    public Map<String, Object> setupDemo() {
        Map<String, Object> result = new HashMap<>();

        try {
            result.put("step1", "📊 Setup de demonstração iniciado...");
            result.put("step2", "👥 Crie usuários via: /api/users/create-demo-users");
            result.put("step3", "📦 Crie produtos via: /api/products/create-demo-products");
            result.put("step4", "🛒 Crie pedidos via: /api/orders/create-demo-orders");
            result.put("step5", "📈 Acesse relatórios via: /api/reports/dashboard");
            result.put("instructions", "Execute os endpoints na ordem indicada para popular o sistema");
            result.put("dashboardUrl", "/api/reports/dashboard");
            result.put("status", "✅ Instruções de setup geradas");

        } catch (Exception e) {
            result.put("error", "❌ Erro no setup: " + e.getMessage());
        }

        return result;
    }
}