package com.electricalstore.dto;

import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
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
        @Schema(example = "Sockets") String categoryName) {

    public static ProductResponse from(Product product) {
        String brandName = null;
        String seriesName = null;
        if (product.getBrand() != null) {
            brandName = product.getBrand().getName();
            seriesName = product.getBrand().getSeriesName();
        }
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;

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
                categoryName);
    }

    public static List<ProductResponse> fromList(List<Product> products) {
        return products.stream().map(ProductResponse::from).toList();
    }
}
