// e_vary258.test.js (pane E, L258 read; scratch, never committed): A's/D's bank past a full turn VARIED, on any tree:
//   T180_TREE=<builder tree> node --test e_vary258.test.js
// Every case prints one JSON line (VARY …) so the base and the tip can be set side by side. Built from core-bank-carry.test.js's fake DOM (spliced in below).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path'), crypto = require('crypto');
const TREE = path.resolve(process.env.T180_TREE);
const R = (p) => require(path.join(TREE, p));
const D = R('src/core/document.js');
const { extend } = R('src/core/extend.js');
const { createCoreShell } = R('app/core/coreshell.js');
const HD = R('app/core/handles.js');
const DEG = Math.PI / 180;
// ── a small fake DOM, as app/test/core-bank-flow-panel.test.js has it ──
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

async function mountAt(phiDeg, lead = 400) {
  const { doc } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  let d = extend(D.createDoc('vary'), { length: 300, family: 'bowl', first: { w: 33 } });
  if (phiDeg !== 0) d = extend(d, { length: lead, targets: { phi: phiDeg * DEG } });
  shell.commitDoc(d);
  const panel = R('app/core/panel.js').mount(root, shell);
  const all = () => root.all();
  const label = (text) => all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); assert.ok(l, `no "${text}" field`); return l.children[1]; };
  const type = (text, v) => { const f = field(text); f.value = String(v); f.oninput(); };
  const byAria = (a) => all().find((e) => e.attrs && e.attrs['aria-label'] === a) || null;
  const button = (text) => all().find((e) => e.tagName === 'BUTTON' && e.textContent === text);
  const msgText = () => all().filter((e) => e.attrs && e.attrs.class === 'message').map((e) => e.textContent).join(' | ');
  const pieces = () => shell.getState().history.present.pieces.length;
  const press = () => { const n = pieces(); button('Extend').onclick(); return pieces() > n ? null : msgText() || 'nothing laid'; };
  const lastBank = () => { const d2 = shell.getState().history.present, P = d2.pieces[d2.pieces.length - 1], b = []; for (let s = 0; s <= P.length + 1e-9; s += 1) b.push(D.channelAt(P, 'phi', Math.min(s, P.length)).v / DEG); return b; };
  return { root, shell, panel, field, type, byAria, press, msgText, pieces, lastBank, head: () => shell.headState().phi / DEG };
}
const r3 = (v) => Math.round(v * 1000) / 1000;
const summary = (b) => ({ start: r3(b[0]), end: r3(b[b.length - 1]), min: r3(Math.min(...b)), max: r3(Math.max(...b)), steepest: r3(b.reduce((m, v, i) => (i ? Math.max(m, Math.abs(v - b[i - 1])) : m), 0)) });
const say = (name, o) => console.log(`VARY ${name} ${JSON.stringify(o)}`);
const tgt = (o) => (o.targets && Number.isFinite(o.targets.phi) ? r3(o.targets.phi / DEG) : null);

// E1: the ghost's bank handle. Its apply (panel.js handlesHost.apply, :1089) writes show(HD.wrapTurn(value)) into the bank field and calls the field's oninput;
// this does the same write (the host itself needs a stage, which this fake DOM has not)
for (const [name, head, value] of [['E1a head -392, handle dragged to -42', -392, -42], ['E1b head -392, handle dragged to -432', -392, -432], ['E1c head -20, handle dragged to -42', -20, -42]]) {
  test(name, async () => {
    const p = await mountAt(head);
    p.type('length m', 150);
    const f = p.field('bank °'); const shownBefore = f.value; f.value = String(Math.round(HD.wrapTurn(value) * 100) / 100); f.oninput();
    const o = p.panel.options(); const res = p.press();
    say(name, { head, shownBefore, written: f.value, sent: tgt(o), laid: res === null ? summary(p.lastBank()) : res });
  });
}

