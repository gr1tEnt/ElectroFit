package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank @Size(max = InputLimits.PERSON_NAME) String customerName,
        @NotBlank @Email @Size(max = InputLimits.EMAIL) String email,
        @NotEmpty @Size(max = 50) List<@jakarta.validation.Valid OrderItemRequest> items) {}
