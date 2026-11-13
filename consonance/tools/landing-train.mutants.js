#!/usr/bin/env node
'use strict';
// landing-train.mutants.js (B, L194): can landing-train.test.js tell a broken train from a working one? Each mutant breaks ONE thing the plan's rows
// exist for, in a COPY of the source in a temporary tree (the live file is never edited, so a killed harness leaves nothing behind); the copy's suite
// runs; the tree is removed. Every anchor must occur EXACTLY ONCE or the row is NOT APPLIED (counted as such, never as a catch). The rows were
// written after the code (L194's hand-back says so), so this harness is how each was seen red.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const SRC = 'landing-train.js', SUITE = 'landing-train.test.js', CHECK = 'landing-train-dz3-check.cmd';

const MUTANTS = [
  ['red batch: the plain "drop the newest" (it is named red at once, never retried), so an innocent newest is lost', SRC,
    "      batch = merged.slice(0, -1);\n",
    "      result.named.push({ row: newest, reason: 'red (newest)', failing: c.failing }); ready = without(ready, [newest]); writeReady(data, ready);\n      batch = merged.slice(0, -1);\n"],
  ['red alone: a branch red on its own stays READY (never named, never leaves)', SRC,
    "        ready = without(ready, merged); writeReady(data, ready);\n        appendLog(data, { event: 'red', row: merged[0], failing: c.failing });",
    "        appendLog(data, { event: 'red', row: merged[0], failing: c.failing });"],
  ['conflict: the conflicting file is not named', SRC,
    "conflicts.push({ row, files: files.length ? files : [", "conflicts.push({ row, files: ['?'] || ["],
  ['conflict: the merge is not aborted (a half-merge is left for the next branch)', SRC,
    "    git(cfg.worktree, ['merge', '--abort']);\n    conflicts.push(", "    conflicts.push("],
  ['promotion: the game guard is not asked (copies over a running game)', SRC,
    "    if (g.code !== 0) break;\n", "    break;\n"],
  ['promotion: the copy is not checked byte for byte (mismatches are never reported)', SRC,
    "  const mismatched = staged.files.filter((f) => digest(path.join(cfg.repo, f.rel)) !== f.sha256).map((f) => f.rel);",
    "  const mismatched = []; fs.writeFileSync(path.join(cfg.repo, staged.files[0].rel), 'torn');"],
  ['promotion: copies from the worktree, not the staged build (the next batch\'s unchecked build reaches his checkout)', SRC,
    "    fs.copyFileSync(path.join(dir, f.rel), path.join(cfg.repo, f.rel));",
    "    fs.copyFileSync(path.join(cfg.worktree, f.rel), path.join(cfg.repo, f.rel));"],
  ['promotion: a staged build is promoted after main moved past it (a stale exe under a fresh stamp)', SRC,
    "  if (head !== staged.sha) {", "  if (false) {"],
  ['failingRows: dreamzone-3\'s CHECK_NEAR / CHECK_EQ lines are not named', SRC, "CHECK(_[A-Z]+)? failed", "CHECK failed"],
  ['board line: the branches sent back are left out', SRC,
    "  for (const n of r.named) parts.push(`sent back", "  for (const n of []) parts.push(`sent back"],
  ['killed train: the READY list is written before the batch is checked', SRC,
    "      const { merged, conflicts } = mergeBatch(cfg, baseSha, batch);\n",
    "      writeReady(data, without(ready, batch));\n      const { merged, conflicts } = mergeBatch(cfg, baseSha, batch);\n"],
  ['killed train: main is fast-forwarded before the check', SRC,
    "      result.attempts++;\n", "      result.attempts++; git(cfg.repo, ['merge', '--ff-only', '-q', sha(cfg.worktree, 'HEAD')]);\n"],
  ['scan: fails OPEN (the hook\'s allow-error and not-a-push pass)', SRC,
    "return { ok: d.decision === 'allow', ...d };", "return { ok: d.decision !== 'deny', ...d };"],
  ['scan: a refusal is ignored', SRC, "  if (!scan.ok) { result.stopped = `the scan refused", "  if (false) { result.stopped = `the scan refused"],
  ['scan: the decision is not written to the push-gate ledger', SRC,
    "  recordGate(data, { cwd: cfg.repo, decision: scan.decision, by: 'landing-train', sha: trainSha,", "  void ({ cwd: cfg.repo, decision: scan.decision, by: 'landing-train', sha: trainSha,"],
  ['push: never made, and only the ls-remote check after it can notice', SRC, "  const push = git(cfg.repo, ['push', '-q', remote, `${trainSha}:refs/heads/${base}`]);", "  const push = { code: 0, out: '', err: '' };"],
  ['push: the remote is not read back (a push that did not land reads as pushed)', SRC,
    "  result.pushed = push.code === 0 && remoteSha === trainSha;", "  result.pushed = true;"],
  ['dreamzone-3 check: build.bat called by its bare name ("not recognized" in a Claude Code shell)', CHECK, 'call "%CD%\\build.bat" test', 'call build.bat test'],
  ['failingRows: a command cmd could not run is not named', SRC, '|is not recognized as an internal or external command/', '/'],
];

