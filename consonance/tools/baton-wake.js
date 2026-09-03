#!/usr/bin/env node
'use strict';
// baton-wake.js — a baton was handed to a seat that was never told.
//
// ── WHAT WAS MEASURED, BEFORE ANYTHING WAS BUILT ───────────────────────────────────────────────
//
// D005's map sat 8.99 h (`lap.jsonl`, inquiry 01:07:30 -> map 10:06:59, Regina). The chair's
// packet diagnosed it as "NOTHING WAKES A HOLDER WHEN A CHAIN ROW LANDS". That is true of
// `lap-row.js` — it contains zero notification code (`grep -c 'post_board|inject|notify'` -> 0) —
// but it is NOT the whole cause, and the difference decides what may be built.
//
// FACT 1 — THE WAKE CHANNEL EXISTS AND RUNS UNATTENDED. At 01:06:45 the librarian rang
// `call_chair`; the chair, with no keeper typing into it, produced work at 01:07:21. **36 seconds,
// ring to work, at 1 a.m.** An idle pane that is rung does run. Nothing here needs a new channel,
// and building one would be the third instance of the D003 pattern the librarian named: answering
// a REACHING problem with MORE SURFACE.
//
// FACT 2 — THE HAND-OFF IS SELF-SILENCING, AND THIS IS THE REAL DEFECT. `mcp.rs:397` gates every
// speaking verb on the CURRENT holder:
//
//     chair_inject    needs holder == chair
//     call_chair      needs holder == librarian
//     call_librarian  needs holder == panes
//
// Writing `--holder Y` sets holder = Y. From that instant every verb the OUTGOING seat could have
// used is REFUSED OUT OF TURN. **The act of handing off destroys the ability to announce it.** The
// machinery does not merely fail to wake the holder; it forbids the wake at exactly the moment one
// is owed. That is stronger than the packet's framing and it moves the fix: not a channel, an
// ORDER — ring first, write the row second.
//
// FACT 3 — THE WORKAROUND WAS FOUND BY BEING REFUSED, AND NOTHING TEACHES IT. The librarian hit
// this at 10:24 today, was refused, and re-took the baton for 30 s to ring before handing off —
// three ledger rows for one hand-off (`lap.jsonl` D005, 10:06:59 / 10:07:35 / 10:07:55). The
// ordering is correct and lives nowhere a seat reads before it needs it.
//
// FACT 4 — AND THE STALL WAS NOT A SLOW HOLDER. The board is silent 01:07:51 -> 10:04:08: 49 rows
// in that window, zero between those two. Nothing in the house ran. The librarian went idle at
// 01:07:06 having finished its turn; the chair wrote `holder librarian` at 01:07:30 and said "my
// step is done" INTO ITS OWN PANE; then the keeper slept. **The keeper is the relay, and the relay
// slept.** So the 9 h is not evidence a holder ignored a baton — it is evidence that a hand-off is
// announced only to whoever happens to be watching, and at 1 a.m. nobody is.
//
// ── WHY A Stop HOOK, AND WHY THIS IS NOT sourced-stop's REFUSED GATE ───────────────────────────
//
// No hook in the holder's own session can wake it: an idle seat fires no hook — SessionStart is
// spent, UserPromptSubmit needs a prompt, Stop already fired. Only the injection plane reaches an
// idle pane, and only a live seat can invoke it. So the lever is the OUTGOING seat, at the one
// moment it is still live and still allowed to speak: the end of the turn in which it handed off.
//
// `sourced-stop.js` refused to gate at Stop, and priced the refusal: 110 of 137 value-turns
// unsourced — "a gate firing on 80% of value-turns is a nag". THE DISCRIMINATOR IS THE BASE RATE,
// AND IT WAS MEASURED RATHER THAN ASSERTED:
//
//     holder CHANGES in the entire ledger, all laps, all time :       6
//     board lines over the same span                          : 141,053
//     ceiling on how often this can fire                      :  0.004%
//
// Six events, ever. That is the opposite end of the axis sourced-stop refused on, which is why a
// block is affordable here and was not there. If that rate ever climbs, this file's refusal is the
// same as that one's and it should be demoted to a printer.
//
// AND IT BLOCKS AT MOST ONCE PER HAND-OFF, recorded, so a wedge is impossible by construction: a
// seat that ignores the line stops normally on its next Stop. A gate that can spin is a gate that
// gets uninstalled within a day, and an un-uninstallable spin at 3 a.m. is worse than the 9 hours.
//
// ── THE TRAP, NAMED IN THE PACKET AND OBEYED HERE ──────────────────────────────────────────────
//
// "A channel that carries the CATEGORY and not the FACT has rebuilt the thing it replaced." So the
// line never says "a row landed for you". It carries the lap, the stage, the holder, the age, and
// THE ROW'S OWN NOTE — the sentence naming what is owed and where it was written. When the note is
// null the line SAYS the note is null, because a hand-off carrying no fact is itself the finding:
// the holder would wake knowing only its category.
//
// IT IS A SENSOR ABOUT ROWS, NEVER ABOUT THE WORLD — the same limit chain-status.js states. It can
// see that no delivery was audited; it cannot see that a seat was told some other way.
//
// WHAT IT CANNOT SEE, printed in the line rather than filed here:
//   "rung unknown"  — a delivery row whose pane id resolves to no known pane. UNKNOWN IS NOT
//                     RUNG (the `unknown`-renders-as-`idle` failure); it fires, and says unknown.
//   "this machine only" — lap.jsonl and board.jsonl are machine-local, as chain-status states.
//   cross-seat relay — the keeper telling a seat by hand leaves no audit row and reads as silence.

