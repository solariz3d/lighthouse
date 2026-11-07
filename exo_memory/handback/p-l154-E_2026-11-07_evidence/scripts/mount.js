// edrive.js (pane E, L140 review of C's extra handles): drive G1–G10 (B's list, exo_memory/handback/p-l140-glitches-B_2026-11-05.md) on a tree, through the REAL panel,
// handles and change layer mounted on a fake #preview stage, with presses fired at the screen points the handles report. Read-only on the tree.
//   node edrive.js <tree>
// The fake window/element are C's test harness's shape (app/test/core-second-change-panel.test.js), as B's drive.js used; the scenarios and assertions are mine.
// Each G prints { expected, actual, pass }. Positions: each handle's station share (s / L) against his drawing (exo_memory/briefs/t180_extra_handles_where_2026-11-05.png,
// read by me: extra bank 0.60 top edge, extra climb 0.74 centre, extra turn 0.89 top edge, extra width 0.11 bottom edge), and every pair of handles on screen against the hit radius.
'use strict';
const path = require('path'), W = path.resolve(process.argv[2]);

const { createCoreShell } = require(path.join(W, 'app/core/coreshell.js'));
const HD = require(path.join(W, 'app/core/handles.js'));
const TB = require(path.join(W, 'src/core/turnby.js'));
const DEG = Math.PI / 180;

class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.parent = null; this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } }; }
  append(...k) { for (const c of k) { if (c == null) continue; const n = typeof c === 'string' ? Object.assign(new El('#text', this.ownerDocument), { _text: c }) : c; n.parent = this; this.children.push(n); } }
  appendChild(c) { this.append(c); return c; }
  replaceChildren(...k) { for (const c of this.children) c.parent = null; this.children = []; this.append(...k); }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.ownerDocument.ids[v] = this; }
  getAttribute(k) { return this.attrs[k]; }
  removeAttribute(k) { delete this.attrs[k]; }
  set textContent(t) { this._text = String(t); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  addEventListener(e, f, o) { (this.listeners[e] = this.listeners[e] || []).push({ f, capture: !!(o === true || (o && o.capture)) }); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x.f !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth || 0, height: this.clientHeight || 0 }; }
  get isConnected() { return true; }
  setPointerCapture() {} releasePointerCapture() {}
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
  fire(type, init) { let stopped = false; const ev = { type, ...init, preventDefault() {}, stopPropagation() { stopped = true; }, stopImmediatePropagation() { stopped = true; } };
    const ls = (this.listeners[type] || []).slice(), order = ls.filter((l) => l.capture).concat(ls.filter((l) => !l.capture));
    for (const l of order) { if (stopped) break; l.f(ev); } }
}
function fakeWindow() {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc), createElementNS: (ns, t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const frames = []; let now = 0;
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } },
    requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {}, performance: { now: () => now } };
  doc.defaultView = win;
  return { doc, win, tick: () => { for (let i = 0; i < 3; i++) { const fs = frames.splice(0); for (const f of fs) f(now); } }, advance: (ms) => { now += ms; } };
}
const ghostOf = (L) => { const s0 = 1000, samples = []; for (let s = s0; s <= s0 + L + 1e-9; s += 2) samples.push({ s, pos: [0, 0, s], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] }); return { s0, samples, segments: [], jump: false }; };
const POSE = (L) => ({ eye: [0, 0.6 * L, 1000 - 0.25 * L], target: [0, 0, 1000 + 0.5 * L], up: [0, 1, 0], fov: Math.PI / 3 });

async function mount(L0 = 1000, prefixDoc = null) {
  const { doc, win, tick, advance } = fakeWindow();
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); stage.clientWidth = 1200; stage.clientHeight = 800;
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  if (prefixDoc) { for (const P of prefixDoc.pieces) shell.extend({ length: P.length, family: P.family }); } else shell.extend({ length: 1000, family: 'bowl' });
  let L = L0; doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(ghostOf(L))); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: POSE(L) }));
  const panel = require(path.join(W, 'app/core/panel.js')).mount(root, shell);
  const labels = () => root.all().filter((e) => e.tagName === 'LABEL' && e.children[0]);
  const field = (text) => { const base = text.replace(/ °$/, ''), l = labels().find((e) => e.children[0].textContent === text) || (['turn','climb'].includes(base) ? labels().find((e) => new RegExp('^' + base + ' °').test(e.children[0].textContent)) : null); return l ? l.children.find((c) => c.tagName === 'INPUT' || c.tagName === 'SELECT') || l.children[1] : null; };
  const type = (text, v) => { const f = field(text); if (!f) throw new Error(`no field "${text}" (have: ${labels().map((e) => e.children[0].textContent).join(' | ')})`); f.value = String(v); (f.oninput || f.onchange || (() => {}))(); if (text === 'length m') L = Number(v); tick(); };
  const hs = () => panel.handles.handles().filter((h) => h.screen);
  const handle = (kind, side) => hs().find((h) => h.kind === kind && (side === undefined || h.side === side));
  const changes = () => JSON.stringify(panel.options().changes || {});
  const refusal = () => { try { TB.extendCorner(shell.getState().history.present, panel.options()); return null; } catch (e) { return `${e.code}: ${String(e.message).slice(0, 200)}`; } };
  // a drag at hand speed (the handles scrub at 0.01 a pixel when the pointer is slow: handles.js scrubGain), in 4 px steps, 8 ms apart
  const drag = (x, y, dx, dy, id = 1, moved = true) => {
    stage.fire('pointerdown', { clientX: x, clientY: y, pointerId: id, button: 0, buttons: 1 }); tick();
    if (moved) { const n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4)); for (let k = 1; k <= n; k++) { advance(8); stage.fire('pointermove', { clientX: x + (dx * k) / n, clientY: y + (dy * k) / n, pointerId: id, buttons: 1 }); tick(); } }
    advance(8); stage.fire('pointerup', { clientX: x + (moved ? dx : 0), clientY: y + (moved ? dy : 0), pointerId: id, button: 0 }); tick();
  };
  const setTurnAs = (w) => { const lab = labels().find((e) => /^turn & climb as/.test(e.children[0].textContent)), ta = (lab && lab.all().find((e) => e.tagName === 'SELECT')) || root.all().find((e) => e.tagName === 'SELECT' && /turn and climb as/.test(e.attrs['aria-label'] || '')); if (ta) { ta.value = w; ta.onchange(); tick(); } };
  return { doc, stage, root, shell, panel, field, type, hs, handle, changes, refusal, drag, tick, setTurnAs, L: () => L, labelsText: () => labels().map((e) => e.children[0].textContent) };
}
const pt = (h) => (h && h.screen ? { x: h.screen.x, y: h.screen.y } : null);
const dist = (a, b) => (a && b ? Math.hypot(a.x - b.x, a.y - b.y) : Infinity);
const isExtra = (h) => /^extra:/.test(h.kind);
const out = {}, verdict = {};
const row = (g, expected, actual, pass) => { out[g] = { expected, actual, pass }; verdict[g] = pass; };


module.exports = { mount, pt, dist, W };
