// chain-indicator.test.js — run with: node chain-indicator.test.js
//
// WHY THIS EXISTS, and why it asserts behaviour rather than names. The two existing ui/ tests check
// that ids match across files, which catches a dead tab and nothing else. This chip's failure modes
// are not naming failures: it can draw an arrow from a hop that never happened, keep drawing one
// after the board went blind, or read a pane's PROSE as a control-plane event. So the render
// decision was written as a pure function and is exercised here with real board rows.
//
// THREE CLASSES ARE PINNED, and each one is a defect this repo has actually shipped:
//
//  1. THE CONTRACT WITH main.rs. This file is a SECOND reader of audit strings main.rs declares a
//     contract for only with chain-status.js (main.rs:8049). A rename there would leave this chip
//     permanently blank with every instrument green — the 2026-08-15 shape exactly. So the formats
//     are asserted against main.rs's OWN SOURCE, not against a copy of it kept here.
//  2. FAILED IS NOT DELIVERED. chair_inject_audit_line exists because a write that never reached
//     the pane once entered the trail as an act. A chip that reads "DELIVERY FAILED" as a hop
//     re-commits that error one layer up.
//  3. STALE MUST NOT READ AS CURRENT. Four distinct stale modes in two days. Every degraded state
//     must return a null arrow, and that is asserted state by state.

'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const C = require('./chain-indicator.js');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); fail++; }
};

console.log('ui/chain-indicator');

// ---- fixtures: real audit lines, copied from data/board.jsonl on 2026-09-01 ------------------

const T0 = 1788257669625;
const chair = (text, ts) => ({ pane: 'chair', role: 'committee', text, ts, ts_source: 'push' });
const DISPATCH = chair('chair injected (chair: claude-opus-5) -> a2122153 [delivered and received]: L025 - P-INDICATOR - build the loop indicator in the UI.', T0);
const HANDBACK = chair('call_librarian C -> LIB [Received]: "P-INTAKE (L024) hand-back: exo_memory/handback/p-intake-committee-handback-route_2026-09-01.md"', T0);
const RING = chair('call_chair -> Main [Received]: "L025 MAP filed: librarian/2026-09-01.md:511"', T0);

// ---- 1. the three hops are read, and only from a chair row ----------------------------------

t('a dispatch row is read as orch -> pane, and the arrow points at the PANE', () => {
  const v = C.chainView([DISPATCH], T0, {});
  assert.strictEqual(v.state, 'quiet');
  assert.strictEqual(v.arrow, '-> pane a2122153', 'the arrow must name the next hop, not the last');
});

t('a hand-back row is read as pane -> LIB, and the arrow points at LIB', () => {
  assert.strictEqual(C.chainView([HANDBACK], T0, {}).arrow, '-> LIB');
});

t('a ring row is read as LIB -> orch, and the arrow points at the ORCHESTRATOR', () => {
  assert.strictEqual(C.chainView([RING], T0, {}).arrow, '-> orch');
});

t('the arrow names the NEXT hop, never the party that just acted', () => {
  // The brief's whole distinction. After LIB rings the chair, the loop is waiting on the chair —
  // a display naming "LIB" there would be a status readout, not something to wait on.
  assert.strictEqual(C.nextHop({ kind: 'ring' }, {}).who, 'orch');
  assert.strictEqual(C.nextHop({ kind: 'handback', letter: 'C' }, {}).who, 'LIB');
});

t('a pane letter replaces the short id when the mapping is known, and is never invented', () => {
  const letters = { 'a2122153-a37e-41a6-a86f-534267ec0565': 'E' };
  assert.strictEqual(C.chainView([DISPATCH], T0, { letters }).arrow, '-> pane E');
  assert.strictEqual(C.chainView([DISPATCH], T0, { letters: {} }).arrow, '-> pane a2122153',
    'with no mapping it must fall back to the id, not guess a letter');
});

// ---- 2. THE SPOOF GUARD ----------------------------------------------------------------------

t('HOSTILE: a PANE row quoting an audit line verbatim is NOT read as a hop', () => {
  // Panes discuss these strings constantly — this file's own hand-back quotes all three. A pane
  // turn is pushed to the board with pane=<uuid>; only chair_audit() stamps pane="chair".
  const spoof = {
    pane: '0c0c0c0b-0000-4000-8000-00000000115b', role: 'assistant',
    text: 'call_librarian C -> LIB [Received]: "the edge fired"', ts: T0, ts_source: 'push',
  };
  assert.strictEqual(C.readHop(spoof), null, 'a pane turn must never register as a control-plane hop');
  assert.strictEqual(C.chainView([spoof], T0, {}).state, 'unknown');
  assert.strictEqual(C.chainView([spoof], T0, {}).arrow, null);
});

t('POSITIVE CONTROL: the identical text on a chair row IS read', () => {
  // Without this, the guard above would pass for a parser that rejects everything.
  assert.ok(C.readHop(HANDBACK), 'the same text from pane="chair" must be a hop');
});

// ---- 3. FAILED / REFUSED / EXPIRED ARE NOT HOPS ----------------------------------------------

t('a FAILED delivery is not a hop — "chair_inject" (underscore) is the failure path', () => {
  const failed = chair('chair_inject (chair: claude-opus-5) -> a2122153: DELIVERY FAILED (pane gone) - nothing reached the pane: L025', T0);
  assert.strictEqual(C.readHop(failed), null);
});

t('a refused call_librarian is not a hop', () => {
  assert.strictEqual(C.readHop(chair('call_librarian E REFUSED - no address row for this mount', T0)), null);
  assert.strictEqual(C.readHop(chair('call_librarian E -> LIB FAILED: pane not found', T0)), null);
});

t('a refused or expired call_chair is not a hop', () => {
  assert.strictEqual(C.readHop(chair('call_chair REFUSED - wrong mount', T0)), null);
  assert.strictEqual(C.readHop(chair('call_chair: EXPIRED unexecuted (caller timed out before the actuator ran)', T0)), null);
});

t('a failed dispatch does not mask the real last hop behind it', () => {
  // The ordering case that matters: the newest row is a failure, so the position is still the
  // successful hop before it — not "unknown", and not the failure read as progress.
  const failed = chair('chair_inject (chair: claude-opus-5) -> ffffffff: DELIVERY FAILED (x) - nothing reached the pane: y', T0 + 1000);
  const v = C.chainView([RING, failed], T0 + 1000, {});
  assert.strictEqual(v.arrow, '-> orch', 'the last SUCCESSFUL hop is the position');
});

// ---- 4. STALE MUST NEVER READ AS CURRENT -----------------------------------------------------

t('an unreadable board yields no position and NO ARROW', () => {
  const v = C.chainView(null, T0, {});
  assert.strictEqual(v.state, 'unavailable');
  assert.strictEqual(v.arrow, null);
  assert.strictEqual(v.elapsedMin, null, 'no elapsed figure may be shown for a board that was not read');
});

t('an EMPTY ring — the state after every relaunch — says unknown and draws NO ARROW', () => {
  // main.rs:5988 creates the ring empty and nothing rehydrates it from board.jsonl.
  const v = C.chainView([], T0, {});
  assert.strictEqual(v.state, 'unknown');
  assert.strictEqual(v.arrow, null);
});

t('an open blind window suppresses the arrow even though a hop is present', () => {
  const blind = { pane: 'blind', role: 'committee', text: 'blind window OPEN - board pushes muted and counted until the lock lifts', ts: T0 + 10, ts_source: 'push' };
  const v = C.chainView([RING, blind], T0 + 10, {});
  assert.strictEqual(v.state, 'blind');
  assert.strictEqual(v.arrow, null, 'a hop that cannot be aged must not carry an arrow');
});

t('a CLOSED blind window restores the reading', () => {
  const open = { pane: 'blind', role: 'committee', text: 'blind window OPEN - x', ts: T0, ts_source: 'push' };
  const closed = { pane: 'blind', role: 'committee', text: 'blind window CLOSED - 3 entries muted during the window', ts: T0 + 20, ts_source: 'push' };
  assert.strictEqual(C.chainView([RING, open, closed], T0 + 20, {}).state, 'quiet');
});

// ---- 5. the escalation, and the payload that must change -------------------------------------

t('under the threshold it is quiet; at the registered 15 minutes it escalates', () => {
  const min = (n) => T0 + n * 60000;
  assert.strictEqual(C.chainView([RING], min(14), {}).state, 'quiet');
  assert.strictEqual(C.chainView([RING], min(15), {}).state, 'waiting');
  assert.strictEqual(C.ESCALATE_MIN, 15, "CHARLIE's registered value, carried not re-invented");
});

