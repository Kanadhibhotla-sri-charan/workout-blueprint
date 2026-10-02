// Standalone, network-dependent audit of every exercise's video_link against
// YouTube's own oEmbed endpoint. Deliberately NOT wired into
// predev/prebuild/pretest — normal builds must stay deterministic and not
// depend on YouTube being reachable. Run manually (`npm run audit-videos`)
// or via the scheduled .github/workflows/video-audit.yml.
//
//   node scripts/audit-video-links.mjs [--out <path>]
//
// Without --out, writes the committed snapshot at
// docs/dev/reports/video-audit.json. CI passes --out so a scheduled run
// never rewrites tracked files.
//
// This establishes whether each URL currently resolves — nothing about
// whether the video's content matches the exercise. Content verification
// is recorded per record (video_verification_method / video_verified_on)
// and reported by scripts/generate-video-qa-report.mjs.
//
// Classifications:
//   LIVE                 HTTP 200 — public, resolvable video.
//   RESTRICTED           HTTP 401/403 — exists but private or not embeddable;
//                        needs a human to check, not proof it's gone.
//   DEAD_OR_UNAVAILABLE  HTTP 404 or another non-retryable 4xx — removed or
//                        never existed.
//   MALFORMED            Not a well-formed 11-char id, or YouTube rejects the
//                        id outright (HTTP 400).
//   UNRESOLVED           Network error or 429/5xx after all retries — the
//                        audit couldn't tell. Never counted as dead.
//   NO_LINK              video_link is null (expected for needs-review/broken).

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('./lib/load-records.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = join(__dirname, '..', 'docs', 'dev', 'reports', 'video-audit.json');

const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;
const FETCH_TIMEOUT_MS = 10000;

const CLASSIFICATIONS = ['LIVE', 'RESTRICTED', 'DEAD_OR_UNAVAILABLE', 'MALFORMED', 'UNRESOLVED', 'NO_LINK'];

function parseArgs(argv) {
  const outIndex = argv.indexOf('--out');
  return { out: outIndex >= 0 && argv[outIndex + 1] ? resolve(argv[outIndex + 1]) : DEFAULT_OUT };
}

function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+)|shorts\/([a-zA-Z0-9_-]+)/);
  if (!match) return null;
  return match[1] || match[2] || match[3] || null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkOembed(videoId) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.status === 200) {
        const body = await res.json();
        return { httpStatus: 200, title: body.title ?? null, author: body.author_name?.trim() ?? null };
      }
      if (RETRYABLE_STATUS.has(res.status)) {
        lastError = `HTTP ${res.status}`;
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * attempt);
          continue;
        }
        return { httpStatus: res.status, title: null, author: null, unresolved: lastError };
      }
      // A clean, non-retryable status (400/401/403/404) is YouTube's own
      // answer, not a transient failure — do not retry it away.
      return { httpStatus: res.status, title: null, author: null };
    } catch (err) {
      clearTimeout(timeout);
      lastError = err.message;
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
    }
  }
  return { httpStatus: null, title: null, author: null, unresolved: lastError };
}

function classify(result) {
  if (result.unresolved) {
    return ['UNRESOLVED', `Could not determine after ${MAX_RETRIES} attempts (${result.unresolved}) — not evidence the video is gone.`];
  }
  if (result.httpStatus === 200) return ['LIVE', ''];
  if (result.httpStatus === 400) return ['MALFORMED', 'oEmbed rejected the video id as malformed (HTTP 400).'];
  if (result.httpStatus === 401 || result.httpStatus === 403) {
    return ['RESTRICTED', `oEmbed returned HTTP ${result.httpStatus} — video may be private or have embedding disabled; needs a human check.`];
  }
  return ['DEAD_OR_UNAVAILABLE', `oEmbed returned HTTP ${result.httpStatus} — video removed or unavailable.`];
}

async function main() {
  const { out } = parseArgs(process.argv.slice(2));
  const { records, fileErrors } = loadAllRecords();
  if (fileErrors.length > 0) {
    console.error('Cannot audit — dataset failed to load:');
    for (const err of fileErrors) console.error(`  ${err}`);
    process.exit(1);
  }

  const sorted = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const results = [];
  const counts = Object.fromEntries(CLASSIFICATIONS.map((c) => [c, 0]));

  for (const record of sorted) {
    const url = record.video_link ?? null;
    const videoId = extractVideoId(url);
    const entry = {
      exercise_id: record.id,
      exercise_name: record.name,
      muscle_group: record._file.replace(/^.*\//, '').replace(/\.yaml$/, ''),
      current_video_url: url,
      video_id: videoId,
      current_video_status: record.video_status ?? null,
      http_result: null,
      resolved_title: null,
      resolved_author: null,
      classification: null,
      notes: '',
    };

    if (!url) {
      entry.classification = 'NO_LINK';
      entry.notes = 'No video_link set.';
    } else if (!videoId || !VIDEO_ID_PATTERN.test(videoId)) {
      entry.classification = 'MALFORMED';
      entry.notes = 'URL does not contain a well-formed 11-character YouTube video id.';
    } else {
      const result = await checkOembed(videoId);
      entry.http_result = result.httpStatus;
      entry.resolved_title = result.title;
      entry.resolved_author = result.author;
      [entry.classification, entry.notes] = classify(result);
    }

    counts[entry.classification]++;
    results.push(entry);
    process.stdout.write({ LIVE: '.', NO_LINK: '-', UNRESOLVED: '?', RESTRICTED: 'R', MALFORMED: 'M' }[entry.classification] ?? 'D');
  }
  process.stdout.write('\n');

  const classified = Object.values(counts).reduce((a, b) => a + b, 0);
  const summary = {
    audited_at: new Date().toISOString(),
    total_records: sorted.length,
    ...Object.fromEntries(CLASSIFICATIONS.map((c) => [c.toLowerCase(), counts[c]])),
    reconciled: classified === sorted.length,
  };

  writeFileSync(out, JSON.stringify({ summary, results }, null, 2) + '\n');

  console.log('');
  console.log('=== Video Link Audit Summary ===');
  console.log(`Total records:       ${sorted.length}`);
  for (const c of CLASSIFICATIONS) console.log(`${(c + ':').padEnd(21)}${counts[c]}`);
  console.log(`Reconciles to total: ${summary.reconciled ? 'YES' : 'NO — MISMATCH, investigate'}`);
  console.log(`Full results written to ${out}`);

  // Dead links are a reportable finding, not a script failure — the
  // scheduled workflow turns them into a single tracking issue. Only an
  // internally inconsistent audit is a hard error.
  if (!summary.reconciled) process.exit(1);
}

main();
