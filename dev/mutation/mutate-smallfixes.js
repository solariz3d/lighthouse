#!/usr/bin/env node
/* mutate-smallfixes - prove the D007 P2a tests can actually fail.
 *
 * TWO FIXES, ONE HARNESS, and they are here together because they are the same disease measured
 * twice: a rule stated in one place and enforced differently in another.
 *
 *   commit-gate.js  the ownership block was found by MENTION, not by HEADING, so a packet that
 *                   QUOTED the phrase in a blockquote truncated the block to nothing and the gate
 *                   refused an entire lap with holder `null`. Red 27 hours, then two more laps.
 *   js-suite.js     the header said a file declares itself "by containing the marker" while the
 *                   code required the marker on its own `//` line inside the first 40. A canary
 *                   declared exactly as the sentence permitted was read as a plain FAILED.
 *
 * WHY MUTATION AND NOT JUST GREEN TESTS. Both fixes are one line, and a one-line fix is exactly the
 * kind whose test is written to match the fix rather than to catch its absence. Neither file had a
 * mutation harness before this. The claim is not "these have tests"; it is "the tests go red on
 * these eight."
 *
 * A mutation that reports NOT APPLIED proves nothing and is reported loudly rather than counted.
 *
 * CRLF: anchors are matched against an LF-normalised copy and the original line endings restored,
 * because an anchor miss against a CRLF file reports exactly like a passing mutant.
 *
 * Run: node dev/mutation/mutate-smallfixes.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const GATE = path.join(REPO, 'consonance', 'tools', 'commit-gate.js');
const GATE_TEST = path.join(REPO, 'consonance', 'tools', 'commit-gate.test.js');
const SUITE = path.join(REPO, 'consonance', 'tools', 'js-suite.js');
const SUITE_TEST = path.join(REPO, 'consonance', 'tools', 'js-suite.test.js');

// The two suites are run differently and that is not cosmetic: commit-gate.test.js is a node:test
// file, js-suite.test.js is a plain script that exits 1. A harness that assumed one shape would
// report the other's failures as passes.
const runners = {
  [GATE]: () => spawnSync(process.execPath, ['--test', GATE_TEST], { encoding: 'utf8' }),
  [SUITE]: () => spawnSync(process.execPath, [SUITE_TEST], { encoding: 'utf8' }),
};

const MUTANTS = [
  // ── commit-gate: the anchor ──────────────────────────────────────────────────────────────────
  {
    file: GATE,
    name: 'THE OUTAGE, RESTORED: the block is found by MENTION again, so a quoted phrase truncates it',
    apply: s => s.replace('const OWN_HEADING = /^#+.*WHAT YOU OWN/i;', 'const OWN_HEADING = /WHAT YOU OWN/i;'),
  },
  {
    file: GATE,
    name: 'the LAST match is taken instead of the first (the cheaper repair, and it is wrong)',
    apply: s => s.replace('const start = lines.findIndex((l) => OWN_HEADING.test(l));',
      'const start = lines.map((l, i) => (OWN_HEADING.test(l) ? i : -1)).filter(i => i >= 0).pop() ?? -1;'),
  },
  {
    file: GATE,
    name: 'the heading anchor drops its column-zero requirement, so an indented mention wins',
    apply: s => s.replace('/^#+.*WHAT YOU OWN/i', '/#+.*WHAT YOU OWN/i'),
  },
  // ── commit-gate: the diagnostic ──────────────────────────────────────────────────────────────
  {
    file: GATE,
    name: 'the parse cause is never computed - the next seat bisects for 27 hours as L did',
    apply: s => s.replace('  let why = null;\n  if (!owned.length) {', '  let why = null;\n  if (false) {'),
  },
  {
    file: GATE,
    name: 'both parse failures produce ONE message, so no-heading and empty-block are indistinguishable',
    apply: s => s.replace('    why = start >= 0\n', '    why = false\n'),
  },
  {
    file: GATE,
    name: 'a packet that DID parse still carries a complaint (a cause that fires on success)',
    apply: s => s.replace('  if (!owned.length) {', '  if (true) {'),
  },
  {
    file: GATE,
    name: 'the fail-closed refusal drops the cause and names only the packet, as before',
    apply: s => s.replace('blind.map((b) => `${b.packet} (${b.why})`)', 'blind.map((b) => b.packet)'),
  },
  // ── js-suite: the docstring carrier ──────────────────────────────────────────────────────────
  {
    file: SUITE,
    name: 'the header window widens and the paragraph still says 40 - the carrier drifts again',
    apply: s => s.replace('const HEADER_LINES = 40;', 'const HEADER_LINES = 60;'),
  },
  {
    file: SUITE,
    name: 'EXPECTED_RED loses its line anchor, so the paragraph now describes a rule nothing enforces',
    apply: s => s.replace('const EXPECTED_RED = /^\\s*(\\/\\/|#)\\s*JS-SUITE:\\s*EXPECTED-RED/m;',
      'const EXPECTED_RED = /JS-SUITE:\\s*EXPECTED-RED/m;'),
  },
];

let applied = 0, caught = 0, notApplied = 0;
const originals = new Map();
for (const f of [GATE, SUITE]) {
  const raw = fs.readFileSync(f, 'utf8');
  originals.set(f, { raw, crlf: raw.includes('\r\n'), lf: raw.includes('\r\n') ? raw.replace(/\r\n/g, '\n') : raw });
}
const restore = f => fs.writeFileSync(f, originals.get(f).raw);
const write = (f, text) => {
  const o = originals.get(f);
  fs.writeFileSync(f, o.crlf ? text.replace(/\n/g, '\r\n') : text);
};

try {
  for (const m of MUTANTS) {
    const o = originals.get(m.file);
    const mutated = m.apply(o.lf);
    const label = path.basename(m.file).padEnd(15) + m.name;
    if (mutated === o.lf) {
      notApplied++;
      console.log('  NOT APPLIED  ' + label);
      console.log('               (the anchor did not match - this mutation proves NOTHING)');
      continue;
    }
    applied++;
    write(m.file, mutated);
    const r = runners[m.file]();
    restore(m.file);
    const red = r.status !== 0;
    if (red) caught++;
    console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + label);
    if (!red) console.log('               the suite passed over a real defect - it is not guarding this');
  }
} finally {
  for (const f of [GATE, SUITE]) restore(f);   // restored on every path, including a throw mid-run
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
