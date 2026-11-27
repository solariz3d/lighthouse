// core-second-change-panel.test.js: node --test app/test/core-second-change-panel.test.js
// L139 (the user, 2026-11-05: "We could just build the second move feature before. Remember its more than just the banking, its the turns, climb, etc."; 06:43: "each one
// needs to carry the same color of the original move, but it has be like around somewhere on the piece that makes sense"; 06:49: "what if i want the climb to change more
// than once per piece, the same with turns?"; 06:53: "more and more room keeps getting made inbetween, giving room for the next drag icon to show itself to allow the next
// manipulation"). THE PANEL HALF (pane C; the core is B's, branch l139-second-change). Plan: exo_memory/loop/plan_l139_second_change_every_field_2026-11-05.md and its three
// amendments; E's rows O1–O3: exo_memory/loop/l139_registration_2026-11-05.md (29d95192).
//   - each of turn, climb, bank, width, cup, left and right edge has a list of later changes (then, from, remove), right after its row, off while it has no target;
//   - the options carry changes: { <channel>: [{ from, target }, …] } and, as corners, changes.turnDeg / climbDeg: [{ from, deg }, …] (B's names, 06:5x);
//   - a change is made in the 3D view by dragging an OFFER, one fainter handle per field that shows when the stretch after its last change has room (form (ii):
//     R ≥ 2·SECOND_FLOOR_M, at the middle of R); a mark per change, in the field's handle colour, dragged along the piece to move its from;
//   - every number is the core's (secondMinM, SECOND_FLOOR_M in src/core/extend.js), reaching the panel through the shell (shell.secondMinM, shell.secondFloorM:
//     the panel may not require src/core/extend.js, which pulls node's fs); stubbed ON THE SHELL where a row names it, never copied here.
// The REAL core, with its call observed at the shell (a spy on shell.extend).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createCoreShell } = require('../core/coreshell.js');
const { extendOptions } = require('../core/panel.js');
const ST = require('../core/secondtick.js');
const HD = require('../core/handles.js');
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
  get isConnected() { return false; }
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
  // a pointer event on this element: capture listeners first, then the rest, until one stops it
  fire(type, init) { let stopped = false; const ev = { type, ...init, preventDefault() {}, stopPropagation() { stopped = true; }, stopImmediatePropagation() { stopped = true; } };
    const ls = (this.listeners[type] || []).slice(), order = ls.filter((l) => l.capture).concat(ls.filter((l) => !l.capture));
    for (const l of order) { if (stopped) break; l.f(ev); } }
}
function fakeWindow() {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  const win = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } },
    requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} };
  doc.defaultView = win;
  return { doc, win };
}
async function mountPanel() {
  const { doc, win } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  const calls = [], real = shell.extend; shell.extend = (o) => { calls.push(o); return real(o); };
  const panel = require('../core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); assert.ok(l, `the panel has no "${text}" field`); return l.children[1]; };
  const byAria = (a) => { const f = root.all().find((e) => e.attrs && e.attrs['aria-label'] === a); assert.ok(f, `no element labelled "${a}"`); return f; };
  const has = (a) => !!root.all().find((e) => e.attrs && e.attrs['aria-label'] === a);
  const set = (f, v) => { f.value = String(v); f.oninput(); };
  const type = (text, v) => set(field(text), v);
  // AMENDED (L140, pane C): the rows are named as their handles are labelled, "extra bank" ("extra bank 2" for the second), the user's word (10:15Z "it adds something called extra turn")
  const nm = (k, i = 1) => `extra ${k}${i > 1 ? ` ${i}` : ''}`;
  const thn = (k, i = 1) => byAria(nm(k, i)), from = (k, i = 1) => byAria(`${nm(k, i)} from`);
  // (thn, not then: an object with a then is a thenable, and await mountPanel() would call it)
  // a change as the offer's drag makes it (panel.secondAdd is what secondOffer calls on a drag's first movement)
  const add = (k, then = '', from = '', share = null) => panel.secondAdd(KEY[k], { then: String(then), from: String(from), share });
  const turnAs = root.all().find((e) => e.tagName === 'SELECT' && e.attrs['aria-label'] === 'turn and climb as');
  const button = (text) => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === text);
  type('length m', 100);
  return { doc, win, root, shell, panel, label, field, byAria, has, set, type, nm, thn, from, add, turnAs, calls, extend: () => button('Extend').onclick(), opts: () => panel.options() };
}
const KEY = { turn: 'turn', climb: 'climb', bank: 'bank', width: 'width', cup: 'cup', 'left edge': 'edge', 'right edge': 'edgeR' };
const near = (a, b, tol, what) => assert.ok(Math.abs(a - b) <= tol, `${what}: ${a}, not ${b} (±${tol})`);
const FIELDS = [['turn', 'turn °'], ['climb', 'climb °'], ['bank', 'bank °'], ['width', 'width m'], ['cup', 'cup °'], ['left edge', 'left edge °'], ['right edge', 'right edge °']];
// the core's numbers, stubbed on the SHELL where the panel reads them (shell.secondMinM, shell.secondFloorM: B's exports passed through), and put back after
// AMENDED 2026-11-10 (the bank's default marks are first clamped by its fit floor, shell.bankFitFloorM, and fall back to the minimum when the core refuses them as built): a
// SCRATCH (pane C, not committed, removed after): an AMOUNT drag of change 1 under a moving first ramp with change 2 at a typed mark, to see whether the fit check's end
// (panel.js:1412, N15) decides where the drag holds the amount, and whether that amount then lays
test('C scratch: amount drag of change 1 (from 120, then −90 at 200) toward −95 on a 0 → −80 ramp', async () => {
  const p = await mountPanel();
  p.turnAs.value = 'rate'; p.turnAs.onchange();
  p.type('length m', 200); p.type('turn °/100m', 0); p.extend();
  const n = p.shell.getState().history.present.pieces.length;
  p.type('length m', 300); p.type('turn °/100m', -80); p.add('turn', -85, '120'); p.add('turn', -90, '200');
  const hs = p.panel.extraHandles(), x = hs.find((e) => e.field === 'turn' && !e.unused);
  console.log('HANDLES', JSON.stringify(hs.map((e) => ({ id: e.id, field: e.field, unused: e.unused, from: e.from }))));
  for (const v of [-88, -91, -93, -95]) p.panel.secondExtra(x.id, v);
  const held = p.thn('turn', 1).value; p.extend();
  const laid = p.shell.getState().history.present.pieces.length === n + 1;
  console.log('RESULT held', held, 'laid', laid, laid ? '' : JSON.stringify(p.calls.length));
});
