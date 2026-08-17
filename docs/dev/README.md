# Dev Log

Tracks execution of the architecture specs in `docs/architecture/` phase by phase: [`KNOWLEDGE-INTEGRITY-REMEDIATION.md`](../architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md) (Phases 0–1), [`PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md`](../architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md) (Phase 2), [`PHASE-3-MVP.md`](../architecture/PHASE-3-MVP.md) (Phase 3), and Phase 4's three specs in sequence — [`PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md`](../architecture/PHASE-4-PHYSIQUE-TARGET-AND-HYPERTROPHY.md) (original), [`PHASE-4-REVISED-AESTHETIC-OUTCOME.md`](../architecture/PHASE-4-REVISED-AESTHETIC-OUTCOME.md) (revision adding the Aesthetic Outcome layer), and [`PHASE-4-CORRECTIONS.md`](../architecture/PHASE-4-CORRECTIONS.md) (two architectural corrections applied mid-build).

Each phase file records, for that phase only:

- **What changed** — the concrete edits made to the repo.
- **Decisions made** — by the user, by Claude, or jointly, including the reasoning.
- **Pending decisions** — anything that still needs the user's call before work can continue, listed explicitly rather than assumed.

Phases are numbered in the order they were actually worked, not necessarily in the Task A–J order the remediation plan lists them in — the plan defines the required *sequence* (canonical identity → schema → taxonomy → review status → reconciliation → validation), but a phase file is created whenever a distinct chunk of that work lands, which may bundle or split tasks differently.

## Phases

| Phase | Summary | Status |
|---|---|---|
| [0](PHASE-0-plan-adoption.md) | Remediation plan adopted; current-state audit against Tasks A–J; four pending decisions raised and resolved | Complete |
| [1](PHASE-1-reconciliation-and-taxonomy.md) | Task B (prose/YAML reconciliation), Task F (movement-pattern taxonomy normalization), and the `mirror_effect` content pass | Complete |
| [2](PHASE-2-schema-and-data-governance.md) | Schema frozen (`SCHEMA.md`), Review Promotion Gate built and run, ADR 0002 (empty-field semantics), `validate-data`/`data-report` tooling, coverage-category evaluation, CI integration, both pending decisions resolved by the architect's [Open Decisions memo](../architecture/PHASE-2-OPEN-DECISIONS.md) | **Architecturally closed** |
| [3](PHASE-3-mvp.md) | Blueprint MVP application (`app/`) — Knowledge Explorer, Exercise Detail, Search/Filters, deterministic Decision Maker, built incrementally as 3A–3I | **Complete** — see [Definition of Done](reports/PHASE-3-DEFINITION-OF-DONE.md) |
| [4](PHASE-4-physique-target-and-hypertrophy.md) | Physique-target taxonomy + hypertrophy programming layer, then a revised Aesthetic Outcome layer (26 outcomes / 25 targets / 7 functional goals across all 11 body regions) with an explicit primary/supporting target model, built vertical-slice-first with three required golden slices | **Complete** — see [Definition of Done](reports/PHASE-4-DEFINITION-OF-DONE.md) |
