package com.jalrakshak.controller;

import com.jalrakshak.dto.ExecuteRecommendationRequest;
import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.dto.RecommendationDto;
import com.jalrakshak.dto.RecommendationInputDto;
import com.jalrakshak.dto.RecommendationRequest;
import com.jalrakshak.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<RecommendationDto> requestRecommendation(@RequestAttribute("userId") UUID userId,
                                                                    @Valid @RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.requestRecommendation(userId, request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<RecommendationDto>> getByFarm(@RequestAttribute("userId") UUID userId,
                                                                      @RequestParam UUID farmId,
                                                                      @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(recommendationService.getByFarm(farmId, userId, pageable));
    }

    @GetMapping("/crop-cycle/{cropCycleId}")
    public ResponseEntity<PageResponse<RecommendationDto>> getByCropCycle(@RequestAttribute("userId") UUID userId,
                                                                           @PathVariable UUID cropCycleId,
                                                                           @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(recommendationService.getByCropCycle(cropCycleId, userId, pageable));
    }

    @GetMapping("/{recommendationId}")
    public ResponseEntity<RecommendationDto> getById(@RequestAttribute("userId") UUID userId,
                                                      @PathVariable UUID recommendationId) {
        return ResponseEntity.ok(recommendationService.getById(recommendationId, userId));
    }

    @PostMapping("/{recommendationId}/execute")
    public ResponseEntity<RecommendationDto> executeRecommendation(@RequestAttribute("userId") UUID userId,
                                                                    @PathVariable UUID recommendationId,
                                                                    @Valid @RequestBody ExecuteRecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.executeRecommendation(recommendationId, userId, request.getExecutedBy()));
    }

    @GetMapping("/{recommendationId}/input-snapshot")
    public ResponseEntity<RecommendationInputDto> getInputSnapshot(@RequestAttribute("userId") UUID userId,
                                                                    @PathVariable UUID recommendationId) {
        RecommendationDto recommendation = recommendationService.getById(recommendationId, userId);
        if (recommendation.getInputSnapshotId() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(recommendationService.getInputSnapshot(recommendation.getInputSnapshotId(), userId));
    }
}