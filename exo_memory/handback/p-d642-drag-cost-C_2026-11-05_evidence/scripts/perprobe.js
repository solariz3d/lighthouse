// perprobe.js <tree>: one probe build's own cost on 9050da5 (extend.js probePeak through spanHolds, the memo bypassed by fresh targets on the 1° grid), and how many a
// 60-move first drag of the extra bank builds per move (who.js's mount, the fold's panel)
// usage: node additive-full.js <t180 tree>   D642 review (see the body)
'use strict';
const path = require('path'), fs = require('fs');
const WT = path.resolve(process.argv[2]);
// ---- C's D641 mount (core-extra-handles-glitches.test.js at d91227f :6-69), verbatim but for the require paths ----
'use strict';

const assert = require('node:assert/strict');
const { createCoreShell } = require(WT + '/app/core/coreshell.js');
const TB = require(WT + '/src/core/turnby.js');
const DEG = Math.PI / 180;

class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.parent = null; }
  append(...k) { for (const c of k) { if (c == null) continue; const n = typeof c === 'string' ? Object.assign(new El('#text', this.ownerDocument), { _text: c }) : c; n.parent = this; this.children.push(n); } }
  replaceChildren(...k) { for (const c of this.children) c.parent = null; this.children = []; this.append(...k); }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.ownerDocument.ids[v] = this; }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(t) { this._text = String(t); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  addEventListener(e, f, o) { (this.listeners[e] = this.listeners[e] || []).push({ f, capture: !!(o === true || (o && o.capture)) }); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x.f !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth || 0, height: this.clientHeight || 0 }; }
  get isConnected() { return true; }
  setPointerCapture() {}
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
  fire(type, init) { let stopped = false; const ev = { type, ...init, preventDefault() {}, stopPropagation() { stopped = true; }, stopImmediatePropagation() { stopped = true; } };
    const ls = (this.listeners[type] || []).slice(), order = ls.filter((l) => l.capture).concat(ls.filter((l) => !l.capture));
    let n = 0; for (const l of order) { if (stopped) break; n++; l.f(ev); } return n; }
}
function fakeWindow() {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const frames = [];
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } },
    requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} };
  doc.defaultView = win;
  return { doc, win, tick: () => { for (let i = 0; i < 3; i++) { const fs = frames.splice(0); for (const f of fs) f(0); } } };
}
const ghostOf = (L) => { const s0 = 1000, samples = []; for (let s = s0; s <= s0 + L + 1e-9; s += 2) samples.push({ s, pos: [0, 0, s], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] }); return { s0, samples, segments: [], jump: false }; };
const POSE = (L) => ({ eye: [0, 0.6 * L, 1000 - 0.25 * L], target: [0, 0, 1000 + 0.5 * L], up: [0, 1, 0], fov: Math.PI / 3 });

async function mount({ pose = POSE } = {}) {
  const { doc, win, tick } = fakeWindow();
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); stage.clientWidth = 1200; stage.clientHeight = 800;
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  shell.extend({ length: 1000, family: 'bowl' });   // his first piece: a 1,000 m straight
  let L = 1000; doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(ghostOf(L))); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: pose(L) }));
  const panel = require(WT + '/app/core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); assert.ok(l, `no "${text}" field`); return l.children[1]; };
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); if (text === 'length m') L = Number(v); tick(); };
  const handle = (kind, side) => panel.handles.handles().find((h) => h.kind === kind && h.side === side && h.screen);
  const refusal = () => { try { TB.extendCorner(shell.getState().history.present, panel.options()); return null; } catch (e) { return `${e.code}: ${e.message}`; } };
  const changes = () => panel.options().changes || {};
  // a press at a handle and a drag of dy px (screen), released there
  const drag = (h, dx, dy) => { const s = h.screen; stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 }); for (let i = 1; i <= 4; i++) stage.fire('pointermove', { clientX: s.x + dx * i / 4, clientY: s.y + dy * i / 4, pointerId: 1 }); stage.fire('pointerup', { clientX: s.x + dx, clientY: s.y + dy, pointerId: 1 }); tick(); };
  // a change made from its handle, the user's way in: the extra handle (L140) or the offer (L139)
  const make = (f, v) => {
    if (typeof panel.extraHandles === 'function') { const x = panel.extraHandles().find((e) => e.field === f && e.unused); assert.ok(x, `an extra ${f} handle`); panel.secondExtra(x.id, v); return x.from; }
    const o = panel.offersAt().find((e) => e.field === f); assert.ok(o, `an offer for ${f}`); panel.secondOffer(o, v); return o.from;
  };
  return { doc, win, tick, stage, root, shell, panel, field, type, handle, refusal, changes, drag, make, asRate: () => { const ta = root.all().find((e) => e.tagName === 'SELECT' && e.attrs['aria-label'] === 'turn and climb as'); ta.value = 'rate'; ta.onchange(); tick(); } };
}


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
const AD = require(WT + '/src/core/adapter.js'), EXT = require(WT + '/src/core/extend.js'); let plans = 0; const bp = AD.bankPlan; AD.bankPlan = (...a) => { plans++; return bp(...a); };
(async () => {
  const R = Math.PI / 180, base = { step: 88.45 * R, length: 1000 }, t = [];
  for (let k = 0; k < 20; k++) { const b = (-100 - k * 3) * R, p0 = plans, t0 = process.hrtime.bigint(); EXT.spanHolds('phi', 88.45 * R, b, base, 500); t.push([Number(process.hrtime.bigint() - t0) / 1e6, plans - p0]); }
  const built = t.filter((x) => x[1] > 0).map((x) => x[0]).sort((a, b) => a - b);
  console.log(`one spanHolds that builds a probe: median ${built[Math.floor(built.length / 2)].toFixed(1)} ms (${built.length} of 20 built one)`);
  const p = await his(false), h = exScreen(p, 'bank')[0], s = h.screen, n = Math.hypot(s.dx, s.dy), ux = s.dx / n, uy = s.dy / n, per = [];
  p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0 });
  for (let i = 1; i <= 60; i++) { const p0 = plans; p.stage.fire('pointermove', { clientX: s.x - ux * 8 * i, clientY: s.y - uy * 8 * i, pointerId: 1, timeStamp: i * 16 }); p.tick(); per.push(plans - p0); }
  const hist = per.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});
  console.log(`60-move first drag: probe builds per move ${JSON.stringify(hist)} (moves by count), total ${per.reduce((a, x) => a + x, 0)}`);
  p.panel.unmount();
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
