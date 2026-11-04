// b-scenarios.test.js (pane B, D235 non-author): the paths A's preview-speed rows do not drive. Copied into a temp copy of the tree at app/test/ and run there.
//   S1 a CANCELLED drag (pointercancel) with a move still waiting: the last position is applied and the drag ends (the panel)
//   S2 an EDIT lands while the full-detail timer is pending: the new edit shows (coarse), the timer re-arms, and when it fires the preview is EXACTLY the full build of
//      the edited track
//   S3 UNDO after a drag, inside the timer: the same, against the undone track
//   S4 UNDO during a drag is refused; the preview stays coarse while the drag is open, and comes back to full after it
//   S5 the change key on a POOL of real segments (several documents, a brush, an undo): two segments get the same key exactly when their JSON is the same
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createCoreShell } = require('../core/coreshell.js');
const { createTrackModel } = require('../preview/trackmodel.js');
const { FACTOR } = require('../preview/coarse.js');
const { keyOf } = require('../preview/segkey.js');
const P = require('../preview/preview.js');

const R = 180, Q = (Math.PI * R) / 2;
async function tubeShell(pieces = 3) {
  const s = await createCoreShell({ brushFn: null });
  s.extend({ length: 200, first: { w: 31, t: 360 } });
  for (let i = 1; i < pieces; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } });
  assert.equal(s.getState().message, null, s.getState().message); return s;
}
const verts = (batches) => batches.reduce((a, b) => a + b.positions.length / 3, 0);
function preview(s) {
  const timers = new Map(); let nextId = 1;
  const win = { devicePixelRatio: 1, document: { hidden: false, activeElement: null, body: {}, addEventListener() {}, removeEventListener() {} }, addEventListener() {}, removeEventListener() {}, requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    setTimeout: (f, ms) => { const id = nextId++; timers.set(id, { f, ms }); return id; }, clearTimeout: (id) => { timers.delete(id); } };
  const gl = new Proxy({ getShaderParameter: () => true, getProgramParameter: () => true, createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), getUniformLocation: (p, n) => n, getAttribLocation: () => 0 }, { get: (t, k) => (k in t ? t[k] : () => {}) });
  const canvas = { clientWidth: 800, clientHeight: 500, width: 0, height: 0, getContext: () => gl, addEventListener() {}, removeEventListener() {} };
  const p = P.createPreview({ canvas, shell: s, win });
  const fire = () => { assert.equal(timers.size, 1, `exactly one timer pending (${timers.size})`); const [[id, t]] = [...timers]; timers.delete(id); t.f(); };
  return { p, timers, fire, detail: () => p.view().detail, vertsNow: () => verts(p.view().track.batches) };
}
const fullOf = (s) => verts(createTrackModel().update(s.getState().resolved).batches);
const drag = (s, d = 0.02) => { s.beginBrush({ mode: 'rate', channel: 'phi', s0: 100, r: 60 }); s.brushTo(d); };

test('S2: an EDIT lands while the full-detail timer is pending: it shows, the timer re-arms, and full detail comes back as the full build of the EDITED track', async () => {
  const s = await tubeShell(), v = preview(s);
  drag(s); s.endBrush(); assert.equal(v.detail(), FACTOR); assert.equal(v.timers.size, 1);
  const before = s.getState().resolved.segments.length; s.extend({ length: 60 }); assert.equal(s.getState().message, null, s.getState().message);
  assert.ok(s.getState().resolved.segments.length > before, 'control: the edit added segments'); assert.equal(v.detail(), FACTOR, 'the edit is drawn coarse for the moment');
  assert.equal(v.p.view().track.segments.length, s.getState().resolved.segments.length, 'the model holds the EDITED track (its real segments)');
  v.fire(); assert.equal(v.detail(), 1, 'full detail is back'); assert.equal(v.vertsNow(), fullOf(s), 'exactly the full build of the edited track'); assert.equal(v.timers.size, 0);
  v.p.dispose();
});

test('S3: UNDO after a drag, inside the timer: full detail comes back as the full build of the UNDONE track', async () => {
  const s = await tubeShell(), v = preview(s), full0 = v.vertsNow();
  drag(s); s.endBrush(); s.undo(); assert.equal(s.getState().message, null, s.getState().message);
  v.fire(); assert.equal(v.detail(), 1); assert.equal(v.vertsNow(), fullOf(s)); assert.equal(v.vertsNow(), full0, 'the undone track is the track before the drag');
  v.p.dispose();
});

