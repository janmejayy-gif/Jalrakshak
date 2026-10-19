package com.jalrakshak.dto;

import com.jalrakshak.entity.FarmerFeedback;
import com.jalrakshak.entity.Recommendation;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerFeedbackDto {
    private UUID id;
    private UUID recommendationId;
    private UUID farmerId;
    private Integer rating;
    private String feedbackText;
    private Recommendation.RecommendationType actualOutcome;
    private Boolean wasHelpful;
    private Instant createdAt;

    public static FarmerFeedbackDto fromEntity(FarmerFeedback feedback) {
        if (feedback == null) return null;
        return FarmerFeedbackDto.builder()
                .id(feedback.getId())
                .recommendationId(feedback.getRecommendation() != null ? feedback.getRecommendation().getId() : null)
                .farmerId(feedback.getFarmer() != null ? feedback.getFarmer().getId() : null)
                .rating(feedback.getRating())
                .feedbackText(feedback.getFeedbackText())
                .actualOutcome(feedback.getActualOutcome())
                .wasHelpful(feedback.getWasHelpful())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}