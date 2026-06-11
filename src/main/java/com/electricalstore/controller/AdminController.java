package com.electricalstore.controller;

import com.electricalstore.dto.AdminStatsResponse;
import com.electricalstore.dto.DashboardStatsResponse;
import com.electricalstore.service.AdminDashboardService;
import com.electricalstore.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin dashboard endpoints")
public class AdminController {

    private final AdminService adminService;
    private final AdminDashboardService adminDashboardService;

    public AdminController(AdminService adminService, AdminDashboardService adminDashboardService) {
        this.adminService = adminService;
        this.adminDashboardService = adminDashboardService;
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
}
