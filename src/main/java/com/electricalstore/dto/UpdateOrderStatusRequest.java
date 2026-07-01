package com.electricalstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateOrderStatusRequest(
        @NotBlank
        @Pattern(regexp = "PENDING|COMPLETED|SHIPPED", message = "Status must be one of: PENDING, COMPLETED, SHIPPED")
        String status) {}
