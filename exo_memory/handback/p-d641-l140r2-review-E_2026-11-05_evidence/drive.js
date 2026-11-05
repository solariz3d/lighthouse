// usage: node drive.js <t180 tree>   D641: round 2 of the extra handles (d91227f) driven by REAL pointer presses at the screen points the handles report.
// The mount (fake window, fake #preview 1200x800, straight ghost from s0 = 1000 seen from above and behind) is C's, copied verbatim from
// app/test/core-extra-handles-glitches.test.js:6-69 into mount.part.js. Everything below is mine. Prints one JSON object.
'use strict';
const path = require('path'), fs = require('fs');
const WT = path.resolve(process.argv[2]);
eval(fs.readFileSync(path.join(__dirname, 'mount.part.js'), 'utf8').replace("const test = require('node:test');", ''));   // C's mount, as one script
const HD = require(WT + '/app/core/handles.js'), D = require(WT + '/src/core/document.js');
const out = {};
const r2 = (x) => Math.round(x * 100) / 100;
const ex = (p, f) => p.panel.extraHandles().filter((e) => e.field === f);
const onScreen = (p) => p.panel.handles.handles().filter((h) => h.screen);
const exScreen = (p, f) => onScreen(p).filter((h) => { const K = HD.KINDS[h.kind]; return K && K.extra && ex(p, f).some((e) => e.id === h.kind); });
// a real value drag on a handle: along its own screen axis (the turn: the pointer's x), `px` pixels, in 4 px steps
function pull(p, h, px) {
  const K = HD.KINDS[h.kind], s = h.screen; let ux, uy;
  if (K.screen === 'x') { ux = 1; uy = 0; } else { const n = Math.hypot(s.dx, s.dy) || 1; ux = s.dx / n; uy = s.dy / n; }
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  const n = Math.max(1, Math.ceil(Math.abs(px) / 4));
  for (let i = 1; i <= n; i++) p.stage.fire('pointermove', { clientX: s.x + ux * px * i / n, clientY: s.y + uy * px * i / n, pointerId: 1 });
  p.stage.fire('pointerup', { clientX: s.x + ux * px, clientY: s.y + uy * px, pointerId: 1 }); p.tick();
}
// a real slide along the road (the handle's slideAxis), `px` pixels
function slide(p, h, px) {
  const s = h.screen, a = h.slideAxis || s, n0 = Math.hypot(a.dx, a.dy) || 1, ux = a.dx / n0, uy = a.dy / n0;
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  const n = Math.max(1, Math.ceil(Math.abs(px) / 4));
  for (let i = 1; i <= n; i++) p.stage.fire('pointermove', { clientX: s.x + ux * px * i / n, clientY: s.y + uy * px * i / n, pointerId: 1 });
  p.stage.fire('pointerup', { clientX: s.x + ux * px, clientY: s.y + uy * px, pointerId: 1 }); p.tick();
}
// the laid piece (the core's own Extend of the panel's options) read every 1 m: heading change so far, and where the turn rate is nonzero
function laid(p) {
  const doc = TB.extendCorner(p.shell.getState().history.present, p.panel.options()), P = doc.pieces[doc.pieces.length - 1];
  let runs = [], on = null, peak = 0; const at = {};
  // heading by the trapezoid in radians, then degrees
  let h = 0, k0 = D.channelAt(P, 'kh', 0).v; for (let s = 0.5; s <= P.length + 1e-9; s += 0.5) { const k = D.channelAt(P, 'kh', Math.min(s, P.length)).v; h += (k0 + k) / 2 * 0.5; k0 = k; for (const m of [250, 500, 750]) if (Math.abs(s - m) < 0.25) at[m] = r2(h / DEG); if (Math.abs(k) > 1e-6) { if (!on) on = [s, s]; else on[1] = s; } else if (on) { runs.push(on); on = null; } peak = Math.max(peak, Math.abs(k)); }
  if (on) runs.push(on);
  return { length: P.length, headingDeg: { ...at, end: r2(h / DEG) }, turnRuns: runs.map(([a, b]) => [r2(a), r2(b)]), peakKh: +peak.toFixed(6) };
}
const pairs = (p) => { const L = onScreen(p), res = []; for (const h of L) { const K = HD.KINDS[h.kind]; if (!K || !K.extra) continue; let best = { d: Infinity }; for (const o of L) if (o.kind !== h.kind) { const d = Math.hypot(o.screen.x - h.screen.x, o.screen.y - h.screen.y); if (d < best.d) best = { d: r2(d), to: o.id }; } res.push({ id: h.id, nearest: best }); } return res; };

