package com.society.backend.repository;

import com.society.backend.model.Complaint;
import com.society.backend.model.ComplaintVote;
import com.society.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintVoteRepository extends JpaRepository<ComplaintVote, Long> {
    // Check if this specific user already voted on this specific complaint
    boolean existsByComplaintAndUser(Complaint complaint, User user);
}