# Decision Engine v0.1 — Deterministic Rules

**Written before any engine code, per the user's explicit instruction on approving the Phase 3 plan:** "Before implementation of the decision engine, explicitly define deterministic structural-alternative matching rules and equipment-feasibility rules. Do not use vague/fuzzy matching." This document is that definition. `app/src/engine/` implements exactly what's written here — if the code and this document ever disagree, that's a bug in the code, not a looser interpretation of the rule.

Every rule below is a strict boolean predicate or a fixed-priority tiebreak over exact field values. Nothing here is a weighted score, a similarity metric, or a threshold tuned by feel — per spec §14 ("deterministic and explainable... do not use opaque numerical scoring unless necessary") and the user's "no vague/fuzzy matching" instruction.

## 1. Equipment-feasibility rule

**Why it's needed:** §12/§13's equipment constraint has to decide, for a given exercise and a given "what the user has available" answer, whether that exercise is usable at all.

**Input:** `equipmentAvailable: string[] | null`, matching this project's existing null-vs-empty convention (ADR 0002):
- `null` — the user did not engage the equipment constraint (skipped it, or picked "no constraint"). No filtering applied.
- `[]` or a non-empty list — the user affirmatively stated what they have (an empty array means bodyweight-only: they have nothing).

**Rule:**

```
isEquipmentFeasible(exercise, equipmentAvailable):
  if equipmentAvailable is null:
    return true                      # constraint not engaged — no filtering
  return exercise.equipment is a subset of equipmentAvailable
         (every item in exercise.equipment appears, as an exact string
          match, in equipmentAvailable)
```

- **Exact string match only** against the values already present in the dataset's `equipment` field (34 open-vocabulary values — see `SCHEMA.md`). No normalization, no partial/synonym matching (e.g. "dumbbell" does not match "dumbbells" or "DB" — the UI only ever offers the exact values that exist in the data, via `equipmentOptions` in `src/data/index.ts`, so this can't arise from user input).
- `equipment` is a required, non-empty field on every record (`REQUIRED_LIST_FIELDS` in `scripts/lib/taxonomy.js`), and bodyweight-only exercises explicitly list `equipment: [bodyweight]` rather than an empty list — so the subset test is well-defined for every one of the 123 records with no special-casing needed for "no equipment."

## 2. Deterministic structural-alternative matching rule

**Why it's needed:** the architect's Phase 2 Open Decisions memo (`docs/architecture/PHASE-2-OPEN-DECISIONS.md`) explicitly decided not to bulk-populate the `alternatives` field — it is `0/123` populated by design, not by omission. But Phase 3 §13 Step 4 and §16's 🥈 "Alternative" output slot both need a same-role substitute to suggest. The engine must derive one structurally, from fields that are actually populated, rather than wait on a future content pass.

**Definition it's approximating** (from `PHASE-2-OPEN-DECISIONS.md` §2): *"alternative = another exercise that can fill approximately the same programming role if the user cannot or does not want to use the current exercise."*

**Structural proxy for "approximately the same programming role":** this project's Phase 1 taxonomy work normalized every record's `movement_patterns[0]` to one of 49 closed, controlled fundamental-pattern values specifically so that exercises performing the same base movement could be grouped reliably (see `docs/dev/reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md`). Two exercises sharing that value are doing the same fundamental movement — the strongest available deterministic proxy for "same role" in the current schema, without a similarity model of any kind.

