package com.electricalstore.dto;

import com.electricalstore.validation.InputLimits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportReplyRequest(
        @NotBlank(message = "replyMessage is required")
                @Size(
                        min = 3,
                        max = InputLimits.SUPPORT_REPLY,
                        message = "replyMessage must be between 3 and 5000 characters")
                String replyMessage) {}
