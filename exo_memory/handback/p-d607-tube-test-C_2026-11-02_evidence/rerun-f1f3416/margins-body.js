// ---- margins (C, scratch): how near each row's bar every read sits
{
  const { doc, win, tris, edges, lengthM, samples, sampleAt, caseOf, ex } = fixture(), out = [];
  // row 1: the ends of each opening/closing
  for (const name of ['abrupt-close', 'abrupt-open', 'gradual-close', 'gradual-open']) { const p = doc.pieces[CASES.indexOf(name)]; out.push(`row1 ${name}: t ${D.channelAt(p, 't', 0).v.toFixed(2)} -> ${D.channelAt(p, 't', p.length).v.toFixed(2)}`); }
  // row 2: per case
  const most = {};
  for (const [, L] of edges) { if (L.length !== 2) continue; const t = tris[L[0].ti], g = tris[L[1].ti]; if (t.f !== g.f || !t.name || !t.q || (t.f !== 'road' && t.f !== 'skin')) continue;
    const d = sub(L[0].b, L[0].a); if (Math.abs(dot(d, t.q.T)) / Math.hypot(...d) >= 0.5) continue;
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(t.n, g.n)))) * DEG, key = `${t.name}|${t.f}`; if (!most[key] || ang > most[key].ang) most[key] = { ang, at: frame(L[0].a, t.q) }; }
  for (const w of win) { const r = most[`${w.name}|road`] || { ang: 0 }, k = most[`${w.name}|skin`] || { ang: NaN, at: '-' }; out.push(`row2 ${w.name}: skin ${k.ang.toFixed(1)} at ${k.at}; road ${r.ang.toFixed(1)}; excess ${(k.ang - r.ang).toFixed(1)} of ${SKIN_BEND_SLACK_DEG}`); }
  // row 3: each boundary edge's worst cover distance (the largest of its 3 points' nearest other boundary edge)
  const bnd = []; for (const [, L] of edges) if (L.length === 1) bnd.push({ ...L[0], t: tris[L[0].ti] });
  const C = 1, grid = new Map(), cellOf = (p) => p.map((x) => Math.floor(x / C));
  bnd.forEach((e, i) => { const n = Math.ceil(Math.hypot(...sub(e.b, e.a)) / C) + 1; for (let j = 0; j <= n; j++) { const k = cellOf(e.a.map((x, m) => x + ((e.b[m] - x) * j) / n)).join(','); let S = grid.get(k); if (!S) grid.set(k, (S = new Set())); S.add(i); } });
  const segDist = (p, a, b) => { const ab = sub(b, a), ap = sub(p, a), L = dot(ab, ab), u = L ? Math.max(0, Math.min(1, dot(ap, ab) / L)) : 0; return Math.hypot(ap[0] - u * ab[0], ap[1] - u * ab[1], ap[2] - u * ab[2]); };
  const nearest = (p, self) => { let m = Infinity; const c = cellOf(p); for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) { const S = grid.get(`${c[0] + x},${c[1] + y},${c[2] + z}`); if (S) for (const j of S) if (j !== self) m = Math.min(m, segDist(p, bnd[j].a, bnd[j].b)); } return m; };
  const cov = [];
  bnd.forEach((e, i) => { if (!(e.t.s > END_M && e.t.s < lengthM - END_M)) return; const w = Math.max(...[0.25, 0.5, 0.75].map((f) => nearest(e.a.map((x, m) => x + (e.b[m] - x) * f), i))); cov.push({ w, k: `${e.t.name} ${e.t.f}`, at: frame(e.a, e.t.q) }); });
  cov.sort((a, b) => b.w - a.w);
  out.push(`row3 boundary edges read ${cov.length}; worst cover (mm): ` + cov.slice(0, 8).map((c) => `${(c.w * 1e3).toFixed(3)} ${c.k} @ ${c.at}`).join(' | '));
  const hist = [[0, 0.1], [0.1, 0.5], [0.5, 1], [1, 1.5], [1.5, 1.8], [1.8, 2], [2, Infinity]].map(([a, b]) => `${a}-${b}:${cov.filter((c) => c.w * 1e3 >= a && c.w * 1e3 < b).length}`);
  out.push(`row3 cover histogram (mm): ${hist.join(' ')}`);
  const byCase = {}; cov.filter((c) => c.w > 1e-3).forEach((c) => { byCase[c.k] = (byCase[c.k] || 0) + 1; }); out.push(`row3 edges over 1 mm by case: ${JSON.stringify(byCase)}`);
  // row 4: thinnest drawn triangles
  const th = tris.filter((t) => t.name).sort((a, b) => a.thick - b.thick);
  out.push(`row4 SLIVER ${SLIVER}; thinnest (mm): ` + th.slice(0, 6).map((t) => `${(t.thick * 1e3).toFixed(2)} ${t.name} ${t.f} @ ${frame(t.cen, t.q)}`).join(' | '));
  out.push(`row4 under 2x SLIVER: ${th.filter((t) => t.thick < 2 * SLIVER).length}; under 1 cm: ${th.filter((t) => t.thick < 0.01).length}`);
  // row 7
  const pts = readAiLine(ex.ai).points.map((p) => p.pos); let gap = 0, off = 0; pts.forEach((p, i) => { const q = sampleAt(p); off = Math.max(off, Math.hypot(...sub(p, q.pos))); if (i) gap = Math.max(gap, Math.hypot(...sub(p, pts[i - 1]))); });
  out.push(`row7 points ${pts.length}; largest step ${gap.toFixed(2)} m of 10; farthest off centreline ${off.toFixed(3)} m of 1`);
  console.log(out.join('\n'));
}
