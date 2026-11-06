// ---- mine (D642 review of 212e78d): ONE extra-bank drag toward level per process, so the JIT and the probe memo start cold (MODE cold-rolling / cold-early), or with the code
// warmed by one unmeasured EARLY drag first (MODE warm-rolling / warm-early: C's row form, the memo still cold because an early bank makes no probe). The same drag as
// dragbench (his piece; 60 moves of 8 px at 16 ms, a frame after each, every move timed). Prints one JSON line: the mode, median, p95, max and the drag's end.
const HD = require(WT + '/app/core/handles.js');
const MODE = process.env.MODE || 'cold-rolling', MOVES = 60, STEP = 8;
const q = (xs, f) => { const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(f * s.length))].toFixed(2); };
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
async function piece(early) {
  const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 88.45); p.type('cup °', 15.5); p.type('width m', 31);
  if (early) { const box = p.root.all().find((e) => e.tagName === 'INPUT' && e.attrs.type === 'checkbox' && e.attrs['aria-label'] === 'bank at the start'); box.checked = true; (box.onchange || box.onclick)(); p.tick(); }
  return p;
}
async function drag(p) {
  const h = exScreen(p, 'bank')[0], s = h.screen, n = Math.hypot(s.dx, s.dy) || 1, ux = s.dx / n, uy = s.dy / n, ts = [];
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  for (let i = 1; i <= MOVES; i++) { const t0 = process.hrtime.bigint(); p.stage.fire('pointermove', { clientX: s.x - ux * STEP * i, clientY: s.y - uy * STEP * i, pointerId: 1, timeStamp: i * 16 }); p.tick(); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); }
  p.stage.fire('pointerup', { clientX: s.x - ux * STEP * MOVES, clientY: s.y - uy * STEP * MOVES, pointerId: 1 }); p.tick();
  const c = (p.panel.options().changes || {}).phi; return { medianMs: q(ts, 0.5), p95Ms: q(ts, 0.95), maxMs: +Math.max(...ts).toFixed(2), endDeg: c ? +(c[0].target / DEG).toFixed(2) : null };
}
(async () => {
  if (MODE.startsWith('warm')) { const w = await piece(true); await drag(w); w.panel.unmount(); }
  const p = await piece(MODE.endsWith('early')), r = await drag(p); p.panel.unmount();
  console.log(JSON.stringify({ mode: MODE, ...r }));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
