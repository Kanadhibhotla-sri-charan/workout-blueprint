# Phase 5 — All-Round Development Packages + Advanced Visual UI

Spec: [`docs/architecture/PHASE-5-ALL-ROUND-DEVELOPMENT.md`](../architecture/PHASE-5-ALL-ROUND-DEVELOPMENT.md). Implemented in the order the spec's §26 lays out (5-1 through 5-16), on branch `claude/repo-overview-nnuwoq`, after v1.0.0 was live in production.

## What changed

### 5-1 — Package data model

- `app/src/types/packages.ts` (new): `DevelopmentPackage`, `PackageExerciseEntry`, `MuscleGroupDefinition`, `DevelopmentPackageCatalog`, `PackageLevel`, `PackageRole`. `PackageRole` deliberately reuses the exact same four-value vocabulary (`primary | direct | secondary | supporting`) Phase 4C Final Correction's `AestheticOutcome.exercise_roles` already defined — per spec §21's "reuse existing knowledge," not a new taxonomy, just a new context (package membership vs. diagnostic outcome).
- `app/src/types/programming.ts`: `ProgrammingData` gained a `developmentPackages: DevelopmentPackageCatalog` field.
- `data/programming/development-packages.yaml` (new): two top-level lists.
  - `muscle_groups`: 11 entries, each a small grouping over the *existing* `physique-targets.yaml` taxonomy (e.g. `chest` → `[upper-pec, mid-pec, lower-pec]`; `biceps`/`triceps` split out of the coarser `arms` body_region because the underlying physique_targets already distinguish them). Not a new anatomy taxonomy — every `target_ids` entry is a real, pre-existing target id.
  - `packages`: 22 entries (11 muscle groups × `efficient`/`complete`). Every `exercise_id` references a real exercise; nothing here re-describes an exercise or re-derives a target.

Key modeling decisions, each made to avoid duplicating knowledge the app already has elsewhere:

