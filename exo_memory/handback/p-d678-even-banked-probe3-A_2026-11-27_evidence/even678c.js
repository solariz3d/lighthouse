// even678c.js (pane A, D678 probe 3 RUN 2, measure only; nothing of the grab is built): run 1's even678b.js (6c4f0c8f) with the bank as a parameter, read on the BUILT bank
//   node even678c.js <builder tree at c522ea6> <out dir> <even678.json, probe 2's figures>
// Run 2's rows (K2, 2b, C1b, row 1', the row 1 diagnostic), C1b's failing result and the reading are registered in the hand-back at 33e7c780 BEFORE this was written.
// What follows to the run section is even678b.js; its changes are marked D678-3 run 2 (row2 and row1 take the bank and the stations as parameters). Run 1's header:
// The rows, their bars, the branches and Alt F's failing result are registered in handback/p-d678-even-banked-probe3-A_2026-11-27.md (a044d6c8, and its
// pre-run amendment) BEFORE this was written. The fixtures and C1 (levelC1) are probe 2's even678.js (3555f20f), copied unchanged; D678-3 marks what is new.
//   K0: the cupped fixtures and C1 from base rebuild to probe 2's bytes; my direct validate reads the check job's leaves-surface reds, on every base and C1.
//   K1: my measure (offsetPath's lift re-run with derivatives by central differences, then validate's centreline load) on C1's centre against validate's.
//   row 1 (1a 1b): the levelled surface against the base's, along the base's normal, in the station plane.
//   row 2 (2, 2n, 2c, 2x): the base's own surface along the line C1's centre takes, read with the checker's centreline load at its speed.
//   row 3: Bhold the control. Then the branch, as registered, and Alt F only in branch B or mixed.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT, P2P] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const P2 = JSON.parse(fs.readFileSync(P2P, 'utf8'));
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createCheckJob } = require(path.join(T, 'app/validate-ui/checkjob.js'));
const AD = require(path.join(T, 'src/core/adapter.js')), V = require(path.join(T, 'src/validate/index.js')), PR = require(path.join(T, 'src/geom/profile.js'));
const LIM = require(path.join(T, 'src/validate/limits.js'));
const R4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? x : Math.round(x * 1e4) / 1e4), DEGR = 180 / Math.PI;
const out = { started: new Date().toISOString(), tree: T, node: process.version, K0: {}, K1: {}, row1: {}, row2: {}, row3: {}, branch: null, altF: null, diag: {}, errors: [] };
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex');
const write = () => fs.writeFileSync(path.join(OUT, 'even678c.json'), JSON.stringify(out, null, 1));

