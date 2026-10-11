package com.homebite.controller;

import com.homebite.dto.AdminDashboardDto;
import com.homebite.dto.DishDto;
import com.homebite.dto.OrderDto;
import com.homebite.dto.UserDto;
import com.homebite.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @GetMapping("/dishes")
    public ResponseEntity<List<DishDto>> getAllDishes() {
        return ResponseEntity.ok(adminService.getAllDishes());
    }
}
