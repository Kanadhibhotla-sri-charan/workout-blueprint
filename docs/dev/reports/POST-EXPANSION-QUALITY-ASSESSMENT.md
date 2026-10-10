# Post-Expansion Quality Assessment

_Analysis only. Base: `main` at `df836bc`, 140 exercises._

**Unchanged by this assessment:** no record, engine, target, goal, equipment-vocabulary or ranking change. The measurement used a temporary, reverted engine hook and temporary harness files that were never committed.

## 1. Summary

- **Content review.**
  - The expansion touched **38 records**, not 54: 9 added and 29 modified. 54 is the number of `reviewed` records.
  - No record has had human content review during the expansion. Every video check is title/channel metadata only.
  - 18 `reviewed` records carry expansion edits nobody has reviewed.
  - `needs-review` records already supply **42 %** of live Best Fits.
- **Ranking.**
  - In replace, complement and different-stimulus answers, **8,147 of 22,361 answered scenarios (36 %)** have a Best Fit chosen alphabetically.
  - **777** of those are materially worse by a strict definition (§3.2).
  - **Proposed fix:** one shared tie-break (secondary role → curated overlap → shared equipment → ID). It removes all 777 and changes nothing outside the alphabetical ties.
  - The cost is broad churn: 2,797 Best Fits change (§4–5).
- **Side finding.** "Different stimulus" and "complement" use the same ranker and return the same Best Fit and alternative in **all 8,709** answered scenarios. Only the explanation text differs.

## 2. Content-review plan

### 2.1 What has actually been checked

| Check | Coverage | Kind |
|---|---|---|
| Schema / taxonomy / relationship validator (`validate-data`) | 140 / 140 | Automated |
| Coaching gate (≥ 3 cues, ≥ 2 mistakes, filler checks) | Enforced for `reviewed`; 77 `needs-review` records have no coaching yet | Automated count, not accuracy |
| Video | 140 / 140 `verified` by **metadata** (title/channel via oEmbed); **0 by watching** | Metadata only |
| Video URL liveness | Weekly audit | Automated |
| `reviewed` status (54) | Phase 0 one-time self-audit of 123 records, plus the Phase 7 Stage 2 coaching pass on Build-package exercises (`REVIEW-PROMOTION-GATE.md`) | Earlier self-review; **18 of the 54 were edited since** |
| Evidence notes | 48 records (21 `reviewed`, 27 `needs-review`), all written before the expansion | Citations **not re-verified against sources** in this programme |
| Expansion content (9 new records, 29 edits) | Validator and coaching counts only | **No human review**. New records make no empirical claims, so they have no evidence notes (correct per SCHEMA) |

**Governance gap:**
- SCHEMA says only `reviewed` records should feed recommendations, but the engine excludes only `draft`.
- `needs-review` records produce **11,457 of 27,509** Best Fits.
- This is a known, documented choice (Phase 7), but it makes review the main quality lever.

### 2.2 Priorities

"Best Fits" is how often a record is the top answer across the measured 39,672-scenario space.

| Tier | Records | Best Fits | Review scope |
|---|---|---:|---|
| **P1: new in the expansion** | cable-pull-through (620), sissy-squat (476), hamstring-bridge (474), step-up (406), plank-shoulder-tap (340), seated-band-row (152), reverse-crunch (102), single-leg-hip-thrust (64), upright-row-wide-grip (24) | 2,658 | Full gate. **First, the ranking inputs:** demand ratings, `physique_targets`, `coverage_categories`, `selection_role` (pull-through, hamstring bridge). Then coaching accuracy and a visual video check |
| **P2: `reviewed` but edited during the expansion** | glute-bridge (1,144), single-leg RDL (562), shrug (497), cable-fly (450), straight-arm pulldown (366), reverse curl, chest-supported row, close-grip bench, both BSS variants, reverse wrist curl, hammer curl, RDL, seated calf raise, wrist curl, cable lateral raise, OTE, standing calf raise | 5,286 | **Changed fields only**: new band / bodyweight / bench setups, `resistance_profile`, notes. Highest exposure per review hour. These records still claim `reviewed`; demoting them is a data change and needs approval |
| **P3: `needs-review` and edited** | push-up (1,082), static lunge (320), cable curl (181, `secondary`), rear-delt fly, dumbbell curl, overhead press, hack squat, goblet squat, preacher curl, walking lunge, barbell row | 2,088 | Diff review plus coaching authoring. Do the push-up first |
| **P4: untouched `needs-review`** | 66 records; top: plank (752), chin-up (608), dumbbell pullover (449), dumbbell squat (437), cable / band external rotation (410), isometric neck hold (272), suitcase carry (252), push-up plus (240) | 6,711 | Coaching authoring and full gate, ordered by exposure. 2 records have zero exposure |

