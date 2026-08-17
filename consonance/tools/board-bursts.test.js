/* Tests for board-bursts.js's pure core — clustering and the offset-zero signature. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { clusterBursts, atPaneMin } = require('./board-bursts.js');

test('the burst count is a clustering-parameter artifact, and the tool must keep that true', () => {
  // Two backward runs 50 lines apart: two bursts at gap<=20, ONE at gap<=200. This is why
  // "N bursts" is never published bare — the header's rule, held by a test.
  const isBack = new Array(300).fill(false);
  for (let i = 10; i <= 20; i++) isBack[i] = true;
  for (let i = 70; i <= 80; i++) isBack[i] = true;
  assert.strictEqual(clusterBursts(isBack, 20).length, 2);
  assert.strictEqual(clusterBursts(isBack, 200).length, 1);
});

test('burst sizes count backward rows only, not the fresh rows spanned', () => {
  const isBack = new Array(100).fill(false);
  isBack[5] = true; isBack[15] = true; // 9 fresh lines apart, same burst at gap<=20
  const b = clusterBursts(isBack, 20);
  assert.strictEqual(b.length, 1);
  assert.strictEqual(b[0].n, 2);
  assert.strictEqual(b[0].start, 5);
  assert.strictEqual(b[0].end, 15);
});

test('offset-zero signature: first backward row at the pane minimum says YES, mid-history says no', () => {
  const paneMin = new Map([['M', 1000]]);
  assert.ok(atPaneMin([], paneMin, { pane: 'M', ts: 1000 }), 'exact minimum');
  assert.ok(atPaneMin([], paneMin, { pane: 'M', ts: 1000 + 59_000 }), 'within the minute');
  assert.ok(!atPaneMin([], paneMin, { pane: 'M', ts: 1000 + 61_000 }), 'mid-history = stale offset, not offset zero');
});
