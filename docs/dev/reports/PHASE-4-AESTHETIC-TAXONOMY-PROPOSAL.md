# Phase 4 (Revised) — 4A Aesthetic Taxonomy Audit + Proposal

**Status:** Draft — awaiting architect review (4B), per spec §35 / §43.
**Do not treat anything in this document as canonical.** Nothing here has
been written to `data/programming/aesthetic-outcomes.yaml`. This is the
audit and proposal the spec requires before that file is created.

**Source spec:** `docs/architecture/PHASE-4-REVISED-AESTHETIC-OUTCOME.md`,
§35 ("Complete-Body Taxonomy Audit") and §43 (4A → 4B implementation
order).

---

## 1. What this audit did

Read every one of the 123 exercise records across all 11 `data/exercises/*.yaml`
files, with particular attention to the `mirror_effect` field (Phase 1's
plain-language visual-outcome description — it turns out to be almost a
direct source for aesthetic-outcome copy), `primary_targets`,
`secondary_targets`, and `movement_patterns`. Cross-referenced against the
existing `data/programming/physique-targets.yaml` (15 targets, covering
chest/shoulders/back/arms/core only) to find what's already covered and
what isn't.

The 6 regions with **zero** existing physique targets — calves, forearms,
hamstrings, hips (glutes), neck, quads — got a full read of every record.
For the 5 already-covered regions (chest, shoulders, back, arms, core) I
reused the target definitions already locked in `physique-targets.yaml`,
since those `physique_outcome` fields already describe the visual result
per target — this audit just maps them to viewpoints.

---

## 2. Audit findings, per §35's 7 required points

### 2.1 Defensible aesthetic outcomes (summary — full list in §4 below)

~24 candidate outcomes across 11 regions. Most are strongly supported —
directly traceable to a `mirror_effect` field describing that exact visual
result. A handful are weaker and flagged explicitly in §3.

### 2.2 Defensible physique targets

The 15 existing targets need no changes. 9 new targets are proposed to
cover the 6 previously-untagged regions (full definitions in §5). All 9
follow the same pattern as the existing ones: one canonical muscle/muscle-
group with a real, describable visual signature, not an invented
subdivision.

### 2.3 Anatomical mappings

Straightforward for the new targets — each maps to one real anatomical
structure already named in `primary_targets` on the underlying exercise
records (gastrocnemius, soleus, gluteus maximus, gluteus medius/minimus,
adductors, quads generically, hamstrings generically, wrist flexors, wrist
extensors/brachioradialis). No new anatomy is invented; all of it is
already present in the exercise data.

### 2.4 Functional targets to keep OUT of the aesthetic selector

These exist in the data and must stay reachable only through the
functional entry point (§12/§39 of the spec), never the aesthetic one:

- **Hip flexors** — `standing-cable-hip-flexion`, and the hip-flexion
  component of `hanging-knee-leg-raise`.
- **Grip / forearm endurance** — `farmers-carry`. Its own `mirror_effect`
  says plainly: "it isn't a shaping tool."
- **Forearm rotation** — `pronation-supination-work`. Its own
  `mirror_effect`: "not something that noticeably changes forearm shape or
  size by itself."
- **Rotator cuff / scapular stability** — `cable-band-external-rotation`
  (shoulders module) was already deliberately left untagged with
  `physique_targets` in the earlier expansion pass for this reason.
- **Trunk anti-extension / anti-rotation / anti-lateral-flexion** —
  `plank`, `pallof-press`, `suitcase-carry`. These match the spec's own
  §12 functional examples almost verbatim (anti-extension, anti-rotation,
  anti-lateral-flexion). `plank`'s own `mirror_effect` explicitly says its
  effect is "trunk endurance and bracing control more than muscle size."
- **Isometric neck hold** — explicitly a "control-and-tolerance builder,
  not a sizing tool" per its own `mirror_effect`.

Two records are **dual-purpose** and should stay tagged for aesthetic use
while also serving a functional role — this isn't a conflict, it's the
same pattern the spec describes for the shared downstream knowledge in
§12:
- `ab-wheel-rollout` — movement pattern is "anti-extension through range,"
  but its `mirror_effect` says it's "more likely than a plank to add
  visible ab thickness." Keep it aesthetic-eligible (rectus-abdominis).
- `hip-abduction` — trains hip/pelvic stability functionally, but also has
  a clear, direct `mirror_effect` (fills the "hip dip," rounds the side
  hip profile). Keep it aesthetic-eligible too.

### 2.5 Ambiguous or unsupported outcomes — flagged, not proposed

- **Shin / tibialis anterior fullness** (`tibialis-raise`) — real and
  visible per its own `mirror_effect`, but it's not something the spec's
  own outcome examples, §9's region list, or §40's minimum test list ever
  mention, and "shin shape" isn't a mainstream mirror complaint the way
  "chest looks flat" is. Identified, but **not proposed** for v1 — this is
  exactly the kind of manufactured precision §10 warns against if pushed
  in without a real user need behind it.
