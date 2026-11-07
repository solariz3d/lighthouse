// band616.js <cut.json>: per section, the lowest point of each p38 mesh class above the lower pass's surface, in lateral bands of the section
// (l relative to the lower road's edge: road = inside, apron = 0..2 m outside, beyond = further). Surface = the lower pass's road/apron polyline, as in cut616.
const J = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')); const cls = (n) => n.replace(/_chunk_\d+/, '');
for (const s of J.sections) { const low = Object.entries(s.segs).filter(([n]) => /^1ROAD_(APRON_)?p[0-9]/.test(n) && !/_p38_/.test(n)).flatMap(([n, S]) => S.map((x) => ({ n, s: x })));
  const surfAt = (l) => { let best = null; for (const { n, s: q } of low) { const [a, b] = q[0][0] <= q[1][0] ? q : [q[1], q[0]]; if (l < a[0] || l > b[0] || b[0] - a[0] < 1e-9) continue; const u = a[1] + (l - a[0]) / (b[0] - a[0]) * (b[1] - a[1]); if (u < 0.8 && (!best || u > best.u)) best = { u, n }; } return best; };
  if (!s.roadEdge) continue; const E = s.roadEdge[1], out = {};
  for (const [n, S] of Object.entries(s.segs)) { if (!/_p38_/.test(n)) continue;
    for (const q of S) { const N = Math.max(1, Math.ceil(Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]) / 0.05));
      for (let i = 0; i <= N; i++) { const l = q[0][0] + (q[1][0] - q[0][0]) * i / N, u = q[0][1] + (q[1][1] - q[0][1]) * i / N, sf = surfAt(l); if (!sf) continue; const h = u - sf.u; if (h < -2 || h > 5) continue;
        const band = l <= E ? 'road' : l <= E + 2.05 ? 'apron' : 'beyond', kk = cls(n).replace(/^(UNDERSKIN|APRONSIDE)_p38$/, 'drawn').replace(/^1ROAD(_APRON)?_p38$/, 'physics') + '/' + band;
        if (!out[kk] || h < out[kk].h) out[kk] = { h: +h.toFixed(3), l: +(l - E).toFixed(2) }; } } }
  console.log('off', s.off, Object.entries(out).sort().map(([kk, v]) => `${kk} ${v.h}@${v.l}`).join('  ')); }
