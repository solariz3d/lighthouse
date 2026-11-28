// holdage678.js (pane E, D678 N3, registered with the row 9 A/A for the Even pair): may one more round start inside my exclusive hold?
// heavy-run ignores a hold older than 90 min (heavy-run.js HOLD_MAX_MS, :102); from then on other runs may start inside my timing. So a round starts only if the
// hold's age now, plus the round's runs at RUN_MS each, stays at or under 88 min. RUN_MS: drag-frame's longest run on D was 203.5 s (S2, with a retry) and 202.1 s
// (S7); sculpt-frame's about 165 s; D642's 3.4 s. My hold is found by its command (it starts "E D678 N3"): under sculpt-frame's form the runner's token is its
// slot's, not the hold's (S5's record: the hold "mine": false), so the token cannot name it. No such hold, or one with no start time: throws, never a default.
'use strict';
const fs = require('fs'), path = require('path');
const LIMIT_MS = 88 * 60000, RUN_MS = { df: 210000, sf: 210000, d642: 10000 };
/** the start time (ms) of my exclusive hold in dataDir; throws when there is none readable, it is not mine, or it has no start time */
function holdStarted(dataDir) {
  let h; try { h = JSON.parse(fs.readFileSync(path.join(dataDir, 'heavy-run.hold'), 'utf8')); } catch (e) { throw new Error(`no hold readable in ${dataDir} (${e.code || e.message})`); }
  if (!/^E D678 N3/.test(h.cmd || '')) throw new Error(`the hold is not mine (${String(h.seat)}: ${String(h.cmd).slice(0, 60)})`);
  const t = Date.parse(h.started); if (!Number.isFinite(t)) throw new Error(`my hold has no start time (started: ${JSON.stringify(h.started)})`);
  return t;
}
/** does a round of `runs` runs of `kind` fit before the hold reaches LIMIT_MS? */
function roundFits(kind, startedMs, nowMs, runs) {
  const per = RUN_MS[kind]; if (!per) throw new Error(`no run length for kind ${kind}`);
  const age = nowMs - startedMs, need = runs * per;
  return { fits: age + need <= LIMIT_MS, ageMin: +(age / 60000).toFixed(1), needMin: +(need / 60000).toFixed(1), limitMin: LIMIT_MS / 60000 };
}
module.exports = { holdStarted, roundFits, LIMIT_MS, RUN_MS };
