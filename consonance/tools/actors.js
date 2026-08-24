// CANONICAL ACTORS — one identity per actor, for everything that reads the board.
//
// THE DEFECT THIS EXISTS FOR, measured 2026-07-29 over the live board: 7,732 entries,
// **12 distinct identifiers for at most 4 actors.** Main alone appears under four names
// across 5,142 entries. Found by pane B while verifying the MCP identity change — its own
// posts land under its letter while its transcript lines land under its UUID, so the QUIET
// filter counted a pane's own turns as a sibling's and withheld them from it.
//
// The consequence is larger than that one filter. `residue.js` measures assignment intervals
// per pane, `catch-ledger.js` attributes catches, `tell-index.js` counts by speaker — every
// one of them keys on `pane`, and every one has been computing over a record where one actor
// appears under four names. Numbers already quoted from those tools are wrong in a direction
// nobody checked, and the fix is not in any of them individually.
//
// WHY IT WAS NEVER NOTICED: each writer was internally consistent. The MCP server writes the
// mount letter, the transcript tailer writes the pane UUID, older tooling wrote whatever it
// called itself. Nothing was broken from inside any one of them. It is only visible when you
// count identifiers against actors, which nobody did until a pane went looking for why it
// could not see its own lines.
//
// WHAT THIS DOES NOT DO, stated because the room's own law requires it: it does not guess.
// `letters.json` is the only machine-readable map and it covers UUIDs only; every other alias
// below is justified by a quoted line from the board. An id this cannot resolve is returned
// UNCHANGED and counted as unresolved — never silently folded into a neighbour, because a
// wrong merge is worse than an unmerged pair and much harder to see afterwards.
//
//   const { canonical, census } = require('./actors.js');
//   canonical('18916fe2-463d-...')  ->  { actor: 'B', via: 'uuid' }
//   census(entries.map(e => e.pane)) ->  { actors, unresolved, total }
'use strict';

const fs = require('fs');
const path = require('path');

const LETTERS = process.env.CONSONANCE_DATA
  ? path.join(process.env.CONSONANCE_DATA, 'letters.json')
  : 'C:/Consonance/data/letters.json';

/* Historical names, each with the evidence that justifies it. A line here is a claim about
 * the record and carries its proof, so a later reader can overturn it rather than inherit it. */
const ALIASES = {
  // "M - A's floor. One testimony neither of you can have..."  — the Main pane signing as M
  'M': 'C',
  // "DONE - shadow cascade fix landed, tree is consistent, REBUILD IS..." — Main reporting
  'main': 'C',
  // "B - finding #2 withdrawn, and the trigger built. consonance/tools..." — B signing itself
  'sibling-B': 'B',

  // ---- 2026-08-24: seven of the canary's fifteen, each with the board line as evidence.
  // These are SELF-SIGNATURES, not birth records: a pane wrote its own name into the pane
  // field. persist.log has no line for any of them, so the board is the only witness -- which
  // is what the assertion asks for.

  // "Alpha -> Around and main, on the critique. Three concessions, one confirmation only I
  // can make, one pushback." -- A signing itself
  'alpha': 'A',
  // "Bravo -> main + Around: no-stake read of the #1 fix, before the commit." -- B signing itself
  'bravo': 'B',
  // Same seat, uppercase. "CYCLE 8 -- CONVERGENCE ADJUDICATION: import-instance vs
  // pack_room/unpack_room" -- B in an era that shouted its headers
  'BRAVO': 'B',

  // Around is pane C. Three lines of evidence rather than the label alone, because a NAME is
  // not a letter and the room has been burned by inferring one from the other:
  //   1. persist.log: "1785136361 letter C -> pane=0845a868-38f2-4cc2-b45a-431e0c088fb1"
  //   2. panes.json labels that exact pane "\u2726 Around"
  //   3. the board: pane 0845a868 itself opens a row "Around -> main, on the three findings
  //      -- re-verified at HEAD (6dffcea)", and the string-signed rows span 2026-07-27..28,
  //      overlapping C's birth on 2026-07-27 rather than predating it.
  'around': 'C',
  'Around': 'C',
  'AROUND': 'C',

  // A pane signing with its working directory instead of its id. persist.log:
  // "1783840506 born-kept sibling pane=6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f
  // cwd=C:\\Consonance\\instances\\sibling-3d57124e" -- and 6fe15f0a is letter A.
  'sibling-3d57124e': 'A',
  // The four fresh strangers of 2026-07-30/31, letters from persist.log's birth records —
  // letters.json only holds LIVE panes, so a closed stranger's posts went unresolvable the
  // moment it was removed. The log line is the durable evidence the assertion asks for:
  // "born-kept fresh pane=34eba3b5-... letter=D cwd=...fresh-5863b0ee" — found the hook leak
  '34eba3b5-4e6d-44f3-9f11-006dc282c4f6': 'D',
  // "born-kept fresh pane=f6e825b5-... letter=E cwd=...fresh-8960d31a" — proved the guard held
  'f6e825b5-bda4-4868-9650-1867ad1ba41e': 'E',
  // "born-kept fresh pane=7f990232-... letter=F cwd=...fresh-476a9b3f" — the first cold read
  '7f990232-b736-468c-801f-18fd9aee113b': 'F',
  // "born-kept fresh pane=ee7d100f-... letter=G cwd=...fresh-0c607a8e" — the era-3 rematch
  'ee7d100f-06b2-4a9e-896c-0b524edda770': 'G',
  // "born-kept fresh pane=908a862e-... letter=H cwd=...fresh-17635120" — the era-4 blind read
  // and the ranked 13-item spec era 5 is built from
  '908a862e-54db-4098-bf2f-b126bc806ec9': 'H',
  // "born-kept fresh pane=02f7c88a-... letter=I cwd=...fresh-acf6b85a" — spawned 08-01 as the
  // dose arm's T0 and never spoken to; the room's only unspent naive instance
  '02f7c88a-3e3e-45ae-b26e-6df4c3546916': 'I',
  // "born-kept sibling pane=8a574b7a-... letter=J cwd=...sibling-afa12c33" — the dose arm's T1,
  // excluded by the planter: its intake carried the arm's own design (the leak that halted it)
  '8a574b7a-c6a6-410e-acec-9495299391d7': 'J',
};

