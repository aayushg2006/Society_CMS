package com.society.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SocietyDto {
    @NotBlank(message = "Society name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;
    
    private String contactNumber;
}