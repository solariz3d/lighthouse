// decode_o.js (L250): pane O's own encode() output (kn5road.rs, dumped by its ignored measurement row) read by B's decodeRoad (src/reference/road.js).
// Prints counts only (never a name or a surface key). For reference track 1, compares with B's node-built bytes (roadbytes.js) by a batching-free sum.
const fs = require('fs'), path = require('path');
const { decodeRoad } = require('C:/Consonance/t180-wt-l243/src/reference/road.js');
const D = process.argv[2];   // pane O's road dumps (kn5road.rs's ignored measurement row with T180_ROAD_DUMP set): usage node decode_o.js <that folder>
const tri = (r) => { let s = [0, 0, 0], n = 0; for (const b of r.batches) for (let i = 0; i < b.indices.length; i++) { const k = b.indices[i] * 3; s[0] += b.positions[k]; s[1] += b.positions[k + 1]; s[2] += b.positions[k + 2]; n++; } return { corners: n, sum: s.map((v) => +v.toFixed(1)) }; };
const out = {};
for (const f of fs.readdirSync(D).filter((x) => x.endsWith('.road')).sort()) {
  const b = fs.readFileSync(path.join(D, f)), t0 = process.hrtime.bigint(); let r;
  try { r = decodeRoad(b); } catch (e) { out[f] = { refused: e.message }; continue; }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  out[f] = { bytes: b.length, batches: r.batches.length, triangles: r.triangles, vertices: r.vertices, headerTriangles: r.meta.triangles, headerFiles: r.meta.files, headerMissing: r.meta.missing, headerMeshes: r.meta.meshes, validKeys: (r.meta.keys || []).length, surfaces: r.meta.surfaces, decodeMs: +ms.toFixed(1), ...(f.startsWith('reference track 1') ? { corners: tri(r) } : {}) };
}
const mine = decodeRoad(fs.readFileSync(path.join(__dirname, 'road1.bin')));
out['B node-built reference track 1'] = { triangles: mine.triangles, vertices: mine.vertices, corners: tri(mine) };
console.log(JSON.stringify(out, null, 1));
