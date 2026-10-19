package com.jalrakshak.dto;

import com.jalrakshak.entity.Recommendation;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationDto {
    private UUID id;
    private UUID farmId;
    private UUID cropCycleId;
    private UUID requestedBy;
    private Recommendation.RecommendationType recommendation;
    private BigDecimal confidence;
    private String reasoning;
    private BigDecimal irrigationAmountMm;
    private Instant scheduledFor;
    private Instant executedAt;
    private UUID executedBy;
    private Recommendation.Status status;
    private String modelVersion;
    private UUID inputSnapshotId;
    private Instant createdAt;
    private Instant updatedAt;

    public static RecommendationDto fromEntity(Recommendation recommendation) {
        if (recommendation == null) return null;
        return RecommendationDto.builder()
                .id(recommendation.getId())
                .farmId(recommendation.getFarm() != null ? recommendation.getFarm().getId() : null)
                .cropCycleId(recommendation.getCropCycle() != null ? recommendation.getCropCycle().getId() : null)
                .requestedBy(recommendation.getRequestedBy() != null ? recommendation.getRequestedBy().getId() : null)
                .recommendation(recommendation.getRecommendation())
                .confidence(recommendation.getConfidence())
                .reasoning(recommendation.getReasoning())
                .irrigationAmountMm(recommendation.getIrrigationAmountMm())
                .scheduledFor(recommendation.getScheduledFor())
                .executedAt(recommendation.getExecutedAt())
                .executedBy(recommendation.getExecutedBy() != null ? recommendation.getExecutedBy().getId() : null)
                .status(recommendation.getStatus())
                .modelVersion(recommendation.getModelVersion())
                .inputSnapshotId(recommendation.getInputSnapshotId())
                .createdAt(recommendation.getCreatedAt())
                .updatedAt(recommendation.getUpdatedAt())
                .build();
    }
}