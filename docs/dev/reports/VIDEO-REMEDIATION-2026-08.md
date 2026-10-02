# Video Reference Remediation — August 2026 (historical log)

_Frozen record of one past remediation pass. Unlike [`VIDEO-CURATION-QA.md`](VIDEO-CURATION-QA.md), this file is **not** regenerated. It preserves which exercises were changed in that pass and why, so the QA report generator doesn't need to hardcode those ids._

Merged to `main` in commit `b018abc` on 2026-08-28.

## Starting state (independently audited)

All 123 exercises were marked `video_status: verified`, backed by a QA report claiming every video had been manually verified. That claim was unsupported. A YouTube oEmbed audit found:

| Result | Count |
|---|---|
| Live (HTTP 200) | 45 |
| Dead / unavailable (HTTP 404) | 76 |
| Malformed — id rejected by YouTube (HTTP 400) | 2 |
| **Total** | **123** |

The dead/malformed split was re-confirmed on 2026-10-02 by re-probing the pre-remediation URLs from commit `b56a1c7`.

A content check of the 45 live links against each exercise's own `name`, `equipment` and `laterality` rejected 6 more as mismatches.

## What changed

| Group | Count | Action |
|---|---|---|
| Dead links replaced | 76 | New live reference found and checked |
| Malformed links replaced | 2 | New live reference found and checked |
| Live but content-mismatched, replaced | 6 | New live reference found and checked |
| Live and correct, kept | 39 | Link kept; `video_creator`/`video_title` corrected to match what the URL actually resolves to |
| **Total** | **123** | |

Every reference ended the pass as `verified`, recorded as `video_verification_method: metadata` and `video_verified_on: "2026-08-28"`: its title and channel were checked against the exercise's name, equipment and laterality. **No footage was watched.** No exercise was set to `needs-review`, because a confident match was found for all 84 replacements.

### Dead links replaced (76)

- `back-extension-45-hip-dominant`
- `barbell-bent-over-row-pronated`
- `barbell-dumbbell-shrug`
- `bulgarian-split-squat-hip-dominant`
- `cable-band-external-rotation`
- `cable-chest-press`
- `cable-crunch`
- `cable-curl`
- `cable-drag-curl`
- `cable-hammer-curl-rope`
- `cable-kickback-glute`
- `cable-overhead-extension-leaning-forward`
- `cable-rear-delt-builder`
- `cable-reverse-curl`
- `cable-shoulder-press`
- `cable-woodchop`
- `chest-supported-row`
- `chin-up-supinated`
- `conventional-deadlift`
- `cross-body-hammer-curl`
- `decline-dumbbell-fly`
- `dip-chest-biased`
- `drag-curl`
- `dumbbell-pullover-chest-biased`
- `dumbbell-pullover-lat-biased`
- `dumbbell-squat-sides`
- `farmers-carry`
- `flat-dumbbell-press`
- `front-squat`
- `hex-press`
- `hip-abduction`
- `hip-adduction`
- `incline-barbell-press`
- `incline-cable-press`
- `incline-machine-press`
- `isometric-neck-hold`
- `lateral-neck-flexion`
- `leg-press-calf-raise`
- `lying-leg-curl`
- `machine-crunch`
- `machine-lateral-raise`
- `machine-reverse-fly`
- `machine-triceps-extension`
- `neck-extension`
- `neck-flexion`
- `neutral-grip-lat-pulldown`
- `pallof-press`
- `pronation-supination-work`
- `push-up-plus`
- `rack-pull`
- `rear-delt-fly`
- `rear-delt-row`
- `reverse-curl`
- `reverse-grip-barbell-row`
- `reverse-grip-lat-pulldown`
- `reverse-lunge`
- `reverse-nordic-curl`
- `reverse-wrist-curl`
- `romanian-deadlift`
- `single-leg-calf-raise`
- `smith-machine-bench-press`
- `smith-machine-bulgarian-split-squat`
- `smith-machine-incline-press`
- `smith-machine-romanian-deadlift`
- `smith-machine-shoulder-press`
- `smith-machine-squat`
- `standing-cable-hip-flexion`
- `stiff-leg-deadlift`
- `straight-arm-pulldown`
- `suitcase-carry`
- `sumo-deadlift`
- `sumo-squat`
- `tibialis-raise`
- `triceps-kickback`
- `wrist-curl`
- `zottman-curl`

### Malformed links replaced (2)

- `cable-fly`
- `nordic-hamstring-curl`

### Live but content-mismatched, replaced (6)

- `back-squat` — Old link resolved, but the variation shown was ambiguous for this record.
- `barbell-ez-bar-curl` — Old link resolved to a different exercise (wrong equipment).
- `bulgarian-split-squat-knee-dominant` — Old link resolved, but did not distinguish the short-stance, knee-dominant variation.
- `dip-triceps-biased` — Old link resolved to a different exercise.
- `overhead-triceps-extension` — Old link resolved, but the variation shown was ambiguous for this record.
- `static-lunge` — Old link resolved, but the variation shown was ambiguous for this record.

### Kept, attribution corrected (39)

- `ab-wheel-rollout`
- `back-extension-45-spinal-dominant`
- `cable-lateral-raise`
- `cable-pushdown`
- `close-grip-bench-press`
- `dumbbell-curl`
- `dumbbell-lateral-raise`
- `face-pull`
- `flat-barbell-bench-press`
- `flat-dumbbell-fly`
- `goblet-squat`
- `hack-squat`
- `hammer-curl`
- `hanging-knee-leg-raise`
- `hip-thrust`
- `incline-dumbbell-curl`
- `incline-dumbbell-fly`
- `incline-dumbbell-press`
- `lat-pulldown-wide-pronated`
- `leg-extension`
- `leg-press`
- `lying-triceps-extension-skull-crusher`
- `machine-chest-press`
- `machine-fly-pec-deck`
- `overhead-press`
- `plank`
- `preacher-curl`
- `preacher-curl-machine`
- `pull-up-pronated`
- `push-up-chest`
- `russian-twist`
- `seated-cable-row`
- `seated-calf-raise`
- `seated-leg-curl`
- `seated-machine-shoulder-press`
- `single-arm-dumbbell-row`
- `standing-calf-raise`
- `t-bar-row`
- `walking-lunge`
