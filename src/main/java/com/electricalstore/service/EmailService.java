package com.electricalstore.service;

import com.electricalstore.dto.OrderPlacedEvent;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate;
    private final String brevoApiKey;
    private final String senderEmail;
    private final String fromName;

    public EmailService(
            RestTemplate restTemplate,
            @Value("${BREVO_API_KEY:}") String brevoApiKey,
            @Value("${CONTACT_EMAIL:${app.contact.email:electrofit.support@gmail.com}}") String senderEmail,
            @Value("${app.mail.from-name:ElectroFit}") String fromName) {
        this.restTemplate = restTemplate;
        this.brevoApiKey = brevoApiKey;
        this.senderEmail = senderEmail;
        this.fromName = fromName;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderPlaced(OrderPlacedEvent event) {
        sendOrderConfirmation(
                event.customerEmail(), event.customerName(), event.orderId(), event.totalAmount());
    }

    public void sendOrderConfirmation(
            String toEmail, String customerName, Long orderId, BigDecimal totalAmount) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.warn(
                    "BREVO_API_KEY is not configured; skipping order confirmation email to {} for order #{}",
                    toEmail,
                    orderId);
            return;
        }

        sendHtmlEmail(
                toEmail,
                "Підтвердження замовлення ElectroFit №" + orderId,
                buildOrderHtmlBody(customerName, orderId, totalAmount),
                "order #" + orderId,
                false);
    }

    public void sendSupportReply(
            String clientEmail,
            String customerName,
            String inquiryType,
            String originalMessage,
            String replyMessage) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.warn(
                    """
                    BREVO_API_KEY is not configured; support reply was not emailed.
                    To: {}
                    Customer: {}
                    Reply:
                    {}
                    """,
                    clientEmail,
                    customerName,
                    replyMessage);
            return;
        }

        sendHtmlEmail(
                clientEmail,
                "Відповідь на ваше звернення — ElectroFit",
                buildSupportReplyHtmlBody(customerName, inquiryType, originalMessage, replyMessage),
                "support reply to " + clientEmail,
                true);
    }

    private void sendHtmlEmail(
            String toEmail, String subject, String htmlContent, String logContext, boolean failOnError) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sender", Map.of("email", senderEmail, "name", fromName));
            payload.put("to", List.of(Map.of("email", toEmail)));
            payload.put("subject", subject);
            payload.put("htmlContent", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response =
                    restTemplate.postForEntity(BREVO_SEND_URL, request, String.class);

            log.info(
                    "Email sent via Brevo from {} to {} ({}) status={}",
                    senderEmail,
                    toEmail,
                    logContext,
                    response.getStatusCode());
        } catch (HttpStatusCodeException ex) {
            log.error(
                    "Brevo API rejected email from {} to {} ({}): {} — {}",
                    senderEmail,
                    toEmail,
                    logContext,
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString(),
                    ex);
            if (failOnError) {
                String brevoDetail = ex.getResponseBodyAsString();
                throw new IllegalStateException(
                        "Brevo API rejected the email (" + ex.getStatusCode() + "): " + brevoDetail, ex);
            }
        } catch (Exception ex) {
            log.error(
                    "Failed to send email via Brevo from {} to {} ({}): {}",
                    senderEmail,
                    toEmail,
                    logContext,
                    ex.getMessage(),
                    ex);
            if (failOnError) {
                throw new IllegalStateException("Failed to send email: " + ex.getMessage(), ex);
            }
        }
    }

    private static String buildOrderHtmlBody(String customerName, Long orderId, BigDecimal totalAmount) {
        String safeName = escapeHtml(customerName);
        String formattedTotal = formatEuro(totalAmount);

        return """
                <!DOCTYPE html>
                <html lang="uk">
                  <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Підтвердження замовлення</title>
                  </head>
                  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12);">
                            <tr>
                              <td style="background: linear-gradient(135deg, #0f2744 0%%, #1e3a5f 100%%); padding: 28px 32px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                  ElectroFit Store
                                </h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 32px;">
                                <p style="margin: 0 0 8px; color: #1e293b; font-size: 18px; font-weight: 600;">
                                  Вітаємо, %s!
                                </p>
                                <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  Дякуємо за ваше замовлення! Нижче — короткий підсумок вашого чека.
                                </p>
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                                  <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                                      <span style="display: block; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Номер замовлення</span>
                                      <span style="display: block; margin-top: 4px; color: #0f172a; font-size: 20px; font-weight: 700;">#%d</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 16px 20px;">
                                      <span style="display: block; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Загальна сума</span>
                                      <span style="display: block; margin-top: 4px; color: #1d4ed8; font-size: 24px; font-weight: 700;">%s</span>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 0 32px 32px; text-align: center;">
                                <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; font-style: italic;">
                                  Дякуємо, що обрали безпечні електротехнічні рішення!
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """
                .formatted(safeName, orderId, formattedTotal);
    }

    private static String buildSupportReplyHtmlBody(
            String customerName, String inquiryType, String originalMessage, String replyMessage) {
        String safeName = escapeHtml(customerName);
        String safeInquiryType = escapeHtml(inquiryType);
        String safeOriginal = escapeHtml(originalMessage).replace("\n", "<br/>");
        String safeReply = escapeHtml(replyMessage).replace("\n", "<br/>");

        return """
                <!DOCTYPE html>
                <html lang="uk">
                  <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Відповідь на звернення</title>
                  </head>
                  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12);">
                            <tr>
                              <td style="background: linear-gradient(135deg, #0f2744 0%%, #1e3a5f 100%%); padding: 28px 32px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">ElectroFit</h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 32px;">
                                <p style="margin: 0 0 8px; color: #1e293b; font-size: 18px; font-weight: 600;">Вітаємо, %s!</p>
                                <p style="margin: 0 0 24px; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  Дякуємо за ваше звернення. Нижче — відповідь нашої команди підтримки.
                                </p>
                                <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Тема звернення</p>
                                <p style="margin: 0 0 16px; color: #0f172a; font-size: 15px; font-weight: 600;">%s</p>
                                <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Ваше повідомлення</p>
                                <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">%s</p>
                                <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                                  <tr>
                                    <td style="padding: 20px;">
                                      <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">Відповідь підтримки</p>
                                      <p style="margin: 0; color: #0f172a; font-size: 15px; line-height: 1.7;">%s</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """
                .formatted(safeName, safeInquiryType, safeOriginal, safeReply);
    }

    private static String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }

    private static String formatEuro(BigDecimal amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.GERMANY);
        return format.format(amount);
    }
}
