# OpenCode Prompt --- Phase 9: End-to-End Integration

Inspect frontend, Spring Boot APIs, PostgreSQL schema, FastAPI contracts
and existing tests. Integrate the complete JALRAKSHAK journey without
replacing working modules.

## Target journey

1.  Farmer logs in.
2.  Farmer creates/selects an authorized farm and crop cycle.
3.  Backend loads farm context and available weather/field data.
4.  Spring Boot validates the request and calls the internal FastAPI
    endpoint when an approved model is available.
5.  Recommendation rules validate the prediction and choose a supported
    action or `INSUFFICIENT_DATA`.
6.  Backend persists the recommendation and traceability metadata.
7.  React displays the action, quantity/unit when justified,
    explanation, timestamp, warnings and history.
8.  Farmer can record an action/feedback.

## Tasks

-   Use the agreed API contracts and shared error conventions.
-   Configure API base URLs by environment.
-   Set timeouts for internal service calls; prevent indefinite
    requests.
-   Add bounded retries only for safe/retryable operations and avoid
    duplicate recommendation writes.
-   Handle ML service unavailable, weather provider unavailable, expired
    token and database errors.
-   Verify farm ownership at the backend for every request.
-   Add contract and integration tests using controlled test services
    and database fixtures.
-   Ensure demo data is visibly labelled and never mixed into production
    records.
-   Update README and architecture sequence diagram.

## Acceptance criteria

The complete flow works locally with documented configuration; failure
cases show safe, understandable states; tests run and their results are
reported.
