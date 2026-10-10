# Quality Gate — Implementation

_Implements the approved findings of `NEXT-QUALITY-GATE-ASSESSMENT.md` in separately reviewable stages. Base: `main` at `8f09d0f`, 140 exercises._

**Unchanged in every stage:**
- no exercise added;
- no default-pick ranking change;
- no target, goal or equipment-vocabulary change;
- different stimulus and complement keep their current meaning.

## Stage 1 — Content integrity

### Status changes (18 records, `reviewed` → `needs-review`)

| Group | Records |
|---|---|
| Build-package exercises, pinned as pending diff review (16) | barbell-dumbbell-shrug, bulgarian-split-squat-hip-dominant, bulgarian-split-squat-knee-dominant, cable-fly, cable-lateral-raise, chest-supported-row, close-grip-bench-press, hammer-curl, overhead-triceps-extension, reverse-curl, reverse-wrist-curl, romanian-deadlift, seated-calf-raise, standing-calf-raise, straight-arm-pulldown, wrist-curl |
| Not in a package (2) | glute-bridge, single-leg-romanian-deadlift |

- **Result:** 36 `reviewed` and 104 `needs-review` records.
- **Package test** (`app/src/data/coaching.test.ts`):
  - a package exercise must be `reviewed` unless it is in `PENDING_DIFF_REVIEW`, in which case it must be `needs-review`;
  - the list can only shrink: a promoted record fails until its entry is removed;
  - every entry must be a package exercise;
  - the coaching-count checks (≥ 3 cues, ≥ 2 mistakes) still apply to all 46 package exercises.

### `overlaps_with` (4 removals, 4 additions; both directions edited)

| Change | Pair |
|---|---|
| Removed | hip-abduction ~ hip-adduction; neck-extension ~ neck-flexion; wrist-curl ~ reverse-wrist-curl; cable-rear-delt-builder ~ seated-cable-row |
| Added | dumbbell-curl ~ zottman-curl; dumbbell-curl ~ incline-dumbbell-curl; single-arm-dumbbell-row ~ barbell-bent-over-row-pronated; single-arm-dumbbell-row ~ chest-supported-row |

- **Not touched:** the 13 ambiguous pairs and the 62 one-sided entries. Matching is now symmetric, so one-sided entries need no data edit.
- **Symmetric matching:**
  - `overlapIds` and `exercisesOverlap` in `app/src/utils/relationships.ts`;
  - entries are parsed with the existing `parseRelationshipEntry`, so `"id (module) — note"` entries count;
  - two exercises overlap when either lists the other.
- **Pinned snapshot:** `app/src/data/audited-overlaps.json`, 160 unordered pairs.

### SCHEMA

- **`review_status`:** a content-quality marker. `draft` is the only recommendation gate; `needs-review` and `reviewed` rank identically. The package rule and its pending list are documented.
- **`overlaps_with`:** documented as symmetric, with the pinned snapshot.

### Tests added (9)

| File | Tests |
|---|---|
| `utils/relationships.test.ts` (new) | Parsing (bare id, module note, trailing note, prose → null); id extraction; symmetry; exact match with the audited snapshot; every reference resolves |
| `data/coaching.test.ts` | Pending entries are package exercises |

### Measured effect (full scenario space; two runs, byte-identical)

| Check | Result |
|---|---|
| Best Fit / alternative / complements / answer status changed | **0 / 39,672** |
| Explanation or other text changed (excluding watch-out) | **0** |
| Watch-out text changed | **712** |

**Why 712 watch-outs changed:**
- The "Overlaps with other exercises — avoid stacking both" note appears when the Best Fit's **own** list is non-empty.
- It disappears for hip-abduction (190), neck-flexion (144), wrist-curl (128), hip-adduction (72) and neck-extension (40).
- It appears for single-arm-dumbbell-row (124) and incline-dumbbell-curl (14).
- The note still reads only the record's own list. Making it symmetric would be a further text change and was not part of the approval.

### Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 319 / 319 (310 + 9 new) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |

## Stage 2 — Ranking implementation

### What changed

