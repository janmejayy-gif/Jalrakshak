package com.jalrakshak.repository;

import com.jalrakshak.entity.Recommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
    Page<Recommendation> findByFarmId(UUID farmId, Pageable pageable);
    
    Page<Recommendation> findByCropCycleId(UUID cropCycleId, Pageable pageable);
    
    Page<Recommendation> findByRequestedBy(UUID requestedBy, Pageable pageable);
    
    List<Recommendation> findByFarmIdAndStatus(UUID farmId, Recommendation.Status status);
    
    @Query("SELECT r FROM Recommendation r WHERE r.farm.id = :farmId AND r.id = :recommendationId")
    Optional<Recommendation> findByFarmIdAndId(@Param("farmId") UUID farmId, @Param("recommendationId") UUID recommendationId);
}