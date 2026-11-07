// count.js <kn5...>: triangles (and vertices) by mesh-name group. node count.js a.kn5 b.kn5
const { readKn5 } = require('C:/Users/nname/Desktop/worktrees/t180-c610/tools/kn5.cjs');
const group = (n) => (/^1ROAD_APRON/.test(n) ? 'apron(1ROAD_APRON)' : /^1ROAD_PIT/.test(n) ? 'pit' : /^1(?:ROAD|GRIP\d{3})_/.test(n) ? 'road' : /^UNDERSKIN_/.test(n) ? 'underskin'
  : /^(APRONSIDE|APRONLIP|JOIN)_/.test(n) ? n.split('_')[0] : n.replace(/[_\d].*$/, '') || n);
for (const f of process.argv.slice(2)) {
  const k = readKn5(f), g = {}; let T = 0;
  for (const m of k.meshes) { const x = group(m.name), t = m.idx.length / 3; g[x] = g[x] || { tris: 0, verts: 0, meshes: 0 }; g[x].tris += t; g[x].verts += m.pos.length / 3; g[x].meshes++; T += t; }
  console.log(f, 'total tris', T); for (const [x, v] of Object.entries(g).sort((a, b) => b[1].tris - a[1].tris)) console.log('  ', x.padEnd(22), String(v.tris).padStart(9), 'tris', String(v.verts).padStart(9), 'verts', v.meshes, 'meshes');
}
