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
//
// ── THE WORK LEG, AND WHAT "STALLED" MEANS HERE (2026-08-29) ────────────────────────────────────
//
// THE FAILURE THIS CLOSES. Twice, the chair's own: a lap reached MAP and never reached the panes.
// L010 and L011 both run `dispatched -> map -> filed`. The chain died in the chair's hands, and the
// second one was caught by the KEEPER rather than by anything here. This reader was blind to both
// BY CONSTRUCTION: openLaps() drops filed laps, so the instant the chair filed a dead lap it left
// the line permanently. The failure erased its own evidence from the only instrument watching.
//
// ELAPSED TIME IS THE WRONG AXIS, and the ledger refutes it rather than my asserting it. Measured
// over every chain transition on this machine:
//
//     L009  dispatched -> return-leg   3554s    panes DID work — four hand-backs, per the row's note
//     L010  map        -> filed        3557s    the lap died before the panes
//
// Three seconds apart, opposite classes. At the other end L011 died in 47s while the HEALTHY L008
// sat at map for 287s before crossing to `working`. A threshold low enough to catch L011 fires on
// L008 six times over; one high enough to spare L008 misses L011 entirely. No duration separates
// these, so no duration is used. The brief said not to invent one to look decisive.
//
// COMMITS ARE ALSO THE WRONG AXIS — my own second attack, and it failed. `git rev-list --count`
// across each lap's pre-work span: healthy L008 = 1, dead L011 = 1, dead L010 = 8. The healthy lap
// and a dead lap are IDENTICAL on this axis. Recorded because a discarded attack is the only
// evidence that the axis kept below was chosen rather than reached for.
//
// THE AXIS THAT SURVIVES IS WHETHER ANY ROW ATTESTS THE WORK LEG. Three stages can only be written
// once the panes have worked — `working`, `handbacks-in`, `return-leg`. So:
//
//     A lap's work leg is UNWITNESSED when the lap is FILED and carries none of those three.
//
// No threshold, no clock, nothing to tune. It fires on L010 and L011, and it SPARES L009 — which
// has no `working` row either, but reached `return-leg`: the lap where the panes demonstrably
// worked and only the bookkeeping was missing. That sparing is the whole test of the rule. A
// definition that caught L009 would be counting paperwork, not chain deaths.
//
// MEMBERSHIP, NEVER ORDERING. lap-row.js declares the vocabulary as map -> dispatched, and all four
// real laps on this ledger write dispatched -> map. Any rule computing "did it get past index N"
// would misread every lap in the record, so this asks only whether a row EXISTS.
//
// WHY IT CANNOT SPEAK EARLIER, said plainly because "detect it sooner" is the first thing to ask.
// Before the `filed` row there is no observable separating a lap being worked from one being
// abandoned — that is exactly what the two refutations above establish. The claim becomes true and
// checkable when the lap is filed, and this says so on the next turn the pulse fires. In practice
// that is near-immediate: L011 was filed 47s after its map. A lap ABANDONED and never filed is a
// DIFFERENT shape and was never invisible — it stays open, and this line has always printed its
// age. Nothing new is needed for it, and adding a timeout for it would import the axis the ledger
// just refuted.
//
// WHAT THE NEW CLAUSES CANNOT SEE, printed in the line and not only filed here:
//
//   "UNWITNESSED"      — a statement about ROWS, never about the world. This ledger is self-report
//                        (lap-row.js limit d). A lap where the panes worked and NOTHING was written
//                        afterwards reads identically to one that died in the chair's hands. L009
//                        is spared only because a later row happened to attest; had the librarian
//                        written nothing, this rule would have called a working lap dead. The word
//                        is `unwitnessed` and not `skipped` for that reason, and `rows only` rides
//                        the line whenever the clause fires.
//   "N of M chained"   — M IS THE UNIVERSE, printed with every claim rather than left to the
//                        reader: laps on THIS machine's ledger carrying any chain row, capped at
//                        the window. L001-L007 predate the chain entirely and are in no denominator
//                        here.
//   not every one is a fault — an inquiry can dissolve and be correctly closed. This reports the
//                        SHAPE; the `note` on the filed row is where a seat says which it was. Both
//                        L010's and L011's filed rows carry note: null, which is why neither could
//                        be told apart from the outside.

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

// NO FATAL DEFAULT. This resolution was copied from lap-row.js:97, which ends in a hardcoded
// data-dir literal — grandfathered there by portable-paths' baseline, and RED here the moment
// this file was committed. Worth keeping as its own finding: portable-paths scans TRACKED files,
// so a new tool is invisible to it while untracked. "Green before the commit" was true and meant
// nothing; the instrument's universe only included this file once git did.
//
// Degrading LOUDLY, per that tool's own instruction, means something specific for a reader whose
// contract is to exit 0 in silence: it must NOT invent a path and then report 'no ledger there',
// which is a false statement about a machine it never looked at. Unresolved is its own reason,
// and --why says so on stderr.
const DATA_DIR = process.env.CONSONANCE_DATA || fromConfig('data_dir') || null;
const LEDGER = process.env.LAP_LEDGER || (DATA_DIR ? path.join(DATA_DIR, 'lap.jsonl') : null);
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

