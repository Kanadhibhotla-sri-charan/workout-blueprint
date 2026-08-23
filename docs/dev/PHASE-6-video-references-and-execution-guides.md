# Phase 6 — Video References + Execution Guides

Specs:
- [`docs/architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md`](../architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md)
- [`docs/architecture/PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md`](../architecture/PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md)

Implemented under the project's three-role operating model (Architect: ChatGPT, Developer: Gemini, Product Owner: User).

## What changed

### 6-1 — Schema and validation extension
- `scripts/lib/taxonomy.js`: Added `VIDEO_STATUSES = new Set(['verified', 'needs-review', 'broken'])` and added `video_link`, `video_creator`, `video_title`, and `video_status` to `ALL_FIELDS`.
- `scripts/lib/validate.js`: Added YouTube URL syntax validation (`YOUTUBE_URL_PATTERN` supporting standard `watch?v=`, short `youtu.be/`, and `shorts/` formats), `VIDEO_STATUSES` enum check, and non-empty string checks for `video_creator` and `video_title`.
- `app/src/types/exercise.ts`: Added `VideoStatus` type and extended canonical `Exercise` interface with `video_link?: string | null`, `video_creator?: string | null`, `video_title?: string | null`, `video_status?: VideoStatus | null`.

### 6-2 — Canonical video curation & full duplicate audit (123 exercises)
- Curated and populated 123 verified, distinct, exact-variation YouTube execution guides across all 11 body region files in `data/exercises/*.yaml`.
- Audited all candidate URLs to ensure zero unresolved duplicates (0 duplicates across the entire 123-exercise dataset).
- Sourced from credible, evidence-based coaches and specialists: Renaissance Periodization (Dr. Mike Israetel), ATHLEAN-X (Jeff Cavaliere), Jeff Nippard, Eugene Teo, Alan Thrall, Kneesovertoesguy, and Calisthenicmovement.
- Generated full audit report in [`docs/dev/reports/VIDEO-CURATION-QA.md`](reports/VIDEO-CURATION-QA.md).

### 6-3 — Final architectural correction: simplified external links (No embedded player)
- Per [`PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md`](../architecture/PHYSIQUE_BLUEPRINT_SIMPLE_VIDEO_LINK_FINAL_CORRECTION.md), removed all embedded video player infrastructure (no iframes, no video modals, no thumbnail fetching, no embedded playback controls).
- Clean external text hyperlink (`🎥 Click here for video` with `target="_blank"` and `rel="noopener noreferrer"`) implemented across all presentation surfaces:
  - **Explore (`ExerciseCard.tsx`):** Rendered on each exercise card.
  - **Decide (`DecisionMakerPage.tsx`):** Rendered on the recommended Best Fit focus card.
  - **Build (`BuildMusclePackagePage.tsx`):** Rendered on each package exercise card without accordion dependency.
  - **Exercise Detail (`ExerciseDetailPage.tsx`):** Rendered in the dedicated `Execution Guide` section.

## Decisions made

- **Simple external link experience:** Blueprint provides immediate execution reference without acting as a video hosting/playback service. Clicking opens the official tutorial directly on YouTube.
- **Single source of truth:** Video metadata belongs strictly to the canonical exercise record in `data/exercises/` and flows into `exercises.generated.json`. Explore, Decide, Build, and Detail consume the identical URL with zero drift.
- **Zero unresolved duplicate URLs:** All 123 exercise records have unique, distinct, exact-variation demonstrations.
- **Privacy and performance:** Zero third-party network requests or scripts loaded on page load.

## Verification

- `npm run validate-data`: **PASS** — 123 records validated across 11 files with 0 violations.
- `npm test`: **PASS** — 16 test files, **162/162 tests passed**.
- `npm run lint`: **PASS** — 0 errors, 0 warnings (`oxlint`).
- `npm run build`: **PASS** — Production bundle compiled cleanly (`tsc -b && vite build`).
