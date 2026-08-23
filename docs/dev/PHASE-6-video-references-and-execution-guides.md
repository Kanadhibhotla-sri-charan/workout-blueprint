# Phase 6 — Video References + Execution Guides

Spec: [`docs/architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md`](../architecture/PHYSIQUE_BLUEPRINT_VIDEO_REFERENCES_AND_PROJECT_OPERATING_MODEL.md). Implemented under the project's three-role operating model (Architect: ChatGPT, Developer: Gemini, Product Owner: User).

## What changed

### 6-1 — Schema and validation extension
- `scripts/lib/taxonomy.js`: Added `VIDEO_STATUSES = new Set(['verified', 'needs-review', 'broken'])` and added `video_link`, `video_creator`, `video_title`, and `video_status` to `ALL_FIELDS`.
- `scripts/lib/validate.js`: Added YouTube URL syntax validation (`YOUTUBE_URL_PATTERN` supporting `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/shorts/`, and mobile links), `VIDEO_STATUSES` enum check, and non-empty string checks for `video_creator` and `video_title`.
- `app/src/types/exercise.ts`: Added `VideoStatus` type and extended the canonical `Exercise` interface with `video_link?: string | null`, `video_creator?: string | null`, `video_title?: string | null`, `video_status?: VideoStatus | null`.

### 6-2 — Canonical video curation across all 123 exercises
- Curated and populated 123 verified YouTube execution guides across all 11 body region files in `data/exercises/*.yaml` (`arms.yaml`, `back.yaml`, `calves.yaml`, `chest.yaml`, `core.yaml`, `forearms.yaml`, `hamstrings.yaml`, `hips.yaml`, `neck.yaml`, `quads.yaml`, `shoulders.yaml`).
- Sourced from credible, evidence-based coaches and movement specialists: Renaissance Periodization (Dr. Mike Israetel), ATHLEAN-X (Jeff Cavaliere), Jeff Nippard, Eugene Teo, Alan Thrall, Kneesovertoesguy, and Calisthenicmovement.
- Generated full audit report in [`docs/dev/reports/VIDEO-CURATION-QA.md`](reports/VIDEO-CURATION-QA.md) covering Exercise ID, Name, Creator, Exact Variation Match, Setup Clarity, Execution Clarity, Credibility, Conciseness, and Verification Status.

### 6-3 — Video utilities and component implementation
- `app/src/utils/video.ts` & `app/src/utils/video.test.ts`: Added `getYouTubeVideoId` parser with full test coverage for standard, short, and shorts YouTube URLs.
- `app/src/components/VideoPlayer.tsx` & `app/src/components/VideoPlayer.test.tsx`: Reusable, accessible, responsive (16:9) video player component. Features true lazy loading (renders thumbnail preview with play button overlay; loads YouTube iframe via `youtube-nocookie.com` only on user interaction), visible focus states, and fallback handling for missing links.

### 6-4 — Cross-mode UI integration
- **Exercise Detail (`ExerciseDetailPage.tsx`):** Added a dedicated `Execution Guide` section featuring `<VideoPlayer>` directly within the primary exercise hierarchy.
- **Explore (`ExerciseCard.tsx`):** Added subtle `▶ Watch technique` action on all exercise cards.
- **Decide (`DecisionMakerPage.tsx`):** Added direct `▶ Watch technique` action on the recommended Best Fit result block.
- **Build (`BuildMusclePackagePage.tsx`):** Added `▶ Watch technique` on each package exercise card, accessible without opening multiple accordions.
- **Styling (`index.css`):** Added complete component styling utilizing existing design tokens (`--bg-surface`, `--text-primary`, `--accent`, `--border-subtle`), maintaining the dark-first, technical, premium information design.

## Decisions made

- **Single source of truth:** Video metadata belongs exclusively to the canonical exercise record in `data/exercises/` and flows into `exercises.generated.json`. Explore, Decide, Build, and Detail render from the same record with zero drift.
- **True lazy loading over eager iframes:** Never render multiple YouTube iframes at page load. A custom thumbnail preview with play overlay is rendered first, loading the external iframe only after explicit user interaction to preserve performance and privacy.
- **Hybrid curation priority:** Evaluated strictly by Exact Variation Match → Technique Quality → Setup Clarity → Execution Clarity → Credibility → Conciseness.
- **Accessibility:** Video controls include accessible `aria-label`s, visible focus indicators, and keyboard activation support.

## Verification

- `npm run validate-data`: **PASS** — 123 records validated across 11 files with 0 violations.
- `npm test`: **PASS** — 17 test files, **165/165 tests passed**.
- `npm run lint`: **PASS** — 0 errors, 0 warnings (`oxlint`).
- `npm run build`: **PASS** — Production bundle compiled cleanly (`tsc -b && vite build`).
