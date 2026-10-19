# JALRAKSHAK Data Model

## Overview

This document describes the database schema for JALRAKSHAK Phase 2. All tables use UUID primary keys with `gen_random_uuid()` default generation. Timestamps use `TIMESTAMPTZ` with `now()` defaults.

## Tables

### 1. users

Core user accounts for farmers and administrators.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email (login) |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| role | VARCHAR(20) | NOT NULL, CHECK (FARMER, ADMIN) | User role |
| phone | VARCHAR(50) | | Optional phone number |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |
| last_login_at | TIMESTAMPTZ | | Last successful login |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Account status |

**Indexes:**
- `idx_users_email` on email
- `idx_users_role` on role
- `idx_users_is_active` on is_active

### 2. farms

Agricultural farms owned by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| owner_id | UUID | NOT NULL, FK → users(id) | Farm owner |
| name | VARCHAR(255) | NOT NULL | Farm name |
| description | TEXT | | Optional description |
| location_latitude | DECIMAL(10,8) | NOT NULL | GPS latitude |
| location_longitude | DECIMAL(11,8) | NOT NULL | GPS longitude |
| address | TEXT | | Physical address |
| total_area_hectares | DECIMAL(10,4) | | Total farm area |
| soil_type | VARCHAR(100) | | Soil classification |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_farms_owner_id` on owner_id
- `idx_farms_location` on (location_latitude, location_longitude)

**Foreign Keys:**
- `owner_id` → users(id) ON DELETE CASCADE

### 3. crop_cycles

Crop cultivation cycles within a farm.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| farm_id | UUID | NOT NULL, FK → farms(id) | Parent farm |
| crop_type | VARCHAR(100) | NOT NULL | Crop type (e.g., wheat, rice) |
| variety | VARCHAR(100) | | Specific variety |
| planting_date | DATE | NOT NULL | Planting date |
| expected_harvest_date | DATE | | Expected harvest |
| actual_harvest_date | DATE | | Actual harvest date |
| growth_stage | VARCHAR(50) | NOT NULL, CHECK (GERMINATION, VEGETATIVE, FLOWERING, FRUITING, MATURITY, HARVESTED) | Current growth stage |
| area_hectares | DECIMAL(10,4) | NOT NULL | Cultivated area |
| irrigation_method | VARCHAR(50) | | Irrigation method |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Constraints:**
- `actual_harvest_date` >= `planting_date`
- `expected_harvest_date` >= `planting_date`

**Indexes:**
- `idx_crop_cycles_farm_id` on farm_id
- `idx_crop_cycles_planting_date` on planting_date
- `idx_crop_cycles_growth_stage` on growth_stage

**Foreign Keys:**
- `farm_id` → farms(id) ON DELETE CASCADE

### 4. weather_observations

Weather data observations for farms.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| farm_id | UUID | NOT NULL, FK → farms(id) | Farm location |
| observed_at | TIMESTAMPTZ | NOT NULL | Observation timestamp |
| temperature_celsius | DECIMAL(5,2) | | Air temperature (°C) |
| humidity_percent | DECIMAL(5,2) | CHECK (0-100) | Relative humidity (%) |
| rainfall_mm | DECIMAL(8,2) | | Rainfall (mm) |
| wind_speed_kmh | DECIMAL(6,2) | | Wind speed (km/h) |
| wind_direction_degrees | INT | | Wind direction (degrees) |
| solar_radiation_wm2 | DECIMAL(8,2) | | Solar radiation (W/m²) |
| pressure_hpa | DECIMAL(7,2) | | Atmospheric pressure (hPa) |
| cloud_cover_percent | DECIMAL(5,2) | CHECK (0-100) | Cloud cover (%) |
| source | VARCHAR(50) | NOT NULL | Data source (e.g., weather_api, station) |
| raw_data | JSONB | | Complete raw response |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_weather_observations_farm_id` on farm_id
- `idx_weather_observations_observed_at` on observed_at DESC
- `idx_weather_observations_source` on source

**Foreign Keys:**
- `farm_id` → farms(id) ON DELETE CASCADE

### 5. sensor_readings

