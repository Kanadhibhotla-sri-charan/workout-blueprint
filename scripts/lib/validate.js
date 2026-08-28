// Core schema, taxonomy, relationship, and review-governance validation
// logic for the canonical exercise dataset. Shared by scripts/validate-data.js
// (pass/fail CLI check) and scripts/data-report.js (QA report generation) so
// the two never drift apart on what counts as a violation.
//
// Implements Tasks E, F, G, and the automatable subset of Task C's Review
// Promotion Gate from docs/architecture/PHASE-2-SCHEMA-AND-DATA-GOVERNANCE.md.

const {
  BODY_REGIONS, EXERCISE_TYPES, LATERALITY, DEMAND_LEVELS, COVERAGE_CATEGORIES,
  REVIEW_STATUSES, VIDEO_STATUSES, FUNDAMENTAL_MOVEMENT_PATTERNS, REQUIRED_LIST_FIELDS,
  OPTIONAL_LIST_FIELDS, REQUIRED_SCALAR_STRING_FIELDS, ALL_FIELDS,
  AESTHETIC_CHARACTERISTICS, AESTHETIC_ROLES,
} = require('./taxonomy');
const {
  loadPhysiqueTargets, loadAestheticOutcomes, loadFunctionalGoals,
  loadProgrammingProfiles, loadDevelopmentPackages,
} = require('./load-programming');

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

// data/programming/programming-profiles.yaml — needed to cross-check
// development-packages.yaml's authored reps against the same
// classification logic app/src/engine/programmingEngine.ts's
// resolveProgrammingProfile() uses, so package data can't silently drift
// from what the Decision Maker would say about the same exercise (Phase 5
// §5 dev-log rationale).
const { catalog: PROGRAMMING_PROFILES, fileErrors: PROGRAMMING_PROFILES_FILE_ERRORS } = loadProgrammingProfiles();

// data/programming/development-packages.yaml (Phase 5 §5).
const { catalog: DEVELOPMENT_PACKAGES, fileErrors: DEVELOPMENT_PACKAGES_FILE_ERRORS } = loadDevelopmentPackages();

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BARE_ID_REF = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const QUOTED_MODULE_REF = /^([a-z0-9]+(-[a-z0-9]+)*) \(.*module.*\)/;
const REP_RANGE_PATTERN = /^\d+-\d+$/;
const YOUTUBE_URL_PATTERN = /^https:\/\/(www\.|m\.)?(youtube\.com\/(watch\?v=[a-zA-Z0-9_-]{11}|shorts\/[a-zA-Z0-9_-]{11})|youtu\.be\/[a-zA-Z0-9_-]{11})(\S*)?$/;

const DEMAND_ORDER = ['low', 'medium', 'high'];

// Same first-match-wins classification programmingEngine.ts's
// resolveProgrammingProfile() implements — duplicated here in plain JS
// only because validate-data.js is a build-time Node/CommonJS script that
// can't import the app's TypeScript engine directly. Any change to the
// TS version must be mirrored here.
function matchesProfileRule(exercise, match) {
  if (match.exercise_type && exercise.exercise_type !== match.exercise_type) return false;
  if (
    match.coverage_categories_any &&
    !match.coverage_categories_any.some((c) => (exercise.coverage_categories || []).includes(c))
  ) {
    return false;
  }
  if (match.stability_demand_at_least) {
    const exerciseIndex = DEMAND_ORDER.indexOf(exercise.stability_demand);
    const minIndex = DEMAND_ORDER.indexOf(match.stability_demand_at_least);
    if (exerciseIndex < minIndex) return false;
  }
  return true;
}

