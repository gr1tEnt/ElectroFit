package com.electricalstore.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.electricalstore.dto.SupportMessageResponse;
import com.electricalstore.entity.SupportTicketStatus;
import com.electricalstore.repository.UserRepository;
import com.electricalstore.security.JwtService;
import com.electricalstore.service.SupportMessageService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = SupportMessageController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class SupportMessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SupportMessageService supportMessageService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void submitMessage_returnsCreated() throws Exception {
        SupportMessageResponse response = new SupportMessageResponse(
                1L,
                "John Smith",
                "john@example.com",
                "Technical Safety Advice",
                "Is IP44 enough for a bathroom?",
                SupportTicketStatus.OPEN,
                LocalDateTime.parse("2026-06-07T10:00:00"));

        when(supportMessageService.createMessage(org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/support")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                """
                                {
                                  "fullName": "John Smith",
                                  "email": "john@example.com",
                                  "inquiryType": "Technical Safety Advice",
                                  "message": "Is IP44 enough for a bathroom?"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fullName").value("John Smith"));
    }

    @Test
    void listMessages_returnsOk() throws Exception {
        when(supportMessageService.findAllMessages()).thenReturn(List.of());

        mockMvc.perform(get("/api/admin/support-messages")).andExpect(status().isOk());
    }

    @Test
    void replyToMessage_returnsOk() throws Exception {
        SupportMessageResponse response = new SupportMessageResponse(
                42L,
                "Jane Doe",
                "jane@example.com",
                "Order issue",
                "Where is my order?",
                SupportTicketStatus.RESOLVED,
                LocalDateTime.parse("2026-06-07T12:00:00"));

        when(supportMessageService.replyToMessage(eq(42L), org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/support/reply/42")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"replyMessage\":\"Your order has been shipped.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    @Test
    void deleteMessage_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/admin/support-messages/42")).andExpect(status().isNoContent());

        verify(supportMessageService).deleteMessage(eq(42L));
    }
}
