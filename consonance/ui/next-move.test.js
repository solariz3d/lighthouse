// next-move.test.js — run with: node next-move.test.js
//
// L233 (pane B): the button for the proper next move glows. The keeper, 02:45: "say if the proper thing to do is close consonance,
// the X will be golden resonant aura, but then if the proper move is to compact warm seats, that button will have the aura".
// Packet: exo_memory/loop/packet_next_move_glow_B_2026-11-25.md.
//
// R1: the decision, every case, and both owed at once. R3: what the top bar shows for each decision, read off the real
// apply() writing to stub buttons (hidden, the glow class, the dimmed class, the one-line title).
const assert = require('assert');
const path = require('path');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const NM = require(path.join(__dirname, 'next-move.js'));

const seats = (n) => Array.from({ length: n }, (_, i) => 'S' + i);
const facts = (o) => Object.assign({ newerBuild: false, builtAt: '02:38', working: [], compactList: [], big: 300000, warmMin: 50 }, o);

console.log('R1 · the decision');
test('nothing owed: none', () => assert.strictEqual(NM.nextMove({ newerBuild: false, paneWorking: false, compactList: [] }), 'none'));
test('a pane working and nothing owed: none', () => assert.strictEqual(NM.nextMove({ newerBuild: false, paneWorking: true, compactList: [] }), 'none'));
test('close-small lists a seat: compact', () => assert.strictEqual(NM.nextMove({ newerBuild: false, paneWorking: false, compactList: ['B'] }), 'compact'));
test('close-small lists a seat while a pane works: compact (the list is what it is)', () =>
  assert.strictEqual(NM.nextMove({ newerBuild: false, paneWorking: true, compactList: ['B'] }), 'compact'));
test('a newer build and no pane working: restart', () => assert.strictEqual(NM.nextMove({ newerBuild: true, paneWorking: false, compactList: [] }), 'restart'));
test('a newer build and a pane working: restart-waiting', () =>
  assert.strictEqual(NM.nextMove({ newerBuild: true, paneWorking: true, compactList: [] }), 'restart-waiting'));
test('BOTH OWED: compact wins (compacting needs the app open)', () =>
  assert.strictEqual(NM.nextMove({ newerBuild: true, paneWorking: false, compactList: ['A', 'B'] }), 'compact'));
test('both owed and a pane working: compact', () =>
  assert.strictEqual(NM.nextMove({ newerBuild: true, paneWorking: true, compactList: ['A'] }), 'compact'));
test('newerBuild not exactly true (unknown) never asks for a restart', () => {
  for (const v of [undefined, null, 'true', 1]) assert.strictEqual(NM.nextMove({ newerBuild: v, paneWorking: false, compactList: [] }), 'none', String(v));
});
test('a missing or malformed list is no list', () => {
  for (const v of [undefined, null, 'B', {}]) assert.strictEqual(NM.nextMove({ newerBuild: false, paneWorking: false, compactList: v }), 'none', String(v));
});
test('no facts at all: none', () => assert.strictEqual(NM.nextMove(undefined), 'none'));

// ── R3 · the top bar, by the real apply() ──
function btn(title) {
  const cls = new Set();
  return { hidden: false, title, classList: { add: (c) => cls.add(c), remove: (c) => cls.delete(c), contains: (c) => cls.has(c),
    toggle: (c, on) => { if (on) cls.add(c); else cls.delete(c); } } };
}
const COMPACT_TITLE = 'compact warm seats: the original title';
function bar(f) {
  const els = { compact: btn(COMPACT_TITLE), restart: btn('') };
  els.restart.hidden = true;   // as index.html ships it
  NM.apply(NM.view(f), els, COMPACT_TITLE);
  return els;
}
const glows = (b) => b.classList.contains(NM.GLOW_CLASS);
const dim = (b) => b.classList.contains(NM.DIM_CLASS);

console.log('R3 · the top bar');
test('not owed: Restart hidden, nothing glows, Compact keeps its own title', () => {
  const e = bar(facts({}));
  assert.deepStrictEqual([e.restart.hidden, glows(e.restart), glows(e.compact), e.compact.title], [true, false, false, COMPACT_TITLE]);
});
test('owed: Restart shown and glowing, Compact not', () => {
  const e = bar(facts({ newerBuild: true }));
  assert.deepStrictEqual([e.restart.hidden, glows(e.restart), dim(e.restart), glows(e.compact)], [false, true, false, false]);
});
test('owed: its title says the build time and that every seat comes back', () => {
  const t = bar(facts({ newerBuild: true })).restart.title;
  assert.ok(/02:38/.test(t) && /restart/i.test(t) && /every kept seat comes back/.test(t), t);
});
test('a pane working: Restart shown, dimmed, NOT glowing', () => {
  const e = bar(facts({ newerBuild: true, working: ['A'] }));
  assert.deepStrictEqual([e.restart.hidden, glows(e.restart), dim(e.restart)], [false, false, true]);
});
test('a pane working: the title names the working pane', () => {
  const t = bar(facts({ newerBuild: true, working: ['A', 'librarian'] })).restart.title;
  assert.ok(/\bA\b/.test(t) && /librarian/.test(t) && /working/.test(t), t);
});
test('a seat listed: Compact glows, its title counts the seats and names the thresholds', () => {
  const e = bar(facts({ compactList: seats(2) }));
  assert.ok(glows(e.compact), 'Compact does not glow');
  assert.ok(/^2 seats are over 300k and worked in the last 50 minutes: compact them now$/.test(e.compact.title), e.compact.title);
});
test('one seat listed: "1 seat is"', () => assert.ok(/^1 seat is over 300k/.test(bar(facts({ compactList: ['B'] })).compact.title)));
test('both owed: Compact glows, Restart shown dimmed and not glowing, its title says compact first', () => {
  const e = bar(facts({ newerBuild: true, compactList: ['B'] }));
  assert.deepStrictEqual([glows(e.compact), e.restart.hidden, glows(e.restart), dim(e.restart)], [true, false, false, true]);
  assert.ok(/compact/i.test(e.restart.title), e.restart.title);
});
test('one button glows when a move is owed, none otherwise', () => {
  for (const f of [facts({}), facts({ newerBuild: true }), facts({ newerBuild: true, working: ['A'] }), facts({ compactList: ['B'] }),
    facts({ newerBuild: true, compactList: ['B'] })]) {
    const e = bar(f);
    const n = [glows(e.compact), glows(e.restart)].filter(Boolean).length;
    const want = { none: 0, 'restart-waiting': 0, compact: 1, restart: 1 }[NM.nextMove(NM.decisionFacts(f))];
    assert.strictEqual(n, want, JSON.stringify(f));
  }
});
test('the glow goes away when the move is done (the same buttons, the next facts)', () => {
  const els = { compact: btn(COMPACT_TITLE), restart: btn('') };
  NM.apply(NM.view(facts({ compactList: ['B'] })), els, COMPACT_TITLE);
  NM.apply(NM.view(facts({})), els, COMPACT_TITLE);
  assert.deepStrictEqual([glows(els.compact), els.compact.title, els.restart.hidden], [false, COMPACT_TITLE, true]);
});
test('facts that could not be read: nothing glows and Restart is hidden', () => {
  const e = bar(null);
  assert.deepStrictEqual([glows(e.compact), glows(e.restart), e.restart.hidden], [false, false, true]);
});
test('a pane label goes into the title as written (a title is text, never markup)', () => {
  const t = bar(facts({ newerBuild: true, working: ['<b>x</b>'] })).restart.title;
  assert.ok(t.includes('<b>x</b>'), 'title is set as text, so it is shown as written');
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
