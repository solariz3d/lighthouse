// even678b.js (pane A, D678 probe 3, measure only; nothing of the grab is built): the level's red where the bank changes, the level's or the surface's?
//   node even678b.js <builder tree at c522ea6> <out dir> <even678.json, probe 2's figures>
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
const write = () => fs.writeFileSync(path.join(OUT, 'even678b.json'), JSON.stringify(out, null, 1));

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
function row2(fx, Cb, Cc) {
  const S = Cb.base.samples, Sc = Cc.base.samples, rows = [], k1 = [];
  if (S.length !== Sc.length) throw new Error(`${fx}: base and C1 sample counts differ`);
  let diagRoll = 0, diagBaseOff = 0, diagTy = 0;
  // the across-position of C1's centre on the base's section at global s: l1, h1 from C1's piece p, phi from the base's piece p (the same pieces)
  const footAt = (p, s, segHint, u0) => {
    const Pc = Cc.doc.pieces[p], Pb = Cb.doc.pieces[p], sl = Math.max(0, Math.min(Pb.length, s - Cb.offs[p]));
    const l1 = D.channelAt(Pc, 'l', sl).v - D.channelAt(Pb, 'l', sl).v, h1 = D.channelAt(Pc, 'h', sl).v - D.channelAt(Pb, 'h', sl).v, phi = D.channelAt(Pb, 'phi', sl).v;
    const a = l1 * Math.cos(phi) + h1 * Math.sin(phi), b = -l1 * Math.sin(phi) + h1 * Math.cos(phi), { P } = profAt(Cb, s, segHint);
    const u = footU(P, a, b, u0), [X, Y] = PR.offsetAt(P, u), [nl, nu] = PR.normalAt(P, u);
    return { u, X, Y, nl, nu, phi, a, b, t: (a - X) * nl + (b - Y) * nu, P };
  };
  // the line's offsets from the base centre, along R and up: X cos phi - Y sin phi, X sin phi + Y cos phi (no-climb road: U0 is up), plus the base's own l, h (0 here)
  const lineOffs = (p, s, segHint, uFixed, uNear) => {
    const Pb = Cb.doc.pieces[p], sl = Math.max(0, Math.min(Pb.length, s - Cb.offs[p])), phi = D.channelAt(Pb, 'phi', sl).v, lb = D.channelAt(Pb, 'l', sl).v, hb = D.channelAt(Pb, 'h', sl).v;
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
    const phiD = diffs((s) => D.channelAt(pc.P, 'phi', Math.max(0, Math.min(pc.L, s - a))).v, x.s, a, b);
    rows.push({ s: x.s, piece: pc.p, uFoot: f0.u, Xfoot: f0.X, Yfoot: f0.Y, psiFootDeg: Math.atan2(-f0.nl * (f0.u > 0 ? 1 : -1), f0.nu) * DEGR, c1AboveSurface: f0.t,
      row2: r2, row2n: r2n, row2c: r2c, row2x: [below && [below.u, below.fHold_g], above && [above.u, above.fHold_g]], c1Validate: valC, baseValidate: Cb.centre.get(x.s),
      phiDeg: x.roll * DEGR, phiDD: phiD[2], kappaH: Math.hypot(...x.kvec) });
  }
  out.diag[fx] = { maxRollVsDocDeg: R4(diagRoll * DEGR), maxBaseOffset: diagBaseOff, maxTy: diagTy, uMedian: uMed };
  return { rows, k1, uMed };
}
/** row 1: the levelled surface against the base's, along the base's normal, in the base's station plane, every 1 m over [SN, SF] and 0.25 m across */
function row1(fx, base, lev) {
  const tb = AD.toPath(base, { step: 1 }), tl = AD.toPath(lev, { step: 1 });
  const Cb = { segments: tb.segments, segStart: [] }, Cl = { segments: tl.segments, segStart: [] };
  for (const C of [Cb, Cl]) { let acc = 0; C.segments.forEach((g) => { C.segStart.push(acc); acc += g.length; }); }
  const byS = (tp) => { const m = new Map(); for (const x of tp.path.samples) if (Math.abs(x.s - Math.round(x.s)) < 1e-9 && !m.has(Math.round(x.s))) m.set(Math.round(x.s), x); return m; };
  const mb = byS(tb), ml = byS(tl), per = new Map();   // per u (key): [min t, max t] over the levelled stretch
  let worst = { t: 0 }, maxT = 0, missing = 0;
  for (let s = SN; s <= SF; s += 1) {
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
        if (s >= WIN.lo - 1e-9 && s <= WIN.hi + 1e-9) { const key = R4(u), e = per.get(key) || [Infinity, -Infinity]; e[0] = Math.min(e[0], best.t); e[1] = Math.max(e[1], best.t); per.set(key, e); }
      } else missing++;
      if (u >= ub) break;
    }
  }
  let b1 = { spread: 0 };
  for (const [u, [mn, mx]] of per) if (mx - mn > b1.spread) b1 = { spread: mx - mn, u, min: mn, max: mx };
  return { r1a: R4(Math.abs(worst.t)), r1aAt: { s: worst.s, u: R4(worst.u), t: R4(worst.t) }, r1b: R4(b1.spread), r1bAt: { u: b1.u, min: R4(b1.min), max: R4(b1.max) }, maxAlongT: R4(maxT), missing };
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

