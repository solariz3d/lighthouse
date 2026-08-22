/* Registered mutation for state-block.js's CARDS section (added 2026-08-22, the retrieval fix).
 *
 * Every mutant below is a plausible way this section could rot back into the thing it replaces:
 * a bare index instead of a hook, a silently partial list, a summary that stops pointing at the
 * master, a parse failure that vanishes. A test suite that cannot kill these is decoration.
 *
 * Mutates the REAL file, runs the REAL suite, restores unconditionally, and verifies the restore
 * is byte-identical before reporting a score.
 *
 * Run: node dev/mutation/mutate-cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const SRC = path.join(REPO, 'consonance', 'tools', 'state-block.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'state-block.test.js');
const orig = fs.readFileSync(SRC, 'utf8');

const strip = (t) => t.replace(/\x1b\[[0-9;]*m/g, '');
function suite() {
  try {
    execFileSync(process.execPath, [TEST], { encoding: 'utf8', cwd: path.dirname(TEST) });
    return { code: 0, out: '' };
  } catch (e) { return { code: e.status === undefined ? 1 : e.status, out: strip((e.stdout || '') + (e.stderr || '')) }; }
}
const named = (r) => [...new Set([...r.out.matchAll(/[✖x] (.+?)(?: \[|\n|$)/g)].map((m) => m[1].trim()))]
  .filter((n) => n && !n.startsWith('failing tests')).slice(0, 3);

const MUTANTS = [
  ['bare index: drop the description, keep the name',
    (s) => s.replace(
      "lines.push('  ' + name + ' -- ' + (desc.length > 78 ? desc.slice(0, 75) + '...' : desc));",
      "lines.push('  ' + name);")],

  ['silently partial: list only the first three cards',
    (s) => s.replace('for (const f of files.sort()) {', 'for (const f of files.sort().slice(0, 3)) {')],

  ['stop pointing at the master: drop the pointer sentence',
    (s) => s.replace(
      "const lines = [files.length + ' cards -- the forward-pointed layer. Open the master, never this summary:'];",
      "const lines = [files.length + ' cards:'];")],

  ['silent parse failure: stop counting unreadable descriptions',
    (s) => s.replace(
      "if (!desc) { unreadable++; lines.push('  ' + name + ' -- (no description parsed)'); continue; }",
      "if (!desc) { continue; }")],

  ['unwire it: remove the section from the block entirely',
    (s) => s.replace('instrumentSection(), cardSection(), nameSection()', 'instrumentSection(), nameSection()')],
];

const base = suite();
console.log('baseline: exit=' + base.code + (base.code === 0 ? ' (green)' : ' RED — fix before mutating'));
if (base.code !== 0) { console.log(base.out.slice(-800)); process.exit(1); }

let killed = 0, applied = 0;
for (const [name, fn] of MUTANTS) {
  const mutated = fn(orig);
  if (mutated === orig) { console.log('NOT APPLIED  ' + name + '   <-- anchor drifted; this mutant proves nothing'); continue; }
  applied++;
  fs.writeFileSync(SRC, mutated);
  const r = suite();
  fs.writeFileSync(SRC, orig);
  const identical = fs.readFileSync(SRC, 'utf8') === orig;
  if (r.code !== 0) killed++;
  console.log((r.code !== 0 ? 'KILLED   ' : 'SURVIVED ') + name);
  if (r.code !== 0) console.log('           red: ' + named(r).join(' | '));
  if (!identical) console.log('           !! RESTORE NOT BYTE-IDENTICAL');
}

fs.writeFileSync(SRC, orig);
console.log('\nrestored byte-identical: ' + (fs.readFileSync(SRC, 'utf8') === orig));
console.log('mutation score: ' + killed + '/' + applied + (applied === MUTANTS.length ? '' : '  (of ' + MUTANTS.length + ' written)'));
process.exit(killed === applied && applied === MUTANTS.length ? 0 : 1);