/* Stages that can only be written AFTER the panes have worked. `working` is the leg itself;
 * `handbacks-in` and `return-leg` sit downstream of it and each attests it happened. See the header
 * for why this is membership and never ordering. */
const WORK_ATTESTING = new Set(['working', 'handbacks-in', 'return-leg']);

/* The vocabulary, COPIED from lap-row.js CHAIN_STAGES and deliberately not imported — the same
 * exception this file already states at fromConfig() and ferry-watch.js:84-86 states for its own:
 * a hook that must survive the repo moving cannot require a sibling. The authority is named so the
 * copy is auditable, and a value here that lap-row.js would refuse to write shows up as `damaged`,
 * which is the safe direction for a drift between the two lists. */
const CHAIN_STAGES = new Set(['inquiry', 'map', 'dispatched', 'working', 'handbacks-in', 'return-leg', 'filed']);

/* Borrowed from lap-row.js WINDOW, not minted here. It bounds the LISTING and nothing else: the
 * rule has no threshold, and this only stops a three-week-old death printing on every turn forever.
 * A hook that nags is a hook that gets uninstalled, which this file already says once above. */
const WINDOW = 10;
/* Display cap on the id list so one line stays one line; `+N` says when it bit. */
const LIST_CAP = 3;

/**
 * Chain rows folded per lap: oldest-first within a lap, laps newest-first by their newest row.
 *
 * `filed` reads the NEWEST row, deliberately matching openLaps() rather than asking whether a filed
 * row exists anywhere. The two must agree about what "closed" means or a lap continued after a
 * premature file would be reported open by one and dead by the other, in the same line.
 * `attested` reads ALL rows, because an attestation is a fact about the lap's history and cannot be
 * undone by a later row.
 */
function chainLaps(rows) {
  const by = new Map();
  for (const r of rows) {
    if (!r || r.stage !== 'chain' || !r.lap) continue;
    if (!by.has(r.lap)) by.set(r.lap, []);
    by.get(r.lap).push(r);
  }
  const out = [];
  for (const [lap, rs] of by) {
    rs.sort((a, b) => (a.at || 0) - (b.at || 0));
    const newest = rs[rs.length - 1];
    out.push({
      lap, rows: rs, newest, at: newest.at || 0,
      filed: newest.chain === 'filed',
      attested: rs.some(r => WORK_ATTESTING.has(r.chain)),
      damaged: rs.some(r => !CHAIN_STAGES.has(r.chain)),
    });
  }
  return out.sort((a, b) => b.at - a.at);
}

/**
 * Filed laps carrying no work-attesting row, newest first.
 *
 * Returns BOTH the in-window set and the count beyond it. The window used to be applied here and
 * the remainder dropped on the floor: pane E swept eleven fixtures and found L010 leaving the count
 * at +8 healthy laps and L011 at +9, after which `--why` reported "every lap with a baton row is
 * filed" over a ledger holding two chain deaths. A cap is fine; a SILENT cap is the false-green
 * class this file exists to fight, and the room's rule is to say what was dropped.
 *
 * DAMAGED LAPS ARE NEITHER, and that is the residue law rather than a convenience. A chain row whose
 * `chain` field is absent or outside the vocabulary parses fine, so `unreadable` never sees it — but
 * it could have BEEN the `working` row. Counting such a lap as a chain death would manufacture the
 * exact finding this tool reports, out of damage. Its attestation is UNKNOWN, so it is excluded and
 * counted separately, never filtered away. (Pane E, 2026-08-29.)
 */
/* AN OBJECT, NOT AN ARRAY WITH FIELDS HUNG OFF IT. The first version of this returned the in-window
 * array with `.older` and `.damaged` set as expandos on it — which is verbatim the defect pane B
 * landed on 2026-08-17: residue's count-what-you-cannot-parse safeguard was invisible in every
 * output mode, always, because it was an expando on an Array. Survives a `.filter`, survives a
 * `.slice`, dies in JSON, and reads as zero. Caught here before it shipped only because the record
 * names it. */
function unwitnessed(laps, window = WINDOW) {
  const dead = laps.filter(L => L.filed && !L.attested && !L.damaged);
  const inWindow = new Set(laps.slice(0, window).map(L => L.lap));
  const shown = dead.filter(L => inWindow.has(L.lap));
  return { laps: shown, older: dead.length - shown.length, damaged: laps.filter(L => L.damaged).length };
}

