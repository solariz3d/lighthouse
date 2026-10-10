// which rows carry the largest step / are outside the range, for the failing 1b cases
const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js'), { buildMesh } = require(T + 'src/geom/mesh.js');
const DEG = Math.PI / 180;
function rows(mesh, segments) {
  const out = [];
  mesh._state.pieces.forEach((pc, g) => {
    if (!pc || segments[g].kind === 'gap') return;
    const K = pc.K, k0 = pc.Us.reduce((b, u, k) => (Math.abs(u) < Math.abs(pc.Us[b]) ? k : b), 0);
    pc.cells.forEach((cell) => cell.rowS.forEach((s, r) => {
      const n = (k) => [0, 1, 2].map((i) => cell.normals[(r * K + k) * 3 + i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const ang = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) / DEG;
      out.push({ g, s, K, k0, left: ang(n(K - 1), n(k0)), right: ang(n(0), n(k0)), n0: n(0), nc: n(k0), nl: n(K - 1) });
    }));
  });
  return out;
}
for (const [label, targets, trans] of [['bowl 90/40', { c: 90 }, 40], ['bowl 90 + w20 /100', { c: 90, w: 20 }, 100]]) {
  let d = extend(D.createDoc('r'), { length: 60 }); d = extend(d, { length: 200, transition: trans, targets });
  const { segments, path } = A.toPath(d), mesh = buildMesh(path, segments), P = d.pieces[1];
  const idx = segments.map((g, i) => (g.id === P.id ? i : -1)).filter((i) => i >= 0); let start = 0; for (let i = 0; i < idx[0]; i++) start += segments[i].length;
  const R = rows(mesh, segments).filter((r) => idx.includes(r.g)).sort((a, b) => a.s - b.s);
  let worst = 0, wi = -1; R.forEach((r, i) => { if (i) { const st = Math.max(Math.abs(r.left - R[i - 1].left), Math.abs(r.right - R[i - 1].right)); if (st > worst) { worst = st; wi = i; } } });
  console.log(label, 'rows', R.length, 'worst step', worst.toFixed(4), 'at i', wi);
  for (const i of [wi - 1, wi, wi + 1].filter((i) => i > 0 && i < R.length)) { const r = R[i]; console.log('  row', i, 'g', r.g, 's', (r.s - start).toFixed(4), 'K', r.K, 'left', r.left.toFixed(4), 'right', r.right.toFixed(4), 'c(s)', D.channelAt(P, 'c', r.s - start).v.toFixed(4)); }
  // and compare the first few rows to c
  for (const i of [0, 1, 2, 10, 30]) { const r = R[i]; if (r) console.log('  head row', i, 'g', r.g, 's', (r.s - start).toFixed(3), 'left', r.left.toFixed(3), 'right', r.right.toFixed(3), 'c(s)', D.channelAt(P, 'c', Math.max(0, r.s - start)).v.toFixed(3)); }
}
