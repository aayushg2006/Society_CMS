package com.society.backend.service;

import com.society.backend.dto.SocietyDto;
import com.society.backend.dto.SocietyUpdateDto;
import com.society.backend.model.Society;
import com.society.backend.repository.SocietyRepository;
import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Lombok injects the Repository automatically
public class SocietyService {

    private final SocietyRepository societyRepository;

    public Society registerSociety(SocietyDto dto) {
        // 1. Check if society already exists
        if (societyRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("Society with this name already exists!");
        }

        // 2. Create new Society Entity
        Society society = new Society();
        society.setName(dto.getName());
        society.setAddress(dto.getAddress());
        society.setSubscriptionStatus("ACTIVE");

        // 3. Save to Database
        return societyRepository.save(society);
    }

    // Add this new method
    public Society updateSociety(Long id, SocietyUpdateDto dto) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Society not found"));
        
        if (dto.getName() != null) society.setName(dto.getName());
        if (dto.getAddress() != null) society.setAddress(dto.getAddress());
        if (dto.getRegistrationNumber() != null) society.setRegistrationNumber(dto.getRegistrationNumber());
        if (dto.getTotalWings() != null) society.setTotalWings(dto.getTotalWings());
        if (dto.getTotalFloors() != null) society.setTotalFloors(dto.getTotalFloors());
        if (dto.getTotalFlats() != null) society.setTotalFlats(dto.getTotalFlats());
        if (dto.getAmenities() != null) society.setAmenities(dto.getAmenities());
        
        return societyRepository.save(society);
    }

    // Inside SocietyService.java
    public Society getSocietyById(Long id) {
        return societyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Society not found with id: " + id));
    }
}