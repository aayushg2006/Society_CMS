package com.society.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "societies")
@Data // Lombok automatically generates Getters, Setters, and toString
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "subscription_status")
    private String subscriptionStatus = "ACTIVE"; // ACTIVE, EXPIRED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    private String registrationNumber;
    private Integer totalWings;
    private Integer totalFloors;
    private Integer totalFlats;

    // This tells Hibernate to create a separate small table just for the list of amenities
    @ElementCollection
    @CollectionTable(name = "society_amenities", joinColumns = @JoinColumn(name = "society_id"))
    @Column(name = "amenity")
    private List<String> amenities;
}