function line(opts = {}) {
  const now = opts.now != null ? opts.now : Date.now();
  const led = readLedger(opts.ledger || LEDGER);
  if (!(opts.ledger || LEDGER)) {
    return { text: null, why: 'cannot locate the ledger — no CONSONANCE_DATA and no data_dir in ~/.consonance.json' };
  }
  if (led.missing) return { text: null, why: 'no ledger at ' + (opts.ledger || LEDGER) };

  const open = openLaps(led.rows);
  const cl = chainLaps(led.rows);
  const un = unwitnessed(cl);
  const claim = un.laps.length || un.older || un.damaged || led.unreadable;

  // THE WORK-LEG CLAIM HAS ITS OWN EXIT, and this is pane E's 3.1 repaired rather than argued with.
  // v1 gated it on the newest lap being the dead one, which made it a PASSENGER on an open lap: E
  // swept eleven fixtures with L012 closed healthily and stdout was empty at every one, the finding
  // surviving only on `--why` \u2014 the channel `userprompt_pulse.py:151-153` deliberately does not
  // read. So the alarm went mute one healthy lap after the deaths, and the state it went mute in is
  // A QUIET LEDGER, which is precisely what a stalled loop produces. The instrument was loudest
  // while the loop ran and silent once it stopped: exactly backwards.
  //
  // The contract "prints nothing, exits 0" is about HAVING NOTHING TO SAY. Here there is something
  // to say, so silence now means the ledger is CLEAN rather than merely quiet \u2014 which is what a
  // reader has always been entitled to assume it meant.
  let head = open[0] || null;
  let headUnwitnessed = false;
  if (!head && cl.length && un.laps.length && un.laps[0].lap === cl[0].lap) {
    head = cl[0].newest;   // the newest lap IS the dead one \u2014 name it as the chain's position
    headUnwitnessed = true;
  }
  if (!head && !claim) {
    const any = led.rows.some(r => r && r.stage === 'chain');
    return {
      text: null,
      why: any ? 'every lap with a baton row is filed' : 'the ledger carries no baton rows yet',
      unwitnessed: 0,
    };
  }

  const parts = [];
  if (head) {
    parts.push('chain: ' + head.lap + ' ' + (CHAIN_STAGES.has(head.chain) ? String(head.chain).toUpperCase() : 'MALFORMED'));
    parts.push('holder ' + head.holder);
    if (headUnwitnessed) parts.push('WORK LEG UNWITNESSED');
  } else {
    // No live position and something to report. `no open lap` is the honest head: the chain is
    // nowhere, and that is the state in which the count below matters most.
    parts.push('chain: no open lap');
  }
  const d = opts.dirty !== undefined ? opts.dirty : dirtyCount(opts.repo || REPO);
  parts.push('dirty ' + (d === null ? '?' : d) + ' repo-wide');
  if (head && head.at) parts.push(ago(now - head.at));
  if (open.length > 1) parts.push('+' + (open.length - 1) + ' more open');
  if (led.unreadable) parts.push(led.unreadable + ' unreadable');
  if (un.damaged) parts.push(un.damaged + ' lap(s) UNKNOWN, damaged rows');
  if (un.laps.length || un.older) {
    // The denominator IS the universe print, and it rides every claim rather than being filed in a
    // header the reader of the number never opens.
    const others = un.laps.filter(l => !head || l.lap !== head.lap);
    let s = un.laps.length + ' of ' + Math.min(cl.length, WINDOW) + ' chained laps unwitnessed';
    if (others.length) {
      s += ' (' + others.slice(0, LIST_CAP).map(l => l.lap).join(',')
        + (others.length > LIST_CAP ? ',+' + (others.length - LIST_CAP) : '') + ')';
    }
    // NO SILENT CAP. What the window dropped is named in the line, not left for a reader to infer
    // from a count that quietly shrank (pane E, 3.2).
    if (un.older) s += ' \u00b7 ' + un.older + ' older beyond the ' + WINDOW + '-lap window';
    parts.push(s);
  }
  parts.push('this machine only');
  // Only where a work-leg claim was actually made: a healthy lap's line stays byte-identical to what
  // it printed before this section existed. `rows only` is the limit belonging to THIS claim \u2014 that
  // `unwitnessed` is a fact about the ledger and not about the panes.
  if (claim) parts.push('rows only');
  return {
    text: parts.join(' \u00b7 '), why: null, laps: open.length,
    unwitnessed: un.laps.length, older: un.older, damaged: un.damaged,
  };
}

function main(argv, out = console.log, err = console.error) {
  const i = argv.indexOf('--ledger');
  const r = line({ ledger: i >= 0 ? argv[i + 1] : undefined });
  if (r.text) out(r.text);
  else if (argv.includes('--why')) err('chain-status: silent — ' + r.why);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  line, openLaps, chainLaps, unwitnessed, readLedger, dirtyCount, ago, main,
  LEDGER, REPO, WORK_ATTESTING, WINDOW, LIST_CAP,
};
