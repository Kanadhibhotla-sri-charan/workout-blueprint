# Physique Blueprint --- Phase 2

## Schema & Data Governance

**Document Type:** Architect-to-Engineering Implementation
Specification\
**Phase:** 2\
**Status:** Approved for implementation\
**Owner:** Solution Architecture\
**Implementation Team:** Claude Code / Engineering\
**Prerequisite:** Phase 1 --- Reconciliation, Taxonomy & Mirror Effect
--- Complete

------------------------------------------------------------------------

# 0. Executive Decision

Phase 1 established the canonical exercise dataset and resolved the
major reconciliation and movement-taxonomy issues.

Phase 2 has a different purpose:

> **Make the knowledge base self-validating and establish the governance
> rules that future development must follow.**

The current exercise dataset should **not** be expanded during this
phase.

The objective is to ensure that: - every canonical record follows the
schema; - relationships are valid; - taxonomy values are controlled; -
review status has a reproducible meaning; - incomplete information is
distinguishable from genuinely non-applicable information; - future
contributors cannot accidentally introduce invalid records; - the
application can safely consume the data later.

------------------------------------------------------------------------

# 1. Phase 2 Scope

  Task   Description                                       Priority
  ------ ----------------------------------------------- ----------
  A      Freeze and document canonical schema                    P0
  B      Define field-level governance                           P0
  C      Establish review-status promotion rules                 P0
  D      Resolve `empty` vs `not applicable` semantics           P0
  E      Build automated schema validation                       P0
  F      Build relationship validation                           P0
  G      Build taxonomy validation                               P0
  H      Build knowledge QA report                               P1
  I      Evaluate coverage-category structure                    P1
  J      Update architectural documentation                      P1

------------------------------------------------------------------------

# 2. Non-Goals

Do **not** use Phase 2 to: - add new exercises; - rewrite existing
exercise descriptions merely for style; - redesign the UI; - build the
recommendation engine; - build Workout Audit or Coverage Meter; -
introduce AI recommendations; - replace YAML; - introduce a database; -
migrate to JSON or TypeScript; - introduce numerical exercise scores
unless separately approved.

If a task appears to require one of these, stop and create an
architectural note rather than silently expanding scope.

------------------------------------------------------------------------

# 3. Current Canonical Architecture

``` text
Knowledge Manual
       │
       │ human-readable knowledge
       ▼
Canonical YAML
       │
       │ structured knowledge
       ▼
Validation Layer
       │
       ▼
Future Application
       │
       ▼
Future Decision Engine
```

The **YAML records are the canonical structured representation**.

The Knowledge Manual remains the human-readable editorial/reference
layer.

The application must not become a second source of truth.

------------------------------------------------------------------------

# 4. Task A --- Freeze the Canonical Schema

The canonical exercise schema currently defined in
`docs/knowledge-manual/FOUNDATION.md` is the baseline schema:

``` yaml
id:
name:
summary:
why_this_exists:
body_regions:
primary_targets:
secondary_targets:
movement_patterns:
equipment:
exercise_type:
laterality:
coverage_categories:
resistance_profile:
stability_demand:
skill_demand:
setup_time:
fatigue_cost:
best_used_when:
less_suitable_when:
mirror_effect:
advantages:
limitations:
technique_cues:
common_mistakes:
programming_notes:
alternatives:
complements:
overlaps_with:
evidence_notes:
review_status:
```

**Requirement:** Do not add, remove, rename, or change the type of a
canonical field during Phase 2 without recording the change through an
ADR.

------------------------------------------------------------------------

# 5. Task B --- Define Field-Level Governance

Create or update:

`docs/knowledge-manual/SCHEMA.md`

For every canonical field document: 1. Purpose 2. Expected type 3.
Required/optional status 4. Allowed values where applicable 5. Whether
it affects automated decision-making 6. Whether it is required for
`reviewed` status

### Stable identity

`id` is the stable machine identity: - lowercase; - kebab-case; -
unique; - stable even if the display name changes; - not used for
temporary editorial information.

Example:

``` yaml
id: romanian-deadlift
```

`name` is the user-facing exercise name and may change for clarity
without changing the stable ID when the underlying exercise identity is
unchanged.

------------------------------------------------------------------------

# 6. Task C --- Review Status Governance

The three states remain:

``` text
draft
needs-review
reviewed
```

### `draft`

Exists but has not completed substantive review. It must not be used by
automated recommendation logic.

### `needs-review`

Has an unresolved factual, taxonomy, evidence, identity, relationship,
or programming issue. It must not be used by automated recommendation
logic.

### `reviewed`

Has passed the project's Review Gate and is eligible for future
automated decision-support features.

------------------------------------------------------------------------

# 7. Review Promotion Gate

A record may become `reviewed` only when all applicable checks pass:

