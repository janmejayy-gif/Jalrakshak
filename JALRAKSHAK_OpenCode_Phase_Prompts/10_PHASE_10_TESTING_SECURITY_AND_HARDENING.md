# OpenCode Prompt --- Phase 10: Production Testing and Hardening

Review the full codebase and test strategy. Identify risks before
changing code. Focus on demonstrable correctness and security rather
than merely increasing test counts.

## Test layers

1.  Unit tests for Java business rules, Python preprocessing/inference
    and React components.
2.  Integration tests for database migrations/repositories and external
    service adapters.
3.  Contract tests for React--Spring Boot and Spring Boot--FastAPI
    schemas.
4.  End-to-end tests for login, farm creation, recommendation and
    history.
5.  Security tests for authentication, role checks, ownership/IDOR,
    validation, CORS and secret leakage.
6.  Resilience tests for timeouts, provider outage, ML outage, invalid
    responses and DB errors.
7.  Performance/load tests using an explicitly stated expected traffic
    profile.
8.  Accessibility/responsive checks and light/dark theme verification.
9.  Dependency vulnerability and container configuration scans where
    tools are available.

## Tasks

-   Add missing tests around real failure modes.
-   Check pagination limits, payload sizes, database indexes and slow
    queries.
-   Review logs for sensitive data and error responses for internal
    leakage.
-   Verify backup/restore and migration recovery instructions.
-   Record baseline performance and thresholds only after measurement.
-   Create a release test report with passed/failed/not-run categories.

## Constraints

-   Never claim a test passed unless it was run.
-   Do not suppress failing tests just to achieve a green build.
-   Do not introduce destructive test fixtures against production data.
-   Do not perform invasive load/security testing against a live system
    without authorization.

## Acceptance criteria

A reproducible test report exists, high-severity issues are addressed or
explicitly blocked, and remaining risks are visible to the release
owner.