// ── the run ──
(async () => {
  const run = async (name, f) => { try { await f(); return true; } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 900)); return false; } };
  const FIX = { Bminus: ['plan', -20, undefined], Bplus: ['plan', 20, undefined], Bhold: ['hold', -20, undefined], Bminus0: ['plan', -20, 0], Bplus0: ['plan', 20, 0], Bhold0: ['hold', -20, 0] };
  const bases = {}, c1s = {}, Cs = {};
  // K0
  const ok0 = await run('K0', async () => {
    for (const [fx, [layout, bank, cup]] of Object.entries(FIX)) {
      const base = bases[fx] = makeBase(layout, bank, cup), lv = c1s[fx] = await levelC1(base, 16);
      const Cb = checked(base), Cc = checked(lv.doc); Cs[fx] = { Cb, Cc };
      const jb = reds(base), jc = reds(lv.doc), ls = (j) => j.redList.filter((x) => x.reason === 'leaves-surface').map((x) => [x.s, x.s1 === undefined ? x.s : x.s1]);
      const k = out.K0[fx] = { baseSha: sha(base), c1Sha: sha(lv.doc), jobBase: ls(jb), directBase: Cb.leaves, jobC1: ls(jc), directC1: Cc.leaves, jobC1All: jc.redList, jobBaseAll: jb.redList, jobAmber: [jb.amber, jc.amber] };
      k.sameReds = JSON.stringify(k.jobBase) === JSON.stringify(k.directBase) && JSON.stringify(k.jobC1) === JSON.stringify(k.directC1);
      if (cup === undefined) {
        const p2b = P2.fixtures[fx].baseSha, p2c = (P2.rows.find((r) => r.name === `${fx} C1 from base`) || {}).sha;
        k.p2BaseSha = p2b; k.p2C1Sha = p2c; k.sameBytes = k.baseSha === p2b && k.c1Sha === p2c;
      }
      k.pass = k.sameReds && (k.sameBytes !== false);
      k.c1CentreOffPlane = centreOff(lv.doc, base, lv.fh, lv.fl);
      write();
    }
  });
  out.K0.pass = ok0 && Object.values(out.K0).filter((x) => x && typeof x === 'object').every((x) => x.pass);
  if (!out.K0.pass) { out.verdict = 'K0 failed: stop, said so'; out.ended = new Date().toISOString(); write(); return; }
  // K1 and row 2
  const r2 = {};
  for (const fx of Object.keys(FIX)) {
    await run(`row2 ${fx}`, async () => {
      const { rows, k1, uMed } = row2(fx, Cs[fx].Cb, Cs[fx].Cc); r2[fx] = rows;
      const dif = k1.filter((x) => x.diff !== null).map((x) => Math.abs(x.diff)), worst = k1.reduce((m, x) => (x.diff !== null && Math.abs(x.diff) > Math.abs(m.diff || 0) ? x : m), { diff: 0 });
      out.K1[fx] = { stations: k1.length, compared: dif.length, maxAbsG: R4(Math.max(...dif) * 1e4) / 1e4, maxAbsGExact: Math.max(...dif), worstAt: worst.s, pass: Math.max(...dif) <= 0.001, fail: Math.max(...dif) > 0.01 };
      out.row2[fx] = { uMedianRun: R4(uMed), rows: rows.map((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, Array.isArray(v) ? v.map((y) => (Array.isArray(y) ? y.map(R4) : R4(y))) : R4(v)]))) };
      write();
    });
  }
  out.K1.pass = Object.keys(FIX).every((fx) => out.K1[fx] && out.K1[fx].pass);
  out.K1.fail = Object.keys(FIX).some((fx) => !out.K1[fx] || out.K1[fx].fail);
  if (out.K1.fail) { out.verdict = 'K1 failed: the question cannot be separated with my measure'; out.ended = new Date().toISOString(); write(); return; }
  // row 1
  for (const fx of Object.keys(FIX)) await run(`row1 ${fx}`, async () => { out.row1[fx] = row1(fx, bases[fx], c1s[fx].doc); write(); });
  // the summaries the branch reads
  const inRange = (fx, s0, s1) => (r2[fx] || []).filter((x) => x.s >= s0 - 1e-9 && x.s <= s1 + 1e-9);
  const sum = (fx, s0, s1) => { const xs = inRange(fx, s0, s1); return { stations: xs.map((x) => x.s), row2: xs.map((x) => R4(x.row2)), row2n: xs.map((x) => R4(x.row2n)), row2c: xs.map((x) => R4(x.row2c)), row2x: xs.map((x) => x.row2x.map((y) => y && R4(y[1]))), c1: xs.map((x) => R4(x.c1Validate)), base: xs.map((x) => R4(x.baseValidate)), anyRed: xs.some((x) => x.row2 < 0) }; };
  out.ranges = { Bminus: sum('Bminus', 256, 258), Bplus: sum('Bplus', 200, 206), Bminus0: sum('Bminus0', 256, 258), Bplus0: sum('Bplus0', 200, 206) };
  const allW = (fx) => { const xs = r2[fx] || []; const m = xs.reduce((a, x) => (x.row2 < a.v ? { v: x.row2, s: x.s } : a), { v: Infinity }); return { minRow2: R4(m.v), at: m.s, redStations: xs.filter((x) => x.row2 < 0).map((x) => x.s), c1RedStations: xs.filter((x) => x.c1Validate < 0).map((x) => x.s) }; };
  out.windowWide = Object.fromEntries(Object.keys(FIX).map((fx) => [fx, allW(fx)]));
  // row 3, the control
  const bh = out.row1.Bhold || {}, bh0 = out.row1.Bhold0 || {}, bhr = r2.Bhold || [];
  out.row3 = { r1bBhold: bh.r1b, r1aBhold0: bh0.r1a, row2MinBhold: out.windowWide.Bhold.minRow2, pass: bh.r1b <= 0.01 && bh0.r1a <= 0.01 && bhr.length > 0 && bhr.every((x) => x.row2 >= 0) };
  if (!out.row3.pass) { out.branch = 'none: the control failed (row 3)'; }
  else {
    const red = out.ranges.Bminus.anyRed && out.ranges.Bplus.anyRed, none = !out.ranges.Bminus.anyRed && !out.ranges.Bplus.anyRed, b1 = out.row1.Bminus.r1b <= 0.05 && out.row1.Bplus.r1b <= 0.05;
    out.branch = red && b1 ? 'A' : none ? 'B' : 'mixed';
  }
  write();
  // Alt F, only in branch B or mixed
  if (out.branch === 'B' || out.branch === 'mixed') {
    out.altF = {};
    for (const fx of ['Bminus', 'Bplus', 'Bhold']) {
      await run(`altF ${fx}`, async () => {
        const base = bases[fx], F = await levelF(base, 16), jb = reds(base), jf = reds(F.doc), inBase = (x) => jb.redList.some((b) => overlaps(x, b));
        let outside = 0, vsC1 = 0; const end = endOf(F.doc);
        for (let s = 0; s <= end + 1e-9; s += 1) {
          if (s >= SN - 1e-9 && s <= SF + 1e-9) { for (const ch of ['w', 'l', 'h']) vsC1 = Math.max(vsC1, Math.abs(at(F.doc, ch, s) - at(F.c1, ch, s))); continue; }
          for (const ch of ['w', 'l', 'h', 'phi', 'c']) outside = Math.max(outside, Math.abs(at(F.doc, ch, s) - at(base, ch, s)));
        }
        const r = { sha: sha(F.doc), settleMoved: F.settleMoved, centreOffPlane: centreOff(F.doc, base, F.fh, F.fl), redList: jf.redList, amber: jf.amber, redTheBaseLacks: jf.redList.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= SN && x.s <= SF && !inBase(x)).length, outside, vsC1: R4(vsC1) };
        r.fails = r.redTheBaseLacks > 0 || r.centreOffPlane > 0.002 || r.outside !== 0 || (fx === 'Bhold' && (jf.redList.length > 0 || r.vsC1 > 0.001));
        out.altF[fx] = r; write();
      });
    }
  }
  out.ended = new Date().toISOString(); write();
})().catch((e) => { out.errors.push(String(e && e.stack || e)); out.ended = new Date().toISOString(); write(); process.exitCode = 1; });
