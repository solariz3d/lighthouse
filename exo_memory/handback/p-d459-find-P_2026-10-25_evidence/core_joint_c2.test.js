// core_joint_c2.test.js: node --test test/core_joint_c2.test.js      (T180_TREE=<worktree> runs it from outside the tree)
// D459 (the keeper, 2026-10-25 15:47 on TEST 10 at local-0.4.19: "there is still a bump its not smooth"; plan_test10_bump_d459). GEOMETRY tier, written RED first.
// The joint between a piece that HOLDS a cross-section channel and a piece that RAMPS it is C1 today and not C2: extend.js blends a target in with the Bloss
// cubic S(u) = 3u² − 2u³ (extend.js `bloss`), whose slope is 0 at both ends but whose second derivative is 6·Δ/L² there. So the roll (bank), the cup and the
// edge angles all arrive with a STEP in their curvature along s at the ramp's start and at its end. Under a wheel 8.4 m from the centre a roll-curvature step
// of Δφ'' is a vertical-curvature step of 8.4·Δφ'': on TEST 10 that is 15 °/100 m at every 30° bank onset (1.8 g at 300 km/h), 20 °/100 m where the 35° right
// edge begins (2.5 g), and 10 °/100 m at the lap seam where the closer's 15° cup comes home over 40 m (1.2 g) — the figures of D436 §7 and D459 (jnt459c2.out,
// kstep419.out), measured again here on public words laid the way his were. Rows:
//   1  a 30° bank reached over 100 m (his p2): the roll's second derivative is continuous at the ramp's start and at its end. RED before: 0 -> 0.0178 deg/m²
//      at the start and 0.0178 -> 0 at the end (6·30°/100² exactly); 15 °/100 m at the wheel line
//   2  a 15° cup brought home to 0 over 40 m (the closer's fade at his seam): the cup's second derivative is continuous at both ends. RED before: 0.056 deg/m²
//   3  a 30° edge brought to 0 over 50 m (his p10): the edge angle's second derivative is continuous at both ends. RED before: 0.072 deg/m²
//   4  a 35° right edge reached over 50 m (his p11): the right edge's second derivative is continuous at both ends. RED before: 0.084 deg/m²
//   5  (control, green today and must stay green) at the same joints every channel's VALUE and SLOPE are continuous: the fix is a C2 ease, not a looser C1
// The second derivative is read from document.js valuesAt by one-sided second differences over H = 0.5 m at a piece's end and at the next piece's start; a
// Bloss ramp's figure is exact to 4 digits that way, and a C2 ease (one whose second derivative is 0 at both ends) reads 0.000 to the tolerance below.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const T = process.env.T180_TREE ? path.resolve(process.env.T180_TREE) : path.join(__dirname, '..');
const D = require(path.join(T, 'src/core/document.js'));
const { extend } = require(path.join(T, 'src/core/extend.js'));

const DEG = Math.PI / 180, H = 0.5;
const TOL_D2 = 1e-3;     // deg/m² (phi read in degrees): a Bloss ramp reads 18 to 84 times this on his words; a C2 ease reads 0 to rounding
const TOL_V = 1e-6, TOL_M = 1e-4, H1 = 1e-3;   // the C1 that holds today: value (deg) exact to 1e-6; the slope over H1 = 1 mm (a Bloss end slope reads f''·H1/2 ~ 1e-5 deg/m that way, under the 1e-4 bar)

const inDeg = (ch, x) => (ch === 'phi' ? x / DEG : x);
const at = (P, ch, s) => inDeg(ch, D.valuesAt(P, Math.max(0, Math.min(P.length, s)))[ch]);
/** value, slope and second derivative of a channel at a piece's END (one-sided, over H) */
const endOf = (P, ch) => { const L = P.length, a = at(P, ch, L - 2 * H), b = at(P, ch, L - H), c = at(P, ch, L); return { v: c, m: (c - b) / H, d2: (c - 2 * b + a) / (H * H) }; };
/** the same at a piece's START */
const startOf = (P, ch) => { const a = at(P, ch, 0), b = at(P, ch, H), c = at(P, ch, 2 * H); return { v: a, m: (b - a) / H, d2: (c - 2 * b + a) / (H * H) }; };
const joint = (doc, k) => [doc.pieces[k], doc.pieces[k + 1]];