// E2: the flowing bank's offer from a head past a turn (D's hand-back: "caught by no row")
for (const [name, head, typed, drag] of [['E2a flow, head -392, field -60, unused offer dragged to -80', -392, -60, -80], ['E2b flow, head -20, field -60, offer dragged to -80', -20, -60, -80], ['E2c flow, head 392, field 60, offer dragged to 80', 392, 60, 80]]) {
  test(name, async () => {
    const p = await mountAt(head);
    p.type('length m', 300); p.type('bank °', typed);
    const box = p.byAria('bank flows through its marks'); assert.ok(box, 'the flow box'); box.checked = true; box.onchange();
    const x = p.panel.extraHandles().find((e) => e.field === 'bank' && e.unused);
    const out = { head, flowShape: p.panel.options().bankShape || null, offered: x ? r3(x.value) : 'no offer' };
    if (x) {
      p.panel.secondExtra(x.id, drag); const o = p.panel.options();
      out.sent = { first: tgt(o), through: o.through && o.through.phi ? o.through.phi.map((m) => ({ at: m.at, target: r3(m.target / DEG) })) : null, changes: o.changes && o.changes.phi ? o.changes.phi.map((c) => r3(c.target / DEG)) : null };
      const res = p.press(); out.laid = res === null ? summary(p.lastBank()) : res;
    }
    say(name, out);
  });
}

// E3: rows chain in the head's turn, not the previous row's
test('E3 head -392, field -60, rows -100 at 100 and -400 at 200, 300 m', async () => {
  const p = await mountAt(-392);
  p.type('length m', 300); p.type('bank °', -60);
  p.panel.secondAdd('bank', { then: '-100', from: '100' }); p.panel.secondAdd('bank', { then: '-400', from: '200' });
  const o = p.panel.options(); const res = p.press();
  say('E3', { head: -392, sent: { first: tgt(o), changes: o.changes && o.changes.phi ? o.changes.phi.map((c) => ({ from: c.from, target: r3(c.target / DEG) })) : null }, laid: res === null ? summary(p.lastBank()) : res });
});

// E4-E7: the turn's edges: a head at exactly -360, a head a hair under 360, a head two turns down, a typed value past a turn from upright, a sign against the head's
for (const [name, head, typed] of [['E4a head -360, typed -32', -360, -32], ['E4b head -360, typed 0', -360, 0], ['E4c head -360, typed 360', -360, 360], ['E5a head 359.996, typed 365', 359.996, 365], ['E5b head 359.996, typed 10', 359.996, 10], ['E6 head -720, typed -10', -720, -10], ['E7a head 0, typed 400', 0, 400], ['E7b head 392, typed -32', 392, -32]]) {
  test(name, async () => {
    const p = await mountAt(head, head === -720 ? 800 : 400);
    const shown = p.field('bank °').value;
    p.type('length m', 300); p.type('bank °', typed);
    const o = p.panel.options(); const res = p.press();
    say(name, { head: r3(p.head()), shownBefore: shown, sent: tgt(o), laid: res === null ? summary(p.lastBank()) : res, shownAfter: p.field('bank °').value });
  });
}

// E8: a typed -654.70 committed (the field's onchange) stays in the field until Extend (the CHANGELOG's words)
test('E8 head 0, -654.70 typed and committed', async () => {
  const p = await mountAt(0);
  const f = p.field('bank °'); f.value = '-654.70'; f.oninput(); if (f.onchange) f.onchange({});
  say('E8', { afterCommit: f.value, sent: tgt(p.panel.options()) });
});

// E9: a closed lap. G6's wound lap, its -392 piece laid THROUGH THE PANEL (the head at -360, typed -32), then Close (closejob runCloseBest)
test('E9 the wound lap with its -392 piece typed in the panel, closed', async () => {
  const { extendTurnBy } = R('src/core/turnby.js'), CJ = R('app/core/closejob.js'), Q = 300 * Math.PI / 2;
  const { doc } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 300, targets: { phi: -360 * DEG } }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
  shell.commitDoc(d);
  const panel = R('app/core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (t) => label(t).children[1]; const type = (t, v) => { const f = field(t); f.value = String(v); f.oninput(); };
  const shownAtMinus360 = field('bank °').value;
  type('length m', 200); type('bank °', -32);
  const o = panel.options(); root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick();
  let d2 = shell.getState().history.present; const P = d2.pieces[d2.pieces.length - 1];
  const laidEnd = r3(D.channelAt(P, 'phi', P.length).v / DEG);
  d2 = extendTurnBy(d2, { length: Q }, 90 * DEG); d2 = extend(d2, { length: 100 }); d2 = extendTurnBy(d2, { length: Q }, 90 * DEG);
  const r = CJ.runCloseBest({ doc: d2 });
  const out = { shownAtMinus360, sent: tgt(o), laidEnd, closed: !!(r.doc && r.doc.closed), converged: !!r.converged };
  if (r.doc && r.doc.closed) {
    const P0 = r.doc.pieces[0], PL = r.doc.pieces[r.doc.pieces.length - 1];
    out.seam = r3(D.channelAt(PL, 'phi', PL.length).v / DEG - D.channelAt(P0, 'phi', 0).v / DEG);
    out.sha16 = crypto.createHash('sha256').update(D.serialize(r.doc)).digest('hex').slice(0, 16);
    shell.commitDoc(r.doc); out.afterCloseShown = field('bank °').value; type('bank °', -10); out.afterCloseTyped10Sent = tgt(panel.options());
  } else out.report = String(r.report).slice(0, 200);
  say('E9', out);
});

