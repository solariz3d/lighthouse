// ---- mine (D642 review of d87ba99): what one drag move costs the panel while the EXTRA BANK itself is dragged (the chair: a drag sends a new target every move, and each new
// bank-back target runs the probe). Through C's D641 mount (the real core shell, panel and handles on a fake stage; its ghost reply is a fake straight, so this is the
// PANEL's and the core's work per move, not the renderer's). A real pointer drag on the unused extra bank: pointerdown, then MOVES moves of STEP px, a frame (tick) after
// each, every move timed (pointermove + tick). Cases:
//   rolling: his piece, bank 88.45 eased over the whole piece (the panel's default), so the extra bank sits on a moving first ramp: the probe path
//   early:   the same piece with the bank's "early" box ticked, so the first ramp is done before the extra: no probe (the flat analogue)
//   length:  his rolling piece, the LENGTH handle dragged instead (the drag B's row 9 measures)
// Reported per case: median, p95 and max ms a move, the number of moves, and what the drag ended at. Run with the heavy-run lock held as a TIMING session, BelowNormal.
const HD = require(WT + '/app/core/handles.js');
const MOVES = Number(process.env.MOVES || 60), STEP = Number(process.env.STEP || 3);
const q = (xs, f) => { const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(f * s.length))].toFixed(2); };
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
async function his(early) {
  const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 88.45); p.type('cup °', 15.5); p.type('width m', 31);
  if (early) { const box = p.root.all().find((e) => e.tagName === 'INPUT' && e.attrs.type === 'checkbox' && e.attrs['aria-label'] === 'bank at the start'); if (!box) throw new Error('no "bank at the start" box'); box.checked = true; (box.onchange || box.onclick || (() => {}))(); p.tick(); }
  return p;
}
async function drag(p, h, dir) {
  const s = h.screen, K = HD.KINDS[h.kind]; let ux, uy; if (K.screen === 'x') { ux = 1; uy = 0; } else { const n = Math.hypot(s.dx, s.dy) || 1; ux = s.dx / n; uy = s.dy / n; }
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 }); const ts = [];
  for (let i = 1; i <= MOVES; i++) { const t0 = process.hrtime.bigint(); p.stage.fire('pointermove', { clientX: s.x + dir * ux * STEP * i, clientY: s.y + dir * uy * STEP * i, pointerId: 1, timeStamp: i * 16 }); p.tick(); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); }
  const t0 = process.hrtime.bigint(); p.stage.fire('pointerup', { clientX: s.x + dir * ux * STEP * MOVES, clientY: s.y + dir * uy * STEP * MOVES, pointerId: 1 }); p.tick(); const up = Number(process.hrtime.bigint() - t0) / 1e6;
  return { moves: ts.length, medianMs: q(ts, 0.5), p95Ms: q(ts, 0.95), maxMs: +Math.max(...ts).toFixed(2), firstMs: +ts[0].toFixed(2), releaseMs: +up.toFixed(2) };
}
(async () => {
  const out = { tree: WT, MOVES, STEP, cases: {} };
  for (let rep = 0; rep < 2; rep++) {
    for (const [name, early] of [['rolling (extra bank, probe path)', false], ['early (extra bank, no probe)', true]]) {
      for (const dir of [-1, 1]) {
        const p = await his(early), h = exScreen(p, 'bank')[0]; if (!h) { out.cases[`${name} dir ${dir} rep ${rep}`] = 'no extra bank handle'; p.panel.unmount(); continue; }
        const r = await drag(p, h, dir), c = (p.panel.options().changes || {}).phi; r.endedAt = c ? c.map((x) => ({ from: x.from, targetDeg: +(x.target / DEG).toFixed(2) })) : null;
        out.cases[`${name} dir ${dir} rep ${rep}`] = r; p.panel.unmount();
      }
    }
    { const p = await his(false), h = onScreen(p).find((x) => x.kind === 'length'); const r = await drag(p, h, 1); out.cases[`length drag on the rolling piece rep ${rep}`] = r; p.panel.unmount(); }
  }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
