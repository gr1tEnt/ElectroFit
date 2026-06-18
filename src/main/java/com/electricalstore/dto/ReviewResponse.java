package com.electricalstore.dto;

import com.electricalstore.entity.Review;
import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long productId,
        String authorName,
        Integer rating,
        String comment,
        boolean verifiedBuyer,
        LocalDateTime createdAt) {

    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProductId(),
                review.getAuthorName(),
                review.getRating(),
                review.getComment(),
                review.isVerifiedBuyer(),
                review.getCreatedAt());
    }
}
