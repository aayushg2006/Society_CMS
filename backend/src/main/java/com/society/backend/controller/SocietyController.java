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
}