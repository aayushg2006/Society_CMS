package com.society.backend.service;

import com.society.backend.dto.ComplaintDto;
import com.society.backend.model.Complaint;
import com.society.backend.model.ComplaintVote;
import com.society.backend.model.Society;
import com.society.backend.model.User;
import com.society.backend.repository.ComplaintRepository;
import com.society.backend.repository.ComplaintVoteRepository;
import com.society.backend.repository.SocietyRepository;
import com.society.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map; // FIXED: Changed from org.hibernate.mapping.Map

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final ComplaintVoteRepository complaintVoteRepository;
    private final AiValidationService aiValidationService;

    // 1. Create a new complaint (Now with AI included)
    public Complaint createComplaint(ComplaintDto dto) {
        Society society = societyRepository.findById(dto.getSocietyId())
                .orElseThrow(() -> new RuntimeException("Society not found"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setSociety(society);
        complaint.setUser(user);
        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setCategory(dto.getCategory().toUpperCase());
        complaint.setSeverity(dto.getSeverity().toUpperCase());
        complaint.setImageUrl(dto.getImageUrl());

        // --- AI VALIDATION LOGIC ---
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            Map<String, Object> aiResult = aiValidationService.verifyComplaintMedia(
                    dto.getImageUrl(), 
                    dto.getCategory(), 
                    dto.getDescription()
            );

            if (aiResult != null) {
                Boolean isValid = (Boolean) aiResult.get("is_valid");
                String aiReasoning = (String) aiResult.get("ai_reasoning");

                if (isValid != null && !isValid) {
                    // If AI says it's fake, reject it immediately!
                    throw new RuntimeException("AI Verification Failed: " + aiReasoning);
                } else {
                    // If AI says it's real, pre-approve it to save time!
                    complaint.setStatus("OPEN"); 
                }
            }
        }
        // -------------------------------

        return complaintRepository.save(complaint);
    }

    // 2. Get all complaints for a specific society
    public List<Complaint> getComplaintsBySociety(Long societyId) {
        return complaintRepository.findBySocietyId(societyId);
    }

    // 3. Upvote a Complaint
    public Complaint upvoteComplaint(Long complaintId, Long userId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already voted
        if (complaintVoteRepository.existsByComplaintAndUser(complaint, user)) {
            throw new RuntimeException("You have already voted on this complaint.");
        }

        // Save the vote record
        ComplaintVote vote = new ComplaintVote();
        vote.setComplaint(complaint);
        vote.setUser(user);
        complaintVoteRepository.save(vote);

        // Increment the count on the complaint itself
        complaint.setUpvotes(complaint.getUpvotes() + 1);

        // Auto-Escalation Logic: If it gets 3 upvotes, make it an ACTIVE ticket
        if (complaint.getUpvotes() >= 3 && complaint.getStatus().equals("PENDING_VERIFICATION")) {
            complaint.setStatus("OPEN");
        }

        return complaintRepository.save(complaint);
    }

    // 4. Admin Updates Status
    public Complaint updateComplaintStatus(Long complaintId, String newStatus) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(newStatus.toUpperCase());
        return complaintRepository.save(complaint);
    }
}