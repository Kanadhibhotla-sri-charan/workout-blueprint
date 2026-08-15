# Dev Log

Tracks execution of [`docs/architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md`](../architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md) phase by phase.

Each phase file records, for that phase only:

- **What changed** — the concrete edits made to the repo.
- **Decisions made** — by the user, by Claude, or jointly, including the reasoning.
- **Pending decisions** — anything that still needs the user's call before work can continue, listed explicitly rather than assumed.

Phases are numbered in the order they were actually worked, not necessarily in the Task A–J order the remediation plan lists them in — the plan defines the required *sequence* (canonical identity → schema → taxonomy → review status → reconciliation → validation), but a phase file is created whenever a distinct chunk of that work lands, which may bundle or split tasks differently.

## Phases

| Phase | Summary | Status |
|---|---|---|
| [0](PHASE-0-plan-adoption.md) | Remediation plan adopted; current-state audit against Tasks A–J; four pending decisions raised and resolved | Complete |
| [1](PHASE-1-reconciliation-and-taxonomy.md) | Task B (prose/YAML reconciliation) and Task F (movement-pattern taxonomy normalization) | Complete |
