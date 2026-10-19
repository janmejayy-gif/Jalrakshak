# OpenCode Prompt --- Phase 1: Repository and Local Development Foundation

Act as the senior engineer on JALRAKSHAK. First inspect the repository,
existing docs, git status, and package/build configuration. Preserve
existing work; do not overwrite user changes or reset Git.

## Stack

-   Frontend: React + JavaScript (use the existing project choice if
    already established; do not migrate frameworks without approval).
-   Backend: Java + Spring Boot.
-   ML service: Python + FastAPI.
-   Database: PostgreSQL.
-   Local orchestration: Docker Compose if Docker is available and
    appropriate.

## Tasks

1.  Create or complete the documented repository structure:
    -   `frontend/`
    -   `backend/`
    -   `ml-service/`
    -   `infrastructure/`
    -   `docs/`
2.  If an app already exists, adapt the structure to it rather than
    moving files unnecessarily.
3.  Add `.gitignore` files appropriate for Node, Java, Python, IDEs, OS
    files, build artifacts, local databases and secrets.
4.  Add `.env.example` files containing variable names and safe
    placeholders only. Never write real secrets.
5.  Add minimal health endpoints for Spring Boot and FastAPI; ensure
    they do not expose secrets or internal details.
6.  Add local setup instructions with supported runtime versions
    discovered from the installed environment or project files. If
    versions cannot be checked, document the required version as a
    decision to confirm rather than guessing.
7.  Add Dockerfiles/Compose only where practical; use health checks and
    non-root runtime users where feasible.
8.  Add formatting/lint/test commands and a simple CI workflow for pull
    requests if the repository uses GitHub.
9.  Verify each service builds/starts. Do not claim success for commands
    not run.
10. Update `README.md` with exact commands, prerequisites, ports,
    troubleshooting and how to stop services.

## Safety

-   Never commit secrets, real user data or database dumps.
-   Do not install extra infrastructure such as Kubernetes, Kafka, Redis
    or MongoDB unless a concrete requirement is documented.
-   Do not delete or reformat unrelated files.

## Acceptance criteria

A new developer can follow the README to run the available services
locally; health checks work; secrets are excluded; existing work remains
intact. Report changed files, commands executed, results and known
blockers.
