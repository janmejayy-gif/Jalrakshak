package com.jalrakshak.dto;

import com.jalrakshak.entity.RecommendationInput;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationInputDto {
    private UUID id;
    private UUID farmId;
    private UUID cropCycleId;
    private BigDecimal soilMoisturePercent;
    private BigDecimal soilTemperatureCelsius;
    private BigDecimal airTemperatureCelsius;
    private BigDecimal humidityPercent;
    private BigDecimal rainfallForecastMm;
    private BigDecimal windSpeedKmh;
    private BigDecimal solarRadiationWm2;
    private String cropStage;
    private Integer daysSincePlanting;
    private String growthStage;
    private String weatherSource;
    private String sensorSource;
    private String rawPayload;
    private Instant createdAt;

    public static RecommendationInputDto fromEntity(RecommendationInput input) {
        if (input == null) return null;
        return RecommendationInputDto.builder()
                .id(input.getId())
                .farmId(input.getFarm() != null ? input.getFarm().getId() : null)
                .cropCycleId(input.getCropCycle() != null ? input.getCropCycle().getId() : null)
                .soilMoisturePercent(input.getSoilMoisturePercent())
                .soilTemperatureCelsius(input.getSoilTemperatureCelsius())
                .airTemperatureCelsius(input.getAirTemperatureCelsius())
                .humidityPercent(input.getHumidityPercent())
                .rainfallForecastMm(input.getRainfallForecastMm())
                .windSpeedKmh(input.getWindSpeedKmh())
                .solarRadiationWm2(input.getSolarRadiationWm2())
                .cropStage(input.getCropStage())
                .daysSincePlanting(input.getDaysSincePlanting())
                .growthStage(input.getGrowthStage())
                .weatherSource(input.getWeatherSource())
                .sensorSource(input.getSensorSource())
                .rawPayload(input.getRawPayload())
                .createdAt(input.getCreatedAt())
                .build();
    }
}