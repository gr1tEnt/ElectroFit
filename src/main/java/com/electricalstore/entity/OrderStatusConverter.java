package com.electricalstore.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Locale;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(OrderStatus status) {
        return status == null ? OrderStatus.PENDING.name() : status.name();
    }

    @Override
    public OrderStatus convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.isBlank()) {
            return OrderStatus.PENDING;
        }
        String normalized = dbValue.trim().toUpperCase(Locale.ROOT);
        if ("SUBMITTED".equals(normalized)) {
            return OrderStatus.PENDING;
        }
        return OrderStatus.valueOf(normalized);
    }
}
