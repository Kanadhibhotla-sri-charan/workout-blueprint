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

---

# Revision — Aesthetic Outcome layer

**Trigger:** Architect-supplied [revised Phase 4 spec](../architecture/PHASE-4-REVISED-AESTHETIC-OUTCOME.md), inserting a new first-class Aesthetic Outcome layer above the physique-target layer (Aesthetic Outcome → Physique Target → Anatomy → Stimulus → Exercise → Programming → Progression). Explicit process gate (§35/§43): a full-body taxonomy audit (4A) and architect review of the proposed taxonomy (4B) must happen before any canonical `aesthetic-outcomes.yaml` data is written, and the entire taxonomy must not be implemented before the first vertical slice validates.

**Sequencing directive:** 4A (audit) → 4B (architect review) → **stop, do not write canonical data until approved** → 4C–4G (first golden slice only) → 4H (second golden slice) → 4I (full taxonomy expansion) → 4J–4L.

## 4A/4B — Full-body taxonomy audit + architect review

**Date:** 2026-08-16

Read all 123 exercise records across all 11 `data/exercises/*.yaml` files, focused on the `mirror_effect` field, to derive a candidate aesthetic-outcomes taxonomy grounded in real data rather than the spec's own illustrative examples (the spec explicitly warns against just implementing its examples and calling the taxonomy complete). Findings and proposal written to [`docs/dev/reports/PHASE-4-AESTHETIC-TAXONOMY-PROPOSAL.md`](reports/PHASE-4-AESTHETIC-TAXONOMY-PROPOSAL.md): ~24 candidate outcomes across all 11 regions, 9 new physique targets proposed for the 6 previously-untagged regions (calves, forearms, hamstrings, hips/glutes, neck, quads), functional-only exercises explicitly identified and kept out of the aesthetic list, and two outcomes flagged as lower-confidence (quad-sweep-separation: single-exercise support; neck-thickness: the data's own "niche" framing) rather than silently included at full confidence.

**Architect review outcome:** both flagged outcomes approved for inclusion — full ~24-outcome / 9-target taxonomy approved as proposed.

## 4C/4D — Canonical aesthetic-outcomes.yaml + pipeline wiring

**Date:** 2026-08-16

### What changed

- **`data/programming/aesthetic-outcomes.yaml`** (new) — populated with only the two outcomes required for the two golden vertical slices (§36/§37): `chest-side-projection` (→ `upper-pec`, `lower-pec`) and `triceps-back-depth` (→ `triceps`, `triceps-long-head`). Both resolve entirely to physique targets that already existed from the first Phase 4 pass, so this introduces zero new taxonomy risk. The remaining ~22 architect-approved outcomes and the 9 new physique targets are deliberately deferred to 4I, per the spec's explicit "do not implement the entire taxonomy before validating the first vertical slice" instruction — same discipline as building Upper-Pec-only before the original taxonomy expansion.
- **`scripts/lib/load-programming.js`** — `loadAestheticOutcomes()`, same treatment as `loadPhysiqueTargets()`.
- **`scripts/lib/validate.js`** — loads aesthetic outcomes once at module scope; validates required fields (`id`, `display_name`, `region`, `viewpoint`, `visual_description`) and that every `physique_targets` entry resolves to a real id in `physique-targets.yaml`. Verified by injecting a bad reference (`bogus-target-id-xyz`), confirming `npm run validate-data` caught it and exited non-zero, then restoring and re-confirming a clean pass — same discipline used for every validator check this project has added.
- **`app/scripts/generate-data.mjs`** — bundles `aesthetic-outcomes.yaml` into `programming.generated.json` as `aestheticOutcomes`.
- **`app/src/types/programming.ts`** — new `AestheticOutcome` interface, added to `ProgrammingData`.
- **`app/src/data/index.ts`** — `aestheticOutcomes` export, `getAestheticOutcomeById()`, `getAestheticOutcomesByRegion()`.
- **`app/src/data/aesthetic-outcomes.test.ts`** (new) — generic taxonomy-integrity tests (same pattern as `physique-targets.test.ts`): every outcome resolves with non-empty required fields; every mapped physique target resolves to a real target; region filtering only returns matching outcomes; both golden-slice outcomes map to the expected targets.

## 4E/4F/4G — Chest-side-projection vertical slice (Appearance entry point + drill-down)

**Date:** 2026-08-16

### What changed

- **`app/src/pages/DecisionMakerPage.tsx`** — added an "Appearance" entry point above the existing question 1: a region select filtered to regions with aesthetic outcomes, then a dependent outcome select. Picking an outcome resolves to its first mapped physique target (`outcome.physique_targets[0]`) and that target's `parent_region`, writing into the exact same `physiqueTarget`/`bodyRegion` state the existing direct target-picker already used — purely additive, the previously-validated direct-picker flow and its tests are untouched. Editing question 1 directly afterward clears the aesthetic-outcome state, so the result view doesn't show a stale "what you're trying to change" block for an outcome the user has since moved away from.
- **Result view** — new "👀 What you're trying to change" block, shown only when the recommendation came from the appearance entry point, displaying the outcome's `display_name` and `visual_description`, with the optional `technical_explanation` behind a native `<details>`/`<summary>` progressive-disclosure toggle (§14's "user should be able to stop at the simple answer or expand into deeper technical material" — no new UI dependency, reuses the browser's own disclosure widget). Placed ahead of the existing 🎯 Target block, matching the spec's hierarchy (aesthetic outcome → physique target → anatomy → stimulus → exercise).
- **`app/src/index.css`** — minor styling: the appearance entry point gets a dashed border to read as an alternate front door rather than a required step; the outcome block shares the accent treatment the "Best fit" block already uses, since it's the other half of the "headline answer."
- **`app/src/pages/DecisionMakerPage.test.tsx`** — two new tests: the actual required golden-slice acceptance test (§36) — going through the appearance selector itself, not the direct target dropdown, and asserting it resolves to the same already-validated Upper Pec → Incline Dumbbell Press → Cable Fly chain with full programming present — plus a regression test confirming a direct edit to question 1 clears the stale outcome block.

### Decisions made

- **An outcome's engine input is its first listed physique target, not a fuzzy blend of all of them.** `chest-side-projection` maps to `[upper-pec, lower-pec]`; using the first (`upper-pec`) reproduces the exact, already-validated golden chain from the original Phase 4 pass rather than requiring new engine logic to combine multiple targets. The full mapped-target list is still shown in the technical drill-down, so nothing about the outcome's actual scope is hidden — only which target drives candidate selection is simplified. If this proves inadequate for a future outcome, it's revisitable without a data-model change.
- **No engine or `DecisionInput`/`DecisionResult` type changes.** The aesthetic-outcome layer is UI-only: it resolves to the exact same `physiqueTarget`/`bodyRegion` inputs the engine already accepted and validated. This kept 4F ("programming knowledge integration") a verification step, not new work — the golden-slice test's Reps/RIR/programming assertions confirm the existing programming engine is unaffected.

### Verified

- `npm run validate-data`: PASS, 123/123 records, 0 issues.
- Aesthetic-outcomes validator check confirmed to actually catch a violation (deliberately injected, caught, reverted).
- `npx tsc --noEmit`: clean.
- `npm run test`: **82 tests across 13 files**, all passing (up from 80 after 4C/4D, up from 75 before this revision) — including the required golden-slice test through the actual appearance-selector UI.

### Pending

