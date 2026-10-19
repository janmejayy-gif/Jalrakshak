package com.jalrakshak.repository;

import com.jalrakshak.entity.SensorReading;
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
public interface SensorReadingRepository extends JpaRepository<SensorReading, UUID> {
    Page<SensorReading> findByFarmId(UUID farmId, Pageable pageable);
    
    Page<SensorReading> findByCropCycleId(UUID cropCycleId, Pageable pageable);
    
    List<SensorReading> findByFarmIdAndSensorTypeAndRecordedAtBetween(
            UUID farmId, 
            SensorReading.SensorType sensorType, 
            Instant start, 
            Instant end);
    
    @Query("SELECT s FROM SensorReading s WHERE s.farm.id = :farmId AND s.sensorType = :sensorType ORDER BY s.recordedAt DESC")
    List<SensorReading> findLatestByFarmIdAndSensorType(
            @Param("farmId") UUID farmId, 
            @Param("sensorType") SensorReading.SensorType sensorType, 
            Pageable pageable);
}