'use strict';

// vantage-sealed-scope.test.js — L046 §3's two red-first bars, and the measurement that says the
// packet's own matcher is not sufficient.
//
// Run: node consonance/tools/vantage-sealed-scope.test.js
//
// WIRED TO NOTHING and reads no ledger. The registry is a literal in each test.

const assert = require('node:assert');
const test = require('node:test');
const S = require('./vantage-sealed-scope.js');

const REG = {
  seals: [{
    lap: 'L039',
    panes: ['sibling-3d57124e'],
    from: '2026-09-07T00:00:00Z',
    to: '2026-09-08T00:00:00Z',
    labels: ['D\\d-\\d\\d'],
  }],
};

const rowFrom = (pane, ts, extra = {}) =>
  Object.assign({ id: 'x', claim: 'c', evidence: 'e', commands: [], source: { pane, turn_ts: ts } }, extra);

/* ------------------------------------------------------- RED FIRST 1 — labelled row is skipped */

test('RED FIRST: a row carrying a declared label and its value is SKIPPED', () => {
  const row = rowFrom('some-other-pane', '2026-09-07T08:38:36.546Z',
    { claim: 'plant D1-03 says carrier-drift.js is 640 lines' });
  const d = S.decide(row, REG);
  assert.strictEqual(d.skip, true);
  assert.match(d.reason, /sealed label/);
});

/* ------------------------------------------ RED FIRST 2 — the skip is VISIBLE, never silent */

test('RED FIRST: every skip leaves a trace saying a row was skipped and why', () => {
  const rows = [
    rowFrom('sibling-3d57124e', '2026-09-07T08:38:36.546Z'),
    rowFrom('some-other-pane', '2026-09-07T09:00:00Z'),
  ];
  const { kept, skipped, trace } = S.partition(rows, REG);
  assert.strictEqual(skipped.length, 1);
  assert.strictEqual(kept.length, 1);
  assert.strictEqual(trace.length, 1, 'a skip with no trace is a scanner that quietly stopped seeing');
  assert.strictEqual(trace[0].event, 'sealed-skip');
  assert.ok(trace[0].reason && trace[0].reason.length > 0, 'a skip must carry WHY');
  assert.strictEqual(trace[0].lap, 'L039');
});

test('the trace never republishes the content it withheld', () => {
  const secret = 'carrier-drift.js is 640 lines';
  const rows = [rowFrom('sibling-3d57124e', '2026-09-07T08:38:36.546Z', { claim: secret, evidence: secret })];
  const { trace } = S.partition(rows, REG);
  const blob = JSON.stringify(trace);
  assert.ok(!blob.includes('640'),
    'the trace carried the withheld value — the same defect wearing the fix\'s clothes');
});

/* -------------------------------- THE MEASUREMENT: the real row has NO label, and that is the point */

test('THE REAL ROW HAS NO LABEL — labels alone are green over it, source scope catches it', () => {
  // Shaped after f50dfa20882b4270 as it actually sits in the ledger: the sealed VALUE, no label.
  const real = rowFrom('sibling-3d57124e', '2026-09-07T08:38:36.546Z', {
    claim: 'carrier-drift is 811 lines and eighth-longest, and coverage-map.js does not exist',
    evidence: 'wc -l < consonance/tools/carrier-drift.js -> 811',
    commands: ['wc -l < consonance/tools/carrier-drift.js'],
  });

  const labelsOnly = { seals: [{ lap: 'L039', panes: [], labels: ['D\\d-\\d\\d', 'plant', 'seed'] }] };
  assert.strictEqual(S.decide(real, labelsOnly).skip, false,
    'if this ever passes, the fixture stopped being shaped like the real row');

  assert.strictEqual(S.decide(real, REG).skip, true, 'source scope must catch what labels cannot');
  assert.match(S.decide(real, REG).reason, /under seal/);
});

/* --------------------------------------------------------------------- the scope's own edges */

test('the seal is bounded in TIME — the same pane outside the window is ingested', () => {
  assert.strictEqual(S.decide(rowFrom('sibling-3d57124e', '2026-09-09T00:00:00Z'), REG).skip, false);
  assert.strictEqual(S.decide(rowFrom('sibling-3d57124e', '2026-09-06T00:00:00Z'), REG).skip, false);
});

test('a seal with `to: null` is still open and keeps sealing', () => {
  const open = { seals: [{ lap: 'L045', panes: ['p'], from: '2026-09-08T00:00:00Z', to: null }] };
  assert.strictEqual(S.decide(rowFrom('p', '2027-01-01T00:00:00Z'), open).skip, true);
});

test('a malformed row is not sealed by accident, and does not throw', () => {
  assert.strictEqual(S.decide({ id: 'x' }, REG).skip, false);
  assert.strictEqual(S.decide({ id: 'x', source: { pane: 'sibling-3d57124e' } }, REG).skip, false);
});

test('a bad label pattern is skipped over rather than crashing the scan', () => {
  const bad = { seals: [{ lap: 'L', panes: [], labels: ['('] }] };
  assert.doesNotThrow(() => S.decide(rowFrom('p', '2026-09-07T00:00:00Z'), bad));
});

/* ------------------------------------- inert is announced, never reported as green (registry law) */

test('no registry and an empty registry both SAY SO rather than reporting clean', () => {
  assert.match(S.sealSummary(null, []), /NO REGISTRY/);
  assert.match(S.sealSummary({ seals: [] }, []), /EMPTY REGISTRY|inert/);
  assert.match(S.sealSummary(REG, [{}]), /1 seal\(s\).*1 row\(s\) skipped/);
});

test('with no registry nothing is skipped — fail OPEN, loudly, by design', () => {
  const rows = [rowFrom('sibling-3d57124e', '2026-09-07T08:38:36.546Z')];
  const { kept, skipped } = S.partition(rows, null);
  assert.strictEqual(kept.length, 1);
  assert.strictEqual(skipped.length, 0);
});
