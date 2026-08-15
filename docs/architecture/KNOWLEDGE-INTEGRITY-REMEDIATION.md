# Physique Blueprint — Knowledge Integrity Remediation Plan

**Document type:** Architect-to-Engineering Implementation Specification  
**Status:** Approved for implementation  
**Owner:** Solution Architecture  
**Audience:** Claude Code / Engineering Team  
**Source:** Architecture Review v1.0  
**Scope:** Stabilize the existing knowledge layer before further exercise expansion or application intelligence is built.

## 0. Executive Decision

**Do not add more exercises at this stage.**

The current exercise set is sufficiently broad for the next phase. The priority is to make the existing knowledge base **canonical, internally consistent, schema-valid, honestly reviewed, and machine-safe**.

Required sequence:

```text
Existing knowledge
      ↓
Canonical identity + deduplication
      ↓
Schema normalization
      ↓
Taxonomy normalization
      ↓
Review-status correction
      ↓
Knowledge Manual ↔ YAML reconciliation
      ↓
Automated validation
      ↓
Only then: application implementation
      ↓
Only after reviewed data exists: decision engine
```

Do not reverse this order for convenience.

---

# 1. Why This Work Is Required

The repository already has the correct architectural direction: YAML is the intended structured source, the Knowledge Manual is the human-readable knowledge surface, the PDD requires reviewed structured data before recommendations, and the schema already anticipates alternatives, complements, overlaps, and coverage roles.

The current foundation still has several integrity issues:

1. `review_status` is ahead of actual review completeness.
2. Some YAML records do not strictly conform to the declared field types.
3. Cross-module exercises can be duplicated or represented inconsistently.
4. The Knowledge Manual and YAML are not perfectly synchronized.
5. Movement-pattern taxonomy sometimes mixes fundamental movement patterns with modifiers.
6. Empty fields do not yet have a fully explicit governance convention for "not applicable" versus "not researched yet".
7. There is no automated validation gate preventing these problems from reappearing.

These are foundation issues, not reasons to redesign the product.

---

# 2. Non-Goals

This remediation phase must **not**:

- add a large number of new exercises;
- build the Workout Audit;
- build a Coverage Meter UI;
- introduce AI recommendations;
- replace YAML;
- rewrite the knowledge from scratch merely for stylistic reasons.

The purpose is to stabilize what already exists.

---

# 3. Task A — Establish Canonical Exercise Identity

### Problem

The same exercise can legitimately belong to multiple body regions. A Romanian deadlift, for example, can be relevant to both hips and hamstrings. Physically duplicating the record creates a maintenance risk because the copies can drift apart.

### Decision

A genuinely identical exercise must have **exactly one canonical structured record**. That record may contain multiple `body_regions`.

Example:

```yaml
id: romanian-deadlift
name: Romanian Deadlift
body_regions:
  - hips
  - hamstrings
```

The application/data layer will build region indexes from `body_regions`; users should still be able to discover the record from every relevant region.

Each exercise must physically exist in exactly one canonical YAML location. The file location is a storage concern, not the navigation model.

Do not merge genuinely different exercises merely to avoid duplication. Genuine variants remain separate stable records when they materially change execution or programming role.

### Acceptance criteria

- No duplicate stable IDs.
- No duplicate canonical records representing the same exercise solely because of different body regions.
- Multi-region exercises use one canonical record with multiple `body_regions`.
- The data layer can retrieve records by region without duplicating records.
- Genuine variants remain distinct.

---

# 4. Task B — Reconcile Knowledge Manual and YAML

### Decision

Establish this hierarchy:

```text
Knowledge Manual
    = human-readable explanation / editorial surface

YAML
    = canonical structured exercise records
```

Neither source should silently introduce an exercise the other does not know about.

For every exercise in either source:

1. Match by stable ID where possible.
2. Otherwise match by canonical exercise identity.
3. Classify the difference as same exercise, genuine variation, naming difference, or obsolete/duplicate.
4. Update both representations consistently.
5. Ensure every canonical YAML record has a corresponding human-readable entry where the Knowledge Manual covers exercises.
6. Ensure the Knowledge Manual does not contain a canonical exercise with no structured record unless explicitly marked conceptual/non-exercise content.

