// The panel's route to the banked S (pane O, 2026-11-24, a CHECK IT lap): the real panel (app/core/panel.js mount) on a fake DOM (the harness of
// app/test/core-bank-flow-panel.test.js, El / fakeWindow / its field helpers, copied), its fields typed and Extend pressed, piece by piece; then the BUILT road read:
// heading from the plan positions (test/roll_profile.js turnOf's chord), bank from the adapter (builtBank), roll halts (stops) against the S's marks moved onto
// each attempt's own. Tree: env ROUTE_TREE (default the o-route worktree at 27e2084).
'use strict';
const path = require('path'), R = path.resolve(process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180');
const D = require(R + '/src/core/document.js'), TB = require(R + '/src/core/turnby.js'), { extend } = require(R + '/src/core/extend.js');
const A = require(R + '/src/core/adapter.js'), RP = require(R + '/test/roll_profile.js'), { createCoreShell } = require(R + '/app/core/coreshell.js');
const DEG = Math.PI / 180, LEAD = 300;
class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.parent = null; }
  append(...k) { for (const c of k) { if (c == null) continue; const n = typeof c === 'string' ? Object.assign(new El('#text', this.ownerDocument), { _text: c }) : c; n.parent = this; this.children.push(n); } }
  replaceChildren(...k) { for (const c of this.children) c.parent = null; this.children = []; this.append(...k); }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.ownerDocument.ids[v] = this; }
  getAttribute(k) { return this.attrs[k]; }
  set textContent(t) { this._text = String(t); this.children = []; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(''); }
  addEventListener(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); }
  removeEventListener(e, f) { this.listeners[e] = (this.listeners[e] || []).filter((x) => x !== f); }
  getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; }
  get isConnected() { return false; }
  all() { return [this, ...this.children.flatMap((c) => (c.all ? c.all() : []))]; }
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
  const { doc } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  shell.commitDoc(extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } }));
  const calls = [], real = shell.extend; shell.extend = (o) => { calls.push(o); return real(o); };
  const panel = require(R + '/app/core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); if (!l) throw new Error(`no "${text}" field`); return l.children[1]; };
  const byAria = (a) => { const f = root.all().find((e) => e.attrs && e.attrs['aria-label'] === a); if (!f) throw new Error(`no element labelled "${a}"`); return f; };
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); };
  const set = (f, v) => { f.value = String(v); (f.oninput || f.onchange)(); };
  const tick = (box, on) => { box.checked = on; box.onchange(); };
  const button = (text) => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === text);
  const msgText = () => root.all().filter((e) => e.attrs && e.attrs.class === 'message').map((e) => e.textContent).filter(Boolean).join(' | ');
  return { root, shell, panel, type, set, tick, byAria, button, msgText, calls };
}
/** One piece typed as he would; its extra rows are removed after Extend so the next piece starts clean. */
async function piece(p, s) {
  const rows = [];
  p.set(p.byAria('turn and climb as'), s.as || 'corner');
  p.type('length m', s.L); p.type((s.as || 'corner') === 'rate' ? 'turn °/100m' : 'turn °', s.turn === undefined ? '' : s.turn); p.type('bank °', s.bank === undefined ? '' : s.bank);
  for (const k of ['turn', 'bank']) p.tick(p.byAria(`${k} at the start`), !!(s.early || []).includes(k));
  p.tick(p.byAria('bank flows through its marks'), !!s.flow); if (s.flow) p.set(p.byAria('bank at'), s.at === undefined ? '' : s.at);
  for (const [f, then, from] of s.rows || []) rows.push(p.panel.secondAdd(f, { then: String(then), from: String(from) }));
  const n0 = D.parse(p.shell.text()).pieces.length; p.button('Extend').onclick();
  const laid = D.parse(p.shell.text()).pieces.length > n0, sent = p.calls.at(-1);
  for (const x of rows) if (x && x.rm && x.rm.onclick) x.rm.onclick();
  return { laid, sent, msg: p.msgText() };
}
/** The built road read: heading (+ left, from the plan positions over an 8 m chord) and bank every 0.5 m over the track, from the adapter's path. */
function read(doc) {
  const S = A.toPath(doc, { step: 0.5 }).path.samples, at = (s) => RP.near(S, s), h = 4, out = []; let prev = null, acc = 0;
  for (let s = h; s <= S[S.length - 1].s - h + 1e-9; s += 0.5) {
    const p = at(s - h), q = at(s + h), th = Math.atan2(-(q.pos[2] - p.pos[2]), q.pos[0] - p.pos[0]);
    if (prev !== null) { let d = th - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; }
    prev = th; out.push({ s, h: acc / DEG, b: at(s).roll / DEG });
  }
  return out;
}
/** Turn A and turn B on the built road: the heading's peak, the 10-90 % spans of its rise and fall, the bank at the attempt's marks, and the roll's halts. */
function shape(doc, M) {
  const r = read(doc), inS = r.filter((x) => x.s >= LEAD - 10), pk = inS.reduce((a, x) => (Math.abs(x.h) > Math.abs(a.h) ? x : a)), end = inS[inS.length - 1];
  const rise = (f) => inS.find((x) => x.h >= f * pk.h), fall = (f) => inS.find((x) => x.s > pk.s && x.h <= pk.h - f * (pk.h - end.h));
  const a10 = rise(0.1), a90 = rise(0.9), b10 = fall(0.1), b90 = fall(0.9);
  const bank = (s) => RP.near(r, s).b;
  // halts: the built roll halts inside a roll, against the straight line between the attempt's own marks (core_bank_flow.test.js refRate's rule)
  const ref = (s) => { for (let k = 0; k + 1 < M.length; k++) { if (s < M[k].s || s > M[k + 1].s) continue; const turnsAt = (j) => j > 0 && j + 1 < M.length && Math.sign(M[j].deg - M[j - 1].deg) !== Math.sign(M[j + 1].deg - M[j].deg);
    if ((turnsAt(k) && s - M[k].s < 10) || (turnsAt(k + 1) && M[k + 1].s - s < 10)) return 0; return (M[k + 1].deg - M[k].deg) / (M[k + 1].s - M[k].s); } return 0; };
  const B = RP.builtBank(doc).filter((x) => x.s >= LEAD - 20 && x.s <= M[M.length - 1].s + 50), halts = RP.stops(B, ref);
  const f1 = (x) => (x === undefined || x === null ? '-' : x.toFixed(1));
  return { peak: pk.h, end: end.h,
    turnA: `${f1(pk.h)}°, 10-90 % from ${f1(a10 && a10.s - LEAD)} to ${f1(a90 && a90.s - LEAD)} m (${f1(a10 && a90 && a90.s - a10.s)} m), peak at ${f1(pk.s - LEAD)} m`,
    turnB: `${f1(end.h - pk.h)}°, 10-90 % from ${f1(b10 && b10.s - LEAD)} to ${f1(b90 && b90.s - LEAD)} m (${f1(b10 && b90 && b90.s - b10.s)} m), heading at the end ${f1(end.h)}°`,
    bank: M.map((m) => `${f1(m.s - LEAD)} m ${f1(bank(m.s))}° (mark ${m.deg})`).join(', '),
    range: `${f1(Math.min(...inS.map((x) => x.b)))}° to ${f1(Math.max(...inS.map((x) => x.b)))}°`,
    halts: halts.length ? halts.map((x) => `${f1(x.s - LEAD)} m (${x.r.toFixed(2)} °/m where ${x.want.toFixed(2)} wanted)`).join('; ') : 'none' };
}
module.exports = { mountPanel, piece, shape, read, LEAD, DEG, D, TB, extend, RP };
