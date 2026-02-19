package com.society.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserDto {
    @NotNull(message = "Society ID is required") // Changed from NotBlank to NotNull
    private Long societyId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required (ADMIN, RESIDENT, VENDOR)")
    private String role;
    
    private String phoneNumber;
    private String flatNo; // Optional for Admins/Vendors
}