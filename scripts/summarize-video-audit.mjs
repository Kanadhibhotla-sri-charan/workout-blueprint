// Turns one audit-video-links.mjs result into the single consolidated report
// used by the scheduled video-audit workflow (job summary, artifact, and the
// one tracking issue), plus a fingerprint so the workflow only touches that
// issue when the set of problems actually changes.
//
//   node scripts/summarize-video-audit.mjs <audit.json> <report.md> <meta.json>
//
// meta.json: { fingerprint, problem_count, inconclusive, counts }
//
// What counts as a problem (and so feeds the fingerprint):
//   - a `verified` record whose URL is not LIVE (dead, malformed, restricted,
//     or missing) — the UI is presenting it as a working reference;
//   - a `needs-review`/`broken` record — an open gap still waiting on a human.
// UNRESOLVED results (network trouble on the runner) are listed but never
// fingerprinted, so a flaky run can't open or churn the issue. If too many
// links come back UNRESOLVED the whole run is marked inconclusive and the
// workflow leaves the issue alone.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const INCONCLUSIVE_RATIO = 0.1;
const FAILING_VERIFIED = new Set(['DEAD_OR_UNAVAILABLE', 'MALFORMED', 'RESTRICTED', 'NO_LINK']);

function escapeMd(text) {
  return String(text ?? '').replace(/\|/g, '\\|');
}

function main() {
  const [auditPath, reportPath, metaPath] = process.argv.slice(2);
  if (!auditPath || !reportPath || !metaPath) {
    console.error('usage: summarize-video-audit.mjs <audit.json> <report.md> <meta.json>');
    process.exit(2);
  }
  const { summary, results } = JSON.parse(readFileSync(auditPath, 'utf8'));

  const failingVerified = results.filter(
    (r) => r.current_video_status === 'verified' && FAILING_VERIFIED.has(r.classification)
  );
  const backlog = results.filter((r) => r.current_video_status !== 'verified');
  const unresolved = results.filter((r) => r.classification === 'UNRESOLVED');

  const linked = results.filter((r) => r.current_video_url).length;
  const inconclusive = linked > 0 && unresolved.length / linked > INCONCLUSIVE_RATIO;

  const problemKeys = [
    ...failingVerified.map((r) => `verified:${r.exercise_id}:${r.classification}`),
    ...backlog.map((r) => `backlog:${r.exercise_id}:${r.current_video_status}`),
  ].sort();
  const fingerprint = problemKeys.length
    ? createHash('sha256').update(problemKeys.join('\n')).digest('hex').slice(0, 16)
    : 'clean';

  // Counted from the rows themselves (not copied from summary) so the table
  // can never disagree with the per-exercise sections below it.
  const counts = new Map();
  for (const r of results) counts.set(r.classification, (counts.get(r.classification) ?? 0) + 1);
  const countRows = [...counts.entries()].sort().map(([key, value]) => `| ${key} | ${value} |`);
  const reconciled = results.length === summary.total_records;

  const section = (title, rows, render) =>
    rows.length === 0
      ? `### ${title}\n\nNone.\n`
      : `### ${title} (${rows.length})\n\n| Exercise | Status | Result | URL | Notes |\n|---|---|---|---|---|\n${rows.map(render).join('\n')}\n`;
  const row = (r) =>
    `| ${escapeMd(r.exercise_name)} (\`${r.exercise_id}\`) | ${r.current_video_status} | ${r.classification} | ${r.current_video_url ? `[link](${r.current_video_url})` : '—'} | ${escapeMd(r.notes)} |`;

  const verdict = inconclusive
    ? `**Inconclusive** — ${unresolved.length} of ${linked} links could not be checked (network trouble on the runner). The tracking issue was not changed.`
    : problemKeys.length === 0
      ? '**Clean** — every `verified` reference resolves and there is no needs-review backlog.'
      : `**${failingVerified.length} verified reference(s) failing, ${backlog.length} awaiting review.**`;

  const md = `## Weekly video-reference audit

Audited ${summary.audited_at} · ${summary.total_records} exercises · reconciles: ${reconciled ? 'yes' : '**NO**'}

${verdict}

| Classification | Count |
|---|---|
${countRows.join('\n')}

This checks only that each URL resolves on YouTube. It says nothing new about whether the video shows the right exercise — that is recorded per exercise as \`video_verification_method\` / \`video_verified_on\`.

${section('Verified references that no longer resolve', failingVerified, row)}
${section('Needs-review / broken backlog', backlog, row)}
${section('Could not be checked this run', unresolved, row)}
**To fix a failing reference:** find a real, live replacement that matches the exercise's exact equipment and variation, update \`video_link\`/\`video_creator\`/\`video_title\`/\`video_verified_on\`/\`video_verification_method\`, or set \`video_status: needs-review\` with \`video_link: null\` (and null verification fields) until one is found. Never mark a reference \`verified\` without checking it.

<!-- video-audit-fingerprint: ${fingerprint} -->
`;

  writeFileSync(reportPath, md);
  writeFileSync(
    metaPath,
    JSON.stringify({ fingerprint, reconciled, counts: Object.fromEntries(counts), problem_count: problemKeys.length, inconclusive, failing_verified: failingVerified.length, backlog: backlog.length, unresolved: unresolved.length }, null, 2) + '\n'
  );
  console.log(`fingerprint=${fingerprint} problems=${problemKeys.length} inconclusive=${inconclusive}`);
}

main();
