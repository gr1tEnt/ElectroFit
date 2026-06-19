package com.electricalstore.dto;

import com.electricalstore.entity.SupportMessage;
import com.electricalstore.entity.SupportTicketStatus;
import java.time.LocalDateTime;

public record SupportMessageResponse(
        Long id,
        String fullName,
        String email,
        String inquiryType,
        String message,
        SupportTicketStatus status,
        LocalDateTime createdAt) {

    public static SupportMessageResponse from(SupportMessage message) {
        return new SupportMessageResponse(
                message.getId(),
                message.getFullName(),
                message.getEmail(),
                message.getInquiryType(),
                message.getMessage(),
                message.getStatus(),
                message.getCreatedAt());
    }
}
