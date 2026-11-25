'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), os = require('os'), path = require('path'), cp = require('child_process');
const D = require('../../src/core/document.js');
const { createCoreShell } = require('../core/coreshell.js');
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

async function mount(storage = null) {
  const { doc, tick } = fakeWindow();
  const root = doc.createElement('div'), shell = await createCoreShell(storage ? { brushFn: null, storage, autosaveMs: 0 } : { brushFn: null });
  shell.extend({ length: 300, family: 'bowl', first: { w: 33 } });
  const calls = [], real = shell.extend; shell.extend = (o) => { calls.push(o); return real(o); };
  return wire({ doc, tick, root, shell, calls });
}
function wire(p) {
  const { root, shell } = p;
  p.panel = require('../core/panel.js').mount(root, shell);
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
const S_PIECE = { L: 300, turn: 0, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] };
const PLAIN = { L: 200, turn: 45, as: 'corner' };
const ROWS = { L: 250, turn: 60, as: 'corner', rows: [['turn', -50, 120]] };
const lastPiece = (p) => JSON.stringify(D.parse(p.shell.text()).pieces.at(-1));
const nPieces = (p) => D.parse(p.shell.text()).pieces.length;
function memStorage() {
  const files = new Map();
  return { files, saveDoc: async (n, t) => files.set(n, t), openDoc: async (n) => files.get(n), listDocs: async () => [...files.keys()], saveUndo: async (n, t) => files.set(n + '.undo', t), openUndo: async (n) => files.get(n + '.undo') ?? null,
    savePiece: async () => {}, openPiece: async () => '', listPieces: async () => [], deletePiece: async () => {}, saveAutosave: async () => {}, clearAutosave: async () => {}, openAutosave: async () => null, backupDoc: async () => {}, listBackups: async () => [], docSavedAt: async () => null };
}
// ---- pane C, L230 re-read of b921ab1: VARIED rows (not committed to the builder; the harness above is undo-values.test.js lines 7-73 and 98-102)
const { bindKeys } = require('../core/keys.js');
const PNL = require('../core/panel.js');
let SETTINGS_NOW = null;
{ const real = PNL.mount; PNL.mount = (r, s, o) => real(r, s, { ...(o || {}), ...(SETTINGS_NOW ? { settings: SETTINGS_NOW } : {}) }); }
function stubSettings() {
  const m = new Map(), fns = new Map();
  return { m, get: (k, f) => (m.has(k) ? m.get(k) : f), set: (k, v) => { m.set(k, v); for (const fn of fns.get(k) || []) fn(v); },
    on: (k, fn) => { fns.set(k, [...(fns.get(k) || []), fn]); return () => fns.set(k, (fns.get(k) || []).filter((g) => g !== fn)); } };
}
const DEGR = Math.PI / 180;
// a DIFFERENT first piece from every earlier row: 260 m, narrower (28 m), turning 18 deg/100 m and climbing 1.5 deg/100 m, so its end heading is off every grid
async function mountV(settings = null) {
  SETTINGS_NOW = settings;
  const { doc, tick } = fakeWindow(); doc.activeElement = null;
  const events = []; for (const k of ['t180-ghost', 't180-ghost-clear']) doc.addEventListener(k, (e) => events.push({ type: k, detail: e.detail }));
  doc.addEventListener('t180:ghost-request', (e) => e.detail.reply(null)); doc.addEventListener('t180:view', (e) => e.detail.reply({ pose: null }));
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  shell.extend({ length: 260, family: 'bowl', first: { w: 28 }, targets: { kh: 18 * DEGR / 100, kv: 1.5 * DEGR / 100 } });
  const p = wire({ doc, tick, root, shell, calls: [] }); p.events = events; p.doc = doc;
  bindKeys(doc, shell, { save: () => {} });
  SETTINGS_NOW = null;
  return p;
}
const say = (...a) => console.log('C-L230R', ...a);
const segSig = (segs) => segs.map((g) => JSON.stringify(g, (k, v) => (typeof v === 'number' ? +v.toFixed(6) : v))).join('|');
const header = (p) => p.byAria('the piece Extend would add').children[0].textContent;
const typedPiece = (p) => { typePiece(p, { L: 180, turn: -15, as: 'corner', bank: 6 }); p.type('climb °', 2); };
const CMDS = [
  ['Level', (p) => {}, []],
  ['To floor', (p) => { p.type('length m', 400); }, []],
  ['Turn by', (p) => p.type('turn by °', -35), [['turn by °', '-35']]],
  ['Turn to grid', (p) => p.set(p.byAria('grid step'), '15'), [['grid step', '15']]],
  ['Sharp', (p) => { p.type('sharp °', -75); p.type('sharp radius m', 40); p.type('sharp ramp m', 6); }, [['sharp °', '-75'], ['sharp radius m', '40'], ['sharp ramp m', '6']]],
  ['Jump', (p) => { p.type('turn °', ''); p.type('bank °', ''); p.type('climb °', ''); p.type('length m', 90); }, []],
];
const boxOf = (p, name) => { try { return p.field(name).value; } catch (e) { return p.byAria(name).value; } };
for (const [name, setup, own] of CMDS) {
  test(`V1 (${name}, a different first piece): the ghost is the road removed, the boxes and the command's own numbers come back, and the same command lays the same bytes`, async () => {
    const p = await mountV();
    typedPiece(p); setup(p);
    const lenTyped = p.field('length m').value, n0 = nPieces(p), placed = p.shell.getState().resolved.segments.length, before = p.shell.text();
    p.button(name).onclick(); p.tick();
    assert.ok(nPieces(p) > n0, `${name} laid something: ${p.shell.getState().message}`);
    const doneText = p.shell.text(), removedSegs = p.shell.getState().resolved.segments.slice(placed), nRemoved = nPieces(p) - n0;
    // spoil the command's own boxes so a give-back is visible
    for (const [f] of own) { if (f === 'grid step') p.set(p.byAria('grid step'), '90'); else p.type(f, '1'); }
    p.events.length = 0; p.shell.undo(); p.tick();
    assert.equal(p.shell.text(), before, 'the undo is back to the bytes before');
    const ev = p.events.at(-1), ug = p.shell.getState().undoGhost;
    const shown = ev && ev.type === 't180-ghost' ? ev.detail.candidate.segments.slice(placed) : null;
    const back = own.map(([f, v]) => [f, boxOf(p, f), v]);
    say(name, '| removed pieces', nRemoved, '| sent is st.undoGhost:', !!(ev && ug && ev.detail.candidate === ug.candidate), '| shown == removed:', !!shown && segSig(shown) === segSig(removedSegs),
      '| header', header(p), '| length box', p.field('length m').value, 'typed', lenTyped, '| own boxes', JSON.stringify(back));
    assert.ok(shown && segSig(shown) === segSig(removedSegs), `${name}: the preview after the undo is the road removed`);
    assert.equal(header(p), 'undone');
    assert.equal(p.field('length m').value, lenTyped, 'the length typed for it');
    for (const [f, got, want] of back) assert.equal(got, want, `${name}: its own "${f}" is given back`);
    p.button(name).onclick(); p.tick();
    say(name, '| the same command pressed again lays the same bytes:', p.shell.text() === doneText);
    assert.equal(p.shell.text(), doneText, `${name}: pressed on the given-back boxes it lays the removed road byte for byte`);
  });
}