function tree() {
  const dir = require('./scratch.js').mkdtemp('lt-mut-');
  fs.mkdirSync(path.join(dir, 'tools'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'hooks'), { recursive: true });
  for (const f of [SRC, SUITE, CHECK, 'heavy-run.js', 'state-manifest.js', 'scratch.js']) fs.copyFileSync(path.join(HERE, f), path.join(dir, 'tools', f));
  fs.copyFileSync(path.join(HERE, '..', 'hooks', 'push-gate.js'), path.join(dir, 'hooks', 'push-gate.js'));
  try { fs.copyFileSync(path.join(HERE, '..', 'state-manifest.json'), path.join(dir, 'state-manifest.json')); } catch (_) { /* not needed by the rows */ }
  return dir;
}
function run(dir) {
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^CONSONANCE_/.test(k)) delete env[k];
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=1', path.join(dir, 'tools', SUITE)], { encoding: 'utf8', env, timeout: 180 * 1000 });
  const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1]);
  return { pass: n('pass'), fail: n('fail'), hung: r.status === null || !Number.isFinite(n('pass')) };
}

function main() {
  require('./heavy-run.js').hold({ cmd: 'landing-train.mutants' });   // ONE HEAVY RUNNER PER TREE
  const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8').replace(/\r\n/g, '\n');
  const control = (() => { const d = tree(); try { return run(d); } finally { fs.rmSync(d, { recursive: true, force: true }); } })();
  console.log(`control (unmutated copy)`.padEnd(110) + `pass ${control.pass} fail ${control.fail}`);
  if (!(control.fail === 0 && control.pass > 0)) { console.log('CONTROL NOT GREEN - no mutant result means anything'); process.exitCode = 1; return; }
  let applied = 0, caught = 0, notApplied = 0;
  MUTANTS.forEach(([name, file, anchor, repl], i) => {
    const src = read(file), hits = src.split(anchor).length - 1, label = `${String(i + 1).padStart(2)} ${name}`.padEnd(110);
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    applied++;
    const d = tree();
    try {
      fs.writeFileSync(path.join(d, 'tools', file), src.replace(anchor, () => repl));
      const r = run(d), ok = r.fail > 0 || r.hung; if (ok) caught++;
      console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? (r.hung ? 'CAUGHT (the suite hung or crashed)' : 'CAUGHT') : 'SURVIVED'}`);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  });
  console.log(`\napplied ${applied} / caught ${caught} / survived ${applied - caught} / NOT APPLIED ${notApplied}`);
  if (applied - caught > 0 || notApplied > 0) process.exitCode = 1;
}

main();
