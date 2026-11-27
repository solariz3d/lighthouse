// render678.js (pane E, D678): pictures of the held width's joint at TRUE SCALE, headless on the CPU (src/lookmatch/raster.js renderView, the preview's own
// shading; no browser, no app, no game). For each tree (before e112a14, after c2591bf) and each scene: the E4 head (the app's brush, +5 m centred 30 m before
// the end, radius 40) then the panel's Extend as shown (100 m) and one more as shown (60 m); and the same head then the panel's Sharp -60 deg R 40 ramp 8.
// The road is the builder's own mesh (src/geom buildMesh of the adapter's path), written to a kn5 in memory and read back in world space (kn5scene readScene).
//   driver: eye 1.1 m over the centreline 12 m before the joint, looking 30 m past it; 55 deg vertical field of view, 1600 x 900.
//   above:  eye 1500 m over the road 12 m past the joint, looking straight down, the road running up the picture; 50 px per metre on BOTH axes (24 m x 40 m).
//           On the above pictures a thin line marks where each edge would run if the width stayed exactly the head's (its distance from the centreline at
//           the joint, carried on): grey; the edge as built is the road's own boundary. A tick every 5 m along the centreline from the joint (white).
// Also: the edges as built (from the mesh's vertices) every 0.25 m, per tree, to edges678.json; and an overlay plan (both trees' edges and the reference).
// Each picture's short commit is burned into its top-left corner. usage: node render678.js <beforeTree> <afterTree> <outDir>
'use strict';
const path = require('path'), fs = require('fs');
const [TB0, TA0, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const { execSync } = require('child_process');
const sha = (t) => execSync('git rev-parse --short=7 HEAD', { cwd: t, encoding: 'utf8' }).trim();
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(...a); return mul(a, 1 / l); };
// a 3 x 5 font for the hex digits and a few letters, burned at scale k
const FONT = { 0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111',
  a: '010101111101101', b: '110101110101110', c: '011100100100011', d: '110101101101110', e: '111100110100111', f: '111100110100100', ' ': '000000000000000' };
