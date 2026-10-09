# Exercise Candidates — Decision Follow-Up

_Analysis only. No exercise data, engine, UI, ranking, target taxonomy or equipment change. The temporary harness was deleted after use and not committed._

Follows `EXERCISE-CANDIDATES-STRONG-AND-FOLD-IN-ANALYSIS.md`. It resolves the open design questions on the single-leg hip thrust, upright row, dead bug and fold-ins.

## Method

- **Baseline:** production data and engine at `bc930d7`:
  - 131 exercises;
  - **37,512 scenarios, 23,477 answered, 14,035 empty**, reproduced exactly.
- **Scenario space and engine:** the same as the previous report:
  - 69 entries × 6 equipment contexts × 4 tolerances × 7 goals;
  - current-exercise goals run per exercise in the entry's own pool;
  - the unmodified `makeRecommendation`, given a modified exercise pool.
- **Alphabet check:** every variant was also run with the new exercise's ID sorted last (`zz-…`):
  - a change that survives was won on merit;
  - a change that disappears was won only by the alphabetical tie-break.
- **Watch-out text** (the "Overlaps with…" note) was compared too, so overlap choices could be measured.
- **Determinism:** the complete analysis ran twice, byte-identical (SHA-256 `d0b0700bca336439764dabda8794f94b40b2ef3b9743833255a4c5ec00911d89`).

---

## 1. Single-leg hip thrust — ADD

### Proposed canonical record

Engine-relevant fields are as measured. Text fields are drafts for review. The video and evidence notes are to be sourced and verified at implementation, to the same oEmbed standard as existing records.

```yaml
- id: single-leg-hip-thrust
  name: Single-Leg Hip Thrust
  summary: A hip thrust on one leg with the upper back on a bench, the bodyweight progression that keeps the glute bridge's shortened-position stimulus challenging once two legs become easy.
  why_this_exists: The glute bridge stops being challenging quickly, and the loaded hip thrust needs a barbell and a padded setup. Working one leg at a time doubles the load per side with nothing but a bench, so home and low-setup lifters can keep progressing direct glute work.
  body_regions:
    - hips
  primary_targets:
    - gluteus maximus
  secondary_targets:
    - hamstrings
    - gluteus medius
  physique_targets:
    - gluteus-maximus
  movement_patterns:
    - hip extension
    - shortened range (hip fully extended)
    - single leg, upper back on a bench
  equipment:
    - bodyweight
    - bench
  exercise_type: compound
  laterality: unilateral
  coverage_categories:
    - shortened-position-emphasis
    - low-setup
    - low-fatigue
    - equipment-limited-substitute
  resistance_profile: Bodyweight on one leg, hardest at the top with the hip fully extended. Range is longer than the floor bridge because the upper back is raised on a bench.
  stability_demand: medium
  skill_demand: low
  setup_time: low
  fatigue_cost: low
  best_used_when:
    - The two-leg glute bridge has become easy and no barbell or hip-thrust setup is available.
    - A low-fatigue glute finisher is wanted that also exposes left-right differences.
  less_suitable_when:
    - A heavy, progressively loaded glute stimulus is the goal and a barbell hip thrust is available.
  mirror_effect: Tends to show up, over time and alongside other glute work, as fuller glutes from the side, the same shortened-position stimulus as the hip thrust at bodyweight loads.
  advantages: []
  limitations:
    - Loading beyond bodyweight is awkward on one leg; once bodyweight reps are easy, a loaded bilateral hip thrust is the next step.
    - Balance and pelvic control limit the set before the glute does for some lifters, especially early on.
  technique_cues:
    - Sit with the lower edge of your shoulder blades on the bench, one foot flat under the knee and the other leg lifted.
    - Keep the ribs down and the chin tucked, so the hips move rather than the lower back.
    - Drive through the heel of the working leg until hip, knee and shoulder line up, and hold for a second.
    - Keep the pelvis level from side to side throughout the rep.
  common_mistakes:
    - "Arching the lower back at the top: the spine extends instead of the hip, and the glute does less."
    - "Letting the free-leg side of the pelvis drop: the rep turns into a twist and the working glute unloads."
    - "Working foot too far forward: the hamstrings take over."
  programming_notes:
    - "Progress from the two-leg glute bridge: add a pause, then this, then a load on the hips or a barbell hip thrust when available."
  alternatives: []
  complements:
    - Glute work in the lengthened, hip-bent position, such as Romanian deadlifts or single-leg RDLs.
  overlaps_with:
    - glute-bridge
    - hip-thrust
  evidence_notes: []
  review_status: needs-review
  video_link: null        # to be selected and verified at implementation
  video_status: needs-review
```

