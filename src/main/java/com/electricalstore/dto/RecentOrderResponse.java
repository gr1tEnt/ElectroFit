package com.electricalstore.dto;

import com.electricalstore.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecentOrderResponse(
        Long id,
        String customerName,
        String customerEmail,
        BigDecimal totalAmount,
        OrderStatus status,
        LocalDateTime createdAt) {}
