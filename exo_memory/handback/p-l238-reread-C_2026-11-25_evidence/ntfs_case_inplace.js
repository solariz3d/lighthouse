// ntfs_case_inplace.js (pane C, L238 re-read): db20182d's case-only rename of a recipe, saveRecipe(to) with NO delete, done as lib.rs does it
// (write_atomic: write <name>.tmp-write, rename onto <name>.t180recipe), in a scratch folder on this machine's disk; then read back under both spellings.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-l238-inplace-'));
const file = (n) => path.join(dir, `${n}.t180recipe`);
const writeAtomic = (p, t) => { const tmp = p.replace(/\.t180recipe$/, '.tmp-write'); fs.writeFileSync(tmp, t); fs.renameSync(tmp, p); };
writeAtomic(file('bend'), 'old hash');
writeAtomic(file('Bend'), 'new hash');                 // saveRecipe('Bend', rewritten): over the same file on a case-blind disk
console.log(`platform ${process.platform}; files: ${JSON.stringify(fs.readdirSync(dir))}; read as Bend: ${JSON.stringify(fs.readFileSync(file('Bend'), 'utf8'))}; read as bend: ${JSON.stringify(fs.readFileSync(file('bend'), 'utf8'))}`);
fs.rmSync(dir, { recursive: true });
