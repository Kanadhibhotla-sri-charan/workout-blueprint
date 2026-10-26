# Flexibility Expansion — Badminton-Oriented Mobility and Recovery

_Requested by the owner on 2026-10-26. Base: `89dd2d6`. Library: 163 → **182** records._

## Scope (owner's direction)

The goal is a flexibility category for badminton: easier stretching and reaching during play, recovery, and injury resilience. The owner supplied 14 exercises and approved five extras ("all of them"). As before, the blueprint only holds exercises and their prescriptions. **No routine, split or logging features were built.**

## What was added

### Three functional goals (`functional-goals.yaml`)

| Goal id | Name | Parent region |
|---|---|---|
| upper-body-mobility | Upper-Body Mobility | shoulders |
| wrist-forearm-mobility | Wrist & Forearm Mobility | forearms |
| full-body-mobility | Full-Body Mobility & Recovery | full-body |

The existing Lower-Body Mobility and Ankle Resilience goals gain new members (below).

### Prescription changes (`programming-profiles.yaml`, `rep-ranges.yaml`)

- **New mode `soft-tissue`** (foam rolling): 30–60 s per area, 1–2 passes, 0–15 s rest, 2–7 times a week. Effort: moderate, tolerable pressure; never over a joint or bone. The guidance note says any effect is thought to be small and short-lived.
- **`best_timing`** (new optional profile field, shown as "When" in the app):
  - mobility drills (`mobility-dynamic`): before training or court sessions, as part of the warm-up;
  - held stretches (`mobility-hold`): after training or on rest days. Aim for about 5 minutes or more of stretching per area each week, spread over most days. This follows Thomas et al. 2018 (verified, see `EVIDENCE-LEDGER.md`); the owner's suggestion was 3+ days, and the review suggests 5 or more;
  - soft-tissue: briefly in a warm-up, or longer after training and on rest days.
- **Per-exercise amounts.** The owner's list gave specific amounts. These are now `rep-ranges.yaml` overrides, used for the per-item amount in the prescription. 12 overrides; the other 7 records use their profile's range.
  - Engine change: `resolveModePrescription` now reads the amount through `resolveRepRange`, so an override applies.
  - With no override the amount is unchanged, so the existing 20 athletic records are unaffected.

### 19 exercise records (`data/exercises/flexibility.yaml`)

| Record | Type | Amount | Goal(s) | Equipment | Video channel |
|---|---|---|---|---|---|
| thoracic-open-book | drill | 8–10 reps/side | upper-body-mobility | bodyweight | Elite Performance Institute |
| thread-the-needle | drill | 8–10 reps/side | upper-body-mobility | bodyweight | Suzanne Semanson |
| bench-thoracic-extension-prayer | hold | 30–45 s | upper-body-mobility | bench | Swift Movement Academy |
| doorway-pec-stretch | hold | 30–45 s/side | upper-body-mobility | bodyweight (door frame) | Baptist Health |
| kneeling-lat-stretch | hold | 30–45 s/side | upper-body-mobility | bench or rack | Gos Training Systems |
| cross-body-shoulder-stretch | hold | 30 s/side | upper-body-mobility | bodyweight | BSR Physical Therapy |
| band-shoulder-pass-through | drill | 10–15 reps | upper-body-mobility | band | 66 Days Fitness Coaching |
| wrist-flexor-extensor-stretch | hold | 30 s each direction/side | wrist-forearm-mobility | bodyweight | Glen Abbey Physiotherapy |
| strap-hamstring-stretch | hold | 30–60 s/side | lower-body-mobility | strap or towel | AskDoctorJo |
| wall-calf-stretch | hold | 30–45 s each knee position/side | ankle-resilience | wall | Dr. Christy Lee |
| adductor-rock-back | drill | 8–10 reps/side | lower-body-mobility | bodyweight | Mike Reinold |
| figure-four-glute-stretch | hold | 30–60 s/side | lower-body-mobility | bodyweight | PureGym |
| worlds-greatest-stretch | drill | 5 reps/side | full-body-mobility, lower-body-mobility | bodyweight | Panthera PT |
| leg-swings | drill | 10–15 reps/side | lower-body-mobility | bodyweight | PureGym |
| cat-cow (extra) | drill | 6–10 reps | full-body-mobility | bodyweight | Ramazan Altun |
| childs-pose-side-reach (extra) | hold | 30–60 s/side | upper-body-mobility | bodyweight | Power Plant Gym |
| standing-quad-stretch (extra) | hold | 30–60 s/side | lower-body-mobility | bodyweight | Live Lean TV |
| sleeper-stretch (extra) | hold | 30–60 s/side | upper-body-mobility | bodyweight | GREATER THAN Performance & Rehab |
| foam-rolling (extra) | soft-tissue | 30–60 s per area | full-body-mobility | foam roller | Movement As Medicine |

- Every record has full coaching (four cues, three mistakes), limitations, "best used when" / "less suitable when" notes, and cautious wording. None claims to prevent injury.
- **Naming choices:**
  - The figure-four record mentions pigeon as a deeper progression.
  - The sleeper-stretch record mentions the towel version as a standing alternative.
  - Foam rolling is one record covering calves, quads and upper back, with one cue per area.
- **Overlaps added** (snapshot updated):
  - thoracic-open-book ↔ thread-the-needle;
  - cross-body-shoulder-stretch ↔ sleeper-stretch;
  - childs-pose-side-reach ↔ kneeling-lat-stretch;
  - standing-quad-stretch ↔ couch-stretch.

## Review, videos and evidence

- **Content review:** all 19 are `reviewed`, on the owner's instruction ("Sign-off"). They were **not individually presented** to the owner.
- **Videos:** all 19 are `metadata`. Each was checked to exist through YouTube oEmbed (title and channel) and to be unique in the library. **None was watched.** They are approved by default under the owner's video policy (`VIDEO-VERIFICATION-CLOSURE.md`).
- **Evidence:** no `evidence_notes` on these records. Thomas 2018 supports the weekly stretching guideline; it is recorded in `EVIDENCE-LEDGER.md` with the injury-prevention source used in the reply to the owner (Lauersen 2014).

## Measured effect

Full Decide scenario space, two byte-identical runs, compared with the live baseline (`89dd2d6`, 46,104 scenarios).

- **All 40,608 non-athletic scenarios: byte-identical.** No flexibility record appears in any non-functional answer (0 leaks).
- **Athletic goals other than Lower-Body Mobility and Ankle Resilience: byte-identical.**
- **372 changed answers, all inside the two goals that gained members:**
  - **196 Best Fit changes.** Adductor rock-back, world's greatest stretch, standing quad stretch and leg swings in lower-body-mobility; wall calf stretch in ankle-resilience. 48 of these were previously empty answers that are now filled.
  - 142 alternative or complement-list changes.
  - 34 text-only changes: ankle-resilience answers whose Best Fit stays knee-to-wall ankle mobility. Same picks and watch-out; the answer text changes, which matches the new timing line on its prescription.
- **New scenarios:** 4,176, for the three new goals and the new region combinations they create.
- **Different-stimulus and complement answers** under the mobility goals can still pick a strength exercise from the same region, such as a rear-delt fly under Upper-Body Mobility. This is the existing behaviour (Lower-Body Mobility already does it). It is not new isolation leakage.

## Not done

- No routines, splits or logging.
- No video was watched.
- The 20 athletic expansion records remain `needs-review`.