- **Quad "sweep" / teardrop separation** (`leg-extension`,
  `reverse-nordic-curl`) — genuinely described in the data, and "quad
  sweep" is real bodybuilding vocabulary, not invented. But it's supported
  by essentially one exercise's `mirror_effect` language, not a body of
  data the way "chest looks flat from the side" is (backed by 3 separate
  pec-region targets). Proposed **as a flagged/tentative outcome** in §4 —
  include only if the architect agrees a single-exercise-supported outcome
  clears the bar.
- **Neck thickness** — real and visible, but the data's own framing calls
  lateral neck work "a niche addition for most lifters," and neck size
  isn't in the spec's own §40 minimum test list. Proposed but flagged as
  **lowest priority** — defensible to build, also defensible to defer to
  a later taxonomy expansion pass (4I) rather than the initial 4C load.

### 2.6 Outcomes with broad vs. single-exercise support

Broad (3+ independent exercises each contributing real data): chest
front-width, chest side-projection, back width, back thickness, shoulder
width, arm thickness (both biceps and triceps sides), triceps back depth,
ab definition, glute roundness, quad front mass, hamstring back fullness,
calf width.

Single- or two-exercise support (flagged where relevant in §4/§5): quad
sweep (leg-extension primarily), neck thickness (neck-extension
primarily), both forearm outcomes (2-3 exercises each, which is normal for
a small muscle group, not a red flag).

### 2.7 Taxonomy overlaps / synonyms to collapse

- Front-delt was **not** given its own aesthetic outcome. Its own
  `physique_outcome` in the existing taxonomy already says it's "rarely
  the limiting factor" and is "already heavily worked by most chest
  pressing" — front-of-shoulder roundness is really a side effect of chest
  pressing, not an independent visual complaint users report. Proposing an
  aesthetic outcome for it would be inventing user-facing precision the
  data doesn't support (same failure mode §10 warns against).
- Gastrocnemius and soleus stay as **two** targets/outcomes, not
  collapsed into one "calf size" outcome — the data is unusually clear
  that they're visually distinct (upper diamond bulge vs. lower fullness
  near the ankle), each with its own dedicated exercises.
- Wrist-flexor and wrist-extensor/brachioradialis forearm outcomes stay
  separate for the same reason — opposite sides of the forearm, visually
  distinct, each with dedicated exercises.

---

## 3. Guardrails this proposal deliberately respected

- **No inner/outer chest, inner/outer quad, inner/outer biceps** — none
  proposed, per §10's explicit examples of what not to invent.
- **No `lower-abs` target** — stays excluded per §31/Guardrail #8; the
  existing `rectus-abdominis` target and its front-view outcome cover the
  ab region.
- **No numeric stimulus scores, no new evidence claims** — every proposed
  outcome's `visual_description` is paraphrased directly from an existing,
  already-reviewed `mirror_effect` field, not invented language.
- **Functional-primary exercises stay out of the aesthetic list** (§2.4
  above), matching §12/§39's separation requirement.

---

## 4. Proposed aesthetic-outcomes taxonomy (candidate, for review)

Organized region → viewpoint → outcome, per the spec's §6-§8 structure.
`(★)` marks the two required golden-slice outcomes (§36/§37). `(flag)`
marks the lower-confidence outcomes from §2.5 — proposed, but the
architect should explicitly confirm or cut these before 4C.

### Chest
| id | display_name | viewpoint | physique_targets |
|---|---|---|---|
| `chest-front-width` | "Chest doesn't look wide enough from the front" | front | mid-pec, upper-pec |
| `chest-side-projection` ★ | "Chest looks flat from the side" | side | upper-pec, lower-pec |
| `chest-upper-shelf` | "Upper chest doesn't stand out" | front | upper-pec |
| `chest-lower-definition` | "Chest-to-abdominal boundary isn't clear" | side/front | lower-pec |

`chest-side-projection` is the required golden-slice outcome (§36) and
resolves to the **already-validated** Upper Pec engine path (Incline
Dumbbell Press → complement Cable Fly, golden test case passed in the
first Phase 4 pass — `docs/dev/reports/PHASE-4-GOLDEN-TEST-CASE.md`). 4C-4F
should mostly be wiring this outcome to that existing, working chain, not
rebuilding it.

### Shoulders
| id | display_name | viewpoint | physique_targets |
|---|---|---|---|
| `shoulder-width-front` | "Shoulders don't look wide enough" | front | side-delt |
| `shoulder-3d-shape` | "Shoulders look front-heavy / flat from behind" | back/side | rear-delt |

Front-delt intentionally has no dedicated outcome — see §2.7.

### Back
| id | display_name | viewpoint | physique_targets |
|---|---|---|---|
| `back-width-v-taper` | "Back doesn't look wide enough / weak V-taper" | back | lat-width |
| `back-side-thickness` | "Back looks flat / no depth from the side" | side | back-thickness |
| `upper-back-fullness` | "Neck-to-shoulder area doesn't look full" | front/back | upper-traps |

