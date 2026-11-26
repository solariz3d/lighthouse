// c-l241-read.test.js (pane C, L241 second read): rows of my own over the builder tree named by env T180 (A's l241-declutter 77ffe18, or cfa7ad9 for the base rows).
// Run: T180=C:/Consonance/t180-wt-declutter node --test c-l241-read.test.js
// The fake DOM (El, fakeWindow) and the canvas stub are copied from A's app/test/core-mark-labels.test.js; the layer below is mine (any marks, a ghost that can go and come back,
// any camera pose, a yields hook, a drag-start recorder).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const R = path.resolve(process.env.T180 || 'C:/Consonance/t180-wt-declutter');
const ST = require(R + '/app/core/secondtick.js');
const HD = require(R + '/app/core/handles.js');
const DOTS = /DOT_PX/.test(require('fs').readFileSync(R + '/app/core/secondtick.js', 'utf8'));   // true at 77ffe18, false at cfa7ad9

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
  get isConnected() { return false; }
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
  fire(type, init) { let stopped = false; const ev = { type, button: 0, ...init, preventDefault() {}, stopPropagation() { stopped = true; }, stopImmediatePropagation() { stopped = true; } };
    const ls = (this.listeners[type] || []).slice(), order = ls.filter((l) => l.capture).concat(ls.filter((l) => !l.capture));
    for (const l of order) { if (stopped) break; l.f(ev); } }
}
function fakeWindow() {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} };
  doc.defaultView = win;
  return { doc, win };
}
function stubCtx() {
  const rec = { rects: [], texts: [], arcs: [] };
  return new Proxy({ rec }, { get: (t, k) => {
    if (k in t) return t[k];
    if (k === 'measureText') return (s) => ({ width: String(s).length * 7 });
    if (k === 'clearRect') return () => { rec.rects = []; rec.texts = []; rec.arcs = []; };
    if (k === 'arc') return (x, y, r) => rec.arcs.push({ x, y, r });
    if (k === 'fillRect') return (x, y, w, h) => rec.rects.push({ x, y, w, h });
    if (k === 'fillText') return (s, x, y) => rec.texts.push({ s: String(s), x, y });
    return () => {};
  }, set: () => true });
}
// the cameras: OVERHEAD (straight above, A's pose) and a low BUILD-like oblique, behind and above the piece's start, looking down the road
const POSES = {
  overhead: { eye: [0, 700, 500], target: [0, 0, 500], up: [0, 0, 1], fov: Math.PI / 3 },
  build: { eye: [0, 60, 220], target: [0, 0, 520], up: [0, 1, 0], fov: Math.PI / 3 },
};
const NAMES = { bank: 'Extra bank', turn: 'Extra turn', climb: 'Extra climb' };
const mk = (field, index, from, to = 1000, label = true) => ({ field, index, from, to, half: 15, halfTo: 15, label: label && NAMES[field] ? ST.markText(field, index, from, to, 1000) : null, lit: false, ...ST.styleOf(field) });
function layer({ marks, pose = POSES.overhead, yields = null } = {}) {
  const { doc, win } = fakeWindow(); const stage = doc.createElement('div'); stage.clientWidth = 900; stage.clientHeight = 600; stage.style = {};
  const ctx = stubCtx(); const create = doc.createElement; doc.createElement = (t) => { const e = create(t); if (t === 'canvas') e.getContext = () => ctx; return e; };
  const samples = []; for (let s = 0; s <= 1000; s += 2) samples.push({ s, pos: [0, 0, s], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] });
  const ghost = { samples, s0: 0, jump: false }, G = { on: true };
  doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(G.on ? ghost : null)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose }));
  const S = { marks: marks.slice() }, starts = [];
  const L = ST.mount(stage, win, () => ({ marks: S.marks, offers: [] }), { onMarkDrag: () => {}, onDragStart: (it) => starts.push(`${it.field}:${it.index}`), ...(yields ? { yields } : {}) });
  L.drawNow();
  const labels = () => ctx.rec.texts.map((t) => t.s).filter((s) => /^Extra /.test(s)).map((s) => s.split(' · ')[0] + ' @' + (s.split(' · ')[1] || '').split(' ')[0]);
  const dot = (i) => { const st = L.marks()[i].strokes[0]; return { x: (st.a.x + st.b.x) / 2, y: (st.a.y + st.b.y) / 2 }; };
  return { stage, L, S, G, ctx, labels, dot, starts, arcs: () => ctx.rec.arcs.length };
}

