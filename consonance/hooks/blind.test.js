// The four states, and the asymmetry that makes this worth having.
//
// ABSENCE IS OPEN. DAMAGE IS CLOSED. Those are different cases and collapsing them is the whole
// bug: a corrupt lock during a blind window would leak, and a missing lock treated as blind
// would mute the room forever. Most of the assertions below are about that boundary rather than
// about the happy path.
//
// And every mute must DECLARE itself, because a silent gap is indistinguishable from a crashed
// hook. A blind window whose evidence is an absence cannot be audited afterwards, which is
// exactly the condition that made the desktop's cycle 4-7 pairs unreadable in hindsight.
//
//   node consonance/hooks/blind.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
// D130: pinned to a temp dir BEFORE blind.js loads, so no test here can reach the live board. Until
// this line, the round-trip test below passed a lockPath and no boardPath, and every suite run wrote
// an OPEN and a CLOSED row to the real data/board.jsonl — 90 phantom windows by 2026-09-24 06:20Z
// (`handback/p-d130-blind-E_2026-09-24.md` §1), each one a span boundary-check reads as real.
process.env.CONSONANCE_DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'blind-data-'));
const { blindState, declareLine, setBlind, clearBlind, BOARD, isSealedDispatch, sealedGate, SEALED } = require('./blind.js');

test('no test in this file can write the live board: the default board is a temp file', () => {
  assert.ok(path.resolve(BOARD).startsWith(path.resolve(os.tmpdir())), `BOARD is ${BOARD}`);
  assert.ok(path.resolve(SEALED).startsWith(path.resolve(os.tmpdir())), `SEALED is ${SEALED}`);
});

const tmp = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'blind-')), 'blind.lock');

test('no lock: open, and says why', () => {
  const p = tmp();
  const s = blindState(p);
  assert.strictEqual(s.blind, false);
  assert.strictEqual(s.reason, 'no-lock');
});

test('valid unexpired lock: BLIND, carrying its reason and expiry', () => {
  const p = tmp();
  fs.writeFileSync(p, JSON.stringify({ until: new Date(Date.now() + 60000).toISOString(),
                                       why: 'cycle 10 arm A', by: 'chair' }));
  const s = blindState(p);
  assert.strictEqual(s.blind, true);
  assert.strictEqual(s.reason, 'active');
  assert.strictEqual(s.why, 'cycle 10 arm A');
});

test('EXPIRED lock: fails OPEN, and the expiry is reported not inferred', () => {
  // A stale marker must not mute the room forever. The caller is told it expired so it can say
  // so out loud rather than silently resuming.
  const p = tmp();
  fs.writeFileSync(p, JSON.stringify({ until: new Date(Date.now() - 60000).toISOString() }));
  const s = blindState(p);
  assert.strictEqual(s.blind, false);
  assert.strictEqual(s.reason, 'expired');
});

test('CORRUPT lock: fails CLOSED — the case that would otherwise leak', () => {
  const p = tmp();
  fs.writeFileSync(p, '{not json');
  const s = blindState(p);
  assert.strictEqual(s.blind, true, 'a damaged marker must mute, never pass');
  assert.strictEqual(s.reason, 'unreadable');
});

test('lock with no usable expiry is corrupt, not eternal', () => {
  // Reading a missing field as "blind forever" would be a different bug: it would look like a
  // working blind window and never end.
  for (const body of ['{}', '{"until":"whenever"}', '{"why":"no until field"}']) {
    const p = tmp();
    fs.writeFileSync(p, body);
    const s = blindState(p);
    assert.strictEqual(s.blind, true, `${body} must fail closed`);
    assert.strictEqual(s.reason, 'unreadable', `${body} must report as unreadable, not active`);
  }
});

test('absence and damage resolve differently — the asymmetry, stated as a test', () => {
  const missing = tmp();
  const damaged = tmp();
  fs.writeFileSync(damaged, '\u0000\u0000garbage');
  assert.strictEqual(blindState(missing).blind, false);
  assert.strictEqual(blindState(damaged).blind, true);
});

test('every mute declares itself, with a cause a reader can act on', () => {
  const active = declareLine({ blind: true, reason: 'active', until: Date.now() + 60000, why: 'arm A' });
  assert.match(active, /withheld until/);
  assert.match(active, /arm A/);
  assert.match(active, /declared rather than silent/);

  const broken = declareLine({ blind: true, reason: 'unreadable', raw: '{not json' });
  assert.match(broken, /failed CLOSED/, 'a fail-closed mute must say that is what happened');
  assert.match(broken, /Fix or remove/, 'and must say how to clear it');
});