t('the payload CHANGES while the state does not — R2/A4, the static-state paradox', () => {
  // A stall is the state not changing, so a payload of the state alone would be byte-identical
  // across every emission and habituate. Elapsed is what grows.
  const a = C.chainView([RING], T0 + 20 * 60000, {});
  const b = C.chainView([RING], T0 + 21 * 60000, {});
  assert.strictEqual(a.state, b.state, 'the state is deliberately unchanged in this case');
  assert.notStrictEqual(a.elapsedMin, b.elapsedMin, 'the rendered number must still change');
  assert.strictEqual(b.elapsedMin, 21);
});

// ---- 6. IT IS A SENSOR: no verdicts reach the DOM ---------------------------------------------

t('no rendered string calls anything stalled, stuck, dead or broken', () => {
  // chain-status.js's law, and its data refutes the axis: L009 sat 3554s healthy, L010 3557s dead.
  const views = [
    C.chainView(null, T0, {}), C.chainView([], T0, {}),
    C.chainView([RING], T0, {}), C.chainView([RING], T0 + 99 * 60000, {}),
    C.chainView([DISPATCH], T0 + 99 * 60000, {}),
  ];
  const banned = /\b(stalled|stuck|dead|broken|hung|failing|late)\b/i;
  for (const v of views) {
    const rendered = [v.text, v.arrow, v.elapsedMin != null ? v.elapsedMin + 'm' : ''].join(' ');
    assert.ok(!banned.test(rendered), 'a verdict reached the chip: "' + rendered + '"');
  }
});

t('render() writes through textContent, never innerHTML — the board is instance-written', () => {
  // Comments are stripped first. The v1 of this test matched the bare word and went red on the
  // comment EXPLAINING why innerHTML is avoided — a scanner red over a problem already fixed,
  // which is the exact inverse the visible-channel registration flagged at its §4. The defect
  // shape is a WRITE, so that is what is asserted; the explanation stays in the source.
  const src = fs.readFileSync(path.join(__dirname, 'chain-indicator.js'), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/innerHTML/.test(code), 'innerHTML must not appear in executable code');
  assert.ok(/\btextContent\b/.test(code), 'the chip must render via textContent');
});

t('POSITIVE CONTROL: the comment-stripped scan still catches a real innerHTML write', () => {
  // Without this, the strip above could silently remove everything and the check would read clean
  // forever — the "scanner green over a problem it still has" class.
  const hostile = '// el.innerHTML is bad\nfunction f(el, s) { el.innerHTML = s; }\n';
  const code = hostile.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(/innerHTML/.test(code), 'a real write must survive comment-stripping and be caught');
});

// ---- 7. THE CONTRACT WITH main.rs, asserted against main.rs itself ---------------------------

const MAIN_RS = path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs');

t('main.rs still emits the three audit formats this chip parses', () => {
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.ok(rs.includes('"chair injected (chair: {chair_model}) -> {id} [{state}]: {preview}"'),
    'the dispatch audit format changed in main.rs — this chip would go silently blank');
  assert.ok(rs.includes('"call_librarian {letter} -> LIB [{receipt:?}]'),
    'the hand-back audit format changed in main.rs');
  assert.ok(rs.includes('"call_chair -> Main [{receipt:?}]'),
    'the ring audit format changed in main.rs');
});

t('main.rs still writes failures under "chair_inject", not "chair injected"', () => {
  // The one-character discriminator this file leans on. If the failure path ever adopted the
  // success wording, every DELIVERY FAILED would render here as a completed hop.
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.ok(rs.includes('"chair_inject (chair: {chair_model}) -> {id}: DELIVERY FAILED'),
    'the failure line no longer uses the chair_inject prefix — the hop/no-hop cut is gone');
});

t('main.rs still stamps audit rows with pane="chair" — the spoof guard depends on it', () => {
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(rs, /fn chair_audit[\s\S]{0,400}pane:\s*"chair"\.to_string\(\)/,
    'chair_audit no longer stamps pane="chair"; a pane could then spoof a hop');
});

t('the board ring is still NOT rehydrated at startup — the unknown state is load-bearing', () => {
  // If someone later loads board.jsonl into the ring at boot, the "empty after relaunch" reasoning
  // in this chip's header stops being true and the comment should be corrected, not left to rot.
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.ok(rs.includes('.manage(Board(Arc::new(Mutex::new(VecDeque::new()))))'),
    'the Board ring is no longer constructed empty — re-check chain-indicator.js\'s header');
});

// ---- 8. the chip is actually wired into the page ---------------------------------------------

t('index.html declares the chip and loads the script AFTER term.js', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /id="chainchip"/, 'no chip in the markup — the script would find nothing');
  const iTerm = html.indexOf('src="term.js"');
  const iChain = html.indexOf('src="chain-indicator.js"');
  assert.ok(iTerm > 0 && iChain > 0, 'both scripts must be loaded by index.html');
  assert.ok(iTerm < iChain,
    'chain-indicator reads term.js\'s `paneLetters`; typeof on a `let` in its temporal dead zone ' +
    'THROWS rather than returning "undefined", so term.js must execute first');
});

t('app.css styles every state the view can return', () => {
  const css = fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8');
  for (const s of ['quiet', 'waiting', 'unknown', 'unavailable', 'blind']) {
    assert.ok(css.includes('chain-' + s), 'no style for state ' + s + ' — it would render unstyled');
  }
});

// ---- 9b. THE TWO DEFECTS ALPHA PROVED (P-DOUBLE-READ, L025) -----------------------------------
//
// Both are one species: AN INSTRUMENT READING THE MOST RECENT EVENT AS THE CURRENT STATE. A fan-out
// breaks it because the newest event is one of several in flight; an unconfirmed delivery breaks it
// because the newest event may not have happened. v1 shipped both, and both failed in the UNSAFE
// direction — a confident arrow where there should have been none.

// --- DEFECT 1: an unconfirmed delivery must not draw an arrow, at any of the three edges ---

const UNCONF = {
  dispatch: chair("chair injected (chair: claude-opus-5) -> a2122153 [WRITTEN BUT UNCONFIRMED — no render in the pane's capture within 4000ms]: L025", T0),
  notchecked: chair('chair injected (chair: claude-opus-5) -> a2122153 [written; receipt not checked]: L025', T0),
  handback: chair('call_librarian C -> LIB [Unconfirmed]: "hand-back"', T0),
  ring: chair('call_chair -> Main [Unconfirmed]: "the map is filed"', T0),
};

for (const [name, row] of Object.entries(UNCONF)) {
  t(`DEFECT 1 — an unconfirmed ${name} is READ as a hop but draws NO ARROW`, () => {
    // Read, not discarded, and the distinction is the fix: if readHop simply refused these,
    // latestHop would scan PAST them to an older hop and draw a confident arrow for a position
    // that has since been superseded. The uncertainty has to be carried.
    const hop = C.readHop(row);
    assert.ok(hop, 'the row must still be recognised as an event');
    assert.strictEqual(hop.confirmed, false, 'it must not be marked confirmed');
    const v = C.chainView([row], T0, {});
    assert.strictEqual(v.state, 'unconfirmed');
    assert.strictEqual(v.arrow, null, 'no arrow may be drawn from a delivery that was not confirmed');
  });
}

t('DEFECT 1 — POSITIVE CONTROL: the confirmed spelling at each edge still draws its arrow', () => {
  // Without this the fix passes for a version that refuses every receipt and never draws anything.
  assert.strictEqual(C.chainView([HANDBACK], T0, {}).arrow, '-> LIB');
  assert.strictEqual(C.chainView([RING], T0, {}).arrow, '-> orch');
  assert.strictEqual(C.chainView([DISPATCH], T0, {}).arrow, '-> pane a2122153');
});

t('DEFECT 1 — an unconfirmed hop does NOT fall back to the older hop behind it', () => {
  // The failure mode of the naive fix, asserted directly: with a confirmed ring followed by an
  // unconfirmed dispatch, drawing "-> orch" would be a confident arrow for a superseded position.
  const later = chair(UNCONF.dispatch.text, T0 + 1000);
  const v = C.chainView([RING, later], T0 + 1000, {});
  assert.strictEqual(v.state, 'unconfirmed');
  assert.notStrictEqual(v.arrow, '-> orch', 'it must not reach back past the unconfirmed row');
  assert.strictEqual(v.arrow, null);
});

t('DEFECT 1 — the elapsed figure IS shown, unlike the other no-arrow states', () => {
  // Deliberate difference: in unavailable/unknown/blind the whole reading is untrustworthy. Here
  // the timestamp is sound — the write demonstrably happened then — and only the landing is unknown.
  const v = C.chainView([UNCONF.ring], T0 + 7 * 60000, {});
  assert.strictEqual(v.elapsedMin, 7);
  assert.ok(/Unconfirmed/.test(v.why), 'the tooltip must name the receipt it could not confirm');
});

// --- DEFECT 2: the lap is a fan-out; count outstanding dispatches, not the newest receipt ---

