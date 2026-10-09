# Exercise Expansion — Batch 3

_Batched workflow, pushed directly to `main`. Base: `main` at `cd4bd26`, 136 exercises. This batch: **137 exercises**._

No engine, ranking, target, goal or equipment-vocabulary change. Existing equipment items only.

## Reassessed candidates

| Candidate | Measured | Decision |
|---|---|---|
| **Cable pull-through** | With a band setup: 132 opened, but **60 default glute picks taken alphabetically** (glute bridge → pull-through in home and minimal-kit build-base / low-fatigue). Cable only: 56 opened ("replace" answers under limits in any/gym), **0 selection-goal Best Fit changes** | **Added, cable only.** That is the non-default alternative the current model supports. A band is mentioned in a coaching note only, not modelled as a setup, because a band setup would make it the default only by ID |
| **Belt squat** | 0 opened; 12 gym quad build-base / visual-area picks taken alphabetically (hack squat → belt squat) | **Deferred.** The equipment item `machine` is generic, so a belt-squat machine, which most gyms lack, would count as present in every gym. It needs its own equipment item, which is a vocabulary change |
| **Bayesian cable curl** | 0 opened; 18 biceps visual-area picks taken alphabetically (incline curl / preacher curl → Bayesian) | **Variation note on `cable-curl`.** A minor distinction (cable curl, arm behind the body) with no coverage gain |

## New exercise

| Record | Target / region | Equipment | Status |
|---|---|---|---|
| `cable-pull-through` | `gluteus-maximus` / hips | cable + rope attachment | `needs-review` |

The video is Chris and Eric Martinez, "How to Do Cable Pull Throughs". It was verified 2026-10-09 by **title/channel metadata via oEmbed; footage not watched**. No evidence notes (no empirical claim).

## Variations on existing records

Each equipment setup comes with an extended `resistance_profile` and one `programming_notes` item describing that version. Targets, demand ratings and coverage tags are unchanged.

| Record | Setup added | Accessibility gain |
|---|---|---|
| `overhead-triceps-extension` | `[band]` | Triceps long head, minimal kit |
| `hammer-curl` | `[band]` | Brachialis / `arm-side-thickness`, minimal kit |
| `rear-delt-fly` | `[band]` (pull-apart) | Rear delt under a low-skill limit, minimal kit |
| `straight-arm-pulldown` | `[band]` (anchored over a pull-up bar) | Lat width / V-taper under fatigue and skill limits, minimal kit |
| `seated-calf-raise` | `[dumbbell, bench]` (dumbbells on the knees) | Soleus / `calf-lower-fullness` at home |
| `bulgarian-split-squat-knee-dominant` | `[bodyweight, bench]` | Bodyweight version (no new cells; better bodyweight defaults, see below) |
| `bulgarian-split-squat-hip-dominant` | `[bodyweight, bench]` | Same |
| `cable-curl` | — | Bayesian variation note only |

## Coverage

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. Each change was measured on its own, then the batch together. Every changed or new record was re-run with an ID that sorts last, to separate merit from alphabetical effects. The combined run was repeated, byte-identical (SHA-256 `af3052de…64ead3`).

| | `main` | Batch 3 |
|---|---:|---:|
| Exercises | 136 | 137 |
| Scenarios | 38,808 | 39,096 (+288, all with the pull-through as current) |
| Answered | 25,397 | **26,119** |
| Empty | 13,411 | 12,977 |

- **506 answers opened, 0 lost.**
- **21 new selection cells** (the previously empty cells this batch now fills):
  - brachialis (4) and triceps long head (2), minimal kit;
  - soleus (4) and `calf-lower-fullness` (4), at home;
  - lat width (2) and V-taper (2), minimal kit, under fatigue / skill limits;
  - rear delt, `shoulder-3d-shape` and the shoulders region (1 each), minimal kit, under a low-skill limit.

## Recommendation changes

76 selection-goal Best Fit changes. **61 are merit-based**, from the existing goal keys and cost tie-break:
- In minimal kit, the band rear-delt fly, straight-arm pulldown and hammer curl become the low-fatigue / limited-equipment picks: they are lower skill or lower fatigue than the face pull, chin-up or close-grip push-up.
- Band setups made the straight-arm pulldown feasible at home, and it beats the dumbbell pullover and one-arm row there on the same cost rule.
- In minimal kit, the band overhead extension becomes the arms / triceps visual-area pick, because it carries the lengthened-position tag.
- The seated calf raise takes the home calves build-base pick: its `stable-compound` tag ranks it ahead.

