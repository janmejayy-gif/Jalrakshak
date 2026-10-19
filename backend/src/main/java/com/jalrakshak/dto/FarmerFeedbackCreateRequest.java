package com.jalrakshak.dto;

import com.jalrakshak.entity.Recommendation;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerFeedbackCreateRequest {
    @NotNull
    private UUID recommendationId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @Size(max = 5000)
    private String feedbackText;

    private Recommendation.RecommendationType actualOutcome;

    private Boolean wasHelpful;
}