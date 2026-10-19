package com.jalrakshak.service;

import com.jalrakshak.dto.FarmerFeedbackDto;
import com.jalrakshak.dto.FarmerFeedbackCreateRequest;
import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.entity.FarmerFeedback;
import com.jalrakshak.entity.Recommendation;
import com.jalrakshak.exception.ForbiddenException;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.FarmerFeedbackRepository;
import com.jalrakshak.repository.RecommendationRepository;
import com.jalrakshak.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FarmerFeedbackService {

    private final FarmerFeedbackRepository farmerFeedbackRepository;
    private final RecommendationRepository recommendationRepository;
    private final FarmService farmService;

    @Transactional
    public FarmerFeedbackDto create(UUID farmerId, FarmerFeedbackCreateRequest request) {
        Recommendation recommendation = recommendationRepository.findById(request.getRecommendationId())
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation", "id", request.getRecommendationId()));
        
        // Verify the farmer owns the farm associated with the recommendation
        farmService.verifyOwnership(recommendation.getFarm().getId(), farmerId);
        
        // Check if feedback already exists
        if (farmerFeedbackRepository.existsByRecommendationIdAndFarmerId(request.getRecommendationId(), farmerId)) {
            throw new IllegalArgumentException("Feedback already exists for this recommendation");
        }
        
        FarmerFeedback feedback = FarmerFeedback.builder()
                .recommendation(recommendation)
                .farmer(getUserEntity(farmerId))
                .rating(request.getRating())
                .feedbackText(request.getFeedbackText())
                .actualOutcome(request.getActualOutcome())
                .wasHelpful(request.getWasHelpful())
                .build();
        
        return FarmerFeedbackDto.fromEntity(farmerFeedbackRepository.save(feedback));
    }

    public PageResponse<FarmerFeedbackDto> getByRecommendation(UUID recommendationId, UUID ownerId, Pageable pageable) {
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation", "id", recommendationId));
        
        farmService.verifyOwnership(recommendation.getFarm().getId(), ownerId);
        
        Page<FarmerFeedback> page = farmerFeedbackRepository.findByRecommendationId(recommendationId, pageable);
        return PageResponse.of(page.map(FarmerFeedbackDto::fromEntity));
    }

    public PageResponse<FarmerFeedbackDto> getByFarmer(UUID farmerId, Pageable pageable) {
        Page<FarmerFeedback> page = farmerFeedbackRepository.findByFarmerId(farmerId, pageable);
        return PageResponse.of(page.map(FarmerFeedbackDto::fromEntity));
    }

    private com.jalrakshak.entity.User getUserEntity(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private final com.jalrakshak.repository.UserRepository userRepository;
}