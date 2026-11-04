// prototype: does blend {from: previous profile} make adjacent cup segments' boundary rows coincide (no seam zip)?
const T = 'C:/Users/nname/Desktop/a-d188-wt/';
const { buildPath } = require(T + 'src/geom/path.js'), { buildMesh } = require(T + 'src/geom/mesh.js'), { FLOORS, AT } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180, S3 = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
function cupProfile(family, w, cdeg) {
  const F = FLOORS[family], E = F[3], side = AT.map((f, i) => [(f * w) / 2, ((cdeg * F[i]) / E) * DEG]);
  return { font: family, u: [...side.slice().reverse().map(([x]) => -x), 0, ...side.map(([x]) => x)], psi: [...side.slice().reverse().map(([, p]) => p), 0, ...side.map(([, p]) => p)], material: 'ROAD' };
}
const cAt = (s) => 15.5 + (90 - 15.5) * S3(s / 40);
function build(mode, family = 'bowl') {
  const segs = []; const n = 50, w = 31; let prev = null;
  for (let j = 0; j < n; j++) {
    const s0 = 2 * j, s1 = 2 * j + 2, mid = cupProfile(family, w, cAt((s0 + s1) / 2)), a = cupProfile(family, w, cAt(s0)), b = cupProfile(family, w, cAt(s1));
    let seg = { id: 'p1', word: 'core', part: 'body', kind: 'road', length: 2, k0: 0, k1: 0, kp0: 0, kp1: 0, roll0: 0, roll1: 0, heartline: 0, speed: null };
    if (mode === 'stair') seg = { ...seg, profile: mid, blend: null };
    else if (mode === 'blendprev') seg = { ...seg, profile: b, blend: { from: a, s0: 0, length: 2 } };
    segs.push(seg);
  }
  const path = buildPath(segs, { step: 0.5, closed: false, start: { pos: [0, 0, 0], theta: 0, p: 0 } });
  const m = buildMesh(path, segs);
  const seams = m.cells.filter((c) => c.seam).length;
  return { seams, cells: m.cells.length, maxSeamDeg: m.stats && m.stats.maxSeamDeg };
}
for (const mode of ['stair', 'blendprev']) console.log(mode, JSON.stringify(build(mode)));
