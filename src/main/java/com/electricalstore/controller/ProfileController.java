package com.electricalstore.controller;

import com.electricalstore.dto.OrderHistoryItemResponse;
import com.electricalstore.security.UserPrincipal;
import com.electricalstore.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile", description = "Authenticated user profile data")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping(path = "/orders", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Order history for the current user (sample data)")
    public List<OrderHistoryItemResponse> orderHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return profileService.getOrderHistory(principal.getUser());
    }
}