/** Tonight's real shape: four panes dispatched within minutes, one hands back. */
function fanout(nBack) {
  const ids = ['0845a868', 'a2122153', '6fe15f0a', '12fb81f6'];
  const letters = { C: 0, E: 1, A: 2, K: 3 };
  const rows = ids.map((id, i) =>
    chair(`chair injected (chair: claude-opus-5) -> ${id} [delivered and received]: L025 packet`, T0 + i * 1000));
  Object.keys(letters).slice(0, nBack).forEach((L, i) =>
    rows.push(chair(`call_librarian ${L} -> LIB [Received]: "hand-back"`, T0 + 10000 + i * 1000)));
  const map = {};
  ids.forEach((id, i) => { map[id + '-0000-4000-8000-000000000000'] = Object.keys(letters)[i]; });
  return { rows, map };
}

t('DEFECT 2 — THE BAR: 4 dispatched, 1 back — the chip says 3 out, NOT "at LIB"', () => {
  const { rows, map } = fanout(1);
  const v = C.chainView(rows, T0 + 11000, { letters: map });
  assert.strictEqual(v.outstanding, 3, 'three panes are still out');
  assert.strictEqual(v.text, 'chain 3 panes out');
  assert.notStrictEqual(v.arrow, '-> LIB',
    'v1 rendered "chain LIB -> LIB" here while three panes were still out — the confident wrong reading');
  assert.match(v.arrow, /^-> panes /, 'the arrow must name who is actually outstanding: ' + v.arrow);
  for (const L of ['E', 'A', 'K']) assert.ok(v.arrow.includes(L), 'missing outstanding pane ' + L);
  assert.ok(!v.arrow.includes('C'), 'C handed back and must not still be listed');
});

t('DEFECT 2 — the count falls as hand-backs arrive, and only clears at zero', () => {
  for (const [back, left] of [[0, 4], [1, 3], [2, 2], [3, 1]]) {
    const { rows, map } = fanout(back);
    assert.strictEqual(C.chainView(rows, T0 + 20000, { letters: map }).outstanding, left,
      `${back} back should leave ${left} out`);
  }
  const { rows, map } = fanout(4);
  const v = C.chainView(rows, T0 + 20000, { letters: map });
  assert.strictEqual(v.outstanding, 0);
  assert.strictEqual(v.arrow, '-> LIB', 'with none outstanding it waits on LIB to ring');
});

t('DEFECT 2 — elapsed is measured from the OLDEST STILL-OUTSTANDING dispatch, not the newest receipt', () => {
  // The newest receipt is seconds old while the oldest outstanding dispatch is 40 minutes old.
  // Reading the newest is exactly what made v1 report a fresh loop during a long stall.
  // C was dispatched at T0 and HAS returned, so the oldest OUTSTANDING one is E at T0+1000 —
  // the distinction the name of this test turns on.
  const { rows, map } = fanout(1);
  const v = C.chainView(rows, T0 + 1000 + 40 * 60000, { letters: map });
  assert.strictEqual(v.elapsedMin, 40, 'measured from E at T0+1000, not from returned C at T0');
  assert.strictEqual(v.state, 'waiting', 'past the threshold it must escalate');
  // and the returned pane's clock must not be the one reported
  assert.notStrictEqual(C.chainView(rows, T0 + 40 * 60000, { letters: map }).elapsedMin, 40);
});

t('DEFECT 2 — a `ring` closes the leg: dispatches before it are not counted as outstanding', () => {
  const { rows } = fanout(0);
  const closed = rows.concat([chair('call_chair -> Main [Received]: "leg done"', T0 + 30000)]);
  const v = C.chainView(closed, T0 + 31000, {});
  assert.strictEqual(v.outstanding, 0, 'the ring ends the leg; those four belong to it');
  assert.strictEqual(v.arrow, '-> orch');
});

t('DEFECT 2 — dispatches AFTER a ring belong to the new leg and are counted', () => {
  const rows = [
    chair('call_chair -> Main [Received]: "previous leg done"', T0),
    chair('chair injected (chair: claude-opus-5) -> 0845a868 [delivered and received]: new', T0 + 1000),
    chair('chair injected (chair: claude-opus-5) -> 6fe15f0a [delivered and received]: new', T0 + 2000),
  ];
  const v = C.chainView(rows, T0 + 3000, {});
  assert.strictEqual(v.outstanding, 2);
});

t('DEFECT 2 — a re-dispatch to the SAME pane is not counted twice', () => {
  const rows = [
    chair('call_chair -> Main [Received]: "leg done"', T0),
    chair('chair injected (chair: claude-opus-5) -> 0845a868 [delivered and received]: first', T0 + 1000),
    chair('chair injected (chair: claude-opus-5) -> 0845a868 [delivered and received]: second', T0 + 2000),
  ];
  assert.strictEqual(C.chainView(rows, T0 + 3000, {}).outstanding, 1);
});

t('DEFECT 2 — the window limit is STATED: the count is a floor, not a total', () => {
  const { rows, map } = fanout(1);
  const v = C.chainView(rows, T0 + 11000, { letters: map });
  assert.ok(/floor, not a total/.test(v.why),
    'a dispatch evicted from the 300-row ring is invisible; the tooltip must say the count is a floor');
});

t('DEFECT 2 — LIVE-FIRE SHAPE: a hand-back that CROSSES a ring still closes its dispatch', () => {
  // Found by running against the real board, not by a fixture, and it is why this counts by pane
  // identity rather than "dispatches since the last ring". The actual rows, 2026-09-01:
  //   04:58:24 dispatch C · 04:59:06 ring · 05:02:03 hand-back C
  // The boundary version reported ZERO outstanding while two panes were out, including this one.
  const rows = [
    chair('call_librarian E -> LIB [Received]: "an earlier leg"', T0 - 60000),
    chair('chair injected (chair: claude-opus-5) -> 0845a868 [delivered and received]: p', T0),
    chair('chair injected (chair: claude-opus-5) -> a2122153 [delivered and received]: p', T0 + 1000),
    chair('call_chair -> Main [Received]: "ring"', T0 + 2000),
    chair('call_librarian C -> LIB [Received]: "late hand-back"', T0 + 3000),
  ];
  const map = { '0845a868-x': 'C', 'a2122153-y': 'E' };
  const v = C.chainView(rows, T0 + 4000, { letters: map });
  assert.strictEqual(v.outstanding, 1, 'C came back across the ring; E never did');
  assert.strictEqual(v.arrow, '-> pane E', 'E must still be named outstanding: ' + v.arrow);
});

t('DEFECT 2 — THE RESIDUAL, pinned rather than hidden: a ring closes a pane on its FIRST appearance', () => {
  // The cost of the librarian exception above, stated as a test so it cannot drift into a surprise.
  // A committee pane with no PRIOR hand-back anywhere in the window is indistinguishable from the
  // librarian on this channel, so a ring closes it. It self-corrects the moment that pane hands
  // back once. No better signal exists here: `call_chair -> Main` names no actor.
  const rows = [
    chair('chair injected (chair: claude-opus-5) -> a2122153 [delivered and received]: p', T0),
    chair('call_chair -> Main [Received]: "ring"', T0 + 1000),
  ];
  assert.strictEqual(C.chainView(rows, T0 + 2000, { letters: { 'a2122153-y': 'E' } }).outstanding, 0,
    'documented residual: without a prior hand-back E cannot be told from the librarian');
  // and the self-correction: give it one prior hand-back and it is tracked correctly
  const withPrior = [chair('call_librarian E -> LIB [Received]: "earlier"', T0 - 1000)].concat(rows);
  assert.strictEqual(C.chainView(withPrior, T0 + 2000, { letters: { 'a2122153-y': 'E' } }).outstanding, 1);
});

t('DEFECT 2 — a target that NEVER hands back is ring-closable, so the librarian does not stick', () => {
  // A dispatch to the librarian is answered on `call_chair`, not `call_librarian`. With no
  // behavioural exception it would sit outstanding forever. `call_chair -> Main` names no actor
  // (ALPHA's Q2), so the discriminator is that the target produced no hand-back in the window.
  const rows = [
    chair('chair injected (chair: claude-opus-5) -> 0c0c0c0b [delivered and received]: to LIB', T0),
    chair('call_chair -> Main [Received]: "the map is filed"', T0 + 1000),
  ];
  assert.strictEqual(C.chainView(rows, T0 + 2000, { letters: { '0c0c0c0b-z': 'M' } }).outstanding, 0);
});

t('DEFECT 2 — an unresolved pane id is still named when nothing has returned', () => {
  // Dispatches carry ids and hand-backs carry letters. With no letters map and nothing returned,
  // the outstanding set IS the dispatch set, so it can be named in whatever alphabet it arrived in
  // rather than degraded to a bare count.
  assert.strictEqual(C.chainView([DISPATCH], T0, {}).arrow, '-> pane a2122153');
});

