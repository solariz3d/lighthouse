// Builder A: 1-DOF tick-by-tick model of the T-180 floor box pressed into a soft ODE road sheet.
// Plain Node, no dependencies. `node sim.js` prints a summary and writes results.json.
// Every modelling choice is sourced in README.md.
'use strict';
const fs = require('fs');
const path = require('path');

const HZ = 333, h = 1 / HZ;           // physics tick (given)
const M = 850, G0 = 9.81;             // car.ini TOTALMASS
const MG = M * G0;
const BOX_H = 0.5;                    // colliders.ini SIZE y
// wheels: tyres.ini RATE, suspensions.ini RATE / END_RATE / BUMPSTOP_GAP / DAMP_*
const KT = 4 * 270000;                // four tyres, N/m
const KS = 80000, KE = 250000, GAP = 0.05;
const K_BUMP = 4 * ((KS + KE) * 270000) / (KS + KE + 270000);   // body rate, bump stop engaged
const K_FREE = 4 * (KS * 270000) / (KS + 270000);               // body rate, spring alone
const R_BUMP = 270000 / (KS + KE + 270000);                      // share of body travel taken by the coilover
const R_FREE = 270000 / (KS + 270000);
const F25 = 25 * MG, F40 = 40 * MG;   // the two measured points (given)
const Z_STOP = (F40 - F25) / KT;      // box clearance when the suspension goes solid
const B_BUMP = 4 * (KS + KE) * GAP / K_BUMP; // body travel across the bump-stop zone
const HUB0 = 0.395 - F40 / KT;        // hub height above the road when the box touches (linear tyre)
const SPEED = 800 / 3.6, DF_G = 200 * SPEED / MG; // script.lua downforce at 800 km/h, in g

function damperForce(vs) {            // one corner, vs = coilover speed (+ = compressing)
  const a = Math.abs(vs);
  if (vs > 0) return a <= 0.2 ? 4000 * a : 4000 * 0.2 + 1000 * (a - 0.2);
  return -(a <= 0.2 ? 3000 * a : 3000 * 0.2 + 1000 * (a - 0.2));
}
// z = height of the ORIGINAL box bottom above the road (negative = under it), v = dz/dt
function wheelForce(z, v, o) {
  if (o.wheelsLost && z < -HUB0) return 0;        // reading W2: hub under the one-sided sheet, ray misses
  let F;
  if (z <= Z_STOP) F = F25 + KT * (Z_STOP - z) - 4 * 700 * v;
  else if (z <= Z_STOP + B_BUMP) F = F25 - K_BUMP * (z - Z_STOP) + 4 * damperForce(-v * R_BUMP) * R_BUMP - 4 * 700 * v * (1 - R_BUMP);
  else F = F25 - K_BUMP * B_BUMP - K_FREE * (z - Z_STOP - B_BUMP) + 4 * damperForce(-v * R_FREE) * R_FREE - 4 * 700 * v * (1 - R_FREE);
  return Math.max(0, F);
}
function suction(z) {                 // script.lua: ray from 0.4 above car position, 1.0 long
  const d = z + 0.05 + 0.4;           // car position taken as the centre of gravity
  if (d < 0 || d > 1.0) return 0;     // origin under the sheet, or no hit: -1 -> 0
  return Math.min(1, Math.max(0, (0.9 - d) / 0.4));
}

