// e5_265.js (pane A, L265, the second amendment probe; a plan only): the pick E5 measured from T1, T2b and the turn banked 20 degrees (from his one grab and from 8).
//   node e5_265.js <builder tree at c522ea6> <out dir>
// Everything above levelE5 is amend265.js unchanged (the bases, the grab, settle, proto, the measures and the page's checker); its levelCarry (E3) is kept and not run.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const { createCheckJob } = require(path.join(T, 'app/validate-ui/checkjob.js'));
const R4 = (x) => Math.round(x * 1e4) / 1e4;
const out = { started: new Date().toISOString(), tree: T, mechanism: [], rows: [], test: [], errors: [] };

// ── the bases: even265.js's (lead 200 m, 4 turn pieces of 60 m at 30 degrees, exit 150 m, 12 m wide, flat); optionally a cup, or the turn banked ──
const PIECES = [{ length: 200, turn: 0 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 150, turn: 0 }];
function makeBase({ cup, bank } = {}) {
  let b = D.createDoc('even');
  for (const p of PIECES) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: bank && p.turn ? bank : 0, width: 12, turnAs: 'corner', ...(cup === undefined ? {} : { cup }) }));
  return Object.freeze(b);
}
const base = makeBase(), OFF = SC.pieceOffsets(base), LO = OFF[1], HI = OFF[4] + base.pieces[4].length, MID = (LO + HI) / 2;
const WIN = { lo: LO - 20, hi: HI + 20, ramp: 30 };   // even265.js E2's window: the run plus one knot span, ramps 30 m outside
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
function proto(d, set, { lo, hi, ramp, mode }) {
  let cur = d;
  for (const [ch, val] of Object.entries(set)) {
    const off = SC.pieceOffsets(cur), W0 = lo - ramp, W1 = hi + ramp;
    const res = cur.pieces.map((P, p) => {
      if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) return null;
      const t = D.knotVector(P), c = P.channels[ch], ctrl = c.slice(), changed = [];
      for (let i = 0; i < c.length; i++) {
        if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
        const g = weight(off[p] + SC.knotAverage(t, i), lo, hi, ramp);
        ctrl[i] = mode === 'to' ? c[i] + g * (val - c[i]) : c[i] + g * val; changed.push(i);
      }
      return { ctrl, changed };
    });
    cur = Object.freeze(D.checkDoc({ ...cur, pieces: settle(cur, ch, res) }));
  }
  return cur;
}
/**
 * E3 (and E4): THE LEVEL THAT CARRIES WHAT THE GRAB MOVED. Width is brought to W over the window (proto, 'to'). Then, at every control point the level moved, the
 * section is re-placed as zonegrab.js follow places it, about the HELD (inner, left) rim: the rim stays where it is and the section is scaled to the new width
 * (and, with Phi, turned to the bank Phi), so the road's centre moves by F0 - F1, F0 = the held rim from the centre before, F1 after (follow's own slide: l by the
 * across, h by the up / U0's world-up part). The held rim's offset is read from the start's own section at that station (frameAt), per metre of width: the section
 * is the same shape at any width (follow's comment). Phi null keeps every bank as it is (E3).
 */
