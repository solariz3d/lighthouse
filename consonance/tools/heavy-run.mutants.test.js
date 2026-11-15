#!/usr/bin/env node
'use strict';
// heavy-run.mutants.test.js — D677 (pane P, 2026-11-15): THE HARNESS'S STOP IS A READING ONLY WHEN IT IS MEASURED AGAINST THE CONTROL.
// heavy-run.mutants.js stopped every suite at a fixed 90 s and counted a stopped suite as CAUGHT. On 2026-11-15, under load, the UNMUTATED
// control itself was stopped ("pass NaN fail NaN" in 92 s, exo_memory/handback/p-land-ip-O_2026-11-15.md, last section), so a stop no
// longer told a mutant from load, and ten catches came only by a stop. These rows pin the cure: the stop is the control's own time on the
// same run times a margin (never under the floor), and a stopped mutant counts as caught only when an unmutated copy, run again at once
// under the same stop, finishes green inside it; otherwise it is NOT READ, neither caught nor survived.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const M = require('./heavy-run.mutants.js');

const green = (ms) => ({ pass: 113, fail: 0, ms, stopped: false, crashed: false });
const stopped = (ms) => ({ pass: NaN, fail: NaN, ms, stopped: true, crashed: false });

test('the stop is the control\'s own time times the margin, and never under the floor', () => {
  assert.strictEqual(M.STOP_FLOOR_MS, 90 * 1000);
  assert.strictEqual(M.stopFor(10 * 1000), 90 * 1000, 'a fast control keeps the floor');
  assert.strictEqual(M.stopFor(60 * 1000), 60 * 1000 * M.STOP_MARGIN, 'a slow control widens the stop');
  assert.ok(M.STOP_MARGIN >= 2, 'a margin under 2 cannot tell a hang from a second run of the same load');
  assert.throws(() => M.stopFor(NaN), /control/, 'no control time, no stop: fail loudly');
});

test('the control is green only when it FINISHED, with passes and no failure: a stopped control is not green', () => {
  assert.strictEqual(M.controlGreen(green(30000)), true);
  assert.strictEqual(M.controlGreen(stopped(92000)), false, 'the 51-60 case: stopped by load, pass NaN');
  assert.strictEqual(M.controlGreen({ ...green(90000), stopped: true }), false, 'a tally printed and then the process held open past the stop is not a finish');
  assert.strictEqual(M.controlGreen({ ...green(30000), fail: 1 }), false);
  assert.strictEqual(M.controlGreen({ ...green(30000), pass: 0 }), false);
});

test('a failing row or a crash is caught without asking the control again', () => {
  let asked = 0;
  const again = () => { asked++; return green(1000); };
  assert.strictEqual(M.verdict({ pass: 100, fail: 3, ms: 20000, stopped: false, crashed: false }, again, 90000).status, 'CAUGHT');
  assert.strictEqual(M.verdict({ pass: NaN, fail: NaN, ms: 900, stopped: false, crashed: true }, again, 90000).status, 'CAUGHT');
  assert.strictEqual(asked, 0);
});

test('a green row survives', () => {
  assert.strictEqual(M.verdict(green(20000), () => { throw new Error('not asked'); }, 90000).status, 'SURVIVED');
});

test('a STOPPED row is caught only when the control, run again under the same stop, finishes green inside it', () => {
  const v = M.verdict(stopped(90000), () => green(31000), 90000);
  assert.strictEqual(v.status, 'CAUGHT');
  assert.match(v.why, /stopped at 90 s; the control, run again, finished in 31 s/);
});

test('a STOPPED row whose control, run again, is ALSO stopped is NOT READ: neither caught nor survived', () => {
  const v = M.verdict(stopped(90000), () => stopped(90000), 90000);
  assert.strictEqual(v.status, 'NOT READ');
  assert.match(v.why, /load/);
  const w = M.verdict(stopped(90000), () => ({ ...green(30000), fail: 2 }), 90000);
  assert.strictEqual(w.status, 'NOT READ', 'a control that fails when asked again reads nothing either');
});

test('THE CONTROL ROW, real: an UNMUTATED copy of the suite stopped by its limit is NOT READ, never caught', () => {
  const a = M.tree(), b = M.tree();
  try {
    const stop = 1500;   // far under the suite's own time, as load made 90 s on 2026-11-15
    const r = M.run(a, stop);
    assert.strictEqual(r.stopped, true, `the real unmutated suite was not stopped at ${stop} ms (ran ${r.ms} ms)`);
    assert.strictEqual(M.controlGreen(r), false);
    const v = M.verdict(r, () => M.run(b, stop), stop);
    assert.strictEqual(v.status, 'NOT READ', `an unmutated suite stopped by its limit was read as ${v.status}`);
  } finally {
    for (const d of [a, b]) fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});
