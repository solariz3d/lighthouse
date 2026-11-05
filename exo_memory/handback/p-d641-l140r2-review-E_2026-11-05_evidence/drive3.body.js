// ---- mine (drive3): G7 on 300 m, where the offer stands and what the laid road's bank does, against the same piece with no change ----
const HD = require(WT + '/app/core/handles.js'), D = require(WT + '/src/core/document.js');
const out = {}, r2 = (x) => Math.round(x * 100) / 100;
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
function pull(p, h, px) {
  const K = HD.KINDS[h.kind], s = h.screen; let ux, uy;
  if (K.screen === 'x') { ux = 1; uy = 0; } else { const n = Math.hypot(s.dx, s.dy) || 1; ux = s.dx / n; uy = s.dy / n; }
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  const n = Math.max(1, Math.ceil(Math.abs(px) / 4));
  for (let i = 1; i <= n; i++) p.stage.fire('pointermove', { clientX: s.x + ux * px * i / n, clientY: s.y + uy * px * i / n, pointerId: 1 });
  p.stage.fire('pointerup', { clientX: s.x + ux * px, clientY: s.y + uy * px, pointerId: 1 }); p.tick();
}
// the laid piece's bank every 0.5 m: its value at a few stations and its largest rate (°/m), where
const bankOf = (p) => { const d = TB.extendCorner(p.shell.getState().history.present, p.panel.options()), P = d.pieces[d.pieces.length - 1]; let mx = 0, at = 0; const v = {};
  for (let s = 0; s <= P.length + 1e-9; s += 0.5) { const c = D.channelAt(P, 'phi', Math.min(s, P.length)); if (Math.abs(c.d1) > mx) { mx = Math.abs(c.d1); at = s; } for (const m of [0, 2, 4, 6, 10, 20, 50, 100, 150, 200, 300]) if (Math.abs(s - m) < 0.25) v[m] = r2(c.v / DEG); }
  return { length: P.length, bankDeg: v, maxRateDegPerM: r2(mx / DEG), at };
};
(async () => {
  for (const L of [300, 1000]) {
    const p = await mount(); p.type('length m', L); p.type('bank °', 30);
    const offer = p.panel.offersAt().find((o) => o.field === 'bank'), extra = ex(p, 'bank')[0];
    const alone = bankOf(p);
    pull(p, exScreen(p, 'bank')[0], -200);
    out[`L${L}`] = { offerFrom: offer && offer.from, extraFrom: extra && extra.from, change: (p.changes().phi || []).map((c) => ({ from: c.from, target: r2(c.target / DEG) })), refusal: p.refusal(), alone, withChange: p.refusal() ? null : bankOf(p) };
    p.panel.unmount();
  }
  // the same through C's own way in (make), as its G7 row does
  { const p = await mount(); p.type('length m', 300); p.type('bank °', 30); p.make('bank', 0); out.L300_make = { change: (p.changes().phi || []).map((c) => ({ from: c.from, target: r2(c.target / DEG) })), withChange: p.refusal() ? null : bankOf(p) }; p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
