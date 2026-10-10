# Position-Tag Review — Package-Linked Isolation Records and the Incline-Press Contradiction

_Analysis only. Base: `main` at `0bebd54`. **The live library and engine are unchanged.** incline-dumbbell-curl stays as it is: tag, `reviewed` status, and Build prescription._

**Method:**
- For each record, only its position tag was removed in memory.
- The full 39,672-scenario space was measured against `main`, twice (byte-identical, SHA-256 `17c48d7b…`).
- Profiles and Build-package validity were resolved with the app's own `resolveProgrammingProfile` and the `validate-data` rule (package `reps` must equal the resolved profile's primary range).
- **Evidence uncertainty and package compatibility are reported separately.**

**Profile fallback when the tag is removed:**
- `elevated-stability-isolation` (8–15) when stability demand is medium or higher;
- otherwise `moderate-hypertrophy-isolation` (10–20).

## 1. Summary

| Record | Evidence for the tag under the SCHEMA definition | Package compatible if removed? | Pinned case broken if removed? | Best Fit / alt / complement-list / status changes if removed | Proposal |
|---|---|---|---|---|---|
| cable-lateral-raise | **Unverified.** Text: "constant tension… meaningful even in the stretched bottom", a comparison with the dumbbell, not a stated peak | **No**: shoulders-efficient and shoulders-complete need 10–20 | No | 4 / 4 / 4 / 0 (+90 programming-text) | **Retain; mark unverified** |
| cable-overhead-extension-leaning-forward | **Contradicted by its own text.** "Constant tension through the whole range" means no peak; the tag rests on the overhead shoulder position (old sense) | **Yes** (elevated-stability 8–15) | No | 16 / 40 / 0 / 0 (+48) | **Remove tag** (needs approval) |
| incline-dumbbell-curl | Unverified (previous report) | No (biceps-complete 10–20) | No | 14 / 42 / 10 / 0 | **Held unchanged** (instruction) |
| incline-dumbbell-fly | **Consistent as stated** ("hardest at the bottom stretch"); no source on its curve | Yes | No | 46 / 76 / 504 / 0 | **Retain; mark "consistent as stated, unverified"** |
| overhead-triceps-extension | **Unverified.** Tag rests on the overhead position (old sense; Maeo 2023 supports the *position*, not a resistance peak); no peak stated; its band setup loads the top | Yes | **Yes: pinned case #6** | 18 / 48 / 16 / 0 (+110) | **Retain; mark unverified.** Removal would need a pinned-case decision |
| reverse-nordic-curl | **Unverified.** "Scales by range controlled", no peak stated | Yes | No | 32 / 34 / 0 / 0 (+331) | **Retain; mark unverified** |
| seated-leg-curl | **Unverified.** Tag rests on the hip-flexed position (old sense; Maeo 2024 supports the *position*); "fixed-path machine", no curve stated | **No**: hamstrings-efficient and hamstrings-complete need 10–20 | No | 30 / 96 / 123 / 0 | **Retain; mark unverified** |
| incline-dumbbell-press (compound) | **Contradicted by its own text:** "hardest through the middle of the range" | Not in a package; profile unchanged (heavy compound) | No | 50 / 94 / 872 / 0 | See §3. Two options returned |

**Programming-text counts.** "+N programming-text" counts Decide answers whose Best Fit and ids are unchanged but whose programming guidance (profile name, rep range, guidance note) would change.

**Validation:** compatibility above is computed with the `validate-data` rule. No rule change is proposed.

## 2. Per-record trace

**Every record's tag acts in four places:**
1. **Decide ranking:** the visual-area goal key, and coverage share in replace (more shared preferred) and complement (fewer preferred).
2. **Alternatives:** the same rankers' second pick.
3. **Programming profile:** isolation only (rep range and guidance shown in Decide and Build).
4. **Build packages:** `reps` validated against the profile; `contribution` text.

### cable-lateral-raise
- **Exposure:** Best Fit in 108 answers (replace 36, visual-area 18, complement / different 14 + 14, build-base 12); alternative in 78.
- **Removal:**
  - Best Fit changes: 4 (visual-area, any / gym, → band / cable external rotation).
  - Profile 8–15 → 10–20.
  - **Package reps invalid** in shoulders-efficient and shoulders-complete. Their contribution text ("Stretch-position lateral work… through the bottom of the range") also depends on the tag.
- **Evidence:** no source on the cable lateral raise's resistance curve. The record's claim is relative ("tension at the bottom, where a dumbbell loses it"), not a peak.
- **Proposal:** retain; ledger status "unverified".

### cable-overhead-extension-leaning-forward
- **Exposure:** Best Fit in 64; alternative in 80.
- **Removal:**
  - Best Fit changes: 16, all triceps / arms visual-area, any / gym. They go to the skull crusher (8), overhead triceps extension (4) and incline curl (4).
  - Alternatives: 40. Complement lists: 0. Pinned cases: none.
  - Profile → elevated-stability-isolation (still 8–15), so **triceps-complete stays valid**. The contribution text ("long-head stretch position with constant tension") describes the shoulder position and stays accurate.
- **Evidence:** the record's own `resistance_profile` says constant tension through the whole range, so under the definition there is no peak to tag. Maeo 2023 supports the overhead *position* for long-head growth, which is recorded in its movement pattern ("shoulder flexed (overhead)").
- **Proposal:** remove the tag. This is the only record here where removal is supported by its own text, is package-compatible and breaks no pinned case.

