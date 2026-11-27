// sim.js -- builder B. One vertical degree of freedom along the road normal.
// Plain Node, no dependencies. `node sim.js` prints a summary and writes results.json.
// Every modelling choice is tied to its source in README.md.
'use strict';
const fs = require('fs');
const path = require('path');

const G = 9.81, M = 850, H = 1 / 333;          // tick 333 Hz, car.ini TOTALMASS
const ERP = 0.8, BOUNCE = 0.1, BOUNCE_VEL = 0;  // road collision block; bounce threshold unknown -> 0
const BOX_H = 0.5, BOX_BOTTOM = 0.05;           // colliders.ini: SIZE y 0.5, CENTRE y 0.2 -> bottom 0.05 under CG
const K_TYRE = 4 * 270000;                      // tyres.ini RATE, four ray-cast tyres
const C_TYRE = 4 * 700;                         // tyres.ini DAMP
const R_TYRE = 0.395;
const KS = 80000, KS_END = 250000, GAP = 0.05;  // suspensions.ini coilover
const SPEED = 800 / 3.6, DF = 200 * SPEED;      // script.lua: 200 N per m/s; mid of 600..970 km/h
const RIGID_ERP = 0.2, RIGID_CFM = 1e-10;       // ODE world defaults, used for "rigid"

// script.lua:377-378: ray from CG+0.4 up, length 1.0; mult = clamp(remap(dist,0.5,0.9,1,0)); 0 on a miss
function suction(z) {
  const dist = z + 0.4;
  if (dist < 0 || dist > 1.0) return 0;
  return Math.min(1, Math.max(0, (0.9 - dist) / 0.4));
}

// ---- load sharing, calibrated on the two given points -------------------
// z = height of the centre of gravity above the road sheet.
// Stage 3 (coilover on its hard stop, tyres only): slope K_TYRE, through (z=0.05, 40 g).
// z_stop is where that line carries the 25 g load (less the suction not yet at full).
let Z_STOP = 0.17;
for (let i = 0; i < 50; i++) {
  const fStop = 25 * M * G - DF * (1 - suction(Z_STOP));
  Z_STOP = BOX_BOTTOM + (40 * M * G - fStop) / K_TYRE;
}
const F_STOP = 25 * M * G - DF * (1 - suction(Z_STOP));
const D_TYRE_STOP = F_STOP / K_TYRE;            // tyre deflection when the stops are reached
// Stage 2 (bump-stop zone, last GAP of coilover travel): (KS+KS_END) in series with the tyre.
const K2 = 4 * ((KS + KS_END) * 270000) / (KS + KS_END + 270000);
const W2 = GAP * (1 + (KS + KS_END) / 270000);
const SHARE2 = 270000 / (KS + KS_END + 270000);
// Stage 1 (free travel): KS in series with the tyre.
const K1 = 4 * (KS * 270000) / (KS + 270000);
const SHARE1 = 270000 / (KS + 270000);
const F_2 = F_STOP - K2 * W2;                   // force where stage 2 begins

function damper(vd) {                           // per wheel; vd>0 = bump. suspensions.ini DAMP_*
  if (vd >= 0) return vd < 0.2 ? 4000 * vd : 800 + 1000 * (vd - 0.2);
  const r = -vd; return -(r < 0.2 ? 3000 * r : 600 + 1000 * (r - 0.2));
}

// returns upward force from suspension + tyres. tyreMode 'B': lost once hub centre is under the sheet.
function suspForce(z, v, tyreMode) {
  let f;
  if (z <= Z_STOP) {
    const defl = D_TYRE_STOP + (Z_STOP - z);
    if (tyreMode === 'B' && defl >= R_TYRE) return 0;
    f = K_TYRE * defl - C_TYRE * v;
  } else if (z <= Z_STOP + W2) {
    f = F_STOP - K2 * (z - Z_STOP) + 4 * damper(-v * SHARE2);
  } else {
    f = F_2 - K1 * (z - Z_STOP - W2) + 4 * damper(-v * SHARE1);
  }
  return Math.max(0, f);
}

