// even678.js (pane A, D678 track 2, measure only; nothing of the grab is built): the banked Even probe, the second one.
//   node even678.js <builder tree at c522ea6> <out dir> <bank267.json, L267's published figures>
// The rows, the candidates and each candidate's failing result are registered in handback/p-d678-even-banked-probe2-A_2026-11-27.md (ca7e726d) BEFORE this
// was written. The fixtures, the grab, the window, the measures and E6/E5k (levelDir) are L267's bank267.js, copied unchanged unless marked D678.
//   stage 1, THE CONTROL (K1 K2 K3): the flat road levelled by E6 must reproduce E5's published figures, C1 on it must be byte-identical to E6, and the rebuilt
//   fixtures must match bank267.json. If any fails, the probe writes what it has and stops: no banked row is computed.
//   stage 2: C3a (the chord grab against today's on F and F0), then on B-, Bhold and B+: the starts (base, T1, T2b, T1c, T2bc), C1, 1+2p, 1+2r and 3+1.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT, L267P] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const L267 = JSON.parse(fs.readFileSync(L267P, 'utf8'));
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createCheckJob } = require(path.join(T, 'app/validate-ui/checkjob.js'));
const R4 = (x) => Math.round(x * 1e4) / 1e4, DEGR = 180 / Math.PI;
const out = { started: new Date().toISOString(), tree: T, node: process.version, control: {}, fixtures: {}, follows: {}, c3a: [], twoR: {}, rows: [], test: [], verdict: {}, errors: [] };
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex');
const write = () => fs.writeFileSync(path.join(OUT, 'even678.json'), JSON.stringify(out, null, 1));

