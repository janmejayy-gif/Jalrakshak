# OpenCode Prompt --- Phase 2: PostgreSQL and Spring Boot Backend Foundation

Inspect the current repository and Phase 0 documents first. Implement
only the database and backend foundation. Preserve existing code and
conventions.

## Architecture

Spring Boot owns application logic, validation, persistence and
orchestration. PostgreSQL is the primary system of record. Use a
supported migration tool already present; if none exists, choose and
document one before adding it.

## Tasks

1.  Create versioned migrations for:
    -   users
    -   farms
    -   crop_cycles
    -   weather_observations
    -   sensor_readings (optional records; no hardware dependency)
    -   recommendations
    -   recommendation_inputs or an equivalent traceable input
        snapshot/reference
    -   farmer_feedback
    -   audit_events
2.  Use primary/foreign keys, appropriate uniqueness/check constraints,
    timestamps, explicit units and indexes for expected queries. Use a
    consistent identifier strategy.
3.  Store only password hashes; do not return credential fields in API
    responses.
4.  Implement clean layers (controller, service, repository, DTO/mapper
    where appropriate) and centralized error handling.
5.  Add request validation and safe, consistent API error bodies. Do not
    leak stack traces or secrets.
6.  Add farm ownership checks to every farm-specific read/write path. Do
    not trust a client-supplied owner ID.
7.  Add pagination/filtering for history/list endpoints where
    appropriate.
8.  Configure DB connection through environment variables. Do not
    hardcode credentials.
9.  Add transactional boundaries for multi-step writes.
10. Add unit/integration tests for migrations, repositories, validation,
    ownership and error responses.
11. Document the schema in `docs/DATA_MODEL.md` and setup in README.

## Constraints

-   Do not add MongoDB by default.
-   Do not build fake irrigation intelligence in this phase.
-   Do not change unrelated frontend files.
-   If requirements are ambiguous, document the assumption and ask
    before making irreversible choices.

## Acceptance criteria

A clean local database can be migrated from scratch; CRUD operations
covered by this phase persist correctly; unauthorized farm access is
rejected; tests actually run and results are reported.
