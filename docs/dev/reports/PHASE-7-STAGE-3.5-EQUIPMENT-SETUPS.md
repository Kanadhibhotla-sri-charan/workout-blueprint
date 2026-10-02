# Phase 7 Stage 3.5 — Equipment Setups

Implements the model proposed in `EQUIPMENT-MODEL-INVESTIGATION.md`. Rule text: `DECISION-ENGINE-RULES.md` §1. Field definition: `docs/knowledge-manual/SCHEMA.md` (`equipment_setups`).

## Model

- `equipment_setups` (optional) is a list of setups. Every item in a setup is required, and the setups are alternatives.
- When it is absent, there is one setup: `equipment`, with every item required. The 88 records without the field are unchanged.
- `equipment` stays the union of all setups. Validation enforces this.
- `bodyweight` always counts as available. An empty selection means bodyweight-only.
- "Limited equipment" ranks by the smallest setup the user can complete.
- Explanation and watch-out text:
  - when equipment is restricted, they name the setup that fits the user;
  - when unrestricted, they list the alternatives ("Requires one of: …").
- Explore lists an exercise under an item when any setup uses it. For single-setup records this is the same as before.

## Classification decisions (the 4 medium-confidence records)

Each decision is based on the record's own name, summary and `resistance_profile`. No new equipment was assumed.

| Exercise | Decision | Setups | Basis |
|---|---|---|---|
| lying-triceps-extension-skull-crusher | Pure alternatives, **no bench added** | `[barbell]`, `[ez-bar]`, `[dumbbell]` | The profile names barbell, EZ-bar or dumbbells. Nothing in the record requires a bench, and the lying position can be done on the floor. The investigation had listed a bench as omitted; the record doesn't support that. |
| chest-supported-row | Alternatives; dumbbell was missing | `[machine]`, `[bench, dumbbell]` | "Machine or bench-supported free weight". A bench alone can't be rowed, so the free-weight setup needs dumbbells. |
| t-bar-row | Alternatives; barbell was missing | `[t-bar]`, `[landmine, barbell]` | A landmine is only a pivot, so the landmine version needs a barbell. |
| neck-extension | Alternatives (harness needs a plate) | `[harness, plate]`, `[machine]` | "Harness, plate, or machine". A harness carries the plate. A plate alone is a different, unsupported variation. `equipment` is unchanged. |

## Missing-equipment corrections

Each correction adds only equipment the record's own setup requires. `equipment` grows to remain the union of the setups.

- **chest-supported-row:** adds `dumbbell`.
- **t-bar-row:** adds `barbell`.
- **close-grip-bench-press:** adds `bench` and `rack`. Setups are `[barbell, bench, rack]` and `[smith machine, bench]`.
- **bulgarian-split-squat-knee-dominant:** adds `bench`. Setups are `[dumbbell, bench]` and `[barbell, bench]`.

That is 4 corrections, not the investigation's 5: the skull crusher's bench was dropped (see the table above).

## Complement ordering fix

`resolveComplements` used to choose a declared complement before tolerance and region limits were applied. If that choice was then filtered out, the result was empty, even when a structural complement would have passed.

Declared complements are now filtered by feasibility and eligibility before they take precedence. This recovers:

- the 16 answers the investigation found would be lost;
- 120 answers that were empty before this stage (the same bug, already present).

## Coverage (36,360 scenarios, real engine, deterministic across runs)

| Area | Before | Simulated | After |
|---|---:|---:|---:|
| Total answered | 15,430 | 20,091 | 20,227 |
| Triceps long head | 40 | 58 | 58 |
| Upper traps | 128 | 192 | 192 |
| Forearms | 284 | 420 | 420 |
| Home dumbbells | 3,022 | 4,446 | 4,470 |
| Nothing selected | 0 | 1,220 | 1,220 |
| Minimal kit | 88 | 1,975 | 1,975 |
| Commercial gym | 5,207 | 5,267 | 5,323 |
| Unrestricted | 5,267 | 5,267 | 5,323 |

### Transitions from before to after

- Empty → answered: 4,797.
- Answered → empty: **0**.
- Best fit changed: 687 (unrestricted 36, commercial gym 103, home dumbbells 518, minimal kit 30).
- Unrestricted context changes:
  - 55 limited-equipment re-rankings by smallest setup;
  - 56 complement goals answered for the first time;
  - text changes only on exercises that have setups.
- Four home limited-equipment results move from the overhead triceps extension to the skull crusher. Both now need one item, and the existing alphabetical tie-break decides between them. The tie-break is unchanged.

### Remaining empties

Bodyweight-only and minimal-kit requests for triceps long head, upper traps and forearms still return nothing. That is a content gap: no exercise in the dataset trains those with bodyweight alone. It is not an equipment-model issue.
