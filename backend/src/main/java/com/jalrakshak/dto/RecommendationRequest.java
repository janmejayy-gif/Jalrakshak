package com.jalrakshak.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationRequest {
    @NotNull
    private UUID farmId;

    private UUID cropCycleId;

    @NotNull
    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal soilMoisturePercent;

    @DecimalMin("-50")
    @DecimalMax("60")
    private BigDecimal airTemperatureCelsius;

    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal humidityPercent;

    @DecimalMin("0")
    private BigDecimal rainfallForecastMm;

    @NotBlank
    @Size(max = 50)
    private String cropStage;

    private String growthStage;

    private Integer daysSincePlanting;

    private String weatherSource;

    private String sensorSource;
}