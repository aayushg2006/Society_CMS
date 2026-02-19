package com.society.backend.repository;

import com.society.backend.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    // Custom query to find a society by name (to prevent duplicates)
    Optional<Society> findByName(String name);
}