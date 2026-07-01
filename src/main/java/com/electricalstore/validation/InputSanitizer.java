package com.electricalstore.validation;

import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.util.StringUtils;

public final class InputSanitizer {

    private static final Pattern CONTROL_CHARS = Pattern.compile("\\p{Cntrl}");

    private InputSanitizer() {}

    /** Trims, strips control characters, collapses whitespace, and enforces max length. */
    public static String text(String value, int maxLength) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        String normalized = CONTROL_CHARS.matcher(value).replaceAll("");
        normalized = normalized.trim().replaceAll("\\s{2,}", " ");
        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException(
                    "Значення перевищує максимальну довжину " + maxLength + " символів");
        }
        return normalized;
    }

    public static String requiredText(String value, int maxLength, String fieldLabel) {
        String sanitized = text(value, maxLength);
        if (!StringUtils.hasText(sanitized)) {
            throw new IllegalArgumentException(fieldLabel + " є обов'язковим");
        }
        return sanitized;
    }

    public static String email(String value) {
        return requiredText(value, InputLimits.EMAIL, "Email").toLowerCase(Locale.ROOT);
    }

    /** Returns null when blank after sanitization (for optional catalog filters). */
    public static String optionalFilter(String value, int maxLength) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String sanitized = text(value, maxLength);
        return StringUtils.hasText(sanitized) ? sanitized : null;
    }
}