// ── copied unchanged from even678.js: LAYOUT, makeBase, the window, at, endOf, pathOf, rotb, dot3, weight, q, isLinked, settle, levelGen, easeOf, rimR, levelC1, reds ──
const LAYOUT = {
  plan: (b) => [{ length: 100, turn: 0, bank: 0 }, { length: 100, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 150, turn: 0, bank: 0 }],
  hold: (b) => [{ length: 80, turn: 0, bank: 0 }, { length: 60, turn: 0, bank: b }, { length: 60, turn: 0, bank: b }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 60, turn: 0, bank: b }, { length: 90, turn: 0, bank: 0 }],
};
function makeBase(layout, bank, cup) {
  let b = D.createDoc('even');
  for (const p of LAYOUT[layout](bank)) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner', ...(cup === undefined ? {} : { cup }) }));
  return Object.freeze(b);
}
const LO = 200, HI = 440, MID = 320, WIN = { lo: LO - 20, hi: HI + 20, ramp: 30 }, SN = WIN.lo - WIN.ramp, SF = WIN.hi + WIN.ramp;
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
const endOf = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
async function pathOf(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); const rs = sh.getState().resolved; return { rs, path: G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) }) }; }
const rotb = (a, c, ang) => [a * Math.cos(ang) - c * Math.sin(ang), a * Math.sin(ang) + c * Math.cos(ang)];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const weight = (s, lo, hi, ramp) => (s >= lo && s <= hi ? 1 : ((d) => (d >= ramp ? 0 : 1 - SC.smootherstep(d / ramp)))(s < lo ? lo - s : s - hi));
const q = (x, dec) => { const v = Number(x.toFixed(dec)); return Object.is(v, -0) ? 0 : v; };
const isLinked = (d, a, b, ch) => a >= 0 && !d.pieces.slice(a + 1, b).some((P) => P.type === 'flight') && (!D.OPTIONAL[ch] || !!(d.pieces[a][D.OPTIONAL[ch]] && d.pieces[b][D.OPTIONAL[ch]]));
function settle(d, ch, res) {
  let a = -1;
  for (let b = 0; b < d.pieces.length; b++) {
    if (d.pieces[b].type !== 'road') continue;
    const Pb = d.pieces[b], rb = res[b];
    if (!isLinked(d, a, b, ch)) { if (a >= 0 && rb) { rb.ctrl[0] = Pb.channels[ch][0]; rb.ctrl[1] = Pb.channels[ch][1]; rb.changed = rb.changed.filter((i) => i > 1); } a = b; continue; }
    const Pa = d.pieces[a], ra = res[a], n = Pa.channels[ch].length;
    const all = ra && rb && ra.changed.includes(n - 1) && ra.changed.includes(n - 2) && rb.changed.includes(0) && rb.changed.includes(1);
    if (all) { const h = Pa.length - (Pa.knots.length ? Pa.knots[Pa.knots.length - 1] : 0), hb = Pb.knots.length ? Pb.knots[0] : Pb.length; const v = q(ra.ctrl[n - 1], D.DEC[ch]), m = (3 * (v - q(ra.ctrl[n - 2], D.DEC[ch]))) / h; rb.ctrl[0] = v; rb.ctrl[1] = v + (m * hb) / 3; }
    else { if (ra) { ra.ctrl[n - 1] = Pa.channels[ch][n - 1]; ra.ctrl[n - 2] = Pa.channels[ch][n - 2]; ra.changed = ra.changed.filter((i) => i < n - 2); } if (rb) { rb.ctrl[0] = Pb.channels[ch][0]; rb.ctrl[1] = Pb.channels[ch][1]; rb.changed = rb.changed.filter((i) => i > 1); } }
    a = b;
  }
  return d.pieces.map((P, p) => { const x = res[p]; if (!x || !x.changed.length) return P; return { ...P, channels: { ...P.channels, [ch]: P.channels[ch].map((v, i) => (x.changed.includes(i) ? q(x.ctrl[i], D.DEC[ch]) : v)) } }; });
}
function levelGen(d, targets, { lo, hi, ramp }) {
  let cur = d;
  for (const [ch, fn] of Object.entries(targets)) {
    const off = SC.pieceOffsets(cur), W0 = lo - ramp, W1 = hi + ramp;
    const res = cur.pieces.map((P, p) => {
      if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) return null;
      const t = D.knotVector(P), c = P.channels[ch], ctrl = c.slice(), changed = [];
      for (let i = 0; i < c.length; i++) {
        if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
        const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, lo, hi, ramp), v = typeof fn === 'function' ? fn(sI) : fn;
        ctrl[i] = c[i] + g * (v - c[i]); changed.push(i);
      }
      return { ctrl, changed };
    });
    cur = Object.freeze(D.checkDoc({ ...cur, pieces: settle(cur, ch, res) }));
  }
  return cur;
}
const easeOf = (d, ch) => { const a = at(d, ch, SN), b = at(d, ch, SF); return (s) => a + (b - a) * SC.smootherstep((s - SN) / (SF - SN)); };
const rimR = (g, s) => { const f = ZG.frameAt(g.path, g.rs.segments, s, -1); if (!f) throw new Error(`no frame at ${s}`); return rotb(f.oF[0], f.oF[1], Math.atan2(f.sin, f.cos))[0]; };
async function levelC1(d, W) {
  const fw = easeOf(d, 'w'), fh = easeOf(d, 'h'), fl = easeOf(d, 'l');
  const dStar = levelGen(d, { w: fw, l: fl }, WIN), d1 = levelGen(d, { w: W }, WIN);
  const g0 = await pathOf(d), g1 = await pathOf(d1), gS = await pathOf(dStar), L1 = endOf(d1), off = SC.pieceOffsets(d), res = { l: [], h: [] };
  const W0 = WIN.lo - WIN.ramp, W1 = WIN.hi + WIN.ramp;
  d.pieces.forEach((P, p) => {
    if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) { res.l.push(null); res.h.push(null); return; }
    const t = D.knotVector(P), l = P.channels.l.slice(), h = P.channels.h.slice(), changed = [];
    for (let i = 0; i < l.length; i++) {
      if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
      const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, WIN.lo, WIN.hi, WIN.ramp);
      const dw = d1.pieces[p].channels.w[i] - P.channels.w[i];
      if (!(g > 0) && Math.abs(dw) < 1e-12) continue;
      const s = Math.min(L1, Math.max(0, sI)), F0R = rimR(g0, s), F1R = rimR(g1, s), lamStar = at(dStar, 'l', s) + rimR(gS, s);
      l[i] = (1 - g) * (P.channels.l[i] + F0R - F1R) + g * (lamStar - F1R);
      const tn = Math.tan(at(d1, 'phi', s));
      h[i] = P.channels.h[i] + g * (fh(sI) - P.channels.h[i]) + tn * ((1 - g) * (l[i] - P.channels.l[i]) + g * (l[i] - fl(sI)));
      changed.push(i);
    }
    res.l.push({ ctrl: l, changed: changed.slice() }); res.h.push({ ctrl: h, changed: changed.slice() });
  });
  let c = d1;
  for (const ch of ['l', 'h']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch]) }));
  return { doc: c, fh, fl };
}
function reds(d) {
  const r = createCheckJob().run({ doc: d, csp: true }).result;
  if (!r) return { error: 'no result' };
  const pick = (f) => ({ s: R4(f.s0 !== undefined ? f.s0 : f.s), s1: f.s1 !== undefined ? R4(f.s1) : undefined, reason: f.reason });
  const red = (r.red || []).map(pick), amber = (r.amber || []).map(pick);
  const onRun = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= LO && x.s <= HI), inWindow = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= SN && x.s <= SF);
  return { red: red.length, amber: amber.length, redOnRun: onRun.length, redInWindow: inWindow.length, redList: red };
}
const overlaps = (a, b) => (a.s1 !== undefined ? a.s1 : a.s) >= b.s && a.s <= (b.s1 !== undefined ? b.s1 : b.s);
// even678.js's centreOff (D678 R4), unchanged
function centreOff(d, start, fh, fl) {
  let m = 0;
  for (let s = SN; s <= SF + 1e-9; s += 1) {
    const g = weight(s, WIN.lo, WIN.hi, WIN.ramp), tn = Math.tan(at(d, 'phi', s)), l = at(d, 'l', s), hs = at(start, 'h', s), ls = at(start, 'l', s);
    const target = hs + g * (fh(s) - hs) + tn * ((1 - g) * (l - ls) + g * (l - fl(s)));
    m = Math.max(m, Math.abs(at(d, 'h', s) - target));
  }
  return R4(m);
}

