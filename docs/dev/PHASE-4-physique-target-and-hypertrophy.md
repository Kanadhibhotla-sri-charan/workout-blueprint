# Phase 4 — Physique Target + Hypertrophy Programming

**Trigger:** Architect-supplied [Phase 4 spec](../architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md), followed by a written [implementation plan](../architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md) reviewed and approved with adjustments by the architect. Approved adjustments, all incorporated into this phase's work: `physique-targets.yaml` is the authoritative taxonomy definition (exercise records only establish the relationship, never a second independent taxonomy); Lower Abs excluded entirely from v1; rep-range lookup is a default-plus-override architecture, not populated per-exercise; all programming language must use range/starting-point wording, never "optimal"/"required"/"exactly"; a specific Upper-Pec-plus-Incline-Dumbbell-Press golden test case gates taxonomy expansion; no training-experience (beginner/intermediate/advanced) personalization in v1.

**Sequencing directive:** 4A/4B (Upper Pec only) → 4D/4E/4F (Upper Pec only) → **stop and validate the golden test case** → only then expand the taxonomy → 4G–4J.

## Preliminary: a real data bug, found and fixed ahead of the taxonomy work

Auditing `primary_targets` across the dataset to check whether the physique-target taxonomy is actually derivable from real data (rather than invented) surfaced a YAML authoring bug: 8 records in `arms.yaml` had a single annotated target (e.g. `"biceps (both heads, roughly even at a neutral shoulder position)"`) written as an unquoted flow-sequence list, where the internal comma was parsed as a list separator, silently splitting one coherent string into 2–3 nonsensical list items. Fixed by quoting the strings — content unchanged, only the list boundary. Verified only those 8 lines changed (`diff` against a pre-edit backup), `npm run validate-data` and the app's 50-test suite both still passed. Committed separately, before this phase's taxonomy work, since the taxonomy needed to trust this data.

## 4A/4B — Physique-target taxonomy (Upper Pec only)

**Date:** 2026-08-16

### What changed

- **[ADR 0003](../adr/0003-physique-targets-field.md)** — the schema decision: a new optional exercise-record field, `physique_targets: [string] | null`, establishing which canonical target(s) an exercise serves; `data/programming/physique-targets.yaml` is the single authoritative definition of what a target *means* (per the architect's explicit correction to the original plan — the file does not list exercises, avoiding a second taxonomy that could drift). Documents the full per-region audit that grounds the taxonomy in real data: shoulders (front/side/rear delt) and chest (upper/mid/lower pec, already present as `primary_targets` annotations) are clean; back (lat width vs. thickness) and arms (biceps/brachialis/triceps, head-bias) are clean; core's upper/lower-abs split is explicitly **not** introduced, since the data doesn't support it and the distinction is contested in the literature generally — matches the architect's explicit exclusion.
- **`data/programming/physique-targets.yaml`** — exactly one target defined: `upper-pec` (id, name, parent region, anatomical definition, visible physique outcome), per "Upper Pec only initially."
- **`data/programming/global-principles.yaml`** — RIR (typical working range 1–3, full range 0–4), weekly volume (starting point, practical range, higher/recovery-dependent range), frequency (typical starting range 2–3/week), and the double-progression model, all as ranges/starting-points. Includes an explicit `wording_rules` block (prefer "typical/practical/starting range," avoid "optimal/required/maximum/exactly N") that the UI and engine are expected to follow, per the architect's explicit wording correction.
- **`data/programming/rep-ranges.yaml`** — default lookup by `exercise_type` + `coverage_categories` (heavy-compound → 6–12 primary/5–15 acceptable; stable-compound → 8–15/6–20; isolation → 10–20/8–30; compound-fallback → 6–15/5–20), plus an explicit, currently-empty `overrides` list — architecture supports a future exercise-specific override without restructuring, but nothing populates it yet, per the architect's explicit "don't create exercise-specific programming records for all 123 exercises now" correction.
- **`data/programming/intensity-techniques.yaml`** — three techniques (drop-set, rest-pause, myo-reps), each with what/when/when-not/fatigue-time-implications/suitable-exercise-types, plus the deterministic v1 suggestion rule (documented here, implemented in 4F): suggest drop-set, and only drop-set, when the exercise is isolation, `fatigue_cost` is low or medium, and no active user fatigue constraint would be exceeded. Kept to 3 of the spec's 6 named techniques for the v1 slice — expanding the catalog is 4H scope, not an architecture change.
- **`scripts/lib/load-programming.js`** — loads and parses `physique-targets.yaml`, exposing the set of valid target ids.
- **`scripts/lib/validate.js`** — new referential-integrity check: every `physique_targets` entry must resolve to a real id in `physique-targets.yaml`, same treatment `overlaps_with` gets against exercise ids. Verified by deliberately injecting an unknown id (`bogus-target-id`), confirming the validator caught it and exited non-zero, then restoring the file and confirming a clean re-run — same discipline used for every validator check added since Phase 2.
- **`scripts/lib/taxonomy.js`** — `physique_targets` added to `OPTIONAL_LIST_FIELDS` and `ALL_FIELDS`.
- **`data/exercises/chest.yaml`** — `physique_targets: [upper-pec]` added to exactly the 6 records the audit identified as upper/clavicular-biased: incline-dumbbell-press, incline-barbell-press, incline-machine-press, smith-machine-incline-press, incline-cable-press, incline-dumbbell-fly. Verified via `diff` against a pre-edit backup that only these 6 lines were inserted.
- **`docs/knowledge-manual/SCHEMA.md`** — `physique_targets` field entry and summary-table row added, cross-referencing `physique-targets.yaml` as authoritative per ADR 0003.
- **`docs/knowledge-manual/programming/README.md`** — human-readable explanation of the four `data/programming/` files and the evidence-basis approach, at the location the architect spec itself suggested (§20) for prose documentation, kept separate from the machine-readable data it describes.

### Decisions made

- **Explicit `physique_targets: null` was not written onto the other 117 records.** The field is optional, and `scripts/lib/validate.js`'s existing `isListOrNull` check already treats an absent field the same as `null` — writing `null` explicitly on every record not yet in the taxonomy would touch every exercise file for zero informational gain and a large, noisy diff. Documented as a deliberate choice in ADR 0003, not an oversight.
- **Rep-range lookup keys on existing fields (`exercise_type`, `coverage_categories`) rather than a new per-exercise field** — every exercise already carries the information the default rule needs; no schema change was required for this part, only for the taxonomy relationship itself.
- **Intensity-technique catalog trimmed to 3 of the spec's 6 named techniques for v1** — matches "keep Phase 4 fast, build one vertical slice first"; the remaining three (lengthened partials, mechanical drop sets, supersets) are explicitly deferred to 4H, not silently dropped.

### Verified

- `npm run validate-data`: PASS, 123/123 records, 0 issues.
- Validator's new physique-target referential-integrity check confirmed to actually catch a violation (deliberately injected, caught, reverted), not just pass on clean data.
- `npm run data-report`: regenerates cleanly; `physique_targets` correctly does not appear in the "content completeness" gap table, since that table specifically flags true `[]` (ADR 0002 "not yet established") and every unpopulated record here is legitimately absent-by-design (taxonomy not yet expanded to it), not a content gap — confirmed this is the report's existing, correct behavior, not a bug to fix.

### Pending decisions

None from this checkpoint.

---

## 4D/4E/4F — Upper Pec engine + UI slice

*Not yet started.*
