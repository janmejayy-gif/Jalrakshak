# JALRAKSHAK — Phase Acceptance Criteria (Phase 1)

**Version:** 1.0  
**Date:** 2026-10-20  
**Phase:** 1 — Requirements and Architecture  
**Status:** Ready for Owner Review

---

## 1. Phase 1 Acceptance Criteria

The following criteria must be met for Phase 1 to be considered complete. Each criterion is traceable to the deliverables produced in this phase.

| # | Criterion | Deliverable | Verification Method | Status |
|---|-----------|-------------|---------------------|--------|
| **AC-1.1** | First crop and geographic region are documented as pending decisions with clear action items | `REQUIREMENTS.md` §2 | Owner confirms decisions recorded; no hardcoded assumptions in architecture | ⬜ Pending |
| **AC-1.2** | Farmer journey is fully documented with all 9 steps, data collected, and validation points | `REQUIREMENTS.md` §3 | Mermaid diagram + table covers onboarding → feedback loop | ✅ Met |
| **AC-1.3** | Required vs optional farm inputs are clearly separated with types, units, validation, and sources | `REQUIREMENTS.md` §4 | Tables cover all 13 required + 11 optional + 9 derived fields | ✅ Met |
| **AC-1.4** | Four recommendation statuses defined with clear semantics and water quantity rules | `REQUIREMENTS.md` §5 | Status table + decision logic pseudocode | ✅ Met |
| **AC-1.5** | Validation rules cover identity, geometry, enums, dates, ranges, freshness, consistency, completeness | `REQUIREMENTS.md` §6.1 | Comprehensive rule table | ✅ Met |
| **AC-1.6** | Data freshness thresholds defined for all critical data types | `REQUIREMENTS.md` §6.2 | Table with 5 data types, max age, fallback action | ✅ Met |
| **AC-1.7** | Uncertainty handling documented for weather, model, missing inputs, sensor failure, ML timeout | `REQUIREMENTS.md` §6.3 | Table with 5 sources and handling strategy | ✅ Met |
| **AC-1.8** | Safe fallback behavior explicitly prohibits invented quantities and mandates conservative bias | `REQUIREMENTS.md` §6.4 | 5 rules including "never invent water quantities" | ✅ Met |
| **AC-1.9** | Service boundaries defined for all 5 components with responsibility matrix | `ARCHITECTURE.md` §2 | Matrix + communication flow sequence diagram | ✅ Met |
| **AC-1.10** | Spring Boot module structure defined with 7 modules and core services listed | `ARCHITECTURE.md` §2.2 | Module tree + service descriptions | ✅ Met |
| **AC-1.11** | MongoDB collections defined (8 core + 1 auth) with fields, indexes, and relationships | `DATA_MODEL.md` §2 | 9 collection specs with field tables | ✅ Met |
| **AC-1.12** | API contracts specified for all 23 endpoints across 7 groups with request/response examples | `API_SPECIFICATION.md` §2–§8 | OpenAPI-ready specs with JSON examples | ✅ Met |
| **AC-1.13** | Error handling strategy defined for all layers with RFC 7807 format | `ARCHITECTURE.md` §5 | Table + error response example | ✅ Met |
| **AC-1.14** | Security architecture covers JWT (access+refresh), authorization rules, token design | `ARCHITECTURE.md` §4 | Sequence diagram + rules table | ✅ Met |
| **AC-1.15** | Observability, configuration, deployment topology documented | `ARCHITECTURE.md` §6–§8 | Tables for each concern | ✅ Met |
| **AC-1.16** | Technology versions locked for all 15 stack components | `ARCHITECTURE.md` §9 | Version lock table | ✅ Met |
| **AC-1.17** | Architectural Decision Records capture 8 key decisions with status | `ARCHITECTURE.md` §10 | ADR table with 8 entries | ✅ Met |
| **AC-1.18** | Risks and mitigations identified (8 risks with likelihood/impact/mitigation) | `ARCHITECTURE.md` §11 | Risk register table | ✅ Met |
| **AC-1.19** | Data model includes JSON Schema validators, referential integrity, lifecycle, migrations | `DATA_MODEL.md` §3–§6 | Validator example + migration strategy | ✅ Met |
| **AC-1.20** | Assumptions and pending decisions tracked (10 items with resolution targets) | `REQUIREMENTS.md` §8 | Table with 10 entries | ✅ Met |
| **AC-1.21** | All documents internally consistent (no contradictions between REQUIREMENTS, ARCHITECTURE, API, DATA_MODEL) | Cross-doc review | Manual consistency check | ✅ Met |
| **AC-1.22** | No secrets, credentials, or sensitive data in any document | Security scan | Grep for keys/passwords/tokens | ✅ Met |
| **AC-1.23** | Documents follow locked technology stack (MongoDB, Spring Boot, FastAPI, React, etc.) | Stack compliance check | No PostgreSQL, JPA, Hibernate, unapproved libs | ✅ Met |

