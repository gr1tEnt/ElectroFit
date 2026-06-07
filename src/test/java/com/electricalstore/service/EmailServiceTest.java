package com.electricalstore.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(
                mailSender, "electrofit.support@gmail.com", "ElectroFit Support", "electrofit.support@gmail.com");
    }

    @Test
    void sendOrderConfirmation_sendsEmail() throws Exception {
        org.mockito.Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendOrderConfirmation(
                "customer@example.com", "Jane Doe", 42L, new BigDecimal("99.50"));

        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendOrderConfirmation_doesNotThrowWhenMailFails() throws Exception {
        org.mockito.Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new RuntimeException("SMTP down")).when(mailSender).send(any(MimeMessage.class));

        emailService.sendOrderConfirmation(
                "customer@example.com", "Jane Doe", 42L, new BigDecimal("99.50"));
    }
}
