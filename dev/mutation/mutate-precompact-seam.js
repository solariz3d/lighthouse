/* Mutation harness for precompact-preserve.js's CONSONANCE_DATA seam.
 *
 * Pane E, 2026-08-18: this harness "never existed as a file at all — it was inline bash (its first
 * run's M2 failed to apply on a sed error; the retry killed it)". So the 2/2 figure was a real
 * measurement of a harness nobody else could re-run. That is the same defect the room keeps
 * cataloguing, applied to a mutation result rather than to a number in prose.
 *
 * Run: node dev/mutation/mutate-precompact-seam.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const P = path.join(REPO, 'consonance', 'hooks', 'precompact-preserve.js');
const T = path.join(REPO, 'consonance', 'hooks', 'precompact-preserve.test.js');
const orig = fs.readFileSync(P, 'utf8');
const run = () => { try { execFileSync(process.execPath, [T], { stdio: 'ignore' }); return 0; } catch (e) { return e.status || 1; } };

const mutants = [
  ['ignore CONSONANCE_DATA -- the pollution bug that wrote 141 test rows into production',
   (s) => s.replace('process.env.CONSONANCE_DATA || ', '')],
  ['the specific override stops winning over the data dir',
   (s) => s.replace('const LEDGER = process.env.CONSONANCE_PRECOMPACT_LOG ||',
                    'const LEDGER = false ||')],
];

console.log('baseline: exit=' + run());
let killed = 0;
for (const [name, fn] of mutants) {
  const m = fn(orig);
  if (m === orig) { console.log('  NOT APPLIED  ' + name); continue; }
  fs.writeFileSync(P, m);
  const code = run();
  if (code !== 0) killed++;
  console.log('  ' + (code !== 0 ? 'KILLED  ' : 'SURVIVED') + ' exit=' + code + '  ' + name);
  fs.writeFileSync(P, orig);
}
console.log('restored: exit=' + run());
console.log(killed + '/' + mutants.length + ' killed');
process.exit(killed === mutants.length ? 0 : 1);
