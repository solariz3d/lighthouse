// The Root 1 scoring script, checked against numbers worked out by hand before the script ran.
//
// The point of this file is that the figures in the write-up will be re-derivable rather than
// trusted. That only means something if the script itself is pinned to arithmetic somebody can
// verify without it — so the anchors here are a textbook 2x2 whose one-tailed Fisher value is
// 17/70, a sign test whose value is 1/64, and one full 90-row table whose primary p was computed
// on paper as 218276/155117520 before this file existed.
//
// It is written and run BEFORE B's item file exists. An instrument demonstrated working before
// there is anything to point it at cannot have been shaped by what it found.
//
//   node consonance/tools/root1-score.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const S = require('./root1-score.js');

/* ------------------------------------------------------------------ *
 * 1. Fisher, against a value that predates this script by a century
 * ------------------------------------------------------------------ */

test("Fisher one-tailed matches the tea-tasting 2x2 by hand: 17/70", () => {
  // a=3 b=1 / c=1 d=3. N=8, m=4, n1=4, n2=4.
  // P(A>=3) = [C(4,3)C(4,1) + C(4,4)C(4,0)] / C(8,4) = (16 + 1)/70 = 17/70 = 0.2428571…
  const r = S.fisherOneTailed(3, 1, 1, 3, 'high_better');
  assert.strictEqual(r.pExact, '17/70');
  assert.ok(Math.abs(r.p - 17 / 70) < 1e-12, `got ${r.p}`);
});

test('the two tails are complementary at the observed cell, never equal to 1 between them', () => {
  // P(A<=a) + P(A>=a) = 1 + P(A=a): the observed cell is counted in both. A test that asserted
  // they sum to 1 would pass on a hypergeometric that had lost its middle term.
  const lo = S.fisherOneTailed(3, 1, 1, 3, 'high_worse');
  const hi = S.fisherOneTailed(3, 1, 1, 3, 'high_better');
  const atA = (4 * 4) / 70;                                  // C(4,3)C(4,1)/C(8,4)
  assert.ok(Math.abs(lo.p + hi.p - (1 + atA)) < 1e-12, `${lo.p} + ${hi.p}`);
});

test('perfect separation gives the reciprocal of the whole hypergeometric', () => {
  // 15/0 against 0/15: only one arrangement out of C(30,15) is this extreme.
  const r = S.fisherOneTailed(0, 15, 15, 0, 'high_worse');
  assert.strictEqual(r.pExact, '1/155117520');
});

test('no effect at all sits near the middle and clears nothing', () => {
  const r = S.fisherOneTailed(8, 7, 8, 7, 'high_worse');
  assert.ok(r.p > 0.5, `an identical split must not read as an effect: ${r.p}`);
});

test('the binomial coefficient is exact where a double would already have drifted', () => {
  // C(60,30) is 1.18e17, past 2^53. Computed in floats it comes back wrong, and the error lands
  // in a p-value that a registered rule is compared against.
  assert.strictEqual(S.choose(60, 30).toString(), '118264581564861424');
  assert.strictEqual(S.choose(5, 7), 0n);
  assert.strictEqual(S.choose(5, 0), 1n);
});

/* ------------------------------------------------------------------ *
 * 2. the sign test
 * ------------------------------------------------------------------ */

test('sign test: 6 of 6 discordant favouring HIGH is 1/64', () => {
  assert.strictEqual(S.signTest(6, 6, 'high_sound').pExact, '1/64');
});

test('sign test: 5 of 6 is 7/64 — the case the withdrawn +2 bar would have passed', () => {
  // The preregistration's original rule was net directional flips >= +2, which 5-of-6 clears.
  // Its exact one-tailed p is 0.109. Pinned here because the withdrawal of that bar is the whole
  // reason this function exists.
  const r = S.signTest(5, 6, 'high_sound');
  assert.strictEqual(r.pExact, '7/64');
  assert.ok(r.p > 0.05, 'the old bar cleared at a p of 0.109, which is why it is gone');
});

test('sign test with nothing discordant reports that rather than a number', () => {
  const r = S.signTest(0, 0, 'high_sound');
  assert.ok(Number.isNaN(r.p));
  assert.match(r.note, /nothing to run on/);
});

/* ------------------------------------------------------------------ *
 * 3. a full table, whose primary p was computed on paper first
 * ------------------------------------------------------------------ */

/** Build a registered-shape table. `plan(item, cls, condition, subject)` returns SOUND/NOT_SOUND. */
function table(plan, opt = {}) {
  const rows = ['item\tclass\tcondition\tsubject\tverdict\tcites\ttools'];
  for (let item = 1; item <= 10; item++) {
    const cls = item <= 5 ? 'FALSE' : 'TRUE';
    for (const cond of ['HIGH', 'MID', 'LOW']) {
      for (let subj = 1; subj <= 3; subj++) {
        const v = plan(item, cls, cond, subj);
        const cites = opt.cites ? opt.cites(item, cls, cond, subj) : 'YES';
        rows.push(`${item}\t${cls}\t${cond}\t${subj}\t${v}\t${cites}\t4`);
      }
    }
  }
  return rows.join('\n');
}

