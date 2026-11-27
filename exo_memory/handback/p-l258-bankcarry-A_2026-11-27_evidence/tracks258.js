// tracks258.js (pane A, L258): his saved tracks on L, from COPIES (neutral names tNN / bNN; his folder is never read here), through one tree's own code.
// Per track:
//   open     the text parses (src/core/document.js), and D.serialize(D.parse(text)) is the same bytes as the file; a second round is stable
//   shell    the app's own open (coreshell open(name), with the copy's undo sidecar if it has one) and its own save under another name: the saved body equals
//            the file byte for byte, and the saved sidecar equals the copy's (when it had one); the history length opened
//   panel    the panel mounted on that shell (the fake DOM of app/test/core-bank-carry.test.js): the bank field as shown, the head's bank, and the untouched
//            extend options (panel.options(), as JSON)
//   typed    the bank typed at the shown value + 10 and Extend pressed: laid or not (the message), the new head's bank, and the sha256 of the document after
// usage: node tracks258.js <tree> <copies dir> <out.json>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]), DIR = path.resolve(process.argv[3]), OUT = path.resolve(process.argv[4]);
const D = require(path.join(T, 'src/core/document.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const PANEL = path.join(T, 'app/core/panel.js');
const DEG = Math.PI / 180, sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ── the fake DOM, as app/test/core-bank-carry.test.js has it ──
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

async function one(alias) {
  const text = fs.readFileSync(path.join(DIR, `${alias}.t180track`), 'utf8');
  const undoPath = path.join(DIR, `${alias}.t180undo`), undo = fs.existsSync(undoPath) ? fs.readFileSync(undoPath, 'utf8') : null;
  const r = { track: alias, bytes: Buffer.byteLength(text), sidecar: undo !== null };
  let d;
  try { d = D.parse(text); } catch (e) { r.open = { bad: String(e && (e.code || e.message) || e).slice(0, 80) }; return r; }
  const s1 = D.serialize(d), s2 = D.serialize(D.parse(s1));
  let schema = null; try { schema = JSON.parse(text).schema || null; } catch (e) { /* not JSON */ }
  r.open = { schema, sameBytes: s1 === text, stable: s2 === s1, pieces: d.pieces.length, serSha: sha(s1).slice(0, 16) };
  // the app's own open and save
  const mem = { ['eq-' + alias]: text }, sideIn = undo === null ? {} : { ['eq-' + alias]: undo }, saved = {}, savedUndo = {};
  const storage = { openDoc: async (k) => { if (!(k in mem)) throw new Error('no such doc'); return mem[k]; }, openUndo: async (k) => (k in sideIn ? sideIn[k] : null),
    saveDoc: async (k, v) => { saved[k] = v; }, saveUndo: async (k, v) => { savedUndo[k] = v; }, listDocs: async () => [], docSavedAt: async () => null,
    backupDoc: async () => {}, listBackups: async () => [], clearAutosave: async () => {}, openAutosave: async () => null, saveAutosave: async () => {} };
  const shell = await createCoreShell({ storage, brushFn: null });
  const st = await shell.open(alias);
  r.shell = { opened: !!(st && st.history && st.history.present), message: st && st.message || null, undoDepth: st && st.history ? (st.history.past || []).length : null };
  // the panel, untouched
  try {
    const { doc } = fakeWindow(); const root = doc.createElement('div');
    delete require.cache[PANEL]; const panel = require(PANEL).mount(root, shell);
    const label = (t) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === t);
    const field = (t) => { const l = label(t); if (!l) throw new Error(`no "${t}" field`); return l.children[1]; };
    const button = (t) => root.all().find((e) => e.tagName === 'BUTTON' && e.textContent === t);
    const msg = () => root.all().filter((e) => e.attrs && e.attrs.class === 'message').map((e) => e.textContent).join(' | ');
    const head = () => shell.headState().phi / DEG;
    const shown = Number(field('bank °').value);
    let options = null; try { options = JSON.stringify(panel.options()); } catch (e) { options = `throws: ${e && e.message}`; }
    r.panel = { shownBank: field('bank °').value, headBankDeg: +head().toFixed(6), optionsSha: options && !options.startsWith('throws') ? sha(options).slice(0, 16) : options };
    // the app's own save, under another name (before anything is typed)
    await shell.save('rt-' + alias);
    r.shell.savedSame = saved['eq-rt-' + alias] === text; r.shell.savedSha = saved['eq-rt-' + alias] ? sha(saved['eq-rt-' + alias]).slice(0, 16) : null; r.shell.savedEqSer = saved['eq-rt-' + alias] === s1;
    r.shell.sidecarSame = undo === null ? null : savedUndo['eq-rt-' + alias] === undo; r.shell.sidecarSha = savedUndo['eq-rt-' + alias] ? sha(savedUndo['eq-rt-' + alias]).slice(0, 16) : null;
    // typed: the shown bank + 10, Extend
    const n0 = shell.getState().history.present.pieces.length, L = field('length m'); L.value = '150'; L.oninput(); const f = field('bank °'); f.value = String(shown + 10); f.oninput();
    const b = button('Extend'); if (!b) throw new Error('no Extend button'); b.onclick();
    const after = shell.getState().history.present, laid = after.pieces.length > n0;
    r.typed = { typed: shown + 10, laid, message: laid ? null : (msg() || 'nothing laid, no message').slice(0, 160), headBankDeg: +head().toFixed(6), docSha: sha(D.serialize(after)).slice(0, 16) };
  } catch (e) { r.panelError = String(e && e.message || e).slice(0, 200); }
  return r;
}

(async () => {
  const names = fs.readdirSync(DIR).filter((f) => f.endsWith('.t180track')).map((f) => f.replace(/\.t180track$/, '')).sort();
  const out = [];
  for (const a of names) { try { out.push(await one(a)); } catch (e) { out.push({ track: a, error: String(e && e.message || e).slice(0, 200) }); } }
  fs.writeFileSync(OUT, JSON.stringify({ tree: path.basename(T), head: require('child_process').execSync('git rev-parse --short=7 HEAD', { cwd: T }).toString().trim(), n: out.length, tracks: out }, null, 1));
  console.log(`${path.basename(T)}: ${out.length} tracks → ${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
