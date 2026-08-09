// The failure this file is mostly guarding against is the tool GOING QUIET.
//
// An extractor that stops extracting reports overlap 0.0 everywhere, which reads as "the panes
// share no evidence" — a finding-shaped result that is really a dead regex. That has shipped
// here before wearing a green result. So several assertions below exist only to prove the
// referent extractor still returns something on realistic text.
//
// The second thing these tests deliberately do NOT do: assert the experiment's OUTCOME. The
// old gauge's unit test was named `spread_high_for_distinct_low_for_echo` and sat green for
// months while the claim in its name was false on real data. Tests here pin the MECHANISM —
// what counts as a referent, when a referent counts as shared, what happens below the floor —
// and leave the separation to be measured, not asserted.
//
//   node consonance/tools/agreement-spread.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  referentIdentities, referentOverlap, vantageSpread,
  buildLaps, contiguousBlocks, spearman, score, FLOOR,
} = require('./agreement-spread.js');

test('two lines of one file are one referent (registered decision 2)', () => {
  const a = referentIdentities('see src/listen.rs:19 and src/listen.rs:22 for the guard');
  assert.deepStrictEqual([...a], ['path:src/listen.rs']);
});

test('bare numbers are not referents (registered decision 1)', () => {
  const a = referentIdentities('there were 3 runs, 141 laps and 46,058 records');
  assert.strictEqual(a.size, 0, 'bare numbers must not create identities — every 3 collides with every other 3');
});

test('urls, backticked spans and #nnn citations are referents', () => {
  const a = referentIdentities('per http://x.io/a the `vantage spread` gauge, see #1641');
  assert.ok(a.has('url:http://x.io/a'));
  assert.ok(a.has('code:vantage spread'), 'a backticked span with a space must survive — the token form loses it');
  assert.ok(a.has('cite:#1641'));
});

test('the extractor does not go quiet on realistic prose', () => {
  const real = 'I read `tether.rs::vantage_spread` in consonance/src-tauri/src/tether.rs:151 ' +
               'and the prereg at exo_memory/loop/diversity2_preregistration.md says 0.8201.';
  assert.ok(referentIdentities(real).size >= 3, 'a realistic sentence must yield referents');
});

test('a referent repeated inside ONE source is not shared', () => {
  const r = referentOverlap([
    ['a/x.rs matters', 'a/x.rs again', 'a/x.rs once more'],
    ['unrelated b/y.rs'],
  ]);
  assert.strictEqual(r.shared, 0, 'repetition by one voice is not agreement between two');
  assert.strictEqual(r.distinct, 2);
});

test('a referent touched by two different sources is shared', () => {
  const r = referentOverlap([['a/x.rs is fine'], ['a/x.rs is not fine']]);
  assert.strictEqual(r.shared, 1);
  assert.strictEqual(r.overlap, 1);
});

test('empty and single-source input do not throw and do not invent overlap', () => {
  assert.strictEqual(referentOverlap([]).overlap, 0);
  assert.strictEqual(referentOverlap([[]]).overlap, 0);
  assert.strictEqual(referentOverlap([['no referents here at all']]).distinct, 0);
});

test('below the floor a lap is marked unscoreable rather than scored', () => {
  const r = referentOverlap([['a/1.rs b/2.rs'], ['a/1.rs']]);
  assert.ok(r.distinct < FLOOR);
  assert.strictEqual(r.scoreable, false);
});

test('contiguousBlocks refuses rather than returning empty blocks', () => {
  assert.strictEqual(contiguousBlocks({ recs: [{ text: 'a' }] }, 2), null);
  const b = contiguousBlocks({ recs: [1, 2, 3, 4, 5].map(i => ({ text: 's' + i })) }, 2);
  assert.strictEqual(b.length, 2);
  assert.strictEqual(b.flat().length, 5, 'no record may be dropped by the split');
});

test('laps split on the gap, not on the pane', () => {
  const t = 1700000000000;
  const laps = buildLaps([
    { ts: t, pane: 'a', text: 'x', role: 'assistant' },
    { ts: t + 1000, pane: 'b', text: 'y', role: 'assistant' },
    { ts: t + 60 * 60 * 1000, pane: 'a', text: 'z', role: 'assistant' },
  ]);
  assert.strictEqual(laps.length, 2);
  assert.strictEqual(laps[0].recs.length, 2);
});

test('spearman handles ties and perfect ordering', () => {
  assert.ok(Math.abs(spearman([1, 2, 3, 4], [10, 20, 30, 40]) - 1) < 1e-9);
  assert.ok(Math.abs(spearman([1, 2, 3, 4], [40, 30, 20, 10]) + 1) < 1e-9);
  assert.ok(Number.isNaN(spearman([1, 1, 1, 1], [1, 2, 3, 4])), 'a constant has no rank correlation');
});

test('score() reports laps excluded by the floor instead of dropping them silently', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agspread-'));
  const f = path.join(dir, 'board.jsonl');
  const t = 1700000000000;
  const thin = [
    { pane: 'a', role: 'assistant', ts: t, text: 'nothing checkable here' },
    { pane: 'b', role: 'assistant', ts: t + 1000, text: 'nor here' },
  ];
  fs.writeFileSync(f, thin.map(r => JSON.stringify(r)).join('\n'));
  const r = score(f);
  assert.strictEqual(r.pos.length, 0);
  assert.strictEqual(r.posBelowFloor, 1, 'an excluded lap must appear in the count');
});

test('the old gauge is ported faithfully enough to compare against', () => {
  // Its own Rust unit test's inputs, which hold on short strings and were never the problem.
  const distinct = ['gearing ratios and clutch engagement temperature',
                    'lunar tides and the orbital mechanics of satellites'];
  const echo = ['gearing ratios and clutch engagement matter',
                'clutch engagement and gearing ratios matter'];
  assert.ok(vantageSpread(distinct) > vantageSpread(echo));
  assert.ok(vantageSpread(echo) < 0.4);
});
