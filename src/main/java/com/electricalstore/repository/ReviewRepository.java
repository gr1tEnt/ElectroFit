package com.electricalstore.repository;

import com.electricalstore.entity.Review;
import com.electricalstore.repository.projection.ProductReviewAggregate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    @Query(
            """
            SELECT r.productId AS productId,
                   COUNT(r) AS reviewCount,
                   AVG(r.rating) AS averageRating
            FROM Review r
            WHERE r.productId IN :productIds
            GROUP BY r.productId
            """)
    List<ProductReviewAggregate> findAggregatesByProductIds(
            @Param("productIds") Collection<Long> productIds);
}
