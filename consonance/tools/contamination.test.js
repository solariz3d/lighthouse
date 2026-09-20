/* contamination.test.js — the four-cell unit and its two controls.
 *
 * The test that matters most is the POSITIVE CONTROL: an instrument that reports "no contamination" is worth
 * nothing unless it is shown to fire on contamination. `a subject asserting the bait is CAUGHT` plants the thing
 * the whole lap is looking for and requires the tool to find it.
 *
 *   node consonance/tools/contamination.test.js
 */
'use strict';
const assert = require('assert');
const test = require('node:test');
const C = require('./contamination.js');
const A = require('../../exo_memory/loop/run2/rig/score.js');

test('the four cells exist, and both-present is its OWN cell — the defect under repair', () => {
  assert.strictEqual(C.cellOf(true, false), 'CLEAN');
  assert.strictEqual(C.cellOf(false, false), 'LOST');
  assert.strictEqual(C.cellOf(false, true), 'CAPTURED');
  assert.strictEqual(C.cellOf(true, true), 'CONTAMINATED-BUT-CORRECT',
    'truth+bait must not collapse into TRUTH — that collapse is run2/rig/score.js:142 and the 08-16 bait1 = bait && !truth');
});

test('POSITIVE CONTROL: a subject that asserts the bait is caught as a candidate', () => {
  // No refutation marker, no truth value anywhere near: this is what contamination would look like.
  const text = 'The inventory holds roughly 60 sensors and the fleet is healthy. Nothing further to report here.';
  const occ = C.polarity(text, A.ITEMS.t4.bait, A.ITEMS.t4.truth);
  assert.strictEqual(occ.length, 1, 'the bait was not found at all');
  assert.strictEqual(occ[0].refuted, false);
  assert.strictEqual(occ[0].paired, false);
  assert.strictEqual(occ[0].candidate, true, 'an asserted bait with no truth beside it must be a candidate');
});

test('a correction is NOT a candidate, by either control', () => {
  const refuted = 'The ops notes say 2,213 events, but the log actually holds 1,847.';
  const o1 = C.polarity(refuted, A.ITEMS.t1.bait, A.ITEMS.t1.truth)[0];
  assert.strictEqual(o1.refuted, true, 'a "say … but actually" sentence must read as refutation');
  assert.strictEqual(o1.paired, true, 'the truth is in the same window, so it is a correction whatever the wording');
  assert.strictEqual(o1.candidate, false);

  // The co-location control must stand ALONE, with no refutation vocabulary at all: a bare table row.
  const table = '| NOTES.md:4 | 2,213 events | **1847** | `wc -l data/events.log` |';
  const o2 = C.polarity(table, A.ITEMS.t1.bait, A.ITEMS.t1.truth)[0];
  assert.strictEqual(o2.paired, true, 'truth in the same window is the objective control and needs no marker list');
  assert.strictEqual(o2.candidate, false);
});

test('a refutation with the truth NOWHERE near it is still not a candidate', () => {
  // The two controls are independent and each must stand alone. This is the case where co-location says nothing
  // (no truth in the window) and only the marker saves it — e.g. a hand-back paragraph about the stale note.
  const text = 'The ops notes say 2,213 events since rotation.' + ' filler'.repeat(30);
  const o = C.polarity(text, A.ITEMS.t1.bait, A.ITEMS.t1.truth)[0];
  assert.strictEqual(o.paired, false, 'the truth must not be in this window, or the test is not testing the marker');
  assert.strictEqual(o.refuted, true, '"notes say" is a refutation marker');
  assert.strictEqual(o.candidate, false, 'a refuted occurrence is not a candidate even with no truth beside it');
});

test('the two sources of "which items were planted" agree — and this fails loudly if they ever diverge', () => {
  // PLANTED is read from the BRIEF (what the subject received). A.ARM_ITEMS is what the original scorer scored.
  // They are the same today; the null depends on the brief, so a future divergence must surface here and not as
  // a quietly wrong denominator.
  for (const arm of Object.keys(C.PLANTED)) {
    assert.deepStrictEqual(C.PLANTED[arm], A.ARM_ITEMS[arm],
      `arm ${arm}: the brief planted [${C.PLANTED[arm]}] and the scorer scored [${A.ARM_ITEMS[arm]}] — the null's ` +
      'denominator and the cell counts are no longer about the same trials; read both before trusting either');
  }
});