// ── D678-3: the checker, run directly, and my measure ──
const Gc = LIM.G, CAR = LIM.MACH6, dfPerMps = CAR.downforce ? CAR.downforce.nPerMps / CAR.downforce.massKg : 0;
const VOPTS = { passClearance: true, csp: true, fullSpeed: true };   // the controller's vo() (panel.js:69) with no apron (the check job's shell has none), every line kept
const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], vmul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const UP = [0, 1, 0];
/** the doc at the checker's step: the lifted path the checker reads (toPath), the unlifted one my lift starts from, the segments' starts, the result */
function checked(doc) {
  const tp = AD.toPath(doc, { step: 2 }), segments = tp.segments;
  const base = G.buildPath(segments, { step: 2, closed: !!doc.closed, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } });
  const r = V.validate(tp.path, segments, VOPTS);
  const segStart = []; let acc = 0; segments.forEach((g) => { segStart.push(acc); acc += g.length; });
  const centre = new Map(), lines = new Map();
  for (const ln of r.lines) { if (ln.u === 0) centre.set(ln.s, ln.fHold_g); if (!lines.has(ln.s)) lines.set(ln.s, []); lines.get(ln.s).push(ln); }
  const leaves = r.red.filter((x) => x.reason === 'leaves-surface').map((x) => [R4(x.s0), R4(x.s1)]);
  return { doc, tp, segments, base, r, segStart, centre, lines, leaves, offs: SC.pieceOffsets(doc) };
}
/** the piece a station reads (offsetPath's: its segment's piece), with its start and length */
function pieceOf(C, x) { const id = C.segments[x.seg].id, p = C.doc.pieces.findIndex((P) => P.id === id); return { p, P: C.doc.pieces[p], s0: C.offs[p], L: C.doc.pieces[p].length }; }
/** value, first and second derivative of F (global s -> number) at s, by differences at 0.01 m kept inside [a, b] (one-sided, second order, at the ends) */
function diffs(F, s, a, b) {
  const h = 0.01;
  if (s - h >= a - 1e-12 && s + h <= b + 1e-12) { const f0 = F(s - h), f1 = F(s), f2 = F(s + h); return [f1, (f2 - f0) / (2 * h), (f2 - 2 * f1 + f0) / (h * h)]; }
  const sg = s - h < a - 1e-12 ? 1 : -1, f0 = F(s), f1 = F(s + sg * h), f2 = F(s + 2 * sg * h), f3 = F(s + 3 * sg * h);
  return [f0, sg * (-3 * f0 + 4 * f1 - f2) / (2 * h), (2 * f0 - 5 * f1 + 4 * f2 - f3) / (h * h)];
}
/** offsetPath's lift (adapter.js:713-732), its arithmetic unchanged, with l and h given as [v, d1, d2] */
function lift(C, x, l, h) {
  const g = C.segments[x.seg], T = x.T, K = x.kvec, th = Math.atan2(T[0], T[2]), u = x.s - C.segStart[x.seg];
  const k0 = g.k0 || 0, k1 = g.k1 || 0, dth = k0 + ((k1 - k0) * u) / g.length, ddth = (k1 - k0) / g.length;
  const R = [Math.cos(th), 0, -Math.sin(th)], Rth = [-Math.sin(th), 0, -Math.cos(th)];
  const dR = vmul(Rth, dth), ddR = vadd(vmul(Rth, ddth), vmul(R, -dth * dth));
  const d1 = vadd(vadd(vadd(T, vmul(UP, h[1])), vmul(R, l[1])), vmul(dR, l[0]));
  const d2 = vadd(vadd(vadd(vadd(K, vmul(UP, h[2])), vmul(R, l[2])), vmul(dR, 2 * l[1])), vmul(ddR, l[0]));
  const sp = Math.hypot(d1[0], d1[1], d1[2]), Tn = vmul(d1, 1 / sp), kvec = vmul(vadd(d2, vmul(Tn, -dot3(d2, Tn))), 1 / (sp * sp));
  const thn = Math.atan2(Tn[0], Tn[2]), Rn = [Math.cos(thn), 0, -Math.sin(thn)], U0 = vcross(Tn, Rn), phi = x.roll;
  const L = vadd(vmul(Rn, Math.cos(phi)), vmul(U0, Math.sin(phi))), U = vcross(Tn, L);
  return { T: Tn, kvec, L, U };
}
/** validate's centreline load (index.js:367-372) on a lifted frame, with the normal's profile components [nl, nu] */
function load(C, i, fr, nlu) {
  const S = C.base.samples, n = S.length, v = C.r.speed[i].v, va = C.r.speed[Math.max(0, i - 1)].v, vb = C.r.speed[Math.min(n - 1, i + 1)].v, a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)];
  const aT = b.s > a.s ? (vb * vb - va * va) / (2 * (b.s - a.s)) : 0, nn = vadd(vmul(fr.L, nlu[0]), vmul(fr.U, nlu[1]));
  const f = [fr.kvec[0] * v * v + fr.T[0] * aT, fr.kvec[1] * v * v + fr.T[1] * aT + Gc, fr.kvec[2] * v * v + fr.T[2] * aT];
  return dot3(f, nn) / Gc + (dfPerMps * v) / Gc;
}
/** the cross-section a reader takes at global s (the segment holding s; at a segment's end, the one that ends there) */
function profAt(C, s, segHint) {
  let j = segHint;
  if (j === undefined || s < C.segStart[j] - 1e-9 || s > C.segStart[j] + C.segments[j].length + 1e-9) { j = C.segStart.findIndex((a, k) => s >= a - 1e-9 && s <= a + C.segments[k].length + 1e-9); }
  const g = C.segments[j]; return { j, P: PR.readAt(g, Math.max(0, Math.min(g.length, s - C.segStart[j]))) };
}
const urange = (P) => [Math.min(...P.u), Math.max(...P.u)];
/** u on section P whose normal passes through (a, b): (a - X(u)) nu(u) - (b - Y(u)) nl(u) = 0, by bisection near u0 (or over the section) */
function footU(P, a, b, u0) {
  const [ua, ub] = urange(P), F = (u) => { const [X, Y] = PR.offsetAt(P, u), [nl, nu] = PR.normalAt(P, u); return (a - X) * nu - (b - Y) * nl; };
  let lo, hi;
  if (u0 !== undefined) { lo = Math.max(ua, u0 - 0.5); hi = Math.min(ub, u0 + 0.5); }
  else { let best = null; for (let u = ua; u < ub - 1e-12; u = Math.min(ub, u + 0.05)) { const v = Math.min(ub, u + 0.05); if (F(u) * F(v) <= 0) { const m = Math.abs(u - a); if (!best || m < best.m) best = { lo: u, hi: v, m }; } } if (!best) throw new Error(`footU: no foot for (${a}, ${b})`); lo = best.lo; hi = best.hi; }
  let flo = F(lo); if (flo * F(hi) > 0) throw new Error(`footU: not bracketed near ${u0}`);
  for (let k = 0; k < 200 && hi - lo > 1e-13; k++) { const m = (lo + hi) / 2, fm = F(m); if (fm * flo <= 0) hi = m; else { lo = m; flo = fm; } }
  return (lo + hi) / 2;
}
const doc = (sh) => sh.getState().history.present;

