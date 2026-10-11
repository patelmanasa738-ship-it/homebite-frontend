package com.homebite.service;

import com.homebite.dto.AdminDashboardDto;
import com.homebite.dto.DishDto;
import com.homebite.dto.OrderDto;
import com.homebite.dto.UserDto;
import com.homebite.model.OrderStatus;
import com.homebite.model.Role;
import com.homebite.repository.CookProfileRepository;
import com.homebite.repository.DishRepository;
import com.homebite.repository.OrderRepository;
import com.homebite.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CookProfileRepository cookProfileRepository;
    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;
    private final DishService dishService;
    private final OrderService orderService;

    public AdminService(
            UserRepository userRepository,
            CookProfileRepository cookProfileRepository,
            DishRepository dishRepository,
            OrderRepository orderRepository,
            DishService dishService,
            OrderService orderService
    ) {
        this.userRepository = userRepository;
        this.cookProfileRepository = cookProfileRepository;
        this.dishRepository = dishRepository;
        this.orderRepository = orderRepository;
        this.dishService = dishService;
        this.orderService = orderService;
    }

    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto stats = new AdminDashboardDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCustomers(userRepository.findByRole(Role.CUSTOMER).size());
        stats.setTotalCooks(cookProfileRepository.count());
        stats.setTotalDishes(dishRepository.count());

        List<com.homebite.model.Order> allOrders = orderRepository.findAll();
        stats.setTotalOrders(allOrders.size());

        BigDecimal revenue = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(com.homebite.model.Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(revenue);

        long pending = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDING || o.getStatus() == OrderStatus.CONFIRMED || o.getStatus() == OrderStatus.PREPARING)
                .count();
        stats.setPendingOrders(pending);

        return stats;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            UserDto dto = new UserDto();
            dto.setId(u.getId());
            dto.setEmail(u.getEmail());
            dto.setFullName(u.getFullName());
            dto.setPhoneNumber(u.getPhoneNumber());
            dto.setRole(u.getRole());
            dto.setAvatarUrl(u.getAvatarUrl());
            dto.setCreatedAt(u.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<DishDto> getAllDishes() {
        return dishService.getAllDishes();
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(orderService::mapToDto)
                .collect(Collectors.toList());
    }
}
