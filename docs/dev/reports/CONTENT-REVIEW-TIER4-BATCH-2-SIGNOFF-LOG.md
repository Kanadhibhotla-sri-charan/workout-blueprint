# Content Review Tier 4, Batch 2 — Human Sign-Off Log

_Untouched `needs-review` records, next by exposure (baseline `b5a1340`): dumbbell-squat-sides 365, cable-band-external-rotation 326, triceps-kickback 320. Decisions by the project owner, one record at a time. **Final go given; applied as recorded below.**_

| # | Record | Decision | Approved corrections | Rationale / measured effect | Pre-existing concerns logged (unchanged) | Video watched? |
|---|---|---|---|---|---|---|
| 1 | dumbbell-squat-sides | **Approve all** | (1) add 4 technique cues + 3 common mistakes as proposed; (2) `complements`: "A barbell squat or a goblet squat, depending on what's available." → "A hip-hinge movement such as a Romanian deadlift." | Suggesting a complement it overlaps with contradicts the overlap watch-out ("avoid stacking both in one routine"). Measured: 0 Decide changes (free text; no resolvable id) | (3) "Removes the anti-flexion bracing demand a goblet squat adds"; "more mass potential" from the higher total load: unsourced; kept | No (stays `metadata`) |
| 2 | cable-band-external-rotation | **Approve all** | (1) add 4 technique cues + 3 common mistakes as proposed; (2) `resistance_profile`: "Cable or band, constant tension, light load." → "Light load either way. A cable keeps the pull steady through the rotation; a band gets heavier as it stretches toward the end of the rotation." | A band is not constant tension (same correction as cable-curl). Measured: 326 text-only Decide changes, 0 recommendation changes; rotator-cuff Best Fit test unaffected | (3) "Joint durability / resilience" purpose: unsourced, non-medical framing kept; video (by title) shows the cable version only | No (stays `metadata`) |
| 3 | triceps-kickback | **Approve all** | (1) add 4 technique cues + 3 common mistakes as proposed | Coaching gate; 0 Decide changes expected. "End of the range where pressing and pushdowns are easiest" is consistent with bent-over leverage; the evidence note's long-head anatomy is correct | (3) "Mind-muscle-connection finisher… rather than real mechanical tension": cautious framing, unsourced; one `less_suitable_when` line describes an execution error rather than a situation: kept | No (stays `metadata`) |

## Applied

| Item | What changed |
|---|---|
| Human content review | All 3 records → `review_status: reviewed`. Library: **80 `reviewed` / 60 `needs-review`** |
| Coaching | 4 technique cues + 3 common mistakes added to each record |
| dumbbell-squat-sides | `complements` → hip hinge |
| cable-band-external-rotation | `resistance_profile` corrected for the band |
| Video verification | Unchanged: all 3 stay `metadata`. No footage was watched |
| Citation verification | No new citations. Unsourced claims are logged above |

**Measured** (all 39,672 scenarios vs `b5a1340`; two byte-identical runs):
- 0 Best Fit, alternative, complement-list, watch-out or empty / filled changes.
- **326 text-only changes**, all where cable-band-external-rotation is Best Fit. Exactly as predicted.