test('V1: climb, width and cup marks rest as one dot each with no label, and a hover shows the hovered one only', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('climb', 0, 300), mk('width', 0, 500, 1000, false), mk('cup', 0, 700, 1000, false)] });
  assert.equal(A.arcs(), 3, 'three dots'); assert.deepEqual(A.labels(), [], 'no labels');
  for (const i of [0, 1, 2]) {
    const p = A.dot(i); A.stage.fire('pointermove', { clientX: p.x, clientY: p.y, pointerId: 1 }); A.L.drawNow();
    assert.equal(A.arcs(), 2, `mark ${i} hovered: it is drawn as strokes, the other two stay dots`);
  }
  const p0 = A.dot(0); A.stage.fire('pointermove', { clientX: p0.x, clientY: p0.y, pointerId: 1 }); A.L.drawNow();
  assert.deepEqual(A.labels(), ['Extra climb @300.00'], 'the climb\'s label, alone');
  A.L.unmount();
});

test('V2: a mark added in the MIDDLE of a field (the later one shifts index) flashes the new one, not the shifted one', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 300, 700), mk('bank', 1, 700)] });
  assert.deepEqual(A.labels(), []);
  A.S.marks = [mk('bank', 0, 300, 500), mk('bank', 1, 500, 700), mk('bank', 2, 700)]; A.L.drawNow();
  assert.deepEqual(A.labels(), ['Extra bank 2 @500.00'], 'only the new mark at 500 m is labelled');
  A.L.unmount();
});

test('V3: two marks added at once in one field flash none (by design); one added in each of two fields flashes both', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 300)] });
  A.S.marks = [mk('bank', 0, 300, 500), mk('bank', 1, 500, 700), mk('bank', 2, 700)]; A.L.drawNow();
  assert.deepEqual(A.labels(), [], 'two at once in one field: none');
  const B = layer({ marks: [mk('bank', 0, 300), mk('turn', 0, 300)] });
  B.S.marks = [mk('bank', 0, 300, 600), mk('bank', 1, 600), mk('turn', 0, 300, 800), mk('turn', 1, 800)]; B.L.drawNow();
  assert.deepEqual(B.labels().sort(), ['Extra bank 2 @600.00', 'Extra turn 2 @800.00'], 'one in each field: both');
  A.L.unmount(); B.L.unmount();
});

test('V4: the ghost goes and comes back with the same marks: nothing was added, so no label shows', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 400), mk('turn', 0, 300), mk('turn', 1, 600)] });
  assert.deepEqual(A.labels(), [], 'at rest');
  A.G.on = false; A.L.drawNow(); A.G.on = true; A.L.drawNow();
  assert.deepEqual(A.labels(), [], 'the ghost came back with the same three marks; none was added');
});

test('V5: a press that the handles take (yields) starts no mark drag, and the hover a moment before does not either', () => {
  const A = layer({ marks: [mk('bank', 0, 400)], yields: () => true }), p = A.dot(0);
  A.stage.fire('pointermove', { clientX: p.x, clientY: p.y, pointerId: 1 });
  A.stage.fire('pointerdown', { clientX: p.x, clientY: p.y, pointerId: 1 });
  assert.deepEqual(A.starts, [], 'the handle has it');
  A.L.unmount();
});

test('V6 (a record): while a field handle is dragged (the press yielded), the pointer crossing a dot lights that mark', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 400), mk('bank', 1, 700)], yields: () => true }), far = { x: 5, y: 5 }, p = A.dot(1);
  A.stage.fire('pointerdown', { clientX: far.x, clientY: far.y, pointerId: 1 });
  A.stage.fire('pointermove', { clientX: p.x, clientY: p.y, pointerId: 1 }); A.L.drawNow();
  console.log(`V6 labels while a handle drag crosses mark 2: ${JSON.stringify(A.labels())}`);
  A.L.unmount();
});

test('V7: a touch press on a dot and a drag: labelled while dragged, and after the lift the mark rests as a dot again', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 400)] }), p = A.dot(0);
  A.stage.fire('pointerdown', { clientX: p.x, clientY: p.y, pointerId: 7, pointerType: 'touch' });
  A.stage.fire('pointermove', { clientX: p.x + 3, clientY: p.y - 40, pointerId: 7, pointerType: 'touch' });
  assert.equal(A.labels().length, 1, 'labelled mid-drag');
  A.stage.fire('pointerup', { clientX: p.x + 3, clientY: p.y - 40, pointerId: 7, pointerType: 'touch' }); A.L.drawNow();
  assert.deepEqual(A.labels(), [], 'after the lift (no hover for a finger), no label');
  assert.equal(A.arcs(), 1, 'a dot again');
  A.L.unmount();
});

