'use strict';
// gc_chunk.js <worktree> <from> <to> [--control]: runs mutants [from, to) of <worktree>/dev/mutation/mutate-gen-consumer.js, unchanged
// except for three things, all in a copy written beside this script: REPO points at <worktree> (the harness finds it from its own
// folder), the loop runs MUTANTS.slice(from, to), and each test run is started with windowsHide. Why chunks: the harness runs 26
// mutants at about 145 s each and takes no lock; run whole under one slot it parks an exclusive hold for an hour (on 11-27 it held
// A's past 10 of A's 30 minutes, and was stopped). Each chunk takes its own hold, so a hold waits at most one chunk.
// It refuses to start unless the generator's bytes are the green file's (sha256 below), so no chunk runs on a mutant a stopped chunk left.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const [W0, A, B] = process.argv.slice(2), W = path.resolve(W0), from = Number(A), to = Number(B);
const GREEN = '7f698288f31fa19d11cb98a8a06a9fb6105d7c5c0352772a6079610f8dff7013';
const GC = path.join(W, 'consonance/tools/gen-consumer.js'), HARNESS = path.join(W, 'dev/mutation/mutate-gen-consumer.js');
require(path.join(W, 'consonance/tools/heavy-run.js')).hold({ cmd: 'C D678 N6: mutate-gen-consumer.js mutants ' + from + '-' + (to - 1) });
const sha = crypto.createHash('sha256').update(fs.readFileSync(GC)).digest('hex');
if (sha !== GREEN) { console.log('REFUSED: gen-consumer.js is not the green file (sha ' + sha.slice(0, 12) + '); restore it first'); process.exit(4); }
if (process.argv.includes('--control')) {
  const c = spawnSync(process.execPath, [path.join(W, 'consonance/tools/gen-consumer.test.js')], { encoding: 'utf8', windowsHide: true, cwd: W });
  console.log('CONTROL unmutated: exit ' + c.status);
  if (c.status !== 0) process.exit(2);
}
let src = fs.readFileSync(HARNESS, 'utf8');
const swaps = [
  ["const REPO = path.resolve(__dirname, '..', '..');", 'const REPO = ' + JSON.stringify(W) + ';'],
  ['for (const m of MUTANTS) {', 'for (const m of MUTANTS.slice(' + from + ', ' + to + ')) {'],
  ["spawnSync(process.execPath, [TEST], { encoding: 'utf8' })", "spawnSync(process.execPath, [TEST], { encoding: 'utf8', windowsHide: true })"],
  ["'  (of ' + MUTANTS.length + ')'", "'  (mutants " + from + '-' + (to - 1) + " of ' + MUTANTS.length + ')'"],
];
for (const [a, b] of swaps) {
  if (src.split(a).length !== 2) { console.log('REFUSED: the harness changed; anchor not found once: ' + a); process.exit(5); }
  src = src.replace(a, b);
}
const copy = path.join(__dirname, 'mutate-gen-consumer.chunk.js');
fs.writeFileSync(copy, src);
const r = spawnSync(process.execPath, [copy], { stdio: 'inherit', windowsHide: true, cwd: W });
const after = crypto.createHash('sha256').update(fs.readFileSync(GC)).digest('hex');
console.log('chunk ' + from + '-' + (to - 1) + ': harness exit ' + r.status + '; generator is the green file after: ' + (after === GREEN));
process.exit(r.status === null ? 1 : r.status);