/* The planted effect, and the arithmetic done by hand before running anything:
 *
 * 5 FALSE items x 3 subjects = 15 verdicts per condition. Plant HIGH at 3 correct / 12 wrong and
 * LOW at 12 correct / 3 wrong. Then n1 = n2 = 15, m = 15, N = 30, and
 *
 *   P(A <= 3) = [C(15,0)C(15,15) + C(15,1)C(15,14) + C(15,2)C(15,13) + C(15,3)C(15,12)] / C(30,15)
 *             = [1 + 225 + 11025 + 207025] / 155117520
 *             = 218276 / 155117520  =  0.0014071…
 *
 * If the script disagrees with that fraction, the script is wrong, not the paper. */
const PLANTED = (item, cls, cond, subj) => {
  if (cls === 'TRUE') return 'SOUND';                       // TRUE items answered correctly throughout
  if (cond === 'HIGH') return (item === 1 && subj <= 3) ? 'NOT_SOUND' : 'SOUND';   // 3 correct of 15
  if (cond === 'LOW') return (item === 1 && subj <= 3) ? 'SOUND' : 'NOT_SOUND';    // 12 correct of 15
  return subj === 1 ? 'SOUND' : 'NOT_SOUND';                // MID: 10 of 15 correct on FALSE
};

test('the primary p on a planted table equals the fraction worked out on paper', () => {
  const r = S.score(S.parseTable(table(PLANTED)));
  assert.strictEqual(r.primary.highCorrect, 3);
  assert.strictEqual(r.primary.lowCorrect, 12);
  assert.strictEqual(r.primary.pExact, '218276/155117520');
  assert.ok(Math.abs(r.primary.p - 218276 / 155117520) < 1e-15);
  assert.match(r.primary.verdict, /^SUPPORTED/);
});

test('and the mirrored test does NOT also fire on it', () => {
  // Both tails reading SUPPORTED would mean the direction is not being tested at all.
  const r = S.score(S.parseTable(table(PLANTED)));
  assert.match(r.mirrored.verdict, /no reversal/);
});

test('a reversal is detected as a reversal, not reported as a null', () => {
  // The pilot in prereg amendment 1 pointed this way. If the mirrored test did not exist, this
  // table would be written up as "not significant, no effect".
  const REVERSED = (item, cls, cond, subj) => {
    const f = PLANTED(item, cls, cond, subj);
    if (cls !== 'FALSE' || cond === 'MID') return f;
    return cond === 'HIGH' ? PLANTED(item, cls, 'LOW', subj) : PLANTED(item, cls, 'HIGH', subj);
  };
  const r = S.score(S.parseTable(table(REVERSED)));
  assert.match(r.mirrored.verdict, /^REVERSAL/);
  assert.match(r.primary.verdict, /^NOT SUPPORTED/);
});

test('a table with no effect supports nothing in either direction', () => {
  const FLAT = (item, cls, cond, subj) => (subj === 1 ? 'SOUND' : (cls === 'TRUE' ? 'SOUND' : 'NOT_SOUND'));
  const r = S.score(S.parseTable(table(FLAT)));
  assert.match(r.primary.verdict, /^NOT SUPPORTED/);
  assert.match(r.mirrored.verdict, /no reversal/);
});

/* ------------------------------------------------------------------ *
 * 4. the validity floor, at both walls and on the boundary itself
 * ------------------------------------------------------------------ */

/** A table with exactly `k` of the 90 verdicts correct, filled in row order. */
function atAccuracy(k) {
  let n = 0;
  return table((item, cls, cond, subj) => {
    n++;
    const right = cls === 'TRUE' ? 'SOUND' : 'NOT_SOUND';
    const wrong = cls === 'TRUE' ? 'NOT_SOUND' : 'SOUND';
    return n <= k ? right : wrong;
  });
}

test('POOLED accuracy at or below 65% voids the run rather than scoring it', () => {
  // Guessing raises the rate at which noise clears any bar, so too-hard items are the failure
  // that MANUFACTURES a win. The floor is checked before anything else is read.
  const r = S.score(S.parseTable(atAccuracy(50)));            // 50/90 = 55.6%
  assert.ok(Math.abs(r.accuracy.POOLED - 50 / 90) < 1e-12, `pooled ${r.accuracy.POOLED}`);
  assert.match(r.validity, /^VOID/);
});

test('POOLED accuracy at or above 95% reports underpowered rather than a clean null', () => {
  const EASY = (item, cls) => (cls === 'TRUE' ? 'SOUND' : 'NOT_SOUND');
  const r = S.score(S.parseTable(table(EASY)));
  assert.strictEqual(r.accuracy.POOLED, 1);
  assert.match(r.validity, /^UNDERPOWERED/);
});

