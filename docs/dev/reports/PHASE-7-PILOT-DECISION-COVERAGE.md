# Phase 7 Stage 3 — Decision-Coverage Pilot

_An experiment, not an expansion: 8 candidate exercises were audited against the existing 123. Only the ones that filled a real gap in what Decide can recommend were added, and the change was measured before and after. No Tier 2/3 exercises were added, no package was changed, and the recommendation algorithm was not modified._

## Result in one paragraph

**3 of 8 pilot exercises were added: glute bridge, single-leg RDL, Copenhagen plank.** Together they turn **480 previously empty Decide results into real recommendations**: 384 for glutes and 96 for adductors, almost all for lifters with only bodyweight or dumbbells. **5 were rejected as near-duplicates.** Side delts, triceps long head, upper traps and forearms are **unchanged**, because no pilot exercise added genuinely new coverage for them. Their real gap, almost no options for home or bodyweight training, comes mainly from how equipment requirements are recorded, not from missing exercises (see "Root cause" below). One side-effect needs a decision: with a full gym, the glute "visual area" pick changed from **hip thrust to glute bridge** because of an existing alphabetical tie-break, not on merit.

## 1. Audit — is each pilot exercise genuinely missing?

| Pilot | Closest existing coverage | Verdict |
|---|---|---|
| Seated dumbbell shoulder press | `overhead-press` (record explicitly covers dumbbells), `seated-machine-shoulder-press` (seated, stable) | **Not added.** Same vertical press and front-delt target. The dumbbell-only lifter can't reach `overhead-press` only because it lists barbell *and* dumbbell (see "Root cause"). Front delt isn't one of the targeted muscles. |
| Bayesian cable curl | `incline-dumbbell-curl` (lengthened shoulder position), `cable-curl`, `cable-drag-curl` | **Not added.** Biceps already has 9 options, including a stretch-biased one. The cable's tension at the stretch is a real difference, but too small to change a decision. |
| Glute bridge | `hip-thrust` (same hip extension, needs bench + bar + setup) | **Added.** Glute max had **0** options with only bodyweight or dumbbells, and only 1 low-fatigue option. |
| Single-leg RDL | `romanian-deadlift`, `stiff-leg-deadlift`; `bulgarian-split-squat-hip-dominant` is single-leg but a split squat | **Added.** The library had **no single-leg hip hinge**. It needs only one dumbbell. |
| Inverted row | `chest-supported-row`, `seated-cable-row` (both low-demand, no spinal load) | **Not added.** In a gym it duplicates those rows. Its real value (rows at home on rings or a suspension trainer) depends on equipment the dataset doesn't model, and back isn't a targeted muscle. Strongest candidate to revisit once equipment modelling is fixed. |
| Cable Y-raise | `cable-lateral-raise`, `machine-lateral-raise`, `dumbbell-lateral-raise` | **Not added.** For side delts it would be a fourth abduction raise with no new equipment or resistance profile. What sets it apart is lower-trap work, and the target taxonomy has no lower-trap target, so Decide couldn't select it for that anyway. |
| Copenhagen plank | `hip-adduction` (machine only) | **Added.** Adductors had **one** exercise, and it needed a machine. |
| Step-up | `reverse-lunge`, `static-lunge`, `walking-lunge`, both Bulgarian split squats, `smith-machine-bulgarian-split-squat` | **Not added.** Six existing single-leg knee-dominant options. The dumbbell-only quad gap has the same equipment cause. |

## 2. What was added

All three are complete records. They pass the same `reviewed` gate as the Build-package exercises (at least 3 cues, at least 2 mistakes each with its consequence, honest limitations, a hedged mirror effect). Each has a live video with `video_verification_method: metadata` and `video_verified_on: 2026-10-02`. None was added to any package.