-   [ ] Stable ID exists.
-   [ ] User-facing name exists.
-   [ ] Purpose is clearly stated.
-   [ ] Body-region classification is valid.
-   [ ] Primary targets are valid.
-   [ ] Movement patterns are valid.
-   [ ] Equipment is correctly classified.
-   [ ] Exercise type is valid.
-   [ ] Laterality is valid.
-   [ ] Coverage classification is valid.
-   [ ] Resistance profile is meaningful.
-   [ ] Stability demand is classified.
-   [ ] Skill demand is classified.
-   [ ] Setup time is classified.
-   [ ] Fatigue cost is classified.
-   [ ] `best_used_when` is meaningful.
-   [ ] `less_suitable_when` is meaningful where applicable.
-   [ ] `mirror_effect` is present and appropriately qualified.
-   [ ] Advantages are meaningful.
-   [ ] Limitations are realistic.
-   [ ] Relationships are valid.
-   [ ] Evidence notes exist where material claims require support.
-   [ ] No unresolved taxonomy issue exists.
-   [ ] No unresolved identity issue exists.

Do not invent information merely to satisfy the checklist.

------------------------------------------------------------------------

# 8. Task D --- Empty vs Not Applicable vs Unknown

Distinguish:

1.  **Known and applicable** --- populated.
2.  **Not applicable** --- the field genuinely does not apply.
3.  **Not yet established** --- information has not been adequately
    researched/reviewed.

Do not silently collapse these states.

For list fields, `[]` may continue to mean no applicable entries where
the field semantics support that interpretation, but an empty list must
not silently mean "not researched."

Before introducing sentinel strings such as `N/A`, `Unknown`, or
`Not researched`, evaluate whether the schema should represent the
distinction. If a schema change is necessary, create an ADR first.

------------------------------------------------------------------------

# 9. Task E --- Automated Schema Validation

Create a repository-level command, preferably:

``` bash
npm run validate-data
```

The exact implementation technology is up to engineering; the behavior
is mandatory.

Validation must fail on: - malformed YAML; - non-object records; -
unexpected structures; - missing required fields; - wrong field types; -
invalid nested structures; - unsupported nulls; - invalid enum values; -
duplicate IDs; - unexpected fields.

The schema documentation must distinguish:

``` text
Required
Conditionally required
Optional
```

Do not automatically make every field universally required without
checking semantic applicability.

------------------------------------------------------------------------

# 10. Task F --- Controlled Vocabulary Validation

Controlled fields must use approved values.

Examples:

``` yaml
exercise_type:
  - compound
  - isolation
```

``` yaml
laterality:
  - bilateral
  - unilateral
  - alternating
```

``` yaml
stability_demand:
  - low
  - medium
  - high
```

The same principle applies to `skill_demand`, `setup_time`,
`fatigue_cost`, movement patterns, body regions, targets, and coverage
categories.

Invalid values must fail validation rather than being silently accepted.

------------------------------------------------------------------------

# 11. Task G --- Taxonomy Validation

Validate:

### Body regions

Every value must exist in the approved body-region taxonomy.

### Primary targets

Every target must correspond to an approved muscle/functional group.

### Movement patterns

Every value must belong to the controlled movement vocabulary
established during Phase 1.

### Coverage categories

Every category must be recognized.

If a genuinely new taxonomy value is required: 1. document why; 2.
update the taxonomy specification; 3. update validation; 4. create an
ADR when the change is architectural.

Do not silently accept arbitrary strings.

------------------------------------------------------------------------

# 12. Task H --- Relationship Validation

The relationship fields are:

``` text
alternatives
complements
overlaps_with
```

The preferred future representation is stable exercise IDs rather than
free-form names.

Example:

``` yaml
complements:
  - incline-dumbbell-press
```

rather than:

``` yaml
complements:
  - Incline DB Press
```

First inspect the current representation. If relationships are currently
free-form names, do not blindly rewrite them without documenting the
migration.

If migration is appropriate: - resolve relationships to IDs; - validate
referenced IDs exist; - reject broken references; - detect
self-references; - detect circular relationships where semantically
invalid.

------------------------------------------------------------------------

# 13. Task I --- Knowledge QA Report

Create a reproducible report at:

`docs/dev/KNOWLEDGE-QA.md`

At minimum report:

``` text
Total canonical exercises
Reviewed
Needs-review
Draft

Schema violations
Taxonomy violations
Invalid relationships
Duplicate IDs
Duplicate canonical exercises

Cross-module exercises
Exercises with incomplete applicable fields
Exercises missing evidence notes where required
Exercises missing mirror effect
```

The report must be generated/reproducible from repository state rather
than manually maintained.

------------------------------------------------------------------------

# 14. Task J --- Coverage Categories: Evaluate, Don't Automatically Redesign

Keep the current `coverage_categories` system unless implementation
demonstrates a concrete problem.

A possible future conceptual organization is:

