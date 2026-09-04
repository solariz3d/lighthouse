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

  /* ---- L033, 2026-09-02. THE RING LAP, THE LIBRARIAN SEAT, AND THE STATION GATE.
   *
   * Two of the three defects below were DESIGN GAPS rather than bugs, which is why the mutants
   * matter more than usual here: a gap leaves no red anywhere, so the only evidence that the fix is
   * guarded is that removing it goes red. Pane C's own finding on the previous lap is the standard
   * these are written to — the entire door-two prose was deletable with the suite green, because
   * the DRAWING was guarded and the RULE was not. */
  {
    name: 'RING: the third entry value is removed, so a ring lap must be recorded as a door that was not used',
    apply: s => s.replace("const ENTRIES = new Set(['orch', 'lib', 'ring']);", "const ENTRIES = new Set(['orch', 'lib']);"),
  },
  {
    name: 'RING: ring laps are folded into the not-recorded bucket (inapplicable becomes never-started)',
    apply: s => s.replace("const noDoor = valid.filter(l => l.entry === null);",
      "const noDoor = valid.filter(l => l.entry === null || l.entry === 'ring');"),
  },
  {
    name: 'RING: a ring lap is counted as door one - the exact lie the chair had to write by hand',
    apply: s => s.replace("const orchDoor = byDoor('orch'), libDoor = byDoor('lib'), ringLaps = byDoor('ring');",
      "const orchDoor = valid.filter(l => l.entry === 'orch' || l.entry === 'ring'), libDoor = byDoor('lib'), ringLaps = byDoor('ring');"),
  },
  {
    name: 'RING: the inapplicable-not-zero reading stops printing, so an empty guess reads as a missed seal again',
    apply: s => s.replace('  if (ringLaps.length) {\n', '  if (false) {\n'),
  },
  {
    name: 'RING: a ring lap resets the direct-entry run, silently un-firing a registered falsifier',
    apply: s => s.replace("      if (l.entry !== 'lib') continue;", "      if (l.entry !== 'lib') { run = 0; continue; }"),
  },
  {
    name: 'INITIATOR: librarian is dropped again, so a lap the librarian started must be filed under another seat',
    apply: s => s.replace("const INITIATORS = new Set(['human', 'chair', 'pane', 'librarian']);",
      "const INITIATORS = new Set(['human', 'chair', 'pane']);"),
  },
  {
    name: 'HOLDER: the station gate is removed, and a pane name goes back into the baton',
    apply: s => s.replace('  if (!STATIONS.has(h)) {', '  if (false) {'),
  },
  {
    name: 'HOLDER: the station gate is HOISTED above the lap-existence check (breaks a suite this file does not own)',
    apply: s => {
      const a = s.indexOf('  if (!STATIONS.has(h)) {');
      if (a < 0) return s;
      const end = s.indexOf('\n  }\n', a) + '\n  }\n'.length;
      const gate = s.slice(a, end);
      const without = s.slice(0, a) + s.slice(end);
      const anchor = "  const all = rows();\n  if (!all.some(r => r.lap === lap)) {";
      const i = without.indexOf(anchor);
      return i < 0 ? s : without.slice(0, i) + gate + without.slice(i);
    },
  },
  {
    name: 'HOLDER: --to stops being validated, and the field it exists to replace becomes free text',
    apply: s => s.replace("    const bad = toList.filter(x => !/^[A-Z]$/.test(x));", '    const bad = [];'),
  },
  {
    name: 'HOLDER: --to is accepted beside any station, re-opening the overload one field over',
    apply: s => s.replace("    if (h !== 'panes') {", '    if (false) {'),
  },
  {
    /* THE WRONG REPAIR, made executable. When the drift was found, a READER was taught to skip
     * non-station holders; the aura packet said widening the readers would bless the fan-out error.
     * This mutant is that repair applied one level deeper — the READ filtering history out — which
     * would make the four drifted rows vanish rather than stay countable. Append-only means the
     * rows are refused going FORWARD and untouched going back; without this mutant the test
     * asserting exactly that is green at HEAD and green here, and proves nothing. */
    name: 'APPEND-ONLY: the reader silently drops history whose holder the new gate would refuse',
    apply: s => s.replace(
      "    .map(l => { try { return JSON.parse(l); } catch { return null; } })\n    .filter(Boolean);",
      "    .map(l => { try { return JSON.parse(l); } catch { return null; } })\n" +
      "    .filter(Boolean).filter(r => r.stage !== 'chain' || STATIONS.has(r.holder));"),
  },

  /* ── THE BATON-ORDER GATE (2026-09-04) ────────────────────────────────────────────────────────
   *
   * The gate's failure modes split two ways and BOTH are silent. Too loose: it writes the row that
   * disarms the writer, exactly as the tool did for the seven refusals of 2026-09-03/04. Too tight:
   * it refuses a hand-off that WAS announced, which is worse than no gate, because a gate that
   * fires on correct behaviour teaches seats to route around it — the defect `baton-wake.js` v1
   * shipped and no test of mine caught. So the mutants below run in both directions: some make it
   * permit a bare hand-off, some make it refuse a rung one. */
  {
    name: 'GATE OFF: an un-rung hand-off is written, and the writer disarms itself (the 09-03/04 defect, restored)',
    apply: s => s.replace("  if (g.verdict === 'refuse') {", '  if (false) {'),
  },
  {
    name: 'a baton move with no --by is written unchecked (omission becomes the bypass)',
    apply: s => s.replace("  if (!by) return { verdict: 'no-by' };", "  if (!by) return { verdict: 'unarmed' };"),
  },
  {
    /* THE MUTANT THAT SURVIVED THE FIRST RUN, kept pointing the other way. The original was
     * "a REFUSED ring counts as a delivery"; deleting the keyword guard changed nothing, because
     * the anchored shapes already exclude every refusal — so the guard was a comment, and one that
     * DISCARDED 2 of 376 real deliveries whose preview quoted a failure. It was removed rather than
     * given a test. This mutant restores it, and the suite must now go red on its RETURN. */
    name: 'the keyword guard comes back, discarding real deliveries whose preview quotes a failure',
    apply: s => s.replace('  if (/^call_chair -> Main \\[NotAttempted\\]',
      '  if (/REFUSED|FAILED/.test(t)) return null;\n  if (/^call_chair -> Main \\[NotAttempted\\]'),
  },
  {
    name: 'an injection that was NEVER ATTEMPTED counts as a delivery',
    apply: s => s.replace("^call_librarian \\S+ -> LIB \\[NotAttempted\\]/.test(t)) return null;",
      '^call_librarian \\S+ -> LIB \\[NotAttempted-never\\]/.test(t)) return null;'),
  },
  {
    name: 'the possession WINDOW is dropped: a ring from any time in history satisfies the gate',
    apply: s => s.replace('.filter((d) => d && Number(d.ts) >= windowStart)', '.filter((d) => d)'),
  },
  {
    name: 'a ring to ANYONE satisfies the gate, not a ring to the incoming holder',
    apply: s => s.replace("inWindow.some((d) => d.station === holder)", 'inWindow.some((d) => d.station != null)'),
  },
  {
    name: 'the FIRST chain row of a lap is exempted (the D006 03:35 row sails through)',
    apply: s => s.replace('  if (prevHolder != null && holder === prevHolder) return { verdict: \'unchanged\' };',
      '  if (prevHolder == null || holder === prevHolder) return { verdict: \'unchanged\' };'),
  },
  {
    name: 'a RE-TAKE is no longer exempt - the no-wedge property mcp.rs rests on is broken',
    apply: s => s.replace("  if (by === holder) return { verdict: 'retake' };", '  if (false) return { verdict: \'retake\' };'),
  },
  {
    name: 'an ambiguous sid prefix resolves to whichever seat was tested first, silently',
    apply: s => s.replace('if (reserved.length === 1) return reserved[0][1];', 'if (reserved.length >= 1) return reserved[0][1];'),
  },
  {
    name: 'an UNRESOLVED delivery stops allowing - the gate refuses on ambiguity it cannot settle',
    apply: s => s.replace("if (inWindow.some((d) => d.station === 'unknown')) return { verdict: 'rung-unknown' };",
      "if (false) return { verdict: 'rung-unknown' };"),
  },
  {
    name: 'a blind window no longer disarms it, so muted rings read as no ring at all',
    apply: s => s.replace('  else if (fs.existsSync(blindPath()))', '  else if (false)'),
  },
  {
    name: 'the gate arms off DATA_DIR instead of the ledger\'s own directory (a fixture inherits the live board)',
    apply: s => s.replace("path.join(path.dirname(LEDGER), 'board.jsonl')", "path.join(DATA_DIR, 'board.jsonl')"),
  },
  {
    name: 'an unchecked hand-off no longer SAYS it was unchecked (absent guard reads as passing guard)',
    apply: s => s.replace("      if (r.gate === 'unarmed') {", '      if (false) {'),
  },
  {
    name: '--by accepts any string, so a pane name lands in the field the station gate exists to keep clean',
    apply: s => s.replace('  if (b && !STATIONS.has(b)) {', '  if (false) {'),
  },
  {
    name: 'the verdict is not recorded on the row, so the gate\'s own bypasses stop being countable',
    apply: s => s.replace("    by: b, gate: g.verdict === 'unchanged' ? null : g.verdict,", '    by: b,'),
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