const fs = require('fs');
const path = require('path');
const os = require('os');

/* Resolution order copied from lap-row.js:97 deliberately and NOT imported — this file is called
 * from a hook that must keep working if the repo moves, the exception ferry-watch.js states for
 * its own duplicate and chain-status.js repeats. The authority is named so the copy is auditable.
 * NO FATAL DEFAULT: an unresolvable data dir returns null and the reader goes silent, rather than
 * inventing a path and reporting "no ledger there" — an absent instrument and a clean one must
 * never produce the same observation. */
function fromConfig(key) {
  try {
    const raw = fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, '');
    const v = JSON.parse(raw);
    const d = v && v[key] != null ? String(v[key]).trim() : '';
    return d || null;
  } catch (_) { return null; }
}

function dataDir() {
  return process.env.CONSONANCE_DATA || fromConfig('data_dir') || null;
}

// ── PURE CORE. The whole matrix is testable with no disk, no board and no live pane — which is
// what lets the mutants be honest, because no seat in this room can observe a pane. ─────────────

/* A pane id resolves to the STATION its cwd names. lap-row.js's vocabulary is chair|librarian|panes
 * and panes.json carries {pane, cwd}; the instance directory basename is the only mapping either
 * side agrees on. Anything that is not main/librarian is a committee pane. */
function stationOfCwd(cwd) {
  if (!cwd) return null;
  const base = String(cwd).replace(/[\\/]+$/, '').split(/[\\/]/).pop().toLowerCase();
  if (base === 'main') return 'chair';
  if (base === 'librarian') return 'librarian';
  return 'panes';
}

/* THE TWO SEATS panes.json DOES NOT LIST, and leaving them out made this instrument nearly useless
 * on its first live read: it fired on D005 with `rung unknown` because the real delivery row is
 * `QUEUED -> 0c0c0c0a (...)` and panes.json carries only the sibling panes. The chair and the
 * librarian are exactly the two seats that pass batons, so `unknown` would have been the routine
 * answer rather than the rare one — an instrument that always says "cannot tell" is one nobody
 * reads twice.
 *
 * These are FIXED session ids compiled into the binary (`main.rs:4414` MAIN_SID, `main.rs:4544`
 * LIBRARIAN_SID) precisely so those two panes resume themselves, which is what makes hardcoding
 * them here defensible where hardcoding a path was not. COPIES, not imports — the same law
 * ferry-watch states: a hook that dies when the repo moves goes silently missing. The authority is
 * cited so the copy is auditable, and if either constant changes this reader degrades to
 * `unknown`, which is the safe direction: it fires and says so, rather than falling silent. */
const MAIN_SID = '0c0c0c0a-0000-4000-8000-000000000a01';        // main.rs:4414 — the chair
const LIBRARIAN_SID = '0c0c0c0b-0000-4000-8000-00000000115b';   // main.rs:4544 — the librarian

/* Which station a board audit line REACHED, or 'unknown', or null for "not a delivery at all".
 *
 * A REFUSAL IS NOT A DELIVERY, and this is the clause that carries the whole finding: the refused
 * `call_chair` at 10:07:18 is exactly the case where a seat tried to wake a holder and the gate
 * stopped it. Counting it as a ring would make this instrument blind to its own subject. */
