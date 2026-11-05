// core-extra-handles-glitches.test.js: node --test app/test/core-extra-handles-glitches.test.js
// L140 (pane C): one row per glitch in B's list (exo_memory/handback/p-l140-glitches-B_2026-11-05.md, lighthouse 07881179), the L139 UI as the user drove it on 35feaf9
// ("broken … glitchy and non intuitive", 10:06Z). Each row is B's repro, through the REAL core shell, panel, handles and change layer on a fake #preview stage; the harness is
// B's drive.js (its fake window with frames run by hand, a straight ghost of the typed length from s0 = 1000 seen from above and behind), as B drove it.
// A change "made from its handle" goes through the extra handle where the panel has one (L140), else through the offer the L139 panel had: the same act, the user's way in.
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
const ghostOf = (L) => { const s0 = 1000, samples = []; for (let s = s0; s <= s0 + L + 1e-9; s += 2) samples.push({ s, pos: [0, 0, s], T: [0, 0, 1], L: [1, 0, 0], U: [0, 1, 0] }); return { s0, samples, segments: [], jump: false }; };
const POSE = (L) => ({ eye: [0, 0.6 * L, 1000 - 0.25 * L], target: [0, 0, 1000 + 0.5 * L], up: [0, 1, 0], fov: Math.PI / 3 });

async function mount({ pose = POSE } = {}) {
  const { doc, win, tick } = fakeWindow();
  const stage = doc.createElement('div'); stage.setAttribute('id', 'preview'); stage.clientWidth = 1200; stage.clientHeight = 800;
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  shell.extend({ length: 1000, family: 'bowl' });   // his first piece: a 1,000 m straight
  let L = 1000; doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(realGhost(shell, panel))); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: realPose(shell, panel) }));
  const panel = require('../core/panel.js').mount(root, shell);
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
const A = require('../../src/core/adapter.js');
let gc = null;
function realGhost(shell, panel) {
  const o = panel.options(), key = JSON.stringify(o) + shell.getState().history.present.pieces.length;
  if (gc && gc.key === key) return gc.g;
  let dc; try { dc = TB.extendCorner(shell.getState().history.present, o); } catch (e) { return null; }
  const S = A.toPath(dc, { step: 2 }).path.samples.filter((m) => m.s >= 1000 - 1e-9).map((m) => ({ s: m.s, pos: [...m.pos], T: [...m.T], L: [...m.L], U: [...m.U] }));
  gc = { key, g: { s0: 1000, samples: S, segments: [], jump: false } }; return gc.g;
}
function realPose(shell, panel) {
  const g = realGhost(shell, panel); if (!g) return { eye: [0, 600, 500], target: [0, 0, 1500], up: [0, 1, 0], fov: Math.PI / 3 };
  if (!realPose.p) { const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (const m of g.samples) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], m.pos[k]); hi[k] = Math.max(hi[k], m.pos[k]); }
    const c = lo.map((x, k) => (x + hi[k]) / 2), r = Math.max(hi[0] - lo[0], hi[2] - lo[2]);
    realPose.p = { eye: [c[0] - 0.2 * r, 0.9 * r, c[2] - 0.9 * r], target: c, up: [0, 1, 0], fov: Math.PI / 3 }; }
  return realPose.p;
}
function foldOf(shell, o) {
  let dc; try { dc = TB.extendCorner(shell.getState().history.present, o); } catch (e) { return `REFUSED ${e.code}: ${e.message.slice(0, 140)}`; }
  const S = A.toPath(dc, { step: 2 }).path.samples.filter((m) => m.s >= 1000);
  let worstU = 0, atU = 0, rev = 0, atRev = null; const h = 15.5;
  for (let i = 1; i < S.length; i++) {
    const a = S[i - 1], b = S[i], dU = Math.acos(Math.max(-1, Math.min(1, a.U[0] * b.U[0] + a.U[1] * b.U[1] + a.U[2] * b.U[2]))) * 180 / Math.PI;
    if (dU > worstU) { worstU = dU; atU = b.s; }
    for (const sg of [1, -1]) { const d = [0, 1, 2].map((k) => (b.pos[k] + sg * h * b.L[k]) - (a.pos[k] + sg * h * a.L[k])); if (d[0] * b.T[0] + d[1] * b.T[1] + d[2] * b.T[2] <= 0) { rev++; if (atRev === null) atRev = b.s; } }
  }
  const Pc = dc.pieces[dc.pieces.length - 1];
  return `worst U step ${worstU.toFixed(2)}°/2m at s ${atU.toFixed(0)}; edge reversals ${rev}${atRev !== null ? ` first at s ${atRev.toFixed(0)}` : ''}; piece len ${Pc.length}`;
}
const RD = (p) => { const r = p.shell.candidateReadout(p.panel.options()); return (r.bankToDeg - r.bankFromDeg).toFixed(1); };
for (const [kind, B, dir] of [['bank', 65.3, 1], ['bank', 65.3, -1], ['extra:bank:0', 65.3, 1], ['extra:bank:0', 65.3, -1]]) test(`fast drag ${kind} B=${B} dir=${dir}`, async () => {
  realPose.p = null; gc = null;
  const p = await mount(); p.type('length m', 2040.48); p.type('turn °', 90); p.type('cup °', 15.5); p.type('width m', 31); p.type('bank °', B); p.tick();
  const h = p.panel.handles.handles().find((x) => x.kind === kind && x.side === 1 && x.screen); if (!h) { console.log(kind, 'no handle'); return; }
  const s = h.screen; p.stage.fire('pointerdown', { clientX: s.x, clientY: s.y, pointerId: 1, button: 0, timeStamp: 0 });
  const out = []; let t = 0;
  for (let i = 1; i <= 300; i++) { t += 4; p.stage.fire('pointermove', { clientX: s.x, clientY: s.y + dir * i * 8, pointerId: 1, timeStamp: t }); p.tick(); if (i % 20 === 0) out.push(`${i * 8}:${RD(p)}/${p.field('bank °').value}`); }
  p.stage.fire('pointerup', { clientX: s.x, clientY: s.y + dir * 2400, pointerId: 1, timeStamp: t + 4 }); p.tick();
  console.log(`${kind} B=${B} dir=${dir}`, out.join(' '), '| changes', JSON.stringify(p.changes()));
  p.panel.unmount();
});
