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

**Date:** 2026-08-16

### What changed

- **Home page** (`src/pages/HomePage.tsx`): title, one-line product tagline, two primary actions ("Explore Exercises" → `/exercises`, "Make a Decision" → `/decide`), and a body-region grid (all 11 regions, humanized labels, each showing its exercise count, linking to `/exercises?region=<region>`) — matches spec §8's recommended layout. Kept deliberately uncrowded: no analytics, no secondary content.
- **Exercise List page** (`src/pages/ExerciseListPage.tsx`): reads `region` from the URL query string (`useSearchParams`) rather than local component state, so a region view is a real shareable/bookmarkable/back-button-able URL, not just in-memory UI state — this also sets up 3E's search/filter params to compose the same way without a rewrite. Shows "All Exercises" (123) with no param, a region-filtered view with an "All regions" clear link when a valid region is present, and a graceful fallback (shows all exercises + an explanatory message, doesn't crash or blank-page) for an unrecognized region value.
- **`ExerciseCard`** (`src/components/ExerciseCard.tsx`): the list-card content spec §9 recommends — name, primary targets, exercise type, up to two coverage-category tags, and a truncated `mirror_effect` preview — linking to the (still-placeholder) detail route. Everything rendered is a direct field value; nothing is invented or reworded, per §4's "renderer, not a second knowledge base" rule. `utils/format.ts` adds two purely presentational helpers (`humanize` for kebab-case→readable-label, `truncate` for the mirror-effect preview) — reformatting, not content generation.
- `src/index.css` — real styles for all of the above (buttons, region grid, exercise grid/cards, tag chips), mobile-first (single-column exercise grid below 560px, two-column region grid below 480px), built on the touch-target/token foundation from 3A.

### Verified

- `npx tsc -b` and `npm run build` both clean.
- **Visually verified in a real browser** at a 390×844 mobile viewport (Playwright screenshots, not just build success): Home page renders all 11 regions with correct counts; `/exercises?region=chest` shows 19 correctly filtered cards with working tags/mirror-effect previews; `/exercises` with no param shows all 123; `/exercises?region=bogus` falls back to all exercises with a visible explanatory message instead of crashing or blanking — confirms the §23 error-handling requirement for unrecognized input, not just the happy path.
- `npm run build`'s output is one JS chunk over Vite's 500kB advisory warning (the bundled 123-record dataset is the bulk of it) — not an error, and §21 explicitly says a client-side MVP is fine at this dataset size; noted here rather than silently ignored, revisit only if it becomes a real problem (e.g. via code-splitting the generated JSON) — no action taken now, consistent with the spec's "don't prematurely build sophisticated infrastructure" instruction.

### Decisions made

- **Filter/search state lives in the URL (`useSearchParams`), not component state** — the region filter today, search and the composable filters from §12 next in 3E, all as query params on the same `/exercises` route. Chosen now, at the first page that needs it, rather than retrofitted in 3E, since switching state ownership after building UI against it would mean redoing the page.
- **"Search" is not yet on the Home page's primary actions**, though §8 recommends three (Explore, Decide, Search). A search entry that doesn't search anything yet would be a dead control, so it's added in 3E alongside the actual search implementation rather than stubbed now — a sequencing choice, not a scope cut; §8's three actions will all be present once 3E lands.

### Pending decisions

None from this checkpoint.

---

## 3D — Exercise Detail page

**Date:** 2026-08-16

### What changed

- `src/pages/ExerciseDetailPage.tsx` — the full nine-part hierarchy from spec §10: name/summary/why-this-exists/targets (§10.1), a visually prominent "What you'll see" callout for `mirror_effect` (§10.2), a Decision Context section (`best_used_when`, `less_suitable_when`, `limitations`, then a demand grid — type, laterality, movement pattern, equipment, setup time, fatigue cost, stability demand, skill demand) (§10.3), a Related Exercises section covering all three relationship fields (§10.4), and a collapsible Technical Details section (resistance profile, technique cues, common mistakes, programming notes, evidence notes) using a native `<details>`/`<summary>` element for progressive disclosure — no custom JS, keyboard-accessible by default (§10.5, §20). A not-found state (§23) renders when the route `id` doesn't resolve to a real record, with a link back rather than a crash or blank page.
- `src/utils/relationships.ts` — `parseRelationshipEntry()`, matching the exact two id-reference shapes `scripts/lib/validate.js` already validates against the live data (bare id for same-file references; `"id (module name) — trailing note"` for cross-file references). Anything that doesn't match either shape (most `complements` entries, which are prose by design per the Phase 2 audit) is left unresolved and rendered as plain text rather than a broken link.
- `src/components/RelationshipList.tsx` — renders one relationship field, resolving parseable entries to real `Link`s (via `getExerciseById`) and falling back to plain text for prose or (should it ever occur) an unresolvable id. Hides itself entirely when the field is empty or null, same rule as `OptionalList`.
- `src/components/OptionalList.tsx` — small shared component for the several fields that are simple bullet lists and must hide gracefully when empty (§23) instead of showing an empty heading.

