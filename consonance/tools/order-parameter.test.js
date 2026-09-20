/* Tests for order-parameter.js's pure core — sessions, the running-centroid curve, and the two registered verdicts.
 * The prediction and method are frozen in exo_memory/handback/p-order-parameter-C_2026-09-20.md §1/§1b, written
 * before the instrument ran. No encoder is needed here: vectors are injected. */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const { sessionsOf, orderCurve, slope, quintileGap, classify } = require('./order-parameter.js');

const row = (pane, ts, text = 'x', role = 'assistant') => ({ pane, role, text, ts, line: ts });
const unit = (v) => { const n = Math.hypot(...v); return v.map((x) => x / n); };

test('a session breaks at a gap over the registered 60 minutes, and only for that pane', () => {
  const H = 3600e3;
  // the gap is measured from the PREVIOUS row, not from the session start (my first fixture got that wrong)
  const rows = [row('P', 0), row('P', 10), row('P', 10 + H + 1), row('Q', 20)];
  const s = sessionsOf(rows, H);
  assert.deepStrictEqual(s.map((x) => [x.pane, x.rows.length]), [['P', 2], ['P', 1], ['Q', 1]]);
});

test('the 60-minute boundary is inclusive, and it is pinned so it cannot drift', () => {
  const H = 3600e3;
  assert.strictEqual(sessionsOf([row('P', 0), row('P', H)], H).length, 1, 'exactly 60 minutes stays one session');
  assert.strictEqual(sessionsOf([row('P', 0), row('P', H + 1)], H).length, 2, 'one millisecond more splits it');
});

test('only assistant rows are contributions — the keeper and the chair are the field, not the flock', () => {
  const rows = [row('P', 0), row('P', 10, 'x', 'user'), row('P', 20)];
  const s = sessionsOf(rows, 3600e3);
  assert.strictEqual(s[0].rows.length, 2);
});

test('identical contributions give r = 1: perfect order is the top of the scale', () => {
  const v = unit([1, 1, 0]);
  const r = orderCurve([v, v, v, v]);
  assert.strictEqual(r.length, 3, 'r is defined from k=2');
  for (const x of r) assert.ok(Math.abs(x - 1) < 1e-12, `expected 1, got ${x}`);
});

test('orthogonal contributions give r = 0: no order at all', () => {
  const r = orderCurve([[1, 0, 0], [0, 1, 0]]);
  assert.strictEqual(r.length, 1);
  assert.ok(Math.abs(r[0]) < 1e-12, `expected 0, got ${r[0]}`);
});

test('the centroid is the RUNNING one: r_k compares k against 1..k-1, not against the whole session', () => {
  // Third contribution equals the first. Against the running centroid of {1,2} it is NOT 1; against the whole set it
  // would be pulled toward 1. This is the difference the instrument's name rests on.
  const a = [1, 0, 0], b = [0, 1, 0];
  const r = orderCurve([a, b, a]);
  assert.ok(Math.abs(r[0]) < 1e-12);
  assert.ok(Math.abs(r[1] - Math.SQRT1_2) < 1e-9, `expected cos 45°, got ${r[1]}`);
});

test('a drifting session shows a NEGATIVE slope, a converging one POSITIVE — the sign is the claim', () => {
  const conv = orderCurve([[1, 0, 0], [0, 1, 0], unit([1, 0.4, 0]), unit([1, 0.15, 0]), unit([1, 0.05, 0])]);
  const div = orderCurve([[1, 0, 0], unit([1, 0.05, 0]), unit([1, 0.4, 0]), [0, 1, 0]]);
  assert.ok(slope(conv) > 0, `converging slope should be > 0, got ${slope(conv)}`);
  assert.ok(slope(div) < 0, `diverging slope should be < 0, got ${slope(div)}`);
});

test('slope is undefined for a single point rather than 0 — a one-contribution session makes no claim', () => {
  assert.strictEqual(slope([0.5]), null);
  assert.strictEqual(slope([]), null);
});

test('quintileGap is last fifth minus first fifth, and it is null when there are too few points', () => {
  const rs = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
  assert.ok(Math.abs(quintileGap(rs) - 1) < 1e-12);
  assert.strictEqual(quintileGap([0.1, 0.2, 0.3, 0.4]), null, 'fewer than 5 points has no quintile');
});

test('classify applies the REGISTERED bars: climb needs a majority of positive slopes AND a gap over the between-session IQR', () => {
  // Three sessions climbing hard, one flat. Between-session IQR is small, so CLIMBS.
  const climbing = { slope: 0.01, gap: 0.30, mean: 0.5, n: 30 };
  const flat = { slope: -0.0001, gap: 0.001, mean: 0.51, n: 30 };
  const v = classify([climbing, climbing, climbing, flat]);
  assert.strictEqual(v.verdict, 'CLIMBS');
  assert.strictEqual(v.positiveSlopes, 3);
});