---

## 2. Phase 1 Deliverables Checklist

| Deliverable | Path | Status |
|-------------|------|--------|
| Requirements Document | `docs/REQUIREMENTS.md` | ✅ Created |
| Architecture Document | `docs/ARCHITECTURE.md` | ✅ Created |
| API Specification | `docs/API_SPECIFICATION.md` | ✅ Created |
| Data Model | `docs/DATA_MODEL.md` | ✅ Created |
| Phase Acceptance Criteria | `docs/PHASE_ACCEPTANCE_CRITERIA.md` | ✅ Created |

---

## 3. Owner Decisions Required Before Phase 2

The following **must be resolved by the owner** before Phase 2 (Spring Boot Backend & Database) can begin:

| Decision | Options / Input Needed | Impact on Phase 2 |
|----------|------------------------|-------------------|
| **First Crop** | e.g., WHEAT, RICE, COTTON, SUGARCANE, MAIZE | Determines crop list, varieties, KC curves, thresholds |
| **Geographic Region** | State/District in India (e.g., Punjab, Maharashtra, Karnataka) | Weather provider coverage, soil types, regulations, language |
| **Supported Languages** | Subset of: en, hi, mr, ta, te, kn, gu, bn | i18n setup in React; translation files |
| **Weather API Provider** | OpenWeatherMap, WeatherAPI, IMD, Tomorrow.io, etc. | Integration contract, cost, rate limits, data fields |
| **Irrigation Thresholds (mm)** | Crop-specific values for IRRIGATE/WAIT/PARTIAL boundaries | DecisionEngine configuration; requires agronomic input |
| **Soil Property Defaults** | Field capacity, wilting point by soil type | Water balance calculations in RecommendationService |
| **Max Farm Area (ha)** | Default 1000, but may vary by region | Farm validation rule |
| **Service Boundary Polygon** | GeoJSON polygon defining valid farm locations | Farm creation validation; geospatial index |

> **Recommendation:** Schedule a 30-min decision meeting with agronomy consultant to finalize crop, region, and thresholds.

---

## 4. Phase 2 Readiness Gate

Phase 2 may begin **only when**:

1. ✅ All Phase 1 deliverables created and reviewed
2. ✅ Owner confirms decisions in §3 (or explicitly accepts "TBD with defaults" for non-blocking items)
3. ✅ Git commit for Phase 1 pushed to GitHub
4. ✅ No critical contradictions found in cross-document review
5. ✅ Technology stack compliance verified (MongoDB only, no JPA, etc.)

---

## 5. Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Lead Engineer | — | — | — |
| Product Owner | — | — | — |
| Agronomy Reviewer | — | — | — |

---

## 6. Next Phase Preview (Phase 2 — Spring Boot Backend & Database)

**Scope:** Create Spring Boot project, MongoDB connection, core entities, CRUD APIs, validation, basic auth.

**Key Deliverables:**
- Spring Boot 3.2+ project with multi-module structure
- MongoDB configuration with connection pooling
- User, Farm, CropCycle entities + repositories
- REST controllers for `/api/auth`, `/api/farms`, `/api/crop-cycles`
- Jakarta Bean Validation on all DTOs
- Spring Security + JWT (register, login, refresh, logout)
- Global exception handler (RFC 7807)
- OpenAPI/Swagger documentation
- Unit + integration tests (Testcontainers for MongoDB)
- Mongock migrations for schema + reference data
- Docker Compose for local dev (Spring Boot + MongoDB)

**Estimated Effort:** 2–3 weeks