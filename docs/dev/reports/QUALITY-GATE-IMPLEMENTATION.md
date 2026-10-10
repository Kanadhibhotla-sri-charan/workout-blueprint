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