/** a straight, then a piece ramping `ch` to `target` over `L` m, then a straight that holds it: the two joints a ramp has */
const ramp = (ch, target, L, first) => {
  let d = extend(D.createDoc('c2'), { length: 100, ...(first ? { first } : {}) });
  d = extend(d, { length: L, targets: { [ch]: target } });
  d = extend(d, { length: 100 });
  return d;
};
const c2Step = (doc, k, ch) => { const [A, B] = joint(doc, k); return Math.abs(startOf(B, ch).d2 - endOf(A, ch).d2); };
const c1Step = (doc, k, ch) => { const [A, B] = joint(doc, k); const L = A.length; const va = at(A, ch, L), ma = (va - at(A, ch, L - H1)) / H1, vb = at(B, ch, 0), mb = (at(B, ch, H1) - vb) / H1; return { dv: Math.abs(vb - va), dm: Math.abs(mb - ma) }; };

test('row 1: a bank reached over 100 m is C2 at the ramp\'s start and end (the roll\'s curvature along s does not step)', () => {
  const d = ramp('phi', 30 * DEG, 100);
  const s0 = c2Step(d, 0, 'phi'), s1 = c2Step(d, 1, 'phi');
  const wheel = (x) => (8.4 * x * DEG * 100 / DEG).toFixed(2);   // 8.4 m × Δφ'' as a vertical curvature, deg/100 m
  assert.ok(s0 <= TOL_D2, `at the ramp's start the roll's second derivative steps by ${s0.toFixed(4)} deg/m² (${wheel(s0)} deg/100 m under a wheel 8.4 m out); the bar is ${TOL_D2}`);
  assert.ok(s1 <= TOL_D2, `at the ramp's end the roll's second derivative steps by ${s1.toFixed(4)} deg/m² (${wheel(s1)} deg/100 m under a wheel 8.4 m out); the bar is ${TOL_D2}`);
});

test('row 2: a 15° cup brought home to 0 over 40 m is C2 at both ends of the fade', () => {
  let d = extend(D.createDoc('c2'), { length: 100, first: { c: 15 } });
  d = extend(d, { length: 40, targets: { c: 0 } });
  d = extend(d, { length: 100 });
  const s0 = c2Step(d, 0, 'c'), s1 = c2Step(d, 1, 'c');
  assert.ok(s0 <= TOL_D2, `at the fade's start the cup's second derivative steps by ${s0.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
  assert.ok(s1 <= TOL_D2, `at the fade's end the cup's second derivative steps by ${s1.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
});

test('row 3: a 30° edge brought to 0 over 50 m is C2 at both ends', () => {
  let d = extend(D.createDoc('c2'), { length: 100, first: { e: 30 } });
  d = extend(d, { length: 50, targets: { e: 0 } });
  d = extend(d, { length: 100 });
  const s0 = c2Step(d, 0, 'e'), s1 = c2Step(d, 1, 'e');
  assert.ok(s0 <= TOL_D2, `at the ramp's start the edge angle's second derivative steps by ${s0.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
  assert.ok(s1 <= TOL_D2, `at the ramp's end the edge angle's second derivative steps by ${s1.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
});

test('row 4: a 35° right edge reached over 50 m is C2 at both ends', () => {
  const d = ramp('er', 35, 50);
  const s0 = c2Step(d, 0, 'er'), s1 = c2Step(d, 1, 'er');
  assert.ok(s0 <= TOL_D2, `at the ramp's start the right edge's second derivative steps by ${s0.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
  assert.ok(s1 <= TOL_D2, `at the ramp's end the right edge's second derivative steps by ${s1.toFixed(4)} deg/m²; the bar is ${TOL_D2}`);
});

test('row 5 (control): at every one of those joints the channel\'s value and slope are continuous (the C1 that holds today stays)', () => {
  const cases = [['phi', ramp('phi', 30 * DEG, 100)], ['er', ramp('er', 35, 50)]];
  { let d = extend(D.createDoc('c2'), { length: 100, first: { c: 15 } }); d = extend(d, { length: 40, targets: { c: 0 } }); d = extend(d, { length: 100 }); cases.push(['c', d]); }
  { let d = extend(D.createDoc('c2'), { length: 100, first: { e: 30 } }); d = extend(d, { length: 50, targets: { e: 0 } }); d = extend(d, { length: 100 }); cases.push(['e', d]); }
  for (const [ch, d] of cases) for (const k of [0, 1]) {
    const { dv, dm } = c1Step(d, k, ch);
    assert.ok(dv <= TOL_V, `${ch} value steps by ${dv} at joint ${k}`);
    assert.ok(dm <= TOL_M, `${ch} slope steps by ${dm} per m at joint ${k}`);
  }
});
