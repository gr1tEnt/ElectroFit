package com.electricalstore.service;

import com.electricalstore.dto.CreateSupportMessageRequest;
import com.electricalstore.dto.SupportMessageResponse;
import com.electricalstore.dto.SupportReplyRequest;
import com.electricalstore.entity.SupportMessage;
import com.electricalstore.entity.SupportTicketStatus;
import com.electricalstore.repository.SupportMessageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SupportMessageService {

    private final SupportMessageRepository supportMessageRepository;
    private final EmailService emailService;

    public SupportMessageService(
            SupportMessageRepository supportMessageRepository, EmailService emailService) {
        this.supportMessageRepository = supportMessageRepository;
        this.emailService = emailService;
    }

    @Transactional
    public SupportMessageResponse createMessage(CreateSupportMessageRequest request) {
        SupportMessage saved = supportMessageRepository.save(SupportMessage.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim())
                .inquiryType(request.inquiryType().trim())
                .message(request.message().trim())
                .status(SupportTicketStatus.OPEN)
                .build());
        return SupportMessageResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> findAllMessages() {
        return supportMessageRepository.findAllByStatusOrderByCreatedAtDesc(SupportTicketStatus.OPEN).stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    @Transactional
    public SupportMessageResponse replyToMessage(Long ticketId, SupportReplyRequest request) {
        SupportMessage message = supportMessageRepository
                .findById(ticketId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Звернення не знайдено: " + ticketId));

        if (message.getStatus() == SupportTicketStatus.RESOLVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Звернення вже вирішене");
        }

        String replyText = request.replyMessage().trim();

        try {
            emailService.sendSupportReply(
                    message.getEmail(),
                    message.getFullName(),
                    message.getInquiryType(),
                    message.getMessage(),
                    replyText);
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE, mapSupportReplyEmailError(ex), ex);
        }

        message.setStatus(SupportTicketStatus.RESOLVED);
        return SupportMessageResponse.from(supportMessageRepository.save(message));
    }

    @Transactional
    public void deleteMessage(Long id) {
        SupportMessage message = supportMessageRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Звернення не знайдено: " + id));

        message.setStatus(SupportTicketStatus.RESOLVED);
        supportMessageRepository.save(message);
    }

    private static String mapSupportReplyEmailError(IllegalStateException ex) {
        String message = ex.getMessage();
        if (message != null && message.contains("Brevo API rejected")) {
            if (message.contains("401") || message.contains("403")) {
                return "Невірний BREVO_API_KEY або доступ заборонено. Перевірте ключ на сервері.";
            }
            if (message.contains("sender") || message.contains("not verified")) {
                return "Адресу відправника не підтверджено в Brevo. Перевірте CONTACT_EMAIL.";
            }
            return "Brevo не прийняв лист. Перевірте BREVO_API_KEY та CONTACT_EMAIL на сервері.";
        }
        return "Не вдалося надіслати email клієнту. Спробуйте пізніше.";
    }
}
