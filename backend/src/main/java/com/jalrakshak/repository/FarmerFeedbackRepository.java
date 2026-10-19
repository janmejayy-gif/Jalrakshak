package com.jalrakshak.repository;

import com.jalrakshak.entity.FarmerFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FarmerFeedbackRepository extends JpaRepository<FarmerFeedback, UUID> {
    Page<FarmerFeedback> findByRecommendationId(UUID recommendationId, Pageable pageable);
    
    Page<FarmerFeedback> findByFarmerId(UUID farmerId, Pageable pageable);
    
    boolean existsByRecommendationIdAndFarmerId(UUID recommendationId, UUID farmerId);
}