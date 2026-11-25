// fit.js: fit ONE piece (the as-built check skipped: a scratch copy of turnby.js) to the read's CURVES every 4 m, not to five marks: the centre line in plan
// (aligned on the run-in straight) and the bank. Free: a turn extra every TS m and a bank change every BS m (the core's floors: 21 m a corner, 26 m a bank).
// Levenberg-Marquardt, the Jacobian by finite differences through the core. Prints only error figures; the fitted document and profiles stay in <out>.
// usage: node fit.js <t180 tree> <read.json> <out dir> [TS=24] [BS=28] [wPos=1]
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs');
const argv = process.argv.slice(2), [tree, readFile, outDir] = argv, TS = +(argv[3] || 24), BS = +(argv[4] || 28), WPOS = +(argv[5] || 1);
const R = (p) => require(path.join(tree, p)), DOC = R('src/core/document.js'), { extend } = R('src/core/extend.js'), A = R('src/core/adapter.js'), NC = R('src/core/turnby_nocheck.scratch.js');
const DEG = Math.PI / 180, LEAD = 300, L = 372, D0 = 340, DS = [];
for (let d = 340; d <= 712; d += 4) DS.push(d);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// the profile of a list of {d, c, f, n}: heading (accumulated, raw), bank (raw: n toward the horizontal left of f), plan x z
function frames(list) {
  let acc = 0, prev = null;
  return list.map((x) => {
    const f = x.f, n = x.n;
    if (prev) acc += Math.atan2(prev[2] * f[0] - prev[0] * f[2], prev[0] * f[0] + prev[2] * f[2]);
    prev = f;
    const ll = Math.hypot(f[2], f[0]), left = [f[2] / ll, 0, -f[0] / ll];
    const u2 = [left[1] * f[2] - left[2] * f[1], left[2] * f[0] - left[0] * f[2], left[0] * f[1] - left[1] * f[0]];
    return { d: x.d, h: acc, bank: Math.atan2(dot(n, left), -dot(n, u2)), x: x.c[0], z: x.c[2] };
  });
}
const near = (arr, d) => arr.reduce((p, q) => (Math.abs(q.d - d) < Math.abs(p.d - d) ? q : p));

// ── the real road: centre POSITIONS (a ±2-station chord for the tangent), the station normal for the bank
const read = require(path.resolve(readFile)), st = read.stations.filter((s) => s.c && s.n && s.d >= 300 && s.d <= 760);
const realRaw = frames(st.slice(2, -2).map((s, i) => {
  const a = st[i].c, b = st[i + 4].c, t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...t);
  return { d: s.d, c: s.c, f: t.map((v) => v / l), n: s.n };
}));
const sgR = Math.sign(near(realRaw, 516).h - near(realRaw, 452).h);
const real = DS.map((d) => { const x = near(realRaw, d); return { d, bank: (x.bank * sgR) / DEG, h: (x.h * sgR) / DEG, x: x.x, z: x.z }; });

