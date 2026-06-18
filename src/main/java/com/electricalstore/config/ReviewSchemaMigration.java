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
public class ReviewSchemaMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ReviewSchemaMigration.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        if (!reviewsTableExists()) {
            return;
        }

        int backfilled = entityManager
                .createNativeQuery(
                        """
                        UPDATE reviews
                        SET verified_buyer = false
                        WHERE verified_buyer IS NULL
                        """)
                .executeUpdate();

        try {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE reviews
                            ALTER COLUMN verified_buyer SET DEFAULT false
                            """)
                    .executeUpdate();
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE reviews
                            ALTER COLUMN verified_buyer SET NOT NULL
                            """)
                    .executeUpdate();
        } catch (Exception ex) {
            log.debug("Review verified_buyer constraint normalization skipped: {}", ex.getMessage());
        }

        if (backfilled > 0) {
            log.info("Backfilled verified_buyer=false for {} existing review(s).", backfilled);
        }
    }

    private boolean reviewsTableExists() {
        Object count = entityManager
                .createNativeQuery(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name = 'reviews'
                        """)
                .getSingleResult();
        return count instanceof Number number && number.longValue() > 0;
    }
}