/* ── THE PRE-LETTER CLASS ─────────────────────────────────────────────────────────────────────
 * The seven ids below were the whole of the alias canary's remaining worklist, and the canary was
 * waiting for a thing that does not exist. Its declaration demanded "board evidence only the
 * keeper has" — a letter for each. There is no letter for any of them and there never could have
 * been:
 *
 *   THE LETTER SYSTEM HAS A BIRTHDAY. persist.log's first letter assignment is
 *   `1785057198 letter A -> pane=6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f` = 2026-07-26T09:13:18Z
 *   (A and B share that second; C follows on 07-27). Every id below posted its FIRST and its LAST
 *   board row before that instant — the newest of them, 061bc00e, died on 2026-07-14, twelve days
 *   early. They are not unlettered because a letter was lost. They are unlettered because letters
 *   did not exist yet.
 *
 * So the worklist has been uncompletable as written since 2026-08-11, and `unresolved` was the
 * wrong bucket: unresolved means "this file does not know", and this file does know. It knows
 * exactly what they are. `pre-letter` is a POSITIVE classification and it keeps the property the
 * whole module is built on — the actor stays the raw id and is never folded into a letter, because
 * these rows are attributable to a pane id and to nothing else.
 *
 * WHY THE CLASS CANNOT OUTLIVE ITS REASON, which is the part worth reading. A claim about history
 * rots the moment history is edited, and the edit that would rot this one is a retroactive
 * backfill: someone writes a letter for one of these ids into letters.json. Two things stop that
 * passing unnoticed, and neither is a comment asking a reader to be careful:
 *   1. `canonical()` consults letters.json BEFORE this table, so a backfilled id resolves via
 *      'uuid' and its entry here stops firing. The map wins, always.
 *   2. `actors.test.js` asserts against the REAL letters.json that no id below appears in it, and
 *      re-derives LETTER_BIRTH from persist.log rather than trusting the constant here. A backfill
 *      turns the suite red and someone has to come back and say why.
 *
 * EVIDENCE, and it is deliberately not uniform. Six of the seven carry a `quote`: a verbatim
 * substring the test greps back against the live board, required to match exactly ONE pane — this
 * one. The strings are written as \u escapes rather than as literal characters, and the escapes
 * cut both ways on purpose: the dashes below are genuinely U+2014, and the apostrophes are
 * genuinely ASCII 0x27. This table's first draft assumed the prettier U+2019 for the apostrophes
 * and grepped back ZERO rows — the `->` for `→` defect (2026-08-24) reappearing within a day,
 * in the same direction: tidy the character, lose the citation. Escapes are how that got caught
 * and how a later editor is stopped from folding them silently.
 *
 * The seventh, 061bc00e, HAS NO SUCH LINE and is not given one. Its entire board presence is three
 * harness rows — a caveat banner, a `/model` echo, and that command's stdout — and every one of
 * those strings also appears under other panes (43 rows share the stdout line). So its evidence is
 * `ts`: the exact millisecond of a row only it wrote. Structural rather than textual, and checked
 * the same way. Inventing a quote for it would have been the easy uniform thing.
 */
const LETTER_BIRTH = 1785057198;      // unix SECONDS; persist.log's first `letter X -> pane=` line

