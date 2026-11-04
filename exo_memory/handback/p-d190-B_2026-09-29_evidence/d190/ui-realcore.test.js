// ui-realcore.test.js (pane B, D190): C's panel against A's REAL core, NO stub (C's own cup tests wrap the core in stubCup, which removes
// targets.c before the core sees it, so they cannot show the wiring works). The fake DOM below is C's, copied verbatim from
// app/test/core-readout-display.test.js lines 13-57, requires re-pointed at WT. Everything asserted is compared to the REAL core's numbers.
'use strict';
const path = require('path'), WT = process.env.WT;
const test = require('node:test'), assert = require('node:assert/strict');
const LB = require(path.join(WT, 'app/core/labels.js')), { createCoreShell } = require(path.join(WT, 'app/core/coreshell.js')), { extendOptions } = require(path.join(WT, 'app/core/panel.js'));
const D = require(path.join(WT, 'src/core/document.js'));

// ── a small fake DOM: enough for the panel and the label layer ──
class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.parent = null; }
  append(...k) { for (const c of k) { if (c == null) continue; const n = typeof c === 'string' ? Object.assign(new El('#text', this.ownerDocument), { _text: c }) : c; n.parent = this; this.children.push(n); } }
  replaceChildren(...k) { for (const c of this.children) c.parent = null; this.children = []; this.append(...k); }   // the removed are out of the page
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.ownerDocument.ids[v] = this; }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(t) { this._text = String(t); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  addEventListener(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth || 0, height: this.clientHeight || 0 }; }
  // as a browser: an element not in the page measures 0 (found in the real window, L130: the preview's mount cleared #preview)
  get isConnected() { let e = this; while (e.parent) e = e.parent; return !!e.isRoot; }
  get offsetWidth() { if (!this.isConnected) return 0; return 9 * Math.max(...this.textContent.split('\n').map((l) => l.length)) + 16; }   // 9 px a character
  get offsetHeight() { if (!this.isConnected) return 0; return 20 * this.textContent.split('\n').length + 8; }
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
}
function fakeWindow() {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const frames = [];
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } },
    requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => {}, setTimeout: (f) => 0, clearTimeout: () => {}, frames };
  doc.defaultView = win;
  return { doc, win, tick: () => { const fs = frames.splice(0); for (const f of fs) f(0); } };
}
async function mountPanel(wrap = (s) => s) {
  const { doc, win, tick } = fakeWindow();
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); stage.clientWidth = 900; stage.clientHeight = 600; stage.isRoot = true;
  const root = doc.createElement('div'), shell = wrap(await createCoreShell({ brushFn: null }));
  const panel = require(path.join(WT, 'app/core/panel.js')).mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => label(text).children[1];
  const cell = (k) => root.all().find((e) => e.attrs['data-readout'] === k).textContent;
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); };
  const opts = () => extendOptions({ length: field('length m').value, turn: field('turn °/100m').value, climb: field('climb °/100m').value, bank: field('bank °').value, width: field('width m').value, cup: label('cup °') ? field('cup °').value : '' });
  return { doc, win, tick, stage, root, shell, panel, label, field, cell, type, opts };
}

const fmt = (x) => LB.fmtDeg(x).replace('+', '');
test('real core: a legacy track reads its RENDERED edge; typing cup 90 shows the document (with its ringing), not the typed 90', async () => {
  const P = await mountPanel();
  P.shell.extend({ length: 200 }); P.type('length m', 100);
  const r0 = P.shell.candidateReadout(P.opts());
  assert.equal(P.cell('cup'), `${fmt(r0.cupFromDeg)} → ${fmt(r0.cupToDeg)}`);
  P.type('cup °', 90);
  const r1 = P.shell.candidateReadout(P.opts());
  console.log('UI legacy', P.cell('cup'), JSON.stringify({ from: r0.cupFromDeg, to: r0.cupToDeg }), 'cup90', JSON.stringify({ from: r1.cupFromDeg, to: r1.cupToDeg }), P.cell('cup'));
  assert.equal(P.cell('cup'), `${fmt(r1.cupFromDeg)} → ${fmt(r1.cupToDeg)}`, 'the cell is the core readout, rounded as bank');
  assert.ok(Math.abs(r1.cupFromDeg - r0.cupToDeg) < 1e-9, 'the cup starts at the legacy road\'s rendered edge');
  P.panel.unmount();
});
test('real core: Extend with cup 60 places a CUP piece whose readout equals the ghost the panel showed', async () => {
  const P = await mountPanel();
  P.shell.extend({ length: 200 }); P.type('length m', 150); P.type('cup °', 60);
  const ghost = P.cell('cup'), cand = P.shell.candidateReadout(P.opts());
  P.root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick();
  const doc = P.shell.getState().history.present, last = doc.pieces[doc.pieces.length - 1], placed = P.shell.pieceReadouts()[doc.pieces.length - 1];
  console.log('UI placed', JSON.stringify({ cup: last.cup, cTo: D.channelAt(last, 'c', last.length).v, placedTo: placed.cupToDeg, ghost }));
  assert.equal(last.cup, true); assert.equal(placed.cupToDeg, cand.cupToDeg); assert.equal(placed.cupFromDeg, cand.cupFromDeg);
  assert.equal(ghost, `${fmt(placed.cupFromDeg)} → ${fmt(placed.cupToDeg)}`);
  P.panel.unmount();
});
test('real core: a cup of 200 is refused by the CORE by name: the cell reads — and the box title carries the core\'s own reason', async () => {
  const P = await mountPanel();
  P.shell.extend({ length: 200 }); P.type('length m', 100); P.type('cup °', 200);
  const box = P.root.all().find((e) => e.attrs.class === 'readout');
  console.log('UI refused', P.cell('cup'), JSON.stringify(box.title));
  assert.equal(P.cell('cup'), '—'); assert.match(box.title, /cup/i); assert.match(box.title, /150/);
  P.panel.unmount();
});
test('real core: the brush on channel c (value mode) is accepted on a cup piece and refused NOT_CUP on a legacy one', async () => {
  const SC = require(path.join(WT, 'src/core/sculpt.js')), { extend } = require(path.join(WT, 'src/core/extend.js'));
  const legacy = extend(D.createDoc('l'), { length: 200 }), cup = extend(legacy, { length: 200, targets: { c: 70 } });
  let a = null, b = null; try { a = SC.brush(cup, { mode: 'value', channel: 'c', s0: 320, r: 40, delta: -5 }); } catch (e) { a = e.code; }
  try { b = SC.brush(legacy, { mode: 'value', channel: 'c', s0: 100, r: 40, delta: 5 }); } catch (e) { b = e.code; }
  console.log('UI brush', typeof a === 'object' ? 'accepted' : a, b);
  assert.equal(typeof a, 'object'); assert.equal(b, 'NOT_CUP');
});
