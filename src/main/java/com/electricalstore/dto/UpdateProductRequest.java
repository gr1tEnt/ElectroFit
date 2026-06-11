package com.electricalstore.dto;

import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.ProductType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record UpdateProductRequest(
        @NotBlank String sku,
        @NotBlank String name,
        String description,
        @NotNull BigDecimal price,
        @NotNull ProductType type,
        boolean lowVoltage,
        String imageUrl,
        List<String> imageUrls,
        @NotBlank String brandName,
        @NotBlank String seriesName,
        @NotBlank String categoryName,
        @NotNull IpRating ipRating,
        @NotNull Integer maxAmps,
        boolean hasChildProtection,
        boolean hasGrounding,
        Integer framePostsCount,
        @NotEmpty List<String> compatibleRoomTypes,
        Map<String, String> detailedAttributes) {}
