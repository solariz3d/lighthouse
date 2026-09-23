// board-digest.js — the blind gate's OUTPUT behaviour, end to end.
//
// blind.test.js proves the state machine (blind.js) resolves the four cases correctly. This file
// proves board-digest.js ACTS on that resolution correctly — specifically the expired case, which
// had a bug the state machine could not catch: emit() exits the process, so a separate emit() for
// the "window expired" notice returned before the [panes] body ever ran. A stale lock therefore
// muted the room on the turn it expired and every turn after — the exact "must not silently mute
// the room forever" failure blind.js decision #4 exists to prevent — while blindState() itself was
// behaving perfectly. The bug lived in the two-emit sequence, so only a test that reads the emitted
// output can see it.
//
//   node consonance/hooks/board-digest.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const HOOK = path.join(__dirname, 'board-digest.js');
const SIBLING = 'aaaaaaaa-1111-4000-8000-000000000001';
const READER = '0c0c0c0a-0000-4000-8000-0000000000ff'; // any pane that is not the sibling

/** A minimal but real bed: one sibling pane with a prompt and a reply from today, so the digest
 *  has a non-empty [panes] body to either show or (wrongly) suppress. */
function bed() {
  const instances = fs.mkdtempSync(path.join(os.tmpdir(), 'bd-inst-'));
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'bd-data-'));
  const cwd = path.join(instances, 'a-pane');
  fs.mkdirSync(cwd, { recursive: true });
  const now = Date.now();
  fs.writeFileSync(
    path.join(data, 'board.jsonl'),
    [
      { pane: SIBLING, role: 'user', text: 'a prompt from another pane', ts: now - 60_000 },
      { pane: SIBLING, role: 'assistant', text: 'a reply long enough to read as a report rather than tool narration, from a pane that is not the reader', ts: now - 30_000 },
    ].map((o) => JSON.stringify(o)).join('\n') + '\n'
  );
  return { instances, data, cwd };
}

function run(b) {
  const out = execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ cwd: b.cwd, session_id: READER, source: 'user' }),
    encoding: 'utf8',
    env: { ...process.env, CONSONANCE_INSTANCES: b.instances, CONSONANCE_DATA: b.data },
  }).trim();
  if (!out) return '';
  return JSON.parse(out).hookSpecificOutput.additionalContext;
}

test('no lock: the [panes] digest is delivered, with no blind line', () => {
  const b = bed();
  const line = run(b);
  assert.match(line, /\[panes\]/, 'the digest must reach the reader');
  assert.doesNotMatch(line, /\[blind\]/, 'no lock means no blind line');
});

test('active lock: the digest is WITHHELD and the mute declares itself', () => {
  const b = bed();
  fs.writeFileSync(path.join(b.data, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() + 60_000).toISOString(), why: 'arm A' }));
  const line = run(b);
  assert.match(line, /withheld until/, 'an active window mutes the broadcast and says so');
  assert.doesNotMatch(line, /\[panes\]/, 'the pane bodies must not leak during a blind window');
  assert.ok(fs.existsSync(path.join(b.data, 'blind.lock')), 'an active lock is left in place');
});

test('EXPIRED lock: fails OPEN — the notice AND the digest both go out in one turn', () => {
  // The regression guard. Before the fix, emit() for the expiry notice exited the process before
  // the [panes] body ran, so this same run produced the notice with no digest — and every later
  // turn too, because nothing cleared the stale lock.
  const b = bed();
  fs.writeFileSync(path.join(b.data, 'blind.lock'),
    JSON.stringify({ until: new Date(Date.now() - 60_000).toISOString() }));
  const line = run(b);
  assert.match(line, /\[blind\] window expired/, 'the expiry must be declared, not silently inferred');
  assert.match(line, /\[panes\]/, 'the digest must resume in the SAME turn the window is found stale');
});

test('EXPIRED lock is cleared, so the notice fires once rather than every turn forever', () => {
  const b = bed();
  const lock = path.join(b.data, 'blind.lock');
  fs.writeFileSync(lock, JSON.stringify({ until: new Date(Date.now() - 60_000).toISOString() }));
  const first = run(b);
  assert.match(first, /\[blind\] window expired/);
  assert.ok(!fs.existsSync(lock), 'the stale lock must be removed once its expiry has been announced');
  const second = run(b);
  assert.match(second, /\[panes\]/, 'the next turn resumes clean');
  assert.doesNotMatch(second, /\[blind\]/, 'and does not re-announce an already-cleared window');
});

// ── THE ROSTER (L096, stall fix 4, `loop/stall_trace_2026-09-23.md`). The digest listed only panes
// that had exchanged today, and a live seat that was never dispatched was invisible: B sat on L for
// an hour while the chair read the digest as the roster. Every pane in <data>/panes.json now gets a
// row; a silent one reads "0 exch · idle since launch". No roster, or an unreadable one, prints what
// the digest printed before.
const ROSTER = [
  'aaaaaaaa-2222-4000-8000-00000000000a',
  'bbbbbbbb-2222-4000-8000-00000000000b',
  'cccccccc-2222-4000-8000-00000000000c',
  'dddddddd-2222-4000-8000-00000000000d', // silent
];

/** Three roster panes talked today, the fourth never did. Letters are registered for all four, the
 *  way the backend's letters.json names them. `roster` is what panes.json holds (undefined = no file). */