function deliveryStation(text, panes) {
  const t = String(text || '');
  if (!/QUEUED ->|DELIVERED ->|\[Received\]/.test(t)) return null;
  if (/REFUSED|refused/.test(t)) return null;
  if (/\bcall_chair\b/.test(t)) return 'chair';
  if (/\bcall_librarian\b/.test(t)) return 'librarian';
  if (/\bchair_inject\b/.test(t)) return 'panes';
  const m = t.match(/(?:QUEUED|DELIVERED) -> ([0-9a-f]{4,})/);
  if (m) {
    /* AMBIGUITY IS UNKNOWN, NEVER A GUESS. MAIN_SID and LIBRARIAN_SID share their first seven
     * characters — main.rs:4551 says so in as many words while reserving a third id out of the
     * family — so any prefix that matches both must resolve to `unknown` rather than to whichever
     * was tested first. A shorter board format would otherwise attribute every chair delivery to
     * the chair AND every librarian delivery to the chair, silently, and the instrument would read
     * cleaner the more wrong it got.
     *
     * `=== 1` IS THE WHOLE GUARD, and an explicit `> 1 -> unknown` line was written here and then
     * REMOVED: mutation showed deleting it changed nothing, because an ambiguous prefix falls
     * through the pane lookup and reaches `unknown` anyway. A guard whose removal no test can
     * detect is not a guard, it is a comment that reads like one — the absent-guard-reads-as-
     * passing-guard shape, shipped inside the tool built on that finding. The behaviour is
     * contracted by the test; only the exactly-one match resolves. */
    const reserved = [[MAIN_SID, 'chair'], [LIBRARIAN_SID, 'librarian']].filter(([sid]) => sid.startsWith(m[1]));
    if (reserved.length === 1) return reserved[0][1];
    const hit = (panes || []).find((p) => String(p.pane || '').startsWith(m[1]));
    if (hit) return stationOfCwd(hit.cwd);
    return 'unknown';   // unknown does not get to mean yes
  }
  return 'unknown';
}

/* The open lap's latest row that names a holder. Laps are append-ordered; `filed` closes one and
 * `void` withdraws it, matching lap-row.js's own folding. */
function openHolderRow(lapRows) {
  const byLap = new Map();
  for (const r of lapRows || []) {
    if (!r || !r.lap) continue;
    if (!byLap.has(r.lap)) byLap.set(r.lap, []);
    byLap.get(r.lap).push(r);
  }
  let best = null;
  for (const [lap, rows] of byLap) {
    if (rows.some((r) => r.chain === 'filed' || r.stage === 'void' || r.chain === 'void')) continue;
    const held = rows.filter((r) => r.holder);
    if (!held.length) continue;
    const last = held[held.length - 1];
    if (!best || last.at > best.at) best = Object.assign({}, last, { lap });
  }
  return best;
}

/* THE QUESTION. Returns null (nothing owed) or the FACT.
 *
 * `since` is the end of this seat's PREVIOUS turn. A row older than that was not handed off by the
 * turn that just ended, so it is not this seat's to answer for — and on first run `since` is null
 * and this returns null, so installing the hook cannot fire it on a five-day-old row. That
 * baseline-on-install rule is deliberate: an instrument whose first act is to fire on history is
 * one nobody believes the second time. */
function owed({ lapRows, boardRows, panes, me, since, now }) {
  if (!me || since == null) return null;
  const row = openHolderRow(lapRows);
  if (!row) return null;
  if (row.holder === me) return null;          // I hold it; nothing is owed to anyone else
  if (!(row.at > since)) return null;          // not handed off during the turn that just ended

  /* THE WINDOW IS THE TURN, NOT "AFTER THE ROW" — and the first draft had this exactly backwards.
   *
   * It counted only deliveries with `ts >= row.at`, which made it fire on the one hand-off in the
   * whole record that was done RIGHT: at 10:07:43 the librarian rang the chair with the map
   * pointer, and at 10:07:55 it wrote the hand-off row. Ring, then row — the precise order this
   * tool exists to teach — and the detector called it an orphaned baton, because the ring preceded
   * the row by twelve seconds.
   *
   * An instrument that fires on correct behaviour does not merely miss; it argues for the wrong
   * thing, and it argues loudest at the moment a seat did the hard part. Caught by retrodicting
   * against the real ledger rather than by any test, which is the whole reason the retrodiction was
   * run on BOTH hand-offs instead of only the one that stalled.
   *
   * So the question is: DURING THE TURN IN WHICH YOU HANDED OFF, DID YOU TELL THEM — before or
   * after the row, either way. `since` is that turn's start. */
  let rung = 'no';
  for (const b of boardRows || []) {
    const ts = b && (b.ts || b.at);
    if (!ts || ts < since) continue;
    const st = deliveryStation(b.text, panes);
    if (st === row.holder) return null;        // an audited delivery reached the holder
    if (st === 'unknown') rung = 'unknown';
  }
  return {
    lap: row.lap,
    chain: row.chain || row.stage || null,
    holder: row.holder,
    me,
    at: row.at,
    ageMs: Math.max(0, (now || Date.now()) - row.at),
    note: row.note == null ? null : String(row.note),
    rung,
  };
}

