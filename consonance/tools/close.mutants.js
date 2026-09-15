#!/usr/bin/env node
'use strict';
// close.mutants.js — run with: node close.mutants.js [--only <id>]
//
//   --only <id>   run exactly one mutant; <id> is the number printed before each mutant (1-based, list order)
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This file makes the claim
// checkable: it breaks close.js one guard at a time and requires close.test.js to go RED for each
// break. A mutant that SURVIVES is a behaviour nothing is watching — and on this tool every one of
// those behaviours is a way for the word CLOSED to be printed over a state that never left, which
// is the single failure the packet named.
//
// Each mutation is a real defect someone could plausibly write: a gate downgraded to a print, a
// confirmation not compared, a retry deleted.
//
// THE LOCK AND THE TRIPWIRE ARE NOT CEREMONY. This seat started state-sync.mutants.js twice on
// 2026-09-09; the second run read its `original` off the first run's MUTATED file and its own
// `finally { restore() }` wrote that back as the truth. A mutation sat in the source for ~20
// minutes and another seat reported the suite red before I noticed. THE DAMAGE WAS PERMANENT
// BECAUSE THE CLEANUP RAN. Same shape as `git add -A` capturing another seat's file: a tool that
// writes a path nobody else is expected to be holding, with nothing enforcing it.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'close.js');
const SUITE = path.join(__dirname, 'close.test.js');
const LOCK = path.join(__dirname, '.close.mutants.lock');

// ─────────────────────────────────────────────────────────────────────────────────────────────
// THE TRACKED SOURCE IS NEVER WRITTEN. (P-HARNESS, pane A, 2026-09-15 — the copy pattern of
// dev/tail-carry.mutants.js, L059 §5.)
//
// This harness used to write each mutant INTO close.js and put it back in a `finally` and a SIGINT
// handler. On this machine a kill from outside (taskkill /F, SIGTERM, SIGINT from another process)
// runs no handler at all, so a run killed mid-mutant leaves the mutant in the tracked file. That class
// has happened three times: lap-row.js (09-06), tail-carry.js (09-14), state-sync.js (09-15).
//
// So each mutant is written into a COPY beside the real file — `.close.mutant-<pid>.js`, in this
// directory so `./state-sync.js` and the spawned `<dirname>/state-sync.js` resolve exactly as they do
// for close.js — and close.test.js is pointed at the copy through CLOSE_UNDER_TEST. Both of the suite's
// load paths of close.js (its `require` and its spawned CLI) go through that one pointer; measured in
// close.test.js. A kill at any instant leaves, at worst, an untracked copy and a lock naming a dead pid;
// the next run sweeps both. There is no restore step, because there is nothing to restore.
// ─────────────────────────────────────────────────────────────────────────────────────────────
const COPY = path.join(__dirname, `.close.mutant-${process.pid}.js`);
const COPY_RE = /^\.close\.mutant-(\d+)\.js$/;

/** Is this pid a live process? `kill(pid, 0)` sends nothing; it only asks. EPERM means alive. */
function alive(pid) {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
}

/** --only <id>: parsed BEFORE the lock, so a bad argument leaves nothing behind. */
function parseOnly(argv) {
  // The ONLY argument this harness takes is one --only <id>. Anything else — a repeated --only, a typo such as
  // --onyl, a stray word — is refused, because an ignored argument runs a different set of mutants than the one
  // asked for and says nothing (found 2026-09-15: `--only 3 --only 4` silently ran #3 alone).
  if (argv.length === 0) return { only: null };
  if (argv[0] !== '--only' || argv.length > 2) return { error: `the only argument is one --only <id>; got: ${argv.join(' ')}` };
  const v = argv[1];
  if (v === undefined || !/^\d+$/.test(v)) return { error: `--only needs a mutant id (a positive integer); got ${v === undefined ? 'nothing' : v}` };
  return { only: Number(v) };
}
const onlyArg = parseOnly(process.argv.slice(2));
if (onlyArg.error) { console.error(`close.mutants: ${onlyArg.error}`); process.exit(2); }

