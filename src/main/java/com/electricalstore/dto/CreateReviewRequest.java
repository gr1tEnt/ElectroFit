package com.electricalstore.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateReviewRequest(
        @NotNull(message = "Ідентифікатор товару є обов'язковим")
                Long productId,
        @NotNull(message = "Оцінка є обов'язковою")
                @Min(value = 1, message = "Оцінка має бути від 1 до 5")
                @Max(value = 5, message = "Оцінка має бути від 1 до 5")
                Integer rating,
        @NotBlank(message = "Коментар є обов'язковим")
                @Size(min = 3, max = 2000, message = "Коментар має містити від 3 до 2000 символів")
                String comment) {}
