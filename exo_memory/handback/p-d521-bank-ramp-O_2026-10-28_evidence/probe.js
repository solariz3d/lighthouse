// probe.js (D521 Part 1, O): a 100 m straight, then a 200 m piece turning 90° left and banked INTO the turn (30° or 45°), the way the panel sends it:
// the turn as a corner (the default: turnDeg, extendCorner) or as a rate (a kh target), and the "at start" ticks as the panel's transition map
// (min(20, length) per ticked channel with a target; panel.js:85). Read on the core's own path (adapter.js toPath), as bankrate.cjs reads a road.
//   T180_TREE=<worktree> node probe.js
'use strict';
const path = require('path');
const T = process.env.T180_TREE;
const D = require(path.join(T, 'src/core/document.js'));
const { extend } = require(path.join(T, 'src/core/extend.js'));
const { extendCorner } = require(path.join(T, 'src/core/turnby.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js'));
const DEG = Math.PI / 180, STRAIGHT = 100, LEN = 200, TURN = 90;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };

function build({ bank, mode, bankTick, turnTick }) {
  let d = extend(D.createDoc('d521'), { length: STRAIGHT });
  const phi = -bank * DEG;   // INTO a left turn: the left (inner) side down (document.js: phi + = left side up); checked below on the normal
  const transition = {};
  if (bankTick) transition.phi = Math.min(20, LEN);
  if (mode === 'rate') {
    const opts = { length: LEN, targets: { phi, kh: (TURN * DEG) / LEN } };
    if (turnTick) transition.kh = Math.min(20, LEN);
    if (Object.keys(transition).length) opts.transition = transition;
    d = extend(d, opts);
  } else {
    const opts = { length: LEN, targets: { phi }, turnDeg: TURN };
    if (Object.keys(transition).length) opts.transition = transition;
    d = extendCorner(d, opts);
  }
  return d;
}

function measure(d) {
  const { path: P } = toPath(d, { step: 0.5 });
  const pc = d.pieces[1], rows = [];
  for (const m of P.samples) {
    if (m.s < STRAIGHT - 20 || m.s > STRAIGHT + LEN) continue;
    // the roll as bankrate.cjs: the road normal U against the gravity frame of the forward T
    const f = unit(m.T), Lg = unit(cr([0, 1, 0], f)), Ug = cr(f, Lg), roll = Math.atan2(dot(m.U, Lg), dot(m.U, Ug)) / DEG;
    const local = Math.max(0, m.s - STRAIGHT), v = m.s < STRAIGHT ? D.valuesAt(d.pieces[0], m.s) : D.valuesAt(pc, Math.min(pc.length, local));
    const hw = v.w / 2, inner = m.pos.map((x, k) => x + hw * m.L[k]);   // the turn is LEFT: the inner edge is +L (the chord edge, w/2 along the section's L)
    rows.push({ s: m.s, roll, kh: v.kh, phi: v.phi / DEG, y: inner[1], yc: m.pos[1], nL: dot(m.U, Lg) });
  }
  const rate = []; for (let i = 1; i < rows.length; i++) { const ds = rows[i].s - rows[i - 1].s; if (ds > 0) rate.push({ s: rows[i].s, r: Math.abs(rows[i].roll - rows[i - 1].roll) / ds }); }
  const peak = rate.reduce((a, b) => (b.r > a.r ? b : a), { r: 0 });
  const half = (key, end) => { const t = rows.find((r) => Math.abs(r[key]) >= Math.abs(end) / 2); return t ? t.s - STRAIGHT : NaN; };
  const endPhi = rows[rows.length - 1].phi, khMax = Math.max(...rows.map((r) => Math.abs(r.kh)));
  // the inner edge over the straight's last 20 m and the turn's first 60 m: its height, its grade, the grade's change per 2 m (the "fold"), y'' at 1 m
  const win = rows.filter((r) => r.s >= STRAIGHT - 10 && r.s <= STRAIGHT + 60), at = (s) => { const r = rows.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)); return r.y; };
  let d2max = { v: 0, s: 0 }, gradeJump = { v: 0, s: 0 };
  for (const r of win) {
    const s = r.s, d2 = (at(s + 1) - 2 * at(s) + at(s - 1)) / 1, g1 = Math.atan(at(s) - at(s - 1)) / DEG, g2 = Math.atan(at(s + 1) - at(s)) / DEG;
    if (Math.abs(d2) > Math.abs(d2max.v)) d2max = { v: d2, s }; if (Math.abs(g2 - g1) > Math.abs(gradeJump.v)) gradeJump = { v: g2 - g1, s };
  }
  const drop = (s) => at(STRAIGHT + s) - at(STRAIGHT);   // the inner edge's fall from the joint
  return { peak, s50bank: half('phi', endPhi), s50turn: half('kh', khMax), khMax, endPhi, nLend: rows[rows.length - 1].nL, d2max, gradeJump, drop10: drop(10), drop20: drop(20), drop40: drop(40), drop60: drop(60) };
}

const f = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : '-');
console.log('case                          | peak roll rate °/m (at s from joint) | bank 50% at | turn 50% at | lag m | inner edge: drop at 10/20/40/60 m | edge y″ max 1/m (at) | edge grade step per m ° (at) | into turn');
for (const bank of [30, 45]) for (const mode of ['corner', 'rate']) for (const bankTick of [false, true]) for (const turnTick of mode === 'rate' ? [false, true] : [false]) {
  const c = { bank, mode, bankTick, turnTick }; let d;
  try { d = build(c); } catch (e) { console.log(`${bank}° ${mode} bank-tick ${bankTick} turn-tick ${turnTick}: REFUSED ${e.code || e.message}`); continue; }
  const m = measure(d);
  const name = `${bank}° ${mode.padEnd(6)} bank ${bankTick ? 'tick' : 'whole'} turn ${mode === 'rate' ? (turnTick ? 'tick' : 'whole') : '(corner)'}`;
  console.log(`${name.padEnd(30)}| ${f(m.peak.r)} (${f(m.peak.s - STRAIGHT, 1)})`.padEnd(70) + `| ${f(m.s50bank, 1)} | ${f(m.s50turn, 1)} | ${f(m.s50turn - m.s50bank, 1)} | ${f(m.drop10, 2)} / ${f(m.drop20, 2)} / ${f(m.drop40, 2)} / ${f(m.drop60, 2)} m | ${f(m.d2max.v, 4)} (${f(m.d2max.s - STRAIGHT, 1)}) | ${f(m.gradeJump.v, 2)} (${f(m.gradeJump.s - STRAIGHT, 1)}) | ${m.nLend > 0 ? 'yes' : 'NO'}`);
}
console.log('reference (04a §3, vocab.js BANK_RATE): real tracks p50 0.254, p90 0.849, p99 2.205 °/m');
