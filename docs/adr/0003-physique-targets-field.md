# ADR 0003: `physique_targets` field and the physique-target taxonomy

**Status:** Accepted
**Date:** 2026-08-16
**Resolves:** [Phase 4 architecture spec](../architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md) §2A/§4/§5, the architect's approval memo item 1 ("Canonical physique-target taxonomy").

## Context

Phase 3's Decision Maker selects by broad `body_regions` (chest, back, shoulders, ...). Real use showed this is too coarse for an intermediate trainee who already knows they want, specifically, upper-pec development or side-delt development, not "something for chest" or "something for shoulders."

Auditing the live dataset for this work found the finer distinction the spec wants is **often already present**, just not structured:

- **Shoulders** — front/side/rear delt already exist as clean, separate `primary_targets` values (`anterior deltoids`, `lateral deltoids`, `posterior deltoids`).
- **Chest** — upper/mid/lower pec bias is already written into `primary_targets` as a free-text annotation (e.g. `"chest (commonly cited as upper/clavicular-biased)"`), just not queryable as a structured value.
- **Back** — lat width (lats-primary) vs. back thickness (mid-back/rhomboids-primary) is a real, present split; several records genuinely target both.
- **Arms** — biceps vs. brachialis/arm-thickness vs. triceps, and long-head-vs-short-head bias within each, is already annotated.
- **Core** — obliques vs. general rectus-abdominis is clean; an upper-abs/lower-abs split is **not** supported by the data and is not introduced (the rectus abdominis largely acts as one sheet; this is a genuinely contested distinction, not one this project's data resolves — excluded from v1 per architect direction, revisit only if a future evidence pass establishes a defensible basis).

While auditing this, 8 `arms.yaml` records were found to have a YAML authoring bug (an annotated target's internal comma was parsed as a flow-sequence list separator, silently splitting one target into 2–3 nonsensical entries) — fixed separately, before this ADR's taxonomy work, since it would otherwise have corrupted the classification below.

## Decision

Two things, kept deliberately separate per the architect's approval memo item 1:

1. **`data/programming/physique-targets.yaml` is the single, authoritative definition of what a physique target *means*** — its id, display name, parent body region, anatomical/functional definition, and the visible physique outcome it maps to. This file does not list which exercises belong to a target; that would be a second, independent taxonomy that could drift out of sync with the exercise records.
2. **A new optional exercise-record field, `physique_targets: [string] | null`**, establishes the relationship the other direction: which canonical target id(s) (as defined in `physique-targets.yaml`) a given exercise serves. An exercise legitimately targeting more than one physique target (e.g. a row hitting both lat width and back thickness) lists both ids — this is preserved deliberately, not collapsed to one.

```yaml
# data/exercises/chest.yaml
- id: incline-dumbbell-press
  ...
  physique_targets: [upper-pec]

# data/programming/physique-targets.yaml
- id: upper-pec
  name: Upper Pec
  parent_region: chest
  definition: >-
    The clavicular (upper) portion of the pectoralis major.
  physique_outcome: >-
    Visually: fullness just below the collarbone, closing the gap between
    shoulder and chest.
```

**No synonyms as separate targets.** `upper-chest`, `upper-pec`, and `clavicular-pec` are the same canonical target and must resolve to one id (`upper-pec`); the taxonomy file is the enforcement point — `validate-data` rejects any exercise's `physique_targets` entry that doesn't resolve to a real id in `physique-targets.yaml`, the same referential-integrity pattern already used for `overlaps_with`.

**Null vs. empty**, per [ADR 0002](0002-empty-field-semantics.md): `physique_targets: null` means this exercise doesn't map to any physique target in the current taxonomy (true for most records outside the target being actively built — quads, hamstrings, calves, hips, forearms, neck stay at body-region granularity for v1, and even within chest/shoulders/back/arms/core most records won't be populated until their target is added). This is **not** the "not yet established" empty-list case — `[]` is reserved for a record that's been reviewed for target-mapping and genuinely doesn't fit any current target, which is expected to be rare. In practice, until the taxonomy expands, `null` is what nearly every record carries.

**Populated incrementally, by taxonomy expansion, not all at once.** Per the architect's approval memo ("Upper Pec only initially" for 4A/4B), this field starts populated on exactly the 6 upper-pec chest records; every other record keeps `physique_targets: null` until its target is added in a later pass. This is why the field is optional rather than required — most records won't have a value for a long time, and that's expected, not a gap to close urgently.

## Consequences

- `scripts/lib/taxonomy.js`: `physique_targets` added to `OPTIONAL_LIST_FIELDS` and `ALL_FIELDS`.
- `scripts/lib/validate.js`: new referential-integrity check — every entry in a record's `physique_targets` must resolve to an id defined in `data/programming/physique-targets.yaml`, loaded the same way `data/exercises/*.yaml` is.
- `SCHEMA.md` gains a `physique_targets` entry documenting this field, cross-referencing `physique-targets.yaml` as authoritative.
- This is a minor, additive schema change (new optional field) — no existing field changes shape or meaning, so no data migration is needed for the 123 records outside the ones being actively populated.
- Future taxonomy expansion (remaining chest/shoulders/back/arms/core targets) adds entries to `physique-targets.yaml` and populates the corresponding exercises' `physique_targets` — it does not require another ADR unless the *shape* of the taxonomy changes (e.g. targets needing their own sub-hierarchy), only new data within the shape this ADR establishes.
