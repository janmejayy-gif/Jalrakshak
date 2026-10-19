package com.jalrakshak.repository;

import com.jalrakshak.entity.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    Page<AuditEvent> findByUserId(UUID userId, Pageable pageable);
    
    Page<AuditEvent> findByEventType(String eventType, Pageable pageable);
    
    @Query("SELECT a FROM AuditEvent a WHERE a.entityType = :entityType AND a.entityId = :entityId")
    Page<AuditEvent> findByEntity(@Param("entityType") String entityType, @Param("entityId") UUID entityId, Pageable pageable);
}