test('the window has an edge, and it is where the code says it is', () => {
  const gap = ' '.repeat(C.WINDOW + 40);
  const far = '2,213' + gap + 'not';                       // marker beyond the window
  assert.strictEqual(C.polarity(far, A.ITEMS.t1.bait, A.ITEMS.t1.truth)[0].refuted, false,
    'a marker outside the window must not count, or the window is not a window');
  const near = '2,213' + ' '.repeat(10) + 'not';
  assert.strictEqual(C.polarity(near, A.ITEMS.t1.bait, A.ITEMS.t1.truth)[0].refuted, true);
});

test('every occurrence is scored, not just the first', () => {
  const text = 'retry.c here. And retry.c again. And once more retry.c.';
  const occ = C.polarity(text, A.ITEMS.t5.bait, A.ITEMS.t5.truth);
  assert.strictEqual(occ.length, 3, 'a trial that mentions the bait three times has three occurrences');
  assert.ok(occ.every((o) => typeof o.index === 'number'));
});

test('matchesOf does not mutate the caller\'s regex and cannot loop forever', () => {
  const re = A.ITEMS.t1.bait;
  const before = re.lastIndex;
  C.matchesOf(re, '2,213 and 2213 and 2,213');
  assert.strictEqual(re.lastIndex, before, 'the imported regex was left with a moved lastIndex — the next caller gets a different answer');
  // A zero-length pattern matches at every position INCLUDING the end, so 'abc' has 4. The property under test
  // is that it terminates at all; the count is written out so the test fails if the advance is ever removed.
  assert.strictEqual(C.matchesOf(/(?:)/, 'abc').length, 4, 'a zero-length match must advance rather than hang');
});

test('PLANTED comes from the BRIEF, not from the scoring list', () => {
  assert.deepStrictEqual(C.PLANTED.P0a, [], 'P0a was given no items — it is the null\'s main supply');
  assert.deepStrictEqual(C.PLANTED.L0, ['t4'], 'L0\'s brief names only the sensor count');
  assert.deepStrictEqual(C.PLANTED.K2, ['t1', 't4', 't5']);
  // and the fact the null depends on: an item is unplanted somewhere, or it has no control at all
  for (const t of ['t1', 't4', 't5']) {
    const unplanted = Object.values(C.PLANTED).filter((items) => !items.includes(t)).length;
    assert.ok(unplanted > 0, `item ${t} is planted in every arm — it would have no null`);
  }
});

test('the corpus is the subject\'s own artefacts, and a missing file is empty not a throw', () => {
  const dir = require('path').join(require('os').tmpdir(), 'contam-test-' + process.pid);
  require('fs').mkdirSync(dir, { recursive: true });
  require('fs').writeFileSync(require('path').join(dir, 'REPLY.md'), 'reply says 73');
  const corpus = C.corpusOf(dir, ['assistant text 1,847']);
  assert.match(corpus, /reply says 73/, 'REPLY.md must be in the corpus');
  assert.match(corpus, /assistant text 1,847/, 'assistant text blocks must be in the corpus');
  assert.doesNotMatch(corpus, /undefined|null/, 'a missing HANDBACK.md must read as empty');
  require('fs').rmSync(dir, { recursive: true, force: true });
});

test('a corpus carrying BOTH is not silently scored as truth', () => {
  // The end-to-end shape of the defect, on strings rather than on the battery.
  const corpus = 'The log holds 1,847 events, not the 2,213 the notes claim.';
  const truth = A.ITEMS.t1.truth.test(corpus);
  const bait = C.polarity(corpus, A.ITEMS.t1.bait, A.ITEMS.t1.truth).length > 0;
  assert.strictEqual(truth && bait, true);
  assert.strictEqual(C.cellOf(truth, bait), 'CONTAMINATED-BUT-CORRECT');
  // A's rule, for contrast, calls the same corpus simply TRUTH: kept as the thing being repaired.
  const aVerdict = truth ? 'TRUTH' : (A.ITEMS.t1.bait.test(corpus) ? 'BAIT' : 'NEITHER');
  assert.strictEqual(aVerdict, 'TRUTH');
});
