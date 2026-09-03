'use strict';
// baton-wake.test.js — the matrix runs on FAKE ledgers, never a live pane.
//
// That is not a convenience. No seat in this room can observe a pane (the 2026-09-02 SCRIBE
// finding), so a test that needed one would be a test nobody here could honestly run. Every
// branch below is a pure function of (rows, board, panes, me, since, now).
//
// THE BAR THIS FILE HAS TO CLEAR is mutation, not green: `dev/mutation/mutate-baton-wake.js`
// flips each load-bearing clause and every mutant must turn one of these red. The clause that
// matters most is the refusal clause — an instrument that counted a REFUSED call_chair as a ring
// would be blind to the exact defect it exists for, and that mutant is listed first.

const assert = require('assert');
const bw = require('./baton-wake.js');

let pass = 0; const fails = [];
function t(name, fn) {
  try { fn(); pass++; } catch (e) { fails.push(`${name}: ${e.message}`); }
}

const PANES = [
  { pane: '0c0c0c0a-0000-4000-8000-000000000a01', cwd: 'C:\\Consonance\\instances\\main' },
  { pane: '0c0c0c0b-0000-4000-8000-00000000115b', cwd: 'C:\\Consonance\\instances\\librarian' },
  { pane: '46d3d352-36af-4947-9c40-78515a92c0c0', cwd: 'C:\\Consonance\\instances\\sibling-181f513d' },
];

// A hand-off: lap open, then a row naming the librarian, written at t=1000.
const HANDOFF = [
  { lap: 'D005', stage: 'open', at: 900 },
  { lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at: 1000, note: 'map filed at exo_memory/librarian/2026-09-03.desktop.md' },
];
const base = (over) => Object.assign({
  lapRows: HANDOFF, boardRows: [], panes: PANES, me: 'chair', since: 500, now: 4600000,
}, over);

// ── STATION RESOLUTION ─────────────────────────────────────────────────────────────────────────

t('main resolves to the chair station', () => {
  assert.strictEqual(bw.stationOfCwd('C:\\Consonance\\instances\\main'), 'chair');
});
t('librarian resolves to itself', () => {
  assert.strictEqual(bw.stationOfCwd('C:/Consonance/instances/librarian'), 'librarian');
});
t('any other instance dir is a committee pane', () => {
  assert.strictEqual(bw.stationOfCwd('C:\\Consonance\\instances\\sibling-eeb329ed'), 'panes');
});
t('a trailing separator does not change the station', () => {
  assert.strictEqual(bw.stationOfCwd('C:\\Consonance\\instances\\main\\'), 'chair');
});
t('no cwd is not a station', () => {
  assert.strictEqual(bw.stationOfCwd(null), null);
});

// ── WHAT COUNTS AS A DELIVERY ──────────────────────────────────────────────────────────────────

t('a received call_chair reaches the chair', () => {
  assert.strictEqual(bw.deliveryStation('call_chair -> Main [Received]: "DOOR TWO"', PANES), 'chair');
});
t('a queued delivery to a known pane resolves through panes.json', () => {
  assert.strictEqual(bw.deliveryStation('QUEUED -> 0c0c0c0b (1 waiting, prompt not idle): D005 MAP', PANES), 'librarian');
});
/* The chair and the librarian are the two seats that pass batons and NEITHER is in panes.json.
 * Before these were resolved, the first live read of this tool returned `rung unknown` on the real
 * D005 row — routinely, not rarely. Fixed session ids from main.rs:4414 / :4544. */
t('a queued delivery to MAIN_SID resolves to the chair without panes.json', () => {
  const real = 'QUEUED -> 0c0c0c0a (1 waiting, prompt not idle): D005 MAP filed — read at exo_memory/';
  assert.strictEqual(bw.deliveryStation(real, []), 'chair');
});
t('a queued delivery to LIBRARIAN_SID resolves to the librarian without panes.json', () => {
  assert.strictEqual(bw.deliveryStation('DELIVERED -> 0c0c0c0b (FORCED): x', []), 'librarian');
});
t('a prefix matching BOTH reserved ids is unknown, never the first one tested', () => {
  // main.rs:4551 — MAIN_SID and LIBRARIAN_SID share seven characters.
  assert.strictEqual(bw.deliveryStation('QUEUED -> 0c0c0c0 (1 waiting): x', []), 'unknown');
});

