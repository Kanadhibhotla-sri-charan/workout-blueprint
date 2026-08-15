#!/usr/bin/env node
// CLI entry point: `npm run validate-data`.
// Exits non-zero on any schema, taxonomy, relationship, or review-
// governance violation, per docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md.

const { loadAllRecords } = require('./lib/load-records');
const { validate } = require('./lib/validate');

function main() {
  const { records, fileErrors, files } = loadAllRecords();
  const { issues, duplicateIds } = validate(records);

  const messages = [
    ...fileErrors,
    ...issues.map((i) => i.message),
    ...duplicateIds.map((d) => `duplicate id "${d.id}" appears ${d.count} times across the dataset`),
  ];

  console.log(`Validated ${records.length} records across ${files.length} files.\n`);

  if (messages.length === 0) {
    console.log('PASS — no schema, taxonomy, relationship, or governance violations found.');
    process.exit(0);
  } else {
    console.log(`FAIL — ${messages.length} issue(s) found:\n`);
    for (const m of messages) console.log('  - ' + m);
    process.exit(1);
  }
}

main();