/* WHICH VERB THE OUTGOING SEAT HAS, KEYED ON THE SENDER — never on the holder.
 *
 * The first draft of this keyed on the HOLDER and printed "call_librarian needs holder librarian",
 * which is wrong twice over: `required_station('call_librarian')` is `panes` (mcp.rs:399), and the
 * chair may not use that verb at all. Caught by reading the tool's own retrodicted output rather
 * than by a test, which is why the matrix below is now asserted.
 *
 * Each seat has exactly ONE speaking verb, and its required holder is that seat itself — which is
 * precisely why writing `--holder <someone else>` disarms it:
 *
 *     sender chair      chair_inject     needs holder chair       reaches panes AND the librarian
 *     sender librarian  call_chair       needs holder librarian   reaches the chair, nowhere else
 *     sender panes      call_librarian   needs holder panes       reaches the librarian only
 *
 * THE HOLE THIS EXPOSES, stated because it bounds the repair the line recommends: the CHAIR has no
 * verb that reaches the librarian... except `chair_inject`, whose refusal message on the board
 * names the librarian as addressable alongside committee. So every hand-off in the chain is
 * reachable by its outgoing seat, and the ordering — ring, then row — is sufficient. If a future
 * address-table change makes a destination unreachable, this mapping is where it will show up as a
 * verb that cannot deliver, and the line will be wrong before the room is. */
function verbFor(me) {
  if (me === 'chair') return 'chair_inject';
  if (me === 'librarian') return 'call_chair';
  if (me === 'panes') return 'call_librarian';
  return null;
}

/* THE LINE. Carries the FACT — lap, stage, holder, age, and the row's own note — never the
 * category. The verb is named at the moment of need rather than left in a document nobody opens at
 * 3 a.m., the precedent auth_station's own refusal sets when it names lap-row.js in its message. */
function line(f) {
  if (!f) return '';
  const age = f.ageMs < 90000 ? `${Math.round(f.ageMs / 1000)}s` : `${(f.ageMs / 3600000).toFixed(1)}h`;
  const verb = verbFor(f.me);
  const what = f.note && f.note.trim()
    ? f.note.trim()
    : 'THE ROW CARRIES NO NOTE — the holder would wake knowing only that it holds something';
  const unknown = f.rung === 'unknown'
    ? ' One delivery after the row resolves to no known pane, so this is `rung unknown`, not `rung no`.'
    : '';
  return `BATON HANDED, NOBODY TOLD — ${f.lap} · ${f.chain} · holder ${f.holder} · ${age}, no audited delivery to ${f.holder} since the row landed.${unknown}\n`
    + `WHAT IS OWED, from the row: ${what}\n`
    + `Your verb is ${verb} and it needs holder ${f.me} (mcp.rs:397) — writing the row took your standing to send it. `
    + `To ring: re-take the baton (node consonance/tools/lap-row.js --stage ${f.lap} --holder <you>), send, then hand off again — ring BEFORE the row. `
    + `Rows only: this sees audited deliveries, not a relay by hand.`;
}

module.exports = { stationOfCwd, deliveryStation, openHolderRow, owed, line, verbFor, dataDir, fromConfig };

// ── CLI. Silence and exit 0 on every path, including the throw: this is read from a Stop hook and
// a reader that can fail takes the turn down with it. ───────────────────────────────────────────
if (require.main === module) {
  try {
    const dir = dataDir();
    if (!dir) process.exit(0);
    const read = (f) => {
      try {
        return fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n')
          .map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
      } catch (_) { return []; }
    };
    const sinceArg = process.argv.indexOf('--since');
    const f = owed({
      lapRows: read('lap.jsonl'),
      boardRows: read('board.jsonl'),
      panes: (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'panes.json'), 'utf8')); } catch (_) { return []; } })(),
      me: stationOfCwd(process.cwd()),
      since: sinceArg > -1 ? Number(process.argv[sinceArg + 1]) : 0,
      now: Date.now(),
    });
    if (f) process.stdout.write(line(f) + '\n');
  } catch (_) { /* a reader that cannot read must still not break the turn */ }
  process.exit(0);
}
