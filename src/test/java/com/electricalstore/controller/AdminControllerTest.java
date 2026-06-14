package com.electricalstore.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.electricalstore.dto.DashboardStatsResponse;
import com.electricalstore.dto.MonthlySalesResponse;
import com.electricalstore.dto.RecentOrderResponse;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderStatus;
import com.electricalstore.repository.UserRepository;
import com.electricalstore.security.JwtService;
import com.electricalstore.service.AdminDashboardService;
import com.electricalstore.service.AdminService;
import com.electricalstore.service.OrderService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = AdminController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminService adminService;

    @MockitoBean
    private AdminDashboardService adminDashboardService;

    @MockitoBean
    private OrderService orderService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void dashboardStats_returnsOk() throws Exception {
        DashboardStatsResponse stats = new DashboardStatsResponse(
                new BigDecimal("1250.40"),
                List.of(new RecentOrderResponse(
                        1L,
                        "Olena Kovalenko",
                        "olena.k@example.com",
                        new BigDecimal("124.50"),
                        OrderStatus.COMPLETED,
                        LocalDateTime.parse("2026-06-07T10:30:00"))),
                List.of(
                        new MonthlySalesResponse("Feb", new BigDecimal("450.00")),
                        new MonthlySalesResponse("Jun", new BigDecimal("890.00"))));

        when(adminDashboardService.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/api/admin/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue").value(1250.40))
                .andExpect(jsonPath("$.recentOrders[0].customerName").value("Olena Kovalenko"))
                .andExpect(jsonPath("$.salesChartData[0].month").value("Feb"))
                .andExpect(jsonPath("$.salesChartData[1].revenue").value(890.00));
    }

    @Test
    void updateOrderStatus_returnsUpdatedOrder() throws Exception {
        Order updated = Order.builder()
                .id(7L)
                .customerName("Jane Doe")
                .customerEmail("jane@example.com")
                .totalAmount(new BigDecimal("99.50"))
                .status(OrderStatus.COMPLETED)
                .createdAt(LocalDateTime.parse("2026-06-07T10:30:00"))
                .build();

        when(orderService.updateStatus(eq(7L), eq(OrderStatus.COMPLETED))).thenReturn(updated);

        mockMvc.perform(patch("/api/admin/orders/7/status")
                        .contentType("application/json")
                        .content("{\"status\":\"COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.customerName").value("Jane Doe"));
    }
}