// One run. o: cfm, erp, n (contact rows), flip (ODE normal reversal past half height),
// maxDepth, rigid, extend, wheelsLost, hardErp, peak, rise
function run(o) {
  const H = BOX_H + o.extend;
  let z = Z_STOP + (F25 - 20 * MG) / K_BUMP, v = 0;   // wheel-only equilibrium at 20 g
  const settle = 1.5, tPeak = settle + o.rise, tEnd = tPeak + 2.0;
  const r = { cross011: null, deepest: -Infinity, minGap: Infinity, through: null, at15: null };
  let touched = false, flipped = false, lastHalf = [];
  for (let k = 0, t = 0; t < tEnd; k++, t = k * h) {
    const g = t < settle ? 20 : t < tPeak ? 20 + (o.peak - 20) * (t - settle) / o.rise : o.peak;
    const Fext = -MG * (g - DF_G * (1 - suction(z))) + wheelForce(z, v, o);
    let vFree = v + h * Fext / M, vNew = vFree;
    const p = -(z - o.extend);                         // penetration of the collider's bottom face
    if (p > 0 && p < H) {
      touched = true;
      const down = o.flip && p > H / 2;                // collision_trimesh_box.cpp: box-face axis wins, normal reverses
      const depth = down ? H - p : p, s = down ? -1 : 1;
      flipped = flipped || down;
      const hard = o.rigid || depth > o.maxDepth;
      const cfm = hard ? 0 : o.cfm, erp = hard ? o.hardErp : o.erp;
      let c = erp * depth / h;                         // contact.cpp: pushout = k*depth, k = fps*erp
      const incoming = -s * v;
      if (incoming > 0 && o.bounce * incoming > c) c = o.bounce * incoming;
      const lam = Math.max(0, (c - s * vFree) / (cfm + h * o.n / M)); // per row, N
      vNew = vFree + s * h * o.n * lam / M;
    }
    const zPrev = z;
    v = vNew; z += h * v;
    const pp = -(z - o.extend), ppPrev = -(zPrev - o.extend);
    if (r.cross011 === null && ppPrev < 0.11 && pp >= 0.11) r.cross011 = -v;
    if (pp > r.deepest) r.deepest = pp;
    if (!touched && z - o.extend < r.minGap) r.minGap = z - o.extend;
    if (o.peak === 65 && r.at15 === null && t >= tPeak + 1.5) r.at15 = z - o.extend;
    if (t > tEnd - 0.5) lastHalf.push(z);
    if (pp >= H) { r.through = t - tPeak; break; }     // top face under the sheet: no contact left
  }
  const amp = lastHalf.length ? Math.max(...lastHalf) - Math.min(...lastHalf) : null;
  const rd = x => x === null || !isFinite(x) ? null : Math.round(x * 1e4) / 1e4;
  return {
    peak: o.peak, rise: o.rise,
    outcome: r.through !== null ? 'THROUGH' : 'HOLDS',
    tThrough: rd(r.through), flipped,
    settled: r.through === null ? amp < 0.005 : null,
    sink011: rd(r.cross011), deepest: touched ? rd(r.deepest) : null,
    minGap: touched ? null : rd(r.minGap), gapAt65_1p5: rd(r.at15),
  };
}

const PEAKS = [40, 50, 55, 60, 65, 70, 80, 90], RISES = [0.05, 0.1, 0.2, 0.4, 0.8];
const BASE = { erp: 0.8, n: 4, flip: true, maxDepth: 4, rigid: false, extend: 0, wheelsLost: false, hardErp: 0.2, bounce: 0.1 };
function sweep(over) {
  const out = [];
  for (const peak of PEAKS) for (const rise of RISES) out.push(run(Object.assign({}, BASE, over, { peak, rise })));
  return out;
}
function threshold(rows) {            // is there one sink rate at 0.11 m that splits holds from throughs?
  const hs = rows.filter(r => r.outcome === 'HOLDS' && r.sink011 !== null).map(r => r.sink011);
  const ts = rows.filter(r => r.outcome === 'THROUGH' && r.sink011 !== null).map(r => r.sink011);
  const maxHold = hs.length ? Math.max(...hs) : null, minThrough = ts.length ? Math.min(...ts) : null;
  return { reach: hs.length + ts.length, holdsReaching: hs.length, through: ts.length, maxHoldSink: maxHold, minThroughSink: minThrough,
    clean: maxHold !== null && minThrough !== null ? maxHold < minThrough : null };
}
function lowestThrough(rows) { const t = rows.filter(r => r.outcome === 'THROUGH'); return t.length ? Math.min(...t.map(r => r.peak)) : null; }
function cell(r) {
  const s = r.sink011 === null ? 'nr' : r.sink011.toFixed(2);
  const d = r.deepest === null ? 'gap ' + r.minGap.toFixed(3) : r.deepest.toFixed(3);
  return (r.outcome === 'THROUGH' ? 'T@' + r.tThrough.toFixed(2) : r.settled ? 'H' : 'H~') + ' ' + s + ' ' + d;
}
function table(title, rows) {
  console.log('\n' + title + '   cell = outcome, sink m/s at 0.11 (nr = not reached), deepest m');
  console.log('peak g | ' + RISES.map(x => ('rise ' + x + ' s').padEnd(18)).join('| '));
  for (const pk of PEAKS) console.log(String(pk).padEnd(6) + ' | ' + RISES.map(rs => cell(rows.find(r => r.peak === pk && r.rise === rs)).padEnd(18)).join('| '));
}