### Classification
| Question | Answer |
|---|---|
| Equipment | **bodyweight + bench**, a single setup. A sofa or step works at home, represented as `bench`. It is not available in nothing-selected or minimal-kit contexts, which have no bench. That is honest, and it's why those contexts stay empty |
| Target | `gluteus-maximus` only, matching the target definition ("hip-extension movements, most directly in a shortened position"). No glute-medius tag: lateral pelvic control is secondary, not the trained motion |
| Region | `hips`, the target's parent region. No cross-region tag |
| Overlap | `overlaps_with: [glute-bridge, hip-thrust]`. Same hip extension in the shortened position; the schema defines overlap as "covers substantially similar ground" |

**Overlap measured:**
- **No effect on ranking.** With no overlaps, every count is identical: 56 opened, 8 Best Fits, 517 alternatives, 397 complements. Overlap only adds the watch-out note "avoid stacking both in one routine" to answers where it is the Best Fit (8).
- **Reciprocal entries:**
  - The glute bridge already carries the note (it overlaps the hip thrust), so adding the single-leg hip thrust to its list changes nothing.
  - Adding it to the hip thrust adds that note to 32 more answers. Optional; validation doesn't require reciprocity.

### Measured effect
| Measure | Result |
|---|---:|
| Opened | **56** |
| Lost (existing answers disappearing) | **0** |
| Selection cells opened | 0 |
| Best Fit changes | **8** (0 alphabetical: identical with the ID sorted last) |
| Alternative changes | 517 (509 now show the single-leg hip thrust) |
| Complement changes | 397 (389 now include it) |
| New scenarios (as current) | 288, all answered |

**The 56 opened** are all "replace my glute bridge", which is empty today wherever the hip thrust can't be used:

| Context | Opened | Why it was empty |
|---|---:|---|
| Bodyweight | 16 (4 entries × 4 tolerances) | Hip thrust needs a barbell or machine |
| Home dumbbells | 16 | Same |
| Any / commercial gym | 12 + 12 (fatigue, skill, setup limits) | Hip thrust is medium fatigue, medium skill, high setup |

The 4 entries are the hips region, the glute-max target, and the glute-roundness and glute-side-projection outcomes.

**The 8 Best Fit changes** are all "replace my glute bridge" with full equipment and no limit, across the same 4 entries in the any and gym contexts. The pick moves **hip thrust → single-leg hip thrust**.

- **Mechanism:** replacement ranks the substitute by shared primary targets (a tie), then by shared coverage categories with the exercise being replaced.
  - The single-leg hip thrust shares all 4 of the bridge's categories.
  - The hip thrust shares 1 (`heavy-compound` isn't one of the bridge's).
  - The alphabet is not involved.
- **Legitimate?** Yes. For someone replacing a bodyweight floor bridge, the bodyweight bench progression is the closer substitute. Every selection answer where the hip thrust is the Best Fit is unchanged.
- The result depends on the four coverage categories being honest for this exercise, and they are: shortened-position emphasis, low setup, low fatigue, and an equipment-limited substitute for the hip thrust.

**Where it becomes visible beyond opened answers:**
- It becomes the alternative shown next to existing glute picks in 121 selection answers (build-base 21, visual-area 52, low-fatigue 24, limited-equipment 24).
- It also appears in complement lists.
- These are additions alongside the existing Best Fit, which is unchanged in every selection answer.

**Recommendation: ADD**, with the record above and `overlaps_with: [glute-bridge, hip-thrust]`.

---

## 2. Upright row — ADD as side delt only, with a band option (not yet)

The request listed A (as analysed) and D (side delt + upper traps). These are the same record, so the comparison is run as a grid: tagging × band option.

All four variants use:
- pattern: shoulder abduction, then scapular elevation;
- type: compound;
- equipment: cable / EZ-bar / barbell / dumbbell (+ band where stated);
- demand ratings: stability low, **skill medium**, setup low, fatigue low.

