// usage: node regen.js <checkout> <save> [label]
// VARIANT 4 as a REGENERATE of a saved track, measured. Two parts, alone and together, laid on the real segments (k0 k1 kp0 kp1 at each segment's ends) and built
// with the real buildPath OPEN (a closed lap that misses its start by over 1 mm does not build), with the adapter's own offsetPath:
//   'sized'  : THE WRITER. A turn (kh) or climb (kv) laid as a SHORT START RAMP (it changes only in its first 30 m or tenth of the piece, then holds: what Extend
//              lays for a ticked "early" turn or climb, AT_START_M = 20 m, app/core/panel.js:59) is re-laid as the C2 quintic 6u⁵ − 15u⁴ + 10u³ from its start value
//              to its held value over R* = max(20 m, SPREAD · |Δκ| / K_BAR), at most half the piece: the quintic peaks at 1.875 · Δ/R, so SPREAD = 2.35 keeps the
//              curvature's rate under the bar (load changing at most 3 g over 10 m at 170 m/s) with a quarter to spare. Its start rate is the piece's own (0 after a hold).
//   'carry'  : THE BUILD. turnplan.js carryChannel: the curvature's rate carried through every joint (Catmull-Rom between the neighbours' middles, limited), each
//              half of a piece a quintic from its middle to the joint. Applied to the pieces 'sized' does not re-lay.
//   'sized+carry' : both.
// Reported, against the build as it is: feel.js's joint measure (centre U and L jerk at each joint against mid-piece, counts over 1× and 2×, the worst), the route
// (the centre line's largest move anywhere, the end heading, the lap's closure gap), the overshoot of every re-laid half or ramp, and the direct rows (vert.js's
// measure, no split) at p10–p14's joints, p32|p33 (his screenshot's) and p33|p34.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js')), { buildPath } = require(path.join(R, 'src/geom/path.js'));
const { carryChannel, K_BAR } = require('./turnplan.js');
const doc = D.parse(fs.readFileSync(save, 'utf8'));
const V = 170, G = 9.80665, UP = [0, 1, 0], SPREAD = 2.35, AT_START_M = 20;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], norm = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };
const smoother = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * u * (u * (6 * u - 15) + 10));
// a short start ramp: the channel changes only in its first min(30 m, a tenth of the piece), then is constant
function startRamp(P, ch) {
  let mx = 0; for (let s = 0; s <= P.length; s += 0.5) mx = Math.max(mx, Math.abs(D.channelAt(P, ch, s).d1)); if (mx < 1e-12) return null;
  let last = 0; for (let s = 0; s <= P.length; s += 0.5) if (Math.abs(D.channelAt(P, ch, s).d1) > 0.01 * mx) last = s;
  if (last > Math.min(30, P.length / 10)) return null;
  const v0 = D.channelAt(P, ch, 0).v, v1 = D.channelAt(P, ch, P.length).v; if (Math.abs(v1 - v0) < 1e-9) return null;
  const Rs = Math.min(P.length / 2, Math.max(AT_START_M, (SPREAD * Math.abs(v1 - v0)) / K_BAR));
  return { v0, v1, was: last, R: Rs, fn: (s) => v0 + (v1 - v0) * smoother(s / Rs) };
}
function lay(mode, rep) {
  const segs = A.toSegments(doc).map((g) => ({ ...g })); if (mode === 'none') return segs;
  const plan = {};
  for (const ch of ['kh', 'kv']) {
    const sized = doc.pieces.map((P) => (mode.includes('sized') && P.type === 'road' && !P.tube ? startRamp(P, ch) : null));
    const carried = mode.includes('carry') ? carryChannel(R, doc, ch, { report: rep }) : doc.pieces.map(() => null);
    plan[ch] = doc.pieces.map((P, i) => (sized[i] ? sized[i].fn : carried[i]));
    if (rep) sized.forEach((x, i) => { if (x) rep.push({ ch, piece: doc.pieces[i].id, sized: true, was: x.was, R: x.R, dk: x.v1 - x.v0, overshoot: 0 }); });
  }
  const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
  for (const g of segs) { const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1); if (g.kind !== 'road') continue;
    if (plan.kh[i]) { g.k0 = plan.kh[i](s0); g.k1 = plan.kh[i](s1); } if (plan.kv[i]) { g.kp0 = plan.kv[i](s0); g.kp1 = plan.kv[i](s1); } }
  return segs;
}
const build = (segs) => A.offsetPath(doc, segs, buildPath(segs, { step: 0.5, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } })).samples;
let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
function measure(S) {
  const ds = S[1].s - S[0].s, N = S.length, idx = (s) => Math.max(2, Math.min(N - 3, Math.round(s / ds)));
  const all = S.map((x) => ({ s: x.s, U: (V * V * dot(x.kvec, x.U)) / G + x.U[1], L: (V * V * dot(x.kvec, x.L)) / G + x.L[1], vert: Math.abs(dot(norm(x.T), UP)) > Math.cos(8 * Math.PI / 180) }));
  const jerk = (i, k, skipVert) => { const a = all[i - 2], b = all[i + 2]; if (skipVert && (a.vert || b.vert || all[i].vert)) return 0; return Math.abs((b[k] - a[k]) / (b.s - a.s)) * V; };
  const peak = (s0, s1, k, sv) => { let m = 0, at = 0; for (let i = idx(s0); i <= idx(s1); i++) { const j = jerk(i, k, sv); if (j > m) { m = j; at = all[i].s; } } return { m, at }; };
  const rows = [];
  for (let k = 0; k + 1 < pc.length; k++) { const A_ = pc[k], B_ = pc[k + 1]; if (A_.p.type !== 'road' || B_.p.type !== 'road' || A_.p.tube || B_.p.tube) continue; const j = A_.b, r = { id: `${A_.p.id}|${B_.p.id}`, joint: j };
    for (const key of ['U', 'L']) for (const sv of [true, false]) { const at = peak(j - 15, j + 15, key, sv), mid = Math.max(...[A_, B_].map((p) => (p.p.length > 80 ? peak(p.a + 30, p.b - 30, key, sv).m : 0)), 1e-6); r[key + (sv ? '' : 'd')] = { at: at.m, where: at.at - j, mid, ratio: at.m / mid }; }
    rows.push(r); }
  return rows;
}
const base = build(lay('none')), rb = measure(base), heading = (x) => Math.atan2(x.T[0], x.T[2]);
const CALL = ['p10|p11', 'p11|p12', 'p12|p13', 'p13|p14', 'p14|p15', 'p32|p33', 'p33|p34'];
const out = [];
for (const mode of ['none', 'sized', 'carry', 'sized+carry']) {
  const rep = [], S = mode === 'none' ? base : build(lay(mode, rep)), rows = mode === 'none' ? rb : measure(S);
  const u1 = rows.filter((r) => r.U.ratio > 1).length, u2 = rows.filter((r) => r.U.ratio > 2).length, l1 = rows.filter((r) => r.L.ratio > 1).length, l2 = rows.filter((r) => r.L.ratio > 2).length;
  const wU = Math.max(...rows.map((r) => r.U.at)), wL = Math.max(...rows.map((r) => r.L.at));
  let move = 0; for (let i = 0; i < Math.min(S.length, base.length); i++) move = Math.max(move, Math.hypot(...S[i].pos.map((v, k) => v - base[i].pos[k])));
  const e1 = S[S.length - 1], e0 = base[base.length - 1], gap = Math.hypot(...e1.pos.map((v, k) => v - S[0].pos[k]));
  const dh = ((heading(e1) - heading(e0) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  const os = rep.length ? Math.max(...rep.map((w) => w.overshoot)) : 0, nSized = rep.filter((w) => w.sized).length, nHalves = rep.filter((w) => !w.sized).length;
  out.push(`${label} ${mode}: joints U>mid ${u1} (>2× ${u2}), L>mid ${l1} (>2× ${l2}); worst joint jerk U ${wU.toFixed(1)} g/s, L ${wL.toFixed(1)} g/s | route: largest centre-line move ${move.toFixed(3)} m, end heading ${(dh * 180 / Math.PI).toFixed(4)}°, lap closure gap ${gap.toFixed(4)} m | start ramps re-laid ${nSized}, carried halves ${nHalves}, largest overshoot ${(os * 100).toFixed(1)}%`);
  for (const id of CALL) { const r = rows.find((x) => x.id === id); if (r) out.push(`    ${id} (s ${r.joint.toFixed(0)}): U jerk ${r.Ud.at.toFixed(0)} g/s at ${r.Ud.where.toFixed(0)} m, mid ${r.Ud.mid.toFixed(0)} (${r.Ud.ratio.toFixed(1)}×); L ${r.Ld.at.toFixed(0)} at ${r.Ld.where.toFixed(0)} m, mid ${r.Ld.mid.toFixed(0)} (${r.Ld.ratio.toFixed(1)}×)`); }
  if (mode === 'sized') for (const w of rep.filter((x) => x.sized && ['p32', 'p33', 'p34'].includes(x.piece))) out.push(`    re-laid ${w.piece} ${w.ch}: Δκ ${w.dk.toExponential(3)}, its ramp ${w.was.toFixed(1)} m as saved → ${w.R.toFixed(1)} m`);
}
console.log(out.join('\n'));
