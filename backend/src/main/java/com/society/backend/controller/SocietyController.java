package com.society.backend.controller;

import com.society.backend.dto.SocietyDto;
import com.society.backend.model.Society;
import com.society.backend.service.SocietyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/societies")
@RequiredArgsConstructor
public class SocietyController {

    private final SocietyService societyService;

    @PostMapping("/register")
    public ResponseEntity<?> registerSociety(@Valid @RequestBody SocietyDto dto) {
        try {
            Society newSociety = societyService.registerSociety(dto);
            return ResponseEntity.ok(newSociety);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Add this endpoint
    @PutMapping("/{id}")
    public ResponseEntity<Society> updateSociety(
            @PathVariable Long id, 
            @RequestBody com.society.backend.dto.SocietyUpdateDto dto) {
        return ResponseEntity.ok(societyService.updateSociety(id, dto));
    }

    // Add this missing endpoint to fetch society details
    @GetMapping("/{id}")
    public ResponseEntity<Society> getSociety(@PathVariable Long id) {
        // Assuming you have a getSocietyById method in your SocietyService
        return ResponseEntity.ok(societyService.getSocietyById(id));
    }
}