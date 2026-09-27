'use strict';
// node --test exo_memory/loop/claimrec/score_q3.test.js — the Q3 scorer on synthetic reader files only. No real unit,
// reader file or answer key is read (none existed when this was written, and the scorer's author must not see them).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), os = require('os'), path = require('path');
const { execFileSync } = require('child_process');
const { parseReader, pair, score } = require('./score_q3.js');

const CT = "CAN'T TELL";
// build two reader files from a list of [B, C] answers; ids U01..Unn
const files = (rows) => {
  const id = (i) => 'U' + String(i + 1).padStart(2, '0');
  return [rows.map(([b], i) => `${id(i)}: ${b}`).join('\n'), rows.map(([, c], i) => `| ${id(i)} | ${c} |`).join('\n')];
};
const run = (rows, n) => { const [b, c] = files(rows); return score(pair(parseReader(b, 'B'), parseReader(c, 'C'), n)); };
const rep = (k, pairArr) => Array(k).fill(pairArr);

// ── THE HAND-COMPUTED EXAMPLE ───────────────────────────────────────────────────────────────────────────────
//   10 units.  (B, C):  (YES,YES) x3 · (YES,NO) x1 · (NO,NO) x3 · (NO,CT) x1 · (CT,CT) x1 · (CT,YES) x1
//   B's answers: YES 4, NO 4, CT 2.   C's answers: YES 3+1 = 4, NO 1+3 = 4, CT 1+1 = 2.
//   agreements a = 3 + 3 + 1 = 7            -> p_o = 7/10 = 0.70
//   p_e = (4*4 + 4*4 + 2*2) / 10^2 = 36/100 = 0.36
//   kappa = (0.70 - 0.36) / (1 - 0.36) = 0.34 / 0.64 = 0.53125
//   integer form: (n*a - S)/(n*n - S) = (70 - 36)/(100 - 36) = 34/64 = 0.53125   -> BORDERLINE (0.40 <= k < 0.60)
//   CAN'T TELL: B 2/10 = 20%, C 2/10 = 20%, both under the 25% bar.
const HAND = [...rep(3, ['YES', 'YES']), ['YES', 'NO'], ...rep(3, ['NO', 'NO']), ['NO', CT], [CT, CT], [CT, 'YES']];

test('the hand-computed example: kappa is exactly 34/64 = 0.53125', () => {
  const r = run(HAND);
  assert.deepStrictEqual([r.kappa.num, r.kappa.den, r.kappa.value], [34, 64, 0.53125]);
});
test('the hand-computed example: raw agreement 7/10', () => assert.strictEqual(run(HAND).agree, 7));
test("the hand-computed example: each reader's CAN'T TELL count is 2", () => {
  const r = run(HAND); assert.deepStrictEqual([r.ctB, r.ctC], [2, 2]);
});
test('the hand-computed example scores BORDERLINE', () => assert.strictEqual(run(HAND).verdict, 'BORDERLINE'));

// ── the bars, at their exact edges (two categories, marginals 50/50 so p_e = 1/2 and kappa = 2*p_o - 1) ──────────
test('perfect agreement: kappa 1, USABLE', () => {
  const r = run([...rep(4, ['YES', 'YES']), ...rep(4, ['NO', 'NO']), [CT, CT]]);
  assert.deepStrictEqual([r.kappa.value, r.verdict], [1, 'USABLE']);
});
test('kappa exactly 0.60 is USABLE (p_o 8/10: 4 YY, 4 NN, 1 YN, 1 NY -> (80-50)/(100-50) = 30/50)', () => {
  const r = run([...rep(4, ['YES', 'YES']), ...rep(4, ['NO', 'NO']), ['YES', 'NO'], ['NO', 'YES']]);
  assert.deepStrictEqual([r.kappa.num, r.kappa.den, r.verdict], [30, 50, 'USABLE']);
});
test('kappa exactly 0.40 is BORDERLINE (20 units: 7 YY, 7 NN, 3 YN, 3 NY -> (280-200)/(400-200) = 80/200)', () => {
  const r = run([...rep(7, ['YES', 'YES']), ...rep(7, ['NO', 'NO']), ...rep(3, ['YES', 'NO']), ...rep(3, ['NO', 'YES'])]);
  assert.deepStrictEqual([r.kappa.num, r.kappa.den, r.verdict], [80, 200, 'BORDERLINE']);
});
test('kappa 0.35, just under the 0.40 bar, FAILS (40 units: 14 YY, 13 NN, 7 YN, 6 NY; B Y21 N19, C Y20 N20; S = 21*20 + 19*20 = 800 -> (40*27 - 800)/(1600 - 800) = 280/800)', () => {
  const r = run([...rep(14, ['YES', 'YES']), ...rep(13, ['NO', 'NO']), ...rep(7, ['YES', 'NO']), ...rep(6, ['NO', 'YES'])], 40);
  assert.deepStrictEqual([r.kappa.num, r.kappa.den, r.verdict], [280, 800, 'FAILS']);
});
test('kappa 0.20 FAILS (3 YY, 3 NN, 2 YN, 2 NY -> (60-50)/(100-50) = 10/50)', () => {
  const r = run([...rep(3, ['YES', 'YES']), ...rep(3, ['NO', 'NO']), ...rep(2, ['YES', 'NO']), ...rep(2, ['NO', 'YES'])]);
  assert.deepStrictEqual([r.kappa.num, r.kappa.den, r.verdict], [10, 50, 'FAILS']);
});