### Verified

- `npx tsc -b` and `npm run build` both clean.
- **Visually verified with full-page Playwright screenshots** at 390×844 for two records with meaningfully different relationship shapes:
  - `incline-dumbbell-press` — matches the architect's own worked example almost exactly: `complements` resolved "Cable Fly" as a working link (the spec's example complement), `overlaps_with` resolved four same-file incline-press variants as links, `alternatives` correctly rendered nothing (the field is empty per the Phase 2 architect decision, and the whole Related Exercises section still renders correctly with just the two populated subsections).
  - `standing-calf-raise` — confirms **cross-file relationship resolution**: its `overlaps_with` entries (`leg-press-calf-raise`, `single-leg-calf-raise`) live in a different YAML file and resolved to correct links anyway, since `getExerciseById` searches the whole dataset, not just the current file. Its `complements` entry ("A bent-knee raise, which covers the soleus.") is prose and correctly rendered as plain text, not a broken link.
  - An invalid id (`/exercises/not-a-real-id`) renders the not-found state cleanly instead of crashing.
- Did not screenshot-verify the `<details>` open/close interaction specifically — it's a native HTML element with standard, well-established browser behavior, not custom code this project wrote, so the same bar applied to hand-written interactive logic wasn't applied here.

### Decisions made

- **Equipment, laterality, and movement pattern were added to the Decision Context "Demands" grid** even though spec §10.3's explicit field list only names `best_used_when`/`less_suitable_when`/exercise type/movement pattern/setup time/fatigue cost/stability demand/skill demand — re-reading that list, movement pattern *is* named, but equipment and laterality are not. Included both anyway: equipment because "what does it demand" is incomplete without it (you can't decide whether an exercise fits your situation without knowing what it needs), laterality because it's a genuine execution/decision input already exposed as a filter dimension in §12. Treated as filling a real gap in the spec's own list rather than a deviation from it.
- **Relationship-entry resolution reuses the exact id-shape convention `validate.js` already enforces**, rather than inventing a separate parser — if the root validator considers an entry a resolvable reference, the app resolves it the same way; if the validator would flag it, the app doesn't try to link it either.

### Pending decisions

None from this checkpoint.

---

## 3E — Search + Filters

**Date:** 2026-08-16

### What changed

