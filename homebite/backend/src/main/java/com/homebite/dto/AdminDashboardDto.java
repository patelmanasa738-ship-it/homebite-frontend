package com.homebite.dto;

import java.math.BigDecimal;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalCustomers;
    private long totalCooks;
    private long totalDishes;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;

    public AdminDashboardDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

    public long getTotalCooks() { return totalCooks; }
    public void setTotalCooks(long totalCooks) { this.totalCooks = totalCooks; }

    public long getTotalDishes() { return totalDishes; }
    public void setTotalDishes(long totalDishes) { this.totalDishes = totalDishes; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }
}
