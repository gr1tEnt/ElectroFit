package com.electricalstore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportReplyRequest(
        @NotBlank(message = "replyMessage is required")
                @Size(min = 3, max = 5000, message = "replyMessage must be between 3 and 5000 characters")
                String replyMessage) {}
