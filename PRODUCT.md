# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Indian smallholder and commercial multi-crop farmers (`FARMER` role) cultivating Wheat, Rice, Sugarcane, Cotton, and Maize, alongside agricultural platform administrators (`ADMIN` role). Farmers check the platform before and during irrigation windows—often in bright outdoor sunlight or semi-shaded field conditions—to decide whether, when, and how much water to apply to each field.

## Product Purpose

JALRAKSHAK (part of the KrishiSetu initiative) is an AI-assisted Smart Irrigation Decision-Support Platform. It helps farmers make field-specific irrigation decisions (`IRRIGATE`, `WAIT`, `PARTIAL_IRRIGATION`, or `INSUFFICIENT_DATA`) by combining farm profiles, active crop cycles, growth stages, soil types, weather observations/forecasts, and soil-moisture readings into explainable water recommendations while keeping final decision authority in the farmer's hands.

## Positioning

Unlike generic weather apps or black-box IoT controllers that issue unexplained commands, JALRAKSHAK separates ML irrigation-need inference from an explainable agronomic decision engine—surfacing exact reasoning, water depth in millimeters (`mm`), input snapshots, data-freshness indicators, and conservative `INSUFFICIENT_DATA` fallbacks whenever weather or soil data is stale or incomplete.

## Operating Context

- **Field & Home Usage:** Farmers inspect field status, soil moisture, rainfall forecasts, and action recommendations across desktop, tablet, and mobile screens, often in bright daylight.
- **Core Navigation Routes:** 9 core operational routes (`Overview`, `My Farms`, `Irrigation`, `Recommendations`, `Weather`, `Analytics`, `History`, `Alerts`, `Settings`) with `Login` and `Register` directly accessible from the top-right header bar.
- **Language & Terminology:** English primary interface paired with clear Hindi/regional agronomic cues (e.g., *Khet / खेत*, *Sinchai / सिंचाई*, *Mitti Nami / मिट्टी की नमी*, *Mausam / मौसम*) and unambiguous metric units (`ha`, `mm`, `°C`, `%`, `km/h`).

## Capabilities and Constraints

- **Confirmed Backend & ML Stack:** React 19 + Vite frontend (`localhost:5173`), Java 21 Spring Boot 3.3 REST API (`localhost:8080/api`), Python 3.13 FastAPI ML inference service (`localhost:8000`), and PostgreSQL 16.
- **Core API Capabilities:**
  - Authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, password reset & email verification) accessed via top-right Login/Register controls.
  - Farm & Crop Cycle CRUD (`/api/farms`, `/api/crops/farm/{farmId}`, `/api/crops`).
  - ML Prediction & Decision Recommendations (`/predict/irrigation`, `/api/recommendations`, `/api/recommendations/{id}/execute`, `/api/recommendations/{id}/input-snapshot`).
  - Weather Observations (`/api/weather`, `/api/weather/farm/{farmId}/latest`, `/api/weather/farm/{farmId}/range`) with 6-hour freshness thresholds.
  - Farmer Action History & Feedback (`/api/feedback`, `/api/feedback/recommendation/{id}`, `/api/feedback/my`).
  - Live Health Probes (`/api/health`, `/api/health/live`, `/api/health/ready`, ML `/health`).
- **Truth & Safety Constraints:**
  - Never fabricate unverified water-saving percentages, yield guarantees, or sensor telemetry; clearly badge simulated/demo fallback data when live services or sensors are offline.
  - Water quantity (`irrigationAmountMm`) is displayed only when backed by `IRRIGATE` or `PARTIAL_IRRIGATION` logic, never for `WAIT` or `INSUFFICIENT_DATA`.

## Brand Commitments

- **Name:** JALRAKSHAK (जलक्षक — Water Guardian), part of the **KrishiSetu** initiative.
- **Voice:** Respectful, practical, transparent, and grounded in Indian agronomy—never patronizing or jargon-heavy.

## Evidence on Hand

- Existing Spring Boot controllers and DTOs in `backend/src/main/java/com/jalrakshak/`.
- Existing FastAPI heuristic/ML prediction service in `ml-service/` (`baseline-heuristic-v1`).
- Existing frontend API client in `frontend/src/api/client.js`.
- Requirements and API blueprints in `JALRAKSHAK_Development_Plan.md`, `docs/REQUIREMENTS.md`, `docs/API_SPECIFICATION.md`, and `JALRAKSHAK_OpenCode_Phase_Prompts/04_PHASE_4_REACT_UI_DESIGN_AND_FARMER_APP.md`.
- No field-validated water-savings or pilot yield studies exist yet; UI must not claim proven water savings.

## Product Principles

1. **Farmer Authority First:** Recommendations advise with clear reasons, confidence, and input snapshots; the farmer decides and logs the executed action.
2. **Radical Data Honesty:** Always show data source timestamps, freshness status (`< 6h` weather, `< 24h` moisture), model version, and explicit `DEMO / SIMULATED` badges when live backend/sensor data is absent.
3. **Field-Ready Clarity:** Prioritize immediate visual comprehension of the 4 core questions—*When to irrigate? How much water? What action? Why?*—before secondary charts.
4. **Zero Dead Ends:** Every route (`Overview`, `My Farms`, `Irrigation`, `Recommendations`, `Weather`, `Analytics`, `History`, `Alerts`, `Settings`, plus top-right `Login / Register`) works smoothly both connected to the live Spring Boot + FastAPI services and in clearly labeled offline/demo mode.

## Accessibility & Inclusion

- High-contrast daylight readability suitable for outdoor rural viewing.
- Full keyboard navigation, visible focus rings, semantic HTML landmarks, ARIA live regions for recommendation results, and responsive layouts with no horizontal scrolling on mobile or tablet.
- Bilingual English + Hindi agronomic labels and clear visual status iconography (never relying on color alone for `IRRIGATE`, `WAIT`, `PARTIAL_IRRIGATION`, or `INSUFFICIENT_DATA`).
