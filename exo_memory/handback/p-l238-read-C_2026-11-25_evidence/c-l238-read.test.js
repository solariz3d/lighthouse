// c-l238-read.test.js (pane C, L238 second read): rows of my own over the builder tree named by env T180 (A's l238-piece-ghost e16c646f, or 4e19e33 for the base row).
// Run: T180=C:/Consonance/t180-wt-piece node --test c-l238-read.test.js
// The fake DOM (El, fakeWindow) is copied from A's app/test/piece-ghost.test.js lines 11-41, which copied undo-commands.test.js; the rows are not A's.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const R = path.resolve(process.env.T180 || 'C:/Consonance/t180-wt-piece');
const D = require(R + '/src/core/document.js');
const { createCoreShell } = require(R + '/app/core/coreshell.js');
const HAS_GHOST = (() => { try { return /showPiece/.test(require('fs').readFileSync(R + '/app/core/coreshell.js', 'utf8')); } catch (e) { return false; } })();

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

// A store of my own. caseBlind: names compare as Windows compares them (NTFS is case-blind), so "Bend" and "bend" are one file, as on his machine.
function store({ caseBlind = false } = {}) {
  const k = (n) => (caseBlind ? n.toLowerCase() : n);
  const pieces = new Map(), recipes = new Map();
  return { pieces, recipes, k,
    listPieces: async () => [...pieces.keys()].sort(),
    openPiece: async (n) => { if (!pieces.has(k(n))) throw new Error(`could not read the piece "${n}": not found`); return pieces.get(k(n)); },
    savePiece: async (n, t) => { if (pieces.has(k(n))) throw new Error(`a piece named "${n}" already exists`); pieces.set(k(n), t); },
    deletePiece: async (n) => { if (!pieces.has(k(n))) throw new Error('not found'); pieces.delete(k(n)); },
    saveRecipe: async (n, t) => { recipes.set(k(n), t); },
    openRecipe: async (n) => (recipes.has(k(n)) ? recipes.get(k(n)) : null),
    deleteRecipe: async (n) => { recipes.delete(k(n)); },
    backupDoc: async () => 'b', saveUndo: async () => {}, openUndo: async () => null, saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null };
}

async function panelOn(st) {
  const { doc, tick } = fakeWindow(); doc.activeElement = null;
  const events = []; for (const k of ['t180-ghost', 't180-ghost-clear']) doc.addEventListener(k, (e) => events.push({ type: k, detail: e.detail }));
  doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(null)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: null }));
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null, storage: st, autosaveMs: 0 });
  shell.extend({ length: 300, family: 'bowl', first: { w: 33 } });
  const panel = require(R + '/app/core/panel.js').mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); if (!l) throw new Error(`no "${text}" field`); return l.children[1]; };
  const byAria = (a) => { const f = root.all().find((e) => e.attrs && e.attrs['aria-label'] === a); if (!f) throw new Error(`no element labelled "${a}"`); return f; };
  const p = { doc, tick, root, shell, panel, events, field, byAria,
    type: (t, v) => { const f = field(t); f.value = String(v); f.oninput(); },
    set: (f, v) => { f.value = String(v); (f.oninput || f.onchange)(); },
    flag: (b, on) => { b.checked = on; b.onchange(); },
    button: (t) => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === t),
    msg: () => root.all().filter((e) => e.attrs && e.attrs.class === 'message').map((e) => e.textContent).filter(Boolean).join(' | ') };
  return p;
}
// HIS S, typed as he typed it (the packet's addendum 1: made[1] of his .t180undo is turn -1, corner, the rows of pane O's probe5.js:19)
const S_ROWS = [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]];
function typeS(p, L = 300) {
  p.set(p.byAria('turn and climb as'), 'corner'); p.type('length m', L); p.type('turn °', -1); p.type('bank °', -20);
  p.flag(p.byAria('bank flows through its marks'), true); p.set(p.byAria('bank at'), 80);
  return S_ROWS.map(([f, then, from]) => p.panel.secondAdd(f, { then: String(then), from: String(from) }));
}
const settle = () => new Promise((r) => setImmediate(r));
// lay the S by the panel's own Extend, select exactly what it laid, save it as a piece
async function savedS(st, name = 'S') {
  const p = await panelOn(st); const n0 = p.shell.getState().history.present.pieces.length;
  typeS(p); p.button('Extend').onclick(); p.tick();
  const n1 = p.shell.getState().history.present.pieces.length; assert.ok(n1 > n0, `the S was not laid: ${p.msg()}`);
  p.shell.selectPiece(n0); if (n1 - 1 > n0) p.shell.selectPiece(n1 - 1, { extend: true });
  await p.shell.savePiece(name); assert.match(p.shell.getState().message || '', /saved the piece/);
  return { p, laidCount: n1 - n0 };
}

