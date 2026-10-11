package com.homebite.controller;

import com.homebite.dto.CookProfileDto;
import com.homebite.dto.DishDto;
import com.homebite.service.CookService;
import com.homebite.service.DishService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cooks")
public class CookController {

    private final CookService cookService;
    private final DishService dishService;

    public CookController(CookService cookService, DishService dishService) {
        this.cookService = cookService;
        this.dishService = dishService;
    }

    @GetMapping
    public ResponseEntity<List<CookProfileDto>> getAllCooks() {
        return ResponseEntity.ok(cookService.getAllCooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CookProfileDto> getCookById(@PathVariable Long id) {
        return ResponseEntity.ok(cookService.getCookById(id));
    }

    @GetMapping("/{id}/dishes")
    public ResponseEntity<List<DishDto>> getCookDishes(@PathVariable Long id) {
        return ResponseEntity.ok(dishService.getDishesByCook(id));
    }
}
