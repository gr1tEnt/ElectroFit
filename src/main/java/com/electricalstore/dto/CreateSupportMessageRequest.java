package com.electricalstore.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateSupportMessageRequest(
        @NotBlank String fullName,
        @NotBlank @Email String email,
        @NotBlank String inquiryType,
        @NotBlank String message) {}
