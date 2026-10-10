# Evidence Ledger

_What has actually been verified, and how. Updated each content-review batch. A citation counts as **re-checked** only when its source was opened (publisher, PMC or Europe PMC record) and the note's claim was compared with what the source reports. A video counts as **reviewed** only when a person watched it._

## Videos

| Method | Records |
|---|---:|
| `metadata`: title / channel checked via oEmbed; footage **not** watched | 140 |
| `visual`: watched by a person | **0** |

## Citations

- **Inventory:** 55 evidence notes on 48 records (18 `reviewed`, 30 `needs-review`). All were written before the exercise expansion.
- **This ledger:** started in Content Review batch 1.
- **Scope of batch 1:** the distinct sources cited by the 18 `reviewed` records. Many `needs-review` records cite the same sources.
- **Method:** Europe PMC / PMC records (title, authors, journal, year, abstract) and the publisher page for the IJSC paper. Abstract-level only unless stated.

### Sources re-checked (Content Review batch 1, 2026-10-10)

| Source as cited | Verified identity | Claim in the notes | Result |
|---|---|---|---|
| Chaves et al. 2020, PMC7449336 | Int J Exerc Sci 13(6):859–872 | Incline group gained most upper-chest thickness; mid chest similar across groups | **Matches** |
| Rodríguez-Ridao et al. 2020, PMC7579505 | Int J Environ Res Public Health 2020 | Sternocostal head more active at 0° than at inclines | **Matches** |
| Maeo et al. 2023 (overhead triceps) | Eur J Sport Sci 23(7):1240–1250, PMID 35819335 | Overhead elbow extension produced more triceps (long head) hypertrophy than neutral arm position (MRI) | **Matches** (design and direction) |
| Maeo et al. 2024, PMC11419281 (cited as "a 2024 study") | Med Sci Sports Exerc 56(10):1893–1905 | LSET vs Nordic: hamstrings +18% vs +11%, BFlh +19% vs +5% | **Matches** |
| Plotkin et al. 2023, PMC10593473 | **Front Physiol** 14:1279170 (bioRxiv preprint first) | Hip thrust and back squat produced similar gluteal hypertrophy (MRI) | Finding **matches**; journal **mis-cited** as "bioRxiv/Sports Medicine" |
| Distefano et al. 2009, PMID 19574661 | J Orthop Sports Phys Ther 39(7):532–540 | 21 subjects, 12 exercises; side-lying abduction 81% ± 42% MVIC, above clams, lunges, hops | **Matches** |
| Harøy et al. 2019 | Br J Sports Med 53(3):150–157, PMID 29891614 | 652 players / 35 teams; 13.5% vs 21.3% prevalence; OR 0.59 (0.40–0.86) | **Matches** |
| Nunes et al. 2020 | J Strength Cond Res 34(8):2347–2351, PMID 32735428 | Toes-out +8.4% vs toes-in +3.8% medial; toes-in +9.1% vs toes-out +5.5% lateral | **Matches** |
| Schoenfeld & Grgic 2020 | SAGE Open Med 8, PMID 32030125 | Full / longer ROM tends to match or beat partial ROM (lower body) | **Matches** (hedged wording) |
| Wolf et al. 2025, PMID 39959841 | PeerJ 13:e18904 | Lengthened partials produced similar, not greater, hypertrophy than full ROM in trained lifters | **Matches** |
| Bloomquist et al. 2013 | Eur J Appl Physiol, PMID 23604798 | Deep (0–120°) vs shallow (0–60°) squat training, 12 weeks | Design **matches**; the regional-CSA detail was not checked against the full text |
| Wolf et al. 2023 | Int J Strength Cond 3(1), systematic review / meta-analysis | Some notes: "lengthened partial-ROM training matched **or exceeded** full ROM, with both beating shortened-position training" | **Overstated.** The lengthened-partial subgroup estimate was inconclusive (CI spans zero); overall a trivial difference favouring full ROM. "Tends to match or beat" wording elsewhere is acceptable |
| Oliveira et al. 2009, PMC3737788 (identified in the P3 preacher review; previously "citation unresolved") | J Sports Sci Med 8(1):24–29, PMID 24150552 | Dumbbell preacher curl: biceps EMG highest early in the concentric range (near full extension), falling toward the top; incline and standing curls high through the range | **Matches**, from the PMC full text. Caveats: pad angle not reported; the methods' posture labelling is unclear; 40% MVC load |
| Nunes et al. 2020, PMC7460162 (new citation, P3 preacher review) | Int J Environ Res Public Health 17(16):5859 | Barbell preacher curl described as applying greater torque with the elbows extended, cable version with the elbows flexed; biceps thickness +8% vs +7% (no difference) | **Matches**. The torque statement is the authors' qualitative description, not a measured curve; pad angle not reported |
| "Kassiano et al. (2024, PMC11906226)" | **Attarieh et al. 2025**, Eur J Sport Sci 25(4):e12279 (preacher vs Bayesian cable curl) | Cited as the clearest direct evidence **for** a shoulder-position (long-head) effect | **Misattributed and misstated.** Wrong authors and year; the study found **similar** growth at every measured site and no regional difference |

