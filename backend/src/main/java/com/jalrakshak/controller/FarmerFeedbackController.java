package com.jalrakshak.controller;

import com.jalrakshak.dto.FarmerFeedbackDto;
import com.jalrakshak.dto.FarmerFeedbackCreateRequest;
import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.service.FarmerFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FarmerFeedbackController {

    private final FarmerFeedbackService farmerFeedbackService;

    @PostMapping
    public ResponseEntity<FarmerFeedbackDto> create(@RequestAttribute("userId") UUID userId,
                                                     @Valid @RequestBody FarmerFeedbackCreateRequest request) {
        return ResponseEntity.ok(farmerFeedbackService.create(userId, request));
    }

    @GetMapping("/recommendation/{recommendationId}")
    public ResponseEntity<PageResponse<FarmerFeedbackDto>> getByRecommendation(@RequestAttribute("userId") UUID userId,
                                                                                @PathVariable UUID recommendationId,
                                                                                @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(farmerFeedbackService.getByRecommendation(recommendationId, userId, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<PageResponse<FarmerFeedbackDto>> getMyFeedback(@RequestAttribute("userId") UUID userId,
                                                                          @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(farmerFeedbackService.getByFarmer(userId, pageable));
    }
}