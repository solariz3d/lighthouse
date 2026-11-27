// harnesscount.js (pane B, L258): applied / caught / NOT APPLIED per mutation harness, read from a node --test TAP file. Node's TAP gives a passing row no file,
// so each harness's mutants are found by their own ids, read from the harness's source (`id: '…'`, full text, unique across harnesses), as rows named
// "mutant <id>…" or "mutation <id>…". ok = applied and caught; not ok whose block says NOT APPLIED = not applied; any other not ok = applied, not caught.
// Its CONTROL rows are those named as in its source (test('CONTROL…')). An id with no row in the TAP is "not run". usage: node harnesscount.js <tree> <file.tap> <harness path>...
'use strict';
const fs = require('fs'), path = require('path');
const [tree, file, ...harnesses] = process.argv.slice(2);
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const rows = [];
for (let i = 0; i < lines.length; i++) {
  const m = /^(not ok|ok) (\d+) - (.*)$/.exec(lines[i]);
  if (!m) continue;
  const block = [];
  for (let j = i + 1; j < lines.length && !/^(not )?ok \d+ - /.test(lines[j]) && !/^# Subtest/.test(lines[j]); j++) block.push(lines[j]);
  rows.push({ ok: m[1] === 'ok', name: m[3], text: block.join('\n') });
}
const unq = (s) => s.replace(/\\(.)/g, '$1');
let tot = { mutants: 0, applied: 0, caught: 0, notApplied: 0, notCaught: 0, notRun: 0 };
for (const h of harnesses) {
  const src = fs.readFileSync(path.join(tree, h), 'utf8');
  const ids = [...src.matchAll(/^\s*\{ id: (?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/gm)].map((m) => unq(m[1] !== undefined ? m[1] : m[2]));
  const controls = [...src.matchAll(/test\((?:'|`)(CONTROL[^'`]*)/g)].map((m) => unq(m[1]).replace(/\$\{[^}]*\}.*$/, ''));
  const b = { mutants: ids.length, caught: 0, notApplied: [], notCaught: [], notRun: [] };
  for (const id of ids) {
    const r = rows.find((x) => x.name.startsWith(`mutant ${id}`) || x.name.startsWith(`mutation ${id}`));
    const short = id.split(' ')[0];
    if (!r) b.notRun.push(short); else if (r.ok) b.caught++; else if (/NOT APPLIED/.test(r.text)) b.notApplied.push(short); else b.notCaught.push(short);
  }
  const ctl = controls.map((c) => { const r = rows.find((x) => x.name.startsWith(c)); return r ? (r.ok ? 'ok' : 'FAIL') : 'not found'; });
  const applied = b.mutants - b.notApplied.length - b.notRun.length;
  tot = { mutants: tot.mutants + b.mutants, applied: tot.applied + applied, caught: tot.caught + b.caught, notApplied: tot.notApplied + b.notApplied.length, notCaught: tot.notCaught + b.notCaught.length, notRun: tot.notRun + b.notRun.length };
  console.log(`${path.basename(h)}: ${b.mutants} mutants: applied ${applied} / caught ${b.caught} / NOT APPLIED ${b.notApplied.length}${b.notApplied.length ? ' (' + b.notApplied.join(' ') + ')' : ''}; not caught ${b.notCaught.length}${b.notCaught.length ? ' (' + b.notCaught.join(' ') + ')' : ''}${b.notRun.length ? `; not run ${b.notRun.length} (${b.notRun.join(' ')})` : ''}; control ${ctl.join(',') || 'none in source'}`);
}
console.log(`all: ${tot.mutants} mutants: applied ${tot.applied} / caught ${tot.caught} / NOT APPLIED ${tot.notApplied}; not caught ${tot.notCaught}; not run ${tot.notRun}`);
