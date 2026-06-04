package com.electricalstore.repository;

import com.electricalstore.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(
            """
            SELECT o FROM Order o
            WHERE o.user.id = :userId
               OR (o.user IS NULL AND LOWER(o.email) = LOWER(:email))
            ORDER BY o.createdAt DESC
            """)
    List<Order> findAllForUser(@Param("userId") Long userId, @Param("email") String email);
}
