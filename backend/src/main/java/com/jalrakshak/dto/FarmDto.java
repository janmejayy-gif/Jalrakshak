package com.jalrakshak.dto;

import com.jalrakshak.entity.Farm;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmDto {
    private UUID id;
    private UUID ownerId;
    private String name;
    private String description;
    private BigDecimal locationLatitude;
    private BigDecimal locationLongitude;
    private String address;
    private BigDecimal totalAreaHectares;
    private String soilType;
    private Instant createdAt;
    private Instant updatedAt;

    public static FarmDto fromEntity(Farm farm) {
        if (farm == null) return null;
        return FarmDto.builder()
                .id(farm.getId())
                .ownerId(farm.getOwner() != null ? farm.getOwner().getId() : null)
                .name(farm.getName())
                .description(farm.getDescription())
                .locationLatitude(farm.getLocationLatitude())
                .locationLongitude(farm.getLocationLongitude())
                .address(farm.getAddress())
                .totalAreaHectares(farm.getTotalAreaHectares())
                .soilType(farm.getSoilType())
                .createdAt(farm.getCreatedAt())
                .updatedAt(farm.getUpdatedAt())
                .build();
    }
}