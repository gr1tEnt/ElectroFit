package com.electricalstore.controller;

import com.electricalstore.dto.CreateSupportMessageRequest;
import com.electricalstore.dto.SupportMessageResponse;
import com.electricalstore.dto.SupportReplyRequest;
import com.electricalstore.service.SupportMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Support", description = "Customer support messages and admin inbox")
public class SupportMessageController {

    private final SupportMessageService supportMessageService;

    public SupportMessageController(SupportMessageService supportMessageService) {
        this.supportMessageService = supportMessageService;
    }

    @PostMapping(path = "/api/support", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Submit support inquiry", description = "Public endpoint used by the Support page contact form.")
    @ApiResponse(responseCode = "201", description = "Message saved")
    public SupportMessageResponse submitMessage(@Valid @RequestBody CreateSupportMessageRequest request) {
        return supportMessageService.createMessage(request);
    }

    @PostMapping(path = "/api/support/reply/{ticketId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Reply to support ticket",
            description = "Sends an email reply to the customer and marks the ticket as resolved.")
    @ApiResponse(responseCode = "200", description = "Reply sent and ticket resolved")
    @ApiResponse(responseCode = "404", description = "Ticket not found")
    public SupportMessageResponse replyToMessage(
            @PathVariable Long ticketId, @Valid @RequestBody SupportReplyRequest request) {
        return supportMessageService.replyToMessage(ticketId, request);
    }

    @GetMapping(path = "/api/admin/support-messages", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "List support messages", description = "Admin inbox — all customer inquiries, newest first.")
    @ApiResponse(responseCode = "200", description = "Support messages")
    public List<SupportMessageResponse> listMessages() {
        return supportMessageService.findAllMessages();
    }

    @DeleteMapping(path = "/api/admin/support-messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete support message", description = "Admin action to resolve/remove a message from the inbox.")
    @ApiResponse(responseCode = "204", description = "Message deleted")
    @ApiResponse(responseCode = "404", description = "Message not found")
    public void deleteMessage(@PathVariable Long id) {
        supportMessageService.deleteMessage(id);
    }
}