async function levelCarry(d, W, win, Phi = null) {
  const d1 = proto(d, { w: W }, { ...win, mode: 'to' });
  const { rs, path } = await pathOf(d), L = endOf(d), off = SC.pieceOffsets(d), res = { l: [], h: [], phi: [] };
  d.pieces.forEach((P, p) => {
    if (P.type !== 'road' || (d1.pieces[p] === P && Phi === null)) { res.l.push(null); res.h.push(null); res.phi.push(null); return; }
    const t = D.knotVector(P), w0 = P.channels.w, w1 = d1.pieces[p].channels.w, cur = { l: P.channels.l.slice(), h: P.channels.h.slice(), phi: P.channels.phi.slice() }, changed = [];
    for (let i = 0; i < w0.length; i++) {
      const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, win.lo, win.hi, win.ramp);
      if (off[p] + t[i] < win.lo - win.ramp - 1e-9 || off[p] + t[i + 4] > win.hi + win.ramp + 1e-9) continue;
      const dphi = Phi === null ? 0 : g * (Phi - P.channels.phi[i]);
      if (Math.abs(w1[i] - w0[i]) < 1e-12 && Math.abs(dphi) < 1e-12) continue;
      const fr = ZG.frameAt(path, rs.segments, Math.min(L, Math.max(0, sI)), -1); if (!fr) throw new Error(`no frame at ${sI}`);
      const u = [fr.oF[0] / fr.w, fr.oF[1] / fr.w], b = Math.atan2(fr.sin, fr.cos);
      const F0 = rotb(u[0] * w0[i], u[1] * w0[i], b), F1 = rotb(u[0] * w1[i], u[1] * w1[i], b + dphi);
      cur.l[i] = P.channels.l[i] + (F0[0] - F1[0]); cur.h[i] = P.channels.h[i] + (F0[1] - F1[1]) / fr.U0[1]; cur.phi[i] = P.channels.phi[i] + dphi; changed.push(i);
    }
    for (const ch of ['l', 'h', 'phi']) res[ch].push({ ctrl: cur[ch], changed: changed.slice() });
  });
  let c = d1;
  for (const ch of Phi === null ? ['l', 'h'] : ['l', 'h', 'phi']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch].map((x) => (x ? { ctrl: x.ctrl.slice(), changed: x.changed.slice() } : null))) }));
  return c;
}

// ── the measures: over the run every 1 m; the held (inner, left) rim and the outer rim from each document's own section (frameAt, as the grab reads them) ──
async function geo(d) {
  const { rs, path } = await pathOf(d), S = [];
  for (let s = LO; s <= HI + 1e-9; s += 1) {
    const fr = ZG.frameAt(path, rs.segments, s, -1), F = rotb(fr.oF[0], fr.oF[1], Math.atan2(fr.sin, fr.cos)), Pq = rotb(fr.oP[0], fr.oP[1], Math.atan2(fr.sin, fr.cos)), w = at(d, 'w', s), l = at(d, 'l', s), h = at(d, 'h', s), up = fr.U0[1];
    S.push({ s, w, l, h, phi: at(d, 'phi', s), inLat: l + F[0], inZ: h + F[1] / up, outLat: l + Pq[0], outZ: h + Pq[1] / up, inPlan: l + w / 2, outPlan: l - w / 2 });
  }
  return S;
}
function reds(d) {
  const r = createCheckJob().run({ doc: d, csp: true }).result;
  if (!r) return { error: 'no result' };
  const pick = (f) => ({ s: R4(f.s0 !== undefined ? f.s0 : f.s), s1: f.s1 !== undefined ? R4(f.s1) : undefined, reason: f.reason });
  const red = (r.red || []).map(pick), amber = (r.amber || []).map(pick);
  const onRun = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= LO && x.s <= HI), inWindow = red.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= WIN.lo - WIN.ramp && x.s <= WIN.hi + WIN.ramp);
  return { red: red.length, amber: amber.length, redOnRun: onRun.length, redInWindow: inWindow.length, redList: red, amberList: amber, rawKeys: (r.red && r.red[0]) ? Object.keys(r.red[0]) : [] };
}
async function measure(name, d, start, extra = {}) {
  const S = await geo(d), row = { name, ...extra };
  for (const k of ['w', 'l', 'h', 'phi', 'inLat', 'inZ', 'outLat', 'outZ', 'inPlan', 'outPlan']) row[k] = stats(S.map((x) => x[k]));
  row.profile = { w: S.filter((x, i) => i % 20 === 0).map((x) => R4(x.w)), h: S.filter((x, i) => i % 20 === 0).map((x) => R4(x.h)) };
  if (start) {
    const S0 = await geo(start);
    row.heldRimMoved = { lat: R4(Math.max(...S.map((x, i) => Math.abs(x.inLat - S0[i].inLat)))), z: R4(Math.max(...S.map((x, i) => Math.abs(x.inZ - S0[i].inZ)))) };
    let outside = 0; const end = endOf(d);
    for (let s = 0; s <= end + 1e-9; s += 1) { if (s >= WIN.lo - WIN.ramp - 1e-9 && s <= WIN.hi + WIN.ramp + 1e-9) continue; for (const ch of ['w', 'l', 'h', 'phi', 'c']) outside = Math.max(outside, Math.abs(at(d, ch, s) - at(start, ch, s))); }
    row.outsideMaxChange = outside; row.piecesSameObject = d.pieces.filter((P, i) => P === start.pieces[i]).length;
  }
  row.check = reds(d);
  out.rows.push(row); return row;
}