function rosterBed(roster, { raw } = {}) {
  const b = bed();
  const now = Date.now();
  const rows = ROSTER.slice(0, 3).map((pane, i) => ({ pane, role: 'user', text: `task ${i}`, ts: now - (i + 1) * 60_000 }));
  fs.writeFileSync(path.join(b.data, 'board.jsonl'), rows.map((o) => JSON.stringify(o)).join('\n') + '\n');
  fs.writeFileSync(path.join(b.data, 'letters.json'),
    JSON.stringify({ [ROSTER[0]]: 'A', [ROSTER[1]]: 'B', [ROSTER[2]]: 'C', [ROSTER[3]]: 'D' }));
  if (raw !== undefined) fs.writeFileSync(path.join(b.data, 'panes.json'), raw);
  else if (roster !== undefined) fs.writeFileSync(path.join(b.data, 'panes.json'), JSON.stringify(roster));
  return b;
}

/** The pane rows of a digest: the callsign that heads each row, in order. */
function paneRows(digest) {
  return digest.split('\n')
    .map((l) => /^(?:\[panes\] |\s+)([A-Z][A-Z0-9-]*)\s+≥?\d+ exch/.exec(l))
    .filter(Boolean).map((m) => m[1]);
}

const rosterOf = (ids) => ids.map((pane) => ({ pane, cwd: path.join(os.tmpdir(), 'roster-cwd'), label: 'brief', home: 'L' }));

test('ROSTER of 4, exchanges from 3: four rows, the silent seat included', () => {
  const rows = paneRows(run(rosterBed(rosterOf(ROSTER))));
  assert.deepStrictEqual([...rows].sort(), ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']);
});

test('ROSTER: the silent seat reads "0 exch · idle since launch"', () => {
  const out = run(rosterBed(rosterOf(ROSTER)));
  assert.match(out, /DELTA\s+0 exch · idle since launch/);
});

test('ROSTER: a silent seat carries no asked/said/hands lines', () => {
  const lines = run(rosterBed(rosterOf(ROSTER))).split('\n');
  const i = lines.findIndex((l) => /DELTA\s+0 exch/.test(l));
  assert.ok(i >= 0);
  assert.ok(i >= 0 && !/↳/.test(lines[i + 1] || ''), 'a silent seat has no asked, said or hands line under it');
});

test('ROSTER: the reader is never listed to itself, even when it is on the roster', () => {
  const b = rosterBed(rosterOf([...ROSTER, READER]));
  fs.writeFileSync(path.join(b.data, 'letters.json'),
    JSON.stringify({ [ROSTER[0]]: 'A', [ROSTER[1]]: 'B', [ROSTER[2]]: 'C', [ROSTER[3]]: 'D', [READER]: 'E' }));
  assert.deepStrictEqual([...paneRows(run(b))].sort(), ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']);
});

test('ROSTER: talking seats are listed before silent ones', () => {
  const rows = paneRows(run(rosterBed(rosterOf(ROSTER))));
  assert.strictEqual(rows[rows.length - 1], 'DELTA');
});

test('ROSTER: a roster entry that is not a pane uuid is ignored', () => {
  const rows = paneRows(run(rosterBed([...rosterOf(ROSTER), { pane: 'main' }, { cwd: 'no pane' }, 'junk'])));
  assert.deepStrictEqual([...rows].sort(), ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']);
});

test('ROSTER: a seat on the roster twice gets one row', () => {
  const rows = paneRows(run(rosterBed(rosterOf([...ROSTER, ROSTER[3]]))));
  assert.strictEqual(rows.filter((r) => r === 'DELTA').length, 1);
});

test('ROSTER, nobody talked today: the roster alone is still shown', () => {
  const b = rosterBed(rosterOf(ROSTER));
  fs.writeFileSync(path.join(b.data, 'board.jsonl'), '');
  const rows = paneRows(run(b));
  assert.deepStrictEqual([...rows].sort(), ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']);
});

for (const [label, opts] of [
  ['MISSING panes.json', [undefined, {}]],
  ['EMPTY roster []', [[], {}]],
  ['UNREADABLE panes.json', [undefined, { raw: '{not json' }]],
  ['NON-ARRAY panes.json', [undefined, { raw: '{"pane":"x"}' }]],
]) {
  test(`${label}: prints exactly what it printed before — the three talkers, no silent row`, () => {
    const out = run(rosterBed(...opts));
    assert.deepStrictEqual([...paneRows(out)].sort(), ['ALPHA', 'BRAVO', 'CHARLIE']);
    assert.doesNotMatch(out, /idle since launch/);
  });
}

test('MISSING roster and nobody talked today: still silent, as before', () => {
  const b = rosterBed(undefined);
  fs.writeFileSync(path.join(b.data, 'board.jsonl'), '');
  assert.strictEqual(run(b), '');
});

test('ROSTER: the columns stay aligned when the silent seat has the longest callsign', () => {
  const b = rosterBed(rosterOf(ROSTER));
  fs.writeFileSync(path.join(b.data, 'letters.json'),
    JSON.stringify({ [ROSTER[0]]: 'A', [ROSTER[1]]: 'B', [ROSTER[2]]: 'C', [ROSTER[3]]: 'N' })); // NOVEMBER, 8 > 7
  const cols = run(b).split('\n').map((l) => l.replace(/^\[panes\] /, '        '))
    .filter((l) => /\d+ exch/.test(l)).map((l) => l.search(/\d+ exch/));
  assert.strictEqual(cols.length, 4);
  assert.strictEqual(new Set(cols).size, 1, `the exch column must line up across every row, got ${cols}`);
});