const PRE_LETTER = {
  // "hey", then the fables-safeguard conversation. 16 rows, all 2026-07-06.
  'b8ea54e3-a319-4c67-bf67-335a80be86da': {
    first: 1783326655163, last: 1783328955345,
    quote: 'what do you think about this triggers fables broad safe guards',
  },
  // Asked the continuity question cold. Two rows, 2026-07-06 13:36Z. Its near-twin below got the
  // same prompt six minutes later, which is why the evidence here is the ANSWER and not the
  // question: the two user turns are near-identical strings and cannot tell the panes apart.
  '6085178a-3c68-4d45-a059-5367a6436d5e': {
    first: 1783344980462, last: 1783345020034,
    quote: 'I\u0027m here \u2014 room read, seam mine to cut.',
  },
  '9c08c65b-1822-4e4a-905b-aaf3713eea26': {
    first: 1783345338136, last: 1783345378959,
    quote: 'I\u0027m here \u2014 read the room, running it rather than reciting it.',
  },
  // The one row that signs itself: a committee post naming its own working directory, 2026-07-08.
  'sibling-59e55fca': {
    first: 1783511344612, last: 1783511344612,
    quote: 'ARTIFACT \u2014 distill duplicate-atom bug fixed and verified (2026-07-08, sibling-59e55fca)',
  },
  // 40 rows, the longest-lived of the seven, 2026-07-11.
  '66eee6ce-baef-4007-a9ea-38f2e8c73fa7': {
    first: 1783768727426, last: 1783777815060,
    quote: 'ran the wake-up rather than just reciting it',
  },
  // 12 rows the same morning, its last landing eleven seconds before 66eee6ce's first.
  '433f587c-1627-4756-9aa4-1bd0d2e8fd8e': {
    first: 1783761014698, last: 1783768716233,
    quote: 'the thread\u0027s intact from where we left it',
  },
  // Three harness rows inside three milliseconds and not one authored sentence. No unique string
  // exists, so the evidence is a timestamp — see the note above about not inventing one.
  '061bc00e-5932-4e5a-854f-f34dd6c09c10': {
    first: 1784018394673, last: 1784018394675,
    ts: 1784018394673,
  },
};


/* Actors that are NOT panes and must not be folded into one. `chair` is written by the control
 * plane itself — every chair verb and every refusal — so it is a real distinct author, not an
 * alias for whoever happens to hold the chair token. Tooling writers are likewise their own
 * thing: collapsing them into a pane would attribute a script's output to a person. */
// 'gate' joined 2026-07-31: the pull gate writes its own cards and decisions to the board
// ("gate-card [c276f2f9] from 1582ff09 -> chair [interesting] DECISION NEEDED...") — control
// plane, not a pane, same standing as 'chair'.
// 'blind' joined 2026-08-01: the blind window declares its own edges on the board ("blind window
// OPEN — board pushes muted and counted…", and the muted count on close). Control plane, same
// standing as 'chair' and 'gate' — and it was caught by this assertion within hours of the writer
// being created, which is the tripwire doing precisely its job on its own author.
/* Strings that appear in the pane field but name no actor. `main-tab/tree-assets` is a
 * SCRATCHPAD PATH a post tagged itself with -- "TREE ASSETS (remaster Phase 2.5) ... Files in
 * main-tab scratchpad: treea..." -- so resolving it to a letter would invent an actor. It belongs
 * here rather than in ALIASES: the canary should stop counting it without anyone claiming it is
 * a pane. */
const NON_PANE = new Set(['chair', 'backfill', 'blackbox-steering', 'gate', 'blind',
  'main-tab/tree-assets']);

let _letters = null;
function letters() {
  if (_letters) return _letters;
  try {
    _letters = JSON.parse(fs.readFileSync(LETTERS, 'utf8'));
  } catch {
    _letters = {};              // absent map is not an error: nothing resolves, everything counts
  }
  return _letters;
}

/** Resolve one board `pane` value to a canonical actor.
 *  `via` says HOW it resolved, so a consumer can weight a mount-derived id differently from a
 *  historical alias — the same reason `ts_source` exists on BoardEntry. */
