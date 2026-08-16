# Phase 3 — Blueprint MVP

**Trigger:** Architect-supplied [Phase 3 spec](../architecture/PHASE-3-MVP.md). User approved the [implementation plan](../architecture/PHASE-3-MVP.md) with these directives: proceed straight to 3A with no further planning phase, build incrementally per the 3A–3I sequence, define deterministic structural-alternative and equipment-feasibility rules explicitly before the decision engine (no fuzzy matching), keep the MVP local/offline with no backend/API/LLM, log each checkpoint here, and don't expand the knowledge base unless a genuine implementation blocker turns up.

This is the first executable *application* in the repo (`app/`) — everything before Phase 3 was docs, data, and validation tooling.

## 3A — Application skeleton

**Date:** 2026-08-16

### What changed

- Scaffolded `app/` with Vite + React + TypeScript (`npm create vite@latest app -- --template react-ts`), then stripped the template demo content (counter, logos, docs/social links) — nothing in the shipped app is Vite boilerplate.
- Added `react-router-dom` and set up real routes rather than a single-page state switch, so the app has proper deep links and mobile back-button behavior from the start: `/` (Home), `/exercises` (Exercise List), `/exercises/:id` (Exercise Detail), `/decide` (Decision Maker), plus a catch-all not-found route.
- `src/components/Layout.tsx` — shared header/nav shell (`Outlet`-based) used by every route.
- `src/pages/` — placeholder components for all four routes plus not-found; each will be filled in by its corresponding checkpoint (3C, 3D, 3F/3G).
- `src/types/`, `src/data/`, `src/engine/`, `src/components/`, `src/pages/`, `src/utils/` — the directory boundaries from the approved plan (data / knowledge interpretation / decision logic / presentation stay separable), created now so later checkpoints have a fixed place to land rather than improvising structure mid-phase.
- `src/types/exercise.ts` — a `TypeScript` `Exercise` interface mirroring all 30 canonical schema fields exactly (cross-checked field-for-field against `scripts/lib/taxonomy.js` and `SCHEMA.md`), plus the generator-added `_file` field. No app code will define exercise fields anywhere else.
- `src/index.css` — a real (not template) design-token base: light/dark CSS custom properties, a mobile-first reset, and a 44px minimum touch-target rule applied globally to interactive elements from the start, rather than retrofitted in the 3H mobile pass. Page-specific styling is deferred to the checkpoints that add that content.
- `app/README.md` — run instructions (`npm install && npm run dev`), the data-generation contract, and the directory layout. Root `README.md` updated to point at it.
- `app/.gitignore` extended with `src/data/exercises.generated.json` (doesn't exist yet — added now so 3B's generator output is never accidentally committed).

### Verified

- `npx tsc -b` — clean, no type errors.
- `npm run build` — succeeds, produces `dist/`.
- `npm run dev` — serves the app; confirmed the HTML shell loads correctly at `http://localhost:5173`. Full page rendering will be visually verified once 3C gives the Home page real content — right now every route is an intentional one-line placeholder.

### Decisions made

- **React Router over manual state-based view switching** — the spec doesn't mandate a router, but real routes give free deep-linking to a specific exercise (useful mid-workout: "send me a link to this exercise") and correct mobile back-button behavior, at the cost of one small, standard dependency. Consistent with the approved plan.
- **`app/` gets its own `package.json`**, separate from the root one (which holds only the `validate-data`/`data-report` tooling) — approved in the plan's location question. Keeps the frontend's dependency tree from ever touching the data-validation tooling's, and vice versa.
- Mobile-first CSS foundations (touch targets, responsive tokens) were put in place at 3A rather than deferred entirely to 3H, since retrofitting touch-target sizing across already-built components is more error-prone than starting with the constraint. 3H is still where the full responsive/usability pass and audit happens.

### Pending decisions

None from this checkpoint.

---

## 3B — Load canonical data

**Date:** 2026-08-16

### What changed

- `app/scripts/generate-data.mjs` — the build-time YAML→JSON generator described in the approved plan. It `require`s (via `node:module`'s `createRequire`, since the script is ESM and `scripts/lib/*.js` is CommonJS) the *existing* `scripts/lib/load-records.js` and `scripts/lib/validate.js` from the repo root — no data-loading or validation logic is duplicated between the app and the root tooling. Runs the exact same validation `npm run validate-data` runs; if the dataset fails (schema, taxonomy, relationship, or governance violations, or a file load error), the script exits non-zero with the failing issues printed, and does not write output. Normalizes each record's generator-added `_file` field down to a plain basename (`chest.yaml`, not a cwd-relative path) and sorts by `id` for a stable diff-friendly output. Writes `app/src/data/exercises.generated.json`.
- Wired as `predev` and `prebuild` in `app/package.json`, plus a standalone `generate-data` script for manual runs — the data is always regenerated from current YAML before the app runs or builds, never hand-maintained.
- `app/src/data/index.ts` — the typed loader every page/component/engine module will import from. Exposes `exercises: Exercise[]`, `getExerciseById()`, `getExercisesByBodyRegion()`, and a derived `bodyRegions` list. This is the *only* file in the app that touches the generated JSON directly.
- `app/tsconfig.app.json` — added `resolveJsonModule: true` so the generated JSON can be imported and typed directly.
- `app/.gitignore` (already added in 3A) covers `src/data/exercises.generated.json` — confirmed it's correctly excluded from `git status` after generation.

### Verified

- `npm run generate-data` (from a clean state, output file deleted first): succeeds, produces 123 records, matches the root validator's count exactly.
- **Confirmed the validation gate actually blocks bad data, not just passes on clean data** — same discipline as the Phase 2 validator check: made a plain-copy backup of `calves.yaml`, injected an invalid `exercise_type: bogus-type`, ran `npm run generate-data`, confirmed it printed the exact violation and exited 1 without writing output, then restored the file from the backup and confirmed `git diff --stat` showed zero changes and generation succeeded again with all 123 records.
- Full pipeline end-to-end: deleted the generated file, ran `npm run build` from scratch — the `prebuild` hook regenerated it automatically before `vite build` ran, and the build succeeded.
- **Visually verified in a real browser**, not just asserted from build output: temporarily rendered `exercises.length` and `bodyRegions` on the Home page, started the dev server, and took a Playwright screenshot confirming "123 exercises across arms, back, calves, chest, core, forearms, hamstrings, hips, neck, quads, shoulders" rendered correctly. Reverted the Home page to its 3A placeholder afterward — real Home page content is 3C's job, not 3B's.
- `npm run validate-data` at the repo root still passes (123/123, 0 issues) — confirming the calves.yaml test edit left no trace.
- `npx tsc -b` and `npm run build` both clean after the revert.

### Decisions made

- **Generated JSON is gitignored, not committed** — per the plan, it's a mechanical transform of `data/`, and committing it would let it silently drift from the YAML between commits. This does mean a fresh clone must run `npm install && npm run dev` (or `build`) at least once before the data exists, which is documented in `app/README.md`.
- **Reused `scripts/lib/` via `createRequire` rather than rewriting loading/validation in TypeScript** — keeps a single implementation of "what makes a record valid" for the whole repo (root CLI tooling and the app both call the same code), so the two can never silently diverge on what counts as a violation, which was the exact failure mode Phase 2's `validate-data`/`data-report` split was designed to avoid.

### Pending decisions

None from this checkpoint.

---

## 3C — Knowledge Explorer

*Not yet started.*
