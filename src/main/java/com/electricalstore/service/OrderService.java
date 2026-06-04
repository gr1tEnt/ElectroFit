package com.electricalstore.service;

import com.electricalstore.dto.CreateOrderRequest;
import com.electricalstore.dto.OrderConfirmationResponse;
import com.electricalstore.dto.OrderItemRequest;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderItem;
import com.electricalstore.entity.User;
import com.electricalstore.repository.OrderRepository;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderConfirmationResponse submitOrder(CreateOrderRequest request, User authenticatedUser) {
        BigDecimal total = request.items().stream()
                .map(item -> item.unitPrice().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String email = request.email().trim();
        if (authenticatedUser != null) {
            email = authenticatedUser.getEmail();
        }

        Order order = Order.builder()
                .customerName(request.customerName().trim())
                .email(email)
                .user(authenticatedUser)
                .total(total)
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

        return new OrderConfirmationResponse(
                "ORD-" + saved.getId(),
                "Thank you, " + saved.getCustomerName() + "! Your order has been received.",
                saved.getTotal());
    }
}
