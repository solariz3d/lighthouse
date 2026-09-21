/* vicsek-phi.test.js — the properties of phi, asserted rather than described.
 *
 * The first test is the one the packet says must never be discovered mid-run: phi is ORDER-INVARIANT. Everything
 * downstream — that its shuffle is a distribution control and not an order control — rests on it, so it is asserted
 * here on real-shaped data instead of being argued for in a comment.
 *
 *   node consonance/tools/vicsek-phi.test.js
 */
'use strict';
const assert = require('assert');
const test = require('node:test');
const V = require('./vicsek-phi.js');

/** A deterministic spread of unit vectors, so every test below is reproducible without the encoder. */
function sample(n, d, seed = 7) {
  const rand = V.rng(seed);
  const out = [];
  for (let i = 0; i < n; i++) out.push(V.randomUnit(d, rand));
  return out;
}

test('phi is ORDER-INVARIANT — the fact the whole control design rests on', () => {
  const vs = sample(40, 64, 11);
  const a = V.phi(vs);
  const rand = V.rng(99);
  const shuffled = vs.slice();
  for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t; }
  assert.notDeepStrictEqual(shuffled.map((v) => v[0]), vs.map((v) => v[0]), 'the shuffle did not move anything — the test proves nothing');
  assert.ok(Math.abs(V.phi(shuffled) - a) < 1e-12,
    `shuffling changed phi (${a} -> ${V.phi(shuffled)}): either the implementation is order-dependent or this ` +
    'test has stopped testing what it says');
});

test('perfect alignment reads 1, and a balanced pair reads 0', () => {
  const v = [0.6, 0.8];
  assert.ok(Math.abs(V.phi([v, v, v, v]) - 1) < 1e-15, 'identical directions must saturate at 1');
  assert.ok(V.phi([[1, 0], [-1, 0]]) < 1e-15, 'antipodal directions must cancel to 0');
  assert.ok(Math.abs(V.phi([[1, 0], [0, 1]]) - Math.SQRT1_2) < 1e-15, 'two orthogonal directions read 1/sqrt(2)');
});

test('magnitude is discarded: phi reads DIRECTIONS, not lengths', () => {
  const a = [[3, 0], [0, 5]];
  const b = [[1, 0], [0, 1]];
  assert.ok(Math.abs(V.phi(a) - V.phi(b)) < 1e-15,
    'scaling an input changed phi — the vectors are not being re-normalised, so this is a magnitude-weighted mean ' +
    'and not the Vicsek order parameter');
});

test('a zero vector is refused rather than averaged as a direction', () => {
  assert.throws(() => V.phi([[1, 0], [0, 0]]), /zero or non-finite/);
  assert.throws(() => V.phi([[1, 0], [Infinity, 0]]), /zero or non-finite/);
});

test('a dimension mismatch throws instead of silently truncating', () => {
  assert.throws(() => V.phi([[1, 0], [0, 1, 0]]), /dimension mismatch/);
});

test('N = 1 reads exactly 1, which is why the baseline matters', () => {
  assert.strictEqual(V.phi([[0, 1]]), 1);
  assert.strictEqual(V.baseline(1), 1);   // and its null is 1 too: a one-turn session says nothing at all
  assert.strictEqual(V.phi([]), null);
});

test('the null is c_d/sqrt(N), and c_d is 1 at the dimension this board uses', () => {
  // The registered null is 1/sqrt(N). The exact null carries a dimensional factor that is invisible at d = 768 and
  // real at d = 3, so the measurement is checked against the exact form and the registered form is checked to agree
  // where it is actually applied.
  for (const [n, d] of [[20, 3], [20, 64], [20, 768], [100, 64], [100, 768]]) {
    const got = V.nullPhi(n, d, 200, 4242 + n + d);
    const want = V.baselineExact(n, d);
    assert.ok(Math.abs(got - want) / want < 0.05,
      `null phi at N=${n}, d=${d} read ${got.toFixed(4)} against the exact c_d/sqrt(N) = ${want.toFixed(4)}`);
  }
  assert.ok(Math.abs(V.dimFactor(768) - 1) < 5e-4, 'c_768 must be 1 to within 0.05%: the registered null stands at d = 768');
  assert.ok(Math.abs(V.dimFactor(64) - 1) < 5e-3, 'c_64 is within 0.5% of 1');
  assert.ok(V.dimFactor(3) < 0.93 && V.dimFactor(3) > 0.91,
    'c_3 is ~0.921 — at d = 3 the disordered value sits ~8% BELOW 1/sqrt(N), which is why a low-d cell that reads ' +
    'closer to 1/sqrt(N) than that is evidence about the generator, not about phi');
});

