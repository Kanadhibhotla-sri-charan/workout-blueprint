# Phase 3 — Definition of Done

Checked against `docs/architecture/PHASE-3-MVP.md` §25 item by item, against the actual state of `app/` at the end of checkpoint 3I — not asserted from the plan, verified against what was actually built and tested in checkpoints 3A–3H.

- [x] **Application runs locally with a documented command.** `app/README.md`: `cd app && npm install && npm run dev`. Verified working throughout every checkpoint's screenshot-based visual checks (3B–3H).
- [x] **Canonical YAML loads into the application.** `app/scripts/generate-data.mjs` (3B), reusing the repo root's own `scripts/lib/load-records.js`/`validate.js`. Verified: 123/123 records load, matching the root validator's count exactly (`src/data/index.test.ts`).
- [x] **No exercise knowledge is duplicated in UI code.** Every exercise-content field the UI displays is read via property access on the generated data (`exercise.foo`, `target.foo`, `bestFit.foo`, etc.) — confirmed by grepping the codebase for field-name references outside of property-access position and finding none. Per §4's rule, the app is a renderer, not a second knowledge base.
- [x] **Body-region browsing works.** 3C — Home page region grid, `/exercises?region=<region>` filtering. Verified visually (Playwright screenshots, 3C) and by test (`src/data/index.test.ts`, `src/utils/filters.test.ts`).
- [x] **Exercise list works.** 3C — all 123 exercises browsable, region-filterable, graceful fallback for an invalid region param.
- [x] **Search works.** 3E — plain substring search across the §11 field set. Verified by test (`src/utils/search.test.ts`: exact name, partial, and movement-pattern-field matches) and visually.
- [x] **Core filters work.** 3E — all seven §12 filter dimensions, composable. Verified by test (`src/utils/filters.test.ts`, including the exact §12 worked example: Chest + Cable + Isolation + Low fatigue → Cable Fly) and visually.
- [x] **Exercise detail works.** 3D — full §10 hierarchy. Verified visually against two records with materially different relationship shapes (same-file and cross-file relationship links, prose vs. resolvable entries).
- [x] **Mirror effect is visible.** 3D — a dedicated, visually distinct "What you'll see" section, not buried in a field list.
- [x] **Relationships are understandable.** 3D — alternatives/complements/overlaps_with each rendered separately with their own description, resolvable entries linked, prose entries left as text (never a broken link). Verified by test (`src/components/RelationshipList.test.tsx`).
- [x] **Decision Maker flow works.** 3G — single-page form covering §13's four steps, wired to the 3F engine.
- [x] **Decision Maker produces deterministic recommendations.** 3F — `docs/dev/reports/DECISION-ENGINE-RULES.md` defines every rule as a strict predicate or fixed-priority tiebreak (no scoring, no fuzzy matching, per the user's explicit instruction), and 26 engine-level tests (3F) plus 4 component-level tests (3G) assert exact, reproducible outputs — including two rules-doc worked examples that were corrected after hand-computing them against the real dataset rather than assumed.
- [x] **Recommendations include explanations.** §16's `why`/`alternativeWhy` fields are always populated on an `'ok'` result, built from template strings interpolating real field values (§17 compliance — nothing inferred).
- [x] **Recommendations respect equipment constraints.** `isEquipmentFeasible()` (3F) applied at every candidate-filtering stage; tested with an exact-match-only case proving no fuzzy/synonym matching (`src/engine/equipment.test.ts`).
- [x] **Recommendations respect relevant current-exercise overlap/complement information.** The `replace-exercise` goal uses the structural-alternative rule (same movement pattern); `different-stimulus`/`complement-current` use the structural-complement rule (different movement pattern) or the record's own declared `complements` when resolvable. Tested end-to-end (engine level in 3F, form-to-result level in 3G).
- [x] **Missing optional metadata does not break the UI.** `OptionalList`/`RelationshipList` (3D) render nothing for `null` or `[]` rather than an empty heading — tested directly with synthetic null/empty props (`src/components/OptionalList.test.tsx`, `src/components/RelationshipList.test.tsx`), not just inferred from real records that happen to be sparse.
- [x] **Mobile layout is usable.** 3A (foundations) + 3H (audit and two real fixes: icon accessibility, header wrap). Verified at 320/390/768/1280px in both light and dark color schemes.
- [x] **Core tests pass.** `npm run test` (Vitest): **50 tests across 10 files, all passing** — engine correctness (equipment, alternatives, complements, full decision pipeline), data integration, search, filters, and component behavior (Decision Maker form, OptionalList, RelationshipList).
- [x] **Existing `npm run validate-data` remains passing.** Re-run at the end of 3I from the repo root: `Validated 123 records across 11 files. PASS.` No data files were touched anywhere in Phase 3 — confirmed by the Python 30-field/no-duplicate-id cross-check run alongside it, same discipline used before every commit since Phase 1.
- [x] **Documentation explains how to run the application.** `app/README.md` (run command, data-generation contract, directory structure, test command); root `README.md` points to it; `docs/dev/PHASE-3-mvp.md` logs every checkpoint's reasoning in detail.

**All 20 items: done.** No item was marked done without a specific verification method (test, screenshot, or grep) cited above — this list is deliberately not a copy of the spec's checklist with boxes checked from memory.

## Test suite summary

```
Test Files  10 passed (10)
     Tests  50 passed (50)
```

| File | What it covers |
|---|---|
| `src/engine/equipment.test.ts` | Equipment-feasibility rule, including a no-fuzzy-matching proof |
| `src/engine/alternatives.test.ts` | Structural-alternative rule, both hand-computed worked examples from the rules doc |
| `src/engine/complements.test.ts` | Structural-complement rule, declared-entry resolution |
| `src/engine/decisionEngine.test.ts` | Full pipeline — all 6 §24 representative scenarios, plus the complements cap |
| `src/pages/DecisionMakerPage.test.tsx` | Form-to-engine wiring, not just the engine in isolation |
| `src/data/index.test.ts` | Data integration — record count, no duplicate ids, expected regions |
| `src/utils/search.test.ts` | Exact/partial/field-level search matching |
| `src/utils/filters.test.ts` | Individual and composed filters, no-result state |
| `src/components/OptionalList.test.tsx` | Missing-metadata graceful hiding |
| `src/components/RelationshipList.test.tsx` | Link resolution vs. prose fallback, missing-metadata hiding |

## Known, deliberately-not-fixed limitations (stated, not hidden)

- **JS bundle exceeds Vite's 500kB advisory warning** (~538kB, ~142kB gzipped) — the bundled 123-record dataset is the bulk of it. §21 explicitly says a client-side MVP is fine at this dataset size; noted in the 3C dev-log entry, not fixed, since code-splitting the dataset would be solving a problem the spec says doesn't exist yet at this scale.
- **`primary_targets` ranking tiebreak uses exact string equality**, including parenthetical annotations (documented in `DECISION-ENGINE-RULES.md` §2's "known limitation" section) — a deliberate consequence of the user's "no vague/fuzzy matching" instruction, not an oversight.
- **Native `<select multiple>` for the equipment constraint** (3G) is not the most touch-friendly control on every mobile browser — flagged in the 3H audit as a v0.1 acceptable tradeoff rather than building a custom multi-select control, per §18's "don't prematurely build a sophisticated framework."