test('C0: the S saved through the panel keeps a recipe, and a click puts its typed numbers back in the boxes', { skip: !HAS_GHOST }, async () => {
  const st = store(); const { laidCount } = await savedS(st);
  assert.ok(st.recipes.has('S'), `no recipe kept for the S (it laid ${laidCount} piece(s))`);
  const q = await panelOn(st); await q.shell.showPiece('S'); q.tick();
  assert.ok(q.shell.getState().pieceGhost && q.shell.getState().pieceGhost.numbers, 'the ghost carries the numbers');
  assert.equal(q.field('length m').value, '300'); assert.equal(q.field('turn °').value, '-1'); assert.equal(q.field('bank °').value, '-20');
});

test('C1: Rename carries the recipe, AND the renamed piece still shows its numbers on a click', { skip: !HAS_GHOST }, async () => {
  const st = store(); await savedS(st, 'S');
  const q = await panelOn(st); await q.shell.renamePiece('S', 'S as driven');
  assert.ok(st.recipes.has('S as driven'), 'the sidecar moved');
  await q.shell.showPiece('S as driven'); const g = q.shell.getState().pieceGhost;
  assert.ok(g, 'a ghost'); assert.ok(g.numbers, `the renamed piece shows no numbers; its note: ${g.note}`);
});

test('C2: a case-only Rename on a case-blind store (as Windows names are) keeps the recipe', { skip: !HAS_GHOST }, async () => {
  const st = store({ caseBlind: true }); await savedS(st, 'bend');
  const q = await panelOn(st); await q.shell.renamePiece('bend', 'Bend');
  assert.ok(st.pieces.has('bend'), `the piece itself survives: ${q.shell.getState().message}`);
  assert.ok(st.recipes.has('bend'), `the recipe is gone after a case-only rename; message: ${q.shell.getState().message}`);
});

test('C3: the numbers make it by hand: Extend pressed on the boxes a click filled lays the same road Place lays', { skip: !HAS_GHOST }, async () => {
  const st = store(); await savedS(st);
  const a = await panelOn(st); await a.shell.showPiece('S'); a.tick(); a.button('Extend').onclick(); a.tick();
  const b = await panelOn(st); await b.shell.showPiece('S'); b.tick(); b.button('Place piece').onclick(); await settle(); b.tick();
  const da = D.parse(a.shell.text()), db = D.parse(b.shell.text());
  assert.equal(da.pieces.length, db.pieces.length, 'as many pieces');
  const ra = a.shell.getState().resolved.segments, rb = b.shell.getState().resolved.segments;
  const end = (r) => r[r.length - 1]; const ea = end(ra), eb = end(rb);
  assert.equal(JSON.stringify(da.pieces.map((x) => ({ ...x, id: 0 }))), JSON.stringify(db.pieces.map((x) => ({ ...x, id: 0 }))), 'the same pieces, ids aside');
  assert.ok(ea && eb);
});

test('C4: Place then Undo gives back exactly the document the ghost was shown over, and Redo the placed one (one step)', { skip: !HAS_GHOST }, async () => {
  const st = store(); await savedS(st);
  const q = await panelOn(st); const was = q.shell.getState().history.present, past0 = q.shell.getState().history.past.length;
  await q.shell.showPiece('S'); q.tick(); q.button('Place piece').onclick(); await settle(); q.tick();
  const placed = q.shell.getState().history.present; assert.notEqual(placed, was);
  assert.equal(q.shell.getState().history.past.length, past0 + 1, 'ONE undo step');
  q.shell.undo(); assert.equal(q.shell.getState().history.present, was, 'undo is the document it was shown over');
  q.shell.redo(); assert.equal(q.shell.getState().history.present, placed);
});

test('C5 (a record, both trees): the S typed with length 220: what the panel ghost does', async () => {
  const st = store(); const p = await panelOn(st);
  if (HAS_GHOST) { await savedS(st, 'S'); await p.shell.showPiece('S'); p.tick(); } else typeS(p);
  p.events.length = 0; p.type('length m', 220); p.tick();
  const btn = p.button('Extend'); if (btn.onmouseenter) btn.onmouseenter(); p.tick();
  const last = p.events.at(-1); const ghosts = p.events.filter((e) => e.type === 't180-ghost');
  const lastGhost = ghosts.at(-1);
  console.log(`C5 tree=${path.basename(R)} hasGhost=${HAS_GHOST} events=${p.events.map((e) => e.type).join(',')} lastEvent=${last && last.type} ghostSegments=${lastGhost ? lastGhost.detail.candidate.segments.length : '-'} message=${JSON.stringify(p.msg())} state.message=${JSON.stringify(p.shell.getState().message)}`);
});
