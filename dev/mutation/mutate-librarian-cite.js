#!/usr/bin/env node
/* mutate-librarian-cite — prove librarian-cite.test.js can actually fail.
 *
 * The guard it protects is one whose breakage has NO NATURAL ERROR. A stale `path:line` still
 * opens the file, still returns a line, and hands a pane something the librarian never cited. It
 * reads as authoritative, which is worse than an absent citation. A silently-passing test here
 * would be worse than no test, because it would license the tool's output.
 *
 * Each mutant reintroduces a failure that is real: two of them (M4, M8) are defects this file's
 * own test suite caught during the build and are kept here so they cannot come back.
 *
 * A mutant that reports NOT APPLIED proves NOTHING — the harness never reached the code — and is
 * reported loudly rather than counted as a pass.
 *
 * CRLF: anchors are matched against an LF-normalised copy and the file's original ending is
 * restored afterwards. Five anchor misses in this repo in one week were encoding, not logic.
 *
 * Run: node dev/mutation/mutate-librarian-cite.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'consonance', 'tools', 'librarian-cite.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'librarian-cite.test.js');

const MUTANTS = [
  {
    name: 'M1 trust the integer — skip the baseline comparison and emit whatever is at line N',
    why: 'the whole defect: the file opens, a line comes back, and it is the wrong line',
    apply: (s) => s.replace(
      'if (cite.line <= curLines.length && curLines[cite.line - 1] === anchor) {',
      'if (cite.line <= curLines.length) {'),
  },
  {
    name: 'M2 carry the first candidate when the cited text now appears at several lines',
    why: 'a coin flip presented as a citation, with no way for the reader to tell which half',
    apply: (s) => s.replace('if (at.length === 1) {', 'if (at.length >= 1) {'),
  },
  {
    name: 'M3 carry a GONE citation anyway, quoting whatever now sits at the old number',
    why: 'the stale-cite case the brief called load-bearing',
    apply: (s) => s.replace(
      "return { ...cite, repoPath, carry: false, status: 'GONE', sha,\n" +
      "    detail: 'the cited text is nowhere in the file now' };",
      "return { ...cite, repoPath, carry: true, status: 'GONE', sha, at: cite.line,\n" +
      "    text: curLines[cite.line - 1] || '',\n" +
      "    detail: 'the cited text is nowhere in the file now' };"),
  },
  {
    name: 'M4 resolve a bare basename by exact root match (the bug the suite caught in build)',
    why: 'README.md:23 in the seat\'s replies means the hooks README; the root one would win',
    apply: (s) => s.replace('if (norm.includes(\'/\')) {', 'if (true) {'),
  },
  {
    name: 'M5 label an uncommitted citation VERIFIED instead of FRESH',
    why: 'claims a drift check that never ran, in the status a reader trusts most',
    apply: (s) => s.replace("carry: true, status: 'FRESH', at: cite.line,",
      "carry: true, status: 'VERIFIED', at: cite.line,"),
  },
  {
    name: 'M6 push every resolution into carried, so refusals are emitted as citations',
    why: 'the refusal list is the tool; without it this is just a grep with extra steps',
    apply: (s) => s.replace('(r.carry ? carried : refused).push(r);', 'carried.push(r);'),
  },
  {
    name: 'M7 print the header even when nothing matched (volume kills a channel)',
    why: 'brief/LIBRARIAN.md:89-95 — a channel that fires every turn is one people learn to skip',
    apply: (s) => s.replace('if (!res.carried.length && !res.refused.length) {',
      'if (false && !res.carried.length && !res.refused.length) {'),
  },
  {
    name: 'M8 keep the FIRST citation of an address in a note instead of the newest',
    why: 'reports drift against a stale baseline for an address the seat re-cited correctly',
    apply: (s) => s.replace(
      "for (const c of cites) winners.set(c.cited + ':' + c.line + '-' + c.endLine, c);",
      "for (const c of cites) { const k = c.cited + ':' + c.line + '-' + c.endLine;\n" +
      "        if (!winners.has(k)) winners.set(k, c); }"),
  },
  {
    name: 'M9 treat a baseline line number past EOF as an ordinary miss',
    why: 'a citation that was ALREADY wrong when written is a different finding from a shrunk file',
    apply: (s) => s.replace(
      "  if (cite.line > oldLines.length) {\n" +
      "    return { ...cite, repoPath, carry: false, status: 'BASELINE-EOF', sha,",
      "  if (false && cite.line > oldLines.length) {\n" +
      "    return { ...cite, repoPath, carry: false, status: 'BASELINE-EOF', sha,"),
  },
];

// --- CRLF-safe apply/restore -------------------------------------------------------------------
const original = fs.readFileSync(TOOL, 'utf8');
const wasCRLF = /\r\n/.test(original);
const lf = original.replace(/\r\n/g, '\n');
const restore = () => fs.writeFileSync(TOOL, original);
const writeMutant = (body) => fs.writeFileSync(TOOL, wasCRLF ? body.replace(/\n/g, '\r\n') : body);

let applied = 0, caught = 0, notApplied = 0;
for (const m of MUTANTS) {
  const mutated = m.apply(lf);
  if (mutated === lf) {
    notApplied++;
    console.log('  NOT APPLIED  ' + m.name);
    console.log('               the anchor did not match — this mutation proves NOTHING');
    continue;
  }
  applied++;
  writeMutant(mutated);
  const r = spawnSync(process.execPath, ['--test', TEST], { encoding: 'utf8', cwd: REPO });
  restore();
  const red = r.status !== 0;
  if (red) caught++;
  console.log('  ' + (red ? 'CAUGHT      ' : 'SURVIVED    ') + m.name);
  if (!red) console.log('               the suite passed over a real defect — it is not guarding this');
}
restore();

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
if (fs.readFileSync(TOOL, 'utf8') !== original) {
  console.log('  FATAL: the tool was not restored to its original bytes.');
  process.exit(2);
}
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
