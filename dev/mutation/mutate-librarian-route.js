#!/usr/bin/env node
/* mutate-librarian-route - prove librarian-route.test.js can actually fail.
 *
 * WHY THIS ONE NEEDS A HARNESS MORE THAN MOST. The tool's failure mode is SILENT AND INVERTED: a
 * parser bug that invents a command turns an uncited figure into a cited one, and the dispatch
 * then reads cleaner than the truth. A test suite that passes over that defect is worse than no
 * suite, because the output it blesses is a shorter list of questions.
 *
 * Every mutant below is either a defect this tool ACTUALLY SHIPPED during its first run over the
 * record (marked SHIPPED) or one edit away from the design. A mutation that reports NOT APPLIED
 * proves nothing and is reported loudly rather than counted as a pass.
 *
 * CRLF: the anchors are normalised to LF before matching and the file's original line endings are
 * restored afterwards - the fourth anchor miss in a week here was a script asserting LF against a
 * CRLF file and reporting "anchor not found", which looks exactly like a passing mutant.
 *
 * Run: node dev/mutation/mutate-librarian-route.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(REPO, 'consonance', 'tools', 'librarian-route.js');
const TEST = path.join(REPO, 'consonance', 'tools', 'librarian-route.test.js');

const MUTANTS = [
  {
    name: 'SHIPPED: the count-noun vocabulary reverts to the document-tuned list ("24 preregistrations" goes invisible)',
    apply: s => s.replace('preregistrations?|registrations?|defects?|', ''),
  },
  {
    name: 'SHIPPED: any prose beginning with a binary name is a command again ("grep per file" launders two figures)',
    apply: s => s.replace('const looksLikeCommand = (cmd) => {', 'const looksLikeCommand = (cmd) => { if (cmd) return true;'),
  },
  {
    name: 'SHIPPED: the command text is truncated, manufacturing NOT-RUN verdicts that carry no information',
    apply: s => s.replace('{2,200}', '{2,25}'),
  },
  {
    name: 'SHIPPED: a compile gate cites figures again (cargo check launders the suite number)',
    apply: s => s.replace(/match: \/\\bcargo\\s\+check\\b\/i, deriving: false,/, 'match: /\\bcargo\\s+check\\b/i, deriving: true,'),
  },
  {
    name: 'grep is treated as non-deriving, so a properly cited count is flagged as uncited',
    apply: s => s.replace('{ match: /\\bgrep\\b/, deriving: true,', '{ match: /\\bgrep\\b/, deriving: false,'),
  },
  {
    name: 'the citation window widens, so a distant command launders every figure near it',
    apply: s => s.replace('const CITED_WINDOW = 1;', 'const CITED_WINDOW = 4;'),
  },
  {
    name: 'the method-claim term is dropped ("read from the source rather than from the summary" goes unasked)',
    apply: s => s.replace(/\n  \['method claim', [\s\S]*?\],\n/, '\n'),
  },
  {
    name: 'silence is removed - the tool composes a dispatch for every commit (the ferry failure, reproduced)',
    apply: s => s.replace('if (!uncited.length && !claims.length && !reds.length) {', 'if (false) {'),
  },
  {
    name: 'a NOT-RUN counts as a RED, so a command that could not execute breaks silence as though it had failed',
    apply: s => s.replace("(verdictOf(f) || {}).verdict === 'RED'", "(verdictOf(f) || {}).verdict !== 'GREEN'"),
  },
  {
    name: 'the cap stops announcing what it suppressed (silent truncation reads as "that was everything")',
    apply: s => s.replace('if (uncited.length > max) L.push(', 'if (false) L.push('),
  },
  {
    // Retargeted after measurement. The ISO-date mask was mutated first and SURVIVED: removing it
    // changes no figure on any of the seven real commit bodies, because no ISO date matches a
    // figure pattern anyway. That was a fact about the guard, not a weak test, and the assertion
    // covering it is marked vacuous in the suite. The slash-date mask is the one that does work.
    name: 'slash dates stop being masked, so "the 2026/08/23 run" reads as a ratio figure',
    apply: s => s.replace('/\\b\\d{4}\\/\\d{1,2}\\/\\d{1,2}\\b/g,', '/\\bNOTADATE\\b/g,'),
  },
  {
    name: 'a byte-identity claim stops needing a hash or a compare',
    apply: s => s.replace('if (/\\bbyte[- ](?:identical|for-byte)\\b|\\bidentical\\b/i.test(claimText) && !HASHERS.test(cmd)) {',
      'if (false && /\\bbyte[- ](?:identical|for-byte)\\b/i.test(claimText) && !HASHERS.test(cmd)) {'),
  },
];

const raw = fs.readFileSync(TOOL, 'utf8');
const CRLF = raw.includes('\r\n');
const lf = CRLF ? raw.replace(/\r\n/g, '\n') : raw;
const write = (text) => fs.writeFileSync(TOOL, CRLF ? text.replace(/\n/g, '\r\n') : text);

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
  write(lf);                       // restore on any path, including a throw mid-run
}

console.log('');
console.log('  applied ' + applied + ' · caught ' + caught + ' · NOT APPLIED ' + notApplied +
  '  (of ' + MUTANTS.length + ')');
if (notApplied) console.log('  a NOT APPLIED mutant is not a pass: the harness never reached the code.');
process.exit(caught === applied && notApplied === 0 ? 0 : 1);
