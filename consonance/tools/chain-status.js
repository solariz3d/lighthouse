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

// ── THE COLLATION CLAIM (2026-08-29, pane B, non-author of everything above) ────────────────────
//
// THE FAILURE, AND ITS COVERAGE STATED HONESTLY BECAUSE THE FIRST DRAFT OVERSTATED IT. The chair
// left three laps stranded in one night and the KEEPER caught all three. THIS CLAUSE COVERS ONE OF
// THEM. Re-derived from the ledger rather than from the account:
//
//     L010  dispatched(librarian) -> map(chair) -> filed(chair)     holder never reaches panes
//     L011  dispatched(librarian) -> map(chair) -> filed(chair)     holder never reaches panes
//     L013  map(chair) -> working(PANES) 04:12:35 -> return-leg 05:32:17
//
// The two map-deaths never dispatched anyone, so no hand-back can be outstanding and this claim
// cannot fire on them — they are the UNWITNESSED clause's case, above. Only L013 is this one's.
// Two instruments, each covering the other's blind spot. Pane E made this correction to the first
// draft of this comment, which had claimed all three (attack, `loop/collation_alarm_attack_2026-08-29.md` §1).
//
// The clause above cannot see L013: it fires on a lap that is FILED with no work-attesting row, and
// this lap was open with its work leg live. The state is `holder panes` long after the panes stopped
// being the holders in any real sense.
//
// I WAS ASKED FOR A THRESHOLD — "all panes idle past N" — AND THERE IS NO N HERE, WHICH IS THE
// FINDING RATHER THAN A DODGE. Idle time cannot separate the two states that matter. A pane
// narrating tool calls writes a board entry per narration (board-digest.js:20-25), so a working
// pane is not idle; a pane inside one long silent tool call is idle and still working. The brief's
// own warning applies to its own proposal: a detector that cries wolf on a long-running pane is
// worse than none, and idleness is exactly the axis that would.
//
// THE AXIS THAT WORKS IS AN EVENT, NOT A DURATION — the same move Around made one clause up.
// A hand-back is a POSITIVE act with a row: the pane posts to the committee board. So:
//
//     A pane OWES while its newest dispatch has no committee post from it afterwards.
//     The claim fires when the chain holder is `panes` and NOBODY OWES.
//
// Nothing is inferred from silence; every member of the round has said, on the board, that it is
// done. There is no threshold to tune and none to lose by choosing.
//
// TWO LEDGERS, WHICH IS THE POINT. The holder comes from lap.jsonl; the dispatches and hand-backs
// come from board.jsonl. Neither can produce the conjunction alone, so the claim is not computed
// from the thing it asserts on. And the DENOMINATOR IS NOT SELF-REPORTED: the app writes a dispatch
// row when the text ARRIVES in the receiving pane, so a sender cannot suppress it — the same
// property BUILDING.md:339 rests its boundary check on. The numerator (a hand-back) is self-report,
// and that asymmetry runs the safe way: failing to post makes the claim STAY SILENT, never fire.
//
// THE ANCHOR IS A ROW, NOT A CLOCK. The round is the panes dispatched since the chain was last
// `filed`. Without it the claim is permanently mute: replayed over 206 historical dispatches, one
// pane that never posts leaves the outstanding set non-empty forever and every later cycle is
// suppressed. Measured, not feared.
//
// REPLAYED MOMENT BY MOMENT OVER EVERY LAP THAT REACHED holder=panes, using only rows older than
// each evaluated moment. This table is a COMMAND, not a figure somebody typed:
//
//     node consonance/tools/chain-status.js --replay
//
//     L008   round —        NEVER        chain moved 07:14:45   UNEVALUABLE — tail short of anchor
//     L009   round —        NEVER        chain moved 10:25:51   UNEVALUABLE — tail short of anchor
//     L012   round ABCEM    fires 00:59:17   chain moved 01:08:26    9m of true alarm
//     L013   round ABCEM    fires 04:27:05   chain moved 05:32:17   65m of true alarm   <- the failure
//
// ZERO false positives, and the lap it was built for is the longest by a factor of seven. The two
// UNEVALUABLE rows are the truncation guard working on real data rather than a defect: those laps
// predate the byte tail, and the tool says so instead of reporting "nobody owed". Read against the
// full 185 MB file — outside this tool's read budget, so NOT reproducible by the command above —
// they come out L008 silent with HIJKM still owing, and L009 firing 10:01:07 for a 24.7m window.
// Both are consistent with the rule; neither is evidence this tool can produce, which is why they
// are quoted here as a separate measurement and not as rows of that table.
//
// The 9m window on L012 is a TRUE statement during a healthy collation, which is why the elapsed
// time rides the line as a FACT and is never compared against anything: 9m and 65m read differently
// to a human, and choosing where between them to draw a line is the seat's job, not this file's.
// (The chair's account said 80 minutes; measured all-in to chain-moved it is 65.)
//
// WHAT THIS CLAIM CANNOT SEE — on the line, not only here:
//
//   "handbacks N of M"  — M IS THE UNIVERSE and rides every applicable line: panes dispatched since
//                         the last `filed` row. A pane that never posts sits in M forever and holds
//                         the claim silent; that is the safe direction and L008 is the measured
//                         case, so the OWING letters print rather than the silence being bare.
//   "collation UNKNOWN" — board.jsonl or letters.json unreadable, or the byte tail did not reach
//                         back to the anchor. NEVER silent on an unreadable source: silence here
//                         would mean "nobody owes", which is the false-green class this file exists
//                         to fight. Truncation is checked against the anchor, not assumed away.
//   "N board line(s) fused" — a line that held TWO complete rows glued `}{` with no newline between.
//                         This is a WRITE defect, not a read one: board_push (main.rs) appends with
//                         `writeln!` on an unbuffered File, which lands the row and its '\n' as two
//                         syscalls, so two writer threads interleave as A · B\n · \n. Measured
//                         2026-09-01: 30 of 152,806 board lines, every one exactly two rows from two
//                         different panes, every one followed by the stray empty line. Both rows
//                         are recovered and examined like any other — a dispatch inside a fused line
//                         is SEEN, not dropped — and the count prints so the defect stays visible.
//                         A line that does not decompose into complete objects is still unreadable
//                         and still UNKNOWN; salvage never guesses.
//   pane identity       — a hand-back is matched by the committee row's `pane` field. The board has
//                         historically stored free text there ('bravo', 'around', 'sibling-3d57124e'
//                         are all in the record), so whether that field is mount-resolved or
//                         poster-supplied is NOT verifiable from this seat. A pane posting under
//                         another's tag would satisfy this join falsely. Stated, not solved.
//   truncated ids       — the dispatch row carries an 8-hex PREFIX of the target, so the join to a
//                         letter goes through letters.json by prefix. An ambiguous or unmatched
//                         prefix leaves that pane OWING and counted as unresolved, never dropped.
//   the librarian seat  — it hands back through `call_chair`, which the board attributes to `chair`
//                         and not to the seat. If that seat is in a round and returns only that
//                         way it reads as owing and the claim stays silent. It did post committee
//                         rows in L012 and L013 so this did not bite there; it is a live hazard.
//   a post is not a     — the ONE limit that runs the UNSAFE way, so it is stated first among these.
//   hand-back             `post_board` is a general channel. A pane posting "starting now" clears
//                         its obligation exactly as a completed hand-back does, and the claim would
//                         fire early. Nothing here reads the text to tell them apart, deliberately:
//                         support cannot be inferred from position, and a classifier here would be
//                         wrong in the direction that reads clean. Every pane post on the night this
//                         was built was in fact a hand-back; nothing enforces that.
//   silenced by the     — pane E's §4, and it applies to this clause unchanged. `lap-row.js --stage
//   seat it watches       handbacks-in` moves the holder off `panes` and the claim is gone for that
//                         lap, with no collation done, in one command — by the seat whose failure it
//                         detects. And a fresh dispatch to any pane makes that pane owe again, so
//                         ASKING a pane whether it is done silences the claim about it. That
//                         direction is safe (silent, never false-firing) and it is still a hole.
//   partial collation   — reading one hand-back of four is indistinguishable from reading all four.
//                         This claim is about whether the WORK is in, never about whether it was
//                         read.
//   blind windows       — muted and declared, never silently. See the gate in collation().
//   not a verdict       — "nobody owes" is a fact about rows. Whether collation is late, or the
//                         chair is mid-read, is the seat's call. No advice is printed.
//
// WHAT PANE E'S ATTACK (`loop/collation_alarm_attack_2026-08-29.md`) CHANGED HERE, since a critique
// that lands should be visible in the thing it landed on: §1 corrected the coverage claim above
// (three failures -> one); §2b required the blind gate and it is in; §4 is the paragraph two up.
// What it does NOT apply to is most of the rest of it — §2a, §2c and §3 all attack an IDLE-TIME join
// computed from the rendered `[panes]` digest, which is the design the brief proposed and this is
// not. E and I converged independently on the same replacement: E's §2c says the bare-tag rows "are
// the better signal here — a pane posting to the board is a pane completing," which is the rule
// built above, reached from the other side.

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
const BOARD = process.env.CONSONANCE_BOARD || (DATA_DIR ? path.join(DATA_DIR, 'board.jsonl') : null);
const LETTERS = process.env.CONSONANCE_LETTERS || (DATA_DIR ? path.join(DATA_DIR, 'letters.json') : null);
/* board.jsonl is 185 MB and grows forever; this runs from the pulse hook on every prompt in every
 * seat, so only a tail is read. The size is not a threshold on the CLAIM — it is a read budget, and
 * whether it reached far enough is CHECKED against the anchor rather than hoped for. Same tail
 * discipline as board-digest.js:165, one order larger because the anchor can be a cycle back. */