``` text
ROLE
├── compound
└── isolation

STIMULUS POSITION
├── lengthened
├── mid-range
└── shortened

EXECUTION
├── bilateral
├── unilateral
└── alternating

RESOURCE COST
├── low setup
├── low fatigue
└── high fatigue

FUNCTION
├── hypertrophy
├── strength
├── stability
├── skill / coordination
└── equipment substitution
```

**Do not implement this merely because it looks cleaner.**

First answer:

> **What actual decision can we not make using the existing data?**

If there is no concrete limitation, leave the current schema alone.

If a schema extension is justified, create an ADR before implementation.

------------------------------------------------------------------------

# 15. Task K --- Data Health Commands

The project should support:

``` bash
npm run validate-data
```

and preferably:

``` bash
npm run data-report
```

The first answers:

> **Is the dataset valid?**

The second answers:

> **What does the dataset currently look like?**

Keep these conceptually separate.

------------------------------------------------------------------------

# 16. Task L --- CI Integration

Once local validation is reliable, integrate it into normal development
checks:

``` text
Developer modifies YAML
        ↓
Commit / PR
        ↓
Validation
        ↓
PASS → continue
FAIL → block
```

Do not allow invalid canonical data to silently enter the main branch.

Exact CI implementation is up to engineering.

------------------------------------------------------------------------

# 17. Documentation Updates

After implementation, update:

### `FOUNDATION.md`

Clarify: - field semantics; - controlled vocabularies; - review
status; - relationship conventions.

### `PDD.md`

Update relevant sections to reflect the enforced governance model.

### ADRs

Create/update ADRs only for material architectural decisions, not every
implementation detail.

------------------------------------------------------------------------

# 18. Required Engineering Deliverables

1.  Canonical schema documentation: `docs/knowledge-manual/SCHEMA.md`
2.  Data validator: `npm run validate-data`
3.  QA report: `docs/dev/KNOWLEDGE-QA.md`
4.  Review-gate implementation.
5.  Relationship validation.
6.  Taxonomy validation.
7.  CI integration.
8.  Updated PDD / Foundation / relevant ADRs.

------------------------------------------------------------------------

# 19. Definition of Done

Phase 2 is complete when:

-   [ ] Canonical schema is explicitly documented.
-   [ ] Field types are documented.
-   [ ] Required/optional/conditional semantics are documented.
-   [ ] Review statuses have deterministic meanings.
-   [ ] `reviewed` has a reproducible promotion gate.
-   [ ] YAML schema validation works.
-   [ ] Controlled taxonomy validation works.
-   [ ] Relationship validation works.
-   [ ] Duplicate IDs are detected.
-   [ ] Invalid records cause validation failure.
-   [ ] A QA report can be generated.
-   [ ] Validation runs locally with one command.
-   [ ] Validation is integrated into normal development/CI checks.
-   [ ] No new exercise expansion was performed merely to increase
    dataset size.
-   [ ] PDD and Foundation documentation reflect the implemented
    governance.
-   [ ] No unresolved critical data-integrity issue remains.

------------------------------------------------------------------------

# 20. Phase 2 Exit Gate

``` text
                  KNOWLEDGE MANUAL
                         │
                         ▼
                 CANONICAL YAML
                         │
                         ▼
              ┌────────────────────┐
              │  VALIDATION LAYER  │
              ├────────────────────┤
              │ Schema             │
              │ Taxonomy           │
              │ Relationships      │
              │ Identity           │
              │ Review Governance  │
              └─────────┬──────────┘
                        │
                   VALID DATA
                        │
                        ▼
                 APPLICATION LAYER
                        │
                        ▼
               FUTURE DECISION ENGINE
```

Before Phase 2:

> We have a carefully curated dataset.

After Phase 2:

> We have a carefully curated dataset **plus a system that can prevent
> it from becoming inconsistent again.**

That distinction is the entire reason this phase exists.

------------------------------------------------------------------------

# 21. Architect's Direction to Engineering

**Do not optimize this phase for visible features.**

There may be very little to show the end user when Phase 2 is finished.
That's okay. The value is infrastructural.

We are building the foundation for:

``` text
Browse
Search
Filter
Compare
       ↓
Coverage Analysis
       ↓
Overlap Detection
       ↓
Gap Detection
       ↓
Explainable Exercise Recommendations
       ↓
Workout Audit
```

The decision engine must consume **validated knowledge**, not compensate
for poorly governed knowledge.

### Final principle

> **If Claude can accidentally introduce an invalid exercise record
> tomorrow, Phase 2 isn't finished.**

------------------------------------------------------------------------

# Engineering Completion Report

At the end of implementation, update the dev log with:

``` text
PHASE 2 COMPLETION REPORT

Schema:
PASS / FAIL

Taxonomy:
PASS / FAIL

Relationships:
PASS / FAIL

Review governance:
PASS / FAIL

Automated validation:
PASS / FAIL

QA report:
PASS / FAIL

CI:
PASS / FAIL

Outstanding issues:
...

Architect decisions requiring review:
...

Files changed:
...
```
