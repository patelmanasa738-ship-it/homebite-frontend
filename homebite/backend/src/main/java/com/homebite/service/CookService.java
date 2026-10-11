package com.homebite.service;

import com.homebite.dto.CookProfileDto;
import com.homebite.exception.ResourceNotFoundException;
import com.homebite.model.CookProfile;
import com.homebite.repository.CookProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CookService {

    private final CookProfileRepository cookProfileRepository;

    public CookService(CookProfileRepository cookProfileRepository) {
        this.cookProfileRepository = cookProfileRepository;
    }

    public List<CookProfileDto> getAllCooks() {
        return cookProfileRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CookProfileDto getCookById(Long id) {
        CookProfile cook = cookProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cook not found with id: " + id));
        return mapToDto(cook);
    }

    private CookProfileDto mapToDto(CookProfile cook) {
        CookProfileDto dto = new CookProfileDto();
        dto.setId(cook.getId());
        dto.setUserId(cook.getUser().getId());
        dto.setCookName(cook.getUser().getFullName());
        dto.setKitchenName(cook.getKitchenName());
        dto.setBio(cook.getBio());
        dto.setSpecialty(cook.getSpecialty());
        dto.setKitchenAddress(cook.getKitchenAddress());
        dto.setIsVerified(cook.getIsVerified());
        dto.setRatingAvg(cook.getRatingAvg());
        dto.setRatingCount(cook.getRatingCount());
        dto.setBannerUrl(cook.getBannerUrl());
        dto.setAvatarUrl(cook.getUser().getAvatarUrl());
        dto.setCreatedAt(cook.getCreatedAt());
        return dto;
    }
}
