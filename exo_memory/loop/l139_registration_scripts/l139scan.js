// L139 registration (pane E): the shortest second ramp per field, on a given tree (read-only).
//   node l139scan.js <worktree> <label>
// 0df08db has the second change for the bank only (extend.js BAD_TARGET "bank only for now"), so the other fields' second ramp is EMULATED here by the bank's own
// recipe, generalised by channel: extend.js secondRamp (:301): 8 knots inserted over [F, L] (D.insertKnots), the channel alone refitted to the ideal
// (first ramp, hold, then the channel's own blend from the first target to the second over [F, L]) by the exported fitWithHold with every control point whose
// support ends at or before F held; endC2 for the C2 channels (phi, c, e, er). CONTROL: the emulator run on phi must give the real extend's channel exactly.
// Measures per case (a 1,000 m flat, the piece, then a 200 m straight), B's method (p-l135-B §ROW-6): the case WITH the second change against the same piece
// WITHOUT it, over [0, F]:
//   docLeak   max |channel with − without| over [0, F] (channelAt, every 0.25 m)
//   builtLeak the same on the BUILT road: kh → the path's curvature along L (kvec·L), kv → along U (kvec·U), w → the segment profile's span (max u − min u),
//             c → the profile's outermost psi (°); bank → the path's roll (°)
//   joints    core_joint_feel.test.js joints() (copied verbatim below, :35-68), bad measures at the piece's end joint, against the same plain piece's
//   endPeak   the channel's built rate-of-change peak within 20 m of the end joint (2 m differences), for the L136 M5 carry
//   red       validator reds (src/validate validate(path, segments)) with the second change minus without
'use strict';
const path = require('path'), W = process.argv[2], LABEL = process.argv[3] || '';
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `pane E: L139 registration scan (${LABEL})` });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const fs = require('fs');
const D = require(path.join(W, 'src/core/document.js')), X = require(path.join(W, 'src/core/extend.js')), A = require(path.join(W, 'src/core/adapter.js'));
const T = require(path.join(W, 'src/core/turnby.js')), V = require(path.join(W, 'src/validate/index.js'));
const { extend, channelFn, fitWithHold, C2_CHANNELS } = X;
const DEG = Math.PI / 180, BAR = 29.4 / (10 * 170 * 170);
const flat = () => extend(D.createDoc('e'), { length: 1000, family: 'bowl' });
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ── core_joint_feel.test.js :27-68, verbatim but for `ramps` defaulting to [] ──
const floorOf = (P) => (P.type === 'road' ? (10 / Math.sqrt(3)) * Math.abs(D.channelAt(P, 'phi', P.length).v - D.channelAt(P, 'phi', 0).v) / (P.length * P.length) : 0);
const allowedAt = (doc, s, ramps = []) => { let o = 0, m = BAR; for (const P of doc.pieces) { if (s >= o - 4 && s <= o + P.length + 4) m = Math.max(m, floorOf(P)); o += P.length; } for (const x of ramps) if (s >= x.a - 4 && s <= x.b + 4) m = Math.max(m, (10 / Math.sqrt(3)) * Math.abs(x.delta) / ((x.b - x.a) * (x.b - x.a))); return m; };
function joints(doc, ramps = []) {
  const S = A.toPath(doc).path.samples.map((x) => ({ s: x.s, U: dot(x.kvec, x.U), L: dot(x.kvec, x.L), roll: x.roll })), N = S.length, ds = S[1].s - S[0].s;
  const idx = (s) => Math.max(0, Math.min(N - 1, Math.round(s / ds)));
  const step = (key, i0, i1) => { let m = 0; for (let i = Math.max(4, i0); i <= Math.min(N - 1, i1); i++) m = Math.max(m, Math.abs(S[i][key] - S[i - 4][key])); return m; };
  const rate = (i) => (S[i + 1].roll - S[i].roll) / ds;
  let o = 0; const P = doc.pieces.map((p) => { const r = { p, a: o, b: o + p.length }; o += p.length; return r; });
  const out = [];
  for (let k = 0; k + 1 < P.length; k++) {
    const a = P[k], b = P[k + 1]; if (a.p.type !== 'road' || b.p.type !== 'road' || a.p.tube || b.p.tube) continue;
    const j = a.b, r = { joint: Math.round(j), bad: [] };
    for (const key of ['U', 'L']) { const at = step(key, idx(j - 2), idx(j + 2)), inside = Math.max(step(key, idx(a.a + 2), idx(a.b - 2)), step(key, idx(b.a + 2), idx(b.b - 2))); if (at > inside * 1.05 + 1e-9) r.bad.push(`a ${key}`); }
    let acc = 0; for (let i = idx(j - 20); i + 8 <= idx(j + 20); i += 4) acc = Math.max(acc, Math.abs((S[i + 8].roll - S[i + 4].roll) - (S[i + 4].roll - S[i].roll)) / 4); const al = allowedAt(doc, j, ramps); if (acc > al * 1.05) r.bad.push(`b`);
    const mA = D.channelAt(a.p, 'phi', a.p.length / 2).d1, mB = D.channelAt(b.p, 'phi', b.p.length / 2).d1;
    if (Math.abs(mA) >= 0.02 * DEG && Math.abs(mB) >= 0.02 * DEG && Math.sign(mA) === Math.sign(mB)) { let slow = Infinity; for (let i = idx(j - 4); i <= idx(j + 4); i++) slow = Math.min(slow, Math.abs(rate(i))); if (slow < 0.5 * Math.min(Math.abs(mA), Math.abs(mB))) r.bad.push(`c`); }
    for (let ib = idx(j - 20) + 4; ib + 4 <= idx(j + 20); ib += 4) {
      const m1 = (S[ib].roll - S[ib - 4].roll) / (4 * ds), m2 = (S[ib + 4].roll - S[ib].roll) / (4 * ds);
      if (Math.abs(m1) < 0.01 * DEG || Math.abs(m2) < 0.01 * DEG || Math.sign(m1) !== Math.sign(m2)) continue;
      const near = Math.min(Math.abs(rate(ib - 1)), Math.abs(rate(ib))), floor = 0.85 * Math.min(Math.abs(m1), Math.abs(m2));
      if (near < floor) { r.bad.push(`d`); break; }
    }
    out.push(r);
  }
  return out;
}

