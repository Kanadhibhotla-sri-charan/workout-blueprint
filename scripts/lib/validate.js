// Core schema, taxonomy, relationship, and review-governance validation
// logic for the canonical exercise dataset. Shared by scripts/validate-data.js
// (pass/fail CLI check) and scripts/data-report.js (QA report generation) so
// the two never drift apart on what counts as a violation.
//
// Implements Tasks E, F, G, and the automatable subset of Task C's Review
// Promotion Gate from docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md.

const {
  BODY_REGIONS, EXERCISE_TYPES, LATERALITY, DEMAND_LEVELS, COVERAGE_CATEGORIES,
  REVIEW_STATUSES, FUNDAMENTAL_MOVEMENT_PATTERNS, REQUIRED_LIST_FIELDS,
  OPTIONAL_LIST_FIELDS, REQUIRED_SCALAR_STRING_FIELDS, ALL_FIELDS,
} = require('./taxonomy');

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BARE_ID_REF = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const QUOTED_MODULE_REF = /^([a-z0-9]+(-[a-z0-9]+)*) \(.*module.*\)/;

function isListOrNull(value) {
  return value === null || value === undefined || Array.isArray(value);
}

function isNonEmptyList(value) {
  return Array.isArray(value) && value.length > 0;
}

// Runs every check against the full record set. Returns a flat list of
// { record, category, message } issues rather than throwing, so callers
// (CLI checker, QA report) can decide what to do with them.
function validate(records) {
  const issues = [];
  const report = (record, category, message) => {
    issues.push({
      record,
      category,
      message: `${record._file} :: ${record.id || '(missing id)'} :: ${message}`,
    });
  };

  const allIds = new Set(records.map((r) => r.id).filter((id) => typeof id === 'string'));
  const idCounts = new Map();

  for (const record of records) {
    const seenInFile = new Set(
      records.filter((rr) => rr._file === record._file).map((rr) => rr.id).filter(Boolean)
    );

    // --- Schema: unexpected fields ---
    for (const key of Object.keys(record)) {
      if (key === '_file') continue;
      if (!ALL_FIELDS.has(key)) {
        report(record, 'schema', `unexpected field "${key}" not in the canonical schema`);
      }
    }

    // --- Schema: required scalar string fields ---
    for (const field of REQUIRED_SCALAR_STRING_FIELDS) {
      const value = record[field];
      if (typeof value !== 'string' || value.trim() === '') {
        report(record, 'schema', `"${field}" must be a non-empty string, got ${JSON.stringify(value)}`);
      }
    }

    // --- Schema: id format and uniqueness ---
    if (typeof record.id === 'string') {
      if (!ID_PATTERN.test(record.id)) {
        report(record, 'schema', `"id" must be lowercase kebab-case, got "${record.id}"`);
      }
      idCounts.set(record.id, (idCounts.get(record.id) || 0) + 1);
    }

    // --- Schema: required list fields (never null, must be non-empty) ---
    for (const field of REQUIRED_LIST_FIELDS) {
      const value = record[field];
      if (!isNonEmptyList(value)) {
        report(record, 'schema', `"${field}" is required and must be a non-empty list, got ${JSON.stringify(value)}`);
      } else if (!value.every((v) => typeof v === 'string')) {
        report(record, 'schema', `"${field}" must be a list of strings`);
      }
    }

    // --- Schema: optional list fields (null or list of strings, per ADR 0002) ---
    for (const field of OPTIONAL_LIST_FIELDS) {
      const value = record[field];
      if (!isListOrNull(value)) {
        report(record, 'schema', `"${field}" must be a list, or null (ADR 0002 "not applicable"), got ${JSON.stringify(value)}`);
      } else if (Array.isArray(value) && !value.every((v) => typeof v === 'string')) {
        report(record, 'schema', `"${field}" must be a list of strings`);
      }
    }

    // --- Schema: closed-enum scalar fields ---
    if (!EXERCISE_TYPES.has(record.exercise_type)) {
      report(record, 'schema', `"exercise_type" must be one of ${[...EXERCISE_TYPES].join('|')}, got ${JSON.stringify(record.exercise_type)}`);
    }
    if (!LATERALITY.has(record.laterality)) {
      report(record, 'schema', `"laterality" must be one of ${[...LATERALITY].join('|')}, got ${JSON.stringify(record.laterality)}`);
    }
    for (const field of ['stability_demand', 'skill_demand', 'setup_time', 'fatigue_cost']) {
      if (!DEMAND_LEVELS.has(record[field])) {
        report(record, 'schema', `"${field}" must be one of low|medium|high, got ${JSON.stringify(record[field])}`);
      }
    }
    if (!REVIEW_STATUSES.has(record.review_status)) {
      report(record, 'schema', `"review_status" must be one of ${[...REVIEW_STATUSES].join('|')}, got ${JSON.stringify(record.review_status)}`);
    }

    // --- Taxonomy: body_regions, coverage_categories, movement_patterns ---
    if (Array.isArray(record.body_regions)) {
      for (const v of record.body_regions) {
        if (!BODY_REGIONS.has(v)) {
          report(record, 'taxonomy', `"body_regions" contains unrecognized value "${v}" — not in the controlled 11-region set`);
        }
      }
    }
    if (Array.isArray(record.coverage_categories)) {
      for (const v of record.coverage_categories) {
        if (!COVERAGE_CATEGORIES.has(v)) {
          report(record, 'taxonomy', `"coverage_categories" contains unrecognized value "${v}" — not in the controlled set`);
        }
      }
    }
    if (Array.isArray(record.movement_patterns) && record.movement_patterns.length > 0) {
      const first = record.movement_patterns[0];
      if (!FUNDAMENTAL_MOVEMENT_PATTERNS.has(first)) {
        report(record, 'taxonomy', `"movement_patterns[0]" ("${first}") is not a recognized fundamental movement pattern`);
      }
    }

    // --- Relationships: overlaps_with must resolve; complements only when ID-shaped ---
    const checkRef = (entry, field) => {
      if (typeof entry !== 'string') return;
      const bareMatch = entry.match(BARE_ID_REF);
      const quotedMatch = entry.match(QUOTED_MODULE_REF);
      if (bareMatch && bareMatch[0] === entry) {
        if (entry === record.id) {
          report(record, 'relationship', `"${field}" contains a self-reference ("${entry}")`);
        } else if (!seenInFile.has(entry) && !allIds.has(entry)) {
          report(record, 'relationship', `"${field}" references unknown id "${entry}"`);
        } else if (!seenInFile.has(entry) && allIds.has(entry)) {
          report(record, 'relationship', `"${field}" references "${entry}" as a bare id, but it lives in a different file — should be quoted with a module note per SCHEMA.md convention`);
        }
      } else if (quotedMatch) {
        const idPart = quotedMatch[1];
        if (!allIds.has(idPart)) {
          report(record, 'relationship', `"${field}" references unknown id "${idPart}" in "${entry}"`);
        }
      }
      // else: free text, not a reference — no check (expected/normal for `complements`)
    };
    for (const entry of record.overlaps_with || []) checkRef(entry, 'overlaps_with');
    for (const entry of record.complements || []) checkRef(entry, 'complements');

    // --- Governance: reviewed records must satisfy the automatable Review Promotion Gate ---
    if (record.review_status === 'reviewed') {
      const gateRequiredNonEmpty = ['best_used_when', 'limitations', 'primary_targets', 'equipment'];
      for (const field of gateRequiredNonEmpty) {
        if (!isNonEmptyList(record[field])) {
          report(record, 'governance', `reviewed record fails Review Promotion Gate: "${field}" must be non-empty`);
        }
      }
      if (typeof record.mirror_effect !== 'string' || record.mirror_effect.trim() === '') {
        report(record, 'governance', `reviewed record fails Review Promotion Gate: "mirror_effect" must be present`);
      }
      // "Advantages are meaningful" is a known, universal, logged exception —
      // see docs/dev/reports/REVIEW-PROMOTION-GATE.md. Not enforced here.
    }
  }

  const duplicateIds = [];
  for (const [id, count] of idCounts.entries()) {
    if (count > 1) duplicateIds.push({ id, count });
  }

  return { issues, duplicateIds, allIds };
}

module.exports = { validate, isNonEmptyList, isListOrNull };
