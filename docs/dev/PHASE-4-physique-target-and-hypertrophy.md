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

**Date:** 2026-08-16

### What changed

- **App data pipeline extended** (`app/scripts/generate-data.mjs`): now also loads and bundles `data/programming/*.yaml` into `app/src/data/programming.generated.json`, alongside the existing exercises bundle — same mechanical-transform, validate-before-bundling discipline as Phase 3's 3B. New types (`app/src/types/programming.ts`) mirror the YAML shapes exactly; `Exercise` gains `physique_targets`.
- **`app/src/engine/programmingEngine.ts`** — `resolveRepRange()` (default-plus-override lookup, exactly the architecture the architect approved in item 3), `buildProgramming()` (combines rep range, global RIR/frequency/progression, and intensity-technique selection into one result), with the fatigue-constraint interaction from approval memo item 5 implemented as a direct, deterministic rule: `maxFatigueCost === 'low'` moves weekly volume to its starting-point (lower) range, collapses frequency to its lower bound, and suppresses intensity-technique suggestions entirely.
- **`engine/types.ts`**: `DecisionInput` gains `physiqueTarget: string | null` as an *additive* field (not a replacement for `bodyRegion`) — Phase 3's body-region-only selection keeps working unchanged when it's null. `DecisionResult`'s `'ok'` variant gains `target`, `visualObjective`, `stimulus`, and `programming`.
- **`engine/decisionEngine.ts`**: Step 1 now resolves a physique target when given and falls back to body-region matching when the target has no curated exercises yet (taxonomy still expanding) — this is what lets the golden test case work today with only Upper Pec populated. `target`/`visualObjective` are populated based on whether the target genuinely drove candidate selection (see "decisions made" below, this was corrected mid-checkpoint), not on whether the specific final pick happens to carry that exact tag.
- **`DecisionMakerPage.tsx`**: Step 1 becomes "What do you want to improve?" — a single select, grouped by region via `<optgroup>`, offering "All \<Region\>" plus any specific targets defined for that region. Generalizes automatically as the taxonomy grows; today only Chest's group has a second option (Upper Pec). Result view reordered to match spec §25 exactly: 🎯 Target → 👀 Visual objective → 🥇 Best fit/Why → 🧬 Stimulus → 📊 Programming → ⚡ Optional technique → 🥈 Alternative → ⚠️ Watch out → 🔄 Complements.
- **Two real bugs found and fixed while building this, not just at test time:**
  1. **Declared-complement validation was over-constrained.** `resolveComplements()`'s result was filtered against the narrow, target-tagged candidate pool — so Incline Dumbbell Press's own curated complement, Cable Fly, got silently discarded because Cable Fly isn't (yet) tagged `upper-pec`, even though it's a real, useful, data-grounded complement (its own record notes its bias is pulley-height-adjustable toward upper-chest). Fixed by validating declared complements/alternatives against a separate, broader region-level constraint pool (`regionCandidates` — equipment/fatigue/draft-filtered, but not target-narrowed) instead of the narrow target-matched `candidates`. Caught by building the actual golden scenario, not by inspection.
  2. **Target/visualObjective were tied to the wrong thing.** The first implementation only populated `target`/`visualObjective` when the *specific recommended exercise* itself carried the target tag — which meant the golden scenario's own correct recommendation (Cable Fly, untagged) silently hid the "🎯 Target: Upper Pec" block the user had explicitly asked for. Fixed by tying `target`/`visualObjective` to whether the target *genuinely drove candidate selection* (had at least one curated exercise) rather than the final pick's own tags — matching spec §25's actual definition ("what the user is actually trying to improve"), not a stricter reading that happened to be easier to implement.

### Verified

- `npx tsc -b`, `npm run build`, and `npm run test` all clean — **64 tests across 11 files** (up from 50 at the end of Phase 3), including new `programmingEngine.test.ts` (rep-range bucketing per exercise characteristics, fatigue-constraint interaction, intensity-technique suppression) and new "Phase 4 physique-target awareness" cases in `decisionEngine.test.ts` and `DecisionMakerPage.test.tsx`.
- **Visually verified** the new target-selection dropdown (grouped by region, Upper Pec nested under Chest) and confirmed the Explorer and Exercise Detail pages render identically to before this checkpoint — no Phase 3 regression, per the Definition of Done's explicit requirement.
- Root `npm run validate-data`: still PASS, 123/123 records, 0 issues — no data files touched in this checkpoint beyond what 4A/4B already committed.
- **The golden test case itself is documented and verified separately** — see [`docs/dev/reports/PHASE-4-GOLDEN-TEST-CASE.md`](reports/PHASE-4-GOLDEN-TEST-CASE.md), the architect-required acceptance gate before taxonomy expansion.

### Decisions made

- **`physiqueTarget` is additive to `DecisionInput`, never replacing `bodyRegion`** — the only way to satisfy "existing Phase 3 exercise selection still works" as a hard requirement rather than a best-effort goal; every existing Phase 3 test still passes completely unmodified in behavior (only the object literals needed a new field added to satisfy TypeScript).
- **Target-tag narrowing applies to which exercises can be a *new* pick, not to whether a current exercise's own curated relationship is honored** — the two bugs above are really one underlying lesson: a physique target should narrow *what the engine searches from scratch*, but must not retroactively invalidate an already-curated, already-correct relationship (a `complements`/`alternatives` entry) just because the taxonomy hasn't tagged the other side of that relationship yet.
- **Single-page form with a grouped `<optgroup>` select, not a separate target-drill-down screen** — same reasoning as 3G's single-page-form decision: the conceptual "browse a region, then optionally pick a specific target" flow from spec §6 doesn't require separate screens or extra navigation state, and the grouped-select approach scales cleanly as more targets are added without a UI rewrite.

