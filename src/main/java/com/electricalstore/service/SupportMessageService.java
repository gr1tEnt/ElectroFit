package com.electricalstore.service;

import com.electricalstore.dto.CreateSupportMessageRequest;
import com.electricalstore.dto.SupportMessageResponse;
import com.electricalstore.entity.SupportMessage;
import com.electricalstore.repository.SupportMessageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SupportMessageService {

    private final SupportMessageRepository supportMessageRepository;

    public SupportMessageService(SupportMessageRepository supportMessageRepository) {
        this.supportMessageRepository = supportMessageRepository;
    }

    @Transactional
    public SupportMessageResponse createMessage(CreateSupportMessageRequest request) {
        SupportMessage saved = supportMessageRepository.save(SupportMessage.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim())
                .inquiryType(request.inquiryType().trim())
                .message(request.message().trim())
                .build());
        return SupportMessageResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> findAllMessages() {
        return supportMessageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    @Transactional
    public void deleteMessage(Long id) {
        if (!supportMessageRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support message not found: " + id);
        }
        supportMessageRepository.deleteById(id);
    }
}