// --- ALPHA's Q2: RE_RING is actor-blind, and a third ADDRESS_TABLE row would mislabel a hop ---

t("ADDRESS_TABLE still has exactly 2 rows — `call_chair` has no actor in its audit line", () => {
  // The one place the receipt shapes can disagree with the real routing table. `call_chair -> Main`
  // names no actor, so it is correct only while the librarian is the sole holder of that verb. When
  // the Third Place gains the row, a Third Place ring is byte-identical and this chip would draw
  // "LIB -> orch" for a hop the librarian never made. A count, not a list — so pinning it here is
  // not a second copy of the verb list, and main.rs already asserts the same constant.
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(rs, /assert_eq!\(ADDRESS_TABLE\.len\(\),\s*2/,
    'ADDRESS_TABLE gained a row: RE_RING is actor-blind and would mislabel the new holder as LIB');
});

// ---- 9c. chain_state — THE POSITION SOURCE THAT SURVIVES A RELAUNCH ---------------------------
//
// The librarian's vocabulary ruling (L025), implemented rather than re-derived:
//   chain_state is the POSITION source (lap · stage · holder · age) and survives a relaunch;
//   the board ring stays the HOP source, because receipts carry evidential weight;
//   ring empty  -> the arrow is labelled from holder -> next hop;
//   both present -> the command sets the stage text, the ring sets the arrow;
//   self_reported shows as a flag; `note` is NOT displayed.

const OPEN = {
  open: true, reason: null, lap: 'L025', chain: 'handbacks-in', holder: 'librarian',
  note: 'this must never be rendered', at: T0, age_ms: 4 * 60000,
  also_open: 1, self_reported: true, unreadable: 0,
};
// TWO closed shapes, and until AMENDMENT 2 (4e0de97) this file had one. `chain_state` returns a
// different `reason` for "laps ran and every one is filed" than for "no lap has ever opened", and
// nothing read the difference, so a COMPLETED CYCLE and a machine that had never run one rendered
// identically. Both fixtures carry main.rs's own wording, pinned against its source below.
const CLOSED = {
  open: false, reason: 'every lap with a baton row is filed', lap: null, chain: null,
  holder: null, note: null, at: null, age_ms: null, also_open: 0, self_reported: true, unreadable: 0,
};
const NEVER_RAN = Object.assign({}, CLOSED, { reason: 'the ledger carries no baton rows yet' });

t('THE BAR — a relaunch with a lap open shows the LAP, not "position unknown"', () => {
  // The empty ring is exactly the post-relaunch state, and before this command it produced
  // "position unknown" for a lap that was plainly open — the thing the chip was built to prevent.
  const v = C.chainView([], T0, { chain: OPEN });
  assert.notStrictEqual(v.state, 'unknown');
  assert.ok(v.text.includes('L025'), 'the lap must be shown: ' + v.text);
  assert.ok(v.text.includes('handbacks-in'), 'the stage must be shown: ' + v.text);
  assert.strictEqual(v.arrow, '-> orch', 'holder librarian -> next hop is the orchestrator');
  assert.strictEqual(v.elapsedMin, 4, 'age comes from the command');
});

t('the chip\'s PRE-RENDER placeholder must not read as any state this file renders', () => {
  // A DEAD SCRIPT AND A LIVE `unknown` LOOKED IDENTICAL ON SCREEN. index.html shipped the chip
  // with the literal text `chain ? position unknown` — byte-for-byte the `unknown` state's own
  // text — so "chain-indicator.js never executed" and "it executed and had no reading" produced
  // the same pixels. The seam falsifier (loop/packet_aura_2026-09-02.md §6) splits three ways on
  // the assumption that a rendered state is what is on screen; with an identical placeholder it
  // splits four, and the fourth is invisible. The placeholder is the ONLY string a person can see
  // that was not produced by `render()`, so it has to be unmistakable.
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const m = /<span id="chainchip"[^>]*>([^<]*)<\/span>/.exec(html);
  assert.ok(m, 'the #chainchip span is gone from index.html; the whole chip renders nowhere');
  const placeholder = m[1].trim();
  const rendered = [
    C.chainView([], T0, {}),                       // unknown
    C.chainView(null, T0, {}),                     // unavailable
    C.chainView([], T0, { chain: CLOSED }),        // idle
  ].map((v) => v.text);
  for (const text of rendered) {
    assert.notStrictEqual(placeholder, text,
      'the placeholder is identical to a rendered state (' + JSON.stringify(text) +
      '), so a chip that never ran is indistinguishable from one that ran and read that state');
  }
});

t('THE VOCABULARY IS THE LIBRARIAN\'S RULING, and a holder outside it draws no arrow and says whose', () => {
  // The ruling (chain-indicator.js:301) is chair -> panes, panes -> LIB, librarian -> orch.
  // This pins BOTH halves, because the second half is load-bearing and untested until now: the
  // ledger's `holder` is free text (tools/lap-row.js:373 accepts any --holder), and since L027 the
  // dispatch rows have carried PANE NAMES (`charlie`, `bravo`, `echo`) instead of `panes`. Those
  // fall through to null here — correctly, since inventing a station from an unknown word is the
  // stale-reading failure — but SILENTLY unless the tooltip names the word it could not place.
  // Widening the map at this reader would bless a drift that also breaks tools/chain-status.js:721,
  // so the vocabulary is pinned rather than widened; see handback/p-aura_2026-09-02.md.
  const arrowFor = (holder) => C.chainView([], T0, {
    chain: { open: true, lap: 'L029', chain: 'dispatched', holder, at: T0, age_ms: 0,
             self_reported: true, also_open: 0, unreadable: 0 },
  });
  assert.strictEqual(arrowFor('chair').arrow, '-> panes');
  assert.strictEqual(arrowFor('panes').arrow, '-> LIB');
  assert.strictEqual(arrowFor('librarian').arrow, '-> orch');

  const v = arrowFor('echo');
  assert.strictEqual(v.arrow, null, 'an unregistered holder must not be guessed into a station');
  assert.ok(v.why.includes('"echo"'),
    'the tooltip must name the holder it could not place, or the gap is invisible: ' + v.why);
});

t('THE BAR — with NO lap ever opened the chip renders, and says so as BOOT rather than as an error', () => {
  // AMENDED for AMENDMENT 2: this test used the CLOSED fixture, whose reason is "every lap ... is
  // filed", and asserted `idle`. That fixture is now `complete` — the assertion encoded the
  // pre-amendment spec in which done and never-started were one state. The test's INTENT (a closed
  // ledger renders as boot, not as an error) is unchanged and is now carried by NEVER_RAN; the
  // other half of the old fixture moved to the `complete` test below. Nothing was weakened: what
  // was one assertion is now two, over two facts that used to be one.
  const v = C.chainView([], T0, { chain: NEVER_RAN });
  assert.strictEqual(v.state, 'idle');
  assert.strictEqual(v.text, 'chain — no lap open');
  assert.strictEqual(v.arrow, null);
  assert.ok(/not a failure/.test(v.why), 'the tooltip must say this is the ordinary state at boot');
  assert.ok(!/unknown/.test(v.text), '"no lap open" is a reading; "unknown" is the absence of one');
});

t('the holder -> next hop mapping is the ruling: chair->panes, panes->LIB, librarian->orch', () => {
  const at = (holder) => C.chainView([], T0, { chain: Object.assign({}, OPEN, { holder }) }).arrow;
  assert.strictEqual(at('chair'), '-> panes');
  assert.strictEqual(at('panes'), '-> LIB');
  assert.strictEqual(at('librarian'), '-> orch');
  assert.strictEqual(at('something-else'), null, 'an unknown holder must not invent an arrow');
});

t('BOTH sources: the command sets the stage TEXT and the ring sets the ARROW', () => {
  // The ring says a pane is out; the command says the lap is L025/handbacks-in. Per the ruling the
  // text is the command's and the arrow is the ring's — a receipt outranks a self-report for the
  // one thing a receipt can prove.
  const v = C.chainView([DISPATCH], T0, { chain: OPEN });
  assert.ok(v.text.includes('L025'), 'stage text from the command: ' + v.text);
  assert.strictEqual(v.arrow, '-> pane a2122153', 'arrow from the ring receipt, not from the holder');
  assert.notStrictEqual(v.arrow, '-> orch', 'the holder-derived arrow must NOT win when a receipt exists');
});

t('BOTH sources, LAST-HOP branch too: a receipt arrow still beats the holder-derived one', () => {
  // Added after a mutation SURVIVED: the test above exercises the fan-out branch only, so a change
  // making holderArrow win in the last-hop branch went undetected. HANDBACK leaves nothing
  // outstanding, which is what routes through that branch.
  const v = C.chainView([HANDBACK], T0, { chain: OPEN });
  assert.ok(v.text.includes('L025'), 'stage text from the command: ' + v.text);
  assert.strictEqual(v.arrow, '-> LIB', 'the receipt says LIB; holder librarian would have said orch');
});

t('`note` is NEVER rendered, in any state — the ruling says so explicitly', () => {
  const views = [
    C.chainView([], T0, { chain: OPEN }),
    C.chainView([DISPATCH], T0, { chain: OPEN }),
    C.chainView([UNCONF.ring], T0, { chain: OPEN }),
    C.chainView(fanout(1).rows, T0 + 11000, { chain: OPEN, letters: fanout(1).map }),
  ];
  for (const v of views) {
    assert.ok(!String(v.text).includes('never be rendered'), 'note leaked into the chip text');
    assert.ok(!String(v.arrow || '').includes('never be rendered'), 'note leaked into the arrow');
    assert.ok(!String(v.why).includes('never be rendered'), 'note leaked into the tooltip');
  }
});

t('self_reported is surfaced as a flag wherever the position came from the command', () => {
  assert.strictEqual(C.chainView([], T0, { chain: OPEN }).selfReported, true);
  assert.strictEqual(C.chainView([DISPATCH], T0, { chain: OPEN }).selfReported, true);
  // and it is absent when the position is receipt-derived only
  assert.ok(!C.chainView([DISPATCH], T0, {}).selfReported);
});

t('the two sources fail INDEPENDENTLY — a dead board still shows an open lap', () => {
  // Regression on the wiring: before Promise.all-with-per-source-catch, one failing invoke took
  // the whole chip to `unavailable` and the lap state on disk went unread.
  const v = C.chainView(null, T0, { chain: OPEN });
  assert.notStrictEqual(v.state, 'unavailable', 'a dead board must not hide the lap state');
  assert.ok(v.text.includes('L025'));
  assert.ok(/could not be read/.test(v.why), 'and the tooltip must say the board was unavailable');
  // the mirror case: a dead command with a live board still draws from receipts
  const w = C.chainView([DISPATCH], T0, { chain: null });
  assert.strictEqual(w.arrow, '-> pane a2122153');
});

t('the UI actually CALLS chain_state — the command is inert until something invokes it', () => {
  const src = fs.readFileSync(path.join(__dirname, 'chain-indicator.js'), 'utf8');
  assert.match(src, /invoke\(\s*['"]chain_state['"]|inv\(['"]chain_state['"]\)/,
    'nothing in ui/ invokes chain_state; the whole command would be dead weight');
});

t('main.rs still exposes chain_state as a command with the fields this reads', () => {
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(rs, /fn chain_state\(\)\s*->\s*ChainState/, 'the command was renamed or removed');
  assert.match(rs, /\.invoke_handler|chain_state/, 'chain_state must be registered');
  for (const f of ['open', 'lap', 'holder', 'age_ms', 'self_reported', 'also_open', 'unreadable']) {
    assert.ok(new RegExp('\\b' + f + ':').test(rs), `ChainState no longer carries \`${f}\``);
  }
});

// ---- 8b. THE TAB BAR — the four looks, driven into elements ------------------------------------
//
// EVERY TEST IN THIS SECTION IS AT THE DOM LAYER, AND THAT IS THE WHOLE POINT. A view-level
// version of them would have been green all night while the tab bar was dark, because the view has
// been correct since L025 and the chip mounted into a text row at the BOTTOM of the window. That
// is measured, not asserted — three seats looked at the render and all three had a passing test
// over a display nobody could see. A mutant that is green through the actual defect is not a
// mutant, so these are driven through renderTabs() and asserted on what a person would see.
//
// The looks are AMENDMENT 2's (`4e0de97`), quoted in loop/loop_indicator_design_2026-09-02.md.

const TAB_ORDER = ['terminal', 'main', 'librarian', 'thirdplace', 'listen', 'settings', 'about'];

function fakeBtn(tab) {
  const set = new Set();
  return {
    getAttribute: (k) => (k === 'data-tab' ? tab : null),
    classList: {
      add: (c) => set.add(c), remove: (c) => set.delete(c), contains: (c) => set.has(c),
      size: () => set.size,
    },
  };
}

function fakeNav() {
  const children = TAB_ORDER.map(fakeBtn);
  const arrow = { id: 'chainarrow', hidden: true, textContent: '', title: '' };
  children.push(arrow);
  return {
    children, arrow,
    insertBefore(node, ref) { children.splice(children.indexOf(ref), 0, node); },
    appendChild(node) { children.push(node); },
    removeChild(node) { children.splice(children.indexOf(node), 1); },
    btn(tab) { return children.find((c) => c.getAttribute && c.getAttribute('data-tab') === tab); },
    // what the bar reads like left to right, with the arrow shown where it actually sits
    strip() {
      return children.map((c) => (c === arrow ? (c.hidden ? null : '[' + c.textContent + ']')
                                              : c.getAttribute('data-tab'))).filter(Boolean).join(' ');
    },
  };
}

const holding = (holder, stage) => ({
  open: true, reason: null, lap: 'L029', chain: stage || 'dispatched', holder,
  note: null, at: T0, age_ms: 60000, also_open: 0, self_reported: true, unreadable: 0,
});

const paint = (chain, entries) => {
  const nav = fakeNav();
  const view = C.chainView(entries || [], T0, { chain });
  C.renderTabs(nav, view);
  return { nav, view };
};

const litTabs = (nav, look) =>
  TAB_ORDER.filter((t) => nav.btn(t).classList.contains('chain-hold-' + look));

// ---- 11. THE LOOP ON THE LOGO — AMENDMENT 4's four looks, on the dots ------------------------
//
// AMENDMENT 4 (the keeper, 2026-09-02 07:00) moves the whole indicator off the tab bar and onto
// the Consonance logo. THE REASON IS GEOMETRY AND IT IS WHY THIS IS AN ANSWER RATHER THAN A FOURTH
// ITERATION: read the logo's three dots clockwise from the top and they are the cycle's own order,
// panes -> LIB -> orch -> panes. The tab bar renders Terminal · Orchestrator · Librarian, which is
// NOT that order, so any mark placed between two adjacent tabs reads "from this one to the next
// one" and misreads on at least one hop whichever end it is anchored to. Amendment 2 anchored at
// the holder, amendment 3 at the destination, and an arc vaulting over the skipped seat was
// drafted against the same wall. On the logo nothing is skipped.
//
// The state map is UNCHANGED — `destTab`'s actor -> destination mapping and the two sources' ruling
// (position from `chain_state`, arrow from the ring) still decide everything above. They now say
// WHICH DOT. Every view-level assertion in section 10 stands untouched, which is the evidence that
// this is a render change and not a second theory of the loop.

const fakeSvgEl = (attrs) => ({
  attrs: Object.assign({}, attrs), style: {}, children: [], hidden: true,
  id: (attrs && attrs.id) || undefined,
  getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; },
  setAttribute(k, v) { this.attrs[k] = String(v); },
  removeAttribute(k) { delete this.attrs[k]; },
});

// Mirrors index.html's markup, including the nesting: the dots live inside the <svg>, not directly
// under the span, so `dotsUnder` is exercised as it will actually be used.
function fakeLogo() {
  const dots = ['terminal', 'librarian', 'main'].map((s) => fakeSvgEl({ 'data-dot': s }));
  const arc = fakeSvgEl({ id: 'chainarc', d: '' });
  arc.id = 'chainarc';
  const svg = { children: [arc].concat(dots) };
  return {
    title: '', children: [svg], arc,
    dot(s) { return dots.find((d) => d.attrs['data-dot'] === s); },
    // what a person would see, as one line: which dots are lit and how
    look() {
      return dots.map((d) => d.attrs['data-dot'] + '=' + (d.attrs.fill || '?') +
        (d.style.animation ? '/breathe' : '') + (d.attrs['stroke-dasharray'] ? '/dashed' : '')).join(' ');
    },
  };
}

const paintLogo = (chain, entries) => {
  const logo = fakeLogo();
  const view = C.chainView(entries || [], T0, { chain });
  C.renderLogo(logo, view);
  return { logo, view };
};

// The LITERALS, not the custom properties: `var()` does not resolve in an SVG presentation
// attribute in Chromium (which is WebView2), so the attribute must carry a real colour or the whole
// indicator is green here and blank in the window. The style carries the var() form as well, and
// the next test pins these three against app.css so the duplication cannot drift silently.
const RADIANT = '#FFC24A', AMBER = '#F2B880', CHILL = '#9C8A52';
const BASE = { terminal: '#F2B880', librarian: '#5EEAD4', main: '#5EEAD4' };

t('M3 — a lap dispatched to the PANES lights the TOP dot, and no other dot', () => {
  // The fan-out is the loop's most common stage and the fixture the old `chair -> main` one never
  // exercised. Carried over from the tab version, re-aimed at the dot.
  const { logo } = paintLogo(holding('panes', 'dispatched'));
  assert.strictEqual(logo.dot('terminal').attrs.fill, RADIANT, logo.look());
  assert.strictEqual(logo.dot('main').attrs.fill, BASE.main, 'the orchestrator dot must be plain');
  assert.strictEqual(logo.dot('librarian').attrs.fill, BASE.librarian, 'the librarian dot must be plain');
});

t('M1 — the lit dot follows the holder: chair -> bottom-left, librarian -> bottom-right', () => {
  assert.strictEqual(paintLogo(holding('chair')).logo.dot('main').attrs.fill, RADIANT);
  assert.strictEqual(paintLogo(holding('librarian')).logo.dot('librarian').attrs.fill, RADIANT);
});

t('MUTANT ORACLE — the orchestrator and librarian dots are NOT interchangeable', () => {
  // The keeper's assignment is positional and a swap is invisible to every test above, because
  // both dots sit at y=43 and both are lit the same way. Pinned against the coordinates the About
  // hero already teaches: orchestrator BOTTOM-LEFT, librarian BOTTOM-RIGHT, panes TOP.
  assert.deepStrictEqual(C.DOT_XY.main, [13, 43], 'the orchestrator is the bottom-LEFT dot');
  assert.deepStrictEqual(C.DOT_XY.librarian, [51, 43], 'the librarian is the bottom-RIGHT dot');
  assert.deepStrictEqual(C.DOT_XY.terminal, [32, 10], 'the panes are the TOP dot');
  // And clockwise from the top IS the cycle — the whole reason the logo works where the bar did not.
  assert.deepStrictEqual(C.DOT_ORDER, ['terminal', 'librarian', 'main'],
    'clockwise from the top must read panes -> LIB -> orch, the loop\'s own order');
});

t('M5 — a FILED ledger is CHILL GOLD and STILL on the librarian dot, never radiant', () => {
  const { logo, view } = paintLogo(CLOSED);
  assert.strictEqual(view.state, 'complete');
  assert.strictEqual(logo.dot('librarian').attrs.fill, CHILL, logo.look());
  assert.notStrictEqual(logo.dot('librarian').attrs.fill, RADIANT,
    'a filed lap rendered radiant is the falsifier AMENDMENT 2 registered');
  assert.strictEqual(logo.dot('librarian').style.animation, '',
    'complete is DEAD STILL — motion is the channel that separates it at distance');
  assert.strictEqual(logo.arc.hidden, true, 'a closed cycle carries no direction');
});

t('M4 — `unknown` dashes all three dots; `idle` leaves the plain logo', () => {
  // The pair AMENDMENT 2 exists to separate, moved intact: two different facts must never make the
  // same pixels. Plain-logo means NO LAP HAS EVER OPENED and nothing else.
  const unknown = paintLogo(null).logo;
  for (const s of ['terminal', 'librarian', 'main']) {
    assert.strictEqual(unknown.dot(s).attrs['stroke-dasharray'], '2.2 2.2',
      'the display cannot place the loop and must say so: ' + unknown.look());
    assert.strictEqual(unknown.dot(s).attrs.fill, 'none');
  }
  const idle = paintLogo(NEVER_RAN).logo;
  for (const s of ['terminal', 'librarian', 'main']) {
    assert.strictEqual(idle.dot(s).attrs.fill, BASE[s], 'idle must be the plain logo: ' + idle.look());
    assert.strictEqual(idle.dot(s).attrs['stroke-dasharray'], undefined);
    assert.strictEqual(idle.dot(s).style.animation, '');
  }
});

t('an OPEN lap whose holder is not a station renders UNKNOWN, never the plain logo', () => {
  // The 2026-09-01 ledger drift as a rendering rule: four rows carried pane names, and an
  // unplaceable holder must not borrow the one meaning the plain logo has.
  const { logo, view } = paintLogo(holding('echo'));
  assert.strictEqual(view.tabLook, 'unknown');
  assert.strictEqual(logo.dot('terminal').attrs['stroke-dasharray'], '2.2 2.2', logo.look());
});

t('M2 / D1 — an UNCONFIRMED delivery keeps its lit dot and draws NO ARC', () => {
  // D1, kept from L025 through three renders now: a confident direction over a position the
  // control plane could not confirm is worse than none. This is the assertion that says the
  // decision survived the move from tabs to logo rather than being lost in it.
  const { logo, view } = paintLogo(holding('chair'), [UNCONF.dispatch]);
  assert.strictEqual(view.state, 'unconfirmed');
  assert.strictEqual(logo.dot('main').attrs.fill, RADIANT, 'the position still shows');
  assert.strictEqual(logo.arc.hidden, true, 'no arc may be drawn from an unconfirmed receipt');
  assert.strictEqual(logo.arc.attrs.d, '');
});

t('the arc runs CLOCKWISE from the lit dot to the next one, at all three hops', () => {
  // Sweep-flag 1 is clockwise in SVG's y-down space. The endpoints are the two dots' own centres,
  // so a wrong destination mapping moves the arc's end and this goes red.
  const hop = (holder) => paintLogo(holding(holder)).logo.arc.attrs.d;
  assert.strictEqual(hop('panes'), 'M32,10 A22,22 0 0 1 51,43', 'panes -> LIB, top to bottom-right');
  assert.strictEqual(hop('librarian'), 'M51,43 A22,22 0 0 1 13,43', 'LIB -> orch, bottom-right to bottom-left');
  assert.strictEqual(hop('chair'), 'M13,43 A22,22 0 0 1 32,10', 'orch -> panes, bottom-left to top');
});

t('the arc is OPTIONAL and its absence costs nothing — the dot still carries the position', () => {
  // Amendment 4 makes the arc optional on purpose. Every state that must not assert a direction
  // gets none, and none of them lose their position with it.
  for (const [chain, entries] of [[holding('chair'), [UNCONF.dispatch]], [CLOSED, []], [null, []]]) {
    const { logo, view } = paintLogo(chain, entries);
    assert.strictEqual(logo.arc.hidden, true, 'an arc was drawn in state ' + view.state);
  }
});

t('the escalated state is AMBER WITH A RING on the holder dot, not a fourth dot', () => {
  const { logo, view } = paintLogo(Object.assign({}, holding('panes'), { age_ms: 40 * 60000 }));
  assert.strictEqual(view.state, 'waiting');
  assert.strictEqual(logo.dot('terminal').attrs.fill, AMBER, logo.look());
  assert.strictEqual(logo.dot('terminal').attrs.stroke, AMBER, 'shape is the second channel: a ring');
  assert.match(logo.dot('terminal').style.animation, /0\.9s/, 'the same aura, impatient');
  assert.strictEqual(logo.dot('main').attrs.fill, BASE.main, 'no other dot may take the escalation');
});

t('ONE INDICATOR, NOT TWO — no tab ever carries an aura and the old marker stays hidden', () => {
  // AMENDMENT 4's own rule, and it needs an oracle or the superseded render comes back beside the
  // logo the first time anyone edits renderTabs. Driven at every state, not just the easy one.
  for (const chain of [holding('chair'), holding('panes'), holding('librarian'), holding('echo'), CLOSED, NEVER_RAN, null]) {
    const nav = fakeNav();
    // Pre-dirty the bar, so this proves renderTabs CLEARS rather than merely never adding.
    nav.btn('main').classList.add('chain-hold-working');
    nav.arrow.hidden = false;
    C.renderTabs(nav, C.chainView([], T0, { chain }));
    for (const look of ['working', 'waiting', 'complete', 'unknown']) {
      assert.deepStrictEqual(litTabs(nav, look), [], 'a tab aura survived: ' + nav.strip());
    }
    assert.strictEqual(nav.arrow.hidden, true, 'the superseded marker came back: ' + nav.strip());
  }
});

t('the Third Place has no dot at all — it is not a seat in the loop', () => {
  // The one wrong answer the design names explicitly. On the logo it is structural rather than
  // policed: there are three dots and it is not one of them.
  assert.ok(!Object.prototype.hasOwnProperty.call(C.DOT_XY, 'thirdplace'));
  assert.strictEqual(C.DOT_ORDER.indexOf('thirdplace'), -1);
});

t('renderLogo and renderTabs are inert without their elements — never throw into the page', () => {
  const v = C.chainView([], T0, { chain: holding('chair') });
  C.renderLogo(null, v);
  C.renderLogo({}, v);
  C.renderTabs(null, v);
  C.renderTabs({}, v);
});

t('the dot colours still match app.css — the duplication has an oracle, not a comment', () => {
  // Written BECAUSE the first version of renderLogo set `fill="var(--gold-live)"` as an attribute
  // and would have painted nothing in the window while every test here stayed green. The literal
  // is now in the attribute (so it paints) and the custom property in the style (so app.css stays
  // the source), and this is what stops the two drifting apart in silence.
  const css = fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8');
  for (const [name, hex] of [['--gold-live', RADIANT], ['--amber', AMBER], ['--gold-chill', CHILL]]) {
    assert.ok(css.includes(name + ': ' + hex),
      name + ' is no longer ' + hex + ' in app.css; the dot attribute would paint the old colour');
  }
  const { logo } = paintLogo(holding('panes'));
  assert.strictEqual(logo.dot('terminal').style.fill, 'var(--gold-live)',
    'the style must carry the custom property so app.css can still move the colour');
});

t('index.html carries the logo, its three dots and the arc renderLogo needs', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /id="chainlogo"/, 'renderLogo finds the logo by id and nothing else');
  for (const s of ['terminal', 'librarian', 'main']) {
    assert.match(html, new RegExp('data-dot="' + s + '"'), 'the ' + s + ' dot is missing from the markup');
  }
  assert.match(html, /id="chainarc"[^>]*hidden/, 'the arc must ship hidden, not visible-by-default');
  // The dots must sit where the About hero puts them, or the mark stops being the same mark.
  assert.match(html, /data-dot="terminal"\s+cx="32" cy="10"/);
  assert.match(html, /data-dot="librarian" cx="51" cy="43"/);
  assert.match(html, /data-dot="main"\s+cx="13" cy="43"/);
});

