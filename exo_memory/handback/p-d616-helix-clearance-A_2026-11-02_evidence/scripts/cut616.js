// cut616.js <kn5> <out.json> <ox,oy,oz> <from> <to> <step> [halfWidth]: read-only. Cross-sections of every mesh near O, by planes across p41
// (normal = p41's apron direction near O, from a PCA of the apron's vertices within 12 m), at offsets from..to along it.
// Each section: segments per mesh in (l, u): l across (world up x tangent), u = world up projected off the tangent.
// Clearance: for each section, the lower surface is p41's road + apron polyline; every other mesh's points (5 cm steps) get u - surface(l).
const { readKn5 } = require('C:/Users/nname/Downloads/t180-wt-a614/tools/kn5.cjs'); const fs = require('fs');
const [file, out, os, f0, f1, st, hw] = process.argv.slice(2), O = os.split(',').map(Number), HW = +(hw || 40);
const k = readKn5(file), near = k.meshes.filter((m) => { for (let i = 0; i < m.pos.length; i += 3) if (Math.hypot(m.pos[i] - O[0], m.pos[i + 1] - O[1], m.pos[i + 2] - O[2]) < HW + 20) return true; return false; });
// tangent from p41's apron
const ap = near.filter((m) => /^1ROAD_APRON_p41_/.test(m.name)), P = [];
for (const m of ap) for (let i = 0; i < m.pos.length; i += 3) if (Math.hypot(m.pos[i] - O[0], m.pos[i + 1] - O[1], m.pos[i + 2] - O[2]) < 12) P.push([m.pos[i], m.pos[i + 1], m.pos[i + 2]]);
const mu = [0, 1, 2].map((a) => P.reduce((s, p) => s + p[a], 0) / P.length), C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
for (const p of P) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) C[a][b] += (p[a] - mu[a]) * (p[b] - mu[b]);
let T = [1, 0, 0]; for (let it = 0; it < 100; it++) { const v = [0, 1, 2].map((a) => C[a][0] * T[0] + C[a][1] * T[1] + C[a][2] * T[2]), L = Math.hypot(...v); T = v.map((x) => x / L); }
if (T[0] < 0) T = T.map((x) => -x);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
let U = [0, 1, 0].map((x, i) => x - dot([0, 1, 0], T) * T[i]); { const L = Math.hypot(...U); U = U.map((x) => x / L); } const Lx = cross(U, T);
const cls = (n) => n.replace(/_chunk_\d+$/, '').replace(/_\d+$/, '');
const sections = [];
for (let off = +f0; off <= +f1 + 1e-9; off += +st) {
  const Q = O.map((x, i) => x + T[i] * off), segs = {};
  for (const m of near) { const p = m.pos, I = m.idx, out2 = [];
    for (let t = 0; t < I.length; t += 3) { const v = [0, 1, 2].map((c) => [p[I[t + c] * 3], p[I[t + c] * 3 + 1], p[I[t + c] * 3 + 2]]), d = v.map((x) => dot([x[0] - Q[0], x[1] - Q[1], x[2] - Q[2]], T));
      if ((d[0] > 0 && d[1] > 0 && d[2] > 0) || (d[0] < 0 && d[1] < 0 && d[2] < 0)) continue; const pts = [];
      for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) if ((d[a] <= 0) !== (d[b] <= 0)) { const s = d[a] / (d[a] - d[b]), x = [0, 1, 2].map((c) => v[a][c] + s * (v[b][c] - v[a][c]) - Q[c]); pts.push([+dot(x, Lx).toFixed(4), +dot(x, U).toFixed(4)]); }
      if (pts.length === 2 && Math.abs(pts[0][0]) < HW && Math.abs(pts[0][1]) < HW) out2.push(pts); }
    if (out2.length) segs[m.name] = out2; }
  // the lower surface: p41 road + apron, u as a function of l (the lowest-|u| segment covering l, i.e. the one near the origin's level)
  const low = Object.entries(segs).filter(([n]) => /^1ROAD_(APRON_)?p[0-9]/.test(n) && !/_p38_/.test(n)).flatMap(([n, S]) => S.map((s) => ({ n, s })));
  const surfAt = (l) => { let best = null; for (const { n, s } of low) { const [a, b] = s[0][0] <= s[1][0] ? s : [s[1], s[0]]; if (l < a[0] || l > b[0] || b[0] - a[0] < 1e-9) continue; const u = a[1] + (l - a[0]) / (b[0] - a[0]) * (b[1] - a[1]); if (u < 0.8 && (!best || u > best.u)) best = { u, n }; } return best; };
  const road = low.filter((x) => /^1ROAD_p(39|4[01])_/.test(x.n)).flatMap((x) => [x.s[0][0], x.s[1][0]]), edge = road.length ? [Math.min(...road), Math.max(...road)] : null;
  const clear = {};
  for (const [n, S] of Object.entries(segs)) { if (!/_p38_/.test(n)) continue;
    for (const s of S) { const len = Math.hypot(s[1][0] - s[0][0], s[1][1] - s[0][1]), N = Math.max(1, Math.ceil(len / 0.05));
      for (let i = 0; i <= N; i++) { const l = s[0][0] + (s[1][0] - s[0][0]) * i / N, u = s[0][1] + (s[1][1] - s[0][1]) * i / N, sf = surfAt(l); if (!sf) continue; const h = u - sf.u; if (h < -2 || h > 5) continue;
        if (!clear[n] || h < clear[n].h) clear[n] = { h: +h.toFixed(4), l: +l.toFixed(3), over: sf.n, pastRoadEdge: edge ? +Math.max(edge[0] - l, l - edge[1], 0).toFixed(3) : null }; } } }
  sections.push({ off: +off.toFixed(3), Q: Q.map((x) => +x.toFixed(3)), roadEdge: edge, clear, segs });
}
fs.writeFileSync(out, JSON.stringify({ file, O, T, U, L: Lx, sections }));
for (const s of sections) console.log('off', s.off, 'road l', s.roadEdge && s.roadEdge.map((x) => x.toFixed(2)).join('..'), Object.entries(s.clear).sort((a, b) => a[1].h - b[1].h).slice(0, 4).map(([n, c]) => `${n} ${c.h}@l${c.l} over ${c.over.replace(/_chunk_\d+/, '')} past edge ${c.pastRoadEdge}`).join(' | '));