const BOARD_TAIL_BYTES = 8 * 1024 * 1024;
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

/**
 * The last N bytes of a file, whole lines only, plus whether the read was truncated.
 * Truncation is RETURNED, never swallowed: a tail that did not reach the anchor cannot support a
 * "nobody owes" claim, and reporting one anyway is the false green.
 */
function tail(file, maxBytes) {
  let fd;
  try {
    const size = fs.statSync(file).size;
    const from = Math.max(0, size - maxBytes);
    const buf = Buffer.alloc(size - from);
    fd = fs.openSync(file, 'r');
    fs.readSync(fd, buf, 0, buf.length, from);
    const text = buf.toString('utf8');
    // A partial first line is dropped; that is the only byte the truncation costs.
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (from > 0) lines.shift();
    return { lines, truncated: from > 0 };
  } catch (_) {
    return null;
  } finally {
    if (fd !== undefined) try { fs.closeSync(fd); } catch (_) { /* nothing to do */ }
  }
}

/**
 * One board line -> its rows, or null if the line is unreadable.
 *
 * The common case is one row. The salvaged case is a FUSED line: two complete rows glued `}{` with
 * no newline between, the torn-append shape board_push produces when two writers race (see the
 * header). Salvage never guesses: it only splits at a `}{` boundary where the prefix is itself a
 * complete JSON object, and JSON permits exactly one top-level value, so that boundary is unique —
 * a prefix that parses cannot be extended to a longer one that also parses. Every recovered piece
 * must be a plain object; a line that leaves any remainder unparsed is unreadable, not partially
 * readable, because a half-recovered line is the false green wearing a repair.
 *
 * @returns {{ rows: object[], fused: boolean } | null}
 */
