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
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(fromAddress, fromName));
            helper.setReplyTo(replyToAddress);
            helper.setTo(toEmail);
            helper.setSubject("ElectroFit order confirmation #" + orderId);
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
                Hello %s,

                Thank you for your order!

                Your Order ID is #%d.
                Total amount: %s

                Our manager will contact you soon.

                — ElectroFit Support
                """
                .formatted(customerName, orderId, formatEuro(totalAmount));
    }

    private static String buildHtmlBody(String customerName, Long orderId, BigDecimal totalAmount) {
        return """
                <!DOCTYPE html>
                <html>
                  <body style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.6;">
                    <p>Hello <strong>%s</strong>,</p>
                    <p>Thank you for your order!</p>
                    <p>
                      Your Order ID is <strong>#%d</strong>.<br/>
                      Total amount: <strong>%s</strong>
                    </p>
                    <p>Our manager will contact you soon.</p>
                    <p style="color: #64748b; font-size: 12px;">— ElectroFit Support</p>
                  </body>
                </html>
                """
                .formatted(customerName, orderId, formatEuro(totalAmount));
    }

    private static String formatEuro(BigDecimal amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.GERMANY);
        return format.format(amount);
    }
}