// A LOCK LEFT BY A KILLED RUN IS THE EXPECTED CASE, not an anomaly: a kill runs no handler, so it never
// unlocks. A live holder still refuses this run. A dead holder's lock is taken over — safe for one reason
// only: the tracked source is re-checked against every mutant below before anything runs, and this
// harness cannot have written it.
try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  const holder = parseInt(String(fs.readFileSync(LOCK, 'utf8')).split(/\s/)[0], 10);
  if (Number.isInteger(holder) && alive(holder)) {
    console.error(`close.mutants: a live run (pid ${holder}) holds ${LOCK} — refusing to start.`);
    process.exit(2);
  }
  console.error(`close.mutants: taking over a lock left by pid ${holder}, which is not running (a killed run).`);
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`);
}

for (const f of fs.readdirSync(__dirname)) {
  const m = f.match(COPY_RE);
  if (m && Number(m[1]) !== process.pid && !alive(Number(m[1]))) {
    fs.unlinkSync(path.join(__dirname, f));
    console.error(`close.mutants: swept a copy left by killed run pid ${m[1]}: ${f}`);
  }
}

const original = fs.readFileSync(SRC, 'utf8');
function unlock() { try { fs.unlinkSync(LOCK); } catch (_) { /* already gone */ } }
function dropCopy() { try { fs.unlinkSync(COPY); } catch (_) { /* already gone */ } }

const MUTANTS = [
  // ── the three the packet named ──
  ['the privacy check PRINTS but does not gate', "  if (priv.state !== 'private') {", '  if (false) {'],
  ['a failed push still reports closed', '  if (!push.ok) {', '  if (false) {'],
  ['the DEFERRED retry is removed', '    if (pass === 2) break;', '    break;'],

  // ── the rest of the gates ──
  ['the remote\'s own answer is not compared to HEAD', '  if (after.sha !== local) {', '  if (false) {'],
  ['a remote that cannot be read is treated as up to date', '  if (!before.ok) {', '  if (false) {'],
  ['a deferred set is published anyway', "  if (rec.outcome === 'DEFERRED_UNSETTLED') {", '  if (false) {'],
  ['an outcome that is not a prepared set is tolerated', '  if (!ok.includes(rec.outcome)) {', '  if (false) {'],
  ['the receipt\'s pid is not checked, so last night\'s answer counts as tonight\'s',
    "  if (rec.pid !== childPid || !rec.run_id.startsWith(childPid + '-')) {", '  if (false) {'],
  ['the receipt\'s timestamp is not checked', '  if (!(at >= spawnedAtMs)) {', '  if (false) {'],
  ['--check publishes after all', '  if (checkOnly) {\n    out(`  would publish:', '  if (false) {\n    out(`  would publish:'],
];

// --only is checked against the list BEFORE anything runs: an id outside it is a refusal, never a run
// of zero mutants reported as clean.
if (onlyArg.only !== null && (onlyArg.only < 1 || onlyArg.only > MUTANTS.length)) {
  console.error(`close.mutants: --only ${onlyArg.only} is not a mutant; ids are 1..${MUTANTS.length}.`);
  unlock();
  process.exit(2);
}

// THE TRIPWIRE ON `original` ITSELF. If the tracked source already carries one of our own replacements,
// someone left a mutation in it (an older in-place run, or another writer). This harness no longer writes
// close.js, so it cannot repair that — it refuses, and names what it found.
const alreadyMutated = MUTANTS.filter(([, , to]) => original.includes(to));
if (alreadyMutated.length) {
  console.error('close.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const [name, , to] of alreadyMutated) console.error(`  ${name}\n    found in close.js: ${to}`);
  console.error('  Restore close.js from git before running this again.');
  unlock();
  process.exit(2);
}

/** Run the suite against whatever is in COPY right now. true = the suite went red. */
function suiteRedOnCopy() {
  try {
    execFileSync(process.execPath, [SUITE], {
      stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
      env: { ...process.env, CLOSE_UNDER_TEST: COPY },
    });
    return false;
  } catch (_) { return true; }
}

let killed = 0;
let notApplied = 0;
const survivors = [];
const selected = MUTANTS.map((m, i) => [i + 1, ...m]).filter(([id]) => onlyArg.only === null || id === onlyArg.only);
try {
  // PRE-FLIGHT: the unmutated copy must be GREEN. If the suite is red for any other reason — a broken
  // seam, a missing file, a red test — every mutant below would read as "killed" without earning it.
  fs.writeFileSync(COPY, original);
  if (suiteRedOnCopy()) {
    console.error('close.mutants: the suite is RED against an UNMUTATED copy — no mutant can be scored. Fix that first.');
    process.exitCode = 2;
  } else {
    for (const [id, name, from, to] of selected) {
      const hits = original.split(from).length - 1;
      if (hits !== 1) {
        notApplied++;
        survivors.push(`#${id} ${name}  — MUTATION DID NOT APPLY (${hits} matches): the anchor is gone or ambiguous, so this defect is unguarded and unmeasured`);
        console.log(`  ????  #${id} ${name}  (NOT APPLIED: anchor ${hits === 0 ? 'missing' : 'ambiguous'})`);
        continue;
      }
      // A FUNCTION replacement, never a string: a string replacement expands `$&`, `` $` `` and `$'`.
      fs.writeFileSync(COPY, original.replace(from, () => to));
      if (suiteRedOnCopy()) { killed++; console.log(`  killed  #${id} ${name}`); }
      else { survivors.push(`#${id} ${name}`); console.log(`  SURVIVED  #${id} ${name}`); }
    }
  }
} finally {
  dropCopy();
  unlock();
}
if (process.exitCode === 2) process.exit(2);

// The tracked file must be byte-identical to what this run read. This harness never writes it, so a
// difference here is ANOTHER writer — reported, never "restored".
if (fs.readFileSync(SRC, 'utf8') !== original) {
  console.error('close.mutants: close.js CHANGED DURING THIS RUN, and not by this harness. Check git diff before trusting any count above.');
  process.exitCode = 3;
}

console.log('');
console.log(`close.mutants.js: ${killed} killed, ${survivors.length - notApplied} survived, ${notApplied} not applied, ${selected.length} run of ${MUTANTS.length} total${onlyArg.only !== null ? ` (--only ${onlyArg.only})` : ''}`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES. Each of these can be broken and the suite');
  console.log('  still reports green:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(process.exitCode === 3 ? 3 : survivors.length ? 1 : 0);
