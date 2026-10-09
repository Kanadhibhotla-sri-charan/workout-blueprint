# Exercise Expansion — Batch 4

_Batched workflow, pushed directly to `main`. Base: `main` at `3ba454d`, 137 exercises. This batch: **138 exercises**._

No engine, ranking, target, goal or equipment-vocabulary change. Existing equipment items only.

## Priority areas

### A. Hamstrings with bodyweight or minimal equipment

| Option | Measured | Decision |
|---|---|---|
| Nordic curl | Needs `partner or anchor`. No existing item honestly stands in for a foot anchor: a bench alone won't hold the feet down | **Unchanged.** Bodyweight and nothing-selected hamstrings stay empty, which is legitimate under Policy B |
| Romanian deadlift + `[band]` | 54 opened, 3 cells (minimal kit). But it becomes the minimal-kit glute "build base" pick over the glute bridge, because the record's `heavy-compound` tag would apply to a band version that can't be loaded heavily | **Not used.** Questionable default |
| **Single-leg RDL + `[band]`** | 108 opened, **6 cells** (hamstrings region / target / `hamstring-back-fullness`, minimal kit), **0 default changes** | **Added** |

### B. Back thickness with minimal equipment or bodyweight

| Option | Measured | Decision |
|---|---|---|
| Inverted row | Its home value needs a low bar, rings or a suspension trainer. `rack` + `barbell` or `smith machine` would represent it honestly only in a gym, where it adds nothing | **Deferred** (equipment vocabulary) |
| **Seated band row** (new; band looped around the feet, no anchor) | Tagged back thickness only: 179 opened, **8 cells**, 8 merit-based default changes. Also tagged lat width (like the seated cable row): 64 lat-width defaults taken by ID | **Added, back thickness only.** The library's own pull-up text says "rows build back thickness, not width" |

### C. Biceps with bands

| Option | Measured | Decision |
|---|---|---|
| Generic `band-curl` record | Fills 8 biceps cells, but **108 default picks change by ID alone**, including gym biceps "build base" (barbell / EZ-bar curl → band curl) | **Not added**, as instructed |
| Band setup on an existing curl | The only generically named curls are the drag curl (barbell / EZ-bar path) and the preacher curl (needs a preacher bench); both describe a band poorly. The others are named for their equipment | **Deferred.** Biceps with band + pull-up bar stays empty. The hammer curl (band, Batch 3) already covers brachialis there |

### D. Remaining candidates

| Candidate | Decision |
|---|---|
| Low-to-high cable fly | **Variation note on `cable-fly`.** The record keeps its upper / mid / lower chest tags; no targeting change |
| Kettlebell swing | Deferred. Its purpose is power / conditioning, which no goal represents. As a glute record it would misstate its stimulus |
| Cable Y-raise | Deferred. Needs a lower-traps / posture target |
| Dead hang | Deferred. Needs a grip goal. Adding it untagged would place it in forearms-region pools, which the Policy B decision rules out ("grip, dead hang, carries" don't count as forearm coverage) |
| Wrist roller | Deferred. Needs a new equipment item |

## Changes

| Record | Change |
|---|---|
| `seated-band-row` (**new**) | Back thickness; `band`; `needs-review`. Video: Live Lean TV Daily Exercises, "How To: Resistance Band Seated Row", verified 2026-10-09 by **title/channel metadata via oEmbed; footage not watched**. No evidence notes |
| `single-leg-romanian-deadlift` | `[band]` setup; `resistance_profile` and a setup note extended |
| `cable-fly` | Low-to-high variation note (`programming_notes` only) |

## Coverage

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. The combined run was repeated, byte-identical (SHA-256 `9527f5f9…158478`).

| | `main` | Batch 4 |
|---|---:|---:|
| Exercises | 137 | 138 |
| Scenarios | 39,096 | 39,312 (+216, all with the band row as current) |
| Answered | 26,119 | **26,542** |
| Empty | 12,977 | 12,770 |

- **287 answers opened, 0 lost.**
- **14 new selection cells**, all in minimal kit (band + pull-up bar):
  - back thickness and `back-side-thickness` (8);
  - hamstrings region, target and `hamstring-back-fullness` (6).
- These are genuine first options. Before this batch, minimal kit had no row and no hamstring exercise.

## Recommendation changes

**Selection goals: 8 changes, all merit-based, 0 alphabetical.**
- Back thickness / `back-side-thickness`, home, limited equipment: chest-supported row → seated band row.
- The limited-equipment key counts items: the band row needs 1 (band), the chest-supported row's free-weight version needs 2 (bench + dumbbell).

**Current-exercise answers, reviewed:**

| Change | Count | Review |
|---|---:|---|
| "Replace my chest-supported row" with full or unrestricted equipment: band row listed first, seated cable row as alternative | 24 | **ID-decided.** Both share one coverage tag with the chest-supported row, and `seated-band-row` sorts first. Acceptable: the band row is a valid same-pattern substitute and the closer gym substitute is still shown. Not corrected: the only data fix would be retagging the unrelated seated cable row to steer the order |
| Complement / different stimulus for the straight-arm pulldown, minimal kit: shrug → band row | 12 | ID-decided between equally ranked complements. A row is a sensible complement to a straight-arm pulldown |
| Glute exercises' complements now include the band single-leg RDL; hip-abduction / glute-bridge answers in minimal kit | 112 | Merit (structural ranking) |

## Deferred and blockers (cumulative)

| Item | Blocker |
|---|---|
| Biceps with band + pull-up bar | No honest existing record; a new one takes gym defaults by ID |
| Hamstrings with bodyweight only | The Nordic curl's anchor requirement (sliders / towel not introduced) |
| Inverted row | Suspension / low-bar equipment item |
| Belt squat | Generic `machine` item (Batch 3) |
| Pull-through band setup, dead bug | Tie-break / exercise-role design |
| Kettlebell swing, Y-raise, dead hang, wrist roller | Goal / target / equipment decisions |

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 138 records |
| Vitest | 298 / 298 (count test 137 → 138; no other test changes needed) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 138 / 138 LIVE |
| Fresh clone of the batch commit (before pushing) | validate PASS; `npm test` 298/298; lint 0; build OK; Playwright 3/3 |

## Release

| | Result |
|---|---|
| Commit pushed to `main` | `b85d1dd` |
| GitHub Pages deploy | Success |
| CI on `main` | Success |
| Production smoke test | 6 / 6 |

**Production smoke test details:**
- Explore shows 138 exercises.
- Explore → detail → Decide → Build works; Decide URL reload and back/forward work.
- Detail pages load for the seated band row, single-leg RDL and cable fly.

**Decide on the live site:**

| Request | Answer |
|---|---|
| Back thickness, band + pull-up bar | Seated band row |
| Hamstrings, band + pull-up bar | Single-leg Romanian deadlift |
| Back thickness, limited equipment, dumbbell + bench + band | Seated band row |
| Glute max, band + pull-up bar | Still the glute bridge |
| Lat width, low fatigue, band + pull-up bar | Still the straight-arm pulldown |
| Biceps, build base, full equipment | Still the barbell / EZ-bar curl |
