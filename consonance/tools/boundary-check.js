#!/usr/bin/env node
'use strict';
// boundary-check.js — did work leave the room without a sealed guess?
//
// THE OBJECT. `brief/BUILDING.md`'s chain-vs-freestyle cut says: chain when something un-revisable
// is about to reach a seat that will act on it blind; freestyle when nothing is handed off. The
// harm the cut risks is MISCLASSIFICATION AT THE BOUNDARY — a dispatch called freestyle — not the
// total collapse its first falsifier tested for.
//
// WHY THE FIRST ONE COULD NOT WORK, because this tool is its replacement and inherits the lesson.
// It read: "if three consecutive cycles produce no lap row, the freestyle clause has eaten the
// instrument." Three defects, and the third is the one that generalises:
//
//   1. Nothing anywhere counts CYCLES. The unit did not exist, so no run of any tool could
//      evaluate it (P5 finding 2, `loop/freestyle_falsifier_ruling_2026-08-27.md`).
//   2. It was a PRESENCE test aimed at a BOUNDARY harm. A room that dutifully logs laps for its
//      tight-loop work while wrongly freestyling every dispatch reads green — while having exactly
//      the 08-24 failure the section exists to prevent (P5 finding 4).
//   3. ITS SIGNAL WAS AN ABSENCE ON A LEDGER THE LICENSED BEHAVIOUR SUPPRESSES. Freestyle is
//      defined as the mode that hands nothing off; a lap row is the artifact of handing something
//      off. So the clause licensed the very act of not generating its own evidence, and when one
//      row finally appeared the falsifier read SATISFIED off n=1 — and the row that satisfied it
//      was D001, the lap convened to attack it.
//
// THE INVERSION THIS TOOL IS BUILT ON. The denominator is written by a machine when the text
// ARRIVES IN THE RECEIVING PANE — `main.rs:5605` stamps `[chair:MAIN]` onto every chair dispatch
// and `board_push` mirrors the receiving transcript into `data/board.jsonl`. The sending seat
// cannot suppress that row: it exists because the dispatch happened, not because anyone chose to
// record it. The numerator is `lap.jsonl`, which IS self-reported — but here under-reporting makes
// the check FIRE rather than pass. That asymmetry is the whole repair:
//
//     the old check:  no lap row -> reads GREEN   (absence accepted)
//     this check:     no lap row + a dispatch that rendered -> FIRES  (absence classified)
//
// L009's rule, which this tool must not break a fourth time: "any bar or predicate of mine that
// reads the object under test to decide whether to test it." The object under test is the
// freestyle clause; the behaviour it licenses is not opening a lap. That behaviour cannot touch
// the denominator, because the denominator is written by the receiving end.
//
//   node consonance/tools/boundary-check.js
//   node consonance/tools/boundary-check.js --since 2026-08-26T06:15:07Z --verbose
//
// WHAT IT CANNOT SEE — printed in the output too, not only filed here, per P-UNIVERSE:
//
//   BLIND WINDOWS      `board_push` mutes EVERY writer while `data/blind.lock` exists, including
//                      transcript ingest. One ran 2026-06-30 -> 2026-08-01 and swallowed 2,473
//                      entries. A muted window makes the denominator zero, which would read clean.
//                      So a window overlapping a blind period reports UNMEASURED, never HOLDS.
//   A ZERO DENOMINATOR A window with no dispatches is UNMEASURED, not green. This is the exact
//                      defect being replaced and it is refused here by exit code, not by a note.
//   NON-CHAIR HANDOFFS Only `[chair:...]` arrivals count. A brief pasted into a pane by hand, a
//                      file carried to the other machine, a pane-to-pane handoff — all left the
//                      room and NONE of them appear. The denominator is a floor.
//   A GOOD SEAL        It reads that a guess existed and was sealed before the dispatch. It cannot
//                      read whether the guess was any good. Four junk paths pass.
//   WHY A LAP IS ABSENT A dispatch with no covering lap fires whether the seat misclassified it or
//                      simply never opened one. THE CHECK IS BIASED TOWARD FIRING, deliberately. A
//                      fire is a prompt to go look, not a proof of misclassification.
//   THE OTHER MACHINE  `board.jsonl` and `lap.jsonl` are machine-local. This is the desktop's
//                      answer and says so on every run.
//   REPLAY             The board re-ingests transcripts on relaunch, so raw rows ratchet. Arrivals
//                      are deduped on (pane, text). Two genuinely identical dispatches to one pane
//                      therefore count once — undercounting the denominator, never over.

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');

function fromConfig(key) {
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^\uFEFF/, '');
    const v = JSON.parse(raw);
    const d = v && v[key] != null ? String(v[key]).trim() : '';
    return d || null;
  } catch (_) { return null; }
}

const DATA_DIR = process.env.CONSONANCE_DATA || fromConfig('data_dir') || null;
const LEDGER = process.env.LAP_LEDGER || (DATA_DIR && path.join(DATA_DIR, 'lap.jsonl'));
const BOARD = process.env.BOARD_LEDGER || (DATA_DIR && path.join(DATA_DIR, 'board.jsonl'));