test('set and clear round-trip on the real default path', () => {
  const p = tmp();
  const board = path.join(path.dirname(p), 'board.jsonl');
  const r = setBlind({ minutes: 5, why: 'round trip', lockPath: p, boardPath: board });
  assert.ok(Date.parse(r.until) > Date.now());
  assert.strictEqual(blindState(p).blind, true);
  assert.strictEqual(clearBlind(p, board), true);
  assert.strictEqual(blindState(p).reason, 'no-lock');
  assert.strictEqual(clearBlind(p, board), false, 'clearing nothing reports false rather than throwing');
});

test('the gate is actually wired into the pane broadcast', () => {
  // The module can be perfect and unreferenced. This is the assertion that would have caught
  // "built it, forgot to call it" — a failure this session has now hit three times in other
  // forms, always as something that reported success and did nothing.
  const src = fs.readFileSync(path.join(__dirname, 'board-digest.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  assert.match(code, /require\(['"]\.\/blind\.js['"]\)/, 'board-digest must import the gate');
  assert.match(code, /blindState\(\)/, 'and call it');
  assert.match(code, /declareLine\(/, 'and emit the declaration when muted');
  const gate = code.indexOf('blindState()');
  const panes = code.indexOf('[panes]');
  assert.ok(gate > 0 && panes > gate, 'the gate must come BEFORE the broadcast it guards');
});

// ── ADDED 2026-09-16 (L064, E). THE WINDOW MUST REACH THE BOARD FROM THE TOGGLE, NOT FROM TRAFFIC.
//
// C measured two reachable holes in the app-side write path
// (`handback/p-blind-rows-C_2026-09-16.md` §4.1/§4.2, landed d27ec19):
//   1. the edge is detected inside `board_push`, so a window that opens and closes while nothing
//      pushes leaves NO ROW AT ALL — "the mute is a property of the lock; the record of it is a
//      property of traffic";
//   2. `BLIND_LAST` is a process-global starting at 0, so a lock removed while the app is DOWN
//      never writes CLOSED, and boundary-check reads UNMEASURED forever.
//
// Both are the same shape: the RECORD of the window depends on something other than the window.
// These tests move the record to the one place that is present for both edges by construction —
// the code that toggles the lock.

const rig = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blindboard-'));
  return { lock: path.join(dir, 'blind.lock'), board: path.join(dir, 'board.jsonl'), dir };
};
const rows = (p) => {
  if (!fs.existsSync(p)) return [];
  return fs.readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
};

test('BOARD: opening a window writes an OPEN row the guard can read', () => {
  const r = rig();
  setBlind({ minutes: 5, why: 'a test', lockPath: r.lock, boardPath: r.board });
  const blind = rows(r.board).filter(x => x.pane === 'blind');
  assert.strictEqual(blind.length, 1, 'exactly one row for one open');
  assert.match(blind[0].text, /blind window OPEN/, "boundary-check's blindOverlaps matches on this exact phrase");
  assert.strictEqual(typeof blind[0].ts, 'number', 'the guard sorts on ts');
});

test('BOARD: closing a window writes a CLOSED row', () => {
  const r = rig();
  setBlind({ minutes: 5, lockPath: r.lock, boardPath: r.board });
  clearBlind(r.lock, r.board);
  const blind = rows(r.board).filter(x => x.pane === 'blind');
  assert.strictEqual(blind.length, 2);
  assert.match(blind[1].text, /blind window CLOSED/);
});

test("C's §4.1: a window with NO traffic at all is still visible afterwards", () => {
  // Nothing pushes to the board between the two edges — the case that left no row at all.
  const r = rig();
  setBlind({ minutes: 5, lockPath: r.lock, boardPath: r.board });
  clearBlind(r.lock, r.board);
  const blind = rows(r.board).filter(x => x.pane === 'blind');
  assert.ok(blind.some(x => /OPEN/.test(x.text)) && blind.some(x => /CLOSED/.test(x.text)),
    'the record of a window must not be a property of traffic');
});

test("C's §4.2: a lock removed with no app process writes CLOSED anyway", () => {
  // There is no BLIND_LAST here and no process to have lost it. The toggle is the only actor.
  const r = rig();
  fs.writeFileSync(r.lock, JSON.stringify({ until: new Date(Date.now() + 60000).toISOString() }), 'utf8');
  clearBlind(r.lock, r.board);
  const blind = rows(r.board).filter(x => x.pane === 'blind');
  assert.strictEqual(blind.length, 1, 'a close with no prior open in THIS process still records');
  assert.match(blind[0].text, /blind window CLOSED/);
});

