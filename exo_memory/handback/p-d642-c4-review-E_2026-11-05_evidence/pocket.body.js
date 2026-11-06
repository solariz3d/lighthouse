// ---- mine (D642 review of 212e78d): does the panel put a mark where the core refuses? His p2's bank (1,000 m, −90, bank 88.45 eased over the piece, cup 15.5, width 31), the
// extra bank made through the panel at −88.45 (from 500), then (1) its mark dragged (panel.secondDrag, the mark drag's own path) to every from 420..540 m by 1 m: the from the
// panel keeps, and whether the core lays the panel's options; (2) the length typed down 1,000 → 900 by 2 m (B's G8 move): the same. A refusal is the ghost going.
(async () => {
  const out = { markDrag: [], shorten: [] }, refuses = (p) => { try { layOf(p); return null; } catch (e) { return `${e.code}: ${String(e.message).slice(0, 90)}`; } };
  const setUp = async () => { const q = await his(); q.panel.secondExtra(xOf(q, 'bank').id, -88.45); q.tick(); return q; };
  { const q = await setUp(); out.made = { changes: JSON.stringify(q.panel.options().changes), refusal: refuses(q) };
    for (let f = 420; f <= 540; f += 1) { q.panel.secondDrag({ field: 'bank', index: 0 }, f); q.tick(); const c = q.panel.options().changes.phi[0]; out.markDrag.push([f, c.from, +(c.target / DEG).toFixed(2), refuses(q)]); }
    q.panel.unmount(); }
  { const q = await setUp(); q.panel.secondDrag({ field: 'bank', index: 0 }, 500); q.tick();   // a dragged change keeps its share (B's G8)
    for (let L = 1000; L >= 900; L -= 2) { q.type('length m', L); const c = (q.panel.options().changes || {}).phi; out.shorten.push([L, c ? c[0].from : null, c ? +(c[0].target / DEG).toFixed(2) : null, refuses(q)]); }
    q.panel.unmount(); }
  const bad = (rows) => rows.filter((r) => r[3]);
  console.log(JSON.stringify({ made: out.made, markDragRefused: bad(out.markDrag).length, markDragRows: out.markDrag.length, markDragRefusedAt: bad(out.markDrag).map((r) => `asked ${r[0]} kept ${r[1]} (span ${(1000 - r[1]).toFixed(2)})`).slice(0, 40), firstRefusal: (bad(out.markDrag)[0] || [])[3] || null,
    shortenRefused: bad(out.shorten).length, shortenRows: out.shorten.length, shortenRefusedAt: bad(out.shorten).map((r) => `L ${r[0]} from ${r[1]} (span ${(r[0] - r[1]).toFixed(2)})`).slice(0, 30), shortenFirst: (bad(out.shorten)[0] || [])[3] || null }, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