function parseBoardLine(raw) {
  const isRow = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  let e;
  try { e = JSON.parse(raw); } catch (_) { e = undefined; }
  // A whole line that parses is returned as-is, object or not — the caller's role/ts guard has
  // always skipped non-rows silently, and this repair changes only what happens on a parse FAILURE.
  if (e !== undefined) return { rows: [e], fused: false };

  const rows = [];
  let rest = String(raw);
  while (rest.length) {
    let cut = -1;
    let head;
    for (let i = rest.indexOf('}{'); i !== -1; i = rest.indexOf('}{', i + 1)) {
      try { head = JSON.parse(rest.slice(0, i + 1)); } catch (_) { continue; }
      cut = i + 1;
      break;
    }
    if (cut === -1) {
      // No fused boundary left: the remainder must be a whole row on its own, or the line is bad.
      try { head = JSON.parse(rest); } catch (_) { return null; }
      if (!isRow(head)) return null;
      rows.push(head);
      break;
    }
    if (!isRow(head)) return null;
    rows.push(head);
    rest = rest.slice(cut);
  }
  return rows.length > 1 ? { rows, fused: true } : null;
}

/* A→ALPHA and back. Copied rather than imported for the reason stated at fromConfig(): this is
 * called from a hook that must survive the repo moving. Only the letters this room has assigned. */
