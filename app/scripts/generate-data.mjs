// Build-time transform: canonical YAML (../../data/exercises/*.yaml and
// ../../data/programming/*.yaml) -> typed JSON snapshots the app bundles
// (../src/data/exercises.generated.json, ../src/data/programming.generated.json).
//
// This is a mechanical transform, not a second authored copy of the
// knowledge base — per PHASE-3-MVP.md §4, the UI must never hand-duplicate
// exercise content. It reuses the exact loading and validation logic
// `npm run validate-data` runs at the repo root (scripts/lib/), so the app
// can never bundle a dataset that the repo's own validator would reject.
//
// Run automatically via the "predev"/"prebuild" npm scripts — never invoke
// this expecting the output to be hand-editable afterward; regenerate
// instead of patching src/data/*.generated.json.

import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { loadAllRecords } = require('../../scripts/lib/load-records.js');
const { validate } = require('../../scripts/lib/validate.js');
const yaml = require('js-yaml');

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'src', 'data');
const EXERCISES_OUTPUT_PATH = join(OUTPUT_DIR, 'exercises.generated.json');
const PROGRAMMING_OUTPUT_PATH = join(OUTPUT_DIR, 'programming.generated.json');
const PROGRAMMING_DIR = join(__dirname, '..', '..', 'data', 'programming');

function loadYaml(filename) {
  return yaml.load(readFileSync(join(PROGRAMMING_DIR, filename), 'utf8'));
}

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

  const programming = {
    physiqueTargets: loadYaml('physique-targets.yaml').targets,
    globalPrinciples: loadYaml('global-principles.yaml'),
    repRanges: loadYaml('rep-ranges.yaml'),
    programmingProfiles: loadYaml('programming-profiles.yaml'),
    intensityTechniques: loadYaml('intensity-techniques.yaml').techniques,
    aestheticOutcomes: loadYaml('aesthetic-outcomes.yaml').outcomes,
    functionalGoals: loadYaml('functional-goals.yaml').goals,
    developmentPackages: loadYaml('development-packages.yaml'),
  };

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(EXERCISES_OUTPUT_PATH, JSON.stringify(exercises, null, 2) + '\n');
  writeFileSync(PROGRAMMING_OUTPUT_PATH, JSON.stringify(programming, null, 2) + '\n');
  console.log(`Generated ${EXERCISES_OUTPUT_PATH} from ${exercises.length} validated records.`);
  console.log(`Generated ${PROGRAMMING_OUTPUT_PATH} from data/programming/*.yaml.`);
}

main();