function burn(img, W, text, x0, y0, k, rgb) { let x = x0; for (const ch of text) { const g = FONT[ch] || FONT[' ']; for (let j = 0; j < 15; j++) if (g[j] === '1') for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) { const px = x + (j % 3) * k + dx, py = y0 + Math.floor(j / 3) * k + dy, o = (py * W + px) * 4; img[o] = rgb[0]; img[o + 1] = rgb[1]; img[o + 2] = rgb[2]; img[o + 3] = 255; } x += 4 * k; } }
function projector(cam) {
  const f = unit(sub(cam.target, cam.eye)), r = unit(cross(f, cam.up)), u = cross(r, f), t = Math.tan((cam.fovDeg * Math.PI) / 360), aspect = cam.width / cam.height;
  return (p) => { const d = sub(p, cam.eye), vx = dot(d, r), vy = dot(d, u), vz = -dot(d, f); if (vz > -0.1) return null; const iw = 1 / -vz; return [(vx * iw / (t * aspect) * 0.5 + 0.5) * cam.width, (0.5 - vy * iw / t * 0.5) * cam.height]; };
}
function line(img, W, H, a, b, rgb, thick = 1) {
  if (!a || !b) return; const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2) + 1;
  for (let i = 0; i <= n; i++) { const x = a[0] + ((b[0] - a[0]) * i) / n, y = a[1] + ((b[1] - a[1]) * i) / n; for (let dy = -thick + 1; dy < thick; dy++) for (let dx = -thick + 1; dx < thick; dx++) { const px = Math.round(x + dx), py = Math.round(y + dy); if (px < 0 || py < 0 || px >= W || py >= H) continue; const o = (py * W + px) * 4; img[o] = rgb[0]; img[o + 1] = rgb[1]; img[o + 2] = rgb[2]; img[o + 3] = 255; } }
}
function treeOf(T) {
  const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
  const { toPath } = require(path.join(T, 'src/core/adapter.js')), { buildMesh } = require(path.join(T, 'src/geom/mesh.js'));
  const { writeKn5 } = require(path.join(T, 'src/export/kn5write.js')), { readScene } = require(path.join(T, 'src/lookmatch/kn5scene.js'));
  const { renderView } = require(path.join(T, 'src/lookmatch/raster.js')), { encodePng } = require(path.join(T, 'src/export/trackfiles.js'));
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
  return { T, sha: sha(T), D, extend, toPath, buildMesh, writeKn5, readScene, renderView, encodePng, createCoreShell, extendOptions };
}
const BLANK = { length: 100, turn: '', climb: '', bank: '', width: '', cup: '', edge: '', edgeR: '', widthR: '', start: '', tube: '' };
async function sceneDoc(X, which) {
  const { D, extend, createCoreShell, extendOptions } = X, doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + P.length, 0);
  const plain = extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: (8 * Math.PI) / 180 } });
  const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(plain);
  s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - 30, r: 40 }); s.brushTo(5); s.endBrush();
  const before = doc(s), sJ = total(before), head = D.endState(before).w;
  if (which === 'extend') { s.extend(extendOptions({ ...BLANK, head: s.headState() })); s.extend(extendOptions({ ...BLANK, length: 60, head: s.headState() })); }
  else { s.extendSharp(extendOptions({ ...BLANK, head: s.headState() }), { deg: -60, R: 40, ramp: 8 }); s.extend(extendOptions({ ...BLANK, length: 60, head: s.headState() })); }
  const d = doc(s); if (d.pieces.length !== before.pieces.length + (which === 'extend' ? 2 : 3)) throw new Error(`${which}: not laid (${s.getState().message})`);
  return { d, sJ, head };
}
function sampleAt(S, s) { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } const a = S[lo], b = S[hi], t = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0; const L = (k) => a[k].map((v, i) => v + (b[k][i] - v) * t); return { pos: L('pos'), T: unit(L('T')), L: unit(L('L')), U: unit(L('U')) }; }
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const trees = [treeOf(TB0), treeOf(TA0)], record = { scenes: {} };
  for (const which of ['extend', 'sharp']) {
    const edgesBy = [];
    for (const X of trees) {
      const { d, sJ, head } = await sceneDoc(X, which), { segments, path: P } = X.toPath(d, { step: 0.25 }), S = P.samples;
      const m = X.buildMesh(P, segments), sc = X.readScene(X.writeKn5(m.scene));
      // the edges as built: every vertex of the scene, binned by the station it lies across from (its foot on the centreline, by the nearest sample)
      const V = []; for (const me of sc.meshes) for (let i = 0; i < me.pos.length; i += 3) V.push([me.pos[i], me.pos[i + 1], me.pos[i + 2]]);
      const rowsNear = (s, tol) => { const c = sampleAt(S, s); let lo = Infinity, hi = -Infinity, n = 0; for (const v of V) { const q = sub(v, c.pos); if (Math.abs(dot(q, c.T)) > tol) continue; const lat = dot(q, c.L); if (Math.abs(dot(q, c.U)) > 6) continue; lo = Math.min(lo, lat); hi = Math.max(hi, lat); n++; } return { s, left: hi, right: lo, n }; };
      // the mesh's row stations over the joint (where its vertices sit along the road; between rows the drawn edge is straight)
      const stations = (m.stats.stationS || []).filter((x) => x >= sJ - 12 && x <= sJ + 30);
      const at0 = rowsNear(sJ, 0.02), edges = stations.map((x) => rowsNear(x, 0.02)).filter((q) => q.n > 0);
      if (!(at0.n > 0)) throw new Error('no mesh row at the joint');
      edgesBy.push({ sha: X.sha, sJ, head, ref: { left: at0.left, right: at0.right }, edges, stations });
      // DRIVER'S VIEW
      const e = sampleAt(S, sJ - 12), tg = sampleAt(S, sJ + 30);
      const camD = { eye: add(e.pos, mul(e.U, 1.1)), target: add(tg.pos, mul(tg.U, 0.4)), up: e.U, fovDeg: 55, width: 1600, height: 900 };
      const rD = X.renderView(sc, camD, {}), imgD = Buffer.from(rD.rgba);
      for (let i = 0; i < imgD.length; i += 4) if (!imgD[i + 3]) { imgD[i] = 24; imgD[i + 1] = 28; imgD[i + 2] = 36; imgD[i + 3] = 255; }
      // the joint marked on the driver's view by a short dark tick at each edge (not painted on the road; drawn on the picture)
      { const pr = projector(camD), j = sampleAt(S, sJ); for (const lat of [at0.left, at0.right]) { const p = add(j.pos, mul(j.L, lat)); line(imgD, 1600, 900, pr(add(p, mul(j.U, 0.0))), pr(add(p, mul(j.U, 0.6))), [220, 40, 40], 2); } }
      burn(imgD, 1600, X.sha, 12, 12, 5, [255, 210, 60]);
      fs.writeFileSync(path.join(OUT, `${which}_driver_${X.sha}.png`), X.encodePng(1600, 900, imgD));
      // DRIVER'S VIEW AT THE EDGE (added after the first pictures: from the centre the joint's edges sit at the frame's sides, 10.8 m away): eye 1.1 m up and 2 m in
      // from the left edge, 12 m before the joint, looking along that edge 40 m past it; the same 55 deg field (what a driver sees, not a zoom). The joint's edge
      // carried straight on (the grey reference of the view from above) is drawn over it, so the edge's move off it reads against a line.
      { const lat = at0.left - 2, eE = sampleAt(S, sJ - 12), tE = sampleAt(S, sJ + 40);
        const camE = { eye: add(add(eE.pos, mul(eE.L, lat)), mul(eE.U, 1.1)), target: add(add(tE.pos, mul(tE.L, at0.left - 1)), mul(tE.U, 0.2)), up: eE.U, fovDeg: 55, width: 1600, height: 900 };
        const rE = X.renderView(sc, camE, {}), imgE = Buffer.from(rE.rgba);
        for (let i = 0; i < imgE.length; i += 4) if (!imgE[i + 3]) { imgE[i] = 24; imgE[i + 1] = 28; imgE[i + 2] = 36; imgE[i + 3] = 255; }
        const prE = projector(camE);
        for (let s = sJ; s < sJ + 60; s += 0.25) { const a = sampleAt(S, s), b = sampleAt(S, s + 0.25); line(imgE, 1600, 900, prE(add(a.pos, mul(a.L, at0.left))), prE(add(b.pos, mul(b.L, at0.left))), [150, 150, 150], 1); }
        { const j = sampleAt(S, sJ), p = add(j.pos, mul(j.L, at0.left)); line(imgE, 1600, 900, prE(p), prE(add(p, mul(j.U, 0.6))), [220, 40, 40], 2); }
        burn(imgE, 1600, X.sha, 12, 12, 5, [255, 210, 60]);
        fs.writeFileSync(path.join(OUT, `${which}_driver-edge_${X.sha}.png`), X.encodePng(1600, 900, imgE));
        record.edgeCams = record.edgeCams || {}; record.edgeCams[`${which} ${X.sha}`] = camE; }
      // FROM ABOVE, 50 px per metre on both axes: 24 m across (1200 px) by 40 m along (2000 px), centred 12 m past the joint
      const c = sampleAt(S, sJ + 8), H = 1500, camA = { eye: add(c.pos, mul(c.U, H)), target: c.pos, up: c.T, fovDeg: (2 * Math.atan(20 / H) * 180) / Math.PI, width: 1200, height: 2000 };
      const rA = X.renderView(sc, camA, { fogDensity: 0 }), imgA = Buffer.from(rA.rgba);
      for (let i = 0; i < imgA.length; i += 4) if (!imgA[i + 3]) { imgA[i] = 24; imgA[i + 1] = 28; imgA[i + 2] = 36; imgA[i + 3] = 255; }
      const pr = projector(camA);
      for (const side of ['left', 'right']) for (let s = sJ - 12; s < sJ + 30; s += 0.25) { const a = sampleAt(S, s), b = sampleAt(S, s + 0.25); line(imgA, 1200, 2000, pr(add(a.pos, mul(a.L, at0[side]))), pr(add(b.pos, mul(b.L, at0[side]))), [150, 150, 150], 1); }
      for (let k = 0; k <= 30; k += 5) { const a = sampleAt(S, sJ + k); line(imgA, 1200, 2000, pr(add(a.pos, mul(a.L, 0.6))), pr(add(a.pos, mul(a.L, -0.6))), k === 0 ? [220, 40, 40] : [255, 255, 255], k === 0 ? 2 : 1); }
      burn(imgA, 1200, X.sha, 12, 12, 5, [255, 210, 60]);
      fs.writeFileSync(path.join(OUT, `${which}_above_${X.sha}.png`), X.encodePng(1200, 2000, imgA));
      record.scenes[`${which} ${X.sha}`] = { sJ, head, ref: { left: at0.left, right: at0.right, rowVertices: at0.n }, stationsOverJoint: stations, cameras: { driver: camD, above: camA }, stats: { driver: { ...rD.stats }, above: { ...rA.stats } } };
    }
    // OVERLAY PLAN, true scale, 50 px per metre on both axes, drawn from the measured edges (not rendered): the reference (grey), before (orange), after (cyan)
    { const W = 1200, Hh = 2100, img = Buffer.alloc(W * Hh * 4); for (let i = 0; i < img.length; i += 4) { img[i] = 24; img[i + 1] = 28; img[i + 2] = 36; img[i + 3] = 255; }
      const toPx = (s, lat) => [W / 2 - lat * 50, Hh - 50 - (s - (edgesBy[0].sJ - 12)) * 50];   // the centreline straightened: along s up the picture, across by the lateral offset
      for (const side of ['left', 'right']) { line(img, W, Hh, toPx(edgesBy[0].sJ - 12, edgesBy[0].ref[side]), toPx(edgesBy[0].sJ + 30, edgesBy[0].ref[side]), [150, 150, 150], 1); }
      edgesBy.forEach((E, i) => { const col = i === 0 ? [255, 150, 40] : [60, 220, 255]; for (const side of ['left', 'right']) for (let k = 0; k + 1 < E.edges.length; k++) line(img, W, Hh, toPx(E.edges[k].s, E.edges[k][side]), toPx(E.edges[k + 1].s, E.edges[k + 1][side]), col, 2); });
      for (let k = -10; k <= 30; k += 5) line(img, W, Hh, toPx(edgesBy[0].sJ + k, 0.6), toPx(edgesBy[0].sJ + k, -0.6), k === 0 ? [220, 40, 40] : [255, 255, 255], k === 0 ? 2 : 1);
      burn(img, W, edgesBy[0].sha, 12, 12, 5, [255, 150, 40]); burn(img, W, edgesBy[1].sha, 12, 50, 5, [60, 220, 255]);
      fs.writeFileSync(path.join(OUT, `${which}_overlay-plan_${edgesBy[0].sha}-${edgesBy[1].sha}.png`), trees[1].encodePng(W, Hh, img)); }
    record[`edges ${which}`] = edgesBy.map((E) => ({ sha: E.sha, sJ: E.sJ, head: E.head, ref: E.ref, stations: E.stations, edges: E.edges.map((q) => ({ s: +(q.s - E.sJ).toFixed(2), left: +q.left.toFixed(4), right: +q.right.toFixed(4), n: q.n })) }));
  }
  fs.writeFileSync(path.join(OUT, 'render678.json'), JSON.stringify(record, null, 1));
  console.log('ok', fs.readdirSync(OUT).join(' '));
})().catch((e) => { console.error('render678 failed:', e); process.exit(1); });
