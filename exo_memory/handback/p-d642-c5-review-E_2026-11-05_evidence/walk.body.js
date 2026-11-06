// ---- mine (D642 review of 57cf0a0): the mark walk's correctness, through the panel. For each case, the extra bank made through the panel, its mark slid (panel.secondDrag, the
// mark drag's own path) from 420 to 540 m and back by 1 m (the 1,000 m piece; scaled for 750 m). At every move: the from the panel keeps, whether the core lays the panel's
// options, and the built road's peak roll acceleration ÷ the bar over the change and 20 m on (a 200 m straight after; 2 m second differences of the adapter's roll, my reader
// from the tip review, which reproduced B's and C's 1.174 / 1.049). Also B's G8 move: the length typed down by 2 m, the same checks.
// (D, A and BAR come from the additive scaffold above)
function rollPeak(doc, s0, s1) {
  const S = A.toPath(doc).path.samples, r = (s) => { let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (S[m].s <= s) lo = m; else hi = m; } return S[lo].roll; };
  let m = 0; for (let s = s0; s <= s1; s += 0.5) m = Math.max(m, Math.abs(r(s + 2) - 2 * r(s) + r(s - 2)) / 4); return m / BAR;
}
const check = (p, L) => { let d; try { d = layOf(p); } catch (e) { return { refused: `${e.code}` }; } const c = p.panel.options().changes.phi[0]; d = TB.extendCorner(d, { length: 200 }); return { peak: +rollPeak(d, 1000 + c.from - 20, 1000 + L + 20).toFixed(3) }; };
const CASES = [
  { name: 'his p2: 1,000 m, bank 88.45, extra -88.45', L: 1000, bank: 88.45, extra: -88.45, from: [420, 540] },
  { name: '88.45 / 1,000 m, extra -30.3', L: 1000, bank: 88.45, extra: -30.3, from: [520, 660] },
  { name: 'his picture: 750 m, bank 66.14, extra 0', L: 750, bank: 66.14, extra: 0, from: [360, 470] },
  { name: '30 / 750 m, extra 0', L: 750, bank: 30, extra: 0, from: [520, 600] },
  { name: '60 / 600 m, extra -60', L: 600, bank: 60, extra: -60, from: [130, 200] },
];
(async () => {
  const out = [];
  for (const cs of CASES) {
    const q = await his(cs.L, cs.bank); q.panel.secondExtra(xOf(q, 'bank').id, cs.extra); q.tick();
    const made = q.panel.options().changes.phi[0], rows = [];
    const path = []; for (let f = cs.from[0]; f <= cs.from[1]; f++) path.push(f); for (let f = cs.from[1] - 1; f >= cs.from[0]; f--) path.push(f);
    for (const f of path) { q.panel.secondDrag({ field: 'bank', index: 0 }, f); q.tick(); const c = q.panel.options().changes.phi[0]; rows.push({ asked: f, kept: c.from, ...check(q, cs.L) }); }
    const kept = new Map(); for (const r of rows) if (!kept.has(r.kept)) kept.set(r.kept, r);
    const refused = rows.filter((r) => r.refused), over = rows.filter((r) => r.peak > 1.0 + 1e-9), over105 = rows.filter((r) => r.peak > 1.05);
    const stuck = rows.filter((r) => r.kept !== r.asked); let maxGap = 0; for (const r of rows) maxGap = Math.max(maxGap, Math.abs(r.kept - r.asked));
    out.push({ case: cs.name, made: { from: made.from, targetDeg: +(made.target / DEG).toFixed(2) }, moves: rows.length, distinctKept: kept.size, refused: refused.length, overBar1: over.length, over105: over105.length,
      worstPeak: Math.max(...rows.filter((r) => r.peak).map((r) => r.peak)), keptNotWhereAsked: stuck.length, farthestFromAsked: maxGap, refusedAt: refused.slice(0, 8).map((r) => `${r.asked}->${r.kept}`), overAt: over.slice(0, 8).map((r) => `${r.kept}:${r.peak}`) });
    q.panel.unmount();
  }
  // B's G8 move: his p2's change slid to 500 (a dragged change, kept as its share), then the length typed down 1,000 -> 860 by 2 m
  { const q = await his(); q.panel.secondExtra(xOf(q, 'bank').id, -88.45); q.tick(); q.panel.secondDrag({ field: 'bank', index: 0 }, 500); q.tick(); const rows = [];
    for (let L = 1000; L >= 860; L -= 2) { q.type('length m', L); const c = q.panel.options().changes.phi[0]; rows.push({ L, from: c.from, ...check(q, L) }); }
    out.push({ case: 'G8: his p2 shortened 1,000 -> 860', moves: rows.length, refused: rows.filter((r) => r.refused).length, overBar1: rows.filter((r) => r.peak > 1.0 + 1e-9).length, worstPeak: Math.max(...rows.filter((r) => r.peak).map((r) => r.peak)), refusedAt: rows.filter((r) => r.refused).slice(0, 8).map((r) => `L ${r.L} from ${r.from}`) });
    q.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
