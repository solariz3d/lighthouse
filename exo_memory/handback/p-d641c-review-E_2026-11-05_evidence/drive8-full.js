// usage: node drive8-full.js <t180 tree>   D641 drive 8 (see the body)
'use strict';
const path = require('path'), fs = require('fs');
const WT = path.resolve(process.argv[2]);
// ---- C's mount (d91227f :6-69), verbatim but for the require paths ----
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
