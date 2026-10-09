# Build-Base Tie Resolution — Implementation

_Implements Approach B from `BUILD-BASE-TIE-RESOLUTION-ASSESSMENT.md` (approved)._

- **Existing records:** all remain unmarked.
- **Unchanged:** no exercise added; no equipment vocabulary, target, goal or unrelated ranking changed.
- **Current recommendations:** unchanged, verified across all 39,456 scenarios (§4).

## 1. Schema and validation

| Item | Change |
|---|---|
| Field | `selection_role`, optional; absent / `null` = unclassified |
| Vocabulary | Closed: `secondary` (`SELECTION_ROLES` in `scripts/lib/taxonomy.js`) |
| Definition | "A stand-in or accessory variant that should not be the default pick when an equally ranked, non-secondary exercise is available." A programming-role classification. Not a quality score, a personal preference, or a way to choose a winner |
| Validator | Rejects any value other than `secondary`. Checked by temporarily setting `selection_role: primary`, which was rejected, then restored. Added to the canonical field set |
| App type | `Exercise.selection_role?: 'secondary' \| null` |
| Docs | `docs/knowledge-manual/SCHEMA.md` (`selection_role`); `DECISION-ENGINE-RULES.md` §1 |

## 2. Ranking placement

`rankByGoal` (`app/src/engine/decisionEngine.ts`) is the shared comparator for the four selection goals. Its order is now:

1. the goal key (Build-base: heavy compound, then stable compound, then other; visual-area: position emphasis; low-fatigue: fatigue; limited-equipment: items needed);
2. the cost tie-break (low-fatigue and limited-equipment): fatigue, setup, skill, stability;
3. **new:** unclassified before `selection_role: secondary`;
4. alphabetical `id`, the final deterministic fallback.

The target-tier, aesthetic-role and aesthetic-suitability sorts remain stable sorts layered **on top** of this comparator, so the new key can never cross them.

Replace, different-stimulus and complement answers use the structural rankers and are untouched.

## 3. Tests (`app/src/engine/selectionRole.test.ts`, 12 tests)

| Requirement | Test |
|---|---|
| Unmarked records keep existing behaviour | No production record is classified; identical unmarked fixtures keep the alphabetical winner in all four goals |
| Secondary loses only on a full tie | A secondary record that would win on ID yields to an unmarked one, in all four goals |
| Secondary still wins on a better goal key | Build-base (`heavy-compound`), visual-area (position emphasis), low-fatigue (lower fatigue), limited-equipment (fewer items) |
| Secondary still wins the cost tie-break | Lower setup, skill and stability, each in low-fatigue and limited-equipment |
| Target tiers stay higher | A secondary primary-target match beats an unmarked supporting-target match, in all four goals |
| Aesthetic roles stay higher | The shrug, marked secondary but named `direct` by `upper-back-fullness`, beats an unmarked unspecified record, in all four goals |
| Alphabetical fallback is deterministic | Two secondary records resolve by ID regardless of library order |
| Still recommended when it is the only fit | A secondary band-only exercise answers when only a band is available |

**Mutation checks** (temporary edits, reverted):
- With the comparison removed, exactly the "yields only on a full tie" test fails.
- With the comparison moved before the goal key, the five "still wins on merit / cost" tests fail.

## 4. Zero-change verification

- Every scenario's complete answer was SHA-1 hashed before and after the change: Best Fit, alternative, complements, explanation text, watch-out and empty-result explanation.
- Same 69-entry × 6-context × 4-tolerance × 7-goal space as the batch reports.

| | Before | After |
|---|---:|---:|
| Scenarios | 39,456 | 39,456 |
| Differing answers | — | **0** |

## 5. Candidate classifications (evaluated, not applied)

- Each candidate was measured with the real engine, added once unmarked and once marked `secondary`.
- Remaining Best Fit changes were split into **ID-decided** (they disappear when the candidate's ID sorts last) and **merit-based**.
- Run twice, byte-identical (SHA-256 `555c1fed…91d1ac09`).

| Candidate | Selection Best Fit changes, ID-decided: unmarked → secondary | Merit changes that remain | Cells opened | Replace / complement changes still decided by ID | Classification |
|---|---|---|---:|---|---|
| **Hamstring bridge** | 9 → **0** | 12: home low-fatigue / limited-equipment, single-leg RDL → bridge (lower fatigue, lower skill) | 18 | 42: complement / different stimulus for the lying leg curl and single-leg RDL → bridge | **`secondary` is accurate.** A bodyweight stand-in for loaded hamstring work (leg curls, RDLs). **Ready.** The remaining complement changes pair a leg curl with a hip-extension exercise, which is reasonable |
| **Band curl** | 108 → **0** | 0 | 8 | **251**, including 160 "replace my barbell / EZ / dumbbell curl" answers in a full gym → band curl | **`secondary` is accurate** (a stand-in for loaded curls), but **not ready.** Suggesting a band curl as the replacement for a barbell curl in a full gym is a regression the selection-role field cannot reach |
| **Dead bug** | 172 → **0** | 164: plank → dead bug in low-fatigue / limited-equipment (lower stability demand, the existing cost rule) | 0 | **528**: complement / different stimulus, plank → dead bug | **Uncertain.** `secondary` fits relative to crunches and the hanging knee raise. Relative to the plank both are low-load anti-extension drills, so ranking one below the other is a judgement call. Its only gain is "replace my plank". **Not ready** |
| **Cable pull-through + band** | 60 → **0** | 0 | 0 (the cable version already answers) | 140: complement / different stimulus for the glute bridge, single-leg RDL and Copenhagen plank → pull-through | **`secondary` is accurate.** The record itself calls it "a supporting stimulus rather than a main driver". **Ready**, with the band setup. Marking the existing cable record alone changes 0 Best Fits (56 alternatives only), but existing records stay unmarked in this change |

**Belt squat:** not classified, as instructed. Its tie with the hack squat is between two primary-role exercises; it remains blocked on equipment representation.

## 6. Findings to decide next

1. **Ready to add as `secondary`:**
   - the hamstring bridge: bodyweight hamstrings, 18 cells;
   - the cable pull-through band setup.
   - Each would ship as its own reviewed change with a focused coverage check.
2. **The structural rankers still fall back to the ID.** Replace, different-stimulus and complement answers have their own ID tie-break, which this field deliberately does not touch (approved scope: the four selection goals).
   - That is the remaining blocker for the **band curl**: "replace my barbell curl" in a gym would answer with a band curl.
   - It also limits the dead bug.
   - Extending `selection_role` to the structural rankers would need its own assessment: they rank substitutes by shared targets / coverage, and a secondary stand-in may be exactly the right replacement when equipment is limited.
3. **Dead bug vs plank** is a classification judgement, not a mechanism gap. Its remaining low-fatigue / limited-equipment wins come from the approved cost rule.

## 7. Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 139 records (unchanged) |
| Vitest | **310 / 310** (298 existing + 12 new) |
| oxlint | exit 0 |
| Production build (incl. `tsc -b`) | OK |
| Playwright | 3 / 3 |
| Zero-change check | 0 / 39,456 answers differ |
| Fresh clone of the commit (before pushing) | validate PASS; `npm test` 310/310; lint 0; build OK; Playwright 3/3 |