- **`reps` is authored per exercise, but never invented** — copied from that exercise's own resolved Programming Profile `primary_range` (`programming-profiles.yaml`, via the existing `resolveProgrammingProfile`) at authoring time. `scripts/validate-data.js` now cross-checks this on every run (see 5-5) so it can never silently drift from what the Decision Maker itself would say about the same exercise.
- **`rir` is the single global RIR value** (`global-principles.yaml`'s `rir.typical_working_range`, `"1-3"`) applied to every exercise — matching how `programmingEngine.ts`'s `buildProgramming()` already treats RIR everywhere else in the app (one global value, never varied per profile). Inventing a per-exercise RIR distinction here would have been a new, unreviewed modeling dimension.
- **Weekly direct volume is *not* stored** — it's `session sets × frequency`, computed by the engine (5-6/5-7/5-8), exactly matching spec §7's own worked example (`3+3+2=8` session sets, `2×/week` → `16` weekly). Storing it separately would duplicate what `sets` and `frequency` already say.

### 5-4 — Package knowledge for all 11 muscle groups

Chest, Shoulders, Back, Biceps, Triceps, Forearms, Quads, Hamstrings, Glutes, Calves, Core — the exact list spec §12 names. Neck was deliberately excluded (not in that list). Every package's `rationale` field explains why its exercises coexist rather than duplicate each other (spec §10), grounded in real facts already in the dataset — e.g. Shoulders' packages deliberately give front-delt no dedicated volume, citing `physique-targets.yaml`'s own note that it's "rarely the limiting factor" since chest/shoulder pressing already loads it; Biceps' packages pair a curl with a hammer curl because `biceps` and `brachialis-arm-thickness` are different physique targets, not the same muscle under two names.

Every Complete package is a strict superset in ambition of its Efficient sibling (more exercises, `packageEngine.test.ts` asserts this for all 11 groups) — never padded with a near-duplicate movement just to be longer (spec §27 non-goal).

### 5-5 — Coverage/redundancy validation

- `scripts/lib/load-programming.js`: added `loadProgrammingProfiles()` and `loadDevelopmentPackages()`, mirroring the existing `loadPhysiqueTargets()`/`loadAestheticOutcomes()` pattern.
- `scripts/lib/validate.js`: added a JS re-implementation of `resolveProgrammingProfile()`'s classification logic (duplicated deliberately — `validate-data.js` is a build-time Node/CommonJS script that can't import the app's TypeScript engine directly; a comment flags that any change to the TS version must be mirrored here) plus a full validation pass over `development-packages.yaml`:
  - `muscle_groups`: unique ids, non-empty names, `target_ids` resolve to real `physique-targets.yaml` ids.
  - `packages`: unique ids, `muscle_group` resolves, `level` ∈ `{efficient, complete}`, required non-empty strings (`display_name`/`objective`/`rationale`), positive `frequency.sessions_per_week`.
  - Per package: **at least 2 distinct exercises** (spec §2's core requirement), every `exercise_id` resolves, no exercise repeated within a package, `order` positive and unique, `sets` positive, `reps`/`rir` match a `"min-max"` pattern, `role` ∈ the four-value vocabulary, non-empty `contribution`, and — the drift guard — authored `reps` must equal the exercise's own resolved Programming Profile `primary_range`.
- **Proven, not just trusted**: deliberately injected three violations (a duplicated exercise, an invalid role, and a reps/profile mismatch) into a scratch copy of the YAML and confirmed all three were caught with the expected messages, before reverting to the clean file — same discipline every prior phase's validator work followed. This run is also what caught a real authoring mistake: `cable-fly`'s `stability_demand: medium` resolves it to `elevated-stability-isolation` (rep range `8-15`), not `moderate-hypertrophy-isolation` (`10-20`) as first assumed — fixed in both `chest-efficient` and `chest-complete`.

### 5-6/5-7/5-8 — Package programming resolution engine

`app/src/engine/packageEngine.ts` (new): `getMuscleGroups()`, `getMuscleGroupById()`, `getPackagesForMuscleGroup()`, `resolvePackage(packageId)`. `resolvePackage` joins the package's authored data with the real `Exercise` records it references, and for intensity-technique guidance calls the *existing, unmodified* `buildProgramming()` from `programmingEngine.ts` per exercise — reusing the same eligibility/ranking logic the Decision Maker uses, rather than a second implementation. It also computes:

- `sessionDirectSets` / `weeklyDirectSets` — `session sets × frequency`, per spec §7.
- `targetCoverage` — for every target belonging to the package's muscle group, whether *any* package exercise's own `physique_targets` actually includes it. A real, derived boolean per target, never a fabricated percentage — spec §13's "the exact numbers must come from the package data."

### 5-9/5-10/5-11 — "Build the Muscle" UI

- `app/src/pages/BuildMuscleIndexPage.tsx` (new, route `/build`): the 11 muscle groups as cards, each previewing its Efficient package's exercise count and weekly volume.
- `app/src/pages/BuildMusclePackagePage.tsx` (new, route `/build/:muscleGroupId`, level via `?level=efficient|complete`): package header/objective, Efficient/Complete level tabs, a coverage panel (one row per real target, filled bar = covered), a volume/frequency panel, an Efficient-vs-Complete comparison table (spec §17), the ordered exercise cards (order badge, sets×reps×RIR, role pill, contribution text, a fatigue-cost demand bar, and a collapsible "Why this exercise?" — the same `<details>` pattern the Decision Maker's trace block already uses), the package's overall rationale, and a collapsible progression note.
- `app/src/App.tsx` / `app/src/components/Layout.tsx`: new routes plus a "Build" nav link.
- `app/src/pages/HomePage.tsx`: added the two-path picker spec §11 describes ("Fix a Visual Problem" → `/decide`, "Build the Muscle" → `/build`) above the existing Explore/Search section, which is otherwise untouched.

### 5-12 — Coverage/volume/frequency graphics

All graphics are derived, not decorative-only, per spec §15's "every visual should answer a useful question": coverage bars answer "is this target actually trained by an exercise in this package," the comparison table answers "what do I give up/gain choosing Efficient vs. Complete," and the per-exercise fatigue bar (3-segment, from the real `fatigue_cost` enum) answers "how much does this specific exercise cost." No invented 0–100% scores anywhere.

### 5-13 — Mobile/desktop polish

Verified via a real production build (`vite build` + `vite preview`, matching how deployment-readiness testing was done for v1.0.0) and headless Chromium at 375px, 390px, and 1280px desktop, across **all 22 packages** (both levels × all 11 groups): zero horizontal overflow, zero console errors, cards stack cleanly, level tabs and coverage bars stay legible, "Why this exercise?" collapses correctly. Screenshotted in both light and dark color schemes — the existing `prefers-color-scheme` system continues to drive theming; Phase 5 added no new theme, only new component classes that reuse the existing `--accent`/`--border`/`--bg-raised`/`--space-*` tokens.

### 5-14/5-15 — Regression + validation pass

`npm run validate-data` (root), `npx tsc -b --force`, `npm run lint`, and the full Vitest suite all pass: **153/153 tests** (147 pre-existing + 6 new in `packageEngine.test.ts`). No existing file outside of `app/src/types/programming.ts` (one added field), `app/src/App.tsx`/`Layout.tsx`/`HomePage.tsx` (new routes/nav/home cards), `app/scripts/generate-data.mjs` (one added loader line), and `scripts/lib/{validate,load-programming}.js` (additive validation) was modified — `decisionEngine.ts`, `programmingEngine.ts`, and every existing data file are untouched, so every named regression in spec §24 (brachialis side-thickness, lower-calf fullness, calf width, upper-trap fullness, above-knee separation, shoulder width, back width-vs-thickness, programming-profile classification, intensity-technique selection, the `unspecified` role fallback) is still covered by its original, unmodified test and still green.

`packageEngine.test.ts` adds: all 11 muscle groups present; every group has exactly an efficient+complete pair; unknown package id resolves to `null`; the spec's own `chest-efficient` weekly-volume worked example reproduces exactly (`8` session / `16` weekly); every one of the 22 packages has ≥2 distinct exercises, correctly ordered, correct set arithmetic, and full real target coverage (with the one documented exception — shoulders' deliberate front-delt omission); every resolved exercise gets a non-empty intensity-technique explanation; every Complete package has strictly more exercises than its Efficient sibling.

### 5-16 — Real-world UX pass

Full click-through in a real browser (not just automated checks): home → Build the Muscle → muscle-group grid → a package page → level toggle → expand "Why this exercise?" → link out to an exercise detail page. Confirmed the numbers rendered on screen match what `packageEngine.ts` computes (spot-checked chest-efficient: 3 exercises, 8 session sets, 16 weekly sets, matching the spec's own example verbatim).

## Decisions made

- **Muscle-group scope reuses, not reinvents, the existing target taxonomy.** Biceps/Triceps/Glutes split out of the coarser `arms`/`hips` body_regions because `physique-targets.yaml` already distinguishes them (`biceps` vs. `brachialis-arm-thickness` vs. `triceps`; `gluteus-maximus` vs. `gluteus-medius-minimus`) — this is exposing existing precision, not inventing new anatomy.
- **`reps`/`rir` are authored fields in the YAML (per spec §21's explicit content list), but validated against the engine**, rather than either (a) leaving them purely engine-computed (which would satisfy DRY but contradict what §21 literally asks the package data to contain) or (b) authoring them freely (which risked silent drift from the Decision Maker's own numbers). The cross-check validator is the resolution: explicit data, provably consistent.
- **Coverage is boolean-per-target, not a percentage.** The spec's own §13 example shows partial bars ("Projection █████████░"), but nothing in the dataset supports a defensible sub-target percentage without inventing one. A real, derived "does any package exercise actually train this target" boolean satisfies "the exact numbers must come from the package data" without fabricating precision the underlying knowledge doesn't have.
- **Front-delt is deliberately left uncovered in every Shoulders package**, with the omission explained in the package's own `rationale` text (and reflected honestly as an empty coverage bar) rather than padded with an exercise that would mostly duplicate existing chest-pressing volume — spec §4's "avoid two exercises that provide essentially the same contribution" and §23's "important uncovered characteristics are explained" both point the same direction here.

## Pending decisions

None. Per spec §30, architecture is frozen again after this phase — future changes should be concrete-defect-driven (`docs/real-world-feedback/`), not another architecture pass.