/**
 * E5 (the plan's pick, item 2 (b′)): bring each carried setting to a value over the run.
 *   width w to W (proto 'to', even265.js's window);
 *   the centre's height h to H, the start's h where the run is untouched (the window's outer start, s = lo − ramp);
 *   the sideways shift l so that the held (inner, left) rim sits at λ, its place across where the run is untouched, read from the section AT THE NEW WIDTH
 *   (frameAt on the width-levelled document): l = λ − F1_R. In the ramps the rim target blends from where the start has it to λ with the window's weight.
 * The bank is not touched (E5 as designed); on a banked start it stays as the grabs left it.
 */
async function levelE5(d, W, win) {
  const sU = win.lo - win.ramp, W0 = sU, W1 = win.hi + win.ramp;
  const g0 = await pathOf(d), fU = ZG.frameAt(g0.path, g0.rs.segments, sU, -1);
  const lam = at(d, 'l', sU) + rotb(fU.oF[0], fU.oF[1], Math.atan2(fU.sin, fU.cos))[0], H = at(d, 'h', sU);
  const d1 = proto(d, { w: W }, { ...win, mode: 'to' });
  const g1 = await pathOf(d1), L1 = endOf(d1), off = SC.pieceOffsets(d), res = { l: [], h: [] };
  d.pieces.forEach((P, p) => {
    if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) { res.l.push(null); res.h.push(null); return; }
    const t = D.knotVector(P), l = P.channels.l.slice(), h = P.channels.h.slice(), changed = [];
    for (let i = 0; i < l.length; i++) {
      if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
      const sI = off[p] + SC.knotAverage(t, i), g = weight(sI, win.lo, win.hi, win.ramp), dw = d1.pieces[p].channels.w[i] - P.channels.w[i];
      if (!(g > 0) && Math.abs(dw) < 1e-12) continue;
      const s = Math.min(L1, Math.max(0, sI)), f0 = ZG.frameAt(g0.path, g0.rs.segments, s, -1), f1 = ZG.frameAt(g1.path, g1.rs.segments, s, -1);
      if (!f0 || !f1) throw new Error(`no frame at ${s}`);
      const F0R = rotb(f0.oF[0], f0.oF[1], Math.atan2(f0.sin, f0.cos))[0], F1R = rotb(f1.oF[0], f1.oF[1], Math.atan2(f1.sin, f1.cos))[0];
      l[i] = (1 - g) * (P.channels.l[i] + F0R - F1R) + g * (lam - F1R);   // g 0: the rim where the start has it; g 1: the rim at λ
      h[i] = P.channels.h[i] + g * (H - P.channels.h[i]);
      changed.push(i);
    }
    res.l.push({ ctrl: l, changed: changed.slice() }); res.h.push({ ctrl: h, changed: changed.slice() });
  });
  let c = d1;
  for (const ch of ['l', 'h']) c = Object.freeze(D.checkDoc({ ...c, pieces: settle(c, ch, res[ch]) }));
  return { doc: c, lam: R4(lam), H: R4(H) };
}
const overlaps = (a, b) => (a.s1 !== undefined ? a.s1 : a.s) >= b.s && a.s <= (b.s1 !== undefined ? b.s1 : b.s);

