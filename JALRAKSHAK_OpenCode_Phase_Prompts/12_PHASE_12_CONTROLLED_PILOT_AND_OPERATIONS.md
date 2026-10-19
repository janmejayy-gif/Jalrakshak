# OpenCode Prompt --- Phase 12: Controlled Pilot and Ongoing Operations

Prepare JALRAKSHAK for a limited, evidence-driven pilot. Do not declare
broad production readiness just because the software deploys.

## Tasks

1.  Define the pilot region, supported crops, participant criteria,
    consent/notice process, support contact and evaluation period with
    project/domain owners.
2.  Document known model limits, recommendation caveats, unsupported
    conditions and manual fallback/contact process.
3.  Train pilot users with plain-language instructions and regional
    language support where available.
4.  Record relevant recommendation outcomes and feedback with
    appropriate permissions and data minimization.
5.  Monitor API reliability/latency, provider failures, data freshness,
    model inputs/outputs, recommendation distribution and user-reported
    issues.
6.  Review performance by crop/region and compare recommendations with
    qualified domain review and observed outcomes.
7.  Define stop/pause criteria for suspicious or unsafe recommendations
    before pilot launch.
8.  Create an incident workflow: record, triage, disable/revert affected
    path if necessary, investigate, fix, regression-test and document
    resolution.
9.  Do not automatically retrain or deploy models from unreviewed
    feedback.
10. Produce a pilot report with measured outcomes, methodology,
    limitations, unresolved risks and recommendation on whether to
    expand.
11. Expand crops, regions, languages, remote sensing or IoT only after
    evidence and a formal scope decision.

## Constraints

-   Do not invent user adoption, accuracy, water savings or crop-yield
    improvements.
-   Do not treat anecdotal feedback as scientific validation.
-   Protect participant privacy and respect consent/retention
    requirements.
-   Do not automatically actuate irrigation equipment.

## Acceptance criteria

The pilot has documented scope, safeguards, monitoring and stop
criteria; outcomes are measured transparently; expansion is based on
evidence and approval.
