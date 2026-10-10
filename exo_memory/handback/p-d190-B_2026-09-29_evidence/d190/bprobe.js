// bprobe.js (pane B, D190): the cup seal's rows measured on the RENDERED road (segments and buildMesh), independent of A's tests.
//   node bprobe.js <t180 tree> [rows]      rows: comma list of 1a,1b,2,3,6,7 (default all); prints one JSON line per row and a summary
// Edge ψ of a mesh row (seal §1): acos(n_edge · n_centre), the outermost vertex normal on a side against the centre vertex normal.
'use strict';
const path = require('path');
const [, , TREE, ROWS] = process.argv;
const T = path.resolve(TREE) + '/', want = new Set((ROWS || '1a,1b,2,3,6,7').split(','));
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), AD = require(T + 'src/core/adapter.js');
const SC = require(T + 'src/core/sculpt.js'), RD = require(T + 'src/core/readout.js'), { buildMesh } = require(T + 'src/geom/mesh.js');
const PF = require(T + 'src/geom/profile.js'), { FLOORS } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180, FAM = ['bowl', 'half-pipe', 'flat'];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], len = (a) => Math.hypot(a[0], a[1], a[2]);
const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (len(a) * len(b))))) / DEG;
/** The normal at u = 0, interpolated between the two vertices either side of the centre (ψ is linear in u there, 0 at u = 0). */
function centreN(nOf, Us) { let i = Us.findIndex((u) => u > 1e-12) - 1; if (i < 0) i = 0; if (Math.abs(Us[i]) < 1e-12) return nOf(i); const t = -Us[i] / (Us[i + 1] - Us[i]), a = nOf(i), b = nOf(i + 1); return [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, a[2] * (1 - t) + b[2] * t]; }
const out = {}, say = (row, r) => { out[row] = r; console.log(row, JSON.stringify(r)); };
const tryCode = (fn) => { try { fn(); return 'accepted'; } catch (e) { return e.code || e.message.slice(0, 60); } };

function render(doc, opts) { const segs = AD.toSegments(doc, opts), { path: p } = AD.toPath(doc, opts); return { segs, p, mesh: buildMesh(p, segs), doc }; }
/** Every mesh row of the road, in order of s: { s, g (segment), psiR, psiL, seam? } read from the cells' local normals (a dot product is frame-free). */
function rows(R) {
  const st = R.mesh._state, list = [];
  st.pieces.forEach((pc, g) => {
    if (!pc) return;
    const K = pc.K, Us = pc.Us;
    for (const c of pc.cells) {
      const Rn = c.rowS.length;
      for (let r = 0; r < Rn; r++) {
        const n = (k) => [c.normals[(r * K + k) * 3], c.normals[(r * K + k) * 3 + 1], c.normals[(r * K + k) * 3 + 2]];
        const nc = centreN(n, Us);
        list.push({ s: c.rowS[r], g, psiR: ang(n(0), nc), psiL: ang(n(K - 1), nc) });
      }
    }
  });
  return list.sort((a, b) => a.s - b.s || a.g - b.g);
}
function pieceAt(doc, s) { let a = 0; for (const P of doc.pieces) { const L = P.type === 'road' ? P.length : null; if (L === null) return null; if (s <= a + L + 1e-9) return { P, u: Math.min(Math.max(s - a, 0), L) }; a += L; } return null; }
const cAt = (doc, s) => { const q = pieceAt(doc, s); return q && q.P.cup ? D.channelAt(q.P, 'c', q.u).v : null; };
function cRange(doc, a, b, lo = 0, hi = Infinity) { let mn = Infinity, mx = -Infinity; const A = Math.max(lo, a), Bn = Math.min(hi, b); for (let k = 0; k <= 60; k++) { const v = cAt(doc, A + (Bn - A) * k / 60); if (v !== null) { mn = Math.min(mn, v); mx = Math.max(mx, v); } } return [mn, mx]; }
/** The zip seams of a render: which pieces they join, and how far apart the two rows they zip are (both ways, point to polyline, m). */
function seams(R) {
  const st = R.mesh._state, list = [];
  st.seams.forEach((sm, g) => {
    if (!sm) return;
    const A = st.pieces[g - 1 < 0 ? st.pieces.length - 1 : g - 1].last, B = st.pieces[g].first;
    const segA = R.segs[g - 1 < 0 ? R.segs.length - 1 : g - 1], segB = R.segs[g];
    const d2poly = (p, L) => { let best = Infinity; for (let k = 0; k + 1 < L.length; k++) { const a = L[k].p, b = L[k + 1].p, d = sub(b, a), t = Math.max(0, Math.min(1, dot(sub(p, a), d) / Math.max(dot(d, d), 1e-30))); best = Math.min(best, len(sub(p, [a[0] + d[0] * t, a[1] + d[1] * t, a[2] + d[2] * t]))); } return best; };
    const haus = Math.max(...A.map((v) => d2poly(v.p, B)), ...B.map((v) => d2poly(v.p, A)));
    // the two CURVES at the joint: A's end profile against B's start profile (u and ψ arrays), exact
    const endA = segA.profile, startB = segB.blend ? segB.blend.from : segB.profile;
    const nA = PF.normalize(endA), nB = PF.normalize(startB), w = Math.max(...nA.u.map(Math.abs));
    let curve = 0; for (let k = 0; k <= 200; k++) { const u = -w + 2 * w * k / 200, a = PF.offsetAt(nA, u), b = PF.offsetAt(nB, u); curve = Math.max(curve, Math.hypot(a[0] - b[0], a[1] - b[1])); }
    list.push({ g, s: +sm.s.toFixed(3), inPiece: segA.id === segB.id, pieces: `${segA.id}->${segB.id}`, rowsGap_mm: +(haus * 1000).toFixed(3), curveStep_mm: +(curve * 1000).toFixed(6), Ka: A.length, Kb: B.length });
  });
  return list;
}
const cupDoc = (family, w, c, extra = {}) => extend(D.createDoc('b'), { length: 40, family, first: { w, c, ...extra } });

