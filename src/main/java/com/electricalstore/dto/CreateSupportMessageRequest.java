package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import com.electricalstore.validation.annotation.AllowedInquiryType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSupportMessageRequest(
        @NotBlank @Size(max = InputLimits.PERSON_NAME) String fullName,
        @NotBlank @Email @Size(max = InputLimits.EMAIL) String email,
        @NotBlank @AllowedInquiryType @Size(max = InputLimits.INQUIRY_TYPE) String inquiryType,
        @NotBlank @Size(min = 3, max = InputLimits.SUPPORT_MESSAGE) String message) {}
