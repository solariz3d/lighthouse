#!/usr/bin/env node
'use strict';
// place-conversations.mutants.js — run with: node dev/place-conversations.mutants.js
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE — and this command was written
// before its tests, so there is no red-then-green transition to point at. This file is that
// evidence with the arrow reversed: it breaks one guard at a time and requires the suite to go RED
// for each break. A mutant that SURVIVES is a behaviour nothing is watching, and on THIS tool every
// such behaviour is a way for a conversation to be lost while the run prints success.
//
// THE LOCK AND THE TRIPWIRE ARE NOT CEREMONY — `close.mutants.js` carries the incident: a second
// run read its `original` off a first run's MUTATED file and its own `finally { restore() }` wrote
// the mutation back as the truth. The damage was permanent BECAUSE the cleanup ran.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'place-conversations.js');
const SUITE = path.join(__dirname, 'place-conversations.test.js');
const LOCK = path.join(__dirname, '.place-conversations.mutants.lock');

try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  console.error(`place-conversations.mutants: another run holds ${LOCK}`);
  console.error('  Refusing to start. Check place-conversations.js against git BEFORE deleting the lock.');
  process.exit(2);
}

const original = fs.readFileSync(SRC, 'utf8');
function unlock() { try { fs.unlinkSync(LOCK); } catch (_) {} }
function restore() { fs.writeFileSync(SRC, original); }
process.on('SIGINT', () => { restore(); unlock(); process.exit(130); });

const MUTANTS = [
  // ── the refusals ──
  ['the app-is-running gate is removed',
    "    if (running) {\n      return no('Consonance is running'", "    if (false) {\n      return no('Consonance is running'"],
  ['a LIVE run stops requiring the app to be closed',
    '  if (!dryRun) {\n    if (running === null) {', '  if (false) {\n    if (running === null) {'],
  ['the dry run stops saying its reading is stale', '  } else if (running !== false) {', '  } else if (false) {'],
  ['an unanswerable "is the app up" is read as a no', '    if (running === null) {', '    if (false) {'],
  ['a missing source no longer stops the run', '  if (absent.length) {', '  if (false) {'],
  ['the quiescence gate is ignored and a torn source is copied', '    if (!got.buf) {', '    if (false) {'],
  ['--pane is ignored and every pane is placed', '    if (only.length && !only.includes(r.pane)) continue;', '    if (false) continue;'],

  // ── the dry run ──
  ['the dry run writes after all',
    '  if (!dryRun) {\n    for (const r of p.rows) {', '  if (true) {\n    for (const r of p.rows) {'],

  // ── the ordering that protects an existing transcript ──
  ['the copy is not verified before anything is retired',
    '  if (back.length !== row.srcBytes || sha256(back) !== row.srcSha) {', '  if (false) {'],
  ['the transcript in the way is DELETED instead of retired',
    '    fs.renameSync(row.dest, retired);', '    fs.unlinkSync(row.dest);'],
  ['the retirement uses a FIXED name — the main.rs:835-836 scar, exactly',
    '    retired = retiredPath(row.dest, now);', "    retired = row.dest + '.orphaned';"],
  ['retiredPath stops counting and returns a name that is already taken',
    '    if (!exists(p)) return p;', '    if (true) return base;'],

  // ── the verification ──
  ['the placed file\'s sha is not compared to the source\'s', '  const okSha = sha256(placed) === row.srcSha;', '  const okSha = true;'],
  ['the ORIGINAL is not re-checked after the copy',
    '  const okSource = sha256(after) === row.srcSha && after.length === row.srcBytes;', '  const okSource = true;'],
  ['the placed byte count is not compared', '  const okBytes = placed.length === row.srcBytes;', '  const okBytes = true;'],
  ['the placed timespan is not compared',
    '  const okSpan = span.first === row.srcSpan.first && span.last === row.srcSpan.last;', '  const okSpan = true;'],
  ['a failed verification no longer fails the run', '  if (bad.length) {', '  if (false) {'],

  // ── the reading ──
  ['the launch table is asserted instead of read off the disk', '    const exists = fs.existsSync(r.dest);', '    const exists = true;'],
  ['a pane whose cwd is the home dir is copied onto itself', '      if (r.sameFile) continue;', '      if (false) continue;'],
  ['encode_cwd keeps dots and spaces — the drift that files a pane where nothing looks',
    "(/[A-Za-z0-9]/.test(c) ? c : '-')", "(/[A-Za-z0-9. ]/.test(c) ? c : '-')"],
];

const alreadyMutated = MUTANTS.filter(([, , to]) => original.includes(to));
if (alreadyMutated.length) {
  console.error('place-conversations.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
  for (const [name, , to] of alreadyMutated) console.error(`  ${name}\n    found: ${to}`);
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
console.log(`place-conversations.mutants.js: ${killed} killed, ${survivors.length} survived, ${MUTANTS.length} total`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(survivors.length ? 1 : 0);
