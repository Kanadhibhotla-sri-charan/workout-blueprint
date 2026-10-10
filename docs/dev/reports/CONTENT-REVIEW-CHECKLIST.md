# Content Review Checklist

_Used for every promotion to `reviewed` from this phase on. It extends the [Review Promotion Gate](REVIEW-PROMOTION-GATE.md); `validate-data` already enforces the automatable subset._

## Rules for recording a review

- **Name the method.** "Diff verified by AI" (text checked against the record and basic mechanics, no external source) is not the same as "content reviewed by a person". A record is promoted to `reviewed` only on the method the owner has accepted for that tier.
- **Video:** a title / channel metadata check is **not** a video review. A video counts as reviewed only when a person has watched it and confirmed the movement. Then `video_verification_method` becomes `visual`, with the date.
- **Citations:** a citation counts as re-checked only when its source has been opened and the note's claim compared with what the source reports. Results go in [EVIDENCE-LEDGER.md](EVIDENCE-LEDGER.md).
- **Overlaps:** relationships are decided by a person. They are never inferred to reduce alphabetical ties.
- **Engine:** out of scope. A data change that moves recommendations is measured and explained before release.

## Checklist (per record)

| # | Area | What to confirm | Why it matters |
|---|---|---|---|
| 1 | Ranking inputs | `stability_demand`, `skill_demand`, `setup_time`, `fatigue_cost`; `coverage_categories`; `exercise_type`; first `movement_patterns` entry | They decide tolerance filtering, goal ranking, and which exercises count as replace candidates (same first pattern and type) |
| 2 | Targets | `physique_targets` / `functional_goals` match what the exercise mainly trains; `primary_targets` / `secondary_targets` are accurate | Decide's candidate pools come from these tags |
| 3 | Secondary role | `selection_role: secondary` only for a genuine stand-in or accessory; the record's own text agrees | It changes default picks and replace / complement ties |
| 4 | Coaching | ≥ 3 cues and ≥ 2 mistakes that are exercise-specific, accurate and safe | Shown on the detail page and in Build |
| 5 | Equipment setups | Every setup is complete and genuinely enough on its own; the text covers each setup (band anchoring, bench height) | Feasibility, equipment continuity, the "limited equipment" ranking |
| 6 | Limitations | Realistic. The **first** limitation is shown as a Decide watch-out, so it must hold for every setup | Watch-out text |
| 7 | Resistance profile | Mechanically correct for every setup (where a band gets heavier or lighter) | Shown as the Decide "stimulus" text |
| 8 | Overlaps | Each `overlaps_with` entry covers substantially similar ground | Replace preference / complement avoidance |
| 9 | Evidence | Empirical claims have notes; each note re-checked against its source | Trustworthiness |
| 10 | Video | Watched; it shows this exercise and setup | `visual` verification |

## Pre-review notes for the nine new records

These are AI observations to speed up the human review, **not** the review. Every record stays `needs-review` until a person completes the checklist.
- All nine pass the validator and the coaching counts.
- None makes an empirical claim, so none has evidence notes.
- All nine videos are **metadata-checked only (0 watched)**.

| Record | Questions for the reviewer (checklist #) |
|---|---|
| cable-pull-through | (3) `secondary` is in line with its own "supporting stimulus" text, so confirm. (6) The first limitation, "limited by the cable stack…", is shown for band users too; consider setup-neutral wording. (10) The video title covers the cable version only |
| sissy-squat | (1) Stability **high**, skill **high**, fatigue **medium**: confirm. (7) The text mentions holding a weight at the chest; only bodyweight is modelled, which is intended |
| hamstring-bridge | (3) `secondary`: confirm. (1) Stability **medium**: confirm for heels on a bench. (2) `secondary_targets: glutes` |
| step-up | (5) Equipment is `bench` only; the text mentions optional dumbbells, which are not modelled (a Batch 2 decision): confirm. (2) `primary_targets` lists glutes but `physique_targets` is quads only: confirm |
| plank-shoulder-tap | (2) No physique target, functional goal `core-anti-rotation` only (Batch 5 decision): confirm. (1) Typed `isolation`, consistent with plank / side plank / Pallof press |
| seated-band-row | (7) "Hardest at the end of the pull": consistent with band mechanics. (2) `aesthetic_characteristics: horizontal-pull` matches the other rows |
| reverse-crunch | (1) Skill **medium** (pelvis curl vs knee swing): confirm. (8) Overlaps the hanging knee raise |
| single-leg-hip-thrust | (1) `shortened-position-emphasis`, consistent with the glute bridge and hip thrust. (10) Video verified 2026-10-08 by metadata |
| upright-row-wide-grip | (1) Typed `compound` with first pattern `shoulder abduction`. The type difference means it is never a *replacement* for a lateral raise (isolation). Confirm that's intended. (10) The video shows the barbell version; the record has 5 setups |
