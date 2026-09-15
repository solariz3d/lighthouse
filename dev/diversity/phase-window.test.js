// phase-window.test.js — run with: node dev/diversity/phase-window.test.js
//
// WHAT THIS GUARDS. The phase windowing decides which token ids share a window, so a quiet change to it moves every
// anchor-similarity U (draft §8.8.1 R8e). The load-bearing test is the first: at PHASE 0 the windows must be exactly
// the ones C's frozen scorer cut (§8.2; `score.mjs` run 2, sha256 ecf03768…33eafb, lines 46-48, restated below and
// run against the same lengths). The rest pin R8e's edges: the phase set, a first window of PHASE ids, a short text,
// a phase at or past the length, a text of exactly 1,800 ids, CLS and SEP on every window, and the refusals.

const assert = require('assert');
const path = require('path');

const { PHASES, WINDOW, windowBounds, phaseWindows } = require(path.join(__dirname, 'phase-window.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const CLS = 101, SEP = 102; // gte-base-en-v1.5's [CLS] and [SEP] (tokenizer.json added_tokens)
const ids = (n) => Array.from({ length: n }, (_, i) => 1000 + i);
const bodies = (ws) => ws.map((w) => w.ids.slice(1, -1));
const sizes = (ws) => ws.map((w) => w.tokens);

// C's frozen windowing, restated from score.mjs:46-48 (run 2):
//   for (let i = 0; i < ids.length; i += WIN) { const body = ids.slice(i, i + WIN); const seq = [CLS, ...body, SEP]; ... }
function cWindows(list) {
  const out = [];
  for (let i = 0; i < list.length; i += 1800) {
    const body = list.slice(i, i + 1800);
    out.push({ ids: [CLS, ...body, SEP], tokens: body.length });
  }
  return out;
}

test('the phase set is exactly {0, 300, 600, 900, 1200, 1500} and the window is 1,800 ids', () => {
  assert.strictEqual(JSON.stringify(PHASES), JSON.stringify([0, 300, 600, 900, 1200, 1500]));
  assert.strictEqual(WINDOW, 1800);
  assert.ok(Object.isFrozen(PHASES), 'the phase set can be changed at runtime');
});

test('PHASE 0 reproduces C\'s frozen windowing exactly, at every length the P1 run met and at its edges', () => {
  // 2,466 / 2,500 / 2,603 / 4,398 / 5,375 / 8,641 are the stripped token counts of the P1 texts in results-c1.json.
  for (const n of [1, 2, 1799, 1800, 1801, 2466, 2500, 2603, 3599, 3600, 3601, 4398, 5375, 8641]) {
    const mine = phaseWindows(ids(n), 0, { cls: CLS, sep: SEP });
    const theirs = cWindows(ids(n));
    // Compared whole, reported short: a failure names the length and both window-size lists, not 8,641 ids.
    assert.ok(JSON.stringify(mine) === JSON.stringify(theirs), `length ${n}: sizes ${JSON.stringify(sizes(mine))} against C's ${JSON.stringify(sizes(theirs))}`);
  }
});

test('PHASE 0 gives C\'s window counts for the P1 texts (5 for E\'s 8,641 ids, 3 for 4,398 and 5,375, 2 for 2,500)', () => {
  const counts = [8641, 4398, 5375, 2500].map((n) => windowBounds(n, 0).length);
  assert.strictEqual(JSON.stringify(counts), JSON.stringify([5, 3, 3, 2]));
});

test('a phase gives a first window of PHASE ids, then 1,800-id windows, and the last takes the remainder', () => {
  assert.strictEqual(JSON.stringify(windowBounds(5000, 300)), JSON.stringify([[0, 300], [300, 2100], [2100, 3900], [3900, 5000]]));
  assert.strictEqual(JSON.stringify(sizes(phaseWindows(ids(5000), 1500, { cls: CLS, sep: SEP }))), JSON.stringify([1500, 1800, 1700]));
});

test('every window carries CLS first and SEP last, and the bodies rebuild the ids in order, at every phase', () => {
  const list = ids(4321);
  for (const p of PHASES) {
    const ws = phaseWindows(list, p, { cls: CLS, sep: SEP });
    for (const w of ws) {
      assert.strictEqual(w.ids[0], CLS, `phase ${p}: no CLS`);
      assert.strictEqual(w.ids[w.ids.length - 1], SEP, `phase ${p}: no SEP`);
      assert.strictEqual(w.tokens, w.ids.length - 2, `phase ${p}: tokens is not the body length`);
      assert.ok(w.tokens >= 1 && w.tokens <= WINDOW, `phase ${p}: a window of ${w.tokens} ids`);
    }
    assert.strictEqual(JSON.stringify([].concat(...bodies(ws))), JSON.stringify(list), `phase ${p}: ids lost or reordered`);
  }
});

test('a short text is one window at every phase', () => {
  for (const p of PHASES) {
    const ws = phaseWindows(ids(5), p, { cls: CLS, sep: SEP });
    assert.strictEqual(JSON.stringify(sizes(ws)), '[5]', `phase ${p}`);
  }
});

test('a phase past the text\'s length gives one window', () => {
  assert.strictEqual(JSON.stringify(windowBounds(250, 300)), JSON.stringify([[0, 250]]));
  assert.strictEqual(JSON.stringify(windowBounds(1499, 1500)), JSON.stringify([[0, 1499]]));
});

test('a phase exactly at the text\'s length gives one window, not a trailing empty one', () => {
  assert.strictEqual(JSON.stringify(windowBounds(300, 300)), JSON.stringify([[0, 300]]));
  assert.strictEqual(JSON.stringify(windowBounds(1500, 1500)), JSON.stringify([[0, 1500]]));
});

test('a text of exactly 1,800 ids: one window at PHASE 0, a PHASE-id head and the rest at every other phase', () => {
  assert.strictEqual(JSON.stringify(windowBounds(1800, 0)), JSON.stringify([[0, 1800]]));
  for (const p of PHASES.slice(1)) {
    assert.strictEqual(JSON.stringify(windowBounds(1800, p)), JSON.stringify([[0, p], [p, 1800]]), `phase ${p}`);
  }
});

test('a text of 1,801 ids at PHASE 0 is 1,800 then 1', () => {
  assert.strictEqual(JSON.stringify(sizes(phaseWindows(ids(1801), 0, { cls: CLS, sep: SEP }))), '[1800,1]');
});

test('an empty text is refused, never windowed (R8e and §8.2 disagree there; the scorer voids it first)', () => {
  assert.throws(() => windowBounds(0, 0), /empty/);
  assert.throws(() => phaseWindows([], 300, { cls: CLS, sep: SEP }), /empty/);
});

test('a phase that is not a non-negative integer is refused', () => {
  for (const bad of [-300, 1.5, NaN, '300', undefined]) assert.throws(() => windowBounds(5000, bad), /phase/, String(bad));
});

test('missing CLS or SEP ids are refused rather than defaulted', () => {
  assert.throws(() => phaseWindows(ids(10), 0, { sep: SEP }), /CLS/);
  assert.throws(() => phaseWindows(ids(10), 0, { cls: CLS }), /SEP/);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
