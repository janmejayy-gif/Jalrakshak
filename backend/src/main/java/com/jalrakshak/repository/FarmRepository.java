package com.jalrakshak.repository;

import com.jalrakshak.entity.Farm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FarmRepository extends JpaRepository<Farm, UUID> {
    Page<Farm> findByOwnerId(UUID ownerId, Pageable pageable);
    
    List<Farm> findByOwnerId(UUID ownerId);
    
    @Query("SELECT f FROM Farm f WHERE f.owner.id = :ownerId AND f.id = :farmId")
    Optional<Farm> findByOwnerIdAndId(@Param("ownerId") UUID ownerId, @Param("farmId") UUID farmId);
    
    boolean existsByOwnerIdAndId(UUID ownerId, UUID farmId);
}