// ── a built road at the same d
function built(doc) {
  const P = A.toPath(doc, { step: 0.5 }).path, sm = P.samples.filter((x) => x.s >= LEAD - 4 && x.s <= LEAD + L);
  const raw = frames(sm.map((x) => ({ d: D0 + x.s - LEAD, c: x.pos, f: x.T, n: x.U })));
  const sg = Math.sign(near(raw, 516).h - near(raw, 452).h) || 1;
  const lat = (d) => sm.reduce((p, q) => (Math.abs(D0 + q.s - LEAD - d) < Math.abs(D0 + p.s - LEAD - d) ? q : p));
  return { sg, rows: DS.map((d) => { const x = near(raw, d), s = lat(d); return { d, bank: (x.bank * sg) / DEG, h: (x.h * sg) / DEG, x: x.x, z: x.z,
    eL: [s.pos[0] + s.L[0] * 16.5, s.pos[2] + s.L[2] * 16.5], eR: [s.pos[0] - s.L[0] * 16.5, s.pos[2] - s.L[2] * 16.5] }; }) };
}
// plan alignment on the run-in (d 340..440): a rigid map of the built plan onto the real one (2D Kabsch), mirrored when the two worlds turn turn A opposite ways
function align(b, mirror) {
  const pts = b.rows.map((r, i) => ({ p: [mirror ? -r.x : r.x, r.z], q: [real[i].x, real[i].z], d: r.d })), run = pts.filter((x) => x.d <= 440);
  const mp = [0, 1].map((k) => run.reduce((s, x) => s + x.p[k], 0) / run.length), mq = [0, 1].map((k) => run.reduce((s, x) => s + x.q[k], 0) / run.length);
  let sxx = 0, sxy = 0;
  for (const x of run) { const a = [x.p[0] - mp[0], x.p[1] - mp[1]], c = [x.q[0] - mq[0], x.q[1] - mq[1]]; sxx += a[0] * c[0] + a[1] * c[1]; sxy += a[0] * c[1] - a[1] * c[0]; }
  const th = Math.atan2(sxy, sxx), co = Math.cos(th), si = Math.sin(th);
  const map = (xz) => { const a = [(mirror ? -xz[0] : xz[0]) - mp[0], xz[1] - mp[1]]; return [mq[0] + co * a[0] - si * a[1], mq[1] + si * a[0] + co * a[1]]; };
  return { pts: pts.map((x) => { const a = [x.p[0] - mp[0], x.p[1] - mp[1]]; return [mq[0] + co * a[0] - si * a[1], mq[1] + si * a[0] + co * a[1]]; }), mp, mq, th, mirror,
    edges: b.rows.map((r) => [map(r.eL), map(r.eR)]) };
}

