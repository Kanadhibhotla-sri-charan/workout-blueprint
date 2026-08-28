// Standalone, network-dependent audit of every exercise's video_link against
// YouTube's own oEmbed endpoint. Deliberately NOT wired into
// predev/prebuild/pretest — normal builds must stay deterministic and not
// depend on YouTube being reachable (Video Reference Remediation spec §12).
// Run manually or as a dedicated CI job: node scripts/audit-video-links.mjs
//
// This establishes LIVE / DEAD_OR_UNAVAILABLE / MALFORMED only — whether the
// URL currently resolves. It cannot and does not confirm the video's content
// actually matches the exercise; that's a separate, metadata-based judgment
// documented in docs/dev/reports/VIDEO-CURATION-QA.md, not something this
// script claims.

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('./lib/load-records.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = join(__dirname, '..', 'docs', 'dev', 'reports', 'video-audit.json');

const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;
const FETCH_TIMEOUT_MS = 10000;

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
        return { httpStatus: 200, title: body.title ?? null, author: body.author_name ?? null };
      }
      if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_RETRIES) {
        lastError = `HTTP ${res.status} (retrying)`;
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }
      // A clean, non-retryable status (404, 400, 401, 403) is YouTube's own
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
  return { httpStatus: null, title: null, author: null, networkError: lastError };
}

async function main() {
  const { records, fileErrors } = loadAllRecords();
  if (fileErrors.length > 0) {
    console.error('Cannot audit — dataset failed to load:');
    for (const err of fileErrors) console.error(`  ${err}`);
    process.exit(1);
  }

  const sorted = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const results = [];
  let live = 0;
  let dead = 0;
  let malformed = 0;

  for (const record of sorted) {
    const url = record.video_link ?? null;
    const videoId = extractVideoId(url);
    const entry = {
      exercise_id: record.id,
      exercise_name: record.name,
      muscle_group: record._file.replace(/\.yaml$/, ''),
      current_video_url: url,
      video_id: videoId,
      current_video_status: record.video_status ?? null,
      http_result: null,
      resolved_title: null,
      resolved_author: null,
      classification: null,
      notes: '',
    };

    if (!url || !videoId || !VIDEO_ID_PATTERN.test(videoId)) {
      entry.classification = 'MALFORMED';
      entry.notes = url ? 'URL does not contain a well-formed 11-character YouTube video ID.' : 'No video_link set.';
      malformed++;
      results.push(entry);
      process.stdout.write('M');
      continue;
    }

    const result = await checkOembed(videoId);
    entry.http_result = result.httpStatus;
    entry.resolved_title = result.title;
    entry.resolved_author = result.author;

    if (result.httpStatus === 200) {
      entry.classification = 'LIVE';
      live++;
      process.stdout.write('.');
    } else if (result.httpStatus === 400) {
      entry.classification = 'MALFORMED';
      entry.notes = `oEmbed rejected the video ID as malformed (HTTP 400).`;
      malformed++;
      process.stdout.write('M');
    } else if (result.httpStatus === null) {
      entry.classification = 'DEAD_OR_UNAVAILABLE';
      entry.notes = `Network error after ${MAX_RETRIES} attempts: ${result.networkError}`;
      dead++;
      process.stdout.write('?');
    } else {
      entry.classification = 'DEAD_OR_UNAVAILABLE';
      entry.notes = `oEmbed returned HTTP ${result.httpStatus} — video unavailable, private, or removed.`;
      dead++;
      process.stdout.write('D');
    }
    results.push(entry);
  }
  process.stdout.write('\n');

  const total = live + dead + malformed;
  const summary = { total_records: sorted.length, live, dead_or_unavailable: dead, malformed, reconciled: total === sorted.length };

  writeFileSync(OUT_JSON, JSON.stringify({ summary, results }, null, 2) + '\n');

  console.log('');
  console.log('=== Video Link Audit Summary ===');
  console.log(`Total records:       ${sorted.length}`);
  console.log(`LIVE:                ${live}`);
  console.log(`DEAD_OR_UNAVAILABLE: ${dead}`);
  console.log(`MALFORMED:           ${malformed}`);
  console.log(`Reconciles to total: ${summary.reconciled ? 'YES' : 'NO — MISMATCH, investigate'}`);
  console.log(`Full results written to ${OUT_JSON}`);

  if (!summary.reconciled) process.exit(1);
}

main();
