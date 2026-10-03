# Phase 7 Stage 5 — Decision Coverage Review

_Analysis only. No production code, exercise, package or programming data was changed._

## Method

The analysis ran against the current 126-exercise dataset and the production `makeRecommendation`, at commit `5d3fb9e`.

### Scenario space

It uses the same 36,360-scenario space as Stage 3.5:

- 69 entries: 11 regions, 25 physique targets, 26 aesthetic outcomes and 7 functional goals;
- × 7 goals (current-exercise goals run once per eligible current exercise);
- × 6 equipment contexts;
- × 4 tolerance limits.

The six equipment contexts:

| Context | Equipment |
|---|---|
| any | No equipment limit |
| commercial-gym | Full gym list |
| home-dumbbells | dumbbell, bench, incline bench, pull-up bar, band |
| bodyweight | bodyweight, pull-up bar, dip bars, wall, bench |
| nothing-selected | `[]` |
| minimal-kit | band, pull-up bar |

### How causes and ties were measured

A temporary harness ran the engine unmodified. It was deleted after use and not committed.

- **Cause of an empty result:** each empty scenario was re-run with equipment relaxed, with tolerance relaxed, and with both relaxed.
- **Ties:** the only `localeCompare` calls in the decision path are the id tie-breaks in `rankByGoal`, `rankStructuralAlternatives` and `rankStructuralComplements`. Swapping that comparator during a run shows which Best Fits were decided by the alphabet, and lets candidate rules be simulated without touching the engine.
- **Verification:** a copy of the ranking key matched the engine's Best Fit in every non-complement scenario.

### Results reproduce

The results match Stage 3.5 exactly: 20,227 answered. A re-run produced byte-identical output.

## 1. Answered vs empty

| | Scenarios | Answered | Empty |
|---|---:|---:|---:|
| **All** | 36,360 | 20,227 (55.6%) | 16,133 |
| Selection goals (build-base, visual-area, low-fatigue, limited-equipment) | 6,624 | 4,292 | 2,332 |
| Current-exercise goals (replace, different-stimulus, complement) | 29,736 | 15,935 | 13,801 |

The raw total overstates the problem in two ways:

- **Current-exercise goals count once per current exercise.** They are 82% of the space.
- **Many current-exercise empties are correct.** For example, "replace my machine hack squat" when the user has nothing should come back empty.

Whether a selection has an answer doesn't depend on the goal: the four selection goals have identical empty sets. So the clearest unit is the **selection cell** (entry × equipment × tolerance): **583 of 1,656 cells are empty.**

## 2. Remaining empty-result breakdown

### Selection cells: number of entries (of 69) with no answer

| Equipment | No limit | Low fatigue | Low skill | Low setup |
|---|---:|---:|---:|---:|
| any | 0 | 1 | 5 | 2 |
| commercial-gym | 0 | 1 | 5 | 2 |
| home-dumbbells | 3 | 12 | 19 | 5 |
| bodyweight | 35 | 49 | 54 | 35 |
| nothing-selected | 48 | 52 | 54 | 48 |
| minimal-kit | 33 | 40 | 47 | 33 |

### By cause (all 16,133 empty scenarios)

| Cause | Scenarios |
|---|---:|
| Equipment only | 9,677 |
| Structural: no answer even with no equipment or tolerance limit | 2,640 |
| Either relaxation alone fixes it | 2,034 |
| Tolerance only | 983 |
| Needs both relaxed | 799 |

### By entry type (selection cells)

| Entry type | Empty |
|---|---:|
| Region | 50 / 264 |
| Target | 243 / 600 |
| Outcome | 226 / 624 |
| Function | 64 / 168 |

### What this shows

- **With equipment unrestricted and no tolerance limit, every one of the 69 entries answers.** In a full gym, only 8 tolerance-limited cells are empty:
  - triceps long head (low skill, low setup);
  - neck thickness / neck size (low skill);
  - four functional goals: core anti-lateral-flexion, hip flexors, rotator cuff, scapular stability.
