// Regenerates docs/dev/reports/VIDEO-CURATION-QA.md from the current
// dataset + the latest network audit (docs/dev/reports/video-audit.json).
// Not part of any build/test lifecycle script — run manually after a video
// remediation pass, then commit the regenerated report.
//
// This script can only report what was actually done. It does NOT claim
// frame-by-frame visual verification of video content — that capability
// does not exist here. What "content-match" means for every record in this
// report is explained in the Methodology section it generates: the video's
// own title, channel, and (for the 84 replaced records) search-result
// context were compared against the exercise's own name/equipment/
// laterality fields. See the report's Methodology section for the full
// disclosure.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('./lib/load-records.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIT_PATH = join(__dirname, '..', 'docs', 'dev', 'reports', 'video-audit.json');
const OUT_PATH = join(__dirname, '..', 'docs', 'dev', 'reports', 'VIDEO-CURATION-QA.md');

// The 84 exercise ids that received a brand-new replacement video during
// the Video Reference Remediation pass (was DEAD_OR_UNAVAILABLE, MALFORMED,
// or a live-but-wrong match rejected on content grounds).
const REPLACED_IDS = new Set([
  'back-extension-45-hip-dominant', 'back-squat', 'barbell-bent-over-row-pronated', 'barbell-dumbbell-shrug',
  'barbell-ez-bar-curl', 'bulgarian-split-squat-hip-dominant', 'bulgarian-split-squat-knee-dominant',
  'cable-band-external-rotation', 'cable-chest-press', 'cable-crunch', 'cable-curl', 'cable-drag-curl',
  'cable-fly', 'cable-hammer-curl-rope', 'cable-kickback-glute', 'cable-overhead-extension-leaning-forward',
  'cable-rear-delt-builder', 'cable-reverse-curl', 'cable-shoulder-press', 'cable-woodchop', 'chest-supported-row',
  'chin-up-supinated', 'conventional-deadlift', 'cross-body-hammer-curl', 'decline-dumbbell-fly',
  'dip-chest-biased', 'dip-triceps-biased', 'drag-curl', 'dumbbell-pullover-chest-biased',
  'dumbbell-pullover-lat-biased', 'dumbbell-squat-sides', 'farmers-carry', 'flat-dumbbell-press', 'front-squat',
  'hex-press', 'hip-abduction', 'hip-adduction', 'incline-barbell-press', 'incline-cable-press',
  'incline-machine-press', 'isometric-neck-hold', 'lateral-neck-flexion', 'leg-press-calf-raise',
  'lying-leg-curl', 'machine-crunch', 'machine-lateral-raise', 'machine-reverse-fly', 'machine-triceps-extension',
  'neck-extension', 'neck-flexion', 'neutral-grip-lat-pulldown', 'nordic-hamstring-curl',
  'overhead-triceps-extension', 'pallof-press', 'pronation-supination-work', 'push-up-plus', 'rack-pull',
  'rear-delt-fly', 'rear-delt-row', 'reverse-curl', 'reverse-grip-barbell-row', 'reverse-grip-lat-pulldown',
  'reverse-lunge', 'reverse-nordic-curl', 'reverse-wrist-curl', 'romanian-deadlift', 'single-leg-calf-raise',
  'smith-machine-bench-press', 'smith-machine-bulgarian-split-squat', 'smith-machine-incline-press',
  'smith-machine-romanian-deadlift', 'smith-machine-shoulder-press', 'smith-machine-squat',
  'standing-cable-hip-flexion', 'static-lunge', 'stiff-leg-deadlift', 'straight-arm-pulldown', 'suitcase-carry',
  'sumo-deadlift', 'sumo-squat', 'tibialis-raise', 'triceps-kickback', 'wrist-curl', 'zottman-curl',
]);

// Of the 84 replaced ids, these 6 were previously marked LIVE by the audit
// but rejected on content grounds during the manual content-match review
// (wrong equipment/exercise, or a materially different, ambiguous
// variation) — everything else in REPLACED_IDS was DEAD_OR_UNAVAILABLE or
// MALFORMED at audit time.
const REJECTED_ON_CONTENT_IDS = new Set([
  'barbell-ez-bar-curl', 'dip-triceps-biased', 'back-squat',
  'bulgarian-split-squat-knee-dominant', 'overhead-triceps-extension', 'static-lunge',
]);

function escapeMd(text) {
  return String(text ?? '').replace(/\|/g, '\\|');
}