| Exercise | Targets (`physique_targets`) | Equipment | Demands (stability / skill / setup / fatigue) | Resolved programming profile | Video |
|---|---|---|---|---|---|
| `glute-bridge` (hips) | gluteus-maximus | bodyweight | low / low / low / low | `compound-general` — 6–15 reps, RIR 1–3 | Redefining Strength |
| `single-leg-romanian-deadlift` (hamstrings) | hamstrings, gluteus-maximus | dumbbell | high / medium / low / medium | `compound-general` — 6–15 reps, RIR 1–3 | Dr. Jacob Goodin |
| `copenhagen-plank` (hips) | adductors; functional goal `hip-stability` | bodyweight, bench | medium / medium / low / low | `elevated-stability-isolation` — 8–15 reps, RIR 1–3 | Live Lean TV |

- `single-leg-romanian-deadlift` is deliberately **not** tagged `gluteus-medius-minimus`. Glute med works as a stabiliser here, but that's listed in `secondary_targets` rather than claimed as a training target.
- `copenhagen-plank` carries one evidence note: Harøy et al., *BJSM* 2019, a randomised trial in 652 football players. The note is scoped to what the trial measured (groin problems), and states that it says nothing about muscle size.
- The three new records point to their near-duplicates through `overlaps_with`. No existing record was edited to point back, so the 123 existing records are byte-identical.

## 3. Before vs after

Measured with a harness that runs `makeRecommendation` (unchanged) across every combination of:

- the 8 physique targets behind the six requested muscle groups, and each target's aesthetic outcomes;
- all 7 goals, with every exercise of the target as "my current exercise" where a goal needs one;
- 4 equipment contexts: any / full commercial gym / home dumbbells + bench / bodyweight;
- 4 tolerance limits: none / low fatigue / low skill / low setup.

That's 2,896 scenarios. Two runs on the same data were byte-identical, so **Decide remains deterministic**.

### Candidates available per target (before → after)

| Target | Any | Commercial gym | Home dumbbells | Bodyweight | Low fatigue | Low skill | Low setup |
|---|---|---|---|---|---|---|---|
| side-delt | 3 → 3 | 3 → 3 | 1 → 1 | 0 → 0 | 3 → 3 | 3 → 3 | 2 → 2 |
| **gluteus-maximus** | 5 → **7** | 5 → **7** | 0 → **2** | 0 → **1** | 1 → **2** | 1 → **2** | 1 → **3** |
| gluteus-medius-minimus | 1 → 1 | 1 → 1 | 0 → 0 | 0 → 0 | 1 → 1 | 1 → 1 | 1 → 1 |
| **adductors** | 1 → **2** | 1 → **2** | 0 → **1** | 0 → **1** | 1 → **2** | 1 → 1 | 1 → **2** |
| triceps-long-head | 2 → 2 | 2 → 2 | 0 → 0 | 0 → 0 | 2 → 2 | 0 → 0 | 0 → 0 |
| upper-traps | 2 → 2 | 2 → 2 | 0 → 0 | 0 → 0 | 1 → 1 | 1 → 1 | 1 → 1 |
| forearm-flexors | 1 → 1 | 1 → 1 | 0 → 0 | 0 → 0 | 1 → 1 | 1 → 1 | 1 → 1 |
| forearm-extensors | 3 → 3 | 3 → 3 | 0 → 0 | 0 → 0 | 3 → 3 | 3 → 3 | 2 → 2 |

### What Decide returns (2,896 scenarios that exist before and after)

| Target | Scenarios | Got a recommendation, before | After | Empty → recommendation | Best fit changed | Only alternative/complements changed | Unchanged |
|---|---|---|---|---|---|---|---|
| side-delt | 416 | 292 | 292 | 0 | 0 | 0 | 416 |
| **gluteus-maximus** | 912 | 276 | **660** | **384** | 60 | 150 | 318 |
| gluteus-medius-minimus | 224 | 96 | 96 | 0 | 8 | 16 | 200 |
| **adductors** | 224 | 96 | **192** | **96** | 60 | 12 | 56 |
| triceps-long-head | 160 | 40 | 40 | 0 | 0 | 0 | 160 |
| upper-traps | 320 | 128 | 128 | 0 | 0 | 0 | 320 |
| forearm-flexors | 224 | 96 | 96 | 0 | 0 | 0 | 224 |
| forearm-extensors | 416 | 188 | 188 | 0 | 0 | 0 | 416 |

