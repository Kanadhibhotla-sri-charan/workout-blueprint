const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PROGRAMMING_DIR = path.join(__dirname, '..', '..', 'data', 'programming');

// Loads data/programming/physique-targets.yaml specifically, since it's
// the one programming file other validation (physique_targets referential
// integrity) and the engine need to look up by id. The other three
// programming files (global-principles.yaml, rep-ranges.yaml,
// intensity-techniques.yaml) are consumed directly by the app; nothing in
// the root validator needs to parse them today.
function loadPhysiqueTargets() {
  const file = path.join(PROGRAMMING_DIR, 'physique-targets.yaml');
  const relFile = path.relative(process.cwd(), file);

  if (!fs.existsSync(file)) {
    return { targetIds: new Set(), fileErrors: [`${relFile}: file not found`] };
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { targetIds: new Set(), fileErrors: [`${relFile}: malformed YAML — ${err.message}`] };
  }

  if (!data || !Array.isArray(data.targets)) {
    return {
      targetIds: new Set(),
      fileErrors: [`${relFile}: expected a top-level "targets" list`],
    };
  }

  const targetIds = new Set();
  const fileErrors = [];
  data.targets.forEach((target, index) => {
    if (!target || typeof target.id !== 'string') {
      fileErrors.push(`${relFile}: target at index ${index} is missing a string "id"`);
      return;
    }
    targetIds.add(target.id);
  });

  return { targetIds, fileErrors };
}

// Loads data/programming/aesthetic-outcomes.yaml. Same treatment as
// loadPhysiqueTargets above — the root validator needs each outcome's id
// (for future exercise/UI cross-references) and its physique_targets list,
// to check referential integrity against physique-targets.yaml (§29 of the
// revised Phase 4 spec: aesthetic outcomes reference targets, they don't
// redefine them).
function loadAestheticOutcomes() {
  const file = path.join(PROGRAMMING_DIR, 'aesthetic-outcomes.yaml');
  const relFile = path.relative(process.cwd(), file);

  if (!fs.existsSync(file)) {
    return { outcomes: [], fileErrors: [`${relFile}: file not found`] };
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { outcomes: [], fileErrors: [`${relFile}: malformed YAML — ${err.message}`] };
  }

  if (!data || !Array.isArray(data.outcomes)) {
    return {
      outcomes: [],
      fileErrors: [`${relFile}: expected a top-level "outcomes" list`],
    };
  }

  return { outcomes: data.outcomes, fileErrors: [] };
}

// Loads data/programming/functional-goals.yaml (revised Phase 4 spec §12/
// §39). Same treatment as loadPhysiqueTargets — the root validator needs
// each goal's id, to check functional_goals referential integrity on
// exercise records the same way physique_targets is checked against
// physique-targets.yaml.
function loadFunctionalGoals() {
  const file = path.join(PROGRAMMING_DIR, 'functional-goals.yaml');
  const relFile = path.relative(process.cwd(), file);

  if (!fs.existsSync(file)) {
    return { goalIds: new Set(), fileErrors: [`${relFile}: file not found`] };
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { goalIds: new Set(), fileErrors: [`${relFile}: malformed YAML — ${err.message}`] };
  }

  if (!data || !Array.isArray(data.goals)) {
    return {
      goalIds: new Set(),
      fileErrors: [`${relFile}: expected a top-level "goals" list`],
    };
  }

  const goalIds = new Set();
  const fileErrors = [];
  data.goals.forEach((goal, index) => {
    if (!goal || typeof goal.id !== 'string') {
      fileErrors.push(`${relFile}: goal at index ${index} is missing a string "id"`);
      return;
    }
    goalIds.add(goal.id);
  });

  return { goalIds, fileErrors };
}

// Loads data/programming/programming-profiles.yaml. Needed by the
// development-packages cross-check (Phase 5 §5): each package exercise's
// authored `reps` must match the primary_range of the Programming Profile
// that exercise itself resolves to, so package data can never silently
// drift from what the Decision Maker would say about the same exercise.
function loadProgrammingProfiles() {
  const file = path.join(PROGRAMMING_DIR, 'programming-profiles.yaml');
  const relFile = path.relative(process.cwd(), file);

  if (!fs.existsSync(file)) {
    return { catalog: null, fileErrors: [`${relFile}: file not found`] };
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { catalog: null, fileErrors: [`${relFile}: malformed YAML — ${err.message}`] };
  }

  if (!data || !Array.isArray(data.profiles) || !data.classification || !Array.isArray(data.classification.defaults)) {
    return {
      catalog: null,
      fileErrors: [`${relFile}: expected top-level "profiles" and "classification.defaults" lists`],
    };
  }

  return { catalog: data, fileErrors: [] };
}

// Loads data/programming/development-packages.yaml (Phase 5 §5).
function loadDevelopmentPackages() {
  const file = path.join(PROGRAMMING_DIR, 'development-packages.yaml');
  const relFile = path.relative(process.cwd(), file);

  if (!fs.existsSync(file)) {
    return { catalog: null, fileErrors: [`${relFile}: file not found`] };
  }

  let data;
  try {
    data = yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return { catalog: null, fileErrors: [`${relFile}: malformed YAML — ${err.message}`] };
  }

  if (!data || !Array.isArray(data.muscle_groups) || !Array.isArray(data.packages)) {
    return {
      catalog: null,
      fileErrors: [`${relFile}: expected top-level "muscle_groups" and "packages" lists`],
    };
  }

  return { catalog: data, fileErrors: [] };
}

module.exports = {
  loadPhysiqueTargets, loadAestheticOutcomes, loadFunctionalGoals,
  loadProgrammingProfiles, loadDevelopmentPackages, PROGRAMMING_DIR,
};
