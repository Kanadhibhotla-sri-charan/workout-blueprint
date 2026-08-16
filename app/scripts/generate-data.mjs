// Build-time transform: canonical YAML (../../data/exercises/*.yaml) ->
// a typed JSON snapshot the app bundles (../src/data/exercises.generated.json).
//
// This is a mechanical transform, not a second authored copy of the
// knowledge base — per PHASE-3-MVP.md §4, the UI must never hand-duplicate
// exercise content. It reuses the exact loading and validation logic
// `npm run validate-data` runs at the repo root (scripts/lib/), so the app
// can never bundle a dataset that the repo's own validator would reject.
//
// Run automatically via the "predev"/"prebuild" npm scripts — never invoke
// this expecting the output to be hand-editable afterward; regenerate
// instead of patching src/data/exercises.generated.json.

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('../../scripts/lib/load-records.js');
const { validate } = require('../../scripts/lib/validate.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data');
const OUTPUT_PATH = join(OUTPUT_DIR, 'exercises.generated.json');

function main() {
  const { records, fileErrors } = loadAllRecords();

  if (fileErrors.length > 0) {
    console.error('Cannot generate app data — the dataset failed to load:');
    for (const err of fileErrors) console.error(`  ${err}`);
    process.exit(1);
  }

  const { issues, duplicateIds } = validate(records);

  if (issues.length > 0 || duplicateIds.length > 0) {
    console.error(
      `Cannot generate app data — the dataset is invalid ` +
      `(${issues.length} issue(s), ${duplicateIds.length} duplicate id(s)). ` +
      `Run "npm run validate-data" at the repo root for full detail.`
    );
    for (const issue of issues.slice(0, 20)) {
      console.error(`  [${issue.category}] ${issue.message}`);
    }
    if (issues.length > 20) console.error(`  ...and ${issues.length - 20} more.`);
    process.exit(1);
  }

  const exercises = records
    .map((record) => ({ ...record, _file: basename(record._file) }))
    .sort((a, b) => a.id.localeCompare(b.id));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(exercises, null, 2) + '\n');
  console.log(`Generated ${OUTPUT_PATH} from ${exercises.length} validated records.`);
}

main();
