package com.electricalstore.dto;

import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.TechnicalSpec;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Collections;
import java.util.List;

@Schema(description = "Technical specifications for a product")
public record TechnicalSpecResponse(
        @Schema(example = "1") Long id,
        @Schema(example = "IP44") IpRating ipRating,
        @Schema(example = "16") Integer maxAmps,
        @Schema(example = "true") boolean hasChildProtection,
        @Schema(example = "true") boolean hasGrounding,
        @Schema(example = "3") Integer framePostsCount,
        @Schema(example = "[\"BEDROOM\", \"LIVING_ROOM\"]") List<String> compatibleRoomTypes) {

    public static TechnicalSpecResponse from(TechnicalSpec spec) {
        if (spec == null) {
            return null;
        }
        List<String> compatibleRoomTypes =
                spec.getCompatibleRoomTypes() != null
                        ? spec.getCompatibleRoomTypes()
                        : Collections.emptyList();
        return new TechnicalSpecResponse(
                spec.getId(),
                spec.getIpRating(),
                spec.getMaxAmps(),
                spec.isHasChildProtection(),
                spec.isHasGrounding(),
                spec.getFramePostsCount(),
                compatibleRoomTypes);
    }
}
