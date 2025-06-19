package com.salesmanagement.controller;

import com.salesmanagement.entity.*;
import com.salesmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return orderRepository.findPendingOrders();
    }

    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable Long customerId) {
        Optional<User> customer = userRepository.findById(customerId);
        if (customer.isPresent()) {
            List<Order> orders = orderRepository.findByCustomer(customer.get());
            return ResponseEntity.ok(orders);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{orderId}/approve/{sellerId}")  // Mudou de POST para GET
    public ResponseEntity<Order> approveOrder(@PathVariable Long orderId, @PathVariable Long sellerId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<User> optionalSeller = userRepository.findById(sellerId);

        if (optionalOrder.isPresent() && optionalSeller.isPresent()) {
            Order order = optionalOrder.get();
            User seller = optionalSeller.get();

            if (seller.getRole() != Role.VENDEDOR && seller.getRole() != Role.ADMIN) {
                return ResponseEntity.badRequest().build();
            }

            try {
                order.approve(seller);
                return ResponseEntity.ok(orderRepository.save(order));
            } catch (IllegalStateException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{orderId}/reject/{sellerId}")  // Mudou de POST para GET
    public ResponseEntity<Order> rejectOrder(@PathVariable Long orderId, @PathVariable Long sellerId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<User> optionalSeller = userRepository.findById(sellerId);

        if (optionalOrder.isPresent() && optionalSeller.isPresent()) {
            Order order = optionalOrder.get();
            User seller = optionalSeller.get();

            if (seller.getRole() != Role.VENDEDOR && seller.getRole() != Role.ADMIN) {
                return ResponseEntity.badRequest().build();
            }

            try {
                order.reject(seller, "Rejeitado via teste");
                return ResponseEntity.ok(orderRepository.save(order));
            } catch (IllegalStateException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{orderId}/complete")  // Mudou de POST para GET
    public ResponseEntity<Order> completeOrder(@PathVariable Long orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            try {
                order.complete();
                return ResponseEntity.ok(orderRepository.save(order));
            } catch (IllegalStateException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/create-sample/{customerId}/{productId}")  // Mudou de POST para GET
    public ResponseEntity<Order> createSampleOrder(@PathVariable Long customerId, @PathVariable Long productId) {
        Optional<User> customer = userRepository.findById(customerId);
        Optional<Product> product = productRepository.findById(productId);

        if (customer.isPresent() && product.isPresent()) {
            Order order = new Order(customer.get());
            OrderItem item = new OrderItem(product.get(), 2);
            order.addItem(item);

            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/create-demo-orders")
    public String createDemoOrders() {
        List<User> customers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.CLIENTE)
                .collect(Collectors.toList());

        List<User> sellers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.VENDEDOR || user.getRole() == Role.ADMIN)
                .collect(Collectors.toList());

        List<Product> products = productRepository.findByActiveTrue();

        if (customers.isEmpty() || products.isEmpty()) {
            return "⚠️ Crie usuários e produtos primeiro!";
        }

        // Criar vários pedidos de demonstração
        for (int i = 0; i < 8; i++) {
            User customer = customers.get(i % customers.size());
            Order order = new Order(customer);

            // Adicionar 1-3 produtos aleatórios
            int numItems = 1 + (i % 3);
            for (int j = 0; j < numItems; j++) {
                Product product = products.get((i + j) % products.size());
                if (product.getStock() > 0) {
                    int quantity = 1 + (i % 3);
                    OrderItem item = new OrderItem(product, quantity);
                    order.addItem(item);
                }
            }

            Order savedOrder = orderRepository.save(order);

            // Simular aprovação/finalização de alguns pedidos
            if (i % 3 == 0 && !sellers.isEmpty()) {
                // Aprovar
                User seller = sellers.get(i % sellers.size());
                savedOrder.approve(seller);
                orderRepository.save(savedOrder);

                // Finalizar alguns
                if (i % 6 == 0) {
                    savedOrder.complete();
                    orderRepository.save(savedOrder);
                }
            } else if (i % 7 == 0 && !sellers.isEmpty()) {
                // Rejeitar alguns
                User seller = sellers.get(i % sellers.size());
                savedOrder.reject(seller, "Produto indisponível");
                orderRepository.save(savedOrder);
            }
        }

        return "✅ Pedidos de demonstração criados com sucesso!";
    }

    @GetMapping("/count")
    public String getOrderCount() {
        long total = orderRepository.count();
        long pending = orderRepository.findByStatus(OrderStatus.PENDENTE).size();
        long approved = orderRepository.findByStatus(OrderStatus.APROVADO).size();
        long completed = orderRepository.findByStatus(OrderStatus.FINALIZADO).size();

        return String.format("Total: %d | Pendentes: %d | Aprovados: %d | Finalizados: %d",
                total, pending, approved, completed);
    }
}