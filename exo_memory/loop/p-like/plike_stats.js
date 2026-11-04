// P-LIKE statistics (B, D182; sealed with p-like_registration_2026-09-27.md). One definition for the real stretch and the
// rebuild alike: node plike_stats.js <read.json> <fromM> <toM>  → JSON of the statistics over the stations with
// fromM ≤ d ≤ toM. Input is tools/read_track.cjs output (stations: d, c=[x,y,z], up, width, edgeL, edgeR, k, grade).
'use strict';
const fs = require('fs');
const [file, fromArg, toArg] = process.argv.slice(2);
if (!file) { console.error('usage: node plike_stats.js <read.json> <fromM> <toM>'); process.exit(2); }
const from = Number(fromArg || 0), to = Number(toArg || 3000);
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
// the stations the reader could classify (the same rows its word() names): a centre, a curvature, not a jump, not lost
const S = r.stations.filter((s) => s.d >= from && s.d <= to && s.c && s.k != null && !s.jump && !s.lost && !s.closed);
if (S.length < 50) { console.error(`only ${S.length} usable stations in [${from}, ${to}] m`); process.exit(3); }
const q = (xs, p) => { const a = xs.slice().sort((x, y) => x - y), i = (a.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i); return a[lo] + (a[hi] - a[lo]) * (i - lo); };
const share = (pred) => +(100 * S.filter(pred).length / S.length).toFixed(1);
// the reader's own classes (tools/read_track.cjs word()): shape by edge tilt, turn class by radius
const shape = (s) => { const e1 = Math.min(s.edgeL, s.edgeR), e2 = Math.max(s.edgeL, s.edgeR); return e2 < 12 ? 'flat' : e1 > 25 ? (e2 > 70 ? 'pipe+' : 'pipe') : (e2 > 70 ? 'bowl+' : 'bowl'); };
const R = (s) => (Math.abs(s.k) > 1e-6 ? 1 / Math.abs(s.k) : Infinity);
const turn = (s) => { const x = R(s); return x > 1500 ? 'straight' : x > 500 ? 'sweep' : x > 180 ? 'turn' : 'tight'; };
const shapes = ['flat', 'bowl', 'bowl+', 'pipe', 'pipe+'], turns = ['straight', 'sweep', 'turn', 'tight'];
const W = S.map((s) => s.width), UP = S.map((s) => s.up), Y = S.map((s) => s.c[1]), G = S.map((s) => Math.abs(s.grade));
const curved = S.filter((s) => R(s) <= 1500).map(R);
let ascent = 0; for (let i = 1; i < Y.length; i++) if (Y[i] > Y[i - 1]) ascent += Y[i] - Y[i - 1];
const shareOf = (f, keys) => Object.fromEntries(keys.map((k) => [k, share((s) => f(s) === k)]));
const shapeShares = shareOf(shape, shapes), turnShares = shareOf(turn, turns);
const dominant = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0];
console.log(JSON.stringify({
  file: require('path').basename(file), from, to, stations: S.length, span_m: S[S.length - 1].d - S[0].d,
  width: { p10: q(W, 0.1), median: q(W, 0.5), p90: q(W, 0.9) },
  shapeShares, shapeDominant: dominant(shapeShares),
  bank_up_deg: { median: +q(UP, 0.5).toFixed(1), p90: +q(UP, 0.9).toFixed(1) },
  turnShares, turnDominant: dominant(turnShares),
  radiusCurved_m: curved.length ? { n: curved.length, median: Math.round(q(curved, 0.5)), p10: Math.round(q(curved, 0.1)) } : { n: 0 },
  climb: { netDy_m: +(Y[Y.length - 1] - Y[0]).toFixed(1), range_m: +(Math.max(...Y) - Math.min(...Y)).toFixed(1), ascent_m: +ascent.toFixed(1), absGradeP90_pct: +q(G, 0.9).toFixed(1) },
}));
