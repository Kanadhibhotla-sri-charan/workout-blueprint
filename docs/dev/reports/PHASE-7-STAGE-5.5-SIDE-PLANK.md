# Phase 7 Stage 5.5 — Side Plank Evaluation

_The analysis below was simulated (sections 1–5). After approval, the exercise was implemented; the real-record results are in [§6](#6-implemented-real-record-results), and they reproduce the simulation exactly. The other bodyweight candidates, the tagging and outcome questions, and the `core-anti-lateral-flexion` definition remain out of scope._

## Method

- **Engine and data:** current engine and data (`5716fb8`, 127 exercises including the pike push-up). Full scenario space: 36,504 scenarios (36,360 plus 144 with the pike push-up as current).
- **Simulation:** the side plank was added in memory by a temporary harness, deleted after use.
- **Current-exercise scenarios:** the side plank was also added as a current exercise for the core region, the obliques target and the `waist-side-definition` outcome. For the functional-goal variant only, it was added for `core-anti-lateral-flexion` too.
- **Determinism:** the analysis ran twice with **byte-identical** output, and the baseline reproduces the Stage 5.4 real-record results exactly.

### Simulated record (main)

| Field | Value | Basis |
|---|---|---|
| Region | core | — |
| `physique_targets` | `[obliques]` | §1 |
| `primary_targets` | obliques, quadratus lumborum | As `suitcase-carry` |
| `secondary_targets` | gluteus medius | Not tagged as a target (§1) |
| `movement_patterns[0]` | `anti-lateral flexion under load` | The closed vocabulary's only anti-lateral-flexion value, shared with the suitcase carry |
| Type / laterality | isolation, unilateral | As the plank and the Copenhagen plank |
| `equipment` | `[bodyweight]` | — |
| Coverage tags | `low-setup`, `low-fatigue`, `equipment-limited-substitute` | The plank's tags. Unilateral isolation holds don't take the `unilateral` coverage tag |
| Fatigue / setup / skill / stability | low / low / low / medium | As the plank |
| `overlaps_with` | `suitcase-carry` | — |
| `functional_goals` | none | §1 |

### Sensitivity variants

| Variant | Change from main |
|---|---|
| With functional goal | Adds `core-anti-lateral-flexion` |
| High stability | Stability rated high |
| Separate pattern | A hypothetical new `anti-lateral flexion isometric` pattern |

## 1. Which target(s)? Justified against the definitions

| Target / goal | Definition (verbatim) | Verdict |
|---|---|---|
| **`obliques`** | "trained through anti-rotation, rotation, and **lateral-flexion-resisting movements**" | **Tag.** The side plank is the canonical lateral-flexion-resisting hold. The library already treats isometric anti-movement work as direct obliques training: the Pallof press (anti-rotation, band) and the suitcase carry (anti-lateral flexion) are both tagged `obliques`. |
| `rectus-abdominis` | "trained through spinal- and hip-flexion movements" | **Don't tag.** The side plank is not a flexion movement. |
| `gluteus-medius-minimus` | "trained through hip-abduction movements that most bilateral squats and hinges only work as **stabilizers**" | **Don't tag.** The bottom-leg glute medius works as a frontal-plane stabilizer, not through hip abduction, which is exactly the role the definition excludes. List it only as a secondary target. |
| `core-anti-lateral-flexion` (functional goal) | "Trunk bracing that resists sideways bending, **trained through unilaterally-loaded carries**…" | **Don't tag yet; report separately.** The first clause fits the side plank exactly, but the definition names carries as the method. Tagging it would stretch the definition as written. Whether to widen it is a definition decision (see §5). |

**Is the load meaningful (Policy B, "no negligible-load exercises")?**
- A side plank loads the obliques against a large share of bodyweight on a long lever.
- It progresses by lengthening the lever, raising the feet, adding load or adding time.
- It is at least as loaded as the band Pallof press the library already tags `obliques`.
- As an isometric hold, its hypertrophy stimulus is modest. The record's `mirror_effect` should say so, as the plank's and the glute bridge's do.

## 2. Impact (main variant)

### Coverage

| | Baseline | With side plank |
|---|---:|---:|
| Answered (of the same 36,504) | 20,581 | **20,893 (+312)** |
| Answers lost | — | **0** |
| Side plank as current exercise | — | 216 scenarios, 171 answered |

### Opened scenarios (312)

| Entry | Opened |
|---|---:|
| Obliques target | 120 |
| `waist-side-definition` outcome | 120 |
| Core region (current-exercise goals) | 36 |
| Rectus abdominis, `ab-front-definition`, `core-anti-extension` | 12 each |

- The last three open only in the complement goals, with the plank as the current exercise, in bodyweight contexts. They are at the general tier.
- **16 selection cells open**: obliques and `waist-side-definition`, in the **bodyweight** and **nothing-selected** contexts, under every tolerance (none, low fatigue, low skill, low setup).

### Best Fits replaced (204)

| From → side plank | Scenarios | Where |
|---|---:|---|
| Pallof press | 92 | 8 minimal-kit limited-equipment (obliques / waist); 84 complement goals, 36 of them in any / gym / home contexts |
| Plank | 52 | Complement goals, bodyweight contexts |
| Russian twist | 32 | 24 obliques / waist limited-equipment in any / gym / home (bodyweight costs 0 under the Stage 5.1 rule); 8 complement goals |
| Hanging knee raise | 28 | Complement goals, bodyweight contexts |

- **Gym selection goals change only for limited-equipment.** With no limit:
  - build-base and visual-area for obliques stay the cable woodchop;
  - low-fatigue stays the Russian twist.
- In gym contexts, the complement goals ("add a different stimulus to my current woodchop / Russian twist") now offer the side plank instead of the Pallof press in 44 scenarios.
- Core-region selection goals: **no change**.

### Alternatives and complements

- **Alternatives:** 718 changed. Mostly the side plank fills slots that were empty (236) or replaces the Pallof press or Russian twist.
- **Complement lists:** 1,189 changed. It appears in 1,017 lists, displacing:

  | Displaced | Times |
  |---|---:|
  | Suitcase carry | 155 |
  | Hanging knee raise | 134 |
  | Russian twist | 80 |
  | Ab wheel | 64 |
  | Cable crunch | 28 |

### Replacement links (through the shared movement pattern)

- It becomes the replacement for the **suitcase carry** in 72 scenarios, all in bodyweight contexts where the carry is impossible.
- With the side plank as current, its replacement is the suitcase carry (27).

### Empty-result messages

- **48 still-empty scenarios change**, all obliques / `waist-side-definition` **replace-exercise** in bodyweight and nothing-selected contexts.
- The selection now has a bodyweight option, so the reply becomes the replace goal's own message ("Cable Woodchop has no substitute meeting your constraints in this region.") instead of the equipment explanation. This is correct behaviour.

## 3. Match tiers and Appearance behaviour

| Where the side plank is Best Fit | Scenarios | Tier |
|---|---:|---|
| Obliques target | 158 | **primary** |
| `waist-side-definition` (Appearance) | 158 | **primary** |
| Core region | 122 | general |
| Rectus abdominis / `ab-front-definition` | 12 / 12 | general — complement goals only, with the plank as current |
| `core-anti-extension` | 12 | general — complement goals only, with the plank as current |
| `core-anti-rotation` | 10 | general — complement goals only, with the Pallof press as current |

- **No primary or supporting-tier match for any target other than obliques.**
- **Appearance:**
  - `waist-side-definition`, the obliques outcome, gains a **direct, primary-tier bodyweight answer**. This is the intended effect, and the outcome is reachable from the default Appearance path.
  - `ab-front-definition` sees it only as a general-tier "add a different stimulus to my plank" answer (12 scenarios), plus alternative and complement slots (203).

## 4. Duplication

| Existing exercise | Relationship | Same function? | Duplicate? |
|---|---|---|---|
| Suitcase carry | Same function (anti-lateral flexion, obliques + quadratus lumborum), but loaded, walking, high fatigue, and needs a dumbbell or kettlebell | Yes | **No.** It is the bodyweight, low-fatigue form. Declare `overlaps_with` |
| Copenhagen plank | Its own record lists "side-plank support" as a movement pattern and "obliques and lateral trunk" as secondary; its primary target is the adductors and it needs a bench | Partly | **No.** Different primary target. Declaring `overlaps_with` is reasonable, since both are side-lying holds |
| Plank | Anti-extension, rectus abdominis | No | No |

## 5. Against Policy B

### Is there a genuine direct-targeting gap?

**Yes.**

- Obliques have **no** bodyweight option today. The Russian twist, woodchop, Pallof press and suitcase carry all need equipment.
- `waist-side-definition` is empty for bodyweight users.
- The obliques definition explicitly names lateral-flexion-resisting movements.

### Meaningfully useful, not just more answers?

**Yes.**

- It is the standard bodyweight obliques and lateral-trunk exercise, with clear progressions.
- It reaches an Appearance outcome directly, not only the Direct/Advanced picker.
- In gym contexts it changes only the limited-equipment pick, which follows the approved Stage 5.1 rule.

### Does it introduce duplication?

**No.** It is a partial overlap with the suitcase carry (same function, different loading) and the Copenhagen plank (same posture, different target). Both should be declared in `overlaps_with`.

### Indirect targeting?

**None proposed.**

- Obliques are trained directly, per the definition.
- The glute medius and rectus abdominis are deliberately not tagged.
- The functional goal is held back pending its definition.

### Target-definition questions (reported, not changed)

1. **`core-anti-lateral-flexion`'s definition** names carries as the method.
   - Its only exercise is the suitcase carry, rated high fatigue. That is why this goal is **empty under a low-fatigue limit even in a full gym** (one of the 8 full-gym empty cells from Stage 5).
   - Widening the definition to "resists sideways bending, e.g. unilaterally-loaded carries or side-lying holds" and tagging the side plank would open **15 selection cells**, including the full-gym low-fatigue cells, plus 114 scenarios in total. That is the "with functional goal" variant: +426 answered, 0 lost.
   - This is a definition decision for the architecture review.
2. **`rectus-abdominis` vs the plank.** The definition says "spinal- and hip-flexion movements", but the anti-extension plank is tagged `rectus-abdominis`. This is not caused by the side plank and was not changed. It's noted because the obliques decision above doesn't rely on that precedent: the obliques definition names lateral-flexion resistance itself.

## Sensitivity

| Variant | Opened | Lost | Best Fits changed | Notes |
|---|---:|---:|---:|---|
| Main | 312 | 0 | 204 | — |
| High stability | 312 | 0 | 204 | **Identical** to main; the stability rating doesn't change any outcome here |
| With `core-anti-lateral-flexion` functional goal | 426 | 0 | 240 | +15 anti-lateral-flexion selection cells (incl. full-gym low fatigue); it replaces the suitcase carry for that goal in 36 scenarios; no primary/supporting match outside obliques |
| Separate (new) movement pattern | 240 | 0 | 334 | Loses the suitcase-carry replacement link (72 fewer opened); more complement churn. Would also need a taxonomy change, so **not recommended** |

## Recommendation: **ADD**, with obliques as the only physique target

**Record constraints if approved:**

| Field | Value |
|---|---|
| `physique_targets` | `[obliques]` only |
| `primary_targets` | obliques, quadratus lumborum |
| `secondary_targets` | gluteus medius, not tagged as a target |
| `movement_patterns[0]` | `anti-lateral flexion under load`, the existing closed value; no taxonomy change |
| Type / laterality | isolation, unilateral |
| `equipment` | `[bodyweight]` |
| Coverage tags | `low-setup`, `low-fatigue`, `equipment-limited-substitute` |
| Ratings | low fatigue, low setup, low skill, medium stability (from evidence; stability is outcome-neutral here) |
| `overlaps_with` | `suitcase-carry`, `copenhagen-plank` |
| `functional_goals` | **none**, until the `core-anti-lateral-flexion` definition question is decided |
| Not tagged | rectus abdominis, glute medius |

- A hedged `mirror_effect`; it passes the coaching gate before `reviewed`.
- A video sourced and verified under the existing provenance rules (or `needs-review` if none can be confirmed).
- Re-run this analysis on the real record.

**Separate architecture decision:** whether to widen the `core-anti-lateral-flexion` definition so side-lying holds count. If yes, tagging the side plank closes that goal's full-gym low-fatigue gap.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS (127 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |

The analysis ran twice with byte-identical output. The temporary harness was deleted, and only this report was added.

## 6. Implemented: real-record results

### The record (`data/exercises/core.yaml`, `side-plank`)

Built to the approved specification:

| Field | Value |
|---|---|
| `physique_targets` | `[obliques]` only |
| `primary_targets` | obliques, quadratus lumborum |
| `secondary_targets` | gluteus medius (not a physique target) |
| `movement_patterns[0]` | `anti-lateral flexion under load` (existing value) |
| Type / laterality | isolation, unilateral |
| `equipment` | `[bodyweight]` |
| Coverage tags | `low-setup`, `low-fatigue`, `equipment-limited-substitute` |
| Fatigue / setup / skill / stability | low / low / low / medium |
| `overlaps_with` | `suitcase-carry`, `copenhagen-plank (hips module)` |

- **`overlaps_with` notation:** the Copenhagen plank lives in `hips.yaml`. `validate-data` requires a cross-file reference to carry its module note, the same convention as the suitcase carry's `farmers-carry (forearms module)`.
- **Not tagged:** rectus abdominis, glute medius/minimus as a physique target, any functional goal. The `core-anti-lateral-flexion` definition is unchanged.
- **Coaching content:**
  - 5 technique cues and 3 common mistakes (`error: consequence`);
  - honest limitations;
  - a progression note;
  - a hedged mirror effect ("builds lateral-trunk strength and endurance more than oblique size").
- **Review status:** `reviewed`. It passes the coaching gate.
- **Evidence notes:** left empty rather than citing studies that weren't checked.
- **Video:**
  - Sourced by search, then checked with the YouTube oEmbed endpoint (HTTP 200): "How to do a Side Plank | Proper Form & Technique | NASM" by the National Academy of Sports Medicine (`44ND4bOB-T0`).
  - The title and channel match the record's name, equipment and laterality.
  - Recorded as `metadata` on `2026-10-03`: **the footage was not watched.** The URL is unique.
  - The audit then reported 128 / 128 LIVE, and `VIDEO-CURATION-QA.md` and `KNOWLEDGE-QA.md` were regenerated.

### Coverage on the real record (two runs, byte-identical)

| | Before (Stage 5.4 real) | Real side plank |
|---|---:|---:|
| Scenarios | 36,504 | 36,720 (+216 with the side plank as current) |
| Answered | 20,581 | **21,064** (20,893 of the original 36,504, plus 171 of the new) |
| Empty | 15,923 | 15,656 |
| Answers lost | — | **0** |

| Metric | Count |
|---|---:|
| Opened, of the original space | 312 |
| Selection cells opened | 16 (obliques and `waist-side-definition`, bodyweight and nothing-selected, every tolerance) |
| **Best Fits changed** | **204** |
| Alternatives changed | 718 |
| Complement lists changed | 1,189 |
| Side plank in complement lists | 1,017 |

Best Fit transitions, as simulated:

| From → side plank | Scenarios |
|---|---:|
| Pallof press | 92 |
| Plank | 52 |
| Russian twist | 32 |
| Hanging knee raise | 28 |

### Match tiers and Appearance

| Where the side plank is Best Fit | Scenarios | Tier |
|---|---:|---|
| Obliques target | 158 | primary |
| `waist-side-definition` | 158 | primary |
| Core region | 122 | general |
| Rectus abdominis / `ab-front-definition` / `core-anti-extension` | 12 each | general — complement goals with the plank as current |
| `core-anti-rotation` | 10 | general — complement goals with the Pallof press as current |

- **No primary or supporting-tier match outside obliques.**
- **Appearance:**
  - It is a primary-tier Best Fit for `waist-side-definition` (158), plus alternatives (66) and complements (148) there.
  - In `ab-front-definition` it appears only as a general-tier complement-goal Best Fit (12), plus alternatives (86) and complements (117).
  - 587 mentions in total, as simulated.

### Functional-goal behaviour

- The side plank carries no `functional_goals`. Every result still resolves the functional goal the user selected.
- It is a Best Fit for a functional goal only through complement goals, at the general tier: anti-rotation 10, anti-extension 12.
- **`core-anti-lateral-flexion` is unchanged as a goal.**
  - Its pool and Best Fits are the same; the suitcase carry is still its only exercise, so its full-gym low-fatigue cell stays empty.
  - The side plank appears in 18 of its results, only inside the *complement lists* of the woodchop or Pallof press Best Fit, in the complement goals with the suitcase carry as current.

### Empty-result messages

- **48 still-empty scenarios change**: obliques and `waist-side-definition` replace-exercise in bodyweight and nothing-selected contexts.
  - They now show the replace goal's own "…has no substitute…" message, because the selection has a bodyweight option.
  - This is the same as simulated.
- **Bodyweight-gap empties** fall from 3,440 to 3,312: obliques and `waist-side-definition` are no longer bodyweight gaps.

### Real record vs simulation

- **0 differences** across all 36,720 scenarios in status, Best Fit, alternative, complement list, match tier and functional goal.
- The simulated record lacked real explanation and watch-out text, so those were not compared.

### Other effects

- Explore lists the side plank under Core and the `bodyweight` equipment filter.
- Build packages are unchanged.
- `data/index.test.ts` now expects 128 records. No engine test needed changing.

### Checks (real record)

| Check | Result |
|---|---|
| validate-data | PASS (128 records) |
| Vitest | 298 / 298 |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone (`npm ci`, then validate, test, lint, build and e2e) | all pass |

