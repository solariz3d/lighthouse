#!/usr/bin/env node
/* mutate-shelf-tier — prove shelf-tier.test.js can fail.
 *
 * This guard decides what the librarian holds. Getting it wrong in the carrying direction costs
 * the seat 640k tokens of working room; getting it wrong in the dropping direction makes the
 * record unreachable, which is worse. Every mutation below is a plausible future edit, not a
 * synthetic break.
 *
 * Anchors are normalised to LF before matching — the fifth CRLF miss this week was enough.
 *
 * Run: node dev/mutation/mutate-shelf-tier.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const TEST = path.join(REPO, 'consonance', 'tools', 'shelf-tier.test.js');

const MUTANTS = [
  { name: 'journal/ goes back to being CARRIED (the 640k regression)',
    from: '("map", false, false), ("journal", true, false), ("loop", true, false),',
    to:   '("map", false, false), ("journal", true, true), ("loop", true, false),' },

  { name: 'loop/ goes back to being CARRIED',
    from: '("journal", true, false), ("loop", true, false),',
    to:   '("journal", true, false), ("loop", true, true),' },

  { name: 'the record is DROPPED instead of indexed (unreachable, not merely uncarried)',
    from: '        ("map", false, false), ("journal", true, false), ("loop", true, false),\n',
    to:   '' },

  { name: "the seat's own notes get indexed — it wakes without its ledger",
    from: '("memory", false, true), ("librarian", true, true), ("spread", false, true),',
    to:   '("memory", false, true), ("librarian", true, false), ("spread", false, true),' },

  { name: 'cards get indexed — the instruments stop being carried',
    from: '("", false, true), ("cards", false, true), ("record", false, true),',
    to:   '("", false, true), ("cards", false, false), ("record", false, true),' },

  { name: 'the budget becomes the only gate, so the split lapses when the corpus shrinks',
    from: 'if carry && spent + body.len() <= budget {',
    to:   'if spent + body.len() <= budget {' },

  { name: 'the header blames the budget again for a deliberate tier',
    from: 's.push_str("Dated record, indexed on purpose. A citation you opened is checkable; a summary\\n");',
    to:   's.push_str("The budget ran out before these. A citation you opened is checkable; a summary\\n");' },
];

const raw = fs.readFileSync(RS, 'utf8');
const wasCRLF = raw.includes('\r\n');
const norm = raw.split('\r\n').join('\n');
const restore = (s) => (wasCRLF ? s.split('\n').join('\r\n') : s);

let applied = 0, caught = 0, notApplied = 0;
for (const m of MUTANTS) {
  if (!norm.includes(m.from)) {
    notApplied++;
    console.log('  NOT APPLIED  ' + m.name);
    console.log('               (anchor did not match — this mutation proves NOTHING)');
    continue;
  }
  applied++;
  fs.writeFileSync(RS, restore(norm.replace(m.from, m.to)));
  const r = spawnSync(process.execPath, [TEST], { encoding: 'utf8' });
  fs.writeFileSync(RS, raw);
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
