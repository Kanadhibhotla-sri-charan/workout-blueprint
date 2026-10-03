// Regenerates docs/dev/reports/VIDEO-CURATION-QA.md from the canonical data
// plus the latest committed URL audit (docs/dev/reports/video-audit.json).
// Not part of any build/test lifecycle — run after `npm run audit-videos`:
//
//   node scripts/generate-video-qa-report.mjs [--audit <path>]
//
// Everything this report says about a reference comes from that record's
// own fields — video_status, video_verification_method, video_verified_on —
// and from the audit. Nothing is hardcoded per exercise, so the report can't
// claim more verification than the data records. One-off history (what a
// past remediation pass changed) lives in frozen logs such as
// VIDEO-REMEDIATION-2026-08.md, not here.
//
// Exits non-zero if the numbers don't reconcile, so an inconsistent report
// is never written.

import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('./lib/load-records.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '..', 'docs', 'dev', 'reports');
const OUT_PATH = join(REPORTS_DIR, 'VIDEO-CURATION-QA.md');

const METHOD_LABELS = {
  metadata: 'Title/channel metadata checked (footage not watched)',
  visual: 'Footage watched and confirmed',
};

function escapeMd(text) {
  return String(text ?? '').replace(/\|/g, '\\|');
}

function fail(message) {
  console.error(`Cannot generate report: ${message}`);
  process.exit(1);
}

function main() {
  const argv = process.argv.slice(2);
  const auditArg = argv.indexOf('--audit');
  const auditPath = auditArg >= 0 && argv[auditArg + 1] ? resolve(argv[auditArg + 1]) : join(REPORTS_DIR, 'video-audit.json');

  const { records, fileErrors } = loadAllRecords();
  if (fileErrors.length > 0) fail(fileErrors.join('; '));
  if (!existsSync(auditPath)) fail(`no audit at ${auditPath} — run \`npm run audit-videos\` first`);

  const audit = JSON.parse(readFileSync(auditPath, 'utf8'));
  const auditById = new Map(audit.results.map((r) => [r.exercise_id, r]));
  const sorted = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const total = sorted.length;

  const byStatus = { verified: 0, 'needs-review': 0, broken: 0 };
  const byMethod = { metadata: 0, visual: 0 };
  const resolution = new Map();
  const verifiedNotLive = [];
  const staleAudit = [];

  const rows = sorted.map((r) => {
    byStatus[r.video_status] = (byStatus[r.video_status] ?? 0) + 1;
    if (r.video_status === 'verified') byMethod[r.video_verification_method] = (byMethod[r.video_verification_method] ?? 0) + 1;

    const a = auditById.get(r.id);
    // An audit row only describes this record if it checked the same URL
    // that's in the data now.
    const auditCurrent = a && (a.current_video_url ?? null) === (r.video_link ?? null);
    let result;
    if (!a) result = 'Not audited';
    else if (!auditCurrent) {
      result = 'Not audited at current URL';
      staleAudit.push(r.id);
    } else result = a.classification === 'LIVE' ? `LIVE (HTTP ${a.http_result})` : a.classification;
    resolution.set(result, (resolution.get(result) ?? 0) + 1);

    let contentMatch = 'N/A';
    let notes;
    if (r.video_status === 'verified') {
      contentMatch = `${METHOD_LABELS[r.video_verification_method] ?? r.video_verification_method} on ${r.video_verified_on}`;
      if (!auditCurrent) {
        notes = 'URL changed (or was added) since the latest audit — not yet checked.';
      } else if (a.classification !== 'LIVE') {
        verifiedNotLive.push(r.id);
        notes = '**Marked verified but did not resolve in the latest audit** — needs replacing or setting to needs-review.';
      } else {
        notes = `Resolves to "${escapeMd(a.resolved_title)}" by ${escapeMd(a.resolved_author)}.`;
      }
    } else {
      notes = 'No confirmed reference yet; the UI shows "Video reference under review" instead of a link.';
    }
    const urlCell = r.video_link ? `[link](${r.video_link})` : '—';
    return `| ${escapeMd(r.name)} (\`${r.id}\`) | ${urlCell} | ${escapeMd(result)} | ${escapeMd(contentMatch)} | **${r.video_status}** | ${notes} |`;
  });

  // Reconciliation — refuse to write a report whose numbers disagree.
  const statusSum = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const methodSum = Object.values(byMethod).reduce((a, b) => a + b, 0);
  const resolutionSum = [...resolution.values()].reduce((a, b) => a + b, 0);
  if (statusSum !== total) fail(`status counts sum to ${statusSum}, expected ${total}`);
  if (methodSum !== byStatus.verified) fail(`verification-method counts sum to ${methodSum}, expected ${byStatus.verified} verified`);
  if (resolutionSum !== total) fail(`resolution counts sum to ${resolutionSum}, expected ${total}`);

  const resolutionRows = [...resolution.entries()].sort().map(([k, v]) => `| ${k} | ${v} |`).join('\n');

  const md = `# Video Curation QA Report

_Generated by \`scripts/generate-video-qa-report.mjs\` from the exercise data and the URL audit run at ${audit.summary.audited_at}. Do not edit by hand._

## Summary

| Final status | Count |
|---|---|
| Verified | ${byStatus.verified} |
| — confirmed by title/channel metadata only | ${byMethod.metadata} |
| — confirmed by watching the footage | ${byMethod.visual} |
| Needs review | ${byStatus['needs-review']} |
| Broken | ${byStatus.broken} |
| **Total exercises** | **${total}** |

| Latest URL audit result | Count |
|---|---|
${resolutionRows}

Verified references that did not resolve in the latest audit: **${verifiedNotLive.length}**.${verifiedNotLive.length ? ` (${verifiedNotLive.map((id) => `\`${id}\``).join(', ')})` : ''}
${staleAudit.length ? `\nRecords changed since the last audit (re-run \`npm run audit-videos\`): ${staleAudit.map((id) => `\`${id}\``).join(', ')}.\n` : ''}
History of past remediation passes: [VIDEO-REMEDIATION-2026-08.md](VIDEO-REMEDIATION-2026-08.md).

## Audit methodology

**URL availability.** \`scripts/audit-video-links.mjs\` calls YouTube's oEmbed endpoint for every \`video_link\`, retrying transient failures (network errors, HTTP 429/5xx). HTTP 200 = LIVE; 400 = MALFORMED (YouTube rejects the id); 401/403 = RESTRICTED (private or not embeddable — needs a human check); other 4xx = DEAD_OR_UNAVAILABLE; still failing after retries = UNRESOLVED (not counted as dead). This only shows that a URL resolves to a public video. It says nothing about the video's content. A scheduled GitHub Action repeats this weekly and keeps a single tracking issue up to date.

**Content matching** is recorded per exercise, not inferred by this report:

- \`video_verification_method: metadata\` — the video's title and channel were compared with the exercise's own \`name\`, \`equipment\` and \`laterality\` (barbell vs dumbbell, cable vs machine, seated vs standing, unilateral vs bilateral, named variation) before accepting it. **Nobody watched the footage.**
- \`video_verification_method: visual\` — a person watched the video and confirmed it demonstrates this exercise and variation.
- \`video_verified_on\` — the date that check was done.

**\`verified\`** requires a live URL, a credible instructional source, and one of the checks above, recorded with its method and date. The validator rejects a \`verified\` record missing either.

**\`needs-review\`** means no reference meeting that bar has been confirmed. Such records carry \`video_link: null\` and no verification fields, and the app shows "Video reference under review" instead of a link.

## Per-exercise results

| Exercise | Video URL | Latest URL audit | Content check | Final status | Notes |
|---|---|---|---|---|---|
${rows.join('\n')}
`;

  writeFileSync(OUT_PATH, md);
  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Total ${total} | Verified ${byStatus.verified} (metadata ${byMethod.metadata}, visual ${byMethod.visual}) | Needs-review ${byStatus['needs-review']} | Broken ${byStatus.broken} | Verified-not-live ${verifiedNotLive.length}`);
}

main();