- `src/utils/search.ts` — `searchExercises()`: plain substring matching (no semantic/fuzzy AI, per spec §11's explicit instruction) across exactly the fields §11 lists (name, summary, why this exists, body regions, primary/secondary targets, movement patterns, mirror effect, best-used-when, equipment). Every whitespace-separated term in the query must appear somewhere in that concatenated, lowercased text — not necessarily adjacent — so a two-word query like "upper chest" matches text that only has "upper-chest-biased" (hyphenated, not a literal substring of "upper chest") as well as text with the words apart.
- `src/utils/filters.ts` — `applyFilters()`: the seven composable filter dimensions from §12 (region, equipment, exercise type, laterality, setup time, fatigue cost, coverage category), AND-combined, each a strict equality/membership predicate against a real field — no filter exists that doesn't map to one. `DEMAND_LEVELS` fixes the low/medium/high *display order* for the three-level fields (the one place an app-side constant was justified — it's schema structure, not exercise content).
- `src/data/index.ts` extended with `equipmentOptions`, `coverageCategoryOptions`, `exerciseTypeOptions`, `lateralityOptions` — all derived from the live dataset (unique values actually present), same pattern as `bodyRegions` from 3C, so filter dropdowns can never drift from what the data actually contains.
- `src/components/FilterBar.tsx` and `src/components/SearchBox.tsx` — the UI controls, native `<select>`/`<input type="search">` (semantic, keyboard-accessible without extra work, satisfying §20 baseline). `FilterBar` shows an active-filter count and a clear-all button once any filter is set.
- `src/pages/ExerciseListPage.tsx` rebuilt to compose region, search text (`q`), and all seven filters entirely through URL query parameters (`useSearchParams`, `{ replace: true }` so typing in the search box doesn't flood browser history) — updates apply immediately on change, no submit step, matching §12's "the result should update immediately." A composed query updates the page heading, result count, and (per §23) a distinct empty-state message when a combination matches nothing, separate from the invalid-region fallback message from 3C.
- `src/pages/HomePage.tsx` gets its third primary action — a real search box that navigates to `/exercises?q=...` — completing §8's three recommended actions (Explore, Decide, Search), deferred from 3C specifically until search existed to back it.

### Verified

- `npx tsc -b` and `npm run build` both clean.
- **Visually verified with Playwright screenshots at 390×900** (mobile viewport): the empty filter bar; a text search for "upper chest" narrowing 123→9 results including `cable-fly` (matched via its "upper-biased" mirror-effect text, confirming the hyphen-insensitive multi-term matching works, not just literal-phrase matches); a **composed** filter — Region=Chest + Equipment=Cable + Type=Isolation + Fatigue=Low — narrowing to exactly **one** result, Cable Fly, which is the exact scenario spec §12's own example describes ("Chest + Cable + Isolation + Low fatigue"); the Home page's new search box; and a genuine no-results state (nonsense query) rendering a clear empty message instead of a blank page.

### Decisions made

- **Filter/search state lives entirely in the URL**, continuing the choice made in 3C rather than introducing component state now that there's more to track — every view in this checkpoint (a search, a single filter, a four-way composed filter) is a shareable, bookmarkable, back-button-able link with no extra work.
- **AND-of-terms substring search over exact literal-phrase matching** — chosen because the dataset's own writing style hyphenates multi-word descriptors ("upper-chest-biased") in a way literal-phrase matching would miss for a natural two-word query. Still zero semantic/fuzzy logic, per the spec's explicit "does not need semantic AI" and per the user's Phase 3 approval note to keep matching deterministic, not vague/fuzzy — this is substring matching on structured text, not similarity scoring.

### Pending decisions

None from this checkpoint.

---

## 3F — Decision Engine v0.1

**Date:** 2026-08-16

**Trigger:** the user's Phase 3 approval was explicit that this checkpoint had to start with written rules, not code: *"Before implementation of the decision engine, explicitly define deterministic structural-alternative matching rules and equipment-feasibility rules. Do not use vague/fuzzy matching."*

### What changed

- **[`docs/dev/reports/DECISION-ENGINE-RULES.md`](reports/DECISION-ENGINE-RULES.md) written first, before any engine code**, exactly as instructed. It defines three deterministic rules precisely enough that engine code implements them 1:1, not an approximation:
  1. **Equipment feasibility** — `null` means the constraint wasn't engaged (no filtering); otherwise strict subset test, exact string match only, no normalization.
  2. **Structural alternative matching** (needed because `alternatives` is 0/123 populated by the architect's own Phase 2 decision) — a two-stage rule: Stage 1 strict eligibility (same `movement_patterns[0]`, same `exercise_type`, shared `body_regions`, not `draft`, equipment-feasible), Stage 2 a fixed-priority tiebreak (shared `primary_targets` count, then shared `coverage_categories` count, then alphabetical id) — never a blended score.
  3. **Structural complement matching** — discovered mid-checkpoint, not anticipated when the plan was approved: `complements` turned out to be **124 entries dataset-wide, only 2 bare-id-shaped** (resolvable), far sparser than assumed. The same two-stage pattern applies, with the defining difference from alternatives being a *different* `movement_patterns[0]` (not the same one) and the coverage-category tiebreak direction reversed (fewer shared categories ranks higher — more different stimulus is the point of a complement).
- Every worked example in that document is **hand-computed against the live dataset and then asserted as an automated test**, not just traced by hand and taken on faith — see "Verified" below.
- `app/src/engine/equipment.ts`, `alternatives.ts`, `complements.ts`, `constraints.ts` (the low/medium/high "at most" tolerance comparison), `types.ts` (`Goal`, `DecisionInput`, `DecisionResult`), and `decisionEngine.ts` (`makeRecommendation()`, the rule-based pipeline from §18: filter by region → drop `draft` records → equipment → tolerance constraints → goal-specific ranking/current-exercise logic → explain).
- Seven goals from §13 Step 2's example list, each mapped to structured fields only — no goal exists that the schema can't back, per §13's "do not create unsupported recommendation categories": `build-base` (ranks by `heavy-compound` > `stable-compound` > other), `visual-area` (ranks by lengthened/shortened-position-emphasis categories, explanation is the record's own `mirror_effect`), `low-fatigue` (ranks by `fatigue_cost` ascending), `limited-equipment` (ranks by equipment-list length ascending), `replace-exercise` and `different-stimulus`/`complement-current` (require a current exercise; call into the structural-alternative/complement rules respectively).
- `DecisionResult` is a tagged union (`'ok' | 'missing-current-exercise' | 'no-candidates'`) rather than a type that's always "successful" — per §17, the engine states when it can't confidently recommend instead of forcing an answer. A goal needing a current exercise with none supplied, or a constraint combination with zero survivors, both return an honest explanatory status rather than a best-effort guess.
- Added Vitest (`npm run test`, `pretest` regenerates data first) — the first automated test suite in the app, added specifically because hand-tracing a "no vague matching" requirement isn't the same as proving it holds.

### Verified

- **Corrected a wrong assumption before it shipped**: an early draft of the rules doc claimed the alternative-matching rule would surface `smith-machine-incline-press` for `incline-dumbbell-press`, matching the architect's own worked example in `PHASE-2-OPEN-DECISIONS.md` §2. Hand-computing the actual Stage 2 ranking against the real data showed the *unconstrained* winner is `incline-barbell-press` instead (a real, defensible tiebreak outcome — see the rules doc §4 for why), and `smith-machine-incline-press` only wins once an equipment constraint narrows the field to just it. Rewrote the doc to state the computed result honestly rather than leave the false claim in — this is exactly the kind of error that a "define the rule, then verify against real data" discipline is supposed to catch.
- Same discipline applied to the complement rule: didn't assume it would reproduce `cable-fly` (the one entry `incline-dumbbell-press` happens to have curated in prose) — computed the actual ranking, got `incline-dumbbell-fly` (a different but equally defensible complement), and documented that honestly rather than picking a rule that would coincidentally match the one curated example.
- `npx tsc -b` and `npm run build` both clean.
- **21 automated tests across 4 files, all passing** (`npm run test`): equipment feasibility (including a deliberate near-miss-string case proving no fuzzy matching), the two hand-computed alternative-matching scenarios from the rules doc (unconstrained → `incline-barbell-press`; constrained to `[smith machine, bench]` → `smith-machine-incline-press`), a general invariant check across 30 records (every returned alternative genuinely shares movement pattern/exercise type/region with its target), the structural-complement ranking, and all **six representative Decision Maker scenarios from spec §24** run directly against `makeRecommendation()` (goal-only, equipment-restricted, low-fatigue-constrained, complement-of-current, replace/alternative-of-current, and a deliberately impossible constraint combination correctly returning `no-candidates` rather than a fabricated pick).

### Decisions made

- **Wrote the rules document first and treated it as authoritative** — the engine code has a comment on each rule pointing back to the specific section of `DECISION-ENGINE-RULES.md` it implements, so the two can't silently drift apart the way the doc explicitly warns against in its own opening paragraph.
- **Added a structural-complement rule that wasn't in the original plan**, once the actual `complements` field sparsity (2/124 resolvable) was discovered — the plan only called out the `alternatives` field as needing a structural fallback, on the assumption `complements`/`overlaps_with` were "usable directly" (true for display on the detail page in 3D, not true for the engine's need to always have a same-region pick to offer). Documented as a rules-doc addition rather than silently expanding scope.
- **`DecisionResult` can represent "I don't know" as a first-class outcome** rather than only ever returning a best-effort exercise — directly required by §17's "if the dataset cannot support a recommendation confidently, the engine should say so," and testable (scenario 6 above) rather than just asserted.
- **Vitest added now, not deferred to 3I** — the user's "no vague/fuzzy matching" instruction is a claim about *behavior*, and hand-tracing one or two cases (as the rules doc's worked examples do) doesn't scale to proving it holds generally; automated tests do. 3I's testing scope narrows to what's left: search, filters, component smoke tests, and the UI-level scenarios once 3G exists.

### Pending decisions

None from this checkpoint.

---

## 3G — Decision Maker UI

*Not yet started.*
