package com.jalrakshak.dto;

import com.jalrakshak.entity.CropCycle;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropCycleDto {
    private UUID id;
    private UUID farmId;
    private String cropType;
    private String variety;
    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;
    private LocalDate actualHarvestDate;
    private CropCycle.GrowthStage growthStage;
    private BigDecimal areaHectares;
    private String irrigationMethod;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static CropCycleDto fromEntity(CropCycle cropCycle) {
        if (cropCycle == null) return null;
        return CropCycleDto.builder()
                .id(cropCycle.getId())
                .farmId(cropCycle.getFarm() != null ? cropCycle.getFarm().getId() : null)
                .cropType(cropCycle.getCropType())
                .variety(cropCycle.getVariety())
                .plantingDate(cropCycle.getPlantingDate())
                .expectedHarvestDate(cropCycle.getExpectedHarvestDate())
                .actualHarvestDate(cropCycle.getActualHarvestDate())
                .growthStage(cropCycle.getGrowthStage())
                .areaHectares(cropCycle.getAreaHectares())
                .irrigationMethod(cropCycle.getIrrigationMethod())
                .notes(cropCycle.getNotes())
                .createdAt(cropCycle.getCreatedAt())
                .updatedAt(cropCycle.getUpdatedAt())
                .build();
    }
}