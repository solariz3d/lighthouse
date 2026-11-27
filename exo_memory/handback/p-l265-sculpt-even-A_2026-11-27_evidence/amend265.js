// amend265.js (pane A, L265 amendment, a plan only): why a width grab moves the height, and the level prototype carrying width, the sideways shift and the
// height (and the bank, on a banked turn), with the page's own checker (app/validate-ui/checkjob.js, CSP on, as the page ran it) on every document.
//   node amend265.js <builder tree at c522ea6> <out dir>
// Node only: no page, no pictures. The prototypes are computed here, never in the builder.
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

(async () => {
  const run = async (name, f) => { try { await f(); } catch (e) { out.errors.push(`${name}: ${e && e.stack || e}`.slice(0, 600)); } };
  // 1. THE MECHANISM: the section at the press, the follow one grab sends, and the same grab on a road with no cup
  await run('mechanism', async () => {
    for (const [label, b] of [['cupped (the default cup)', base], ['no cup (cup 0)', makeBase({ cup: 0 })]]) {
      const { rs, path } = await pathOf(b), fr = ZG.frameAt(path, rs.segments, MID, -1);
      const sh = await shellOn(b), follow = grab(sh, MID, 16);
      const span = fr.oF[0] - fr.oP[0], kk = (span + 4) / span;   // the chord rim to rim is horizontal (both rims at one height); the pull is 4 m out
      out.mechanism.push({ base: label, cupAtMid: R4(at(b, 'c', MID)), sectionWidth: R4(fr.w), heldRimFromCentre: fr.oF.map(R4), pulledRimFromCentre: fr.oP.map(R4), horizontalSpan: R4(span),
        predicted: { k: R4(kk), w: R4(fr.w * (kk - 1)), l: R4(-(kk - 1) * fr.oF[0]), h: R4(-(kk - 1) * fr.oF[1] / fr.U0[1]) }, followSent: follow });
    }
  });
  // 2. THE STARTS: the base, T1 (one grab), T2a (4 grabs), T2b (8 grabs), as even265.js; and the banked turn (20 degrees on the turn pieces) with T1 and T2b
  const starts = {};
  await run('starts', async () => {
    starts.base = base;
    { const sh = await shellOn(base); grab(sh, MID, 16); starts.T1 = doc(sh); }
    { const sh = await shellOn(base); for (const k of [0, 1, 2, 3]) grab(sh, OFF[1 + k] + 30, 16); starts.T2a = doc(sh); }
    { const sh = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16); starts.T2b = doc(sh); }
    const bb = makeBase({ bank: 20 }); starts.bankBase = bb;
    { const sh = await shellOn(bb); out.bankedFollow = grab(sh, MID, 16); starts.bankT1 = doc(sh); }
    { const sh = await shellOn(bb); for (let s = LO + 15; s < HI; s += 30) grab(sh, s, 16); starts.bankT2b = doc(sh); }
  });
  for (const [k, d] of Object.entries(starts)) await run(`start ${k}`, () => measure(`start ${k}`, d, null));
  // 3. THE LEVELS on each start: E2 (the plan's: w and l only), E3 (w, carrying l and h about the held rim), and on the banked turn E4 (E3 and the bank brought to its value)
  const Phi = at(starts.bankBase || base, 'phi', MID);
  out.bankValue = { rad: Phi, deg: R4(Phi * 180 / Math.PI) };
  for (const k of ['base', 'T1', 'T2a', 'T2b']) {
    await run(`E2 ${k}`, () => measure(`E2 ${k}: w to 16, l to -2 (the plan's level)`, proto(starts[k], { w: 16, l: -2 }, { ...WIN, mode: 'to' }), starts[k]));
    await run(`E3 ${k}`, async () => measure(`E3 ${k}: w to 16, l and h carried about the held inner rim`, await levelCarry(starts[k], 16, WIN), starts[k]));
  }
  for (const k of ['bankBase', 'bankT1', 'bankT2b']) {
    await run(`E3 ${k}`, async () => measure(`E3 ${k}: w to 16, l and h carried, the bank kept`, await levelCarry(starts[k], 16, WIN), starts[k]));
    await run(`E4 ${k}`, async () => measure(`E4 ${k}: w to 16, the bank to ${out.bankValue.deg} deg, l and h carried`, await levelCarry(starts[k], 16, WIN, Phi), starts[k]));
  }
  // 4. THE REGISTERED TEST as amended (plan section 6), on the level that carries (E3 flat, E4 banked), from both starts
  const row = (p) => out.rows.find((r) => r.name.startsWith(p));
  for (const [name, p] of [['flat, from T1', 'E3 T1:'], ['flat, from T2b', 'E3 T2b:'], ['banked, from T1', 'E4 bankT1:'], ['banked, from T2b', 'E4 bankT2b:']]) {
    const r = row(p); if (!r) { out.test.push({ name, missing: true }); continue; }
    const rows = { width: r.w.spread <= 0.01, outerEdge: r.outLat.spread <= 0.01 && r.outPlan.spread <= 0.01, heldRim: r.heldRimMoved.lat <= 0.01 && r.heldRimMoved.z <= 0.01, outside: r.outsideMaxChange === 0, surface: r.h.spread <= 0.01, redsOnRun: r.check.redOnRun === 0 };
    out.test.push({ name, pass: Object.values(rows).every(Boolean), rows, numbers: { w: r.w.spread, outLat: r.outLat.spread, outPlan: r.outPlan.spread, heldLat: r.heldRimMoved.lat, heldZ: r.heldRimMoved.z, h: r.h.spread, phi: r.phi.spread, outside: r.outsideMaxChange, redOnRun: r.check.redOnRun, redInWindow: r.check.redInWindow, red: r.check.red } });
  }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'amend265.json'), JSON.stringify(out, null, 1));
  console.log('mechanism', JSON.stringify(out.mechanism));
  for (const r of out.rows) console.log(`${r.name.slice(0, 64).padEnd(64)} w ${r.w.spread} l ${r.l.spread} h ${r.h.spread} phi ${r.phi.spread} | out ${r.outLat.spread} held ${r.heldRimMoved ? r.heldRimMoved.lat + '/' + r.heldRimMoved.z : '-'} | outside ${r.outsideMaxChange === undefined ? '-' : R4(r.outsideMaxChange)} | red ${r.check.red} (run ${r.check.redOnRun}, window ${r.check.redInWindow}) amber ${r.check.amber}`);
  console.log('test', JSON.stringify(out.test.map((t) => [t.name, t.pass, t.rows])));
  if (out.errors.length) console.log('ERRORS', out.errors);
})();
