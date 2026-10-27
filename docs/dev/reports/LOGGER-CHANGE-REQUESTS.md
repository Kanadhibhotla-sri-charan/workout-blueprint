# Workout Logger Change Requests — Implementation Log

_Requested 2026-10-27 from the Workout Logger side, against `5c75862`. Rule: Blueprint states the coaching numbers directly; the logger only reads them. Every change is additive and keeps existing ids._

## Step 1: volume data model (1.1–1.3)

### 1.1 Weekly volume per muscle: `data/programming/volume-targets.yaml`

- **Units.** Numbers count **credited hard sets per 7-day week**: logged hard sets × the exercise's `target_credit` weight (1.3). A bench-press set adds 1.0 to chest and 0.5 each to front delt and triceps.
- **Levels:**
  - `minimum`: about a third of efficient (Bickel 2011; Spiering 2021);
  - `efficient`: 10 for the main muscles, the bottom of the global practical range (Schoenfeld 2017; Pelland 2026);
  - `priority`: up to 16, inside the practical range (10–20). A test caps it at 20.
- **Smaller or mostly indirect muscles** sit below the global ranges, and each entry's `rationale` says why. Examples: front delt (pressing covers it), biceps and brachialis (pulls and curls credit them), adductors, upper traps, forearms.
- **`per_session_max`** (6–8): a practical ceiling, **not sourced**.
- **`indirect_only: true`** (front delt, upper traps, adductors, forearm flexors): compound work usually reaches minimum and efficient, so direct work is scheduled only when the muscle is a goal.
- **Children** (upper / mid / lower chest, triceps long head, gastrocnemius, soleus) carry `volume_from_parent` instead of their own numbers.

| Target | min | efficient | priority | per session | indirect only |
|---|---:|---:|---:|---:|---|
| chest (group) | 4 | 10 | 16 | 8 | no |
| calves (group) | 4 | 8 | 16 | 8 | no |
| front-delt | 2 | 6 | 12 | 6 | yes |
| side-delt | 4 | 10 | 16 | 8 | no |
| rear-delt | 2 | 8 | 14 | 6 | no |
| lat-width | 4 | 10 | 16 | 8 | no |
| back-thickness | 4 | 10 | 16 | 8 | no |
| upper-traps | 0 | 6 | 12 | 6 | yes |
| biceps | 2 | 8 | 14 | 6 | no |
| brachialis-arm-thickness | 2 | 6 | 14 | 6 | no |
| triceps | 2 | 8 | 16 | 8 | no |
| rectus-abdominis | 2 | 6 | 10 | 6 | no |
| obliques | 0 | 6 | 10 | 6 | no |
| gluteus-maximus | 4 | 10 | 16 | 8 | no |
| gluteus-medius-minimus | 0 | 6 | 12 | 6 | no |
| adductors | 0 | 4 | 10 | 6 | yes |
| quads | 4 | 10 | 16 | 8 | no |
| hamstrings | 4 | 10 | 16 | 8 | no |
| forearm-flexors | 0 | 4 | 10 | 6 | yes |
| forearm-extensors | 0 | 4 | 10 | 6 | no |
| neck-thickness | 0 | 4 | 10 | 6 | no |

**Note for the logger:** the request says non-goal muscles use "efficient per 14-day cycle". These numbers are per 7 days. Counting them over 14 days halves the dose: 10 sets per 14 days is 5 a week, close to "minimum".

### 1.2 Muscle hierarchy: `physique-targets.yaml`

- **New `volume_groups`:** `chest` and `calves`. These are volume parents, not physique targets: Decide never shows or recommends them.
- **Children:**

| Child | Parent | volume_share | min_share |
|---|---|---:|---:|
| upper-pec | chest | 0.4 | 0.3 |
| mid-pec | chest | 0.4 | 0.2 |
| lower-pec | chest | 0.2 | — |
| triceps-long-head | triceps | 0.4 | 0.33 |
| gastrocnemius | calves | 0.6 | 0.4 |
| soleus | calves | 0.4 | 0.25 |

- The shares are practical biases (judgement, not sourced).
- **Delts stay separate.** They are three different muscles with different exercises, and each has its own number.
- Glutes, back and forearms are also left flat.

### 1.3 Credit per exercise: `target_credit`

- **138 strength exercises** have it. That is every strength exercise with a physique target, plus conventional deadlift, 45° back extension (spinal), farmer's carry, plank shoulder tap, isometric neck hold and lateral neck flexion, which add real work to a target.
- **Still without credit:** tibialis raise, pronation–supination work, standing cable hip flexion, band external rotation and push-up plus. None of them maps to a physique target.
- **Weights:**
  - 1.0 for the exercise's own targets;
  - 0.5 for a real synergist (press → triceps and front delt; vertical pull → biceps and back thickness; row → lats; curl → brachialis; squat → glutes);
  - 0.25 for minor contributions.
- **Child credit marks bias.** Examples: incline press → `chest 1.0 + upper-pec 1.0`; cable fly → chest split 0.33 / 0.34 / 0.33; standing calf raise → `calves 1.0` split gastrocnemius 0.7 / soleus 0.3.

### Validation

