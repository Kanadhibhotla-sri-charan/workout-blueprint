const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'exercises');

// Loads every record from every data/exercises/*.yaml file.
// Throws with a clear message on malformed YAML or a non-list/non-object
// file structure, rather than letting a raw parser exception through.
function loadAllRecords() {
  const files = fs.readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => path.join(DATA_DIR, f));

  const records = [];
  const fileErrors = [];

  for (const file of files) {
    const relFile = path.relative(process.cwd(), file);
    let data;
    try {
      data = yaml.load(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      fileErrors.push(`${relFile}: malformed YAML — ${err.message}`);
      continue;
    }
    if (data === null || data === undefined) {
      // an empty file is not itself an error; just no records
      continue;
    }
    if (!Array.isArray(data)) {
      fileErrors.push(`${relFile}: expected a top-level YAML list of records, got ${typeof data}`);
      continue;
    }
    data.forEach((record, index) => {
      if (typeof record !== 'object' || record === null || Array.isArray(record)) {
        fileErrors.push(`${relFile}: record at index ${index} is not an object`);
        return;
      }
      records.push({ ...record, _file: relFile });
    });
  }

  return { records, fileErrors, files };
}

module.exports = { loadAllRecords, DATA_DIR };