function resolveProgrammingProfileForExercise(exercise) {
  if (!PROGRAMMING_PROFILES) return null;
  const rule = PROGRAMMING_PROFILES.classification.defaults.find((r) => matchesProfileRule(exercise, r.match));
  if (!rule) return null;
  return PROGRAMMING_PROFILES.profiles.find((p) => p.id === rule.profile_id) || null;
}

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

  for (const fileError of PROGRAMMING_PROFILES_FILE_ERRORS) {
    issues.push({
      record: null,
      category: 'programming-data',
      message: `data/programming/programming-profiles.yaml :: ${fileError}`,
    });
  }

  for (const fileError of DEVELOPMENT_PACKAGES_FILE_ERRORS) {
    issues.push({
      record: null,
      category: 'programming-data',
      message: `data/programming/development-packages.yaml :: ${fileError}`,
    });
  }

  // Needed early by exercise_roles referential-integrity checks below —
  // computed here rather than reusing the `allIds` set further down,
  // which is built after this loop runs.
  const exerciseIdSet = new Set(records.map((r) => r.id).filter((id) => typeof id === 'string'));
  const exerciseById = new Map(records.map((r) => [r.id, r]));

  // --- Development packages (Phase 5 §5/§23): coverage, redundancy, and
  // programming-consistency checks. Not tied to any one exercise record.
  if (DEVELOPMENT_PACKAGES) {
    const muscleGroupIds = new Set();
    (DEVELOPMENT_PACKAGES.muscle_groups || []).forEach((group, index) => {
      const label = group && typeof group.id === 'string' ? group.id : `index ${index}`;
      const reportGroup = (message) => {
        issues.push({
          record: null,
          category: 'programming-data',
          message: `data/programming/development-packages.yaml :: muscle_groups :: ${label} :: ${message}`,
        });
      };
      if (!group || typeof group.id !== 'string' || group.id.trim() === '') {
        reportGroup(`"id" must be a non-empty string`);
      } else if (muscleGroupIds.has(group.id)) {
        reportGroup(`duplicate muscle_group id`);
      } else {
        muscleGroupIds.add(group.id);
      }
      if (!group || typeof group.name !== 'string' || group.name.trim() === '') {
        reportGroup(`"name" must be a non-empty string`);
      }
      if (!isNonEmptyList(group && group.target_ids)) {
        reportGroup(`"target_ids" must be a non-empty list`);
      } else {
        for (const targetId of group.target_ids) {
          if (typeof targetId !== 'string' || !PHYSIQUE_TARGET_IDS.has(targetId)) {
            reportGroup(`"target_ids" references unknown target id ${JSON.stringify(targetId)} — not defined in data/programming/physique-targets.yaml`);
          }
        }
      }
    });

    const packageIds = new Set();
    (DEVELOPMENT_PACKAGES.packages || []).forEach((pkg, index) => {
      const label = pkg && typeof pkg.id === 'string' ? pkg.id : `index ${index}`;
      const reportPkg = (message) => {
        issues.push({
          record: null,
          category: 'programming-data',
          message: `data/programming/development-packages.yaml :: packages :: ${label} :: ${message}`,
        });
      };

      if (!pkg || typeof pkg.id !== 'string' || pkg.id.trim() === '') {
        reportPkg(`"id" must be a non-empty string`);
      } else if (packageIds.has(pkg.id)) {
        reportPkg(`duplicate package id`);
      } else {
        packageIds.add(pkg.id);
      }
      if (!pkg || typeof pkg.muscle_group !== 'string' || !muscleGroupIds.has(pkg.muscle_group)) {
        reportPkg(`"muscle_group" references unknown muscle_groups id ${JSON.stringify(pkg && pkg.muscle_group)}`);
      }
      if (!pkg || (pkg.level !== 'efficient' && pkg.level !== 'complete')) {
        reportPkg(`"level" must be "efficient" or "complete", got ${JSON.stringify(pkg && pkg.level)}`);
      }
      for (const field of ['display_name', 'objective', 'rationale']) {
        if (!pkg || typeof pkg[field] !== 'string' || pkg[field].trim() === '') {
          reportPkg(`"${field}" must be a non-empty string`);
        }
      }
      if (!pkg || !pkg.frequency || typeof pkg.frequency.sessions_per_week !== 'number' || pkg.frequency.sessions_per_week <= 0) {
        reportPkg(`"frequency.sessions_per_week" must be a positive number`);
      }

      // Coverage/redundancy (§4/§23): at least 2 distinct exercises, every
      // exercise_id must resolve, no exercise repeated within a package.
      const exercises = pkg && pkg.exercises;
      if (!Array.isArray(exercises) || exercises.length < 2) {
        reportPkg(`"exercises" must contain at least 2 distinct exercises, got ${Array.isArray(exercises) ? exercises.length : JSON.stringify(exercises)}`);
      } else {
        const seenExerciseIds = new Set();
        const seenOrders = new Set();
        exercises.forEach((entry, exIndex) => {
          const exLabel = entry && typeof entry.exercise_id === 'string' ? entry.exercise_id : `exercises[${exIndex}]`;
          const reportEx = (message) => reportPkg(`${exLabel} :: ${message}`);

          if (!entry || typeof entry.exercise_id !== 'string' || !exerciseIdSet.has(entry.exercise_id)) {
            reportEx(`"exercise_id" references unknown exercise id ${JSON.stringify(entry && entry.exercise_id)}`);
            return;
          }
          if (seenExerciseIds.has(entry.exercise_id)) {
            reportEx(`appears more than once in the same package — every package exercise must be distinct`);
          }
          seenExerciseIds.add(entry.exercise_id);

          if (typeof entry.order !== 'number' || entry.order <= 0) {
            reportEx(`"order" must be a positive number, got ${JSON.stringify(entry.order)}`);
          } else if (seenOrders.has(entry.order)) {
            reportEx(`duplicate "order" value ${entry.order} within this package`);
          } else {
            seenOrders.add(entry.order);
          }

          if (typeof entry.sets !== 'number' || entry.sets <= 0) {
            reportEx(`"sets" must be a positive number, got ${JSON.stringify(entry.sets)}`);
          }
          if (typeof entry.reps !== 'string' || !REP_RANGE_PATTERN.test(entry.reps)) {
            reportEx(`"reps" must be a "min-max" string, got ${JSON.stringify(entry.reps)}`);
          }
          if (typeof entry.rir !== 'string' || !REP_RANGE_PATTERN.test(entry.rir)) {
            reportEx(`"rir" must be a "min-max" string, got ${JSON.stringify(entry.rir)}`);
          }
          if (!AESTHETIC_ROLES.includes(entry.role)) {
            reportEx(`"role" must be one of ${AESTHETIC_ROLES.join('|')}, got ${JSON.stringify(entry.role)}`);
          }
          if (typeof entry.contribution !== 'string' || entry.contribution.trim() === '') {
            reportEx(`"contribution" must be a non-empty string`);
          }

          // Programming consistency (§23 "Programming matches exercise
          // type/profile"): the authored reps must equal the primary_range
          // of the Programming Profile this exact exercise resolves to
          // elsewhere in the app — never a hand-typed number that could
          // silently contradict the Decision Maker.
          const exerciseRecord = exerciseById.get(entry.exercise_id);
          if (exerciseRecord && typeof entry.reps === 'string' && REP_RANGE_PATTERN.test(entry.reps)) {
            const profile = resolveProgrammingProfileForExercise(exerciseRecord);
            if (profile) {
              const expected = `${profile.primary_range[0]}-${profile.primary_range[1]}`;
              if (entry.reps !== expected) {
                reportEx(
                  `"reps" (${JSON.stringify(entry.reps)}) does not match ${JSON.stringify(exerciseRecord.id)}'s resolved ` +
                  `Programming Profile "${profile.id}" primary_range (expected ${JSON.stringify(expected)})`
                );
              }
            }
          }
        });
      }
    });
  }

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
  const videoLinkCounts = new Map();

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

    // --- Video Reference Validation ---
    // A `verified` record must carry a real, well-formed URL. `needs-review`
    // and `broken` records are honest placeholders for a reference that
    // hasn't (yet) been confirmed — they must NOT be forced to also carry a
    // valid URL, since the whole point of `needs-review` is that no
    // confirmed-good URL exists yet (Video Reference Remediation spec §7-§8).
    if (!VIDEO_STATUSES.has(record.video_status)) {
      report(record, 'schema', `"video_status" must be one of ${[...VIDEO_STATUSES].join('|')}, got ${JSON.stringify(record.video_status)}`);
    }
    if (record.video_status === 'verified') {
      if (!record.video_link || typeof record.video_link !== 'string' || !YOUTUBE_URL_PATTERN.test(record.video_link)) {
        report(record, 'schema', `"video_link" is required and must be a valid YouTube URL when "video_status" is "verified", got ${JSON.stringify(record.video_link)}`);
      }
    } else if (record.video_link !== null && record.video_link !== undefined) {
      report(record, 'schema', `"video_link" must be null when "video_status" is not "verified" (got status ${JSON.stringify(record.video_status)} with link ${JSON.stringify(record.video_link)}) — a dead/unconfirmed URL must not be preserved as if it were a working reference`);
    }
    if (record.video_link && typeof record.video_link === 'string' && YOUTUBE_URL_PATTERN.test(record.video_link)) {
      const existing = videoLinkCounts.get(record.video_link) || [];
      existing.push(record.id);
      videoLinkCounts.set(record.video_link, existing);
    }
    if (record.video_creator !== undefined && record.video_creator !== null) {
      if (typeof record.video_creator !== 'string' || record.video_creator.trim() === '') {
        report(record, 'schema', `"video_creator" must be a non-empty string, got ${JSON.stringify(record.video_creator)}`);
      }
    }
    if (record.video_title !== undefined && record.video_title !== null) {
      if (typeof record.video_title !== 'string' || record.video_title.trim() === '') {
        report(record, 'schema', `"video_title" must be a non-empty string, got ${JSON.stringify(record.video_title)}`);
      }
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

  for (const [url, exerciseIds] of videoLinkCounts.entries()) {
    if (exerciseIds.length > 1) {
      issues.push({
        record: null,
        category: 'schema',
        message: `duplicate video_link "${url}" appears across ${exerciseIds.length} exercises: ${exerciseIds.join(', ')}`,
      });
    }
  }

  return { issues, duplicateIds, allIds };
}

module.exports = { validate, isNonEmptyList, isListOrNull };
