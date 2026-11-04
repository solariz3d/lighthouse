// kn5measure.js (pane B, D222): for the CLOSED fixtures, export the kn5 with a given tree's code exactly as the sealed kit does
// (test/fixtures/fixtures.js digests(): buildFromSegments with its defaults), read it back with the tree's own reader, and measure what
// the Third Place's export commits claim: mesh names unique, road in world space (no mesh under a non-root node), a txDiffuse on every
// material + the textures present, and the seam slivers (triangles thinner than 4 mm in SEAM meshes) and their worst crease against the
// road beside them. Prints JSON. node kn5measure.js <tree> <fixture-file>...
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const T = path.resolve(process.argv[2]) + '/';
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js');
const { startLayout } = require(T + 'app/core/coreshell.js'), { readKn5 } = require(T + 'tools/kn5.cjs');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const out = {};
for (const f of process.argv.slice(3)) {
  const doc = D.parse(fs.readFileSync(f, 'utf8')); if (!doc.closed) { out[path.basename(f)] = 'open, no kn5'; continue; }
  const segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
  const ex = FW.buildFromSegments(segs, { name: 'fixture', via: 'fixture', liftPath: lift, start }, { markers: startLayout(segs, lift, start) });
  const buf = Buffer.from(ex.kn5.buffer ? Buffer.from(ex.kn5.buffer, ex.kn5.byteOffset, ex.kn5.byteLength) : ex.kn5);
  const tf = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'b-d222-')), 'x.kn5'); fs.writeFileSync(tf, buf);
  const k = readKn5(tf);
  const names = k.meshes.map((m) => m.name), road = k.meshes.filter((m) => /^\d/.test(m.name));
  const nested = road.filter((m) => m.path && m.path.split('/').filter(Boolean).length > 1).length;
  const raw = buf.toString('latin1');
  // seam slivers
  let tris = 0, slivers = 0, thinMin = Infinity, worst = 0;
  const nrm = (a, b, c) => { const e1 = b.map((x, j) => x - a[j]), e2 = c.map((x, j) => x - a[j]); const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]; const l = Math.hypot(...n) || 1; return n.map((x) => x / l); };
  for (const m of k.meshes.filter((x) => /^\d.*seam/i.test(x.name))) {
    for (let i = 0; i < m.idx.length; i += 3) {
      const v = [m.idx[i], m.idx[i + 1], m.idx[i + 2]].map((j) => [m.pos[3 * j], m.pos[3 * j + 1], m.pos[3 * j + 2]]);
      const e1 = v[1].map((x, j) => x - v[0][j]), e2 = v[2].map((x, j) => x - v[0][j]), e3 = v[2].map((x, j) => x - v[1][j]);
      const area = Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]) / 2;
      if (area === 0) continue;
      const thick = (2 * area) / Math.max(Math.hypot(...e1), Math.hypot(...e2), Math.hypot(...e3));
      tris++; thinMin = Math.min(thinMin, thick);
      if (thick < 0.004) { slivers++; const n = nrm(...v); worst = Math.max(worst, Math.acos(Math.min(1, Math.abs(n[1]))) * 180 / Math.PI); }
    }
  }
  out[path.basename(f)] = { kn5sha256: sha(buf).slice(0, 16), bytes: buf.length, meshes: names.length, uniqueNames: new Set(names).size, roadMeshes: road.length, roadUnderNestedNode: nested,
    textures: (k.textures || []).length, txDiffuseInFile: raw.includes('txDiffuse'), seamTris: tris, seamSliversUnder4mm: slivers, seamThinnestMm: +(thinMin * 1000).toFixed(3), worstSliverTiltFromUpDeg: +worst.toFixed(1) };
}
console.log(JSON.stringify(out, null, 1));