// E10: a full turn TYPED through the panel (his 2026-11-02 "all the way around say -360"), then the next piece typed: which turn is the head in, by the float it lands on
for (const [name, steps] of [['E10a 0 -> typed -360 -> typed -32', [-360, -32]], ['E10b 0 -> typed -170 -> typed -360 -> typed -32', [-170, -360, -32]], ['E10c 0 -> typed 360 -> typed 32', [360, 32]], ['E10d 0 -> typed -340 -> typed -720 -> typed -10', [-340, -720, -10]], ['E10e 0 -> typed -170 -> -340 -> -360 -> -32', [-170, -340, -360, -32]]]) {
  test(name, async () => {
    const p = await mountAt(0);
    const rows = [];
    for (const v of steps) { const before = p.head(); p.type('length m', 300); p.type('bank °', v); const sent = tgt(p.panel.options()); const res = p.press(); rows.push({ typed: v, headBefore: before, sent, laidEnd: res === null ? r3(p.lastBank().slice(-1)[0]) : res, headAfterExact: p.head(), shownAfter: p.field('bank °').value }); }
    say(name, rows);
  });
}

// E3b: an extra bank row that has room, from a head past a turn: field -60, a row -100 at 250 of 600
test('E3b head -392, field -60, a row -100 at 250, 600 m', async () => {
  const p = await mountAt(-392);
  p.type('length m', 600); p.type('bank °', -60); p.panel.secondAdd('bank', { then: '-100', from: '250' });
  const o = p.panel.options(); const res = p.press();
  say('E3b', { sent: { first: tgt(o), changes: o.changes && o.changes.phi ? o.changes.phi.map((c) => ({ from: c.from, target: r3(c.target / DEG) })) : null }, laid: res === null ? summary(p.lastBank()) : res });
});
// E9b: the lap wound for real through the panel: from a head at -360 (shown -360) the WHOLE number -392 is typed, then Close
test('E9b the wound lap, -392 typed whole in the panel from -360, closed', async () => {
  const { extendTurnBy } = R('src/core/turnby.js'), CJ = R('app/core/closejob.js'), Q = 300 * Math.PI / 2;
  const { doc } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  let d = D.createDoc('lap'); d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: Q }, 90 * DEG);
  d = extend(d, { length: 300, targets: { phi: -360 * DEG } }); d = extend(d, { length: Q / 2, targets: { kh: 1 / 300 } }); d = extendTurnBy(d, { length: Q / 2 }, 67.5 * DEG);
  shell.commitDoc(d);
  const panel = R('app/core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (t) => label(t).children[1]; const type = (t, v) => { const f = field(t); f.value = String(v); f.oninput(); };
  type('length m', 200); type('bank °', -392);
  const o = panel.options(); root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === 'Extend').onclick();
  let d2 = shell.getState().history.present; const P = d2.pieces[d2.pieces.length - 1];
  const laid = []; for (let s = 0; s <= P.length + 1e-9; s += 1) laid.push(D.channelAt(P, 'phi', Math.min(s, P.length)).v / DEG);
  d2 = extendTurnBy(d2, { length: Q }, 90 * DEG); d2 = extend(d2, { length: 100 }); d2 = extendTurnBy(d2, { length: Q }, 90 * DEG);
  const r = CJ.runCloseBest({ doc: d2 });
  const out = { sent: tgt(o), laid: summary(laid), closed: !!(r.doc && r.doc.closed), converged: !!r.converged };
  if (r.doc && r.doc.closed) { const P0 = r.doc.pieces[0], PL = r.doc.pieces[r.doc.pieces.length - 1]; out.seam = r3(D.channelAt(PL, 'phi', PL.length).v / DEG - D.channelAt(P0, 'phi', 0).v / DEG); out.sha16 = crypto.createHash('sha256').update(D.serialize(r.doc)).digest('hex').slice(0, 16); const t = D.serialize(r.doc); out.roundTrip = D.serialize(D.parse(t)) === t; }
  else out.report = String(r.report).slice(0, 200);
  say('E9b', out);
});
