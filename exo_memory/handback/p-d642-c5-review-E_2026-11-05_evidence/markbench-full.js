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


// ---- mine (D642 review of a924f1b): the additive model THROUGH THE PANEL (C's D641 mount, the real core shell + panel + handles on a fake stage)
//  X0. extra 0 is no extra: his piece (−90 corner, bank 88.45, cup 15.5, width 31, 1,000 m) laid by the core from the panel's options with no extra, against the same with the
//      extra turn made at 0, the extra bank made at its own value (88.45), the extra width at 31 and the extra cup at 15.5: D.serialize equal?
//  H.  his −90 keeps its first half: the built heading (the adapter's path) every 2 m to the mark, with the extra turn +180 (his p2) against no extra
//  BAR. the built heading rate, pitch rate and roll acceleration, each ÷ the bar (29.4 / (10·170²), core_additive.test.js), over the piece and 20 m on, for his cases laid by the panel
const D = require(WT + '/src/core/document.js'), A = require(WT + '/src/core/adapter.js');
const BAR = 29.4 / (10 * 170 * 170), r4 = (x) => Math.round(x * 1e4) / 1e4;
const layOf = (p) => TB.extendCorner(p.shell.getState().history.present, p.panel.options());
const xOf = (p, f) => p.panel.extraHandles().find((e) => e.field === f);
function builtPeaks(doc, a, b) {
  const S = A.toPath(doc).path.samples; let prev = null, off = 0, poff = 0, pp = null;
  const H = S.map((x) => { let v = Math.atan2(x.T[2], x.T[0]); if (prev !== null) { while (v + off - prev > Math.PI) off -= 2 * Math.PI; while (v + off - prev < -Math.PI) off += 2 * Math.PI; } v += off; prev = v; return { s: x.s, h: v, p: Math.asin(Math.max(-1, Math.min(1, x.T[1]))), r: x.roll }; });
  const lin = (k) => (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } const f = (s - H[lo].s) / ((H[hi].s - H[lo].s) || 1); return H[lo][k] + f * (H[hi][k] - H[lo][k]); };
  const hs = lin('h'), ps = lin('p'), rs = (s) => { let lo = 0, hi = H.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (H[m].s <= s) lo = m; else hi = m; } return H[lo].r; };
  let mh = 0, mp = 0, mr = 0, ah = 0, ap = 0, ar = 0;
  for (let s = a; s <= b; s += 0.5) { const h = Math.abs(hs(s + 1) - 2 * hs(s) + hs(s - 1)), p = Math.abs(ps(s + 1) - 2 * ps(s) + ps(s - 1)), r = Math.abs(rs(s + 2) - 2 * rs(s) + rs(s - 2)) / 4; if (h > mh) { mh = h; ah = s; } if (p > mp) { mp = p; ap = s; } if (r > mr) { mr = r; ar = s; } }
  return { heading: r4(mh / BAR), headingAt: ah, pitch: r4(mp / BAR), pitchAt: ap, roll: r4(mr / BAR), rollAt: ar };
}
const headingsTo = (doc, s0, s1) => { const S = A.toPath(doc).path.samples; const out = []; for (const x of S) if (x.s >= s0 - 1e-9 && x.s <= s1 + 1e-9) out.push([x.s, Math.atan2(x.T[0], x.T[2])]); return out; };
async function his(L = 1000, bank = 88.45) { const p = await mount(); p.type('length m', L); p.type('turn °', -90); p.type('bank °', bank); p.type('cup °', 15.5); p.type('width m', 31); return p; }
const MODE = process.env.MODE || 'rolling';
const AD = require(WT + '/src/core/adapter.js'); let plans = 0; const bp = AD.bankPlan; AD.bankPlan = (...a) => { plans++; return bp(...a); };
const q = (xs, f) => { const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(f * s.length))].toFixed(2); };
(async () => {
  const p = await his();
  if (MODE === 'early') { const box = p.root.all().find((e) => e.tagName === 'INPUT' && e.attrs.type === 'checkbox' && e.attrs['aria-label'] === 'bank at the start'); box.checked = true; box.onchange(); p.tick(); }
  p.panel.secondExtra(xOf(p, 'bank').id, -88.45); p.tick();
  const made = p.panel.options().changes.phi[0];
  const path = []; for (let f = 420; f <= 540; f++) path.push(f); for (let f = 539; f >= 420; f--) path.push(f);
  const ts = [], pr = []; let worst = { ms: 0 };
  for (const f of path) { plans = 0; const t0 = process.hrtime.bigint(); p.panel.secondDrag({ field: 'bank', index: 0 }, f); p.tick(); const ms = Number(process.hrtime.bigint() - t0) / 1e6; ts.push(ms); pr.push(plans); if (ms > worst.ms) worst = { ms: +ms.toFixed(2), asked: f, kept: p.panel.options().changes.phi[0].from, plans }; }
  p.panel.unmount();
  console.log(JSON.stringify({ mode: MODE, made: { from: made.from, targetDeg: +(made.target / DEG).toFixed(2) }, moves: ts.length, medianMs: q(ts, 0.5), p95Ms: q(ts, 0.95), maxMs: worst.ms, worst, plansTotal: pr.reduce((a, b) => a + b, 0), plansMax: Math.max(...pr), plansMedian: q(pr, 0.5) }));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