- **Almost all remaining selection gaps are bodyweight, nothing-selected and minimal-kit.**
  - 13 of 25 physique targets have no exercise a bodyweight user can do: upper pec, front delt, side delt, back thickness, upper traps, biceps, brachialis, triceps long head, soleus, hamstrings, forearm flexors, forearm extensors, and gluteus medius/minimus (minimal kit only).
  - The four targets named for review are part of this broader pattern, not exceptions to it.
- **The largest structural gap is replace-exercise, not content.**
  - 36 of 126 exercises can never be replaced, even with unrestricted equipment: 110 of 413 replace scenarios in that context are empty. This is the 2,640 "structural" scenarios.
  - The replacement rule requires the *same* `movement_patterns[0]` and `exercise_type`. Exercises with a unique pattern have no partner: dips, pullovers, carries, both back extensions, neck work, wrist curls, plank, Pallof press, leg press, and others.
  - This is a rule-strictness question, out of scope here and noted for a later decision.
- **Complement goals are fully answered in a full gym** (0 of 413 empty). They only empty out with equipment limits.

## 3. Bodyweight and minimal-equipment gaps (focus targets)

Counts include target and outcome entries (`upper-back-fullness`, `forearm-fullness-inner`, `forearm-fullness-outer`) and all goals.

| Target | Empty | Equipment contexts | Tolerance | Goals |
|---|---:|---|---|---|
| Triceps long head | 182 / 240 | Bodyweight, nothing, minimal kit (all tolerances); **also any, gym and home under low skill and low setup** | Low skill 60, low setup 60, none 31, low fatigue 31 | Every goal |
| Upper traps | 288 / 480 | Bodyweight, nothing, minimal kit; any/gym/home only for replace | Even (72 each) | Every goal; replace 96 |
| Forearm flexors | 192 / 336 | Bodyweight, nothing, minimal kit; any/gym/home only for replace | Even (48 each) | Every goal |
| Forearm extensors | 348 / 624 | Bodyweight, nothing, minimal kit; home also for low setup | Even (86–90) | Every goal; replace 108, complements 72 each |

### Can an existing exercise cover the gap?

**Triceps long head.**
- Only the overhead triceps extension and the cable overhead extension are tagged to it. Both are rated medium skill and medium setup, which causes the gym-level tolerance gaps.
- The dip, close-grip bench press and pushdown don't put the shoulder in flexion, so tagging them would be false.
- A band setup on the overhead extension is not an honest alternative. A band loads least at the stretch, and the stretched position is the point of long-head work.
- Two things to review, without adding anything: whether the medium setup and skill ratings are right for the dumbbell version.
- **For bodyweight access, a new exercise is required.**

**Upper traps.**
- The shrug and rack pull are tagged. The farmer's carry lists traps as secondary, but it needs dumbbells and wouldn't help bodyweight users anyway.
- No bodyweight movement loads shoulder elevation meaningfully. The scapular pull-up trains depression and lower traps.
- A band setup on the shrug is defensible: the shrug is short-range, and a band is heaviest at the top. It closes the minimal-kit gap only (see Option O1 below).
- **No new exercise is justified.** The bodyweight and nothing-selected gap should be accepted as real.

**Forearm flexors.**
- The target's own definition says gripping loads them "only indirectly". So tagging the farmer's carry or adding a dead hang would contradict the taxonomy.
- A band setup on the wrist curl is a common, honest variant (minimal kit only).
- **No new exercise is justified.** Accept the bodyweight gap.

**Forearm extensors.**
- Same reasoning as the flexors. Band setups on the reverse wrist curl and reverse curl cover the minimal kit.
- Pronation/supination work trains different muscles, so it shouldn't be tagged.
- **No new exercise is justified.**

### Simulated impact on the 583 empty selection cells

These were simulated in memory, with no data changes:

| Option | Empty cells opened | Existing Best Fits changed |
|---|---:|---:|
| O1: add a `[band]` setup to shrug, wrist curl, reverse wrist curl and reverse curl | 26, all minimal kit (upper traps, forearm flexors and extensors, related outcomes, back region) | 0 |
| O2: tag `chin-up-supinated` with `biceps`. Its `primary_targets` already lists "elbow flexors"; this is an existing-targeting fix, outside the four focus targets | 8 (biceps target and the biceps-front-peak outcome, bodyweight and minimal kit) | 12 |

