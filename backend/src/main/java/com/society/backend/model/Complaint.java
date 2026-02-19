package com.society.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "society_id", nullable = false)
    private Society society;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // The resident who posted it
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // PLUMBING, ELECTRICAL, CLEANLINESS, SECURITY

    private String status = "PENDING_VERIFICATION"; // Default status

    private String severity = "LOW"; // LOW, MEDIUM, HIGH, EMERGENCY

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    private int upvotes = 0;

    @ManyToOne
    @JoinColumn(name = "assigned_vendor_id") // Can be null initially
    private User assignedVendor;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}