package com.salesmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica apenas aos endpoints da API
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "https://localhost:*",
                        "https://meudominio.com",
                        "https://*.meudominio.com",
                        "https://sales-management-frontend.onrender.com",
                        "https://*.onrender.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders(
                        "Origin",
                        "Content-Type",
                        "Accept",
                        "Authorization",
                        "X-Requested-With"
                )
                .exposedHeaders("Authorization") // Headers que o cliente pode acessar
                .allowCredentials(true) // Permite cookies e headers de autenticação
                .maxAge(3600);
    }
}
