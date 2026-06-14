package com.electricalstore.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    private static final String BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

    @Mock
    private RestTemplate restTemplate;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(
                restTemplate, "test-brevo-api-key", "electrofit.support@gmail.com", "ElectroFit");
    }

    @Test
    void sendOrderConfirmation_sendsEmailViaBrevoApi() {
        when(restTemplate.postForEntity(eq(BREVO_SEND_URL), any(), eq(String.class)))
                .thenReturn(new ResponseEntity<>("{\"messageId\":\"abc\"}", HttpStatus.CREATED));

        emailService.sendOrderConfirmation(
                "customer@example.com", "Jane Doe", 42L, new BigDecimal("99.50"));

        verify(restTemplate).postForEntity(eq(BREVO_SEND_URL), any(), eq(String.class));
    }

    @Test
    void sendOrderConfirmation_doesNotThrowWhenBrevoApiFails() {
        doThrow(new RuntimeException("Brevo API down"))
                .when(restTemplate)
                .postForEntity(eq(BREVO_SEND_URL), any(), eq(String.class));

        emailService.sendOrderConfirmation(
                "customer@example.com", "Jane Doe", 42L, new BigDecimal("99.50"));
    }

    @Test
    void sendOrderConfirmation_skipsWhenApiKeyMissing() {
        EmailService serviceWithoutKey =
                new EmailService(restTemplate, "", "electrofit.support@gmail.com", "ElectroFit");

        serviceWithoutKey.sendOrderConfirmation(
                "customer@example.com", "Jane Doe", 42L, new BigDecimal("99.50"));
    }
}
