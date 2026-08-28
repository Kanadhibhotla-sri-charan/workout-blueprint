# Physique Blueprint — App

The Blueprint MVP: a mobile-first React/TypeScript/Vite application that renders the canonical exercise dataset (`../data/exercises/*.yaml`) and includes a deterministic, rule-based Decision Maker. Built per [`docs/architecture/PHASE-3-MVP.md`](../docs/architecture/PHASE-3-MVP.md); progress logged in [`docs/dev/PHASE-3-mvp.md`](../docs/dev/PHASE-3-mvp.md).

The app is a **renderer of knowledge, not a second knowledge base** — it never hand-duplicates exercise content. See "Data" below.

## Run it

This app's data-generation step (`predev`/`prebuild`/`pretest`) calls directly into the repo root's `scripts/lib/` (which depends on the root's own `js-yaml`, declared in the repo-root `package.json`, not this one). Install the root dependencies once before installing this directory's — see the [root README's Local setup](../README.md#local-setup) for why.

```
cd ..            # repo root, if not already there
npm install       # root dependencies (js-yaml) — only needed once
cd app
npm install        # app dependencies
npm run dev
```

Opens at `http://localhost:5173` by default. `npm run build` produces a static production build in `app/dist/`; `npm run preview` serves that build locally. `npm run test` runs the Vitest suite (engine correctness, including the deterministic decision-engine rules documented in [`docs/dev/reports/DECISION-ENGINE-RULES.md`](../docs/dev/reports/DECISION-ENGINE-RULES.md)). No backend, database, or network access is required — the app runs entirely from the repository's local YAML data.

Production deployment (GitHub Pages, triggered on push to `main`) is documented in the [root README](../README.md#production-build--deployment). Note that `vite.config.ts` sets `base: '/workout-blueprint/'` for that deployment, and `main.tsx` passes it to `BrowserRouter` as `basename` — `npm run dev` still works at `/` because `import.meta.env.BASE_URL` resolves differently per mode.

## Data

`npm run dev` and `npm run build` first run `scripts/generate-data.mjs`, which loads and validates every record in `../data/exercises/*.yaml` (reusing the same `../scripts/lib/` logic `npm run validate-data` uses at the repo root) and writes `src/data/exercises.generated.json`. That file is gitignored and regenerated on every run — never hand-edit it, and never edit YAML data from inside `app/`. If the dataset fails validation, the build fails rather than shipping bad data.

## Structure

```
src/
├── types/       canonical Exercise type (mirrors the 30-field schema)
├── data/        generated JSON + typed loader
├── engine/      deterministic decision engine (pure functions, no UI) — see
│                ../docs/dev/reports/DECISION-ENGINE-RULES.md for the rules
├── components/  shared UI pieces
├── pages/       Home, Exercise List, Exercise Detail, Decision Maker
└── utils/       search/filter helpers
```