// ── CAN'T TELL: "above 25%" — exactly 25% does not trip, and it overrides kappa when it does ──────────────────────
const AT25 = [[CT, CT], [CT, CT], ...rep(3, ['YES', 'YES']), ...rep(3, ['NO', 'NO'])]; // 2/8 = 25% each, kappa 1
test("CAN'T TELL exactly 25% (2/8) does not trip the bar: USABLE", () => assert.strictEqual(run(AT25).verdict, 'USABLE'));
test("CAN'T TELL above 25% for both (3/8) is NOT ANSWERABLE even at kappa 1", () => {
  const r = run([...rep(3, [CT, CT]), ...rep(3, ['YES', 'YES']), ...rep(2, ['NO', 'NO'])]);
  assert.deepStrictEqual([r.kappa.value, r.verdict], [1, 'NOT ANSWERABLE AS POSED']);
});
test("CAN'T TELL above 25% for B only (3/8, C 0/8) trips the bar", () => {
  const r = run([...rep(3, [CT, 'NO']), ...rep(3, ['YES', 'YES']), ...rep(2, ['NO', 'NO'])]);
  assert.deepStrictEqual([r.ctB, r.ctC, r.verdict], [3, 0, 'NOT ANSWERABLE AS POSED']);
});
test("CAN'T TELL above 25% for C only trips the bar too", () => {
  const r = run([...rep(2, [CT, CT]), ['YES', CT], ...rep(3, ['YES', 'YES']), ...rep(2, ['NO', 'NO'])]);
  assert.deepStrictEqual([r.ctB, r.ctC, r.verdict], [2, 3, 'NOT ANSWERABLE AS POSED']);
});

// ── all one category: kappa undefined ────────────────────────────────────────────────────────────────────
test('both readers answer YES to every unit: kappa UNDEFINED, reported, no kappa bar applied', () => {
  const r = run(rep(6, ['YES', 'YES']));
  assert.deepStrictEqual([r.kappa, r.verdict], [null, 'KAPPA UNDEFINED — no bar applies']);
});
test("both readers answer CAN'T TELL to every unit: the CAN'T TELL bar still applies", () => {
  assert.strictEqual(run(rep(6, [CT, CT])).verdict, 'NOT ANSWERABLE AS POSED');
});
test('one reader all YES, the other varied: kappa is defined (0) and FAILS', () => {
  const r = run([...rep(3, ['YES', 'YES']), ...rep(3, ['YES', 'NO'])]);
  assert.deepStrictEqual([r.kappa.value, r.verdict], [0, 'FAILS']);
});

// ── parsing, and failing loudly ───────────────────────────────────────────────────────────────────────────
test('rows may be bold, listed, tabled, lower-case, with a curly apostrophe and a trailing reason', () => {
  const a = parseReader("# B's read\n| unit | answer |\n|---|---|\n- **U01**: yes — it says 3\n| U02 | **NO** | fine |\nU03 : can’t tell.\nprose line", 'B');
  assert.deepStrictEqual([...a], [['U01', 'YES'], ['U02', 'NO'], ['U03', CT]]);
});
test('a row whose answer is not one of the three is refused, not guessed', () => {
  assert.throws(() => parseReader('U01: YES\nU02: NOT SURE', 'B'), /B:2: unit U02 has no answer/);
});
test('a unit answered twice is refused', () => assert.throws(() => parseReader('U01: YES\nU01: NO', 'C'), /C:2: unit U01 is answered twice/));
test('a file with no answer rows is refused', () => assert.throws(() => parseReader('nothing here\n', 'B'), /no answer rows/));
test('a unit missing from one reader is refused, naming it', () => {
  assert.throws(() => pair(parseReader('U01: YES\nU02: NO', 'B'), parseReader('U01: YES', 'C')), /only in B: \[U02\]/);
});
test('an unmatched unit id (a typo in one file) is refused, naming both sides', () => {
  assert.throws(() => pair(parseReader('U01: YES\nU02: NO', 'B'), parseReader('U01: YES\nU2: NO', 'C')), /only in B: \[U02\] · only in C: \[U2\]/);
});
test('a unit count other than the registered one is refused', () => {
  assert.throws(() => pair(parseReader('U01: YES', 'B'), parseReader('U01: YES', 'C'), 40), /expected 40 units, found 1/);
});

// ── the CLI, end to end on temp files ────────────────────────────────────────────────────────────────────────
const cli = (bText, cText, extra = []) => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'q3-')), b = path.join(d, 'b.md'), c = path.join(d, 'c.md');
  fs.writeFileSync(b, bText); fs.writeFileSync(c, cText);
  try { return { code: 0, out: execFileSync(process.execPath, [path.join(__dirname, 'score_q3.js'), b, c, ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; }
  catch (e) { return { code: e.status, out: e.stderr }; }
  finally { fs.rmSync(d, { recursive: true, force: true }); }
};
test('CLI: the hand example prints the verdict line', () => {
  const [b, c] = files(HAND);
  assert.match(cli(b, c, ['--n', '10']).out, /VERDICT BORDERLINE/);
});
test('CLI: defaults to the registered 40 units and exits 2 on 10', () => {
  const [b, c] = files(HAND);
  const r = cli(b, c);
  assert.deepStrictEqual([r.code, /REFUSED: expected 40 units, found 10/.test(r.out)], [2, true]);
});
