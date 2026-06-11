package com.electricalstore.repository;

import com.electricalstore.entity.OrderItem;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT i FROM OrderItem i WHERE i.order.id IN :orderIds ORDER BY i.id ASC")
    List<OrderItem> findAllByOrderIds(@Param("orderIds") Collection<Long> orderIds);
}
