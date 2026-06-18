package com.electricalstore.controller;

import com.electricalstore.dto.CanReviewResponse;
import com.electricalstore.dto.CreateReviewRequest;
import com.electricalstore.dto.ReviewResponse;
import com.electricalstore.entity.User;
import com.electricalstore.security.UserPrincipal;
import com.electricalstore.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@Tag(name = "Reviews", description = "Відгуки покупців на товари")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping(path = "/api/reviews/product/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Отримати відгуки товару", description = "Повертає список відгуків для конкретного товару, від новіших до старіших.")
    @ApiResponse(responseCode = "200", description = "Список відгуків")
    public List<ReviewResponse> listByProduct(@PathVariable Long productId) {
        return reviewService.findByProductId(productId);
    }

    @GetMapping(path = "/api/reviews/can-review/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Перевірити право на відгук",
            description = "Повертає true, якщо авторизований користувач придбав цей товар.")
    @ApiResponse(responseCode = "200", description = "Результат перевірки")
    public CanReviewResponse canReview(
            @PathVariable Long productId, @AuthenticationPrincipal UserPrincipal principal) {
        requirePrincipal(principal);
        User user = principal.getUser();
        boolean allowed = reviewService.canUserReview(user, productId);

        log.info(
                "can-review: userId={}, email={}, productId={}, allowed={}",
                user.getId(),
                user.getEmail(),
                productId,
                allowed);
        System.out.printf(
                "can-review: userId=%d, email=%s, productId=%d, allowed=%s%n",
                user.getId(),
                user.getEmail(),
                productId,
                allowed);

        return new CanReviewResponse(allowed);
    }

    @PostMapping(path = "/api/reviews", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Залишити відгук",
            description = "Доступно лише верифікованим покупцям, які придбали товар.")
    @ApiResponse(responseCode = "201", description = "Відгук збережено")
    public ReviewResponse createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        requirePrincipal(principal);
        return reviewService.createReview(request, principal.getUser());
    }

    private static void requirePrincipal(UserPrincipal principal) {
        if (principal == null || principal.getUser() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Потрібна авторизація. Будь ласка, увійдіть у систему.");
        }
    }
}
