#!/usr/bin/env node
// lap-row.js - one row per lap of the loop, because three registered falsifiers currently read
// from nothing.
//
// WHY THIS EXISTS, and it is a hole rather than a feature request.
//
// `brief/BUILDING.md` documents the loop the room runs - ENTRY, once, by either door
// (you -> orchestrator -> librarian, OR you -> librarian), then the ring that repeats on its own:
// orchestrator -> panes -> librarian -> orchestrator. The user is the ENTRY, not a station the loop
// returns to (2026-09-02, `0714963` and `c177984`). Its joint step ends: "Every lap leaves a row
// [...] The falsifiers in this document read from that row and from nothing else." There was no
// row. Three falsifiers were registered against a record that did not exist, which is the same
// shape as the document itself landing in the bundle and being read by nothing for its first hour.
//
// THE NUMBER THIS TOOL EXISTS TO PRODUCE, and it is the only one the loop generates:
//
//     per lap, the orchestrator's GUESSED paths  intersect  the librarian's MAP
//
//   always equal    -> the librarian is redundant and should be shut off
//   never overlap   -> the orchestrator is not holding context
//
// Neither seat can produce it alone. That is what makes it worth recording and what makes it
// fragile: it is a number about two parties, written down by one of them.
//
// THE ORDERING IS ENFORCED IN CODE, NOT IN A COMMENT. A guess revised after the map is not a prior,
// it is a copy, and the metric would be worthless. Three mechanisms, because a comment saying
// "record the guess first" is precisely the kind of convention this repo keeps finding under rocks:
//
//   1. `--open` MINTS the lap id. It accepts no id, so a guess cannot be attached to a lap that
//      already exists - there is no argument through which to do it.
//   2. A second `--open` for a minted id is refused, and a `--map` on a lap that already has one is
//      refused. The ledger is append-only; nothing is ever rewritten in place.
//   3. THE SEAL. When a map is written it stores `guess_seal`, a hash of the open row's normalised
//      guess. `--report` recomputes it. A guess edited by hand after the fact - the one route the
//      argument surface cannot close - makes the seal mismatch, and the lap is reported TAMPERED
//      and EXCLUDED from the metric rather than quietly counted.
//
// Usage:
//   node lap-row.js --open --initiator <human|chair|pane|librarian> --entry <orch|lib|ring>
//                    --inquiry <text> --guess <p[,p...]> [--blind]
//   node lap-row.js --map <lap-id> --paths <p[,p...]>
//   node lap-row.js --opened <lap-id> --paths <p[,p...]>
//   node lap-row.js --stage <lap-id> <stage> --holder <station> [--to <letters>] [--note <text>]
//   node lap-row.js --void <lap-id> --reason <text> --by <seat>
//   node lap-row.js --report [--last N]
//
// THE CHAIN (`--stage`) IS A SECOND, INDEPENDENT MEASUREMENT SHARING ONE LEDGER. The columns above
// answer "did the map reach the work". The chain answers "whose turn is it, right now" - added
// 2026-08-25 after the chair compacted while the librarian held four uncommitted files and the
// ring arrived after "ready to compact". No seat can see another seat's PHASE; the board carries
// content that must be chosen to be read. A chain row is a BATON: written by whoever COMPLETES a
// stage, naming who must act NEXT. `chain-status.js` is its reader. The two measurements do not
// interact - see the comment at chain() for the collision that had to be avoided to keep it so.
//
// The ledger lives OUTSIDE the repo, beside board.jsonl and ferry.jsonl, because it is machine
// state and not a trace: C:\Consonance\data\lap.jsonl
//
// WHAT THIS NUMBER CANNOT DISTINGUISH - printed by --report as well, because a limit that lives
// only in a header is a limit the reader of the number never sees:
//
//   a. A GOOD PRIOR FROM A GUESS WRITTEN TO SCORE. A guess naming a whole directory intersects
//      anything; a guess naming one obscure file intersects nothing. Directory-shaped guesses are
//      therefore counted as BROAD and excluded from the intersection entirely - counting them
//      either way is the exploit. Excluding them makes the exploit VISIBLE (guessed drops to zero)
//      instead of rewarding it, which is the most this tool can do.
//   b. AGREEMENT FROM ANCHORING. If the orchestrator's guess was shown to the librarian, a matching
//      map is not evidence the corpus agreed - it is evidence the librarian read the guess.
//      `--blind` records that the guess was withheld. Unmarked laps are UNKNOWN, and the
//      redundancy reading is refused on them rather than computed anyway.
//   c. A PATH OPENED BECAUSE THE MAP NAMED IT from a path the seat would have opened regardless.
//      The row records what was opened, never why.
//   d. WHETHER THE LAP HAPPENED AT ALL. Every row here is written by hand by a participant. This
//      is a self-report ledger, and the room's own standard says curated input is not an outside.
//      The one uncurated signal available is the SEAL, which detects a rewritten guess and nothing
//      else.
//   e. AN ENTRY FIELD EDITED AFTER THE FACT. `guess_seal` hashes the GUESS and nothing else, and it
//      is not widened to cover `entry` because that would recompute every historical seal and file
//      the whole existing ledger as TAMPERED - breaking the reader on history to close a hole that
//      is smaller than the break. So a lap relabelled `lib` after the chair failed to seal reads as
//      a legitimate direct entry, and the ledger cannot tell. Named here rather than defended.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

/* Resolved, not hardcoded. `portable-paths.js` classed the previous literals FATAL-DEFAULT: a
 * machine-specific default that silently works on one box and silently writes to the wrong place
 * on any other. Same shape as the two halves of this program disagreeing about the data dir.
 *
 * The order is the one every peer hook already uses (`hooks/transcript-watch.js` dataDir()):
 * env override, then ~/.consonance.json, then the literal as a last resort. The loose-parse
 * guard matters -- a hand-written config must not sink the read. */
const os = require('os');

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
const REPO = process.env.LAP_REPO || fromConfig('room_path') && path.resolve(path.dirname(fromConfig('room_path')), '..')
  || path.resolve(__dirname, '..', '..');

// A RATE NEEDS AN n. ferry.js printed 97.2% off a denominator its instrument could not have
// observed, then 0.0% off n=3; both were the same defect pointing opposite ways. Under this floor
// the counts print and the ratio does not.
const RATE_FLOOR = 5;

// A MAP ROW WRITTEN WITHIN THIS MANY SECONDS OF ITS OPEN ROW CANNOT BE A FRESH LIBRARIAN MAP. Found
// 2026-08-31 while building the void stage: the gap is 0.1 s on five of eighteen scored laps and
// under 40 s on eight. The librarian's own maps on this ledger took 171 s and 199 s (L011, L019);
// the earliest laps took minutes. One seat writing both rows in one command sequence is the only
// thing that produces a tenth of a second — which is either a chair-authored map (L020, admitted)
// or a guess recorded AFTER the map already existed on the board, which is not a prior. The seal
// cannot see either: it detects a guess EDITED after the map row, not a guess WRITTEN after the map.
// The gap is printed per lap and counted, never used to exclude — voiding is a judgement that
// carries a reason, and this constant is a threshold that carries none.
const FRESH_MAP_FLOOR_S = 60;