### Known cases to resolve

- **Romanian Deadlift:** one canonical exercise if there is no execution fork; use multiple `body_regions`.
- **Dumbbell Pullover vs Dumbbell Pullover (Lat-Biased):** determine whether the latter is a genuine variation under the separate-variation rule. If yes, retain separate IDs and document the distinction; otherwise merge.
- **123 structured vs 124 prose records:** reconcile the discrepancy. Do not add an exercise just to make the numbers match.

### Acceptance criteria

- A reconciliation report exists.
- Every discrepancy has a disposition.
- No unexplained count discrepancy remains.
- Stable IDs are the cross-source identity mechanism.

---

# 5. Task C — Enforce the Canonical YAML Schema

Every structured record must conform exactly to the schema in:

- `docs/knowledge-manual/FOUNDATION.md`
- `docs/PDD/PDD.md`

No per-record exceptions are permitted without an ADR.

Normalize:

- arrays as arrays;
- enums to approved values;
- IDs as unique stable slugs;
- exact canonical field names;
- correct empty representations;
- YAML strings so commas/parentheses cannot accidentally become unintended list items.

Example:

```yaml
programming_notes:
  - "Use this when..."
```

not a scalar string when the schema declares a list.

### Acceptance criteria

A validation command fails on:

- missing required fields;
- wrong field types;
- invalid enum values;
- duplicate IDs;
- malformed YAML;
- invalid list members;
- unexpected fields;
- invalid relationship references.

---

# 6. Task D — Correct Review Status Governance

The current `reviewed` labels must be audited against the project's Review Gate. Conversion to YAML does **not** equal substantive review.

Use these meanings:

### `draft`

Exists but has not passed substantive review.

### `needs-review`

Has unresolved factual, taxonomy, evidence, or writing issues.

### `reviewed`

Has passed the complete Review Gate and is eligible to power automated decision-support features.

**Only `reviewed` records may be consumed by future recommendation logic.**

Do not fabricate evidence, cues, limitations, alternatives, or programming notes merely to pass the gate.

### Acceptance criteria

- Audit every existing record.
- Downgrade records that do not meet the gate.
- Define a reproducible promotion checklist.
- Keep incomplete information explicitly incomplete.

---

# 7. Task E — Define What "Complete" Means

Distinguish:

1. **Known and applicable** — populated.
2. **Not applicable** — represented consistently according to the schema convention.
3. **Not researched / not yet reviewed** — incomplete and therefore not eligible for `reviewed` status when material.

Do not invent content merely to fill fields.

The engineering team should choose one consistent convention for `not applicable` versus `not yet researched`.

Prefer a schema-level solution over ad-hoc sentinel strings. If a schema change is required, propose it through an ADR before implementation.

---

# 8. Task F — Normalize Movement Taxonomy

### Problem

Some records use movement-pattern values that combine a fundamental movement with a technique or position modifier.

For example:

```text
Elbow flexion
Elbow flexion with neutral grip
Elbow flexion in a lengthened shoulder position
```

Only the first is a fundamental movement pattern.

### Decision

Keep movement taxonomy at the fundamental movement-pattern level. Treat meaningful modifiers separately.

Conceptually:

```text
Movement Pattern
    ↓
Modifiers
    ├── grip
    ├── shoulder position
    ├── torso position
    ├── stance
    ├── range of motion
    └── resistance/setup characteristics
```

Do **not** immediately add every modifier as a schema field. First classify the existing data and identify which modifiers recur often enough to justify structured fields.

### Acceptance criteria

- Fundamental movement patterns use a controlled vocabulary.
- Technique/position modifiers are not masquerading as new movement patterns.
- Exercise comparison does not depend on dozens of near-duplicate movement strings.

---

# 9. Task G — Strengthen Coverage Categories

The current `coverage_categories` are a good foundation and should **not** be discarded.

For future decision logic, conceptually organize them into dimensions:

