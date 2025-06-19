package com.salesmanagement.repository;

import com.salesmanagement.entity.Order;
import com.salesmanagement.entity.OrderStatus;
import com.salesmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Buscar pedidos por cliente
    List<Order> findByCustomer(User customer);

    // Buscar pedidos por status
    List<Order> findByStatus(OrderStatus status);

    // Buscar pedidos pendentes
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDENTE' ORDER BY o.createdAt ASC")
    List<Order> findPendingOrders();

    // Buscar pedidos por cliente e status
    List<Order> findByCustomerAndStatus(User customer, OrderStatus status);
}