// ── the emulated second ramp (secondRamp, generalised by channel) ──
function endC2(piece, ch) { const P = piece.channels[ch], n = P.length, L = piece.length, U = D.knotVector(piece), dec = D.DEC[ch]; if (n < 5) return; const qe = (3 * (P[n - 1] - P[n - 2])) / (L - U[n - 1]); P[n - 3] = Number((P[n - 2] - (qe * (L - U[n - 2])) / 3).toFixed(dec)) + 0; }
function withSecond(prefix, opts, ch, F, T2) {
  const plain = extend(prefix, opts), P = plain.pieces[plain.pieces.length - 1], L = P.length;
  const st = D.endState(prefix)[ch], Lt = typeof opts.transition === 'number' ? opts.transition : L;
  const f1 = channelFn(st, opts.targets[ch], Lt, ch, null), f2 = channelFn({ v: opts.targets[ch], m: 0 }, T2, L - F, ch, null);
  const ts = []; for (let j = 0; j < 8; j++) ts.push(+(F + ((L - F) * j) / 8).toFixed(4));
  const add = [...new Set(ts)].filter((k) => k > 0.5 && k < L - 0.5 && P.knots.every((h) => Math.abs(h - k) > 1e-3));
  const out = add.length ? D.insertKnots(P, add) : P, U = D.knotVector(out), n = out.channels[ch].length, keep = new Set();
  for (let i = 0; i < n; i++) if (U[i + 4] <= F + 1e-9) keep.add(i);
  fitWithHold(out, ch, (s) => (s < F ? f1(s) : f2(s - F)), Infinity, T2, keep);
  if (C2_CHANNELS.has(ch)) endC2(out, ch);
  return { plain, doc: D.appendPiece(prefix, out) };
}

// the built quantity per channel, per track metre
function builtOf(doc, ch) {
  const { path: p, segments } = A.toPath(doc);
  if (ch === 'kh' || ch === 'kv' || ch === 'phi') {
    const S = p.samples.map((x) => ({ s: x.s, v: ch === 'phi' ? x.roll / DEG : ch === 'kh' ? dot(x.kvec, x.L) : dot(x.kvec, x.U) }));
    return S;
  }
  let o = 0; const out = [];
  for (const g of segments) { if (g.kind !== 'road') { o += g.length; continue; } const u = g.profile.u, psi = g.profile.psi; out.push({ s: o + g.length / 2, v: ch === 'w' ? Math.max(...u) - Math.min(...u) : Math.max(...psi.map(Math.abs)) / DEG }); o += g.length; }
  return out;
}
const at = (S, s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return Math.abs(S[lo].s - s) <= Math.abs(S[hi].s - s) ? S[lo] : S[hi]; };