test('BOARD: clearing when there was no lock writes NO row — no phantom close', () => {
  const r = rig();
  const ok = clearBlind(r.lock, r.board);
  assert.strictEqual(ok, false);
  assert.strictEqual(rows(r.board).filter(x => x.pane === 'blind').length, 0,
    'a close that closed nothing must not appear to have closed something');
});

test('BOARD: the CLOSED row does not claim a muted count it cannot have', () => {
  const r = rig();
  setBlind({ minutes: 5, lockPath: r.lock, boardPath: r.board });
  clearBlind(r.lock, r.board);
  const closed = rows(r.board).filter(x => x.pane === 'blind').pop();
  assert.doesNotMatch(closed.text, /\d+\s+entries muted/,
    'only the muting process knows the count; this writer must say so rather than invent one');
  assert.match(closed.text, /count unknown/i, 'and it must say WHY the count is absent');
});

test('BOARD: rows are appended — an existing board is never overwritten', () => {
  const r = rig();
  fs.writeFileSync(r.board, JSON.stringify({ pane: 'chair', role: 'committee', text: 'earlier', ts: 1 }) + '\n');
  setBlind({ minutes: 5, lockPath: r.lock, boardPath: r.board });
  const all = rows(r.board);
  assert.strictEqual(all.length, 2);
  assert.strictEqual(all[0].text, 'earlier', 'the append must not eat the mirror');
});

test('BOARD: an unwritable board does not stop the window from opening, and is not silent', () => {
  // The lock is the safety mechanism; failing to RECORD must never fail to BLIND. But a silent
  // swallow is the defect being fixed, one level up, so it has to say something.
  const r = rig();
  const bad = path.join(r.dir, 'nope', 'board.jsonl');   // parent does not exist
  const errs = [];
  const realErr = process.stderr.write.bind(process.stderr);
  process.stderr.write = (s) => { errs.push(String(s)); return true; };
  let threw = null;
  try { setBlind({ minutes: 5, lockPath: r.lock, boardPath: bad }); } catch (e) { threw = e; }
  finally { process.stderr.write = realErr; }
  assert.strictEqual(threw, null, 'recording is best-effort; blinding is not');
  assert.ok(fs.existsSync(r.lock), 'the lock must still have been written');
  assert.ok(errs.join('').includes('blind'), 'and the failure to record must be said out loud');
});

// ── THE SEALED DETECTOR (D130, E). The window opens on the packet's arrival, so what counts as a
// sealed dispatch is the whole mechanism. Every sealed or blind read the chair dispatched on the
// board is detected (L108 B/C, L113 B/C, D116, D117; §2 of the hand-back); these pin the shapes.
test('SEALED DETECTOR: the L113 packet, pasted, is a sealed dispatch', () => {
  assert.ok(isSealedDispatch('\n\n<pasted_content id="465e">\n[chair:MAIN] B — L113, on L: you are one of TWO SEALED READERS again.'));
});

test('SEALED DETECTOR: a bare chair packet naming a blind read is a sealed dispatch', () => {
  assert.ok(isSealedDispatch('[chair:MAIN] D117 packet B — the second blind read, and it is your kind of question.'));
});

test('SEALED DETECTOR: the words alone, without a chair head, are not a dispatch', () => {
  assert.ok(!isSealedDispatch('This session is being continued. The chair said: you are one of TWO SEALED READERS.'));
});

test('SEALED DETECTOR: a chair packet with no sealed or blind read is not one', () => {
  assert.ok(!isSealedDispatch('[chair:MAIN] E — D125, on D: FIX THE README the stranger couldn\'t follow.'));
});

test('SEALED GATE: a seat with no session id is never muted', () => {
  assert.strictEqual(sealedGate({ sessionId: '', prompt: '[chair:MAIN] a sealed read' }).mute, false);
});

test('SEALED GATE: a window whose expiry is unusable fails CLOSED, not open', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sealed-')), 'sealed.json');
  const sid = 'aaaaaaaa-1111-4000-8000-000000000009';
  fs.writeFileSync(file, JSON.stringify({ windows: { [sid]: { letter: 'R', opened: 1 } } }));
  const g = sealedGate({ sessionId: sid, prompt: 'ok', file, boardPath: path.join(path.dirname(file), 'b.jsonl') });
  assert.strictEqual(g.mute, true);
  assert.match(g.line, /no usable expiry, so this failed CLOSED/);
});
