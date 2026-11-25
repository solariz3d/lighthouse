// ntfs_case_rename.js (pane C, L238): the native recipe commands' file steps for a case-only rename (coreshell.js moveRecipe: openRecipe(from), saveRecipe(to), deleteRecipe(from)),
// done with node's fs exactly as lib.rs does them (write_atomic: write <name>.tmp-write, rename onto <name>.t180recipe; delete: remove_file), in a scratch folder on this machine's disk.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-l238-ntfs-'));
const file = (n) => path.join(dir, `${n}.t180recipe`);
const writeAtomic = (p, t) => { const tmp = p.replace(/\.t180recipe$/, '.tmp-write'); fs.writeFileSync(tmp, t); fs.renameSync(tmp, p); };
writeAtomic(file('bend'), 'the numbers');
const r = fs.readFileSync(file('bend'), 'utf8');      // openRecipe('bend')
writeAtomic(file('Bend'), r);                          // saveRecipe('Bend', r): on a case-blind disk this is the same file
fs.unlinkSync(file('bend'));                           // deleteRecipe('bend'): removes that same file
const left = fs.readdirSync(dir);
console.log(`platform ${process.platform}; files left after the case-only move: ${JSON.stringify(left)}; Bend.t180recipe exists: ${fs.existsSync(file('Bend'))}`);
fs.rmSync(dir, { recursive: true });
