package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sensor_readings", indexes = {
    @Index(name = "idx_sensor_readings_farm_id", columnList = "farm_id"),
    @Index(name = "idx_sensor_readings_crop_cycle_id", columnList = "crop_cycle_id"),
    @Index(name = "idx_sensor_readings_recorded_at", columnList = "recordedAt"),
    @Index(name = "idx_sensor_readings_sensor_type", columnList = "sensorType")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReading {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_cycle_id")
    private CropCycle cropCycle;

    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "sensor_type", nullable = false, length = 50)
    private SensorType sensorType;

    @Column(name = "value", nullable = false, precision = 10, scale = 4)
    private BigDecimal value;

    @Column(name = "unit", nullable = false, length = 20)
    private String unit;

    @Column(name = "sensor_id", length = 100)
    private String sensorId;

    @Column(name = "depth_cm", precision = 5, scale = 2)
    private BigDecimal depthCm;

    @Column(name = "raw_data", columnDefinition = "JSONB")
    private String rawData;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public enum SensorType {
        SOIL_MOISTURE, SOIL_TEMPERATURE, SOIL_EC, SOIL_PH, LEAF_WETNESS, PAR
    }
}