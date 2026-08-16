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

module.exports = { loadPhysiqueTargets, PROGRAMMING_DIR };
