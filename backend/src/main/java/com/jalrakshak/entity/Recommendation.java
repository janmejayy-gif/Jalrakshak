package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recommendations", indexes = {
    @Index(name = "idx_recommendations_farm_id", columnList = "farm_id"),
    @Index(name = "idx_recommendations_crop_cycle_id", columnList = "crop_cycle_id"),
    @Index(name = "idx_recommendations_requested_by", columnList = "requested_by"),
    @Index(name = "idx_recommendations_created_at", columnList = "createdAt"),
    @Index(name = "idx_recommendations_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crop_cycle_id")
    private CropCycle cropCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation", nullable = false, length = 30)
    private RecommendationType recommendation;

    @Column(name = "confidence", nullable = false, precision = 4, scale = 3)
    private BigDecimal confidence;

    @Column(name = "reasoning", nullable = false, columnDefinition = "TEXT")
    private String reasoning;

    @Column(name = "irrigation_amount_mm", precision = 8, scale = 2)
    private BigDecimal irrigationAmountMm;

    @Column(name = "scheduled_for")
    private Instant scheduledFor;

    @Column(name = "executed_at")
    private Instant executedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executed_by")
    private User executedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "input_snapshot_id")
    private UUID inputSnapshotId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public enum RecommendationType {
        IRRIGATE, WAIT, PARTIAL_IRRIGATION, INSUFFICIENT_DATA
    }

    public enum Status {
        PENDING, EXECUTED, CANCELLED, EXPIRED
    }
}