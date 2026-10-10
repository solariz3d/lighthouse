// nodes.js (pane B, D230): export F1, F2 (the sealed kit's lap(), copied) and a closed tube oval (w 40) through buildFromSegments in a tree,
// and write, per track: the kn5 sha256, the non-skin nodes (name + mesh name + matrix + material NAME + every typed array's bytes) as one
// digest AND as an ordered list of per-node digests, the skin nodes (names, count), the materials list, the 1ROAD mesh count.
//   node nodes.js <tree> <out.json>        then compare two trees' out files with nodes-diff.js
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]) + '/', OUT = process.argv[3];
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), { close } = require(T + 'src/core/close.js'), AD = require(T + 'src/core/adapter.js');
const FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const R = 180, Q = Math.PI * R / 2;
const lap = (family, first) => {
  let d = D.createDoc(`F lap ${family}`);
  d = extend(d, { length: 300, family, first });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
  const r = close(d, { edited: [0] }); return r.doc || r;
};
const TRACKS = { F1: () => lap('bowl'), F2: () => lap('half-pipe'), TUBE40: () => lap('bowl', { w: 40, t: 360 }) };
const isSkin = (n) => /^(SKIN_|JOIN_|UNDERSKIN)/.test(n);
const out = {};
for (const [name, make] of Object.entries(TRACKS)) {
  const doc = make(), segs = AD.toSegments(doc), start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, lift = (q) => AD.offsetPath(doc, segs, q);
  const ex = FW.buildFromSegments(segs, { name: 'fixture', via: 'fixture', liftPath: lift, start }, { markers: startLayout(segs, lift, start) });
  const mats = ex.scene.materials.map((m) => m.name), road = [], skin = [], roadMatNames = new Set();
  for (const c of ex.scene.root.children) {
    const nm = String(c.name || (c.children && c.children[0] && c.children[0].name) || '');
    const meshes = []; (function walk(n) { if (n.type === 'mesh') meshes.push(n); for (const k of n.children || []) walk(k); })(c);
    if (isSkin(nm) || meshes.some((m) => isSkin(m.name))) { skin.push({ node: nm, meshes: meshes.map((m) => m.name), material: meshes.map((m) => mats[m.material]) }); continue; }
    const parts = [Buffer.from(nm), Buffer.from(JSON.stringify(c.matrix || null))];
    for (const m of meshes) { roadMatNames.add(mats[m.material]); parts.push(Buffer.from(String(m.name)), Buffer.from(String(mats[m.material])), Buffer.from(JSON.stringify(m.matrix || null)));
      for (const k of Object.keys(m).sort()) { const v = m[k]; if (ArrayBuffer.isView(v)) parts.push(Buffer.from(k), Buffer.from(v.buffer, v.byteOffset, v.byteLength)); } }
    road.push(sha(Buffer.concat(parts)).slice(0, 16));
  }
  const kn5 = Buffer.isBuffer(ex.kn5) ? ex.kn5 : Buffer.from(ex.kn5);
  out[name] = { kn5: sha(kn5).slice(0, 16), kn5Bytes: kn5.length, nonSkinNodes: road.length, nonSkinDigest: sha(Buffer.from(road.join(''))).slice(0, 16), nodeDigests: road,
    skinNodes: skin.length, skinNameSample: skin.slice(0, 2).map((s) => s.node), skinNamesBad: skin.filter((s) => [s.node, ...s.meshes].some((x) => /^\d|1ROAD|seam/i.test(x))).length,
    skinMaterials: [...new Set(skin.flatMap((s) => s.material))], materials: mats, roadMaterialsUsed: [...roadMatNames], road1ROADmeshes: ex.scene.root.children.reduce((a, c) => { let k = 0; (function w(n) { if (n.type === 'mesh' && /^1ROAD/.test(n.name)) k++; for (const x of n.children || []) w(x); })(c); return a + k; }, 0) };
}
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, { ...v, nodeDigests: `${v.nodeDigests.length} digests` }]))));
