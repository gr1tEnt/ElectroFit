package com.electricalstore.dto;

import java.math.BigDecimal;

public record OrderConfirmationResponse(String orderId, String message, BigDecimal total) {}
