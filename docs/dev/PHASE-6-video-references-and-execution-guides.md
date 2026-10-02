# Phase 6 — Video References, Execution Guides & Universal Intensity Techniques

Specs:
- [`docs/architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md`](../architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md)
- [`docs/architecture/PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md`](../architecture/PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md)
- [`docs/architecture/PHYSIQUE_BLUEPRINT_FINAL_VIDEO_CLEANUP_AND_VALIDATION.md`](../architecture/PHYSIQUE_BLUEPRINT_FINAL_VIDEO_CLEANUP_AND_VALIDATION.md)
- [`docs/architecture/PHYSIQUE_BLUEPRINT_FINAL_VIDEO_AND_INTENSITY_CORRECTIONS.md`](../architecture/PHYSIQUE_BLUEPRINT_FINAL_VIDEO_AND_INTENSITY_CORRECTIONS.md)
- [`docs/architecture/PHYSIQUE_BLUEPRINT_FINAL_SHORTCOMINGS_AND_INTENSITY_SPEC.md`](../architecture/PHYSIQUE_BLUEPRINT_FINAL_SHORTCOMINGS_AND_INTENSITY_SPEC.md)

Implemented under the project's three-role operating model (Architect: ChatGPT, Developer: Gemini, Product Owner: User).

## What changed

### 6-1 — Schema and validation extension
- `scripts/lib/taxonomy.js`: Added `VIDEO_STATUSES = new Set(['verified', 'needs-review', 'broken'])` and added `video_link`, `video_creator`, `video_title`, and `video_status` to `ALL_FIELDS`.
- `scripts/lib/validate.js`: Added video validation. _(Superseded — as originally shipped it forced every exercise to `video_status: 'verified'` with a non-null URL, which left no honest way to mark a reference unconfirmed. See "Current video QA state" below for the rules in force now.)_ Duplicate URL detection (0 duplicate assignments allowed) is unchanged.
- `app/src/types/exercise.ts`: Added `VideoStatus` type and extended canonical `Exercise` interface with `video_link?: string | null`, `video_creator?: string | null`, `video_title?: string | null`, `video_status?: VideoStatus | null`.

### 6-2 — Video references for all 123 exercises (corrected)
- Populated a YouTube reference for each of the 123 exercises in `data/exercises/*.yaml`, with 0 duplicate URLs.
- **Correction (2026-08-28):** this section originally said all 123 references were verified, exact-variation guides from Renaissance Periodization, ATHLEAN-X, Jeff Nippard, Eugene Teo, Alan Thrall, Kneesovertoesguy and Calisthenicmovement, backed by a QA report claiming every video was manually checked. That was not true. An independent YouTube audit found only 45 of 123 links live (76 dead, 2 malformed), 6 of the live ones showed the wrong exercise or an ambiguous variation, and most stored creator/title values did not match the actual videos. No manual verification had been performed. All of this was remediated in commit `b018abc` — see [`VIDEO-REMEDIATION-2026-08.md`](reports/VIDEO-REMEDIATION-2026-08.md) for the full record.

### 6-3 — Simplified external video links (No embedded player)
- Removed all embedded video player infrastructure (no iframes, no video modals, no thumbnail fetching, no embedded playback controls).
- Clean external text hyperlink (`🎥 Click here for video` with `target="_blank"` and `rel="noopener noreferrer"`) implemented across all presentation surfaces:
  - **Explore (`ExerciseCard.tsx`):** Rendered on each exercise card.
  - **Decide (`DecisionMakerPage.tsx`):** Rendered on the recommended Best Fit focus card.
  - **Build (`BuildMusclePackagePage.tsx`):** Rendered on each package exercise card without accordion dependency.
  - **Exercise Detail (`ExerciseDetailPage.tsx`):** Rendered in the dedicated `Execution Guide` section.

### 6-4 — Universal Intensity Techniques feature
- `app/src/engine/programmingEngine.ts`: Exported `getEligibleIntensityTechniques(exercise)` to compute all canonical applicable intensity techniques for an exercise variation without recommendation constraints.
- `app/src/pages/ExerciseDetailPage.tsx`:
  - Added **Programming** section with baseline profile, rep range, working RIR, weekly sets, frequency, and progression guidance.
  - Added **Intensity Techniques** section displaying all eligible canonical techniques (`Drop Set`, `Rest-Pause`, `Myo-Reps`) with explanations (`what`, `when_it_may_help`, `when_not_to_use`, `fatigue_time_implications`), or a clear empty state ("No specific intensity technique is recommended for this variation. Standard progressive overload is the primary progression method.").
  - Added `ExerciseDetailPage.test.tsx` verifying programming, intensity techniques, and video links across routes.

