package com.jalrakshak.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "farms", indexes = {
    @Index(name = "idx_farms_owner_id", columnList = "owner_id"),
    @Index(name = "idx_farms_location", columnList = "locationLatitude, locationLongitude")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farm {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal locationLatitude;

    @Column(name = "location_longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal locationLongitude;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "total_area_hectares", precision = 10, scale = 4)
    private BigDecimal totalAreaHectares;

    @Column(name = "soil_type", length = 100)
    private String soilType;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}