package com.homebite.service;

import com.homebite.dto.CartDto;
import com.homebite.dto.CartItemDto;
import com.homebite.dto.CartItemRequest;
import com.homebite.exception.BadRequestException;
import com.homebite.exception.ResourceNotFoundException;
import com.homebite.exception.UnauthorizedException;
import com.homebite.model.Cart;
import com.homebite.model.CartItem;
import com.homebite.model.Dish;
import com.homebite.model.User;
import com.homebite.repository.CartItemRepository;
import com.homebite.repository.CartRepository;
import com.homebite.repository.DishRepository;
import com.homebite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            DishRepository dishRepository,
            UserRepository userRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
    }

    public CartDto getCartForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        return mapToDto(cart);
    }

    @Transactional
    public CartDto addItemToCart(CartItemRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + request.getDishId()));

        if (!Boolean.TRUE.equals(dish.getIsAvailable())) {
            throw new BadRequestException("This dish is currently unavailable");
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        // Multi-cook cart policy: warn or check if cart has dishes from a different cook
        if (!cart.getItems().isEmpty()) {
            Long existingCookId = cart.getItems().get(0).getDish().getCookProfile().getId();
            if (!existingCookId.equals(dish.getCookProfile().getId())) {
                // Clear items from different cook to avoid split delivery conflicts
                cart.getItems().clear();
                cartItemRepository.deleteAll(cartItemRepository.findByCartId(cart.getId()));
            }
        }

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getDish().getId().equals(dish.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            if (request.getSpecialInstructions() != null) {
                existingItem.setSpecialInstructions(request.getSpecialInstructions());
            }
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(cart, dish, request.getQuantity());
            newItem.setSpecialInstructions(request.getSpecialInstructions());
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDto(cart);
    }

    @Transactional
    public CartDto updateItemQuantity(Long itemId, Integer quantity, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied to this cart");
        }

        if (quantity <= 0) {
            item.getCart().getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDto(item.getCart());
    }

    @Transactional
    public CartDto removeItem(Long itemId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied to this cart");
        }

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToDto(cart);
    }

    private CartDto mapToDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());

        List<CartItemDto> itemDtos = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : cart.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setId(item.getId());
            itemDto.setDishId(item.getDish().getId());
            itemDto.setDishName(item.getDish().getName());
            itemDto.setImageUrl(item.getDish().getImageUrl());
            itemDto.setUnitPrice(item.getDish().getPrice());
            itemDto.setQuantity(item.getQuantity());

            BigDecimal itemSubtotal = item.getDish().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemDto.setSubtotal(itemSubtotal);
            itemDto.setCookId(item.getDish().getCookProfile().getId());
            itemDto.setKitchenName(item.getDish().getCookProfile().getKitchenName());
            itemDto.setSpecialInstructions(item.getSpecialInstructions());

            subtotal = subtotal.add(itemSubtotal);
            totalItems += item.getQuantity();
            itemDtos.add(itemDto);
        }

        dto.setItems(itemDtos);
        dto.setSubtotal(subtotal);
        dto.setTotalItems(totalItems);

        BigDecimal deliveryFee = totalItems > 0 ? BigDecimal.valueOf(3.99) : BigDecimal.ZERO;
        dto.setDeliveryFee(deliveryFee);
        dto.setTotal(subtotal.add(deliveryFee));

        return dto;
    }
}
