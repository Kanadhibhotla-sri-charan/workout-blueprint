# Exercise Expansion — Decline Presses and Single-Arm Lat Pulldown

_Requested by the owner on 2026-10-11. Base: `06470af`. Library: 140 → **143** records._

## Records added

| Record | Physique targets | Setup | Role | Status | Video |
|---|---|---|---|---|---|
| decline-barbell-bench-press | mid-pec, lower-pec (owner option C) | barbell + bench + rack | `secondary` | needs-review | zYBA82m9P9U (HASfit), metadata |
| decline-dumbbell-press | mid-pec, lower-pec (owner option C) | dumbbell + bench | `secondary` | needs-review | n1uA2MEAPIU (Travis Tarrant), metadata |
| single-arm-lat-pulldown | lat-width | cable | — | needs-review | LPahgWM7eUU (PureGym), metadata |

- **Coaching:** each record has full content, including 4 technique cues and 3 common mistakes.
- **Overlaps:** five new pairs added to `audited-overlaps.json`:
  - decline-barbell ↔ flat-barbell;
  - decline-barbell ↔ decline-dumbbell;
  - decline-dumbbell ↔ flat-dumbbell;
  - single-arm ↔ wide-pronated pulldown;
  - single-arm ↔ neutral-grip pulldown.
- **Videos:** title and channel checked via oEmbed; footage not watched. They are approved by default under the owner's video policy (`VIDEO-VERIFICATION-CLOSURE.md`).

## Lower-chest listing and evidence

The owner chose to list both decline presses under mid **and** lower chest (option C). Each record carries an evidence note stating that the lower-chest emphasis is not confirmed:
- Barnett et al. 1995 found **less** sternocostal activity on a decline than a flat bench;
- Rodríguez-Ridao et al. 2020 tested no decline;
- Glass & Armstrong 1997 could not be accessed and is unverified.

Evidence quality: unsupported for a lower-chest bias.

## `selection_role: secondary` on the two decline presses (owner approved)

**Rationale:** a decline variant of the flat press with no confirmed advantage. Without the role, they would win ties on the alphabetical id ("decline" sorts before "dip" and "flat").

| Variant | Best Fit changes |
|---|---:|
| Plain additions | 96 (e.g. dip → decline barbell ×18; flat bench → decline barbell ×12) |
| **With `secondary` (released)** | **22** |

The single-arm lat pulldown changes no Best Fit with or without a role, so it is unclassified. The selection-role allowlist test was updated.

## Measured (all 39,672 existing scenarios vs `06470af`; byte-identical runs)

- **22 Best Fit changes**, all lower-chest (`target:lower-pec`, `outcome:chest-lower-definition`):
  - cable-fly → decline-dumbbell-press: 8;
  - dumbbell-pullover-chest-biased → decline-dumbbell-press: 8;
  - decline-dumbbell-fly → decline-dumbbell-press: 6.
- **254** alternative / complement-list changes; **638** answers with any change (including text).
- **0** empty / filled changes.
- **936** new scenarios (the new records as the current exercise).
- **Best Fit counts of the new records:** decline-dumbbell-press 37, decline-barbell-bench-press 10, single-arm-lat-pulldown 0.
- **Pinned cases:** unchanged (345/345 tests).