| Variant | Opened | Selection cells | Best Fit changes | Alternatives / complements changed | Contexts unlocked | Cross-region leakage |
|---|---:|---:|---:|---:|---|---:|
| **A/D** side delt + upper traps, no band | 0 | 0 | 50 | 225 / 423 | none | 272 (back region, lat width, back thickness) |
| **B** side delt + upper traps, band | 206 | 13 | 70 | 257 / 888 | minimal kit | 524, incl. 8 back-region **Best Fits** |
| **C** side delt only, no band | 0 | 0 | 0 | 60 / 16 | none | 0 |
| **C + band** side delt only, band | **60** | **6** | **0** | 72 / 331 | minimal kit | **0** |

- **Leakage:**
  - "Cross-region leakage" counts answers where the upright row is shown (as Best Fit, alternative or complement) under a **back** entry: back region, lat width, back thickness and their outcomes.
  - Appearances under other shoulder entries are counted separately, because the shoulders are the exercise's own region. There, as an alternative or complement to a shoulder press or rear-delt exercise, it is appropriate. Those counts:
    - A/D: 28;
    - B: 226;
    - C: 28;
    - C + band: 226.
    - Never as a selection-goal Best Fit.
- **Alphabet check:** none of the upright row's changes are alphabetical. Every variant is identical with its ID sorted last.

**Are B's 13 new cells meaningful?**

| Cells | Meaningful? |
|---|---|
| Side delt (3), `shoulder-width-front` (3) | **Yes.** A band upright row is an honest home exercise for side delts |
| Upper traps (3), `upper-back-fullness` (3) | Defensible, since the traps definition includes "shoulder-elevation movements". But the same cells are closed more directly by a band setup on the **shrug** (a separate, already-identified option), which is the target's primary movement |
| Back region, minimal kit, low fatigue (1) | **No.** It exists only because the traps tag forces the `back` region. "Train my back" with a band and pull-up bar would answer with an upright row |

- B also makes the upright row the **Best Fit for the back region** in 8 minimal-kit selection answers.
- Four of those replace the chin-up (low-fatigue and limited-equipment): the upright row is "cheaper", but it isn't a back exercise.
- The traps tag causes all of B's 524 back-region appearances and all of its Best Fit changes. Without it (C + band), the same band option opens the 6 side-delt cells and changes **no** existing Best Fit.
- The side-delt low-skill cells stay empty in every variant, because the record is medium skill.

**Recommendation: ADD as side delt only, with an honest band setup (C + band). Do not tag upper traps.**
- Upper-traps coverage for minimal kit, if wanted, should come from a band setup on the existing shrug. That would be a separate decision.
- Not added in this task, as instructed.

---

## 3. Dead bug — DO NOT ADD (current engine cannot express its role)

All variants use:
- equipment: bodyweight;
- type: isolation;
- pattern: anti-extension isometric (as the plank);
- demand ratings: all low (the plank is medium stability);
- coverage: low-setup, low-fatigue, equipment-limited substitute.

| | **A** abs + core anti-extension | **B** core anti-extension only | **C** core region only (no target, no goal) |
|---|---:|---:|---:|
| Opened (all "replace my plank") | 96 | 48 | 24 |
| Selection cells opened | 0 | 0 | 0 |
| Best Fit changes to dead bug | 844 | 420 | 324 |
| — merit | 164 | 84 | 36 |
| — alphabetical | **680** | **336** | **288** |
| Build-base changes | 72 (all alphabetical) | 40 (all alphabetical) | 16 (all alphabetical) |
| Visual-area changes | 72 (all alphabetical) | 40 (all alphabetical) | 16 (all alphabetical) |
| Low-fatigue changes | 96 (68 merit, 28 alphabetical) | 48 (36 merit, 12 alphabetical) | 24 (12 merit, 12 alphabetical) |
| Limited-equipment changes | 96 (all merit) | 48 (all merit) | 24 (all merit) |
| Different-stimulus / complement changes | 254 / 254 (all alphabetical) | 122 / 122 (all alphabetical) | 122 / 122 (all alphabetical) |
| Plank replaced as Best Fit | 732 (160 merit) | 372 (80 merit) | 276 (32 merit) |

"C" was read as the minimum role: in the core region and selectable as a current exercise, with no physique target and no functional goal. B is the functional goal alone.

**Default build-base / visual-area pick (24 selection cells per entry):**

| Entry | Baseline | A | B | C |
|---|---|---|---|---|
| Core region | plank 6, hanging knee raise 6, ab wheel 4, cable crunch 4, Pallof 4 | **dead bug 16**, ab wheel 4, cable crunch 4 | **dead bug 16** | **dead bug 16** |
| Abs target / `ab-front-definition` | plank 10, hanging knee raise 6, ab wheel 4, cable crunch 4 | **dead bug 16** | unchanged | unchanged |
| Core anti-extension goal | plank 24 | **dead bug 24** | **dead bug 24** | unchanged |

