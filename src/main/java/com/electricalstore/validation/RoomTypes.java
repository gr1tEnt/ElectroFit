package com.electricalstore.validation;

import java.util.Set;
import org.springframework.util.StringUtils;

public final class RoomTypes {

    private static final Set<String> ALLOWED = Set.of(
            "BEDROOM",
            "LIVING_ROOM",
            "KIDS_ROOM",
            "BATHROOM",
            "KITCHEN",
            "OUTDOOR",
            "GARAGE");

    private RoomTypes() {}

    public static String requireAllowed(String raw) {
        if (!StringUtils.hasText(raw)) {
            throw new IllegalArgumentException("Тип кімнати є обов'язковим");
        }
        String normalized = raw.trim().toUpperCase();
        if (!ALLOWED.contains(normalized)) {
            throw new IllegalArgumentException("Невідомий тип кімнати: " + raw.trim());
        }
        return normalized;
    }
}
