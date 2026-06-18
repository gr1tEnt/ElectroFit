package com.electricalstore.service;

import com.electricalstore.dto.ProductResponse;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.repository.ReviewRepository;
import com.electricalstore.repository.TechnicalSpecRepository;
import com.electricalstore.repository.projection.ProductReviewAggregate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ProductResponseMapper {

    private final TechnicalSpecRepository technicalSpecRepository;
    private final ReviewRepository reviewRepository;

    public ProductResponseMapper(
            TechnicalSpecRepository technicalSpecRepository, ReviewRepository reviewRepository) {
        this.technicalSpecRepository = technicalSpecRepository;
        this.reviewRepository = reviewRepository;
    }

    public ProductResponse toResponse(Product product) {
        TechnicalSpec spec =
                technicalSpecRepository.findByProductId(product.getId()).orElse(null);
        ReviewStats stats = loadReviewStats(List.of(product.getId())).getOrDefault(product.getId(), ReviewStats.EMPTY);
        return ProductResponse.from(product, spec, stats.reviewCount(), stats.averageRating());
    }

    public List<ProductResponse> toResponses(List<Product> products) {
        Map<Long, TechnicalSpec> specsByProductId = technicalSpecRepository.findAll().stream()
                .collect(Collectors.toMap(spec -> spec.getProduct().getId(), Function.identity(), (a, b) -> a));

        Map<Long, ReviewStats> reviewStatsByProductId = loadReviewStats(
                products.stream().map(Product::getId).toList());

        return products.stream()
                .map(product -> {
                    ReviewStats stats =
                            reviewStatsByProductId.getOrDefault(product.getId(), ReviewStats.EMPTY);
                    return ProductResponse.from(
                            product,
                            specsByProductId.get(product.getId()),
                            stats.reviewCount(),
                            stats.averageRating());
                })
                .toList();
    }

    private Map<Long, ReviewStats> loadReviewStats(List<Long> productIds) {
        if (productIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return reviewRepository.findAggregatesByProductIds(productIds).stream()
                .collect(Collectors.toMap(
                        ProductReviewAggregate::getProductId,
                        aggregate -> new ReviewStats(
                                aggregate.getReviewCount() != null ? aggregate.getReviewCount() : 0L,
                                aggregate.getAverageRating() != null ? aggregate.getAverageRating() : 0.0),
                        (a, b) -> a));
    }

    private record ReviewStats(long reviewCount, double averageRating) {
        private static final ReviewStats EMPTY = new ReviewStats(0L, 0.0);
    }
}
