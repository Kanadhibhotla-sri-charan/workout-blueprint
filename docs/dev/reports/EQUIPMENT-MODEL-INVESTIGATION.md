# Equipment Model Investigation (Phase 7)

_Investigation only. No schema, engine, exercise, package or tie-breaking change was made. Everything below comes from reading the code and data, and from simulating a proposed model in a temporary test-only layer that mocks a single function._

## 1. Current equipment-model behaviour

`equipment` is a flat list of strings on each exercise, and nine places read it. They don't agree on what the list means:

| Reader | Meaning it assumes |
|---|---|
| `engine/equipment.ts` — `isEquipmentFeasible` (Decide's filter; also used by the alternatives and complements logic) | **Every** item is required (`every`) |
| `utils/filters.ts` — Explore's equipment filter | **Any** item is enough (`includes`) |
| `decisionEngine.ts` — "limited equipment" ranking (`goalKey`) | Fewer items = easier to equip (`equipment.length`) |
| `decisionEngine.ts` — explanation and watch-out text | "Needs only: a, b, c" / "Requires: a, b, c" |
| Detail page, search, Decide's equipment picker | Display and option list only |

Many records use the list to mean "**any one of** these". Decide reads it as "**all** of these", so the same record means different things on Explore and Decide.

A second, separate bug: Decide's picker says **"Selecting nothing means bodyweight-only"**, but selecting nothing sends `[]`. Fourteen records (push-ups, planks, pull-ups and others) list `bodyweight` as an item, so `[]` fails them all. **The advertised bodyweight-only path returns no recommendation in 6,060 of 6,060 scenarios.**

## 2. Affected exercises

63 of 126 records list more than one item. Classifying each from its own name and `resistance_profile`:

- **38 misrepresented:** 35 list pure alternatives; 3 are a choice of load around a shared required item.
- **25 correct:** the items really are needed together.
- **5 omit equipment they genuinely need** (all 5 are among the 38). These must be corrected when the model changes, or the change would *over*-admit them.
- **4 classifications are medium confidence** and need a person to confirm them.

| Exercise | Listed today (all required) | Proposed setups (any one) | Omitted required item → corrected setups | Confidence |
|---|---|---|---|---|
| `barbell-dumbbell-shrug` | barbell, dumbbell, cable | barbell **or** dumbbell **or** cable | — | high |
| `barbell-ez-bar-curl` | barbell, ez-bar | barbell **or** ez-bar | — | high |
| `bulgarian-split-squat-hip-dominant` | dumbbell, barbell, bench | dumbbell + bench **or** barbell + bench | — | high |
| `bulgarian-split-squat-knee-dominant` | dumbbell, barbell | dumbbell **or** barbell | dumbbell + bench **or** barbell + bench | high |
| `cable-band-external-rotation` | cable, band | cable **or** band | — | high |
| `chest-supported-row` | machine, bench | machine **or** bench | machine **or** bench + dumbbell | medium |
| `close-grip-bench-press` | barbell, smith machine | barbell **or** smith machine | barbell + bench + rack **or** smith machine + bench | high |
| `drag-curl` | barbell, ez-bar | barbell **or** ez-bar | — | high |
| `face-pull` | cable, band | cable **or** band | — | high |
| `farmers-carry` | dumbbell, farmer's handles | dumbbell **or** farmer's handles | — | high |
| `goblet-squat` | dumbbell, kettlebell | dumbbell **or** kettlebell | — | high |
| `hip-abduction` | machine, band | machine **or** band | — | high |
| `hip-thrust` | barbell, bench, hip-thrust machine, smith machine | barbell + bench **or** hip-thrust machine **or** smith machine + bench | — | high |
| `isometric-neck-hold` | bodyweight, band, manual resistance | bodyweight **or** band **or** manual resistance | — | high |
| `lateral-neck-flexion` | bodyweight, band, manual resistance | bodyweight **or** band **or** manual resistance | — | high |
| `lying-triceps-extension-skull-crusher` | barbell, ez-bar, dumbbell | barbell **or** ez-bar **or** dumbbell | barbell + bench **or** ez-bar + bench **or** dumbbell + bench | medium |
| `neck-extension` | harness, plate, machine | plate **or** machine (harness + plate collapses to plate) | — | medium |
| `neck-flexion` | plate, band | plate **or** band | — | high |
| `overhead-press` | barbell, dumbbell | barbell **or** dumbbell | — | high |
| `overhead-triceps-extension` | barbell, ez-bar, dumbbell | barbell **or** ez-bar **or** dumbbell | — | high |
| `pallof-press` | band, cable | band **or** cable | — | high |
| `preacher-curl` | barbell, ez-bar, dumbbell, preacher bench | barbell + preacher bench **or** ez-bar + preacher bench **or** dumbbell + preacher bench | — | high |
| `pronation-supination-work` | band, cable, offset-loaded handle | band **or** cable **or** offset-loaded handle | — | high |
| `rear-delt-fly` | dumbbell, machine | dumbbell **or** machine | — | high |
| `reverse-curl` | barbell, ez-bar, dumbbell | barbell **or** ez-bar **or** dumbbell | — | high |
| `reverse-lunge` | barbell, dumbbell, sandbag | barbell **or** dumbbell **or** sandbag | — | high |
| `reverse-wrist-curl` | barbell, dumbbell, cable | barbell **or** dumbbell **or** cable | — | high |
| `romanian-deadlift` | barbell, dumbbell, smith machine | barbell **or** dumbbell **or** smith machine | — | high |
| `russian-twist` | dumbbell, plate, medicine ball | dumbbell **or** plate **or** medicine ball | — | high |
| `standing-calf-raise` | machine, smith machine, dumbbell, block or plate | machine **or** smith machine **or** dumbbell + block or plate | — | high |
| `static-lunge` | barbell, dumbbell, sandbag | barbell **or** dumbbell **or** sandbag | — | high |
| `stiff-leg-deadlift` | barbell, dumbbell | barbell **or** dumbbell | — | high |
| `suitcase-carry` | dumbbell, kettlebell | dumbbell **or** kettlebell | — | high |
| `t-bar-row` | t-bar, landmine | t-bar **or** landmine | t-bar **or** landmine + barbell | medium |
| `tibialis-raise` | wall, band, dedicated device | wall **or** band **or** dedicated device | — | high |
| `triceps-kickback` | dumbbell, cable | dumbbell **or** cable | — | high |
| `walking-lunge` | barbell, dumbbell, sandbag | barbell **or** dumbbell **or** sandbag | — | high |
| `wrist-curl` | barbell, dumbbell, cable | barbell **or** dumbbell **or** cable | — | high |

Genuinely required together (no change, 25): `back-squat`, `cable-hammer-curl-rope`, `chin-up-supinated`, `copenhagen-plank`, `decline-dumbbell-fly`, `dip-chest-biased`, `dip-triceps-biased`, `dumbbell-pullover-chest-biased`, `dumbbell-pullover-lat-biased`, `flat-barbell-bench-press`, `flat-dumbbell-fly`, `flat-dumbbell-press`, `front-squat`, `hex-press`, `incline-barbell-press`, `incline-dumbbell-curl`, `incline-dumbbell-fly`, `incline-dumbbell-press`, `nordic-hamstring-curl`, `pull-up-pronated`, `rack-pull`, `rear-delt-row`, `single-arm-dumbbell-row`, `smith-machine-bench-press`, `smith-machine-incline-press`.

Examples of the problem:

- `overhead-triceps-extension` lists barbell, EZ-bar, dumbbell. Its own text says "barbell or EZ-bar …, dumbbells allow independent arms". Today a dumbbell owner can never get it.
- `barbell-dumbbell-shrug` says "the same across barbell, dumbbell, and cable", yet needs all three.
- The three lunge records list barbell, dumbbell and sandbag, so even a **fully equipped commercial gym** can't get a lunge unless it also has a sandbag.
- `hip-thrust` is (barbell **and** bench) **or** a hip-thrust machine **or** (Smith **and** bench). A flat list can't express that.

Physique targets fed by the 38 misrepresented records: quads 5, triceps 4, biceps 3, obliques 3, glute max 3, back thickness 2, forearm extensors 2, hamstrings 2, neck 2, rear delt 2, triceps long head 1, upper traps 1, forearm flexors 1, lat width 1, gastrocnemius 1, glute med 1, front delt 1, untagged 6.

Also noted, not addressed: equipment names aren't normalized. `incline bench` vs `bench`, `power rack` vs `rack`, and `block or plate` vs `plate` will each need a decision if users are to pick them consistently.

## 3. Proposed minimal model change

**Data (one optional field, nothing else changes):**

```yaml
equipment: [barbell, ez-bar, dumbbell]   # unchanged: union of everything used — display, search and Explore keep working as-is
equipment_setups:                         # new, optional: alternative setups; within a setup, everything is required
  - [barbell]
  - [ez-bar]
  - [dumbbell]
```

- **Records without `equipment_setups`** (88 of 126) mean exactly what Decide assumes today: one setup, all items required. No migration needed.
- **Validator rules:**
  - the union of the setups must equal `equipment`;
  - no empty setup;
  - no duplicate setups;
  - no setup that contains another;
  - the field only appears when there's more than one setup.
- **The 5 omitted items** are added to `equipment` and the setups (e.g. a bench for `close-grip-bench-press`).

**Engine (four small, deterministic changes):**

1. **Feasibility:** feasible if **any** setup is fully available. `bodyweight` always counts as available, which is what the picker already promises.
2. **"Limited equipment" ranking:** use the size of the smallest usable setup instead of `equipment.length`.
3. **Text:** "Requires …" and "Needs only …" show the setup that fits the user's equipment. When equipment isn't restricted, list the options ("one of: barbell, EZ-bar or dumbbell"). The simulation simply showed the first smallest setup, e.g. "Requires: barbell", which is too narrow.
4. **Recommended alongside:** apply tolerance limits to declared complements *before* preferring them over structural ones (see §6).

Why this is minimal: a fully list-of-setups `equipment` field would touch all 126 records and every display path. This adds one optional field on 38 records, and display, search and Explore are untouched.

## 4. Simulation method

A test-only harness mocked `isEquipmentFeasible` (no production file changed) and ran `makeRecommendation` over **36,360 scenarios**:

- every region, physique target, aesthetic outcome and functional goal;
- × 7 goals, with every relevant current exercise where a goal needs one;
- × 6 equipment contexts: any, full commercial gym, home dumbbells + bench, bodyweight (with bars, wall and bench), nothing selected, minimal kit (band + pull-up bar);
- × 4 tolerance limits.

The mocked baseline was **byte-identical** to the real unmocked engine, and repeat runs were byte-identical (deterministic).

| Variant | What it adds | Scenarios answered |
|---|---|---|
| S0 | current model | 15,430 |
| S1 | alternative setups only | 17,963 |
| S2 | S1 + the 5 omitted-equipment corrections | 17,727 |
| S3 | S2 + bodyweight always available | 20,091 |
| **S3k** | S3 + ranking and text read the chosen setup (**the proposal**) | **20,091** |

S1 alone is **not safe**. It would offer `chest-supported-row` to someone with only a bench (196 scenarios). S2's corrections remove that.

## 5. Simulated before / after

| Area | Before | Simulated after | Change |
|---|---:|---:|---:|
| Total Decide results (answered, of 36,360) | 15,430 | 20,091 | **+4,661** |
| Empty results | 20,930 | 16,269 | **−4,661** |
| Triceps long head (of 240) | 40 | 58 | +18 |
| Upper traps (of 480) | 128 | 192 | +64 |
| Forearms — flexors + extensors (of 960) | 284 | 420 | +136 |
| Home / minimal equipment (of 24,240) | 4,956 | 9,557 | **+4,601** |
| — home dumbbells + bench | 3,022 | 4,446 | +1,424 |
| — nothing selected ("bodyweight-only") | **0** | 1,220 | +1,220 |
| — minimal kit (band + bar) | 88 | 1,975 | +1,887 |
| — bodyweight with bars/bench | 1,846 | 1,916 | +70 |
| Full commercial gym | 5,207 | 5,267 | +60 |
| No equipment limit | 5,267 | 5,267 | 0 |

**Empty results caused by equipment representation:** 4,677 of today's 20,930 empty results (22%):

- 2,549 come from alternatives being read as "all required";
- 2,364 come from `bodyweight` not counting as available;
- 236 are removed by the omitted-equipment corrections.

**98.7% of them (4,617) are home or minimal-equipment scenarios.**

**Recommendations being wrongly excluded today:** yes. Even a full commercial gym can't currently be offered 10 exercises: the three lunges, farmer's carry, neck extension, isometric and lateral neck work, pronation-supination work, Russian twist and tibialis raise. For home dumbbell users, 30 exercises become eligible, including overhead press, RDL, shrug, wrist curl, reverse curl, overhead triceps extension and both Bulgarian split squats.

By muscle and context (answered before → after, of total):

| Target | Home dumbbells | Bodyweight | Nothing selected | Minimal kit |
|---|---|---|---|---|
| Triceps long head | 0 → 18 / 40 | 0 → 0 / 40 | 0 → 0 / 40 | 0 → 0 / 40 |
| Upper traps | 0 → 64 / 80 | 0 → 0 / 80 | 0 → 0 / 80 | 0 → 0 / 80 |
| Forearm flexors | 0 → 48 / 56 | 0 → 0 / 56 | 0 → 0 / 56 | 0 → 0 / 56 |
| Forearm extensors | 0 → 88 / 104 | 0 → 0 / 104 | 0 → 0 / 104 | 0 → 0 / 104 |

The model fixes these muscles for dumbbell owners. For bodyweight-only users they stay at zero, because **no bodyweight exercise for them exists in the library**. That's a real content gap, and the first place new exercises would be justified.

Example picks (home dumbbells, "build base"): triceps long head none → overhead triceps extension; upper traps none → shrug; forearm flexors none → wrist curl; forearm extensors none → reverse curl; front delt none → overhead press. Nothing selected: core none → plank; glute max none → glute bridge; mid chest none → push-up.

## 6. Regression findings

| Check | Result |
|---|---|
| Existing answers still answered | 15,414 of 15,430. **16 lost** — see below |
| An exercise offered without a complete setup | **0** of 55,805 recommended exercises checked |
| Genuinely-together equipment split up | **0** |
| An exercise eligible today but not after, in any context | **None** — the change only adds |
| Deterministic | Yes — repeat runs byte-identical |
| Programming / package logic | Unaffected — `programmingEngine.ts` and `packageEngine.ts` never read `equipment` |
| New exercises needed to compensate | None |

**The 16 lost answers** (home dumbbells, current exercise = hip thrust, "different stimulus"/"complement", low-fatigue or low-setup). They come from an existing ordering quirk in `resolveComplements`, not from the model:

- `hip-thrust` declares `romanian-deadlift` as its complement.
- Today the RDL is never feasible for dumbbell users, so the engine falls back to a structural search and suggests the Copenhagen plank.
- Once the RDL is correctly feasible, the declared complement wins. The tolerance limit then removes it *afterwards*, and nothing is left.

Change 4 in §3 fixes this.

**Answers whose content changes:**

- **687 best-fit changes.** 518 are home dumbbells, where better options become eligible (e.g. hamstrings: single-leg RDL → RDL; quads: dumbbell squat → knee-dominant Bulgarian split squat). 103 are full gym (mostly newly reachable lunges, farmer's carry and neck work). 36 are unrestricted, from the "limited equipment" ranking now counting the smallest setup. 30 are minimal kit.
- **1,161 alternative changes, 1,385 complement-only changes and 2,009 text-only changes** (watch-out and explanation text).

Several flips are again decided by the alphabetical tie-break, e.g. neck flexion → neck extension. That tie-break issue is still open from Stage 3.

## 7. Recommendation

**Implement it, as one change:** S3k plus the complement-ordering fix (§3, change 4).

- It's the smallest correct model: one optional field on 38 records, plus four contained engine changes.
- It answers **4,661 more** of 36,360 scenarios, almost entirely for home and minimal-equipment users, and fixes the broken bodyweight-only path.
- Soundness and determinism checks are clean, and no exercise loses eligibility.
- Explore and Decide would finally read equipment the same way.

**Before implementing, a person should confirm:**

1. The 4 medium-confidence classifications (`lying-triceps-extension-skull-crusher`, `chest-supported-row`, `t-bar-row`, `neck-extension`).
2. The 5 omitted-equipment additions.
3. Whether `bodyweight` should always count as available, as the UI already promises.

**Then, separately:** decide the alphabetical tie-break question from Stage 3, and treat bodyweight options for triceps long head, upper traps and forearms as the next justified library additions.
