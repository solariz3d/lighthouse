// list616.js <kn5> <out.json>: every mesh's name, material, triangle count and bounding box (read-only)
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs');
const fs = require('fs');
const k = readKn5(process.argv[2]);
const rows = k.meshes.map((m) => { const p = m.pos; let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (let i = 0; i < p.length; i += 3) for (let a = 0; a < 3; a++) { if (p[i + a] < lo[a]) lo[a] = p[i + a]; if (p[i + a] > hi[a]) hi[a] = p[i + a]; }
  return { name: m.name, path: m.path, material: m.material, tris: m.idx.length / 3, lo: lo.map((v) => +v.toFixed(2)), hi: hi.map((v) => +v.toFixed(2)) }; });
fs.writeFileSync(process.argv[3], JSON.stringify({ version: k.version, dummies: k.dummies, rows }));
const cls = {}; for (const r of rows) { const c = r.name.replace(/\d+/g, '#'); (cls[c] = cls[c] || { n: 0, tris: 0 }); cls[c].n++; cls[c].tris += r.tris; }
console.log(rows.length, 'meshes'); for (const [c, v] of Object.entries(cls).sort((a, b) => b[1].tris - a[1].tris).slice(0, 60)) console.log(v.n, v.tris, c);
