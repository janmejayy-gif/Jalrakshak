package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "crop_cycles", indexes = {
    @Index(name = "idx_crop_cycles_farm_id", columnList = "farm_id"),
    @Index(name = "idx_crop_cycles_planting_date", columnList = "plantingDate"),
    @Index(name = "idx_crop_cycles_growth_stage", columnList = "growthStage")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropCycle {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Column(name = "crop_type", nullable = false, length = 100)
    private String cropType;

    @Column(name = "variety", length = 100)
    private String variety;

    @Column(name = "planting_date", nullable = false)
    private LocalDate plantingDate;

    @Column(name = "expected_harvest_date")
    private LocalDate expectedHarvestDate;

    @Column(name = "actual_harvest_date")
    private LocalDate actualHarvestDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "growth_stage", nullable = false, length = 50)
    private GrowthStage growthStage;

    @Column(name = "area_hectares", nullable = false, precision = 10, scale = 4)
    private BigDecimal areaHectares;

    @Column(name = "irrigation_method", length = 50)
    private String irrigationMethod;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum GrowthStage {
        GERMINATION, VEGETATIVE, FLOWERING, FRUITING, MATURITY, HARVESTED
    }
}