// ---- 12. THE BOARD-DERIVED ARROW IS A DESTINATION, NOT AN ACTOR (L033, P-AURA-ARROW) ---------
//
// THE DEFECT, in one line: `positionTab(hop)` and `tabForWho(nextHop(hop).who)` return the
// IDENTICAL tab for all three hop kinds (dispatch->terminal, handback->librarian, ring->main).
// `nextHop` answers who ACTS next, and the party who acts next is the party who now HOLDS the
// loop — so the board-derived arrow pointed at the tab the same hop had just lit, and `:613`'s
// "never point a tab at itself" nulled it. Not at one hop. At every hop.
//
// Which inverts the instrument: the board arrow could only ever DRAW when the ledger holder and
// the board's latest hop DISAGREED — i.e. when one of them was stale. On 2026-09-02 the keeper
// saw an arrow at 06:32 (the chair had left L029 at `dispatched · holder panes` for three hours
// with the hand-backs already in) and none at 06:39 (the row was advanced and the librarian rang).
// The arrow vanished BECAUSE the data became correct.
//
// WHY EVERY FIXTURE ABOVE MISSED IT: every tab-arrow test in section 11 passes `entries: []`.
// That is the ledger-only path, which goes through `holderArrow` — destinations already. Not one
// exercised the board path. This is the fixture failure this room has hit five times in two
// nights: every fixture used the one holder value that works.

