package com.electricalstore.service;

import com.electricalstore.dto.OrderHistoryItemResponse;
import com.electricalstore.dto.OrderHistoryLineResponse;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderItem;
import com.electricalstore.entity.User;
import com.electricalstore.repository.OrderItemRepository;
import com.electricalstore.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public ProfileService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryItemResponse> getOrderHistory(User user) {
        List<Order> orders = orderRepository.findAllForUser(user.getId(), user.getEmail());
        if (orders.isEmpty()) {
            return List.of();
        }

        List<Long> orderIds = orders.stream().map(Order::getId).toList();
        Map<Long, List<OrderItem>> itemsByOrderId = orderItemRepository.findAllByOrderIds(orderIds).stream()
                .collect(Collectors.groupingBy(item -> item.getOrder().getId()));

        return orders.stream()
                .map(order -> toHistoryItem(order, itemsByOrderId.getOrDefault(order.getId(), List.of())))
                .toList();
    }

    private OrderHistoryItemResponse toHistoryItem(Order order, List<OrderItem> items) {
        List<OrderHistoryLineResponse> lines = items.stream().map(this::toLine).toList();
        return new OrderHistoryItemResponse(
                "ORD-" + order.getId(),
                buildSummary(items),
                order.getTotalAmount(),
                "EUR",
                order.getCreatedAt().atZone(ZoneOffset.UTC).toInstant(),
                lines);
    }

    private OrderHistoryLineResponse toLine(OrderItem item) {
        BigDecimal lineTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new OrderHistoryLineResponse(
                item.getProductId(),
                item.getName(),
                item.getSku(),
                item.getQuantity(),
                item.getUnitPrice(),
                lineTotal);
    }

    private String buildSummary(List<OrderItem> items) {
        if (items.isEmpty()) {
            return "Order items";
        }
        return items.stream()
                .map(item -> item.getQuantity() + "x " + item.getName())
                .collect(Collectors.joining(", "));
    }
}