test('V2: a Jump after a Sharp; undo, undo, redo, redo: each ghost is its own road, the boxes are each command\'s, and the bytes come back', async () => {
  const p = await mountV();
  typePiece(p, { L: 120, turn: 10, as: 'corner' }); p.type('sharp °', 60); p.type('sharp radius m', 35); p.type('sharp ramp m', 5);
  const placed0 = p.shell.getState().resolved.segments.length;
  p.button('Sharp').onclick(); p.tick(); const afterSharp = p.shell.text(), placed1 = p.shell.getState().resolved.segments.length, sharpSegs = p.shell.getState().resolved.segments.slice(placed0);
  p.type('turn °', ''); p.type('length m', 70); p.type('sharp °', 5); p.type('sharp radius m', 99); p.type('sharp ramp m', 9);
  p.button('Jump').onclick(); p.tick();
  const full = p.shell.text(), jumpSegs = p.shell.getState().resolved.segments.slice(placed1);
  assert.ok(full !== afterSharp, 'the jump was laid: ' + p.shell.getState().message);
  const step = (what) => { p.events.length = 0; p.shell[what](); p.tick(); const ev = p.events.at(-1), ug = p.shell.getState().undoGhost; return { ev, ug, events: p.events.map((e) => e.type).join(','), len: p.field('length m').value, sharp: [p.field('sharp °').value, p.field('sharp radius m').value, p.field('sharp ramp m').value].join('/'), head: header(p) }; };
  const u1 = step('undo'); const u1ok = u1.ev && u1.ev.type === 't180-ghost' && segSig(u1.ev.detail.candidate.segments.slice(placed1)) === segSig(jumpSegs);
  const u2 = step('undo'); const u2ok = u2.ev && u2.ev.type === 't180-ghost' && segSig(u2.ev.detail.candidate.segments.slice(placed0)) === segSig(sharpSegs);
  const r1 = step('redo'); const r1text = p.shell.text();
  const r2 = step('redo');
  say('V2 undo 1 (jump): ghost is the jump road', u1ok, '| length', u1.len, '| sharp boxes', u1.sharp, '| header', u1.head);
  say('V2 undo 2 (sharp): ghost is the sharp road', u2ok, '| length', u2.len, '| sharp boxes', u2.sharp, '| header', u2.head);
  say('V2 redo 1: events', r1.events, '| undoGhost', !!r1.ug, '| bytes == after Sharp', r1text === afterSharp, '| header', r1.head, '| length', r1.len, '| sharp', r1.sharp);
  say('V2 redo 2: events', r2.events, '| undoGhost', !!r2.ug, '| bytes == full', p.shell.text() === full, '| header', r2.head);
  assert.ok(u1ok, 'undo 1 shows the jump\'s road'); assert.equal(u1.len, '70'); assert.equal(u1.sharp, '5/99/9', 'the jump gives back the boxes as they were when Jump was pressed');
  assert.ok(u2ok, 'undo 2 shows the sharp\'s road'); assert.equal(u2.len, '120'); assert.equal(u2.sharp, '60/35/5', 'the Sharp gives back its own three');
  assert.equal(r1text, afterSharp); assert.equal(p.shell.text(), full); assert.equal(r2.ug, null); assert.notEqual(r2.head, 'undone');
  assert.ok(r1.events.split(',').includes('t180-ghost-clear') && !r1.events.split(',').includes('t180-ghost'), 'the first redo takes the undo ghost down and puts none up');
});

