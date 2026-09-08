'use strict';

// vantage-disposition.test.js — the two red-first bars from L046 §2, plus the rulings around them.
//
// Run: node consonance/tools/vantage-disposition.test.js
//
// The module is WIRED TO NOTHING and this test touches no ledger. The resolver is injected, so
// nothing here needs git, a working tree, or C:\Consonance\data.

const assert = require('node:assert');
const test = require('node:test');
const D = require('./vantage-disposition.js');

// A world where exactly one sha and one path exist. Everything else does not resolve.
const R = {
  shaExists: (s) => s === 'abc1234' || s === 'abc1234def5678',
  pathExists: (p) => p === 'exo_memory/map/E.md',
};
const NOW = new Date('2026-09-08T12:00:00Z');

const row = (disposition) => ({ id: 'r1', disposition });

/* ---------------------------------------------------------------- RED FIRST 1 — a sha that lies */

test('RED FIRST: a disposition whose sha does not resolve is REJECTED', () => {
  const v = D.validate({ kind: 'fixed', ref: 'deadbee' }, R, NOW);
  assert.strictEqual(v.ok, false);
  assert.match(v.reason, /does not resolve/);
  assert.strictEqual(D.classify(row({ kind: 'fixed', ref: 'deadbee' }), R, NOW), 'INVALID');
});

test('a disposition whose sha DOES resolve is accepted', () => {
  assert.strictEqual(D.validate({ kind: 'fixed', ref: 'abc1234' }, R, NOW).ok, true);
  assert.strictEqual(D.classify(row({ kind: 'fixed', ref: 'abc1234' }), R, NOW), 'DISPOSITIONED');
});

/* ------------------------------------------------ RED FIRST 2 — absent is OPEN, found by command */

test('RED FIRST: a row with no disposition is distinguishable BY A COMMAND, not by reading', () => {
  const rows = [
    { id: 'open-1' },                                             // absent
    { id: 'open-2', disposition: null },                          // explicitly null
    { id: 'done-1', disposition: { kind: 'fixed', ref: 'abc1234' } },
  ];
  const open = D.undispositioned(rows, R, NOW).map((r) => r.id);
  assert.deepStrictEqual(open, ['open-1', 'open-2'],
    'absent must be OPEN and must be returned by the query — silence is not handled');
  assert.ok(!open.includes('done-1'), 'a dispositioned row must not be reported as open');
});

test('ABSENT IS OPEN, never DISPOSITIONED', () => {
  assert.strictEqual(D.classify({ id: 'x' }, R, NOW), 'OPEN');
  assert.strictEqual(D.classify({ id: 'x', disposition: undefined }, R, NOW), 'OPEN');
});

/* ------------------------------------------------------------- free text is never a referent (a) */

test('free text is never a referent, however sincere', () => {
  for (const ref of ['fixed it', 'done', 'see the handback', 'no longer relevant', '', '   ', 42, null]) {
    const v = D.validate({ kind: 'fixed', ref }, R, NOW);
    assert.strictEqual(v.ok, false, 'accepted free text as a referent: ' + JSON.stringify(ref));
  }
});

test('the referent must match its kind — a path is not a fix, a sha is not a withdrawal', () => {
  assert.strictEqual(D.validate({ kind: 'fixed', ref: 'exo_memory/map/E.md' }, R, NOW).ok, false);
  assert.strictEqual(D.validate({ kind: 'withdrawn', ref: 'abc1234' }, R, NOW).ok, false);
  assert.strictEqual(D.validate({ kind: 'withdrawn', ref: 'exo_memory/map/E.md' }, R, NOW).ok, true);
});

test('an unknown kind is rejected rather than passed through', () => {
  assert.strictEqual(D.validate({ kind: 'read', ref: 'abc1234' }, R, NOW).ok, false);
  assert.strictEqual(D.validate({ kind: true, ref: 'abc1234' }, R, NOW).ok, false);
});

/* ------------------------------------------------------ declared-dead is the soft one — ruling (b) */

test('declared-dead with only a reason is REJECTED — a reason is not checkable', () => {
  const v = D.validate({ kind: 'declared-dead', ref: 'abc1234', reason: 'overtaken by events' }, R, NOW);
  assert.strictEqual(v.ok, false);
  assert.match(v.reason, /superseded_by|expires/);
});

test('declared-dead takes superseded_by, and superseded_by is checked like any other referent', () => {
  assert.strictEqual(
    D.validate({ kind: 'declared-dead', ref: 'abc1234', superseded_by: 'exo_memory/map/E.md' }, R, NOW).ok, true);
  assert.strictEqual(
    D.validate({ kind: 'declared-dead', ref: 'abc1234', superseded_by: 'nope/missing.md' }, R, NOW).ok, false);
  assert.strictEqual(
    D.validate({ kind: 'declared-dead', ref: 'abc1234', superseded_by: 'because I said so' }, R, NOW).ok, false);
});

test('a dead row with an expiry REVERTS TO OPEN once the date passes', () => {
  const dead = row({ kind: 'declared-dead', ref: 'abc1234', expires: '2026-10-01T00:00:00Z' });
  assert.strictEqual(D.classify(dead, R, new Date('2026-09-08T12:00:00Z')), 'DISPOSITIONED');
  assert.strictEqual(D.classify(dead, R, new Date('2026-10-02T00:00:00Z')), 'OPEN',
    'an expired declaration must re-surface, or "dead" is a boolean with a date on it');
  assert.deepStrictEqual(
    D.undispositioned([dead], R, new Date('2026-10-02T00:00:00Z')).map((r) => r.id), ['r1']);
});

/* ------------------------------------------- the checker half of ruling (a): resolution decays */

test('recheck catches a referent that STOPPED resolving after it was written', () => {
  const rows = [row({ kind: 'fixed', ref: 'abc1234' })];
  assert.deepStrictEqual(D.recheck(rows, R, NOW), [], 'valid today');
  const rebased = { shaExists: () => false, pathExists: () => false };
  const bad = D.recheck(rows, rebased, NOW);
  assert.strictEqual(bad.length, 1, 'a sha that was rebased away must be caught by the checker');
  assert.match(bad[0].reason, /does not resolve/);
});

test('recheck ignores rows with no disposition — they are OPEN, not broken', () => {
  assert.deepStrictEqual(D.recheck([{ id: 'x' }], R, NOW), []);
});