// ── the rows on one fixture: Cb the base, Cc C1 from base ──
function row2(fx, Cb, Cc, phiOf = (p, sl) => D.channelAt(Cb.doc.pieces[p], 'phi', sl).v, tag = fx) {   // D678-3 run 2: the bank as a parameter (default: the document's channel, run 1's)
  const S = Cb.base.samples, Sc = Cc.base.samples, rows = [], k1 = [];
  if (S.length !== Sc.length) throw new Error(`${fx}: base and C1 sample counts differ`);
  let diagRoll = 0, diagBaseOff = 0, diagTy = 0, diagRollPhi = 0;
  // the across-position of C1's centre on the base's section at global s: l1, h1 from C1's piece p, phi from the base's piece p (the same pieces)
  const footAt = (p, s, segHint, u0) => {
    const Pc = Cc.doc.pieces[p], Pb = Cb.doc.pieces[p], sl = Math.max(0, Math.min(Pb.length, s - Cb.offs[p]));
    const l1 = D.channelAt(Pc, 'l', sl).v - D.channelAt(Pb, 'l', sl).v, h1 = D.channelAt(Pc, 'h', sl).v - D.channelAt(Pb, 'h', sl).v, phi = phiOf(p, sl);
    const a = l1 * Math.cos(phi) + h1 * Math.sin(phi), b = -l1 * Math.sin(phi) + h1 * Math.cos(phi), { P } = profAt(Cb, s, segHint);
    const u = footU(P, a, b, u0), [X, Y] = PR.offsetAt(P, u), [nl, nu] = PR.normalAt(P, u);
    return { u, X, Y, nl, nu, phi, a, b, t: (a - X) * nl + (b - Y) * nu, P };
  };
  // the line's offsets from the base centre, along R and up: X cos phi - Y sin phi, X sin phi + Y cos phi (no-climb road: U0 is up), plus the base's own l, h (0 here)
  const lineOffs = (p, s, segHint, uFixed, uNear) => {
    const Pb = Cb.doc.pieces[p], sl = Math.max(0, Math.min(Pb.length, s - Cb.offs[p])), phi = phiOf(p, sl), lb = D.channelAt(Pb, 'l', sl).v, hb = D.channelAt(Pb, 'h', sl).v;
    let X, Y;
    if (uFixed !== undefined) { const { P } = profAt(Cb, s, segHint); [X, Y] = PR.offsetAt(P, uFixed); }
    else { const f = footAt(p, s, segHint, uNear); X = f.X; Y = f.Y; }
    return [lb + X * Math.cos(phi) - Y * Math.sin(phi), hb + X * Math.sin(phi) + Y * Math.cos(phi)];
  };
  const win = [];
  for (let i = 0; i < S.length; i++) if (S[i].s >= SN - 1e-9 && S[i].s <= SF + 1e-9) win.push(i);
  // the median across-position over the run (row 2c)
  const us = [];
  for (const i of win) { const x = S[i]; if (x.s < LO - 1e-9 || x.s > HI + 1e-9) continue; const pc = pieceOf(Cb, x); us.push(footAt(pc.p, x.s, x.seg).u); }
  us.sort((a, b) => a - b); const uMed = us[Math.floor(us.length / 2)];
  for (const i of win) {
    const x = S[i], xc = Sc[i], pc = pieceOf(Cb, x), a = pc.s0, b = pc.s0 + pc.L;
    if (Math.abs(x.T[1]) > diagTy) diagTy = Math.abs(x.T[1]);
    diagRoll = Math.max(diagRoll, Math.abs(x.roll - D.channelAt(pc.P, 'phi', Math.max(0, Math.min(pc.L, x.s - a))).v));
    diagRollPhi = Math.max(diagRollPhi, Math.abs(x.roll - phiOf(pc.p, Math.max(0, Math.min(pc.L, x.s - a)))));
    diagBaseOff = Math.max(diagBaseOff, Math.abs(D.channelAt(pc.P, 'l', Math.max(0, Math.min(pc.L, x.s - a))).v), Math.abs(D.channelAt(pc.P, 'h', Math.max(0, Math.min(pc.L, x.s - a))).v));
    // K1: C1's own centre, my lift on C1's unlifted path, against validate's centreline on C1
    const pcc = pieceOf(Cc, xc), Pc = pcc.P, cl = (s) => D.channelAt(Pc, 'l', Math.max(0, Math.min(pcc.L, s - pcc.s0))).v, ch = (s) => D.channelAt(Pc, 'h', Math.max(0, Math.min(pcc.L, s - pcc.s0))).v;
    const frC = lift(Cc, xc, diffs(cl, xc.s, pcc.s0, pcc.s0 + pcc.L), diffs(ch, xc.s, pcc.s0, pcc.s0 + pcc.L));
    const { P: Pc0 } = profAt(Cc, xc.s, xc.seg), nC = PR.normalAt(Pc0, 0), mineC = load(Cc, i, frC, nC), valC = Cc.centre.get(xc.s);
    k1.push({ s: x.s, mine: mineC, validate: valC, diff: valC === undefined ? null : mineC - valC });
    // row 2: the base's surface along C1's centre's foot
    const f0 = footAt(pc.p, x.s, x.seg), lo = (s) => lineOffs(pc.p, s, x.seg, undefined, f0.u);
    const L2 = diffs((s) => lo(s)[0], x.s, a, b), H2 = diffs((s) => lo(s)[1], x.s, a, b), fr2 = lift(Cb, x, L2, H2);
    const r2 = load(Cb, i, fr2, [f0.nl, f0.nu]), r2n = load(Cb, i, fr2, [0, 1]);
    // row 2c: one across-position, the median over the run
    const lc = (s) => lineOffs(pc.p, s, x.seg, uMed), Lc = diffs((s) => lc(s)[0], x.s, a, b), Hc = diffs((s) => lc(s)[1], x.s, a, b), frc = lift(Cb, x, Lc, Hc);
    const { P: Pm } = profAt(Cb, x.s, x.seg), nm = PR.normalAt(Pm, uMed), r2c = load(Cb, i, frc, nm);
    // row 2x: the checker's own lateral lines on the base, either side of the foot
    const ls = (Cb.lines.get(x.s) || []).slice().sort((p1, p2) => p1.u - p2.u);
    let below = null, above = null; for (const ln of ls) { if (ln.u <= f0.u) below = ln; if (ln.u >= f0.u && !above) above = ln; }
    const phiD = diffs((s) => phiOf(pc.p, Math.max(0, Math.min(pc.L, s - a))), x.s, a, b);
    rows.push({ s: x.s, piece: pc.p, uFoot: f0.u, Xfoot: f0.X, Yfoot: f0.Y, psiFootDeg: Math.atan2(-f0.nl * (f0.u > 0 ? 1 : -1), f0.nu) * DEGR, c1AboveSurface: f0.t,
      row2: r2, row2n: r2n, row2c: r2c, row2x: [below && [below.u, below.fHold_g], above && [above.u, above.fHold_g]], c1Validate: valC, baseValidate: Cb.centre.get(x.s),
      phiDeg: x.roll * DEGR, phiDD: phiD[2], kappaH: Math.hypot(...x.kvec) });
  }
  out.diag[tag] = { maxRollVsDocDeg: R4(diagRoll * DEGR), maxRollVsBankUsedRad: diagRollPhi, maxBaseOffset: diagBaseOff, maxTy: diagTy, uMedian: uMed };
  return { rows, k1, uMed };
}
/** row 1: the levelled surface against the base's, along the base's normal, in the base's station plane, every 1 m over [SN, SF] and 0.25 m across */
function row1(fx, base, lev, opts = {}) {   // D678-3 run 2: opts.stations (a Set of s: 1a and 1b over those only), opts.diagU (keep each station's distance there)
  const tb = AD.toPath(base, { step: 1 }), tl = AD.toPath(lev, { step: 1 });
  const Cb = { segments: tb.segments, segStart: [] }, Cl = { segments: tl.segments, segStart: [] };
  for (const C of [Cb, Cl]) { let acc = 0; C.segments.forEach((g) => { C.segStart.push(acc); acc += g.length; }); }
  const byS = (tp) => { const m = new Map(); for (const x of tp.path.samples) if (Math.abs(x.s - Math.round(x.s)) < 1e-9 && !m.has(Math.round(x.s))) m.set(Math.round(x.s), x); return m; };
  const mb = byS(tb), ml = byS(tl), per = new Map();   // per u (key): [min t, max t] over the levelled stretch
  let worst = { t: 0 }, maxT = 0, missing = 0; const diagU = [];
  for (let s = SN; s <= SF; s += 1) {
    if (opts.stations && !opts.stations.has(s)) continue;
    const xb = mb.get(s), xl = ml.get(s); if (!xb || !xl) { missing++; continue; }
    const { P: Pb } = profAt(Cb, s, xb.seg), { P: Pl } = profAt(Cl, s, xl.seg), [ua, ub] = urange(Pb), [la, lb] = urange(Pl);
    const poly = [];
    for (let u = la; u <= lb + 1e-9; u = u + 0.1 > lb && u < lb - 1e-9 ? lb : u + 0.1) {
      const [X, Y] = PR.offsetAt(Pl, u), Q = vadd(vadd(xl.pos, vmul(xl.L, X)), vmul(xl.U, Y)), dq = [Q[0] - xb.pos[0], Q[1] - xb.pos[1], Q[2] - xb.pos[2]];
      poly.push([dot3(dq, xb.L), dot3(dq, xb.U), dot3(dq, xb.T)]);
      if (u >= lb - 1e-9) break;
    }
    for (let k = 0; ; k++) {
      const u = Math.min(ub, ua + 0.25 * k), [X, Y] = PR.offsetAt(Pb, u), [nl, nu] = PR.normalAt(Pb, u);
      let best = null;
      for (let j = 0; j + 1 < poly.length; j++) {
        const q0 = poly[j], q1 = poly[j + 1], ex = q1[0] - q0[0], ey = q1[1] - q0[1], rx = q0[0] - X, ry = q0[1] - Y, det = -nl * ey + ex * nu;
        if (Math.abs(det) < 1e-15) continue;
        const t = (-rx * ey + ex * ry) / det, lam = (nl * ry - nu * rx) / det;
        if (lam < -1e-9 || lam > 1 + 1e-9) continue;
        if (!best || Math.abs(t) < Math.abs(best.t)) best = { t, tc: q0[2] + lam * (q1[2] - q0[2]) };
      }
      if (best) {
        if (Math.abs(best.t) > Math.abs(worst.t)) worst = { t: best.t, s, u };
        maxT = Math.max(maxT, Math.abs(best.tc));
        if (opts.diagU !== undefined && Math.abs(u - opts.diagU) < 1e-9) diagU.push([s, R4(best.t)]);
        if (opts.stations || (s >= WIN.lo - 1e-9 && s <= WIN.hi + 1e-9)) { const key = R4(u), e = per.get(key) || [Infinity, -Infinity]; e[0] = Math.min(e[0], best.t); e[1] = Math.max(e[1], best.t); per.set(key, e); }
      } else missing++;
      if (u >= ub) break;
    }
  }
  let b1 = { spread: 0 };
  for (const [u, [mn, mx]] of per) if (mx - mn > b1.spread) b1 = { spread: mx - mn, u, min: mn, max: mx };
  return { r1a: R4(Math.abs(worst.t)), r1aAt: { s: worst.s, u: R4(worst.u), t: R4(worst.t) }, r1b: R4(b1.spread), r1bAt: { u: b1.u, min: R4(b1.min), max: R4(b1.max) }, maxAlongT: R4(maxT), missing, stations: opts.stations ? [Math.min(...opts.stations), Math.max(...opts.stations), opts.stations.size] : null, diagU };
}

