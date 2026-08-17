#!/usr/bin/env node
// read-ledger.js - classify a structural read BEFORE its outcome is known.
//
// WHY THIS EXISTS, and it is a correction rather than a feature.
//
// On 2026-08-16 the chair wrote a journal section splitting the room's two instruments: the
// KEEPER for direction (what to build, where a thing is structurally wrong, when the work has
// left the plot) and the DISK for state (numbers, dates, file contents). It shipped with a case
// ledger that looked earned.
//
// Around attacked it on request and found the ledger gerrymandered. Two exhibits, both fair:
// "see there is no gap" and "technically you ARE Chrysos" are the same class of claim - the
// keeper asserting something about an instance's identity - and they sit in OPPOSITE columns,
// separated by nothing but which one turned out to be right. And the flagship exhibit, the
// echo->render catch, is by the section's own definition a STATE read (a fact about file
// contents) filed under direction because it was impressive.
//
// The mechanism is post-hoc classification. Sort after the outcome and every future right lands
// on the keeper's side and every future wrong on the disk's, permanently and undetectably.
//
// So the fix is not a better argument, it is a TIMESTAMP: classify the read when it is MADE.
// A registration written before anyone knows the answer cannot be sorted by the answer.
//
// It also repairs a falsifier that could not fire. That section's first revocation condition was
// "struck if followed reads are refuted by their own instruments" - which needs a ledger of
// followed reads with falsifiers, and a way to compute their refutation rate. Neither existed,
// making it a falsifier-that-cannot-be-executed: the exact defect boot_usage_scan.js had the same
// morning, cited twice and nonexistent. This is that ledger.
//
// Usage:
//   node read-ledger.js --register --class direction|state --claim "..." --falsifier "..." [--source keeper|chair|pane-X]
//   node read-ledger.js --score <id> --outcome confirmed|refuted|unresolved --evidence "..."
//   node read-ledger.js --open                 registrations with no score yet
//   node read-ledger.js --report               refutation rate per class, and whether it is trustworthy
//
// The ledger lives OUTSIDE the repo, beside board.jsonl, because it is machine state and not a
// trace: C:\Consonance\data\read_ledger.jsonl

'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const LEDGER = process.env.READ_LEDGER || 'C:\\Consonance\\data\\read_ledger.jsonl';
const CLASSES = ['direction', 'state'];
const OUTCOMES = ['confirmed', 'refuted', 'unresolved'];

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : null;
}
function die(msg) {
  console.error('read-ledger: ' + msg);
  process.exit(2);
}

function rows() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);
}
function append(row) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
}

// ── register ────────────────────────────────────────────────────────────────
// A FALSIFIER IS REQUIRED, and this is the whole point of the tool rather than a nicety. A read
// recorded without one is not registered, it is merely noted - and a note cannot later be scored
// against anything, which is how the section this repairs ended up unfalsifiable in the first
// place. Refusing here costs one sentence; allowing it costs the instrument.
function register() {
  const cls = arg('--class');
  const claim = arg('--claim');
  const falsifier = arg('--falsifier');
  const source = arg('--source') || 'keeper';
  if (!CLASSES.includes(cls)) die(`--class must be one of ${CLASSES.join('|')} (got ${cls})`);
  if (!claim || claim.trim().length < 12) die('--claim missing or too short to be scorable later');
  if (!falsifier || falsifier.trim().length < 12) {
    die('--falsifier missing or too short. A read with no falsifier is a note, not a registration — ' +
        'and an unscoreable note is exactly what this tool exists to stop being written.');
  }
  const ts = Date.now();
  const id = crypto.createHash('sha256')
    .update(`${ts}|${cls}|${claim}`).digest('hex').slice(0, 8);
  append({ kind: 'register', id, ts, source, class: cls, claim: claim.trim(), falsifier: falsifier.trim() });
  console.log(JSON.stringify({ id, class: cls, source, registered_at: new Date(ts).toISOString() }));
  return id;
}