### Citations that cannot be verified as written

| Note | Problem |
|---|---|
| incline-dumbbell-curl: "Lehman, 2005-era EMG shoulder-position studies" | No specific study named |
| hip-thrust: "Contreras et al.-era EMG work … roughly 2–3× gluteus maximus activation" | No specific study named; not located with the search used |

### Records affected by the findings above (corrected in the Batch 1 follow-up)

**Two separate statuses:** "Exercise data" is `review_status`; "Citations" is this ledger's verdict. Correcting a note does not by itself change `review_status`.

| Record | Exercise data | Citations after correction |
|---|---|---|
| incline-dumbbell-curl | reviewed | PMC11906226 corrected to Attarieh et al. 2025 with its actual (null) finding, evidence quality "low"; Wolf 2023 corrected; **unresolved**: the EMG studies formerly cited as "Lehman, 2005-era". The long-head claim is softened in `primary_targets` and `mirror_effect` |
| preacher-curl | needs-review | PMC11906226 corrected; evidence quality "low". Its short-head / base-width text (`mirror_effect`) still rests on the unconfirmed claim and is queued for its P3 review |
| hip-thrust | reviewed | Plotkin corrected to Frontiers in Physiology 2023; **unresolved**: the EMG study formerly cited as "Contreras et al.-era" and its 2-3x figure |
| flat-dumbbell-fly | needs-review | Wolf 2023 corrected |
| straight-arm-pulldown | reviewed | Wolf 2023 corrected |

| preacher-curl-machine | needs-review | Evidence quality corrected from "moderate" to "low", consistent with preacher-curl (Batch 1 closure) |
| drag-curl | needs-review | No longer claims EMG ties shoulder extension to a long-head bias; cites Attarieh et al. 2025 as finding no regional difference (Batch 1 closure) |

**Unresolved citations are labelled in the note itself** ("citation unresolved: …"). Nothing was guessed or substituted. Open: incline-dumbbell-curl (EMG, formerly "Lehman, 2005-era"); hip-thrust (EMG, formerly "Contreras et al.-era", and its 2-3x figure). Resolved in the P3 preacher review: preacher-curl EMG activation-window note → Oliveira et al. 2009, checked against the PMC full text.

> **Update (evidence verification phase, 2026-10-10):** both open citations are now resolved. See "Evidence verification phase" below: incline-curl EMG → no supporting source, clause removed; hip-thrust EMG → Contreras et al. 2015, figure corrected to ~1.7–2.4×.

### Not yet re-checked

The remaining sources cited only by `needs-review` records, and any note not listed above. Every `reviewed` status predates this ledger, so it does **not** imply its citations were re-checked, except where a row above says so.

## Position-tag evidence status (position-tag semantics correction)

SCHEMA now defines `lengthened-` / `shortened-position-emphasis` as where the **external resistance peaks** in the movement's range. Status of the tags examined so far:

| Record | Tag | Evidence status |
|---|---|---|
| preacher-curl | ~~shortened-position-emphasis~~ (removed, O2) | The two verified sources (Oliveira 2009 EMG; Nunes 2020, qualitative) place the free-weight version's hardest point near full extension, contradicting the tag. No positive tag asserted |
| preacher-curl-machine | shortened-position-emphasis (kept) | **Unverified.** Neither source tested a machine; the curve depends on the cam. Not refuted |
| incline-dumbbell-curl | lengthened-position-emphasis (kept; removal approved but blocked by the Build-package reps rule, see `POSITION-TAG-REVIEW-QUEUE.md`) | **Unverified under the new definition.** The tag was authored for the extended shoulder (long head lengthened at the shoulder), not for where resistance peaks. Oliveira 2009 measured incline-curl activation rising through the concentric phase, highest in the final third; that is EMG (activation), not resistance, so it neither confirms nor settles the resistance peak. No source on the incline curl's resistance curve has been identified |

### Package-linked records and the incline press (position-tag review follow-up)

Tags of the records below are unchanged unless stated. "Unverified" means no source on where the record's external resistance peaks has been identified.

