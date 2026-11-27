'use strict';
// simC: one-vertical-DOF (plus hub) tick simulation of a car's floor box pressed into a soft ODE contact.
// Every modelling choice is tied to its source in README.md. Run: node sim.js
const fs = require('fs'), path = require('path');

const H = 1 / 333, G = 9.81;
const M_TOTAL = 850, M_U = 4 * 30, M_B = M_TOTAL - M_U;      // car.ini TOTALMASS; suspensions.ini HUB_MASS 20 + BODY_0_MASS 10 per corner
const KT = 4 * 270000, CT = 4 * 700, R_TYRE = 0.395;          // tyres.ini RATE, DAMP, RADIUS
const KS = 4 * 80000, KBUMP = 4 * 250000;                     // suspensions.ini RATE, END_RATE
const X_STOP = 1.4 - 0.9, X_BUMP = X_STOP - 0.05;             // MAX_LENGTH - MIN_LENGTH, BUMPSTOP_GAP
const BOX_H = 0.5, CG_ABOVE_BOTTOM = 0.05;                    // colliders.ini
const SOFT_ERP = 0.8, BOUNCE = 0.1, BOUNCE_VEL = 0.1;         // surfaces block; BOUNCE_VEL is my assumption
const RIGID = { a: { erp: 0.2, cfm: 1e-5 }, b: { erp: 0.8, cfm: 0 } }; // a: ODE world defaults (objects.cpp:37,40); b: soft ERP kept, no CFM

function lut(kmh) { // ctrl_susp_lf.ini
  const p = [[0, 0], [100, 80], [200, 300], [400, 800], [600, 1800], [1000, 4500]];
  for (let i = 1; i < p.length; i++) if (kmh <= p[i][0]) return p[i - 1][1] + (p[i][1] - p[i - 1][1]) * (kmh - p[i - 1][0]) / (p[i][0] - p[i - 1][0]);
  return 4500;
}
function damper(xd) { // per corner x4; suspensions.ini DAMP_*
  if (xd >= 0) return 4 * (xd <= 0.2 ? 4000 * xd : 800 + 1000 * (xd - 0.2));
  return 4 * (xd >= -0.2 ? 3000 * xd : -600 + 1000 * (xd + 0.2));
}
function calib(kmh) { // geometry fixed so that the box bottom is AT the road in static balance at 40 g (given fact)
  const v = kmh / 3.6, df = 200 * v;
  const zh40 = R_TYRE - (M_TOTAL * 40 * G + df) / KT; // hub height at 40 g, suspension on its stops
  return { sDroop: zh40 - X_STOP, zh40 };
}
const CAL = calib(800);

