package com.society.backend.service;

import com.society.backend.dto.SocietyDto;
import com.society.backend.model.Society;
import com.society.backend.repository.SocietyRepository;
import lombok.RequiredArgsConstructor;
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
}