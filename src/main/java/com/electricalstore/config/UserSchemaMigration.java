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
public class UserSchemaMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserSchemaMigration.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        if (!usersTableExists()) {
            return;
        }

        if (!columnExists("role")) {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE users
                            ADD COLUMN role varchar(20) DEFAULT 'USER'
                            """)
                    .executeUpdate();
            log.info("Added users.role column.");
        }

        if (!columnExists("reset_pin")) {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE users
                            ADD COLUMN reset_pin varchar(6)
                            """)
                    .executeUpdate();
            log.info("Added users.reset_pin column.");
        }

        if (!columnExists("reset_pin_expiry")) {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE users
                            ADD COLUMN reset_pin_expiry timestamp
                            """)
                    .executeUpdate();
            log.info("Added users.reset_pin_expiry column.");
        }

        int backfilled = entityManager
                .createNativeQuery(
                        """
                        UPDATE users
                        SET role = 'USER'
                        WHERE role IS NULL
                        """)
                .executeUpdate();

        try {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE users
                            ALTER COLUMN role SET DEFAULT 'USER'
                            """)
                    .executeUpdate();
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE users
                            ALTER COLUMN role SET NOT NULL
                            """)
                    .executeUpdate();
        } catch (Exception ex) {
            log.debug("users.role constraint normalization skipped: {}", ex.getMessage());
        }

        if (backfilled > 0) {
            log.info("Backfilled role=USER for {} existing user(s).", backfilled);
        }
    }

    private boolean usersTableExists() {
        Object count = entityManager
                .createNativeQuery(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name = 'users'
                        """)
                .getSingleResult();
        return count instanceof Number number && number.longValue() > 0;
    }

    private boolean columnExists(String columnName) {
        Object count = entityManager
                .createNativeQuery(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'users'
                          AND column_name = :columnName
                        """)
                .setParameter("columnName", columnName)
                .getSingleResult();
        return count instanceof Number number && number.longValue() > 0;
    }
}
