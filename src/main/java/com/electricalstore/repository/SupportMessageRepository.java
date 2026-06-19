package com.electricalstore.repository;

import com.electricalstore.entity.SupportMessage;
import com.electricalstore.entity.SupportTicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage> findAllByStatusOrderByCreatedAtDesc(SupportTicketStatus status);

    long countByStatus(SupportTicketStatus status);
}
