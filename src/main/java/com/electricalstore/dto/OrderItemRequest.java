package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record OrderItemRequest(
        @NotNull Long productId,
        @NotBlank @Size(max = InputLimits.SKU) String sku,
        @NotBlank @Size(max = InputLimits.ORDER_LINE_NAME) String name,
        @Min(1) @jakarta.validation.constraints.Max(99) int quantity,
        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal unitPrice) {}