// ---- the box against the sheet, per collision_trimesh_box.cpp ------------
// d = how far the box bottom face is under the sheet. boxH = box height (extended variants).
// flip=true  (ODE as written): triangle-normal axis depth = d; box-face axis depth = boxH - d with the
//            normal reversed; the smaller wins, so past boxH/2 the contact pushes DOWN; none past boxH.
// flip=false (one-sided reading): normal always the road normal, depth = d.
function boxContact(d, boxH, flip) {
  if (d <= 0) return null;
  if (!flip) return { depth: d, s: +1 };
  if (d <= boxH / 2) return { depth: d, s: +1 };
  if (d < boxH) return { depth: boxH - d, s: -1 };
  return null;
}

function run(o) {
  const boxH = BOX_H + o.ext, bottom = BOX_BOTTOM + o.ext;
  const lead = 0.2, tPeak = lead + o.rise, tEnd = tPeak + o.hold;
  const loadG = t => t < lead ? 20 : t < tPeak ? 20 + (o.peak - 20) * (t - lead) / o.rise : o.peak;
  const ext = (z, t) => -(loadG(t) * M * G - DF * (1 - suction(z)));
  // settle at 20 g with the contact live (the extended box may already be on the road)
  let z = Z_STOP + W2 + 0.2, v = 0;
  const step = (t) => {
    const fo = ext(z, t) + suspForce(z, v, o.tyre);
    const c = boxContact(bottom - z, boxH, o.flip);
    let fc = 0;
    if (c) {
      let erp = ERP, cfm = o.cfm;
      if (o.rigid || c.depth > o.maxDepth) { erp = RIGID_ERP; cfm = RIGID_CFM; }
      const vn = c.s * v;
      let cc = erp * c.depth / H;                               // contact.cpp:142-155 (max_vel = inf)
      if (-vn > BOUNCE_VEL) cc = Math.max(cc, BOUNCE * -vn);    // contact.cpp:193-203
      // quickstep: (N/m + cfm/h) lambda = c/h - v_n/h - a_n, lambda >= 0, N identical rows
      const lam = Math.max(0, (cc / H - vn / H - c.s * fo / M) / (o.n / M + cfm / H));
      fc = c.s * o.n * lam;
    }
    v += H * (fo + fc) / M;
    z += H * v;
  };
  for (let i = 0; i < 3 * 333; i++) step(0);
  const r = { deepest: -Infinity, minGap: Infinity, rate011: null, flipT: null, outT: null, d15: null, vLate: 0 };
  let prevD = bottom - z;
  const nTicks = Math.round(tEnd / H);
  for (let i = 1; i <= nTicks; i++) {
    const t = i * H;
    step(t);
    const d = bottom - z;
    if (d > r.deepest) r.deepest = d;
    if (-d < r.minGap) r.minGap = -d;
    if (r.rate011 === null && prevD < 0.11 && d >= 0.11) r.rate011 = -v;
    if (r.flipT === null && d > boxH / 2) r.flipT = t - tPeak;
    if (r.outT === null && d >= boxH) r.outT = t - tPeak;
    if (r.d15 === null && t >= tPeak + 1.5) r.d15 = d;
    if (t > tEnd - 0.5 && Math.abs(v) > r.vLate) r.vLate = Math.abs(v);
    prevD = d;
    if (d > 3) break;
  }
  const dEnd = bottom - z;
  let outcome;
  if (o.flip) outcome = r.outT !== null ? 'THROUGH' : (dEnd > boxH / 2 ? 'INVERTED' : 'HOLDS');
  else outcome = r.outT !== null ? 'BURIED' : (r.deepest > boxH / 2 ? 'DEEP' : 'HOLDS');
  // BOUNCES = never through, but still moving faster than 0.1 m/s in the last 0.5 s of the hold
  if (outcome === 'HOLDS' && r.vLate > 0.1) outcome = 'BOUNCES';
  const f3 = x => x === null ? null : +x.toFixed(3);
  return {
    out: outcome, tThrough: o.flip && r.outT !== null ? f3(r.flipT) : null,
    rate011: f3(r.rate011), deepest: f3(r.deepest),
    minGap: r.deepest < 0 ? f3(r.minGap) : null, d15: f3(r.d15), dEnd: f3(dEnd), vLate: f3(r.vLate)
  };
}

