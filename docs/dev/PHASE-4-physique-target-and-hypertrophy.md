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
