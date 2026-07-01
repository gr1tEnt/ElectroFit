package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email @Size(max = InputLimits.EMAIL) String email,
        @NotBlank @Size(min = 8, max = InputLimits.PASSWORD) String password,
        @NotBlank @Size(max = InputLimits.PERSON_NAME) String fullName) {}
