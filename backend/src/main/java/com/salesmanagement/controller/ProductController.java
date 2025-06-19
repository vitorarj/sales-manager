package com.salesmanagement.controller;

import com.salesmanagement.entity.Product;
import com.salesmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/in-stock")
    public List<Product> getProductsInStock() {
        return productRepository.findInStock();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setStock(productDetails.getStock());
            product.setActive(productDetails.getActive());
            return ResponseEntity.ok(productRepository.save(product));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product p = product.get();
            p.setActive(false);  // Soft delete
            productRepository.save(p);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Endpoints para criar produtos de teste
    @GetMapping("/create-sample-laptop")  // Mudou de POST para GET
    public Product createSampleLaptop() {
        Product laptop = new Product("Notebook Dell Inspiron", "Notebook Dell i7 16GB RAM 512GB SSD",
                new BigDecimal("2899.99"), 10);
        return productRepository.save(laptop);
    }

    @GetMapping("/create-sample-mouse")  // Mudou de POST para GET
    public Product createSampleMouse() {
        Product mouse = new Product("Mouse Gamer RGB", "Mouse gamer com LED RGB e 7 botões",
                new BigDecimal("89.90"), 25);
        return productRepository.save(mouse);
    }

    @GetMapping("/create-sample-keyboard")  // Mudou de POST para GET
    public Product createSampleKeyboard() {
        Product keyboard = new Product("Teclado Mecânico", "Teclado mecânico switch azul RGB",
                new BigDecimal("299.99"), 15);
        return productRepository.save(keyboard);
    }

    // Criar produtos de demonstração
    @GetMapping("/create-demo-products")
    public String createDemoProducts() {
        // Produtos já existentes (não duplicar)
        if (productRepository.count() > 3) {
            return "⚠️ Produtos de demonstração já existem!";
        }

        // Mais produtos para demonstração
        productRepository.save(new Product("Monitor 4K", "Monitor 4K 27 polegadas IPS", new BigDecimal("899.99"), 8));
        productRepository.save(new Product("SSD 1TB", "SSD NVMe 1TB alta velocidade", new BigDecimal("299.99"), 20));
        productRepository.save(new Product("Webcam HD", "Webcam Full HD com microfone", new BigDecimal("199.99"), 12));
        productRepository.save(new Product("Headset Gamer", "Headset gamer 7.1 surround", new BigDecimal("249.99"), 15));
        productRepository.save(new Product("Mousepad RGB", "Mousepad gamer grande com RGB", new BigDecimal("79.99"), 30));
        productRepository.save(new Product("Cabo HDMI", "Cabo HDMI 2.1 4K 60Hz", new BigDecimal("29.99"), 2)); // Estoque baixo
        productRepository.save(new Product("Hub USB", "Hub USB 3.0 com 4 portas", new BigDecimal("59.99"), 0)); // Sem estoque

        return "✅ Produtos de demonstração criados com sucesso!";
    }

    @GetMapping("/count")
    public String getProductCount() {
        long total = productRepository.count();
        long active = productRepository.findByActiveTrue().size();
        long inStock = productRepository.findInStock().size();
        return String.format("Total: %d | Ativos: %d | Em estoque: %d", total, active, inStock);
    }
}