**Stage 1 — eligibility (strict AND of exact predicates; a candidate either passes or it doesn't, no partial credit):**

A record `B` is an eligible structural alternative for record `A` iff **all** of:

1. `B.id !== A.id`
2. `B.movement_patterns[0] === A.movement_patterns[0]` (identical fundamental movement pattern)
3. `B.exercise_type === A.exercise_type` (compound stays compound, isolation stays isolation — swapping category is a different decision than "approximately the same role")
4. `B.body_regions` and `A.body_regions` share at least one value (guards the rare case of a movement-pattern value theoretically spanning unrelated regions)
5. `B.review_status !== 'draft'` (a draft record hasn't cleared even minimal review — see `REVIEW-PROMOTION-GATE.md` — the engine only recommends `needs-review` or `reviewed` records; in the current dataset this excludes nothing, since all 123 records are `reviewed`, but the rule holds regardless of future data)

If an equipment constraint is active, eligibility additionally requires:

6. `isEquipmentFeasible(B, equipmentAvailable)` — an infeasible candidate is never offered as "the alternative," since suggesting something the user just said they can't do would violate §17's recommendation-safety rule.

**Stage 2 — ranking (fixed-priority tiebreak among eligible candidates, not a blended score):**

When more than one candidate passes Stage 1, rank by, in strict order, each level only breaking ties left by the level above:

1. Number of `primary_targets` entries shared with `A` (exact string match on the full entry, including any parenthetical annotation — see "known limitation" below), descending.
2. Number of `coverage_categories` entries shared with `A`, descending.
3. `id`, ascending (alphabetical) — final deterministic tiebreak. This guarantees the same input always produces the same output; there is no random or unordered pick among ties.

The top-ranked candidate is *the* structural alternative. This produces at most one suggestion, matching §16's "one reasonable substitute where available" — the engine does not return a ranked list of alternatives, only the single best one (or none, if Stage 1 finds no eligible candidate).

**If the `alternatives` field is ever populated** for a record in a future phase, the engine prefers it over the structural derivation — same precedence pattern this project already uses for other optional fields (ADR 0002: prefer explicit data, fall back to a defined default when it's genuinely absent). That preference is a one-line check in the engine, not a change to the rule above.

**Known limitation, stated rather than smoothed over:** Stage 2's first tiebreak (`primary_targets` overlap) uses exact string equality, including parenthetical annotations like `"chest (commonly cited as upper/clavicular-biased)"`. Two records targeting what a human would call "the same muscle" with differently worded annotations will not count as sharing that target for ranking purposes. This is a deliberate consequence of "no vague/fuzzy matching" — normalizing or partially matching those strings would itself be a form of fuzzy matching. In practice this only affects *tiebreak ordering* among candidates that already passed the strict Stage 1 filter (same movement pattern, same exercise type, same region), so it changes which equally-valid candidate wins a tie, not whether a reasonable alternative is found at all.

## 3. Deterministic structural-complement matching rule

**Why it's needed:** discovered while implementing this checkpoint, not anticipated when §1–2 were written — `complements` turns out to be almost entirely prose. Counted against the live dataset: **124 total `complements` entries, only 2 are bare-id-shaped** (resolvable to a real record the way `overlaps_with` mostly is). §13 Step 4 and §16's 🔄 "Complements" output need a same-region, different-movement suggestion for the other ~121 records too, so the same structural-fallback approach as §2 is needed here, not just for `alternatives`.

**Definition it's approximating** (`PHASE-2-OPEN-DECISIONS.md` §2): *"complement = an exercise that adds a materially different stimulus or coverage alongside the current exercise."*

**Stage 1 — eligibility:** a record `B` is an eligible structural complement for record `A` iff **all** of:

1. `B.id !== A.id`
2. `B.body_regions` and `A.body_regions` share at least one value (still relevant to the same area)
3. `B.movement_patterns[0] !== A.movement_patterns[0]` — **the defining difference from §2's alternative rule**, which requires the *same* pattern. A complement must be a materially different movement; an alternative must be the same movement via a different equipment/setup path.
4. `B.review_status !== 'draft'`
5. `isEquipmentFeasible(B, equipmentAvailable)` when an equipment constraint is active

**Stage 2 — ranking**, same fixed-priority tiebreak structure as §2 but with the coverage-category direction reversed:

1. Number of shared `primary_targets` entries (exact string match), descending — still relevant to a related target.
2. Number of shared `coverage_categories` entries, **ascending** (fewer shared = more different stimulus — the opposite of §2's alternatives ranking, which prefers similarity).
3. `id`, ascending — final deterministic tiebreak.

**Precedence:** the engine prefers a record's own resolvable `complements` entries when present (2/123 records currently), and falls back to this structural match otherwise (the other ~121) — same explicit-data-first pattern as §2.

**Verified against the live data**, not assumed: for `incline-dumbbell-press`, running this rule (see the script output logged in the 3F dev-log entry) ranks `incline-dumbbell-fly` first — a materially different movement (`shoulder horizontal adduction on an incline` vs. `incline horizontal press`) at the same incline/chest emphasis, a defensible complement even though it differs from `cable-fly`, the specific complement this one record happens to have curated in prose. The engine is not expected to reproduce every individual curated entry; it's expected to produce *a* reasonable, rule-following pick when no curated entry resolves, which this is.

## 4. Worked example, hand-computed against the live dataset (not asserted from memory)

`incline-dumbbell-press` (chest, `movement_patterns[0] = "incline horizontal press"`, `exercise_type = compound`, `coverage_categories = [heavy-compound, lengthened-position-emphasis]`):

**Stage 1** — the other four records sharing `movement_patterns[0] = "incline horizontal press"` are `incline-barbell-press`, `incline-cable-press`, `incline-machine-press`, `smith-machine-incline-press`. All are `compound` and `body_regions: [chest]`, so all four pass Stage 1 when no equipment constraint is active. This set includes *Incline Smith Press* — the exact exercise the architect's own worked example (`PHASE-2-OPEN-DECISIONS.md` §2) names as the alternative for this record — confirming Stage 1 finds the right *pool* of candidates, not necessarily that it wins the ranking (see below; the architect's memo is an illustrative example, not a data assertion about this specific dataset's coverage-category values).

**Stage 2, unconstrained** — all four candidates share the exact same `primary_targets` string as the original (tiebreak (a) ties all four at 1). Tiebreak (b), shared `coverage_categories` with `{heavy-compound, lengthened-position-emphasis}`:

| candidate | coverage_categories | shared count |
|---|---|---|
| `incline-barbell-press` | `[heavy-compound]` | 1 |
| `incline-cable-press` | `[isolation, lengthened-position-emphasis]` | 1 |
| `incline-machine-press` | `[stable-compound]` | 0 |
| `smith-machine-incline-press` | `[stable-compound]` | 0 |

`incline-barbell-press` and `incline-cable-press` tie at the top; tiebreak (c) (alphabetical id) resolves it to **`incline-barbell-press`**. This is a defensible result, not a flaw to paper over: Phase 1's coverage-category classification already placed the free-weight-adjacent press variants (barbell, cable) in categories that overlap the dumbbell press's own (`heavy-compound`, `lengthened-position-emphasis`), while the fixed-path machine and Smith-machine variants both landed in `stable-compound` — a genuinely different loading character. The ranking is reflecting a real distinction already present in the reviewed data, not an artifact of the algorithm.

**Stage 2, equipment-constrained** — if the user's available equipment is `[smith machine, bench]` only, rule 6 removes the other three candidates at Stage 1 (each needs equipment — `barbell`+`rack`, `cable`, or `machine` — outside that set), leaving `smith-machine-incline-press` as the sole eligible candidate and therefore the pick, with no ranking needed. This is the scenario that actually matches the architect's example outcome, and it demonstrates the equipment-feasibility rule (§1) and the structural-alternative rule (§2) composing correctly, per Stage 1 rule 6.

Both scenarios above are asserted as automated tests in `app/src/engine/alternatives.test.ts`, not just hand-traced here — see the 3F dev-log entry.