test('V8 (a record): the pointer leaves the stage from on top of a dot (no event after it): is the mark still shown?', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 400)] }), p = A.dot(0);
  A.stage.fire('pointermove', { clientX: p.x, clientY: p.y, pointerId: 1 }); A.L.drawNow();
  console.log(`V8 labels after leaving from the dot: ${JSON.stringify(A.labels())}`);
  A.L.unmount();
});

test('V9: the Build camera: each dot sits on its mark\'s stroke and a press on it starts that mark\'s drag', { skip: !DOTS }, () => {
  const A = layer({ marks: [mk('bank', 0, 400), mk('turn', 0, 600)], pose: POSES.build });
  assert.equal(A.arcs(), 2, 'two dots under the Build camera');
  for (const [i, key] of [[0, 'bank:0'], [1, 'turn:0']]) {
    const p = A.dot(i), arc = A.ctx.rec.arcs[i]; assert.ok(Math.hypot(arc.x - p.x, arc.y - p.y) < 1e-6, 'the dot is the stroke\'s centre');
    A.stage.fire('pointerdown', { clientX: p.x, clientY: p.y, pointerId: 1 }); A.stage.fire('pointerup', { clientX: p.x, clientY: p.y, pointerId: 1 });
    assert.equal(A.starts.at(-1), key);
  }
  A.L.unmount();
});

// V10 (L241 re-run, the librarian's catch at 36d2d31): the flash list is pruned of spent flashes. The list is private to mount(), so its length is read where the
// layer reads it: shownNow's `flashes.some(...)`, which runs for every resting mark on every draw. A spy on Array.prototype.some notes the length of any array whose
// items are flash records ({ field, from, until }); it is put back in `finally`. Fifty marks are added to one field one at a time, each FLASH_MS + 1 s after the last.
test('V10: fifty marks added one at a time, 3 s apart: the flash list holds only the live flash, not every flash ever made', { skip: !DOTS }, () => {
  const realNow = Date.now, realSome = Array.prototype.some; let t = 1e12, seen = 0;
  Date.now = () => t;
  Array.prototype.some = function (...a) { if (this.length && this[0] && typeof this[0] === 'object' && 'until' in this[0] && 'field' in this[0]) seen = Math.max(seen, this.length); return realSome.apply(this, a); };
  try {
    const marksOf = (n) => Array.from({ length: n }, (_, i) => mk('bank', i, 10 + 15 * i, i + 1 < n ? 10 + 15 * (i + 1) : 1000));
    const A = layer({ marks: marksOf(1) });
    for (let n = 2; n <= 51; n++) { t += 3000; A.S.marks = marksOf(n); A.L.drawNow(); }
    t += 3000; A.L.drawNow();   // a last draw with every flash spent
    A.L.unmount();
    assert.ok(seen <= 1, `the flash list reached ${seen} records over 50 adds 3 s apart (each spent 1 s before the next); a pruned list holds at most 1`);
  } finally { Date.now = realNow; Array.prototype.some = realSome; }
});

// item 2 of the order, on BOTH trees: which presses start which mark's drag, over a grid around the marks, with and without a handle's reach over one of them
test('P (a record on both trees): the press map', () => {
  const out = [];
  for (const [cam, pose] of Object.entries(POSES)) {
    const probe = layer({ marks: [mk('bank', 0, 400), mk('turn', 0, 600), mk('climb', 0, 800)], pose });
    const centres = probe.L.marks().map((d) => d.strokes[0]); probe.L.unmount();
    // the handle's reach: 18 px around the first mark's first stroke centre (a field handle drawn over the bank mark)
    const c0 = { x: (centres[0].a.x + centres[0].b.x) / 2, y: (centres[0].a.y + centres[0].b.y) / 2 };
    for (const withHandle of [false, true]) {
      const map = [];
      for (let x = 0; x <= 900; x += 3) for (let y = 0; y <= 600; y += 3) {
        const A = layer({ marks: [mk('bank', 0, 400), mk('turn', 0, 600), mk('climb', 0, 800)], pose, yields: withHandle ? (p) => Math.hypot(p.x - c0.x, p.y - c0.y) <= 18 : null });
        A.stage.fire('pointerdown', { clientX: x, clientY: y, pointerId: 1 });
        if (A.starts.length) map.push(`${x},${y}=${A.starts[0]}`);
        A.L.unmount();
      }
      out.push(`${cam} handle=${withHandle} presses=${map.length} hash=${require('crypto').createHash('sha256').update(map.join(';')).digest('hex').slice(0, 16)}`);
    }
  }
  console.log('P ' + path.basename(R) + ' ' + out.join(' | '));
});
