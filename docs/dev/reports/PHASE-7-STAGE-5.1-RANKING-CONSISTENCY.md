# Phase 7 Stage 5.1 — Ranking Consistency

Implements the two ranking changes approved from `PHASE-7-STAGE-5-DECISION-COVERAGE-REVIEW.md` §6. Nothing else changed:

- **Data:** no exercises, targeting, band setups or target definitions.
- **Rules:** the replace-exercise rule and equipment feasibility are untouched.
- **Fallback:** alphabetical order stays the general final fallback.

## Changes

### 1. Limited-equipment cost (`engine/equipment.ts`)

- `setupCost(setup)` counts a setup's items, excluding `bodyweight`.
- `equipmentCost(exercise, available)` is the cost of the cheapest usable setup. It is the limited-equipment ranking key.
- `smallestUsableSetup` now picks by that cost, with ties kept in listed order.
  - No record's chosen setup changes as a result. Checked: no record has a multi-setup choice where item count and cost disagree.
  - So explanation and watch-out text is unchanged for every pick that didn't change.

### 2. Cost tie-break (`engine/decisionEngine.ts`, `rankByGoal`)

For **low-fatigue** and **limited-equipment** only, candidates tied on the goal key are ordered by:

1. lower fatigue cost;
2. lower setup time;
3. lower skill demand;
4. lower stability demand;
5. then the existing alphabetical `id` fallback.

The target-tier, aesthetic-role and aesthetic-suitability sorts still apply on top, unchanged. So the cost order only ever separates candidates that tie on every existing criterion. All other goals use the plain `id` fallback, exactly as before.

## Tests

New file: `engine/ranking.test.ts` (19 tests).

- **Bodyweight cost:** bodyweight is 0; real items are counted from the usable setup; alternative setups use the cheapest one.
- **Bodyweight wins the tie:**
  - a synthetic bodyweight exercise beats a one-item exercise, even though its id sorts last and it is worse on every demand;
  - on real data, unrestricted chest limited-equipment now gives `push-up-chest` ("Needs no equipment at all.").
- **Tie-break order:** fatigue, then setup, then skill, then stability each resolve the next tie, in both goals, with the id as the final fallback.
- **Goal key first:** in low-fatigue, the goal key (fatigue) still comes before the tie-break.
- **Other goals unchanged:** build-base and visual-area ignore the cost order (synthetic pair), and real-data picks are unchanged.
- **Feasibility unchanged:** a `pull-up bar` + `bodyweight` exercise is still infeasible with nothing selected.

Mutation checks, each confirming the tests catch a regression:

| Mutation | Tests failing |
|---|---:|
| Remove the tie-break | 8 |
| Count bodyweight as 1 item again | 3 |
| Extend the tie-break to build-base and visual-area | 3 |

## Coverage (36,360 scenarios; two runs, byte-identical)

| | Stage 5 baseline | Stage 5.1 |
|---|---:|---:|
| Answered | 20,227 | 20,227 |
| Empty | 16,133 | 16,133 |
| Answered → empty | — | **0** |
| Empty → answered | — | 0 |

### Best Fits changed: 578, all in the two goals

| Goal | Best Fits changed |
|---|---:|
| low-fatigue | 269 |
| limited-equipment | 309 |
| All other goals | **0** |

- **By equipment context:**

  | Context | Changed |
  |---|---:|
  | any | 221 |
  | commercial gym | 221 |
  | home dumbbells | 108 |
  | bodyweight | 13 |
  | minimal kit | 15 |

- **Alternatives changed:** 641. **Complement lists changed:** 351, because they follow the new Best Fit. All of these are in the same two goals.
- **Other goals are byte-for-byte unchanged against the Stage 3.5 run:** Best Fit, alternative, complements, explanation and watch-out text.
- **These counts match the Stage 5 simulation exactly** (269 / 309).

### Material changes (default context: any equipment, no tolerance)

**Limited-equipment: bodyweight now beats one-item equipment.**

| Selection | Before | After |
|---|---|---|
| Chest / mid-pec / chest-front-width | Cable / machine chest press | Push-up |
| Glutes / hips | Cable kickback | Glute bridge |
| Abs | Ab wheel | Plank |
| Calves / gastrocnemius | Leg-press calf raise | Single-leg calf raise |
| Quads | Dumbbell squat | Reverse Nordic curl |
| Shoulders region | Band/cable external rotation | Push-up plus |

**Low-fatigue and limited-equipment: cost replaces the alphabet.**

| Selection | Before | After |
|---|---|---|
| Hamstrings | Back extension | Lying leg curl |
| Side delt / shoulder width | Cable lateral raise | Dumbbell lateral raise |
| Brachialis / arm-side thickness | Cable rope or cross-body hammer curl | Hammer curl |
| Forearm extensors | Cable reverse curl | Reverse curl |
| Triceps | Cable overhead extension | Cable pushdown |
| Rear delt | Cable rear-delt builder | Machine reverse fly |
| Obliques | Cable woodchop | Russian twist |
| Neck | Neck extension | Neck flexion |

### Changes worth a reviewer's eye

Each follows the rule and is still a valid, targeted answer, but the product may disagree:

- Shoulders region, limited-equipment → Push-up Plus, a serratus exercise.
- Quads, limited-equipment → Reverse Nordic.
- Forearms region → Pronation/supination work.
- Back region, low-fatigue → Shrug.

A side effect, not a goal: needs-review Best Fits rise slightly, from 8,725 to 8,752.

## Checks

| Check | Result |
|---|---|
| validate-data | PASS |
| Vitest | 282 / 282 (263 + 19) |
| lint | clean |
| build | OK |
| Playwright | 3 / 3 |
| Fresh clone (`npm ci`, then validate, test, lint, build and e2e) | all pass |