// ── Alt F: C1 with the window's h control points least-squares fitted to the evaluated in-plane target (every 0.25 m), linked joints kept C1 ──
async function levelF(d, W) {
  const c1 = await levelC1(d, W), c = c1.doc, fh = c1.fh, fl = c1.fl, off = SC.pieceOffsets(d), W0 = WIN.lo - WIN.ramp, W1 = WIN.hi + WIN.ramp;
  const target = (s) => { const g = weight(s, WIN.lo, WIN.hi, WIN.ramp), tn = Math.tan(at(c, 'phi', s)), l = at(c, 'l', s), hs = at(d, 'h', s), ls = at(d, 'l', s); return hs + g * (fh(s) - hs) + tn * ((1 - g) * (l - ls) + g * (l - fl(s))); };
  const res = c.pieces.map(() => null); let prev = -1;
  for (let p = 0; p < c.pieces.length; p++) {
    const P = c.pieces[p]; if (P.type !== 'road') continue;
    if (off[p] + P.length < W0 || off[p] > W1) { prev = p; continue; }
    const t = D.knotVector(P), n = P.channels.h.length, changed = [];
    for (let i = 0; i < n; i++) if (!(off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9)) changed.push(i);
    if (!changed.length) { prev = p; continue; }
    const ctrl = P.channels.h.slice(), fixed = new Set();
    // a linked joint whose four control points the fit changes: the first two follow the previous piece's last two, as settle sets them
    if (prev >= 0 && res[prev] && isLinked(c, prev, p, 'h') && changed.includes(0) && changed.includes(1) && res[prev].changed.includes(c.pieces[prev].channels.h.length - 1) && res[prev].changed.includes(c.pieces[prev].channels.h.length - 2)) {
      const Pa = c.pieces[prev], na = Pa.channels.h.length, hh = Pa.length - (Pa.knots.length ? Pa.knots[Pa.knots.length - 1] : 0), hb = P.knots.length ? P.knots[0] : P.length;
      const v = q(res[prev].ctrl[na - 1], D.DEC.h), m = (3 * (v - q(res[prev].ctrl[na - 2], D.DEC.h))) / hh; ctrl[0] = v; ctrl[1] = v + (m * hb) / 3; fixed.add(0); fixed.add(1);
    }
    const free = changed.filter((i) => !fixed.has(i));
    const basis = (i, sl) => { const e = new Array(n).fill(0); e[i] = 1; return D.channelAt({ ...P, channels: { ...P.channels, h: e } }, 'h', sl).v; };
    const lo = Math.max(0, W0 - off[p]), hi = Math.min(P.length, W1 - off[p]), A = free.map(() => new Array(free.length).fill(0)), rhs = new Array(free.length).fill(0);
    for (let sl = lo; sl <= hi + 1e-9; sl += 0.25) {
      const B = new Array(n); for (let i = 0; i < n; i++) B[i] = basis(i, sl);
      let r = target(off[p] + sl); for (let i = 0; i < n; i++) if (!free.includes(i)) r -= ctrl[i] * B[i];
      for (let a2 = 0; a2 < free.length; a2++) { rhs[a2] += B[free[a2]] * r; for (let b2 = 0; b2 < free.length; b2++) A[a2][b2] += B[free[a2]] * B[free[b2]]; }
    }
    const m = free.length, M = A.map((row, k) => [...row, rhs[k]]);
    for (let k = 0; k < m; k++) { let pv = k; for (let r = k + 1; r < m; r++) if (Math.abs(M[r][k]) > Math.abs(M[pv][k])) pv = r; [M[k], M[pv]] = [M[pv], M[k]]; if (Math.abs(M[k][k]) < 1e-14) throw new Error(`altF: singular at piece ${p}`); for (let r = 0; r < m; r++) if (r !== k) { const f = M[r][k] / M[k][k]; for (let cc = k; cc <= m; cc++) M[r][cc] -= f * M[k][cc]; } }
    free.forEach((i, k) => { ctrl[i] = M[k][m] / M[k][k]; });
    for (const i of changed) if (!fixed.has(i)) ctrl[i] = q(ctrl[i], D.DEC.h);
    res[p] = { ctrl, changed: changed.slice() }; prev = p;
  }
  const before = JSON.stringify(res.map((x) => x && x.ctrl));
  const docF = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, 'h', res) }));
  return { doc: docF, c1: c, fh, fl, settleMoved: JSON.stringify(res.map((x) => x && x.ctrl)) !== before };
}

