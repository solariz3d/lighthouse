// boundary-check.test.js — the replacement falsifier's own check.
// Run: node consonance/tools/boundary-check.test.js
//
// EVERY ASSERTION DRIVES THE TOOL AGAINST A FIXTURE AND READS WHAT CAME OUT. Nothing greps the
// source. The reason is on the record twice now: a Rust test asserting the librarian brief says
// "No work." stayed green after the phrase was struck, because the sentence RETIRING it quotes it
// verbatim; and this very file's subject — the falsifier it replaces — was satisfied by the lap
// convened to attack it. A test that reads the object under test to decide whether it passed is
// the exact class (`librarian/2026-08-25.md:920-924`, L009) this tool exists downstream of.
//
// THE FOUR THAT CARRY THE REPAIR, and why each is here rather than being obvious:
//   - zero dispatches is UNMEASURED, never HOLDS. The original read an absence as a pass. If this
//     one ever returns 0 for an empty window, it has become the thing it replaced.
//   - a blind window is UNMEASURED. board_push mutes transcript ingest too, so a muted stretch
//     looks identical to a quiet clean one from inside.
//   - a lap opened AFTER the dispatch does not cover it. The chain's first step cannot be taken
//     retroactively; if it could, every fire would be erasable after the fact.
//   - the three verdicts have three distinct exit codes, so a caller cannot read UNMEASURED as a
//     pass by testing `=== 0`.
//
// Fixtures live in a temp dir. Nothing touches C:\Consonance\data, the repo, or ~/.claude.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const TOOL = path.join(__dirname, 'boundary-check.js');
const NODE = process.execPath;
const EXIT = { HOLDS: 0, FIRES: 1, UNMEASURED: 2 };

// Well after the tool's default floor, so `--since` is never the thing under test by accident.
const T0 = Date.parse('2026-08-27T00:00:00Z');
const SINCE = '2026-08-26T12:00:00Z';

function boardRow(ts, text, pane = 'pane-a') {
  return { pane, role: 'user', text, ts, ts_source: 'transcript' };
}
function dispatch(ts, tag = 'x', pane = 'pane-a') {
  return boardRow(ts, `[chair:MAIN] LAP ${tag} — do the thing`, pane);
}
function openRow(lap, at, guess = ['a/b.js']) {
  return { lap, stage: 'open', at, initiator: 'chair', inquiry: 'i', guess, blind: null, head: null };
}
function filedRow(lap, at) {
  return { lap, stage: 'chain', chain: 'filed', holder: 'chair', at, note: null, head: null };
}

function fixture({ board = [], laps = [], noBoard = false, noLaps = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bcheck-'));
  const boardPath = path.join(dir, 'board.jsonl');
  const lapPath = path.join(dir, 'lap.jsonl');
  const w = (p, rows) => fs.writeFileSync(p, rows.map(r => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + (rows.length ? '\n' : ''));
  if (!noBoard) w(boardPath, board);
  if (!noLaps) w(lapPath, laps);
  return { dir, boardPath, lapPath, cleanup: () => fs.rmSync(dir, { recursive: true, force: true }) };
}

function run(fx, args = []) {
  const r = spawnSync(NODE, [TOOL, '--since', SINCE, ...args], {
    encoding: 'utf8',
    env: { ...process.env, BOARD_LEDGER: fx.boardPath, LAP_LEDGER: fx.lapPath, CONSONANCE_DATA: fx.dir },
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

// ------------------------------------------------------------------ the harm it exists to catch

test('FIRES when a dispatch rendered with no sealed lap open', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [] });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.FIRES, r.out);
    assert.match(r.out, /FIRES - 1 of 1/);
  } finally { fx.cleanup(); }
});

test('HOLDS when every dispatch had a sealed lap open before it', () => {
  const fx = fixture({ board: [dispatch(T0), dispatch(T0 + 60000, 'y')], laps: [openRow('D9', T0 - 60000)] });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.HOLDS, r.out);
    assert.match(r.out, /HOLDS - 0 of 2/);
  } finally { fx.cleanup(); }
});

