package com.electricalstore.service;

import com.electricalstore.dto.OrderPlacedEvent;
import com.electricalstore.dto.CreateOrderRequest;
import com.electricalstore.dto.OrderConfirmationResponse;
import com.electricalstore.dto.OrderItemRequest;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderItem;
import com.electricalstore.entity.User;
import com.electricalstore.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.electricalstore.entity.OrderStatus;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    public OrderService(OrderRepository orderRepository, ApplicationEventPublisher eventPublisher) {
        this.orderRepository = orderRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public OrderConfirmationResponse submitOrder(CreateOrderRequest request, User authenticatedUser) {
        BigDecimal total = request.items().stream()
                .map(item -> item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String email = request.email().trim();

        Order order = Order.builder()
                .customerName(request.customerName().trim())
                .customerEmail(email)
                .user(authenticatedUser)
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        for (OrderItemRequest itemRequest : request.items()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(itemRequest.productId())
                    .sku(itemRequest.sku())
                    .name(itemRequest.name())
                    .quantity(itemRequest.quantity())
                    .unitPrice(itemRequest.unitPrice())
                    .build();
            order.getItems().add(item);
        }

        Order saved = orderRepository.save(order);

        eventPublisher.publishEvent(new OrderPlacedEvent(
                saved.getCustomerEmail(),
                saved.getCustomerName(),
                saved.getId(),
                saved.getTotalAmount()));

        return new OrderConfirmationResponse(
                "ORD-" + saved.getId(),
                "Thank you, " + saved.getCustomerName() + "! Your order has been received.",
                saved.getTotalAmount());
    }

    @Transactional
    public Order updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Order not found: " + orderId));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
