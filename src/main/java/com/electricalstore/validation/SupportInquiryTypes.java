package com.electricalstore.validation;

import java.util.Set;
import org.springframework.util.StringUtils;

public final class SupportInquiryTypes {

    private static final Set<String> ALLOWED = Set.of(
            "Технічна консультація з безпеки",
            "Проблема сумісності товарів",
            "Підтримка замовлення",
            "Інше");

    private SupportInquiryTypes() {}

    public static String requireAllowed(String raw) {
        if (!StringUtils.hasText(raw)) {
            throw new IllegalArgumentException("Тип звернення є обов'язковим");
        }
        String trimmed = raw.trim();
        if (!ALLOWED.contains(trimmed)) {
            throw new IllegalArgumentException("Недопустимий тип звернення");
        }
        return trimmed;
    }
}