test('S4: UNDO during a drag is refused and the preview stays coarse while the drag is open; full detail after it ends', async () => {
  const s = await tubeShell(), v = preview(s);
  drag(s); s.undo(); assert.match(s.getState().message || '', /finish the brush drag first/); assert.ok(s.getState().brush, 'the drag is still open'); assert.equal(v.detail(), FACTOR); assert.equal(v.timers.size, 0, 'nothing scheduled while the drag is open');
  s.endBrush(); v.fire(); assert.equal(v.detail(), 1); assert.equal(v.vertsNow(), fullOf(s));
  v.p.dispose();
});

class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.parent = null; }
  append(...k) { for (const c of k) { if (c == null) continue; const n = typeof c === 'string' ? Object.assign(new El('#text', this.ownerDocument), { _text: c }) : c; n.parent = this; this.children.push(n); } }
  replaceChildren(...k) { for (const c of this.children) c.parent = null; this.children = []; this.append(...k); }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.ownerDocument.ids[v] = this; }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(t) { this._text = String(t); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  addEventListener(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 900, height: 600 }; }
  get isConnected() { return true; }
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
}
test('S1: a CANCELLED drag (pointercancel) with a move still waiting applies that last position and ends the drag', async () => {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) }; doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); }; doc.removeEventListener = () => {}; doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const frames = []; const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } },
    requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} }; doc.defaultView = win;
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); doc.addEventListener('t180-pick', (ev) => ev.detail.reply({ s: 100 }));
  const real = await createCoreShell({ brushFn: null }); real.extend({ length: 300 }); real.extend({ length: 100 });
  const calls = []; const shell = Object.assign(Object.create(real), { brushTo(d) { calls.push(d); return real.brushTo(d); } });
  const root = doc.createElement('div'); require('../core/panel.js').mount(root, shell);
  const by = (label) => root.all().find((e) => e.attrs['aria-label'] === label); by('brush on').checked = true; by('brush mode').value = 'rate'; by('brush channel').value = 'phi';
  const ev = (y) => ({ button: 0, clientX: 10, clientY: y, preventDefault() {} }), at = (type, e) => (stage.listeners[type] || []).forEach((f) => f(e));
  at('pointerdown', ev(300)); assert.ok(real.getState().brush);
  at('pointermove', ev(260)); assert.equal(calls.length, 0, 'waiting for its frame');
  at('pointercancel', ev(260)); assert.deepEqual(calls, [(300 - 260) * 0.002], 'the cancel applied the waiting position'); assert.equal(real.getState().brush, null, 'and ended the drag');
  const f = frames.splice(0); for (const g of f) g(0); assert.equal(calls.length, 1, 'the frame that was pending does nothing afterwards');
});

test('S5: the change key on a pool of REAL segments: same key exactly when the JSON is the same (no collision, no split)', async () => {
  const pool = [];
  const s = await tubeShell(4); pool.push(...s.getState().resolved.segments);
  drag(s, 0.03); s.endBrush(); pool.push(...s.getState().resolved.segments);
  s.undo(); pool.push(...s.getState().resolved.segments);
  const c = await createCoreShell({ brushFn: null }); c.extend({ length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) c.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); pool.push(...c.getState().resolved.segments);
  const h = await createCoreShell({ brushFn: null }); h.extend({ length: 200, family: 'half-pipe', first: { w: 24 } }); h.extend({ length: 150, transition: 60, targets: { kh: 1 / 90, phi: 0.4 } }); pool.push(...h.getState().resolved.segments);
  const byKey = new Map(), byJson = new Map();
  for (const g of pool) { const k = keyOf(g), j = JSON.stringify(g); if (!byKey.has(k)) byKey.set(k, new Set()); byKey.get(k).add(j); if (!byJson.has(j)) byJson.set(j, new Set()); byJson.get(j).add(k); }
  const collisions = [...byKey.values()].filter((x) => x.size > 1).length, splits = [...byJson.values()].filter((x) => x.size > 1).length;
  assert.ok(pool.length > 1000 && byJson.size > 300, `control: a real pool (${pool.length} segments, ${byJson.size} distinct)`);
  assert.equal(collisions, 0, 'no two different segments share a key'); assert.equal(splits, 0, 'no equal segments get different keys'); assert.equal(byKey.size, byJson.size);
  console.log(`# S5 pool ${pool.length} segments, ${byJson.size} distinct by JSON, ${byKey.size} distinct by key`);
});