### incline-dumbbell-curl
Held unchanged by instruction. Measurements are in `POSITION-TAG-SEMANTICS-CORRECTION.md`; package incompatibility is in `POSITION-TAG-REVIEW-QUEUE.md`.

### incline-dumbbell-fly
- **Exposure:** Best Fit in 430 (complement / different 202 + 202).
- **Removal:**
  - Best Fit changes: 46; complement lists: 504.
  - Package valid (elevated-stability 8–15).
- **Evidence:** "hardest at the bottom stretch" matches the definition. Chaves et al. 2020 supports the incline *angle*, not the curve. No source located on the fly's resistance curve.
- **Proposal:** retain. Consistent as stated, unverified.

### overhead-triceps-extension
- **Exposure:** Best Fit in 124; alternative in 318.
- **Removal:**
  - Best Fit changes: 18 (replace 12, visual-area 6).
  - **Breaks pinned case #6:** `target:triceps|replace-exercise|commercial-gym|none|lying-triceps-extension-skull-crusher` would change from overhead-triceps-extension to cable-overhead-extension-leaning-forward.
  - Package valid (elevated-stability 8–15).
- **Evidence:** Maeo 2023 (verified) supports long-head growth from the overhead *position*. No source on the free-weight resistance peak, and the band setup loads the top.
- **Proposal:** retain; mark unverified. Any later removal needs an explicit decision on pinned case #6.

### reverse-nordic-curl
- **Exposure:** Best Fit in 363.
- **Removal:**
  - Best Fit changes: 32 (visual-area → sissy squat, all contexts).
  - Package valid.
- **Evidence:** "scales by range controlled", no peak stated. The cited Bloomquist et al. 2013 is about squat depth, not this exercise's curve.
- **Proposal:** retain; mark unverified.

### seated-leg-curl
- **Exposure:** Best Fit in 108.
- **Removal:**
  - Best Fit changes: 30 (visual-area 18; complement / different 6 + 6); complement lists: 123.
  - **Package reps invalid** in hamstrings-efficient and hamstrings-complete (10–20). The contribution text does not depend on the tag.
- **Evidence:** Maeo 2024 (verified) supports the hip-flexed *position*. The machine's resistance curve is not stated.
- **Proposal:** retain; mark unverified.

## 3. incline-dumbbell-press: the contradiction

- **The conflict:** the record's own `resistance_profile` says "hardest through the middle of the range", while `coverage_categories` carries `lengthened-position-emphasis`.
- **Sources:** none on the incline dumbbell press's resistance curve. The record's evidence note (Chaves 2020; Rodríguez-Ridao 2020) is about the incline angle and the upper chest, not the curve. So **neither statement is source-verified**; one of them is wrong, and the evidence doesn't say which.

**Measured effects of removing the tag:**
- **Best Fit: 50.**
  - complement / different stimulus: 22 + 22. Mostly "complement my incline dumbbell fly / flat fly / pullover / decline fly" → incline dumbbell press instead of the feet-elevated push-up. Also, with bodyweight equipment, "complement my incline dumbbell press" → dip (chest) instead of push-up (12).
  - replace: 6 ("replace my incline cable press" → incline barbell press instead of the incline dumbbell press).
- **Other:** 94 alternatives; **872 complement lists**; 0 answer-status changes.
- **Unchanged:**
  - profile (heavy free-weight compound, 6–12);
  - packages (none);
  - pinned cases;
  - the `alternatives.test.ts` expectations (unconstrained → incline barbell press; Smith + bench → Smith incline press, then feet-elevated push-up). The worked example in `DECISION-ENGINE-RULES.md` §4 lists the press's coverage categories and would need its text updated.

| Option | Ranking change | What it asserts |
|---|---|---|
| **P1 (smallest):** mark both statements unresolved. Change the text to drop "hardest through the middle of the range" (no source), keep the tag, and flag it "unverified" in the ledger | **0** (resistance text is detail and stimulus text only) | Nothing new; removes an unsupported claim; the tag remains unverified like the others above |
| P2: remove the tag (align with the current text) | 50 / 94 / 872 / 0 | Treats the "middle" text as right without a source |

**Recommendation: P1.** The contradiction is between two unsourced statements, and P1 removes one unsupported claim without a ranking change. P2 is large and would rest on the other unsourced statement.

## 4. For approval

1. **cable-overhead-extension-leaning-forward:** remove `lengthened-position-emphasis`. Measured 16 / 40 / 0 / 0; package-compatible; no pinned case; 48 programming-text changes.
2. **incline-dumbbell-press:** P1 (text only, 0 ranking changes) or P2 (tag removal, 50 / 94 / 872 / 0).
3. **Ledger:** record as **unverified** the tags of cable-lateral-raise, overhead-triceps-extension, reverse-nordic-curl and seated-leg-curl; record incline-dumbbell-fly as **"consistent as stated, unverified"**.
4. **Future:** any removal on cable-lateral-raise or seated-leg-curl would also require a Build-package reps change (8–15 → 10–20). Any removal on overhead-triceps-extension would require a decision on pinned case #6.

No library, engine, package or test change was made in this task.
