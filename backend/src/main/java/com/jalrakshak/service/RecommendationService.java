package com.jalrakshak.service;

import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.dto.RecommendationDto;
import com.jalrakshak.dto.RecommendationInputDto;
import com.jalrakshak.dto.RecommendationRequest;
import com.jalrakshak.entity.Recommendation;
import com.jalrakshak.entity.RecommendationInput;
import com.jalrakshak.exception.ForbiddenException;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.CropCycleRepository;
import com.jalrakshak.repository.RecommendationInputRepository;
import com.jalrakshak.repository.RecommendationRepository;
import com.jalrakshak.repository.UserRepository;
import com.jalrakshak.ml.MlServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final RecommendationInputRepository recommendationInputRepository;
    private final FarmService farmService;
    private final CropCycleRepository cropCycleRepository;
    private final UserRepository userRepository;
    private final MlServiceClient mlServiceClient;

    @Transactional
    public RecommendationDto requestRecommendation(UUID ownerId, RecommendationRequest request) {
        farmService.verifyOwnership(request.getFarmId(), ownerId);
        
        // Create input snapshot
        RecommendationInput inputSnapshot = buildInputSnapshot(ownerId, request);
        RecommendationInput savedInput = recommendationInputRepository.save(inputSnapshot);
        
        // Call ML service
        MlServiceClient.IrrigationPrediction prediction = mlServiceClient.predictIrrigation(request);
        
        // Create recommendation record
        Recommendation recommendation = Recommendation.builder()
                .farm(farmService.getFarmEntity(request.getFarmId()))
                .cropCycle(request.getCropCycleId() != null ? 
                        getCropCycleEntity(request.getCropCycleId()) : null)
                .requestedBy(getUserEntity(ownerId))
                .recommendation(prediction.getRecommendation())
                .confidence(BigDecimal.valueOf(prediction.getConfidence()))
                .reasoning(prediction.getReasoning())
                .irrigationAmountMm(prediction.getIrrigationAmountMm() != null ? 
                        BigDecimal.valueOf(prediction.getIrrigationAmountMm()) : null)
                .modelVersion(prediction.getModelVersion())
                .inputSnapshotId(savedInput.getId())
                .status(Recommendation.Status.PENDING)
                .build();
        
        return RecommendationDto.fromEntity(recommendationRepository.save(recommendation));
    }

    private com.jalrakshak.entity.Farm getFarmEntity(UUID farmId) {
        return farmService.getFarmEntity(farmId);
    }

    private com.jalrakshak.entity.CropCycle getCropCycleEntity(UUID cropCycleId) {
        return cropCycleRepository.findById(cropCycleId)
                .orElseThrow(() -> new ResourceNotFoundException("CropCycle", "id", cropCycleId));
    }

    private com.jalrakshak.entity.User getUserEntity(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private RecommendationInput buildInputSnapshot(UUID ownerId, RecommendationRequest request) {
        // Build raw payload JSON
        String rawPayload = buildRawPayload(request);
        
        return RecommendationInput.builder()
                .farm(farmService.getFarmEntity(request.getFarmId()))
                .cropCycle(request.getCropCycleId() != null ? getCropCycleEntity(request.getCropCycleId()) : null)
                .soilMoisturePercent(request.getSoilMoisturePercent())
                .airTemperatureCelsius(request.getAirTemperatureCelsius())
                .humidityPercent(request.getHumidityPercent())
                .rainfallForecastMm(request.getRainfallForecastMm())
                .cropStage(request.getCropStage())
                .growthStage(request.getGrowthStage())
                .daysSincePlanting(request.getDaysSincePlanting())
                .weatherSource(request.getWeatherSource())
                .sensorSource(request.getSensorSource())
                .rawPayload(rawPayload)
                .build();
    }

    private String buildRawPayload(RecommendationRequest request) {
        // Simple JSON building - in production use Jackson ObjectMapper
        return String.format(
                "{\"farmId\":\"%s\",\"cropCycleId\":\"%s\",\"soilMoisturePercent\":%s,\"airTemperatureCelsius\":%s,\"humidityPercent\":%s,\"rainfallForecastMm\":%s,\"cropStage\":\"%s\",\"growthStage\":\"%s\",\"daysSincePlanting\":%s,\"weatherSource\":\"%s\",\"sensorSource\":\"%s\"}",
                request.getFarmId(),
                request.getCropCycleId(),
                request.getSoilMoisturePercent(),
                request.getAirTemperatureCelsius(),
                request.getHumidityPercent(),
                request.getRainfallForecastMm(),
                request.getCropStage(),
                request.getGrowthStage(),
                request.getDaysSincePlanting(),
                request.getWeatherSource(),
                request.getSensorSource()
        );
    }

    public RecommendationDto getById(UUID recommendationId, UUID ownerId) {
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation", "id", recommendationId));
        
        farmService.verifyOwnership(recommendation.getFarm().getId(), ownerId);
        return RecommendationDto.fromEntity(recommendation);
    }

    public PageResponse<RecommendationDto> getByFarm(UUID farmId, UUID ownerId, Pageable pageable) {
        farmService.verifyOwnership(farmId, ownerId);
        Page<Recommendation> page = recommendationRepository.findByFarmId(farmId, pageable);
        return PageResponse.of(page.map(RecommendationDto::fromEntity));
    }

    public PageResponse<RecommendationDto> getByCropCycle(UUID cropCycleId, UUID ownerId, Pageable pageable) {
        // Verify ownership through crop cycle's farm
        com.jalrakshak.entity.CropCycle cropCycle = getCropCycleEntity(cropCycleId);
        farmService.verifyOwnership(cropCycle.getFarm().getId(), ownerId);
        
        Page<Recommendation> page = recommendationRepository.findByCropCycleId(cropCycleId, pageable);
        return PageResponse.of(page.map(RecommendationDto::fromEntity));
    }

    @Transactional
    public RecommendationDto executeRecommendation(UUID recommendationId, UUID ownerId, UUID executedBy) {
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation", "id", recommendationId));
        
        farmService.verifyOwnership(recommendation.getFarm().getId(), ownerId);
        
        if (recommendation.getStatus() != Recommendation.Status.PENDING) {
            throw new IllegalArgumentException("Recommendation is not in PENDING status");
        }
        
        recommendation.setStatus(Recommendation.Status.EXECUTED);
        recommendation.setExecutedAt(Instant.now());
        recommendation.setExecutedBy(getUserEntity(executedBy));
        
        return RecommendationDto.fromEntity(recommendationRepository.save(recommendation));
    }

    public RecommendationInputDto getInputSnapshot(UUID inputSnapshotId, UUID ownerId) {
        RecommendationInput input = recommendationInputRepository.findById(inputSnapshotId)
                .orElseThrow(() -> new ResourceNotFoundException("RecommendationInput", "id", inputSnapshotId));
        
        farmService.verifyOwnership(input.getFarm().getId(), ownerId);
        return RecommendationInputDto.fromEntity(input);
    }
}