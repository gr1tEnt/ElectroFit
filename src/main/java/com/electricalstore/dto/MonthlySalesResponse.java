package com.electricalstore.dto;

import java.math.BigDecimal;

public record MonthlySalesResponse(String month, BigDecimal revenue) {}
