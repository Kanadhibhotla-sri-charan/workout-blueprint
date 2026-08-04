# Physique Blueprint

A decision-support system for exercise selection.

Physique Blueprint helps people answer **what exercise should I choose, and why?** It translates training knowledge into clear, context-aware guidance rather than treating exercises as interchangeable entries in a catalogue.

## Documentation map

- [Product Design Document](docs/PDD/PDD.md) — vision, decision logic, UX, governance, and roadmap.
- [Knowledge Manual](docs/knowledge-manual/) — the user-facing source of truth for muscles, movements, and exercises.
- [Decision Records](docs/adr/) — durable rationale for consequential product and data decisions.
- app/ — future application implementation.

## Foundation workflow

1. Define the taxonomy and exercise record standard.
2. Add reviewed exercise records in that standard.
3. Build the interface from structured records.
4. Add decision features only after the underlying data is trustworthy.

## Contribution rules

- Every exercise or variation must answer: **when would someone choose this over an alternative?**
- Use plain language first; add technical detail only when useful.
- Record uncertainty rather than claiming false precision.
- Do not provide medical diagnosis or rehabilitation prescriptions.
