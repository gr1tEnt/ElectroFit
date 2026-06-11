package com.electricalstore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderItemRequest(
        @NotNull Long productId,
        @NotBlank String sku,
        @NotBlank String name,
        @Min(1) int quantity,
        @NotNull BigDecimal unitPrice) {}