test('classify fires the falsifier when sessions are flat within but their means differ between', () => {
  const mk = (mean) => ({ slope: 0.00001, gap: 0.002, mean, n: 30 });
  const v = classify([mk(0.20), mk(0.45), mk(0.70), mk(0.95)]);
  assert.strictEqual(v.verdict, 'MEASURES THE TOPIC', v.why);
});

test('classify reports NEITHER rather than rounding to one of the two registered outcomes', () => {
  const mk = (slopeV, gap, mean) => ({ slope: slopeV, gap, mean, n: 30 });
  const v = classify([mk(0.01, 0.30, 0.3), mk(-0.01, -0.30, 0.9), mk(0.01, 0.02, 0.5), mk(-0.01, -0.02, 0.6)]);
  assert.strictEqual(v.verdict, 'NEITHER');
});

test('classify refuses to rule on fewer than 3 sessions instead of ruling on noise', () => {
  const v = classify([{ slope: 0.01, gap: 0.3, mean: 0.5, n: 30 }, { slope: 0.02, gap: 0.4, mean: 0.5, n: 30 }]);
  assert.strictEqual(v.verdict, 'NOT ENOUGH SESSIONS');
});

test('the 60-minute session gap is the DEFAULT, not only what a caller passes (mutant #2 survived without this)', () => {
  const { GAP_MS } = require('./order-parameter.js');
  assert.strictEqual(GAP_MS, 60 * 60 * 1000);
  const rows = [row('P', 0), row('P', 2 * 3600e3)];          // two hours apart
  assert.strictEqual(sessionsOf(rows).length, 2, 'the default gap must split a two-hour break');
});

