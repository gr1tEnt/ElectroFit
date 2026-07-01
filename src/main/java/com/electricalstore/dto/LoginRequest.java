package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Email @Size(max = InputLimits.EMAIL) String email,
        @NotBlank @Size(min = 1, max = InputLimits.PASSWORD) String password) {}
