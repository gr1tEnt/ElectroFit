package com.electricalstore.repository;

import com.electricalstore.entity.SupportMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage> findAllByOrderByCreatedAtDesc();
}
