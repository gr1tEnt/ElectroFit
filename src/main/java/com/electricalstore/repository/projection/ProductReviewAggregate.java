package com.electricalstore.repository.projection;

public interface ProductReviewAggregate {

    Long getProductId();

    Long getReviewCount();

    Double getAverageRating();
}
