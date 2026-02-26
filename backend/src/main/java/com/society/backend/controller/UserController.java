package com.society.backend.controller;

import com.society.backend.dto.UserDto;
import com.society.backend.model.User;
import com.society.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.society.backend.dto.LoginRequest;
import com.society.backend.dto.LoginResponse;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto dto) {
        try {
            User newUser = userService.registerUser(dto);
            return ResponseEntity.ok("User registered successfully: " + newUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<User>> getUsersBySociety(@PathVariable Long societyId) {
        return ResponseEntity.ok(userService.getUsersBySociety(societyId));
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }
}