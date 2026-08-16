# Canonical Exercise Record — Schema

**Status:** Frozen as of Phase 2 ([`docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md`](../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md), Task A/B). Adding, removing, renaming, or retyping a field requires an ADR — see [`docs/adr/0001-canonical-record-format.md`](../adr/0001-canonical-record-format.md) for the format decision this schema builds on.

This document is the authoritative field-by-field reference for every record in `data/exercises/*.yaml`. `FOUNDATION.md`'s "Canonical Exercise Record" block remains the quick-reference summary; this document is the detailed one, and the two must stay consistent — if they diverge, this document wins for field semantics and `FOUNDATION.md` is the one that needs fixing.

Every fact below (types, enum values, actual usage counts) was audited against the live dataset (123 records, 11 modules) as of this phase, not written from memory of what the schema was supposed to be.

## Field reference

### `id`
- **Type:** string (scalar)
- **Required:** yes, on all records
- **Format:** lowercase kebab-case slug, unique across the entire dataset (not just within a module)
- **Stability:** this is the stable machine identity. It must not change when `name` changes, and must not be reused for a genuinely different exercise even after an old one is retired.
- **Decision-making impact:** yes — this is the join key for `overlaps_with` and, occasionally, `complements`. Any future recommendation logic keys off this field, not `name`.
- **Required for `reviewed`:** yes

### `name`
- **Type:** string (scalar)
- **Required:** yes
- **Format:** free-text, user-facing display name. May change independently of `id` for clarity (e.g. adding a disambiguating suffix) without that counting as a new exercise.
- **Decision-making impact:** no (display only)
- **Required for `reviewed`:** yes

### `summary`
- **Type:** string (scalar, YAML folded block `>-`)
- **Required:** yes
- **Purpose:** one to two sentences, the elevator-pitch version of why this record exists and what makes it distinct.
- **Decision-making impact:** no (human-readable framing)
- **Required for `reviewed`:** yes

### `why_this_exists`
- **Type:** string (scalar, YAML folded block `>-`)
- **Required:** yes
- **Purpose:** the fuller version of `summary` — the specific decision value this record adds that isn't redundant with a related record. This is the field that has to answer "when would I choose this over an alternative?"
- **Decision-making impact:** no (human-readable framing)
- **Required for `reviewed`:** yes

### `body_regions`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Allowed values (closed vocabulary, 11 values, one per module):** `arms`, `back`, `calves`, `chest`, `core`, `forearms`, `hamstrings`, `hips`, `neck`, `quads`, `shoulders`
- **Multi-value case:** a record legitimately lists more than one region when it's a genuine cross-region exercise with no execution fork (currently one case in the dataset: `romanian-deadlift`, `[hips, hamstrings]`, per ADR 0001). This is not a general-purpose "tag it broadly" field — multi-region use should stay rare and each case should be able to point to the same ADR-0001-style reasoning.
- **Decision-making impact:** yes — this is the primary index a future application would use to answer "show me hamstring exercises."
- **Required for `reviewed`:** yes

### `primary_targets`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Format:** muscle or functional-group names anchored to `FOUNDATION.md`'s Taxonomy section, often carrying a parenthetical qualifier — e.g. `biceps (long-head-biased, EMG-supported)`, `chest (commonly cited as upper/clavicular-biased)`. This is a deliberately open vocabulary, not a closed enum: the qualifiers carry real evidence-confidence information (see `evidence_notes`) that would be lost if this were forced into a bare muscle-name enum.
- **Decision-making impact:** yes — this is the field a future gap-detection or recommendation feature would read first.
- **Required for `reviewed`:** yes

### `secondary_targets`
- **Type:** list of strings
- **Required:** no — `[]` is valid and common when a movement genuinely has no meaningful secondary target.
- **Format:** same open vocabulary as `primary_targets`.
- **Decision-making impact:** yes, but secondary to `primary_targets`
- **Required for `reviewed`:** conditionally — required to be accurate when non-empty, but an empty list is not itself a gate failure.

