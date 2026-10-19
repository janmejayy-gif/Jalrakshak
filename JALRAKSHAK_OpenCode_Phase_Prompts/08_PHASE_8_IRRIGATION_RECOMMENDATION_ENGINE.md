# OpenCode Prompt --- Phase 8: Irrigation Recommendation Engine

Implement the decision-support layer in Spring Boot. Inspect the
requirements, agronomic assumptions, data contracts and ML output before
modifying code. This is safety-sensitive farmer guidance: do not invent
universal thresholds or water quantities.

## Candidate actions

-   `IRRIGATE`
-   `WAIT`
-   `PARTIAL_IRRIGATION`
-   `INSUFFICIENT_DATA`

Only return a quantity when supported by validated agronomic logic and
sufficient inputs. The action enum is a product contract, not permission
to fabricate decisions.

## Tasks

1.  Define a versioned input snapshot containing crop/variety, growth
    stage, soil attributes, farm area, irrigation method,
    weather/rainfall, optional moisture readings, source timestamps and
    units.
2.  Validate data freshness, ranges, units and contradictions before
    invoking ML or rules.
3.  Combine approved model output with reviewed agronomic rules and
    explicit safety/fallback rules.
4.  If required data is missing/stale/outside supported scope, return
    `INSUFFICIENT_DATA` or the specifically reviewed safe fallback.
5.  Never treat missing sensor data as a zero or assume soil moisture.
6.  Provide a human-readable explanation, relevant warnings,
    quantity/unit where justified, input freshness, rule version and
    model version.
7.  Persist recommendation and a traceable input snapshot/reference. Do
    not silently overwrite history.
8.  Keep farmer in control; do not trigger physical irrigation
    automatically.
9.  Add tests for rainfall forecast, adequate moisture, missing/stale
    data, conflicting inputs, model outage, unsupported crop and valid
    recommendation cases using domain-reviewed fixtures.
10. Document every agronomic assumption needing review by a qualified
    domain expert.

## Constraints

-   No fabricated accuracy or water-saving claims.
-   No universal watering thresholds without an approved source and
    crop/soil context.
-   No automatic valve actuation in this phase.
-   Do not change unrelated frontend components.

## Acceptance criteria

Every output is explainable and traceable; unsupported cases are handled
safely; tests cover normal and failure paths; all domain assumptions are
documented.
