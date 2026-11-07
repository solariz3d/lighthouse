// apron616.js <old> <new>: per apron mesh, vertex count and how far its vertices moved (same count: index for index; else nearest)
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs');
const A = readKn5(process.argv[2]), B = readKn5(process.argv[3]); const mb = new Map(B.meshes.map((m) => [m.name, m]));
for (const m of A.meshes) { if (!/^1ROAD_APRON_p/.test(m.name)) continue; const o = mb.get(m.name); const na = m.pos.length / 3, nb = o.pos.length / 3;
  let mx = 0, sum = 0, mxy = 0, at = null; if (na === nb) for (let i = 0; i < na; i++) { const d = Math.hypot(m.pos[i*3]-o.pos[i*3], m.pos[i*3+1]-o.pos[i*3+1], m.pos[i*3+2]-o.pos[i*3+2]); sum += d; if (d > mx) { mx = d; at = [...o.pos.slice(i*3, i*3+3)].map((v) => v.toFixed(1)).join(','); } }
  console.log(m.name.padEnd(26), na, nb, m.idx.length/3, o.idx.length/3, na === nb ? `max ${mx.toFixed(4)} mean ${(sum/na).toFixed(4)} at ${at}` : 'counts differ'); }
