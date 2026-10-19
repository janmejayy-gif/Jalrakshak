# OpenCode Prompt --- Phase 6: ML Data Pipeline, Baseline and Evaluation

Act as an ML engineer working on a farmer-facing irrigation
decision-support system. Inspect available datasets, their licenses and
provenance, existing preprocessing code and the project target
definition before training anything.

## First decision

Document the precise target: e.g. irrigation need classification, water
requirement estimation, or another measurable outcome. Do not mix these
targets without a clear design. If no legitimate dataset or agronomic
rules are available, build the pipeline skeleton and a transparent
rule-based baseline; do not invent training data.

## Tasks

1.  Document dataset source, rights/consent, date range, region, crop
    coverage, units, missingness and known bias.
2.  Create reproducible train/validation/test splits. Avoid leakage
    across farms, locations or seasons where applicable.
3.  Build validation for schema, units, duplicates, missing values,
    outliers and impossible values.
4.  Implement preprocessing as a reusable, versioned pipeline shared by
    training and inference.
5.  Establish a transparent baseline suitable for comparison.
6.  Evaluate suitable scikit-learn models first. Consider XGBoost only
    if the data, target and measured evaluation justify it.
7.  Choose metrics appropriate to the target; report
    per-crop/region/condition results, not only aggregate scores.
8.  Document calibration/uncertainty limitations. Never treat raw model
    confidence as a reliable probability without validation.
9.  Add reproducible configuration, random seeds where relevant, model
    artifact metadata and dependency pinning.
10. Produce a model card with intended use, unsupported conditions,
    risks, metrics and rollback/version information.
11. Keep all accuracy, savings and impact claims strictly tied to
    measured evidence.

## Constraints

-   Do not create synthetic/random labels and call them real-world
    evidence.
-   Do not claim field validation without field data.
-   Do not automatically deploy a newly trained model.
-   Protect personal and farm data.

## Deliverables

Training/evaluation scripts, data validation, reproducible reports,
`docs/MODEL_CARD.md`, and clear instructions to rerun the pipeline.

## Acceptance criteria

The pipeline runs on documented data; the report is reproducible;
limitations are explicit; a model is recommended for integration only if
it demonstrates useful performance against the baseline.
