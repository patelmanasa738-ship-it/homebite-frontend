package com.homebite.service;

import com.homebite.dto.*;
import com.homebite.exception.BadRequestException;
import com.homebite.exception.UnauthorizedException;
import com.homebite.model.Cart;
import com.homebite.model.CookProfile;
import com.homebite.model.Role;
import com.homebite.model.User;
import com.homebite.repository.CartRepository;
import com.homebite.repository.CookProfileRepository;
import com.homebite.repository.UserRepository;
import com.homebite.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CookProfileRepository cookProfileRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(
            UserRepository userRepository,
            CookProfileRepository cookProfileRepository,
            CartRepository cartRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils
    ) {
        this.userRepository = userRepository;
        this.cookProfileRepository = cookProfileRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse registerCustomer(RegisterCustomerRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhoneNumber(),
                Role.CUSTOMER
        );
        user = userRepository.save(user);

        // Initialize empty cart for customer
        Cart cart = new Cart(user);
        cartRepository.save(cart);

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), null);
    }

    @Transactional
    public AuthResponse registerCook(RegisterCookRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = new User(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhoneNumber(),
                Role.COOK
        );
        user = userRepository.save(user);

        CookProfile cookProfile = new CookProfile();
        cookProfile.setUser(user);
        cookProfile.setKitchenName(request.getKitchenName());
        cookProfile.setSpecialty(request.getSpecialty());
        cookProfile.setBio(request.getBio());
        cookProfile.setKitchenAddress(request.getKitchenAddress());
        cookProfile = cookProfileRepository.save(cookProfile);

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), cookProfile.getId());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        Long cookProfileId = null;
        if (user.getRole() == Role.COOK) {
            cookProfileId = cookProfileRepository.findByUserId(user.getId())
                    .map(CookProfile::getId)
                    .orElse(null);
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), cookProfileId);
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User session is invalid"));

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getRole() == Role.COOK) {
            cookProfileRepository.findByUserId(user.getId())
                    .ifPresent(cp -> dto.setCookProfileId(cp.getId()));
        }

        return dto;
    }
}
