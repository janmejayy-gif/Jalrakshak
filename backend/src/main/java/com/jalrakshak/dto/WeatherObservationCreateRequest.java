package com.jalrakshak.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherObservationCreateRequest {
    @NotNull
    private UUID farmId;

    @NotNull
    private Instant observedAt;

    @DecimalMin("-50")
    @DecimalMax("60")
    private BigDecimal temperatureCelsius;

    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal humidityPercent;

    @DecimalMin("0")
    private BigDecimal rainfallMm;

    @DecimalMin("0")
    private BigDecimal windSpeedKmh;

    @Min(0)
    @Max(360)
    private Integer windDirectionDegrees;

    @DecimalMin("0")
    private BigDecimal solarRadiationWm2;

    @DecimalMin("800")
    @DecimalMax("1200")
    private BigDecimal pressureHpa;

    @DecimalMin("0")
    @DecimalMax("100")
    private BigDecimal cloudCoverPercent;

    @NotBlank
    @Size(max = 50)
    private String source;

    private String rawData;
}