const stale = (holder, stage) => ({
  open: true, reason: null, lap: 'L029', chain: stage || 'handbacks-in', holder,
  note: null, at: T0, age_ms: 60000, also_open: 0, self_reported: true, unreadable: 0,
});

t('BAR 1 — the live case: holder chair, board ring LIB -> orch, arrow points at the TERMINAL', () => {
  // The keeper's 06:39 glance, as a fixture. The loop sits with the orchestrator and the next
  // thing it does is DISPATCH, so the arrow belongs on the panes' tab. Today: null.
  const v = C.chainView([RING], T0, { chain: stale('chair', 'handbacks-in') });
  assert.strictEqual(v.tab, 'main', 'the aura is on the holder');
  assert.strictEqual(v.arrowTab, 'terminal',
    'orch -> dispatch: the loop goes to the panes, not back into the tab it is already on');
});

t('BAR 2a — hop kind DISPATCH: holder panes, arrow points at the LIBRARIAN', () => {
  const v = C.chainView([DISPATCH], T0, { chain: stale('panes', 'dispatched') });
  assert.strictEqual(v.tab, 'terminal');
  assert.strictEqual(v.arrow, '-> pane a2122153', 'the chip text still names WHO is out');
  assert.strictEqual(v.arrowTab, 'librarian', 'a pane hands back to LIB: that is where it goes');
});

