package com.electricalstore.dto;

public record AdminStatsResponse(
        long totalProducts, long unresolvedInquiries, long totalBrands) {}
