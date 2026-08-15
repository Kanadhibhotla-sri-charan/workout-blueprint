# Knowledge Manual ↔ YAML Reconciliation Report

**Produced for:** Task B, [Knowledge Integrity Remediation Plan](../../architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md)
**Method:** Every prose `### Name` heading in each `docs/knowledge-manual/<region>/<REGION>.md` was cross-matched by name against every YAML record's `name` field in the corresponding `data/exercises/<region>.yaml`, module by module, then all `overlaps_with` / `complements` / `alternatives` references across the whole YAML dataset were checked for resolvability. This is a full audit, not a sample.

## Result: three discrepancies found, all now have a disposition. Zero remain unexplained.

### 1. Romanian Deadlift — hips module (prose has it, YAML doesn't)

**Classification:** Same exercise, intentionally not duplicated.

`docs/knowledge-manual/hips/HIPS.md` has a full prose entry for the Romanian Deadlift. `data/exercises/hips.yaml` does not have a corresponding record. This is not an omission — it's [ADR 0001](../../adr/0001-canonical-record-format.md)'s deliberate dedup decision: the RDL is a genuinely identical exercise in both the hips and hamstrings prose modules (no execution fork), so it has exactly one canonical YAML record, `romanian-deadlift` in `data/exercises/hamstrings.yaml`, tagged `body_regions: [hips, hamstrings]`. This is precisely the pattern Task A of the remediation plan prescribes for cross-region exercises, and it already matches.

**Disposition:** No action needed. This is the sole reason the dataset has 123 YAML records against 124 prose entries, and it's intentional, not a gap.

### 2. Dumbbell Pullover (Lat-Biased) — back module (naming mismatch)

**Classification:** Naming difference, not a content or identity problem.

`data/exercises/back.yaml` has `dumbbell-pullover-lat-biased`, name `Dumbbell Pullover (Lat-Biased)`. `docs/knowledge-manual/back/BACK.md`'s heading read plain `### Dumbbell Pullover` — missing the `(Lat-Biased)` qualifier that both the YAML record and the entry's own body text use (the body text already cross-references "the chest-biased dumbbell pullover recorded in the chest module," so the content was never actually ambiguous — only the heading was out of sync).

This pairs with `dumbbell-pullover-chest-biased` in `data/exercises/chest.yaml` (`Dumbbell Pullover (Chest-Biased)`), which the plan's Task B specifically calls out as a case to check under the separate-variation rule. That check was already done in an earlier session: the two records genuinely fork on elbow bend (straighter arm = chest bias, more elbow bend = lat bias) and cross-reference each other, which is exactly what the separate-variation rule requires to justify two IDs. That part was already correct — only the prose heading text had drifted.

**Disposition:** Fixed. `BACK.md`'s heading now reads `### Dumbbell Pullover (Lat-Biased)`, and the one internal cross-reference to it ("Overlaps: Dumbbell pullover...") was updated to match.

### 3. Four bare cross-module relationship references

**Classification:** Schema-convention violation (Task C territory), caught while auditing Task B's relationship-reference requirement.

The established convention (used consistently everywhere else in the dataset) is: same-file `overlaps_with` / `complements` / `alternatives` entries are bare `id` strings; cross-file entries are quoted strings with a parenthetical module note, e.g. `"hammer-curl (arms module)"`. Four entries broke this pattern — they were bare IDs pointing at a record in a *different* file, which is misleading to a reader (or a future validator) expecting a bare ID to always mean "same file":

| File | Record | Field | Was | Now |
|---|---|---|---|---|
| `forearms.yaml` | `reverse-curl` | `overlaps_with` | `hammer-curl` | `"hammer-curl (arms module)"` |
| `forearms.yaml` | `reverse-curl` | `overlaps_with` | `zottman-curl` | `"zottman-curl (arms module)"` |
| `forearms.yaml` | `pronation-supination-work` | `overlaps_with` | `hammer-curl` | `"hammer-curl (arms module)"` |
| `shoulders.yaml` | `cable-rear-delt-builder` | `overlaps_with` | `seated-cable-row` | `"seated-cable-row (back module)"` |

None of these were broken links — all four target IDs genuinely exist in the file named — but the convention violation is exactly the kind of thing Task H's future validator is meant to catch automatically. Fixed by hand this pass; the validator (not yet built) should assert this convention going forward rather than relying on manual audits.

## Full relationship-reference integrity check

Ran a complete resolvability check across every `overlaps_with`, `complements`, and `alternatives` entry in all 123 YAML records (bare IDs must resolve within the same file; quoted cross-module references must resolve somewhere in the dataset). After the four fixes above: **zero orphan or unresolvable references remain.**

## What this report does *not* cover

- It does not check whether prose and YAML *content* say the same thing for every matched pair (that's a much larger content-equivalence audit, out of scope for Task B's stated acceptance criteria, which are about identity and count reconciliation, not prose/YAML content diffing).
- It does not touch `movement_patterns` taxonomy — that's Task F, covered separately.
- It does not re-litigate any exercise's `review_status` — that's Task D, already addressed (see Phase 0 log).

## Acceptance criteria check (Task B)

- [x] A reconciliation report exists (this document).
- [x] Every discrepancy has a disposition (three found, three resolved above).
- [x] No unexplained count discrepancy remains (123 vs. 124 = the RDL dedup, documented in ADR 0001).
- [x] Stable IDs are the cross-source identity mechanism (confirmed as the working convention; the one place it was violated — the four bare cross-file references — is now fixed).
