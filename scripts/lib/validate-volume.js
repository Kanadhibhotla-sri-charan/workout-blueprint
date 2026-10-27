// Volume-model checks (Workout Logger change requests 1.1-1.3, 2026-10-27):
// physique-targets.yaml's hierarchy, volume-targets.yaml, and each
// exercise's target_credit. Returns issues in validate.js's shape.
const { loadVolumeModel, loadFunctionalGoals, loadAestheticOutcomes } = require('./load-programming');

const LEVELS = new Set(['priority', 'efficient', 'bias']);
const SPORTS = new Set(['badminton']);

const SHARE_TOLERANCE = 0.011; // three children at 0.33 / 0.34 / 0.33

function validateVolume(records) {
  const issues = [];
  const { targets, groups, volumeTargets, fileErrors } = loadVolumeModel();
  for (const fileError of fileErrors) {
    issues.push({ record: null, category: 'programming-data', message: fileError });
  }
  const fileIssue = (file, message) =>
    issues.push({ record: null, category: 'volume', message: `data/programming/${file} :: ${message}` });
  const recordIssue = (record, message) =>
    issues.push({ record, category: 'volume', message: `${record._file} :: ${record.id} :: ${message}` });

  const targetIds = new Set(targets.map((t) => t.id));
  const groupIds = new Set(groups.map((g) => g.id));
  // Functional goals with their own volume entry (core-anti-extension,
  // change request 2.4) may also be credited.
  const { goalIds: functionalGoalIds } = loadFunctionalGoals();
  const volumeGoalIds = new Set(volumeTargets.filter((v) => v && v.goal_id).map((v) => v.goal_id));
  for (const id of volumeGoalIds) {
    if (!functionalGoalIds.has(id)) fileIssue('volume-targets.yaml', `goal_id "${id}" is not a functional goal`);
  }
  const creditIds = new Set([...targetIds, ...groupIds, ...volumeGoalIds]);
  for (const id of groupIds) {
    if (targetIds.has(id)) fileIssue('physique-targets.yaml', `volume group "${id}" reuses a physique target id`);
  }

  // --- 1.2 hierarchy ---
  const parentOf = new Map();
  const childrenOf = new Map();
  for (const t of targets) {
    if (t.parent === undefined) {
      if (t.volume_share !== undefined || t.min_share !== undefined) {
        fileIssue('physique-targets.yaml', `${t.id} :: volume_share / min_share need a "parent"`);
      }
      continue;
    }
    if (!creditIds.has(t.parent) || t.parent === t.id) {
      fileIssue('physique-targets.yaml', `${t.id} :: parent "${t.parent}" is not a volume group or another target`);
      continue;
    }
    parentOf.set(t.id, t.parent);
    if (!childrenOf.has(t.parent)) childrenOf.set(t.parent, []);
    childrenOf.get(t.parent).push(t);
    for (const field of ['volume_share', 'min_share']) {
      const v = t[field];
      if (v !== undefined && !(typeof v === 'number' && v > 0 && v <= 1)) {
        fileIssue('physique-targets.yaml', `${t.id} :: ${field} must be a number in (0, 1], got ${JSON.stringify(v)}`);
      }
    }
    if (typeof t.volume_share === 'number' && typeof t.min_share === 'number' && t.min_share > t.volume_share) {
      fileIssue('physique-targets.yaml', `${t.id} :: min_share (${t.min_share}) exceeds volume_share (${t.volume_share})`);
    }
  }
  for (const id of parentOf.keys()) {
    if (parentOf.has(parentOf.get(id))) {
      fileIssue('physique-targets.yaml', `${id} :: parent "${parentOf.get(id)}" itself has a parent (one level only)`);
    }
  }
  for (const [parent, children] of childrenOf) {
    for (const field of ['volume_share', 'min_share']) {
      const sum = children.reduce((acc, c) => acc + (typeof c[field] === 'number' ? c[field] : 0), 0);
      if (sum > 1 + SHARE_TOLERANCE) {
        fileIssue('physique-targets.yaml', `children of "${parent}" have ${field} adding up to ${sum.toFixed(2)} (> 1.0)`);
      }
    }
  }
  for (const id of groupIds) {
    if (!childrenOf.has(id)) fileIssue('physique-targets.yaml', `volume group "${id}" has no child targets`);
  }

  // --- 1.1 volume targets ---
  const seen = new Map();
  for (const entry of volumeTargets) {
    if (entry && entry.target_id && entry.goal_id) {
      fileIssue('volume-targets.yaml', `an entry names both target_id "${entry.target_id}" and goal_id "${entry.goal_id}"`);
      continue;
    }
    const id = entry && (entry.target_id || entry.goal_id);
    if (entry && entry.target_id && volumeGoalIds.has(entry.target_id)) {
      fileIssue('volume-targets.yaml', `"${id}" is a functional goal; use goal_id`);
      continue;
    }
    if (!creditIds.has(id)) {
      fileIssue('volume-targets.yaml', `entry for unknown target or group "${id}"`);
      continue;
    }
    seen.set(id, (seen.get(id) || 0) + 1);
    if (parentOf.has(id)) {
      if (entry.volume_from_parent !== parentOf.get(id)) {
        fileIssue('volume-targets.yaml', `${id} :: a child target must say volume_from_parent: ${parentOf.get(id)}`);
      }
      if (entry.weekly_sets !== undefined) {
        fileIssue('volume-targets.yaml', `${id} :: a child target takes its parent's weekly_sets and must not define its own`);
      }
      continue;
    }
    const w = entry.weekly_sets || {};
    const levels = ['minimum', 'efficient', 'priority'];
    if (!levels.every((k) => Number.isInteger(w[k]) && w[k] >= 0)) {
      fileIssue('volume-targets.yaml', `${id} :: weekly_sets needs whole-number minimum, efficient and priority`);
    } else if (!(w.minimum <= w.efficient && w.efficient <= w.priority && w.priority > 0)) {
      fileIssue('volume-targets.yaml', `${id} :: weekly_sets must satisfy minimum <= efficient <= priority`);
    } else if (w.priority > 20) {
      fileIssue('volume-targets.yaml', `${id} :: priority ${w.priority} is above global-principles' practical range (10-20)`);
    }
    if (!Number.isInteger(entry.per_session_max) || entry.per_session_max <= 0) {
      fileIssue('volume-targets.yaml', `${id} :: per_session_max must be a positive whole number`);
    }
    // Change request 2.1: frequency spreads the weekly number, never multiplies it.
    const spw = entry.sessions_per_week;
    if (!(Array.isArray(spw) && spw.length === 2 && spw.every(Number.isInteger) && spw[0] >= 1 && spw[0] <= spw[1] && spw[1] <= 7)) {
      fileIssue('volume-targets.yaml', `${id} :: sessions_per_week must be [low, high] whole numbers with 1 <= low <= high <= 7`);
    } else if (Number.isInteger(entry.per_session_max) && Number.isInteger(w.priority) && spw[1] * entry.per_session_max < w.priority) {
      fileIssue('volume-targets.yaml', `${id} :: ${spw[1]} sessions x per_session_max ${entry.per_session_max} cannot reach priority ${w.priority}`);
    }
    if (!(Number.isInteger(entry.min_hours_between) && entry.min_hours_between >= 0 && entry.min_hours_between <= 96)) {
      fileIssue('volume-targets.yaml', `${id} :: min_hours_between must be whole hours between 0 and 96`);
    }
    if (typeof entry.indirect_only !== 'boolean') {
      fileIssue('volume-targets.yaml', `${id} :: indirect_only must be true or false`);
    }
    if (typeof entry.rationale !== 'string' || entry.rationale.trim().length < 20) {
      fileIssue('volume-targets.yaml', `${id} :: rationale is missing or too short`);
    }
  }
  for (const id of [...targetIds, ...groupIds]) {
    const count = seen.get(id) || 0;
    if (count !== 1) {
      const kind = targetIds.has(id) ? 'physique target' : 'volume group';
      fileIssue('volume-targets.yaml', `${kind} "${id}" has ${count} entries (expected exactly 1)`);
    }
  }

  // --- 2.3 outcome volume levels ---
  const { outcomes } = loadAestheticOutcomes();
  for (const outcome of outcomes) {
    const levels = outcome.volume_levels;
    if (!Array.isArray(levels) || levels.length === 0) {
      fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: needs a non-empty "volume_levels" list`);
      continue;
    }
    const listed = new Map();
    for (const entry of levels) {
      const tid = entry && entry.target_id;
      if (!creditIds.has(tid)) fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: volume_levels names unknown id "${tid}"`);
      if (!LEVELS.has(entry && entry.level)) {
        fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: level for "${tid}" must be one of ${[...LEVELS].join('|')}`);
      }
      listed.set(tid, entry && entry.level);
    }
    for (const [tid, level] of listed) {
      if (level === 'bias' && !(parentOf.has(tid) && listed.has(parentOf.get(tid)))) {
        fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: "bias" on "${tid}" needs its parent listed at a volume level`);
      }
      if (level !== 'bias' && parentOf.has(tid)) {
        fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: child target "${tid}" takes "bias"; put the level on "${parentOf.get(tid)}"`);
      }
    }
    for (const tid of [...(outcome.primary_targets || []), ...(outcome.supporting_targets || [])]) {
      if (!listed.has(tid)) fileIssue('aesthetic-outcomes.yaml', `${outcome.id} :: target "${tid}" has no volume level`);
    }
  }

  // --- 1.3 target_credit ---
  for (const record of records) {
    if (record.sport_carryover !== undefined) {
      if (!Array.isArray(record.sport_carryover) || record.sport_carryover.some((v) => !SPORTS.has(v))) {
        recordIssue(record, `"sport_carryover" must be a list of ${[...SPORTS].join('|')}`);
      }
    }
    // Change request 2.2: numeric time cost on every exercise.
    const time = record.time;
    if (!time || typeof time !== 'object') {
      recordIssue(record, 'missing "time" (setup_minutes, seconds_per_set, rest_seconds, per_side, superset_friendly)');
    } else {
      const inRange = (v, lo, hi) => typeof v === 'number' && v >= lo && v <= hi;
      if (!inRange(time.setup_minutes, 0, 10)) recordIssue(record, '"time.setup_minutes" must be 0-10');
      if (!(Number.isInteger(time.seconds_per_set) && inRange(time.seconds_per_set, 5, 300))) {
        recordIssue(record, '"time.seconds_per_set" must be whole seconds, 5-300');
      }
      const rest = time.rest_seconds;
      if (!(Array.isArray(rest) && rest.length === 2 && rest.every((v) => Number.isInteger(v) && inRange(v, 0, 300)) && rest[0] <= rest[1])) {
        recordIssue(record, '"time.rest_seconds" must be [low, high] whole seconds, 0-300, low <= high');
      }
      if (typeof time.per_side !== 'boolean' || time.per_side !== (record.laterality === 'unilateral')) {
        recordIssue(record, '"time.per_side" must be true exactly when laterality is unilateral');
      }
      if (typeof time.superset_friendly !== 'boolean') recordIssue(record, '"time.superset_friendly" must be true or false');
    }
    const credit = record.target_credit;
    const isStrength = !record.training_mode;
    const pts = Array.isArray(record.physique_targets) ? record.physique_targets : [];
    if (credit === undefined || credit === null) {
      if (isStrength && pts.length > 0) recordIssue(record, 'strength exercise with physique_targets needs "target_credit"');
      continue;
    }
    if (!isStrength) {
      recordIssue(record, '"target_credit" is for strength exercises; training-mode records must not carry it');
      continue;
    }
    if (typeof credit !== 'object' || Array.isArray(credit) || Object.keys(credit).length === 0) {
      recordIssue(record, '"target_credit" must be a non-empty mapping of target id to weight');
      continue;
    }
    for (const [id, weight] of Object.entries(credit)) {
      if (!creditIds.has(id)) recordIssue(record, `"target_credit" uses unknown id "${id}"`);
      if (!(typeof weight === 'number' && weight > 0 && weight <= 1)) {
        recordIssue(record, `"target_credit" weight for "${id}" must be in (0, 1], got ${JSON.stringify(weight)}`);
      }
    }
    for (const pt of pts) {
      if (!(pt in credit)) recordIssue(record, `physique target "${pt}" is missing from "target_credit"`);
    }
    const childSum = new Map();
    for (const [id, weight] of Object.entries(credit)) {
      const parent = parentOf.get(id);
      if (!parent) continue;
      if (!(parent in credit)) {
        recordIssue(record, `"target_credit" credits "${id}" but not its parent "${parent}"`);
        continue;
      }
      if (weight > credit[parent]) recordIssue(record, `"target_credit" for "${id}" exceeds its parent "${parent}"`);
      childSum.set(parent, (childSum.get(parent) || 0) + weight);
    }
    for (const [parent, sum] of childSum) {
      if (sum > credit[parent] + SHARE_TOLERANCE) {
        recordIssue(record, `"target_credit" children of "${parent}" add up to ${sum.toFixed(2)}, more than the parent's ${credit[parent]}`);
      }
    }
  }
  return issues;
}

module.exports = { validateVolume };
