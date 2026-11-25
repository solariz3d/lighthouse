// render2.js: render saved attempts with the builder's OWN road mesh (src/geom/mesh.js buildMesh: the cup, the width, the cells the export
// writes) through the look-match rasteriser (src/lookmatch/raster.js renderView, the preview's shading and fog). Two views per attempt:
//   view  his screenshot's chase view: 55 m behind measured d 400 and 42 m up, aimed at d 530, 62° across (as render.js, the last lap)
//   top   from above, the run-in pointing up the image, one scale for every attempt (SCALE m per image height)
// The default export carries no texture (src/doc/textures.js: "v1 ships no textures of its own"), so the road wears t180b_road's
// plain colour, as it would in AC. usage: node render2.js <t180 tree> <docs.json> <out dir> [prefix] [mirror 0|1]
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), zlib = require('zlib');
const [tree, docsFile, outDir, prefix = 'r', mirrorArg = '0'] = process.argv.slice(2), MIRROR = mirrorArg === '1';
const R = (p) => require(path.join(tree, p)), A = R('src/core/adapter.js'), { buildMesh } = R('src/geom/mesh.js'), { renderView } = R('src/lookmatch/raster.js');
const { encodePng } = R('src/texture/png.js');
const LEAD = 300, D0 = 340, W = 1280, H = 720, SCALE = +(process.env.SCALE || 420);
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const mul = (a, b) => { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j]; return o; };
const I4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
// the scene in world space, as kn5scene gives it: meshes {name, material, pos, nrm, uv, idx}; materials with props and samplers as objects
function worldScene(scene) {
  const meshes = [], fx = MIRROR ? -1 : 1;
  (function visit(n, M) {
    if (n.type === 'dummy') { const W2 = mul(n.matrix, M); for (const c of n.children || []) visit(c, W2); return; }
    if (n.type !== 'mesh') throw new Error(`render2: node ${n.name} of type ${n.type}`);
    const p = n.positions, q = n.normals, k = p.length / 3, pos = new Float64Array(p.length), nrm = new Float64Array(p.length);
    for (let v = 0; v < k; v++) {
      const x = p[v * 3], y = p[v * 3 + 1], z = p[v * 3 + 2], a = q[v * 3], b = q[v * 3 + 1], c = q[v * 3 + 2];
      pos[v * 3] = fx * (x * M[0] + y * M[4] + z * M[8] + M[12]); pos[v * 3 + 1] = x * M[1] + y * M[5] + z * M[9] + M[13]; pos[v * 3 + 2] = x * M[2] + y * M[6] + z * M[10] + M[14];
      nrm[v * 3] = fx * (a * M[0] + b * M[4] + c * M[8]); nrm[v * 3 + 1] = a * M[1] + b * M[5] + c * M[9]; nrm[v * 3 + 2] = a * M[2] + b * M[6] + c * M[10];
    }
    let idx = n.indices; if (MIRROR) { idx = Array.from(idx); for (let t = 0; t < idx.length; t += 3) [idx[t + 1], idx[t + 2]] = [idx[t + 2], idx[t + 1]]; }
    meshes.push({ name: n.name, material: n.material, pos, nrm, uv: n.uvs, idx });
  })(scene.root, I4);
  const materials = scene.materials.map((m) => ({ name: m.name, shader: m.shader, alphaTested: m.alphaTested,
    props: Object.fromEntries(m.props.map((p) => [p.name, p.name === 'ksEmissive' ? [0, 0, 0, ...p.value] : p.value])),
    samplers: GRID ? { txDiffuse: 'reading-grid' } : Object.fromEntries((m.samplers || []).map((s) => [s.name, s.texture])) }));
  return { meshes, materials };
}
// GRID=1: a READING GRID on the mesh's own uvs (u and v run 1 per 10 m, as mesh.js lays them): a thin line every 2.5 m each way,
// a heavier one every 10 m, so the cup and the bank read in a still picture. It is NOT the export's look: the export wears no texture.
const GRID = process.env.GRID === '1', textures = new Map();
if (GRID) {
  const N = 256, rgba = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const o = (y * N + x) * 4, major = x < 3 || y < 3, minor = x % 64 < 2 || y % 64 < 2, c = major ? 40 : minor ? 95 : 200;
    rgba[o] = c; rgba[o + 1] = c; rgba[o + 2] = major ? c : minor ? c : 190; rgba[o + 3] = 255;
  }
  textures.set('reading-grid', { width: N, height: N, rgba });
}
// CAM="dEye,back,up,dTarget,hfov": his screenshot's chase view (default 445,22,20,505,75); measured d along the road
const [cE, cB, cU, cT, cF] = (process.env.CAM || '445,22,20,505,75').split(',').map(Number);
const sky = [0.62, 0.70, 0.78], ground = [0.36, 0.40, 0.33];
function png(img, file, over) {
  const rgba = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, bg = over === 'top' ? ground : sky;
    if (img.rgba[i + 3]) { rgba[i] = img.rgba[i]; rgba[i + 1] = img.rgba[i + 1]; rgba[i + 2] = img.rgba[i + 2]; } else { rgba[i] = bg[0] * 255; rgba[i + 1] = bg[1] * 255; rgba[i + 2] = bg[2] * 255; }
    rgba[i + 3] = 255;
  }
  fs.writeFileSync(file, encodePng({ width: W, height: H, rgba }, (b) => zlib.deflateSync(b)));
}
fs.mkdirSync(outDir, { recursive: true });
const docs = require(path.resolve(docsFile));
docs.forEach((a, k) => {
  const tp = A.toPath(a.doc, { step: 0.5 }), mesh = buildMesh(tp.path, tp.segments, {}), sc = worldScene(mesh.scene);
  const S = tp.path.samples, at = (d) => { const s = S.reduce((p, q) => (Math.abs(q.s - (d - D0 + LEAD)) < Math.abs(p.s - (d - D0 + LEAD)) ? q : p)); return MIRROR ? { pos: [-s.pos[0], s.pos[1], s.pos[2]], T: [-s.T[0], s.T[1], s.T[2]] } : s; };
  const c0 = at(cE), tgt = at(cT).pos, eye = add(add(c0.pos, c0.T, -cB), [0, 1, 0], cU);
  const v1 = renderView(sc, { eye, target: tgt, up: [0, 1, 0], fovDeg: 2 * Math.atan(Math.tan((cF / 2) * Math.PI / 180) * H / W) * 180 / Math.PI, width: W, height: H }, { fogDensity: 0.0008, textures });
  png(v1, path.join(outDir, `${prefix}${k}_view.png`), 'view');
  // from above: centred on the stretch's middle, the run-in's direction up the image; fov so that SCALE m spans the image's height from 900 m up
  const mid = at(528).pos, run = at(380).T, up = [run[0], 0, run[2]], h = 900, fov = 2 * Math.atan(SCALE / 2 / h) * 180 / Math.PI;
  const v2 = renderView(sc, { eye: [mid[0], mid[1] + h, mid[2]], target: mid, up, fovDeg: fov, width: W, height: H }, { fogDensity: 0, textures });
  png(v2, path.join(outDir, `${prefix}${k}_top.png`), 'top');
  console.log(`${prefix}${k} ${a.name}: ${sc.meshes.length} meshes, view drew ${v1.stats.drawn} of ${v1.stats.triangles}, top ${v2.stats.drawn}`);
});
