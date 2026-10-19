package com.jalrakshak.repository;

import com.jalrakshak.entity.CropCycle;
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
public interface CropCycleRepository extends JpaRepository<CropCycle, UUID> {
    Page<CropCycle> findByFarmId(UUID farmId, Pageable pageable);
    
    List<CropCycle> findByFarmId(UUID farmId);
    
    @Query("SELECT c FROM CropCycle c WHERE c.farm.id = :farmId AND c.id = :cropCycleId")
    Optional<CropCycle> findByFarmIdAndId(@Param("farmId") UUID farmId, @Param("cropCycleId") UUID cropCycleId);
    
    List<CropCycle> findByFarmIdAndGrowthStage(UUID farmId, CropCycle.GrowthStage growthStage);
}