function measure(prefix, opts, ch, F, T2) {
  let r; try { r = withSecond(prefix, opts, ch, F, T2); } catch (e) { return { refused: `${e.code}: ${String(e.message).slice(0, 80)}` }; }
  const tail = (d) => extend(d, { length: 200 });
  const a = tail(r.doc), b = tail(r.plain), i = prefix.pieces.length, Pa = a.pieces[i], Pb = b.pieces[i], o = 1000, L = Pa.length;
  let docLeak = 0; for (let s = 0; s <= F; s += 0.25) docLeak = Math.max(docLeak, Math.abs(D.channelAt(Pa, ch, s).v - D.channelAt(Pb, ch, s).v));
  const Ba = builtOf(a, ch), Bb = builtOf(b, ch);
  let builtLeak = 0; for (const x of Ba) { if (x.s < o || x.s > o + F) continue; builtLeak = Math.max(builtLeak, Math.abs(x.v - at(Bb, x.s).v)); }
  let endPeak = 0; for (let s = o + L - 20; s <= o + L + 20; s += 2) endPeak = Math.max(endPeak, Math.abs(at(Ba, s + 2).v - 2 * at(Ba, s).v + at(Ba, s - 2).v) / 4);
  const jA = joints(a).find((j) => j.joint === Math.round(o + L)), jB = joints(b).find((j) => j.joint === Math.round(o + L));
  const va = (() => { const t = A.toPath(a); return V.validate(t.path, t.segments).red.length; })(), vb = (() => { const t = A.toPath(b); return V.validate(t.path, t.segments).red.length; })();
  const endV = D.channelAt(Pa, ch, L).v, endM = D.channelAt(Pa, ch, L).d1;
  return { docLeak, builtLeak, endPeak, jointBad: jA ? jA.bad : null, jointBadPlain: jB ? jB.bad : null, redNew: va - vb, endV, endM, ringMax: Math.max(...Pa.channels[ch]), ringMin: Math.min(...Pa.channels[ch]) };
}

