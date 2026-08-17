# Programming Knowledge

Human-readable explanation of the hypertrophy-programming layer added in Phase 4. The **authoritative, machine-readable** data lives in [`data/programming/`](../../../data/programming/) — this page explains what's there and why; it does not duplicate the actual guidance.

## Why this exists

Phase 3's Decision Maker answers *which exercise*. Phase 4 adds *how to train it for growth* — sets, reps, RIR, frequency, and progression — without turning the application into an AI coach. Every number the engine produces traces back to one of the files below through an explicit, deterministic rule; nothing is inferred or generated per-request. See [`docs/architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md`](../../architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md) for the full spec and [ADR 0003](../../adr/0003-physique-targets-field.md) for the taxonomy's schema rationale.

## The five files

- **`aesthetic-outcomes.yaml`** — the authoritative definition of the Aesthetic Outcome layer added by the revised Phase 4 spec: canonical, mirror-recognizable visual characteristics (e.g. "Chest looks flat from the side"), organized by region and viewpoint. Each outcome references `physique-targets.yaml` ids via an explicit `primary_targets`/`supporting_targets` split (Phase 4 Corrections) rather than a flat list — the primary target drives exercise selection, supporting targets broaden the candidate pool and are surfaced in the UI, and neither is ever silently discarded. See `docs/architecture/PHASE-4-REVISED-AESTHETIC-OUTCOME.md` and `docs/architecture/PHASE-4-CORRECTIONS.md`, and `docs/dev/reports/PHASE-4-AESTHETIC-TAXONOMY-PROPOSAL.md` for the audit that grounds every outcome in real exercise data rather than invented categories.
- **`physique-targets.yaml`** — the authoritative definition of what a physique target *means* (e.g. "Upper Pec": the clavicular portion of the pectoralis major, the visible outcome it maps to). Exercise records reference these ids via their own `physique_targets` field; this file does not list exercises, to avoid a second taxonomy that could drift out of sync. See ADR 0003.
- **`global-principles.yaml`** — RIR, weekly volume, frequency, and progression guidance that applies broadly, not per-exercise or per-target.
- **`rep-ranges.yaml`** — default rep-range guidance keyed by `exercise_type` and `coverage_categories` (fields every exercise already has), with a documented override mechanism for the rare case a specific exercise needs to deviate from its category's default. The override list starts empty and stays empty unless a genuine, defensible distinction requires one — it is not meant to be populated per-exercise.
- **`intensity-techniques.yaml`** — a small catalog of optional techniques (drop sets, rest-pause, myo-reps for the Phase 4 v1 slice), each with what it is, when it may help, when not to use it, and its fatigue/time cost. The engine suggests at most one, only when a clear, deterministic condition is met — never presented as a required or automatically-superior addition.

## Evidence basis

Per the architect's approval of the "practical consensus ranges, lightly sourced" approach: this guidance reflects broadly-converged, widely-taught hypertrophy-coaching consensus, not per-line research citations the way `data/exercises/*.yaml`'s `evidence_notes` field works. Every range is a **starting point to adjust**, not an exact physiological law — see `global-principles.yaml`'s `wording_rules` for the specific language the application is required to use (and avoid) when presenting these numbers.

## What's deliberately not here

Per the Phase 4 spec's explicit scope boundary: no periodization model beyond simple double progression, no recovery/fatigue prediction, no training-experience (beginner/intermediate/advanced) personalization, no fiber-type-based rep prescriptions. If real-world use later demonstrates a need for any of these, they're a future decision, not an oversight here.