## Decisions made

- **Simple external link experience:** Blueprint provides immediate execution reference without acting as a video hosting/playback service. Clicking opens the official tutorial directly on YouTube.
- **Single source of truth:** Video metadata and intensity technique eligibility belong strictly to canonical exercise records and programming definitions, ensuring zero drift across Explore, Decide, Build, and Detail.
- **Universal intensity accessibility:** Trainees can learn how any exercise can be intensified directly from Search, Homepage, Explore, Decide, Build, or direct URL without going through the Decision Maker.
- **Zero duplicate URLs:** each exercise has its own reference. (The original "exact-variation demonstrations" claim was unverified — see the 6-2 correction.)

## Current video QA state

_This section describes the state after remediation and is the authoritative summary; the live per-exercise detail is in [`VIDEO-CURATION-QA.md`](reports/VIDEO-CURATION-QA.md), regenerated from the data._

- **123 exercises · 123 `verified` · 0 `needs-review` · 0 `broken`.** All 123 URLs resolved in the latest YouTube audit.
- **All 123 are `video_verification_method: metadata`.** Each video's title and channel were checked against the exercise's name, equipment and laterality. **No video has been watched to confirm the movement** — that would be recorded as `visual`, and today the count is 0.
- Verification method and date are stored on every record (`video_verification_method`, `video_verified_on`), and the validator rejects a `verified` record without them. A reference with no confirmed video must be `needs-review` with `video_link: null`; the app then shows "Video reference under review" instead of a link.
- URL liveness is re-checked weekly by `.github/workflows/video-audit.yml`, which maintains one tracking issue. It runs separately from CI and deploys, so a YouTube outage can't block either.

## Verification (as of the original Phase 6 merge)

- `npm run validate-data`: **PASS** — 123 records validated across 11 files with 0 violations.
- `npm test`: **PASS** — 16 test files, **168/168 tests passed** (including QA Gate §12/§13/§14/§20 regression tests).
- `npm run lint`: **PASS** — 0 errors, 0 warnings (`oxlint`).
- `npm run build`: **PASS** — Production bundle compiled cleanly (`tsc -b && vite build`, 225ms).

## Integration onto the dark-first UI redesign

Phase 6 was developed on a branch that forked before the Final UI Overhaul (dark-first design tokens, restyled Explore/Decide/Build/Home). Merging it required replaying Phase 6's changes on top of the redesigned `main` rather than a plain merge, so the dark UI wasn't reverted by whichever side "won." `git merge --squash` against current `main` auto-resolved every file with zero conflict markers, but two problems only surfaced on manual inspection of the result — auto-merge is not proof of correctness:

- **`ExerciseCard.tsx`:** the video link `<a>` was nested inside the card's own `<Link>` — invalid HTML (interactive content can't nest) and an accessibility violation, though `stopPropagation()` happened to make it click-correctly by accident. Fixed by moving the card into a wrapping `<div className="exercise-card">`, with the `<Link>` (now `.exercise-card-link`) and the video link as siblings inside it. Verified: 0 nested anchors on the Explore grid, and clicking a card's video link no longer triggers card navigation.
- **`index.css`:** the video/intensity-technique CSS block (`.intensity-technique-card`, `.technique-detail-group strong`) referenced `--radius` and `--text` — tokens that existed before the redesign but were replaced by `--radius-sm/md/lg/xl` and `--text-primary/secondary/muted`. `var()` with an undefined custom property and no fallback silently drops the declaration rather than erroring, so this compiled and passed every automated check while rendering square corners on the intensity-technique cards and an unstyled `<strong>`. Fixed by mapping to `--radius-lg` (matching every other card surface in the file) and `--text-secondary`. Swept the entire stylesheet afterward to confirm no other `var()` reference is missing a `:root` definition.

Every exercise data file, and every file the redesign never touched (`programmingEngine.ts`, `types/exercise.ts`, `format.ts`, `scripts/lib/*.js`, `ExerciseDetailPage.test.tsx`), merged byte-identical to Phase 6's own version — confirmed by diffing each against the pre-merge branch. Re-ran the full QA suite after the fixes (validate-data, 168/168 tests, lint, build — all still PASS) and did a live visual/functional check in a real browser against the merged production build.