| Record | Tag | Evidence status |
|---|---|---|
| cable-overhead-extension-leaning-forward | ~~lengthened-position-emphasis~~ (removed) | Its own `resistance_profile` states constant tension through the whole range, so there is no peak to tag. Maeo 2023 supports the overhead *position* (recorded in `movement_patterns`), not a resistance peak |
| incline-dumbbell-press | lengthened-position-emphasis (kept) | **Unverified.** The unsupported "hardest through the middle of the range" wording was removed from `resistance_profile`; no source on its resistance curve |
| cable-lateral-raise | lengthened-position-emphasis (kept) | **Unverified** |
| overhead-triceps-extension | lengthened-position-emphasis (kept) | **Unverified.** Maeo 2023 supports the overhead position, not a resistance peak. Removal would affect pinned case #6 |
| reverse-nordic-curl | lengthened-position-emphasis (kept) | **Unverified** |
| seated-leg-curl | lengthened-position-emphasis (kept) | **Unverified.** Maeo 2024 supports the hip-flexed position, not a resistance peak |
| incline-dumbbell-fly | lengthened-position-emphasis (kept) | **Consistent as stated, unverified.** "Hardest at the bottom stretch" matches the definition; no source on its curve |

## Position tags: consolidated status (audit closure)

The **authoritative** status of every remaining position tag after the audit. It supersedes the earlier per-step position-tag tables above. Definition (SCHEMA): a position tag means where the **external resistance peaks** in the movement's own range. **No tag below is source-verified.**

**Statuses:**
- **Contradicted:** the record's own text conflicts with the tag.
- **Consistent as stated, but unverified:** the record's text states a peak matching the tag, but no source on the resistance curve has been identified.
- **Unverified:** the record states no resistance peak (it describes a range, a shoulder or hip position, or nothing).

| Record | Tag | Status | Note |
|---|---|---|---|
| cable-lateral-raise | lengthened | **Contradicted** | `resistance_profile` says "constant tension through the whole range"; the stretched-bottom emphasis is relative to the dumbbell. **Kept (approved B1):** removal would change its profile to 10–20 reps and break shoulders-efficient and shoulders-complete (8–15). A separate product decision on those prescriptions is needed before any change |
| decline-dumbbell-fly | lengthened | Consistent as stated, unverified | "hardest at the bottom stretch" |
| dip-chest-biased | lengthened | Consistent as stated, unverified | "hardest at the bottom stretch" |
| dumbbell-pullover-chest-biased | lengthened | Consistent as stated, unverified | "hardest overhead" |
| dumbbell-pullover-lat-biased | lengthened | Consistent as stated, unverified | "hardest overhead" |
| flat-dumbbell-fly | lengthened | Consistent as stated, unverified | Conflicting "hardest around the mid-range" removed from `why_this_exists` (audit batch 2) |
| incline-dumbbell-fly | lengthened | Consistent as stated, unverified | "hardest at the bottom stretch" |
| sissy-squat | lengthened | Consistent as stated, unverified | "hardest at the bottom" |
| single-leg-romanian-deadlift | lengthened | Consistent as stated, unverified | Primary (dumbbell) setup "hardest at the bottom stretch"; band setup loads the top (stated) |
| glute-bridge | shortened | Consistent as stated, unverified | "hardest at the top" |
| single-leg-hip-thrust | shortened | Consistent as stated, unverified | "hardest at the top" |
| hip-thrust | shortened | Consistent as stated, unverified | "resistance is lightest at the bottom" |
| flat-dumbbell-press | lengthened | Unverified | Describes a deeper range, not a peak |
| incline-dumbbell-press | lengthened | Unverified | "Hardest through the middle" wording removed (follow-up); no peak stated |
| lying-triceps-extension-skull-crusher | lengthened | Unverified | Lengthened-position framing, no peak |
| overhead-triceps-extension | lengthened | Unverified | Overhead position (Maeo 2023 supports the position, not a peak); removal would affect pinned case #6 |
| reverse-nordic-curl | lengthened | Unverified | Hip-extended framing, no peak |
| seated-leg-curl | lengthened | Unverified | Hip-flexed position (Maeo 2024 supports the position); removal would break hamstrings packages (8–15) |
| incline-dumbbell-curl | lengthened | Unverified | Shoulder-position framing; removal would break biceps-complete (8–15) |
| romanian-deadlift | lengthened | Unverified | No peak stated |
| stiff-leg-deadlift | lengthened | Unverified | No peak stated |
| smith-machine-romanian-deadlift | lengthened | Unverified | "free-weight-like load curve" |
| preacher-curl-machine | shortened | Unverified | Cam-dependent; no source tested a machine |

**Tags removed during the audit:**

| Record | Removed tag | Reason |
|---|---|---|
| preacher-curl | shortened | Contradicted by two verified sources |
| cable-overhead-extension-leaning-forward | lengthened | Its own text states constant tension |
| incline-cable-press | lengthened | Its own text states constant tension and emphasises the top |

## Evidence verification phase (2026-10-10, baseline `bc7c41a`)

