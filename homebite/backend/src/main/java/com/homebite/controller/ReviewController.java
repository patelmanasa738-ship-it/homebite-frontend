package com.homebite.controller;

import com.homebite.dto.ReviewCreateRequest;
import com.homebite.dto.ReviewDto;
import com.homebite.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes/{dishId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewDto>> getDishReviews(@PathVariable Long dishId) {
        return ResponseEntity.ok(reviewService.getReviewsForDish(dishId));
    }

    @PostMapping
    public ResponseEntity<ReviewDto> addReview(
            @PathVariable Long dishId,
            @Valid @RequestBody ReviewCreateRequest request,
            Authentication authentication
    ) {
        ReviewDto review = reviewService.addReview(dishId, request, authentication.getName());
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
}