**15 are alphabetical.** Each was reviewed for whether it suits the user's goal and equipment:

| Cells | Change | Defensible? |
|---|---|---|
| Calves region, home, low-fatigue (4) | tibialis raise → seated calf raise | **Yes, an improvement.** The tibialis raise trains the shin, not the calves |
| Calves region, home, visual-area (4) | single-leg calf raise → seated calf raise | Yes. Both are calf exercises, so either is a reasonable answer |
| Quads (region, target, `quad-front-mass`), bodyweight, build-base (3) | reverse Nordic curl → Bulgarian split squat (knee-dominant) | **Yes, an improvement.** A loaded compound is a more central "build the base" answer than an isolation drill |
| Glute max (target, two outcomes), bodyweight, build-base (3) | glute bridge → Bulgarian split squat (hip-dominant) | Yes. A harder compound for building the base |
| Hips region, bodyweight, build-base (1) | Copenhagen plank → Bulgarian split squat (hip-dominant) | **Yes, an improvement.** The Copenhagen plank is an adductor exercise |

No ID was chosen to win or lose a tie. Records use their natural, conventional IDs.

Current-exercise answers change too (different stimulus / complement / replace). The largest shifts:
- shrug → straight-arm pulldown as a back-exercise complement in minimal kit (136);
- hip exercises' complements now including the pull-through (152);
- the Bulgarian split squats replacing the static lunge, sissy squat and Copenhagen plank in some complement answers.

## Dropped during the batch

- **Reverse lunge bodyweight setup:** drafted, then reverted. It opened **nothing**, because the static lunge already covers bodyweight lunges. It would have swapped the static lunge for the reverse lunge in 288 answers purely by ID (both lunges then need no equipment), including gym "limited equipment" picks. Equivalent exercises, no access gain: not worth the churn.

## Deferred and blockers

| Candidate | Blocker |
|---|---|
| Belt squat | Equipment vocabulary: the generic `machine` item can't distinguish a rare belt-squat machine |
| Pull-through band setup | Tie-break: a band setup makes it the home / minimal-kit glute default by ID |
| Dead bug | Exercise-role expression (kept deferred, as instructed) |
| Biceps in minimal kit | No generically named curl record takes a band honestly. A new band-curl record would take gym biceps defaults by ID (`band-…` sorts before `barbell-…`) |
| Back thickness in minimal kit / bodyweight | No generically named row record; the inverted row needs a suspension / low-bar equipment item |
| Hamstrings in bodyweight / minimal kit | The Nordic curl needs a partner or anchor; leg curls are machine records |
| Low-to-high cable fly, kettlebell swing, wrist roller, Y-raise, dead hang | Targeting / goal / equipment decisions (unchanged from earlier batches) |

The tie-break / role question remains the main blocker for the pull-through band setup, the belt squat (together with its equipment item) and the dead bug.

## Tests updated for intended behaviour

- `emptyResult.test.ts`: triceps long head with a band is no longer empty, so both examples now use "pull-up bar only", which is still empty. The overhead extension's listed equipment gains "band".
- `equipment.test.ts`: the overhead extension's equipment text is now "barbell, ez-bar, dumbbell, or band".
- `data/index.test.ts`: count 136 → 137.

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 137 records |
| Vitest | 298 / 298 |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 137 / 137 LIVE |
| Fresh clone of the batch commit (before pushing) | validate PASS; `npm test` 298/298; lint 0; build OK; Playwright 3/3 |

## Release

| | Result |
|---|---|
| Commit pushed to `main` | `4435763` |
| GitHub Pages deploy | Success |
| CI on `main` | Success |
| Production smoke test | Pass |

**Production smoke test details:**
- Explore shows 137 exercises.
- Explore → detail → Decide → Build works; Decide URL reload and back/forward work.
- Detail pages load for the pull-through and every edited record.

**Decide on the live site:**

| Request | Answer |
|---|---|
| Triceps long head, band + pull-up bar | Overhead extension |
| Brachialis, band + pull-up bar | Hammer curl |
| Rear delt, band + pull-up bar, low skill | Rear-delt fly |
| Lat width, band + pull-up bar, low fatigue | Straight-arm pulldown |
| Soleus, dumbbells + bench | Seated calf raise |
| Quads, bench only | Bulgarian split squat |
| "Replace my glute bridge", low fatigue | Pull-through |
| Glute max with a band | Still the glute bridge (the pull-through is not a band default) |

The first smoke run flagged one scenario only because its expected text read "Rear Delt Fly" instead of the record's actual name, "Rear-Delt Fly". Re-run with the correct name, it passed.