const PEAKS = [40, 50, 55, 60, 65, 70, 80, 90], RISES = [0.05, 0.1, 0.2, 0.4, 0.8], CFMS = [0.0002, 0.00005];
const base = { n: 4, flip: true, tyre: 'B', ext: 0, maxDepth: 4, rigid: false, hold: 2 };
const cases = [];
for (const flip of [true, false]) for (const tyre of ['B', 'A']) for (const n of [1, 2, 4, 8])
  cases.push({ name: `base flip=${flip ? 1 : 0} tyre=${tyre} n=${n}`, flip, tyre, n });
for (const flip of [true, false]) for (const tyre of ['B', 'A']) {
  const tag = ` flip=${flip ? 1 : 0} tyre=${tyre} n=4`;
  cases.push({ name: 'v1 maxdepth=0.1' + tag, flip, tyre, maxDepth: 0.1 });
  cases.push({ name: 'v1 maxdepth=0.2' + tag, flip, tyre, maxDepth: 0.2 });
  cases.push({ name: 'v2 rigid' + tag, flip, tyre, rigid: true });
  cases.push({ name: 'v3 ext=0.25' + tag, flip, tyre, ext: 0.25 });
  cases.push({ name: 'v3 ext=0.5' + tag, flip, tyre, ext: 0.5 });
}

const results = { constants: { H, M, Z_STOP, F_STOP, D_TYRE_STOP, K1, K2, W2, K_TYRE, DF,
  kp: CFMS.map(c => ERP / (c * H)), kd: CFMS.map(c => (1 - ERP) / c),
  tyreLostAtBoxDepth: BOX_BOTTOM - (Z_STOP - (R_TYRE - D_TYRE_STOP)) }, runs: [] };
const cell = r => `${r.out === 'THROUGH' ? 'THRU@' + r.tThrough : r.out} ${r.rate011 === null ? '-' : r.rate011} ${r.deepest}`;
const summary = [];
for (const cs of cases) for (const cfm of CFMS) {
  const rows = [];
  for (const peak of PEAKS) {
    const row = [];
    for (const rise of RISES) {
      const r = run(Object.assign({}, base, cs, { cfm, peak, rise }));
      results.runs.push(Object.assign({ case: cs.name, cfm, peak, rise }, r));
      row.push(r);
    }
    rows.push(row);
  }
  const flat = rows.flat();
  const reach = flat.filter(r => r.rate011 !== null);
  const bad = x => x.out !== 'HOLDS' && x.out !== 'BOUNCES';
  const holdMax = Math.max(...reach.filter(r => !bad(r)).map(r => r.rate011), -Infinity);
  const thruMin = Math.min(...reach.filter(bad).map(r => r.rate011), Infinity);
  summary.push({ case: cs.name, cfm, notHolding: flat.filter(bad).length, bounces: flat.filter(x => x.out === 'BOUNCES').length, reach011: reach.length,
    maxDeepest: Math.max(...flat.map(r => r.deepest)), holdMaxRate: holdMax, failMinRate: thruMin });
  if (process.argv.includes('--tables') || cs.name === 'base flip=1 tyre=B n=4') {
    console.log(`\n## ${cs.name} cfm=${cfm}   cell = outcome, sink rate at 0.11 m (m/s), deepest (m; negative = gap)`);
    console.log('peak\\rise | ' + RISES.join(' | '));
    rows.forEach((row, i) => console.log(PEAKS[i] + ' g | ' + row.map(cell).join(' | ')));
  }
}
console.log('\nconstants', JSON.stringify(results.constants));
console.log('\ncase | cfm | runs through/deep of 40 | bounces | reach 0.11 | max deepest | max rate@0.11 of holders | min rate@0.11 of non-holders');
for (const s of summary) console.log(`${s.case} | ${s.cfm} | ${s.notHolding} | ${s.bounces} | ${s.reach011} | ${s.maxDeepest} | ${s.holdMaxRate} | ${s.failMinRate}`);
results.summary = summary;
fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(results));
