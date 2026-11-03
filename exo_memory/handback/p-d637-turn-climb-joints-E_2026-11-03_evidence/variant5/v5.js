// usage: node v5.js <checkout> <save> [label]
// VARIANT 5 (the chair's 14:27, his "why cant you figure out how to do it the same way banking was"): a CENTRED ramp, as a build-time reading of a saved track
// (the save is not rewritten: the built k0 k1 kp0 kp1 of each segment are laid from it, as the bank's carry and corners are). Every short START ramp of a turn
// (kh) or climb (kv), as regen.js finds them (a change only in the piece's first min(30 m, tenth), then held), keeps its AREA CENTRE
//   c = ∫ (v1 − κ) / (v1 − v0) ds over the ramp (where a step of the same size would put the same area: so the turn's or climb's integral, the heading or pitch
//   after it, is unchanged EXACTLY)
// and becomes the C2 quintic 6u⁵ − 15u⁴ + 10u³ from v0 to v1 over [c − w, c + w], w = R*/2, R* = max(20 m, SPREAD · |Δκ| / K_BAR) with SPREAD 3 (the writer's
// measured spread), at most half the piece. Where c − w < 0 it reaches BACK into the previous road piece's tail, which must hold v0 there (to 1e-9): w shrinks to
// what the flat tail allows (and to c + the piece's half), and a ramp whose previous piece is not road, or a tube, is not widened past its own start.
// The quintic is monotone and symmetric about c, so nothing overshoots and the area is kept (to the sampling of the integral).
// Reported: the joint table (feel.js's counts and worst, and p10–p14, p32|p33, p33|p34 measured directly), the route (largest centre-line move, end heading,
// closure gap), the overshoot, and for p33 ALONE (the piece placed next): how far back into p32 its ramp reaches and how far p32's end (the joint) moves.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js')), { buildPath } = require(path.join(R, 'src/geom/path.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8'));
const K_BAR = 29.4 / (10 * 170 * 170), SPREAD = 3, V = 170, G = 9.80665, UP = [0, 1, 0];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], norm = (a) => { const n = Math.hypot(...a); return a.map((x) => x / n); };
const smoother = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * u * (u * (6 * u - 15) + 10));
const road = (P) => P && P.type === 'road' && !P.tube;
function startRamp(P, ch) {
  let mx = 0; for (let s = 0; s <= P.length; s += 0.5) mx = Math.max(mx, Math.abs(D.channelAt(P, ch, s).d1)); if (mx < 1e-12) return null;
  let last = 0; for (let s = 0; s <= P.length; s += 0.5) if (Math.abs(D.channelAt(P, ch, s).d1) > 0.01 * mx) last = s;
  if (last > Math.min(30, P.length / 10)) return null;
  const v0 = D.channelAt(P, ch, 0).v, v1 = D.channelAt(P, ch, P.length).v; if (Math.abs(v1 - v0) < 1e-9) return null;
  const end = Math.min(P.length, last + 2); let c = 0; const n = 4000; for (let k = 0; k < n; k++) { const s = ((k + 0.5) / n) * end; c += ((v1 - D.channelAt(P, ch, s).v) / (v1 - v0)) * (end / n); }
  return { v0, v1, c, end };
}
// the plan: per piece and channel, a function of s on that piece, or null
function plan(only) {
  const out = { kh: doc.pieces.map(() => null), kv: doc.pieces.map(() => null) }, rep = [];
  doc.pieces.forEach((P, i) => {
    if (!road(P) || (only && P.id !== only)) return;
    for (const ch of ['kh', 'kv']) {
      const r = startRamp(P, ch); if (!r) continue;
      let w = Math.min(P.length / 2, Math.max(20, (SPREAD * Math.abs(r.v1 - r.v0)) / K_BAR)) / 2;
      const prev = doc.pieces[i - 1];
      let back = 0;   // how far the flat tail of the previous piece reaches back, at v0
      if (road(prev) && !prev.tube) { for (let t = 0; t <= prev.length; t += 0.5) { if (Math.abs(D.channelAt(prev, ch, prev.length - t).v - r.v0) > 1e-9) break; back = t; } }
      w = Math.max(r.c, Math.min(w, r.c + back, P.length / 2));   // never narrower than its own centre allows, never past the flat tail
      const f = (x) => r.v0 + (r.v1 - r.v0) * smoother((x - (r.c - w)) / (2 * w));   // x from this piece's start (negative: the previous piece's tail)
      const own = out[ch][i]; out[ch][i] = (s) => (s <= r.c + w ? f(s) : (own ? own(s) : D.channelAt(P, ch, s).v));
      if (r.c - w < 0 && prev) { const L = prev.length, prevOwn = out[ch][i - 1]; out[ch][i - 1] = (s) => (s >= L + (r.c - w) ? f(s - L) : (prevOwn ? prevOwn(s) : D.channelAt(prev, ch, s).v)); }
      rep.push({ piece: P.id, ch, c: r.c, was: r.end, w, reachBack: Math.max(0, w - r.c), dk: r.v1 - r.v0 });
    }
  });
  return { out, rep };
}
function lay(p) {
  const segs = A.toSegments(doc).map((g) => ({ ...g })); if (!p) return segs;
  const idx = new Map(doc.pieces.map((P, i) => [P.id, i])), off = new Map();
  for (const g of segs) { const i = idx.get(g.id), s0 = off.get(g.id) || 0, s1 = s0 + g.length; off.set(g.id, s1); if (g.kind !== 'road') continue;
    if (p.kh[i]) { g.k0 = p.kh[i](s0); g.k1 = p.kh[i](s1); } if (p.kv[i]) { g.kp0 = p.kv[i](s0); g.kp1 = p.kv[i](s1); } }
  return segs;
}
const build = (segs) => A.offsetPath(doc, segs, buildPath(segs, { step: 0.5, closed: false, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } })).samples;
let o = 0; const pc = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
function measure(S) {
  const ds = S[1].s - S[0].s, N = S.length, idx = (s) => Math.max(2, Math.min(N - 3, Math.round(s / ds)));
  const all = S.map((x) => ({ s: x.s, U: (V * V * dot(x.kvec, x.U)) / G + x.U[1], L: (V * V * dot(x.kvec, x.L)) / G + x.L[1], vert: Math.abs(dot(norm(x.T), UP)) > Math.cos(8 * Math.PI / 180) }));
  const jerk = (i, k, sv) => { const a = all[i - 2], b = all[i + 2]; if (sv && (a.vert || b.vert || all[i].vert)) return 0; return Math.abs((b[k] - a[k]) / (b.s - a.s)) * V; };
  const peak = (s0, s1, k, sv) => { let m = 0, at = 0; for (let i = idx(s0); i <= idx(s1); i++) { const j = jerk(i, k, sv); if (j > m) { m = j; at = all[i].s; } } return { m, at }; };
  const rows = [];
  for (let k = 0; k + 1 < pc.length; k++) { const A_ = pc[k], B_ = pc[k + 1]; if (!road(A_.p) || !road(B_.p)) continue; const j = A_.b, r = { id: `${A_.p.id}|${B_.p.id}`, joint: j };
    for (const key of ['U', 'L']) for (const sv of [true, false]) { const at = peak(j - 40, j + 40, key, sv), mid = Math.max(...[A_, B_].map((p) => (p.p.length > 80 ? peak(p.a + 40, p.b - 40, key, sv).m : 0)), 1e-6); r[key + (sv ? '' : 'd')] = { at: at.m, where: at.at - j, mid, ratio: at.m / mid }; }
    rows.push(r); }
  return rows;
}
const heading = (x) => Math.atan2(x.T[0], x.T[2]), base = build(lay(null)), CALL = ['p10|p11', 'p11|p12', 'p12|p13', 'p13|p14', 'p14|p15', 'p32|p33', 'p33|p34'];
for (const [name, only] of [['as built', undefined], ['centred (all 29)', null], ['centred, p33 alone', 'p33']]) {
  const p = only === undefined ? null : plan(only), S = p ? build(lay(p.out)) : base, rows = measure(S);
  const u1 = rows.filter((r) => r.U.ratio > 1).length, u2 = rows.filter((r) => r.U.ratio > 2).length, l1 = rows.filter((r) => r.L.ratio > 1).length, l2 = rows.filter((r) => r.L.ratio > 2).length;
  let move = 0; for (let i = 0; i < Math.min(S.length, base.length); i++) move = Math.max(move, Math.hypot(...S[i].pos.map((v, k) => v - base[i].pos[k])));
  const e1 = S[S.length - 1], e0 = base[base.length - 1], gap = Math.hypot(...e1.pos.map((v, k) => v - S[0].pos[k])), dh = ((heading(e1) - heading(e0) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  console.log(`${label} ${name}: joints U>mid ${u1} (>2× ${u2}), L>mid ${l1} (>2× ${l2}); worst joint jerk U ${Math.max(...rows.map((r) => r.U.at)).toFixed(1)}, L ${Math.max(...rows.map((r) => r.L.at)).toFixed(1)} g/s | route: largest centre-line move ${move.toFixed(3)} m, end heading ${(dh * 180 / Math.PI).toFixed(4)}°, closure gap ${gap.toFixed(4)} m | ramps centred ${p ? p.rep.length : 0}, overshoot 0% (monotone by construction)`);
  for (const id of CALL) { const r = rows.find((x) => x.id === id); if (r) console.log(`    ${id}: U ${r.Ud.at.toFixed(0)} g/s at ${r.Ud.where.toFixed(0)} m (mid ${r.Ud.mid.toFixed(0)}); L ${r.Ld.at.toFixed(0)} at ${r.Ld.where.toFixed(0)} m (mid ${r.Ld.mid.toFixed(0)})`); }
  if (p) for (const w of p.rep.filter((x) => ['p32', 'p33', 'p34'].includes(x.piece))) console.log(`    ${w.piece} ${w.ch}: Δκ ${w.dk.toExponential(3)}, ramp 0–${w.was.toFixed(1)} m centred at ${w.c.toFixed(2)} m, now ±${w.w.toFixed(1)} m, reaching ${w.reachBack.toFixed(1)} m back into the piece before`);
  if (only === 'p33') { const j = pc.find((x) => x.p.id === 'p32').b, i = Math.round(j / (S[1].s - S[0].s)), jm = Math.hypot(...S[i].pos.map((v, k) => v - base[i].pos[k]));
    let worstAfter = 0; for (let k = i; k < S.length; k++) worstAfter = Math.max(worstAfter, Math.hypot(...S[k].pos.map((v, q) => v - base[k].pos[q])));
    console.log(`    p33 alone: p32's end (the joint, s ${j.toFixed(0)}) moves ${jm.toFixed(3)} m; the road after it moves at most ${worstAfter.toFixed(3)} m (the offset a centred ramp leaves)`); }
}