**New module:** `app/src/engine/structuralTieBreak.ts`, with `compareStructuralTie` and `equipmentContinuity`.
- Used by `rankStructuralAlternatives` (mode `substitute`) and `rankStructuralComplements` (mode `complement`).
- It replaces only their final `id` comparison. Their target and coverage keys, and the target-tier and aesthetic sorts layered on top, are untouched.

**Key order** (it applies only to ties left by those keys):
1. unclassified before `selection_role: secondary`;
2. curated overlap: preferred for a substitute, avoided for a complement. Matched symmetrically with Stage 1's `exercisesOverlap`;
3. equipment continuity (higher first);
4. `id`, ascending.

**Continuity:**
- The most shared items between a candidate setup usable in this context and any setup of the current exercise; all of the current exercise's setups count.
- `NON_CONTINUITY_ITEMS` = {bodyweight, bench, incline bench}, an engine constant.
- A candidate with no usable setup throws; both rankers filter those out first, so this is unreachable.

**Refactor:** `selectionRoleRank` moved from `decisionEngine.ts` to `engine/selectionRole.ts` so both rankers share it. Default-pick ranking is unchanged (measured below).

**Docs:** `DECISION-ENGINE-RULES.md` §1–4; SCHEMA (`overlaps_with`, `selection_role`).

### Measured against Stage 1

Stage 1 itself changed 0 recommendations. Full scenario space, two runs, byte-identical (SHA-256 `17f3a8ea…bc34e`).

| Check | Required | Measured |
|---|---|---|
| Best Fit changes | exactly 2,088 | **2,088**: replace 392, different stimulus 848, complement 848 |
| Change list vs the approved simulation | identical | **byte-identical** (SHA-256 `5e68eff0…37e17`) |
| Default-pick (selection-goal) Best Fit changes | 0 | **0** |
| Answers becoming empty or filled | 0 | **0** |
| Changes outside former alphabetical ties | 0 | **0** |
| Material failures remaining | 0 | **0** (776 on the baseline) |
| Ties still decided by `id` | — | 5,994 (no strong signal) |
| Alternatives changed | — | 3,562 |
| Complement lists changed on default-pick answers | — | 1,401 |
| Flagged regressions | 12, intended | **12**: "replace my cable drag curl" at home / band kit. The band-only cable curl (`secondary`) yields to the dumbbell, hammer or cross-body hammer curl, as role-first intends |

**Best Fit changes by context:**

| Any | Gym | Home | Band + pull-up bar | Bodyweight | Nothing selected |
|---:|---:|---:|---:|---:|---:|
| 721 | 721 | 408 | 198 | 22 | 18 |

### Tests (25 new in `engine/structuralTieBreak.test.ts`)

| Area | Tests |
|---|---|
| Continuity | Unrestricted context; usable setups only; all of the current exercise's setups; best setup pair; nothing shared; bodyweight / bench / incline bench excluded; no usable setup throws |
| Tie order | Role > overlap; overlap > continuity (substitute); overlap avoided (complement); symmetric overlap; continuity > id; id last |
| Existing keys first | Replace: shared targets, then coverage, beat every tie-break key. Complement: fewer shared coverage categories beat every tie-break key |
| Determinism | Replace and complement rankings identical across every rotation and the reverse of the library, in 3 equipment contexts |
| Pinned cases | The 9 cases from the assessment through `makeRecommendation`; different stimulus equals complement for both complement cases |

**Mutation check:** with the old `id` fallback temporarily restored, all 9 pinned cases fail and the other 16 pass.

### Existing test updated, by design

`alternatives.test.ts` › "constrained to only a Smith machine + bench":
- **What it pinned:** an alphabetical tie. Replacing the incline dumbbell press with only a Smith machine + bench gave the feet-elevated push-up first.
- **New behaviour:** the curated overlap decides, so the Smith incline press comes first. The assertion is still exact.
- **Why the measurement didn't include it:** this equipment context is outside the six measured contexts, so it is not part of the 2,088.

The unconstrained case (incline barbell press) is unchanged.

### Validation

| Check | Result |
|---|---|
| Data generation + `validate-data` | PASS, 140 records |
| Vitest | 344 / 344 (319 + 25 new) |
| oxlint | exit 0 |
| Production build | OK |
| Playwright | 3 / 3 |