// ── D678-3 run 2: the built bank (bankPlan, adapter.js:433; toSegments reads plan[p].fn, or the channel where it is null, adapter.js:564-579) ──
const PLANS = new WeakMap();
const planOf = (doc) => { let p = PLANS.get(doc); if (!p) PLANS.set(doc, (p = AD.bankPlan(doc))); return p; };
/** the built bank of piece p at local s */
const builtPhi = (doc, p, sl) => { const f = planOf(doc)[p].fn; return f ? f(sl) : D.channelAt(doc.pieces[p], 'phi', sl).v; };
/** the built bank at global s (the first road piece holding s, as at() reads) */
const builtAt = (doc, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return builtPhi(doc, i, Math.min(P.length, Math.max(0, s - off[i]))); } return NaN; };
/** C1b: levelC1 (copied above) with one change, tan of the built bank of the levelled road at the control point in place of the channel */
async function levelC1b(d, W) {
  const fw = easeOf(d, 'w'), fh = easeOf(d, 'h'), fl = easeOf(d, 'l');
  const dStar = levelGen(d, { w: fw, l: fl }, WIN), d1 = levelGen(d, { w: W }, WIN);
  const g0 = await pathOf(d), g1 = await pathOf(d1), gS = await pathOf(dStar), L1 = endOf(d1), off = SC.pieceOffsets(d), res = { l: [], h: [] };
  const W0 = WIN.lo - WIN.ramp, W1 = WIN.hi + WIN.ramp;
  d.pieces.forEach((P, p) => {
    if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) { res.l.push(null); res.h.push(null); return; }
    const t = D.knotVector(P), l = P.channels.l.slice(), h = P.channels.h.slice(), changed = [];
    for (let i = 0; i < l.length; i++) {
      if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
      const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, WIN.lo, WIN.hi, WIN.ramp);
      const dw = d1.pieces[p].channels.w[i] - P.channels.w[i];
      if (!(g > 0) && Math.abs(dw) < 1e-12) continue;
      const s = Math.min(L1, Math.max(0, sI)), F0R = rimR(g0, s), F1R = rimR(g1, s), lamStar = at(dStar, 'l', s) + rimR(gS, s);
      l[i] = (1 - g) * (P.channels.l[i] + F0R - F1R) + g * (lamStar - F1R);
      const tn = Math.tan(builtAt(d1, s));   // D678-3 run 2: the one change
      h[i] = P.channels.h[i] + g * (fh(sI) - P.channels.h[i]) + tn * ((1 - g) * (l[i] - P.channels.l[i]) + g * (l[i] - fl(sI)));
      changed.push(i);
    }
    res.l.push({ ctrl: l, changed: changed.slice() }); res.h.push({ ctrl: h, changed: changed.slice() });
  });
  let c = d1;
  for (const ch of ['l', 'h']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch]) }));
  return { doc: c, fh, fl };
}
/** centreOff (above) with the built bank in the target */
function centreOffBuilt(d, start, fh, fl) {
  let m = 0;
  for (let s = SN; s <= SF + 1e-9; s += 1) {
    const g = weight(s, WIN.lo, WIN.hi, WIN.ramp), tn = Math.tan(builtAt(d, s)), l = at(d, 'l', s), hs = at(start, 'h', s), ls = at(start, 'l', s);
    const target = hs + g * (fh(s) - hs) + tn * ((1 - g) * (l - ls) + g * (l - fl(s)));
    m = Math.max(m, Math.abs(at(d, 'h', s) - target));
  }
  return R4(m);
}

