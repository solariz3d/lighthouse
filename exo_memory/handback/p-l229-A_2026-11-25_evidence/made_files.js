// made_files.js (pane A, L229 items 1-2): give his two saved projects' undo files their typed values.
//   node made_files.js stage  <stage dir>        lay each project through the BRANCH build's panel (typed as he would), compare to the track file on disk byte for byte, save into <stage dir>
//   node made_files.js prove  <app data dir>     open each project from there with the branch build, undo, print the boxes; Extend; compare bytes with the file
//   node made_files.js old    <app data dir>     open each project with the INSTALLED build (27e2084, extracted by git archive), say what it does
// Nothing here writes into <app data dir>.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process'), crypto = require('crypto');
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
const PROJECTS = {
  'Smooth S as driven L': [{ L: 300, turn: 0, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] }, { L: 150, bank: 0, flow: true, at: 100 }],
  'Smooth S flow L': [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }],
};
const dir = (a, sub) => path.join(a, sub);
function folderStorage(app, write) {
  const f = (n, e) => path.join(app, 'tracks', n + e);   // the shell names its files eq-<name> itself
  return { openDoc: async (n) => fs.readFileSync(f(n, '.t180track'), 'utf8'), openUndo: async (n) => (fs.existsSync(f(n, '.t180undo')) ? fs.readFileSync(f(n, '.t180undo'), 'utf8') : null),
    saveDoc: async (n, t) => { if (!write) throw new Error('read only'); fs.mkdirSync(path.join(app, 'tracks'), { recursive: true }); fs.writeFileSync(f(n, '.t180track'), t); },
    saveUndo: async (n, t) => { if (!write) throw new Error('read only'); fs.mkdirSync(path.join(app, 'tracks'), { recursive: true }); fs.writeFileSync(f(n, '.t180undo'), t); },
    savePiece: async () => {}, openPiece: async () => '', listPieces: async () => [], deletePiece: async () => {}, listDocs: async () => [],
    saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null };
}
const [mode, appArg, extra] = process.argv.slice(2);
(async () => {
  if (mode === 'stage') {
    for (const [name, specs] of Object.entries(PROJECTS)) {
      const st = folderStorage(appArg, true), { doc, tick } = fakeWindow(); const root = doc.createElement('div');
      const shell = await createCoreShell({ brushFn: null, storage: st, autosaveMs: 0 });
      // the lead is the file's own first piece (its document is named 'flow', which a fresh shell's is not): a seed holding just it, then the rest is typed
      const diskDoc = D.parse(fs.readFileSync(path.join(extra, 'tracks', 'eq-' + name + '.t180track'), 'utf8')); fs.mkdirSync(path.join(appArg, 'tracks'), { recursive: true });
      fs.writeFileSync(path.join(appArg, 'tracks', 'eq-seed.t180track'), D.serialize({ ...diskDoc, pieces: diskDoc.pieces.slice(0, 1), nextId: 2 })); await shell.open('seed');
      const p = wire({ doc, tick, root, shell, calls: [] }); for (const s of specs) { typePiece(p, s); p.button('Extend').onclick(); }
      const disk = fs.readFileSync(path.join(extra, 'tracks', 'eq-' + name + '.t180track'), 'utf8');
      console.log(`${name}: laid ${D.parse(shell.text()).pieces.length} pieces; sha256 laid ${sha(shell.text()).slice(0, 12)} | file on disk ${sha(disk).slice(0, 12)} | same bytes: ${shell.text() === disk}`);
      if (shell.text() !== disk) { fs.writeFileSync(path.join(os.tmpdir(), 'laid_' + name.replace(/ /g, '_') + '.txt'), shell.text()); const a = D.parse(shell.text()).pieces, b = D.parse(disk).pieces; console.log('  pieces equal by JSON:', a.map((x, i) => JSON.stringify(x) === JSON.stringify(b[i]))); throw new Error('not the same bytes; stop'); }
      await shell.save(name);
    }
  }
  if (mode === 'prove') {
    for (const name of Object.keys(PROJECTS)) {
      const disk = fs.readFileSync(path.join(appArg, 'tracks', 'eq-' + name + '.t180track'), 'utf8'), want = D.parse(disk).pieces;
      for (const undos of [1, 2]) {   // 1: the ease-out comes back; 2: the S comes back (the ease-out goes with it)
        const st = folderStorage(appArg, false), { doc, tick } = fakeWindow(); const root = doc.createElement('div');
        const shell = await createCoreShell({ brushFn: null, storage: st, autosaveMs: 0 }); await shell.open(name);
        const p = wire({ doc, tick, root, shell, calls: [] }); const sent = [], real = shell.extend; shell.extend = (o) => { sent.push(o); return real(o); };
        if (undos === 1) console.log(name + ': opened ' + want.length + ' pieces, text = file: ' + (shell.text() === disk));
        for (let k = 0; k < undos; k++) { shell.undo(); tick(); }
        const val = (t) => { try { return p.field(t).value; } catch (e) { return '?'; } };
        const rows = p.root.all().filter((e) => e.tagName === 'LABEL' && e.children[0] && /^(then|from|turn change|bank change)/.test(e.children[0].textContent || '')).length;
        console.log('  after ' + undos + ' undo(s): ' + D.parse(shell.text()).pieces.length + ' pieces; boxes length ' + val('length m') + ', turn ' + val('turn °') + ', bank ' + val('bank °') + '; flow ' + p.byAria('bank flows through its marks').checked + ' at ' + p.byAria('bank at').value);
        p.button('Extend').onclick();
        const laid = D.parse(shell.text()).pieces, k = laid.length - 1;
        console.log('  Extend lays piece ' + (k + 1) + ': identical to the file piece ' + (k + 1) + ': ' + (JSON.stringify(laid[k]) === JSON.stringify(want[k])) + '; sent ' + JSON.stringify(sent.at(-1)).slice(0, 700));
      }
    }
  }
  if (mode === 'old') {
    const dirT = fs.mkdtempSync(path.join(os.tmpdir(), 'inst-27e2084-')); const tarF = path.join(dirT, 'i.tar');
    try {
      cp.execFileSync('git', ['-C', T, 'archive', '--format=tar', '-o', tarF, '27e2084', 'app', 'src', 'tools', 'package.json']); cp.execFileSync('tar', ['-xf', 'i.tar'], { cwd: dirT });
      const rel = require(path.join(dirT, 'app/core/coreshell.js'));
      for (const name of Object.keys(PROJECTS)) {
        const side = JSON.parse(fs.readFileSync(path.join(appArg, 'tracks', 'eq-' + name + '.t180undo'), 'utf8'));
        const shell = await rel.createCoreShell({ brushFn: null, storage: folderStorage(appArg, false), autosaveMs: 0 }); await shell.open(name);
        const s = shell.getState(), disk = fs.readFileSync(path.join(appArg, 'tracks', 'eq-' + name + '.t180track'), 'utf8');
        console.log(name + ': undo file keys [' + Object.keys(side).join(',') + '], made slots ' + (side.made ? side.made.filter(Boolean).length : 0) + '; INSTALLED build opened: ' + D.parse(shell.text()).pieces.length + ' pieces, text = file ' + (shell.text() === disk) + ', history past ' + s.history.past.length + ' future ' + s.history.future.length + ', message ' + JSON.stringify(s.message));
        shell.undo(); shell.undo(); shell.redo(); console.log('  undo, undo, redo works: pieces now ' + D.parse(shell.text()).pieces.length);
      }
    } finally { fs.rmSync(dirT, { recursive: true, force: true }); }
  }
})().catch((e) => { console.error('FAILED', e.stack); process.exit(1); });