// The clause landed in fb08c50, 2026-08-26 00:15:07 -0600. Dispatches before it cannot be held
// against a rule that did not exist, so that is the default floor of the window.
const CLAUSE_LANDED = '2026-08-26T06:15:07Z';

// Rows whose text begins with the app's own chair stamp. Applied in main.rs:5605 by the backend,
// so a sending seat cannot omit it.
const CHAIR = /^\s*\[chair:/;

const EXIT = { HOLDS: 0, FIRES: 1, UNMEASURED: 2 };

function readLaps(file) {
  const rows = [];
  let unreadable = 0;
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch (_) { return { rows, unreadable, missing: true }; }
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    // A line that will not parse is an outcome that is UNKNOWN, not absent (residue.js, 08-17).
    try { rows.push(JSON.parse(line)); } catch (_) { unreadable++; }
  }
  return { rows, unreadable, missing: false };
}

/** Laps that carry a sealed guess, with the moment they were filed (if they were). */
function sealedLaps(rows) {
  const filed = new Map();
  for (const r of rows) {
    if (r && r.stage === 'chain' && r.chain === 'filed' && r.lap) filed.set(r.lap, r.at);
  }
  return rows
    .filter(r => r && r.stage === 'open' && Array.isArray(r.guess) && r.guess.length > 0)
    .map(r => ({ lap: r.lap, at: r.at, filed: filed.has(r.lap) ? filed.get(r.lap) : null }));
}

/** The lap that was open and sealed when `ts` rendered, or null. */
function coveringLap(laps, ts) {
  return laps.find(l => l.at <= ts && (l.filed === null || l.filed >= ts)) || null;
}

/**
 * Reads the board once. Returns the deduped chair arrivals in the window and every blind-window
 * transition seen, so the caller can refuse to score a muted stretch.
 */
function readBoard(file, sinceMs) {
  return new Promise((resolve) => {
    const arrivals = new Map();
    const blind = [];
    let rows = 0, unreadable = 0, raw = 0;
    const gone = () => resolve({ missing: true, arrivals: [], blind, rows, unreadable, raw });
    /* STAT FIRST, and the reason is a bug this file's own test found before it shipped. Relying on
     * the stream's 'error' event was not enough: readline re-emits it on the Interface, which had
     * no handler, so a MISSING BOARD crashed the process with exit 1 — and 1 is the FIRES code.
     * A check that cannot be run was reporting the harm it exists to detect. Handlers stay below
     * as well, for the file that vanishes mid-read. */
    try { fs.statSync(file); } catch (_) { return gone(); }
    let stream;
    try { stream = fs.createReadStream(file); }
    catch (_) { return gone(); }
    stream.on('error', gone);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    rl.on('error', gone);
    rl.on('line', (line) => {
      if (!line.trim()) return;
      let o;
      try { o = JSON.parse(line); } catch (_) { unreadable++; return; }
      rows++;
      if (o.pane === 'blind') { blind.push({ ts: o.ts, text: String(o.text || '') }); return; }
      if (o.role !== 'user' || typeof o.text !== 'string') return;
      if (!CHAIR.test(o.text)) return;
      if (!(o.ts >= sinceMs)) return;
      raw++;
      const key = o.pane + ' ' + o.text;
      if (!arrivals.has(key)) arrivals.set(key, { ts: o.ts, pane: String(o.pane || ''), text: o.text });
      else if (o.ts < arrivals.get(key).ts) arrivals.get(key).ts = o.ts;
    });
    rl.on('close', () => resolve({
      missing: false, blind, rows, unreadable, raw,
      arrivals: [...arrivals.values()].sort((a, b) => a.ts - b.ts),
    }));
  });
}

/** A blind window is open from an OPEN note until the next CLOSED note (or forever). */
function blindOverlaps(blind, sinceMs, untilMs) {
  const marks = blind.slice().sort((a, b) => a.ts - b.ts);
  const spans = [];
  let open = null;
  for (const m of marks) {
    if (/blind window OPEN/.test(m.text)) { if (open === null) open = m.ts; }
    else if (/blind window CLOSED/.test(m.text)) { if (open !== null) { spans.push([open, m.ts]); open = null; } }
  }
  if (open !== null) spans.push([open, Infinity]);
  return spans.filter(([a, b]) => b >= sinceMs && a <= untilMs);
}

function resolveSince(arg) {
  if (!arg) return { ms: Date.parse(CLAUSE_LANDED), label: CLAUSE_LANDED + ' (the clause landed)' };
  const direct = Date.parse(arg);
  if (isFinite(direct)) return { ms: direct, label: arg };
  // A sha: ask git, which is outside both ledgers.
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', arg], {
      cwd: path.resolve(__dirname, '..', '..'), encoding: 'utf8',
    }).trim();
    const ms = Date.parse(iso);
    if (isFinite(ms)) return { ms, label: iso + ' (' + arg + ')' };
  } catch (_) { /* fall through */ }
  return null;
}

