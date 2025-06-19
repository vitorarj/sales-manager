package com.salesmanagement.controller;

import com.salesmanagement.entity.*;
import com.salesmanagement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // Dashboard principal
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        // Métricas básicas
        dashboard.put("totalUsers", userRepository.count());
        dashboard.put("totalProducts", productRepository.count());
        dashboard.put("totalOrders", orderRepository.count());

        // Vendas por status
        Map<String, Long> ordersByStatus = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.toString(), (long) orderRepository.findByStatus(status).size());
        }
        dashboard.put("ordersByStatus", ordersByStatus);

        // Vendas totais
        BigDecimal totalSales = orderRepository.findByStatus(OrderStatus.FINALIZADO)
                .stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalSales", totalSales);

        // Vendas pendentes (valor)
        BigDecimal pendingSales = orderRepository.findByStatus(OrderStatus.PENDENTE)
                .stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("pendingSales", pendingSales);

        // Produtos com estoque baixo (menos de 5)
        long lowStockProducts = productRepository.findByActiveTrue()
                .stream()
                .filter(p -> p.getStock() < 5)
                .count();
        dashboard.put("lowStockProducts", lowStockProducts);

        // Última atualização
        dashboard.put("lastUpdated", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

        return dashboard;
    }

    // Resumo das vendas
    @GetMapping("/sales-summary")
    public Map<String, Object> getSalesSummary() {
        Map<String, Object> summary = new HashMap<>();

        List<Order> allOrders = orderRepository.findAll();
        List<Order> completedOrders = orderRepository.findByStatus(OrderStatus.FINALIZADO);
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDENTE);

        summary.put("totalOrders", allOrders.size());
        summary.put("completedOrders", completedOrders.size());
        summary.put("pendingOrders", pendingOrders.size());

        // Valor total faturado
        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.put("totalRevenue", totalRevenue);

        // Ticket médio
        BigDecimal averageTicket = completedOrders.isEmpty() ?
                BigDecimal.ZERO :
                totalRevenue.divide(BigDecimal.valueOf(completedOrders.size()), 2, BigDecimal.ROUND_HALF_UP);
        summary.put("averageTicket", averageTicket);

        // Total de itens vendidos
        int totalItemsSold = completedOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .mapToInt(OrderItem::getQuantity)
                .sum();
        summary.put("totalItemsSold", totalItemsSold);

        return summary;
    }

    // Clientes mais ativos
    @GetMapping("/top-customers")
    public List<Map<String, Object>> getTopCustomers() {
        List<Order> orders = orderRepository.findAll();

        Map<User, List<Order>> ordersByCustomer = orders.stream()
                .collect(Collectors.groupingBy(Order::getCustomer));

        return ordersByCustomer.entrySet().stream()
                .map(entry -> {
                    User customer = entry.getKey();
                    List<Order> customerOrders = entry.getValue();

                    Map<String, Object> customerData = new HashMap<>();
                    customerData.put("customerId", customer.getId());
                    customerData.put("customerName", customer.getName());
                    customerData.put("customerEmail", customer.getEmail());
                    customerData.put("totalOrders", customerOrders.size());

                    BigDecimal totalSpent = customerOrders.stream()
                            .filter(o -> o.getStatus() == OrderStatus.FINALIZADO)
                            .map(Order::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    customerData.put("totalSpent", totalSpent);

                    return customerData;
                })
                .sorted((a, b) -> ((Integer) b.get("totalOrders")).compareTo((Integer) a.get("totalOrders")))
                .limit(10)
                .collect(Collectors.toList());
    }

    // Produtos mais vendidos
    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        List<Order> completedOrders = orderRepository.findByStatus(OrderStatus.FINALIZADO);

        Map<Product, Integer> productSales = new HashMap<>();
        Map<Product, BigDecimal> productRevenue = new HashMap<>();

        for (Order order : completedOrders) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                productSales.put(product, productSales.getOrDefault(product, 0) + item.getQuantity());
                productRevenue.put(product, productRevenue.getOrDefault(product, BigDecimal.ZERO).add(item.getSubtotal()));
            }
        }

        return productSales.entrySet().stream()
                .map(entry -> {
                    Product product = entry.getKey();
                    Integer quantitySold = entry.getValue();
                    BigDecimal revenue = productRevenue.get(product);

                    Map<String, Object> productData = new HashMap<>();
                    productData.put("productId", product.getId());
                    productData.put("productName", product.getName());
                    productData.put("quantitySold", quantitySold);
                    productData.put("revenue", revenue);
                    productData.put("currentStock", product.getStock());
                    productData.put("unitPrice", product.getPrice());

                    return productData;
                })
                .sorted((a, b) -> ((Integer) b.get("quantitySold")).compareTo((Integer) a.get("quantitySold")))
                .limit(10)
                .collect(Collectors.toList());
    }

    // Produtos com estoque baixo
    @GetMapping("/low-stock")
    public List<Map<String, Object>> getLowStockProducts() {
        return productRepository.findByActiveTrue().stream()
                .filter(product -> product.getStock() < 5)
                .map(product -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("id", product.getId());
                    productData.put("name", product.getName());
                    productData.put("currentStock", product.getStock());
                    productData.put("price", product.getPrice());
                    productData.put("status", product.getStock() == 0 ? "SEM_ESTOQUE" : "ESTOQUE_BAIXO");
                    return productData;
                })
                .sorted((a, b) -> ((Integer) a.get("currentStock")).compareTo((Integer) b.get("currentStock")))
                .collect(Collectors.toList());
    }

    // Vendas por período (últimos 7 dias simulado)
    @GetMapping("/sales-trend")
    public List<Map<String, Object>> getSalesTrend() {
        List<Order> completedOrders = orderRepository.findByStatus(OrderStatus.FINALIZADO);

        // Simular vendas dos últimos 7 dias
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ofPattern("dd/MM"));

            // Simular algumas vendas por dia
            long ordersCount = Math.round(Math.random() * completedOrders.size() / 7);
            BigDecimal dailySales = BigDecimal.valueOf(Math.random() * 5000);

            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dateStr);
            dayData.put("orders", ordersCount);
            dayData.put("sales", dailySales);

            trend.add(dayData);
        }

        return trend;
    }

    // Status geral do sistema
    @GetMapping("/system-status")
    public Map<String, Object> getSystemStatus() {
        Map<String, Object> status = new HashMap<>();

        // Contadores por role
        Map<String, Long> usersByRole = new HashMap<>();
        for (Role role : Role.values()) {
            long count = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == role)
                    .count();
            usersByRole.put(role.toString(), count);
        }
        status.put("usersByRole", usersByRole);

        // Produtos por status
        long activeProducts = productRepository.findByActiveTrue().size();
        long totalProducts = productRepository.count();
        status.put("activeProducts", activeProducts);
        status.put("inactiveProducts", totalProducts - activeProducts);

        // Pedidos que precisam de atenção
        long pendingOrders = orderRepository.findByStatus(OrderStatus.PENDENTE).size();
        long approvedOrders = orderRepository.findByStatus(OrderStatus.APROVADO).size();
        status.put("ordersNeedingAttention", pendingOrders + approvedOrders);

        // Health check
        status.put("systemHealth", "OK");
        status.put("lastCheck", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

        return status;
    }
}