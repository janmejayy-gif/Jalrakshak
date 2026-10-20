# JALRAKSHAK — API Specification (Phase 1)

**Version:** 1.0  
**Date:** 2026-10-20  
**Phase:** 1 — Requirements and Architecture  
**Base URL:** `https://api.jalrakshak.org/api` (production) / `http://localhost:8080/api` (dev)  
**Auth:** Bearer JWT (except auth endpoints)  
**Content-Type:** `application/json`  
**OpenAPI Spec:** Available at `/v3/api-docs` (SpringDoc)

---

## 1. Common Conventions

### 1.1 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate, version mismatch) |
| 422 | Unprocessable Entity (semantic validation) |
| 500 | Internal Server Error |
| 503 | Service Unavailable (dependency down) |

### 1.2 Error Response (RFC 7807 ProblemDetail)

```json
{
  "type": "https://api.jalrakshak.org/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more fields are invalid",
  "instance": "/api/farms",
  "errors": [
    { "field": "areaHa", "message": "Must be greater than 0" },
    { "field": "soilType", "message": "Invalid value: 'SAND'. Allowed: SANDY, LOAMY, CLAY, SILTY, PEATY, CHALKY" }
  ]
}
```

### 1.3 Pagination

**Request:** `?page=0&size=20&sort=createdAt,desc`  
**Response:**
```json
{
  "content": [...],
  "pageable": { "pageNumber": 0, "pageSize": 20, "sort": { "sorted": true } },
  "totalElements": 45,
  "totalPages": 3,
  "last": false,
  "first": true,
  "numberOfElements": 20
}
```

### 1.4 Date/Time Format

- **ISO 8601 UTC:** `2026-10-20T14:30:00Z`
- **Date only:** `2026-10-20`
- All timestamps stored and returned in UTC.

### 1.5 Units

| Quantity | Unit | Symbol |
|----------|------|--------|
| Area | Hectares | ha |
| Length/Depth | Centimeters | cm |
| Water Depth | Millimeters | mm |
| Temperature | Celsius | °C |
| Wind Speed | Meters/second | m/s |
| Solar Radiation | Watts/m² | W/m² |
| Humidity | Percent | % |
| Precipitation | Millimeters | mm |
| Soil Moisture | Percent volumetric | % |
| Electrical Conductivity | DeciSiemens/meter | dS/m |

---

## 2. Authentication Endpoints

### 2.1 Register Farmer

**POST** `/auth/register`

**Request:**
```json
{
  "phone": "+919876543210",
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "language": "en",
  "consentGiven": true,
  "consentVersion": "1.0"
}
```

