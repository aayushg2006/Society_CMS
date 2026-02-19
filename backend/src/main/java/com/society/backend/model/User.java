package com.society.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This connects the User to a Society
    @ManyToOne
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(nullable = false)
    private String role; // ADMIN, RESIDENT, VENDOR, GUARD

    @Column(name = "flat_no")
    private String flatNo; // Can be null for Vendors

    @Column(name = "password") // We will hash this later
    private String password;

    @Column(name = "reputation_score")
    private int reputationScore = 100;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}