With the ID sorted last, every one of these returns exactly to the baseline. **All build-base and visual-area takeovers are alphabetical.**

**Merit-based wins:** only low-fatigue and limited-equipment, where the existing cost tie-break correctly prefers the lower stability demand (low vs the plank's medium). These are legitimate.

**Can the dead bug be added without becoming the default build-base / visual-area abs exercise?** **No, not in any role.**

- In every pool the dead bug joins, it ties with the plank and hanging knee raise on everything build-base and visual-area rank by:
  - target tier, aesthetic role, aesthetic suitability, then the goal key;
  - the plank, dead bug and hanging knee raise are all "other": not heavy or stable compounds.
- The tie then falls to the alphabet, and `dead-bug` sorts first.
- Narrowing the role only shrinks where it happens:
  - B keeps the abs target safe but takes the anti-extension goal;
  - C keeps both safe but still takes the core region.

**The product / design problem:**
- The engine has no data field that says "this exercise is a beginner/stability drill, not a base builder" for non-compound exercises. Build-base distinguishes only heavy compound / stable compound / other.
- The one existing role mechanism, an aesthetic outcome's `exercise_roles`, applies only to the Appearance path, and `ab-front-definition` defines none. It can't protect the region, Direct-target or Function paths.
- Changing demand ratings or the ID to lose ties would be gaming the data.
- So any early-sorting exercise added to the core region silently becomes its default, the same documented limitation as the chest-dip result.

**Recommendation: DO NOT ADD now.** Revisit only after a decision on how build-base and visual-area should express exercise roles outside the Appearance path. That is a ranking/role design question, deliberately not answered here.

---

## 4. Wrist roller — REJECT

Unchanged from the previous report. It needs a new equipment item, opens no selection cell and changes no Best Fit. No Grip Strength goal was introduced in this task.

---

## 5. Fold-ins — reconfirmed

| Change | Opened | Lost | Cells | Best Fit | Alt | Comp | Watch-out | Conclusion |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Barbell option on glute bridge | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Display / equipment variation only.** Not even Decide's watch-out text changes (bodyweight always satisfies it). Visible only in the record's equipment list on Explore and exercise detail |
| Lean-away note, cable lateral raise | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Coaching note only** |
| Heel-elevated note, goblet squat | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Coaching note only** |
| Smith / donkey calf raise | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Already covered.** `standing-calf-raise` setups are `[machine]`, `[smith machine]`, `[dumbbell, block or plate]`. No new equipment variation needed; donkey is a note at most |
| Deficit note, push-up | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Coaching note only** |

---

## Final recommendations

| Candidate | Recommendation | Basis |
|---|---|---|
| **Single-leg hip thrust** | **ADD** | 56 genuine opened answers ("replace my glute bridge" at home and under limits). 0 lost. 8 Best Fit changes, all legitimate structural matches, none alphabetical |
| **Upright row** | **ADD later, as side delt only with a band setup** | Opens 6 genuine minimal-kit side-delt cells, changes no existing Best Fit, no back-region leakage. Tagging upper traps causes all the leakage (back-region Best Fits over the chin-up) |
| **Dead bug** | **DO NOT ADD now** | In every role it becomes the default build-base/visual-area pick wherever it joins the plank, purely alphabetically. Blocked on a role-expression design decision |
| **Wrist roller** | **REJECT** | No coverage gain; needs a new equipment item |
| Barbell glute bridge | **FOLD-IN** (equipment list only, no retagging) | Zero Decide effect |
| Lean-away cable lateral raise | **FOLD-IN** (coaching note) | Zero Decide effect |
| Heel-elevated goblet squat | **FOLD-IN** (coaching note) | Zero Decide effect |
| Smith / donkey calf raise | **NO CHANGE NEEDED** (Smith already present; optional donkey note) | Already covered |
| Deficit push-up | **FOLD-IN** (coaching note) | Zero Decide effect |

## Checks

| Check | Result |
|---|---|
| Baseline reproduced | 131 / 37,512 / 23,477 / 14,035 |
| Two complete runs | Byte-identical (`d0b0700b…911d89`) |
| Exercise data, engine, UI, ranking, taxonomy, equipment | Unchanged |
| Temporary harness | Deleted, not committed |