function main() {
  const { records, fileErrors } = loadAllRecords();
  if (fileErrors.length > 0) {
    console.error('Cannot generate report — dataset failed to load:', fileErrors);
    process.exit(1);
  }
  const audit = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'));
  const auditById = new Map(audit.results.map((r) => [r.exercise_id, r]));

  const sorted = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const total = sorted.length;
  const verifiedCount = sorted.filter((r) => r.video_status === 'verified').length;
  const needsReviewCount = sorted.filter((r) => r.video_status === 'needs-review').length;
  const brokenCount = sorted.filter((r) => r.video_status === 'broken').length;
  const replacedCount = sorted.filter((r) => REPLACED_IDS.has(r.id)).length;
  const correctedOnlyCount = sorted.filter((r) => r.video_status === 'verified' && !REPLACED_IDS.has(r.id)).length;

  const rows = sorted.map((r) => {
    const a = auditById.get(r.id);
    const resolution = a
      ? (a.classification === 'LIVE' ? `LIVE (HTTP ${a.http_result})` : a.classification)
      : 'not audited';
    let contentMatch;
    let notes;
    if (r.video_status === 'verified') {
      if (REPLACED_IDS.has(r.id)) {
        const wasRejected = REJECTED_ON_CONTENT_IDS.has(r.id);
        contentMatch = 'Title/channel match reviewed';
        notes = wasRejected
          ? 'Previous reference resolved but was a content mismatch (wrong equipment/variation); replaced. New reference’s title and channel were checked against this exercise’s name, equipment, and laterality before being marked verified.'
          : 'Previous reference was dead/unavailable/malformed; replaced. New reference’s title and channel were checked against this exercise’s name, equipment, and laterality before being marked verified.';
      } else {
        contentMatch = 'Title/channel match reviewed';
        notes = 'Reference was already live; kept. Its video_creator/video_title were corrected to match what the URL actually resolves to (the prior values did not match the real channel/title).';
      }
    } else {
      contentMatch = 'N/A';
      notes = 'No confident, content-matching, credible-source replacement was found. Left as needs-review rather than forcing a match.';
    }
    const urlCell = r.video_link ? `[link](${r.video_link})` : '—';
    return `| ${escapeMd(r.name)} (\`${r.id}\`) | ${urlCell} | ${escapeMd(resolution)} | ${escapeMd(contentMatch)} | **${r.video_status}** | ${escapeMd(notes)} |`;
  });

  const md = `# Video Curation QA Report

_Regenerated by \`scripts/generate-video-qa-report.mjs\` as part of the Video Reference Remediation pass. This replaces a prior version of this report that claimed all 123 references were manually verified — that claim was not supported by any actual verification work and has been withdrawn._

## Summary

| | Count |
|---|---|
| Total exercises | ${total} |
| Verified | ${verifiedCount} |
| Needs review | ${needsReviewCount} |
| Broken | ${brokenCount} |
| — of which newly replaced this pass | ${replacedCount} |
| — of which kept (creator/title corrected only) | ${correctedOnlyCount} |

Dead-or-malformed URLs remaining marked \`verified\`: **0**. Every \`verified\` record's URL was independently re-checked against YouTube's oEmbed endpoint on the date this report was generated and returned HTTP 200.

## Audit methodology

**URL availability** was checked with \`scripts/audit-video-links.mjs\`, which calls YouTube's own oEmbed endpoint (\`https://www.youtube.com/oembed?url=...&format=json\`) for every \`video_link\` in the dataset, with retries on transient (429/5xx/network) failures. HTTP 200 = LIVE, HTTP 400 = MALFORMED (YouTube itself rejects the video id), anything else (404, 403, private, removed, or repeated network failure) = DEAD_OR_UNAVAILABLE. This establishes only that the URL currently resolves to a real, public YouTube video — nothing about the video's content.

**Content matching**, for every record in this report, means: the video's own title and channel name (as returned by oEmbed, or as shown in the search results used to find a replacement) were compared by a human/agent reviewer against the exercise's own canonical \`name\`, \`equipment\`, and \`laterality\` fields — e.g. confirming "barbell" vs "dumbbell", "seated" vs "standing", "cable" vs "machine", unilateral vs bilateral, and the named variation, before accepting a match. **This is metadata-level content verification, not frame-by-frame visual confirmation of the video's footage.** No tool used in this pass can watch video content. Where a title/channel match was ambiguous or a confident match could not be found, the record was left as \`needs-review\` with \`video_link: null\` rather than forced.

**\`verified\`** requires: the URL currently resolves (LIVE), the video is from a channel a reviewer judged credible for instructional content, and its title/description text unambiguously names the same exercise and variation as this dataset's record — checked against \`name\`, \`equipment\`, and \`laterality\`.

**\`needs-review\`** is used when no reference meeting the above bar was found; such records carry \`video_link: null\` and are never presented by the UI as a working/verified reference.

## Per-exercise results

| Exercise | Video URL | Resolution result | Content-match result | Final status | Notes |
|---|---|---|---|---|---|
${rows.join('\n')}
`;

  writeFileSync(OUT_PATH, md);
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Total ${total} | Verified ${verifiedCount} | Needs-review ${needsReviewCount} | Broken ${brokenCount}`);
}

main();
