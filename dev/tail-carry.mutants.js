#!/usr/bin/env node
'use strict';
// tail-carry.mutants.js — run with: node dev/tail-carry.mutants.js
//
// A GREEN SUITE IS A CLAIM ABOUT THE TESTS, NOT ABOUT THE CODE. This breaks one guard at a time
// and requires `tail-carry.test.js` to go RED for each break. A mutant that SURVIVES is a behaviour
// nothing watches — and on this tool nearly every one of those is a way for a conversation to be
// silently forked, truncated, or concatenated with a different future of itself on a machine the
// person running the command cannot see.
//
// **The first mutant in the list is the whole design.** Weakening the import gate from
// `size === offset` to `size >= offset` is not a typo someone might make — it is exactly what plan
// §8 bar (2) specifies. If that mutant survives, this file's central claim is unmeasured.
//
// THE LOCK AND THE TRIPWIRE ARE NOT CEREMONY — `close.mutants.js` carries the incident: a second
// run read its `original` off a first run's MUTATED file and its own `finally { restore() }` wrote
// the mutation back as the truth. The damage was permanent BECAUSE the cleanup ran.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'tail-carry.js');
const SUITE = path.join(__dirname, 'tail-carry.test.js');
const LOCK = path.join(__dirname, '.tail-carry.mutants.lock');

try {
  fs.writeFileSync(LOCK, `${process.pid} ${new Date().toISOString()}\n`, { flag: 'wx' });
} catch (e) {
  console.error(`tail-carry.mutants: another run holds ${LOCK}`);
  console.error('  Refusing to start. Check tail-carry.js against git BEFORE deleting the lock.');
  process.exit(2);
}

const original = fs.readFileSync(SRC, 'utf8');
function unlock() { try { fs.unlinkSync(LOCK); } catch (_) {} }
function restore() { fs.writeFileSync(SRC, original); }
process.on('SIGINT', () => { restore(); unlock(); process.exit(130); });

