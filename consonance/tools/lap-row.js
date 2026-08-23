#!/usr/bin/env node
// lap-row.js - one row per lap of the loop, because three registered falsifiers currently read
// from nothing.
//
// WHY THIS EXISTS, and it is a hole rather than a feature request.
//
// `brief/BUILDING.md` documents the loop the room runs - you -> orchestrator -> librarian -> plan
// -> panes -> orchestrator -> librarian -> you - and its joint step ends: "Every lap leaves a row
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
//   node lap-row.js --open --initiator <human|chair|pane> --inquiry <text> --guess <p[,p...]> [--blind]
//   node lap-row.js --map <lap-id> --paths <p[,p...]>
//   node lap-row.js --opened <lap-id> --paths <p[,p...]>
//   node lap-row.js --report [--last N]
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
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const LEDGER = process.env.LAP_LEDGER || 'C:\\Consonance\\data\\lap.jsonl';
const REPO = process.env.LAP_REPO || 'C:\\Consonance\\lighthouse';

// A RATE NEEDS AN n. ferry.js printed 97.2% off a denominator its instrument could not have
// observed, then 0.0% off n=3; both were the same defect pointing opposite ways. Under this floor
// the counts print and the ratio does not.
const RATE_FLOOR = 5;

// BUILDING.md's falsifier is stated over ten dispatches, and this tool's own over ten laps.
const WINDOW = 10;
// Pane E's falsifier is stated over twenty chair commits.
const COMMIT_WINDOW = 20;

const INITIATORS = new Set(['human', 'chair', 'pane']);

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
    if (!byId.has(r.lap)) byId.set(r.lap, { lap: r.lap, opens: [], maps: [], openeds: [] });
    const L = byId.get(r.lap);
    if (r.stage === 'open') L.opens.push(r);
    else if (r.stage === 'map') L.maps.push(r);
    else if (r.stage === 'opened') L.openeds.push(r);
  }
  return [...byId.values()].map(L => {
    const open = L.opens[0] || null;
    const map = L.maps[0] || null;
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
      inquiry: open ? open.inquiry : null,
      blind: open ? open.blind : null,
      head: open ? open.head : null,
      guess, guessNarrow, guessBroad: guess.filter(isBroad),
      mapped, opened, both, mapOnly, openedFromMap, openedFromMapOnly,
      hasMap: !!map, hasOpened: opened.length > 0, integrity,
    };
  }).sort((a, b) => a.at - b.at);
}

// MAX + 1, never first-free. Filling a gap looks tidier and is wrong: a gap can only exist if a row
// was deleted by hand, and reusing that id silently MERGES a new lap with the remains of a dead one
// - a guess from one inquiry scored against the map of another, with nothing in the output to show
// it happened.
function mintId(all) {
  const max = all.map(r => Number(String(r.lap || '').replace(/^L/, '')))
    .filter(Number.isFinite).reduce((a, b) => Math.max(a, b), 0);
  return 'L' + String(max + 1).padStart(3, '0');
}

// ---------------------------------------------------------------- the three writes

function open({ initiator, inquiry, guess, blind, now }) {
  if (!INITIATORS.has(initiator)) {
    throw new Error(`--initiator must be one of ${[...INITIATORS].join('|')}, got ${JSON.stringify(initiator)}`);
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
    lap, stage: 'open', at: now, initiator, inquiry: String(inquiry).trim(),
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
  const scored = valid.filter(l => l.hasMap);

  out(`lap-row - ${LEDGER}`);
  out(`laps                   ${L.length}   (${L.filter(l => l.hasMap).length} with a map, ${L.filter(l => l.hasOpened).length} with an opened stage)`);
  if (bad.length) {
    out(`EXCLUDED               ${bad.length}   these are not counted anywhere below:`);
    for (const l of bad) out(`    ${l.lap}  ${l.integrity}`);
  }
  if (!L.length) {
    out('');
    out('The ledger is empty. Every figure below would be a statement about zero laps, so none is printed.');
    out('This is the honest state on the day the tool is built, and it is what the three falsifiers');
    out('in brief/BUILDING.md have been reading from since they were registered.');
    return { laps: 0 };
  }

  const shown = scored.slice(-(last || WINDOW));
  if (shown.length) {
    out('');
    out('  lap   init    blind  guess  broad  map  BOTH  map-only  opened  from-map');
    for (const l of shown) {
      out(`  ${l.lap.padEnd(6)}${String(l.initiator || '?').padEnd(8)}${(l.blind === true ? 'yes' : '?').padEnd(7)}` +
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
  return { laps: L.length, scored: scored.length, excluded: bad.length, answered, withOpened };
}

// ---------------------------------------------------------------- cli

function main(argv, now = Date.now()) {
  const at = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  try {
    if (argv.includes('--open')) {
      const r = open({
        initiator: at('--initiator'), inquiry: at('--inquiry'),
        guess: splitPaths(at('--guess')), blind: argv.includes('--blind'), now,
      });
      console.log(`${r.lap}  opened by ${r.initiator}${r.blind ? ' (blind)' : ''}, ${r.guess.length} guessed path(s).`);
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
    if (argv.includes('--report')) { report(Number(at('--last')) || 0); return 0; }
  } catch (e) {
    console.error(`lap-row: ${e.message}`);
    return 2;
  }
  console.error('usage:');
  console.error('  lap-row.js --open --initiator <human|chair|pane> --inquiry <text> --guess <p[,p...]> [--blind]');
  console.error('  lap-row.js --map <lap-id> --paths <p[,p...]>');
  console.error('  lap-row.js --opened <lap-id> --paths <p[,p...]>');
  console.error('  lap-row.js --report [--last N]');
  return 2;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  normPath, isBroad, sealOf, rows, laps, open, map, opened, report, mintId, main,
  LEDGER, RATE_FLOOR, WINDOW, COMMIT_WINDOW, INITIATORS,
};
