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
  AESTHETIC_CHARACTERISTICS, AESTHETIC_ROLES,
} = require('./taxonomy');
const { loadPhysiqueTargets, loadAestheticOutcomes, loadFunctionalGoals } = require('./load-programming');

// Loaded once at module scope, same treatment as taxonomy.js's constants —
// data/programming/physique-targets.yaml is the authoritative taxonomy per
// ADR 0003, so every exercise's physique_targets entries must resolve here.
const { targetIds: PHYSIQUE_TARGET_IDS, fileErrors: PHYSIQUE_TARGET_FILE_ERRORS } = loadPhysiqueTargets();

// data/programming/functional-goals.yaml (revised Phase 4 spec §12/§39) is
// the authoritative functional-goal taxonomy — the "Function" branch's
// counterpart to physique-targets.yaml. Every exercise's functional_goals
// entries must resolve here.
const { goalIds: FUNCTIONAL_GOAL_IDS, fileErrors: FUNCTIONAL_GOAL_FILE_ERRORS } = loadFunctionalGoals();

// data/programming/aesthetic-outcomes.yaml (revised Phase 4, §28-29; primary/
// supporting split per Phase 4 Corrections §7) is the authoritative
// aesthetic-outcome taxonomy. Each outcome's primary_targets and
// supporting_targets must resolve to real ids in physique-targets.yaml —
// the aesthetic layer references targets, it does not redefine them.
const { outcomes: AESTHETIC_OUTCOMES, fileErrors: AESTHETIC_OUTCOME_FILE_ERRORS } = loadAestheticOutcomes();
const AESTHETIC_OUTCOME_REQUIRED_STRING_FIELDS = ['id', 'display_name', 'region', 'viewpoint', 'visual_description'];

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

  // Programming-data file itself failing to load is a project-wide problem,
  // not tied to any one exercise record — report it once, up front.
  for (const fileError of PHYSIQUE_TARGET_FILE_ERRORS) {
    issues.push({
      record: null,
      category: 'programming-data',
      message: `data/programming/physique-targets.yaml :: ${fileError}`,
    });
  }

  for (const fileError of AESTHETIC_OUTCOME_FILE_ERRORS) {
    issues.push({
      record: null,
      category: 'programming-data',
      message: `data/programming/aesthetic-outcomes.yaml :: ${fileError}`,
    });
  }

  for (const fileError of FUNCTIONAL_GOAL_FILE_ERRORS) {
    issues.push({
      record: null,
      category: 'programming-data',
      message: `data/programming/functional-goals.yaml :: ${fileError}`,
    });
  }

  // Needed early by exercise_roles referential-integrity checks below —
  // computed here rather than reusing the `allIds` set further down,
  // which is built after this loop runs.
  const exerciseIdSet = new Set(records.map((r) => r.id).filter((id) => typeof id === 'string'));

  // --- Aesthetic outcomes: required fields + primary_targets/
  // supporting_targets referential integrity (§28-29 of the revised Phase
  // 4 spec; primary/supporting split per Phase 4 Corrections §7). Not tied
  // to any one exercise record, so reported standalone like the
  // physique-targets file errors above.
  AESTHETIC_OUTCOMES.forEach((outcome, index) => {
    const label = outcome && typeof outcome.id === 'string' ? outcome.id : `index ${index}`;
    const reportOutcome = (message) => {
      issues.push({
        record: null,
        category: 'programming-data',
        message: `data/programming/aesthetic-outcomes.yaml :: ${label} :: ${message}`,
      });
    };

    for (const field of AESTHETIC_OUTCOME_REQUIRED_STRING_FIELDS) {
      const value = outcome ? outcome[field] : undefined;
      if (typeof value !== 'string' || value.trim() === '') {
        reportOutcome(`"${field}" must be a non-empty string, got ${JSON.stringify(value)}`);
      }
    }

    if (!isNonEmptyList(outcome && outcome.primary_targets)) {
      reportOutcome(`"primary_targets" is required and must be a non-empty list, got ${JSON.stringify(outcome && outcome.primary_targets)}`);
    } else {
      for (const targetId of outcome.primary_targets) {
        if (typeof targetId !== 'string' || !PHYSIQUE_TARGET_IDS.has(targetId)) {
          reportOutcome(`"primary_targets" references unknown target id ${JSON.stringify(targetId)} — not defined in data/programming/physique-targets.yaml`);
        }
      }
    }

    // supporting_targets is optional (an outcome may have no additional
    // contributors), but when present must be a list of real target ids
    // too, and must not just repeat the primary target(s) — that would
    // defeat the point of distinguishing the two.
    const supportingTargets = outcome && outcome.supporting_targets;
    if (!isListOrNull(supportingTargets)) {
      reportOutcome(`"supporting_targets" must be a list, or absent/null, got ${JSON.stringify(supportingTargets)}`);
    } else if (Array.isArray(supportingTargets)) {
      const primaryTargets = (outcome && outcome.primary_targets) || [];
      for (const targetId of supportingTargets) {
        if (typeof targetId !== 'string' || !PHYSIQUE_TARGET_IDS.has(targetId)) {
          reportOutcome(`"supporting_targets" references unknown target id ${JSON.stringify(targetId)} — not defined in data/programming/physique-targets.yaml`);
        } else if (primaryTargets.includes(targetId)) {
          reportOutcome(`"supporting_targets" duplicates primary target id ${JSON.stringify(targetId)} — a target should appear in only one of the two lists`);
        }
      }
    }

    // preferred_characteristics (Phase 4C §3) is optional — most outcomes
    // don't need it, since their physique_targets already narrow the pool
    // enough. When present, every value must be in the controlled
    // aesthetic-characteristics vocabulary.
    const preferredCharacteristics = outcome && outcome.preferred_characteristics;
    if (!isListOrNull(preferredCharacteristics)) {
      reportOutcome(`"preferred_characteristics" must be a list, or absent/null, got ${JSON.stringify(preferredCharacteristics)}`);
    } else if (Array.isArray(preferredCharacteristics)) {
      for (const characteristic of preferredCharacteristics) {
        if (typeof characteristic !== 'string' || !AESTHETIC_CHARACTERISTICS.has(characteristic)) {
          reportOutcome(`"preferred_characteristics" contains unrecognized value ${JSON.stringify(characteristic)} — not in the controlled set (Phase 4C)`);
        }
      }
    }

    // exercise_roles (Phase 4C Final Correction §6) — optional, contextual
    // to this outcome only (never a global exercise property). Present on
    // very few outcomes by design (§7/§24: only where a real ranking
    // distinction was found, never an exhaustive matrix). Every id must
    // resolve to a real exercise, and the same exercise must not appear
    // under more than one role for the same outcome.
    const exerciseRoles = outcome && outcome.exercise_roles;
    if (exerciseRoles !== undefined && exerciseRoles !== null) {
      if (typeof exerciseRoles !== 'object' || Array.isArray(exerciseRoles)) {
        reportOutcome(`"exercise_roles" must be an object keyed by role, or absent/null, got ${JSON.stringify(exerciseRoles)}`);
      } else {
        const seenExerciseIds = new Map();
        for (const role of AESTHETIC_ROLES) {
          const idsForRole = exerciseRoles[role];
          if (idsForRole === undefined || idsForRole === null) continue;
          if (!Array.isArray(idsForRole)) {
            reportOutcome(`"exercise_roles.${role}" must be a list, or absent/null, got ${JSON.stringify(idsForRole)}`);
            continue;
          }
          for (const exerciseId of idsForRole) {
            if (typeof exerciseId !== 'string' || !exerciseIdSet.has(exerciseId)) {
              reportOutcome(`"exercise_roles.${role}" references unknown exercise id ${JSON.stringify(exerciseId)}`);
              continue;
            }
            const priorRole = seenExerciseIds.get(exerciseId);
            if (priorRole) {
              reportOutcome(`"exercise_roles" lists ${JSON.stringify(exerciseId)} under both "${priorRole}" and "${role}" — an exercise should have only one role per outcome`);
            } else {
              seenExerciseIds.set(exerciseId, role);
            }
          }
        }
        for (const key of Object.keys(exerciseRoles)) {
          if (!AESTHETIC_ROLES.includes(key)) {
            reportOutcome(`"exercise_roles" has unrecognized role key ${JSON.stringify(key)} — must be one of ${AESTHETIC_ROLES.join('|')}`);
          }
        }
      }
    }
  });

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

    // --- Taxonomy: physique_targets must resolve to a real id in
    // data/programming/physique-targets.yaml (ADR 0003) — same
    // referential-integrity discipline as overlaps_with resolving to a
    // real exercise id.
    if (Array.isArray(record.physique_targets)) {
      for (const targetId of record.physique_targets) {
        if (typeof targetId === 'string' && !PHYSIQUE_TARGET_IDS.has(targetId)) {
          report(
            record,
            'taxonomy',
            `"physique_targets" references unknown target id "${targetId}" — not defined in data/programming/physique-targets.yaml`
          );
        }
      }
    }

    // --- Taxonomy: functional_goals must resolve to a real id in
    // data/programming/functional-goals.yaml (revised Phase 4 spec §12/
    // §39) — same referential-integrity discipline as physique_targets.
    if (Array.isArray(record.functional_goals)) {
      for (const goalId of record.functional_goals) {
        if (typeof goalId === 'string' && !FUNCTIONAL_GOAL_IDS.has(goalId)) {
          report(
            record,
            'taxonomy',
            `"functional_goals" references unknown goal id "${goalId}" — not defined in data/programming/functional-goals.yaml`
          );
        }
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
    if (Array.isArray(record.aesthetic_characteristics)) {
      for (const v of record.aesthetic_characteristics) {
        if (!AESTHETIC_CHARACTERISTICS.has(v)) {
          report(record, 'taxonomy', `"aesthetic_characteristics" contains unrecognized value "${v}" — not in the controlled set (Phase 4C)`);
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
      // "Advantages are meaningful" is permanently not enforced, per the
      // architect's Phase 2 Open Decisions memo (docs/architecture/
      // PHASE-2-OPEN-DECISIONS.md): the field is a retirement candidate,
      // not a content gap, and its emptiness must never block `reviewed`.
    }
  }

  const duplicateIds = [];
  for (const [id, count] of idCounts.entries()) {
    if (count > 1) duplicateIds.push({ id, count });
  }

  return { issues, duplicateIds, allIds };
}

module.exports = { validate, isNonEmptyList, isListOrNull };
