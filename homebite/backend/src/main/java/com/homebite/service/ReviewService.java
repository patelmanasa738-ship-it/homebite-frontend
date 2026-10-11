package com.homebite.service;

import com.homebite.dto.ReviewCreateRequest;
import com.homebite.dto.ReviewDto;
import com.homebite.exception.BadRequestException;
import com.homebite.exception.ResourceNotFoundException;
import com.homebite.exception.UnauthorizedException;
import com.homebite.model.CookProfile;
import com.homebite.model.Dish;
import com.homebite.model.Review;
import com.homebite.model.User;
import com.homebite.repository.CookProfileRepository;
import com.homebite.repository.DishRepository;
import com.homebite.repository.ReviewRepository;
import com.homebite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final CookProfileRepository cookProfileRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            DishRepository dishRepository,
            UserRepository userRepository,
            CookProfileRepository cookProfileRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
        this.cookProfileRepository = cookProfileRepository;
    }

    public List<ReviewDto> getReviewsForDish(Long dishId) {
        return reviewRepository.findByDishIdOrderByCreatedAtDesc(dishId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(Long dishId, ReviewCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + dishId));

        if (dish.getCookProfile().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot review your own dish");
        }

        Review review = new Review(dish, user, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);

        // Update cook's aggregate rating
        CookProfile cook = dish.getCookProfile();
        List<Review> cookReviews = reviewRepository.findByDishCookProfileId(cook.getId());
        if (!cookReviews.isEmpty()) {
            double avg = cookReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            cook.setRatingAvg(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            cook.setRatingCount(cookReviews.size());
            cookProfileRepository.save(cook);
        }

        return mapToDto(saved);
    }

    private ReviewDto mapToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setDishId(review.getDish().getId());
        dto.setDishName(review.getDish().getName());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setCustomerName(review.getCustomer().getFullName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
