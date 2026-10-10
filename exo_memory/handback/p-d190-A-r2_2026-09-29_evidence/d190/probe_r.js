// the numbers for the hand-back: R1's ramps (worst |edge − c(s)| over every row, tip mm, steps, seams) and R2's joint gaps, on the tree given
const T = process.argv[2] + '/', OPT = process.argv[3] === 'local' ? { cupRuns: false } : {};
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js');
const { buildMesh } = require(T + 'src/geom/mesh.js'), DEG = Math.PI / 180;
function rows(mesh, segments) {
  const out = [];
  mesh._state.pieces.forEach((pc, g) => {
    if (!pc || segments[g].kind === 'gap') return;
    const K = pc.K, k0 = pc.Us.reduce((b, u, k) => (Math.abs(u) < Math.abs(pc.Us[b]) ? k : b), 0);
    pc.cells.forEach((cell) => cell.rowS.forEach((s, r) => {
      const n = (k) => [0, 1, 2].map((i) => cell.normals[(r * K + k) * 3 + i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) / DEG;
      out.push({ g, s, e: (ang(n(K - 1), n(k0)) + ang(n(0), n(k0))) / 2 });
    }));
  });
  return out;
}
console.log('scheme', JSON.stringify(OPT) || 'default');
console.log('ramp | tail | worst edge off c (deg) | tip off (mm, bowl 31 m) | max step between rows (deg) | seams inside');
for (const [family, target, trans] of [['bowl', 90, 40], ['bowl', 150, 40], ['half-pipe', 150, 40], ['bowl', 90, 100], ['half-pipe', 150, 100], ['bowl', 150, 100]]) for (const tail of [0, 160]) {
  let d = extend(D.createDoc('r'), { length: 60, family }); d = extend(d, { length: trans + tail, transition: trans, targets: { c: target } });
  const segs = A.toSegments(d, OPT), { path } = A.toPath(d), mesh = buildMesh(path, segs), P = d.pieces[1], idx = segs.map((g, i) => (g.id === 'p2' ? i : -1)).filter((i) => i >= 0);
  const R = rows(mesh, segs).filter((r) => idx.includes(r.g)).sort((a, b) => a.s - b.s); let worst = 0, step = 0;
  R.forEach((r, i) => { worst = Math.max(worst, Math.abs(r.e - D.channelAt(P, 'c', Math.min(P.length, Math.max(0, r.s - 60))).v)); if (i) step = Math.max(step, Math.abs(r.e - R[i - 1].e)); });
  const seams = idx.slice(1).filter((g) => mesh._state.seams[g]).length;
  console.log(`${family} ->${target}/${trans}m | ${tail} | ${worst.toFixed(4)} | ${(worst * DEG * (family === 'bowl' ? 15.5 : 15.75) * 1000).toFixed(1)} | ${step.toFixed(3)} | ${seams}`);
}
// R2: the gap the joint's zip spans
function rowGap(a, b) {
  const P = (r) => r.map((v) => v.p), sub = (x, y) => [x[0] - y[0], x[1] - y[1], x[2] - y[2]], dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
  const near = (q, poly) => { let best = Infinity; for (let i = 0; i + 1 < poly.length; i++) { const d = sub(poly[i + 1], poly[i]), w = sub(q, poly[i]), t = Math.max(0, Math.min(1, dot(w, d) / (dot(d, d) || 1))), r = sub(w, d.map((x) => x * t)); best = Math.min(best, Math.hypot(r[0], r[1], r[2])); } return best; };
  const A1 = P(a), B1 = P(b); return Math.max(...A1.map((q) => near(q, B1)), ...B1.map((q) => near(q, A1)));
}
console.log('R2 legacy road | gap at the joint (mm)');
for (const [family, w] of [['bowl', 12], ['half-pipe', 24], ['bowl', 18], ['flat', 20], ['bowl', 31], ['half-pipe', 31.5], ['flat', 45]]) {
  let d = extend(D.createDoc('j'), { length: 100, family, first: { w } }); d = extend(d, { length: 120, transition: 60, targets: { c: 60 } });
  const segs = A.toSegments(d, OPT), { path } = A.toPath(d), mesh = buildMesh(path, segs), g = segs.findIndex((x) => x.id === 'p2');
  console.log(`${family} ${w} m | ${(rowGap(mesh._state.pieces[g - 1].last, mesh._state.pieces[g].first) * 1000).toFixed(3)}`);
}