### `physique_targets`
- **Type:** list of strings, or `null`
- **Required:** no. Per [ADR 0002](../adr/0002-empty-field-semantics.md), `null` means "doesn't map to a physique target in the current taxonomy" — true for the great majority of records, since this field is populated incrementally by taxonomy expansion (see [ADR 0003](../adr/0003-physique-targets-field.md)), not all at once. In practice most records simply omit this field entirely rather than writing it out as `null` on every record — validation treats an absent field the same as `null` for optional fields.
- **Format:** each entry must be an id defined in [`data/programming/physique-targets.yaml`](../../data/programming/physique-targets.yaml), which is the **authoritative** definition of what a physique target means (name, parent region, anatomical definition, visible outcome). This field only establishes the relationship — which target(s) this exercise serves — it does not define the target itself. `npm run validate-data` rejects any entry that doesn't resolve to a real id there, the same referential-integrity treatment `overlaps_with` gets against exercise ids.
- **Multi-value case:** an exercise legitimately serving more than one physique target (e.g. a row hitting both lat width and back thickness) lists both — this is preserved deliberately, not collapsed to one, per the architect's Phase 4 approval memo.
- **No synonyms:** `upper-chest`, `upper-pec`, and `clavicular-pec` are the same canonical target and must resolve to one id (`upper-pec`). `physique-targets.yaml` is the single enforcement point for this — see ADR 0003.
- **Decision-making impact:** yes — this is what the Phase 4 Decision Maker's target-selection flow reads first, ahead of `primary_targets`.
- **Required for `reviewed`:** no. A record can be fully reviewed and still carry no `physique_targets` value if its target hasn't been added to the taxonomy yet.

### `movement_patterns`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Structure (established in Phase 1's taxonomy normalization):** the **first item** is always a fundamental movement pattern drawn from the controlled set below; any **subsequent items** are modifiers (grip, secondary joint position, path, stance) as free-form short phrases, one modifier per list item, never concatenated into the pattern string.
- **Fundamental-pattern controlled vocabulary (49 values currently in use, one-word-verb style, grouped conceptually in `FOUNDATION.md`'s Movement Taxonomy section):** `ankle dorsiflexion`, `ankle plantarflexion`, `unilateral ankle plantarflexion`, `anti-extension isometric`, `anti-extension through range`, `anti-lateral flexion under load`, `anti-rotation isometric`, `elbow extension`, `elbow extension within a vertical-to-horizontal press`, `elbow flexion`, `forearm pronation and supination`, `hip abduction`, `hip adduction`, `hip extension`, `hip flexion`, `hip hinge`, `horizontal press`, `horizontal pull`, `horizontal-to-vertical press`, `incline horizontal press`, `knee extension`, `knee flexion`, `knee- and hip-dominant press`, `loaded carry`, `neck extension`, `neck flexion`, `neck isometric`, `neck lateral flexion`, `scapular elevation`, `scapular protraction within a horizontal press`, `shoulder abduction`, `shoulder extension`, `shoulder extension through an overhead arc`, `shoulder external rotation`, `shoulder horizontal abduction`, `shoulder horizontal adduction`, `shoulder horizontal adduction on a decline`, `shoulder horizontal adduction on an incline`, `squat / knee-dominant`, `trunk extension`, `trunk flexion`, `trunk rotation`, `unilateral hip-dominant`, `unilateral knee- and hip-dominant`, `unilateral knee-dominant`, `vertical press`, `vertical pull`, `wrist extension`, `wrist flexion`.
- **New fundamental patterns:** adding one to the controlled set doesn't need an ADR (it's data, not schema), but should be a deliberate addition when a genuinely new pattern appears, not a byproduct of not normalizing a modifier out of it — that's exactly the mistake Phase 1 fixed.
- **Modifiers:** free-form, not validated against a closed list — Phase 1 explicitly decided against forcing these into an enum (see [`docs/dev/reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md`](../dev/reports/MOVEMENT-TAXONOMY-CLASSIFICATION.md)).
- **Decision-making impact:** yes, the first item is; modifiers are supplementary detail
- **Required for `reviewed`:** yes, first item must be a recognized fundamental pattern
- **Future architecture consideration, not a Phase 2 change:** the classification report above already surfaced a distinct third case beyond "one pattern" and "pattern + modifier" — some exercises genuinely combine **two independent movement patterns** rather than a pattern and a positional modifier (e.g. `face-pull`: shoulder horizontal abduction *and* external rotation, both genuine movements — contrast with `incline-dumbbell-curl`: elbow flexion *plus* a lengthened-shoulder-position modifier, one movement). Per the architect's [Phase 2 Open Decisions](../architecture/PHASE-2-OPEN-DECISIONS.md) memo, this may eventually justify a richer `primary movement` / `secondary movement(s)` / `modifiers` structure, but it is explicitly deferred — no schema change here, and no records are being modified for this reason alone. Revisit only when application/decision-engine work demonstrates a concrete need.

