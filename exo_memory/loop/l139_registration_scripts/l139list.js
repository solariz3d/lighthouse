// L139 addendum (pane E): ANY NUMBER of changes per field, emulated on 0df08db (read-only).
//   node l139list.js <worktree>
// The list emulator: a field's ideal is its first ramp (as extend lays it), a hold to the first mark, then for each change i a blend (the channel's own: Bloss cubic
// for kh, kv, w; the C2 quintic for phi, c) from the previous target to target_i over [from_i, from_{i+1}] (the last to the piece's end), holding target_i to the
// next mark. 8 knots inserted per segment (extend.js secondRamp's SECOND_SUB), the channel alone refitted by fitWithHold, every control point whose support ends at
// or before the FIRST mark held as laid; endC2 for the C2 channels. A one-item list is exactly l139scan.js's emulator, whose control equals the real second bank.
// Measures:
//   holdErr  for each segment, max |channel − the value it should hold| over [the previous ramp's end + 0.5, its own mark] (document, every 0.25 m)
//   endErr   |channel(L) − last target|, and the end slope
//   built    for kv: the built road's curvature along U against the document's kv over the whole piece, skipping the 2 m chord around each mark (chord resolution)
// Cases: (1) the snake as corners, [90, −90, 90] and [+60, −60, +60] over 900 m, emulated as three Turn-by pieces of 300 m (one piece in B's build): end heading
// against start + Σ, end kh and slope; (2) a climb list through an inversion (pitch past 90°); (3) the M3 three-field piece with two turn changes.
'use strict';
const path = require('path'), W = process.argv[2];
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: L139 addendum list' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const D = require(path.join(W, 'src/core/document.js')), X = require(path.join(W, 'src/core/extend.js')), A = require(path.join(W, 'src/core/adapter.js')), T = require(path.join(W, 'src/core/turnby.js'));
const { extend, channelFn, fitWithHold, C2_CHANNELS } = X;
const DEG = Math.PI / 180, dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const flat = () => extend(D.createDoc('e'), { length: 1000, family: 'bowl' });
function endC2(piece, ch) { const P = piece.channels[ch], n = P.length, L = piece.length, U = D.knotVector(piece), dec = D.DEC[ch]; if (n < 5) return; const qe = (3 * (P[n - 1] - P[n - 2])) / (L - U[n - 1]); P[n - 3] = Number((P[n - 2] - (qe * (L - U[n - 2])) / 3).toFixed(dec)) + 0; }
function addList(P, st, t1, Lt, ch, list) {
  const L = P.length, f1 = channelFn(st, t1, Lt, ch, null), segs = list.map((c, i) => ({ a: c.from, b: i + 1 < list.length ? list[i + 1].from : L, v0: i ? list[i - 1].target : t1, v1: c.target }));
  const fs = segs.map((g) => channelFn({ v: g.v0, m: 0 }, g.v1, g.b - g.a, ch, null));
  const f = (s) => { for (let i = segs.length - 1; i >= 0; i--) if (s >= segs[i].a) return fs[i](s - segs[i].a); return f1(s); };
  const ts = []; for (const g of segs) for (let j = 0; j < 8; j++) ts.push(+(g.a + ((g.b - g.a) * j) / 8).toFixed(4));
  const add = [...new Set(ts)].filter((k) => k > 0.5 && k < L - 0.5 && P.knots.every((h) => Math.abs(h - k) > 1e-3)).sort((x, y) => x - y);
  const out = add.length ? D.insertKnots(P, add) : P, U = D.knotVector(out), n = out.channels[ch].length, keep = new Set();
  for (let i = 0; i < n; i++) if (U[i + 4] <= list[0].from + 1e-9) keep.add(i);
  fitWithHold(out, ch, f, Infinity, list[list.length - 1].target, keep);
  if (C2_CHANNELS.has(ch)) endC2(out, ch);
  return { out, segs };
}
function holds(P, ch, t1, Lt, segs) {   // each value held to its mark
  const rows = [], marks = [{ v: t1, a: Lt, b: segs[0].a }, ...segs.map((g, i) => ({ v: g.v1, a: g.b === P.length ? null : g.b, b: i + 1 < segs.length ? segs[i + 1].a : null }))];
  // a segment's own ramp runs over its whole span (to the next mark), so only the first hold [Lt, first mark] is a flat stretch; the others are checked at their mark
  let e0 = 0; for (let s = Lt + 0.5; s <= segs[0].a; s += 0.25) e0 = Math.max(e0, Math.abs(D.channelAt(P, ch, s).v - t1)); rows.push({ hold: `first value to mark 1 (${segs[0].a})`, err: +e0.toPrecision(3) });
  segs.forEach((g, i) => { const at = g.b, v = D.channelAt(P, ch, Math.min(at, P.length)).v; rows.push({ hold: `change ${i + 1} reaches ${+g.v1.toPrecision(4)} at ${at}`, err: +Math.abs(v - g.v1).toPrecision(3), slope: +D.channelAt(P, ch, Math.min(at, P.length)).d1.toPrecision(3) }); });
  return rows;
}
const heading = (d) => { const p = A.toPath(d).path.samples, x = p[p.length - 1]; return Math.atan2(x.T[2], x.T[0]) / DEG; };
const out = { control: null, snake: {}, inversion: null, m3: null };
// CONTROL: a one-item list equals the real extend's second bank
{ const opts = { length: 750, targets: { phi: 30 * DEG }, transition: 120 }, real = extend(flat(), { ...opts, second: { phi: { from: 637.5, target: 0 } } }).pieces[1].channels.phi;
  const P = extend(flat(), opts).pieces[1], emu = addList(P, D.endState(flat()).phi, 30 * DEG, 120, 'phi', [{ from: 637.5, target: 0 }]).out.channels.phi;
  out.control = { equal: JSON.stringify(real) === JSON.stringify(emu), n: real.length }; }
