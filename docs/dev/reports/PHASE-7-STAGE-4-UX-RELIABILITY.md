# Phase 7 Stage 4 — UX Reliability

Two changes: Decide's state now lives in the URL, and there is a browser smoke test. Nothing changed in programming, exercise selection, equipment semantics, the tie-break, or the exercise library.

## 1. Decide URL state

### What the URL holds

The URL holds the **submitted** decision. That is exactly what's needed to rebuild the `DecisionInput` and the form that produced it.

- Unsubmitted edits stay local, so the URL always describes the result on screen.
- The recommendation is always computed from the URL. Submitting only writes the URL.
- A refresh, an opened link, and back/forward all go through the same path.

Code:
- `app/src/utils/decisionUrl.ts`: `encodeDecisionInput`, `decodeDecisionParams`, `toDecisionInput`.
- `app/src/pages/DecisionMakerPage.tsx`: the wiring.

### Parameters

Parameters are always written in this order, using canonical ids only:

| Param | Value | Meaning |
|---|---|---|
| `outcome` | aesthetic-outcome id | Appearance selection. Region, primary target and supporting targets are re-derived from the outcome, as the form does. |
| `function` | functional-goal id | Function selection. Region is re-derived. |
| `target` | physique-target id | Direct/Advanced target. Region is the target's parent region. |
| `region` | body-region id | Direct/Advanced whole-region pick. |
| `goal` | goal id (`build-base`, …) | Required for a result. |
| `equipment` | equipment item, repeated, sorted, de-duplicated | Present only when "Limit by equipment" is on. A single empty `equipment=` means nothing selected (bodyweight only). Absent means no limit. |
| `setup`, `fatigue`, `stability`, `skill` | `low` / `medium` / `high` | Tolerance caps. Omitted when there's no preference. Same names as Explore's filters. |
| `current` | exercise id | Current exercise. Omitted when none. |

Exactly one selection parameter is written: the first that applies of `outcome`, `function`, `target`, `region`.

The entry mode (Appearance / Function / Direct) is not stored. It follows from which selection parameter is present.

Example: `/decide?outcome=calf-width-shape&goal=build-base&equipment=bench&equipment=dumbbell&fatigue=low`

### Determinism

- The same input always produces the same URL: fixed parameter order, and equipment is sorted and de-duplicated.
- The result is computed from the decoded URL. A unit test checks that `makeRecommendation(decode(encode(input)))` equals `makeRecommendation(input)` for every region, physique target, aesthetic outcome and functional goal, across three goals and three equipment contexts.
- The round trip is exact for every selection the form can produce, in all 7 goals.

### Failing safely

Each value is checked against the live data, and invalid values are dropped individually. Unknown ids, goals, equipment items and tolerance levels, plus junk parameters and broken percent-encoding, never throw. Valid parts are kept.

With no valid selection or no valid goal, there's no result. The form shows its normal defaults for whatever is missing.

### History

- Submitting pushes one history entry. Re-submitting the same decision replaces the entry rather than duplicating it.
- Back and forward step between submitted decisions. The form is re-created from the URL, so it always matches the result shown.
- Explore's filters still use `replace`. That behaviour is unchanged.

## 2. Playwright smoke test

Files: `app/playwright.config.ts` and `app/e2e/smoke.e2e.ts`. Run it with `npm run test:e2e`. It's also a new `e2e` job in `ci.yml`.

The test builds the production bundle and serves it with `vite preview` under the `/workout-blueprint/` base path.

Three tests:

1. **Explore → Exercise Detail → Decide → Build → Exercise Detail**, using the header nav and in-page links. At each step it checks:
   - the route URL;
   - the page renders;
   - the stylesheet is applied (`header.app-header` is `display: flex`);
   - the detail page's heading matches the card or package link that was clicked;
   - Decide produces a Best Fit and writes the canonical URL.
2. **Decide URL state:**
   - open a valid URL; the state appears;
   - reload; the same state and the same recommendation remain;
   - submit a second decision;
   - go back (first state and recommendation return), then forward (second returns).
3. **A malformed Decide URL** shows the empty form and no result.

Robustness:
- All requests off localhost are aborted, so YouTube and other services are never reached.
- Every test fails on any page error or any HTTP ≥ 400 response.
- Selectors are roles, labels, form values and structural classes.
- Recommendation names are compared before and after a reload or history step. They are never hard-coded.

`@playwright/test` is pinned to 1.56.1. That matches the preinstalled Chromium here; CI installs the matching browser.

## Limitations

- **Unsubmitted edits are not in the URL.** A refresh before submitting loses them. This is deliberate: the URL describes the result.
- **Entry mode is derived, not stored.** One edge case needs no data change: in Appearance, pick an outcome, then change the body area without picking a new outcome, then submit. The engine input is target-only, so the reload opens in Direct/Advanced with that target. The engine input, and therefore the recommendation, is identical.
- **Draft-only selections are not restored.** For example, an Appearance body area with no outcome picked.
- **The smoke test runs Chromium only.** It is a smoke test, not cross-browser coverage.
- **The CI `e2e` job hasn't run on GitHub Actions yet.** It runs on the next pull request or push to `main`. Locally, it passes on a fresh clone.
