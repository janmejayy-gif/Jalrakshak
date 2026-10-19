package com.jalrakshak.ml;

import com.jalrakshak.dto.RecommendationRequest;
import com.jalrakshak.entity.Recommendation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class MlServiceClient {

    private final RestClient restClient;

    @Value("${ml-service.url:http://localhost:8000}")
    private String mlServiceUrl;

    public IrrigationPrediction predictIrrigation(RecommendationRequest request) {
        try {
            MlPredictionRequest mlRequest = MlPredictionRequest.builder()
                    .farmId(request.getFarmId().toString())
                    .cropType(request.getCropStage())
                    .soilMoisture(request.getSoilMoisturePercent().doubleValue())
                    .temperature(request.getAirTemperatureCelsius() != null ? 
                            request.getAirTemperatureCelsius().doubleValue() : 25.0)
                    .humidity(request.getHumidityPercent().doubleValue())
                    .rainfallForecast(request.getRainfallForecastMm().doubleValue())
                    .cropStage(request.getGrowthStage() != null ? request.getGrowthStage() : request.getCropStage())
                    .build();

            MlPredictionResponse response = restClient.post()
                    .uri(mlServiceUrl + "/predict/irrigation")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(mlRequest)
                    .retrieve()
                    .body(MlPredictionResponse.class);

            if (response == null) {
                return fallbackPrediction();
            }

            return IrrigationPrediction.builder()
                    .recommendation(Recommendation.RecommendationType.valueOf(response.getRecommendation()))
                    .confidence(response.getConfidence())
                    .reasoning(response.getReasoning())
                    .irrigationAmountMm(response.getIrrigationAmountMm())
                    .modelVersion(response.getModelVersion())
                    .build();

        } catch (RestClientException ex) {
            // Log error and return fallback
            return fallbackPrediction();
        }
    }

    private IrrigationPrediction fallbackPrediction() {
        return IrrigationPrediction.builder()
                .recommendation(Recommendation.RecommendationType.INSUFFICIENT_DATA)
                .confidence(0.0)
                .reasoning("ML service unavailable - using fallback")
                .irrigationAmountMm(null)
                .modelVersion("fallback")
                .build();
    }

    public boolean healthCheck() {
        try {
            String response = restClient.get()
                    .uri(mlServiceUrl + "/health")
                    .retrieve()
                    .body(String.class);
            return response != null && response.contains("healthy");
        } catch (RestClientException ex) {
            return false;
        }
    }

    @lombok.Builder
    @lombok.Value
    public static class MlPredictionRequest {
        String farmId;
        String cropType;
        double soilMoisture;
        double temperature;
        double humidity;
        double rainfallForecast;
        String cropStage;
    }

    @lombok.Data
    public static class MlPredictionResponse {
        private String recommendation;
        private double confidence;
        private String reasoning;
        private Double irrigationAmountMm;
        private String modelVersion;
    }

    @lombok.Builder
    @lombok.Value
    public static class IrrigationPrediction {
        Recommendation.RecommendationType recommendation;
        double confidence;
        String reasoning;
        Double irrigationAmountMm;
        String modelVersion;
    }
}