**Cross-cutting tracks** (run alongside the tiers):
1. **Visual video verification:** P1 first, then the highest-exposure records.
2. **Evidence re-check:** 48 records with citations. Confirm each source exists and says what the note claims. Downgrade or remove anything that can't be confirmed; never fill gaps.
3. **`overlaps_with` audit:** this field becomes a ranking input under the proposal in §4. Confirm that each listed overlap is a genuine near-substitute.

**Recording outcomes:**
- Every promotion should say how the record was checked: content checked against sources, video watched, or metadata only.
- Adding reviewer, date and method fields to the record would be a schema change; it is listed as a decision, not done.

## 3. Ranking assessment

### 3.1 How the three goals rank today

| Goal | Ranker | Keys, in order |
|---|---|---|
| Replace | `rankStructuralAlternatives` | Same first movement pattern and exercise type (filter) → more shared `primary_targets` → **more** shared coverage categories → **ID** |
| Different stimulus | `resolveComplements` → `rankStructuralComplements` | Different first pattern (filter) → more shared `primary_targets` → **fewer** shared coverage categories → **ID** |
| Complement | Same as different stimulus | Identical. 0 / 8,709 differences in Best Fit or alternative |

**Notes:**
- The target-tier, aesthetic-role and aesthetic-suitability sorts are applied on top in all three goals.
- `selection_role` is not consulted by any of these rankers.

### 3.2 Measured (same 69-entry × 6-context × 4-tolerance space; two runs, byte-identical, SHA-256 `7ed25548…6dae2a01`)

**Method:** each answer was re-run with the ID tie-break reversed. A Best Fit that changes was decided by ID alone.

**What counts as "materially worse":** the ID winner loses to a tied option on a clear, data-backed signal:
1. it is a `secondary` stand-in and the tied option is not;
2. **replace only:** it uses none of the current exercise's equipment, while the tied option does;
3. **replace only:** it ignores a curated `overlaps_with` near-substitute;
4. **complement only:** it is itself a curated overlap of the current exercise, so it is the same stimulus, not a different one.

Demand-rating differences are counted separately as weak signals and are **not** treated as material.

| Goal | Answered | Decided by ID | Materially worse | Weak only (demand difference) |
|---|---:|---:|---:|---:|
| Replace | 4,943 | 1,283 | **349** | 75 |
| Different stimulus | 8,709 | 3,432 | **214** | 843 |
| Complement | 8,709 | 3,432 | **214** | 843 |
| **Total** | 22,361 | 8,147 | **777** | 1,761 |

**Materially worse answers by context:**

| Any equipment | Gym | Home | Band + pull-up bar | Bodyweight | Nothing selected |
|---:|---:|---:|---:|---:|---:|
| 206 | 206 | 187 | 138 | 22 | 18 |

### 3.3 Representative failures (current → proposed)

| # | Request | Context | Today (ID) | Proposed | Signal |
|---|---|---|---|---|---|
| 1 | Replace my chest-supported row | Gym | **Seated band row** | Seated cable row | Curated overlap; a band row in a full gym |
| 2 | Replace my incline barbell / dumbbell / cable press | Gym | **Feet-elevated push-up** | Incline machine press | Curated overlap |
| 3 | Replace my back / front squat | Gym, home | Dumbbell squat | Goblet squat | Curated overlap |
| 4 | Replace my preacher / incline / drag curl | Home | **Band curl** (`cable-curl`) | Dumbbell curl | Secondary role, kit continuity |
| 5 | Replace my machine reverse fly | Gym | Face pull | Rear-delt fly | Curated overlap |
| 6 | Replace my skull crusher | Gym | Cable pushdown | Overhead triceps extension | Curated overlap, free-weight continuity |
| 7 | Replace my incline dumbbell curl | Gym | Barbell / EZ curl | Dumbbell curl | Kit continuity |
| 8 | Complement my ab-wheel rollout | Home, bodyweight, band kit | Plank, the same anti-extension stimulus | Reverse crunch | Curated overlap |
| 9 | Complement my hip thrust / BSS / hip adduction | Gym, home, band kit | **Band / cable pull-through** | Single-leg RDL / glute bridge | Secondary role |