const out = { label: LABEL, tree: W, control: {}, rate: {}, corner: {}, sketch: null, noSecond: null };
// 0 · CONTROL: the emulator on phi against the real extend's second bank (30° → 0, first ramp 120 m, on 750 m from 637.5; and 60° → 0 from 600)
for (const [b1, b2, F] of [[30, 0, 637.5], [60, 0, 600], [20, -40, 500]]) {
  const opts = { length: 750, targets: { phi: b1 * DEG }, transition: 120 };
  const real = extend(flat(), { ...opts, second: { phi: { from: F, target: b2 * DEG } } }).pieces[1].channels.phi;
  const emu = withSecond(flat(), opts, 'phi', F, b2 * DEG).doc.pieces[1].channels.phi;
  out.control[`phi ${b1}→${b2} from ${F}`] = { equal: JSON.stringify(real) === JSON.stringify(emu), maxDiff: Math.max(...real.map((v, k) => Math.abs(v - emu[k]))), n: real.length };
}
// 1 · RATE MODE, per field: first target over a 120 m first ramp, then the second over L2, on a 1,000 m piece
const L2S = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300];
const FIELDS = {
  kh: [[1 / 300, 0, 'turn 1/300 → straight'], [1 / 300, -1 / 300, 'turn 1/300 → −1/300 (an S)'], [1 / 150, 0, 'turn 1/150 → straight'], [1 / 600, 1 / 200, 'turn 1/600 → 1/200 (tighter)']],
  kv: [[0.04 / 100 * 100 * DEG / 100 * 100, 0, 'climb 4°/100 m → 0'], [8 * DEG / 100, -8 * DEG / 100, 'climb +8°/100 m → −8°/100 m'], [2 * DEG / 100, 0, 'climb 2°/100 m → 0']],
  w: [[40, 30, 'width 30 → 40 → 30'], [20, 30, 'width 30 → 20 → 30'], [50, 30, 'width 30 → 50 → 30']],
  c: [[30, 15, 'cup 15 → 30 → 15'], [60, 15, 'cup 15 → 60 → 15'], [45, 0, 'cup 15 → 45 → 0']],
};
FIELDS.kv[0][0] = 4 * DEG / 100;
const startW = 30, startC = 15;
for (const [ch, cases] of Object.entries(FIELDS)) for (const [t1, t2, name] of cases) {
  // the prefix: a 1,000 m flat; for w and c, one 200 m piece first sets the start value (width 30, cup 15) and holds it
  let prefix = flat(); if (ch === 'w') prefix = extend(prefix, { length: 200, targets: { w: startW }, transition: 100 }); if (ch === 'c') prefix = extend(prefix, { length: 200, targets: { c: startC }, transition: 100 });
  const o0 = prefix.pieces.reduce((a, P) => a + P.length, 0);
  const rows = [];
  for (const L2 of L2S) {
    const r = measureAt(prefix, { length: 1000, targets: { [ch]: t1 }, transition: 120 }, ch, 1000 - L2, t2, o0);
    rows.push({ L2, ...r });
  }
  out.rate[`${ch}: ${name}`] = rows;
}
function measureAt(prefix, opts, ch, F, T2, o0) {   // measure() with the piece's own start offset
  const save = measure.o; return measureO(prefix, opts, ch, F, T2, o0);
}
function measureO(prefix, opts, ch, F, T2, o) {
  let r; try { r = withSecond(prefix, opts, ch, F, T2); } catch (e) { return { refused: `${e.code}: ${String(e.message).slice(0, 80)}` }; }
  const tail = (d) => extend(d, { length: 200 });
  const a = tail(r.doc), b = tail(r.plain), i = prefix.pieces.length, Pa = a.pieces[i], Pb = b.pieces[i], L = Pa.length;
  let docLeak = 0; for (let s = 0; s <= F; s += 0.25) docLeak = Math.max(docLeak, Math.abs(D.channelAt(Pa, ch, s).v - D.channelAt(Pb, ch, s).v));
  const Ba = builtOf(a, ch), Bb = builtOf(b, ch);
  let builtLeak = 0; for (const x of Ba) { if (x.s < o || x.s > o + F) continue; builtLeak = Math.max(builtLeak, Math.abs(x.v - at(Bb, x.s).v)); }
  let endPeak = 0, endPeakPlain = 0; for (let s = o + L - 20; s <= o + L + 20; s += 2) { endPeak = Math.max(endPeak, Math.abs(at(Ba, s + 2).v - 2 * at(Ba, s).v + at(Ba, s - 2).v) / 4); endPeakPlain = Math.max(endPeakPlain, Math.abs(at(Bb, s + 2).v - 2 * at(Bb, s).v + at(Bb, s - 2).v) / 4); }
  const jA = joints(a).find((j) => j.joint === Math.round(o + L)), jB = joints(b).find((j) => j.joint === Math.round(o + L));
  const red = (d) => { const t = A.toPath(d); const v = V.validate(t.path, t.segments); return { red: v.red.length, amber: v.amber.length, redKinds: [...new Set(v.red.map((x) => x.code || x.kind || x.rule || 'r'))] }; };
  const va = red(a), vb = red(b);
  const c = D.channelAt(Pa, ch, L);
  return { docLeak: +docLeak.toPrecision(3), builtLeak: +builtLeak.toPrecision(3), endPeak: +endPeak.toPrecision(3), endPeakPlain: +endPeakPlain.toPrecision(3), jointBad: jA ? jA.bad : null, jointBadPlain: jB ? jB.bad : null, redNew: va.red - vb.red, amberNew: va.amber - vb.amber, redKinds: va.redKinds, endV: +c.v.toPrecision(4), endD1: +c.d1.toPrecision(3), ring: [+Math.min(...Pa.channels[ch]).toPrecision(4), +Math.max(...Pa.channels[ch]).toPrecision(4)] };
}
// 2 · CORNER MODE: a second corner = two exact corners, emulated as two Turn-by / Climb-by pieces (one piece in B's build); the shortest second corner is
// turnby.js shortestTurnBy from the state after the first, for each Δ
const heading = (d) => { const p = A.toPath(d).path.samples, x = p[p.length - 1]; return Math.atan2(x.T[2], x.T[0]); };
for (const deg of [5, 15, 30, 45, 90, 135, 180, 270]) {
  const after = T.extendTurnBy(flat(), { length: 400 }, 90 * DEG);
  const needKh = T.shortestTurnBy(after, { length: 1 }, (-deg) * DEG), needKv = deg <= 45 ? T.shortestTurnBy(after, { length: 1 }, { kv: deg * DEG }) : null;
  out.corner[`second corner ${deg}°`] = { turnNeedM: needKh, climbNeedM: deg <= 45 ? needKv : null };
}
// the S: corner +90 then −90 over 600 m (300 + 300), its end heading and kh against the start
{ const d0 = flat(), h0 = heading(d0); let d = T.extendTurnBy(d0, { length: 300 }, 90 * DEG); d = T.extendTurnBy(d, { length: 300 }, -90 * DEG); const e = D.endState(d);
  out.corner.S = { startHeadingDeg: +(h0 / DEG).toFixed(6), endHeadingDeg: +(heading(d) / DEG).toFixed(6), endKh: e.kh.v, endKhSlope: e.kh.m, shortestFirst90: T.shortestTurnBy(d0, { length: 1 }, 90 * DEG) }; }
// 3 · his sketch piece, the bytes the pass bar holds fixed
{ const { extendOptions } = require(path.join(W, 'app/core/panel.js'));
  const o = extendOptions({ length: '750', turn: '270', climb: '-6', bank: '-28.47', width: '30', cup: '15', edge: '', start: '', tube: '', atStart: { bank: true, cup: true }, turnAs: 'corner', thenBank: '0', bankFrom: '' });
  const d = T.extendCorner(flat(), o), s = D.serialize(d);
  out.sketch = { second: o.second, sha256: require('crypto').createHash('sha256').update(s).digest('hex'), bytes: s.length }; }
const file = path.join(__dirname, `l139scan-${LABEL.replace(/[^a-z0-9]/gi, '')}.json`); fs.writeFileSync(file, JSON.stringify(out, null, 1));
console.log(file);