async function main(argv) {
  const verbose = argv.includes('--verbose');
  const sinceArg = argv.includes('--since') ? argv[argv.indexOf('--since') + 1] : null;
  const since = resolveSince(sinceArg);
  const out = [];
  const say = (s) => out.push(s === undefined ? '' : s);

  if (!since) {
    console.error(`--since: ${JSON.stringify(sinceArg)} is neither a date nor a commit this repo knows.`);
    return EXIT.UNMEASURED;
  }
  if (!LEDGER || !BOARD) {
    console.error('no data dir: set CONSONANCE_DATA, or data_dir in ~/.consonance.json.');
    console.error('NOT a pass — the check could not be run at all.');
    return EXIT.UNMEASURED;
  }

  const lap = readLaps(LEDGER);
  const board = await readBoard(BOARD, since.ms);
  const now = Date.now();

  say('boundary-check - did work leave the room without a sealed guess?');
  say(`  window   ${since.label} -> now`);
  say(`  board    ${BOARD}`);
  say(`  laps     ${LEDGER}`);
  say('  this machine only - both ledgers are machine-local.');
  say();

  if (board.missing) {
    say('UNMEASURED - the board is unreadable. No denominator, so no verdict.');
    console.log(out.join('\n'));
    return EXIT.UNMEASURED;
  }

  const spans = blindOverlaps(board.blind, since.ms, now);
  if (spans.length) {
    say(`UNMEASURED - the window overlaps ${spans.length} blind window(s).`);
    say('  board_push mutes every writer while data/blind.lock exists, transcript ingest included,');
    say('  so dispatches inside the window left no row. A muted stretch reads clean and is not.');
    for (const [a, b] of spans) {
      say(`    ${new Date(a).toISOString()} -> ${b === Infinity ? 'STILL OPEN' : new Date(b).toISOString()}`);
    }
    say('  Re-run with --since after the window closed.');
    console.log(out.join('\n'));
    return EXIT.UNMEASURED;
  }

  const N = board.arrivals.length;
  if (N === 0) {
    say('UNMEASURED - no chair dispatch rendered in this window.');
    say('  ZERO IS NOT GREEN. The falsifier this replaces read an absence as a pass, which is why');
    say('  it could not fire; an empty denominator is refused here by exit code rather than noted.');
    if (lap.missing) say('  (the lap ledger is also absent)');
    console.log(out.join('\n'));
    return EXIT.UNMEASURED;
  }

  const laps = sealedLaps(lap.rows);
  const unsealed = [];
  for (const a of board.arrivals) if (!coveringLap(laps, a.ts)) unsealed.push(a);

  say(`DENOMINATOR  ${N} chair dispatch(es) rendered in a receiving pane`);
  say(`             written by main.rs:5605 + board_push when the text ARRIVED, not by the sender.`);
  if (board.raw !== N) say(`             ${board.raw} raw rows deduped to ${N} on (pane, text) - the board replays transcripts.`);
  say(`NUMERATOR    ${laps.length} lap(s) carrying a sealed guess${lap.missing ? '  (LEDGER ABSENT)' : ''}`);
  if (lap.unreadable) say(`             ${lap.unreadable} lap line(s) UNREADABLE - counted, not filtered.`);
  if (board.unreadable) say(`             ${board.unreadable} board line(s) unreadable.`);
  say();

  if (verbose) {
    for (const a of board.arrivals) {
      const c = coveringLap(laps, a.ts);
      say(`  ${new Date(a.ts).toISOString()}  ${c ? 'sealed by ' + c.lap : '** UNSEALED **'}  ${a.text.slice(0, 64).replace(/\s+/g, ' ')}`);
    }
    say();
  }

  if (unsealed.length) {
    say(`FIRES - ${unsealed.length} of ${N} dispatch(es) rendered with NO sealed lap open.`);
    say('  Work left the room without a sealed guess. The chain\'s first step cannot be taken');
    say('  retroactively - lap-row.js --open accepts no id - so these are not recoverable, only');
    say('  countable. Go look at what was dispatched and decide whether the cut was misapplied.');
    for (const a of unsealed.slice(0, 10)) {
      say(`    ${new Date(a.ts).toISOString()}  ${a.text.slice(0, 72).replace(/\s+/g, ' ')}`);
    }
    if (unsealed.length > 10) say(`    ... and ${unsealed.length - 10} more`);
    console.log(out.join('\n'));
    return EXIT.FIRES;
  }

  say(`HOLDS - 0 of ${N} dispatch(es) rendered without a sealed lap open.`);
  say('  It does not say the seals were good, only that they existed before the work left.');
  console.log(out.join('\n'));
  return EXIT.HOLDS;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(c => process.exit(c)).catch(e => {
    console.error('boundary-check failed: ' + (e && e.message ? e.message : String(e)));
    console.error('NOT a pass - the check crashed.');
    process.exit(EXIT.UNMEASURED);
  });
}

module.exports = { sealedLaps, coveringLap, blindOverlaps, readLaps, readBoard, resolveSince, CLAUSE_LANDED, EXIT };
