// ---- mine (drive8): (e) and (f) on his HUD's piece. A long extra-bank drag logged every 100 px (on this harness's STRAIGHT ghost the road does not
// roll under the handle, so a reversal here cannot come from the axis turning); the base bank handle the same; and (f): a typed -654.7 committed by the
// field's change event.
const HD = require(WT + '/app/core/handles.js');
const r2 = (x) => Math.round(x * 100) / 100;
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
async function setUp() { const p = await mount(); p.type('length m', 2040.48); p.type('turn °', 90); p.type('cup °', 15.5); p.type('width m', 31); p.type('bank °', 65.3); return p; }
// one long drag, a frame every 4 px, the value read every 100 px: the extra's change target, or the field
async function logDrag(which, px) {
  const p = await setUp(), h = which === 'extra' ? exScreen(p, 'bank')[0] : p.handle('bank', 1), s = h.screen, n0 = Math.hypot(s.dx, s.dy), ux = s.dx / n0, uy = s.dy / n0, log = [];
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  const n = Math.ceil(Math.abs(px) / 4), sg = Math.sign(px);
  for (let i = 1; i <= n; i++) { p.stage.fire('pointermove', { clientX: s.x + ux * sg * 4 * i, clientY: s.y + uy * sg * 4 * i, pointerId: 1 }); p.tick();
    if ((4 * i) % 100 === 0) { const c = (p.changes().phi || [])[0]; log.push([4 * i, which === 'extra' ? (c ? r2(c.target / DEG) : null) : Number(p.field('bank °').value)]); } }
  p.stage.fire('pointerup', { clientX: s.x + ux * sg * 4 * n, clientY: s.y + uy * sg * 4 * n, pointerId: 1 }); p.tick();
  let biggest = 0; for (let i = 1; i < log.length; i++) if (log[i][1] !== null && log[i - 1][1] !== null) biggest = Math.max(biggest, Math.abs(log[i][1] - log[i - 1][1]));
  p.panel.unmount(); return { which, px, log, biggestStepPer100px: r2(biggest) };
}
(async () => {
  const out = { drags: [] };
  for (const [w, px] of [['extra', 2000], ['extra', -2000], ['base', 2000], ['base', -2000]]) out.drags.push(await logDrag(w, px));
  // (f): typed -654.7, then the field's change event (a commit), as C's fix reads it; and the extra handle's value after
  { const p = await setUp(); const f = p.field('bank °'); f.value = '-654.7'; f.oninput(); p.tick(); const whileTyping = f.value;
    if (typeof f.onchange === 'function') f.onchange(); else if (f.listeners && f.listeners.change) for (const l of f.listeners.change) l.f({ type: 'change', target: f });
    p.tick(); out.f = { whileTyping, afterCommit: f.value, extraValue: ex(p, 'bank').map((e) => e.value), hasOnchange: typeof f.onchange === 'function' }; p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