### Arms
| id | display_name | viewpoint | physique_targets |
|---|---|---|---|
| `biceps-front-peak` | "Biceps don't look full from the front" | front | biceps |
| `arm-side-thickness` | "Arms look thin from the side" | side | brachialis-arm-thickness, triceps |
| `triceps-back-depth` ★ | "Triceps have no depth from behind" | back | triceps, triceps-long-head |

`triceps-back-depth` is the second required golden slice (§37).

### Core
| id | display_name | viewpoint | physique_targets |
|---|---|---|---|
| `ab-front-definition` | "Abs don't show definition from the front" | front | rectus-abdominis |
| `waist-side-definition` | "Waist/sides don't show definition" | front/side | obliques |

### Glutes *(new region — underlying exercise data region is `hips`)*
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `glute-roundness` | "Glutes look flat" | back | gluteus-maximus |
| `glute-side-projection` | "Glutes don't project from the side" | side | gluteus-maximus |
| `hip-width-side` | "Hips don't look full / 'hip dip' is visible" | side/front | gluteus-medius-minimus |

### Quads
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `quad-front-mass` | "Thighs look thin from the front" | front | quads |
| `inner-thigh-fullness` | "Inner thigh looks thin" | front | adductors |
| `quad-sweep-separation` (flag) | "No separation above the knee" | front | quads (sweep-emphasis note only, not a separate target) |

### Hamstrings
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `hamstring-back-fullness` | "Back of thighs look flat" | back | hamstrings |

### Calves
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `calf-width-shape` | "Calves look thin / no shape" | back/side | gastrocnemius |
| `calf-lower-fullness` | "Lower calf near the ankle looks thin" | side | soleus |

*(Shin/tibialis fullness identified but not proposed — see §2.5.)*

### Forearms
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `forearm-fullness-inner` | "Forearms look thin (palm side)" | front | forearm-flexors |
| `forearm-fullness-outer` | "Forearms look thin (back of hand side)" | side/back | forearm-extensors |

### Neck (flag)
| id | display_name | viewpoint | physique_targets (new) |
|---|---|---|---|
| `neck-thickness` (flag) | "Neck doesn't look thick" | side/back | neck-thickness |

---

## 5. Proposed new physique-target definitions

If approved, these 9 (or 8, if neck is deferred) would be added to
`data/programming/physique-targets.yaml`, in the same format as the
existing 15 — `id`, `name`, `parent_region`, `definition`,
`physique_outcome` — each `physique_outcome` paraphrased directly from the
supporting exercises' `mirror_effect` fields, not newly invented:

- **`gastrocnemius`** (parent_region: calves) — the two-headed calf
  muscle responsible for the visible diamond shape and overall calf width
  from behind/the side.
- **`soleus`** (calves) — the muscle beneath the gastrocnemius responsible
  for lower-calf fullness near the ankle.
- **`gluteus-maximus`** (hips) — responsible for glute roundness and
  side-view projection.
- **`gluteus-medius-minimus`** (hips) — responsible for hip width and
  filling the side "hip dip."
- **`adductors`** (hips) — responsible for inner-thigh fullness/profile
  from the front.
- **`quads`** (quads) — the quadriceps as a whole, responsible for
  front-of-thigh mass/size. (A generic top-level target — not split by
  head, per the fake-precision guardrail; `quad-sweep-separation` above is
  flagged rather than backed by its own target for the same reason.)
- **`hamstrings`** (hamstrings) — the hamstring group as a whole,
  responsible for back-of-thigh fullness. Deliberately **not** split by
  exercise (seated vs. lying leg curl) — the data itself says the two
  "fill out the back of thigh more evenly, top to bottom" together, which
  argues against a split, not for one.
- **`forearm-flexors`** (forearms) — palm-side forearm mass.
- **`forearm-extensors`** (forearms) — back-of-hand-side forearm mass and
  the brachioradialis "peak" at the elbow crease.
- *(flagged)* **`neck-thickness`** (neck) — back/side neck thickness,
  primarily from neck extension.

---

## 6. What this proposal is NOT

- Not a commitment to build all ~24 outcomes before the golden slices —
  §43/§36/§37 still require validating `chest-side-projection` first, then
  `triceps-back-depth`, before any taxonomy expansion (4I).
- Not a change to any existing exercise record, physique target, or
  engine code. Nothing in `data/` or `app/src/` has been touched.
- Not final. Everything here — especially the two `(flag)` items
  (`quad-sweep-separation`, `neck-thickness`) and any naming choices — is
  open to the architect cutting, renaming, or restructuring before 4C.

---

## 7. Requested decision

1. Approve, cut, or revise the ~24-outcome / 9-target candidate list above.
2. Confirm or reject the two flagged (lower-confidence) outcomes.
3. Confirm the golden-slice mappings in §4 (`chest-side-projection` →
   upper-pec + lower-pec; `triceps-back-depth` → triceps +
   triceps-long-head) match what the architect intended in §36/§37.
4. On approval, implementation proceeds to 4C (canonical
   `aesthetic-outcomes.yaml`) → 4D → 4E (first golden slice), per §43.