(async () => {
  const run = async (name, f) => { try { await f(); } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 600)); } };
  const starts = {};
  await run('starts', async () => {
    starts.base = base;
    { const sh = await shellOn(base); grab(sh, MID, 16); starts.T1 = doc(sh); }
    { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16); starts.T2b = doc(sh); }
    const bb = makeBase({ bank: 20 }); starts.bankBase = bb;
    { const sh = await shellOn(bb); out.bankedFollow = grab(sh, MID, 16); starts.bankT1 = doc(sh); }
    { const sh = await shellOn(bb); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16); starts.bankT2b = doc(sh); }
  });
  for (const [k, d] of Object.entries(starts)) await run(`start ${k}`, () => measure(`start ${k}`, d, null));
  out.e5 = {};
  for (const k of ['base', 'T1', 'T2b', 'bankBase', 'bankT1', 'bankT2b']) await run(`E5 ${k}`, async () => {
    const r = await levelE5(starts[k], 16, WIN), row = await measure(`E5 ${k}: w to 16, h to its value where the run is untouched, l holding the inner rim across (from the section at 16 m)`, r.doc, starts[k], { lam: r.lam, H: r.H });
    const S = await geo(r.doc); row.heldRimFromLam = R4(Math.max(...S.map((x) => Math.abs(x.inLat - r.lam))));
    const baseRow = out.rows.find((x) => x.name === `start ${k.startsWith('bank') ? 'bankBase' : 'base'}`);
    row.check.redNotInBase = row.check.redList.filter((x) => !baseRow.check.redList.some((b) => overlaps(x, b))).length;
    row.check.redInWindowNotInBase = row.check.redList.filter((x) => (x.s1 !== undefined ? x.s1 : x.s) >= WIN.lo - WIN.ramp && x.s <= WIN.hi + WIN.ramp && !baseRow.check.redList.some((b) => overlaps(x, b))).length;
    out.e5[k] = { lam: r.lam, H: r.H };
  });
  const row = (p) => out.rows.find((r) => r.name.startsWith(p));
  for (const [name, p] of [['flat, from T1', 'E5 T1:'], ['flat, from T2b', 'E5 T2b:'], ['banked 20, from T1', 'E5 bankT1:'], ['banked 20, from T2b', 'E5 bankT2b:']]) {
    const r = row(p); if (!r) { out.test.push({ name, missing: true }); continue; }
    const rows = { width: r.w.spread <= 0.01, outerEdge: r.outLat.spread <= 0.01 && r.outPlan.spread <= 0.01, heldRim: r.heldRimFromLam <= 0.01, outside: r.outsideMaxChange === 0, surface: r.h.spread <= 0.01, redsOnRun: r.check.redOnRun === 0, noNewRedInWindow: r.check.redInWindowNotInBase === 0 };
    out.test.push({ name, pass: Object.values(rows).every(Boolean), rows, numbers: { w: r.w.spread, l: r.l.spread, h: r.h.spread, phi: r.phi.spread, outLat: r.outLat.spread, outPlan: r.outPlan.spread, heldFromLam: r.heldRimFromLam, heldMovedFromStart: r.heldRimMoved, inZ: r.inZ, outZ: r.outZ, outside: r.outsideMaxChange, red: r.check.red, redOnRun: r.check.redOnRun, redInWindow: r.check.redInWindow, redNotInBase: r.check.redNotInBase, redInWindowNotInBase: r.check.redInWindowNotInBase } });
  }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'e5_265.json'), JSON.stringify(out, null, 1));
  for (const r of out.rows) console.log(`${r.name.slice(0, 40).padEnd(40)} w ${r.w.spread} l ${r.l.spread} h ${r.h.spread} phi ${r.phi.spread} | inLat ${r.inLat.min}..${r.inLat.max} inZ ${r.inZ.min}..${r.inZ.max} | held-from-lam ${r.heldRimFromLam === undefined ? '-' : r.heldRimFromLam} | outside ${r.outsideMaxChange === undefined ? '-' : R4(r.outsideMaxChange)} | red ${r.check.red} (run ${r.check.redOnRun}, window ${r.check.redInWindow}${r.check.redNotInBase === undefined ? '' : `, not in base ${r.check.redNotInBase}, window not in base ${r.check.redInWindowNotInBase}`}) ${JSON.stringify(r.check.redList.map((x) => `${x.s}-${x.s1}`))} amber ${r.check.amber}`);
  console.log('e5', JSON.stringify(out.e5));
  console.log('test', JSON.stringify(out.test.map((t) => [t.name, t.pass, t.rows])));
  if (out.errors.length) console.log('ERRORS', out.errors);
})();
