# JALRAKSHAK --- OpenCode Phase Prompts

Use these prompts sequentially. Each prompt is a separate implementation
phase. Do not paste all phases into OpenCode at once.

## How to use

1.  Open the JALRAKSHAK repository in OpenCode.
2.  Paste Phase 0 first.
3.  Review the files and decisions it creates.
4.  Run the checks and verify the acceptance criteria before moving to
    the next phase.
5.  Commit each completed phase separately.
6.  Keep user changes safe; ask OpenCode to inspect `git status` before
    any broad changes.

## Phase order

-   [00 Phase 0 Requirements And
    Architecture](00_PHASE_0_REQUIREMENTS_AND_ARCHITECTURE.md)
-   [01 Phase 1 Repository
    Foundation](01_PHASE_1_REPOSITORY_FOUNDATION.md)
-   [02 Phase 2 Database And Backend
    Foundation](02_PHASE_2_DATABASE_AND_BACKEND_FOUNDATION.md)
-   [03 Phase 3 Authentication And
    Security](03_PHASE_3_AUTHENTICATION_AND_SECURITY.md)
-   [04 Phase 4 React Ui Design And Farmer
    App](04_PHASE_4_REACT_UI_DESIGN_AND_FARMER_APP.md)
-   [05 Phase 5 Weather And Field
    Data](05_PHASE_5_WEATHER_AND_FIELD_DATA.md)
-   [06 Phase 6 Ml Dataset Baseline And
    Evaluation](06_PHASE_6_ML_DATASET_BASELINE_AND_EVALUATION.md)
-   [07 Phase 7 Fastapi Inference
    Service](07_PHASE_7_FASTAPI_INFERENCE_SERVICE.md)
-   [08 Phase 8 Irrigation Recommendation
    Engine](08_PHASE_8_IRRIGATION_RECOMMENDATION_ENGINE.md)
-   [09 Phase 9 End To End
    Integration](09_PHASE_9_END_TO_END_INTEGRATION.md)
-   [10 Phase 10 Testing Security And
    Hardening](10_PHASE_10_TESTING_SECURITY_AND_HARDENING.md)
-   [11 Phase 11 Cicd Deployment And
    Observability](11_PHASE_11_CICD_DEPLOYMENT_AND_OBSERVABILITY.md)
-   [12 Phase 12 Controlled Pilot And
    Operations](12_PHASE_12_CONTROLLED_PILOT_AND_OPERATIONS.md)

## Global rules for every phase

-   Required stack: React + Spring Boot + Python/FastAPI + PostgreSQL.
-   Inspect existing files and git status before editing.
-   Do not overwrite user changes or modify unrelated files.
-   Do not invent API keys, datasets, agronomic thresholds, ML metrics
    or live readings.
-   Distinguish implemented features from placeholders and demo data.
-   Run relevant tests/builds and report actual results.
-   If blocked, explain the blocker and stop rather than hiding
    failures.
