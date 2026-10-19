package com.jalrakshak.dto;

import com.jalrakshak.entity.CropCycle;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropCycleCreateRequest {
    @NotNull
    private UUID farmId;

    @NotBlank
    @Size(max = 100)
    private String cropType;

    @Size(max = 100)
    private String variety;

    @NotNull
    private LocalDate plantingDate;

    private LocalDate expectedHarvestDate;

    @NotNull
    private CropCycle.GrowthStage growthStage = CropCycle.GrowthStage.GERMINATION;

    @NotNull
    @DecimalMin("0.0")
    @Digits(integer = 6, fraction = 4)
    private BigDecimal areaHectares;

    @Size(max = 50)
    private String irrigationMethod;

    @Size(max = 2000)
    private String notes;
}