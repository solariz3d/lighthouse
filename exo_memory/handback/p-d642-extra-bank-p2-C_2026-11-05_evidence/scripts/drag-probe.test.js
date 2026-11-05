// core-extra-bank-wind.test.js: node --test app/test/core-extra-bank-wind.test.js
// D641 (pane C): the user's home test of round 2 (d91227f), exo_memory/briefs/t180_second_bank.md 15:09Z: "the extra turn works, but the extra banking breaks". His HUD
// (the piece being laid): length 2040.48 m, turn +90.00° as a corner, bank −294.70°, cup 15.5, width 31, bank to gravity 0.00° → +65.30°; the road rolled past a full turn.
// Each row drives the REAL core shell, panel and handles on a fake #preview stage (B's drive.js harness, as core-extra-handles-glitches.test.js), with ONE change: the ghost
// is the real core's piece (TB.extendCorner of the panel's own options, through src/core/adapter.js toPath), so the road rolls under a bank handle as it does in the app.
// Measured on d91227f: a long drag on the base bank handle stops by itself (the road rolls under the handle and turns its axis away: from +65.3 it settled at −124.3 and
// +235.1), while the same drag on the extra bank handle wound on through −300, jumped back to −4.9 in one step, and wound round again: the extra handle stands at 0.60,
// where its own change (from 0.50) has hardly rolled the road, so its axis never turns. His −294.70 is one point on that wind.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createCoreShell } = require('../core/coreshell.js');
const TB = require('../../src/core/turnby.js');
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
const A = require('../../src/core/adapter.js');
// the ghost the preview would show: the real core's next piece at the panel's options, its samples from s0 = 1000 (the placed 1,000 m straight's end)
let ghostMemo = null;
function realGhost(shell, panel) {
  const o = panel.options(), d = shell.getState().history.present, key = JSON.stringify(o);
  if (ghostMemo && ghostMemo.key === key && ghostMemo.d === d) return ghostMemo.g;
  let dc; try { dc = TB.extendCorner(d, o); } catch (e) { return null; }
  const samples = A.toPath(dc, { step: 2 }).path.samples.filter((m) => m.s >= 1000 - 1e-9).map((m) => ({ s: m.s, pos: [...m.pos], T: [...m.T], L: [...m.L], U: [...m.U] }));
  ghostMemo = { key, d, g: { s0: 1000, samples, segments: [], jump: false } }; return ghostMemo.g;
}
// a camera that stays put once the piece is first seen (his Free view): above and behind the piece's middle, the whole piece in view
function stillPose() {
  let pose = null;
  return (shell, panel) => {
    if (pose) return pose;
    const g = realGhost(shell, panel); if (!g) return { eye: [0, 600, 500], target: [0, 0, 1500], up: [0, 1, 0], fov: Math.PI / 3 };
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const m of g.samples) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], m.pos[k]); hi[k] = Math.max(hi[k], m.pos[k]); }
    const c = lo.map((x, k) => (x + hi[k]) / 2), r = Math.max(hi[0] - lo[0], hi[2] - lo[2]);
    pose = { eye: [c[0] - 0.2 * r, 0.9 * r, c[2] - 0.9 * r], target: c, up: [0, 1, 0], fov: Math.PI / 3 }; return pose;
  };
}

