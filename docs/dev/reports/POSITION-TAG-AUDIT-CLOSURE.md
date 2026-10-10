# Position-Tag Audit — Closure

_Closes the position-tag workstream. Final state: `main` at `c66d097`. **Definition** (SCHEMA): `lengthened-` / `shortened-position-emphasis` mean where the **external resistance peaks** in the movement's own range. Not a held shoulder or hip position, EMG alone, or an unsourced statement._

**The audit stops here.** A new batch should be opened only for new evidence (a source on a record's resistance curve) or a concrete production issue.

## 1. Records audited

All **26** records that carried a position tag when the audit began.

| Group | Records | Where assessed |
|---|---|---|
| Preacher curl pair | preacher-curl, preacher-curl-machine | `PREACHER-CURL-COVERAGE-SEMANTICS.md`, `POSITION-TAG-SEMANTICS-CORRECTION.md` |
| Incline curl | incline-dumbbell-curl | `POSITION-TAG-SEMANTICS-CORRECTION.md`, `POSITION-TAG-REVIEW-QUEUE.md` |
| Package-linked isolation (7) | cable-lateral-raise, cable-overhead-extension-leaning-forward, incline-dumbbell-curl, incline-dumbbell-fly, overhead-triceps-extension, reverse-nordic-curl, seated-leg-curl | `POSITION-TAG-REVIEW-PACKAGE-LINKED.md` |
| Incline-press contradiction | incline-dumbbell-press | same |
| All remaining | decline-dumbbell-fly, dip-chest-biased, dumbbell-pullover-chest-biased, dumbbell-pullover-lat-biased, flat-dumbbell-fly, flat-dumbbell-press, glute-bridge, hip-thrust, incline-cable-press, lying-triceps-extension-skull-crusher, romanian-deadlift, single-leg-hip-thrust, single-leg-romanian-deadlift, sissy-squat, smith-machine-romanian-deadlift, stiff-leg-deadlift | `POSITION-TAG-AUDIT-BATCH-2.md`, plus a final scan here |

**Final scan (this closure).** Every remaining tagged record was re-scanned for statements about peaks, constant tension, top, middle, bottom, lockout or squeeze. The scan covered every text field, including `mirror_effect`, `common_mistakes` and `evidence_notes`. **No further contradiction was found.**

## 2. Corrections applied and measured effects

Every change below was measured twice over the full 39,672-scenario space (byte-identical runs). Each passed the full gate, a fresh-clone check and a production smoke test.

| Change | Commit | Best Fit | Alternative | Complement lists | Empty / filled | Pinned cases |
|---|---|---:|---:|---:|---:|---|
| SCHEMA: position tags defined by resistance peak | `0b9381a` | — | — | — | — | — |
| preacher-curl: remove `shortened` (O2) + summary wording | `0b9381a` | 6 | 14 | 0 | 0 | unchanged |
| cable-overhead-extension-leaning-forward: remove `lengthened` | `8665b25` | 16 | 40 | 0 | 0 | unchanged |
| incline-dumbbell-press: remove unsupported "hardest through the middle" wording (tag kept) | `8665b25` | 0 | 0 | 0 | 0 | unchanged (74 stimulus-text changes) |
| incline-cable-press: remove `lengthened` (no replacement tag) | `c66d097` | 28 | 52 | 90 | 0 | unchanged |
| flat-dumbbell-fly: remove conflicting "hardest around the mid-range" from `why_this_exists` (tag kept) | `c66d097` | 0 | 0 | 0 | 0 | unchanged (0 downstream changes) |

**Change details:**
- **preacher-curl (O2):** biceps visual-area, low-skill limit, any / gym → preacher curl machine.
- **cable-overhead-extension:** triceps / triceps-back-depth visual-area → skull crusher (8); long head → overhead extension (4); arms region → incline curl (4). Profile changed to elevated-stability-isolation (still 8–15, packages valid); 48 programming-text changes.
- **incline-cable-press:** visual-area → incline dumbbell fly (10); "replace my incline cable press" → incline barbell press (6); complement / different stimulus with bodyweight → chest dip (12). Compound record: no profile or package effect.

**Unchanged throughout:** no package prescription, pinned expectation, ranking rule or engine logic was changed to accommodate a tag edit.

## 3. Remaining tags (23)

Authoritative statuses are in `EVIDENCE-LEDGER.md` › "Position tags: consolidated status". **None is source-verified.**

| Status | Count | Records |
|---|---:|---|
| **Contradicted** (kept) | 1 | cable-lateral-raise |
| **Consistent as stated, but unverified** | 11 | decline-dumbbell-fly, dip-chest-biased, dumbbell-pullover-chest-biased, dumbbell-pullover-lat-biased, flat-dumbbell-fly, incline-dumbbell-fly, sissy-squat, single-leg-romanian-deadlift, glute-bridge, single-leg-hip-thrust, hip-thrust |
| **Unverified** (no stated peak) | 11 | flat-dumbbell-press, incline-dumbbell-press, lying-triceps-extension-skull-crusher, overhead-triceps-extension, reverse-nordic-curl, seated-leg-curl, incline-dumbbell-curl, romanian-deadlift, stiff-leg-deadlift, smith-machine-romanian-deadlift, preacher-curl-machine |

## 4. Unresolved evidence gaps

- **No source on any tagged record's resistance curve.** The two verified preacher sources (Oliveira 2009 EMG; Nunes 2020, qualitative) are the only resistance-location evidence, and they cover only the free-weight / cable preacher curl.
- **Position vs peak.** Maeo 2023 (overhead triceps) and Maeo 2024 (hip-flexed hamstrings) support *joint positions*, not resistance peaks.
- **Incline curl activation.** Oliveira 2009 measured incline-curl activation rising toward the top. That is activation, not resistance, so it does not settle the incline curl's tag.

## 5. Changes requiring a separate future product decision

| Item | Why it is not an audit fix |
|---|---|
| cable-lateral-raise tag (contradicted) | Removal changes its profile to 10–20 reps, which invalidates shoulders-efficient and shoulders-complete (8–15). Needs a decision on those prescriptions |
| incline-dumbbell-curl, seated-leg-curl tags (unverified) | Same cascade: biceps-complete; hamstrings-efficient and hamstrings-complete |
| overhead-triceps-extension tag (unverified) | Removal changes approved pinned case #6 |
| preacher-curl-machine tag (unverified) | With the free-weight tag gone, the machine's unverified tag now carries the biceps visual-area rank under a low-skill limit |
| Package-reps validation rule | Ties prescriptions to the tag-selected profile. Any change to that coupling is an engine / validation decision, not a data fix |
