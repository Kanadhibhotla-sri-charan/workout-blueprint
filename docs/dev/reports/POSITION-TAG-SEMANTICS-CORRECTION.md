# Position-Tag Semantics Correction

_Implements the approved items of `PREACHER-CURL-COVERAGE-SEMANTICS.md`. Base: `main` at `1e1fd5d`. **Unchanged:** no engine change, no other ranking-input change, no promotion. Both preacher records stay `needs-review`._

## 1. Applied

| Change | Detail |
|---|---|
| **O2** | `preacher-curl.coverage_categories`: `[isolation, shortened-position-emphasis]` → `[isolation]`. `preacher-curl-machine` keeps its tag; the evidence ledger marks it **unverified** |
| **preacher-curl summary** | Before: "Fixes the upper arm forward on a pad, removing swing for a strict, shortened-position biceps stimulus." After: "Fixes the upper arm forward on a pad, removing swing for a strict biceps curl that, with free weights, is hardest with the elbows near straight; the exact curve varies with the pad angle." Describes the record's free-weight setups and does not claim one curve for every pad angle |
| **SCHEMA** | New definition of `lengthened-` / `shortened-position-emphasis`: **where the external resistance peaks within the movement's own range**, not a held joint position or a two-joint muscle's length set by another joint. Includes the evidence basis and the multi-setup rule. Lists the three engine effects and states that older tags are being re-checked record by record |

## 2. Measured (full scenario space vs `main`; two runs, byte-identical, SHA-256 `8885aad1…`)

| Check | Expected | Measured |
|---|---|---|
| Best Fit changes | 6 | **6** |
| Answer-status changes | 0 | **0** |
| Pinned-case regressions | 0 | **0**. All 9 pinned scenarios keep their Best Fit (also asserted by the test suite) |
| Alternative changes | 14 | 14 (all visual-area) |
| Complement-list changes | 0 | 0 |
| Text-only changes | 18 | 18: the preacher curl's programming guidance, now generic moderate-hypertrophy isolation instead of shortened-position isolation (10–20 reps, squeeze at the top) |
| Watch-out changes | — | 6, in the same 6 answers (the new Best Fit's watch-out) |

**The 6 Best Fit changes:** biceps visual-area under a low-skill limit, any equipment and gym, for entries `target:biceps`, `region:arms` and `outcome:biceps-front-peak`: preacher curl → **preacher curl machine**.
- The machine still carries the (unverified) shortened tag, so it keeps the position-emphasis rank the free-weight preacher curl lost.

## 3. incline-dumbbell-curl: trace of its `lengthened-position-emphasis` tag (not changed)

**Current exposure:** Best Fit in 14 visual-area and 4 complement / different-stimulus answers; alternative in 28 replace, 4 build-base and 4 visual-area answers.

| Effect of the tag | How it acts today | Evidence under the new definition |
|---|---|---|
| Visual-area ranking | Ranks first among biceps exercises (with a position tag) | No identified source on where the incline curl's external resistance peaks. Its `resistance_profile` ("hardest with the arm long, extended shoulder position") describes the shoulder position, the old meaning |
| Replace / complement ties | Shared tag with other lengthened records counts in coverage share | Same: no resistance-curve source |
| Programming profile | `lengthened-position-isolation`: 8–15 reps; "the stretched position is where this exercise does its most distinctive work… resist shortening the range" | Oliveira et al. 2009 measured incline-curl EMG **rising** through the concentric phase, highest in the final third. That is activation, not resistance, so it doesn't settle the question, but it does not support a stretched-end peak |

**Measured options (in memory; two runs, byte-identical, SHA-256 `d393549e…`):**

| Option | Best Fit | Alternative | Complement lists | Answer status | Pinned cases |
|---|---:|---:|---:|---:|---|
| **Retain** (current) | 0 | 0 | 0 | 0 | unchanged |
| **Remove** the incline tag | 14 (all visual-area) | 42 | 10 | 0 | unchanged |
| Remove the incline tag **and** the machine's tag | 26 (all visual-area) | 54 | 30 | 0 | unchanged |

**Removing the incline tag only:**
- 8 of the 14 visual-area picks move to the **preacher curl machine**, purely because of its unverified shortened tag (biceps and biceps-front-peak, any / gym, no limit or fatigue limit).
- 4 move to the dumbbell curl (home); 2 to the skull crusher (arms region, home).
- The programming profile becomes generic.

**Removing both:** the biceps visual-area picks go to the barbell / EZ-bar curl (any / gym) or the dumbbell curl (home), with no unverified tag deciding them.

**Not decided here.** Retaining the tag leaves the record inconsistent with the new SCHEMA definition until evidence is found. Removing it alone shifts picks onto another unverified tag. Removing both avoids that but changes 26 Best Fits.

## 4. Validation and release

| Check | Result |
|---|---|
| `validate-data` | PASS, 140 |
| Vitest | 345 / 345 (pinned cases included) |
| oxlint | exit 0 |
| Build | OK |
| Playwright | 3 / 3 |
