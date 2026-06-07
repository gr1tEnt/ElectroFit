package com.electricalstore.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(0)
public class OrderStatusMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(OrderStatusMigration.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        int updated = entityManager
                .createNativeQuery(
                        """
                        UPDATE orders
                        SET status = 'PENDING'
                        WHERE status IS NULL
                           OR UPPER(status) = 'SUBMITTED'
                           OR UPPER(status) NOT IN ('PENDING', 'COMPLETED', 'SHIPPED')
                        """)
                .executeUpdate();
        if (updated > 0) {
            log.info("Normalized {} legacy order status value(s).", updated);
        }
    }
}
