package com.homebite.controller;

import com.homebite.dto.OrderCreateRequest;
import com.homebite.dto.OrderDto;
import com.homebite.dto.UpdateOrderStatusRequest;
import com.homebite.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderDto> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            Authentication authentication
    ) {
        OrderDto order = orderService.createOrderFromCart(request, authentication.getName());
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getCustomerOrders(authentication.getName()));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderDto> getOrderById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(orderService.getOrderById(id, authentication.getName()));
    }

    @GetMapping("/cook/orders")
    public ResponseEntity<List<OrderDto>> getCookOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getCookOrders(authentication.getName()));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus(), authentication.getName()));
    }
}