```text
ROLE
  - compound
  - isolation

STIMULUS POSITION
  - lengthened-position emphasis
  - shortened-position emphasis
  - mid-range / mixed where justified

EXECUTION
  - unilateral
  - bilateral
  - alternating

RESOURCE COST
  - low setup
  - low fatigue
  - high fatigue where explicitly represented

FUNCTION
  - hypertrophy
  - strength
  - stability
  - skill / coordination
  - equipment substitute
```

This is a **future data-model direction**, not a mandate to immediately rewrite the entire schema.

First determine whether the current flat field is sufficient for V1. If not, propose the smallest compatible extension through an ADR.

Do not introduce numerical scores where the knowledge cannot support reliable precision.

---

# 10. Task H — Introduce Automated Data Validation

Create a repeatable validation command, for example:

```bash
npm run validate-data
```

The exact implementation is up to engineering; the validation behavior is mandatory.

### Identity checks

- unique IDs;
- valid stable slugs;
- no duplicate canonical records;
- valid relationship references.

### Schema checks

- required fields;
- types;
- enums;
- controlled taxonomy values.

### Relationship checks

- alternatives reference existing IDs where IDs are used;
- complements reference existing IDs;
- overlaps reference existing IDs;
- no self-reference unless explicitly permitted.

### Governance checks

- `reviewed` records satisfy the Review Gate;
- draft/needs-review records cannot be treated as recommendation-ready.

### Consistency checks

- every record has valid `body_regions`;
- no unexplained orphan records;
- duplicate names are flagged for explicit variation justification.

The validator must return a non-zero exit code on failure.

---

# 11. Task I — Add a Knowledge QA Report

Create a generated or reproducible report containing at least:

```text
Total records
Reviewed
Draft
Needs review
Records missing evidence notes
Records missing alternatives/complements where relevant
Records with schema violations
Duplicate IDs
Duplicate canonical exercises
Orphan relationship references
Cross-module records
```

This is an engineering/knowledge-governance tool, not a user-facing feature.

---

# 12. Task J — Do Not Expand Exercise Count During Remediation

The current set of approximately 123 structured records is sufficient for this milestone.

If implementation discovers a genuinely missing exercise required to resolve a broken relationship or taxonomy case, it may be proposed individually. **Bulk expansion is out of scope.**

Optimize for:

> **depth, consistency, and decision usefulness over exercise count.**

---

# 13. Application Readiness Gate

Recommendation logic must not be built until:

- [ ] canonical IDs are stable;
- [ ] duplicate exercises are resolved;
- [ ] cross-module identity is resolved;
- [ ] YAML validates;
- [ ] taxonomy is controlled;
- [ ] prose/YAML reconciliation is complete;
- [ ] review statuses are truthful;
- [ ] recommendation eligibility is machine-deterministic;
- [ ] automated validation passes;
- [ ] no known critical data-integrity issue remains.

The application may be prototyped for rendering/browsing earlier if useful, but it must not make substantive automated recommendations from unstable data.

---

# 14. Required Engineering Deliverables

1. Canonicalized YAML dataset.
2. Updated schema documentation if a schema change is approved.
3. Knowledge reconciliation report.
4. Automated data-validation tooling.
5. QA/data-health report.
6. Updated ADR for cross-module canonical identity.
7. Updated ADR for any schema changes.
8. Updated PDD references where decisions changed.

No feature is complete until its relevant documentation is updated.

---

# 15. Definition of Done

A new developer must be able to clone the repository, run the validation command, understand what a canonical exercise record is, identify every record's review status, and trust that the structured dataset contains one canonical representation per exercise.

At that point the project is ready to move from **Knowledge Foundation** into **Application + Decision Support**.

---

# 16. Architect's Final Direction

The project should **not** be treated as incomplete because it has only ~123 exercises.

The problem is not quantity.

The existing dataset already has enough breadth to demonstrate the intended system.

The immediate priority is to make the existing knowledge trustworthy.

Next milestone:

```text
Canonical Knowledge Base
        ↓
Data-driven Application
        ↓
Browse / Search / Filter / Compare
        ↓
Coverage + Overlap + Gap Engine
        ↓
Explainable Decision Support
```

The decision engine must be built **on top of trusted knowledge**, never used to compensate for weak knowledge.

> **Do not make the Blueprint bigger until we make it trustworthy.**

That principle supersedes exercise-count goals for this phase.
