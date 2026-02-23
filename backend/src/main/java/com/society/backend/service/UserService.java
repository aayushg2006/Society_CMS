package com.society.backend.service;

import com.society.backend.dto.LoginRequest;
import com.society.backend.dto.LoginResponse;
import com.society.backend.dto.UserDto;
import com.society.backend.model.Society;
import com.society.backend.model.User;
import com.society.backend.repository.SocietyRepository;
import com.society.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.society.backend.dto.LoginRequest;
import com.society.backend.dto.LoginResponse;
import com.society.backend.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SocietyRepository societyRepository;
    private final PasswordEncoder passwordEncoder; // From SecurityConfig
    private final JwtUtil jwtUtil;

    public User registerUser(UserDto dto) {
        // 1. Check if email exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 2. Find the Society
        Society society = societyRepository.findById(dto.getSocietyId())
                .orElseThrow(() -> new RuntimeException("Society not found!"));

        // 3. Create User Entity
        User user = new User();
        user.setSociety(society);
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole(dto.getRole().toUpperCase()); // Ensure uppercase
        user.setFlatNo(dto.getFlatNo());
        
        // 4. Encrypt Password
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        // 1. Find User
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        return new LoginResponse(token, user.getFullName(), user.getRole());
    }
    // Fetch all users for a specific society
    public List<User> getUsersBySociety(Long societyId) {
        return userRepository.findBySocietyId(societyId);
    }
}