// ── the run (run 2) ──
(async () => {
  const run = async (name, f) => { try { await f(); return true; } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 900)); return false; } };
  const FIX = { Bminus: ['plan', -20, undefined], Bplus: ['plan', 20, undefined], Bhold: ['hold', -20, undefined], Bminus0: ['plan', -20, 0], Bplus0: ['plan', 20, 0], Bhold0: ['hold', -20, 0] };
  const bases = {}, c1s = {}, c1bs = {}, Cs = {};
  out.K2 = {}; out.row2b = {}; out.row2bC1b = {}; out.C1b = {}; out.row1p = {}; out.row1diag = {};
  // K0, as run 1 (the fixtures and C1 rebuilt; the same reds read two ways)
  const ok0 = await run('K0', async () => {
    for (const [fx, [layout, bank, cup]] of Object.entries(FIX)) {
      const base = bases[fx] = makeBase(layout, bank, cup), lv = c1s[fx] = await levelC1(base, 16);
      const Cb = checked(base), Cc = checked(lv.doc); Cs[fx] = { Cb, Cc };
      const jb = reds(base), jc = reds(lv.doc), ls = (j) => j.redList.filter((x) => x.reason === 'leaves-surface').map((x) => [x.s, x.s1 === undefined ? x.s : x.s1]);
      const k = out.K0[fx] = { baseSha: sha(base), c1Sha: sha(lv.doc), jobBase: ls(jb), directBase: Cb.leaves, jobC1: ls(jc), directC1: Cc.leaves };
      k.sameReds = JSON.stringify(k.jobBase) === JSON.stringify(k.directBase) && JSON.stringify(k.jobC1) === JSON.stringify(k.directC1);
      if (cup === undefined) { const p2b = P2.fixtures[fx].baseSha, p2c = (P2.rows.find((r) => r.name === `${fx} C1 from base`) || {}).sha; k.sameBytes = k.baseSha === p2b && k.c1Sha === p2c; }
      k.pass = k.sameReds && (k.sameBytes !== false);
      write();
    }
  });
  out.K0.pass = ok0 && Object.values(out.K0).filter((x) => x && typeof x === 'object').every((x) => x.pass);
  if (!out.K0.pass) { out.verdict = 'K0 failed: stop, said so'; out.ended = new Date().toISOString(); write(); return; }
  // K2: the built bank against the path's roll at every station of [SN, SF], on the base; and the levelled road's built bank against the base's (no bar)
  for (const fx of Object.keys(FIX)) {
    await run(`K2 ${fx}`, async () => {
      const { Cb, Cc } = Cs[fx]; let worst = { d: 0 }, n = 0, lvl = 0;
      for (const x of Cb.base.samples) {
        if (x.s < SN - 1e-9 || x.s > SF + 1e-9) continue;
        const pc = pieceOf(Cb, x), sl = Math.max(0, Math.min(pc.L, x.s - pc.s0)), d = Math.abs(x.roll - builtPhi(base(fx), pc.p, sl)); n++;
        if (d > worst.d) worst = { d, s: x.s };
        lvl = Math.max(lvl, Math.abs(builtPhi(Cc.doc, pc.p, sl) - builtPhi(base(fx), pc.p, sl)));
      }
      out.K2[fx] = { stations: n, maxAbsRad: worst.d, at: worst.s, pass: worst.d <= 1e-9, levelledVsBaseRad: lvl };
      write();
    });
  }
  function base(fx) { return bases[fx]; }
  out.K2.pass = Object.keys(FIX).every((fx) => out.K2[fx] && out.K2[fx].pass);
  if (!out.K2.pass) { out.verdict = 'K2 failed: I cannot read the built bank'; out.ended = new Date().toISOString(); write(); return; }
  const rnd = (rows) => rows.map((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, Array.isArray(v) ? v.map((y) => (Array.isArray(y) ? y.map(R4) : R4(y))) : R4(v)])));
  // 2b: row 2 with the built bank, along C1's centre; and (not registered, no bar) along C1b's centre
  const r2b = {}, r2bb = {};
  for (const fx of Object.keys(FIX)) {
    await run(`2b ${fx}`, async () => {
      const Cb = Cs[fx].Cb, phiOf = (p, sl) => builtPhi(Cb.doc, p, sl);
      const a = row2(fx, Cb, Cs[fx].Cc, phiOf, `${fx} 2b`); r2b[fx] = a.rows; out.row2b[fx] = { uMedianRun: R4(a.uMed), rows: rnd(a.rows) };
      // C1b
      const lb = c1bs[fx] = await levelC1b(bases[fx], 16), Cbb = checked(lb.doc); Cs[fx].Cbb = Cbb;
      const b = row2(fx, Cb, Cbb, phiOf, `${fx} 2b C1b`); r2bb[fx] = b.rows; out.row2bC1b[fx] = { uMedianRun: R4(b.uMed), rows: rnd(b.rows) };
      write();
    });
  }
  // C1b's rows, against its registered failing result
  for (const fx of Object.keys(FIX)) {
    await run(`C1b ${fx}`, async () => {
      const base = bases[fx], lb = c1bs[fx], jb = reds(base), jf = reds(lb.doc), inBase = (x) => jb.redList.some((b) => overlaps(x, b));
      let outside = 0; const end = endOf(lb.doc);
      for (let s = 0; s <= end + 1e-9; s += 1) { if (s >= SN - 1e-9 && s <= SF + 1e-9) continue; for (const ch of ['w', 'l', 'h', 'phi', 'c']) outside = Math.max(outside, Math.abs(at(lb.doc, ch, s) - at(base, ch, s))); }
      const r = { sha: sha(lb.doc), sameBytesAsC1: sha(lb.doc) === sha(c1s[fx].doc), centreOffBuilt: centreOffBuilt(lb.doc, base, lb.fh, lb.fl), c1CentreOffBuilt: centreOffBuilt(c1s[fx].doc, base, c1s[fx].fh, c1s[fx].fl),
        leaves: Cs[fx].Cbb.leaves, redList: jf.redList, amber: jf.amber, redTheBaseLacks: jf.redList.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= SN && x.s <= SF && !inBase(x)), outside };
      const hold = fx === 'Bhold' || fx === 'Bhold0';
      r.fails = (!hold && r.redTheBaseLacks.length > 0) || (hold && (jf.redList.length > 0 || !r.sameBytesAsC1)) || r.centreOffBuilt > 0.05 || r.outside !== 0;
      r.centreBand = r.centreOffBuilt <= 0.01 ? 'pass' : r.centreOffBuilt > 0.05 ? 'fail' : 'between';
      out.C1b[fx] = r; write();
    });
  }
  // row 1': C1 and C1b against the base, over the stations where the levelled road's width is 16 +- 0.001
  for (const fx of Object.keys(FIX)) {
    await run(`row1p ${fx}`, async () => {
      const st = new Set(); for (let s = SN; s <= SF; s += 1) if (Math.abs(at(c1s[fx].doc, 'w', s) - 16) <= 0.001) st.add(s);
      out.row1p[fx] = { C1: row1(fx, bases[fx], c1s[fx].doc, { stations: st }), C1b: row1(fx, bases[fx], c1bs[fx].doc, { stations: st }) };
      write();
    });
  }
  // the row 1 diagnostic: Bhold as run 1 ran it, each station's distance at u 5.75 kept
  await run('row1diag', async () => { out.row1diag.Bhold = row1('Bhold', bases.Bhold, c1s.Bhold.doc, { diagU: 5.75 }); write(); });
  // the summaries the reading reads
  const inR = (rows, s0, s1) => (rows || []).filter((x) => x.s >= s0 - 1e-9 && x.s <= s1 + 1e-9);
  const sum = (rows, s0, s1) => { const xs = inR(rows, s0, s1); return { stations: xs.map((x) => x.s), row2b: xs.map((x) => R4(x.row2)), row2bn: xs.map((x) => R4(x.row2n)), row2bc: xs.map((x) => R4(x.row2c)), row2x: xs.map((x) => x.row2x.map((y) => y && R4(y[1]))), lineValidate: xs.map((x) => R4(x.c1Validate)), phiDeg: xs.map((x) => R4(x.phiDeg)), phiDD: xs.map((x) => x.phiDD), anyRed: xs.some((x) => x.row2 < 0) }; };
  const RANGES = { Bminus: [256, 258], Bplus: [200, 206], Bminus0: [256, 258], Bplus0: [200, 206] };
  out.ranges2b = Object.fromEntries(Object.entries(RANGES).map(([fx, [a, b]]) => [fx, sum(r2b[fx], a, b)]));
  out.ranges2bC1b = Object.fromEntries(Object.entries(RANGES).map(([fx, [a, b]]) => [fx, sum(r2bb[fx], a, b)]));
  const allW = (rows) => { const xs = rows || []; const m = xs.reduce((a, x) => (x.row2 < a.v ? { v: x.row2, s: x.s } : a), { v: Infinity }); return { minRow2b: R4(m.v), at: m.s, redStations: xs.filter((x) => x.row2 < 0).map((x) => x.s), lineRedStations: xs.filter((x) => x.c1Validate < 0).map((x) => x.s), maxPhiDD: xs.reduce((a, x) => (Math.abs(x.phiDD) > Math.abs(a.v) ? { v: x.phiDD, s: x.s } : a), { v: 0 }) }; };
  out.windowWide2b = Object.fromEntries(Object.keys(FIX).map((fx) => [fx, allW(r2b[fx])]));
  out.windowWide2bC1b = Object.fromEntries(Object.keys(FIX).map((fx) => [fx, allW(r2bb[fx])]));
  // the reading, as registered: no red at the C1 red stations on all four -> the level's; red there on all four -> the designed surface's; otherwise by station
  const reds4 = Object.keys(RANGES).map((fx) => out.ranges2b[fx] && out.ranges2b[fx].anyRed);
  out.reading = reds4.every((x) => x === false) ? "no 2b red at the C1 red stations: the red there is the level's" : reds4.every((x) => x === true) ? "2b red at the C1 red stations: the red is the designed surface's" : 'by station: ' + JSON.stringify(Object.fromEntries(Object.keys(RANGES).map((fx, i) => [fx, reds4[i]])));
  out.ended = new Date().toISOString(); write();
})().catch((e) => { out.errors.push(String(e && e.stack || e)); out.ended = new Date().toISOString(); write(); process.exitCode = 1; });