// BUILDING.md's falsifier is stated over ten dispatches, and this tool's own over ten laps.
const WINDOW = 10;
// Pane E's falsifier is stated over twenty chair commits.
const COMMIT_WINDOW = 20;

/* WHO STARTED THE LAP. `librarian` added 2026-09-02 (L033) for a defect hit live: `--entry lib`
 * existed and `--initiator librarian` did not, so a lap the librarian originated could record the
 * DOOR and not the SEAT. The chair recorded L033 as `chair` with a prose note in the inquiry text
 * saying the value was wrong — a ledger explaining its own row is the shape this file exists to
 * remove.
 *
 * `librarian` is NOT `pane`. That vocabulary ruling is the librarian's own, made this same night
 * (`librarian/2026-09-02.md:433`) about `holder`, and it applies to this field unchanged: a seat is
 * not a station and a station is not a seat.
 *
 * WHAT THIS DOES TO FALSIFIER 2, stated because a field this one reads is not free to change
 * quietly: falsifier 2 counts `initiator === 'human'` over `valid.length`. Laps the librarian
 * originated were ALREADY being opened — as `chair` — so neither the numerator nor the denominator
 * moves. The printed share is unchanged by this edit; what changes is that the `init` column stops
 * saying `chair` about laps the chair did not start. */
const INITIATORS = new Set(['human', 'chair', 'pane', 'librarian']);

/* WHO HOLDS THE BATON. A STATION, never a seat — the librarian's ruling of 2026-09-02
 * (`librarian/2026-09-02.md:433`), adopted here as the WRITE-side gate it asked for.
 *
 * WHAT WENT WRONG WITHOUT IT. Between 09-01 12:25 and 09-02, four `dispatched` rows were written
 * with a PANE NAME in `--holder` (charlie, bravo, bravo, echo). Both readers key on the station
 * vocabulary: `chain-indicator.js` holderArrow drew no arrow, and `chain-status.js:721`/`:804`
 * skipped those laps. The repair actually made was to teach a READER to skip non-station holders —
 * widening the readers, which the aura packet said would bless the fan-out error. This is the other
 * repair: refuse at the write, keep the readers narrow.
 *
 * AND IT IS WRONG BY CONSTRUCTION ON A FAN-OUT, which is the reason that outranks the readers. On
 * the night the drift was found, A, B, C and E were all out and the row said `echo`. One pane name
 * cannot name four panes. The pane identity is real information, so it gets its own field — `--to`
 * — rather than being overloaded onto the baton.
 *
 * Measured against the live ledger before this shipped (`C:\Consonance\data\lap.jsonl`,
 * `grep -o '"holder":"[^"]*"' | sort | uniq -c`): 114 of 118 holder writes are already one of these
 * four; the four this refuses are exactly the four drifted rows. This gate rejects nothing anyone
 * has legitimately written. `keeper` is deliberately NOT here: it appears in `chain-status.test.js`
 * fixtures (written as raw rows, which this never sees) and has never been written to the live
 * ledger.
 *
 * The four drifted rows are NOT edited. The ledger is append-only; the live reading is repaired by
 * appending a corrected row, which is the chair's command and not this file's business. */
const STATIONS = new Set(['chair', 'panes', 'librarian', 'none']);

/* WHICH DOOR THE WORK CAME IN BY. `brief/BUILDING.md` THE JOINT STEP, the keeper 2026-09-02: work
 * may enter at the orchestrator or go straight to the librarian, and "either way the chain works
 * when it starts."
 *
 * WHY THE FIELD IS NOT COSMETIC. Under door two the map arrives first by construction, so unless the
 * librarian rings the chair the inquiry before filing, the lap produces no guess. Without this field
 * that lap and one where the chair simply FAILED TO SEAL are the same row - guess column 0, nothing
 * to tell them apart - and the second is the one that should be visible. The chair mislabelled
 * exactly this on 2026-09-02, writing "no guess was sealed before the map" as though a step had been
 * skipped when nothing had: the ask entered at the librarian. A route is not a failure.
 *
 * REQUIRED on --open, for the reason --guess is required two functions down: a legitimate state must
 * be SAID rather than arrived at by omitting a flag. ABSENT on history is a different thing and is
 * left alone - rows written before this field are reported as `?` and are excluded from the door
 * readings rather than assumed to be `orch`. Assuming would manufacture the number the field exists
 * to make honest.
 *
 * `ring` ADDED 2026-09-02 (L033). See THE RING LAP below. */
const ENTRIES = new Set(['orch', 'lib', 'ring']);