(async () => {
  // ITEM 1 (repeats): turn -90 on 1,000 m; drag the unused extra turn, then look for a second unused one; drag the used one again
  { const p = await mount(); p.type('length m', 1000); p.type('turn °', -90);
    const before = ex(p, 'turn').map((e) => ({ id: e.id, unused: !!e.unused, from: e.from, at: e.at }));
    let h = exScreen(p, 'turn')[0]; pull(p, h, -300);
    const after1 = { changes: p.changes().turnDeg, extras: ex(p, 'turn').map((e) => ({ id: e.id, unused: !!e.unused, from: e.from })), offers: p.panel.secondTick ? p.panel.secondTick.offers().filter((o) => o.field === 'turn').length : null };
    h = exScreen(p, 'turn')[0]; pull(p, h, -200);
    const after2 = { changes: p.changes().turnDeg, extras: ex(p, 'turn').map((e) => ({ id: e.id, unused: !!e.unused })) };
    // a press on the turn handle itself (the base), then look again
    const t = onScreen(p).find((x) => x.kind === 'turnDeg'); if (t) pull(p, t, 40);
    out.item1 = { before, after1, after2, afterBaseTurnDrag: { changes: p.changes().turnDeg, extras: ex(p, 'turn').map((e) => ({ id: e.id, unused: !!e.unused })), field: p.field('turn °').value } };
    p.panel.unmount(); }
  // ITEM 2 (the S): turn -90 on 1,000 m; drag the extra turn far enough for +90 (90 / 0.083 = 1,085 px), both ways to find the sign
  for (const px of [-1100, 1100, -400]) {
    const p = await mount(); p.type('length m', 1000); p.type('turn °', -90);
    const h = exScreen(p, 'turn')[0]; pull(p, h, px);
    out[`item2_${px}`] = { change: p.changes().turnDeg, refusal: p.refusal(), laid: p.refusal() ? null : laid(p) };
    p.panel.unmount();
  }
  { const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); out.item2_alone = { laid: laid(p) }; p.panel.unmount(); }
  // ITEM 3 (overlap): every handle up, at four camera distances; the nearest other handle to each extra
  const cam = (k) => (L) => ({ eye: [0, k * 0.6 * L, 1000 - k * 0.25 * L], target: [0, 0, 1000 + 0.5 * L], up: [0, 1, 0], fov: Math.PI / 3 });
  out.item3 = {};
  for (const k of [0.6, 1, 1.6, 2.4]) for (const L of [1000, 300]) {
    const p = await mount({ pose: cam(k) }); p.type('length m', L); p.type('turn °', -90); p.type('bank °', 30); p.type('climb °', 4); p.type('width m', 30); p.type('cup °', 15);
    const ys = onScreen(p).filter((h) => /^(length|width)/.test(h.kind)).map((h) => h.screen.y);
    out.item3[`cam${k}_L${L}`] = { pieceOnScreenPx: r2(Math.max(...ys) - Math.min(...ys)), extras: ex(p, 'turn').concat(ex(p, 'bank'), ex(p, 'climb'), ex(p, 'width'), ex(p, 'cup')).map((e) => ({ id: e.id, at: e.at, from: e.from })), nearest: pairs(p) };
    p.panel.unmount();
  }
  // G re-drives by real pointer: G1 bank, G3 bank with the turn set, G4 (after the extra turn is made at 500, both bank sides), G5 slide, G6 drag released 10 px short, G9 slide past a neighbour
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 80); pull(p, p.handle('bank', 1), -40); out.G1 = { bank: p.field('bank °').value, changes: p.changes() }; p.panel.unmount(); }
  { const p = await mount(); p.type('length m', 1000); p.type('turn °', -60); p.type('bank °', 80); pull(p, p.handle('bank', 1), 40); out.G3 = { bank: p.field('bank °').value, changes: p.changes() }; p.panel.unmount(); }
  { const p = await mount(); p.type('length m', 1000); p.type('turn °', -60); p.type('bank °', 80); pull(p, exScreen(p, 'turn')[0], -200); const t0 = JSON.stringify(p.changes().turnDeg);
    pull(p, p.handle('bank', 1), 40); pull(p, p.handle('bank', -1), 40); out.G4 = { turnBefore: t0, turnAfter: JSON.stringify(p.changes().turnDeg), bank: p.field('bank °').value }; p.panel.unmount(); }
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 30); const h = exScreen(p, 'bank')[0]; slide(p, h, 60); const fromAfterSlide = ex(p, 'bank')[0].from; pull(p, exScreen(p, 'bank')[0], -40);
    out.G5 = { fromAfterSlide, changes: p.changes().phi }; p.panel.unmount(); }
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 80); const h = exScreen(p, 'bank')[0], K = HD.KINDS[h.kind];
    const px = (80 / K.perPx) - 10; pull(p, h, -px); const a = p.changes().phi; out.G6 = { pulledPx: r2(px), target: a && a[0] ? r2(a[0].target / DEG) : null }; p.panel.unmount(); }
  { const p = await mount(); p.type('length m', 1000); p.type('bank °', 30); p.panel.secondAdd('bank', { then: '10', from: '400' }); p.panel.secondAdd('bank', { then: '0', from: '800' }); p.tick();
    const m = p.panel.secondTick.marks().filter((x) => x.field === 'bank'); out.G9marks = m.map((x) => ({ index: x.index, s: x.s }));
    p.panel.unmount(); }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