## 4. Proposed resolution: one shared structural tie-break

Add one comparator, `compareStructuralTie(current, mode)`, used by both rankers **after** their existing target and coverage keys and **before** the ID:

1. **Unmarked before `secondary`.** The same rule the selection goals already use.
2. **Curated overlap.** Replace prefers an `overlaps_with` match with the current exercise; complement / different stimulus avoids one. This flips direction by mode, as the coverage key already does.
3. **Equipment continuity.** More equipment items shared with the current exercise first.
4. **ID.** The final deterministic fallback.

### Options measured (all keep 0 changes outside existing ID ties and 0 answered/empty changes)

| Option | Best Fit changes | Material failures left | Ties still decided by ID | Verdict |
|---|---:|---:|---:|---|
| Role only | 344 | 433 | 7,928 | Too narrow |
| Role → equipment | 2,628 | 246 | 5,465 | Misses the curated overlaps |
| Role → cost / demand closeness (goal-specific) | 4,689 | 82 | 2,557 | **Rejected.** Largest churn. Clear regressions (gym "replace hex press" → push-up; "replace cable shoulder press" → pike push-up). Conflicts with the documented rule that these ties "need curated preference, not a rule" |
| **Role → curated overlap → equipment (proposed)** | **2,797** | **0** | 5,119 | Every key is curated data or a fact about the current exercise; no new judgement |

**After the proposal:**
- 5,119 ties remain decided by ID. None of them has a strong signal, so the remaining fix is better curation of `overlaps_with`, not another rule.
- 25 answers keep a Best Fit the equipment signal would flag, because a curated overlap outranks equipment (e.g. "replace my Zottman curl" in a gym → barbell / EZ curl). That is intended; the overlap audit in §2.2 should confirm it.

## 5. Risks to existing recommendations

| Risk | Size | Mitigation |
|---|---|---|
| Visible churn | 2,797 Best Fits (replace 461; different stimulus 1,168; complement 1,168), 4,593 alternatives, 1,602 complement lists in **selection-goal** answers. Selection Best Fits change in 0 cases | Release note; production smoke tests on the examples in §3.3 |
| Neutral reshuffles | About 120 replace answers move within the lunge family (BSS ↔ static / walking / reverse lunge) with no quality gain | Accept, or curate `overlaps_with` for that family first |
| Equipment-continuity noise | The measured version counts every item in a record's equipment list, so support items (bench) and the band setup on cable records count as shared equipment | Implement it on the equipment setups the user can actually use; re-measure before release |
| `overlaps_with` becomes a ranking input | Mostly `needs-review` data; future edits will move answers | Overlap audit first (§2.2); a regression test pins the overlap set |
| Different stimulus = complement | Unchanged by this fix | A separate product decision: differentiate the two goals or merge them |
| Explanation text | Still describes the movement / classification match, not the tie reason | Optional wording change, out of scope |

## 6. Regression tests required before implementation

**Comparator unit tests (fixtures):**
1. Each key decides alone, with all earlier keys tied:
   - role;
   - overlap, in each mode direction;
   - equipment continuity;
   - ID.
2. Earlier keys are never crossed:
   - shared targets and coverage outrank all new keys;
   - target tier, aesthetic role and aesthetic suitability stay on top.
3. The overlap direction flips between replace and complement.
4. Determinism: same result for any library order; two secondary records fall back to ID.
5. A secondary record is still returned when it is the only eligible option.

**Representative scenario tests:** the nine cases in §3.3, each asserting the proposed Best Fit.

**Full-space invariant test** (as used in every batch; run twice, byte-identical):
1. 0 selection-goal Best Fit changes.
2. 0 answered ↔ empty status changes.
3. Every changed structural Best Fit was an ID-decided tie on `main` (reversed-ID check).
4. 0 materially worse residuals under the §3.2 definition.
5. Changed counts within ±0 of the approved figures. Any data edit that moves them must update the test deliberately.

**Gates:**
- Existing 310 tests, lint, build, Playwright and fresh-clone validation.
- A production smoke test on the §3.3 examples after deploying.

## 7. Decisions needed

1. Approve the content-review tiers. For P2, choose between keeping `reviewed` pending a diff review and demoting to `needs-review` now (a data change).
2. Approve the shared tie-break (role → curated overlap → equipment continuity → ID) for implementation, including the equipment-setup refinement in §5.
3. Decide whether the `overlaps_with` audit must finish before or after the ranking change.
4. Separately: what "different stimulus" should mean if it is to differ from "complement".