const CALLSIGN_TO_LETTER = {
  ALPHA: 'A', BRAVO: 'B', CHARLIE: 'C', DELTA: 'D', ECHO: 'E', FOXTROT: 'F', GOLF: 'G',
  HOTEL: 'H', INDIA: 'I', JULIETT: 'J', KILO: 'K', LIMA: 'L', MIKE: 'M', AROUND: 'C',
};

/** The dispatch row the app writes on arrival. The target id is TRUNCATED in the text. */
const DISPATCH_RE = /^chair injected \([^)]*\) -> ([0-9a-fA-F][0-9a-fA-F-]{5,}) \[([^\]]+)\]/;

/**
 * A pane identifier as it appears on the board -> its letter, or null.
 * Null is a real answer here and is counted as UNRESOLVED; it never falls back to a guess, because
 * a wrong letter would either invent a hand-back or invent an obligation.
 */
function toLetter(raw, letters) {
  const s = String(raw == null ? '' : raw).trim();
  if (!s) return null;
  if (letters && Object.prototype.hasOwnProperty.call(letters, s)) return letters[s];
  if (/^[0-9a-f]{6,}$/i.test(s) && letters) {
    const hits = Object.keys(letters).filter(k => k.toLowerCase().startsWith(s.toLowerCase()));
    return hits.length === 1 ? letters[hits[0]] : null;   // ambiguous prefix resolves to nothing
  }
  const u = s.toUpperCase();
  if (CALLSIGN_TO_LETTER[u]) return CALLSIGN_TO_LETTER[u];
  return /^[A-Z]$/.test(u) ? u : null;
}

/**
 * Who was dispatched since the chain was last filed, and who has posted a hand-back since.
 *
 * @returns {{state:'n/a'|'unknown'|'owing'|'all-in', ...}} — `unknown` whenever a source could not
 * be read or the byte tail did not reach the anchor. There is deliberately no path that returns
 * 'all-in' from missing data.
 */
