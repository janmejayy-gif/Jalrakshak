# OpenCode Prompt --- Phase 3: Authentication and Security

Inspect current auth code and Phase 0--2 decisions before
implementation. Implement secure authentication in Spring Boot using
Spring Security and JWT, integrating with the existing code rather than
duplicating it.

## Tasks

1.  Implement farmer registration and login with server-side validation.
2.  Use a maintained password-hashing mechanism supported by Spring
    Security. Never store or log plaintext passwords.
3.  Configure JWT signing/validation, expiry, secret/key configuration
    and a documented rotation/revocation strategy appropriate to the
    app.
4.  Enforce roles `FARMER` and `ADMIN`; deny by default and grant only
    necessary permissions.
5.  Enforce resource ownership on farm and recommendation endpoints. A
    farmer must never access another farmer's data by changing an ID.
6.  Return safe errors and avoid user enumeration where feasible.
7.  Configure CORS for explicitly approved frontend origins from
    environment/configuration; do not use permissive wildcard settings
    with credentials.
8.  Add rate limiting or an appropriate deployment-layer abuse control
    for authentication endpoints if supported by current architecture;
    document any limitation.
9.  Keep tokens, passwords and secrets out of logs, URLs, source control
    and frontend bundles.
10. Add tests for invalid credentials, expired/invalid token, missing
    token, role restrictions, IDOR/ownership attacks and admin-only
    operations.
11. Document environment variables and security decisions without real
    secrets.

## Constraints

-   Do not claim security is production-ready merely because login
    works.
-   Do not disable CSRF/CORS/auth checks blindly; document decisions
    according to the actual client/token approach.
-   Do not modify unrelated files.

## Acceptance criteria

Auth flows work locally; protected APIs reject
unauthenticated/unauthorized requests; ownership tests pass; no secrets
are committed; test commands and results are reported.