### Pending decisions

None from this checkpoint.

---

## Golden test case — STOP gate

**Result: PASS.** See [`docs/dev/reports/PHASE-4-GOLDEN-TEST-CASE.md`](reports/PHASE-4-GOLDEN-TEST-CASE.md) for the full scenario, real (not illustrative) engine output, and a checklist confirming all 8 required behaviors from the architect's approval memo. Per the architect's explicit instruction, taxonomy expansion beyond Upper Pec may now proceed.

---

## Expand taxonomy to remaining defensible targets

**Date:** 2026-08-16

**Trigger:** golden test case passed; architect's explicit instruction to proceed with the pre-approved target list once it did.

### What changed

- **`data/programming/physique-targets.yaml`** — 14 new target definitions added (15 total with Upper Pec), covering exactly the architect-approved list and nothing beyond it:
  - Chest: `mid-pec`, `lower-pec` (Upper Pec already existed)
  - Shoulders: `front-delt`, `side-delt`, `rear-delt`
  - Back: `lat-width`, `back-thickness`, `upper-traps`
  - Arms: `biceps`, `brachialis-arm-thickness`, `triceps`, `triceps-long-head` (a sub-target of `triceps` — the data explicitly supports it via `evidence_notes` calling the long-head bias "strongly supported by hypertrophy research" on two records, distinct from the weaker "partial stretch" case on a third that stays general-triceps-only)
  - Core: `obliques`, `rectus-abdominis` — **`lower-abs` deliberately not added**, per the architect's explicit exclusion (ADR 0003).
  - No targets added for quads, hamstrings, calves, hips, forearms, or neck — not on the approved list, and adding them would be the scope creep the spec's final guardrail warns against.
- **69 exercise records tagged** with `physique_targets` across `chest.yaml` (13), `shoulders.yaml` (12), `back.yaml` (15), `arms.yaml` (20 — every record in the file), and `core.yaml` (9 — every record in the file), re-deriving each mapping from the same real-data audit method used for Upper Pec (primary_targets annotations, not invented). Two genuine multi-target cases preserved, per the architect's explicit instruction not to collapse them:
  - `seated-cable-row`, `t-bar-row`, `single-arm-dumbbell-row` → both `lat-width` and `back-thickness` (their own `primary_targets` list both `lats` and `mid-back`/`rhomboids`).
  - `cable-fly` → all three chest targets (`upper-pec`, `mid-pec`, `lower-pec`) — its own record already states the bias is pulley-height-adjustable across all three, so tagging it narrowly would have been less accurate than the multi-tag.
- **`app/src/data/physique-targets.test.ts`** (new) — generic, taxonomy-size-independent integrity tests: every defined target resolves and has non-empty content; every exercise's `physique_targets` entries resolve to a real target; every tagged exercise's target shares the target's parent region; every target has at least one exercise; `lower-abs` is confirmed absent; the two multi-target cases above are confirmed preserved.
- Added 3 more `decisionEngine.test.ts` cases exercising a newly-expanded target end-to-end (not just data integrity): `side-delt` goal-only, `biceps` replace-exercise (stays within `elbow flexion`), and confirming `back-thickness` vs. `lat-width` resolve to genuinely different candidate pools.

### Verified

- Every tagging insertion applied via a scripted, backup-and-diff-verified pass (same discipline as the arms.yaml bug fix and the original Upper Pec tagging) — `diff` against a pre-edit backup for all 5 touched files confirmed only the intended `physique_targets` lines were added, nothing else changed.
- `npm run validate-data`: PASS, 123/123 records, 0 issues — every one of the 69 new tags resolves against the expanded `physique-targets.yaml`.
- Python cross-check: 123 unique ids, no duplicates, no unexpected keys; confirms 75/123 records now carry `physique_targets` (6 from the Upper Pec slice + 69 from this pass).
- `npx tsc -b`, `npm run build`, and `npm run test`: all clean — **75 tests across 12 files** (up from 64 after the Upper Pec slice).
- Root `npm run validate-data` re-confirmed after the app-side test run, matching the project's standard pre-commit discipline.

### Decisions made

- **`triceps-long-head` added as a sub-target of `triceps`, not a standalone target** — matches the spec's own taxonomy sketch (`Triceps → Long-head emphasis` as a nested item) and is directly grounded in existing `evidence_notes`, not invented. Every record tagged `triceps-long-head` is also tagged plain `triceps` (verified by test) — a long-head-emphasis exercise is still a triceps exercise, just a more specific one.
- **No equivalent biceps head-bias sub-targets added**, even though the data has the same long-/short-head annotation pattern for biceps that motivated `triceps-long-head`. The architect's approved list named head emphasis explicitly for triceps only ("Triceps / relevant head emphasis where supported") and just "Biceps" with no qualifier — followed the approved list literally rather than extending it by analogy, per the final guardrail against unrequested scope expansion.
- **cable-band-external-rotation and push-up-plus (shoulders) were left untagged** — their primary targets (external rotators, serratus anterior) aren't physique-visible targets in the sense the spec's taxonomy names (they're stability/scapular-mechanics exercises), and no target on the approved list fits them. Left as body-region-only, same as before this checkpoint.
- **conventional-deadlift and back-extension-45-spinal-dominant (back) were left untagged** — spinal erectors isn't one of the approved back targets (lat width, back thickness, upper traps); tagging them would mean inventing a target the architect didn't approve.

### Pending decisions

None from this checkpoint. Taxonomy now covers every target on the architect's approved expansion list.
