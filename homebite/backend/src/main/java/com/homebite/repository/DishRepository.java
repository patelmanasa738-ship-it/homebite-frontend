package com.homebite.repository;

import com.homebite.model.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCookProfileId(Long cookProfileId);
    List<Dish> findByIsAvailableTrue();

    @Query("SELECT d FROM Dish d WHERE d.isAvailable = true AND " +
           "(:category IS NULL OR LOWER(d.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Dish> searchDishes(@Param("query") String query, @Param("category") String category);
}
