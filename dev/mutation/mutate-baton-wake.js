#!/usr/bin/env node
/* mutate-baton-wake - prove baton-wake.test.js can actually fail.
 *
 * WHY THIS ONE MATTERS MORE THAN THE TEST COUNT, and it is the same shape lap-row's runner names:
 * every failure mode of this reader is SILENT and produces a QUIETER instrument. A tool whose job
 * is to fire once, rarely, has a failure mode of never firing at all — and never firing is
 * indistinguishable from a room where no baton was ever orphaned. That is precisely the
 * absent-guard-and-passing-guard collapse the room keeps finding, aimed at the guard built to end
 * a nine-hour silence.
 *
 * THE FIRST MUTANT IS THE ONE THAT MATTERS. If counting a REFUSED call_chair as a delivery leaves
 * the suite green, this tool is blind to the exact event it was built for — the refusal at
 * 10:07:18 is the signature of a seat trying to wake a holder and being stopped by the gate.
 *
 * A mutation that reports NOT APPLIED proves nothing and is reported loudly rather than counted.
 * CRLF: anchors are matched against an LF-normalised copy and the original endings are restored,
 * because an anchor miss against a CRLF file reports exactly like a passing mutant.
 *
 * Run: node dev/mutation/mutate-baton-wake.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'consonance', 'tools', 'baton-wake.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'baton-wake.test.js');

const MUTANTS = [
  {
    name: 'a REFUSED ring counts as a delivery — the tool goes blind to its own subject',
    apply: s => s.replace("  if (/REFUSED|refused/.test(t)) return null;\n", ''),
  },
  {
    name: 'an unresolvable pane id counts as reaching the holder (unknown renders as yes)',
    apply: s => s.replace("    return 'unknown';   // unknown does not get to mean yes",
      '    return null;'),
  },
  {
    name: 'the holder check is dropped, so a seat is told about a baton it is holding itself',
    apply: s => s.replace('  if (row.holder === me) return null;', '  if (false) return null;'),
  },
  {
    name: 'the turn boundary is dropped — every seat is nagged every turn about an old row',
    apply: s => s.replace('  if (!(row.at > since)) return null;', '  if (false) return null;'),
  },
  {
    name: 'the install baseline is dropped, so the first Stop fires on five-day-old history',
    apply: s => s.replace('  if (!me || since == null) return null;', '  if (!me) return null;'),
  },
  {
    name: 'filed and voided laps still count, so a closed lap orphans a baton forever',
    apply: s => s.replace(
      "    if (rows.some((r) => r.chain === 'filed' || r.stage === 'void' || r.chain === 'void')) continue;\n", ''),
  },
  {
    name: 'the ring window loses its lower bound — a ring from any past turn counts',
    apply: s => s.replace('    if (!ts || ts < since) continue;', '    if (!ts) continue;'),
  },
  {
    name: 'the row note is dropped from the line — the CATEGORY ships and the FACT does not',
    apply: s => s.replace('    ? f.note.trim()', "    ? 'a row landed for you'"),
  },
  {
    name: 'a note-less hand-off renders as if it carried a fact',
    apply: s => s.replace(
      "    : 'THE ROW CARRIES NO NOTE — the holder would wake knowing only that it holds something';",
      "    : '';"),
  },
  {
    name: 'the ordering fix is dropped from the line, leaving a report with no repair',
    apply: s => s.replace('ring BEFORE the row. ', ''),
  },
  {
    name: 'an earlier holder row wins over the latest, so a re-take masks the hand-off after it',
    apply: s => s.replace('    const last = held[held.length - 1];', '    const last = held[0];'),
  },
  {
    name: 'the committee-pane fallback becomes null, so every pane hand-off is unattributable',
    apply: s => s.replace("  return 'panes';\n}", '  return null;\n}'),
  },
  {
    name: 'the ring window becomes after-the-row, so ring-then-row reads as a fault',
    apply: s => s.replace('    if (!ts || ts < since) continue;', '    if (!ts || ts < row.at) continue;'),
  },
  {
    name: 'the verb is keyed on the HOLDER instead of the sender (recommends a verb the seat cannot use)',
    apply: s => s.replace("const verb = verbFor(f.me);", "const verb = verbFor(f.holder);"),
  },
  {
    name: 'MAIN_SID stops resolving, so every chair delivery reads as unknown',
    apply: s => s.replace("const reserved = [[MAIN_SID, 'chair'], [LIBRARIAN_SID, 'librarian']]", "const reserved = []"),
  },
  {
    name: 'an AMBIGUOUS reserved prefix resolves to the first match instead of unknown',
    apply: s => s.replace('if (reserved.length === 1) return reserved[0][1];',
      'if (reserved.length >= 1) return reserved[0][1];'),
  },
];

const original = fs.readFileSync(TOOL, 'utf8');
const crlf = original.includes('\r\n');
const lf = crlf ? original.replace(/\r\n/g, '\n') : original;

function runTest() {
  const r = spawnSync(process.execPath, [TEST], { cwd: REPO, encoding: 'utf8' });
  return r.status === 0;
}

let caught = 0; const missed = []; const notApplied = [];
try {
  if (!runTest()) {
    console.error('BASELINE IS RED. Fix the suite before trusting any mutant below.');
    process.exit(2);
  }
  for (const m of MUTANTS) {
    const mutated = m.apply(lf);
    if (mutated === lf) { notApplied.push(m.name); continue; }
    fs.writeFileSync(TOOL, crlf ? mutated.replace(/\n/g, '\r\n') : mutated);
    if (runTest()) missed.push(m.name); else caught++;
  }
} finally {
  fs.writeFileSync(TOOL, original);
}

const applied = MUTANTS.length - notApplied.length;
console.log(`baton-wake mutation: ${caught}/${applied} caught`);
for (const n of missed) console.log('  SURVIVED  ' + n);
for (const n of notApplied) console.log('  NOT APPLIED (proves nothing) ' + n);
if (!runTest()) { console.error('RESTORE FAILED — the tool is not back to its original state.'); process.exit(3); }
process.exit(missed.length || notApplied.length ? 1 : 0);
