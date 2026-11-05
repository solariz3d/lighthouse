// ---- mine (drive6): his home case (brief :32, d41f5ed5): 2040.48 m, turn +90 corner, cup 15.5, width 31, bank +65.30 (−294.70 shown). How far the EXTRA bank and the
// bank handle itself wind, what the field, the change and the built road read, and whether the shipped checker sees a fold. A frame runs after every 4 px event (hand speed).
const HD = require(WT + '/app/core/handles.js'), D = require(WT + '/src/core/document.js'), V = require(WT + '/src/validate/index.js'), AD = require(WT + '/src/core/adapter.js');
const r2 = (x) => Math.round(x * 100) / 100;
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
function pull(p, h, px) {
  const K = HD.KINDS[h.kind], s = h.screen; let ux, uy;
  if (K.screen === 'x') { ux = 1; uy = 0; } else { const n = Math.hypot(s.dx, s.dy) || 1; ux = s.dx / n; uy = s.dy / n; }
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  const n = Math.max(1, Math.ceil(Math.abs(px) / 4));
  for (let i = 1; i <= n; i++) { p.stage.fire('pointermove', { clientX: s.x + ux * px * i / n, clientY: s.y + uy * px * i / n, pointerId: 1 }); p.tick(); }
  p.stage.fire('pointerup', { clientX: s.x + ux * px, clientY: s.y + uy * px, pointerId: 1 }); p.tick();
}
const built = (p) => {
  let d; try { d = TB.extendCorner(p.shell.getState().history.present, p.panel.options()); } catch (e) { return { refusal: `${e.code}: ${e.message}`.slice(0, 200) }; }
  const P = d.pieces[d.pieces.length - 1]; let lo = Infinity, hi = -Infinity, mx = 0; const at = {};
  for (let s = 0; s <= P.length + 1e-9; s += 1) { const c = D.channelAt(P, 'phi', Math.min(s, P.length)); lo = Math.min(lo, c.v); hi = Math.max(hi, c.v); mx = Math.max(mx, Math.abs(c.d1)); for (const m of [0, 510, 1020, 1530, 2040]) if (Math.abs(s - m) < 0.5) at[m] = r2(c.v / DEG); }
  const segs = AD.toSegments(d), path = AD.offsetPath(d, segs, AD.toPath(d, { step: 2 }).path), r = V.validate(path, segs, {}), red = {}; for (const f of r.red || []) red[f.reason] = (red[f.reason] || 0) + 1;
  return { bankDegAt: at, bankRangeDeg: [r2(lo / DEG), r2(hi / DEG)], maxRollDegPerM: r2(mx / DEG), red };
};
async function setUp() { const p = await mount(); p.type('length m', 2040.48); p.type('turn °', 90); p.type('cup °', 15.5); p.type('width m', 31); p.type('bank °', 65.3); return p; }
(async () => {
  const out = { base: null, extra: [], bankHandle: [] };
  { const p = await setUp(); out.base = { bankField: p.field('bank °').value, extras: ex(p, 'bank').map((e) => ({ id: e.id, from: e.from, value: e.value, unused: !!e.unused })), K: { min: HD.KINDS['extra:bank:0'].min, max: HD.KINDS['extra:bank:0'].max, perPx: HD.KINDS['extra:bank:0'].perPx }, built: built(p) }; p.panel.unmount(); }
  for (const px of [200, 400, 800, 1200, 1700, -200, -400, -800]) {
    const p = await setUp(); const h = exScreen(p, 'bank')[0]; pull(p, h, px);
    const c = (p.changes().phi || [])[0];
    out.extra.push({ px, bankField: p.field('bank °').value, change: c ? { from: c.from, targetDeg: r2(c.target / DEG) } : null, shown: HD.format ? HD.format('extra:bank:0', c ? c.target / DEG : null) : null, built: built(p) });
    p.panel.unmount();
  }
  for (const px of [800, -800]) { const p = await setUp(); pull(p, p.handle('bank', 1), px); out.bankHandle.push({ px, bankField: p.field('bank °').value, changes: p.changes(), built: built(p) }); p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
