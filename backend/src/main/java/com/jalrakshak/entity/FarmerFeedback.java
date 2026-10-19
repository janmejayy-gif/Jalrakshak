package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "farmer_feedback", indexes = {
    @Index(name = "idx_farmer_feedback_recommendation_id", columnList = "recommendation_id"),
    @Index(name = "idx_farmer_feedback_farmer_id", columnList = "farmer_id"),
    @Index(name = "idx_farmer_feedback_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerFeedback {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private Recommendation recommendation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @Enumerated(EnumType.STRING)
    @Column(name = "actual_outcome", length = 30)
    private Recommendation.RecommendationType actualOutcome;

    @Column(name = "was_helpful")
    private Boolean wasHelpful;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}