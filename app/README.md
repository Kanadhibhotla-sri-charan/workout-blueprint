# Physique Blueprint — App

The Blueprint MVP: a mobile-first React/TypeScript/Vite application that renders the canonical exercise dataset (`../data/exercises/*.yaml`) and includes a deterministic, rule-based Decision Maker. Built per [`docs/architecture/PHASE-3-MVP.md`](../docs/architecture/PHASE-3-MVP.md); progress logged in [`docs/dev/PHASE-3-mvp.md`](../docs/dev/PHASE-3-mvp.md).

The app is a **renderer of knowledge, not a second knowledge base** — it never hand-duplicates exercise content. See "Data" below.

## Run it

```
cd app
npm install
npm run dev
```

Opens at `http://localhost:5173` by default. `npm run build` produces a static production build in `app/dist/`; `npm run preview` serves that build locally. No backend, database, or network access is required — the app runs entirely from the repository's local YAML data.

## Data

`npm run dev` and `npm run build` first run `scripts/generate-data.mjs`, which loads and validates every record in `../data/exercises/*.yaml` (reusing the same `../scripts/lib/` logic `npm run validate-data` uses at the repo root) and writes `src/data/exercises.generated.json`. That file is gitignored and regenerated on every run — never hand-edit it, and never edit YAML data from inside `app/`. If the dataset fails validation, the build fails rather than shipping bad data.

## Structure

```
src/
├── types/       canonical Exercise type (mirrors the 30-field schema)
├── data/        generated JSON + typed loader
├── engine/      deterministic decision engine (pure functions, no UI)
├── components/  shared UI pieces
├── pages/       Home, Exercise List, Exercise Detail, Decision Maker
└── utils/       search/filter helpers
```
