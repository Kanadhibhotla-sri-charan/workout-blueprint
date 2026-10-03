# Phase 7 Stage 5.4 — Pike Push-Up Evaluation

_Analysis only. No data, ranking or engine change. The other bodyweight candidates and the tagging and outcome questions are out of scope._

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
| Empty-result messages changed | — | 0 |

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