test('THE FLOOR IS POOLED, NOT MID — a ceiling in MID cannot rescue a guessing run', () => {
  // The discriminating case, and the reason the registration moved the floor off MID: item
  // difficulty is a property of the ITEMS, and no wording of a middle condition is verifiably
  // neutral. If this ever reverts to reading MID alone, this table scores OK while two thirds of
  // the run is at chance — and the first gate would be passing a run it exists to stop.
  const SPLIT = (item, cls, cond, subj) => {
    const right = cls === 'TRUE' ? 'SOUND' : 'NOT_SOUND';
    const wrong = cls === 'TRUE' ? 'NOT_SOUND' : 'SOUND';
    if (cond === 'MID') return right;                          // MID at 100%
    return subj === 1 ? right : wrong;                         // HIGH and LOW at 33%
  };
  const r = S.score(S.parseTable(table(SPLIT)));
  assert.strictEqual(r.accuracy.MID, 1, 'MID is at ceiling');
  assert.ok(r.accuracy.POOLED <= 0.65, `pooled is at the floor: ${r.accuracy.POOLED}`);
  assert.match(r.validity, /^VOID/, 'the pooled floor must void this despite a perfect MID');
});

test('the boundary is inclusive on both walls, as registered', () => {
  // "<= 65%" and ">= 95%" over 90 verdicts. 58/90 = 64.4% must void, 59/90 = 65.6% must pass.
  // The registered wording is inclusive and a strict comparison would move the wall by a subject.
  assert.match(S.score(S.parseTable(atAccuracy(58))).validity, /^VOID/);
  assert.strictEqual(S.score(S.parseTable(atAccuracy(59))).validity, 'OK');
  assert.match(S.score(S.parseTable(atAccuracy(86))).validity, /^UNDERPOWERED/);   // 95.6%
  assert.strictEqual(S.score(S.parseTable(atAccuracy(85))).validity, 'OK');        // 94.4%
});

/* ------------------------------------------------------------------ *
 * 5. what it refuses — every one of these can otherwise produce a number
 * ------------------------------------------------------------------ */

const refuses = (text, re, why) => {
  assert.throws(() => S.score(S.parseTable(text)), re, why);
};

test('a table short by one row produces NO numbers', () => {
  // The failure this room already has a name for, arriving where nobody would check it: a score
  // that came out looks exactly like a score that was earned.
  const t = table(PLANTED).split('\n');
  t.pop();
  refuses(t.join('\n'), /89 rows/, 'a short table must refuse, not score');
});

test('an item whose class differs between two rows produces NO numbers', () => {
  const t = table(PLANTED).split('\n');
  t[1] = t[1].replace('\tFALSE\t', '\tTRUE\t');
  refuses(t.join('\n'), /both TRUE and FALSE/, 'a corrupted key must refuse');
});

test('a duplicated cell produces NO numbers', () => {
  const t = table(PLANTED).split('\n');
  t[2] = t[1];
  refuses(t.join('\n'), /duplicate cell|both TRUE and FALSE/, 'a duplicate must refuse');
});

test('an unbalanced TRUE/FALSE set produces NO numbers', () => {
  const rows = ['item\tclass\tcondition\tsubject\tverdict\tcites\ttools'];
  for (let item = 1; item <= 10; item++) {
    const cls = item <= 4 ? 'FALSE' : 'TRUE';                // 4 / 6, not 5 / 5
    for (const cond of ['HIGH', 'MID', 'LOW']) {
      for (let subj = 1; subj <= 3; subj++) rows.push(`${item}\t${cls}\t${cond}\t${subj}\tSOUND\tYES\t4`);
    }
  }
  refuses(rows.join('\n'), /balanced/, 'an unbalanced set lets a standing bias read as accuracy');
});

test('a wrong header, a bad enum and a non-integer all refuse by name', () => {
  assert.throws(() => S.parseTable('item\tclass\n1\tFALSE'), /header must be exactly/);
  const t = table(PLANTED).split('\n');
  assert.throws(() => S.parseTable([t[0], t[1].replace('SOUND', 'MAYBE')].join('\n')), /verdict must be/);
  assert.throws(() => S.parseTable([t[0], t[1].replace(/\t4$/, '\tfour')].join('\n')), /tools must be an integer/);
  assert.throws(() => S.parseTable(''), /empty table/);
});

/* ------------------------------------------------------------------ *
 * 6. the exploratory measure stays exploratory
 * ------------------------------------------------------------------ */

test('the tool-call count is reported and never tested', () => {
  // Prereg amendment 1: the measure was chosen after a number was glimpsed. It is the better
  // instrument and it is still contaminated; the second governs. If a p-value ever appears
  // beside it, this assertion is the thing that should have stopped it.
  const r = S.score(S.parseTable(table(PLANTED)));
  assert.ok(typeof r.toolsExploratory.HIGH === 'number');
  const flat = JSON.stringify(r.toolsExploratory);
  assert.ok(!/\bp\b|pExact|verdict/.test(flat), 'no test statistic may attach to the tool-call count');
  assert.match(S.report(r), /EXPLORATORY, chosen after a number was glimpsed; never a result/);
});

test('the looked rate is reported per condition', () => {
  const r = S.score(S.parseTable(table(PLANTED, { cites: (i, c, cond) => (cond === 'HIGH' ? 'NO' : 'YES') })));
  assert.strictEqual(r.looked.HIGH, 0);
  assert.strictEqual(r.looked.LOW, 1);
});
