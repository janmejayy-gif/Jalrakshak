# OpenCode Prompt --- Phase 0: Requirements and Architecture

You are the lead software architect for JALRAKSHAK, a production-minded
smart irrigation decision-support application within the KrishiSetu
concept. The required stack is React + Java Spring Boot + Python
FastAPI + PostgreSQL. Keep MongoDB and physical IoT devices optional
unless an evidenced requirement justifies them.

## Objective

Inspect the existing repository first. If files already exist, preserve
them and report what is present before proposing changes. Do not
implement application features yet. Establish a clear, versioned
requirements and architecture baseline.

## Requirements

1.  Define the initial MVP as farmer registration/login, farm and crop
    profiles, weather data integration through an adapter, irrigation
    recommendation history, explanations/warnings, and feedback.
2.  Recommendations must support `IRRIGATE`, `WAIT`,
    `PARTIAL_IRRIGATION`, and `INSUFFICIENT_DATA` as candidate actions.
    Do not invent agronomic thresholds, quantities, model accuracy, or
    water-saving claims. Mark all domain rules needing agronomist
    validation.
3.  Farmer retains final control; the system provides decision support,
    not guaranteed instructions.
4.  Define target users and roles: `FARMER` and `ADMIN` initially.
5.  Define functional and non-functional requirements: security,
    accessibility, responsive UI, observability, reliability, privacy,
    maintainability, performance and testability.
6.  Document data inputs, units, timestamps, source/freshness,
    missing/outlier handling, external provider failure and fallback
    behaviour.
7.  Define service boundaries: React UI; Spring Boot owns auth,
    authorization, application/business rules, persistence and
    orchestration; FastAPI is an internal ML inference service.
8.  PostgreSQL is the initial system of record. Do not add a second
    database without a written justification.
9.  Produce architecture and sequence diagrams using Mermaid if
    supported by the repository/documentation workflow.
10. Define proposed API contracts and core entities without claiming
    they already exist.
11. Define acceptance criteria for every MVP feature and list open
    questions separately.
12. Respect the visual direction: premium admin dashboard inspired by
    the supplied reference---collapsible left sidebar, top bar, rounded
    cards, pale blue/green accents, charts, right activity/alerts panel
    on wide screens, responsive layout, and light/dark modes. Create
    original JALRAKSHAK screens, not copies of unrelated analytics
    content.

## Expected deliverables

-   `docs/SRS.md`
-   `docs/ARCHITECTURE.md`
-   `docs/DATA_MODEL.md`
-   `docs/API_CONTRACTS.md`
-   `docs/RISK_REGISTER.md`
-   `docs/DECISIONS.md`

## Constraints

-   Do not scaffold or modify application code in this phase.
-   Do not invent project-specific facts or assert deployment readiness.
-   If any existing documents conflict with these requirements, report
    the conflict and propose a resolution rather than silently
    overwriting them.
-   Finish with a concise summary of files created, assumptions, open
    questions, and the recommended next phase.
