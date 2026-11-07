// sum616.js <clear.json>: per lower piece, the rays with a hit, and the nearest hit's mesh class and piece
const fs = require('fs'); const J = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const pc = (n) => (n.match(/_(p\d+)_/) || [, '?'])[1], cls = (n) => n.replace(/_p\d+_chunk_\d+/, '').replace(/\d+$/, '#');
const by = {};
for (const r of J.rows) { const p = pc(r.mesh), h = r.hits[0], key = `${p} <- ${cls(h[0])} ${pc(h[0])} ${h[0] === r.mesh.replace(/^1ROAD/, 'UNDERSKIN') ? 'OWN' : ''}`; const b = (by[key] = by[key] || { n: 0, min: 1e9 }); b.n++; b.min = Math.min(b.min, h[1]); }
for (const [k, v] of Object.entries(by).sort((a, b) => b[1].n - a[1].n)) console.log(v.n, v.min.toFixed(3), k);
