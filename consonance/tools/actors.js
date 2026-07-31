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
};

/* Actors that are NOT panes and must not be folded into one. `chair` is written by the control
 * plane itself — every chair verb and every refusal — so it is a real distinct author, not an
 * alias for whoever happens to hold the chair token. Tooling writers are likewise their own
 * thing: collapsing them into a pane would attribute a script's output to a person. */
// 'gate' joined 2026-07-31: the pull gate writes its own cards and decisions to the board
// ("gate-card [c276f2f9] from 1582ff09 -> chair [interesting] DECISION NEEDED...") — control
// plane, not a pane, same standing as 'chair'.
const NON_PANE = new Set(['chair', 'backfill', 'blackbox-steering', 'gate']);

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

module.exports = { canonical, census, sameActor, ALIASES, NON_PANE, LETTERS };

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
  if (c.unresolved.length) {
    console.log('\n  UNRESOLVED — returned unchanged, never folded into a neighbour:');
    for (const [id, n] of c.unresolved) console.log(`    ${String(id).padEnd(40)} ${n}`);
    console.log('\n  An unresolved id is not a bug in the record; it is this file not knowing.');
    console.log('  Add it to ALIASES only with a quoted board line as evidence.');
  }
}