// ── the fixtures: bank267.js's LAYOUT and makeBase, unchanged; D678 adds the cup argument for F0 (amend265.js's way: cup 0 passed to extendOptions) ──
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
const stats = (xs) => { const mn = Math.min(...xs), mx = Math.max(...xs); return { min: R4(mn), max: R4(mx), spread: R4(mx - mn) }; };
const endOf = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
async function shellOn(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); sh.setSculpt(true); return sh; }
async function pathOf(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); const rs = sh.getState().resolved; return { rs, path: G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) }) }; }
const msg = (sh) => sh.getState().message;
const rotb = (a, c, ang) => [a * Math.cos(ang) - c * Math.sin(ang), a * Math.sin(ang) + c * Math.cos(ang)];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ── D678 candidate 3, scratch only: zonegrab.js follow with ONE change, marked. Everything else is follow's own text ──
function followChord(delta, frame) {
  if (!frame || !Array.isArray(delta) || delta.length !== 3 || !delta.every(Number.isFinite)) return null;
  const { T: Tn, R, U0, cos, sin, w, oP, oF } = frame, upY = U0[1];
  if (!(upY > ZG.UP_MIN)) return null;
  const f = dot3(delta, Tn), p = [0, 1, 2].map((k) => delta[k] - f * Tn[k]); let e = dot3(p, R), v = dot3(p, U0);
  const rot = (a, b, c = cos, s = sin) => [a * c - b * s, a * s + b * c];
  const slide = (dR, dU) => ({ h: dU / upY, l: dR });
  if (!(Math.abs(frame.u) >= ZG.HINGE_U)) return slide(e, v);
  const v0 = rot(oP[0] - oF[0], oP[1] - oF[1]), n0 = Math.hypot(v0[0], v0[1]);
  if (!(n0 > 1e-9)) return slide(e, v);
  { const t = (e * v0[0] + v * v0[1]) / (n0 * n0); e = t * v0[0]; v = t * v0[1]; }   // D678 (3): the drag's in-plane part projected onto the chord: it stretches, it does not turn
  const v1 = [v0[0] + e, v0[1] + v], short = Math.max(0, ZG.SQUEEZE_MIN * n0 * n0 - (v1[0] * v0[0] + v1[1] * v0[1])) / (n0 * n0);
  v1[0] += short * v0[0]; v1[1] += short * v0[1];
  const k = Math.hypot(v1[0], v1[1]) / n0, dphi = Math.atan2(v0[0] * v1[1] - v0[1] * v1[0], v0[0] * v1[0] + v0[1] * v1[1]);
  const c1 = Math.cos(dphi) * cos - Math.sin(dphi) * sin, s1 = Math.sin(dphi) * cos + Math.cos(dphi) * sin;
  const F0 = rot(oF[0], oF[1]), F1 = rot(oF[0] * k, oF[1] * k, c1, s1);
  return { ...slide(F0[0] - F1[0], F0[1] - F1[1]), w: w * (k - 1), phi: dphi };
}
/** his gesture, as bank267.js (even265.js): press the OUTER (right) rim at s, pull it straight out (horizontal, along -R) by want - w; D678: the follow is a parameter */
function grab(sh, s, want, r = 30, followFn = ZG.follow) {
  const d = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), push = fr.R.map((k) => -k * e);
  const delta = followFn(push, fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${msg(sh)}`);
  sh.brushTo(delta); sh.endBrush();
  return Object.fromEntries(Object.entries(delta).map(([k, v]) => [k, R4(v)]));
}
const doc = (sh) => sh.getState().history.present;
async function startsOf(base, followFn) {
  const st = {};
  { const sh = await shellOn(base); st.followT1 = grab(sh, MID, 16, 30, followFn); st.T1 = doc(sh); }
  { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16, 30, followFn); st.T2b = doc(sh); }
  return st;
}

// ── the prototypes' shared parts: bank267.js's weight, quantum, settle, levelGen, easeOf, rimR, levelDir, unchanged ──
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
/** E6 (keepBank false) and E5k (keepBank true), bank267.js's levelDir, unchanged: the flat control's reference (K1, K2) */
async function levelDir(d, W, keepBank) {
  const fw = easeOf(d, 'w'), fphi = easeOf(d, 'phi'), fh = easeOf(d, 'h'), fl = easeOf(d, 'l');
  const dStar = levelGen(d, keepBank ? { w: fw, l: fl } : { w: fw, phi: fphi, l: fl }, WIN);
  const d1 = levelGen(d, keepBank ? { w: W } : { w: W, phi: fphi }, WIN);
  const g0 = await pathOf(d), g1 = await pathOf(d1), gS = await pathOf(dStar), L1 = endOf(d1), off = SC.pieceOffsets(d), res = { l: [], h: [] };
  const W0 = WIN.lo - WIN.ramp, W1 = WIN.hi + WIN.ramp;
  d.pieces.forEach((P, p) => {
    if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) { res.l.push(null); res.h.push(null); return; }
    const t = D.knotVector(P), l = P.channels.l.slice(), h = P.channels.h.slice(), changed = [];
    for (let i = 0; i < l.length; i++) {
      if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
      const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, WIN.lo, WIN.hi, WIN.ramp);
      const dw = d1.pieces[p].channels.w[i] - P.channels.w[i], dphi = d1.pieces[p].channels.phi[i] - P.channels.phi[i];
      if (!(g > 0) && Math.abs(dw) < 1e-12 && Math.abs(dphi) < 1e-12) continue;
      const s = Math.min(L1, Math.max(0, sI)), F0R = rimR(g0, s), F1R = rimR(g1, s), lamStar = at(dStar, 'l', s) + rimR(gS, s);
      l[i] = (1 - g) * (P.channels.l[i] + F0R - F1R) + g * (lamStar - F1R);
      h[i] = P.channels.h[i] + g * (fh(sI) - P.channels.h[i]);
      changed.push(i);
    }
    res.l.push({ ctrl: l, changed: changed.slice() }); res.h.push({ ctrl: h, changed: changed.slice() });
  });
  let c = d1;
  for (const ch of ['l', 'h']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch]) }));
  return { doc: c, fh };
}

// ── D678: candidate 2's two readable forms, as a change to the bank's control points inside the window (weight g), the rest of the bank as found ──
/** change channel ch's control points in the window by fn(P, p, i, sI, g) -> the new value; settled as levelGen settles */
function changeCtrl(d, ch, fn) {
  const off = SC.pieceOffsets(d), W0 = WIN.lo - WIN.ramp, W1 = WIN.hi + WIN.ramp;
  const res = d.pieces.map((P, p) => {
    if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) return null;
    const t = D.knotVector(P), c = P.channels[ch], ctrl = c.slice(), changed = [];
    for (let i = 0; i < c.length; i++) {
      if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
      const sI = off[p] + SC.knotAverage(t, i); ctrl[i] = fn(P, p, i, sI, weight(sI, WIN.lo, WIN.hi, WIN.ramp)); changed.push(i);
    }
    return { ctrl, changed };
  });
  return Object.freeze(D.checkDoc({ ...d, pieces: settle(d, ch, res) }));
}
const clamp1 = (x) => Math.max(-1, Math.min(1, x));
/** 2p, per station: phi = asin((w / w_ease) sin phi_found), at the stored values */
function given2p(d) { const fw = easeOf(d, 'w'); return changeCtrl(d, 'phi', (P, p, i, sI, g) => { const c = P.channels.phi[i], v = Math.asin(clamp1((P.channels.w[i] / fw(sI)) * Math.sin(c))); return c + g * (v - c); }); }
/** 2r, one grab: rho from the invariant at the width excess's peak in the window; phi = phi_found - rho (w - w_ease) */
function given2r(d, tag) {
  const fw = easeOf(d, 'w'); let s0 = null, ex = -Infinity;
  for (let s = SN; s <= SF + 1e-9; s += 1) { const x = at(d, 'w', s) - fw(s); if (x > ex) { ex = x; s0 = s; } }
  if (!(ex > 1e-6)) { out.twoR[tag] = { s0, excess: R4(ex), rho: 0 }; return d; }
  const p1 = at(d, 'phi', s0), p0 = Math.asin(clamp1((at(d, 'w', s0) / fw(s0)) * Math.sin(p1))), rho = (p1 - p0) / ex;
  out.twoR[tag] = { s0, excess: R4(ex), phiFoundDeg: R4(p1 * DEGR), phiAtPressDeg: R4(p0 * DEGR), rhoDegPerM: R4(rho * DEGR) };
  return changeCtrl(d, 'phi', (P, p, i, sI, g) => P.channels.phi[i] - g * rho * (P.channels.w[i] - fw(sI)));
}
/**
 * C1: the centre within the road's own plane, the bank kept as found (the bank given back first for 1+2). Width and l as E5k (levelDir, keepBank true); h is
 * levelDir's h plus tan(phi) times the sideways move: (1 - g) (l_new - l_start) + g (l_new - l_ease), phi the levelled road's bank at the control point. On a flat road
 * the added term is 0 exactly, so C1 is E5k, and E5.
 */
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

// ── the measures: bank267.js's geo, reds and measure, unchanged but for D678's R4 (the centre off its in-plane target) and the bank over the whole road ──
async function geo(d) {
  const { rs, path: p } = await pathOf(d), S = [];
  for (let s = LO; s <= HI + 1e-9; s += 1) {
    const fr = ZG.frameAt(p, rs.segments, s, -1), b = Math.atan2(fr.sin, fr.cos), F = rotb(fr.oF[0], fr.oF[1], b), Pq = rotb(fr.oP[0], fr.oP[1], b), w = at(d, 'w', s), l = at(d, 'l', s), h = at(d, 'h', s), up = fr.U0[1];
    S.push({ s, w, l, h, phiDeg: at(d, 'phi', s) * DEGR, inLat: l + F[0], inZ: h + F[1] / up, outLat: l + Pq[0], outZ: h + Pq[1] / up, outPlan: l - w / 2 });
  }
  return S;
}
const geoMemo = new Map();
const geoOf = async (d) => { if (!geoMemo.has(d)) geoMemo.set(d, await geo(d)); return geoMemo.get(d); };
function reds(d) {
  const r = createCheckJob().run({ doc: d, csp: true }).result;
  if (!r) return { error: 'no result' };
  const pick = (f) => ({ s: R4(f.s0 !== undefined ? f.s0 : f.s), s1: f.s1 !== undefined ? R4(f.s1) : undefined, reason: f.reason });
  const red = (r.red || []).map(pick), amber = (r.amber || []).map(pick);
  const onRun = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= LO && x.s <= HI), inWindow = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= SN && x.s <= SF);
  return { red: red.length, amber: amber.length, redOnRun: onRun.length, redInWindow: inWindow.length, redList: red };
}
const overlaps = (a, b) => (a.s1 !== undefined ? a.s1 : a.s) >= b.s && a.s <= (b.s1 !== undefined ? b.s1 : b.s);
/** D678 R4: the centre's height off its in-plane target, every 1 m over the window, evaluated (the target as levelC1 sets it, read at s) */
function centreOff(d, start, fh, fl) {
  let m = 0;
  for (let s = SN; s <= SF + 1e-9; s += 1) {
    const g = weight(s, WIN.lo, WIN.hi, WIN.ramp), tn = Math.tan(at(d, 'phi', s)), l = at(d, 'l', s), hs = at(start, 'h', s), ls = at(start, 'l', s);
    const target = hs + g * (fh(s) - hs) + tn * ((1 - g) * (l - ls) + g * (l - fl(s)));
    m = Math.max(m, Math.abs(at(d, 'h', s) - target));
  }
  return R4(m);
}
async function measure(name, d, ctx) {
  const S = await geoOf(d), row = { name, fixture: ctx.fx, kind: ctx.kind, from: ctx.from, ...(ctx.extra || {}) };
  for (const k of ['w', 'l', 'h', 'phiDeg', 'inLat', 'inZ', 'outLat', 'outZ', 'outPlan']) row[k] = stats(S.map((x) => x[k]));
  const vs = async (ref) => {
    const R = await geoOf(ref), m = (k) => R4(Math.max(...S.map((x, i) => Math.abs(x[k] - R[i][k])))), rng = (k) => stats(S.map((x, i) => x[k] - R[i][k]));
    return { maxAbs: Object.fromEntries(['w', 'l', 'h', 'phiDeg', 'inLat', 'inZ', 'outLat', 'outZ'].map((k) => [k, m(k)])), range: { inLat: rng('inLat'), inZ: rng('inZ'), outLat: rng('outLat'), phiDeg: rng('phiDeg') } };
  };
  row.vsBase = await vs(ctx.base);
  if (ctx.lvBase) row.vsLevelledBase = await vs(ctx.lvBase);
  if (ctx.fh) row.hFromTarget = R4(Math.max(...S.map((x) => Math.abs(x.h - ctx.fh(x.s)))));
  if (ctx.fl) row.centreOffPlane = centreOff(d, ctx.start, ctx.fh, ctx.fl);
  { let m = 0; const end = endOf(d); for (let s = 0; s <= end + 1e-9; s += 1) m = Math.max(m, Math.abs(at(d, 'phi', s) - at(ctx.base, 'phi', s))); row.bankVsBaseWholeRoadDeg = R4(m * DEGR); }
  if (ctx.start) {
    let outside = 0; const end = endOf(d);
    for (let s = 0; s <= end + 1e-9; s += 1) { if (s >= SN - 1e-9 && s <= SF + 1e-9) continue; for (const ch of ['w', 'l', 'h', 'phi', 'c']) outside = Math.max(outside, Math.abs(at(d, ch, s) - at(ctx.start, ch, s))); }
    row.outsideMaxChange = outside; row.piecesSameObject = d.pieces.filter((P, i) => P === ctx.start.pieces[i]).length; row.pieces = d.pieces.length;
  }
  row.profile = Object.fromEntries(['phiDeg', 'inLat', 'inZ', 'w', 'h'].map((k) => [k, S.filter((x, i) => i % 20 === 0).map((x) => R4(x[k]))]));
  row.check = reds(d);
  if (ctx.baseCheck) {
    const inBase = (x) => ctx.baseCheck.redList.some((b) => overlaps(x, b));
    row.check.redNotInBase = row.check.redList.filter((x) => !inBase(x)).length;
    row.check.redOnRunOrWindowNotInBase = row.check.redList.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= SN && x.s <= SF && !inBase(x)).length;
  }
  row.sha = sha(d);
  out.rows.push(row); return row;
}
/** the registered rows for one levelled (or started) row; lvB is the row's vsLevelledBase or null */
function rowsOf(r) {
  const lvB = r.vsLevelledBase || null;
  return {
    R1_noRedTheBaseLacks: r.check.redOnRunOrWindowNotInBase === undefined ? null : r.check.redOnRunOrWindowNotInBase === 0,
    R2_heldRimAcross: r.vsBase.maxAbs.inLat <= 0.01, R2_fail: r.vsBase.maxAbs.inLat > 0.05,
    R3_outside: r.outsideMaxChange === undefined ? null : r.outsideMaxChange === 0,
    R4_centreInPlane: r.centreOffPlane === undefined ? null : r.centreOffPlane <= 0.01, R4_fail: r.centreOffPlane === undefined ? null : r.centreOffPlane > 0.05,
    R5_bank: r.vsBase.maxAbs.phiDeg <= 0.01, R5_fail: r.vsBase.maxAbs.phiDeg > 0.1,
    numbers: { heldAcrossVsBase: r.vsBase.maxAbs.inLat, heldUpVsBase: r.vsBase.range.inZ, bankVsBaseDeg: r.vsBase.maxAbs.phiDeg, bankVsBaseWholeRoadDeg: r.bankVsBaseWholeRoadDeg, centreOffPlane: r.centreOffPlane,
      w: r.w.spread, l: r.l.spread, h: r.h.spread, B2outerVsLevelledBase: lvB && [lvB.maxAbs.outLat, lvB.maxAbs.outZ], B9bankVsLevelledBaseDeg: lvB && lvB.maxAbs.phiDeg,
      outside: r.outsideMaxChange, redOnRun: r.check.redOnRun, redInWindow: r.check.redInWindow, redTheBaseLacks: r.check.redOnRunOrWindowNotInBase, amber: r.check.amber, reds: r.check.redList.map((x) => [x.s, x.s1]) },
  };
}

// ── the run ──
(async () => {
  const run = async (name, f) => { try { await f(); return true; } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 900)); return false; } };
  const FIX = { F: ['plan', 0], Bplus: ['plan', 20], Bminus: ['plan', -20], Bhold: ['hold', -20] };
  const bases = {}, starts = {};
  // ── stage 1: THE CONTROL ──
  const ok1 = await run('control', async () => {
    // K3: every fixture rebuilt and compared with bank267.json's record of it (the fields bank267.js wrote, the same code)
    const K3 = {};
    for (const [fx, [layout, bank]] of Object.entries(FIX)) {
      const base = bases[fx] = makeBase(layout, bank), off = SC.pieceOffsets(base);
      const g = await pathOf(base), f200 = ZG.frameAt(g.path, g.rs.segments, LO, -1), f440 = ZG.frameAt(g.path, g.rs.segments, HI, -1), f320 = ZG.frameAt(g.path, g.rs.segments, MID, -1);
      const S0 = await geoOf(base), m320 = S0[MID - LO];
      const info = out.fixtures[fx] = { layout, bankTyped: bank, offsets: off, endM: endOf(base), headingTowardRDeg: R4(Math.atan2(dot3(f440.T, f200.R), dot3(f440.T, f200.T)) * DEGR),
        T200: f200.T.map(R4), T440: f440.T.map(R4), at320: { phiDeg: R4(m320.phiDeg), inZ: R4(m320.inZ), outZ: R4(m320.outZ), leftSideUp: m320.inZ > m320.outZ, R: f320.R.map(R4) },
        bankEvery10: [], widthAt: { 150: R4(at(base, 'w', 150)), 490: R4(at(base, 'w', 490)) }, baseSha: sha(base) };
      for (let s = 100; s <= info.endM; s += 10) info.bankEvery10.push([s, R4(at(base, 'phi', s) * DEGR)]);
      starts[fx] = await startsOf(base, ZG.follow); info.followT1 = starts[fx].followT1;
      const L = L267.fixtures[fx], diff = Object.keys(L).filter((k) => JSON.stringify(L[k]) !== JSON.stringify(info[k]));
      K3[fx] = { pass: diff.length === 0, differs: diff };
    }
    // K1 and K2 on F: the starts, E6 from base / T1 / T2b (bank267's own rows), C1 from T1 / T2b
    const F = bases.F, sF = starts.F, baseRow = await measure('F start base', F, { fx: 'F', kind: 'start', from: 'base', base: F, start: F });
    const startRows = {};
    for (const k of ['T1', 'T2b']) startRows[k] = await measure(`F start ${k}`, sF[k], { fx: 'F', kind: 'start', from: k, base: F, start: F, baseCheck: baseRow.check });
    const e6 = {}, c1 = {};
    for (const k of ['base', 'T1', 'T2b']) e6[k] = await levelDir(k === 'base' ? F : sF[k], 16, false);
    for (const k of ['T1', 'T2b']) c1[k] = await levelC1(sF[k], 16);
    const K1 = {}, K2 = {}, pick = (t) => ({ ...t });
    for (const k of ['T1', 'T2b']) {
      const r = await measure(`F E6 from ${k}`, e6[k].doc, { fx: 'F', kind: 'E6', from: k, base: F, start: sF[k], lvBase: e6.base.doc, fh: e6[k].fh, baseCheck: baseRow.check });
      const mine = { w: r.w.spread, hFromTarget: r.hFromTarget, heldAcrossVsBase: r.vsBase.maxAbs.inLat, heldUpVsBase: r.vsBase.range.inZ, bankVsBase: r.vsBase.maxAbs.phiDeg, bankVsLevelledBase: r.vsLevelledBase.maxAbs.phiDeg,
        outerVsLevelledBase: [r.vsLevelledBase.maxAbs.outLat, r.vsLevelledBase.maxAbs.outZ], outLatSpread: r.outLat.spread, outside: r.outsideMaxChange, redOnRun: r.check.redOnRun, redInWindow: r.check.redInWindow,
        redTheBaseLacks: r.check.redOnRunOrWindowNotInBase, amber: r.check.amber };
      const theirs = L267.test.find((t) => t.fixture === 'F' && t.kind === 'E6' && t.from === k).numbers;
      const absolute = r.w.spread === 0 && r.l.spread === 0 && r.h.spread === 0 && r.vsBase.maxAbs.inLat === 0 && r.vsBase.range.inZ.min === 0.4353 && r.vsBase.range.inZ.max === 0.4353
        && r.check.redOnRun === 0 && r.check.redInWindow === 0 && r.check.amber === 0 && r.outsideMaxChange === 0;
      const startL = L267.rows.find((x) => x.name === `F start ${k}`), sr = startRows[k];
      const startSame = ['w', 'h', 'l'].every((c) => JSON.stringify(sr[c]) === JSON.stringify(startL[c])) && sr.check.redOnRun === startL.check.redOnRun && sr.check.redInWindow === startL.check.redInWindow && sr.check.amber === startL.check.amber;
      K1[k] = { pass: absolute && JSON.stringify(mine) === JSON.stringify(theirs) && startSame, absolute, sameAsL267: JSON.stringify(mine) === JSON.stringify(theirs), startSameAsL267: startSame, mine: pick(mine), l: r.l.spread, h: r.h.spread };
      K2[k] = { pass: sha(c1[k].doc) === sha(e6[k].doc), c1: sha(c1[k].doc), e6: sha(e6[k].doc) };
      await measure(`F C1 from ${k}`, c1[k].doc, { fx: 'F', kind: 'C1', from: k, base: F, start: sF[k], lvBase: e6.base.doc, fh: c1[k].fh, fl: c1[k].fl, baseCheck: baseRow.check });
    }
    out.control = { K1, K2, K3, pass: Object.values(K1).every((x) => x.pass) && Object.values(K2).every((x) => x.pass) && Object.values(K3).every((x) => x.pass) };
  });
  console.log('CONTROL', JSON.stringify(out.control));
  if (!ok1 || !out.control.pass) { out.verdict.stoppedAtControl = true; out.ended = new Date().toISOString(); write(); console.log('STOPPED: the control does not match; no banked row was computed', out.errors); return; }
  write();

  // ── stage 2a: C3a, the chord grab against today's on F (the fixture's cup) and F0 (cup 0) ──
  await run('C3a', async () => {
    const F0 = makeBase('plan', 0, 0);
    for (const [name, base, st] of [['F', bases.F, starts.F], ['F0', F0, await startsOf(F0, ZG.follow)]]) {
      const ch = await startsOf(base, followChord);
      out.follows[`${name} today T1`] = st.followT1; out.follows[`${name} chord T1`] = ch.followT1;
      for (const k of ['T1', 'T2b']) {
        let mx = 0; const end = endOf(st[k]);
        for (let s = 0; s <= end + 1e-9; s += 1) for (const c of ['w', 'l', 'h', 'phi', 'c']) mx = Math.max(mx, Math.abs(at(st[k], c, s) - at(ch[k], c, s)));
        out.c3a.push({ road: name, cupAtMid: R4(at(base, 'c', MID)), from: k, same: sha(st[k]) === sha(ch[k]), today: sha(st[k]), chord: sha(ch[k]), maxChannelDiff: mx });
      }
    }
  });
  write();

  // ── stage 2b: the banked fixtures ──
  for (const fx of ['Bminus', 'Bhold', 'Bplus']) await run(fx, async () => {
    const base = bases[fx], st = starts[fx], ch = await startsOf(base, followChord);
    out.follows[`${fx} today T1`] = st.followT1; out.follows[`${fx} chord T1`] = ch.followT1;
    const S = { base, T1: st.T1, T2b: st.T2b, T1c: ch.T1, T2bc: ch.T2b };
    const baseRow = await measure(`${fx} start base`, base, { fx, kind: 'start', from: 'base', base, start: base });
    for (const k of ['T1', 'T2b', 'T1c', 'T2bc']) await measure(`${fx} start ${k}`, S[k], { fx, kind: 'start', from: k, base, start: base, baseCheck: baseRow.check });
    const lvBase = await levelC1(base, 16);
    await measure(`${fx} C1 from base`, lvBase.doc, { fx, kind: 'C1', from: 'base', base, start: base, fh: lvBase.fh, fl: lvBase.fl, baseCheck: baseRow.check });
    const jobs = [['C1', 'T1', S.T1, (d) => d], ['C1', 'T2b', S.T2b, (d) => d], ['1+2p', 'T1', S.T1, given2p], ['1+2p', 'T2b', S.T2b, given2p],
      ['1+2r', 'T1', S.T1, (d) => given2r(d, `${fx} T1`)], ['1+2r', 'T2b', S.T2b, (d) => given2r(d, `${fx} T2b`)], ['3+1', 'T1c', S.T1c, (d) => d], ['3+1', 'T2bc', S.T2bc, (d) => d]];
    for (const [kind, from, start, bankStep] of jobs) {
      const lv = await levelC1(bankStep(start), 16);
      await measure(`${fx} ${kind} from ${from}`, lv.doc, { fx, kind, from, base, start, lvBase: lvBase.doc, fh: lv.fh, fl: lv.fl, baseCheck: baseRow.check });
    }
    write();
  });

  for (const r of out.rows) out.test.push({ name: r.name, fixture: r.fixture, kind: r.kind, from: r.from, ...rowsOf(r) });
  out.ended = new Date().toISOString();
  write();
  for (const t of out.test) console.log(`${t.name.padEnd(24)} R1 ${t.R1_noRedTheBaseLacks} R2 ${t.R2_heldRimAcross}/${t.R2_fail} R3 ${t.R3_outside} R4 ${t.R4_centreInPlane} R5 ${t.R5_bank}/${t.R5_fail} ${JSON.stringify(t.numbers)}`);
  console.log('C3a', JSON.stringify(out.c3a.map((x) => [x.road, x.from, x.same, x.maxChannelDiff])));
  console.log('follows', JSON.stringify(out.follows)); console.log('twoR', JSON.stringify(out.twoR));
  if (out.errors.length) console.log('ERRORS', out.errors);
})();
