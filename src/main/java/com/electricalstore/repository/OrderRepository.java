package com.electricalstore.repository;

import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(
            """
            SELECT o FROM Order o
            WHERE o.user.id = :userId
               OR (o.user IS NULL AND LOWER(o.customerEmail) = LOWER(:email))
            ORDER BY o.createdAt DESC
            """)
    List<Order> findAllForUser(@Param("userId") Long userId, @Param("email") String email);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    @Query(
            """
            SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END
            FROM Order o
            JOIN o.items i
            WHERE i.productId = :productId
              AND (o.user.id = :userId OR LOWER(o.customerEmail) = LOWER(:email))
            """)
    boolean existsPurchasedProduct(
            @Param("userId") Long userId, @Param("email") String email, @Param("productId") Long productId);

    @Query(
            """
            SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o
            WHERE o.status = :status
            """)
    BigDecimal sumTotalAmountByStatus(@Param("status") OrderStatus status);

    @Query(
            """
            SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o
            WHERE o.status = :status
              AND o.createdAt >= :start
              AND o.createdAt < :end
            """)
    BigDecimal sumTotalAmountByStatusAndCreatedAtBetween(
            @Param("status") OrderStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
}