### What each new exercise actually added

| Exercise | New movement option | New equipment option | New resistance / demand profile | New emphasis | Notes |
|---|---|---|---|---|---|
| Glute bridge | — (same hip extension as `hip-thrust`) | **Yes** — first bodyweight glute-max option | **Yes** — first low-setup, low-skill glute-max compound | — | 348 of the 384 newly answered glute scenarios are bodyweight or home-dumbbell contexts. |
| Single-leg RDL | **Yes** — first single-leg hinge | **Yes** — first glute/hamstring hinge needing only one dumbbell | Lengthened-position, balance-limited | **Single-leg / asymmetry** | Becomes the alternative to the RDL and stiff-leg deadlift, and a different-stimulus option alongside leg curls and cable kickbacks. |
| Copenhagen plank | Partly — adduction as a bodyweight lever instead of a machine | **Yes** — first adductor option without a machine | **Yes** — lever-based progression | — | Answers 96 previously empty adductor scenarios (84 of them bodyweight or home). 32 stay empty — all with a "low skill" limit, since this is a medium-skill exercise. |

### Unchanged elsewhere

A broad sweep of every goal × body region (with every possible current exercise), physique target, aesthetic outcome and functional goal covers 822 scenarios that exist before and after:

- **785 are byte-identical.**
- **All 37 that changed now include one of the three new exercises.** There are no changes outside the new coverage.

**Still empty after the pilot:** 252 glute-max and 32 adductor scenarios. For adductors, all 32 are "low skill" requests. For glutes, every one is a request with a current exercise (replace, different stimulus, or complement), and 222 of the 252 also carry a tolerance limit. These goals look for a substitute or complement to that specific exercise within the region, and none meets the limit.

## 4. Side-effects that need a decision

1. **Alphabetical tie-break displaces stronger options in a full gym.** `rankByGoal` breaks ties between equally ranked candidates by exercise id. That isn't new (`hip-thrust` already beat `romanian-deadlift` this way), but the new ids sort early:
   - glute "visual area", any or full-gym equipment: **hip thrust → glute bridge**;
   - adductors "build base" / "visual area" / "low fatigue", full gym: **hip adduction machine → Copenhagen plank**.

   Both are valid exercises, but the bridge winning over a loaded hip thrust for a full-gym lifter is a quality regression caused by naming, not merit. Options:
   - (a) accept it;
   - (b) add explicit `exercise_roles` to the glute outcomes (data only — the mechanism built for exactly this; covers outcome-based requests, not bare target requests);
   - (c) change the tie-break to something meaningful, e.g. loadability. That's an algorithm change and needs your approval.

   I haven't done any of these.

2. **Complement goals cross targets.** With a current exercise, "different stimulus" and "complement" draw from the whole body region. So a glute-max request with `hip-abduction` as the current exercise can now return `copenhagen-plank`. That's existing engine behaviour and arguably sensible (adduction complements abduction), but it's visible in the glute numbers above.

## 5. Root cause of the remaining gaps (not fixable by adding exercises)

The equipment filter requires **every** item an exercise lists. Several records list alternatives as if they were all required:

- `overhead-triceps-extension`: barbell + EZ-bar + dumbbell;
- `barbell-dumbbell-shrug`: barbell + dumbbell + cable;
- `wrist-curl`, `reverse-curl`, `romanian-deadlift`, the lunges, and others.

So a lifter with dumbbells and a bench gets **zero** candidates for triceps long head, upper traps and both forearm targets, even though dumbbell versions are described in those very records. Adding more exercises would hide this rather than fix it. The fix is to separate "required" from "any of" equipment in the data model, and possibly how the engine reads it. That's an architectural decision for you, and it would likely do more for decision coverage than the remaining Tier 1 list.

## Recommendation

- Keep the three additions. Each opens a genuinely new option, mostly for equipment-limited lifters.
- Decide on side-effect 1 before release.
- Prioritise the equipment-semantics fix over further library expansion.
- Don't add the five rejected pilots unless that fix changes the picture. Inverted row is the most likely to qualify then.
