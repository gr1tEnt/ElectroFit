package com.electricalstore.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStatsResponse(
        BigDecimal totalRevenue,
        List<RecentOrderResponse> recentOrders,
        List<MonthlySalesResponse> salesChartData) {}
