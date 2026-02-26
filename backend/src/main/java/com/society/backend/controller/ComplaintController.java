package com.society.backend.controller;

import com.society.backend.dto.ComplaintDto;
import com.society.backend.model.Complaint;
import com.society.backend.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    // Route for Residents to post an issue
    @PostMapping
    public ResponseEntity<?> createComplaint(@Valid @RequestBody ComplaintDto dto) {
        try {
            Complaint complaint = complaintService.createComplaint(dto);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Route for Admins to view the society's dashboard
    @GetMapping("/society/{societyId}")
    public ResponseEntity<List<Complaint>> getComplaints(@PathVariable Long societyId) {
        return ResponseEntity.ok(complaintService.getComplaintsBySociety(societyId));
    }

    // Resident upvotes a complaint
    @PostMapping("/{complaintId}/upvote/{userId}")
    public ResponseEntity<?> upvoteComplaint(@PathVariable Long complaintId, @PathVariable Long userId) {
        try {
            Complaint updatedComplaint = complaintService.upvoteComplaint(complaintId, userId);
            return ResponseEntity.ok(updatedComplaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin updates the status (e.g., marks it RESOLVED)
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long complaintId, @RequestParam String status) {
        try {
            Complaint updatedComplaint = complaintService.updateComplaintStatus(complaintId, status);
            return ResponseEntity.ok(updatedComplaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/assign/{vendorId}")
    public ResponseEntity<Complaint> assignVendor(
            @PathVariable Long id, 
            @PathVariable Long vendorId) {
        try {
            Complaint updatedComplaint = complaintService.assignVendor(id, vendorId);
            return ResponseEntity.ok(updatedComplaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}