test('a lap opened AFTER the dispatch does not cover it — the seal is not retroactive', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [openRow('D9', T0 + 1)] });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.FIRES, r.out);
  } finally { fx.cleanup(); }
});

test('a lap filed before the dispatch does not cover it', () => {
  const fx = fixture({
    board: [dispatch(T0 + 5000)],
    laps: [openRow('D9', T0 - 5000), filedRow('D9', T0)],
  });
  try {
    assert.strictEqual(run(fx).code, EXIT.FIRES);
  } finally { fx.cleanup(); }
});

test('an open row with an EMPTY guess is not a seal', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [openRow('D9', T0 - 1000, [])] });
  try {
    assert.strictEqual(run(fx).code, EXIT.FIRES);
  } finally { fx.cleanup(); }
});

test('mixed window reports only the uncovered ones', () => {
  const fx = fixture({
    board: [dispatch(T0, 'a'), dispatch(T0 + 1000, 'b'), dispatch(T0 + 2000, 'c')],
    laps: [openRow('D9', T0 - 1), filedRow('D9', T0 + 1500)],
  });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.FIRES, r.out);
    assert.match(r.out, /FIRES - 1 of 3/);
  } finally { fx.cleanup(); }
});

// ------------------------------------------------------- absence is CLASSIFIED, never accepted

test('an empty window is UNMEASURED, not HOLDS — the defect being replaced', () => {
  const fx = fixture({ board: [], laps: [openRow('D9', T0)] });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.UNMEASURED, r.out);
    assert.match(r.out, /UNMEASURED/);
    assert.doesNotMatch(r.out, /HOLDS/);
  } finally { fx.cleanup(); }
});

test('a board with rows but no dispatches in the window is UNMEASURED', () => {
  const fx = fixture({
    board: [boardRow(T0, 'just a pane talking'), boardRow(T0 + 1, 'and again')],
    laps: [],
  });
  try {
    assert.strictEqual(run(fx).code, EXIT.UNMEASURED);
  } finally { fx.cleanup(); }
});

test('a window overlapping an OPEN blind period is UNMEASURED even with dispatches present', () => {
  const fx = fixture({
    board: [
      { pane: 'blind', role: 'committee', text: 'blind window OPEN — board pushes muted', ts: T0 - 10000, ts_source: 'push' },
      { pane: 'blind', role: 'committee', text: 'blind window CLOSED — 3 entries muted', ts: T0 + 10000, ts_source: 'push' },
      dispatch(T0 + 20000),
    ],
    laps: [],
  });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.UNMEASURED, r.out);
    assert.match(r.out, /blind window/i);
  } finally { fx.cleanup(); }
});

test('a blind window that never closed is reported as STILL OPEN', () => {
  const fx = fixture({
    board: [{ pane: 'blind', role: 'committee', text: 'blind window OPEN — muted', ts: T0, ts_source: 'push' }],
    laps: [],
  });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.UNMEASURED, r.out);
    assert.match(r.out, /STILL OPEN/);
  } finally { fx.cleanup(); }
});

test('a blind window entirely BEFORE the window does not suppress the verdict', () => {
  const fx = fixture({
    board: [
      { pane: 'blind', role: 'committee', text: 'blind window OPEN', ts: Date.parse('2026-06-30T00:00:00Z'), ts_source: 'push' },
      { pane: 'blind', role: 'committee', text: 'blind window CLOSED — 2473 entries muted', ts: Date.parse('2026-08-01T00:00:00Z'), ts_source: 'push' },
      dispatch(T0),
    ],
    laps: [openRow('D9', T0 - 1)],
  });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.HOLDS, r.out);
  } finally { fx.cleanup(); }
});

test('a missing board is UNMEASURED, never a pass', () => {
  const fx = fixture({ laps: [], noBoard: true });
  try {
    assert.strictEqual(run(fx).code, EXIT.UNMEASURED);
  } finally { fx.cleanup(); }
});

test('a missing lap ledger with dispatches present FIRES rather than crashing', () => {
  const fx = fixture({ board: [dispatch(T0)], noLaps: true });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.FIRES, r.out);
    assert.match(r.out, /LEDGER ABSENT/);
  } finally { fx.cleanup(); }
});

