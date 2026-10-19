# OpenCode Prompt --- Phase 5: Weather and Field Data Integration

Inspect the existing Spring Boot adapters, database schema, API
contracts and environment configuration first. Implement weather
integration behind a provider interface so vendors can be changed
without rewriting business logic.

## Tasks

1.  Select or integrate a weather provider only after documenting
    coverage, credentials, terms, rate limits and costs. If no provider
    credentials exist, implement the interface and a test stub; do not
    fabricate live data.
2.  Normalize forecast/observation fields, units, coordinates, time
    zones, provider timestamps and fetch timestamps.
3.  Persist appropriate weather records and source metadata. Avoid
    unnecessary duplicate storage.
4.  Validate latitude/longitude, ranges, nulls and timestamps.
5.  Add connection/read timeouts, bounded retries with backoff,
    rate-limit handling and caching only where appropriate.
6.  Return data freshness/source metadata to the application. Never
    label stale cached values as real-time.
7.  Define safe behaviour for missing forecast, provider outage,
    malformed response and location mismatch.
8.  Create an optional soil-moisture adapter interface. Do not assume
    physical sensors exist; no hardware integration is required until
    specified.
9.  Add tests using recorded fixtures or stubs for normal responses,
    invalid units, timeouts, 429/5xx errors, stale data and unavailable
    credentials.
10. Document provider setup and operational limitations.

## Constraints

-   Never commit API keys.
-   Do not use fake readings in production paths.
-   Do not let weather-provider failure silently become a valid
    zero-rainfall forecast.
-   Do not add an IoT broker or MongoDB without a justified requirement.

## Acceptance criteria

Provider logic is isolated and tested; data has source and freshness
metadata; outages produce explicit degraded states; setup is documented.