**Method:** each source was opened and compared with the record's exact claim. The "Access" column states what was actually read; "abstract" means the full text was **not** checked.

### Citations checked

| Source (as now cited) | Access | Claim in the record (before) | Verdict | Record change |
|---|---|---|---|---|
| Barnett C, Kippers V, Turner P. J Strength Cond Res 1995;9(4):222–227. *Effects of variation of the bench press exercise on the EMG activity of five shoulder muscles.* 6 trained men, bench **press** at 80%, four trunk inclinations, two hand spacings | Abstract (BISp record) | decline-dumbbell-fly: found "greater lower/sternocostal-region pectoral activation during decline pressing than incline or flat" | **Does not support; contradicts.** The abstract reports the sternocostal head **more** active on a horizontal than a decline bench, and the clavicular head less active on decline. Press, not fly | Note rewritten; claim marked **unsupported** |
| Rodríguez-Ridao D et al. Int J Environ Res Public Health 2020;17(19):7339, PMC7579505 | Full text (PMC) | decline-dumbbell-fly: same claim as above | **Does not support.** Tested 0°, 15°, 30°, 45°, 60° only; **no decline condition**. Press, not fly. (Its existing ledger row, "sternocostal head more active at 0° than inclines", still matches) | Same note |
| Oliveira LF et al. J Sports Sci Med 2009;8(1):24–29, PMC3737788 | Full text (PMC) | incline-dumbbell-curl: long-head bias rests partly "on EMG work on shoulder position (citation unresolved, formerly 'Lehman, 2005-era')" | **Does not establish the claim.** Electrodes on the biceps **long head only**; no long- vs short-head comparison. No head-comparison EMG study across shoulder positions was located | Unsupported EMG attribution removed; rests on mechanics + Attarieh 2025; evidence quality **low** (unchanged) |
| Contreras B, Vigotsky AD, Schoenfeld BJ, Beardsley C, Cronin J. J Appl Biomech 2015;31(6):452–458, doi:10.1123/jab.2014-0301 | Abstract (ECU repository) + Europe PMC metadata; PubMed blocked automated access; full text not read | hip-thrust: "much higher" glute EMG vs back squat, "often-quoted 2-3x figure" (citation unresolved) | **Supports the direction; the figure was overstated.** 13 trained women, estimated 10RM. Hip thrust vs squat, % MVIC: upper GM mean 69.5 vs 29.4 (2.4×), peak 172 vs 84.9 (2.0×); lower GM mean 86.8 vs 45.4 (1.9×), peak 216 vs 130 (1.7×). The authors call for longitudinal studies on hypertrophy | Cited; "2-3x" → "roughly 1.7–2.4×, varying by region and mean vs peak"; hypertrophy caveat and Plotkin 2023 kept |

### Back-extension knee-bend claim (`back-extension-45-hip-dominant`)

| Source | Access | Movement tested | Finding | Bearing on the claim |
|---|---|---|---|---|
| Yamamoto Y et al. Jpn J Phys Fitness Sports Med 2015;64(3):289–294, doi:10.7600/jspfsm.64.289 | Abstract (J-STAGE) | Maximal isometric prone hip extension, knee 15° vs 90° | Hamstring EMG higher at 15°; glute max EMG higher at 90° | Indirect; suggests knee bend shifts work toward the glutes, away from the hamstrings |
| Keerasomboon T, Mineta S, Hirose N. J Sports Sci Med 2020;19:630–636 | Full text (JSSM) | Kneeling 45° hip extension, knee 0°, 45°, 90° | BFl and ST EMG higher at 45° / 90° than 0° (the abstract and results conflict in places; glute direction not stated in the text) | Indirect; points the other way for the hamstrings |
| Andersen V et al. J Sports Sci Med 2021;20:181–187, doi:10.52082/jssm.2021.181 | Abstract (JSSM) | 45° Roman-chair back extension vs RDL vs seated machine | Roman chair: high hamstring and glute EMG; knee position not reported | Does not address knee angle |

**Verdict:** unverified; mixed, indirect evidence. A D1 evidence note was added. The hip / spinal sister-record split, tags, ranking and packages are unchanged.

### Evidence-quality changes in this phase

| Record | Before | After |
|---|---|---|
| decline-dumbbell-fly (lower-chest EMG claim) | "moderate" (EMG only) | **unsupported** (the lower-pec target, summary and mirror text are unchanged; they are in the product-decision queue) |
| incline-dumbbell-curl | low | low (unchanged; unsupported EMG clause removed) |
| hip-thrust | caveated; EMG citation unresolved | caveated; EMG cited (Contreras 2015), figure corrected |
| back-extension-45-hip-dominant | no evidence note | **unverified** (mixed, indirect) |

**Open citations after this phase:** none of the three targets remain open.