const MUTANTS = [
  // ── the design ──
  ['THE SPEC AS WRITTEN: the import gate accepts a destination that has moved (size >= offset)',
    '    if (size > pend.offset) {', '    if (false) {'],
  ['a fork is treated as an interrupted carry and repaired over',
    '      const isPrefixOfTail = extra <= row.tail.length && already.equals(row.tail.subarray(0, already.length));',
    '      const isPrefixOfTail = true;'],
  ['a repair happens without being named on the command line',
    "        row.verdict = repair.has(seat.sid) ? 'REPAIR' : 'INTERRUPTED';", "        row.verdict = 'REPAIR';"],
  ['the far machine\'s own conversation is replaced without being named',
    "      row.verdict = retireFar.has(seat.sid) ? 'RETIRE_THEN_FULL' : 'REFUSED';", "      row.verdict = 'RETIRE_THEN_FULL';"],

  ['an import writes into files the running app holds open',
    "    if (running) {\n      return no('Consonance is running', [", "    if (false) {\n      return no('Consonance is running', ["],
  ['an unanswerable "is the app up" lets an import through',
    "    if (running === null) return no('cannot tell whether Consonance is running'", "    if (false) return no('cannot tell whether Consonance is running'"],
  ['the app gate is applied to the EXPORT too, which only reads',
    "  if (o.mode === 'import' && apply) {", '  if (apply) {'],

  // ── identity ──
  ['the key is not compared, so a different conversation under the same sid is appended to',
    '    if (k.key !== entry.key) {', '    if (false) {'],
  ['the key is the first record rather than the first TIMESTAMPED record',
    "    if (o && typeof o.timestamp === 'string') return { key: sha256(Buffer.from(l, 'utf8')), line: l, why: null };",
    "    return { key: sha256(Buffer.from(l, 'utf8')), line: l, why: null };"],
  ['a half-read line can become an identity',
    '  const usable = head.length >= size ? lines : lines.slice(0, -1);', '  const usable = lines;'],
  ['the export stops checking the key against the agreed conversation',
    '    if (entry.key !== k.key) {', '    if (false) {'],

  // ── the ledger ──
  ['the ledger may disagree with itself about where the tail starts',
    '    if (entry.agreed && entry.agreed.offset !== pend.offset) {', '    if (false) {'],
  ['a ledger written by another version is read anyway',
    '  if (led.version !== LEDGER_VERSION) throw new Error(`ledger version ${led.version}, this tool speaks ${LEDGER_VERSION}`);',
    '  if (false) throw new Error(`ledger version ${led.version}, this tool speaks ${LEDGER_VERSION}`);'],
  ['an export overwrites a tail the other machine has not imported',
    "    if (entry && entry.pending && entry.pending.from !== machine) {", '    if (false) {'],
  ['a run that carries nothing still writes state onto the stick',
    "  if (!plan.rows.some((r) => r.verdict === 'TAIL' || r.verdict === 'FULL')) return done;", '  if (false) return done;'],

  // ── the bytes ──
  ['the tail on the stick is not checked against its own sha256',
    '    if (sha256(tail) !== pend.tailSha) {', '    if (false) {'],
  ['the tail\'s length is not checked against the span the ledger claims',
    '    if (tail.length !== pend.toOffset - pend.offset) {', '    if (false) {'],
  ['the rejoined file is not verified whole after the append',
    '    const ok = full === pend.fullSha && size === pend.toOffset;', '    const ok = true;'],
  ['a source that SHRANK is carried anyway',
    '    if (row.size < agreed.offset) {', '    if (false) {'],
  ['a rewritten history is exported as though it were an append',
    '    if (prefix !== agreed.prefixSha) {', '    if (false) {'],
  ['a source that grew DURING the read is written as if it had not',
    '    if (after.size !== row.size) {', '    if (false) {'],
  ['a missing destination is rebuilt from a delta',
    '      if (pend.offset === 0) { row.verdict = \'FULL\'; rows.push(row); continue; }',
    '      { row.verdict = \'FULL\'; rows.push(row); continue; }'],

  // ── the repair ──
  ['the pre-truncate copy is not kept',
    '      fs.copyFileSync(row.dest, asideTo);\n      fs.truncateSync(row.dest, pend.offset);',
    '      void asideTo;\n      fs.truncateSync(row.dest, pend.offset);'],
  ['asidePath stops counting and hands back a name that is already taken',
    '    if (!exists(p)) return p;', '    if (true) return base;'],

  // ── the gate ──
  ['the settle gate accepts a file that is being written right now',
    '    if (age < settleMs) { sleepSync(Math.min(settleMs - age + 5, settleMs)); continue; }', '    if (false) { continue; }'],
  ['a FUTURE mtime is waited out instead of refused',
    "    if (st.mtimeMs > now() + 1000) return { st: null, why: 'FUTURE_MTIME — the clock moved, or something is writing with a time we cannot reason about' };",
    '    if (false) return { st: null, why: 1 };'],
  ['the rehearsal writes after all', '  if (!apply) {', '  if (false) {'],

  // ── the roster ──
  ['a seat main.rs no longer declares is silently dropped from the carry',
    '    if (!sid || !dir) return { seats: null, why: `${rs} no longer declares the ${name} seat where this tool reads it (sid:${!!sid} dir:${!!dir})` };',
    '    if (!sid || !dir) continue;'],
];

const alreadyMutated = MUTANTS.filter(([, , to]) => original.includes(to));
if (alreadyMutated.length) {
  console.error('tail-carry.mutants: THE SOURCE ALREADY CARRIES A MUTATION — refusing to run.');
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
console.log(`tail-carry.mutants.js: ${killed} killed, ${survivors.length} survived, ${MUTANTS.length} total`);
if (survivors.length) {
  console.log('');
  console.log('  A SURVIVOR IS A BEHAVIOUR NOTHING WATCHES:');
  for (const s of survivors) console.log(`    ${s}`);
}
process.exit(survivors.length ? 1 : 0);
