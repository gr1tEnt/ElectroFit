package com.electricalstore.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderHistoryItemResponse(
        String orderNumber,
        String summary,
        BigDecimal total,
        String currency,
        Instant placedAt,
        List<OrderHistoryLineResponse> items) {}
