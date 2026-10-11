package com.homebite.service;

import com.homebite.dto.OrderCreateRequest;
import com.homebite.dto.OrderDto;
import com.homebite.dto.OrderItemDto;
import com.homebite.exception.BadRequestException;
import com.homebite.exception.ResourceNotFoundException;
import com.homebite.exception.UnauthorizedException;
import com.homebite.model.*;
import com.homebite.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final CookProfileRepository cookProfileRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            CookProfileRepository cookProfileRepository
    ) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.cookProfileRepository = cookProfileRepository;
    }

    @Transactional
    public OrderDto createOrderFromCart(OrderCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your cart is empty. Add homemade dishes before checkout.");
        }

        CookProfile cookProfile = cart.getItems().get(0).getDish().getCookProfile();

        Order order = new Order();
        order.setCustomer(user);
        order.setCookProfile(cookProfile);
        order.setStatus(OrderStatus.PENDING);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setSpecialNotes(request.getSpecialNotes());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cart.getItems()) {
            BigDecimal itemSubtotal = cartItem.getDish().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    cartItem.getDish(),
                    cartItem.getDish().getName(),
                    cartItem.getDish().getPrice(),
                    cartItem.getQuantity(),
                    itemSubtotal
            );
            order.getItems().add(orderItem);
        }

        BigDecimal deliveryFee = BigDecimal.valueOf(3.99);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(subtotal.add(deliveryFee));

        Order savedOrder = orderRepository.save(order);

        // Clear user cart
        cart.getItems().clear();
        cartItemRepository.deleteAll(cartItemRepository.findByCartId(cart.getId()));

        return mapToDto(savedOrder);
    }

    public List<OrderDto> getCustomerOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<OrderDto> getCookOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        CookProfile cookProfile = cookProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Only registered cooks have kitchen orders"));

        return orderRepository.findByCookProfileIdOrderByCreatedAtDesc(cookProfile.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        boolean isCustomer = order.getCustomer().getId().equals(user.getId());
        boolean isCook = order.getCookProfile().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCustomer && !isCook && !isAdmin) {
            throw new UnauthorizedException("Access denied to view this order");
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus newStatus, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        boolean isCook = order.getCookProfile().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isCook && !isAdmin) {
            throw new UnauthorizedException("Only the preparation cook or admin can update order status");
        }

        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return mapToDto(updated);
    }

    public OrderDto mapToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getFullName());
        dto.setCustomerEmail(order.getCustomer().getEmail());
        dto.setCookId(order.getCookProfile().getId());
        dto.setKitchenName(order.getCookProfile().getKitchenName());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setSpecialNotes(order.getSpecialNotes());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> {
            OrderItemDto iDto = new OrderItemDto();
            iDto.setId(item.getId());
            iDto.setDishId(item.getDish() != null ? item.getDish().getId() : null);
            iDto.setDishName(item.getDishName());
            iDto.setUnitPrice(item.getUnitPrice());
            iDto.setQuantity(item.getQuantity());
            iDto.setSubtotal(item.getSubtotal());
            return iDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}
