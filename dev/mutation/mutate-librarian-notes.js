#!/usr/bin/env node
/* mutate-librarian-notes — prove librarian-notes.test.js can actually fail.
 *
 * The guard it protects is one whose breakage is INVISIBLE: a seat writing notes into a directory
 * nothing reads produces output identical to a seat with nothing to say, and the seat's registered
 * falsifier is scored on exactly that signal. So a silently-passing test here is worse than none.
 *
 * Each mutation reintroduces a failure that actually occurred or is one edit away. A mutation that
 * reports NOT APPLIED proves nothing -- it is reported loudly rather than counted as a pass.
 *
 * Run: node dev/mutation/mutate-librarian-notes.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TEST = path.join(REPO, 'consonance', 'tools', 'librarian-notes.test.js');
const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const BRIEF = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'LIBRARIAN.md');
const AGE = path.join(REPO, 'consonance', 'tools', 'corpus-age.js');

const MUTANTS = [
  {
    name: 'shelf stops carrying exo_memory/librarian/ (the seat must go looking for its own notes)',
    file: MAIN_RS,
    apply: (s) => s.replace('("librarian", true), ("map", false)', '("map", false)')
                   .replace('let order: [(&str, bool); 10]', 'let order: [(&str, bool); 9]'),
  },
  {
    name: 'librarian carried OLDEST-first (under budget pressure it inherits its oldest notes)',
    file: MAIN_RS,
    apply: (s) => s.replace('("librarian", true)', '("librarian", false)'),
  },
  {
    name: 'order[] arity bumped without adding the directory (a silent no-op)',
    file: MAIN_RS,
    apply: (s) => s.replace('("librarian", true), ("map", false)', '("map", false)'),
  },
  {
    name: 'brief reverts to instance-local `notes/` (the original bug, outside the repo)',
    file: BRIEF,
    apply: (s) => s.replace(
      /So: \*\*write it down in the turn it forms, or it is not real\.\*\* Notes go to\r?\n`[^`]*`/,
      'So: **write it down in the turn it forms, or it is not real.** Notes go to `notes/`'),
  },
  {
    name: 'corpus-age.js stops counting librarian/ (capacity under-reports, looking authoritative)',
    file: AGE,
    apply: (s) => s.replace("'memory', 'librarian',", "'memory',"),
  },
];

let applied = 0, caught = 0, notApplied = 0;
for (const m of MUTANTS) {
  const orig = fs.readFileSync(m.file, 'utf8');
  const mutated = m.apply(orig);
  if (mutated === orig) {
    notApplied++;
    console.log('  NOT APPLIED  ' + m.name);
    console.log('               (the anchor did not match — this mutation proves NOTHING)');
    continue;
  }
  applied++;
  fs.writeFileSync(m.file, mutated);
  const r = spawnSync(process.execPath, [TEST], { encoding: 'utf8' });
  fs.writeFileSync(m.file, orig);
  const red = r.status !== 0;
  if (red) caught++;
  console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + m.name);
  if (!red) console.log('               the test passed over a real defect — it is not guarding this');
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
