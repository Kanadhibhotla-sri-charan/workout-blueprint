# Movement-Pattern Taxonomy Classification

**Produced for:** Task F, [Knowledge Integrity Remediation Plan](../../architecture/KNOWLEDGE-INTEGRITY-REMEDIATION.md)
**Method:** Every `movement_patterns` value across all 123 YAML records was scanned for values that combine a fundamental movement with a modifier (the plan's own example: `elbow flexion in a lengthened shoulder position` is really `elbow flexion` + a shoulder-position modifier). 25 of 144 total values (~17%) were affected, across 23 records in 9 of the 11 modules.

## Classification of the 25 affected values

| Modifier category | Count | Examples |
|---|---|---|
| Secondary joint position (shoulder position for arm work; hip/knee position for leg work — the same underlying concept at a different joint) | 14 | `incline-dumbbell-curl` (shoulder), `preacher-curl` ×2 (shoulder), `overhead-triceps-extension` (shoulder), `triceps-kickback` (shoulder), `cable-overhead-extension-leaning-forward` (shoulder), `drag-curl` ×2 (shoulder/torso), `standing-calf-raise` / `seated-calf-raise` (knee), `seated-leg-curl` / `lying-leg-curl` (hip), `reverse-nordic-curl` (hip), `hip-thrust` (range) |
| Grip | 6 | `hammer-curl`, `cable-hammer-curl-rope`, `cross-body-hammer-curl`, `zottman-curl`, `reverse-curl`, `cable-reverse-curl` |
| Path/trajectory (diagonal, torso lean) | 2 | `cross-body-hammer-curl` (also counted under grip), `cable-overhead-extension-leaning-forward` (also counted under joint position) |
| Two true fundamental patterns happening at once, not a modifier on one pattern | 5 | `hex-press` (press + adduction), `hanging-knee-leg-raise` (hip flexion + trunk flexion), `cable-rear-delt-builder` (abduction + elbow flexion), `rear-delt-row` (extension + abduction + rotation), `face-pull` (abduction + rotation) |

**Reading the table:** the "secondary joint position" category dominates (14 of 25), and it's the same modifier type the evidence-notes work already leans on heavily — the biceps and triceps head-bias claims are *specifically* about shoulder position, so this modifier isn't cosmetic, it's load-bearing for claims already documented elsewhere in these same records. Grip is the second-largest category. The "two true patterns at once" group is structurally different from the other four — those aren't a fundamental pattern plus a positional detail, they're two independent joint actions occurring simultaneously, which the plan's own modifier taxonomy (grip / shoulder position / torso position / stance / ROM / resistance) doesn't cleanly name. Flagging that distinction here rather than forcing those 5 into a category that doesn't fit them.

## Decision: no new schema field, no ADR required

The plan is explicit that this shouldn't default to adding schema fields: *"Do not immediately add every modifier as a schema field. First classify the existing data and identify which modifiers recur often enough to justify structured fields."*

`movement_patterns` is already a YAML **list** field, not a scalar string. One record — `cable-overhead-extension-leaning-forward` — already had its torso-lean detail as a separate list item alongside the (still-unsplit) fundamental pattern, which is the pattern this normalization generalizes rather than invents. Given that, the smallest fix that satisfies Task F's acceptance criteria is: keep the fundamental pattern as its own list item, and give each modifier its own list item within the same field. No new field, no type change, no ADR — Task E and Task G are the places in this plan that explicitly require an ADR before a schema change, and this isn't one.

## What changed

All 25 affected values across 23 records (arms×12, calves×2, chest×1, core×1, forearms×2, hamstrings×2, hips×1, quads×1, shoulders×3) were split from one concatenated string into a fundamental-pattern item plus one item per modifier. Example:

```yaml
# before
movement_patterns: [elbow flexion in a lengthened shoulder position]

# after
movement_patterns: [elbow flexion, lengthened shoulder position]
```

The five "two true patterns" cases were split the same mechanical way (each pattern gets its own item) since that's still an improvement over one run-on string, even though — per the note above — they aren't really "pattern + modifier" the way the other 20 are.

## Acceptance criteria check (Task F)

- [x] Fundamental movement patterns use a controlled vocabulary — every record's first `movement_patterns` item is now a bare fundamental pattern (`elbow flexion`, `knee extension`, `hip extension`, etc.), consistent across the dataset.
- [x] Technique/position modifiers are not masquerading as new movement patterns — modifiers are now separate list items, not concatenated into the pattern string.
- [x] Exercise comparison does not depend on dozens of near-duplicate movement strings — comparing on the first list item alone now groups exercises by true fundamental pattern; the old concatenated strings would have defeated that.

## Not done in this pass (deliberately out of scope)

- No new schema field for grip/shoulder-position/stance was added, per the plan's own caution against doing so prematurely.
- The "two true patterns at once" group (5 records) is flagged above but not restructured differently from the rest — if a future phase wants to distinguish "modifier" from "co-occurring pattern" structurally, that's a real design question worth its own ADR, not something to improvise here.
