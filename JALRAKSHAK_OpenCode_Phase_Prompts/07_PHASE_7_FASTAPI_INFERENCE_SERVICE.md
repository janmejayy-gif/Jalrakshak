# OpenCode Prompt --- Phase 7: FastAPI ML Inference Service

Inspect Phase 0 API contracts and Phase 6 model artifacts before coding.
Build the Python service as an internal service called by Spring Boot,
not directly by the browser.

## Tasks

1.  Implement versioned request/response schemas using the project's
    current Pydantic/FastAPI conventions.
2.  Add `POST /internal/ml/v1/predict` and a minimal health endpoint.
    Health output must not reveal secrets or model internals.
3.  Validate required features, units, ranges, nulls and supported
    crop/region combinations.
4.  Load a specific model/preprocessing artifact version at startup;
    fail clearly if the required artifact is unavailable.
5.  Return prediction plus model version, warnings and uncertainty
    metadata only where those fields are supported by evaluation.
6.  Keep feature processing consistent with the training pipeline; add
    regression tests for training/inference parity.
7.  Add structured safe logs, request IDs, timeouts/resource bounds and
    appropriate error responses.
8.  Add tests for valid request, invalid schema, missing values,
    unsupported inputs, model failure and deterministic expected
    fixtures.
9.  Configure the service for private network access and document how
    Spring Boot authenticates or restricts calls where needed.
10. Document local run, tests, environment variables and artifact
    versioning.

## Constraints

-   Do not invent a model or return random predictions.
-   If no approved model exists, return a clear not-ready/unavailable
    response or use a separately identified development stub that cannot
    be mistaken for production inference.
-   Do not expose secrets, training data or internal tracebacks.

## Acceptance criteria

FastAPI starts reliably, validates contracts, loads the intended
artifact, passes tests and documents failure behaviour.