IoT sensor readings (optional, no hardware dependency).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| farm_id | UUID | NOT NULL, FK → farms(id) | Farm location |
| crop_cycle_id | UUID | FK → crop_cycles(id) | Associated crop cycle |
| recorded_at | TIMESTAMPTZ | NOT NULL | Reading timestamp |
| sensor_type | VARCHAR(50) | NOT NULL, CHECK (SOIL_MOISTURE, SOIL_TEMPERATURE, SOIL_EC, SOIL_PH, LEAF_WETNESS, PAR) | Sensor type |
| value | DECIMAL(10,4) | NOT NULL | Reading value |
| unit | VARCHAR(20) | NOT NULL | Unit of measurement |
| sensor_id | VARCHAR(100) | | Physical sensor ID |
| depth_cm | DECIMAL(5,2) | | Sensor depth (cm) |
| raw_data | JSONB | | Raw sensor data |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |

**Constraints:**
- soil_moisture: value 0-100
- soil_ph: value 0-14

**Indexes:**
- `idx_sensor_readings_farm_id` on farm_id
- `idx_sensor_readings_crop_cycle_id` on crop_cycle_id
- `idx_sensor_readings_recorded_at` on recorded_at DESC
- `idx_sensor_readings_sensor_type` on sensor_type

**Foreign Keys:**
- `farm_id` → farms(id) ON DELETE CASCADE
- `crop_cycle_id` → crop_cycles(id) ON DELETE SET NULL

### 6. recommendations

Irrigation recommendations generated by ML service.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| farm_id | UUID | NOT NULL, FK → farms(id) | Farm |
| crop_cycle_id | UUID | FK → crop_cycles(id) | Crop cycle |
| requested_by | UUID | NOT NULL, FK → users(id) | Requesting user |
| recommendation | VARCHAR(30) | NOT NULL, CHECK (IRRIGATE, WAIT, PARTIAL_IRRIGATION, INSUFFICIENT_DATA) | Recommendation action |
| confidence | DECIMAL(4,3) | NOT NULL, CHECK (0-1) | Confidence score |
| reasoning | TEXT | NOT NULL | Explanation |
| irrigation_amount_mm | DECIMAL(8,2) | | Recommended amount (mm) |
| scheduled_for | TIMESTAMPTZ | | Scheduled execution time |
| executed_at | TIMESTAMPTZ | | Actual execution time |
| executed_by | UUID | FK → users(id) | Executing user |
| status | VARCHAR(20) | NOT NULL, DEFAULT PENDING, CHECK (PENDING, EXECUTED, CANCELLED, EXPIRED) | Current status |
| model_version | VARCHAR(50) | | ML model version |
| input_snapshot_id | UUID | | Reference to input snapshot |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Indexes:**
- `idx_recommendations_farm_id` on farm_id
- `idx_recommendations_crop_cycle_id` on crop_cycle_id
- `idx_recommendations_requested_by` on requested_by
- `idx_recommendations_created_at` on created_at DESC
- `idx_recommendations_status` on status

**Foreign Keys:**
- `farm_id` → farms(id) ON DELETE CASCADE
- `crop_cycle_id` → crop_cycles(id) ON DELETE SET NULL
- `requested_by` → users(id) ON DELETE CASCADE
- `executed_by` → users(id) ON DELETE SET NULL

### 7. recommendation_inputs