### `equipment`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Format:** open vocabulary of physical equipment/implements (34 distinct values currently in use — `dumbbell`, `barbell`, `cable`, `machine`, `bench`, `bodyweight`, `smith machine`, `band`, etc., down to one-off values like `farmer's handles` or `offset-loaded handle`). Not a closed enum — new equipment is expected to appear as new exercises reference real gym implements — but values should be lowercase, singular-generic (`dumbbell` not `dumbbells`), and not duplicate an existing near-synonym without reason.
- **Decision-making impact:** yes — equipment-availability filtering is an obvious future application feature.
- **Required for `reviewed`:** yes

### `exercise_type`
- **Type:** string (scalar)
- **Required:** yes
- **Allowed values (closed enum):** `compound` | `isolation`
- **Decision-making impact:** yes
- **Required for `reviewed`:** yes

### `laterality`
- **Type:** string (scalar)
- **Required:** yes
- **Allowed values (closed enum):** `bilateral` | `unilateral` | `alternating`
- **Decision-making impact:** yes
- **Required for `reviewed`:** yes

### `coverage_categories`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Allowed values (closed vocabulary, 10 values currently in use):** `isolation`, `low-setup`, `low-fatigue`, `heavy-compound`, `stable-compound`, `lengthened-position-emphasis`, `skill-coordination`, `unilateral`, `equipment-limited-substitute`, `shortened-position-emphasis`
- **Note:** `isolation` appears both here and as an `exercise_type` value; they're independent fields answering different questions (mechanical role vs. a broader descriptive tag) and this overlap is intentional, not a duplication bug.
- **Evaluated for restructuring in Phase 2, Task I** — kept as a flat list; see the Task I write-up in the Phase 2 dev log for why.
- **Decision-making impact:** yes
- **Required for `reviewed`:** yes

### `resistance_profile`
- **Type:** string (scalar, YAML folded block `>-`)
- **Required:** yes
- **Purpose:** plain-language description of where in the range the movement is hardest/easiest, and how equipment choice changes that curve.
- **Decision-making impact:** somewhat — informs programming logic (e.g. matching resistance curve to a training goal) more than filtering logic.
- **Required for `reviewed`:** yes, must be a meaningful, non-generic description

### `stability_demand`, `skill_demand`, `setup_time`, `fatigue_cost`
- **Type:** string (scalar), each
- **Required:** yes, on all four
- **Allowed values (closed enum, shared across all four):** `low` | `medium` | `high`
- **Decision-making impact:** yes — these four are the fields most likely to drive "give me something I can do quickly/safely/with low fatigue cost" filtering.
- **Required for `reviewed`:** yes, on all four