`validate-data.js` now fails when:
- a target or group has no volume entry, or has more than one;
- `target_credit` uses an unknown id or a weight outside (0, 1];
- a physique target of the exercise is missing from its credit;
- a child is credited without its parent, or above it;
- children's shares add up to more than 1.0, or a child's `min_share` exceeds its `volume_share`;
- a strength exercise with physique targets has no credit.

Each check was confirmed by breaking the data on purpose.

### Measured

Full Decide scenario space (50,280), two identical runs:
- **Every recommendation and every piece of answer text is unchanged.**
- The only difference: the target object inside answers for the six child targets and their outcomes (4,589 answers) now carries `parent` / `volume_share` / `min_share`. With those three keys stripped, the output is byte-identical to live.
- Nothing in the UI displays them.

## Step 2: planning rules (2.1, 2.3, 2.4)

### 2.1 Frequency as a recovery rule

- **New fields.** Every volume entry with weekly numbers now has `sessions_per_week` ([2, 3] throughout) and `min_hours_between`:
  - 48 h for most muscles;
  - 24 h for abs, calves, forearms and neck.
- **Frequency does not multiply volume.** With volume equated, training frequency made no meaningful difference to muscle growth (Schoenfeld 2019; Pelland 2026, both verified in the ledger). So frequency only spreads the weekly number.
- **The 48 h / 24 h rule is practical, not sourced.**
- **Validator:** the upper frequency × `per_session_max` must reach `priority`, so a priority week is always schedulable within the per-session ceiling.
- **Packages.** The package engine comment, the package file header and the four Phase 5 spec docs now say packages are sample sessions, and that weekly volume comes from `volume-targets.yaml`.
  - The Build pages still show each package's own "sets/week". It is computed the same way and is unchanged on screen, but is no longer presented as the muscle's weekly target.
  - That label could be reworded later if wanted.

### 2.3 Priority built into goals

- **`volume_levels` on all 26 aesthetic outcomes:** primary → `priority`, supporting → `efficient`.
- **Child targets:** the level goes to the parent group, and the child is listed as `bias`. Example: chest-upper-shelf = `chest: priority`, `upper-pec: bias`.
- Example from the request: arm-side-thickness = `brachialis-arm-thickness: priority`, `triceps: efficient`.
- **Not added: `preferred_exercises`.** The Decide engine already ranks exercises for every outcome, and many outcomes already carry `exercise_roles`. A second hand-written list would drift from those rankings. The logger can read the Decide ranking, or the outcome's `exercise_roles` where present. A static list can still be added if the logger needs one; it should be generated from the engine, not typed by hand.

### 2.4 Core split into real qualities

| Quality | Volume entry | Main exercises |
|---|---|---|
| Flexion | `rectus-abdominis` | crunches, reverse crunch, hanging raise, ab wheel |
| Rotation / anti-rotation / anti-lateral flexion | `obliques` | woodchop, Russian twist, pallof press, side plank, suitcase carry |
| Anti-extension | `goal_id: core-anti-extension` (new) | plank, ab-wheel rollout |

- **Numbers:** each has efficient 6, priority 10, at most 6 per session, and 24 h between sessions.
- **Plank** now credits anti-extension 1.0 and rectus 0.5. The ab wheel credits both at 1.0.
- **Badminton flag:** the four anti-rotation and anti-lateral-flexion exercises carry `sport_carryover: [badminton]`. This is a coaching judgement; no source shows it improves badminton performance.

### Measured

Every Decide answer is byte-identical to the Step 1 release (50,280 scenarios, two identical runs).

## Step 3: time cost per exercise (2.2)

Every exercise (182) has a `time` block, derived from its existing prescription so the numbers agree with what the app already prescribes. The rules are in SCHEMA.md › `time`.

| Field | Rule |
|---|---|
| `setup_minutes` | 0 bodyweight / wall with low setup; otherwise low 1, medium 2, high 3 |
| `seconds_per_set` | rep-range midpoint × 3 s + 5 s; holds use the seconds midpoint. Plank 40, side plank 30, Copenhagen 25, carries 40–45; wall calf stretch 75 (two knee positions); wrist stretch 60 (two directions); foam rolling 135 (three areas) |
| `rest_seconds` | isolation 60–90; compound 90–150; heavy free-weight compound 120–180; training-mode records use their profile's rest |
| `per_side` | true exactly for unilateral records (41) |
| `superset_friendly` | false for heavy free-weight compounds, high-setup exercises, and power / agility / conditioning drills |

- **Sources.** Rest follows Singer 2024 (verified): above 60 s helps a little, and beyond 90 s no appreciable difference was found. The longer rest for heavy lifts is for performance, not growth. Seconds per rep is an estimate, **not sourced**.
- **Sanity check.** A 5-exercise, 15-set upper session estimates 30–38 minutes. That puts a 60-minute session at about 8–9 exercises, or 16–22 sets with a warm-up, consistent with the logger's own figure in 3.2.
- **Validator and test:** every record must have `time`. Ranges are checked: setup 0–10, seconds 5–300, rest 0–300 with low ≤ high, and `per_side` must match laterality.
- **Measured:** Decide byte-identical to Step 2.