Traceable input snapshots for recommendation reproducibility.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| farm_id | UUID | NOT NULL, FK → farms(id) | Farm |
| crop_cycle_id | UUID | FK → crop_cycles(id) | Crop cycle |
| soil_moisture_percent | DECIMAL(5,2) | CHECK (0-100) | Soil moisture (%) |
| soil_temperature_celsius | DECIMAL(5,2) | | Soil temperature (°C) |
| air_temperature_celsius | DECIMAL(5,2) | | Air temperature (°C) |
| humidity_percent | DECIMAL(5,2) | CHECK (0-100) | Humidity (%) |
| rainfall_forecast_mm | DECIMAL(8,2) | | Rainfall forecast (mm) |
| wind_speed_kmh | DECIMAL(6,2) | | Wind speed (km/h) |
| solar_radiation_wm2 | DECIMAL(8,2) | | Solar radiation (W/m²) |
| crop_stage | VARCHAR(50) | | Crop stage descriptor |
| days_since_planting | INT | | Days since planting |
| growth_stage | VARCHAR(50) | | Growth stage |
| weather_source | VARCHAR(50) | | Weather data source |
| sensor_source | VARCHAR(50) | | Sensor data source |
| raw_payload | JSONB | NOT NULL | Complete input payload |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_recommendation_inputs_farm_id` on farm_id
- `idx_recommendation_inputs_crop_cycle_id` on crop_cycle_id
- `idx_recommendation_inputs_created_at` on created_at DESC

**Foreign Keys:**
- `farm_id` → farms(id) ON DELETE CASCADE
- `crop_cycle_id` → crop_cycles(id) ON DELETE SET NULL

### 8. farmer_feedback

Farmer feedback on recommendations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| recommendation_id | UUID | NOT NULL, FK → recommendations(id) | Recommendation |
| farmer_id | UUID | NOT NULL, FK → users(id) | Farmer user |
| rating | INT | NOT NULL, CHECK (1-5) | Rating 1-5 |
| feedback_text | TEXT | | Detailed feedback |
| actual_outcome | VARCHAR(30) | CHECK (IRRIGATE, WAIT, PARTIAL_IRRIGATION, INSUFFICIENT_DATA) | What actually happened |
| was_helpful | BOOLEAN | | Was recommendation helpful |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |

**Indexes:**
- `idx_farmer_feedback_recommendation_id` on recommendation_id
- `idx_farmer_feedback_farmer_id` on farmer_id
- `idx_farmer_feedback_created_at` on created_at DESC

**Foreign Keys:**
- `recommendation_id` → recommendations(id) ON DELETE CASCADE
- `farmer_id` → users(id) ON DELETE CASCADE

### 9. audit_events

System audit trail.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → users(id) | Acting user |
| event_type | VARCHAR(50) | NOT NULL | Event category |
| entity_type | VARCHAR(50) | | Affected entity type |
| entity_id | UUID | | Affected entity ID |
| action | VARCHAR(50) | NOT NULL | Action performed |
| description | TEXT | | Human-readable description |
| ip_address | INET | | Client IP address |
| user_agent | TEXT | | Client user agent |
| metadata | JSONB | | Additional context |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Event timestamp |

**Indexes:**
- `idx_audit_events_user_id` on user_id
- `idx_audit_events_event_type` on event_type
- `idx_audit_events_entity` on (entity_type, entity_id)
- `idx_audit_events_created_at` on created_at DESC

**Foreign Keys:**
- `user_id` → users(id) ON DELETE SET NULL

## Entity Relationships

```
users (1) ─────< (N) farms
farms (1) ─────< (N) crop_cycles
farms (1) ─────< (N) weather_observations
farms (1) ─────< (N) sensor_readings
crop_cycles (1) ─────< (N) sensor_readings
farms (1) ─────< (N) recommendations
crop_cycles (1) ─────< (N) recommendations
users (1) ─────< (N) recommendations (requested_by)
users (1) ─────< (N) recommendations (executed_by)
recommendation_inputs (1) ─────< (1) recommendations (input_snapshot_id)
farms (1) ─────< (N) recommendation_inputs
crop_cycles (1) ─────< (N) recommendation_inputs
recommendations (1) ─────< (N) farmer_feedback
users (1) ─────< (N) farmer_feedback
users (1) ─────< (N) audit_events
```

## Migration Strategy

Migrations are managed by Flyway with versioned SQL files in `backend/src/main/resources/db/migration/`:

- V1__create_users_table.sql
- V2__create_farms_table.sql
- V3__create_crop_cycles_table.sql
- V4__create_weather_observations_table.sql
- V5__create_sensor_readings_table.sql
- V6__create_recommendations_table.sql
- V7__create_recommendation_inputs_table.sql
- V8__create_farmer_feedback_table.sql
- V9__create_audit_events_table.sql

Run migrations: `./gradlew flywayMigrate`
Clean database: `./gradlew flywayClean` (drops all tables)