function collation(opts = {}) {
  const now = opts.now != null ? opts.now : Date.now();
  const anchor = opts.anchor || 0;      // the previous `filed` row; 0 means "no cycle boundary yet"

  // ── THE BLIND GATE, and it is pane E's attack §2b, which said not to ship without it ──────────
  // This claim carries CROSS-PANE STATE — which panes are in the round, which of them still owe —
  // onto a line the pulse prints in every seat. `blind.js` exists to mute exactly that traffic, and
  // reading board.jsonl directly routes around it: not a bug in this code, but the leak blind.js
  // was built to close, re-opened one hook over. Gated here, at the source of the cross-pane facts,
  // rather than at the printer, so no later caller can forget.
  //
  // FAIL CLOSED AND DECLARE, per blind.js's own decisions 3 and 5: a marker present but unreadable
  // MUTES, and every mute says so on the line. The require is wrapped because this file's standing
  // rule is that it must survive the repo moving — and an unloadable blind module mutes too, which
  // is the only direction that cannot leak.
  const boardPath = opts.board !== undefined ? opts.board : BOARD;
  const lettersPath = opts.letters !== undefined ? opts.letters : LETTERS;
  if (!boardPath) return { state: 'unknown', why: 'no board path resolved' };

  // The marker is read from the SAME STORE as the board, never from the module-level data dir —
  // the store is the unit for every other file this claim joins, and a fixture must not consult the
  // live machine's window.
  {
    let st;
    try {
      st = (opts.blindState || require('../hooks/blind.js').blindState)(
        path.join(path.dirname(boardPath), 'blind.lock'));
    } catch (_) { st = { blind: true, reason: 'blind.js unavailable' }; }
    if (st && st.blind) return { state: 'unknown', why: 'blind window — cross-pane state withheld (' + st.reason + ')' };
  }

  let letters = opts.lettersMap;
  if (!letters) {
    try { letters = JSON.parse(fs.readFileSync(lettersPath, 'utf8').replace(/^﻿/, '')); }
    catch (_) { return { state: 'unknown', why: 'letters.json unreadable' }; }
  }

  const t = opts.boardLines ? { lines: opts.boardLines, truncated: !!opts.boardTruncated }
    : tail(boardPath, BOARD_TAIL_BYTES);
  if (!t) return { state: 'unknown', why: 'board unreadable' };

  const dispatched = new Map();   // letter -> newest dispatch ts
  const posted = new Map();       // letter -> newest committee post ts
  let unresolved = 0;
  let unconfirmed = 0;
  let earliest = Infinity;
  let unreadable = 0;
  let fused = 0;
  const rows = [];
  for (const raw of t.lines) {
    // COUNTED, never filtered away — residue.js's law, and it caught this file's own first draft.
    // A board that parses to nothing yielded an empty round, which yielded `n/a`, which printed
    // SILENT. A damaged source reading as "nothing to say" is the false green the brief warned
    // about, reproduced inside the fix for it.
    const parsed = parseBoardLine(raw);
    if (!parsed) { unreadable++; continue; }
    if (parsed.fused) fused++;
    for (const e of parsed.rows) rows.push(e);
  }
  for (const e of rows) {
    if (!e || e.role !== 'committee' || !e.ts) continue;
    if (e.ts < earliest) earliest = e.ts;
    if (e.ts > now) continue;
    const m = DISPATCH_RE.exec(String(e.text || ''));
    if (m) {
      if (e.ts <= anchor) continue;
      const L = toLetter(m[1], letters);
      if (!L) { unresolved++; continue; }
      if (!/^delivered/i.test(m[2])) unconfirmed++;
      if (e.ts > (dispatched.get(L) || 0)) dispatched.set(L, e.ts);
      continue;
    }
    if (String(e.pane) === 'chair') continue;   // the chair's own traffic is not a hand-back
    const L = toLetter(e.pane, letters);
    if (L && e.ts > (posted.get(L) || 0)) posted.set(L, e.ts);
  }

  // THE TRUNCATION CHECK, and it is the whole reason the tail is allowed to be a tail. If the bytes
  // read do not reach back past the anchor, a dispatch could sit before the window and be invisible
  // — which would understate M and could turn an owing round into a false 'all-in'.
  if (unreadable) {
    return { state: 'unknown', why: unreadable + ' board line(s) unreadable', unreadable, fused,
      examined: dispatched.size };
  }
  if (t.truncated && earliest !== Infinity && earliest > anchor) {
    return { state: 'unknown', why: 'board tail did not reach the anchor', examined: dispatched.size, fused };
  }
  if (unresolved) {
    return { state: 'unknown', why: unresolved + ' dispatch target(s) unresolved to a letter',
      examined: dispatched.size, unresolved, fused };
  }
  if (!dispatched.size) return { state: 'n/a', why: 'no dispatches since the anchor', fused };

  const owing = [];
  let allIn = 0;
  for (const [L, at] of dispatched) {
    const back = posted.get(L);
    if (!back || back <= at) owing.push(L);
    else if (back > allIn) allIn = back;
  }
  const examined = dispatched.size;
  const round = [...dispatched.keys()].sort();
  if (owing.length) {
    return { state: 'owing', examined, round, owing: owing.sort(), in: examined - owing.length, unconfirmed, fused };
  }
  return { state: 'all-in', examined, round, in: examined, allIn, unconfirmed, fused };
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
  // THE COLLATION CLAIM, and it is applicable in exactly one state. `holder chair` and
  // `holder librarian` lines stay byte-identical to what they printed before this existed: the
  // question "have the panes handed back" is meaningless when the panes are not the holder, and a
  // segment that rides every line is a segment that stops being read.
  //
  // THE BOARD IS RESOLVED BESIDE THE LEDGER IN USE, never from the module-level DATA_DIR. The first
  // version read the live C:\Consonance\data board while driven by a temp-dir fixture, and Around's
  // byte-identical test caught it on the first run: a fixture lap was being joined against a real
  // night's dispatches. Two ledgers only make a conjunction when they are the SAME STORE.
  //
  // A STORE WITH NO board.jsonl IS NOT A ROOM RUNNING A COMMITTEE, so the claim is n/a and silent —
  // the same applicability cut carrier-drift.js makes for CH-4 over a tree with no roots, and for
  // the same reason: a tool must not report a defect against its own test harness. A board that
  // EXISTS and cannot be read is the other case entirely, and that one is loud.
  let col = null;
  if (head && head.holder === 'panes' && !headUnwitnessed) {
    const store = path.dirname(opts.ledger || LEDGER || '.');
    const board = opts.board !== undefined ? opts.board : path.join(store, 'board.jsonl');
    const letters = opts.letters !== undefined ? opts.letters : path.join(store, 'letters.json');
    const prevFiled = cl.filter(L => L.filed).map(L => L.newest)
      .filter(r => r.at < (head.at || 0)).sort((a, b) => b.at - a.at)[0];
    if (opts.collation !== undefined) col = opts.collation;
    else if (!board || !fs.existsSync(board)) col = { state: 'n/a', why: 'no board.jsonl in ' + store };
    else col = collation({ now, anchor: prevFiled ? prevFiled.at : 0, board, letters });
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
  // The universe rides the claim, and the UNKNOWN rides it too. Never silent on an unreadable
  // source: silence here reads as "nobody owes", which is the state the claim exists to announce.
  if (col && col.state === 'unknown') {
    parts.push('collation UNKNOWN — ' + col.why);
  } else if (col && col.state === 'owing') {
    parts.push('handbacks ' + col.in + ' of ' + col.examined + ' (owing ' + col.owing.join(',') + ')');
  } else if (col && col.state === 'all-in') {
    parts.push('HANDBACKS IN, NOT COLLATED — ' + col.examined + ' of ' + col.examined +
      ' (' + col.round.join(',') + '), last ' + ago(now - col.allIn) + ' ago');
  }
  if (col && col.unconfirmed) parts.push(col.unconfirmed + ' dispatch(es) delivery-unconfirmed');
  // A fused line is recovered, not cleaned: the count prints so the torn-append defect in
  // board_push stays visible from the one line everyone reads, instead of vanishing into a repair.
  if (col && col.fused) parts.push(col.fused + ' board line(s) fused, rows recovered');

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

/**
 * The collation rule replayed over history, evaluated at successive moments using ONLY rows older
 * than each moment. This exists so the four-lap table in the header is a COMMAND rather than a
 * figure somebody typed: `node consonance/tools/chain-status.js --replay`. The room's rule is that
 * every number in prose re-derives from one run of a visible instrument, and a table about the
 * tool's own accuracy is the last place to break it.
 */
function replay(opts = {}, out = console.log) {
  const led = readLedger(opts.ledger || LEDGER);
  const store = path.dirname(opts.ledger || LEDGER || '.');
  const board = opts.board !== undefined ? opts.board : path.join(store, 'board.jsonl');
  const letters = opts.letters !== undefined ? opts.letters : path.join(store, 'letters.json');
  const chain = led.rows.filter(r => r && r.stage === 'chain' && r.lap).sort((a, b) => (a.at || 0) - (b.at || 0));
  const at = (T) => {
    const seen = chain.filter(r => (r.at || 0) <= T);
    if (!seen.length) return null;
    const head = seen[seen.length - 1];
    if (head.holder !== 'panes') return { fire: false };
    const prev = seen.filter(r => r.chain === 'filed').pop();
    const c = collation({ now: T, anchor: prev ? prev.at : 0, board, letters });
    return { fire: c.state === 'all-in', c };
  };
  const STEP = 30000;
  out('lap    holder=panes at   round        first fires   chain moved   window');
  for (const lap of [...new Set(chain.map(r => r.lap))]) {
    const rs = chain.filter(r => r.lap === lap);
    const work = rs.find(r => r.holder === 'panes');
    if (!work) continue;
    const next = rs.find(r => r.holder !== 'panes' && (r.at || 0) > work.at);
    const end = next ? next.at : Date.now();
    let first = null;
    for (let T = work.at; T <= end && !first; T += STEP) if ((at(T) || {}).fire) first = T;
    const last = at(end - 1000) || {};
    const hm = (t) => (t ? new Date(t).toTimeString().slice(0, 8) : '—');
    // The last column names the STATE, never a bare "silent". A row that could not be evaluated
    // and a row that was evaluated and found nobody owing must not read the same way; that is the
    // whole defect class this file is about, and it applies to this file's own output first.
    const why = first && next ? ago(next.at - first) + ' of true alarm'
      : !last.c ? 'not applicable — holder was not panes at the end of the span'
        : last.c.state === 'unknown' ? 'UNEVALUABLE — ' + last.c.why
          : last.c.state === 'n/a' ? 'n/a — ' + last.c.why
            : last.c.owing && last.c.owing.length ? 'silent — owing ' + last.c.owing.join(',')
              : 'silent';
    out([lap.padEnd(6), hm(work.at).padEnd(17),
      ((last.c && last.c.round ? last.c.round.join('') : '—') || '—').padEnd(12),
      (first ? hm(first) : 'NEVER').padEnd(13), hm(next && next.at).padEnd(13), why].join(' '));
  }
  out('');
  out('Rows only, this machine only. NEVER has two causes and the last column separates them:');
  out('`silent — owing X` is a lap where somebody still owed a hand-back for its whole span (the');
  out('safe direction); `UNEVALUABLE` is a lap the tool could not read far enough back to judge,');
  out('and it is not evidence of anything.');
  return 0;
}

function main(argv, out = console.log, err = console.error) {
  const i = argv.indexOf('--ledger');
  const ledger = i >= 0 ? argv[i + 1] : undefined;
  if (argv.includes('--replay')) return replay({ ledger }, out);
  const r = line({ ledger });
  if (r.text) out(r.text);
  else if (argv.includes('--why')) err('chain-status: silent — ' + r.why);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  line, openLaps, chainLaps, unwitnessed, readLedger, dirtyCount, ago, main, collation, toLetter, tail, replay,
  LEDGER, REPO, BOARD, LETTERS, WORK_ATTESTING, WINDOW, LIST_CAP, BOARD_TAIL_BYTES, DISPATCH_RE, parseBoardLine,
};
