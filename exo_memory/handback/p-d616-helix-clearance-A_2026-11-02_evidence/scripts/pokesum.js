// pokesum.js <poke.json> [minH]: drawn vertices more than minH (default 0.02 m) above a physics surface, grouped
const rows = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')), lim = +(process.argv[3] || 0.02), pc = (n) => (n.match(/_(p\d+)_/) || [, '?'])[1], by = {};
for (const r of rows) { if (r.h <= lim) continue; const kk = `${r.mesh.replace(/_p\d+_chunk_\d+/, '')} ${pc(r.mesh)} over ${r.surf.replace(/_p\d+_chunk_\d+/, '')} ${pc(r.surf)}`; const b = (by[kk] = by[kk] || { n: 0, max: -1, min: 9, at: null }); b.n++; if (r.h > b.max) { b.max = r.h; b.at = r.p; } b.min = Math.min(b.min, r.h); }
const L = Object.entries(by).sort((x, y) => y[1].max - x[1].max); console.log(L.reduce((s, x) => s + x[1].n, 0), 'drawn vertices above', lim, 'm');
for (const [kk, b] of L) console.log(b.n, 'h', b.min.toFixed(3), '..', b.max.toFixed(3), 'at', b.at.join(','), kk);
