# OpenCode Prompt --- Phase 11: CI/CD, Deployment and Observability

Inspect repository host, build tools and infrastructure constraints
before choosing deployment details. Implement a safe, reproducible
deployment path for React, Spring Boot, FastAPI and PostgreSQL.

## Tasks

1.  Create or improve CI for pull requests: formatting/lint, unit tests,
    build, dependency checks and container build where appropriate.
2.  Build versioned artifacts/images and avoid embedding secrets in
    images or frontend bundles.
3.  Separate local, staging and production configuration.
4.  Document deployment options and select hosting only after checking
    the project's actual budget, region, data needs and provider
    constraints.
5.  Configure HTTPS, environment secrets, private network access for
    FastAPI/database, least-privilege service credentials and safe CORS.
6.  Use managed PostgreSQL or document secure operations, backups,
    restoration tests, migrations and retention.
7.  Add health/readiness checks, structured logs, request/correlation
    IDs, service metrics and actionable alerts.
8.  Configure deployment rollback and model artifact/version rollback.
9.  Apply database migrations as a controlled release step; do not edit
    production DB manually.
10. Add runbooks for service outage, database recovery, external API
    failure, secret rotation and suspected bad recommendation/model.
11. Document expected costs and limits only when backed by the chosen
    provider's current plan.

## Constraints

-   Do not deploy publicly without explicit authorization and required
    credentials.
-   Do not commit secrets or print them in logs.
-   Do not claim a domain, HTTPS, monitoring or backups are configured
    unless verified.
-   Do not add Kubernetes or complex orchestration unless
    scale/operations justify it.

## Acceptance criteria

CI results are reproducible, staging deployment is documented and
verified where credentials permit, rollback and recovery are defined,
and production secrets are managed outside source control.
