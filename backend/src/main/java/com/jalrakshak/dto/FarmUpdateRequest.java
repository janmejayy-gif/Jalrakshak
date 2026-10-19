package com.jalrakshak.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmUpdateRequest {
    @Size(max = 255)
    private String name;

    @Size(max = 2000)
    private String description;

    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private BigDecimal locationLatitude;

    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private BigDecimal locationLongitude;

    @Size(max = 500)
    private String address;

    @DecimalMin("0.0")
    @Digits(integer = 6, fraction = 4)
    private BigDecimal totalAreaHectares;

    @Size(max = 100)
    private String soilType;
}