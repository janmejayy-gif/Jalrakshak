package com.jalrakshak.repository;

import com.jalrakshak.entity.WeatherObservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface WeatherObservationRepository extends JpaRepository<WeatherObservation, UUID> {
    Page<WeatherObservation> findByFarmId(UUID farmId, Pageable pageable);
    
    List<WeatherObservation> findByFarmIdAndObservedAtBetween(UUID farmId, Instant start, Instant end);
    
    @Query("SELECT w FROM WeatherObservation w WHERE w.farm.id = :farmId ORDER BY w.observedAt DESC")
    List<WeatherObservation> findLatestByFarmId(@Param("farmId") UUID farmId, Pageable pageable);
}