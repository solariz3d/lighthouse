#!/usr/bin/env node
'use strict';
// jev-shadow.mutants.js — run with: node consonance/tools/jev-shadow.mutants.js [--only <n>]
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. Two targets, each against its own suite:
//   jev-shadow.js         vs jev-shadow.test.js          (capture, pair, ask, report)
//   jev-shadow-runner.js  vs jev-shadow-runner.test.js   (the process the app starts: key, lock, caps, stop)
// Every row breaks one guard; the matching suite must go RED.
//
// THE TRACKED SOURCES ARE NEVER WRITTEN — the pattern of state-sync.mutants.js and jev-ask.mutants.js. The tools, both
// suites, jev-ask.js and a copy of dev/shell/hooks are laid out in a temp dir at the repo's own depth (the suites find
// the real overseer workers at ../../dev/shell/hooks), the copy is mutated, the dir is removed.
//
// THREE RESULTS THAT ARE NOT "CAUGHT", kept apart and printed as such:
//   NOT APPLIED  the anchor is not in the source exactly once.
//   NO RESULT    the mutant does not compile (`node --check`). D103's first mutant 7 cut a line mid-comment, did not
//                parse, and was counted CAUGHT — a syntax error is not a test catching anything.
//   and a HANG is reported as CAUGHT (hung), never folded into a plain catch: D104 found a runner that logged
//   "stopped" and then kept the process alive forever while its test reported PASS. A suite that cannot finish is
//   failing, and the row says which way.
//
// The suites run with AI_GATEWAY_API_KEY and JEV_LIVE_SMOKE removed, so no mutant can reach the network.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const TOOLS = __dirname;
const HOOKS = path.resolve(__dirname, '..', '..', 'dev', 'shell', 'hooks');
const COPIED = ['jev-shadow.js', 'jev-shadow.test.js', 'jev-shadow-runner.js', 'jev-shadow-runner.test.js', 'jev-ask.js'];
const HANG_MS = 120000;

const TARGETS = {
  shadow: { file: 'jev-shadow.js', suite: 'jev-shadow.test.js' },
  runner: { file: 'jev-shadow-runner.js', suite: 'jev-shadow-runner.test.js' },
};

const MUTANTS = [
  // ---- jev-shadow.js
  ['shadow', 'idempotency: the ledger ignored', "if (caps.has(id) && !done.has(`${judge}:${id}`)) eligible.push", 'if (caps.has(id)) eligible.push'],
  ['shadow', 'the per-run cap not applied', 'const batch = eligible.slice(0, maxCalls);', 'const batch = eligible.slice(0);'],
  ['shadow', 'the hard cap not enforced', 'if (maxCalls > HARD_CAP) throw', 'if (false) throw'],
  ['shadow', 'the cap not required', 'if (!Number.isInteger(maxCalls) || maxCalls < 1) throw', 'if (false) throw'],
  ['shadow', 'the up-front no-key refusal removed', "if (!dry && !(env.AI_GATEWAY_API_KEY || '').trim()) throw", 'if (false) throw'],
  ['shadow', 'every Refusal treated as item-level (the D103 pre-fix code)', 'if (err instanceof Refusal && /matches a secret pattern/.test(err.message)) {', 'if (err instanceof Refusal) {'],
  ['shadow', 'a gateway failure swallowed', '      throw err;                          // a gateway failure stops the run; this item gets no row and is retried next run', '      continue;'],
  ['shadow', 'refused rows not counted as done (retried forever)', 'const done = new Set(readJsonl(ledgerPath).map(', "const done = new Set(readJsonl(ledgerPath).filter((r) => r.status === 'ok').map("],
  ['shadow', 'capture not idempotent', 'if (fs.existsSync(dest)) { res.already++; continue; }', '/* no idempotency */'],
  ['shadow', 'the prompt built without its discipline', 'const prompt = builder.build(input, discipline);', "const prompt = builder.build(input, '');"],
  ['shadow', 'the state sent is not the capture byte for byte', 'state: cap.prompt, env, fetchImpl', "state: cap.prompt + ' ', env, fetchImpl"],
  ['shadow', '--dry calls anyway', '  if (dry) {\n    const bytes', '  if (false) {\n    const bytes'],
  ['shadow', 'the rate divides by all rows (refusals in the denominator)', 'rate: ok.length ? agree / ok.length : null, refused', 'rate: agree / Math.max(1, mine.length), refused'],
  ['shadow', 'a missing store defaulted', 'const needStore = (store) => { if (!store) throw', 'const needStore = (store) => { if (false) throw'],
  ['shadow', 'a missing discipline file tolerated', "try { discipline = fs.readFileSync(dp, 'utf8'); } catch { throw", "try { discipline = fs.readFileSync(dp, 'utf8'); } catch { discipline = ''; if (0) throw"],
  // ---- jev-shadow-runner.js
  ['runner', 'the lock is not exclusive (a double runner starts)', "{ flag: 'wx' }", "{ flag: 'w' }"],
  ['runner', 'a stale lock treated as live', 'if (held && isAlive(held.pid)) {', 'if (held) {'],
  ['runner', 'the no-key refusal removed', '  if (!key) {', '  if (false) {'],
  ['runner', 'the User environment never consulted', " || String(cfg.readUserEnv('AI_GATEWAY_API_KEY') || '').trim()", ''],
  ['runner', 'the app-pid watch removed (never stops)', "if (!isAlive(appPid)) stop('app closed');", '/* no watch */'],
  ['runner', 'a dead app pid accepted at start', '  if (!isAlive(appPid)) {\n    const m = `the app pid', '  if (false) {\n    const m = `the app pid'],
  ['runner', 'the per-run cap ignored', 'maxCalls: Math.min(cfg.maxCalls, left)', 'maxCalls: shadowMod.HARD_CAP'],
  ['runner', 'the daily cap ignored', '    if (left <= 0) {', '    if (false) {'],
  ['runner', 'the lock not released on stop', "inFlight.then(() => { release(); log(`stopped", 'inFlight.then(() => { log(`stopped'],
  ['runner', 'a refused capture does not stop the runner', "stop('capture refused');", '/* keeps going */'],
  ['runner', 'timers registered after a startup stop (the D104 pre-fix code)', '  if (!stopping) {\n    timers.push', '  if (true) {\n    timers.push'],
];