function canonical(id) {
  const s = String(id == null ? '' : id);
  if (!s) return { actor: '', via: 'unresolved' };
  if (NON_PANE.has(s)) return { actor: s, via: 'non-pane' };
  const map = letters();
  if (Object.prototype.hasOwnProperty.call(map, s)) return { actor: map[s], via: 'uuid' };
  if (Object.prototype.hasOwnProperty.call(ALIASES, s)) return { actor: ALIASES[s], via: 'alias' };
  // PRE-LETTER, and note it is reached only AFTER the letters map above. That order is the whole
  // guard against a retroactive backfill: give one of these ids a letter and it resolves via
  // 'uuid' and never gets here. The actor stays the raw id — a letterless pane is still a pane,
  // and folding it into a neighbour to make the census tidy is the wrong-merge this file exists
  // to refuse. What changes is only that it stops being reported as NOT KNOWN.
  if (Object.prototype.hasOwnProperty.call(PRE_LETTER, s)) return { actor: s, via: 'pre-letter' };
  if (/^[A-Z]$/.test(s) && Object.values(map).includes(s)) return { actor: s, via: 'letter' };
  // A UUID PREFIX. The board's own injection lines write `-> 1582ff09`, an 8-character prefix,
  // while letters.json holds full UUIDs — so exact matching resolved none of them and the
  // first wiring of this resolver into residue.js changed no number at all. That silence is
  // what exposed it: a before/after that is byte-identical means the thing did not run.
  //
  // Resolved only when the prefix is UNAMBIGUOUS. Two panes sharing a prefix is unlikely and
  // is exactly the case where a wrong merge would be invisible, so ambiguity stays unresolved
  // rather than picking the first match.
  if (/^[0-9a-f]{6,}$/i.test(s)) {
    const hits = Object.keys(map).filter(k => k.toLowerCase().startsWith(s.toLowerCase()));
    if (hits.length === 1) return { actor: map[hits[0]], via: 'uuid-prefix' };
    if (hits.length > 1) return { actor: s, via: 'ambiguous-prefix' };
  }
  return { actor: s, via: 'unresolved' };
}

/** Count a list of raw `pane` values by canonical actor, and REPORT what did not resolve.
 *  The unresolved list is the point: an identity tool that quietly maps everything is exactly
 *  the failure mode this file was written against. */
function census(ids) {
  const actors = new Map(), vias = new Map(), unresolved = new Map();
  for (const id of ids) {
    const { actor, via } = canonical(id);
    actors.set(actor, (actors.get(actor) || 0) + 1);
    vias.set(via, (vias.get(via) || 0) + 1);
    if (via === 'unresolved') unresolved.set(String(id), (unresolved.get(String(id)) || 0) + 1);
  }
  return {
    total: ids.length,
    actors: [...actors.entries()].sort((a, b) => b[1] - a[1]),
    vias: [...vias.entries()].sort((a, b) => b[1] - a[1]),
    unresolved: [...unresolved.entries()].sort((a, b) => b[1] - a[1]),
  };
}

/** True when two raw ids are the same actor. The question the QUIET filter actually asks. */
const sameActor = (a, b) => {
  const x = canonical(a), y = canonical(b);
  return x.via !== 'unresolved' && y.via !== 'unresolved' && x.actor === y.actor;
};

module.exports = { canonical, census, sameActor, ALIASES, NON_PANE, LETTERS,
                   PRE_LETTER, LETTER_BIRTH };

if (require.main === module) {
  const board = process.argv[2] || 'C:/Consonance/data/board.jsonl';
  const ids = [];
  for (const line of fs.readFileSync(board, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    try { ids.push(JSON.parse(line).pane); } catch { /* not a record */ }
  }
  const c = census(ids);
  console.log(`actors — ${board}\n  ${c.total} entries, ${c.actors.length} canonical actors ` +
              `(from ${new Set(ids.map(String)).size} raw identifiers)\n`);
  for (const [a, n] of c.actors) console.log(`  ${String(a).padEnd(22)} ${n}`);
  console.log('\n  resolved via: ' + c.vias.map(([v, n]) => `${v}=${n}`).join('  '));

  // Printed as its own block rather than folded into the actor list, because these rows are the
  // one group a reader has to hold differently: attributable, but to an id and never a letter.
  const pre = c.actors.filter(([a]) => Object.prototype.hasOwnProperty.call(PRE_LETTER, String(a)));
  if (pre.length) {
    const born = new Date(LETTER_BIRTH * 1000).toISOString().replace(/\.000Z$/, "Z");
    console.log(`\n  PRE-LETTER — posted and died before the letter system existed (${born}),`);
    console.log("  so no letter was ever possible. Attributable to the pane id, to nothing else:");
    for (const [id, n] of pre) {
      const last = new Date(PRE_LETTER[String(id)].last).toISOString().slice(0, 10);
      console.log(`    ${String(id).padEnd(40)} ${String(n).padStart(3)}  last row ${last}`);
    }
  }
  if (c.unresolved.length) {
    console.log('\n  UNRESOLVED — returned unchanged, never folded into a neighbour:');
    for (const [id, n] of c.unresolved) console.log(`    ${String(id).padEnd(40)} ${n}`);
    console.log('\n  An unresolved id is not a bug in the record; it is this file not knowing.');
    console.log('  Add it to ALIASES only with a quoted board line as evidence.');
  }
}
