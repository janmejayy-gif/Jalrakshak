package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "weather_observations", indexes = {
    @Index(name = "idx_weather_observations_farm_id", columnList = "farm_id"),
    @Index(name = "idx_weather_observations_observed_at", columnList = "observedAt"),
    @Index(name = "idx_weather_observations_source", columnList = "source")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherObservation {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(name = "observed_at", nullable = false)
    private Instant observedAt;

    @Column(name = "temperature_celsius", precision = 5, scale = 2)
    private BigDecimal temperatureCelsius;

    @Column(name = "humidity_percent", precision = 5, scale = 2)
    private BigDecimal humidityPercent;

    @Column(name = "rainfall_mm", precision = 8, scale = 2)
    private BigDecimal rainfallMm;

    @Column(name = "wind_speed_kmh", precision = 6, scale = 2)
    private BigDecimal windSpeedKmh;

    @Column(name = "wind_direction_degrees")
    private Integer windDirectionDegrees;

    @Column(name = "solar_radiation_wm2", precision = 8, scale = 2)
    private BigDecimal solarRadiationWm2;

    @Column(name = "pressure_hpa", precision = 7, scale = 2)
    private BigDecimal pressureHpa;

    @Column(name = "cloud_cover_percent", precision = 5, scale = 2)
    private BigDecimal cloudCoverPercent;

    @Column(name = "source", nullable = false, length = 50)
    private String source;

    @Column(name = "raw_data", columnDefinition = "JSONB")
    private String rawData;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}