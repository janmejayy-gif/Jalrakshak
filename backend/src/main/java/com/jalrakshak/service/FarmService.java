package com.jalrakshak.service;

import com.jalrakshak.dto.FarmDto;
import com.jalrakshak.dto.FarmCreateRequest;
import com.jalrakshak.dto.FarmUpdateRequest;
import com.jalrakshak.entity.Farm;
import com.jalrakshak.entity.User;
import com.jalrakshak.exception.ForbiddenException;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.FarmRepository;
import com.jalrakshak.repository.UserRepository;
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
public class FarmService {

    private final FarmRepository farmRepository;
    private final UserRepository userRepository;

    @Transactional
    public FarmDto create(UUID ownerId, FarmCreateRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));
        
        Farm farm = Farm.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .locationLatitude(request.getLocationLatitude())
                .locationLongitude(request.getLocationLongitude())
                .address(request.getAddress())
                .totalAreaHectares(request.getTotalAreaHectares())
                .soilType(request.getSoilType())
                .build();
        
        return FarmDto.fromEntity(farmRepository.save(farm));
    }

    public FarmDto getById(UUID farmId) {
        return farmRepository.findById(farmId)
                .map(FarmDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Farm", "id", farmId));
    }

    public FarmDto getByIdAndOwner(UUID farmId, UUID ownerId) {
        return farmRepository.findByOwnerIdAndId(ownerId, farmId)
                .map(FarmDto::fromEntity)
                .orElseThrow(() -> new ForbiddenException("Farm not found or access denied"));
    }

    public Page<FarmDto> getByOwner(UUID ownerId, Pageable pageable) {
        return farmRepository.findByOwnerId(ownerId, pageable)
                .map(FarmDto::fromEntity);
    }

    public List<FarmDto> getAllByOwner(UUID ownerId) {
        return farmRepository.findByOwnerId(ownerId)
                .stream()
                .map(FarmDto::fromEntity)
                .toList();
    }

    @Transactional
    public FarmDto update(UUID farmId, UUID ownerId, FarmUpdateRequest request) {
        Farm farm = farmRepository.findByOwnerIdAndId(ownerId, farmId)
                .orElseThrow(() -> new ForbiddenException("Farm not found or access denied"));
        
        if (request.getName() != null) farm.setName(request.getName());
        if (request.getDescription() != null) farm.setDescription(request.getDescription());
        if (request.getLocationLatitude() != null) farm.setLocationLatitude(request.getLocationLatitude());
        if (request.getLocationLongitude() != null) farm.setLocationLongitude(request.getLocationLongitude());
        if (request.getAddress() != null) farm.setAddress(request.getAddress());
        if (request.getTotalAreaHectares() != null) farm.setTotalAreaHectares(request.getTotalAreaHectares());
        if (request.getSoilType() != null) farm.setSoilType(request.getSoilType());
        
        return FarmDto.fromEntity(farmRepository.save(farm));
    }

    @Transactional
    public void delete(UUID farmId, UUID ownerId) {
        if (!farmRepository.existsByOwnerIdAndId(ownerId, farmId)) {
            throw new ForbiddenException("Farm not found or access denied");
        }
        farmRepository.deleteById(farmId);
    }

    void verifyOwnership(UUID farmId, UUID ownerId) {
        if (!farmRepository.existsByOwnerIdAndId(ownerId, farmId)) {
            throw com.jalrakshak.exception.ForbiddenException.farmAccessDenied();
        }
    }

    Farm getFarmEntity(UUID farmId) {
        return farmRepository.findById(farmId)
                .orElseThrow(() -> new ResourceNotFoundException("Farm", "id", farmId));
    }
}