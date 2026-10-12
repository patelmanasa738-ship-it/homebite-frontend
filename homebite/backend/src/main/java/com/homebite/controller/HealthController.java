package com.homebite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("app", "HomeBite Backend API");
        status.put("status", "UP");
        status.put("database", "PostgreSQL");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("app", "HomeBite Backend API");
        status.put("status", "UP");
        status.put("database", "PostgreSQL");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }
}
