# Athletic Expansion — Badminton-Oriented Training

_Requested by the owner on 2026-10-18. Base: `b90c302`. Library: 143 → **163** records._

## Scope (owner's direction)

The blueprint only needs the right exercises with complete information, so the owner's other app can select them. Leg training is directed toward badminton fitness (power, agility, landing control, ankle resilience, mobility), not aesthetics, and whole-body endurance is included. **No routine, split or logging features were built.** Prescriptions use option A: proper metrics per training type.

## What was added

### Six functional goals (`functional-goals.yaml`)

| Goal id | Name | Parent region |
|---|---|---|
| lower-body-power | Lower-Body Power | quads |
| agility-change-of-direction | Agility & Change of Direction | hips |
| landing-control | Landing Control | quads |
| ankle-resilience | Ankle Resilience | calves |
| lower-body-mobility | Lower-Body Mobility | hips |
| full-body-conditioning | Full-Body Conditioning | full-body |

### Six prescription profiles (`programming-profiles.yaml`)

| Profile | Unit | Amount | Sets / rounds | Rest (s) | Frequency / week |
|---|---|---|---|---|---|
| power | reps | 3–6 | 3–5 | 90–180 | 2–3 |
| agility | seconds | 5–15 | 4–8 | 30–90 | 2–3 |
| movement-strength | reps | 6–10 | 2–4 | 60–120 | 2–3 |
| mobility-hold | seconds | 30–60 | 2–3 | 15–30 | 3–7 |
| mobility-dynamic | reps | 6–10 | 2–3 | 15–45 | 3–7 |
| conditioning | seconds (work) | 20–60 | 6–10 rounds | 20–90 | 1–3 |

- Each profile also carries an `effort` description, which replaces RIR.
- Amounts are per side for unilateral or alternating records.
- The numbers are practical starting points, not sourced prescriptions.

### 20 exercise records (`data/exercises/athletic.yaml`)

| Record | Mode | Functional goals | Equipment | Video channel |
|---|---|---|---|---|
| split-squat-jump | power | lower-body-power | bodyweight | Absolute MMA |
| lateral-bound | power | lower-body-power, agility-change-of-direction | bodyweight | LPS Athletic |
| box-jump | power | lower-body-power | plyo box | Your House Fitness |
| pogo-hops | power | ankle-resilience, lower-body-power | bodyweight | Live Lean TV Daily Exercises |
| lateral-shuffle | agility | agility-change-of-direction | bodyweight | XIP Training Systems |
| four-corner-shadow-footwork | agility | agility-change-of-direction, full-body-conditioning | bodyweight | Badminton Insight |
| drop-landing | power | landing-control | plyo box | Alex Bunt |
| lateral-lunge | movement-strength | landing-control, agility-change-of-direction | bodyweight, dumbbell | LivestrongWoman |
| single-leg-hop-and-stick | power | landing-control, ankle-resilience | bodyweight | Alex Bunt |
| deep-squat-hold | mobility-hold | lower-body-mobility | bodyweight | Swift Movement Academy |
| couch-stretch | mobility-hold | lower-body-mobility | wall, bench | Mobility Doc |
| cossack-squat | mobility-dynamic | lower-body-mobility | bodyweight | Hyper Strength & Conditioning |
| knee-to-wall-ankle-mobility | mobility-dynamic | ankle-resilience | wall | Victoria Park Osteopaths |
| hip-90-90-switches | mobility-dynamic | lower-body-mobility | bodyweight | Alejandro Matias |
| jump-rope | conditioning | full-body-conditioning, ankle-resilience | jump rope | Always Ghadi |
| shuttle-run | conditioning | full-body-conditioning | bodyweight | Clark Atlanta University Sports-Performance |
| shadow-badminton-intervals | conditioning | full-body-conditioning | bodyweight | Badminton Justin |
| burpee | conditioning | full-body-conditioning | bodyweight | Well+Good |
| rowing-machine-intervals | conditioning | full-body-conditioning | rowing machine | Chris Liddle: Fitness, Growth, and Skills |
| mountain-climber | conditioning | full-body-conditioning | bodyweight | Nick Tumminello - Trainer of Trainers |

Every record has:
- full coaching: 4 cues and 3 mistakes;
- limitations and a cautious, non-physique `mirror_effect`;
- no physique targets.

Five overlap pairs were added. Videos are checked by oEmbed title and channel only (not watched) and approved by default under `VIDEO-VERIFICATION-CLOSURE.md`. Status: `needs-review`.

### Existing records tagged with athletic goals (no other change)

| Record | Added functional goals |
|---|---|
| step-up | landing-control |
| reverse-lunge | landing-control |
| walking-lunge | landing-control |
| single-leg-calf-raise | ankle-resilience |
| tibialis-raise | ankle-resilience |

Copenhagen plank and hip abduction already carry `hip-stability`, which also applies.

### Taxonomy and schema additions

- `training_mode` field (closed vocabulary of six), documented in SCHEMA.md.
- Region `full-body`.
- New movement patterns: jump and land, lateral locomotion, multidirectional footwork, running, mobility hold, mobility drill, full-body conditioning.
- New equipment values: plyo box, jump rope, rowing machine.

### Engine and UI (additive only)

- **Profile matching** requires an exact `training_mode` match, so existing records keep their profiles.
- **Mode prescriptions:** `buildProgramming` adds `modePrescription` only for mode records (the field is omitted otherwise). Intensity techniques are disabled for mode records.
- **Drill isolation:** `makeRecommendation` removes mode records from every answer except the functional goals they carry.
- **UI:** the Decide and exercise detail pages show the mode grid (amount, sets / rounds, rest, frequency, effort) in place of reps / RIR / weekly sets for mode records. The detail page hides the intensity-technique section for them.

## Non-disruption evidence

- All **40,608** pre-existing Decide scenarios are **byte-identical** (two runs; SHA-256 `d12e0958…`). There are 0 missing and 0 changed.
- The Stage 1 plumbing alone was also byte-identical.
- **5,496** new scenarios: new goals, the full-body region, and drills as the current exercise.
- **Drills appearing in any non-functional answer: 0.**
- Tests: 346 / 346. Two tests were updated for the design: the region list now has 12 entries, and the profile-family check applies to hypertrophy records, with a new test that mode records classify into their own mode profile.

## Evidence

No performance or injury-prevention claims are cited. Text is kept descriptive (for example, "relevant to", "common in badminton footwork"); evidence notes are empty by design.

## Open items

- **Content sign-off:** 20 records are `needs-review`.
- **Videos:** all 20 metadata-only.
- **Region-only answers** for `full-body` without a functional goal return "no exercises", by design. A UI refinement to hide the region outside Function mode is optional.
