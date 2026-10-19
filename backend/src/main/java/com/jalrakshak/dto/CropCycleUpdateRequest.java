package com.jalrakshak.dto;

import com.jalrakshak.entity.CropCycle;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropCycleUpdateRequest {
    @Size(max = 100)
    private String cropType;

    @Size(max = 100)
    private String variety;

    private LocalDate expectedHarvestDate;

    private LocalDate actualHarvestDate;

    private CropCycle.GrowthStage growthStage;

    @DecimalMin("0.0")
    @Digits(integer = 6, fraction = 4)
    private BigDecimal areaHectares;

    @Size(max = 50)
    private String irrigationMethod;

    @Size(max = 2000)
    private String notes;
}