test('a model file that is not T1\'s is refused BY HASH, before any library is loaded (mutant #12)', () => {
  const { checkEncoderFile } = require('./order-parameter.js');
  const os = require('node:os'), fsx = require('node:fs'), p = require('node:path');
  const deps = fsx.mkdtempSync(p.join(os.tmpdir(), 'op-enc-'));
  const dir = p.join(deps, 'models', 'Alibaba-NLP', 'gte-base-en-v1.5', 'onnx');
  fsx.mkdirSync(dir, { recursive: true });
  fsx.writeFileSync(p.join(dir, 'model_quantized.onnx'), 'not the frozen model');
  assert.throws(() => checkEncoderFile(deps), /does not hash to T1's frozen model/);
});

/* ---- the shuffle control: added AFTER run 1, post-hoc, and the confound was MEASURED before it was asserted.
 * My first fixture here claimed the artifact and did not find it — because it was over-concentrated, so the
 * centroid was already stable at k=2. The numbers below are measured over 200 i.i.d. replicates. ---- */

const { shuffleControl, shuffled, rng } = require('./order-parameter.js');

/** An i.i.d. session: every contribution from the SAME distribution, in no meaningful order at all. */
const iid = (n, D, spread, seed) => {
  const r = rng(seed); const out = [];
  for (let i = 0; i < n; i++) { const v = new Array(D); v[0] = 1;
    for (let d = 1; d < D; d++) v[d] = spread * (r() - 0.5); out.push(unit(v)); }
  return out;
};

test('shuffled() returns a permutation and never disturbs the caller\'s own order', () => {
  const src = [1, 2, 3, 4, 5, 6, 7, 8];
  const copy = [...src];
  const out = shuffled(src, rng(7));
  assert.deepStrictEqual(src, copy, 'the input must not be mutated: the real curve is computed from it');
  assert.deepStrictEqual([...out].sort((a, b) => a - b), copy, 'every element survives exactly once');
});

test('the control is reproducible from its seed — a control that moves each run controls nothing', () => {
  const v = iid(30, 32, 2, 11);
  assert.deepStrictEqual(shuffleControl(v, 5, 99), shuffleControl(v, 5, 99));
});

test('AN I.I.D. SESSION STILL CLIMBS at board-like dispersion: the confound the registered bars cannot see', () => {
  // 768 dims, mean r ~0.18: over 200 replicates the quintile gap of UNORDERED vectors averages +0.093.
  // Zero temporal structure, a rising curve — because the running centroid is a mean estimate that stops wobbling.
  let g = 0; const N = 30;
  for (let rep = 0; rep < N; rep++) g += quintileGap(orderCurve(iid(60, 768, 0.5, rep * 7 + 1)));
  assert.ok(g / N > 0.03, `unordered high-dimensional contributions still climb; got ${(g / N).toFixed(4)}`);
});

test('the artifact SHRINKS as the centroid stabilises early — which is why it must be controlled, not assumed', () => {
  let lo = 0, hi = 0; const N = 30;
  for (let rep = 0; rep < N; rep++) {
    lo += quintileGap(orderCurve(iid(60, 3, 0.5, rep * 7 + 1)));     // mean r ~0.98: nothing left to estimate
    hi += quintileGap(orderCurve(iid(60, 768, 0.5, rep * 7 + 1)));   // mean r ~0.18: everything left to estimate
  }
  assert.ok(hi / N > (lo / N) * 5, `the confound is regime-dependent: ${(lo / N).toFixed(4)} vs ${(hi / N).toFixed(4)}`);
});

test('a session that genuinely locks in beats its own shuffle; an i.i.d. one does not', () => {
  const rand = rng(4), lock = [];                    // wanders early, converges late: a real within-session lock
  for (let i = 0; i < 60; i++) { const w = 6 * (1 - i / 60); const v = new Array(64); v[0] = 1;
    for (let d = 1; d < 64; d++) v[d] = w * (rand() - 0.5); lock.push(unit(v)); }
  const lockReal = quintileGap(orderCurve(lock)), lockCtl = shuffleControl(lock, 20, 5).gap;
  assert.ok(lockReal > lockCtl, `a real lock must beat its shuffle: ${lockReal} vs ${lockCtl}`);
  const v = iid(60, 64, 2, 3);
  const real = quintileGap(orderCurve(v)), ctl = shuffleControl(v, 20, 5).gap;
  assert.ok(real < lockReal - lockCtl + ctl, `an i.i.d. session must not beat its shuffle the way a lock does: ${real} vs ${ctl}`);
});

/* ---- L061: THE SHUFFLE-REFUSAL GUARD ------------------------------------------------------------
 * Last night this tool printed a verdict that passed its registered bars by 0.0022 while its own
 * shuffle control — built, exported, tested, and defaulted to 0 — never ran, and C's i.i.d. measurement
 * puts the estimator artifact near +0.09 in this board's regime (`loop/l060_order_parameter_review_2026-09-20.md`,
 * `handback/p-order-parameter-C_2026-09-20.md` §9). The measurement is not what failed; naming a verdict
 * without the control that could invert it is. The gate below is one line of behaviour: no control, no verdict.
 * The numbers are untouched — the refusal is a gate, not a measurement. */
const { verdictReport, gateVerdict } = require('./order-parameter.js');

const ruled = () => classify([
  { slope: 1, gap: 0.5, mean: 0.5, n: 10 }, { slope: 1, gap: 0.5, mean: 0.5, n: 10 },
  { slope: 1, gap: 0.5, mean: 0.5, n: 10 }, { slope: 1, gap: 0.4, mean: 0.5, n: 10 },
]);

test('L061 · no shuffle control, no verdict: the ruling is withheld rather than printed', () => {
  const v = ruled();
  assert.ok(v.verdict === 'CLIMBS' || v.verdict === 'NEITHER', `premise: classify ruled ${v.verdict}`);
  const out = verdictReport(v, 0);
  assert.ok(!out.includes('VERDICT (registered bars)'), 'the verdict headline printed without its control');
  assert.ok(!out.includes(v.verdict), `the verdict "${v.verdict}" was named without its control`);
});

test('L061 · the refusal names the flag and the reason, so a re-runner is told what to DO', () => {
  const out = verdictReport(ruled(), 0);
  // Both assertions below were WIDENED after mutants #6 and #7 survived them: /--shuffles/ alone was satisfied by a
  // second mention of the flag inside the reason string, and /control/i by the word in the headline. A refusal owes
  // the ACTIONABLE line and the REASON, so each is now pinned to its own sentence.
  assert.match(out, /Re-run with --shuffles \d+/, 'the refusal must give the command that fixes it, with an n');
  assert.match(out, /Why: .*shuffled order/, 'the refusal must carry its reason, not merely the word control');
});

test('L061 · with the control run, the verdict prints exactly as it did before the gate', () => {
  const v = ruled();
  const out = verdictReport(v, 20);
  assert.match(out, /VERDICT \(registered bars\): /, 'the verdict headline must survive the gate');
  assert.ok(out.includes(v.verdict) && out.includes(v.why), 'the ruling and its reason must survive the gate');
  assert.ok(out.includes(v.medianQuintileGap.toFixed(4)), 'the measured numbers must survive the gate');
});

test('L061 · the withheld verdict keeps every measured number and withholds only the ruling', () => {
  const v = ruled();
  const g = gateVerdict(v, 0);
  assert.notStrictEqual(g.verdict, v.verdict, 'the ruling must not survive into the written record');
  for (const k of ['sessions', 'positiveSlopes', 'iqrOfSessionMeans', 'medianQuintileGap', 'meanOfSessionMeans']) {
    assert.strictEqual(g[k], v[k], `${k} is a measurement and must be untouched by the gate`);
  }
  assert.strictEqual(gateVerdict(v, 20), v, 'with the control run the verdict passes through unchanged');
});

test('L061 · main routes BOTH the printed verdict and the written one through the gate', () => {
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, 'order-parameter.js'), 'utf8');
  const body = src.slice(src.indexOf('async function main('));
  assert.match(body, /console\.log\(verdictReport\(/, 'the printed verdict must go through verdictReport');
  assert.match(body, /verdict: gateVerdict\(/, 'the written verdict must go through gateVerdict');
  assert.ok(!/console\.log\(`\nVERDICT \(registered bars\)/.test(body), 'no ungated verdict print may remain');
});
