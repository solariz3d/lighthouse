#!/usr/bin/env node
'use strict';
// chain-status.js — ONE line: whose turn is it, and is anything uncommitted.
//
// WHY, measured. On 2026-08-25 the chair compacted while the librarian held four uncommitted files;
// the librarian's ring arrived after "ready to compact." SYMMETRIC BLINDNESS — no seat can see
// another seat's PHASE. The board carries CONTENT that has to be chosen to be read, and the
// [panes] digest only arrives attached to the keeper's message, which is why the keeper has been
// the clock. This reads the baton rows `lap-row.js --stage` writes and prints where the chain is.
//
//   node consonance/tools/chain-status.js
//   -> chain: L007 RETURN-LEG · holder librarian · dirty 4 repo-wide · 11m · this machine only
//
// IT IS A SENSOR. No thresholds, no verdicts, no advice — same law as sourced-stop.js and residue,
// and for the same reason: a check that tells you what to do is a check somebody turns off. The
// seat reading the line decides what it means.
//
// ABSENT LEDGER -> PRINTS NOTHING, EXITS 0. Deliberate, and load-bearing: this is meant to be
// called from the pulse hook, which fires on every prompt in every seat. A reader that can fail is
// a reader that takes the pulse down with it, and a hook that errors every turn gets uninstalled
// within a day. `--why` prints the reason for a silence on stderr, so a chosen silence can be told
// from a broken one — otherwise "it printed nothing" and "it crashed and was swallowed" look the
// same, which is the blindness this tool exists to end, one level down.
//
// WHAT IT CANNOT SEE, printed in the line rather than filed here, per P-UNIVERSE:
//
//   "this machine only"  — lap.jsonl lives in the machine-local data dir beside board.jsonl. The
//                          desktop has its own; neither can see the other. Cross-machine merge is
//                          OUT OF SCOPE and the librarian's plan said so — but out of scope
//                          SILENTLY is the false-green class, so the line says it every time.
//   "dirty N repo-wide"  — `git status --porcelain` counts the whole working tree. It CANNOT
//                          attribute those files to the holder. On a night with four panes dirty,
//                          "holder librarian · dirty 4" does not mean the librarian holds four.
//                          The word `repo-wide` is doing that work and must not be dropped to
//                          shorten the line.
//   "dirty ?"            — git could not be read. NEVER printed as 0: an unreadable count reported
//                          as a clean tree is precisely the false green this room keeps finding.
//   "N unreadable"       — ledger lines that will not parse are COUNTED, never filtered away. A
//                          row that cannot be read is an outcome that is UNKNOWN, not absent
//                          (residue.js, 2026-08-17).

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

/* Resolution order copied from lap-row.js deliberately and NOT imported: this file is called from
 * a hook that must keep working if the repo moves, the same exception ferry-watch.js:84-86 states
 * for its own duplicate. The authority is named here so the copy is auditable. */
function fromConfig(key) {
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const v = JSON.parse(raw);
    const d = v && v[key] != null ? String(v[key]).trim() : '';
    return d || null;
  } catch (_) { return null; }
}

const DATA_DIR = process.env.CONSONANCE_DATA || fromConfig('data_dir') || 'C:\\Consonance\\data';
const LEDGER = process.env.LAP_LEDGER || path.join(DATA_DIR, 'lap.jsonl');
const REPO = process.env.LAP_REPO
  || (fromConfig('room_path') && path.resolve(path.dirname(fromConfig('room_path')), '..'))
  || path.resolve(__dirname, '..', '..');

/** Counting what will not parse instead of dropping it. */
function readLedger(file) {
  if (!fs.existsSync(file)) return { rows: [], unreadable: 0, missing: true };
  let text;
  try { text = fs.readFileSync(file, 'utf8'); }
  catch (_) { return { rows: [], unreadable: 0, missing: true }; }
  const lines = text.split(/\r?\n/).filter(Boolean);
  const out = [];
  let unreadable = 0;
  for (const l of lines) {
    try { out.push(JSON.parse(l)); } catch (_) { unreadable++; }
  }
  return { rows: out, unreadable, missing: false };
}

/** Working-tree count. null — never 0 — when git cannot answer. */
function dirtyCount(repo) {
  try {
    const out = execFileSync('git', ['-C', repo, 'status', '--porcelain'], {
      encoding: 'utf8', timeout: 5000, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split(/\r?\n/).filter(Boolean).length;
  } catch (_) { return null; }
}

function ago(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 90) return s + 's';
  const m = Math.round(s / 60);
  if (m < 90) return m + 'm';
  return Math.round(m / 60) + 'h';
}

/**
 * The newest baton row per lap, laps whose newest row is `filed` dropped.
 *
 * NEWEST-PER-LAP FIRST, THEN FILTER — and the order is the whole correctness of it. Filtering
 * `filed` rows out of the stream and then taking the newest of what is left would resurrect a
 * finished lap from its own second-to-last row, and would do it silently, reporting a lap as
 * RETURN-LEG forever because that row can never stop being the newest non-filed one.
 */
function openLaps(rows) {
  const newest = new Map();
  for (const r of rows) {
    if (!r || r.stage !== 'chain' || !r.lap) continue;
    const prev = newest.get(r.lap);
    if (!prev || (r.at || 0) >= (prev.at || 0)) newest.set(r.lap, r);
  }
  return [...newest.values()]
    .filter(r => r.chain !== 'filed')
    .sort((a, b) => (b.at || 0) - (a.at || 0));
}

function line(opts = {}) {
  const now = opts.now != null ? opts.now : Date.now();
  const led = readLedger(opts.ledger || LEDGER);
  if (led.missing) return { text: null, why: 'no ledger at ' + (opts.ledger || LEDGER) };

  const open = openLaps(led.rows);
  if (!open.length) {
    const any = led.rows.some(r => r && r.stage === 'chain');
    return { text: null, why: any ? 'every lap with a baton row is filed' : 'the ledger carries no baton rows yet' };
  }

  const head = open[0];
  const parts = [
    'chain: ' + head.lap + ' ' + String(head.chain).toUpperCase(),
    'holder ' + head.holder,
  ];
  const d = opts.dirty !== undefined ? opts.dirty : dirtyCount(opts.repo || REPO);
  parts.push('dirty ' + (d === null ? '?' : d) + ' repo-wide');
  if (head.at) parts.push(ago(now - head.at));
  if (open.length > 1) parts.push('+' + (open.length - 1) + ' more open');
  if (led.unreadable) parts.push(led.unreadable + ' unreadable');
  parts.push('this machine only');
  return { text: parts.join(' \u00b7 '), why: null, laps: open.length };
}

function main(argv, out = console.log, err = console.error) {
  const i = argv.indexOf('--ledger');
  const r = line({ ledger: i >= 0 ? argv[i + 1] : undefined });
  if (r.text) out(r.text);
  else if (argv.includes('--why')) err('chain-status: silent — ' + r.why);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { line, openLaps, readLedger, dirtyCount, ago, main, LEDGER, REPO };