4H (second golden slice: triceps-back-depth) is next — the outcome data already exists in `aesthetic-outcomes.yaml` from 4C, so this is primarily a validation step (a golden-slice test through the same UI, proving the architecture isn't chest-only), not new data or engine work, unless a triceps-specific issue surfaces.

## 4H — Second vertical slice: triceps-back-depth (STOP-gate validation)

**Date:** 2026-08-16

As expected, 4H required no new data or engine work — `triceps-back-depth` was already in `aesthetic-outcomes.yaml` from 4C. Validated end to end through the actual UI: Arms → "Triceps have no depth from behind" → complement-current against Cable Pushdown → resolves to Triceps target, Close-Grip Bench Press as the best fit (a genuinely different movement — heavy-compound horizontal press vs. Cable Pushdown's isolated elbow extension), full programming guidance present.

Two test-assertion collisions surfaced while writing the test (not product bugs): the target's `physique_outcome` and the aesthetic outcome's `technical_explanation` independently paraphrase the same "triceps ≈ two-thirds of upper-arm size" fact from the same source data, so a couple of substrings appeared in both blocks' text — `screen.getByText` failed with "multiple elements found." Fixed by scoping those specific assertions to the relevant result block (`.decision-result-best`, `.decision-result-target`) rather than a bare global text query, same disambiguation pattern already used elsewhere in this test file.

### Verified

- `npm run test`: **83 tests across 13 files**, all passing.
- Both required golden vertical slices (§36 chest-side-projection, §37 triceps-back-depth) now pass through the actual product UI, confirming the aesthetic-outcome architecture generalizes beyond chest — the explicit purpose of requiring a second slice before any taxonomy expansion.

### STOP-gate status

Both golden slices pass. Per the spec's own implementation order (§43), 4I (expand the taxonomy to the full architect-approved ~24 outcomes / 9 new physique targets from the 4A/4B proposal) is next, but is a substantial expansion — checking in with the architect before proceeding, same discipline used before the original taxonomy expansion in the first Phase 4 pass.

---

# Revision — Phase 4 Corrections

**Trigger:** Architect-supplied [corrections memo](../architecture/PHASE-4-CORRECTIONS.md) reviewing the built slices. Two required corrections before proceeding to the full taxonomy expansion: (1) make Aesthetic Outcome the genuine primary physique-goal entry point, not an optional shortcut alongside the direct target picker; (2) replace the permanent `physique_targets[0]` assumption with an explicit primary/supporting target model so contributing targets are never silently discarded. Explicit non-goals: do not restart Phase 4, do not rewrite the decision engine, do not introduce AI.

**Date:** 2026-08-17

## Correction #2 — primary/supporting target schema + engine

Implemented first since the UX correction depends on it.

### What changed

- **`data/programming/aesthetic-outcomes.yaml`** — `physique_targets: [...]` replaced with an explicit `primary_targets: [...]` / `supporting_targets: [...]` split on all three outcomes. `chest-side-projection`: primary `upper-pec`, supporting `lower-pec`. `triceps-back-depth`: primary `triceps`, supporting `triceps-long-head`. Both preserve the exact primary target the two already-passing golden slices depend on, so neither slice's `bestFit` changes (see Verified below for why — both slices use `complement-current`, whose ranking never reads the target-narrowed candidate pool).
- **New outcome: `arm-side-thickness`** ("Arms look thin from the side") — primary `brachialis-arm-thickness`, supporting `triceps`. Added specifically to satisfy the Corrections doc's required multi-target golden slice (§19/§21 step 10), and grounded in real data rather than the doc's own illustrative "overall upper-arm development" example (per §13, "use the actual audited taxonomy... rather than inventing a new list from this document" — no target named "overall upper-arm development" exists, so it wasn't invented): `brachialis-arm-thickness`'s own `physique_outcome` explicitly says "seen from the side," making it the genuine primary driver of this specific viewpoint, distinct from `arm-side-projection`'s existing chest and triceps outcomes.
- **`scripts/lib/validate.js`** — required-field/referential-integrity check updated for the new schema: `primary_targets` (required, non-empty, must resolve) and `supporting_targets` (optional, must resolve when present, and must not repeat a primary target — verified by deliberately injecting both an unknown supporting-target id and a supporting target that duplicates the primary, confirming both violations were caught, then restoring).
- **`app/src/types/programming.ts`** — `AestheticOutcome.physique_targets` replaced with `primary_targets: string[]` and `supporting_targets?: string[]`.
- **`app/src/engine/types.ts`** — `DecisionInput` gains `supportingPhysiqueTargets: string[] | null`, alongside the existing `physiqueTarget: string | null` (the primary). `DecisionResult`'s `'ok'` variant gains `supportingTargets: PhysiqueTarget[]` — always an array, empty rather than omitted, so "not silently discarded" is enforceable by a test, not just a code-review convention.
- **`app/src/engine/decisionEngine.ts`** — Step 1 now computes `primaryMatches` (unchanged from before) and, only once the primary target has genuinely resolved, folds in `supportingMatches` (exercises tagged with any `supportingPhysiqueTargets` id) via a de-duplicating union into the candidate pool. `target`/`visualObjective` still derive from the primary only (Corrections §8: "the primary target should drive the main recommendation... do not automatically give equal weight to all targets") — supporting targets broaden the pool and are resolved into `supportingTargets` for display, but never substitute for an unresolved primary (a bare `supportingPhysiqueTargets` list with no matching primary target does not narrow anything on its own — verified by test).
- **`app/src/pages/DecisionMakerPage.tsx`** — `handleAestheticOutcomeChange` now reads `outcome.primary_targets[0]` (unchanged mechanism, corrected field name) and separately sets `supportingPhysiqueTargets` from `outcome.supporting_targets ?? []`; both are cleared when the user overrides via the direct/advanced picker, same staleness-prevention already in place for the aesthetic-outcome id itself. Result view gained a "🧩 Also contributes" block, listing every supporting target's name and `physique_outcome`, shown whenever `supportingTargets.length > 0`.

### Decisions made

- **Supporting targets broaden the pool via a union, not a fallback-when-empty.** Considered a narrower alternative (only try supporting targets if the primary target's own pool comes up empty), but the Corrections doc's own bullet list (§8: "broaden the candidate pool... identify complementary exercises... explain the aesthetic outcome... prevent a recommendation from ignoring an important contributor") describes an always-on broadening, not a rare fallback — and a fallback-only design would make the multi-target golden slice's own supporting target (`triceps`, whose exercises are certainly reachable via the `arms` body region already) look like it does nothing, since `brachialis-arm-thickness` alone already has non-zero matches. The union design is what actually makes the golden slice's own proof (isolation-only primary pool vs. heavy-compound pick once triceps is folded in) meaningful.
- **The union only applies once the primary target has resolved.** A `supportingPhysiqueTargets` list with an unresolved (or absent) primary target does not narrow candidates on its own — matches Corrections §8's "the primary target should drive the main recommendation," and avoids a confusing state where a target the user never selected as primary could still narrow their results. Verified by test (`not-a-real-target` primary + valid `upper-pec` supporting still falls back to plain body-region selection).
- **`supportingTargets` is typed as a plain array, not `array | null`.** An empty array and "no supporting targets" are the same state; making callers null-check adds friction without adding information the type doesn't already carry, and "always an array, empty when none" is the same pattern `complements`/`watchOut` already use elsewhere in `DecisionResult`.

### Verified

- Deliberately injected two aesthetic-outcomes.yaml violations (an unknown supporting-target id, a supporting target duplicating the outcome's own primary target) — both caught by `npm run validate-data`, then restored and re-confirmed clean.
- New engine-level tests (`decisionEngine.test.ts`): a primary-only outcome still returns `supportingTargets: []`; a primary+supporting outcome resolves both; the supporting target concretely changes the `build-base` recommendation (brachialis-only pool has no heavy-compound option; folding in triceps produces `close-grip-bench-press`); an unresolved primary is never rescued by a valid supporting target.
- Confirmed via direct inspection that the two pre-existing golden slices' `bestFit` is unaffected by the schema change: both use `complement-current`, whose ranking path (`resolveComplements` + `regionCandidates`) never reads the target-narrowed `candidates` variable the primary/supporting union feeds — the union only affects `build-base`/`replace-exercise`/`low-fatigue`/`limited-equipment`/`visual-area` goals and the (already non-zero either way) `no-candidates` check.

## Correction #1 — Appearance as the primary entry point

### What changed

- **`app/src/pages/DecisionMakerPage.tsx`** — question 1 restructured into a `<fieldset>` with the legend "1. What do you want to improve?" containing a 3-way radio choice — 👀 Appearance, 🦴 Function, 🎯 Direct / Advanced — defaulting to **Appearance** (not a neutral empty state), per Corrections §5's "the first physique-oriented problem presented to the user is an aesthetic/visual problem." Each mode renders its own panel below the radios:
  - **Appearance** (default): the region → aesthetic-outcome selector pair from 4E, unchanged in behavior, just relocated and re-labeled ("Body area" / "How do you want it to look?").
  - **Function**: a stub message naming what it will eventually cover (rotator cuff, scapular stability, hip mobility, core stability) and pointing to the other two modes — intentionally not a working form, since no functional taxonomy/data model exists yet (that's 4J, explicitly a later implementation-order step in both the revised spec and the corrections doc; building it now would be exactly the scope expansion §20 warns against). Steps 2-4 and the submit button are hidden entirely in this mode, so there's no way to submit a stale or meaningless recommendation from it.
  - **Direct / Advanced**: the pre-existing region/target `<select>` from Phase 4's first pass, unchanged in mechanism — same id (`dm-target`), same `region:`/`target:` value scheme — just relabeled ("Region or physique target," since "What do you want to improve?" now belongs to the mode radios) and gated behind this mode instead of always visible. Corrections §4 explicitly requires reusing the existing engine, not building a second one — this mode is a visibility change only, zero new logic.
  - Switching modes preserves whatever `bodyRegion`/`physiqueTarget` state is already set (e.g. picking an outcome in Appearance mode, then switching to Advanced, shows that same target already selected) — a deliberate continuity property, not incidental.
- **`app/src/index.css`** — `.entry-mode-field`/`.entry-mode-choices`/`.entry-mode-panel`/`.radio-field` styling, reusing the existing `.decision-constraints` fieldset and `.checkbox-field` patterns rather than inventing new visual language. Removed the now-unused `.appearance-entry` rule from 4E (the appearance block is no longer a standalone always-visible div).

### Decisions made

- **Function is visible but non-functional, not hidden entirely.** Corrections §5's acceptance criteria explicitly lists "Appearance and Function remain clearly separated" as a checkbox for *this* correction, and §19 lists "Function remains separate" under required new tests — both read as wanting the three-way branch visible now, with Function's actual data model still correctly deferred to 4J. A stub message is minimal, inspectable complexity (matches §12's "keep it deterministic and explainable," even though that guidance was written about the target-mapping model specifically) — not a new engine or a functional taxonomy built ahead of schedule.
- **All pre-existing DecisionMakerPage tests needed updating**, since the direct/advanced `<select>` is no longer visible by default — they now click the "Direct / Advanced" radio first via a small `useAdvancedMode` test helper. This is treated as an intentional behavior change validated by tests, not a regression: the corrections memo explicitly asked for exactly this default-to-Appearance behavior.

### Verified

- `npm run test`: **92 tests across 13 files**, all passing (up from 83 before this revision) — including new tests for: Appearance checked by default with no anatomical picker visible; Function showing its stub and hiding goal/constraints/submit entirely; the direct/advanced path still resolving the original golden test case end to end; and the new multi-target golden slice (`arm-side-thickness`) passing through the actual Appearance UI, with its "Also contributes" block visibly listing the supporting target.
- `npx tsc -b --force`: clean. (Note for future work: this project's root `tsconfig.json` has `"files": []` with only `references` — plain `tsc --noEmit` silently checks zero files against it; `tsc -b` is required to actually type-check the referenced `tsconfig.app.json`/`tsconfig.node.json` projects. Caught this mid-session when a real missing-field error didn't surface until switching commands.)
- `npm run lint` (oxlint) and `npm run build`: both clean.
- `npm run validate-data` (root): PASS, 123/123 records, 0 issues.

### Pending

Both golden slices (chest-side-projection, triceps-back-depth) and the new multi-target slice (arm-side-thickness) all re-pass after both corrections, satisfying the corrections doc's own validation requirements (§19, implementation-order steps 5, 8-10). Per §21's implementation order, 4I (expand to the full ~21 remaining approved outcomes and 9 new physique targets from the 4A/4B proposal) is next.

---

# 4I — Full-body taxonomy expansion

**Date:** 2026-08-17

Implements the complete architect-approved taxonomy from the 4A/4B proposal (`docs/dev/reports/PHASE-4-AESTHETIC-TAXONOMY-PROPOSAL.md`), following the corrections doc's own implementation order (§21, step 6, after both golden slices and the multi-target slice re-passed).

### What changed

- **`data/programming/physique-targets.yaml`** — 10 new targets (15 → 25 total): `gastrocnemius`, `soleus` (calves); `gluteus-maximus`, `gluteus-medius-minimus`, `adductors` (hips); `quads` (a single generic target, not split by head or by the leg-extension "sweep" emphasis the data only weakly supports); `hamstrings` (a single generic target, deliberately not split by exercise — see the file's own note); `forearm-flexors`, `forearm-extensors`; `neck-thickness` (one of the two 4A-flagged lower-confidence outcomes, architect-approved to keep).
- **38 exercise records tagged** with `physique_targets` across `calves.yaml` (4), `hips.yaml` (6), `quads.yaml` (16 — every record in the file), `hamstrings.yaml` (6 — every record in the file), `forearms.yaml` (4), and `neck.yaml` (2), re-deriving each mapping from the same real-data audit method used for the first taxonomy expansion (`primary_targets` annotations on each exercise record).
- **A real region-alignment constraint surfaced and was resolved by narrowing, not by loosening the invariant.** `physique-targets.test.ts`'s existing generic check — every tagged exercise's `body_regions` must contain its target's `parent_region` — meant `gluteus-maximus` (parent_region: `hips`) could only be tagged onto hips.yaml/hamstrings.yaml exercises whose `body_regions` actually includes `hips`, not onto quads.yaml's squat/press variants (whose own `secondary_targets` do mention glutes, but whose `body_regions` is `[quads]` only). Same issue for `adductors` (parent_region: `hips`) against quads.yaml's `sumo-squat`/`sumo-deadlift`. Resolved by simply not tagging the cross-region cases rather than weakening the test or picking an inconsistent `parent_region` — `gluteus-maximus` still resolves from 5 real exercises (`hip-thrust`, `smith-machine-romanian-deadlift`, `bulgarian-split-squat-hip-dominant`, `cable-kickback-glute`, `romanian-deadlift`), and `adductors` resolves from one dedicated exercise (`hip-adduction`) — narrower than most targets, but genuine, not fabricated.
- **`data/programming/aesthetic-outcomes.yaml`** — 23 new outcomes (3 → 26 total), covering every region in the architect-approved list: chest (3 more), shoulders (2), back (3), arms (1 more), core (2), glutes (3, a new region — `region: glutes` is a presentation label; the underlying exercises are `hips`, so each glute outcome's `primary_targets` resolves through `gluteus-maximus`/`gluteus-medius-minimus`'s own `parent_region: hips`, keeping the engine's actual `bodyRegion` correct), quads (3, including the second 4A-flagged outcome, `quad-sweep-separation`), hamstrings (1), calves (2), forearms (2), neck (1, `neck-size` — named distinctly from the `neck-thickness` *target* it resolves to, to avoid an id collision between the two files). Only `chest-front-width` (primary `mid-pec`, supporting `upper-pec`) has a real primary/supporting split — every other new outcome has exactly one primary target and no supporting targets, which the file's own updated header now states explicitly: that's what the 4A audit actually found, not an oversight.
- **`docs/knowledge-manual/programming/README.md`** — added the previously-missing `aesthetic-outcomes.yaml` entry (an omission from 4C — the file existed and was validated/tested since then, just never documented in this human-readable index).
- **New tests**: a `decisionEngine.test.ts` "4I full-body taxonomy expansion" block spot-checking one target per newly-reachable region (gluteus-maximus/hips, quads, hamstrings, gastrocnemius vs. soleus distinctness, forearm-flexors vs. forearm-extensors distinctness, neck-thickness, and the two single-exercise-supported targets adductors/gluteus-medius-minimus resolving to their real exercises) plus a `chest-front-width`-style primary+supporting case; a `DecisionMakerPage.test.tsx` case proving a genuinely new Appearance region ("Glutes") resolves through the real UI to the correct underlying `hips` body region and offers `hip-thrust` as a current-exercise option, not a nonexistent "glutes" region.

### Decisions made

- **No new physique targets or outcomes beyond the architect-approved list.** Same discipline as the first taxonomy expansion — the temptation to add, e.g., a separate hip-flexor aesthetic outcome or an inner/outer-quad split was present in the data (secondary_targets mention plenty of muscles) but excluded, per the taxonomy's own no-fake-precision guardrail and the corrections doc's explicit "do not add aesthetic outcomes simply to increase the number of options" (§14).
- **`quad-sweep-separation` and `neck-size` kept their 4A-documented lower-confidence framing in their `technical_explanation` fields**, rather than being upgraded to read the same as every other outcome now that they're "in." The architect approved keeping them, not upgrading their evidence tier — the taxonomy stays honest about which outcomes have broad multi-exercise support versus narrower support.
- **`region: glutes` was kept as a presentation label distinct from the underlying `hips` body region**, rather than renaming the physique targets' `parent_region` to `glutes` to match. The architect's own spec and corrections doc both explicitly list "Glutes" in the user-facing region list (§9 of the revised spec, §13 of the corrections doc), while the exercise data has always used `hips` — this is exactly the separation the engine already supports (outcome region for UI grouping vs. target `parent_region` for actual candidate-pool filtering), not a new mechanism.

### Verified

- Deliberately re-ran the full `npm run validate-data` after each of the three edits (targets, exercise tagging, outcomes) rather than only at the end, catching the region-alignment issue immediately after the first tagging attempt rather than after all three files were already written.
- `npm run validate-data`: PASS, 123/123 records, 0 issues.
- `npm run test`: **101 tests across 13 files**, all passing (up from 92) — the existing generic taxonomy-integrity tests (`physique-targets.test.ts`, `aesthetic-outcomes.test.ts`) extended automatically to cover all 25 targets and 26 outcomes with zero changes needed, by design.
- `npx tsc -b --force`, `npm run lint` (oxlint), and `npm run build`: all clean.

### Pending

4J (functional entry-point preservation/integration), 4K (mobile/usability pass), 4L (full Definition-of-Done validation) remain, per the corrections doc's implementation order (§21).

---

# 4J — Functional entry-point integration

**Date:** 2026-08-17

Replaces the Function mode's placeholder stub with a real, working functional-goals taxonomy, reusing the existing engine exactly the way physique targets do — a fully parallel resolution path, not a new engine, and never mixed into the aesthetic outcome selector (revised spec §12).

### What changed

- **`data/programming/functional-goals.yaml`** (new) — 7 functional goals, structurally mirroring `physique-targets.yaml` (id, name, `parent_region`, `definition`, plus `why_it_matters` in place of `physique_outcome`, since the payoff is durability/movement-quality rather than a visual outcome): `rotator-cuff`, `scapular-stability` (shoulders); `hip-flexors`, `hip-stability` (hips); `core-anti-extension`, `core-anti-rotation`, `core-anti-lateral-flexion` (core). Only 7 of the spec's 8 example goals — "hip mobility" is deliberately not represented, since the dataset has no dedicated mobility-drill exercise distinct from hip-flexor strength work or the hip-stability exercises, and inventing a mapping would be the same fake-precision problem the aesthetic taxonomy's own guardrail warns against.
- **8 exercise records tagged** with a new `functional_goals` field across `shoulders.yaml` (`cable-band-external-rotation` → rotator-cuff, `push-up-plus` → scapular-stability), `hips.yaml` (`standing-cable-hip-flexion` → hip-flexors, `hip-abduction`/`hip-adduction` → hip-stability — both **dual-purpose**, already carrying `physique_targets` from 4I, now also `functional_goals`, since the two fields are independent, not mutually exclusive), and `core.yaml` (`plank` → core-anti-extension, `pallof-press` → core-anti-rotation, `suitcase-carry` → core-anti-lateral-flexion) — the exact set the 4A audit had already identified as functional-only (or dual-purpose) and excluded from aesthetic tagging.
- **`scripts/lib/taxonomy.js`** — `functional_goals` added to `OPTIONAL_LIST_FIELDS` and `ALL_FIELDS`.
- **`scripts/lib/load-programming.js`** — `loadFunctionalGoals()`, same pattern as `loadPhysiqueTargets()`/`loadAestheticOutcomes()`.
- **`scripts/lib/validate.js`** — loads functional goals once at module scope; validates every exercise's `functional_goals` entries resolve to a real id, same referential-integrity treatment as `physique_targets`. Verified by injecting a bad reference (`not-a-real-goal` on a temporary throwaway record), confirming `npm run validate-data` caught it, then removing the test record entirely (`git checkout --`) and re-confirming a clean pass.
- **`app/src/types/exercise.ts`** — `Exercise.functional_goals: string[] | null`.
- **`app/src/types/programming.ts`** — new `FunctionalGoal` interface; `ProgrammingData.functionalGoals`.
- **`app/src/data/index.ts`** — `functionalGoals` export, `getFunctionalGoalById()`, `getFunctionalGoalsByRegion()`.
- **`app/src/engine/types.ts`** — `DecisionInput.functionalGoal: string | null`, kept fully separate from `physiqueTarget` (its own field, not a reused id-space) so a functional recommendation is never displayed as an aesthetic one. `DecisionResult`'s `'ok'` variant gains `functionalGoal: FunctionalGoal | null`.
- **`app/src/engine/decisionEngine.ts`** — Step 1 gains a functional-goal resolution mirroring the physique-target one exactly (resolve id → filter exercises by `functional_goals` inclusion → only "genuinely used" when it has real matches), consulted **only when no physique target resolved** (the UI never sets both — Appearance/Advanced and Function are mutually exclusive entry modes). Candidate-pool fallback chain extended: target matches → functional matches → plain body region. `buildResultFromRanked` threads `functionalGoal` through the same three call sites `target`/`supportingTargets` already go through.
- **`app/src/pages/DecisionMakerPage.tsx`** — Function mode's stub replaced with a real two-select "region → functional goal" picker, mirroring Appearance's structure exactly (`getFunctionalGoalsByRegion`, `handleFunctionalRegionChange`, `handleFunctionalGoalChange`). Steps 2-4 and the submit button, previously hidden entirely in Function mode, are now always shown — Function submits through the exact same form. Result view gains a "🦴 Functional goal" block (name/definition/why-it-matters), populated from `result.functionalGoal` directly rather than a separately-captured UI selection (unlike the aesthetic-outcome block, which needs presentation-only fields — `display_name`/`visual_description` — not present on the engine's resolved object; `FunctionalGoal`'s fields are already exactly what the block needs, so no parallel `resultFunctionalGoal` state was necessary).
- **New `handleEntryModeChange()`** — a real bug caught before it shipped: the existing per-select staleness-clearing (each handler clearing the *other* modes' outcome/goal id) had a gap — switching entry modes and then changing only the *new* mode's region select (without yet picking a specific outcome/goal there) left the *previous* mode's `bodyRegion`/`physiqueTarget`/`functionalGoal` state stale but still submittable. Fixed by resetting all mode-specific state (`bodyRegion`, `physiqueTarget`, `supportingPhysiqueTargets`, `aestheticOutcomeId`, `functionalGoalId`) on every mode switch itself, not just on each select's own change handler.
- **`docs/knowledge-manual/SCHEMA.md`** — `functional_goals` field entry (mirroring `physique_targets`'s, noting the dual-purpose case) and summary-table row.
- **`docs/knowledge-manual/programming/README.md`** — added the `functional-goals.yaml` entry to the file index.
- **New tests**: `app/src/data/functional-goals.test.ts` (generic taxonomy-integrity checks, same pattern as the physique/aesthetic ones, plus a specific check that `hip-abduction`/`hip-adduction` are genuinely dual-tagged); a `decisionEngine.test.ts` "functional goals (4J)" block (resolved goal narrows candidates and leaves `target`/`visualObjective` null; unknown goal id falls back to body region; two goals resolve to their real single dedicated exercises; a functional goal never combines with a physique target when both are somehow set — physique target still wins, matching the "only consulted when no physique target resolved" rule); `DecisionMakerPage.test.tsx` cases for the real Function golden path (Core Anti-Extension → Plank, through the actual UI, confirming aesthetic-only blocks stay absent) and for the entry-mode-switch staleness fix.

### Decisions made

- **"Hip mobility" excluded from the 7 implemented goals.** The spec's own example list names 8 functional goals; the dataset only genuinely supports 7. Extending to include a "hip mobility" mapping without a real dedicated exercise would repeat the exact fake-precision mistake the aesthetic taxonomy's guardrail exists to prevent — same standard applied to both branches, not just the aesthetic one.
- **A functional goal never combines with a physique target in the engine, by construction, not just by UI convention.** `resolvedFunctionalGoal` is only computed `targetMatches.length === 0 && input.functionalGoal` — even if some future caller passed both, the physique target wins deterministically and the functional path is never consulted, rather than requiring the UI to be the only thing enforcing mutual exclusivity.
- **No separate `resultFunctionalGoal` UI state**, unlike the aesthetic outcome's `resultAestheticOutcome`. The asymmetry is deliberate: aesthetic outcomes carry presentation-only fields (`display_name`, `visual_description`, `technical_explanation`) that don't exist anywhere on the engine's `PhysiqueTarget` result, so the UI selection has to be captured separately to display them. `FunctionalGoal`'s fields (`name`, `definition`, `why_it_matters`) are exactly what the result block needs and are already returned on `result.functionalGoal` — adding a parallel capture would have been redundant state serving no purpose.

### Verified

- `npm run validate-data`: PASS, 123/123 records, 0 issues.
- Functional-goals validator check confirmed to actually catch a violation (deliberately injected on a throwaway test record, caught, the record removed entirely via `git checkout --`, re-confirmed clean).
- `npm run test`: **112 tests across 14 files**, all passing (up from 102) — including the Function branch's own golden-path test through the real UI and the entry-mode-switch staleness regression test.
- `npx tsc -b --force`, `npm run lint` (oxlint), and `npm run build`: all clean.

### Pending

4K (mobile/usability pass) and 4L (full Definition-of-Done validation) remain, per the corrections doc's implementation order (§21).

---

# 4K — Mobile/usability pass

**Date:** 2026-08-17

Actually launched the app (Vite dev server) behind headless Chromium at phone viewports (375×667 and 414×896 — iPhone SE and a larger Android size), rather than reasoning about the CSS alone. Walked all three entry modes, all three golden slices, a newly-expanded region (Glutes), and the Knowledge Explorer/Exercise Detail pages, checking for horizontal overflow (`scrollWidth > clientWidth`) and reviewing full-page screenshots.

### What was found

- **No horizontal overflow anywhere** — every page checked (`home`, Decision Maker in all three modes and filled states, the result view, exercise list, exercise detail) came back `scrollWidth === clientWidth` at both widths.
- **A visual false alarm, investigated and ruled out**: full-page screenshots showed the sticky app header appearing to duplicate mid-page. Confirmed via `page.locator('.app-header').count()` (returned 1) and a scrolled, non-full-page screenshot (showed a single, correctly-positioned sticky header) that this is a known Playwright/Chromium full-page-screenshot stitching artifact with `position: sticky` elements, not a real rendering bug in the app.
- **A real bug**: switching entry modes (Appearance/Function/Advanced) via `handleEntryModeChange` cleared `bodyRegion`/`physiqueTarget`/`supportingPhysiqueTargets`/`aestheticOutcomeId`/`functionalGoalId` (added in 4J) but not `currentExerciseId`. Reproduced live: pick Appearance → chest-side-projection → complement-current → Incline Dumbbell Press, then switch to Function mode and pick Core Anti-Extension. The "Current exercise" dropdown visibly showed "— none —" (its old value, Incline Dumbbell Press, isn't in the now-core-filtered option list), but the underlying React state still held `'incline-dumbbell-press'`. Submitting in this state would have run `complement-current` against the stale chest exercise — `resolveComplements(inclineDumbbellPress, ...)` filtered against `regionCandidates` for `core` — producing either a confusing wrong recommendation or (as traced through the code) a "No exercise complementing Incline Dumbbell Press meets your constraints in this region" error that references an exercise the visible UI never showed as selected.

### What changed

- **`app/src/pages/DecisionMakerPage.tsx`** — `handleEntryModeChange` now also resets `currentExerciseId`, since its valid options (`currentExerciseOptions`) are filtered by `bodyRegion`, which the same function already resets.
- **`app/src/pages/DecisionMakerPage.test.tsx`** — regression test: pick an aesthetic outcome with a current exercise set, switch to Function mode, confirm the dropdown reads empty, complete a Function-mode `complement-current` submission without picking a new current exercise, and confirm the engine's own `missing-current-exercise` message appears — proving the stale value can no longer reach the engine.

### Decisions made

- **Investigate before reporting.** The sticky-header "duplication" looked like a real bug in the first full-page screenshot. Rather than noting it as a finding, checked the actual DOM element count and a scrolled non-full-page render first — both confirmed it was a screenshot-tool artifact. Reporting it as a bug would have been a false finding; the discipline here (verify before concluding) is the same one this project has applied to every validator check added this session (inject a violation, confirm detection, then trust the "PASS" result).
- **Fixed the real bug immediately rather than just noting it**, since it was small, contained to a function already being touched this phase, and directly affects correctness (a wrong recommendation silently returned, or an error message naming an exercise the user never selected).

### Verified

- `npm run test`: **113 tests across 14 files**, all passing (up from 112) — including the new stale-`currentExerciseId` regression test.
- Re-ran the full mobile-viewport check after the fix: overflow-free at both widths, and the "Current exercise" dropdown now correctly resets to empty on every mode switch, confirmed via screenshot.
- `npx tsc -b --force`, `npm run lint` (oxlint), `npm run build`, and `npm run validate-data`: all clean.

### Pending

4L (full Definition-of-Done validation) remains, per the corrections doc's implementation order (§21) — the final step.

---

# Phase 4B — Recommendation & Programming Refinement

Phase 4 (original → revised Aesthetic Outcome layer → Corrections → full taxonomy expansion → 4J/4K/4L) reached Definition of Done and was marked Complete. Real-world testing against the finished product then surfaced three problems the Definition of Done didn't catch, because they're about ranking/programming *behavior*, not taxonomy completeness: (1) the recommendation engine doesn't preserve primary/supporting target reasoning through ranking, (2) programming guidance is too generic across exercises, (3) intensity-technique selection effectively always defaults to Drop Set. Architect spec saved verbatim at `docs/architecture/PHASE-4B-RECOMMENDATION-PROGRAMMING-REFINEMENT.md`, with an explicit 11-step implementation order (4B-1 through 4B-11) and an explicit gate: "Do not move to later steps if the earlier semantic ranking is still incorrect."

## 4B-1/4B-2/4B-3 — Target-aware ranking, provenance, regression test

**Date:** 2026-08-17

### The bug

`rankByGoal`'s ranking (used by `build-base`/`visual-area`/`low-fatigue`/`limited-equipment`) only considered generic exercise stimulus tags (`heavy-compound`, `stable-compound`, `lengthened-position-emphasis`, fatigue cost, equipment count) — zero awareness of primary-vs-supporting physique-target membership. Since Step 1 already flattens primary and supporting target matches into one deduplicated candidate pool, a supporting-target exercise with a favorable stimulus tag could outrank a primary-target exercise with a less flashy one. Concretely: for the `arm-side-thickness` outcome (primary: brachialis-arm-thickness, supporting: triceps), all three brachialis-tagged exercises are isolation-only, while Close-Grip Bench Press (triceps, supporting) is heavy-compound — so it won `build-base`, meaning "arms look thin from the side" recommended a triceps exercise as the top pick instead of a direct brachialis one. This is the architect spec's own worked example (§2/§25 Test A: "a triceps-only result fails").

Notably, this exact outcome had previously been treated as a *feature* — the `arm-side-thickness` golden-slice test added during the Corrections-phase work (#63) asserted Close-Grip Bench Press as the correct winner, reasoning that this proved the supporting target "wasn't decorative." That was a design misunderstanding on my part, not something the user flagged — the real architect spec (this document) makes clear the opposite is required: a reachable primary-target exercise must win regardless of a supporting-target exercise's generic stimulus tags. The supporting target still has to matter (Test B), just not by outranking a reachable primary-target pick.

### What changed

- **`app/src/engine/types.ts`** — new `TargetMatch = 'primary' | 'supporting' | 'general'` type; `DecisionResult`'s `'ok'` variant gains `bestFitTargetMatch: TargetMatch`, so the UI/tests can assert *why* the winning exercise was recommended, not just what it is.
- **`app/src/engine/decisionEngine.ts`**:
  - New `targetMatchTier(exercise, primaryTargetId, supportingTargetIds)`: 0 for a direct primary-target match, 1 for a direct supporting-target match, 2 for everything else.
  - New `sortByTargetTier`, a stable pre-sort applied in front of each goal branch's existing ranking (`rankStructuralAlternatives` for `replace-exercise`; `resolveComplements`'s filtered result for `different-stimulus`/`complement-current`; `rankByGoal` for the default branch). A no-op when no physique target is in play, so plain body-region/functional-goal browsing is unaffected; within a tier, the established stimulus/structural tiebreak rules are unchanged.
  - `buildResultFromRanked` now takes `primaryTargetId`/`supportingTargetIds`, computes `bestFitTargetMatch` from the same tier function, and returns it on the result.
- **`app/src/engine/decisionEngine.test.ts`** — the old (now-understood-to-be-wrong) `arm-side-thickness` "supporting target broadens the pool" test rewritten into two tests: (1) a reachable primary-target exercise (Cable Hammer Curl (Rope)) wins over the supporting-target Close-Grip Bench Press despite its heavy-compound tag, with `bestFitTargetMatch === 'primary'` and `supportingTargets` still populated; (2) Test B — when an equipment constraint (`['dip bars', 'bodyweight']`) eliminates every brachialis-tagged (primary) exercise, the supporting-target Dip (Triceps-Biased) becomes `bestFit` with `bestFitTargetMatch === 'supporting'`, proving the supporting target remains genuinely reachable, not just resolved-but-decorative.
- **`app/src/pages/DecisionMakerPage.test.tsx`** — the `arm-side-thickness` golden-slice UI test updated to assert the corrected winner (Cable Hammer Curl (Rope)) through the real "Arms → Appearance → Arms look thin from the side → Build the main training base" path, while still confirming the supporting target (triceps) is surfaced in the "also contributes" block. This test is Test A from the spec (§25), run end-to-end through the actual UI, not just the engine.

### Decisions made

- **No separate literal "Test A"/"Test B" test files.** The rewritten `DecisionMakerPage.test.tsx` case *is* Test A (exact input, exact UI path, asserts a direct primary-target top pick); the two `decisionEngine.test.ts` cases are Test A and Test B at the engine level. Adding word-for-word duplicates would be redundant coverage of the same behavior, not a stronger regression guard.
- **Tier sort applied as a wrapping layer, not threaded into `rankByGoal`/`rankStructuralAlternatives`/`resolveComplements` internals.** Those functions' own tests (already validated, still passing untouched) cover their existing tiebreak logic; the target-tier requirement is orthogonal (it's about *which* candidates are considered first, not how ties within a tier are broken), so keeping it as a pre-sort in `decisionEngine.ts` avoids touching three already-correct, already-tested modules.

### Verified

- `npm run test`: **114 tests across 14 files**, all passing (up from 113).
- `npx tsc -b --force` (the real type-check — bare `tsc --noEmit` silently checks zero files against this repo's root `tsconfig.json`) and `npm run lint` (oxlint): both clean.
- Confirmed via a throwaway probe test (deleted after use) that the fix produces the intended values before writing final assertions: `bestFit.id === 'cable-hammer-curl-rope'`, `bestFitTargetMatch === 'primary'` for the plain case; `bestFit.id === 'dip-triceps-biased'`, `bestFitTargetMatch === 'supporting'` for the equipment-constrained case.

### Pending

4B-4/4B-5/4B-6 (reusable Programming Profile model), 4B-7/4B-8/4B-9 (intensity-technique eligibility model), 4B-10/4B-11 (UI refinement + full regression pass) remain, per the spec's implementation order (§21-ish numbering in the spec itself).

---

## 4B-4/4B-5/4B-6 — Programming Profile model

**Date:** 2026-08-17

Addresses Phase 4B Issue #2 (§8-14): programming guidance was driven only by `exercise_type` + `coverage_categories` → rep range, with everything else (RIR, volume, frequency, progression) generic and identical across every exercise. The spec explicitly forbids solving this with 123 hand-written prescriptions (§9) and instead calls for a reusable **Programming Profile** concept (§10-11), derived from existing exercise metadata, not invented scores.

### What changed

- **`data/programming/programming-profiles.yaml`** (new) — the Programming Profile catalog: 8 profiles (`heavy-free-weight-compound`, `stable-compound`, `compound-general`, `lengthened-position-isolation`, `shortened-position-isolation`, `constant-tension-isolation`, `elevated-stability-isolation`, `moderate-hypertrophy-isolation`), each carrying a rep range (same shape the old `rep-ranges.yaml` defaults used) plus a `guidance_note` — a short, profile-specific piece of programming advice distinct from the generic global principles (e.g. lengthened-position isolation: "resist the urge to shorten the range of motion just to move more weight"; heavy free-weight compound: "technical breakdown risk rises as fatigue accumulates — prioritize crisp reps... over grinding"). A `classification.defaults` list (first-match-wins, same discipline as every other rule-based lookup in this dataset) maps `exercise_type` + `coverage_categories_any` + a new `stability_demand_at_least` match field to a profile id. Simulated against all 123 exercises before writing any code (a throwaway Python script, not committed) to confirm every record classifies to a real profile with no gaps — 8 profiles, no exercise falls through.
- **`data/programming/rep-ranges.yaml`** — trimmed to exercise-specific `overrides:` only (still empty). Its old `defaults:` classification logic moved into `programming-profiles.yaml` so rep range and programming framing come from one shared lookup instead of two separately maintained classifiers doing the same job.
- **`app/src/types/programming.ts`** — removed `RepRangeRule`/`RepRangeMatch` (superseded); added `ProgrammingProfile`, `ProgrammingProfileMatch` (`exercise_type`, `coverage_categories_any`, `stability_demand_at_least`), `ProgrammingProfileClassificationRule`, `ProgrammingProfileCatalog`; `ProgrammingData.programmingProfiles: ProgrammingProfileCatalog`.
- **`app/scripts/generate-data.mjs`** — loads `programming-profiles.yaml` into the generated JSON bundle.
- **`app/src/engine/programmingEngine.ts`** — new `resolveProgrammingProfile(exercise): ProgrammingProfile`, classifying via the same first-match-wins logic `resolveRepRange` used to run inline (`matchesProfileRule`, now also checking `stability_demand_at_least` via `DEMAND_LEVELS` ordinal comparison). `resolveRepRange` now takes the resolved profile as a parameter instead of re-deriving its own default; `Programming` gains a `profile: ProgrammingProfile` field so the guidance note and full profile context are available on every result, not just the numbers. A `FALLBACK_PROFILE` constant covers the (currently unreachable, given the ruleset's compound/isolation fallback rules) case of an exercise matching nothing.
- **`app/src/engine/decisionEngine.ts`** — new `buildTargetProgrammingContext()` (4B-6, spec §12): a short, deterministic note on how `bestFit`'s role relative to the resolved physique target should shape its programming — "primary target, prioritize its direct volume," "supporting target, treat as secondary volume alongside direct primary-target work, not a replacement for it," or a neutral note when the target is in play but `bestFit` isn't tagged to it yet. Reuses `bestFitTargetMatch` (already computed in 4B-1) rather than adding a second classification. Deliberately does **not** implement volume/overlap/frequency accounting across a routine (§13's "current direct/indirect volume, weekly frequency, exercise overlap") — the spec frames that as a later, deterministic-accounting step ("This does NOT require advanced recovery prediction... It requires deterministic accounting of known training volume and overlap"), and the app has no routine-tracking state to account against yet; §27's non-goals also explicitly exclude "advanced recovery prediction."
- **`app/src/engine/types.ts`** — `DecisionResult`'s `'ok'` variant gains `targetProgrammingContext: string | null` (null when no physique target resolved).
- **`docs/knowledge-manual/programming/README.md`** — updated from "six files" to "seven," added the `programming-profiles.yaml` entry, rewrote `rep-ranges.yaml`'s entry to describe it as overrides-only.
- **New/updated tests**: `programmingEngine.test.ts` gains a `resolveProgrammingProfile` describe block (heavy-compound → `heavy-free-weight-compound` regardless of exercise_type, stable-compound → `stable-compound`, an elevated-stability isolation exercise classifies distinctly from a plain one, a lengthened-position isolation exercise classifies distinctly from a plain one) and a "Programming Profile differentiation (Phase 4B §25 Test C)" block (a compound and an isolation exercise get different rep ranges *and* different `guidance_note`s; two isolation exercises differing only in `stability_demand` get different profiles; every exercise in the dataset resolves to a real, non-fallback profile). `decisionEngine.test.ts`'s existing Cable Fly golden-test assertion updated (`[10, 20]` → `[8, 15]`) to reflect Cable Fly's more accurate `elevated-stability-isolation` classification (its `stability_demand` is `medium`, not the generic isolation default) — a deliberate, more accurate outcome of the new profile system, not a regression.

### Decisions made

- **`stability_demand_at_least` matched purely on the existing `stability_demand` field, never on `equipment`.** An early draft used equipment (free-weight vs. machine/cable) to justify a "heavy mechanical-tension isolation" profile, but Cable Fly (cable equipment, `stability_demand: medium`) exposed the mismatch — a profile literally named "free-weight" that a cable exercise matched. Renamed to `elevated-stability-isolation` and reworded its `summary`/`guidance_note` to describe what `stability_demand` actually measures (balance/control demand) rather than assuming a specific equipment category the field doesn't encode. Keeps classification strictly to the fields the spec names in §11 (`exercise_type`, `coverage_categories`, `stability_demand`, `fatigue_cost`, `skill`, lengthened/shortened-position emphasis) rather than reaching for `equipment`, which isn't on that list.
- **8 profiles, not the spec's example list of 8 verbatim.** §10 explicitly frames its list ("Heavy mechanical-tension isolation," "Stable machine isolation," etc.) as "candidate profile categories, not final prescriptions," with the actual derivation left to engineering. The shipped set covers every real combination present in the 123-exercise dataset (verified by simulation) rather than including profiles the data doesn't actually need (e.g. no separate "stable machine isolation" bucket, since "moderate hypertrophy isolation" already covers the stable/plain-isolation case without a second near-duplicate).
- **4B-6 scoped to a priority-relationship note, not volume/overlap accounting.** §13 itself frames target-level volume/overlap accounting as something the system "should eventually be able to" do, and explicitly says it "does NOT require advanced recovery prediction" — but implementing even the deterministic version would require tracking a user's current routine across multiple exercises over a week, which no part of this application's state model does yet (the Decision Maker is single-recommendation, not routine-level). Building that tracking layer as a side effect of the target-programming-context step would be exactly the kind of scope growth §27's non-goals ("advanced recovery prediction," "complex periodization") and the spec's own closing principle ("a better deterministic knowledge-driven engine, not a larger or more complicated system") warn against. The priority-relationship note (primary vs. supporting) is the part of §12's example ("Programming context: High-priority direct target") that's answerable from data already in hand.
- **No UI wiring yet for `profile`/`guidance_note`/`targetProgrammingContext`.** The spec's own implementation order (§28) places "Programming UI refinement" at 4B-10, after both the Programming Profile model (4B-4/5/6, this step) and the intensity-technique eligibility model (4B-7/8/9, not yet started) — surfacing both sets of new engine output in one UI pass avoids doing the result-view layout twice.

### Verified

- `npm run test`: **121 tests across 14 files**, all passing (up from 114).
- `npx tsc -b --force`, `npm run lint` (oxlint), `npm run build`, and `npm run validate-data`: all clean.
- Confirmed via a throwaway Python simulation (not committed) that all 123 current exercise records classify to one of the 8 real profiles with zero gaps, before writing any TypeScript.

### Pending

4B-7/4B-8/4B-9 (intensity-technique eligibility model) and 4B-10/4B-11 (UI refinement + full regression pass) remain.

---

## 4B-7/4B-8/4B-9 — Intensity-technique eligibility model

**Date:** 2026-08-17

Addresses Phase 4B Issue #3 (§15-22): the engine had three techniques in its catalog (drop-set, rest-pause, myo-reps) but the selection logic only ever checked drop-set's own criteria — rest-pause and myo-reps were unreachable dead data, and the result was, in the architect's words, "effectively defaults to Drop Set."

### What changed

- **`data/programming/intensity-techniques.yaml`** — each of the 3 techniques gains two new eligibility fields, `suitable_when_skill_demand_at_most` and `suitable_when_stability_demand_at_most` (drop-set: medium/medium; rest-pause: medium/medium; myo-reps: low/low — the strictest, matching its `when_not_to_use` text's emphasis on the trainee's own failure-proximity judgment). Rewrote the trailing comment from the old "v1 suggestion rule: always drop-set" description to the real eligibility → ranking → recommendation pipeline.
- **`app/src/types/programming.ts`** — `IntensityTechnique` gains the two new fields.
- **`app/src/engine/programmingEngine.ts`**:
  - `isTechniqueEligible(technique, exercise)`: a technique is eligible only when the exercise's `exercise_type` is in the technique's `suitable_exercise_types` *and* its `fatigue_cost`/`skill_demand`/`stability_demand` are all at or below that technique's own thresholds — checked against all three technique's full criteria, not just fatigue and not just drop-set's. This alone makes a heavy, high-skill, high-stability compound movement (e.g. Conventional Deadlift) correctly ineligible for every technique, matching the spec's own §18 "Heavy Deadlift: not appropriate" worked example.
  - `eligibilitySlack(technique, exercise)`: sums how much headroom the exercise has below each of a technique's three thresholds. 0 means the exercise sits exactly at every limit (the tightest, most specifically-suited fit).
  - `eligibleTechniquesRanked(exercise)`: filters to eligible techniques, ranks by ascending slack (tightest fit first), ties broken by catalog order (drop-set, rest-pause, myo-reps) — a fixed, explainable priority per §7's "Do Not Overengineer Ranking" guardrail, never a blended score. The tightest-fit rule is what lets myo-reps actually win for the exercises it's most suited to (very low fatigue/skill/stability) instead of always being shadowed by drop-set's looser (but also technically eligible) thresholds.
  - `explainIntensityTechnique()`/`explainNoIntensityTechnique()`: build a contextual explanation from the exercise's own resolved Programming Profile name and its actual fatigue/skill/stability levels — e.g. "Myo-Reps fits this exercise: it's a moderate hypertrophy isolation movement with low fatigue cost, low skill demand, and low stability demand — all within what Myo-Reps tolerates. [technique's own when_it_may_help text]" — rather than the same generic copy regardless of which exercise was recommended (§19's explicit instruction: avoid "Drop sets add more work in less time," explain the context instead). The "no technique" case is explained too, never silently empty (§20's "This is important" — no technique is a legitimate, explained outcome, not an absence of output).
  - `Programming` gains `intensityTechniqueContext: string` (always non-empty, whether or not a technique was recommended).
  - `buildProgramming()` rewired to compute the full eligible/ranked list and take the top entry (or null), instead of a drop-set-only predicate.
- **`app/src/engine/programmingEngine.test.ts`** — new "intensity-technique eligibility and ranking (Phase 4B §25 Test D)" block: different exercises receive different technique recommendations (Cable Hammer Curl Rope → myo-reps; Drag Curl, whose medium skill demand rules out myo-reps → drop-set); a heavy/high-skill/high-stability compound (Conventional Deadlift) gets no technique, with a real, non-boilerplate explanation; a moderate compound (Smith Machine Romanian Deadlift) is eligible for rest-pause specifically, even though drop-set/myo-reps are isolation-only; a three-exercise check that myo-reps, rest-pause, and "none" are all reachable outcomes (Drop Set is not universal); technique explanations differ by exercise rather than repeating the same string.

### Decisions made

- **Ranked by tightest-fit slack, not a fixed technique-priority order.** An earlier draft simply picked the first eligible technique in catalog order (drop-set, rest-pause, myo-reps). Simulating it against the dataset showed myo-reps would never actually win: every exercise meeting myo-reps' stricter low/low/low thresholds also automatically meets drop-set's looser medium/medium/medium thresholds, so drop-set (checked first) would always shadow it — recreating a milder version of the exact "effectively defaults to one technique" bug this step exists to fix. The slack-based ranking (reward the technique whose thresholds the exercise fits most tightly) is still a fixed, deterministic, explainable rule — just one that accounts for how specifically an exercise matches a technique instead of only whether it qualifies at all.
- **Eligibility checked against all three demand dimensions (fatigue, skill, stability) per technique, not fatigue alone.** The old rule only ever compared `fatigue_cost`. Adding skill/stability thresholds is what makes the Heavy-Deadlift-style "none appropriate" case reachable through the general rule (rest-pause's `suitable_exercise_types` includes compound, so fatigue alone wouldn't exclude every heavy compound the way stability does) rather than needing a special-cased "no technique for heavy-compound" rule bolted on separately.
- **`maxFatigueCost === 'low'` still suppresses every technique as a blanket gate**, not folded into the per-technique slack/threshold system. Every technique's own fatigue/time-implications text says it adds real local fatigue on top of the exercise itself, regardless of how low that exercise's own baseline fatigue cost is — so a user who explicitly asked to keep fatigue low shouldn't get a technique recommendation just because the chosen exercise happens to have a very low fatigue_cost. This mirrors the pre-existing rule (kept, not changed) rather than introducing a new nuance the spec didn't ask for.

### Verified

- `npm run test`: **126 tests across 14 files**, all passing (up from 121).
- `npx tsc -b --force`, `npm run lint` (oxlint), `npm run build`, and `npm run validate-data`: all clean.
- Manually traced the eligibility/ranking arithmetic by hand against 5 real exercises (Cable Hammer Curl Rope, Drag Curl, Conventional Deadlift, Smith Machine Romanian Deadlift, Cable Fly) before writing the corresponding tests, confirming the slack-ranking behaves as designed rather than only trusting the test assertions after the fact.

### Pending

4B-10/4B-11 (UI refinement to surface `profile`/`guidance_note`/`targetProgrammingContext`/`intensityTechniqueContext`, plus a full regression pass across all 5 golden test categories A-E) remain — the final step.

---

## 4B-10/4B-11 — UI refinement + full regression pass

**Date:** 2026-08-17

Final step: surface everything the previous three steps added to the engine result (`bestFitTargetMatch`, `targetProgrammingContext`, `profile`/`guidance_note`, `intensityTechniqueContext`) in the actual Decision Maker UI, per §23-24's "make the reasoning visible," then validate the whole of Phase 4B against its own acceptance criteria (§26) and golden tests (§25 Tests A-E).

### What changed

- **`app/src/pages/DecisionMakerPage.tsx`**:
  - New **"Why this exercise?"** block (§23), shown whenever a physique target resolved: states the primary target with "✓ Direct match" when `bestFitTargetMatch === 'primary'`, or "not directly tagged to this pick yet" otherwise; when `bestFitTargetMatch === 'supporting'`, adds a second line naming the specific supporting target that matched with "✓ Secondary contribution" (found by checking which of `supportingTargets` the actual `bestFit.physique_targets` includes — not just showing the first supporting target in the list, so the line is never wrong when there's more than one).
  - **Programming block** restructured toward §24's Baseline → target-context shape: a "Baseline — {profile.name}" line above the existing reps/RIR/weekly-sets/frequency grid; `profile.guidance_note` rendered as its own paragraph; `targetProgrammingContext` rendered as a "For this target — ..." line when a target resolved. "Your current routine" (§24's third tier) is deliberately not implemented — see the 4B-6 entry above for why.
  - **Intensity technique block** now always renders (previously conditional on `intensityTechnique` being non-null) — when one was recommended, shows its name plus the new contextual `intensityTechniqueContext` explanation instead of the old generic `when_it_may_help` copy; when none applies, shows `intensityTechniqueContext`'s "no technique" explanation instead of the block disappearing. This is the UI-level fix for §20's "no technique is a legitimate, explained outcome," matching what `programmingEngine.ts` already computes.
- **`app/src/pages/DecisionMakerPage.test.tsx`** — new "4B-10: reasoning and programming-profile visibility" block: the primary-match checkmark renders (and no supporting-target line appears) for the arm-side-thickness golden slice; the supporting-target secondary-contribution line renders when an equipment constraint forces a supporting-target win (mirrors the engine-level Test B regression, driven through the real equipment-multiselect UI); the Programming block shows the resolved profile name and a target-aware note; the Intensity technique block always renders non-empty content.
- **`app/src/engine/decisionEngine.test.ts`** — added the missing named **Test E** (§25 — "explanation consistency... if the explanation identifies target A as primary but the recommendation only addresses target B, the test fails"): a structural-invariant check run across three already-covered scenarios (single target, multi-target primary win, multi-target supporting win) confirming `bestFitTargetMatch` always agrees with which of `bestFit`'s own `physique_targets` actually matches `target`/`supportingTargets` — not just spot-checked in the two scenarios that happened to already have assertions for it.
- Manually verified in a real browser (headless Chromium against the Vite dev server, both desktop and a 375px mobile viewport) rather than trusting the test suite alone: the arm-side-thickness golden slice (primary-match checkmark, Moderate Hypertrophy Isolation baseline, Myo-Reps recommended with a contextual explanation) and the equipment-constrained supporting-target case (secondary-contribution line, "no intensity technique" explanation naming the specific exceeded thresholds) both render correctly with no horizontal overflow at 375px.

### Phase 4B Acceptance Criteria (spec §26) — final walkthrough

- [x] Primary target relevance dominates generic stimulus ranking — `targetMatchTier`/`sortByTargetTier` (4B-1).
- [x] Candidate exercises retain primary/supporting target provenance — `bestFitTargetMatch` (4B-2), now also shown in the UI (4B-10).
- [x] Direct primary-target exercises are prioritized appropriately — Test A, engine + UI.
- [x] Supporting-target exercises remain available — Test B, engine + UI.
- [x] The engine no longer allows a generic stimulus tag to routinely override primary-target relevance — same tier sort; regression test asserts Close-Grip Bench Press's heavy-compound tag does not beat a reachable brachialis exercise.
- [x] The "arms look thin from the side" case recommends at least one direct brachialis exercise — golden UI test asserts Cable Hammer Curl (Rope), a brachialis-tagged exercise, wins.
- [x] Technical explanations and recommendations are consistent — Test E, engine-level structural invariant.
- [x] Programming is no longer solely based on broad exercise type — Programming Profile classification also uses `stability_demand` (`elevated-stability-isolation`) and lengthened/shortened-position tags, not just `exercise_type`/`coverage_categories` alone.
- [x] Reusable programming profiles exist — 8 profiles in `programming-profiles.yaml` (4B-4).
- [x] Existing exercise metadata contributes to programming-profile assignment — classification uses only pre-existing fields, no invented scores (4B-5).
- [x] Target priority can influence programming — `targetProgrammingContext` (4B-6), now shown in the UI.
- [ ] **Current training context can influence programming where already supported** — deliberately not implemented. The app has no routine/volume-tracking state at all (the Decision Maker produces one recommendation at a time, not a weekly plan), so there is no "current training context" for programming to read from yet — this isn't a case of the feature existing and Phase 4B failing to wire it in ("where already supported" not being met because nothing supports it yet). Documented as a real gap, not silently skipped; a future phase that adds routine tracking would be the natural place to close it.
- [x] Intensity techniques have explicit eligibility/suitability logic — `isTechniqueEligible` across all 3 techniques' fatigue/skill/stability thresholds (4B-7).
- [x] Drop Set is no longer the universal/default technique — regression test proves myo-reps, rest-pause, and "none" are all reachable outcomes (4B-8).
- [x] The system can legitimately recommend no intensity technique — Conventional Deadlift regression test + UI always renders the "no technique" explanation rather than hiding the block (4B-9/4B-10).
- [x] Intensity explanations are contextual — `explainIntensityTechnique`/`explainNoIntensityTechnique`, built from the exercise's own resolved profile and demand levels, verified to differ across exercises (not identical boilerplate).
- [x] Existing Phase 2/3 functionality remains intact — full suite green throughout (131/131 at the end of this step), no Phase 2/3 test touched except the one Cable Fly rep-range assertion updated to reflect its more accurate profile classification (documented in the 4B-4/5/6 entry as a deliberate improvement, not a regression).
- [x] Existing aesthetic taxonomy remains intact — no changes to `aesthetic-outcomes.yaml`, `physique-targets.yaml`, or any exercise's `physique_targets` field this phase.
- [x] Regression/golden tests pass — all 5 categories (A-E) now have dedicated tests; 131/131 total passing.

### Verified

- `npm run test`: **131 tests across 14 files**, all passing (up from 126).
- `npx tsc -b --force`, `npm run lint` (oxlint), `npm run build`, and `npm run validate-data`: all clean.
- Manual browser verification (headless Chromium, desktop + 375px mobile) of both the primary-target-wins and supporting-target-wins golden scenarios, confirming the new UI blocks render correctly and match what the engine actually computed — screenshots taken, not just DOM assertions trusted blind.

### Phase 4B status

All 11 implementation steps (4B-1 through 4B-11) complete. Phase 4B is done.
