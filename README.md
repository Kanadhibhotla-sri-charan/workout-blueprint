# Physique Blueprint

A decision-support system for exercise selection.

Physique Blueprint helps people answer **what exercise should I choose, and why?** It translates training knowledge into clear, context-aware guidance rather than treating exercises as interchangeable entries in a catalogue.

**Production app:** https://kanadhibhotla-sri-charan.github.io/workout-blueprint/

**Version:** [`v1.0.0`](https://github.com/Kanadhibhotla-sri-charan/workout-blueprint/releases/tag/v1.0.0) — the first production release, per [`docs/architecture/DEPLOYMENT-AND-PRODUCTION-READINESS.md`](docs/architecture/DEPLOYMENT-AND-PRODUCTION-READINESS.md) §14. Every deployment is traceable to the `main` commit the [deploy workflow](.github/workflows/deploy-pages.yml) built it from.

## Documentation map

- [Product Design Document](docs/PDD/PDD.md) — vision, decision logic, UX, governance, and roadmap.
- [Knowledge Manual](docs/knowledge-manual/) — the user-facing source of truth for muscles, movements, and exercises.
- [Decision Records](docs/adr/) — durable rationale for consequential product and data decisions.
- [Architecture specs](docs/architecture/) — the phase-by-phase specs the app and data model were built against; see [`docs/dev/`](docs/dev/) for the execution log against each one.
- [app/](app/README.md) — the Blueprint MVP application (React/TypeScript/Vite).

## Local setup

```
git clone https://github.com/Kanadhibhotla-sri-charan/workout-blueprint.git
cd workout-blueprint
cd app
npm install
npm run dev
```

Opens at `http://localhost:5173`. No backend, database, or account is required — the app runs entirely from the repository's local YAML data (see [Data locations](#data-locations) below). Full run/build/test detail lives in [`app/README.md`](app/README.md).

## Running tests

```
cd app
npm run test      # Vitest — engine, programming, and UI golden-slice tests
npm run lint       # oxlint
npm run build      # tsc -b && vite build — type-checks and produces app/dist/
cd ..
npm run validate-data   # schema/taxonomy/relationship validation for data/exercises/**
```

All four must pass before any change is considered done; CI (`.github/workflows/validate-data.yml`) enforces data validation on every push/PR that touches `data/exercises/**` or `scripts/**`.

## Production build & deployment

`npm run build` (from `app/`) produces a static production bundle in `app/dist/` — plain HTML/CSS/JS with no server-side component. Pushing to `main` triggers [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which builds the app and publishes `app/dist/` to GitHub Pages at the production URL above. Every deployment is traceable to the `main` commit it was built from (visible in the Actions run history).

To deploy manually instead of via a `main` push, run the "Deploy to GitHub Pages" workflow from the Actions tab (`workflow_dispatch`).

## Data locations

Physique Blueprint is a **renderer of knowledge, not a second knowledge base** — the app never hand-duplicates exercise content; everything below is canonical YAML, validated by `npm run validate-data` and compiled into the app at build time.

| What | Location |
|---|---|
| Exercise records (30-field schema) | `data/exercises/*.yaml` |
| Aesthetic outcomes (the "what visual problem?" entry points, incl. `preferred_characteristics` and `exercise_roles`) | `data/programming/aesthetic-outcomes.yaml` |
| Physique targets / functional goals | `data/programming/` |
| Programming rules (rep ranges, programming profiles, intensity-technique eligibility) | `data/programming/programming-profiles.yaml`, `data/programming/rep-ranges.yaml`, `data/programming/intensity-techniques.yaml` |
| Schema definition | [`docs/knowledge-manual/SCHEMA.md`](docs/knowledge-manual/SCHEMA.md) |

### Safe knowledge-update process

1. Edit the canonical YAML directly under `data/` — never edit `app/src/data/*.generated.json` (gitignored, regenerated on every build).
2. Run `npm run validate-data` from the repo root; fix any schema, taxonomy, or referential-integrity violation it reports before proceeding.
3. From `app/`, run `npm run test` — the decision-engine and UI golden-slice tests will catch ranking/programming regressions caused by the data change.
4. Commit the YAML change together with any test updates it required, with a message describing the concrete defect or gap being fixed (see [`docs/real-world-feedback/`](docs/real-world-feedback/) for the intended source of these changes post-launch).
5. Push to `main` (or merge a PR into it) to deploy automatically.

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