test('V3: undo a Sharp, type a change, redo: the typed change hands the picture back, and the redo leaves no ghost of the undone road', async () => {
  const p = await mountV();
  typePiece(p, { L: 140, turn: -20, as: 'corner' }); p.type('sharp °', -50); p.type('sharp radius m', 45); p.type('sharp ramp m', 4);
  p.button('Sharp').onclick(); p.tick(); const done = p.shell.text();
  p.shell.undo(); p.tick(); const h0 = header(p);
  p.events.length = 0; p.type('length m', 77); p.tick();
  const t = { events: p.events.map((e) => e.type).join(','), header: header(p), handles: 'n/a' };
  p.type('sharp °', 45);   // Sharp's own box: no ghost of its own
  p.events.length = 0; p.shell.redo(); p.tick();
  const r = { events: p.events.map((e) => e.type).join(','), bytes: p.shell.text() === done, ug: !!p.shell.getState().undoGhost, header: header(p), len: p.field('length m').value, sharp: p.field('sharp °').value };
  say('V3 header after undo', h0, '| after typing 77:', JSON.stringify(t), '| after redo:', JSON.stringify(r));
  assert.equal(h0, 'undone'); assert.equal(t.header, 'next'); assert.ok(t.events.split(',').includes('t180-ghost'), 'typing puts the next piece\'s ghost up');
  assert.ok(r.bytes, 'redo is the same bytes'); assert.equal(r.ug, false); assert.equal(r.header, 'next');
});

test('V4 (the librarian\'s question): after an undone Turn to grid, do the grid step box and the Settings menu read two steps?', async () => {
  const S = stubSettings(); const p = await mountV(S);
  typePiece(p, { L: 150, as: 'corner' }); p.type('turn °', '');
  p.set(p.byAria('grid step'), '45'); const s0 = S.get('gridStep');
  p.button('Turn to grid').onclick(); p.tick(); assert.ok(nPieces(p) === 2, 'Turn to grid laid: ' + p.shell.getState().message);
  const laid = JSON.stringify(D.parse(p.shell.text()).pieces.at(-1));
  p.set(p.byAria('grid step'), '15'); const s1 = S.get('gridStep');
  p.shell.undo(); p.tick();
  const box = p.byAria('grid step').value, menu = S.get('gridStep');
  // and what the NEXT Turn to grid uses, against what the menu says
  p.button('Turn to grid').onclick(); const used = JSON.stringify(D.parse(p.shell.text()).pieces.at(-1)) === laid ? '45 (the given-back box)' : 'not 45';
  say('V4 setting after picking 45:', s0, '| after picking 15:', s1, '| after the undo: box', box, 'Settings menu (S)', menu, '| two steps:', String(box) !== String(menu), '| the next Turn to grid used', used);
  assert.equal(String(box), String(menu), `after the undo the box reads ${box} and the Settings menu ${menu}`);
});