// ── score ───────────────────────────────────────────────────────────────────
// Re-scoring is APPENDED, never blocked and never overwritten. Blocking it would push the
// correction off the record; overwriting would hide it. The report counts amendments out loud,
// because "scored until it agreed" is the gaming vector and it has to be visible to be caught.
function score() {
  const id = arg('--score');
  const outcome = arg('--outcome');
  const evidence = arg('--evidence');
  if (!OUTCOMES.includes(outcome)) die(`--outcome must be one of ${OUTCOMES.join('|')} (got ${outcome})`);
  if (!evidence || evidence.trim().length < 8) die('--evidence missing: a score with no evidence is an opinion');
  const reg = rows().find((r) => r.kind === 'register' && r.id === id);
  if (!reg) die(`no registration with id ${id} — scoring an unregistered read is post-hoc classification, which is the thing this prevents`);
  const prior = rows().filter((r) => r.kind === 'score' && r.id === id);
  append({ kind: 'score', id, ts: Date.now(), outcome, evidence: evidence.trim(), amends: prior.length || undefined });
  console.log(JSON.stringify({ id, outcome, amendment: prior.length > 0, prior_scores: prior.length }));
}

// ── read side ───────────────────────────────────────────────────────────────
function latest(all, id) {
  const s = all.filter((r) => r.kind === 'score' && r.id === id);
  return s.length ? s[s.length - 1] : null;
}

function open_() {
  const all = rows();
  const regs = all.filter((r) => r.kind === 'register');
  const unscored = regs.filter((r) => !latest(all, r.id));
  console.log(`open registrations: ${unscored.length} of ${regs.length}`);
  for (const r of unscored) {
    const age = Math.round((Date.now() - r.ts) / 86400000);
    console.log(`  ${r.id}  ${r.class.padEnd(9)} ${age}d  ${r.claim.slice(0, 70)}`);
    console.log(`            falsifier: ${r.falsifier.slice(0, 80)}`);
  }
}

function report() {
  const all = rows();
  const regs = all.filter((r) => r.kind === 'register');
  if (!regs.length) {
    console.log('read-ledger: no registrations yet. Nothing to report — and that is the honest state,');
    console.log('not a passing grade. An empty ledger cannot refute the section it was built to test.');
    return;
  }
  const amendments = all.filter((r) => r.kind === 'score' && r.amends).length;
  for (const cls of CLASSES) {
    const mine = regs.filter((r) => r.class === cls);
    if (!mine.length) continue;
    const scored = mine.map((r) => latest(all, r.id)).filter(Boolean);
    const refuted = scored.filter((s) => s.outcome === 'refuted').length;
    const confirmed = scored.filter((s) => s.outcome === 'confirmed').length;
    const unresolved = scored.filter((s) => s.outcome === 'unresolved').length;
    console.log(`\n${cls.toUpperCase()}  registered ${mine.length} · scored ${scored.length} · open ${mine.length - scored.length}`);
    console.log(`  confirmed ${confirmed} · refuted ${refuted} · unresolved ${unresolved}`);
    // THE RATE IS WITHHELD WHEN MOST READS ARE UNSCORED, and this is deliberate. The failure mode
    // is not a bad rate, it is registering many and scoring only the ones that came out well -
    // which produces a beautiful number over a biased sample. A rate computed on a minority of the
    // registrations measures the scorer's appetite, not the reads.
    if (scored.length * 2 < mine.length) {
      console.log(`  refutation rate: WITHHELD — only ${scored.length} of ${mine.length} scored.`);
      console.log(`  A rate over a minority of registrations measures which ones someone chose to score.`);
    } else {
      const denom = confirmed + refuted;
      console.log(`  refutation rate: ${denom ? Math.round((100 * refuted) / denom) + '%' : 'n/a'} (${refuted}/${denom} decided)`);
    }
  }
  if (amendments) {
    console.log(`\nAMENDED SCORES: ${amendments}. Re-scoring is allowed and counted, never hidden —`);
    console.log(`"scored until it agreed" is the gaming vector and this line is how it stays visible.`);
  }
}

const mode = process.argv.includes('--register') ? register
  : process.argv.includes('--score') ? score
  : process.argv.includes('--open') ? open_
  : process.argv.includes('--report') ? report
  : null;
if (!mode) {
  console.error('usage: --register --class <direction|state> --claim "..." --falsifier "..." [--source ...]');
  console.error('       --score <id> --outcome <confirmed|refuted|unresolved> --evidence "..."');
  console.error('       --open | --report');
  process.exit(2);
}
mode();