if (want.has('1a')) {
  let worst = 0, bad = [], n = 0;
  for (const f of FAM) for (const w of [8, 12, 31, 50]) for (const c of [0, 15.5, 30.6, 45, 90, 120, 150]) {
    const R = render(cupDoc(f, w, c)), mid = rows(R).filter((r) => r.s > 15 && r.s < 25);
    for (const r of mid) { const e = Math.max(Math.abs(r.psiL - c), Math.abs(r.psiR - c)); worst = Math.max(worst, e); if (e > 0.05) bad.push(`${f} w${w} c${c}: L${r.psiL.toFixed(3)} R${r.psiR.toFixed(3)}`); } n++;
  }
  say('1a', { cases: n, worstDeg: +worst.toExponential(3), fails: bad.length, sample: bad.slice(0, 4), pass: bad.length === 0 });
}
if (want.has('1b')) {
  const res = [];
  for (const [f, to, L] of [['bowl', 90, 40], ['bowl', 150, 40], ['half-pipe', 90, 40], ['half-pipe', 150, 40], ['bowl', 90, 100], ['half-pipe', 150, 100]]) {
    let d = extend(D.createDoc('r'), { length: 60, family: f, first: { w: 31, c: 15.5 } }); d = extend(d, { length: L, targets: { c: to } }); d = extend(d, { length: 60 });
    const R = render(d), rs = rows(R), total = d.pieces.reduce((a, P) => a + P.length, 0);
    let i1 = 0, worstI = 0, fast = 0, worstFast = 0, maxStep = 0;
    for (const r of rs) { const [mn, mx] = cRange(d, r.s - 2, r.s + 2, 0, total); for (const p of [r.psiL, r.psiR]) { const e = Math.max(mn - 0.05 - p, p - mx - 0.05, 0); worstI = Math.max(worstI, e); if (e > 0) i1++; } }
    for (let k = 0; k + 1 < rs.length; k++) { const a = rs[k], b = rs[k + 1], [mn, mx] = cRange(d, a.s, b.s, 0, total), allow = (mx - mn) + 0.05;
      for (const [x, y] of [[a.psiL, b.psiL], [a.psiR, b.psiR]]) { const dd = Math.abs(y - x); maxStep = Math.max(maxStep, dd); if (dd > allow) { fast++; worstFast = Math.max(worstFast, dd - allow); } } }
    const sm = seams(R), inside = sm.filter((x) => x.inPiece || x.pieces.startsWith(d.pieces[1].id) || x.pieces.endsWith(d.pieces[1].id));
    res.push({ ramp: `${f} 15.5->${to} over ${L} m`, rows: rs.length, i_outOfWindow: i1, i_worstDeg: +worstI.toFixed(4), ii_fasterThanC: fast, ii_worstExcessDeg: +worstFast.toFixed(4), maxRowStepDeg: +maxStep.toFixed(4), literal1deg: maxStep <= 1.0 + 1e-9,
      seams: sm.length, seamsInCup: inside.length, maxRowsGap_mm: Math.max(0, ...sm.map((x) => x.rowsGap_mm)), maxCurveStep_mm: Math.max(0, ...sm.map((x) => x.curveStep_mm)) });
  }
  const pass = res.every((r) => r.i_outOfWindow === 0 && r.ii_fasterThanC === 0 && r.maxCurveStep_mm <= 1) && res.filter((r) => /100 m/.test(r.ramp)).every((r) => r.literal1deg);
  say('1b', { ramps: res, pass });
}
if (want.has('2')) {
  let nonMono = 0, meet = 0, ratio150 = {}, shapeErr = 0, n = 0;
  for (const f of FAM) for (const w of [8, 12, 31, 50]) for (const c of [0, 15.5, 30.6, 45, 90, 120, 150]) {
    const pr = AD.toSegments(cupDoc(f, w, c))[0].profile, P = PF.normalize(pr), h = (pr.psi.length - 1) / 2; n++;
    for (let k = h; k + 1 < pr.psi.length; k++) if (pr.psi[k + 1] < pr.psi[k] - 1e-12) nonMono++;
    for (let k = h; k > 0; k--) if (pr.psi[k - 1] < pr.psi[k] - 1e-12) nonMono++;
    const F = FLOORS[f]; for (let i = 0; i < 4; i++) shapeErr = Math.max(shapeErr, Math.abs(pr.psi[h + 1 + i] / DEG - c * F[i] / F[3]), Math.abs(pr.psi[h - 1 - i] / DEG - c * F[i] / F[3]));
    const tipL = PF.offsetAt(P, w / 2)[0], tipR = -PF.offsetAt(P, -w / 2)[0];
    if (!(tipL > 0 && tipR > 0)) meet++;
    if (c === 150) ratio150[`${f} w${w}`] = +(Math.min(tipL, tipR) / (w / 2)).toFixed(4);
  }
  const base = cupDoc('bowl', 31, 100), bump = (v) => ({ ...base, pieces: base.pieces.map((P) => ({ ...P, channels: { ...P.channels, c: P.channels.c.map((x, i) => (i === 2 ? v : x)) } })) });
  const guard = { 'c=150.000001': tryCode(() => D.checkDoc(bump(150.000001))), 'c=165': tryCode(() => D.checkDoc(bump(165))), 'c=-0.1': tryCode(() => D.checkDoc(bump(-0.1))),
    'parse c=165': tryCode(() => D.parse(JSON.stringify(JSON.parse(D.serialize(base)), (k, v) => (k === 'c' && Array.isArray(v) ? v.map((x, i) => (i === 2 ? 165 : x)) : v)))), 'c=150 accepted': tryCode(() => D.checkDoc(bump(150))) };
  let ring = null; try { const d = extend(extend(D.createDoc('v'), { length: 60, family: 'bowl', first: { w: 31, c: 15.5 } }), { length: 30, transition: 10, targets: { c: 150 } }); const P = d.pieces[1]; let mx = 0; for (let k = 0; k <= 600; k++) mx = Math.max(mx, D.channelAt(P, 'c', P.length * k / 600).v); ring = { maxControl: Math.max(...P.channels.c), maxCurve: +mx.toFixed(6), end: +D.channelAt(P, 'c', P.length).v.toFixed(4) }; } catch (e) { ring = { refused: e.code }; }
  let brush = null; try { const d = extend(D.createDoc('w'), { length: 200, family: 'bowl', first: { w: 31, c: 140 } }); const r = SC.brush(d, { mode: 'value', channel: 'c', s0: 100, r: 50, delta: 40 }); brush = { maxControl: Math.max(...r.doc.pieces[0].channels.c) }; } catch (e) { brush = { refused: e.code }; }
  const ok = nonMono === 0 && meet === 0 && Object.values(ratio150).every((x) => x >= 0.05) && shapeErr < 1e-9 && ['c=150.000001', 'c=165', 'c=-0.1', 'parse c=165'].every((k) => guard[k] === 'BAD_CUP') && guard['c=150 accepted'] === 'accepted'
    && (ring.refused || (ring.maxControl <= 150 + 1e-9 && ring.maxCurve <= 150 + 1e-9)) && (!!brush.refused || brush.maxControl <= 150 + 1e-9) && true;
  say('2', { profiles: n, nonMonotone: nonMono, wallsMeet: meet, tipRatioAt150: ratio150, shapeVsRuleDeg: +shapeErr.toExponential(2), guard, extend30_10_to150: ring, brushPast150: brush, pass: ok });
}
if (want.has('3')) {
  let d = extend(D.createDoc('j'), { length: 100, family: 'bowl', first: { w: 31, c: 40 } }); d = extend(d, { length: 100, targets: { c: 60 } });
  const step = { ...d, pieces: d.pieces.map((P, i) => (i === 1 ? { ...P, channels: { ...P.channels, c: P.channels.c.map((x) => x + 5) } } : P)) };
  const joint = tryCode(() => D.checkDoc(step));
  let f = extend(D.createDoc('f'), { length: 150, family: 'bowl', first: { w: 31, c: 70 } }); f = D.appendPiece(f, D.flightPiece({ gap: 30, drop: 2, land: -0.05 })); f = extend(f, { length: 100 });
  const carried = { before: +D.channelAt(f.pieces[0], 'c', f.pieces[0].length).v.toFixed(6), after: +D.channelAt(f.pieces[2], 'c', 0).v.toFixed(6), afterIsCup: !!f.pieces[2].cup };
  // (iv) legacy 12 m bowl (the cap binds) → cup: the rendered edge at the joint, from the mesh rows either side
  let g = extend(D.createDoc('g'), { length: 120, family: 'bowl', first: { w: 12 } }); g = extend(g, { length: 100, targets: { c: 60 } });
  const R = render(g), rs = rows(R), J = g.pieces[0].length, near = rs.filter((r) => Math.abs(r.s - J) < 1e-6), before = rs.filter((r) => r.s < J - 1e-6).pop(), after = rs.filter((r) => r.s > J + 1e-6)[0];
  const sm = seams(R).filter((x) => Math.abs(x.s - J) < 1e-6);
  const edgeJump = near.length >= 2 ? Math.max(Math.abs(near[0].psiL - near[near.length - 1].psiL), Math.abs(near[0].psiR - near[near.length - 1].psiR)) : 0;
  const cupStart = D.channelAt(g.pieces[1], 'c', 0).v, legacyEdge = D.legacyEdgeDeg('bowl', 12, D.channelAt(g.pieces[0], 'r', J).v);
  const ok = joint === 'JOINT' && Math.abs(carried.before - carried.after) < 1e-6 && carried.afterIsCup && Math.abs(cupStart - legacyEdge) <= 0.05 && edgeJump <= 0.05;
  say('3', { stepOf5deg: joint, flight: carried, legacyToCup: { legacyEdge: +legacyEdge.toFixed(4), cupStart: +cupStart.toFixed(4), rowsAtJoint: near.map((r) => [+r.psiL.toFixed(3), +r.psiR.toFixed(3)]), edgeJumpDeg: +edgeJump.toFixed(4), prevRow: before && +before.psiL.toFixed(3), nextRow: after && +after.psiL.toFixed(3), seamAtJoint: sm }, pass: ok });
}
if (want.has('6')) {
  const r6 = {};
  for (const f of FAM) for (const phi of [30, -30]) {
    const R = render(cupDoc(f, 30, 60, { phi: phi * DEG })), pc = R.mesh._state.pieces[0], row = pc.first, K = row.length, nC = centreN((k) => row[k].n, pc.Us);
    const up = [0, 1, 0], a = (v) => +ang(v.n, up).toFixed(4);
    r6[`${f} ${phi > 0 ? '+' : ''}${phi}`] = { left: a(row[K - 1]), centre: a({ n: nC }), right: a(row[0]), bankG: +(R.p.samples[2].bankG / DEG).toFixed(4) };
  }
  const exp = (phi) => (phi > 0 ? { left: 90, centre: 30, right: 30 } : { left: 30, centre: 30, right: 90 });
  const ok = Object.entries(r6).every(([k, v]) => { const phi = /-30/.test(k) ? -30 : 30, e = exp(phi); return ['left', 'centre', 'right'].every((s) => Math.abs(v[s] - e[s]) <= 0.05) && Math.abs(Math.abs(v.bankG) - 30) <= 0.05; });
  // the "also": the same Extend with and without a cup target gives the same turn/climb/bank/pitch readout and the same path
  const base = extend(D.createDoc('a'), { length: 100, family: 'bowl' });
  const e1 = extend(base, { length: 150, targets: { kh: 1 / 200, phi: 20 * DEG } }), e2 = extend(base, { length: 150, targets: { kh: 1 / 200, phi: 20 * DEG, c: 60 } });
  const r1 = RD.pieceReadout(e1, 1), r2 = RD.pieceReadout(e2, 1), keys = ['turnDeg', 'climbDeg', 'bankFromDeg', 'bankToDeg', 'pitchFromDeg', 'pitchToDeg', 'lengthM'];
  const p1 = AD.toPath(e1).path.samples, p2 = AD.toPath(e2).path.samples; let pd = 0; p1.forEach((m, i) => { pd = Math.max(pd, len(sub(m.pos, p2[i].pos)), Math.abs(m.roll - p2[i].roll)); });
  const also = { readoutSame: keys.every((k) => r1[k] === r2[k]), pathMaxDiff: pd };
  say('6', { edges: r6, also, pass: ok && also.readoutSame && pd === 0 });
}
if (want.has('7')) {
  let d = extend(D.createDoc('r7'), { length: 120, family: 'bowl', first: { w: 12 } });
  const legacy = RD.pieceReadout(d, 0), rendered = AD.toSegments(d).map((s) => s.profile.psi[s.profile.psi.length - 1] / DEG);
  const cand = RD.candidateReadout(d, { length: 100, targets: { c: 80 } }); d = extend(d, { length: 100, targets: { c: 80 } });
  const placed = RD.pieceReadout(d, 1), P = d.pieces[1];
  const b = SC.brush(d, { mode: 'value', channel: 'c', s0: 215, r: 30, delta: -10 }), moved = RD.pieceReadout(b.doc, 1), P2 = b.doc.pieces[1];
  const ok = Math.abs(legacy.cupFromDeg - rendered[0]) < 1e-9 && Math.abs(legacy.cupToDeg - rendered[rendered.length - 1]) < 1e-9 && Math.abs(legacy.cupFromDeg - 15.5) > 1
    && Math.abs(placed.cupFromDeg - D.channelAt(P, 'c', 0).v) < 1e-9 && Math.abs(placed.cupToDeg - D.channelAt(P, 'c', P.length).v) < 1e-9 && JSON.stringify(cand) === JSON.stringify(placed)
    && Math.abs(moved.cupToDeg - D.channelAt(P2, 'c', P2.length).v) < 1e-9 && Math.abs(moved.cupToDeg - placed.cupToDeg) > 0.1;
  say('7', { legacy: { cupFrom: legacy.cupFromDeg, cupTo: legacy.cupToDeg, renderedFirst: rendered[0], renderedLast: rendered[rendered.length - 1] }, cup: { cupFrom: placed.cupFromDeg, cupTo: placed.cupToDeg, candidateEqualsPlaced: JSON.stringify(cand) === JSON.stringify(placed) }, brushed: { cupTo: moved.cupToDeg }, pass: ok });
}
console.log('SUMMARY', JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.pass]))));
