// The whole verdict in balance-check.js rests on ONE function: `proportionalBlocks`. If it does
// not really achieve the imbalance it targets, then the "balance-matched" negative arm is only
// nominally matched, its scores are too high, and the residual separation it reports is an
// artifact of a cut that quietly refused to be lopsided. So most of this file exists to prove
// the cut is lopsided when it says it is — including at 99%, where chunky records could defeat it.
//
// Same discipline as agreement-spread.test.js: pin the MECHANISM, never assert the outcome. No
// test here says the residual is negative. That is measured, and it is allowed to change.
//
//   node consonance/tools/balance-check.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const { proportionalBlocks, topShare, signTestP, bootstrapCI } = require('./balance-check.js');

const lapOf = (...lengths) => ({ recs: lengths.map((n, i) => ({ text: String.fromCharCode(97 + i).repeat(n) })) });

test('the cut achieves a lopsided target, not just a nominal one', () => {
  const lap = lapOf(...Array(20).fill(50));           // 20 records, 1000 chars, evenly sized
  const blocks = proportionalBlocks(lap, [0.9, 0.1]);
  assert.ok(topShare(blocks) >= 0.85,
    `a 90% target must actually come out near 90%, got ${topShare(blocks).toFixed(3)}`);
});

test('the cut achieves a BALANCED target too, so it is not simply biased lopsided', () => {
  const lap = lapOf(...Array(20).fill(50));
  const blocks = proportionalBlocks(lap, [0.5, 0.5]);
  assert.ok(Math.abs(topShare(blocks) - 0.5) < 0.1,
    `a 50/50 target must come out near 50/50, got ${topShare(blocks).toFixed(3)}`);
});

test('every block is non-empty, so a sliver source is a real record and not nothing', () => {
  const lap = lapOf(...Array(6).fill(100));
  const blocks = proportionalBlocks(lap, [0.99, 0.01]);
  assert.strictEqual(blocks.length, 2);
  assert.ok(blocks.every(b => b.length > 0), 'an empty block would measure absence, not imbalance');
});

test('the cut is refused rather than faked when there are fewer records than blocks', () => {
  assert.strictEqual(proportionalBlocks(lapOf(100), [0.5, 0.5]), null);
  assert.strictEqual(proportionalBlocks({ recs: [] }, [0.5, 0.5]), null);
});

test('the cut is contiguous and loses no text — interleaving would manufacture overlap', () => {
  const lap = lapOf(10, 20, 30, 40, 50);
  const blocks = proportionalBlocks(lap, [0.7, 0.3]);
  const flat = blocks.flat();
  assert.deepStrictEqual(flat, lap.recs.map(r => r.text), 'order and content must survive the cut');
});

test('one chunky record cannot be split, and the cut reports the balance it really got', () => {
  // The honest failure mode: a lap whose first record IS most of the text cannot be cut to 50/50.
  // The tool must not pretend otherwise — topShare of the result is what gets reported.
  const lap = lapOf(1000, 10, 10);
  const blocks = proportionalBlocks(lap, [0.5, 0.5]);
  assert.ok(topShare(blocks) > 0.9,
    'when the data cannot honour the target, the achieved share must show it rather than hide it');
});

test('topShare is a character share, not a record share', () => {
  assert.strictEqual(topShare([['aaaaaaaaa'], ['a']]), 0.9);
  assert.strictEqual(topShare([[''], ['']]), 1, 'an empty lap is degenerate, report full concentration');
});

test('sign test is exact and two-sided at the sizes actually used', () => {
  assert.strictEqual(signTestP([1, 1, 1, 1, 1]), 2 * (1 / 32));      // 5/5 above
  assert.strictEqual(signTestP([1, -1]), 1);                          // 1/1, no evidence
  assert.ok(signTestP(Array(17).fill(-1)) < 0.001);
});

test('the bootstrap is seeded, so the interval reproduces across runs', () => {
  const diffs = [-0.1, 0.02, -0.05, -0.2, 0.01, -0.03, -0.08];
  assert.deepStrictEqual(bootstrapCI(diffs, 2000), bootstrapCI(diffs, 2000),
    'an unseeded interval would make every report of it a different number');
});

test('the bootstrap interval brackets the observed mean', () => {
  const diffs = [-0.1, 0.02, -0.05, -0.2, 0.01, -0.03, -0.08];
  const m = diffs.reduce((s, x) => s + x, 0) / diffs.length;
  const [lo, hi] = bootstrapCI(diffs, 2000);
  assert.ok(lo <= m && m <= hi, `CI [${lo}, ${hi}] must contain the observed mean ${m}`);
});