// ── the parameters: turn extras (deg, builder sign: + = left) at marks every TS m; the first ramp's bank and bank targets every BS m (deg; into turn A = +)
const TM = []; for (let m = 80; m <= 300; m += TS) TM.push(m);
const B0 = +(process.env.B0 || 112); // the first ramp: level at the piece's start (measured 340) to its first target at local B0 (112 unless B0 is given)
const BM = []; for (let m = B0; m + BS <= L - 8; m += BS) BM.push(m);
const lead = extend(DOC.createDoc('fit'), { length: LEAD, family: 'bowl', first: { w: 33 } });
function docOf(p) {
  const turns = TM.map((m, i) => ({ from: m, deg: i === TM.length - 1 && Math.abs(p[i]) < 0.001 ? 0.001 : p[i] }));
  const b = p.slice(TM.length);
  return NC.extendCorner(lead, { length: L, bankShape: 'rounded', targets: { phi: b[0] * DEG }, transition: { phi: B0 }, turnDeg: 0,
    changes: { turnDeg: turns, phi: BM.map((m, k) => ({ from: m, target: b[k + 1] * DEG })) } });
}
// turn A of the reference is a RIGHT turn in his screenshot: in the builder a negative turn, and the bank into it (left side up) is phi = +bank
const realAt = (d) => near(real, d);
let p0 = TM.map((m, i) => -(realAt(D0 + (TM[i + 1] || L)).h - realAt(D0 + m).h));
p0 = p0.concat([realAt(D0 + B0).bank], BM.map((m, k) => realAt(D0 + (BM[k + 1] || L)).bank));
let MIRROR = null;
function resid(p) {
  let doc;
  try { doc = docOf(p); } catch (e) { return { bad: `${e.code} ${String(e.message).slice(0, 160)}` }; }
  const b = built(doc);
  if (MIRROR === null) MIRROR = !(b.sg * sgR > 0);
  const al = align(b, MIRROR), r = [];
  b.rows.forEach((x, i) => { r.push(x.bank - real[i].bank); r.push(WPOS * (al.pts[i][0] - real[i].x)); r.push(WPOS * (al.pts[i][1] - real[i].z)); });
  return { r, doc, b, al };
}
const ss = (r) => r.reduce((s, x) => s + x * x, 0);
// EVAL_DOCS=<docs.json>: no fit; each saved attempt's gaps and roll rates, the same alignment, written with its plan and edges to <out>/eval.json
if (process.env.EVAL_DOCS) {
  const out = [], realEdges = DS.map((d) => {
    const s = st.reduce((p, q) => (Math.abs(q.d - d) < Math.abs(p.d - d) ? q : p)), x = near(realRaw, d), n = s.n, f = (() => { const i = st.indexOf(s), a = st[Math.max(0, i - 2)].c, b = st[Math.min(st.length - 1, i + 2)].c, t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...t); return t.map((v) => v / l); })();
    const lat = [n[1] * f[2] - n[2] * f[1], n[2] * f[0] - n[0] * f[2], n[0] * f[1] - n[1] * f[0]], ll = Math.hypot(...lat), hw = (s.width || 33) / 2;
    return [[s.c[0] + (lat[0] / ll) * hw, s.c[2] + (lat[2] / ll) * hw], [s.c[0] - (lat[0] / ll) * hw, s.c[2] - (lat[2] / ll) * hw]]; });
  for (const a of require(path.resolve(process.env.EVAL_DOCS))) {
    const b = built(a.doc); if (MIRROR === null) MIRROR = !(b.sg * sgR > 0);
    const al = align(b, MIRROR), t = { doc: a.doc, b, al }, f = figures(t);
    out.push({ name: a.name, plan: al.pts, edges: al.edges, rows: f.rows, rates: f.rates, wb: f.wb, wp: f.wp, pkB: f.pkB, pkR: f.pkR, rms: f.rms });
    console.log(`${a.name}: largest plan gap ${f.wp.gapPlan.toFixed(1)} m at ${f.wp.d}; largest bank gap ${f.wb.gapBank.toFixed(1)}° at ${f.wb.d} (rms ${f.rms.toFixed(2)}°); peak roll rate built ${Math.abs(f.pkB.built).toFixed(2)}°/m at ${f.pkB.d}, real ${Math.abs(f.pkR.real).toFixed(2)}°/m`);
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'eval.json'), JSON.stringify({ real: real.map((r, i) => ({ ...r, edges: realEdges[i] })), attempts: out }));
  process.exit(0);
}
let cur = resid(p0);
if (cur.bad) { console.log('the first guess is refused:', cur.bad); process.exit(1); }
const guess = cur;
let lam = 1e-2, p = p0.slice();
for (let it = 0; it < 40; it++) {
  const J = p.map((_, j) => { const q = p.slice(); q[j] += 0.5; const t = resid(q); return t.bad ? null : t.r.map((v, i) => (v - cur.r[i]) / 0.5); });
  const n = p.length, JTJ = Array.from({ length: n }, () => new Array(n).fill(0)), g = new Array(n).fill(0);
  for (let a = 0; a < n; a++) {
    if (!J[a]) continue;
    for (let i = 0; i < cur.r.length; i++) g[a] += J[a][i] * cur.r[i];
    for (let c = 0; c < n; c++) if (J[c]) { let s = 0; for (let i = 0; i < cur.r.length; i++) s += J[a][i] * J[c][i]; JTJ[a][c] = s; }
  }
  let stepped = false;
  for (let tries = 0; tries < 8 && !stepped; tries++) {
    const M = JTJ.map((row, a) => row.map((v, c) => v + (a === c ? lam * (JTJ[a][a] || 1) + 1e-9 : 0)).concat([-g[a]]));
    for (let c = 0; c < n; c++) {
      let pv = c; for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[pv][c])) pv = i;
      [M[c], M[pv]] = [M[pv], M[c]];
      for (let i = c + 1; i < n; i++) { const f = M[i][c] / M[c][c]; for (let j = c; j <= n; j++) M[i][j] -= f * M[c][j]; }
    }
    const dx = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let v = M[i][n]; for (let j = i + 1; j < n; j++) v -= M[i][j] * dx[j]; dx[i] = v / M[i][i]; }
    const q = p.map((v, i) => v + dx[i]), t = resid(q);
    if (!t.bad && ss(t.r) < ss(cur.r)) { p = q; cur = t; lam = Math.max(1e-6, lam / 3); stepped = true; } else lam *= 4;
  }
  if (!stepped) break;
}

