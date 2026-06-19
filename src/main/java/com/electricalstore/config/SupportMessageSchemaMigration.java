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
@Order(1)
public class SupportMessageSchemaMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SupportMessageSchemaMigration.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        if (!supportMessagesTableExists()) {
            return;
        }

        if (!statusColumnExists()) {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE support_messages
                            ADD COLUMN status varchar(20) DEFAULT 'OPEN'
                            """)
                    .executeUpdate();
            log.info("Added support_messages.status column.");
        }

        int backfilled = entityManager
                .createNativeQuery(
                        """
                        UPDATE support_messages
                        SET status = 'OPEN'
                        WHERE status IS NULL
                        """)
                .executeUpdate();

        try {
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE support_messages
                            ALTER COLUMN status SET DEFAULT 'OPEN'
                            """)
                    .executeUpdate();
            entityManager
                    .createNativeQuery(
                            """
                            ALTER TABLE support_messages
                            ALTER COLUMN status SET NOT NULL
                            """)
                    .executeUpdate();
        } catch (Exception ex) {
            log.debug("support_messages.status constraint normalization skipped: {}", ex.getMessage());
        }

        if (backfilled > 0) {
            log.info("Backfilled status=OPEN for {} existing support message(s).", backfilled);
        }
    }

    private boolean supportMessagesTableExists() {
        Object count = entityManager
                .createNativeQuery(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          AND table_name = 'support_messages'
                        """)
                .getSingleResult();
        return count instanceof Number number && number.longValue() > 0;
    }

    private boolean statusColumnExists() {
        Object count = entityManager
                .createNativeQuery(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = 'support_messages'
                          AND column_name = 'status'
                        """)
                .getSingleResult();
        return count instanceof Number number && number.longValue() > 0;
    }
}
