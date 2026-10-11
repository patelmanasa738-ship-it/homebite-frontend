package com.homebite.service;

import com.homebite.dto.DishCreateUpdateRequest;
import com.homebite.dto.DishDto;
import com.homebite.exception.BadRequestException;
import com.homebite.exception.ResourceNotFoundException;
import com.homebite.exception.UnauthorizedException;
import com.homebite.model.CookProfile;
import com.homebite.model.Dish;
import com.homebite.model.Review;
import com.homebite.model.Role;
import com.homebite.model.User;
import com.homebite.repository.CookProfileRepository;
import com.homebite.repository.DishRepository;
import com.homebite.repository.ReviewRepository;
import com.homebite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishService {

    private final DishRepository dishRepository;
    private final CookProfileRepository cookProfileRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public DishService(
            DishRepository dishRepository,
            CookProfileRepository cookProfileRepository,
            ReviewRepository reviewRepository,
            UserRepository userRepository
    ) {
        this.dishRepository = dishRepository;
        this.cookProfileRepository = cookProfileRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public List<DishDto> getAllDishes() {
        return dishRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<DishDto> searchDishes(String query, String category) {
        String trimmedQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String trimmedCat = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) ? category.trim() : null;
        return dishRepository.searchDishes(trimmedQuery, trimmedCat).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DishDto getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));
        return mapToDto(dish);
    }

    public List<DishDto> getDishesByCook(Long cookId) {
        return dishRepository.findByCookProfileId(cookId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DishDto createDish(DishCreateUpdateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        CookProfile cookProfile = cookProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Only registered cooks can create dishes"));

        Dish dish = new Dish();
        dish.setCookProfile(cookProfile);
        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setCategory(request.getCategory());
        dish.setPrice(request.getPrice());
        dish.setPrepTimeMinutes(request.getPrepTimeMinutes() != null ? request.getPrepTimeMinutes() : 30);
        dish.setIsVegetarian(Boolean.TRUE.equals(request.getIsVegetarian()));
        dish.setIsVegan(Boolean.TRUE.equals(request.getIsVegan()));
        dish.setIsGlutenFree(Boolean.TRUE.equals(request.getIsGlutenFree()));
        dish.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);
        dish.setImageUrl(request.getImageUrl());

        dish = dishRepository.save(dish);
        return mapToDto(dish);
    }

    @Transactional
    public DishDto updateDish(Long id, DishCreateUpdateRequest request, String userEmail) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Ownership check: must be owner cook or admin
        boolean isOwner = dish.getCookProfile().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to modify this dish");
        }

        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setCategory(request.getCategory());
        dish.setPrice(request.getPrice());
        dish.setPrepTimeMinutes(request.getPrepTimeMinutes());
        dish.setIsVegetarian(Boolean.TRUE.equals(request.getIsVegetarian()));
        dish.setIsVegan(Boolean.TRUE.equals(request.getIsVegan()));
        dish.setIsGlutenFree(Boolean.TRUE.equals(request.getIsGlutenFree()));
        dish.setIsAvailable(request.getIsAvailable());
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            dish.setImageUrl(request.getImageUrl());
        }

        dish = dishRepository.save(dish);
        return mapToDto(dish);
    }

    @Transactional
    public void deleteDish(Long id, String userEmail) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        boolean isOwner = dish.getCookProfile().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to delete this dish");
        }

        dishRepository.delete(dish);
    }

    private DishDto mapToDto(Dish dish) {
        DishDto dto = new DishDto();
        dto.setId(dish.getId());
        dto.setCookId(dish.getCookProfile().getId());
        dto.setCookName(dish.getCookProfile().getUser().getFullName());
        dto.setKitchenName(dish.getCookProfile().getKitchenName());
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setCategory(dish.getCategory());
        dto.setPrice(dish.getPrice());
        dto.setPrepTimeMinutes(dish.getPrepTimeMinutes());
        dto.setIsVegetarian(dish.getIsVegetarian());
        dto.setIsVegan(dish.getIsVegan());
        dto.setIsGlutenFree(dish.getIsGlutenFree());
        dto.setIsAvailable(dish.getIsAvailable());
        dto.setImageUrl(dish.getImageUrl());
        dto.setCreatedAt(dish.getCreatedAt());

        List<Review> reviews = reviewRepository.findByDishIdOrderByCreatedAtDesc(dish.getId());
        dto.setReviewCount(reviews.size());
        if (!reviews.isEmpty()) {
            double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            dto.setAverageRating(Math.round(avg * 10.0) / 10.0);
        } else {
            dto.setAverageRating(5.0);
        }

        return dto;
    }
}
