package com.jalrakshak.repository;

import com.jalrakshak.entity.RecommendationInput;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RecommendationInputRepository extends JpaRepository<RecommendationInput, UUID> {
    Page<RecommendationInput> findByFarmId(UUID farmId, Pageable pageable);
    
    Page<RecommendationInput> findByCropCycleId(UUID cropCycleId, Pageable pageable);
}