test('the null keeps holding past N = 100, where the ruling\'s LCG table stopped', () => {
  // The ruling states its generator degraded past N ~ 100 (at N = 1000 it read 0.046-0.060 against 0.0316) and
  // quotes its table only that far. With a uniform-on-the-sphere generator the agreement must not degrade; if this
  // test fails, the degradation was never the generator and the 1/sqrt(N) form is wrong out there.
  for (const n of [200, 500, 1000]) {
    const got = V.nullPhi(n, 64, 200, 909 + n);
    const want = V.baselineExact(n, 64);
    assert.ok(Math.abs(got - want) / want < 0.08,
      `null phi at N=${n} read ${got.toFixed(4)} against ${want.toFixed(4)} — the c_d/sqrt(N) form does not hold here`);
  }
});

test('randomUnit really is a unit vector, in odd and even dimensions', () => {
  const rand = V.rng(5);
  for (const d of [3, 4, 63, 768]) {
    const v = V.randomUnit(d, rand);
    assert.strictEqual(v.length, d);
    assert.ok(Math.abs(V.norm(v) - 1) < 1e-12, `dimension ${d} produced a non-unit vector`);
  }
});

test('the pooled-draw control draws N without replacement and is seed-reproducible', () => {
  const pool = sample(300, 16, 3);
  const a = V.poolControl(pool, 25, 50, 12345);
  const b = V.poolControl(pool, 25, 50, 12345);
  assert.deepStrictEqual(a, b, 'the same seed gave a different control — it is not reproducible');
  const c = V.poolControl(pool, 25, 50, 999);
  assert.notStrictEqual(a.mean, c.mean, 'a different seed gave an identical mean — the draw is not random');
  assert.ok(a.p05 <= a.median && a.median <= a.p95, 'the control quantiles are out of order');
  // Drawing WITHOUT replacement from an unstructured pool must land near the same 1/sqrt(N) null.
  assert.ok(Math.abs(a.median - V.baseline(25)) / V.baseline(25) < 0.15,
    `pooled control median ${a.median.toFixed(4)} is far from 1/sqrt(25) = ${V.baseline(25).toFixed(4)}`);
  assert.strictEqual(V.poolControl(pool, 400, 10, 1), null, 'a draw larger than the pool must refuse, not repeat items');
});

test('a structured pool makes the control BITE — it is not a formality', () => {
  // Half the pool points one way: a session drawn from the pool inherits that, so the control's p95 rises well
  // above the structureless null. A session must beat THIS, not 1/sqrt(N), to be saying something about itself.
  const pool = sample(200, 16, 21);
  const axis = V.unit(Float64Array.from({ length: 16 }, (_, i) => (i === 0 ? 1 : 0.01)));
  for (let i = 0; i < 100; i++) pool.push(axis);
  const ctl = V.poolControl(pool, 20, 100, 77);
  assert.ok(ctl.median > 1.5 * V.baseline(20),
    `a pool with a shared direction should lift the control (median ${ctl.median.toFixed(4)} vs null ${V.baseline(20).toFixed(4)})`);
});

test('classify reads the registered prediction, and its bar is a parameter', () => {
  const below = [{ ratio: 0.8 }, { ratio: 0.9 }, { ratio: 1.0 }];
  const above = [{ ratio: 1.4 }, { ratio: 1.5 }, { ratio: 1.6 }];
  assert.match(V.classify(below).verdict, /AT OR BELOW THE NULL/);
  assert.match(V.classify(above).verdict, /ABOVE THE NULL/);
  assert.match(V.classify([{ ratio: 1.05 }, { ratio: 1.06 }, { ratio: 1.07 }]).verdict, /BETWEEN/);
  assert.strictEqual(V.classify(above, 2.0).verdict.startsWith('BETWEEN'), true, 'the material bar must be a parameter, not a literal');
  assert.strictEqual(V.classify([]).verdict, 'NO SESSIONS');
  assert.strictEqual(V.classify([{ ratio: null }, { ratio: NaN }]).verdict, 'NO SESSIONS', 'null ratios must not be counted as sessions');
});

test('the ratio is phi against the session\'s OWN N, which is the whole correction', () => {
  // Two sessions, equally unstructured, different lengths: raw phi differs by 2.2x, the ratio does not.
  const short = sample(20, 64, 31), long = sample(100, 64, 32);
  const rs = V.phi(short) / V.baseline(20), rl = V.phi(long) / V.baseline(100);
  assert.ok(V.phi(short) > 1.8 * V.phi(long), 'the raw phi of a short session should dwarf a long one on noise');
  assert.ok(Math.abs(rs - rl) < 0.35, `the corrected ratios should be comparable: ${rs.toFixed(3)} vs ${rl.toFixed(3)}`);
});

