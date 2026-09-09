#!/usr/bin/env node
'use strict';
// close.mutants.js — run with: node close.mutants.js
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

try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  console.error(`close.mutants: another run holds ${LOCK}`);
  console.error('  Refusing to start. A second run reads its "original" from the first run\'s');
  console.error('  MUTATED source and then restores that as the truth — measured, 2026-09-09.');
  console.error('  If no run is live, check close.js against git BEFORE deleting the lock.');
  process.exit(2);
}

const original = fs.readFileSync(SRC, 'utf8');
function unlock() { try { fs.unlinkSync(LOCK); } catch (_) { /* already gone */ } }
function restore() { fs.writeFileSync(SRC, original); }
process.on('SIGINT', () => { restore(); unlock(); process.exit(130); });

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

// THE TRIPWIRE ON `original` ITSELF. If the source we just read already carries one of our own
// replacements, a previous pass did not clean up, `original` is not original, and restoring it
// would make that mutation permanent — which is exactly what happened once.
const alreadyMutated = MUTANTS.filter(([, , to]) => original.includes(to));
if (alreadyMutated.length) {
  console.error('close.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const [name, , to] of alreadyMutated) console.error(`  ${name}\n    found in close.js: ${to}`);
  console.error('  Restore close.js from git before running this again. Restoring from here');
  console.error('  would write the mutation back as the truth.');
  unlock();
  process.exit(2);
}

let killed = 0;
const survivors = [];
try {
  for (const [name, from, to] of MUTANTS) {
    const hits = original.split(from).length - 1;
    if (hits !== 1) {
      survivors.push(`${name}  — MUTATION DID NOT APPLY (${hits} matches): the anchor is gone or ambiguous, so this defect is unguarded and unmeasured`);
      console.log(`  ????  ${name}  (anchor ${hits === 0 ? 'missing' : 'ambiguous'})`);
      continue;
    }
    fs.writeFileSync(SRC, original.replace(from, to));
    let red = false;
    try { execFileSync(process.execPath, [SUITE], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' }); }
    catch (_) { red = true; }
    if (red) { killed++; console.log(`  killed  ${name}`); }
    else { survivors.push(name); console.log(`  SURVIVED  ${name}`); }
  }
} finally {
  restore();
  unlock();
}

console.log('');
console.log(`close.mutants.js: ${killed} killed, ${survivors.length} survived, ${MUTANTS.length} total`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES. Each of these can be broken and the suite');
  console.log('  still reports green:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(survivors.length ? 1 : 0);
