package com.jalrakshak.controller;

import com.jalrakshak.dto.CropCycleDto;
import com.jalrakshak.dto.CropCycleCreateRequest;
import com.jalrakshak.dto.CropCycleUpdateRequest;
import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.service.CropCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropCycleController {

    private final CropCycleService cropCycleService;

    @PostMapping
    public ResponseEntity<CropCycleDto> create(@RequestAttribute("userId") UUID userId,
                                                @Valid @RequestBody CropCycleCreateRequest request) {
        return ResponseEntity.ok(cropCycleService.create(userId, request));
    }

@GetMapping("/farm/{farmId}")
    public ResponseEntity<PageResponse<CropCycleDto>> getByFarm(@RequestAttribute("userId") UUID userId,
                                                                  @PathVariable UUID farmId,
                                                                  @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.of(cropCycleService.getByFarm(farmId, userId, pageable)));
    }

    @GetMapping("/farm/{farmId}/list")
    public ResponseEntity<List<CropCycleDto>> getByFarmList(@RequestAttribute("userId") UUID userId,
                                                             @PathVariable UUID farmId) {
        return ResponseEntity.ok(cropCycleService.getAllByFarm(farmId, userId));
    }

    @GetMapping("/{cropCycleId}")
    public ResponseEntity<CropCycleDto> getById(@RequestAttribute("userId") UUID userId,
                                                 @PathVariable UUID cropCycleId) {
        return ResponseEntity.ok(cropCycleService.getByIdAndOwner(cropCycleId, userId));
    }

    @PutMapping("/{cropCycleId}")
    public ResponseEntity<CropCycleDto> update(@RequestAttribute("userId") UUID userId,
                                                @PathVariable UUID cropCycleId,
                                                @Valid @RequestBody CropCycleUpdateRequest request) {
        return ResponseEntity.ok(cropCycleService.update(cropCycleId, userId, request));
    }

    @DeleteMapping("/{cropCycleId}")
    public ResponseEntity<Void> delete(@RequestAttribute("userId") UUID userId,
                                        @PathVariable UUID cropCycleId) {
        cropCycleService.delete(cropCycleId, userId);
        return ResponseEntity.noContent().build();
    }
}