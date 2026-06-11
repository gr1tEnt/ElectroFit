package com.electricalstore.dto;

import java.math.BigDecimal;

public record OrderPlacedEvent(
        String customerEmail, String customerName, Long orderId, BigDecimal totalAmount) {}