O1 is a content decision, not a model change. Each record's text would need to describe the band variant.

## 4. Candidate exercises

Each candidate must provide something the library can't. Fame was not a criterion.

| Candidate | Distinct because | Simulated effect (assumed: low setup, medium skill, low fatigue) | Verdict |
|---|---|---|---|
| **Bodyweight triceps extension** (bench or bar, `bodyweight + bench`) | The only way to load the triceps with the shoulder flexed and no implement; a bodyweight-access option Decide can target | Opens 10 cells: triceps long head in bodyweight contexts, and low setup in gym and home. Changes 19 Best Fits | **Recommended**, the only focus-target addition that clears the bar |
| **Pike push-up** (`bodyweight`) | No bodyweight vertical-push pattern exists; front delt has no bodyweight option | Opens 11 cells (front delt in bodyweight, nothing-selected, minimal-kit and home contexts). Changes 19 Best Fits | Worth considering, though outside the four focus targets |
| Inverted row | Bodyweight horizontal pull for back thickness | Needs a hip-height bar or a suspension trainer, which no current equipment context includes, so it opens nothing as measured | Not now. Revisit only alongside an equipment-vocabulary decision |
| Dead hang, band pull-apart, scapular pull-up | — | Duplicate existing coverage, or contradict a target definition | Rejected |

**Upstream question.** Whether bodyweight-only users are a supported audience for every physique target is a product-scope decision that should come before any additions. Adding exercises one target at a time, without deciding that, would be piecemeal.

## 5. Tie-break examples

### How often the alphabet decides

- **7,441 of 20,227 answered Best Fits (36.8%) are decided by alphabetical ID.** 8,180 alternatives change when the order is reversed.
- **Tie groups are large:** up to 18 tied candidates, and 1,000+ scenarios with 3 or more.
- **Rate by goal:**

  | Goal | Best Fits decided by ID |
  |---|---:|
  | build-base | 466 / 1,073 |
  | visual-area | 450 / 1,073 |
  | low-fatigue | 493 / 1,073 |
  | limited-equipment | 512 / 1,073 |
  | replace-exercise | 920 / 3,119 |
  | complement goals | 2,300 / 6,408 each |

### It is not neutral

Across the 2,841 tied non-complement scenarios:

| ID prefix | Win rate | Expected if neutral |
|---|---:|---:|
| `cable-` | 23.9% | 8.9% |
| `barbell-` | 6.7% | 1.5% |
| `dumbbell-` | 10.4% | 7.6% |
| `machine-` | 2.3% | 6.3% |

- IDs starting with t, w or z never win a tie: `t-bar-row`, `triceps-kickback`, `walking-lunge`, `zottman-curl`.
- The alphabet therefore works as a hidden equipment preference.
- In 565 scenarios, a needs-review record beats a tied reviewed one. 77 of 126 records are needs-review.

### Harmless cases

Here the tied candidates are true equivalents for the goal:
- Neck region, every goal: `isometric-neck-hold` vs three other neck options.
- Upper pec, build-base: `incline-barbell-press` vs `incline-dumbbell-press`.
- Hamstrings, build-base: `romanian-deadlift` vs `stiff-leg-deadlift`.
- Triceps long head: `cable-overhead-extension-leaning-forward` vs `overhead-triceps-extension`. A cable vs free-weight choice, though the cable always wins.

### Material cases

Here a different member of the tie would be a materially better answer to what was asked:
- **Shoulders region, low-fatigue and limited-equipment:** `cable-band-external-rotation` (rotator-cuff prehab) wins an aesthetic region pick over the lateral raises.
- **Hamstrings, low-fatigue:** `back-extension-45-hip-dominant` beats both leg curls.
- **Forearm extensors and forearm-fullness-outer, all goals:** `cable-reverse-curl` (needs-review, medium setup) beats the reviewed, low-setup `reverse-curl`.
- **Brachialis and arm-side-thickness:** `cable-hammer-curl-rope` beats `hammer-curl`.
- **Chest region, build-base:** `dip-chest-biased` beats the flat barbell bench press.
- **Core, build-base:** `ab-wheel-rollout` beats cable crunch and machine crunch.
- **Limited-equipment, everywhere:** `[bodyweight]` counts as one item, so bodyweight exercises tie with single-machine ones. Then `cable-*` and `ab-*` win: cable chest press over push-up, cable kickback over glute bridge, ab wheel over plank, lat pulldown over chin-up. This is not really a tie-break problem: the key counts an always-available item. A simulation that counts bodyweight as 0 changes 171 limited-equipment Best Fits, all toward what the goal promises.

