package com.jalrakshak.controller;

import com.jalrakshak.dto.FarmDto;
import com.jalrakshak.dto.FarmCreateRequest;
import com.jalrakshak.dto.FarmUpdateRequest;
import com.jalrakshak.dto.PageResponse;
import com.jalrakshak.service.FarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/farms")
@RequiredArgsConstructor
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    public ResponseEntity<FarmDto> create(@RequestAttribute("userId") UUID userId, 
                                           @Valid @RequestBody FarmCreateRequest request) {
        return ResponseEntity.ok(farmService.create(userId, request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FarmDto>> getAll(@RequestAttribute("userId") UUID userId,
                                                         @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(PageResponse.of(farmService.getByOwner(userId, pageable)));
    }

    @GetMapping("/list")
    public ResponseEntity<List<FarmDto>> getAllList(@RequestAttribute("userId") UUID userId) {
        return ResponseEntity.ok(farmService.getAllByOwner(userId));
    }

    @GetMapping("/{farmId}")
    public ResponseEntity<FarmDto> getById(@RequestAttribute("userId") UUID userId,
                                            @PathVariable UUID farmId) {
        return ResponseEntity.ok(farmService.getByIdAndOwner(farmId, userId));
    }

    @PutMapping("/{farmId}")
    public ResponseEntity<FarmDto> update(@RequestAttribute("userId") UUID userId,
                                           @PathVariable UUID farmId,
                                           @Valid @RequestBody FarmUpdateRequest request) {
        return ResponseEntity.ok(farmService.update(farmId, userId, request));
    }

    @DeleteMapping("/{farmId}")
    public ResponseEntity<Void> delete(@RequestAttribute("userId") UUID userId,
                                        @PathVariable UUID farmId) {
        farmService.delete(farmId, userId);
        return ResponseEntity.noContent().build();
    }
}