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
- `scripts/lib/validate.js`: Strengthened validation to enforce that every production exercise has a non-null, valid YouTube URL with `video_status: 'verified'` and strict duplicate URL detection (0 duplicate URL assignments allowed).
- `app/src/types/exercise.ts`: Added `VideoStatus` type and extended canonical `Exercise` interface with `video_link?: string | null`, `video_creator?: string | null`, `video_title?: string | null`, `video_status?: VideoStatus | null`.

### 6-2 — Canonical video curation & full duplicate audit (123 exercises)
- Curated and populated 123 verified, distinct, exact-variation YouTube execution guides across all 11 body region files in `data/exercises/*.yaml`.
- Audited all candidate URLs to ensure zero unresolved duplicates (0 duplicates across the entire 123-exercise dataset).
- Sourced from credible, evidence-based coaches and specialists: Renaissance Periodization (Dr. Mike Israetel), ATHLEAN-X (Jeff Cavaliere), Jeff Nippard, Eugene Teo, Alan Thrall, Kneesovertoesguy, and Calisthenicmovement.
- Generated full audit report in [`docs/dev/reports/VIDEO-CURATION-QA.md`](reports/VIDEO-CURATION-QA.md).

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
- **Zero unresolved duplicate URLs:** All 123 exercise records have unique, distinct, exact-variation demonstrations.

## Verification

- `npm run validate-data`: **PASS** — 123 records validated across 11 files with 0 violations.
- `npm test`: **PASS** — 16 test files, **168/168 tests passed** (including QA Gate §12/§13/§14/§20 regression tests).
- `npm run lint`: **PASS** — 0 errors, 0 warnings (`oxlint`).
- `npm run build`: **PASS** — Production bundle compiled cleanly (`tsc -b && vite build`, 225ms).
