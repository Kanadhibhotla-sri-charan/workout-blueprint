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

**Unresolved citations are labelled in the note itself** ("citation unresolved: …"). Nothing was guessed or substituted. Open: incline-dumbbell-curl (EMG, formerly "Lehman, 2005-era"); hip-thrust (EMG, formerly "Contreras et al.-era", and its 2-3x figure); preacher-curl (EMG activation-window note, labelled in the Batch 1 closure).

### Not yet re-checked

The remaining sources cited only by `needs-review` records, and any note not listed above. Every `reviewed` status predates this ledger, so it does **not** imply its citations were re-checked, except where a row above says so.
