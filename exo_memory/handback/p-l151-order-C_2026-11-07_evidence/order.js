'use strict';
const assert = require('node:assert/strict');
const { createCoreShell } = require('C:/Users/zackn/AppData/Local/Temp/c-l152-wt/app/core/coreshell.js');
const TB = require('C:/Users/zackn/AppData/Local/Temp/c-l152-wt/src/core/turnby.js');
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
  const panel = require('C:/Users/zackn/AppData/Local/Temp/c-l152-wt/app/core/panel.js').mount(root, shell);
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


// ── L142 measurements (pane C). Read-only on the tree; prints JSON lines ──────────────────────────────────────────────────────────────────
const D = require('C:/Users/zackn/AppData/Local/Temp/c-l152-wt/src/core/document.js');
const out = (k, v) => console.log(k + ' ' + JSON.stringify(v));
const extend = (p) => { const n = p.shell.getState().history.present.pieces.length; p.root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick(); const doc = p.shell.getState().history.present; return doc.pieces.length === n + 1 ? doc.pieces.at(-1) : null; };
// sample a placed road piece every 1 m: curvature kh (rad/m), its heading (deg, integrated), bank phi (deg)
const sample = (P) => { const rows = []; let hd = 0, prev = null; for (let s = 0; s <= P.length + 1e-9; s += 1) { const k = D.channelAt(P, 'kh', s).v, ph = D.channelAt(P, 'phi', s).v; if (prev !== null) hd += (prev + k) / 2 * 1; rows.push({ s, k, hd: hd * 180 / Math.PI, phi: ph * 180 / Math.PI }); prev = k; } return rows; };
const firstAt = (rows, f) => { const r = rows.find(f); return r ? r.s : null; };

// ── L152 (pane C): HIS ORDER, "make the turn, then the banking, then the extra banking to straighten it". Read-only on the tree; JSON lines.
const fs = require('fs');
const SAVE = 'C:/Consonance/lighthouse/exo_memory/briefs/t180_saves_2026-11-07/eq-banking turn into unbanki.t180track';
const SETS = {
  good: { length: 1000, turn: -90, bank: 50, xbank: 0 },                         // his good save's p2 (B, L150: corner -90, bank +50, extra bank 0 from 500, byte-equal)
  s:    { length: 1000, turn: -90, bank: 17.39, xturn: 180, xbank: -34.78 },
  s30:  { length: 1000, turn: -90, bank: 30, xturn: 180, xbank: -34.78 },          // his S ghost (B's reading; first split and first bank not recoverable)
};
const STEP = {
  turn: (p, V) => p.type('turn °', V.turn),
  bank: (p, V) => p.type('bank °', V.bank),
  xturn: (p, V) => p.make('turn', V.xturn),
  xbank: (p, V) => p.make('bank', V.xbank),
};
async function run(setName, steps) {
  const V = SETS[setName], p = await mount(); p.type('length m', V.length);
  const log = [];
  const snap = (step, err) => log.push({ step, err: err || undefined, extras: p.panel.extraHandles().map((e) => ({ field: e.field, from: e.from, value: e.value, unused: !!e.unused })), changes: p.changes(), refused: p.refusal() });
  for (const st of steps) { let err = null; try { STEP[st](p, V); } catch (e) { err = e.message; } p.tick(); snap(st, err); }
  const opts = p.panel.options(), P = extend(p), doc = p.shell.getState().history.present;
  p.panel.unmount();
  return { steps, log, opts: { targets: opts.targets, changes: opts.changes, transition: opts.transition, bankShape: opts.bankShape, turnDeg: opts.turnDeg }, P, p1: doc.pieces[0] };
}
const skipped = []; const firstDiff = (a, b) => { for (const k of ["length","family"]) if (a[k] !== b[k]) return k + " " + a[k] + " vs " + b[k]; if (JSON.stringify(a.knots) !== JSON.stringify(b.knots)) return "knots " + a.knots.length + " vs " + b.knots.length + " first " + a.knots.findIndex((x, i) => x !== b.knots[i]); const ks = new Set([...Object.keys(a.channels), ...Object.keys(b.channels)]); for (const k of ks) { const x = a.channels[k], y = b.channels[k]; if (!x || !y) { if (!y) { skipped.push(k); continue; } return "channel " + k + " only in his"; } const i = x.findIndex((v, j) => v !== y[j]); if (i >= 0 || x.length !== y.length) return "channel " + k + " at " + i + ": " + x[i] + " vs " + y[i] + " (n " + x.length + "/" + y.length + ")"; } return skipped.length ? "equal except channels only in mine: " + [...new Set(skipped)].join(",") : null; };
const strip = (P) => P && { length: P.length, family: P.family, knots: P.knots, channels: P.channels };
(async () => {
  const save = JSON.parse(fs.readFileSync(SAVE, 'utf8')), his = save.pieces;
  const orders = {
    good: [['turn', 'bank', 'xbank'], ['bank', 'turn', 'xbank'], ['bank', 'xbank', 'turn'], ['xbank', 'bank', 'turn'], ['xbank', 'turn', 'bank']],
    s30: [["turn", "bank", "xbank", "xturn"], ["turn", "xturn", "bank", "xbank"], ["bank", "xbank", "turn", "xturn"]],
    s: [['turn', 'bank', 'xbank', 'xturn'], ['turn', 'xturn', 'bank', 'xbank'], ['turn', 'bank', 'xturn', 'xbank'], ['bank', 'xbank', 'turn', 'xturn'], ['bank', 'turn', 'xturn', 'xbank'], ['xbank', 'xturn', 'turn', 'bank']],
  };
  for (const set of Object.keys(orders)) {
    const runs = [];
    for (const steps of orders[set]) runs.push(await run(set, steps));
    const ref = runs[0];
    for (const r of runs) {
      const same = { options: JSON.stringify(r.opts) === JSON.stringify(ref.opts), doc: !!(r.P && ref.P) && JSON.stringify(strip(r.P)) === JSON.stringify(strip(ref.P)) };
      const vsHis = set === 'good' && r.P ? { p1: JSON.stringify(strip(r.p1)) === JSON.stringify(strip(his[0])), p2: JSON.stringify(strip(r.P)) === JSON.stringify(strip(his[1])), p1diff: firstDiff(strip(r.p1), strip(his[0])), p2diff: firstDiff(strip(r.P), strip(his[1])) } : undefined;
      let worst = null; if (r.P && ref.P) { const a = sample(r.P), b = sample(ref.P); worst = a.reduce((w, q, i) => { const d = Math.abs(q.phi - b[i].phi); return d > w.dphi ? { dphi: +d.toFixed(4), s: q.s } : w; }, { dphi: 0, s: null }); }
      out(`L152 ${set} ${r.steps.join('>')}`, { laid: !!r.P, sameAsFirstOrder: same, vsHisSave: vsHis, worstPhiVsFirst: worst, options: r.opts, log: r.log });
    }
  }
})().catch((e) => { console.error('order failed:', e.stack); process.exit(1); });
