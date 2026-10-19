package com.jalrakshak.controller;

import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.dto.WeatherObservationCreateRequest;
import com.jalrakshak.dto.WeatherObservationDto;
import com.jalrakshak.service.WeatherObservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherObservationController {

    private final WeatherObservationService weatherObservationService;

    @PostMapping
    public ResponseEntity<WeatherObservationDto> create(@RequestAttribute("userId") UUID userId,
                                                         @Valid @RequestBody WeatherObservationCreateRequest request) {
        WeatherObservationDto dto = WeatherObservationDto.builder()
                .farmId(request.getFarmId())
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
        return ResponseEntity.ok(weatherObservationService.create(userId, request.getFarmId(), dto));
    }

    @GetMapping("/farm/{farmId}")
    public ResponseEntity<PageResponse<WeatherObservationDto>> getByFarm(@RequestAttribute("userId") UUID userId,
                                                                          @PathVariable UUID farmId,
                                                                          @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(weatherObservationService.getByFarm(farmId, userId, pageable));
    }

    @GetMapping("/farm/{farmId}/latest")
    public ResponseEntity<List<WeatherObservationDto>> getLatestByFarm(@RequestAttribute("userId") UUID userId,
                                                                        @PathVariable UUID farmId,
                                                                        @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(weatherObservationService.getLatestByFarm(farmId, userId, limit));
    }

    @GetMapping("/farm/{farmId}/range")
    public ResponseEntity<List<WeatherObservationDto>> getByDateRange(@RequestAttribute("userId") UUID userId,
                                                                       @PathVariable UUID farmId,
                                                                       @RequestParam Instant start,
                                                                       @RequestParam Instant end) {
        return ResponseEntity.ok(weatherObservationService.getByFarmAndDateRange(farmId, userId, start, end));
    }
}