**Response (201):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Registration successful. Please login."
}
```

**Validation:**
- Phone: E.164 format, unique
- Email: Valid format, unique (optional if phone provided)
- Password: Min 8 chars, upper, lower, digit, special
- Language: ISO 639-1 code (supported: `en`, `hi`, `mr`, `ta`, `te` — TBD)
- Consent: Required, versioned

---

### 2.2 Login

**POST** `/auth/login`

**Request:**
```json
{
  "phone": "+919876543210",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "+919876543210",
    "language": "en"
  }
}
```

---

### 2.3 Refresh Access Token

**POST** `/auth/refresh`

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (200):** Same as login (new access + new refresh token)

---

### 2.4 Logout

**POST** `/auth/logout`

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response (204):** No content. Refresh token revoked.

---

## 3. Farm Endpoints

### 3.1 List Farms (Current User)

**GET** `/farms`

**Query Params:** `page`, `size`, `sort`

**Response (200):**
```json
{
  "content": [
    {
      "farmId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "North Field",
      "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
      "address": "Survey No. 45, Village X, Taluk Y, District Z",
      "areaHa": 2.5,
      "soilType": "LOAMY",
      "irrigationMethod": "DRIP",
      "createdAt": "2026-10-15T10:30:00Z",
      "updatedAt": "2026-10-15T10:30:00Z"
    }
  ],
  "pageable": { ... },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 3.2 Create Farm

**POST** `/farms`

**Request:**
```json
{
  "name": "North Field",
  "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
  "address": "Survey No. 45, Village X, Taluk Y, District Z",
  "areaHa": 2.5,
  "soilType": "LOAMY",
  "irrigationMethod": "DRIP"
}
```

**Response (201):**
```json
{
  "farmId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "North Field",
  "location": { "type": "Point", "coordinates": [77.5946, 12.9716] },
  "address": "Survey No. 45, Village X, Taluk Y, District Z",
  "areaHa": 2.5,
  "soilType": "LOAMY",
  "irrigationMethod": "DRIP",
  "createdAt": "2026-10-20T14:30:00Z",
  "updatedAt": "2026-10-20T14:30:00Z"
}
```

**Validation:**
- `location`: GeoJSON Point, within service boundary
- `areaHa`: > 0, ≤ 1000
- `soilType`: Enum [SANDY, LOAMY, CLAY, SILTY, PEATY, CHALKY]
- `irrigationMethod`: Enum [FLOOD, SPRINKLER, DRIP, FURROW, CENTER_PIVOT]

---

### 3.3 Get Farm by ID

**GET** `/farms/{farmId}`

**Response (200):** Same as create response.

**Error (404):** Farm not found or not owned by user.

---

### 3.4 Update Farm

**PATCH** `/farms/{farmId}`

**Request:** Partial farm object (any subset of create fields)

**Response (200):** Updated farm object.

---

### 3.5 Delete Farm

**DELETE** `/farms/{farmId}`

**Response (204):** No content. Cascades to crop cycles (soft delete preferred).

---

## 4. Crop Cycle Endpoints

### 4.1 List Crop Cycles for Farm

**GET** `/farms/{farmId}/crop-cycles`

**Query Params:** `page`, `size`, `sort`, `status` (ACTIVE, COMPLETED, ARCHIVED)

**Response (200):** Paginated list of crop cycles.

---

### 4.2 Create Crop Cycle

**POST** `/farms/{farmId}/crop-cycles`

**Request:**
```json
{
  "crop": "WHEAT",
  "variety": "HD-3086",
  "plantingDate": "2026-11-15",
  "expectedHarvestDate": "2027-03-20",
  "notes": "First season with drip"
}
```

**Response (201):**
```json
{
  "cropCycleId": "550e8400-e29b-41d4-a716-446655440002",
  "farmId": "550e8400-e29b-41d4-a716-446655440001",
  "crop": "WHEAT",
  "variety": "HD-3086",
  "plantingDate": "2026-11-15",
  "expectedHarvestDate": "2027-03-20",
  "status": "ACTIVE",
  "notes": "First season with drip",
  "createdAt": "2026-10-20T14:35:00Z",
  "updatedAt": "2026-10-20T14:35:00Z"
}
```

**Validation:**
- `crop`: From supported crops list (configurable)
- `variety`: From supported varieties for crop
- `plantingDate`: ≤ today, ≥ 2 years ago
- `expectedHarvestDate`: > plantingDate

---

### 4.3 Get Crop Cycle

**GET** `/farms/{farmId}/crop-cycles/{cropCycleId}`

**Response (200):** Crop cycle object.

---

### 4.4 Update Crop Cycle

**PATCH** `/farms/{farmId}/crop-cycles/{cropCycleId}`

**Request:** Partial update (e.g., `status`, `notes`, `expectedHarvestDate`)

---

## 5. Recommendation Endpoints

### 5.1 Get Latest Recommendation for Farm

**GET** `/farms/{farmId}/recommendations/latest`

**Response (200) — Success with recommendation:**
```json
{
  "recommendationId": "550e8400-e29b-41d4-a716-446655440003",
  "farmId": "550e8400-e29b-41d4-a716-446655440001",
  "cropCycleId": "550e8400-e29b-41d4-a716-446655440002",
  "action": "IRRIGATE",
  "quantityMm": 25.0,
  "reasons": [
    "Soil moisture deficit of 28mm exceeds irrigation threshold of 20mm for WHEAT at VEGETATIVE stage",
    "No significant rainfall forecast in next 3 days (total 2mm)",
    "Current soil moisture 35% below field capacity at 30cm depth"
  ],
  "dataQuality": {
    "weatherFresh": true,
    "weatherAgeHours": 2.5,
    "soilMoistureFresh": true,
    "soilMoistureAgeHours": 4.0,
    "modelConfidence": 0.82,
    "warnings": []
  },
  "modelVersion": "v1.2.0",
  "inputSnapshot": {
    "cropStage": "VEGETATIVE",
    "deficitMm": 28.5,
    "effectiveRainfallMm": 2.0,
    "et0Mm": 4.2,
    "kc": 1.15,
    "etcMm": 4.83,
    "availableWaterMm": 45.2
  },
  "createdAt": "2026-10-20T06:00:00Z"
}
```

**Response (200) — Insufficient data:**
```json
{
  "recommendationId": "550e8400-e29b-41d4-a716-446655440003",
  "farmId": "550e8400-e29b-41d4-a716-446655440001",
  "cropCycleId": "550e8400-e29b-41d4-a716-446655440002",
  "action": "INSUFFICIENT_DATA",
  "quantityMm": null,
  "reasons": [
    "Weather data is stale (age: 8.2 hours, max allowed: 6 hours)",
    "Soil moisture reading not available (optional but recommended for accuracy)"
  ],
  "dataQuality": {
    "weatherFresh": false,
    "weatherAgeHours": 8.2,
    "soilMoistureFresh": false,
    "soilMoistureAgeHours": null,
    "modelConfidence": null,
    "warnings": [
      "WEATHER_STALE",
      "SOIL_MOISTURE_MISSING"
    ]
  },
  "modelVersion": null,
  "inputSnapshot": null,
  "createdAt": "2026-10-20T06:00:00Z"
}
```

**Key Fields:**
- `action`: Enum [IRRIGATE, WAIT, PARTIAL_IRRIGATION, INSUFFICIENT_DATA]
- `quantityMm`: Number or null. **Only present when action is IRRIGATE or PARTIAL_IRRIGATION AND calculation is supported by validated agronomic logic.**
- `reasons`: Array of human-readable explanation strings.
- `dataQuality`: Object with freshness flags, confidence, warnings.
- `inputSnapshot`: Key derived values used for decision (for audit/explanation).

---

### 5.2 Get Recommendation History for Farm

**GET** `/farms/{farmId}/recommendations`

**Query Params:** `page`, `size`, `sort`, `fromDate`, `toDate`, `action`

**Response (200):** Paginated list of recommendation objects (same structure as latest).

---

### 5.3 Submit Farmer Feedback/Action

**POST** `/recommendations/{recommendationId}/feedback`

**Request:**
```json
{
  "action": "IRRIGATED",
  "quantityMm": 25.0,
  "timestamp": "2026-10-20T07:30:00Z",
  "notes": "Irrigated in morning, good pressure"
}
```

**Action Enum:** [IRRIGATED, WAITED, PARTIAL_IRRIGATED, OTHER]

**Response (201):**
```json
{
  "actionId": "550e8400-e29b-41d4-a716-446655440004",
  "recommendationId": "550e8400-e29b-41d4-a716-446655440003",
  "action": "IRRIGATED",
  "quantityMm": 25.0,
  "timestamp": "2026-10-20T07:30:00Z",
  "notes": "Irrigated in morning, good pressure",
  "createdAt": "2026-10-20T07:31:00Z"
}
```

---

## 6. Weather Endpoints (Internal / Debug)

> **Note:** Weather data is primarily fetched by Spring Boot internally. These endpoints are for debugging/admin.

### 6.1 Get Current Weather for Farm

**GET** `/farms/{farmId}/weather/current`

**Response (200):**
```json
{
  "source": "OPENWEATHERMAP",
  "observedAt": "2026-10-20T12:00:00Z",
  "temperatureC": 28.5,
  "humidityPct": 65,
  "windSpeedMs": 3.2,
  "solarRadiationWm2": 850,
  "precipitationMm": 0.0,
  "raw": { ... }
}
```

---

### 6.2 Get Forecast for Farm

**GET** `/farms/{farmId}/weather/forecast`

**Query Params:** `days` (default 7)

**Response (200):**
```json
{
  "source": "OPENWEATHERMAP",
  "fetchedAt": "2026-10-20T12:00:00Z",
  "forecast": [
    {
      "date": "2026-10-20",
      "tempMinC": 22.0,
      "tempMaxC": 31.0,
      "humidityPct": 70,
      "precipitationMm": 0.0,
      "precipitationProbabilityPct": 10
    },
    ...
  ]
}
```

---

## 7. Soil Moisture Endpoints

### 7.1 Record Soil Moisture Reading (Manual or Sensor)

**POST** `/farms/{farmId}/soil-moisture`

**Request:**
```json
{
  "source": "MANUAL",
  "moisturePct": 38.5,
  "depthCm": 30,
  "measuredAt": "2026-10-20T06:00:00Z",
  "quality": "GOOD"
}
```

**Source Enum:** [MANUAL, SENSOR_IOT, SENSOR_HANDHELD, LAB_TEST]  
**Quality Enum:** [GOOD, QUESTIONABLE, POOR]

**Response (201):** Created reading object.

---

### 7.2 Get Recent Soil Moisture Readings

**GET** `/farms/{farmId}/soil-moisture`

**Query Params:** `limit` (default 10), `fromDate`

**Response (200):** Array of readings (newest first).

---

## 8. FastAPI ML Service Endpoints

> **Base URL:** `http://ml-service:8000` (internal)  
> **Auth:** Service-to-service (API key or mTLS — TBD)

### 8.1 Health Check

**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy",
  "modelVersion": "v1.2.0",
  "modelLoaded": true,
  "uptimeSeconds": 3600
}
```

---

### 8.2 Predict Irrigation Need

**POST** `/predict/irrigation-need`

**Request:**
```json
{
  "features": {
    "crop": "WHEAT",
    "variety": "HD-3086",
    "cropStage": "VEGETATIVE",
    "daysSincePlanting": 35,
    "soilType": "LOAMY",
    "irrigationMethod": "DRIP",
    "areaHa": 2.5,
    "deficitMm": 28.5,
    "et0Mm": 4.2,
    "kc": 1.15,
    "etcMm": 4.83,
    "effectiveRainfallMm": 2.0,
    "availableWaterMm": 45.2,
    "soilMoisturePct": 38.5,
    "soilMoistureDepthCm": 30,
    "forecastRainfallNext3DaysMm": 2.0,
    "forecastAvgTempC": 28.0,
    "forecastAvgHumidityPct": 65
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440005"
}
```

**Response (200):**
```json
{
  "prediction": "IRRIGATE_NEEDED",
  "confidence": 0.82,
  "probabilityIrrigate": 0.78,
  "probabilityWait": 0.15,
  "probabilityPartial": 0.07,
  "modelVersion": "v1.2.0",
  "featuresUsed": [ "deficitMm", "etcMm", "availableWaterMm", "forecastRainfallNext3DaysMm", "cropStage", "soilType" ],
  "requestId": "550e8400-e29b-41d4-a716-446655440005",
  "processedAt": "2026-10-20T06:00:01Z"
}
```

**Prediction Enum:** [IRRIGATE_NEEDED, WAIT, PARTIAL_IRRIGATION_NEEDED, INSUFFICIENT_DATA]

**Error (400):** Invalid features, out-of-range values.  
**Error (503):** Model not loaded.

---

## 9. Enumerated Values Reference

### 9.1 Soil Type
`SANDY`, `LOAMY`, `CLAY`, `SILTY`, `PEATY`, `CHALKY`

### 9.2 Irrigation Method
`FLOOD`, `SPRINKLER`, `DRIP`, `FURROW`, `CENTER_PIVOT`

### 9.3 Crop Stage (Auto-calculated or Manual Override)
`GERMINATION`, `VEGETATIVE`, `FLOWERING`, `GRAIN_FILL`, `MATURITY`

### 9.4 Recommendation Action
`IRRIGATE`, `WAIT`, `PARTIAL_IRRIGATION`, `INSUFFICIENT_DATA`

### 9.5 Farmer Action
`IRRIGATED`, `WAITED`, `PARTIAL_IRRIGATED`, `OTHER`

### 9.6 Data Quality Warning Codes
`WEATHER_STALE`, `WEATHER_MISSING`, `SOIL_MOISTURE_STALE`, `SOIL_MOISTURE_MISSING`, `MODEL_LOW_CONFIDENCE`, `ML_SERVICE_UNAVAILABLE`, `INPUT_OUT_OF_RANGE`, `CROP_STAGE_UNCERTAIN`

---

## 10. API Evolution Policy

- **Versioning:** URL path `/api/v1/` (current). Breaking changes → `/api/v2/`.
- **Additive Changes:** New fields, new endpoints, new enum values (with default handling) — backward compatible.
- **Breaking Changes:** Removed fields, changed types, changed enum meanings — new version.
- **Deprecation:** 90-day notice via `Deprecation` header and docs.