// ── the figures: bank and plan gaps along the shape, the document's own bank (what the adapter was asked for), roll rates over a 20 m chord
function figures(t) {
  const P = t.doc.pieces[1];
  const rows = t.b.rows.map((x, i) => ({ d: x.d, bank: x.bank, realBank: real[i].bank, docBank: (DOC.channelValue(P, 'phi', x.d - D0) / DEG) * (t.b.sg < 0 ? -1 : 1) * -1,
    gapBank: x.bank - real[i].bank, gapPlan: Math.hypot(t.al.pts[i][0] - real[i].x, t.al.pts[i][1] - real[i].z) }));
  // the document's bank in the into-turn-A sign: the builder's phi + is into turn A (a right turn), so docBank = +phi; checked against the built bank below
  const one = t.doc.pieces.length === 2;   // the lead straight and ONE piece: its document bank is read; for pieces it is not
  rows.forEach((x) => { x.docBank = one ? DOC.channelValue(P, 'phi', x.d - D0) / DEG : NaN; x.adapter = x.bank - x.docBank; x.repr = x.docBank - x.realBank; });
  const worst = (k, set = rows) => set.reduce((a, b) => (Math.abs(b[k]) > Math.abs(a[k]) ? b : a));
  const rate = (arr, i) => { const a = Math.max(0, i - 2), b = Math.min(arr.length - 1, i + 3); return (arr[b] - arr[a]) / (rows[b].d - rows[a].d); };
  const rb = rows.map((x) => x.bank), rr = rows.map((x) => x.realBank);
  const rates = rows.map((x, i) => ({ d: x.d, built: rate(rb, i), real: rate(rr, i) }));
  const pk = (k) => rates.reduce((a, b) => (Math.abs(b[k]) > Math.abs(a[k]) ? b : a));
  return { rows, rates, wb: worst('gapBank'), wp: worst('gapPlan'), wa: worst('adapter'), wr: worst('repr'), pkB: pk('built'), pkR: pk('real'),
    rms: Math.sqrt(rows.reduce((s, x) => s + x.gapBank ** 2, 0) / rows.length) };
}
const F = figures(cur), G = figures(guess);
for (const [n, f] of [['first guess (the read at each mark)', G], ['fitted', F]]) {
  console.log(`${n}: largest bank gap ${f.wb.gapBank.toFixed(1)}° at ${f.wb.d} (rms ${f.rms.toFixed(2)}°); largest plan gap ${f.wp.gapPlan.toFixed(1)} m at ${f.wp.d}; ` +
    `peak roll rate (20 m chord) built ${Math.abs(f.pkB.built).toFixed(2)}°/m at ${f.pkB.d}, real ${Math.abs(f.pkR.real).toFixed(2)}°/m at ${f.pkR.d}`);
  console.log(`   built minus document (the adapter): largest ${f.wa.adapter.toFixed(1)}° at ${f.wa.d}; document minus real (what the ramps can say): largest ${f.wr.repr.toFixed(1)}° at ${f.wr.d}`);
}
console.log(`mirror ${MIRROR}; ${TM.length} turn extras every ${TS} m, ${BM.length + 1} bank targets every ${BS} m; ${p.length} parameters`);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'fit.json'), JSON.stringify({ TS, BS, mirror: MIRROR, real, fitted: F, guess: G, align: { mp: cur.al.mp, mq: cur.al.mq, th: cur.al.th } }));
fs.writeFileSync(path.join(outDir, 'docs.json'), JSON.stringify([{ name: `fit one piece turns every ${TS} m bank every ${BS} m check skipped`, doc: cur.doc }]));
// the same fitted document laid by the REAL turnby.js (the as-built check on): does today's core take it?
{
  const TB = R('src/core/turnby.js'), b = p.slice(TM.length), turns = TM.map((m, i) => ({ from: m, deg: i === TM.length - 1 && Math.abs(p[i]) < 0.001 ? 0.001 : p[i] }));
  try { TB.extendCorner(lead, { length: L, bankShape: 'rounded', targets: { phi: b[0] * DEG }, transition: { phi: B0 }, turnDeg: 0, changes: { turnDeg: turns, phi: BM.map((m, k) => ({ from: m, target: b[k + 1] * DEG })) } }); console.log('the real turnby.js (check on): laid'); }
  catch (e) { console.log(`the real turnby.js (check on): refused, ${e.code}: ${String(e.message).slice(0, 300)}`); }
}
