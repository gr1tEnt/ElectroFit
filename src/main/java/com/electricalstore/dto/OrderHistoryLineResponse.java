package com.electricalstore.dto;

import java.math.BigDecimal;

public record OrderHistoryLineResponse(
        Long productId, String name, String sku, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
