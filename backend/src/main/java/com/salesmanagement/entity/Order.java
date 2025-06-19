package com.salesmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @NotNull
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "notes", length = 500)
    private String notes;

    // Constructors
    public Order() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.PENDENTE;
        this.totalAmount = BigDecimal.ZERO;
    }

    public Order(User customer) {
        this();
        this.customer = customer;
    }

    // Business Methods
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        calculateTotal();
    }

    public void calculateTotal() {
        this.totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.updatedAt = LocalDateTime.now();
    }

    public void approve(User seller) {
        if (this.status != OrderStatus.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser aprovados");
        }
        this.status = OrderStatus.APROVADO;
        this.seller = seller;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject(User seller, String reason) {
        if (this.status != OrderStatus.PENDENTE) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser rejeitados");
        }
        this.status = OrderStatus.REJEITADO;
        this.seller = seller;
        this.notes = reason;
        this.updatedAt = LocalDateTime.now();
    }

    public void complete() {
        if (this.status != OrderStatus.APROVADO) {
            throw new IllegalStateException("Apenas pedidos aprovados podem ser finalizados");
        }
        this.status = OrderStatus.FINALIZADO;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    @Override
    public String toString() {
        return "Order{id=" + id + ", customer=" + (customer != null ? customer.getName() : null) +
                ", status=" + status + ", totalAmount=" + totalAmount + "}";
    }
}