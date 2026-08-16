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

*Not yet started.*
