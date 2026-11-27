// harcount678b.js (pane B): mutants in a harness TAP attributed to their harness file by the mutant's id text found in the file's source (backslashes
// dropped). Prints applied / caught / NOT APPLIED / NOT CAUGHT per harness; an id found in no file or in two is printed. usage: node harcount678b.js <tap> <files list> <root>
'use strict';
const fs = require('fs'), path = require('path');
const [tap, list, root] = process.argv.slice(2);
const files = fs.readFileSync(list, 'utf8').split(/\r?\n/).filter(Boolean);
const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(root, f), 'utf8').split(String.fromCharCode(92)).join('')]));
const lines = fs.readFileSync(tap, 'utf8').replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
const tests = []; let cur = null;
for (const l of lines) {
  const m = l.match(/^(not ok|ok) \d+ - (.*)$/); if (m) { cur = { ok: m[1] === 'ok', name: m[2], err: '' }; tests.push(cur); continue; }
  if (cur && !cur.err) { const e = l.match(/(NOT APPLIED|NOT CAUGHT)/); if (e) cur.err = e[1]; }
}
const by = Object.fromEntries(files.map((f) => [f, { applied: 0, caught: 0, notApplied: 0, notCaught: 0 }])); let lost = 0;
for (const t of tests) {
  const mm = t.name.match(/^mut(?:ation|ant) (.*?): applied, and caught/); if (!mm) continue;
  const id = mm[1], where = files.filter((f) => src[f].includes(id));
  if (where.length !== 1) { console.log(`id in ${where.length} files: ${id.slice(0, 80)}`); lost++; continue; }
  const o = by[where[0]];
  if (t.ok) { o.applied++; o.caught++; } else if (t.err === 'NOT APPLIED') o.notApplied++; else if (t.err === 'NOT CAUGHT') { o.applied++; o.notCaught++; } else { o.applied++; console.log(`failed otherwise: ${t.name.slice(0, 80)}`); }
}
const others = tests.filter((t) => !/^mut(?:ation|ant) /.test(t.name));
let A = 0, C = 0, N = 0, U = 0;
for (const [f, o] of Object.entries(by)) { console.log(`${f}: applied ${o.applied} / caught ${o.caught} / NOT APPLIED ${o.notApplied}${o.notCaught ? ` / NOT CAUGHT ${o.notCaught}` : ''}`); A += o.applied; C += o.caught; N += o.notApplied; U += o.notCaught; }
console.log(`ALL: applied ${A} / caught ${C} / NOT APPLIED ${N} / NOT CAUGHT ${U}; unattributed ${lost}; other tests (controls, stand-ins, guards) ${others.length}, failed ${others.filter((t) => !t.ok).length}`);
