package com.jalrakshak.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecuteRecommendationRequest {
    @NotNull
    private UUID executedBy;
}