// Rows deliberately not applied, each with the reason, printed so the count is honest.
const NOT_APPLIED = [
  ['shadow', 'the L3 worker loaded with require()', "its main() would run inside the suite and could spawn a real claude process; guarded instead by the test that the L3 job file survives capture"],
  ['runner', 'the key-scrub in the runner log removed', 'no runner message carries the key (the key is never formatted into one), so the scrub is defence in depth no test can reach without planting the key in a message first'],
  ['runner', 'release deletes another runner\'s lock (token check removed)', 'needs two live runner PROCESSES racing one lock; not built. The in-process double-runner test shows the second never takes the lock'],
];

function layout(root) {
  const tools = path.join(root, 'consonance', 'tools');
  fs.mkdirSync(tools, { recursive: true });
  fs.cpSync(HOOKS, path.join(root, 'dev', 'shell', 'hooks'), { recursive: true });
  for (const f of COPIED) fs.copyFileSync(path.join(TOOLS, f), path.join(tools, f));
  return tools;
}

function score(target, text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-shadow-mut-'));
  try {
    const tools = layout(root);
    const file = path.join(tools, TARGETS[target].file);
    if (text != null) fs.writeFileSync(file, text);
    if (spawnSync(process.execPath, ['--check', file]).status !== 0) return { noResult: true };
    const env = { ...process.env };
    delete env.AI_GATEWAY_API_KEY; delete env.JEV_LIVE_SMOKE;
    const r = spawnSync(process.execPath, ['--test', path.join(tools, TARGETS[target].suite)], { encoding: 'utf8', env, timeout: HANG_MS });
    if (r.error && r.error.code === 'ETIMEDOUT') return { hung: true };
    const o = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
    const n = (k) => Number((o.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')) || [])[1] || 0);
    // A test that hits its own `timeout` is reported by node as CANCELLED, not failed — and it did not pass. Counting
    // only `fail` reported mutant 25 as SURVIVED while its test had timed out (D104): a false survivor, the mirror of
    // D103's false catch. Both count here.
    return { pass: n('pass'), fail: n('fail') + n('cancelled') };
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

function main() {
  const at = process.argv.indexOf('--only');
  const only = at > 0 ? Number(process.argv[at + 1]) : null;
  for (const t of Object.keys(TARGETS)) {
    const c = score(t, null);
    console.log(`control ${t.padEnd(7)} ${JSON.stringify(c)}`);
    if (c.hung || c.noResult || c.fail !== 0 || !(c.pass > 0)) { console.log('CONTROL NOT GREEN — no mutant result means anything'); process.exitCode = 1; return; }
  }
  const src = Object.fromEntries(Object.entries(TARGETS).map(([t, v]) => [t, fs.readFileSync(path.join(TOOLS, v.file), 'utf8')]));
  let applied = 0, caught = 0, hung = 0, noResult = 0, notApplied = 0;
  MUTANTS.forEach(([t, name, anchor, repl], i) => {
    if (only != null && only !== i + 1) return;
    const label = `${String(i + 1).padStart(2)} [${t}] ${name}`.padEnd(78);
    const hits = src[t].split(anchor).length - 1;
    if (hits !== 1) { notApplied++; console.log(`${label} NOT APPLIED (anchor found ${hits} times)`); return; }
    const r = score(t, src[t].replace(anchor, repl));
    if (r.noResult) { noResult++; console.log(`${label} NO RESULT (does not compile)`); return; }
    applied++;
    if (r.hung) { hung++; caught++; console.log(`${label} CAUGHT (hung: the suite did not finish in ${HANG_MS / 1000} s)`); return; }
    const ok = r.fail > 0;
    if (ok) caught++;
    console.log(`${label} pass ${r.pass} fail ${r.fail}  ${ok ? 'CAUGHT' : 'SURVIVED'}`);
  });
  if (only == null) for (const [t, name, why] of NOT_APPLIED) { notApplied++; console.log(`   [${t}] ${name}`.padEnd(78) + ` NOT APPLIED — ${why}`); }
  console.log(`\n${applied} applied · ${caught} caught (${hung} of them by hanging) · ${applied - caught} survived · ${noResult} no result · ${notApplied} NOT APPLIED`);
  if (applied - caught > 0 || noResult > 0) process.exitCode = 1;
}

main();