### `best_used_when`
- **Type:** list of strings
- **Required:** yes, non-empty
- **Purpose:** describes training-stimulus fit (growth demand, pump, intensity fit, practical result) — explicitly **not** equipment/time logistics, which live in `coverage_categories`/`equipment`/`setup_time` instead. See each module's "A note on Best used when / Less suitable when" framing.
- **Decision-making impact:** yes, directly — this is the field a recommendation engine would match against a stated training goal.
- **Required for `reviewed`:** yes, must be specific and non-generic

### `less_suitable_when`
- **Type:** list of strings
- **Required:** conditionally — required to be present and meaningful where a real "don't reach for this when..." case exists; not every record needs one if there's genuinely no notable case (rare, but not required to be forced).
- **Decision-making impact:** yes
- **Required for `reviewed`:** yes, where applicable

### `mirror_effect`
- **Type:** string (scalar, YAML folded block `>-`)
- **Required:** yes as of the Phase 1 content pass — 100% of records currently have this populated.
- **Purpose:** practical, **non-guaranteed** visible/aesthetic outcome framing — what consistent training on this exercise tends to show up as, derived from the record's own `resistance_profile`/`primary_targets`/`movement_patterns`, not new research. See [`docs/dev/PHASE-1-reconciliation-and-taxonomy.md`](../dev/PHASE-1-reconciliation-and-taxonomy.md) for the full reasoning and evidence-honesty framing.
- **Decision-making impact:** yes — this is the field intended to power a future symptom-driven ("my arms look thin") lookup path, distinct from the mechanism-driven fields.
- **Required for `reviewed`:** yes, and must read as hedged ("tends to," "contributes to"), not as a guarantee — this is what "appropriately qualified" means in the Phase 2 Review Promotion Gate.

### `advantages`
- **Type:** list of strings
- **Required:** no — currently `[]` on every record in the dataset.
- **Status: decided, candidate for eventual retirement.** Per the architect's [Phase 2 Open Decisions](../architecture/PHASE-2-OPEN-DECISIONS.md) memo: the field is **not** being bulk-populated to satisfy the review gate — the information it would hold is already captured, distributed across `why_this_exists`, `best_used_when`, `limitations`, `resistance_profile`, `stability_demand`, `skill_demand`, `mirror_effect`, `complements`, and `overlaps_with`. The field stays in the schema for now so its removal is a controlled, deliberate step rather than a silent one; it will only be deleted through a proper schema-removal ADR, once it's confirmed nothing depends on it.
- **Decision-making impact:** none currently, and none expected — this field is not planned to carry unique information going forward.
- **Required for `reviewed`:** no. Its emptiness explicitly must **not** block `reviewed` status — this is a final decision, not a placeholder pending further review.

### `limitations`
- **Type:** list of strings
- **Required:** yes, non-empty — populated on all 123 records as of the Phase 1 (prior session) limitations pass.
- **Purpose:** genuine, defensible trade-offs (joint stress, load ceilings, technical/coordination demands, equipment dependency, common failure modes) — not fabricated cautions.
- **Decision-making impact:** yes
- **Required for `reviewed`:** yes

### `technique_cues`
- **Type:** list of strings
- **Required:** no — currently `[]` on every record.
- **Required for `reviewed`:** no, per current practice — see Task D

### `common_mistakes`
- **Type:** list of strings
- **Required:** no — currently `[]` on every record.
- **Required for `reviewed`:** no, per current practice — see Task D

### `programming_notes`
- **Type:** list of strings
- **Required:** no — `[]` is valid; populated with 1+ folded-block entries on a minority of records where there's a specific programming call-out (e.g. an evidence caveat that belongs in programming context, not `evidence_notes` itself).
- **Note:** Phase 2's schema audit found and fixed 4 records where this had drifted to a scalar string instead of a list (`preacher-curl`, `standing-calf-raise`, `romanian-deadlift`, `seated-leg-curl`) — exactly the kind of type violation `validate-data` now catches automatically.
- **Required for `reviewed`:** no

### The three relationship fields, defined precisely

Per the architect's [Phase 2 Open Decisions](../architecture/PHASE-2-OPEN-DECISIONS.md) memo, the three relationship fields have distinct, non-overlapping meanings — this is the authoritative definition going forward, replacing any looser prior framing:

