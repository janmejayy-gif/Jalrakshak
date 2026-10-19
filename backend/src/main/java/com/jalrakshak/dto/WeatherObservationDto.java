package com.jalrakshak.dto;

import com.jalrakshak.entity.WeatherObservation;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherObservationDto {
    private UUID id;
    private UUID farmId;
    private Instant observedAt;
    private BigDecimal temperatureCelsius;
    private BigDecimal humidityPercent;
    private BigDecimal rainfallMm;
    private BigDecimal windSpeedKmh;
    private Integer windDirectionDegrees;
    private BigDecimal solarRadiationWm2;
    private BigDecimal pressureHpa;
    private BigDecimal cloudCoverPercent;
    private String source;
    private String rawData;
    private Instant createdAt;

    public static WeatherObservationDto fromEntity(WeatherObservation observation) {
        if (observation == null) return null;
        return WeatherObservationDto.builder()
                .id(observation.getId())
                .farmId(observation.getFarm() != null ? observation.getFarm().getId() : null)
                .observedAt(observation.getObservedAt())
                .temperatureCelsius(observation.getTemperatureCelsius())
                .humidityPercent(observation.getHumidityPercent())
                .rainfallMm(observation.getRainfallMm())
                .windSpeedKmh(observation.getWindSpeedKmh())
                .windDirectionDegrees(observation.getWindDirectionDegrees())
                .solarRadiationWm2(observation.getSolarRadiationWm2())
                .pressureHpa(observation.getPressureHpa())
                .cloudCoverPercent(observation.getCloudCoverPercent())
                .source(observation.getSource())
                .rawData(observation.getRawData())
                .createdAt(observation.getCreatedAt())
                .build();
    }
}