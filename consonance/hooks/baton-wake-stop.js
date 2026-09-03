// baton-wake-stop.js — Stop hook: the outgoing seat is caught at the one moment it can still speak.
//
// WHY STOP AND NOT ANYWHERE ELSE. An idle seat fires no hook — SessionStart is spent,
// UserPromptSubmit needs a prompt, Stop has already fired. So NOTHING in the holder's own session
// can wake it; only the injection plane reaches an idle pane, and only a LIVE seat can invoke it.
// The single reachable lever is therefore the OUTGOING seat, at the end of the turn in which it
// handed the baton away — while it is still running and can still re-take the baton and ring.
//
// WHY IT BLOCKS, WHICH IS THE PART THAT NEEDED PRICING. A Stop hook's stdout does not reach the
// model; it reaches the transcript, which reaches the keeper — and the keeper being the relay is
// the defect (`baton-wake.js` FACT 4: the board is silent 01:07:51 -> 10:04:08 because he was
// asleep). A line that only the keeper can see rebuilds the nine hours. `decision: block` is the
// one channel from this moment back into the seat, so a block it is.
//
// AND THE REFUSAL THAT MAKES A BLOCK DEFENSIBLE HERE WHEN sourced-stop REFUSED ONE. That file
// priced its gate at 110-of-137 value-turns and called it a nag. Measured on the same ledger, this
// one's ceiling is SIX events in the entire history of the room — 0.004% of board lines. Different
// end of the same axis, same instrument, measured not asserted.
//
// A WEDGE IS IMPOSSIBLE BY CONSTRUCTION, three ways, because an un-uninstallable spin at 3 a.m. is
// worse than the nine hours it would be trying to prevent:
//   1. `stop_hook_active` — the harness's own re-entry flag. Set on a continuation after a block;
//      this returns immediately, so a block can never immediately re-block.
//   2. ONCE PER HAND-OFF, keyed on (lap, holder, row.at) and recorded on disk. A seat that reads
//      the line and does nothing stops normally on its next Stop. The line is offered once.
//   3. Every failure path exits 0 with no decision. A reader that can fail must not take the turn
//      down with it.
//
// THE BASELINE ROW IS WRITTEN ON EVERY STOP, INCLUDING THE FIRST. That is what makes the very
// first run silent — `owed()` needs a previous Stop to know which rows belong to the turn that just
// ended, and on install there is none. An instrument whose first act is to fire on five days of
// history is one nobody believes the second time.
//
// WHAT THIS CANNOT SEE — the same limits the tool prints in its own line: audited deliveries only,
// this machine only, and nothing about whether the seat that reads the line then acts.

'use strict';

const fs = require('fs');
const path = require('path');

const TOOL = path.join(__dirname, '..', 'tools', 'baton-wake.js');

function exit0() { process.exit(0); }

let raw = '';
process.stdin.on('data', (d) => { raw += d; });
process.stdin.on('end', () => {
  try {
    let ev = {};
    try { ev = JSON.parse(raw || '{}'); } catch (_) { ev = {}; }

    // Guard 1: the harness's re-entry flag. Never block a continuation of our own block.
    if (ev.stop_hook_active) return exit0();

    const bw = require(TOOL);
    const dir = bw.dataDir();
    if (!dir) return exit0();   // no fatal default: an unresolvable dir is silence, not a guess

    const readJsonl = (f) => {
      try {
        return fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n')
          .map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
      } catch (_) { return []; }
    };

    const me = bw.stationOfCwd(process.cwd());
    const pane = String(process.cwd());
    const statePath = path.join(dir, 'baton_wake.jsonl');
    const state = readJsonl('baton_wake.jsonl');

    // `since` is THIS pane's previous Stop. Absent on install -> owed() stays silent.
    let since = null;
    const fired = new Set();
    for (const r of state) {
      if (r.pane !== pane) continue;
      if (r.kind === 'stop' && typeof r.at === 'number') since = r.at;
      if (r.kind === 'fired' && r.key) fired.add(r.key);
    }

    const now = Date.now();
    const f = bw.owed({
      lapRows: readJsonl('lap.jsonl'),
      boardRows: readJsonl('board.jsonl'),
      panes: (() => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'panes.json'), 'utf8')); } catch (_) { return []; } })(),
      me,
      since,
      now,
    });

    // The baseline is written on EVERY stop, before any decision, so a throw below cannot leave
    // this pane without one and silently re-arm the whole history next turn.
    const append = (row) => {
      try { fs.appendFileSync(statePath, JSON.stringify(row) + '\n'); } catch (_) { /* silence */ }
    };
    append({ kind: 'stop', pane, station: me, at: now });

    if (!f) return exit0();

    // Guard 2: once per hand-off, keyed on the row itself.
    const key = `${f.lap}|${f.holder}|${f.at}`;
    if (fired.has(key)) return exit0();
    append({ kind: 'fired', pane, station: me, at: now, key, holder: f.holder, lap: f.lap });

    process.stdout.write(JSON.stringify({ decision: 'block', reason: bw.line(f) }));
    return exit0();
  } catch (_) {
    return exit0();   // a hook that cannot report must still not break the turn
  }
});
process.stdin.on('error', exit0);
