package com.society.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SocietyUpdateDto {
    private String name;
    private String address;
    private String registrationNumber;
    private Integer totalWings;
    private Integer totalFloors;
    private Integer totalFlats;
    private List<String> amenities;
}