function run(o) {
  // o: cfm, n, read ('flip'|'oneSided'), peakG, rise, kmh, maxDepth, rigidAll, rigidKind, extDn, extUp, tyreLoss
  const v = o.kmh / 3.6, P = 4 * lut(o.kmh), sDroop = CAL.sDroop;
  const boxH = BOX_H + o.extDn + o.extUp;
  let zb = 0.25, zh = 0.2, vb = 0, vh = 0, locked = false;
  const SETTLE = 3, HOLD = 2;
  const r = { out: null, tThru: null, v011: null, deep: 0, minGap: Infinity, z15: null, touched: false, settleFlip: false };
  const tail = [];
  const nTicks = Math.round((SETTLE + o.rise + HOLD) / H);
  for (let i = 0; i < nTicks; i++) {
    const t = i * H - SETTLE;
    const g = G * (t <= 0 ? 20 : t >= o.rise ? o.peakG : 20 + (o.peakG - 20) * t / o.rise);
    // downforce: script.lua 377-384. ray from CG + 0.4 up, down 1.0; -1 (miss) gives 0
    const sensor = zb + CG_ABOVE_BOTTOM + 0.4;
    const mult = (sensor < 0 || sensor > 1) ? 0 : Math.min(1, Math.max(0, (0.9 - sensor) / 0.4));
    const DF = 200 * v * mult;
    // tyres (ray casts, linear rate)
    const dl = R_TYRE - zh;
    let Ft = dl > 0 ? Math.max(0, KT * dl - CT * vh) : 0;
    if (o.tyreLoss && zh < 0) Ft = 0;
    // contact geometry: collision_trimesh_box.cpp, flat box over flat sheet
    const bottom = zb - o.extDn, d = -bottom;
    let sign = 0, depth = 0;
    if (d > 0 && d < boxH) {
      if (o.read === 'flip' && d > boxH / 2) { sign = -1; depth = boxH - d; } else { sign = 1; depth = d; }
    }
    if (t < 0 && sign < 0) r.settleFlip = true;
    let erp = SOFT_ERP, cfm = o.cfm;
    if (o.rigidAll || depth > o.maxDepth) { erp = RIGID[o.rigidKind].erp; cfm = RIGID[o.rigidKind].cfm; }
    const solve = (vstar, vpre, m) => { // one normal row per point, n identical rows: dxJointContact::getInfo2 + (1/m + cfm/h) lambda = c/h - v*/h
      if (!sign) return 0;
      let c = erp * depth / H;
      const incoming = -sign * vpre;
      if (incoming > BOUNCE_VEL && BOUNCE * incoming > c) c = BOUNCE * incoming;
      return Math.max(0, (c - sign * vstar) / (H / m + cfm / o.n));
    };
    if (!locked) {
      const x = (zh - zb) - sDroop, xd = vh - vb;
      const Fs = x > 0 ? KS * x + P + (x > X_BUMP ? KBUMP * (x - X_BUMP) : 0) + damper(xd) : 0;
      vh += H * ((Ft - Fs) / M_U - g);
      const vstar = vb + H * ((Fs - DF) / M_B - g);
      const L = solve(vstar, vb, M_B);
      vb = vstar + sign * H * L / M_B;
      zb += H * vb; zh += H * vh;
      if ((zh - zb) - sDroop >= X_STOP && vh - vb > 0) { // MIN_LENGTH reached: inelastic lock
        const vc = (M_B * vb + M_U * vh) / M_TOTAL; vb = vh = vc; zh = zb + sDroop + X_STOP; locked = true;
      }
    } else {
      const Fs0 = KS * X_STOP + P + KBUMP * (X_STOP - X_BUMP);
      const vstar = vb + H * ((Ft - DF) / M_TOTAL - g);
      const L = solve(vstar, vb, M_TOTAL);
      const vn = vstar + sign * H * L / M_TOTAL;
      const a = (vn - vb) / H;
      const S = M_B * a - (Fs0 - DF - M_B * g + sign * L); // force the stop puts on the body; must push up
      vb = vh = vn; zb += H * vn; zh += H * vn;
      if (S < 0) locked = false;
    }
    if (t < 0) continue;
    const b2 = zb - o.extDn, d2 = -b2;
    if (d2 > 0) r.touched = true;
    if (b2 < r.minGap) r.minGap = b2;
    if (d2 > r.deep) r.deep = d2;
    if (r.v011 === null && b2 < -0.11) r.v011 = -vb;
    const lim = o.read === 'flip' ? boxH / 2 : boxH;
    if (r.tThru === null && d2 > lim) r.tThru = t - o.rise;
    if (r.z15 === null && t >= o.rise + 1.5) r.z15 = b2;
    if (t >= o.rise + HOLD - 0.5) tail.push(b2);
    if (zb < -3) break;
  }
  const endBottom = zb - o.extDn;
  // once past the limit the contact pushes the box on (flip) or is gone (oneSided): that is THROUGH.
  // 'back' marks runs that my linear tyre springs later threw back up from under the road (an artefact, see README).
  if (r.tThru !== null) { r.out = 'THROUGH'; r.back = -endBottom <= boxH / 2; }
  else {
    const span = Math.max(...tail) - Math.min(...tail);
    r.out = span < 0.002 ? 'HOLDS' : 'OSCILLATES';
    r.span = span;
  }
  if (r.z15 === null) r.z15 = endBottom;
  return r;
}

const LOADS = [40, 50, 55, 60, 65, 70, 80, 90], RISES = [0.05, 0.1, 0.2, 0.4, 0.8], CFMS = [0.0002, 0.00005];
const VARIANTS = {
  base: {}, 'md0.1': { maxDepth: 0.1 }, 'md0.2': { maxDepth: 0.2 }, 'md0.1b': { maxDepth: 0.1, rigidKind: 'b' }, 'md0.2b': { maxDepth: 0.2, rigidKind: 'b' },
  rigid: { rigidAll: true }, rigidb: { rigidAll: true, rigidKind: 'b' },
  'extDn0.25': { extDn: 0.25 }, 'extDn0.5': { extDn: 0.5 }, 'extUp0.25': { extUp: 0.25 }, 'extUp0.5': { extUp: 0.5 },
};
const DEF = { kmh: 800, maxDepth: 4, rigidAll: false, rigidKind: 'a', extDn: 0, extUp: 0, tyreLoss: false };
const f3 = x => x === null || x === undefined ? null : Math.round(x * 1000) / 1000;
const rows = [];
function sweep(extra, tag, keep) {
  const out = [];
  for (const peakG of LOADS) for (const rise of RISES) {
    const r = run(Object.assign({}, DEF, extra, { peakG, rise }));
    const rec = { cfm: extra.cfm, var: tag, read: extra.read, n: extra.n, g: peakG, rise, out: r.out, tThru: f3(r.tThru), v011: f3(r.v011), deep: r.out === 'THROUGH' ? null : f3(r.deep), minGap: r.touched ? null : f3(r.minGap), z15: f3(r.z15) };
    if (r.settleFlip) rec.settleFlip = true;
    if (r.back) rec.back = true;
    out.push(rec); if (keep) rows.push(rec);
  }
  return out;
}
function cell(r) {
  const o = r.out === 'HOLDS' ? 'H' : r.out === 'THROUGH' ? 'T@' + r.tThru : 'O';
  const s = r.v011 === null ? '-' : r.v011.toFixed(2);
  const dp = r.out === 'THROUGH' ? 'thru' : r.minGap !== null ? 'gap ' + r.minGap.toFixed(3) : r.deep.toFixed(3);
  return `${o} / ${s} / ${dp}`;
}
function table(rs, title) {
  console.log(`\n${title}\n| peak g | ` + RISES.map(x => x + ' s').join(' | ') + ' |\n|---|' + RISES.map(() => '---').join('|') + '|');
  for (const g of LOADS) console.log(`| ${g} | ` + RISES.map(ri => cell(rs.find(r => r.g === g && r.rise === ri))).join(' | ') + ' |');
}
function tally(rs) {
  const c = {}; rs.forEach(r => c[r.out] = (c[r.out] || 0) + 1);
  const hold = rs.filter(r => r.out !== 'THROUGH' && r.v011 !== null).map(r => r.v011), thr = rs.filter(r => r.out === 'THROUGH' && r.v011 !== null).map(r => r.v011);
  const deepHold = Math.max(0, ...rs.filter(r => r.deep !== null).map(r => r.deep));
  return { c, maxHoldV011: hold.length ? Math.max(...hold) : null, minThruV011: thr.length ? Math.min(...thr) : null, reach011: hold.length + thr.length, deepHold, settleFlip: rs.some(r => r.settleFlip) };
}