t('BAR 2b — hop kind HANDBACK: holder librarian, arrow points at the ORCHESTRATOR', () => {
  const v = C.chainView([HANDBACK], T0, { chain: stale('librarian', 'handbacks-in') });
  assert.strictEqual(v.tab, 'librarian');
  assert.strictEqual(v.arrowTab, 'main', 'LIB rings the orchestrator');
});

t('BAR 2c — hop kind RING: holder chair, arrow points at the TERMINAL', () => {
  const v = C.chainView([RING], T0, { chain: stale('chair', 'dispatched') });
  assert.strictEqual(v.tab, 'main');
  assert.strictEqual(v.arrowTab, 'terminal');
});

t('the arrow never points at the lit tab in a state where ledger and board AGREE', () => {
  // The falsifier the packet registered, run over all three hops at once.
  const cases = [[[DISPATCH], 'panes'], [[HANDBACK], 'librarian'], [[RING], 'chair']];
  for (const [entries, holder] of cases) {
    const v = C.chainView(entries, T0, { chain: stale(holder) });
    assert.ok(v.arrowTab, 'no arrow drawn at holder ' + holder + ' — the actor reading is back');
    assert.notStrictEqual(v.arrowTab, v.tab, 'self-pointing arrow at holder ' + holder);
  }
});

t('THE GUARD SURVIVES AS A STALENESS DETECTOR: ledger and board disagreeing draws NO arrow', () => {
  // Holder says the chair has it; the newest receipt says a pane handed back to LIB, whose next
  // hop is the orchestrator — straight back into the lit tab. One of the two is stale and the
  // display must not assert a direction over a contradiction. This is the only fixture in the
  // file where `:613` can still fire, and without it the guard leaves silently.
  const v = C.chainView([HANDBACK], T0, { chain: stale('chair') });
  assert.strictEqual(v.tab, 'main', 'the aura follows the ledger holder');
  assert.strictEqual(v.arrowTab, null,
    'ledger says chair, board says LIB-about-to-ring-the-chair: contradiction, so no arrow');
});

t('THE ARROW IS THE BOARD\'S, NOT THE HOLDER\'S: a stale ledger row does not move it', () => {
  // Written because the mutation run found the hole rather than the other way round: dropping
  // `atStation` from the OUTSTANDING branch survived every fixture above, because each of them
  // set the holder to the same seat the board named, so the fallback happened to agree.
  //
  // This is the 06:32 shape exactly — the chair's row said `holder chair` for three hours while a
  // dispatch was out. L025 gives the arrow to the receipt (a control-plane record) over the ledger
  // (a claim a seat wrote about itself), so the arrow reads from the board: a pane is out, and a
  // pane hands back to LIB. The aura still follows the holder; the two are allowed to disagree,
  // and that they can is the whole reason both are drawn.
  const v = C.chainView([DISPATCH], T0, { chain: stale('chair', 'dispatched') });
  assert.strictEqual(v.tab, 'main', 'the aura is the ledger\'s');
  assert.strictEqual(v.arrowTab, 'librarian',
    'the arrow is the board\'s: a dispatch is outstanding, so the loop goes to LIB next');
  assert.notStrictEqual(v.arrowTab, 'terminal',
    'reading the destination off the stale holder would send it to the panes it is already at');
});


t('D1 IS NOT UNDONE: an unconfirmed delivery still keeps the aura and loses the arrow', () => {
  // L025's deliberate choice, re-asserted here because this change is the one that could take it
  // out quietly — `view.arrow` is null on `unconfirmed` and the arrowTab must follow it, not the
  // position. Named in the packet's own permission-to-refuse.
  const v = C.chainView([UNCONF.dispatch], T0, { chain: stale('chair') });
  assert.strictEqual(v.state, 'unconfirmed');
  assert.strictEqual(v.tab, 'main', 'the aura stays');
  assert.strictEqual(v.arrowTab, null, 'a position the control plane could not confirm draws none');
  assert.strictEqual(paint(stale('chair'), [UNCONF.dispatch]).nav.arrow.hidden, true);
});



t('renderTabs is inert without a nav — it must never throw into the page', () => {
  C.renderTabs(null, C.chainView([], T0, { chain: holding('chair') }));
  C.renderTabs({}, C.chainView([], T0, { chain: holding('chair') }));
});

t('main.rs still returns the exact `reason` COMPLETE is keyed on', () => {
  // The fourth contract with main.rs, pinned like the other three against its own source. A
  // rename there would silently turn a completed cycle back into a dark tab bar, which is the
  // one thing AMENDMENT 2 exists to prevent.
  const rs = fs.readFileSync(MAIN_RS, 'utf8');
  assert.ok(rs.includes('every lap with a baton row is filed'),
    'chain_state no longer returns the reason the COMPLETE look is keyed on');
  assert.ok(rs.includes('the ledger carries no baton rows yet'),
    'chain_state no longer distinguishes "never ran" from "all filed" — the two would re-merge');
});

