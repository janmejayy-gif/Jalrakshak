package com.jalrakshak.service;

import com.jalrakshak.dto.CropCycleDto;
import com.jalrakshak.dto.CropCycleCreateRequest;
import com.jalrakshak.dto.CropCycleUpdateRequest;
import com.jalrakshak.entity.CropCycle;
import com.jalrakshak.entity.Farm;
import com.jalrakshak.exception.ForbiddenException;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.CropCycleRepository;
import com.jalrakshak.repository.FarmRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CropCycleService {

    private final CropCycleRepository cropCycleRepository;
    private final FarmRepository farmRepository;
    private final FarmService farmService;

    @Transactional
    public CropCycleDto create(UUID ownerId, CropCycleCreateRequest request) {
        farmService.verifyOwnership(request.getFarmId(), ownerId);
        
        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new ResourceNotFoundException("Farm", "id", request.getFarmId()));
        
        CropCycle cropCycle = CropCycle.builder()
                .farm(farm)
                .cropType(request.getCropType())
                .variety(request.getVariety())
                .plantingDate(request.getPlantingDate())
                .expectedHarvestDate(request.getExpectedHarvestDate())
                .growthStage(request.getGrowthStage())
                .areaHectares(request.getAreaHectares())
                .irrigationMethod(request.getIrrigationMethod())
                .notes(request.getNotes())
                .build();
        
        return CropCycleDto.fromEntity(cropCycleRepository.save(cropCycle));
    }

    public CropCycleDto getById(UUID cropCycleId) {
        return cropCycleRepository.findById(cropCycleId)
                .map(CropCycleDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("CropCycle", "id", cropCycleId));
    }

    public CropCycleDto getByIdAndOwner(UUID cropCycleId, UUID ownerId) {
        CropCycle cropCycle = cropCycleRepository.findById(cropCycleId)
                .orElseThrow(() -> new ResourceNotFoundException("CropCycle", "id", cropCycleId));
        
        farmService.verifyOwnership(cropCycle.getFarm().getId(), ownerId);
        return CropCycleDto.fromEntity(cropCycle);
    }

    public Page<CropCycleDto> getByFarm(UUID farmId, UUID ownerId, Pageable pageable) {
        farmService.verifyOwnership(farmId, ownerId);
        return cropCycleRepository.findByFarmId(farmId, pageable)
                .map(CropCycleDto::fromEntity);
    }

    public List<CropCycleDto> getAllByFarm(UUID farmId, UUID ownerId) {
        farmService.verifyOwnership(farmId, ownerId);
        return cropCycleRepository.findByFarmId(farmId)
                .stream()
                .map(CropCycleDto::fromEntity)
                .toList();
    }

    @Transactional
    public CropCycleDto update(UUID cropCycleId, UUID ownerId, CropCycleUpdateRequest request) {
        CropCycle cropCycle = cropCycleRepository.findById(cropCycleId)
                .orElseThrow(() -> new ResourceNotFoundException("CropCycle", "id", cropCycleId));
        
        farmService.verifyOwnership(cropCycle.getFarm().getId(), ownerId);
        
        if (request.getCropType() != null) cropCycle.setCropType(request.getCropType());
        if (request.getVariety() != null) cropCycle.setVariety(request.getVariety());
        if (request.getExpectedHarvestDate() != null) cropCycle.setExpectedHarvestDate(request.getExpectedHarvestDate());
        if (request.getActualHarvestDate() != null) cropCycle.setActualHarvestDate(request.getActualHarvestDate());
        if (request.getGrowthStage() != null) cropCycle.setGrowthStage(request.getGrowthStage());
        if (request.getAreaHectares() != null) cropCycle.setAreaHectares(request.getAreaHectares());
        if (request.getIrrigationMethod() != null) cropCycle.setIrrigationMethod(request.getIrrigationMethod());
        if (request.getNotes() != null) cropCycle.setNotes(request.getNotes());
        
        return CropCycleDto.fromEntity(cropCycleRepository.save(cropCycle));
    }

    @Transactional
    public void delete(UUID cropCycleId, UUID ownerId) {
        CropCycle cropCycle = cropCycleRepository.findById(cropCycleId)
                .orElseThrow(() -> new ResourceNotFoundException("CropCycle", "id", cropCycleId));
        
        farmService.verifyOwnership(cropCycle.getFarm().getId(), ownerId);
        cropCycleRepository.deleteById(cropCycleId);
    }
}