## 6. Does the tie-break warrant a change?

**Yes, the problem is general, but not by replacing the alphabet with one global rule.** Every global rule tested trades one bias for another.

| Rule (then ID) | Best Fits still decided by ID | Best Fits changed | Effect |
|---|---:|---:|---|
| Alphabetical (current) | 36.8% | — | Cable and barbell bias |
| Reviewed first | 23.3% | 1,749 | Temporary (fades as reviews complete); not a training reason |
| Simplicity (skill + stability + setup) | 19.9% | 3,968 | Breaks build-base intent: push-up over bench press, sumo squat over back squat, machine crunch |
| Lower fatigue | 30.8% | 1,177 | Resolves few ties |
| Specificity (fewest tagged targets) | 27.5% | 2,450 | Arbitrary: stiff-leg deadlift over RDL, front squat over back squat |
| Fewest equipment items | 32.8% | 1,261 | Same cable bias |
| Dataset order | — | 0 | Identical to alphabetical, because the generated data is sorted by ID |

The pattern is consistent. Two goals already define a natural secondary criterion: **low-fatigue** and **limited-equipment** are both about the exercise's cost. Build-base and visual-area have no field that expresses "more central choice", so no attribute rule improves them.

### Smallest general rule

**Change 1 — limited-equipment key.** Count `bodyweight` as 0 items, consistent with Stage 3.5's always-available rule. 171 Best Fits change, all limited-equipment.

**Change 2 — secondary cost key.** Only for **low-fatigue** and **limited-equipment**, add a cost key before the ID: fatigue, then setup time, then skill, then stability.
- 269 low-fatigue and 268 limited-equipment Best Fits change (309 limited-equipment when combined with Change 1). No other goal changes.
- It is explainable in the existing text: "equally suited; this one costs less."
- Example picks: lying leg curl, dumbbell lateral raise, hammer curl, reverse curl, cable pushdown, leg press.

**Keep alphabetical ID as the final fallback**, and as the only fallback for build-base, visual-area, replace and complement goals.
- Their ties need curated preference, not a rule.
- The `exercise_roles` mechanism already does this for aesthetic outcomes. Extending role coverage is a data task for later.
- No muscle-specific rule is proposed.

## 7. Recommended next implementation step

**A small "ranking consistency" change:** Change 1 plus Change 2 above.

- **Engine only:** no data and no new exercises.
- **Tests:** pin the bodyweight-as-zero rule and the cost key with tests, plus the examples in §5.
- **Coverage:** re-run against this report's baseline. Expected changes: limited-equipment 309, low-fatigue 269; no other goal changes.

### Then, separately, for architectural decisions

1. **Product scope.** Is bodyweight-only a supported context for every target?
   - If yes: add the bodyweight triceps extension, and consider the pike push-up.
   - If no: improve the empty-result message so it says which equipment would unlock an answer.
2. **Content review, no new records.**
   - O1: band setups for the shrug and three forearm records.
   - O2: chin-up → `biceps` tag.
   - The setup and skill ratings on the two triceps-long-head exercises.
3. **Replace-exercise strictness.** 36 exercises are never replaceable, the largest structural gap (2,640 scenarios). This needs its own design review.

## Checks

- **validate-data:** PASS (126 records).
- **Vitest:** 263 / 263. **Lint:** clean. **Build:** OK. **Playwright smoke test:** 3 / 3.
- **Behaviour unchanged:** 20,227 answered, identical to Stage 3.5, and identical across two runs.
- **No production code or data modified:** no exercise, package or programming data changed. The temporary harness was removed before the checks ran. Only this report was added.