console.log('simC. tick 1/333 s. calibration: sDroop=' + CAL.sDroop.toFixed(4) + ' hub height at 40 g=' + CAL.zh40.toFixed(4));
for (const cfm of CFMS) {
  const kp = SOFT_ERP / (H * cfm), kd = (1 - SOFT_ERP) / cfm;
  console.log(`SOFT_CFM ${cfm}: per contact row kp=${kp.toFixed(0)} N/m kd=${kd.toFixed(0)} N s/m`);
}
// stop load implied by the files, at three speeds (check against the given 25 g)
for (const kmh of [600, 800, 970]) console.log(`files-only stop load at ${kmh} km/h: ${(((KS * X_STOP + KBUMP * 0.05 + 4 * lut(kmh)) - 200 * kmh / 3.6) / M_B / G).toFixed(2)} g`);

const summary = [];
for (const [tag, vx] of Object.entries(VARIANTS)) for (const cfm of CFMS) for (const read of ['flip', 'oneSided']) for (const n of [1, 10]) {
  const rs = sweep(Object.assign({ cfm, read, n }, vx), tag, true);
  const t = tally(rs);
  summary.push({ var: tag, cfm, read, n, ...t });
  if (tag === 'base' && read === 'flip') table(rs, `### base, SOFT_CFM ${cfm}, n=${n} contact rows, reading flip. cell = outcome / sink rate at 0.11 m (m/s) / deepest (m)`);
  if (tag === 'base' && read === 'oneSided' && n === 1) table(rs, `### base, SOFT_CFM ${cfm}, n=1, reading oneSided`);
}
console.log('\n### variant summary (40 runs each): var cfm read n | counts | max sink@0.11 among non-through | min sink@0.11 among through | deepest non-through | flipped while settling');
for (const s of summary) console.log(`${s.var} ${s.cfm} ${s.read} n=${s.n} | ${JSON.stringify(s.c)} | ${s.maxHoldV011} | ${s.minThruV011} | ${f3(s.deepHold)} | ${s.settleFlip}`);

// sensitivities on base (not kept in results.json rows; kept as summary)
const sens = [];
console.log('\n### sensitivities, base, reading flip: label cfm | counts | max hold v011 | min thru v011 | deepest non-through');
for (const cfm of CFMS) {
  const S = [];
  for (const n of [1, 2, 3, 4, 6, 10, 20]) S.push(['n=' + n, { n, read: 'flip' }]);
  for (const kmh of [600, 970]) for (const n of [1, 10]) S.push([`kmh=${kmh},n=${n}`, { n, read: 'flip', kmh }]);
  for (const n of [1, 10]) S.push([`tyreLoss,n=${n}`, { n, read: 'flip', tyreLoss: true }]);
  for (const [label, ex] of S) {
    const t = tally(sweep(Object.assign({ cfm }, ex), 'sens', false));
    sens.push({ label, cfm, ...t });
    console.log(`${label} ${cfm} | ${JSON.stringify(t.c)} | ${t.maxHoldV011} | ${t.minThruV011} | ${f3(t.deepHold)}`);
  }
}
// the asked case: 65 g on 0.00005, position 1.5 s into the hold
console.log('\n### 65 g, SOFT_CFM 0.00005, base, 1.5 s into the hold: bottom height above road (m; negative = below)');
for (const n of [1, 10]) for (const read of ['flip', 'oneSided']) console.log(`n=${n} ${read}: ` + rows.filter(r => r.var === 'base' && r.cfm === 0.00005 && r.n === n && r.read === read && r.g === 65).map(r => `${r.rise}s:${r.out} ${r.z15}`).join('  '));

fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify({ tick: H, calib: CAL, fields: 'cfm,var,read,n,g(peak),rise(s),out,tThru(s after peak),v011(m/s sink at 0.11 m),deep(m),minGap(m, if never touched),z15(bottom height 1.5 s into hold)', summary, sens, runs: rows }));
console.log('\nwrote results.json, runs=' + rows.length);