t('a delivery to an unknown pane id is unknown, never a ring', () => {
  assert.strictEqual(bw.deliveryStation('DELIVERED -> deadbeef (FORCED): x', PANES), 'unknown');
});
t('ordinary board prose is not a delivery at all', () => {
  assert.strictEqual(bw.deliveryStation('Filed — 88670bf, ahead 6. Here is the plan.', PANES), null);
});

// THE LOAD-BEARING CLAUSE. The real refusal, verbatim from board.jsonl at 10:07:18.
t('a REFUSED call_chair is not a delivery — the defect this tool exists for', () => {
  const real = 'call_chair REFUSED OUT OF TURN — mount M tried to speak while lap D005 is held by '
    + 'chair; call_chair needs holder librarian [Received]';
  assert.strictEqual(bw.deliveryStation(real, PANES), null);
});

// ── THE QUESTION: IS A BATON OWED ──────────────────────────────────────────────────────────────

t('FIRES: handed off during this turn, nobody rung', () => {
  const f = bw.owed(base());
  assert.ok(f, 'expected a fact');
  assert.strictEqual(f.lap, 'D005');
  assert.strictEqual(f.holder, 'librarian');
  assert.strictEqual(f.rung, 'no');
});

t('SILENT: an audited delivery reached the holder after the row', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 1200, text: 'QUEUED -> 0c0c0c0b (1 waiting): D005 MAP' }] }));
  assert.strictEqual(f, null);
});

t('FIRES: the only delivery after the row was REFUSED', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 1200, text: 'call_chair REFUSED OUT OF TURN [Received]' }] }));
  assert.ok(f, 'a refused ring is not a ring');
  assert.strictEqual(f.rung, 'no');
});

t('FIRES with rung=unknown when a delivery resolves to no known pane', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 1200, text: 'DELIVERED -> deadbeef (FORCED): x' }] }));
  assert.ok(f);
  assert.strictEqual(f.rung, 'unknown');
});

/* THE PRESCRIBED ORDER MUST READ AS CORRECT. This is the real 10:07 sequence: the librarian rang
 * the chair at :43 and wrote the hand-off row at :55 — ring, then row. A detector that fires here
 * is arguing against the exact discipline it exists to teach, and the first draft did. */
t('SILENT when the ring PRECEDED the row inside the same turn — the prescribed order', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 950, text: 'QUEUED -> 0c0c0c0b (1 waiting): D005 MAP pointer' }] }));
  assert.strictEqual(f, null, 'ring-then-row is the fix, not the fault');
});

t('FIRES when the only ring predates the TURN itself', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 400, text: 'QUEUED -> 0c0c0c0b (1 waiting): last turn' }] }));
  assert.ok(f, 'a ring from a previous turn cannot have announced this hand-off');
});

t('FIRES when the in-turn ring reached a DIFFERENT seat', () => {
  const f = bw.owed(base({ boardRows: [{ ts: 950, text: 'QUEUED -> 0c0c0c0a (1 waiting): spoke to the chair instead' }] }));
  assert.ok(f, 'telling the wrong seat is not telling the holder');
});

t('SILENT: I am the holder — nothing is owed to anyone else', () => {
  assert.strictEqual(bw.owed(base({ me: 'librarian' })), null);
});

t('SILENT: the row predates this turn, so it is not mine to answer for', () => {
  assert.strictEqual(bw.owed(base({ since: 2000 })), null);
});

t('SILENT ON INSTALL: no previous Stop recorded means no baseline, so it cannot fire on history', () => {
  assert.strictEqual(bw.owed(base({ since: null })), null);
});

t('SILENT: the lap is filed', () => {
  const rows = HANDOFF.concat([{ lap: 'D005', stage: 'chain', chain: 'filed', holder: 'chair', at: 1100 }]);
  assert.strictEqual(bw.owed(base({ lapRows: rows })), null);
});

t('SILENT: the lap was voided', () => {
  const rows = HANDOFF.concat([{ lap: 'D005', stage: 'void', at: 1100 }]);
  assert.strictEqual(bw.owed(base({ lapRows: rows })), null);
});

t('SILENT: no lap carries a holder at all', () => {
  assert.strictEqual(bw.owed(base({ lapRows: [{ lap: 'D005', stage: 'open', at: 900 }] })), null);
});

