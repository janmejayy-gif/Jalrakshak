package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recommendation_inputs", indexes = {
    @Index(name = "idx_recommendation_inputs_farm_id", columnList = "farm_id"),
    @Index(name = "idx_recommendation_inputs_crop_cycle_id", columnList = "crop_cycle_id"),
    @Index(name = "idx_recommendation_inputs_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationInput {

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

    @Column(name = "soil_moisture_percent", precision = 5, scale = 2)
    private BigDecimal soilMoisturePercent;

    @Column(name = "soil_temperature_celsius", precision = 5, scale = 2)
    private BigDecimal soilTemperatureCelsius;

    @Column(name = "air_temperature_celsius", precision = 5, scale = 2)
    private BigDecimal airTemperatureCelsius;

    @Column(name = "humidity_percent", precision = 5, scale = 2)
    private BigDecimal humidityPercent;

    @Column(name = "rainfall_forecast_mm", precision = 8, scale = 2)
    private BigDecimal rainfallForecastMm;

    @Column(name = "wind_speed_kmh", precision = 6, scale = 2)
    private BigDecimal windSpeedKmh;

    @Column(name = "solar_radiation_wm2", precision = 8, scale = 2)
    private BigDecimal solarRadiationWm2;

    @Column(name = "crop_stage", length = 50)
    private String cropStage;

    @Column(name = "days_since_planting")
    private Integer daysSincePlanting;

    @Column(name = "growth_stage", length = 50)
    private String growthStage;

    @Column(name = "weather_source", length = 50)
    private String weatherSource;

    @Column(name = "sensor_source", length = 50)
    private String sensorSource;

    @Column(name = "raw_payload", nullable = false, columnDefinition = "JSONB")
    private String rawPayload;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}