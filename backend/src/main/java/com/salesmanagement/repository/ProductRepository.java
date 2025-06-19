package com.salesmanagement.repository;

import com.salesmanagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Buscar produtos ativos
    List<Product> findByActiveTrue();

    // Buscar produtos em estoque
    @Query("SELECT p FROM Product p WHERE p.stock > 0 AND p.active = true")
    List<Product> findInStock();

    // Buscar por nome
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
}