test('the same-era control never draws the session\'s own contributions', () => {
  // 30 vectors for one pane: 10 are the session (all pointing one way), 20 are era neighbours (another way).
  // If the control ever drew the session's own rows, its phi would be pulled toward the session's direction.
  const d = 16;
  const sessDir = V.unit(Float64Array.from({ length: d }, (_, i) => (i === 0 ? 1 : 0)));
  const eraDir = V.unit(Float64Array.from({ length: d }, (_, i) => (i === 1 ? 1 : 0)));
  const pool = [];
  for (let i = 0; i < 10; i++) pool.push({ pane: 'P', ts: 1000 + i, line: i, v: sessDir });
  for (let i = 0; i < 20; i++) pool.push({ pane: 'P', ts: 2000 + i, line: 100 + i, v: eraDir });
  const session = { pane: 'P', n: 10, t0: 1000, t1: 1009, lines: [0,1,2,3,4,5,6,7,8,9] };
  const c = V.eraControl(pool, session, 24, 20, 5);
  assert.strictEqual(c.eligible, true, 'a pool of 20 against N=10 must be eligible');
  assert.strictEqual(c.eraPool, 20, 'the session\'s own 10 rows must be excluded from its own control');
  assert.ok(Math.abs(c.median - 1) < 1e-9, 'every drawn vector is the era direction, so the control reads 1');
});

test('the same-era control refuses a pool smaller than N, and says why', () => {
  const v = V.unit(Float64Array.from({ length: 8 }, (_, i) => (i === 0 ? 1 : 0.1)));
  const pool = [];
  for (let i = 0; i < 5; i++) pool.push({ pane: 'P', ts: 1000 + i, line: i, v });
  for (let i = 0; i < 3; i++) pool.push({ pane: 'P', ts: 2000 + i, line: 50 + i, v });
  const c = V.eraControl(pool, { pane: 'P', n: 5, t0: 1000, t1: 1004, lines: [0,1,2,3,4] }, 24, 10, 1);
  assert.strictEqual(c.eligible, false, '3 era neighbours cannot supply a draw of 5');
  assert.strictEqual(c.eraPool, 3);
  assert.strictEqual(c.need, 5, 'the refusal must carry what it needed, so an UNTESTABLE cell can be audited');
});

test('the era window and the pane both bite', () => {
  const v = V.unit(Float64Array.from({ length: 8 }, (_, i) => (i === 0 ? 1 : 0.2)));
  const session = { pane: 'P', n: 2, t0: 0, t1: 0, lines: [0] };
  const other = (pane, ts, line) => ({ pane, ts, line, v });
  const far = [other('P', 25 * 3600e3, 1), other('P', 26 * 3600e3, 2), other('P', 27 * 3600e3, 3)];
  assert.strictEqual(V.eraControl(far, session, 24, 5, 1).eligible, false, 'contributions outside ±24h must not count');
  const wrongPane = [other('Q', 0, 1), other('Q', 1, 2), other('Q', 2, 3)];
  assert.strictEqual(V.eraControl(wrongPane, session, 24, 5, 1).eligible, false, 'another pane\'s contributions must not count');
  const ok = [other('P', 3600e3, 1), other('P', 2 * 3600e3, 2)];
  assert.strictEqual(V.eraControl(ok, session, 24, 5, 1).eligible, true);
});

// ── L062 R-C2: the --board default resolves through deference-unit.js boardDefault() ─────────────────────────────
// Both CLI checks stop before the encoder: --deps is an empty directory, and the universe block — which names the
// file read — is printed before loadEncoder runs. No models are needed, so these run on a machine without them.
const fsR = require('fs'), osR = require('os'), pathR = require('path');
const { spawnSync: spawnR } = require('child_process');
const tmpR = (tag) => fsR.mkdtempSync(pathR.join(osR.tmpdir(), 'rc2-vicsek-phi-' + tag + '-'));
const cliR = (args, env) => spawnR(process.execPath, [pathR.join(__dirname, 'vicsek-phi.js'), ...args],
  { encoding: 'utf8', env: Object.assign({}, process.env, env) });

test('R-C2 CLI: with no --board, vicsek-phi reads the RESOLVED board and prints that file first', () => {
  const data = tmpR('data');
  fsR.writeFileSync(pathR.join(data, 'board.jsonl'),
    JSON.stringify({ pane: 'P', role: 'assistant', text: 'one row', ts: Date.parse('2026-09-21T00:00:00Z') }) + '\n');
  const r = cliR(['--deps', tmpR('nodeps')], { CONSONANCE_DATA: data });
  assert.ok(r.stdout.includes(pathR.join(data, 'board.jsonl')), 'the universe must name the resolved file:\n' + r.stdout + r.stderr);
});

test('R-C2 CLI: with no --board and nothing to resolve, vicsek-phi REFUSES loudly and reads nothing', () => {
  const home = tmpR('home');
  const r = cliR(['--deps', tmpR('nodeps')], { CONSONANCE_DATA: '', USERPROFILE: home, HOME: home });
  assert.notStrictEqual(r.status, 0, 'a tool that cannot locate its board must not exit 0');
  assert.ok(/CONSONANCE_DATA/.test(r.stderr) && /\.consonance\.json/.test(r.stderr), 'the refusal must name both tiers:\n' + r.stderr);
  assert.ok(!/THE UNIVERSE FIRST/.test(r.stdout), 'nothing may be counted:\n' + r.stdout);
});
