#!/usr/bin/env node
/* mutate-lap-row - prove lap-row.test.js can actually fail.
 *
 * WHY THIS ONE MATTERS MORE THAN THE TEST COUNT. Every failure mode of this ledger is SILENT and
 * produces a BETTER-LOOKING number: a guess amended after the map raises the intersection, a broad
 * guess counted as a hit raises it, a seal that is written but never checked keeps a rewritten
 * prior in the sample. There is no crash and no red anywhere - the metric simply reads high and
 * reads clean. A suite that passes over any of these blesses exactly the ledger the tool exists to
 * prevent, so "it has tests" is not the claim; "the tests go red on these thirteen" is.
 *
 * Each mutant is one edit from the shipped design. A mutation that reports NOT APPLIED proves
 * nothing and is reported loudly rather than counted as a pass.
 *
 * CRLF: anchors are matched against an LF-normalised copy and the file's original line endings are
 * restored, because an anchor miss against a CRLF file reports exactly like a passing mutant.
 *
 * Run: node dev/mutation/mutate-lap-row.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'consonance', 'tools', 'lap-row.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'lap-row.test.js');

const MUTANTS = [
  {
    name: 'a lap accepts a SECOND map (the amendment path the whole ordering rule exists to close)',
    apply: s => s.replace("if (mine.some(r => r.stage === 'map')) {", 'if (false) {'),
  },
  {
    name: 'the seal is never written, so a rewritten guess leaves no trace',
    apply: s => s.replace('guess_seal: sealOf(openRow.guess)', 'guess_seal: null'),
  },
  {
    name: 'the seal is written but never CHECKED - a guess revised to match the map is counted',
    apply: s => s.replace("else if (map && map.guess_seal !== sealOf(guess)) integrity = 'TAMPERED';",
      "else if (false) integrity = 'TAMPERED';"),
  },
  {
    name: 'the independent ordering check is dropped (a map dated before its guess passes on the hash alone)',
    apply: s => s.replace("if (integrity === 'OK' && map && open && map.at < open.at) integrity = 'OUT-OF-ORDER';",
      "if (false) integrity = 'OUT-OF-ORDER';"),
  },
  {
    name: 'ids are minted from the lowest number, so a deleted row lets a new lap inherit a dead id',
    apply: s => s.replace('.filter(Number.isFinite).reduce((a, b) => Math.max(a, b), 0);',
      '.filter(Number.isFinite).reduce((a, b) => Math.min(a, b), 0);'),
  },
  {
    name: 'GOODHART: broad directory guesses count toward the intersection (a guess that hits everything)',
    apply: s => s.replace('const guessNarrow = guess.filter(p => !isBroad(p));', 'const guessNarrow = guess.slice();'),
  },
  {
    name: 'line suffixes stop being stripped, so a map path never intersects the same file guessed',
    apply: s => s.replace("    .replace(/:\\d+(?:-\\d+)?$/, '')\n", ''),
  },
  {
    name: 'the rate floor is removed - a percentage prints off n=1 (the 97.2% error, reproduced)',
    apply: s => s.replace('const RATE_FLOOR = 5;', 'const RATE_FLOOR = 0;'),
  },
  {
    name: 'an omitted --guess is accepted, so a forgotten flag scores as a perfect non-overlap',
    apply: s => s.replace('if (!guess.length) {', 'if (false) {'),
  },
  {
    name: 'the initiator is no longer validated, and falsifier 2 reads that field',
    apply: s => s.replace('if (!INITIATORS.has(initiator)) {', 'if (false) {'),
  },
  {
    name: 'an opened stage can be recorded before any map exists',
    apply: s => s.replace("if (!mine.some(r => r.stage === 'map')) {", 'if (false) {'),
  },
  {
    name: 'the limits stop printing beside the number (they survive only in the header, unread)',
    apply: s => s.replace("out('WHAT THIS CANNOT DISTINGUISH');", "out('');"),
  },
  {
    name: 'the redundancy reading is printed even on laps whose map saw the guess',
    apply: s => s.replace("? ' The redundancy reading is REFUSED on the rest: a map that saw the guess cannot corroborate it.'", "? ''"),
  },
];

const raw = fs.readFileSync(TOOL, 'utf8');
const CRLF = raw.includes('\r\n');
const lf = CRLF ? raw.replace(/\r\n/g, '\n') : raw;
const write = text => fs.writeFileSync(TOOL, CRLF ? text.replace(/\n/g, '\r\n') : text);

let applied = 0, caught = 0, notApplied = 0;
try {
  for (const m of MUTANTS) {
    const mutated = m.apply(lf);
    if (mutated === lf) {
      notApplied++;
      console.log('  NOT APPLIED  ' + m.name);
      console.log('               (the anchor did not match - this mutation proves NOTHING)');
      continue;
    }
    applied++;
    write(mutated);
    const r = spawnSync(process.execPath, ['--test', TEST], { encoding: 'utf8' });
    write(lf);
    const red = r.status !== 0;
    if (red) caught++;
    console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + m.name);
    if (!red) console.log('               the suite passed over a real defect - it is not guarding this');
  }
} finally {
  write(lf);                       // restored on every path, including a throw mid-run
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
