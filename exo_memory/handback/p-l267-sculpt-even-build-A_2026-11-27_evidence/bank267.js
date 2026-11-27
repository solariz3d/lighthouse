// bank267.js (pane A, L267 stage 1, a plan only; nothing is built): the librarian's direction for "even" on a banked turn, measured.
//   "even", for a setting whose two run ends differ, is the smooth ease between the end values, read where the run is untouched.
//   node bank267.js <builder tree at c522ea6> <out dir>
// The direction (E6): width to 16 m; the bank, the centre's height, the sideways shift's reference and the width's reference each the smootherstep ease between their
// values at the window's two outer ends (s 150 and s 490, where neither the grabs nor the level reach); the held (inner, left) rim's place across read from that
// evened section, station by station; l solved so the rim sits there at the new width and the evened bank (E5's rule, generalised). E5k: the same with the bank kept.
// The rows and the failure clauses are registered in the hand-back's stage 1 section BEFORE this ran.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createCheckJob } = require(path.join(T, 'app/validate-ui/checkjob.js'));
const R4 = (x) => Math.round(x * 1e4) / 1e4, DEGR = 180 / Math.PI;
const out = { started: new Date().toISOString(), tree: T, fixtures: {}, rows: [], test: [], verdict: {}, errors: [] };

// ── the fixtures. The plan's road (a 200 m straight, 4 turn pieces of 60 m at 30 degrees left from s 200 to 440, a 150 m exit, 12 m wide), with its lead laid as
// 100 + 100 m so the window's near end (s 150) reads the run's own width (the 11:57Z finding: the first piece eases from a 31 m head, document.js:667).
// 'plan': the bank typed on the 4 turn pieces (it rolls in on the first, the exit rolls it out), as the plan's banked fixture. 'hold': the bank rolled in on a
// straight before s 140 and out on a straight after s 500, so it is constant across the whole window [150, 490]. Bank + = left side up (panel.js extendOptions). ──
const LAYOUT = {
  plan: (b) => [{ length: 100, turn: 0, bank: 0 }, { length: 100, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 150, turn: 0, bank: 0 }],
  hold: (b) => [{ length: 80, turn: 0, bank: 0 }, { length: 60, turn: 0, bank: b }, { length: 60, turn: 0, bank: b }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: b })), { length: 60, turn: 0, bank: b }, { length: 90, turn: 0, bank: 0 }],
};
function makeBase(layout, bank) {
  let b = D.createDoc('even');
  for (const p of LAYOUT[layout](bank)) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner' }));
  return Object.freeze(b);
}
const LO = 200, HI = 440, MID = 320, WIN = { lo: LO - 20, hi: HI + 20, ramp: 30 }, SN = WIN.lo - WIN.ramp, SF = WIN.hi + WIN.ramp;
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
const stats = (xs) => { const mn = Math.min(...xs), mx = Math.max(...xs); return { min: R4(mn), max: R4(mx), spread: R4(mx - mn) }; };
const endOf = (d) => { const o = SC.pieceOffsets(d); return o[o.length - 1] + d.pieces[d.pieces.length - 1].length; };
async function shellOn(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); sh.setSculpt(true); return sh; }
async function pathOf(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); const rs = sh.getState().resolved; return { rs, path: G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) }) }; }
const msg = (sh) => sh.getState().message;
const rotb = (a, c, ang) => [a * Math.cos(ang) - c * Math.sin(ang), a * Math.sin(ang) + c * Math.cos(ang)];   // section [along L, along U] -> [along R, along U0] at bank ang
/** his gesture, as even265.js: press the OUTER (right) rim at s, pull it straight out (horizontal, along -R) by want - w metres; returns the follow it sent */
function grab(sh, s, want, r = 30) {
  const d = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), push = fr.R.map((k) => -k * e);
  const delta = ZG.follow(push, fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${msg(sh)}`);
  sh.brushTo(delta); sh.endBrush();
  return Object.fromEntries(Object.entries(delta).map(([k, v]) => [k, R4(v)]));
}
const doc = (sh) => sh.getState().history.present;

// ── the prototypes' shared parts: even265.js's weight, quantum, joints (settle) and per-channel level (proto), unchanged ──
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

// ── the level, generalised: each channel brought toward a target that may vary along s (a constant is a value; a function is the ease), weight g over the window ──
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
/** The direction's ease for channel ch on document d: the smootherstep between its values at the window's outer ends (SN, SF), read on d. */
const easeOf = (d, ch) => { const a = at(d, ch, SN), b = at(d, ch, SF); return (s) => a + (b - a) * SC.smootherstep((s - SN) / (SF - SN)); };
const rimR = (g, s) => { const f = ZG.frameAt(g.path, g.rs.segments, s, -1); if (!f) throw new Error(`no frame at ${s}`); return rotb(f.oF[0], f.oF[1], Math.atan2(f.sin, f.cos))[0]; };
/**
 * E6 (keepBank false), the direction: w to W; phi to its ease; h to its ease; the held rim's place across, station by station, where the EVENED section puts it
 * (dStar: w, phi and l each brought to their own ease, read on the start, at the start's width); l solved so the rim sits there at width W and the evened bank.
 * E5k (keepBank true): the same with the bank left as the start has it (call 11's lean). On a flat road both are E5 (e5b_265.js) exactly: λ* = 5.9418, H = 0.
 */
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
      l[i] = (1 - g) * (P.channels.l[i] + F0R - F1R) + g * (lamStar - F1R);   // g 0: the rim where the start has it; g 1: where the evened section has it
      h[i] = P.channels.h[i] + g * (fh(sI) - P.channels.h[i]);
      changed.push(i);
    }
    res.l.push({ ctrl: l, changed: changed.slice() }); res.h.push({ ctrl: h, changed: changed.slice() });
  });
  let c = d1;
  for (const ch of ['l', 'h']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch]) }));
  return { doc: c, fh, reads: { w: [R4(fw(SN)), R4(fw(SF))], phiDeg: [R4(fphi(SN) * DEGR), R4(fphi(SF) * DEGR)], h: [R4(fh(SN)), R4(fh(SF))], l: [R4(fl(SN)), R4(fl(SF))] } };
}

// ── the measures, every 1 m over the run (200 to 440): each rim from the document's own section (frameAt, as the grab reads it) ──
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
  out.rows.push(row); return row;
}

// ── the run ──
(async () => {
  const run = async (name, f) => { try { await f(); } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 700)); } };
  const FIX = [['F', 'plan', 0], ['Bplus', 'plan', 20], ['Bminus', 'plan', -20], ['Bhold', 'hold', -20]];
  for (const [fx, layout, bank] of FIX) await run(fx, async () => {
    const base = makeBase(layout, bank), off = SC.pieceOffsets(base), turnIdx = base.pieces.map((P, i) => i).filter((i) => Math.abs(LAYOUT[layout](bank)[i].turn) > 0);
    if (off[turnIdx[0]] !== LO || off[turnIdx[3]] + base.pieces[turnIdx[3]].length !== HI) throw new Error(`${fx}: the turn is not at ${LO}..${HI}`);
    const g = await pathOf(base), f200 = ZG.frameAt(g.path, g.rs.segments, LO, -1), f440 = ZG.frameAt(g.path, g.rs.segments, HI, -1), f320 = ZG.frameAt(g.path, g.rs.segments, MID, -1);
    const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const S0 = await geoOf(base), m320 = S0[MID - LO];
    const info = out.fixtures[fx] = {
      layout, bankTyped: bank, offsets: off, endM: endOf(base),
      headingTowardRDeg: R4(Math.atan2(dot(f440.T, f200.R), dot(f440.T, f200.T)) * DEGR),   // + = the turn bends toward R, the side the outer-rim grab pulls away from (left)
      T200: f200.T.map(R4), T440: f440.T.map(R4),
      at320: { phiDeg: R4(m320.phiDeg), inZ: R4(m320.inZ), outZ: R4(m320.outZ), leftSideUp: m320.inZ > m320.outZ, R: f320.R.map(R4) },
      bankEvery10: [], widthAt: { 150: R4(at(base, 'w', 150)), 490: R4(at(base, 'w', 490)) },
    };
    for (let s = 100; s <= info.endM; s += 10) info.bankEvery10.push([s, R4(at(base, 'phi', s) * DEGR)]);
    const starts = { base };
    { const sh = await shellOn(base); info.followT1 = grab(sh, MID, 16); starts.T1 = doc(sh); }
    { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16); starts.T2b = doc(sh); }
    const baseRow = await measure(`${fx} start base`, base, { fx, kind: 'start', from: 'base', base, start: base });
    for (const k of ['T1', 'T2b']) await measure(`${fx} start ${k}`, starts[k], { fx, kind: 'start', from: k, base, start: base, baseCheck: baseRow.check });
    for (const [kind, keep] of (bank ? [['E6', false], ['E5k', true]] : [['E6', false]])) {
      const lv = {};
      for (const k of ['base', 'T1', 'T2b']) lv[k] = await levelDir(starts[k], 16, keep);
      for (const k of ['base', 'T1', 'T2b']) await measure(`${fx} ${kind} from ${k}`, lv[k].doc, { fx, kind, from: k, base, start: starts[k], lvBase: k === 'base' ? null : lv.base.doc, fh: lv[k].fh, baseCheck: baseRow.check, extra: { reads: lv[k].reads } });
    }
  });

  // ── the registered rows (the hand-back's stage 1 section, written before this ran) ──
  const R = (fx, kind, from) => out.rows.find((r) => r.fixture === fx && r.kind === kind && r.from === from);
  for (const [fx] of FIX) for (const kind of ['E6', 'E5k']) for (const from of ['base', 'T1', 'T2b']) {
    const r = R(fx, kind, from); if (!r) continue;
    const lvB = from === 'base' ? null : r.vsLevelledBase;
    const rows = {
      B1_width: r.w.spread <= 0.01,
      B2_outerRimAsLevelledBase: lvB ? lvB.maxAbs.outLat <= 0.01 && lvB.maxAbs.outZ <= 0.01 : null,
      B3_heldRimAcrossAsBeforeAnyGrab: r.vsBase.maxAbs.inLat <= 0.01,
      B4_outside: r.outsideMaxChange === 0,
      B6_surface: r.hFromTarget <= 0.01,
      B7_noRedTheBaseLacks: r.check.redOnRunOrWindowNotInBase === 0,
      B8_bankAsBeforeAnyGrab: r.vsBase.maxAbs.phiDeg <= 0.5,
      B9_bankAsLevelledBase: lvB ? lvB.maxAbs.phiDeg <= 0.01 : null,
    };
    if (fx === 'F') Object.assign(rows, { F2_outerEdgeOnePlace: r.outLat.spread <= 0.01 && r.outPlan.spread <= 0.01, F7_noRedOnRun: r.check.redOnRun === 0 });
    const fails = {
      widthOver005: r.w.spread > 0.05, heldRimAcrossOver005: r.vsBase.maxAbs.inLat > 0.05, outsideChanged: r.outsideMaxChange !== 0, surfaceOver005: r.hFromTarget > 0.05,
      redTheBaseLacks: r.check.redOnRunOrWindowNotInBase > 0, bankOffDesignOver05deg: r.vsBase.maxAbs.phiDeg > 0.5,
      bankResidueOver01deg: lvB ? lvB.maxAbs.phiDeg > 0.1 : null, outerRimResidueOver005: lvB ? lvB.maxAbs.outLat > 0.05 || lvB.maxAbs.outZ > 0.05 : null,
    };
    out.test.push({ fixture: fx, kind, from, pass: Object.values(rows).every((v) => v !== false), failed: Object.entries(fails).filter(([, v]) => v === true).map(([k]) => k), rows, fails,
      numbers: { w: r.w.spread, hFromTarget: r.hFromTarget, heldAcrossVsBase: r.vsBase.maxAbs.inLat, heldUpVsBase: r.vsBase.range.inZ, bankVsBase: r.vsBase.maxAbs.phiDeg, bankVsLevelledBase: lvB && lvB.maxAbs.phiDeg, outerVsLevelledBase: lvB && [lvB.maxAbs.outLat, lvB.maxAbs.outZ], outLatSpread: r.outLat.spread, outside: r.outsideMaxChange, redOnRun: r.check.redOnRun, redInWindow: r.check.redInWindow, redTheBaseLacks: r.check.redOnRunOrWindowNotInBase, amber: r.check.amber } });
  }
  // the direction fails (registered) if on Bplus or Bminus, from T1 or T2b, any failure clause fires
  for (const fx of ['F', 'Bplus', 'Bminus', 'Bhold']) {
    const ts = out.test.filter((t) => t.fixture === fx && t.kind === 'E6' && t.from !== 'base');
    out.verdict[fx] = { E6fromStarts: ts.map((t) => [t.from, t.pass, t.failed]) };
  }
  out.verdict.directionFails = ['Bplus', 'Bminus'].some((fx) => out.test.some((t) => t.fixture === fx && t.kind === 'E6' && t.from !== 'base' && t.failed.length));
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'bank267.json'), JSON.stringify(out, null, 1));
  for (const [fx, i] of Object.entries(out.fixtures)) console.log(fx, JSON.stringify({ heading: i.headingTowardRDeg, at320: i.at320, widthAt: i.widthAt, followT1: i.followT1, bank: i.bankEvery10.filter(([s]) => s % 30 === 0 || s === 150 || s === 490) }));
  for (const r of out.rows) console.log(`${r.name.padEnd(22)} w ${r.w.spread} h ${r.h.spread} phi ${r.phiDeg.min}..${r.phiDeg.max} | vsBase in ${r.vsBase.maxAbs.inLat} phi ${r.vsBase.maxAbs.phiDeg} inZ ${r.vsBase.range.inZ.min}..${r.vsBase.range.inZ.max} | vsLvBase ${r.vsLevelledBase ? JSON.stringify([r.vsLevelledBase.maxAbs.phiDeg, r.vsLevelledBase.maxAbs.outLat, r.vsLevelledBase.maxAbs.outZ, r.vsLevelledBase.maxAbs.inLat]) : '-'} | hT ${r.hFromTarget === undefined ? '-' : r.hFromTarget} | out ${r.outsideMaxChange === undefined ? '-' : R4(r.outsideMaxChange)} | red ${r.check.red} run ${r.check.redOnRun} win ${r.check.redInWindow} new ${r.check.redOnRunOrWindowNotInBase === undefined ? '-' : r.check.redOnRunOrWindowNotInBase} amber ${r.check.amber}${r.reads ? ' reads ' + JSON.stringify(r.reads) : ''}`);
  for (const t of out.test) console.log('test', t.fixture, t.kind, t.from, t.pass, JSON.stringify(t.failed));
  console.log('verdict', JSON.stringify(out.verdict));
  if (out.errors.length) console.log('ERRORS', out.errors);
})();