const results = { constants: { h, M, KT, K_BUMP, K_FREE, Z_STOP, B_BUMP, HUB0, DF_G }, contact: {}, sweeps: {}, summary: [] };
console.log('constants', JSON.stringify(results.constants));
for (const cfm of [0.0002, 0.00005]) {
  const kp = 0.8 / (h * cfm), kv = 1 / cfm, kd = (1 - 0.8) / cfm;
  results.contact[cfm] = { kpPerRow: kp, velCoeffPerRow: kv, kdManualPerRow: kd };
  console.log(`SOFT_CFM ${cfm}: per row kp=${kp.toExponential(3)} N/m, 1/cfm=${kv} N s/m (manual kd=${kd}); n=4: ${(4 * kp).toExponential(3)} N/m, ${4 * kv} N s/m`);
}
function add(name, over, show) {
  const rows = sweep(over);
  results.sweeps[name] = rows;
  const s = { name, through: rows.filter(r => r.outcome === 'THROUGH').length, of: rows.length, lowestThroughPeak: lowestThrough(rows),
    unsettledHolds: rows.filter(r => r.outcome === 'HOLDS' && !r.settled).length, flippedHolds: rows.filter(r => r.outcome === 'HOLDS' && r.flipped).length,
    maxDeepestHold: Math.max(...rows.filter(r => r.outcome === 'HOLDS').map(r => r.deepest === null ? -1 : r.deepest)), thr: threshold(rows) };
  results.summary.push(s);
  if (show) table(name, rows);
  return rows;
}
const CF = [0.0002, 0.00005];
for (const cfm of CF) add(`base cfm=${cfm} n=4 flip wheels-kept`, { cfm }, true);
// readings and sensitivities
for (const cfm of CF) for (const n of [1, 2, 4, 8]) for (const flip of [true, false]) for (const wheelsLost of [false, true]) {
  if (n === 4 && flip && !wheelsLost) continue;
  add(`alt cfm=${cfm} n=${n} ${flip ? 'flip' : 'noflip'} ${wheelsLost ? 'wheels-lost' : 'wheels-kept'}`, { cfm, n, flip, wheelsLost }, n === 1 && flip && !wheelsLost);
}
// variants, on the baseline (n=4) and on the softest reading (n=1), both wheel readings
for (const cfm of CF) for (const n of [4, 1]) for (const wheelsLost of [false, true]) {
  const tag = `cfm=${cfm} n=${n} ${wheelsLost ? 'wheels-lost' : 'wheels-kept'}`;
  for (const maxDepth of [0.1, 0.2]) add(`v1 MAX_DEPTH=${maxDepth} ${tag}`, { cfm, n, wheelsLost, maxDepth });
  add(`v2 rigid ${tag}`, { cfm, n, wheelsLost, rigid: true });
  for (const extend of [0.25, 0.5]) add(`v3 extend=${extend} ${tag}`, { cfm, n, wheelsLost, extend });
}
console.log('\nSUMMARY  name | through/40 | lowest peak g through | unsettled holds | deepest among holds | sink@0.11: max hold, min through, clean split');
for (const s of results.summary) console.log(`${s.name.padEnd(52)} | ${String(s.through).padStart(2)}/${s.of} | ${String(s.lowestThroughPeak).padEnd(4)} | ${s.unsettledHolds} (flipped-yet-held ${s.flippedHolds}) | ${s.maxDeepestHold} | ${s.thr.maxHoldSink}, ${s.thr.minThroughSink}, ${s.thr.clean}`);
console.log('\n65 g at 1.5 s into the hold, cfm 0.00005 baseline: box-bottom height above road (m) by rise time');
console.log(results.sweeps['base cfm=0.00005 n=4 flip wheels-kept'].filter(r => r.peak === 65).map(r => `${r.rise}s: ${r.gapAt65_1p5} (${r.outcome})`).join('; '));
fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(results, null, 0));
console.log('\nwrote results.json');
