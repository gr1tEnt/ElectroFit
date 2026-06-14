package com.electricalstore.service;

import com.electricalstore.dto.OrderPlacedEvent;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String fromName;
    private final String replyToAddress;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromAddress,
            @Value("${app.mail.from-name:ElectroFit Support}") String fromName,
            @Value("${app.contact.email:${spring.mail.username}}") String replyToAddress) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.fromName = fromName;
        this.replyToAddress = replyToAddress;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onOrderPlaced(OrderPlacedEvent event) {
        sendOrderConfirmation(
                event.customerEmail(), event.customerName(), event.orderId(), event.totalAmount());
    }

    public void sendOrderConfirmation(
            String toEmail, String customerName, Long orderId, BigDecimal totalAmount) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(fromAddress, fromName));
            helper.setReplyTo(replyToAddress);
            helper.setTo(toEmail);
            helper.setSubject("Підтвердження замовлення ElectroFit №" + orderId);
            helper.setText(
                    buildPlainText(customerName, orderId, totalAmount),
                    buildHtmlBody(customerName, orderId, totalAmount));
            mailSender.send(message);
            log.info("Order confirmation email sent to {} for order #{}", toEmail, orderId);
        } catch (Exception ex) {
            log.error(
                    "Failed to send order confirmation email to {} for order #{}: {}",
                    toEmail,
                    orderId,
                    ex.getMessage(),
                    ex);
        }
    }

    private static String buildPlainText(String customerName, Long orderId, BigDecimal totalAmount) {
        return """
                Вітаємо, %s!

                Дякуємо за ваше замовлення!

                Номер замовлення: №%d
                Загальна сума: %s

                Дякуємо, що обрали безпечні електротехнічні рішення!
                """
                .formatted(customerName, orderId, formatEuro(totalAmount));
    }

    private static String buildHtmlBody(String customerName, Long orderId, BigDecimal totalAmount) {
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
