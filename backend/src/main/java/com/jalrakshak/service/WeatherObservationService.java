package com.jalrakshak.service;

import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.dto.WeatherObservationDto;
import com.jalrakshak.entity.WeatherObservation;
import com.jalrakshak.exception.ForbiddenException;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.WeatherObservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeatherObservationService {

    private final WeatherObservationRepository weatherObservationRepository;
    private final FarmService farmService;

    @Transactional
    public WeatherObservationDto create(UUID ownerId, UUID farmId, WeatherObservationDto request) {
        farmService.verifyOwnership(farmId, ownerId);
        
        WeatherObservation observation = WeatherObservation.builder()
                .farm(farmService.getFarmEntity(farmId))
                .observedAt(request.getObservedAt())
                .temperatureCelsius(request.getTemperatureCelsius())
                .humidityPercent(request.getHumidityPercent())
                .rainfallMm(request.getRainfallMm())
                .windSpeedKmh(request.getWindSpeedKmh())
                .windDirectionDegrees(request.getWindDirectionDegrees())
                .solarRadiationWm2(request.getSolarRadiationWm2())
                .pressureHpa(request.getPressureHpa())
                .cloudCoverPercent(request.getCloudCoverPercent())
                .source(request.getSource())
                .rawData(request.getRawData())
                .build();
        
        return WeatherObservationDto.fromEntity(weatherObservationRepository.save(observation));
    }

    public PageResponse<WeatherObservationDto> getByFarm(UUID farmId, UUID ownerId, Pageable pageable) {
        farmService.verifyOwnership(farmId, ownerId);
        Page<WeatherObservation> page = weatherObservationRepository.findByFarmId(farmId, pageable);
        return PageResponse.of(page.map(WeatherObservationDto::fromEntity));
    }

    public List<WeatherObservationDto> getLatestByFarm(UUID farmId, UUID ownerId, int limit) {
        farmService.verifyOwnership(farmId, ownerId);
        return weatherObservationRepository.findLatestByFarmId(farmId, Pageable.ofSize(limit))
                .stream()
                .map(WeatherObservationDto::fromEntity)
                .toList();
    }

    public List<WeatherObservationDto> getByFarmAndDateRange(
            UUID farmId, UUID ownerId, Instant start, Instant end) {
        farmService.verifyOwnership(farmId, ownerId);
        return weatherObservationRepository.findByFarmIdAndObservedAtBetween(farmId, start, end)
                .stream()
                .map(WeatherObservationDto::fromEntity)
                .toList();
    }
}