/* THE RING LAP — the third value, and why it is a value of THIS field rather than a new one.
 *
 * THE DEFECT, hit live by the chair while recording L033. Both existing values are DOORS: they say
 * where the USER's inquiry came in. But `brief/BUILDING.md`'s drawing carries the keeper's second
 * amendment of the same day — *"once the loop is going the beginning chain doesnt need to be used
 * again"* — the ring `orch -> panes -> lib -> orch` repeats on its own and **the user is the ENTRY,
 * not a station**. L033 is one such lap: the librarian measured something itself, rang the chair,
 * and the chair planned and dispatched. No user inquiry entered anywhere. With only two doors on
 * offer the chair wrote `--entry orch`, which asserts door one was used, which is false, and then
 * added a note to the inquiry text admitting it. A ledger that has to explain its own row.
 *
 * WHAT WAS CONSIDERED AND REFUSED, because the alternatives are the interesting part:
 *
 *   - A ring lap should not be a lap at all; the ring is already recorded as more `--stage` rows on
 *     the SAME lap. TRUE, and it is what L029 does (three `dispatched` rows, one lap) — but that
 *     covers the ring turning again on the SAME inquiry. L033 is a DIFFERENT inquiry, discovered
 *     inside the loop. Refusing to open it would make work that happened unrecordable, which is the
 *     worse failure of the two. The ring-turns-again case needs nothing and gets nothing here.
 *   - A separate `--ring <lap>` flag, or making `--entry` optional when the initiator is not human.
 *     Optionality is refused for the reason `--guess` and `--entry` are both required already: a
 *     legitimate state must be SAID, never arrived at by omitting a flag. A second flag is more
 *     surface for one fact.
 *   - `--entry none`, matching this file's own `--guess none` / `--paths absent` idiom. Refused on
 *     ONE ground and it is the ground the chair named as the part to get right: `none` and
 *     `not recorded` are one word apart in a report someone skims, and those two are exactly the
 *     done-vs-never-started pair this room keeps failing. `ring` cannot be misread as `?`.
 *
 * WHAT `ring` IS NOT: a third door. The report prints it on its own line, folded into neither door
 * and never into `not recorded`.
 *
 * THE GUESS IS NOT FORCED ABSENT, and this is where the chair's own guess is corrected. The ask was
 * to record the guess/map number as ABSENT rather than zero on a ring lap. The first half is right
 * and is already built: an empty guess is written with `--guess none`, and `report()` reads the
 * entry field to say WHY it is empty — that is the same machinery that already separates a direct
 * entry from a chair that failed to seal, and it now says "no guess - ring lap" the same way. The
 * second half would have cost something real: L033 carried four line-numbered paths, a genuine
 * prior, and a writer that forced ABSENT would have deleted a measurement that existed. So: a ring
 * lap may carry a guess or say `none`, and the READER supplies the inapplicable-not-zero reading.
 *
 * WHAT THIS DOES TO THE TWO DOOR-TWO FALSIFIERS IN `brief/BUILDING.md`, stated explicitly because
 * `--report` is what reads them and changing the row shape changes what they can see:
 *
 *   FALSIFIER (guess sealed after the map): read as the fresh-map-floor line over the door-two
 *   laps. `ring` adds no member to that set and removes none — every `entry:"lib"` row on the live
 *   ledger (L030, L031, L032) is a genuine user direct entry. NO IMPACT.
 *
 *   FALSIFIER (three consecutive direct-entry laps with no guess): the run counter iterates every
 *   valid lap and `continue`s on anything that is not `lib` — so a ring lap neither advances nor
 *   RESETS the run, which is exactly the treatment a door-one lap already gets. NO IMPACT, and it
 *   is asserted rather than claimed: a test runs the same ledger with those laps as `orch` and as
 *   `ring` and requires the reported run to be identical.
 *
 * WHAT IS OWED AND IS NOT THIS FILE'S TO DECIDE: whether the ring rule itself — the librarian rings
 * the chair the inquiry, one line, no map, before filing — applies on a ring lap as it does under
 * door two. It structurally should: on the ring the librarian's return leg precedes the chair's
 * plan, which is door two's hazard exactly. But that falsifier is registered in BUILDING.md over
 * DIRECT-ENTRY laps, and widening what a registered falsifier counts is not a tool edit. Named for
 * whoever holds that document. */

// Three in a row is the falsifier BUILDING.md registers against the ring rule; it lives here so the
// report reads it from the ledger rather than from anyone remembering to check.
const DIRECT_NO_GUESS_RUN = 3;

// ---------------------------------------------------------------- paths

/**
 * Normalised for comparison only; the original string is kept for display.
 * A map item is "a path and a line and one clause" (BUILDING.md), so the line suffix is stripped -
 * without that, `journal/2026-08-11.md:47` and `journal/2026-08-11.md` never intersect and the
 * metric reads zero forever while both seats are naming the same file.
 */