t('the chip yields WIDTH in the stream bar but never yields its EXISTENCE', () => {
  // Keeper, 2026-09-02: the bottom bar "sometimes appears taking up unneeded space" — a document
  // horizontal scrollbar caused by the status cluster overflowing the row. The fix is a
  // degradation order in app.css, and the part of it this file owns is the chip: it must
  // ellipsize rather than disappear, because a chip that silently vanishes and a chip reading
  // nothing are the same two-states-one-appearance defect the placeholder had.
  //
  // NO MUTANT IS SCORED FOR THE CSS ITSELF. There is no layout engine in this harness, so a
  // mutation of a width rule has no oracle here and inventing one would be a green test over an
  // unmeasured property — the exact thing tonight's M3 lesson is about. This asserts the RULES
  // exist, which is all that is checkable from node, and says so rather than implying more.
  const css = fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8');
  assert.match(css, /#streambar\s*\{[^}]*overflow:\s*hidden/,
    'the stream bar has no overflow backstop; a wide cluster widens the DOCUMENT and the ' +
    'viewport scrollbar eats height from the panes');
  const chip = /\.statuscluster\s+#chainchip\s*\{([^}]*)\}/.exec(css);
  assert.ok(chip, 'the chip has no width rule in the cluster at all');
  assert.match(chip[1], /text-overflow:\s*ellipsis/, 'the chip must show that it was truncated');
  assert.match(chip[1], /min-width:\s*[1-9]/,
    'the chip must keep a visible stub — shrinking to zero is vanishing, not degrading');
});

t('index.html carries the nav id and the arrow element renderTabs needs', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<nav class="tabs" id="tabs">/, 'renderTabs finds the nav by id and nothing else');
  assert.match(html, /id="chainarrow"[^>]*hidden/, 'the arrow must ship hidden, not visible-by-default');
});

// ---- 9. THE WIRING ITSELF, exercised — not just the pure functions -----------------------------
//
// The pure tests above would all be green while the chip rendered nothing, which is precisely the
// 2026-08-15 shape: every instrument green, blank window, found by a human looking at it. There is
// no browser here, so this stands up the smallest fake that makes start() run for real — an element
// with an id, and an invoke that resolves — and then asserts on what actually landed in the DOM.

async function withFakeDom(boardResult, fn, chainResult, nav, logo) {
  const el = { id: 'chainchip', className: '', textContent: '', title: '' };
  const savedDoc = global.document, savedWin = global.window, savedInt = global.setInterval;
  const timers = [];
  // `nav` is optional and defaults to absent, so every caller written before the tab bar existed
  // keeps exercising exactly what it did: chip present, no nav, renderTabs inert.
  global.document = {
    readyState: 'complete',
    getElementById: (id) => (id === 'chainchip' ? el
      : id === 'tabs' ? (nav || null)
      : id === 'chainlogo' ? (logo || null) : null),
  };
  // Two commands now, and each must be able to fail on its own — so the fake dispatches on name
  // rather than returning one canned answer to everything.
  const answer = (cmd) => {
    const r = cmd === 'chain_state' ? (chainResult === undefined ? null : chainResult) : boardResult;
    return r instanceof Error ? Promise.reject(r) : Promise.resolve(r);
  };
  global.window = { __TAURI__: { core: { invoke: answer } } };
  global.setInterval = (f, ms) => { timers.push([f, ms]); return 0; };
  try {
    C.start();
    // setImmediate lands after ALL pending microtasks, so this does not depend on counting the
    // links in start()'s promise chain. Counting ticks is what the first version of this harness
    // did, and it reported "the chip rendered nothing" against working code — a false red from the
    // instrument, which is the same class as the false greens this file is otherwise guarding.
    await new Promise((r) => setImmediate(r));
    await new Promise((r) => setImmediate(r));
  } finally {
    global.document = savedDoc; global.window = savedWin; global.setInterval = savedInt;
  }
  return fn(el, timers, nav, logo);
}

const asyncTests = [];
const ta = (name, fn) => asyncTests.push([name, fn]);

// start() reads the real clock, so these fixtures are stamped relative to Date.now() rather than
// to the fixed T0 the pure tests inject. The first version used T0 and rendered `chain-waiting`
// seven days late — correct behaviour, wrong fixture.
const RING_NOW = chair(RING.text, Date.now());
const RING_OLD = chair(RING.text, Date.now() - 40 * 60000);

ta('start() finds the chip and writes a real position and arrow into the DOM', () =>
  withFakeDom([RING_NOW], (el) => {
    assert.ok(el.textContent.length > 0, 'the chip rendered nothing — a blank window with green tests');
    assert.ok(el.textContent.includes('-> orch'), 'the arrow did not reach the DOM: ' + el.textContent);
    assert.strictEqual(el.className, 'chain-quiet');
    assert.ok(el.title.length > 0, 'the tooltip carries the limits and must not be empty');
  }));

ta('a hop older than the threshold reaches the DOM in the escalated state, with the minutes', () =>
  withFakeDom([RING_OLD], (el) => {
    assert.strictEqual(el.className, 'chain-waiting');
    assert.ok(/\b40m\b/.test(el.textContent), 'the elapsed figure must be rendered: ' + el.textContent);
  }));

ta('a REJECTED invoke renders the unavailable state rather than leaving a stale value', () =>
  withFakeDom(new Error('backend gone'), (el) => {
    assert.strictEqual(el.className, 'chain-unavailable');
    assert.ok(!el.textContent.includes('->'), 'no arrow may survive a failed read: ' + el.textContent);
  }));

ta('the (claimed) flag reaches the DOM, not just the view object', () =>
  // Added after a mutation SURVIVED: asserting `view.selfReported` proved nothing about what the
  // keeper actually sees, and deleting the render line left every test green.
  withFakeDom([RING_NOW], (el) => {
    assert.ok(el.textContent.includes('(claimed)'),
      'the self-reported flag must be visible on the chip: ' + el.textContent);
  }, { open: true, lap: 'L025', chain: 'handbacks-in', holder: 'librarian', age_ms: 0, self_reported: true, also_open: 0, unreadable: 0 }));

ta('a dead chain_state does not stop the board half from rendering', () =>
  withFakeDom([RING_NOW], (el) => {
    assert.ok(el.textContent.includes('->'), 'the ring half must still draw: ' + el.textContent);
  }, null));

ta('END TO END — start() lights the LOGO, not only the chip at the bottom', () => {
  // THE ONE TEST THAT WOULD HAVE CAUGHT 2026-09-01. Everything else about this chip was green
  // while the keeper looked at the top of the window and saw nothing, because nothing between
  // `start()` and the top of the window was exercised at all. Re-aimed at the logo by AMENDMENT 4;
  // the wiring it guards — command -> view -> a mark a person can see — is the same wiring.
  const nav = fakeNav(), logo = fakeLogo();
  return withFakeDom([], (el, _timers, n, lg) => {
    assert.ok(el.textContent.includes('L029'), 'the chip still renders: ' + el.textContent);
    assert.strictEqual(lg.dot('terminal').attrs.fill, '#FFC24A',
      'the loop never reached the logo: ' + lg.look());
    assert.strictEqual(lg.arc.hidden, false, 'the direction never reached the logo: ' + lg.look());
    for (const look of ['working', 'waiting', 'complete', 'unknown']) {
      assert.deepStrictEqual(litTabs(n, look), [], 'ONE indicator: a tab lit too: ' + n.strip());
    }
  }, holding('panes'), nav, logo);
});

ta('END TO END — a dead chain_state dashes the dots, never the plain logo', () =>
  // The seam question, answered in the render rather than left to a person to interpret: if the
  // command never returns, the top of the window says so in its own look. This is why bar 0 does
  // not gate the build — the code is the same either way, and the display reports the seam.
  withFakeDom([], (_el, _timers, _n, lg) => {
    for (const s of ['terminal', 'librarian', 'main']) {
      assert.strictEqual(lg.dot(s).attrs['stroke-dasharray'], '2.2 2.2',
        'a dead seam must not look like an empty ledger: ' + lg.look());
    }
  }, null, fakeNav(), fakeLogo()));

ta('start() registers exactly one poll, at the declared cadence', () =>
  withFakeDom([RING], (_el, timers) => {
    assert.strictEqual(timers.length, 1, 'expected exactly one interval, got ' + timers.length);
    assert.strictEqual(timers[0][1], C.POLL_MS);
  }));

ta('start() is inert when the chip is absent — it must never throw into the page', () => {
  const savedDoc = global.document;
  global.document = { readyState: 'complete', getElementById: () => null };
  try { C.start(); } finally { global.document = savedDoc; }
  return Promise.resolve();
});

(async () => {
  for (const [name, fn] of asyncTests) {
    try { await fn(); console.log('  ok   ' + name); pass++; }
    catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); fail++; }
  }
  console.log('\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
