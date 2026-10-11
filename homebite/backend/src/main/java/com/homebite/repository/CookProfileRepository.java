package com.homebite.repository;

import com.homebite.model.CookProfile;
import com.homebite.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CookProfileRepository extends JpaRepository<CookProfile, Long> {
    Optional<CookProfile> findByUser(User user);
    Optional<CookProfile> findByUserId(Long userId);
}
