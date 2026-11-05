// ---- mine (drive2): G6 scanned by real release points, G7/G8/G9 by real pointer, and whether the edges' L139 offers still repeat ----
const HD = require(WT + '/app/core/handles.js');
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
const pressAt = (p, x, y, x2, y2) => { p.stage.fire('pointerdown', { clientX: x, clientY: y, pointerId: 1, button: 0 }); const n = Math.max(1, Math.ceil(Math.hypot(x2 - x, y2 - y) / 4)); for (let i = 1; i <= n; i++) p.stage.fire('pointermove', { clientX: x + (x2 - x) * i / n, clientY: y + (y2 - y) * i / n, pointerId: 1 }); p.stage.fire('pointerup', { clientX: x2, clientY: y2, pointerId: 1 }); p.tick(); };

(async () => {
  // G6: the extra bank from 80 and the extra turn (a corner, from 0) released at every pointer travel; the travels that land exactly on 0 (bank) or on the snap
  for (const [f, start, sign] of [['bank', 80, -1], ['turn', 0, -1]]) {
    const res = [];
    for (let px = 0; px <= 260; px += 1) {
      const p = await mount(); p.type('length m', 1000); if (f === 'bank') p.type('bank °', start); else p.type('turn °', -90);
      const h = exScreen(p, f)[0]; if (!h) { res.push([px, 'no handle']); p.panel.unmount(); continue; }
      pull(p, h, sign * px);
      const c = f === 'bank' ? (p.changes().phi || [])[0] : (p.changes().turnDeg || [])[0];
      res.push([px, c ? r2(f === 'bank' ? c.target / DEG : c.deg) : null]); p.panel.unmount();
    }
    // where it reads exactly 0, and the values on either side of that window
    const zero = res.filter((r) => r[1] === 0).map((r) => r[0]);
    out[`G6_${f}`] = { zeroAtPx: zero.length ? [Math.min(...zero), Math.max(...zero)] : [], around: res.filter((r) => zero.length && r[0] >= Math.min(...zero) - 16 && r[0] <= Math.max(...zero) + 16) };
  }
  // G7 by pointer: 300 m, bank 30, the extra bank dragged hard toward level
  { const p = await mount(); p.type('length m', 300); p.type('bank °', 30); pull(p, exScreen(p, 'bank')[0], -200); out.G7 = { change: p.changes().phi, refusal: p.refusal() }; p.panel.unmount(); }
  // G8 by pointer: 1,000 m, bank 80, the extra bank slid to 600 and dragged to level, then the length typed down
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 80);
    const h = exScreen(p, 'bank')[0], a = h.slideAxis, n0 = Math.hypot(a.dx, a.dy); pressAt(p, h.screen.x, h.screen.y, h.screen.x + a.dx / n0 * 40, h.screen.y + a.dy / n0 * 40);
    pull(p, exScreen(p, 'bank')[0], -200); const made = JSON.stringify(p.changes().phi); const rows = [];
    for (const L of [800, 600, 560, 500, 400]) { p.type('length m', L); rows.push({ L, from: (p.changes().phi || [])[0] && p.changes().phi[0].from, refusal: p.refusal() }); }
    out.G8 = { made, rows }; p.panel.unmount(); }
  // G9 by pointer: changes at 400 (to 10) and 800 (to 0); the second's mark pressed and dragged back past the first
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 30); p.panel.secondAdd('bank', { then: '10', from: '400' }); p.panel.secondAdd('bank', { then: '0', from: '800' }); p.tick();
    const ms = p.panel.secondTick.marks().filter((x) => x.field === 'bank'), m1 = ms.find((x) => x.index === 1), m0 = ms.find((x) => x.index === 0);
    const st = m1.strokes[0], cx = (st.a.x + st.b.x) / 2, cy = (st.a.y + st.b.y) / 2, s0 = m0.strokes[0], tx = (s0.a.x + s0.b.x) / 2, ty = (s0.a.y + s0.b.y) / 2;
    pressAt(p, cx, cy, tx + (tx - cx) * 0.5, ty + (ty - cy) * 0.5);
    out.G9 = { changes: p.changes().phi.map((c) => ({ from: c.from, target: r2(c.target / DEG) })), refusal: p.refusal() }; p.panel.unmount(); }
  // the edges: no extra handle; does the L139 offer repeat after its change is made (two per action, or more)?
  { const p = await mount(); p.type('length m', 1000); p.type('left edge °', 20); const counts = [];
    for (let i = 0; i < 4; i++) { const of = p.panel.offersAt().filter((o) => o.field === 'edge'); counts.push(of.length); if (!of.length) break; p.panel.secondOffer(of[0], 10 - i * 3); p.tick(); }
    out.edges = { offersSeenEachStep: counts, changes: p.changes().e || p.changes() }; p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
