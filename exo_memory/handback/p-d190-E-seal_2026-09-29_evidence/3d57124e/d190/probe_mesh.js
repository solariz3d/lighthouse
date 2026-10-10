// probe: mesh a cup ramp; seams between segments of the cup piece, and the edge ψ of every mesh row against c(s)
const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js');
const { buildMesh } = require(T + 'src/geom/mesh.js'), { walkScene } = require(T + 'src/export/markers.js');
const DEG = 180 / Math.PI;
function edgeAngles(mesh, K) {   // per mesh (cell): rows of K vertices; edge ψ = angle between the row's outermost normal and its centre normal (each side)
  const out = [];
  for (const m of walkScene(mesh.scene).meshes) {
    if (!m.normals || String(m.name).includes('seam')) continue;
    const n = m.normals, rows = n.length / 3 / K; if (!Number.isInteger(rows)) continue;
    for (let r = 0; r < rows; r++) {
      const at = (k) => [n[(r * K + k) * 3], n[(r * K + k) * 3 + 1], n[(r * K + k) * 3 + 2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const mid = at(Math.round((K - 1) / 2)); out.push({ name: m.name, r, left: Math.acos(Math.max(-1, Math.min(1, dot(at(0), mid)))) * DEG, right: Math.acos(Math.max(-1, Math.min(1, dot(at(K - 1), mid)))) * DEG });
    }
  }
  return out;
}
for (const [label, family, target, trans] of [['bowl 15.5→90 over 40', 'bowl', 90, 40], ['half-pipe →150 over 40', 'half-pipe', 150, 40], ['bowl →150 over 100', 'bowl', 150, 100]]) {
  let d = extend(D.createDoc(label), { length: 60, family });
  d = extend(d, { length: 200, transition: trans, targets: { c: target } });
  const { segments, path } = A.toPath(d), mesh = buildMesh(path, segments);
  const seams = mesh.cells.filter((c) => c.seam), cupSeg = new Set(segments.map((g, i) => (g.id === 'p2' ? i : -1)).filter((i) => i >= 0));
  const seamsInCup = seams.filter((c) => cupSeg.has(c.piece) && cupSeg.has(c.piece - 1)).length;
  const c = (s) => D.channelAt(d.pieces[1], 'c', s).v;
  console.log(label, '| seam cells total', seams.length, '| between two cup segments', seamsInCup, '| segments', segments.length, '| c(0), c(40), c(L)', c(0).toFixed(3), c(40).toFixed(3), c(200).toFixed(3));
  // edge ψ of each mesh piece's first/last rows vs c at that station, via the mesh's own vertex normals: K per piece from its cells
  let worst = 0, n = 0;
  for (const cell of mesh.cells) {
    if (cell.seam || !cell.rowS) continue;
  }
}
