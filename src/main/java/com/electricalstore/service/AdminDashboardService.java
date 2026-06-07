package com.electricalstore.service;

import com.electricalstore.dto.DashboardStatsResponse;
import com.electricalstore.dto.MonthlySalesResponse;
import com.electricalstore.dto.RecentOrderResponse;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderStatus;
import com.electricalstore.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

    private static final int CHART_MONTHS = 5;

    private final OrderRepository orderRepository;

    public AdminDashboardService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        BigDecimal totalRevenue =
                orderRepository.sumTotalAmountByStatus(OrderStatus.COMPLETED);

        List<RecentOrderResponse> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(this::toRecentOrder)
                .toList();

        List<MonthlySalesResponse> salesChartData = buildSalesChartData();

        return new DashboardStatsResponse(totalRevenue, recentOrders, salesChartData);
    }

    private RecentOrderResponse toRecentOrder(Order order) {
        return new RecentOrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt());
    }

    private List<MonthlySalesResponse> buildSalesChartData() {
        YearMonth startMonth = YearMonth.from(LocalDate.now()).minusMonths(CHART_MONTHS - 1L);
        List<MonthlySalesResponse> chart = new ArrayList<>(CHART_MONTHS);

        for (int i = 0; i < CHART_MONTHS; i++) {
            YearMonth month = startMonth.plusMonths(i);
            LocalDateTime rangeStart = month.atDay(1).atStartOfDay();
            LocalDateTime rangeEnd = month.plusMonths(1).atDay(1).atStartOfDay();
            BigDecimal revenue = orderRepository.sumTotalAmountByStatusAndCreatedAtBetween(
                    OrderStatus.COMPLETED, rangeStart, rangeEnd);
            String label = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            chart.add(new MonthlySalesResponse(label, revenue));
        }

        return chart;
    }
}
