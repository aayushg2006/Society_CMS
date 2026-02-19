package com.society.backend.repository;

import com.society.backend.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Custom query to fetch complaints isolated by Society ID
    List<Complaint> findBySocietyId(Long societyId);
}