- **`alternative`** = another exercise that can fill approximately the **same programming role** if the current one can't or shouldn't be used (equipment unavailable, joint intolerance, preference).
- **`complement`** = an exercise that adds a **materially different stimulus or coverage** alongside the current one — not a substitute, a pairing.
- **`overlaps_with`** = another exercise that already **covers substantially similar ground** to the current one.

Worked example from the architect's memo — Incline Dumbbell Press: *alternative* = Incline Smith Press (same role, different equipment); *complement* = Cable Fly (different stimulus, pairs well); *overlap* = another incline press with substantially similar role.

### `alternatives`
- **Type:** list of strings
- **Required:** no
- **Status: decided — keep the field, do not bulk-populate.** `alternatives` is `[]` on all 123 records today. Per the architect's decision, this is **not** being retroactively filled across the dataset — use it selectively going forward, only when a genuine substitution relationship exists (see the definition above), and revisit more systematically during a future relationship/decision-engine phase. If later analysis proves it genuinely redundant with `complements`, it gets retired through an ADR, not deleted informally.
- **Required for `reviewed`:** no

### `complements`
- **Type:** list of strings
- **Required:** yes, non-empty on nearly every record (a handful of niche records reasonably have none)
- **Format — this is prose by convention, not IDs:** unlike `overlaps_with`, `complements` entries are almost entirely descriptive phrases ("A leg-curl pattern, since a hinge alone leaves knee flexion untrained"), not exercise-ID references. Only 3 of 236 entries dataset-wide happen to reference another record by ID (`hip-thrust`, `smith-machine-romanian-deadlift`, and one `cable-fly` reference in `chest.yaml`), and in each of those cases the ID still resolves. **`validate-data` treats `complements` as free text and does not require its entries to resolve as IDs** — that would be validating against the field's actual, intentional design, not a bug in it.
- **Meaning:** a materially *different* stimulus/coverage paired alongside this exercise — not a substitute. See the relationship-field definitions above.
- **Required for `reviewed`:** yes

### `overlaps_with`
- **Type:** list of strings
- **Required:** no — `[]` is valid and common (a genuinely standalone record with nothing that overlaps it).
- **Format — this is the actual ID-reference field:** same-file references are bare `id` strings (e.g. `chin-up-supinated`); cross-file references are quoted strings with a parenthetical module note (e.g. `"hammer-curl (arms module)"`), per the convention established and enforced in Phase 1's reconciliation pass. 233 of 233 non-empty entries in the current dataset are ID-like; this is a field where 100% resolvability is enforced by `validate-data`.
- **Meaning:** substantially similar ground already covered — distinct from `alternatives` (same role, used *instead*) and `complements` (different stimulus, used *alongside*). See the relationship-field definitions above.
- **Decision-making impact:** yes — this is the field a future "here's what else covers similar ground" or gap-detection feature reads.
- **Required for `reviewed`:** conditionally — required to resolve cleanly when non-empty; empty is fine.

### `evidence_notes`
- **Type:** list of strings
- **Required:** conditionally — required, non-empty, when the record makes a material empirical claim (a region/head-bias claim, a "commonly cited as X" framing, a stretch-mediated-hypertrophy claim, etc.); `[]` is correct and expected when the record makes no such claim.
- **Purpose:** real citations, honestly graded by evidence quality (EMG vs. hypertrophy trial vs. contested/unresolved), per ADR 0001's no-fabrication policy. See the two prior evidence-notes passes in `docs/dev/` history for the standard this was written to.
- **Decision-making impact:** yes — this is what makes a `reviewed` record trustworthy input to a future decision engine rather than just well-written prose.
- **Required for `reviewed`:** conditionally, as above — this is a judgment call each time, not a mechanical field-presence check, since forcing every record to have a non-empty `evidence_notes` would create pressure to fabricate one where none is needed.

