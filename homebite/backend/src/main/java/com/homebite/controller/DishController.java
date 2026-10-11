package com.homebite.controller;

import com.homebite.dto.DishCreateUpdateRequest;
import com.homebite.dto.DishDto;
import com.homebite.service.DishService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping
    public ResponseEntity<List<DishDto>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @GetMapping("/search")
    public ResponseEntity<List<DishDto>> searchDishes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(dishService.searchDishes(query, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishDto> getDishById(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.getDishById(id));
    }

    @PostMapping
    public ResponseEntity<DishDto> createDish(
            @Valid @RequestBody DishCreateUpdateRequest request,
            Authentication authentication
    ) {
        DishDto dish = dishService.createDish(request, authentication.getName());
        return new ResponseEntity<>(dish, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDto> updateDish(
            @PathVariable Long id,
            @Valid @RequestBody DishCreateUpdateRequest request,
            Authentication authentication
    ) {
        DishDto dish = dishService.updateDish(id, request, authentication.getName());
        return ResponseEntity.ok(dish);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDish(
            @PathVariable Long id,
            Authentication authentication
    ) {
        dishService.deleteDish(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