// (1) the snakes, as corners
for (const [name, degs, L] of [['[90, −90, 90] over 900 m', [90, -90, 90], 900], ['[+60, −60, +60] over 900 m', [60, -60, 60], 900], ['[90, −90] over 600 m (the S, M2)', [90, -90], 600]]) {
  let d = flat(); const h0 = heading(d); for (const g of degs) d = T.extendTurnBy(d, { length: L / degs.length }, g * DEG);
  const e = D.endState(d), sum = degs.reduce((a, b) => a + b, 0); let dh = heading(d) - h0 - sum; dh = ((dh + 540) % 360) - 180;   // wrapped, sign-free of the convention
  let dh2 = heading(d) - h0 + sum; dh2 = ((dh2 + 540) % 360) - 180;
  out.snake[name] = { startHeading: +h0.toFixed(6), endHeading: +heading(d).toFixed(6), offExpectedDeg: +Math.min(Math.abs(dh), Math.abs(dh2)).toFixed(6), endKh: e.kh.v, endKhSlope: e.kh.m, shortestEach: degs.map((g) => T.shortestTurnBy(flat(), { length: 1 }, g * DEG)) };
}
// (2) a climb list through an inversion: kv 0 → 0.005 rad/m over 120 m, held; at 500 → −0.005; at 800 → 0 (segments 300 m and 200 m, each over its minimum:
// 3·0.01/ROUTE_BAR = 294.9 m, 3·0.005/ROUTE_BAR = 147.4 m). The pitch passes 90° near 390 m and is ~126° at the first mark.
{ const opts = { length: 1000, targets: { kv: 0.005 }, transition: 120 }, list = [{ from: 500, target: -0.005 }, { from: 800, target: 0 }];
  const P0 = extend(flat(), opts).pieces[1], { out: P, segs } = addList(P0, D.endState(flat()).kv, 0.005, 120, 'kv', list);
  const doc = extend(D.appendPiece(flat(), P), { length: 200 }), S = A.toPath(doc).path.samples;
  let pitch = 0, maxPitch = 0, passed = null; for (let s = 0; s <= 1000; s += 0.25) { pitch += D.channelAt(P, 'kv', s).v * 0.25; if (pitch / DEG > maxPitch) maxPitch = pitch / DEG; if (passed === null && pitch > Math.PI / 2) passed = s; }
  let built = 0, at = 0; for (const x of S) { const s = x.s - 1000; if (s < 1 || s > 999 || [120, 500, 800].some((m) => Math.abs(s - m) <= 2)) continue; const dd = Math.abs(dot(x.kvec, x.U) - D.channelAt(P, 'kv', s).v); if (dd > built) { built = dd; at = s; } }
  const sign = Math.sign(dot(S.find((x) => Math.abs(x.s - 1300) < 0.3).kvec, S.find((x) => Math.abs(x.s - 1300) < 0.3).U));
  out.inversion = { holds: holds(P, 'kv', 0.005, 120, segs), pitchMaxDeg: +maxPitch.toFixed(2), pitchPasses90At: passed, builtVsDocMax: +built.toPrecision(3), at, builtSignAt300: sign, end: D.channelAt(P, 'kv', 1000).v }; }
// (3) M3 with two turn changes: bank 30° → 0 from 700; turn 1/300 → −1/300 from 400 → 0 from 750; climb 4°/100 m → 0 from 800
{ const opts = { length: 1000, targets: { phi: 30 * DEG, kh: 1 / 300, kv: 4 * DEG / 100 }, transition: 120 }, st = D.endState(flat());
  const LISTS = { phi: [{ from: 700, target: 0 }], kh: [{ from: 400, target: -1 / 300 }, { from: 750, target: 0 }], kv: [{ from: 800, target: 0 }] };
  const res = {};
  for (const order of [['phi', 'kh', 'kv'], ['kh', 'kv', 'phi'], ['kv', 'phi', 'kh']]) {
    let P = extend(flat(), opts).pieces[1]; const segsOf = {};
    for (const ch of order) { const r = addList(P, st[ch], opts.targets[ch], 120, ch, LISTS[ch]); P = r.out; segsOf[ch] = r.segs; }
    res[order.join('>')] = Object.fromEntries(['phi', 'kh', 'kv'].map((ch) => [ch, holds(P, ch, opts.targets[ch], 120, segsOf[ch])]));
    res[order.join('>')].channels = P.channels;
  }
  const ks = Object.keys(res), diff = {}; for (const ch of ['phi', 'kh', 'kv']) { let m = 0; for (const k of ks) for (const k2 of ks) { const a = res[k].channels[ch], b = res[k2].channels[ch]; if (a.length !== b.length) { m = Infinity; continue; } for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i])); } diff[ch] = m; }
  for (const k of ks) delete res[k].channels;
  out.m3 = { byOrder: res, orderDiff: diff }; }
console.log(JSON.stringify(out, null, 1));
