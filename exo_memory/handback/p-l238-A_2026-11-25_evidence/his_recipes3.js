// his_recipes.js (pane A, L238 item 4): writes the .t180recipe for his two driven pieces ONLY if the panel, typed as he would, saves the piece byte for byte as his file is. Harness: made_files.js of L229.
// usage: TREE=<builder tree> node his_recipes.js <out dir>   (nothing is written into his folder)
'use strict';
const fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-ghost';
const D = require(T + '/src/core/document.js');
const { createCoreShell } = require(T + '/app/core/coreshell.js');
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
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
const panelMod = require(T + '/app/core/panel.js');
function wire(p) {
  const { root, shell } = p;
  p.panel = panelMod.mount(root, shell);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const field = (text) => { const l = label(text); if (!l) throw new Error(`no "${text}" field`); return l.children[1]; };
  const byAria = (a) => { const f = root.all().find((e) => e.attrs && e.attrs['aria-label'] === a); if (!f) throw new Error(`no element labelled "${a}"`); return f; };
  Object.assign(p, { field, byAria, type: (t, v) => { const f = field(t); f.value = String(v); f.oninput(); }, set: (f, v) => { f.value = String(v); (f.oninput || f.onchange)(); }, tick2: (b, on) => { b.checked = on; b.onchange(); },
    button: (t) => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === t) });
  return p;
}
// one piece typed as he would (pane O's route.js `piece`, without removing the rows afterwards: Undo must give them back)
function typePiece(p, s) {
  p.set(p.byAria('turn and climb as'), s.as || 'corner');
  p.type('length m', s.L); p.type((s.as || 'corner') === 'rate' ? 'turn °/100m' : 'turn °', s.turn === undefined ? '' : s.turn); p.type('bank °', s.bank === undefined ? '' : s.bank);
  if (s.flow) { p.tick2(p.byAria('bank flows through its marks'), true); p.set(p.byAria('bank at'), s.at === undefined ? '' : s.at); }
  for (const [f, then, from] of s.rows || []) p.panel.secondAdd(f, { then: String(then), from: String(from) });
}

// ---- L238 item 4: the recipes for his two driven pieces. The piece files are NOT touched: a recipe is written only if the piece the panel saves from typed numbers is byte for byte his file.
const PC = require(T + '/src/core/piece.js');
const S_PIECE = { L: 300, turn: -1, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] };
const EASE = { L: 150, bank: 0, flow: true, at: 100 };
const piecesDir = process.env.APPDATA + '/com.solariz3d.t180-track-builder/pieces/';
const out = process.argv[2];
(async () => {
  const files = new Map(), rec = new Map();
  const storage = { saveDoc: async () => {}, openDoc: async () => null, listDocs: async () => [], saveUndo: async () => {}, openUndo: async () => null, savePiece: async (n, t) => { files.set(n, t); }, openPiece: async (n) => files.get(n), listPieces: async () => [...files.keys()], deletePiece: async () => {},
    saveRecipe: async (n, t) => { rec.set(n, t); }, openRecipe: async (n) => rec.get(n) || null, deleteRecipe: async () => {}, saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => 'b' };
  const { doc, tick } = fakeWindow(); doc.activeElement = null; doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(null)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: null }));
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null, storage, autosaveMs: 0 });
  shell.extend({ length: 300, family: 'bowl', first: { w: 33 } });
  const p = wire({ doc, tick, root, shell, calls: [] });
  const result = {};
  for (const [name, spec, idx] of [['Smooth S straight', S_PIECE, 1], ['Smooth S straight ease-out', EASE, 2]]) {
    typePiece(p, spec); p.button('Extend').onclick(); tick();
    shell.selectPiece(idx); await shell.savePiece(name);
    const mine = files.get(name), his = '';
    result[name] = { pieces: shell.getState().history.present.pieces.length, byteEqualToHis: mine === his, recipe: rec.has(name), msg: shell.getState().message };
    fs.writeFileSync(path.join(out, name + '.t180piece'), mine); if (rec.has(name)) fs.writeFileSync(path.join(out, name + '.t180recipe'), rec.get(name)); result[name].endHeadingAfterDeg = shell.endHeadingDeg();
  }
  console.log(JSON.stringify(result, null, 1));
})();