function normPath(p) {
  return String(p).trim()
    .replace(/^[`'"]+|[`'"]+$/g, '')
    .replace(/\\/g, '/')
    .replace(/:\d+(?:-\d+)?$/, '')
    .replace(/^\.\//, '')
    .replace(/^[A-Za-z]:\/consonance\/lighthouse\//i, '')
    .toLowerCase();
}

/** Directory-shaped: a trailing slash, or no extension at all. See limit (a). */
const isBroad = p => {
  const n = normPath(p);
  return n.endsWith('/') || !/\.[a-z0-9]{1,6}$/.test(n);
};

const splitPaths = s => String(s || '').split(',').map(x => x.trim()).filter(Boolean);

/** The seal: a hash of the guess as it was when the map was written. */
const sealOf = guess => crypto.createHash('sha256')
  .update(guess.map(normPath).sort().join('\n')).digest('hex').slice(0, 16);

// ---------------------------------------------------------------- ledger

function rows() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs.readFileSync(LEDGER, 'utf8').split(/\r?\n/).filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function append(row) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
  return row;
}

function headSha() {
  try { return execFileSync('git', ['-C', REPO, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); }
  catch { return null; }
}

/** Fold the append-only events into one object per lap. */
function laps(all = rows()) {
  const byId = new Map();
  for (const r of all) {
    if (!r.lap) continue;
    if (!byId.has(r.lap)) byId.set(r.lap, { lap: r.lap, opens: [], maps: [], openeds: [], voids: [] });
    const L = byId.get(r.lap);
    if (r.stage === 'open') L.opens.push(r);
    else if (r.stage === 'map') L.maps.push(r);
    else if (r.stage === 'opened') L.openeds.push(r);
    else if (r.stage === 'void') L.voids.push(r);
  }
  return [...byId.values()].map(L => {
    const open = L.opens[0] || null;
    const map = L.maps[0] || null;
    // The void, if any. A voided lap is folded like every other so it stays VISIBLE in the report;
    // report() is where it is kept out of the totals. Dropping it here would make it vanish, which
    // is the same failure as counting it, pointing the other way.
    const voided = L.voids[0] ? { at: L.voids[0].at, reason: L.voids[0].reason, by: L.voids[0].by } : null;
    const gapS = map && open ? (map.at - open.at) / 1000 : null;
    const guess = open ? open.guess : [];
    const mapped = map ? map.paths : [];
    const opened = L.openeds.flatMap(r => r.paths);

    // Broad guesses are excluded from BOTH sides of the intersection (limit a).
    const guessNarrow = guess.filter(p => !isBroad(p));
    const gset = new Set(guessNarrow.map(normPath));
    const mset = new Set(mapped.map(normPath));
    const both = [...gset].filter(p => mset.has(p));
    const mapOnly = [...mset].filter(p => !gset.has(p));
    const openedSet = new Set(opened.map(normPath));
    const openedFromMap = [...openedSet].filter(p => mset.has(p));
    const openedFromMapOnly = [...openedSet].filter(p => mapOnly.includes(p));

    // THE SEAL, checked. A missing seal on an old row is UNSEALED, never a pass.
    let integrity = 'OK';
    if (!open) integrity = 'NO-OPEN';
    else if (map && map.guess_seal == null) integrity = 'UNSEALED';
    else if (map && map.guess_seal !== sealOf(guess)) integrity = 'TAMPERED';
    else if (L.opens.length > 1) integrity = 'DOUBLE-OPEN';
    // Ordering, checked independently of the seal: a map row written before its open row is not a
    // lap, whatever the hashes say.
    if (integrity === 'OK' && map && open && map.at < open.at) integrity = 'OUT-OF-ORDER';

    return {
      lap: L.lap, at: open ? open.at : (map ? map.at : 0),
      initiator: open ? open.initiator : null,
      // A row from before the field carries `undefined`; it is reported as absent, never as 'orch'.
      entry: open && ENTRIES.has(open.entry) ? open.entry : null,
      inquiry: open ? open.inquiry : null,
      blind: open ? open.blind : null,
      head: open ? open.head : null,
      guess, guessNarrow, guessBroad: guess.filter(isBroad),
      mapped, opened, both, mapOnly, openedFromMap, openedFromMapOnly,
      hasMap: !!map, hasOpened: opened.length > 0, integrity,
      voided, gapS,
    };
  }).sort((a, b) => a.at - b.at);
}

// MAX + 1, never first-free. Filling a gap looks tidier and is wrong: a gap can only exist if a row
// was deleted by hand, and reusing that id silently MERGES a new lap with the remains of a dead one
// - a guess from one inquiry scored against the map of another, with nothing in the output to show
// it happened.
/* RULE 2W-1 — THE LAP ID CARRIES ITS MINT SITE. Registered by pane A in
 * exo_memory/loop/two_writers_registration_2026-08-25.md, adopted here.
 *
 * THE FAILURE IT CLOSES, and it is the only SILENT one A found in ten measured shapes. This ledger
 * is machine-local (outside the repo) and mintId is max+1 over the LOCAL rows — but the ids it
 * produces get written into TRACKED prose, nine files as of that registration. Two machines both
 * mint L009 for different inquiries, each writes it into its own documents, and git merges cleanly
 * BECAUSE THEY ARE DIFFERENT FILES. No conflict, no warning, no later moment where it surfaces: the
 * record simply contains two laps with one name, and every falsifier keyed to L009 becomes
 * ambiguous retroactively and permanently.
 *
 * A's own note on why this and not the obvious fix: per-machine FILENAMES do not prevent a
 * collision, they remove the NOTIFICATION of one, and every other collision shape it found is
 * already loud. This is aimed at the failure that makes no sound.
 *
 * THE DEFAULT IS THE WHOLE SAFETY PROPERTY. A tag that is the same everywhere IS the collision, so
 * absence of config must not fall back to a constant. It falls back to the HOSTNAME's first
 * alphanumeric, which differs per machine without anyone configuring anything — the desktop is
 * protected on its first run whether or not someone remembers to set a field.
 *
 * COST, stated by A in full and not softened: ids are one character wider; L001-L008 predate the
 * rule and stay as they are, so the record carries two id shapes forever and a reader must know
 * that a bare L-id means "before 2026-08-25"; every grep for the id pattern widens. It does NOT
 * split the record, which is what per-machine filenames would have cost.
 */
function machineTag() {
  const env = (process.env.LAP_MACHINE_TAG || '').trim();
  if (env) return env[0].toUpperCase();
  const cfg = fromConfig('machine_tag');
  if (cfg) return String(cfg).trim()[0].toUpperCase();
  // No config: derive. Per-machine by construction, which is the point.
  const host = require('os').hostname().replace(/[^A-Za-z0-9]/g, '');
  return host ? host[0].toUpperCase() : 'X';
}

function mintId(all) {
  // Strip ANY single-letter prefix, not just L: after this rule the local ledger may hold ids from
  // more than one shape (a machine whose tag changed, an imported row), and a parse that only knows
  // 'L' would read those as NaN, drop them from the max, and re-mint an id that already exists —
  // reintroducing the gap-filling merge the comment below spent its whole length forbidding.
  const max = all.map(r => Number(String(r.lap || '').replace(/^[A-Za-z]/, '')))
    .filter(Number.isFinite).reduce((a, b) => Math.max(a, b), 0);
  return machineTag() + String(max + 1).padStart(3, '0');
}

// ---------------------------------------------------------------- the three writes

function open({ initiator, entry, inquiry, guess, blind, now }) {
  if (!INITIATORS.has(initiator)) {
    throw new Error(`--initiator must be one of ${[...INITIATORS].join('|')}, got ${JSON.stringify(initiator)}`);
  }
  if (!ENTRIES.has(entry)) {
    // The refusal PRINTS the vocabulary, as the chain stage refusal does: a refusal that does not say
    // what would have been accepted is one the next seat works around by guessing.
    throw new Error(`--entry must be one of ${[...ENTRIES].join('|')}, got ${JSON.stringify(entry)}. ` +
      `orch = the ask reached the orchestrator first; lib = it went straight to the librarian ` +
      `(brief/BUILDING.md, THE JOINT STEP); ring = no user inquiry entered at all - the loop ` +
      `supplied its own next lap (the keeper's amendment: the user is the ENTRY, not a station). ` +
      `A lap with no door recorded cannot tell a direct entry from a chair that failed to seal.`);
  }
  if (!inquiry || !String(inquiry).trim()) throw new Error('--inquiry is required: a lap with no inquiry cannot be read back');
  if (!guess.length) {
    // An empty guess is a legitimate state ("I have no prior"), but it must be SAID rather than
    // arrived at by omitting the flag, or a forgotten argument scores as a perfect non-overlap.
    throw new Error('--guess is required. If the orchestrator genuinely has no prior, pass --guess none');
  }
  const all = rows();
  const lap = mintId(all);
  const g = (guess.length === 1 && normPath(guess[0]) === 'none') ? [] : guess;
  const row = append({
    lap, stage: 'open', at: now, initiator, entry, inquiry: String(inquiry).trim(),
    guess: g, blind: blind === true ? true : null, head: headSha(),
  });
  // CHECKED AFTER THE WRITE, not before. Two panes opening a lap at once both read the same
  // ledger, so both mint the same id, and a pre-write check against that same snapshot cannot
  // see the other one - it is vacuous by construction, which is the defect class this repo keeps
  // finding. Re-reading afterwards is the only moment the collision is observable. The row is
  // already on disk by then and is left there (append-only); what this does is make the operator
  // see it now rather than at report time, where laps() would file it as DOUBLE-OPEN.
  if (rows().filter(r => r.lap === lap && r.stage === 'open').length > 1) {
    throw new Error(`id collision on ${lap}: two open rows now exist. Both are on disk and the lap ` +
      `will report DOUBLE-OPEN. Resolve by hand before either is mapped`);
  }
  return row;
}

function map(lap, paths, now) {
  const all = rows();
  const mine = all.filter(r => r.lap === lap);
  if (!mine.length) throw new Error(`no such lap: ${lap}`);
  const openRow = mine.find(r => r.stage === 'open');
  if (!openRow) throw new Error(`lap ${lap} has no open row - a map without a guess measures nothing`);
  if (mine.some(r => r.stage === 'map')) {
    // Refused in code. An amended map is a map written knowing the guess it will be scored against.
    throw new Error(`lap ${lap} already has a map. The ledger is append-only; open a new lap rather than amending`);
  }
  if (!paths.length) throw new Error('--paths is required. If the corpus holds nothing, pass --paths absent - that is a finding');
  const p = (paths.length === 1 && normPath(paths[0]) === 'absent') ? [] : paths;
  return append({ lap, stage: 'map', at: now, paths: p, guess_seal: sealOf(openRow.guess), head: headSha() });
}

function opened(lap, paths, now) {
  const all = rows();
  const mine = all.filter(r => r.lap === lap);
  if (!mine.length) throw new Error(`no such lap: ${lap}`);
  if (!mine.some(r => r.stage === 'map')) {
    throw new Error(`lap ${lap} has no map yet - "opened" records which of the MAP's paths were used`);
  }
  if (!paths.length) throw new Error('--paths is required. If none were opened, pass --paths none - that is the falsifier firing, and it should be recorded');
  const p = (paths.length === 1 && normPath(paths[0]) === 'none') ? [] : paths;
  return append({ lap, stage: 'opened', at: now, paths: p, head: headSha() });
}

// ---------------------------------------------------------------- the chain (the baton)

/* WHY THIS IS A NEW ROW TYPE AND NOT MORE VALUES OF `stage`, WHICH IS WHAT I WAS ASKED FOR.
 *
 * The brief and the librarian's plan both say the chain is "a fourth-through-eighth value of a
 * field that exists" (stage: open|map|opened). Both seats read :162-164 and neither noticed that
 * `map` IS IN BOTH VOCABULARIES. Measured on a fixture ledger before a line of this was written:
 *
 *   a row {lap, stage:'map', holder:'librarian'} written as a chain row
 *     -> `--report` CRASHES: TypeError: Cannot read properties of undefined (reading 'map')
 *        (laps() folds it into L.maps, map.paths is undefined, new Set(mapped.map(...)) throws)
 *     -> and the REAL `--map` for that lap is then refused FOREVER: "lap L001 already has a map.
 *        The ledger is append-only" — unrecoverable without hand-editing the ledger.
 *
 * That is verbatim the 2026-08-17 class: a value written once permanently blocking the correct one.
 * So the chain gets its own row TYPE in the existing field — `stage: 'chain'` — with the chain
 * position in its own `chain` field. laps() matches open/map/opened and ignores anything else, so
 * the fold is untouched: verified by running --report over the same ledger with and without a chain
 * row and diffing the output, which is BYTE-IDENTICAL. Still one ledger, still append-only, still
 * one more value of `stage`. Just not a value that already means something else. */
const CHAIN_STAGES = ['inquiry', 'map', 'dispatched', 'working', 'handbacks-in', 'return-leg', 'filed'];

function chain(lap, stage, holder, note, now, to) {
  if (!lap || !String(lap).trim()) throw new Error('--stage needs a lap id: node lap-row.js --stage <lap> <stage> --holder <seat>');
  const s = String(stage || '').trim().toLowerCase();
  if (!CHAIN_STAGES.includes(s)) {
    // The vocabulary is PRINTED with the refusal. A refusal that does not say what would have been
    // accepted is a refusal the next seat works around by guessing.
    throw new Error(`unknown stage ${JSON.stringify(stage)}. The vocabulary is fixed:\n  ` +
      CHAIN_STAGES.join(' -> ') + '\n  Invent a stage and the reader prints a word no other seat knows.');
  }
  const h = String(holder || '').trim();
  if (!h) {
    // THE ROW IS A BATON, NOT A STATUS REPORT. A stage with no holder says work happened and says
    // nothing about whose turn it is, which is the exact blindness this instrument exists for.
    // Required on `filed` too: no exemption, because an exemption is where the next defect lives.
    // On `filed`, name whoever the cycle comes home to.
    throw new Error('--holder is required. The row names the NEXT holder, never the writer — a baton must name a hand.');
  }
  const all = rows();
  if (!all.some(r => r.lap === lap)) {
    // Refused so the chain can never MINT a lap. laps() creates an entry for any row carrying a
    // lap id, so a chain row for an unknown id would produce a lap with no open row that --report
    // files as NO-OPEN and excludes — a phantom in a ledger whose whole point is being countable.
    throw new Error(`no such lap: ${lap}. The chain records the progress of a lap; --open mints one.`);
  }
  /* THE STATION GATE, and it is deliberately the LAST refusal rather than the first.
   *
   * `chain-status.test.js` proves the chain cannot MINT a lap by writing `--stage L999 working
   * --holder pane-a` and asserting the refusal says `no such lap`. Put this check above the
   * existence check and that test goes red on a message about the holder, and the minting
   * assertion silently stops testing minting — a downstream suite this file does not own, broken
   * by a fix to this one. The ordering is also right on its own: whether the lap exists is a more
   * fundamental fact about the row than what its holder word is. */
  if (!STATIONS.has(h)) {
    // The librarian's wording, kept verbatim from the ruling that ordered this gate.
    throw new Error(`holder is a station; name the panes in --to. ` +
      `Got ${JSON.stringify(h)}; the vocabulary is ${[...STATIONS].join('|')}. ` +
      `A pane name here is wrong by construction on a fan-out - one name cannot name four panes - ` +
      `and both readers key on the station word, so the row goes invisible rather than wrong-looking.`);
  }
  /* THE PANE LIST, which is what makes the gate above non-lossy. Refusing `--holder echo` without
   * somewhere to put "echo" would delete real information, and a fix that deletes information is
   * how the next drift starts. Single letters only: an unvalidated free-text field is the same
   * disease one column over. */
  const toList = String(to || '').split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
  if (toList.length) {
    const bad = toList.filter(x => !/^[A-Z]$/.test(x));
    if (bad.length) throw new Error(`--to names panes by LETTER: ${JSON.stringify(bad.join(','))} is not one. Example: --to A,B,C,E`);
    if (h !== 'panes') {
      // `--to` says who the baton fanned out TO. Attached to any other station it is the same
      // overload the holder gate just closed, one field over.
      throw new Error(`--to names the panes the baton went to, so it goes with --holder panes; got --holder ${JSON.stringify(h)}.`);
    }
  }
  return append({
    lap, stage: 'chain', chain: s, holder: h, at: now,
    to: toList.length ? toList : null,
    note: note && String(note).trim() ? String(note).trim() : null,
    head: headSha(),
  });
}

// ---------------------------------------------------------------- the void (a measurement withdrawn)

/* A THIRD ROW TYPE, NOT A CHAIN STAGE, and the event that forced it is the reason it is not one.
 *
 * On 2026-08-31 the chair found that L017's and L020's map rows were CHAIR-AUTHORED — one seat
 * playing both sides of a comparison built to need two — and appended correction notes. The
 * report did not see them: a note is a chain row, and the report subtracts stages, not notes, so
 * both manufactured BOTH=3 figures stayed quotable with nothing marking them. With no void stage
 * the chair wrote L017's note through `--stage dispatched`, WHICH REOPENED A LAP THAT HAD BEEN
 * FILED (chain-status reads the last chain row), and then had to write a second `filed` row to
 * restore it. The defect demonstrated itself inside the act of documenting it.
 *
 * So: `stage: 'void'`. laps() folds it beside open/map/opened; chain-status.js reads only
 * `stage === 'chain'` and never sees it (verified in the test, byte-identical chain view before and
 * after). Voiding a MEASUREMENT is not reopening the WORK, and the two must not share a field.
 *
 * WHAT A VOID DOES: the lap's guess/map/BOTH/opened-from-map columns leave every total, and the lap
 * is PRINTED as void with its reason — never dropped. A number that quietly disappears is the same
 * failure as one that is quietly counted. WHAT IT DOES NOT DO: touch the chain, touch falsifier 2
 * (the lap still happened and its initiator is still a fact), or reverse. The ledger is append-only;
 * a void that was wrong is answered by a new lap and a note in the record beside it, not by an
 * un-void verb whose existence would make every void provisional. */
function voidLap(lap, reason, by, now) {
  if (!lap || !String(lap).trim()) throw new Error('--void needs a lap id: node lap-row.js --void <lap> --reason <text> --by <seat>');
  const r = String(reason || '').trim();
  if (!r) throw new Error('--reason is required. A void with no reason is a number that disappeared; the next reader must be able to see why it is gone.');
  const b = String(by || '').trim();
  if (!b) throw new Error('--by is required: name the seat voiding the measurement. The subject of a measure does not get to void it anonymously.');
  const all = rows();
  if (!all.some(x => x.lap === lap)) throw new Error(`no such lap: ${lap}. A void withdraws a measurement; it cannot mint one.`);
  if (all.some(x => x.lap === lap && x.stage === 'void')) {
    throw new Error(`lap ${lap} is already void. One void is the whole effect; a second reason belongs in the record beside the first, not in the ledger.`);
  }
  return append({ lap, stage: 'void', at: now, reason: r, by: b, head: headSha() });
}

// ---------------------------------------------------------------- report

function commitsSince(sha) {
  if (!sha) return null;
  try { return Number(execFileSync('git', ['-C', REPO, 'rev-list', '--count', `${sha}..HEAD`], { encoding: 'utf8' }).trim()); }
  catch { return null; }
}

function report(last, out = console.log) {
  const L = laps();
  const valid = L.filter(l => l.integrity === 'OK');
  const bad = L.filter(l => l.integrity !== 'OK');
  // THE SUBTRACTION. A voided lap leaves `scored` — the set every guess/map/BOTH total and
  // falsifier 1 are computed over — and nothing else. It stays in `valid` (falsifier 2 counts
  // initiators, and the lap was initiated) and in the table (marked VOID). Remove `!l.voided` here
  // and the manufactured numbers come back; the test proves that by doing exactly that.
  const voided = valid.filter(l => l.hasMap && l.voided);
  const scored = valid.filter(l => l.hasMap && !l.voided);

  out(`lap-row - ${LEDGER}`);
  out(`laps                   ${L.length}   (${L.filter(l => l.hasMap).length} with a map, ${L.filter(l => l.hasOpened).length} with an opened stage` +
    (voided.length ? `, ${voided.length} VOID` : '') + ')');
  if (bad.length) {
    out(`EXCLUDED               ${bad.length}   these are not counted anywhere below:`);
    for (const l of bad) out(`    ${l.lap}  ${l.integrity}`);
  }
  if (voided.length) {
    out(`VOID                   ${voided.length}   measurement withdrawn; the lap and its chain stand, its guess/map figures count nowhere below:`);
    for (const l of voided) out(`    ${l.lap}  by ${l.voided.by}: ${l.voided.reason}`);
  }
  if (!L.length) {
    out('');
    out('The ledger is empty. Every figure below would be a statement about zero laps, so none is printed.');
    out('This is the honest state on the day the tool is built, and it is what the three falsifiers');
    out('in brief/BUILDING.md have been reading from since they were registered.');
    return { laps: 0 };
  }

  // The window is over mapped laps INCLUDING voided ones, so a void is seen in its place in the
  // table rather than inferred from a gap in the ids.
  const shown = valid.filter(l => l.hasMap).slice(-(last || WINDOW));
  const gapCol = l => l.gapS == null ? '?' : (l.gapS < 1 ? l.gapS.toFixed(1) : String(Math.round(l.gapS)));
  if (shown.length) {
    out('');
    out('  lap   init    entry  blind  gap(s)  guess  broad  map  BOTH  map-only  opened  from-map');
    for (const l of shown) {
      const head = `  ${l.lap.padEnd(6)}${String(l.initiator || '?').padEnd(8)}${String(l.entry || '?').padEnd(7)}` +
        `${(l.blind === true ? 'yes' : '?').padEnd(7)}${gapCol(l).padEnd(8)}`;
      if (l.voided) { out(head + `VOID   (by ${l.voided.by} — counted nowhere; reason above)`); continue; }
      out(head +
        `${String(l.guessNarrow.length).padEnd(7)}${String(l.guessBroad.length).padEnd(7)}${String(l.mapped.length).padEnd(5)}` +
        `${String(l.both.length).padEnd(6)}${String(l.mapOnly.length).padEnd(10)}` +
        `${String(l.opened.length).padEnd(8)}${l.openedFromMap.length}`);
    }
  }

  // ---- THE NUMBER
  out('');
  out('THE NUMBER - guessed paths intersect the map, per lap');
  const blindScored = scored.filter(l => l.blind === true);
  if (scored.length < RATE_FLOOR) {
    out(`  ${scored.length} scored lap(s): below the floor of ${RATE_FLOOR}, so the counts print and no ratio does.`);
    out('  A rate over this n would measure the ledger\'s birthday, which is the error ferry.js shipped first.');
  } else {
    const g = scored.reduce((a, l) => a + l.guessNarrow.length, 0);
    const b = scored.reduce((a, l) => a + l.both.length, 0);
    const m = scored.reduce((a, l) => a + l.mapped.length, 0);
    out(`  guessed (narrow) ${g} · mapped ${m} · in both ${b}`);
    out(`  share of the guess the map confirmed   ${g ? (100 * b / g).toFixed(1) + '%' : 'n/a'}`);
    out(`  share of the map the guess had missed  ${m ? (100 * (m - b) / m).toFixed(1) + '%' : 'n/a'}`);
    if (b === g && g > 0) out('  ALWAYS EQUAL on this sample: the reading is that the librarian is redundant here.');
    if (b === 0) out('  NEVER OVERLAPPING on this sample: the reading is that the orchestrator is not holding context.');
    out(`  blind laps ${blindScored.length} of ${scored.length}.` +
      (blindScored.length < scored.length
        ? ' The redundancy reading is REFUSED on the rest: a map that saw the guess cannot corroborate it.'
        : ''));
  }
  // The gap, counted. Printed above the floor and below it alike: it is a count, not a rate.
  const fast = scored.filter(l => l.gapS != null && l.gapS < FRESH_MAP_FLOOR_S);
  if (fast.length) {
    out(`  map row within ${FRESH_MAP_FLOOR_S} s of the guess: ${fast.length} of ${scored.length} scored laps (${fast.map(l => l.lap).join(', ')}).`);
    out('  A fresh librarian map cannot be produced in that time. These are chair-authored, or a guess recorded');
    out('  after the map already existed - and the seal sees neither. Counted above regardless: the gap is a');
    out('  signal, not a verdict. Voiding is a judgement that carries a reason (--void); this line carries none.');
  }

  // ---- WHICH DOOR (BUILDING.md, THE JOINT STEP, added 2026-09-02)
  // Read over `valid`, not `scored`: a direct-entry lap that produced no guess is exactly the case
  // this section exists to make readable, and it is not in `scored` at all if it never got a map.
  out('');
  out('ENTRY - how the lap started. Two doors for a user inquiry; the ring, when there was none.');
  const byDoor = d => valid.filter(l => l.entry === d);
  const orchDoor = byDoor('orch'), libDoor = byDoor('lib'), ringLaps = byDoor('ring');
  const noDoor = valid.filter(l => l.entry === null);
  out(`  door one (orch) ${orchDoor.length} \u00b7 door two (lib) ${libDoor.length} \u00b7 ring, no user entry ${ringLaps.length}` +
    ` \u00b7 not recorded ${noDoor.length}`);
  if (noDoor.length) {
    out(`  ${noDoor.length} lap(s) carry no entry field. They are counted nowhere in this section rather than`);
    out('  assumed to be door one - and on them an empty guess is UNREADABLE: a direct entry and a chair');
    out('  that failed to seal are the same row. That hole is what the field closes, going forward only.');
  }
  if (ringLaps.length) {
    /* THE INAPPLICABLE-NOT-ZERO READING, and it is the reader's job rather than the writer's. A
     * ring lap MAY carry a real prior — L033 carried four line-numbered paths — so the writer does
     * not force the guess absent. When the guess IS empty on a ring lap, the reason is structural
     * and is said here, exactly as it is said for a direct entry: nothing was skipped. */
    const ringNoGuess = ringLaps.filter(l => l.guess.length === 0);
    out(`  ring laps: ${ringLaps.length} - no user inquiry entered; the loop supplied its own next lap`);
    out(`  ring laps with no guess: ${ringNoGuess.length} of ${ringLaps.length}` +
      (ringNoGuess.length ? ` (${ringNoGuess.map(l => l.lap).join(', ')})` : '') +
      ' - these read "no guess - ring lap", not a missed seal. INAPPLICABLE, never zero.');
  }
  if (libDoor.length) {
    // "no guess - direct entry" is the row the amendment asks for by name, in place of a
    // measurement that does not exist.
    const noGuess = libDoor.filter(l => l.guess.length === 0);
    out(`  direct-entry laps with no guess: ${noGuess.length} of ${libDoor.length}` +
      (noGuess.length ? ` (${noGuess.map(l => l.lap).join(', ')})` : '') +
      ' - these read "no guess - direct entry", not a missed seal.');
    // The ring rule's own falsifier: the guess must PRECEDE the map. A map row landing within the
    // fresh-map floor of the open row is the same signal the chair-authored check uses above.
    const late = libDoor.filter(l => l.hasMap && l.gapS != null && l.gapS < FRESH_MAP_FLOOR_S);
    if (late.length) {
      out(`  direct-entry laps whose map landed within ${FRESH_MAP_FLOOR_S} s of the guess: ${late.length} of ` +
        `${libDoor.length} (${late.map(l => l.lap).join(', ')}).`);
      out('  The ring rule is that the librarian carries the INQUIRY to the chair - one line, no map -');
      out('  before filing. These are where the guess did not really precede the map.');
    }
  }
  // The registered falsifier, read from the ledger: N direct-entry laps in a row carrying no guess.
  {
    // A ring lap is skipped by the `continue` below exactly as a door-one lap is: it neither
    // advances the run nor RESETS it. That is deliberate and it is stated in the output whenever
    // ring laps exist, because a falsifier whose blind spots live only in its source is a falsifier
    // nobody applies limits to. Widening this run to count ring laps would change what a falsifier
    // registered in brief/BUILDING.md over DIRECT-ENTRY laps is counting, which is that document's
    // call and not this file's.
    let run = 0, worst = 0;
    for (const l of valid) {
      if (l.entry !== 'lib') continue;
      run = l.guess.length === 0 ? run + 1 : 0;
      if (run > worst) worst = run;
    }
    out(`  FALSIFIER (brief/BUILDING.md, THE JOINT STEP) - ${DIRECT_NO_GUESS_RUN} consecutive direct-entry laps ` +
      `carrying no guess means the ring rule is not being kept.`);
    out(`  longest such run: ${worst}` +
      (worst >= DIRECT_NO_GUESS_RUN ? '  -> FIRES. The second door has cost the loop its only measurement.'
        : (libDoor.length ? '  -> does not fire.' : '  -> no direct-entry laps yet; nothing to read.')));
    if (ringLaps.length) {
      out(`  ${ringLaps.length} ring lap(s) are skipped by this run - they neither advance it nor reset it,`);
      out('  the same treatment a door-one lap gets. The falsifier is registered over DIRECT-ENTRY laps.');
    }
  }

  // ---- FALSIFIER 1 (BUILDING.md)
  out('');
  out(`FALSIFIER 1 (brief/BUILDING.md) - of the last ${WINDOW} Librarian dispatches, how many returned a path the receiving seat then opened?`);
  const w = scored.slice(-WINDOW);
  const answered = w.filter(l => l.openedFromMap.length > 0).length;
  const reached = w.filter(l => l.openedFromMapOnly.length > 0).length;
  if (w.length < WINDOW) {
    out(`  ${answered} of ${w.length} so far. The window is ${WINDOW} and is not full, so this is a running count, not the answer.`);
  } else {
    out(`  ${answered} of ${WINDOW}.`);
  }
  out(`  of those, ${reached} opened a path the guess had NOT named - that subset is the only one where the corpus reached the work.`);

  // ---- FALSIFIER 2 (pane E)
  out('');
  out(`FALSIFIER 2 (pane E) - over ${COMMIT_WINDOW} chair commits, the keeper-initiated share of librarian laps must fall below 1/2.`);
  const first = L[0];
  const n = commitsSince(first.head);
  const human = valid.filter(l => l.initiator === 'human').length;
  if (n === null) {
    out('  chair commits since the first row: UNKNOWN - the first row carries no HEAD sha, or git could not be read.');
  } else {
    out(`  chair commits since the first row (${String(first.head).slice(0, 7)}): ${n} of ${COMMIT_WINDOW}` +
      `   (git rev-list --count ${String(first.head).slice(0, 7)}..HEAD)`);
  }
  if (valid.length < RATE_FLOOR) {
    out(`  keeper-initiated ${human} of ${valid.length} laps: below the floor of ${RATE_FLOOR}, no share printed.`);
  } else {
    const share = human / valid.length;
    out(`  keeper-initiated ${human} of ${valid.length} laps = ${(100 * share).toFixed(1)}%` +
      (n !== null && n >= COMMIT_WINDOW ? (share < 0.5 ? '  -> window closed, falsifier does NOT fire' : '  -> window closed, FALSIFIER FIRES') : '  -> window still open'));
  }

  // ---- this tool's own falsifier
  out('');
  out(`THIS TOOL'S OWN FALSIFIER - if ${WINDOW} laps pass and no row has an opened field, the third stage is theatre.`);
  const withOpened = L.filter(l => l.hasOpened).length;
  if (L.length >= WINDOW && withOpened === 0) {
    out(`  FIRES. ${L.length} laps, 0 with an opened stage. This is a two-column measurement wearing three,`);
    out('  and the opened column should be removed or the practice repaired rather than the number kept for the look of it.');
  } else {
    out(`  ${withOpened} of ${L.length} laps carry an opened stage. ${L.length < WINDOW ? `Window not full (${WINDOW}).` : 'Does not fire.'}`);
  }

  // ---- the limits, printed WITH the number rather than filed in a header
  out('');
  out('WHAT THIS CANNOT DISTINGUISH');
  out('  a. a good prior from a guess written to score. Directory-shaped guesses are BROAD and excluded');
  out('     from the intersection entirely - counting them either way is the exploit. The broad column');
  out('     makes the attempt visible instead of rewarding it.');
  out('  b. agreement from anchoring. Unless a lap is marked --blind, a matching map may only mean the');
  out('     librarian read the guess.');
  out('  c. a path opened BECAUSE the map named it from one that would have been opened anyway.');
  out('  d. whether the lap happened at all. Every row here is self-reported by a participant; the seal');
  out('     detects a rewritten guess and nothing else.');
  out('  e. an ENTRY field edited after the fact. The seal covers the guess only, deliberately - widening');
  out('     it would file every historical lap as TAMPERED. A lap relabelled lib after a missed seal reads');
  out('     here as a legitimate direct entry - and since 2026-09-02 so does one relabelled ring, which is');
  out('     a NEW hole this field\'s third value opened and is named here rather than defended.');
  return { laps: L.length, scored: scored.length, excluded: bad.length, voided: voided.length, answered, withOpened };
}

// ---------------------------------------------------------------- cli

function main(argv, now = Date.now()) {
  const at = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  try {
    if (argv.includes('--open')) {
      const r = open({
        initiator: at('--initiator'), entry: at('--entry'), inquiry: at('--inquiry'),
        guess: splitPaths(at('--guess')), blind: argv.includes('--blind'), now,
      });
      const doorSaid = r.entry === 'lib' ? 'door two (straight to the librarian)'
        : r.entry === 'ring' ? 'the ring (no user entry - the loop supplied this lap)'
          : 'door one (the orchestrator)';
      console.log(`${r.lap}  opened by ${r.initiator} via ${doorSaid}` +
        `${r.blind ? ', blind' : ''}, ${r.guess.length} guessed path(s).`);
      console.log(`  next: node consonance/tools/lap-row.js --map ${r.lap} --paths <p,...>`);
      return 0;
    }
    if (argv.includes('--map')) {
      const r = map(at('--map'), splitPaths(at('--paths')), now);
      console.log(`${r.lap}  map recorded, ${r.paths.length} path(s), guess sealed as ${r.guess_seal}.`);
      return 0;
    }
    if (argv.includes('--opened')) {
      const r = opened(at('--opened'), splitPaths(at('--paths')), now);
      console.log(`${r.lap}  opened stage recorded, ${r.paths.length} path(s).`);
      return 0;
    }
    if (argv.includes('--stage')) {
      const i = argv.indexOf('--stage');
      const r = chain(argv[i + 1], argv[i + 2], at('--holder'), at('--note'), now, at('--to'));
      console.log(`${r.lap}  ${r.chain.toUpperCase()} — next holder ${r.holder}${r.to ? ` (${r.to.join(',')})` : ''}.`);
      return 0;
    }
    if (argv.includes('--void')) {
      const r = voidLap(at('--void'), at('--reason'), at('--by'), now);
      console.log(`${r.lap}  VOID — measurement withdrawn by ${r.by}. The lap and its chain stand; its guess/map figures count nowhere.`);
      return 0;
    }
    if (argv.includes('--report')) { report(Number(at('--last')) || 0); return 0; }
  } catch (e) {
    console.error(`lap-row: ${e.message}`);
    return 2;
  }
  console.error('usage:');
  console.error(`  lap-row.js --open --initiator <${[...INITIATORS].join('|')}> --entry <${[...ENTRIES].join('|')}> --inquiry <text> --guess <p[,p...]> [--blind]`);
  console.error(`      entry:  ${[...ENTRIES].join(' | ')}   orch = the ask reached the chair first; lib = straight to the librarian;`);
  console.error('              ring = no user inquiry entered - the loop supplied this lap itself');
  console.error('  lap-row.js --map <lap-id> --paths <p[,p...]>');
  console.error('  lap-row.js --opened <lap-id> --paths <p[,p...]>');
  console.error('  lap-row.js --stage <lap-id> <stage> --holder <station> [--to <letters>] [--note <text>]');
  console.error(`      stages: ${CHAIN_STAGES.join(' -> ')}`);
  console.error(`      holder: ${[...STATIONS].join(' | ')}   a STATION, never a pane name`);
  console.error('      --to:   the pane letters the baton fanned out to, e.g. --to A,B,C,E (with --holder panes)');
  console.error('      written by whoever COMPLETES a stage; --holder names who must act NEXT');
  console.error('  lap-row.js --void <lap-id> --reason <text> --by <seat>');
  console.error('      withdraws the lap\'s guess/map MEASUREMENT from every total; the lap stays visible and its chain is untouched');
  console.error('  lap-row.js --report [--last N]');
  return 2;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  normPath, isBroad, sealOf, rows, laps, open, map, opened, chain, voidLap, report, mintId, main,
  LEDGER, RATE_FLOOR, WINDOW, COMMIT_WINDOW, INITIATORS, ENTRIES, STATIONS, CHAIN_STAGES, FRESH_MAP_FLOOR_S,
  DIRECT_NO_GUESS_RUN,
};
