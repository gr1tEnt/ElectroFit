package com.electricalstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Matched frame and mechanism products for a modular set")
public record ConfiguratorSetResponse(
        @Schema(description = "Frame product matching the post count") ProductResponse frame,
        @Schema(description = "Socket (or other) mechanism — order this quantity for the set")
                ProductResponse mechanism,
        @Schema(description = "Number of mechanisms required (equals frame post count)", example = "3")
                int mechanismQuantity,
        @Schema(description = "Shared brand name") String brandName,
        @Schema(description = "Shared series name") String seriesName,
        @Schema(description = "Total price for one frame plus all mechanisms") BigDecimal setPrice) {}
