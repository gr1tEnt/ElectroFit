package com.electricalstore.dto;

import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.entity.TechnicalSpec;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Schema(description = "Product summary for API responses")
public record ProductResponse(
        @Schema(example = "1") Long id,
        @Schema(example = "SKT-001") String sku,
        @Schema(example = "Double Socket") String name,
        @Schema(example = "16A double socket outlet") String description,
        @Schema(example = "24.99") BigDecimal price,
        @Schema(example = "https://cdn.example.com/skt-001.jpg") String imageUrl,
        @Schema(example = "MECHANISM") ProductType type,
        @Schema(example = "false") boolean lowVoltage,
        @Schema(example = "Legrand") String brandName,
        @Schema(example = "Valena Life") String seriesName,
        @Schema(example = "Sockets") String categoryName,
        @Schema(example = "IP44") IpRating ipRating,
        @Schema(example = "16") Integer maxAmps,
        @Schema(example = "true") Boolean hasChildProtection,
        @Schema(example = "2") Integer framePostsCount,
        @Schema(example = "[\"BEDROOM\", \"LIVING_ROOM\"]") List<String> compatibleRoomTypes) {

    public static ProductResponse from(Product product, TechnicalSpec spec) {
        String brandName = null;
        String seriesName = null;
        if (product.getBrand() != null) {
            brandName = product.getBrand().getName();
            seriesName = product.getBrand().getSeriesName();
        }
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;

        IpRating ipRating = spec != null ? spec.getIpRating() : null;
        Integer maxAmps = spec != null ? spec.getMaxAmps() : null;
        Boolean hasChildProtection = spec != null ? spec.isHasChildProtection() : null;
        Integer framePostsCount = spec != null ? spec.getFramePostsCount() : null;
        List<String> compatibleRoomTypes =
                spec != null && spec.getCompatibleRoomTypes() != null
                        ? spec.getCompatibleRoomTypes()
                        : Collections.emptyList();

        return new ProductResponse(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getType(),
                product.isLowVoltage(),
                brandName,
                seriesName,
                categoryName,
                ipRating,
                maxAmps,
                hasChildProtection,
                framePostsCount,
                compatibleRoomTypes);
    }

    public static List<ProductResponse> fromList(List<Product> products) {
        return products.stream().map(product -> from(product, null)).toList();
    }
}
