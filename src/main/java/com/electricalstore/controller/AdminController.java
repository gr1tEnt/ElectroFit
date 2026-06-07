package com.electricalstore.controller;

import com.electricalstore.dto.AdminStatsResponse;
import com.electricalstore.dto.DashboardStatsResponse;
import com.electricalstore.dto.RecentOrderResponse;
import com.electricalstore.dto.UpdateOrderStatusRequest;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderStatus;
import com.electricalstore.service.AdminDashboardService;
import com.electricalstore.service.AdminService;
import com.electricalstore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin dashboard endpoints")
public class AdminController {

    private final AdminService adminService;
    private final AdminDashboardService adminDashboardService;
    private final OrderService orderService;

    public AdminController(
            AdminService adminService,
            AdminDashboardService adminDashboardService,
            OrderService orderService) {
        this.adminService = adminService;
        this.adminDashboardService = adminDashboardService;
        this.orderService = orderService;
    }

    @GetMapping(path = "/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Dashboard statistics", description = "Returns total product, inquiry, and brand counts.")
    public AdminStatsResponse stats() {
        return adminService.getStats();
    }

    @GetMapping(path = "/dashboard/stats", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Sales analytics",
            description = "Returns total revenue, recent orders, and monthly sales chart data.")
    public DashboardStatsResponse dashboardStats() {
        return adminDashboardService.getDashboardStats();
    }

    @PatchMapping(path = "/orders/{id}/status", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Update order status", description = "Sets order status to PENDING, COMPLETED, or SHIPPED.")
    public RecentOrderResponse updateOrderStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderStatus status = parseOrderStatus(request.status());
        Order updated = orderService.updateStatus(id, status);
        return new RecentOrderResponse(
                updated.getId(),
                updated.getCustomerName(),
                updated.getCustomerEmail(),
                updated.getTotalAmount(),
                updated.getStatus(),
                updated.getCreatedAt());
    }

    private static OrderStatus parseOrderStatus(String raw) {
        try {
            return OrderStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Status must be one of: PENDING, COMPLETED, SHIPPED");
        }
    }
}
