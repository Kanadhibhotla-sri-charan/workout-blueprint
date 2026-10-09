# Exercise Expansion — Batch 1

_First batch under the batched expansion workflow. Routine additions use a focused coverage check instead of a full simulation stage; items needing an equipment, target, goal or engine decision are escalated, not blocked on._

Base: PR #3 (single-leg hip thrust and fold-ins), 132 exercises. This batch: **135 exercises**. No engine, ranking, UI, target, goal or equipment-vocabulary change.

## Classification of every candidate

**A** = existing-record variation or coaching note · **B** = new record · **C** = needs an equipment-vocabulary change · **D** = needs a target, goal or engine design change.

| Candidate | Class | Outcome |
|---|---|---|
| Upright row (side delt only, band setup) | B | **Added** `upright-row-wide-grip` |
| Reverse crunch | B | **Added** `reverse-crunch` |
| Sissy squat | B | **Added** `sissy-squat` |
| Arnold press | A | Note on `overhead-press` |
| Landmine press | B → A | Note on `overhead-press`. The drafted record opened nothing; its only effect was replacing the overhead press in 48 complement answers, all alphabetical |
| Seal row | A | Note on `chest-supported-row` |
| Pendlay row | A | Note on `barbell-bent-over-row-pronated` |
| Good morning | A | Note on `romanian-deadlift` |
| Spider curl | A | Note on `preacher-curl` |
| Concentration curl | A | Note on `dumbbell-curl` |
| JM press | A | Note on `close-grip-bench-press` |
| Pendulum squat | A | Note on `hack-squat` |
| Single-leg hip thrust | B | Done in PR #3 |
| Barbell glute bridge, lean-away lateral raise, heel-elevated goblet squat, Smith/donkey calf raise, deficit push-up | A | Done in PR #3 |
| Cable pull-through | B → **D, deferred** | See "Deferred" |
| Belt squat | B → **D, deferred** | See "Deferred" |
| Low-to-high cable fly as its own record | **D, deferred** | Would re-target the existing `cable-fly` (currently upper + mid + lower chest) |
| Dead bug | **D, deferred** | Blocked on role expression (follow-up report) |
| Kettlebell swing | **D, deferred** | A power/conditioning movement; the app has no goal for that purpose |
| Wrist roller | **C, rejected** | Needs a new equipment item for no coverage gain |
| Previously turned down, not re-approved | — | Bayesian curl, step-up; cable Y-raise (D: lower-trap target); inverted row (C: suspension/low-bar equipment); dead hang (D: grip goal) |

## Exercises added

All three are `needs-review`. Coaching content (cues, mistakes, limitations, progression) is written to the coaching standard, but no person has reviewed it yet.

No `evidence_notes`: none of the records makes a material empirical claim.

Videos were verified 2026-10-09 by **title/channel metadata via YouTube oEmbed; footage not watched**.

| Record | Target / region | Equipment setups | Video |
|---|---|---|---|
| `upright-row-wide-grip` | `side-delt` / shoulders (traps only as free-text secondary) | cable · ez-bar · barbell · dumbbell · band | PureGym, "How To Do A Barbell Wide Grip Upright Row" |
| `reverse-crunch` | `rectus-abdominis` / core | bodyweight | PureGym, "How To Do A Reverse Crunch" |
| `sissy-squat` | `quads` / quads | bodyweight | MDFit, "How to Do the Sissy Squat (Complete Beginner Tutorial)" |

None is tagged `heavy-compound` or with a functional goal. No new equipment items.

## Existing records modified

`programming_notes` only, nothing else:

| Record | Note(s) added |
|---|---|
| `overhead-press` | Arnold press; landmine press |
| `chest-supported-row` | Seal row |
| `barbell-bent-over-row-pronated` | Pendlay row |
| `romanian-deadlift` | Good morning |
| `preacher-curl` | Spider curl |
| `dumbbell-curl` | Concentration curl |
| `close-grip-bench-press` | JM press |
| `hack-squat` | Pendulum squat |

Record-level diff vs PR #3:
- Added: the 3 records above.
- Changed: these 8 records, in `programming_notes` only.
- Removed: none. Duplicate IDs: none.

## Coverage (focused check)

Unmodified engine, same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. Each new record was also measured alone, and again with its ID sorted last to detect alphabetical takeovers. Run twice, byte-identical (SHA-256 `9d966f03…92157`).

| | PR #3 | Batch 1 |
|---|---:|---:|
| Exercises | 132 | 135 |
| Scenarios | 37,800 | 38,520 (+720, all with a new exercise as current) |
| Answered | 23,821 | 24,397 |

| Record | Opened | Lost | New selection cells | Best Fit changes | Selection-goal Best Fit changes | Alphabetical-only |
|---|---:|---:|---:|---:|---:|---:|
| Upright row | 60 (minimal kit) | 0 | **6** (side delt and `shoulder-width-front`, minimal kit) | 0 | 0 | 0 |
| Reverse crunch | 78 ("replace my crunch" without cable/machine) | 0 | 0 | 48 (complements: side plank 32, Pallof 16) | 0 | 0 |
| Sissy squat | 32 ("replace my reverse Nordic" without equipment) | 0 | 0 | 552 (different stimulus / complement) | 0 | 0 |
| **Batch** | **170** | **0** | **6** | 600 | **0** | **0** |

The variation notes have no Decide effect. Ranking never reads `programming_notes`.

## Uncertain content and findings

- **All three new records are `needs-review`.** Promote after a person reviews the coaching text.
- **Sissy squat's 552 Best Fit changes** are "different stimulus / complement" answers moving from the reverse Nordic curl to the sissy squat.
  - They are not alphabetical.
  - They happen because the structural ranking counts shared `primary_targets` text: the sissy squat lists plain "quads", which matches most quad exercises, while the reverse Nordic lists "quads (emphasis on the rectus femoris)".
  - The new answer is reasonable (both are bodyweight knee-extension exercises), but the deciding factor is a text match.
- **Empty-result messages:** 174 still-empty answers now also list the new exercises under "with equipment, these would fit".

## Deliberately deferred (decisions needed)

| Item | Why | Evidence |
|---|---|---|
| **Cable pull-through** (drafted, removed) | Would become the default glute pick in build-base and low-fatigue answers only because `cable-…` sorts before `glute-bridge`: the dead-bug problem | 132 opened ("replace" answers), but 60 selection-goal Best Fits changed, **all alphabetical** (glute bridge → pull-through), 276 alphabetical overall |
| **Belt squat** (drafted, removed) | Opens nothing; takes existing quad defaults alphabetically | 0 opened; 12 selection-goal Best Fits changed (hack squat → belt squat in build-base; dumbbell squat → belt squat in visual-area), all alphabetical |
| Low-to-high cable fly | Re-targeting the existing `cable-fly` is a targeting decision | — |
| Dead bug | Role expression outside the Appearance path | Follow-up report |
| Kettlebell swing | No power/conditioning goal | — |
| Band setups on shrug / wrist curl / reverse curls (Stage 5 option O1) | Honest variants that would open minimal-kit traps and forearm cells, but never approved | Stage 5 simulation: 26 cells, 0 Best Fit changes |

The pull-through and belt squat share one root cause with the dead bug and the chest-dip result. Ties between equally ranked exercises are broken by ID, so any new record whose ID sorts early can silently become a default. Deciding how build-base, visual-area and low-fatigue should break those ties would unblock all four.

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 135 records |
| Vitest | 298 / 298 (count test 132 → 135) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 135 / 135 LIVE |
| Fresh clone of `de6d027` | validate PASS; `npm test` 298/298; lint 0; build OK; Playwright 3/3 |