### `review_status`
- **Type:** string (scalar)
- **Required:** yes
- **Allowed values (closed enum):** `draft` | `needs-review` | `reviewed`
- **Governance:** see [Task C](../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md) and the Phase 2 Review Promotion Gate in `docs/dev/` for what promotion to `reviewed` actually requires.
- **Decision-making impact:** yes, definitionally — only `reviewed` records may be consumed by future recommendation logic.
- **Required for `reviewed`:** N/A (this is the field itself)

## Summary table

| Field | Type | Required | Controlled vocabulary | Decision-relevant | Required for `reviewed` |
|---|---|---|---|---|---|
| `id` | string | yes | — | yes (join key) | yes |
| `name` | string | yes | — | no | yes |
| `summary` | string | yes | — | no | yes |
| `why_this_exists` | string | yes | — | no | yes |
| `body_regions` | list | yes | closed (11) | yes | yes |
| `primary_targets` | list | yes | open | yes | yes |
| `secondary_targets` | list | no | open | yes | conditional |
| `physique_targets` | list | no | IDs, must resolve to `data/programming/physique-targets.yaml` | yes | no |
| `movement_patterns` | list | yes | first item closed (49), rest open | yes | yes |
| `equipment` | list | yes | open | yes | yes |
| `exercise_type` | string | yes | closed (2) | yes | yes |
| `laterality` | string | yes | closed (3) | yes | yes |
| `coverage_categories` | list | yes | closed (10) | yes | yes |
| `resistance_profile` | string | yes | — | some | yes |
| `stability_demand` | string | yes | closed (3) | yes | yes |
| `skill_demand` | string | yes | closed (3) | yes | yes |
| `setup_time` | string | yes | closed (3) | yes | yes |
| `fatigue_cost` | string | yes | closed (3) | yes | yes |
| `best_used_when` | list | yes | — | yes | yes |
| `less_suitable_when` | list | conditional | — | yes | conditional |
| `mirror_effect` | string | yes | — | yes | yes |
| `advantages` | list | no | — | no (retirement candidate) | no |
| `limitations` | list | yes | — | yes | yes |
| `technique_cues` | list | no | — | no (unused) | no |
| `common_mistakes` | list | no | — | no (unused) | no |
| `programming_notes` | list | no | — | some | no |
| `alternatives` | list | no | — | yes (use selectively, not bulk) | no |
| `complements` | list | yes | free text by design | yes | yes |
| `overlaps_with` | list | no | IDs, must resolve | yes | conditional |
| `evidence_notes` | list | conditional | — | yes | conditional |
| `review_status` | string | yes | closed (3) | yes (definitional) | N/A |

## Resolved items (Phase 2 Open Decisions, architect-approved)

Both items below were open questions from the Phase 2 completion report; both are now decided per [`docs/architecture/PHASE-2-OPEN-DECISIONS.md`](../architecture/PHASE-2-OPEN-DECISIONS.md) — see that document and the field entries above for the full reasoning.

- **`advantages`** stays in the schema as a retirement candidate. Not bulk-populated (its content is already distributed across other fields), and its emptiness does not block `reviewed` status. Removal, if it happens, goes through a schema-removal ADR.
- **`alternatives`** stays in the schema, is now precisely defined (see "The three relationship fields, defined precisely" above), and will be populated selectively — only where a genuine substitution relationship exists — rather than bulk-filled. Revisit more systematically in a future relationship/decision-engine phase.

## Open items still outstanding

- **`technique_cues`, `common_mistakes` are entirely unused (0/123 records).** Not addressed by the Phase 2 Open Decisions memo, which only covered `advantages` and `alternatives`. These remain not required for `reviewed`, per [ADR 0002](../adr/0002-empty-field-semantics.md).
- **Multiple genuine movement patterns vs. pattern + modifier** (e.g. `face-pull` vs. `incline-dumbbell-curl`) — recorded as a future architecture consideration in the `movement_patterns` entry above, explicitly deferred past Phase 2.
