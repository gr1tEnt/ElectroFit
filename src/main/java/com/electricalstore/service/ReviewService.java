package com.electricalstore.service;

import com.electricalstore.dto.CreateReviewRequest;
import com.electricalstore.dto.ReviewResponse;
import com.electricalstore.entity.Review;
import com.electricalstore.entity.User;
import com.electricalstore.repository.OrderRepository;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.ReviewRepository;
import com.electricalstore.validation.InputLimits;
import com.electricalstore.validation.InputSanitizer;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> findByProductId(Long productId) {
        ensureProductExists(productId);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean canUserReview(User user, Long productId) {
        ensureProductExists(productId);
        return orderRepository.existsPurchasedProduct(user.getId(), user.getEmail(), productId);
    }

    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request, User user) {
        ensureProductExists(request.productId());

        boolean verifiedBuyer = canUserReview(user, request.productId());

        Review saved = reviewRepository.save(Review.builder()
                .productId(request.productId())
                .authorName(InputSanitizer.requiredText(user.getFullName(), InputLimits.PERSON_NAME, "Ім'я"))
                .rating(request.rating())
                .comment(InputSanitizer.requiredText(request.comment(), InputLimits.REVIEW_COMMENT, "Коментар"))
                .verifiedBuyer(verifiedBuyer)
                .build());

        return ReviewResponse.from(saved);
    }

    private void ensureProductExists(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Товар не знайдено: " + productId);
        }
    }
}
