// exp437.js (D437, P): the page's own export of a saved equation track, in node, with the memory logged at each stage of
// src/export/fromwords.js buildFromSegments, inside src/geom/bvh.js soup (the triangle soup the self-check and the pit-lane check
// build of the WHOLE main mesh) and inside src/geom/pitlane.js laneCheck. The module text is patched IN MEMORY as the page's own
// loader (app/lib/cjs.js, through makeExporter's `get`) asks for it; every patch must apply or the run throws. Nothing in the tree is
// written; the export's files go to <outdir>.   node --max-old-space-size=<MB> --trace-gc exp437.js <tree> <save> <outdir>
const fs = require('fs'), path = require('path'), v8 = require('v8');
const [T, F, OUT, MODE] = process.argv.slice(2);   // MODE 'force': D433's two validator reds skipped, to reach the kn5 write
const FORCE = [
  "red.push({ s: e.s, u: e.u, reason: 'stacked-within-2m', worst: e.worst });",
  "red.push({ s: g.s, u: g.u, reason: 'downforce-ray-gap', worst: g.widthM });",
];
const t0 = Date.now(), MB = (x) => (x / 1048576).toFixed(1);
let peak = 0;
globalThis.__mem437 = (tag, extra = '') => {
  const m = process.memoryUsage(), h = v8.getHeapStatistics(); peak = Math.max(peak, m.heapUsed);
  console.log(`[mem] ${((Date.now() - t0) / 1000).toFixed(1).padStart(7)} s  ${tag.padEnd(36)} heapUsed ${MB(m.heapUsed).padStart(7)}  heapTotal ${MB(m.heapTotal).padStart(7)}  rss ${MB(m.rss).padStart(7)}  external ${MB(m.external).padStart(7)}  arrayBuffers ${MB(m.arrayBuffers).padStart(7)} MB  (limit ${MB(h.heap_size_limit)})  ${extra}`);
};
const USE = ["'use strict';", "'use strict';\nconst __mem = globalThis.__mem437;"];
const PATCH = {
  'src/export/fromwords.js': [USE,
    ['  const mesh = buildMesh(p, segs, { ...(o.mesh || {}), selfCheck });',
      "  __mem('fromwords: before buildMesh', `samples ${p.samples.length} segments ${segs.length}`); const mesh = buildMesh(p, segs, { ...(o.mesh || {}), selfCheck }); __mem('fromwords: after buildMesh+selfCheck', (() => { let v = 0, t = 0; for (const n of mesh.scene.root.children) { const m = n.children[0]; v += m.positions.length / 3; t += m.indices.length / 3; } return `cells ${mesh.cells.length} vertices ${v} triangles ${t}` + (mesh.selfCheck ? ` | selfCheck ${JSON.stringify(mesh.selfCheck.stats)}` : ''); })());"],
    ['    try { pit = PitLane.laneForExport(', "    __mem('fromwords: before laneForExport'); try { pit = PitLane.laneForExport("],
    ['  // markers, from the words', "  __mem('fromwords: after laneForExport');\n  // markers, from the words"],
    ['  const textured = withTextureSet(', "  __mem('fromwords: before withTextureSet'); const textured = withTextureSet("],
    ['  const kn5 = Buffer.from(writeKn5(', "  __mem('fromwords: before writeKn5'); const kn5 = Buffer.from(writeKn5("],
    ['  const tmp = fs.mkdtempSync(', "  __mem('fromwords: after writeKn5', `kn5 ${kn5.length} B`); const tmp = fs.mkdtempSync("],
    [/  return \{\r?\n    folder: o\.folder \|\| folderName\(doc\)/, (m) => "  __mem('fromwords: end of buildFromSegments'); " + m.trimStart()],
  ],
  'src/geom/bvh.js': [USE,
    ['  const pos = [], nrm = [], sv = [], uv = [], vCell = [], tris = [], triCell = [], cells = [];',
      "  __mem('bvh soup: start'); const pos = [], nrm = [], sv = [], uv = [], vCell = [], tris = [], triCell = [], cells = [];"],
    ['  return { pos: Float64Array.from(pos), nrm: Float64Array.from(nrm), s: Float64Array.from(sv), u: Float64Array.from(uv), vCell, tris: Uint32Array.from(tris), triCell, cells };',
      "  __mem('bvh soup: arrays pushed', `pos ${pos.length} nrm ${nrm.length} s ${sv.length} tris ${tris.length} cells ${cells.length}`); const __r = { pos: Float64Array.from(pos), nrm: Float64Array.from(nrm), s: Float64Array.from(sv), u: Float64Array.from(uv), vCell, tris: Uint32Array.from(tris), triCell, cells }; __mem('bvh soup: typed copies made'); return __r;"],
    ['  const S = soup(mesh), B = build(S), stats = { triangles: B.T, vertices: S.s.length, nodes: B.nodes.length, triTests: 0, rayTests: 0 };',
      "  const S = soup(mesh), B = build(S), stats = { triangles: B.T, vertices: S.s.length, nodes: B.nodes.length, triTests: 0, rayTests: 0 }; __mem('bvh selfCheck: soup+bvh built', `nodes ${B.nodes.length}`);"],
    ['  return { intersections, stacked, stats };', "  __mem('bvh selfCheck: end', JSON.stringify(stats)); return { intersections, stacked, stats };"],
  ],
  'src/geom/pitlane.js': [USE,
    ['  const A = soup(mainMesh), Bm = build(A), Ls = soup(laneMesh);',
      "  __mem('laneCheck: start'); const A = soup(mainMesh); __mem('laneCheck: main soup made'); const Bm = build(A); __mem('laneCheck: main bvh built', `nodes ${Bm.nodes.length} T ${Bm.T}`); const Ls = soup(laneMesh); __mem('laneCheck: lane soup made');"],
    ['  return { intersections: inter, stacked, stats };', "  __mem('laneCheck: end', JSON.stringify(stats)); return { intersections: inter, stacked, stats };"],
  ],
};
const seen = new Set();
(async () => {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { makeExporter } = require(path.join(T, 'app/export/export.js'));
  const get = async (rel) => {
    let x = fs.readFileSync(path.join(T, rel), 'utf8');
    if (MODE === 'force' && rel.split(path.sep).join('/').endsWith('src/validate/index.js')) {   // D433's force mode: the two stacked reds skipped, every other check on
      for (const line of FORCE) { if (!x.includes(line)) throw new Error('force patch did not apply: ' + line); x = x.replace(line, 'void 0;'); }
      console.log('force: stacked-within-2m and downforce-ray-gap skipped (in memory)');
    }
    const key = Object.keys(PATCH).find((k) => rel.split(path.sep).join('/').endsWith(k));
    if (key) {
      for (const [a, b] of PATCH[key]) { if (a instanceof RegExp ? !a.test(x) : !x.includes(a)) throw new Error(`patch did not apply in ${key}: ${String(a).slice(0, 60)}`); x = x.replace(a, b); }
      seen.add(key); console.log('patched in memory:', key, PATCH[key].length, 'sites');
    }
    return x;
  };
  const ex = await makeExporter(get);
  for (const k of Object.keys(PATCH)) if (!seen.has(k)) throw new Error('the loader never asked for ' + k);
  const text = fs.readFileSync(F, 'utf8');
  globalThis.__mem437('node: exporter loaded');
  const s = await createCoreShell({ brushFn: null, exporter: ex, storage: { openDoc: async () => text } });
  await s.open('ELYSIUM');
  globalThis.__mem437('node: track opened', `pieces ${s.exportDoc().pieces.length} closed ${!!s.getState().resolved.closed}`);
  const TX = require(path.join(T, 'app/core/textures.js'));
  const ctl = TX.createCoreTextures({ segments: () => s.getState().resolved.segments, closed: () => !!s.getState().resolved.closed, kind: 'asphalt', edge: false });
  const textures = ctl.current(); if (!textures) throw new Error('no texture set built');
  globalThis.__mem437('node: textures built', `kind ${ctl.state.kind} budget ${ctl.state.budget ? (ctl.state.budget.bytes / 1048576).toFixed(1) + ' MiB' : '?'}`);
  let out;
  try { out = s.buildExport({ textures }); } catch (e) {
    console.log('REFUSED', e.code, String(e.message).slice(0, 400));
    for (const r of (e.red || [])) console.log(' ', r.reason, r.s0, r.s1);
    globalThis.__mem437('node: refused'); console.log('peak heapUsed MB', MB(peak)); process.exit(3);
  }
  globalThis.__mem437('node: buildExport returned');
  for (const f of out.folders) {
    for (const x of f.files) { const p = path.join(OUT, f.folder, x.path); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, Buffer.from(x.bytes)); }
    console.log('wrote', f.folder, f.files.length, 'files');
  }
  for (const w of (out.result.warnings || [])) console.log('warning:', String(w).slice(0, 200));
  console.log('peak heapUsed MB', MB(peak));
})().catch((e) => { console.error('ERR', e.stack); globalThis.__mem437('node: error'); process.exit(1); });
