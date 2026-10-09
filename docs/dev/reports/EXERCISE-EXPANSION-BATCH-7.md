# Exercise Expansion — Batch 7: Hamstring Bridge and Band Pull-Through

_First use of `selection_role: secondary` (see `BUILD-BASE-TIE-RESOLUTION-IMPLEMENTATION.md`). Base: `main` at `059c225`, 139 exercises. This batch: **140 exercises**._

No ranking rule, structural ranker, target, goal or equipment-vocabulary change. Dead bug, band curl and belt squat untouched.

## Record changes

### `hamstring-bridge` (new, `data/exercises/hamstrings.yaml`)

| Field | Value |
|---|---|
| Target / region | `hamstrings` / hamstrings (glutes as free-text secondary) |
| Pattern | `hip extension`, heels on a bench, knees nearly straight |
| Equipment | `bodyweight` + `bench` (one setup) |
| Coverage | `low-setup`, `low-fatigue`, `equipment-limited-substitute` |
| Demand ratings | stability medium, skill low, setup low, fatigue low (as analysed) |
| **`selection_role`** | **`secondary`**: a bodyweight stand-in for loaded hamstring work (leg curls, RDLs); the record's own `less_suitable_when` says so |
| Coaching | 4 cues, 3 mistakes, 2 limitations, progression note |
| Evidence notes | None (no empirical claim) |
| Status | `needs-review` |
| Video | Flint House Police Rehabilitation, "Hamstring Bridge (Heel Elevated)", verified 2026-10-09 by **title/channel metadata via oEmbed; footage not watched** |

### `cable-pull-through` (existing record, `data/exercises/hips.yaml`; no duplicate)

| Change | Detail |
|---|---|
| Equipment | Adds `band`; `equipment_setups: [[cable, rope attachment], [band]]`. The cable-only setup and all targeting are unchanged |
| **`selection_role`** | **`secondary`**: the record describes itself as "a supporting stimulus rather than a main driver" |
| Text | `resistance_profile` describes the band version; the programming note now gives the band setup |

**Two notes on representation:**
- `selection_role` is a per-record field, so it applies to the cable version too, not only the band setup. Marking alone (no band) changes **0 Best Fits** and only the alternative shown in 56 answers (measured below).
- A band pull-through needs the band anchored low behind the lifter. `[band]` follows the existing convention for anchored band exercises (Pallof press, face pull, band external rotation), which are also modelled as `[band]`.

## Measured against `main`

Unmodified engine; same 69-entry × 6-context × 4-tolerance × 7-goal space as earlier reports. Each change was measured alone, then together. Each changed record was re-run with its ID sorted last, to separate ID-decided from merit-based changes. Run twice, byte-identical (SHA-256 `5f886c15…4ca83fd`).

| | `main` | Batch 7 |
|---|---:|---:|
| Exercises | 139 | 140 |
| Scenarios | 39,456 | 39,672 (+216, all with the hamstring bridge as current) |
| Answered | 26,766 | **27,324** |

### Hamstring bridge

| Check | Expected | Measured |
|---|---|---|
| Empty slots filled | 18 | **18**: bodyweight hamstrings region / target / `hamstring-back-fullness` (12, all tolerances); home under limits (6) |
| Alphabetical Build-base takeovers | eliminated (9 when unmarked) | **0** (unmarked control: 9: lying leg curl in any / gym under a skill limit, single-leg RDL at home) |
| Merit-based selection changes | 12 kept | **12**: home low-fatigue (6) and limited-equipment (6), single-leg RDL → bridge (lower fatigue, lower skill) |
| Existing answers lost | 0 | **0** |
| Answers opened | — | 408 (replace / complement / different stimulus and selection, mainly bodyweight and home) |

### Cable pull-through band setup

| Check | Expected | Measured |
|---|---|---|
| Default (selection-goal) picks | unchanged | **0 changes** (unmarked with band, it would take 60) |
| Replacement coverage | opened | **60 "replace" answers** at home (28) and band + pull-up bar (32) |
| Existing answers lost | 0 | **0** |
| Cable-only version | preserved | Unchanged setup; its gym answers keep their Best Fits |

### Changes outside the selection goals (structural rankers, out of scope)

The replace, different-stimulus and complement rankers are deliberately unaffected by `selection_role`. Their changes:

| Source | Best Fit changes | Of which ID-decided | Nature |
|---|---:|---:|---|
| Hamstring bridge | 54 | 42 | Complement / different stimulus for the lying leg curl, single-leg RDL and RDL → bridge (a hip-extension pairing for a knee-flexion or hinge exercise) |
| Pull-through band setup | 312 | 140 | Complement / different stimulus for the glute bridge, hip abduction, Copenhagen plank and single-leg RDL → pull-through, where a band is available |
| Pull-through marking alone | 0 | — | 56 alternative changes only |

These match the predictions in the tie-resolution implementation report (42 and 140 ID-decided). They are newly available equipment answers or new-exercise pairings. **No unintended selection-goal Best Fit change occurs.**

## Tests

| Change | Reason |
|---|---|
| `data/index.test.ts`: count 139 → 140 | One new record |
| `selectionRole.test.ts` | The "no record classified yet" check is now a review gate. It asserts the exact set of classified records (`cable-pull-through`, `hamstring-bridge`), so any future classification needs a deliberate test change |

## Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 310 / 310 |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
| Video audit (oEmbed) | 140 / 140 LIVE |
| Measurement (two runs) | Byte-identical |
| Fresh clone of the batch commit (before pushing) | validate PASS; `npm test` 310/310; lint 0; build OK; Playwright 3/3 |

## Unexpected differences

None beyond those predicted. The two representation points above (a per-record role, and the anchored-band convention) are stated rather than hidden.