async function mount() {
  const { doc, win, tick } = fakeWindow();
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); stage.clientWidth = 1200; stage.clientHeight = 800;
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  shell.extend({ length: 1000, family: 'bowl' });   // his save: the placed 1,000 m straight
  const view = stillPose(); let panel = null;
  doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(panel ? realGhost(shell, panel) : null)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: panel ? view(shell, panel) : null }));
  panel = require('../core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); assert.ok(l, `no "${text}" field`); return l.children[1]; };
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); tick(); };
  const handle = (kind, side) => panel.handles.handles().find((h) => h.kind === kind && h.side === side && h.screen);
  // the HUD's BANK: the piece's bank from its start to its end (labels.js formatReadout, bankToDeg − bankFromDeg)
  const hudBank = () => { const r = shell.candidateReadout(panel.options()); return r.bankToDeg - r.bankFromDeg; };
  // one long drag from a handle, straight down (dir 1) or up (dir −1) the screen, quick (8 px a 4 ms step: the full per-pixel speed), the HUD's bank read at every step
  const longDrag = (h, dir, steps = 300) => {
    const s = h.screen, seen = []; let t = 0;
    stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0, timeStamp: t });
    for (let i = 1; i <= steps; i++) { t += 4; stage.fire('pointermove', { clientX: s.x, clientY: s.y + dir * i * 8, pointerId: 1, timeStamp: t }); tick(); seen.push(hudBank()); }
    stage.fire('pointerup', { clientX: s.x, clientY: s.y + dir * steps * 8, pointerId: 1, timeStamp: t + 4 }); tick();
    return seen;
  };
  // his HUD's piece: 2040.48 m, a +90° corner, cup 15.5, width 31; the bank +65.30, his bank to gravity at the piece's end (the HUD does not say what the first bank was)
  const hisPiece = () => { type('length m', 2040.48); type('turn °', 90); type('cup °', 15.5); type('width m', 31); type('bank °', 65.3); };
  return { shell, panel, field, type, handle, hudBank, longDrag, hisPiece, tick, stage };
}
const dirs = [['down', 0, 1], ['up', 0, -1], ['right', 1, 0], ['left', -1, 0], ['down-right', 0.7, 0.7], ['down-left', -0.7, 0.7], ['up-right', 0.7, -0.7], ['up-left', -0.7, -0.7]];
for (const side of [1, -1]) test(`drag extra bank side ${side}`, async () => {
  const lines = [];
  for (const [name, dx, dy] of dirs) {
    const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 88.45); p.type('cup °', 15.5); p.type('width m', 31);
    const xt = p.panel.extraHandles().find((x) => x.field === 'turn'); p.panel.secondExtra(xt.id, 180); p.tick();
    const h = p.handle('extra:bank:0', side); if (!h) { lines.push(`${name}: no handle`); p.panel.unmount(); continue; }
    const s = h.screen; let t = 0;
    p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0, timeStamp: t });
    for (let i = 1; i <= 40; i++) { t += 4; p.stage.fire('pointermove', { clientX: s.x + dx * i * 8, clientY: s.y + dy * i * 8, pointerId: 1, timeStamp: t }); p.tick(); }
    p.stage.fire('pointerup', { clientX: s.x + dx * 320, clientY: s.y + dy * 320, pointerId: 1, timeStamp: t + 4 }); p.tick();
    const ch = (p.panel.options().changes || {}).phi;
    lines.push(`${name}: ${ch ? ch.map((c) => `from ${c.from} to ${(c.target * 180 / Math.PI).toFixed(1)}`).join(';') : 'no bank change'}`);
    p.panel.unmount();
  }
  console.log(`SIDE ${side} (axis on screen ${JSON.stringify(null)}): ` + lines.join(' | '));
});
for (const side of [1, -1]) test(`compare base and extra side ${side}`, async () => {
  const lines = [];
  for (const kind of ['bank', 'extra:bank:0']) for (const [name, dy] of [['down', 1], ['up', -1]]) {
    const p = await mount(); p.type('length m', 1000); p.type('turn °', -90); p.type('bank °', 88.45); p.type('cup °', 15.5); p.type('width m', 31);
    const xt = p.panel.extraHandles().find((x) => x.field === 'turn'); p.panel.secondExtra(xt.id, 180); p.tick();
    const h = p.handle(kind, side); if (!h) { lines.push(`${kind} ${name}: no handle`); p.panel.unmount(); continue; }
    const s = h.screen; let t = 0;
    p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0, timeStamp: t });
    for (let i = 1; i <= 10; i++) { t += 4; p.stage.fire('pointermove', { clientX: s.x, clientY: s.y + dy * i * 6, pointerId: 1, timeStamp: t }); p.tick(); }
    p.stage.fire('pointerup', { clientX: s.x, clientY: s.y + dy * 60, pointerId: 1, timeStamp: t + 4 }); p.tick();
    const o = p.panel.options(), ch = (o.changes || {}).phi;
    lines.push(`${kind} ${name} 60px: bank ${p.field('bank °').value}${ch ? ` extra ${(ch[0].target * 180 / Math.PI).toFixed(1)}` : ''}`);
    p.panel.unmount();
  }
  console.log(`CMP side ${side}: ` + lines.join(' | '));
});
