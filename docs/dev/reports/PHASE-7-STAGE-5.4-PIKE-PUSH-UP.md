# Phase 7 Stage 5.4 — Pike Push-Up Evaluation

_The analysis below was simulated (sections 1–4). The exercise was then implemented after approval; the real-record results are in [§6](#6-implemented-real-record-results), and they reproduce the simulation. The other bodyweight candidates and the tagging and outcome questions remain out of scope._

## Method

- **Engine and data:** current engine (Stage 5.3, `9892451`), full 36,360-scenario space.
- **Simulation:** the pike push-up was added in memory only, through a temporary harness that was then deleted.
- **Scenario sets:**
  - The baseline current-exercise scenarios are kept identical, so results compare 1:1.
  - The 144 scenarios where the pike push-up itself is the current exercise are reported separately.

### Simulated record

| Field | Value |
|---|---|
| `id` | `pike-push-up` |
| `body_regions` | `[shoulders]` |
| `movement_patterns[0]` | `vertical press` |
| `exercise_type` | compound |
| `equipment` | `[bodyweight]` |
| `physique_targets` | **`[front-delt]` only** |
| `primary_targets` | `[anterior deltoids]` |
| `secondary_targets` | `[triceps, upper chest]` |
| `coverage_categories` | `[heavy-compound, low-setup, equipment-limited-substitute]` (as the library's push-up) |
| Fatigue / setup / skill / stability | low / low / medium / medium |
| `functional_goals`, `aesthetic_characteristics`, declared complements | none |

Two sensitivity variants were also run:

- **No compound tag:** coverage categories without `heavy-compound`.
- **Medium fatigue.**

## 1. What it would change (main assumption)

### Coverage

| | Baseline | With pike push-up |
|---|---:|---:|
| Answered (of the same 36,360) | 20,227 | **20,481 (+254)** |
| Answers lost | — | **0** |
| Empty-result messages changed | — | 0 by kind and unlock list (see the correction in §6: 48 message texts change) |

### Opened scenarios (254)

| By entry | Count |
|---|---:|
| `front-delt` target | 181 |
| Shoulders region (current-exercise goals) | 61 |
| `scapular-stability` functional goal (complement goals only) | 12 |

**Selection cells opened (11), all `front-delt`:**

| Context | Tolerances opened |
|---|---|
| Bodyweight | none, low fatigue, low setup |
| Nothing selected | none, low fatigue, low setup |
| Minimal kit | none, low fatigue, low setup |
| Home dumbbells | low fatigue, low setup |

Low-skill and low-stability limits stay empty, because the pike push-up is medium on both.

**Pike as current exercise:** 144 new scenarios, 100 of them answered. Replacement answers are the overhead, cable or machine shoulder press.

### Recommendations replaced (381 Best Fits)

| From → to pike push-up | Scenarios | Where |
|---|---:|---|
| Push-up Plus | 336 | Shoulders region in bodyweight, nothing-selected and minimal-kit contexts (all selection goals); shoulders-region limited-equipment in gym and home; complement goals (see §2) |
| Cable shoulder press | 18 | Front delt in a full gym: low-fatigue and limited-equipment (Stage 5.1 cost rules: 0 equipment, low setup); replace-the-overhead-press |
| Seated machine shoulder press | 18 | Front delt and shoulders region under a low-setup limit (build-base, visual-area, replace) |
| Band/cable external rotation | 7 | Shoulders region, minimal kit (build-base, limited-equipment) |
| Overhead press | 2 | Front delt, home dumbbells (low-fatigue, limited-equipment) |

Unchanged: front delt build-base and visual-area with no limit (overhead press, cable shoulder press).

### Sensitivity

| Variant | Opened | Best Fits changed | Notes |
|---|---:|---:|---|
| Main | 254 | 381 | — |
| No `heavy-compound` tag | 254 | 360 | Only the build-base wording changes ("A compound movement…" rather than "A heavy-compound movement…") |
| Medium fatigue | 162 | 219 | Low-fatigue cells no longer open; full-gym low-fatigue picks stay with the cable press |

## 2. Tagging, supporting-target and Appearance behaviour

### Tagged only to front delt

- It is never a primary- or supporting-tier match for any other target.
- **No Appearance outcome uses front delt**: the shoulders-region outcomes are `shoulder-width-front` (side delt) and `shoulder-3d-shape` (rear delt). So no Appearance selection pool ever contains it.

### Where it does appear in Appearance and side/rear-delt results

| Slot | Appearance results mentioning it | Mechanism |
|---|---:|---|
| Best Fit | 48 | **complement goals only** |
| Alternative or complement list | 246 | complement goals and complement lists |

In both cases this is the existing region-wide complement mechanism, not targeting:

- **Complement goals.** "Add a different stimulus to my current lateral raise / rear-delt exercise" resolves complements across the shoulders region by design.
  - The pike push-up replaces Push-up Plus there.
  - That is consistent with the records' own declared complement text, e.g. the lateral raises' "A vertical press".
  - The result is shown at the "general" tier, never as a target match.
- **Complement lists.** It enters 847 three-item lists.

| It displaces | Times |
|---|---:|
| Push-up Plus | 329 |
| Seated machine shoulder press | 242 (mostly in gym contexts) |
| Dumbbell lateral raise | 63 |

The machine-press displacement is decided by the existing structural complement tie-break. With fewest shared coverage tags tied, the alphabetical fallback puts "pike" before "seated". It is not caused by targeting.

**Verdict:** no unwanted supporting-target behaviour. The only cross-target effect is through complement mechanisms that already behave this way for every exercise.

## 3. Against Policy B

### Is there a genuine direct-targeting gap?

**Yes.**

- Front delt has **no** bodyweight option today.
- All four overhead presses need equipment (barbell/dumbbell, cable, machine or Smith).
- The only bodyweight record classed as a vertical press is the chest dip, which is a downward press.

### Meaningfully useful, not just more answers?

**Yes.**

- It gives bodyweight users the missing vertical-press pattern, and it is directly progressable (elevation, then towards a handstand push-up).
- For shoulders-region picks, it replaces Push-up Plus, a serratus exercise with no physique target, with a direct deltoid press.

### Duplication?

**No true duplicate.**

- It overlaps the overhead press the same way the library's push-up overlaps the bench press: same pattern, bodyweight-loaded.
- The record should declare `overlaps_with: overhead-press`, as `push-up-chest` does for the bench presses.
- It does not overlap Push-up Plus (protraction) or the chest push-up (horizontal press).

### Does it improve the shoulders region as well as front-delt selection?

**Yes.**

- The shoulders region's bodyweight answer becomes a deltoid press instead of serratus work.
- Front delt gets 11 newly answered selection cells.

### Target-definition contradictions?

**None.**

- Front delt is defined as "the primary driver of overhead and forward-pressing movements", which the pike push-up is.
- It must **not** be tagged side delt (no abduction), triceps or upper pec (secondary movers). That would contradict those definitions and Policy B.

## 4. Points for the architecture review

1. **Front-delt reach is limited** to Direct/Advanced, the shoulders region, and complement goals, because no Appearance outcome references front delt. This was not changed here; it was out of scope.
2. **In a full gym, Stage 5.1 makes the pike push-up the low-fatigue and limited-equipment pick for front delt.** This follows the approved rules: 0 equipment wins limited-equipment, and lower setup breaks the low-fatigue tie.
3. **Replace-the-overhead-press (in a gym) choosing the pike push-up depends on its `primary_targets` wording.** The simulation copied the overhead press's exact string; the replacement rule matches it exactly. The real record's wording should be authored for accuracy, not to win or lose that tie.
4. **The complement-list displacement of the machine shoulder press in gym contexts** is an alphabetical-fallback effect in complement ranking. It is a general complement-ranking question, not a reason to reject this exercise.
5. **Record-authoring constraints if approved:**
   - `physique_targets: [front-delt]` only;
   - `overlaps_with: overhead-press`;
   - ratings and coverage tags set from evidence, not chosen for ranking effect;
   - not `draft`, which would exclude it from Decide;
   - meets the coaching gate (≥3 technique cues, ≥2 common mistakes) before `reviewed`;
   - re-run this analysis on the real record.

## Recommendation: **ADD**

- It meets every Policy B test: a genuine direct-targeting gap, meaningful usefulness, no duplication, a better shoulders-region answer, and no definition contradictions.
- It loses no existing answer, and it creates no supporting-target or Appearance-targeting behaviour.
- The side effects in §4 come from already-approved rules or general complement-ranking behaviour.
- Add it with the record constraints in §4.5, then verify with a coverage re-run.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |

No data, engine or ranking change. The temporary harness was deleted, and only this report was added.

## 6. Implemented: real-record results

### The record (`data/exercises/shoulders.yaml`, `pike-push-up`)

**Classification** (library conventions):

| Field | Value |
|---|---|
| Region | shoulders |
| `physique_targets` | `[front-delt]` only |
| `primary_targets` | `[anterior deltoids]` |
| `secondary_targets` | `[triceps, upper chest]` |
| Movement and type | `vertical press`, compound, bilateral |
| `equipment` | `[bodyweight]` |
| `overlaps_with` | `[overhead-press]` |

**Ratings and tags**, following how the library rates its existing bodyweight compounds:

| Field | Value | Basis |
|---|---|---|
| Fatigue | low | Like the push-up: bodyweight, upper body only |
| Setup | low | — |
| Skill | medium | Above the push-up's low, for hip position and head path; below chin-ups and dips, which are high |
| Stability | medium | Like the push-up |
| Coverage tags | `heavy-compound`, `low-setup`, `equipment-limited-substitute` | The push-up's tags. `skill-coordination` is used only for high-skill movements |

**Not added:** side-delt, rear-delt, triceps or upper-pec targeting; aesthetic characteristics; a functional goal; declared complement ids; an Appearance outcome reference; any ranking rule. No target definition was changed.

**Content and review status:**
- 5 technique cues and 3 common mistakes (each `error: consequence`), honest limitations, a hedged mirror effect and one programming note.
- `review_status: reviewed`. It passes the coaching gate via `validate-data`.
- `evidence_notes` is left empty rather than citing studies that weren't checked.

**Video:**
- Sourced by search, then checked like every other reference: the YouTube oEmbed endpoint returned HTTP 200 for "PIKE PUSH UP Tutorial for the Complete Beginner" by Paul Twyman (`paCOGgmLCA0`).
- The title and channel match the record's name, equipment and laterality.
- Recorded as `video_verification_method: metadata` on `2026-10-03`. **The footage was not watched**, which is exactly what `metadata` means.
- The URL is unique in the dataset.
- `npm run audit-videos` then reported 127 / 127 LIVE, and `VIDEO-CURATION-QA.md` was regenerated.

### Coverage: full space on the real record (two runs, byte-identical)

| | Stage 5.3 baseline | Real record |
|---|---:|---:|
| Scenarios | 36,360 | 36,504 (+144 with the pike push-up as the current exercise) |
| Answered | 20,227 | **20,581** (20,481 of the original 36,360, plus 100 of the 144 new) |
| Empty | 16,133 | 15,923 |
| Answers lost | — | **0** |

| Metric | Count |
|---|---:|
| Opened, of the original space | 254 |
| …front-delt target | 181 |
| …shoulders region | 61 |
| …scapular-stability (complement goals) | 12 |
| Selection cells opened | the same 11 front-delt cells as simulated |
| **Best Fits changed** | **381** |
| Alternatives changed | 622 |
| Complement lists changed | 1,140 |

The Best Fit transitions are the same as simulated:

| From → pike push-up | Scenarios |
|---|---:|
| Push-up Plus | 336 |
| Cable shoulder press | 18 |
| Seated machine shoulder press | 18 |
| Band/cable external rotation | 7 |
| Overhead press | 2 |

### Reach and match tiers

| Where the pike push-up is Best Fit | Scenarios | Match tier |
|---|---:|---|
| `front-delt` target | 121 | **primary** (all) |
| Shoulders region | 300 | general |
| Side delt / `shoulder-width-front` | 24 / 24 | general, complement goals only |
| Rear delt / `shoulder-3d-shape` | 24 / 24 | general, complement goals only |
| `rotator-cuff` functional goal | 18 | general |
| `scapular-stability` functional goal | 12 | general |

- **No primary or supporting-target match for any target other than front delt.**
- **Appearance:**
  - It is never in an outcome's candidate pool.
  - It is Best Fit for an outcome in 48 scenarios, all in the two complement goals, at the general tier.
  - It appears in 246 alternative or complement slots through region-wide complements.
  - This matches the simulation exactly.
- **Complement lists:** it appears in 931 lists. It displaces Push-up Plus (329), the seated machine shoulder press (242) and the dumbbell lateral raise (63), the same as simulated.

### Empty-result messages (correction to §1)

The simulation compared only each empty result's kind and unlock list, so it reported no change. The full text comparison shows:

- **48 still-empty scenarios change their message:** front delt under a **low-skill** limit in the bodyweight, nothing-selected and minimal-kit contexts.
- They now add: "Relaxing your skill preference would also allow one with your current equipment."
- This is because a bodyweight option now exists but is rated medium skill.
- **No kind or unlock list changes.**
- In the nothing-selected context, front delt is **no longer reported as a bodyweight gap**, which is correct under Policy B. Gap-flagged empties drop from 3,504 to 3,440 across the original space.

### Real record vs simulation

On the original 36,360 scenarios:

| Measure | Result |
|---|---|
| Scenarios that differ | 19 |
| Status, Best Fit, alternative or complements that differ | **0** |
| What differs | Only the visual-area "why" text, which is the record's own `mirror_effect` instead of the copied overhead-press text |
| Pike-as-current scenarios | 144, 100 answered, in both |

### Other effects

- Explore lists the new record under Shoulders and under the `bodyweight` equipment filter.
- Build packages are unchanged (explicit `exercise_id` lists).
- `data/index.test.ts` now expects 127 records. No engine test needed changing.

### Checks (real record)

| Check | Result |
|---|---|
| validate-data | PASS (127 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone (`npm ci`, then validate, test, lint, build and e2e) | all pass |