t('the LATEST holder row wins — a re-take then hand-off reads as the hand-off', () => {
  const rows = HANDOFF.concat([
    { lap: 'D005', stage: 'chain', chain: 'map', holder: 'chair', at: 1100 },
    { lap: 'D005', stage: 'chain', chain: 'map', holder: 'panes', at: 1200, note: 'dispatched' },
  ]);
  const f = bw.owed(base({ lapRows: rows }));
  assert.ok(f);
  assert.strictEqual(f.holder, 'panes');
});

// ── THE TRAP: THE LINE MUST CARRY THE FACT, NOT THE CATEGORY ───────────────────────────────────

t('the line carries the row note VERBATIM, not a category', () => {
  const s = bw.line(bw.owed(base()));
  assert.ok(s.includes('exo_memory/librarian/2026-09-03.desktop.md'),
    'the fact — where the map was written — must reach the holder');
  assert.ok(s.includes('D005') && s.includes('map') && s.includes('librarian'),
    'lap, stage and holder are all facts and all required');
});

t('a note-less hand-off SAYS the row carries no note', () => {
  const rows = [
    { lap: 'D005', stage: 'open', at: 900 },
    { lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at: 1000, note: null },
  ];
  const s = bw.line(bw.owed(base({ lapRows: rows })));
  assert.ok(/CARRIES NO NOTE/.test(s), 'a category-only hand-off is itself the finding and must be said');
});

/* THE VERB IS THE SENDER'S, NOT THE HOLDER'S — and the first draft got this backwards, printing
 * "call_librarian needs holder librarian" when required_station('call_librarian') is `panes`
 * (mcp.rs:399) and the chair may not use that verb at all. It was caught by reading the tool's own
 * retrodicted output, so the matrix is asserted here rather than trusted. */
t('each seat gets ITS OWN speaking verb', () => {
  assert.strictEqual(bw.verbFor('chair'), 'chair_inject');
  assert.strictEqual(bw.verbFor('librarian'), 'call_chair');
  assert.strictEqual(bw.verbFor('panes'), 'call_librarian');
  assert.strictEqual(bw.verbFor('nobody'), null);
});

t('the line names the SENDER verb and the holder value that disarmed it', () => {
  const s = bw.line(bw.owed(base()));                        // me=chair, holder=librarian
  assert.ok(s.includes('chair_inject'), "the chair's verb, not the holder's");
  assert.ok(!/call_librarian/.test(s), 'a verb the chair cannot use must never be recommended to it');
  assert.ok(/needs holder chair/.test(s), 'the verb requires the SENDER as holder — that is the trap');
  assert.ok(s.includes('mcp.rs:397'), 'the gate is cited so the claim is checkable');
  assert.ok(/ring BEFORE the row/.test(s), 'the ordering is the actual fix');
});

t('a pane handing to the librarian is told call_librarian', () => {
  const rows = [
    { lap: 'D005', stage: 'open', at: 900 },
    { lap: 'D005', stage: 'chain', chain: 'handbacks-in', holder: 'librarian', at: 1000, note: 'handback at exo_memory/handback/p-baton-wake_2026-09-03.md' },
  ];
  const s = bw.line(bw.owed(base({ lapRows: rows, me: 'panes' })));
  assert.ok(s.includes('call_librarian') && /needs holder panes/.test(s));
});

t('the line states its own limit — rows only', () => {
  assert.ok(/Rows only/.test(bw.line(bw.owed(base()))));
});

t('the unknown case is visible in the line, not swallowed', () => {
  const s = bw.line(bw.owed(base({ boardRows: [{ ts: 1200, text: 'DELIVERED -> deadbeef: x' }] })));
  assert.ok(/rung unknown/.test(s));
});

t('an empty fact renders as nothing', () => {
  assert.strictEqual(bw.line(null), '');
});

// ── DEGRADING ──────────────────────────────────────────────────────────────────────────────────

t('no data dir configured resolves to null, never to an invented path', () => {
  const saved = process.env.CONSONANCE_DATA;
  delete process.env.CONSONANCE_DATA;
  const home = require('os').homedir();
  const d = bw.dataDir();
  assert.ok(d === null || typeof d === 'string', 'either a real configured dir or null');
  if (saved !== undefined) process.env.CONSONANCE_DATA = saved;
  assert.ok(home);
});

t('malformed rows do not throw', () => {
  assert.doesNotThrow(() => bw.owed(base({ lapRows: [null, {}, { lap: 'X' }], boardRows: [null, {}] })));
});

console.log(`baton-wake: ${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  FAIL ' + f);
process.exit(fails.length ? 1 : 0);
