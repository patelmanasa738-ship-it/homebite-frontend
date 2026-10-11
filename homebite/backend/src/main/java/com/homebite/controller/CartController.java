package com.homebite.controller;

import com.homebite.dto.CartDto;
import com.homebite.dto.CartItemRequest;
import com.homebite.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCartForUser(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItem(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.addItemToCart(request, authentication.getName()));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> payload,
            Authentication authentication
    ) {
        Integer quantity = payload.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.updateItemQuantity(id, quantity, authentication.getName()));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<CartDto> removeItem(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.removeItem(id, authentication.getName()));
    }
}
