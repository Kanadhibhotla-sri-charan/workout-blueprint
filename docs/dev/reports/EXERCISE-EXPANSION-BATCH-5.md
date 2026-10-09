# Exercise Expansion — Batch 5

_Batched workflow, pushed directly to `main`. Base: `main` at `1984481`, 138 exercises. This batch: **139 exercises**._

No engine, ranking, target, goal or equipment-vocabulary change.

## Priority questions

### Biceps with bands: blocked, no change

Every biceps record was checked for an honest band setup:

| Record | Why it can't take a band honestly |
|---|---|
| `barbell-ez-bar-curl`, `dumbbell-curl`, `incline-dumbbell-curl` | Named and described by their implement |
| `drag-curl` | Defined by a bar dragged up the torso; a band has no bar path |
| `preacher-curl` | Needs a preacher bench |
| `zottman-curl` | Defined by rotating dumbbells from supinated to pronated |
| `cable-curl`, `cable-drag-curl`, `preacher-curl-machine` | Cable / machine records |

A new generic `band-curl` record takes **108** biceps defaults by ID alone, including gym "build base" (Batch 4 measurement). Not added.

**Blocker:** the tie-break between equally ranked exercises. Biceps with band + pull-up bar stays empty. The band hammer curl (Batch 3) covers brachialis there.

### Bodyweight hamstrings: honest candidate found, deferred as a record

- Existing options can't reach bodyweight-only users:
  - the Nordic curl needs `partner or anchor`;
  - the 45° back extension needs its bench;
  - leg curls are machines;
  - the Romanian / stiff-leg deadlifts need load;
  - the single-leg RDL needs a dumbbell or band.
- No anchor, slider or towel capability was invented.
- **Hamstring bridge** (heels on a bench, knees nearly straight, drive the hips up) is honest in the current model: bodyweight + bench, and the "bodyweight" context includes a bench. Measured as a new record:
  - **gains:** 408 opened, **18 new selection cells** (bodyweight hamstrings region / target / outcome: 12; home under limits: 6), 0 lost;
  - **cost: 9 "build base" picks taken by ID alone.** In a gym under a skill limit (lying leg curl → hamstring bridge), and at home (single-leg RDL → hamstring bridge). A bodyweight bridge is a weaker base than either exercise it would replace.
- **Decision:** deferred as a record (questionable default, no non-default mechanism in the model). Added instead as a **hamstring-bias variation note on `glute-bridge`**, which changes nothing in Decide.
- **Blocker:** tie-break. Bodyweight-only hamstrings stays empty, the documented empty-result behaviour. One approval to accept those 9 cells would let the record ship as measured.

### Held as instructed

- **Belt squat:** waits on an equipment item that distinguishes a belt-squat machine from the generic `machine`.
- **Dead bug and the band version of the cable pull-through:** deferred pending a decision on exercise roles / ranking.

## Added

| Record | Change |
|---|---|
| `plank-shoulder-tap` (**new**) | Core; functional goal `core-anti-rotation` only; bodyweight; `needs-review` |
| `glute-bridge` | Hamstring-bias variation note (`programming_notes` only) |

**`plank-shoulder-tap`:**
- **What it adds:** the only anti-rotation exercise until now was the Pallof press, which needs a band or cable; this one needs nothing.
- **Tagging:** functional goal only, no physique target. Tagging `obliques` as well would take 32 bodyweight side-plank defaults by ID.
- **Video:** Nottingham Physio, "How to Do Plank Shoulder Taps (Core Stability + Control)". Verified 2026-10-09 by **title/channel metadata via oEmbed; footage not watched**.
- **Evidence notes:** none (no empirical claim).

## Coverage

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. The combined run was repeated, byte-identical (SHA-256 `9038838f…6dca42eb`).

| | `main` | Batch 5 |
|---|---:|---:|
| Exercises | 138 | 139 |
| Scenarios | 39,312 | 39,456 (+144, all with the shoulder tap as current) |
| Answered | 26,542 | **26,766** |
| Empty | 12,770 | 12,690 |

- **96 answers opened, 0 lost.**
- **8 new selection cells:** core anti-rotation for bodyweight and nothing-selected users. These were previously empty in every tolerance.

## Recommendation changes

**Selection goals: 16 changes, all merit-based, 0 alphabetical.**
- Core anti-rotation, limited equipment: Pallof press → shoulder tap in every context. The goal ranks by items needed, and the tap needs none.

**Current-exercise answers: 260 changes, 84 decided by ID, all reviewed:**

| Change | Count | Review |
|---|---:|---|
| Complement / different stimulus for the cable woodchop and Russian twist: side plank → shoulder tap | 60 | Defensible: an anti-rotation hold is a natural complement to a rotation exercise |
| Complement / different stimulus for the plank: reverse crunch → shoulder tap | 24 | Defensible: the plank's own record names "an anti-rotation movement" as a complement |

The remaining 176 are merit-based (structural ranking).

## Deferred and blockers (cumulative)

| Item | Blocker |
|---|---|
| Hamstring bridge (record) | Tie-break: 9 build-base defaults by ID (measured above) |
| Biceps with band + pull-up bar | Tie-break: a new record takes 108 defaults by ID; no existing record fits honestly |
| Belt squat | Equipment vocabulary (`machine` is generic) |
| Dead bug, band pull-through | Exercise roles / tie-break |
| Inverted row | Suspension / low-bar equipment item |
| Bodyweight hamstrings beyond the bridge | Anchor / sliders / towel (not introduced) |
| Kettlebell swing, Y-raise, dead hang, wrist roller | Goal / target / equipment decisions |

**One tie-break decision would unblock five items at once:** the hamstring bridge, a band curl, the dead bug, the band pull-through, and (with its equipment item) the belt squat.

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 139 records |
| Vitest | 298 / 298 (count test 138 → 139 only) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 139 / 139 LIVE |
| Fresh clone of the batch commit (before pushing) | validate PASS; `npm test` 298/298; lint 0; build OK; Playwright 3/3 |
