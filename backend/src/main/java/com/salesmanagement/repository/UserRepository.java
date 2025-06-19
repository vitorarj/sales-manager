package com.salesmanagement.repository;

import com.salesmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA cria automaticamente os métodos básicos

    // Buscar usuário por email (para login)
    Optional<User> findByEmail(String email);

    // Verificar se email já existe
    boolean existsByEmail(String email);
}


