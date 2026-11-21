const { readKn5 } = require('C:/Consonance/t180-wt-ai/tools/kn5.cjs');
const f = process.argv[2]; const k = readKn5(f);
const first = k.meshes[0]; console.log('keys of a mesh:', Object.keys(first).join(','));
const tri = (m) => (m.idx ? m.idx.length / 3 : 0);
let T = 0, V = 0; const cls = {};
for (const m of k.meshes) { const name = String(m.name); const c = /^UNDERSKIN_/.test(name) ? 'UNDERSKIN_' : /^1ROAD_PIT/.test(name) ? '1ROAD_PIT' : /^1ROAD_/.test(name) ? '1ROAD_' : /^AC_/.test(name) ? 'AC_ (markers)' : name.replace(/[0-9_]+.*$/, '') || name.slice(0, 12); const t = tri(m); T += t; V += (m.pos ? m.pos.length / 3 : 0); cls[c] = cls[c] || { meshes: 0, tris: 0 }; cls[c].meshes++; cls[c].tris += t; }
console.log(f.split('/').pop(), 'kn5 version', k.version, '| meshes', k.meshes.length, '| triangles', T, '| vertices', V, '| dummies', k.dummies.length);
for (const [c, v] of Object.entries(cls).sort((a, b) => b[1].meshes - a[1].meshes).slice(0, 12)) console.log('  ', c.padEnd(16), String(v.meshes).padStart(6), 'meshes', String(v.tris).padStart(9), 'triangles');
const names = k.meshes.map((m) => String(m.name)); const sk = names.filter((n) => /^UNDERSKIN_/.test(n)); console.log('UNDERSKIN_ meshes:', sk.length, sk.slice(0, 4).join(' | '));