test('the three verdicts have three distinct exit codes', () => {
  const holds = fixture({ board: [dispatch(T0)], laps: [openRow('D9', T0 - 1)] });
  const fires = fixture({ board: [dispatch(T0)], laps: [] });
  const unmeasured = fixture({ board: [], laps: [] });
  try {
    const codes = [run(holds).code, run(fires).code, run(unmeasured).code];
    assert.deepStrictEqual(codes, [0, 1, 2]);
    assert.strictEqual(new Set(codes).size, 3, 'a caller testing `=== 0` must not read UNMEASURED as a pass');
  } finally { holds.cleanup(); fires.cleanup(); unmeasured.cleanup(); }
});

// ---------------------------------------------------------------- the ledgers' own rough edges

test('replayed board rows are deduped on (pane, text) and counted once', () => {
  const d = dispatch(T0);
  const fx = fixture({
    board: [d, { ...d, ts: T0 + 900000 }, { ...d, ts: T0 + 1800000 }],
    laps: [openRow('D9', T0 - 1)],
  });
  try {
    const r = run(fx);
    assert.strictEqual(r.code, EXIT.HOLDS, r.out);
    assert.match(r.out, /HOLDS - 0 of 1/);
    assert.match(r.out, /3 raw rows deduped to 1/);
  } finally { fx.cleanup(); }
});

test('the same text to two DIFFERENT panes is two dispatches, not one', () => {
  const fx = fixture({
    board: [dispatch(T0, 'a', 'pane-a'), dispatch(T0, 'a', 'pane-b')],
    laps: [openRow('D9', T0 - 1)],
  });
  try {
    assert.match(run(fx).out, /HOLDS - 0 of 2/);
  } finally { fx.cleanup(); }
});

test('unreadable lap lines are COUNTED, not silently filtered', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: ['{not json', openRow('D9', T0 - 1)] });
  try {
    const r = run(fx);
    assert.match(r.out, /1 lap line\(s\) UNREADABLE/);
    assert.strictEqual(r.code, EXIT.HOLDS, r.out);
  } finally { fx.cleanup(); }
});

test('a board row that is not role:user cannot be a dispatch', () => {
  const fx = fixture({
    board: [{ pane: 'p', role: 'assistant', text: '[chair:MAIN] quoting a packet back', ts: T0, ts_source: 'transcript' }],
    laps: [],
  });
  try {
    assert.strictEqual(run(fx).code, EXIT.UNMEASURED, 'a pane quoting the stamp is not an arrival');
  } finally { fx.cleanup(); }
});

test('--since rejects a string that is neither a date nor a commit', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [] });
  try {
    const r = spawnSync(NODE, [TOOL, '--since', 'not-a-thing'], {
      encoding: 'utf8',
      env: { ...process.env, BOARD_LEDGER: fx.boardPath, LAP_LEDGER: fx.lapPath, CONSONANCE_DATA: fx.dir },
    });
    assert.strictEqual(r.status, EXIT.UNMEASURED);
  } finally { fx.cleanup(); }
});

test('--verbose names the uncovered dispatch so a fire can be gone and looked at', () => {
  const fx = fixture({ board: [dispatch(T0, 'ZZZ')], laps: [] });
  try {
    const r = run(fx, ['--verbose']);
    assert.match(r.out, /UNSEALED/);
    assert.match(r.out, /ZZZ/);
  } finally { fx.cleanup(); }
});

// ------------------------------------------------------------------------ the stated limits

test('it says on every run that it is one machine only', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [openRow('D9', T0 - 1)] });
  try {
    assert.match(run(fx).out, /this machine only/);
  } finally { fx.cleanup(); }
});

test('a HOLDS does not claim the seals were good', () => {
  const fx = fixture({ board: [dispatch(T0)], laps: [openRow('D9', T0 - 1)] });
  try {
    assert.match(run(fx).out, /does not say the seals were good/);
  } finally { fx.cleanup(); }
});
