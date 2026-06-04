package com.electricalstore.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Environmental conditions for smart product selection")
public record SmartSelectRequest(
        @NotBlank
        @Schema(
                description = "Room type",
                example = "KITCHEN",
                allowableValues = {
                    "BEDROOM",
                    "LIVING_ROOM",
                    "KIDS_ROOM",
                    "BATHROOM",
                    "KITCHEN",
                    "OUTDOOR",
                    "GARAGE"
                })
        String roomType,
        @Schema(description = "Whether the installation is near water (bathroom zones 1–2)", example = "false")
        boolean nearWater,
        @Schema(description = "Whether children are present in the household", example = "false")
        boolean hasChildren) {}
