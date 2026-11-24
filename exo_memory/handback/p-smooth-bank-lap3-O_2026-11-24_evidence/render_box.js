// render_box.js: LAP 3's headless render of the flow box (CHECK IT: its look and wording, seen, not tested). The REAL panel (app/core/panel.js mount) is mounted in a
// small fake DOM (the panel tests' own), driven to two states, and its "Extend at the head" fields are written out as HTML under the app's own stylesheet
// (app/index.html's <style> block and its theme links), in #left > #palette as the app mounts it; headless Edge then screenshots each page.
//   A  today: bank 30°, one extra bank (then 0 from 200 m), the box unticked
//   B  the box ticked: bank -20° at 80 m, then 27° at 150 m and -28° at 230 m (the flow layout's S, rounded), the ghost's message line beneath
// usage: node render_box.js <t180 tree> <out dir>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [T, OUT] = process.argv.slice(2);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js')), { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));

class El {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.attrs = {}; this.style = {}; this._text = ''; this.listeners = {}; this.value = ''; this.checked = false; this.disabled = false; this.parent = null; }
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
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const css = (st) => Object.entries(st).filter(([, v]) => v !== '' && v != null && typeof v !== 'function').map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${v}`).join(';');
function html(e) {
  if (e.tagName === '#TEXT') return esc(e._text);
  if (!e.tagName) return `<option value="${esc(e.value)}"${e.selected ? ' selected' : ''}>${esc(e.textContent)}</option>`;   // a select's Option
  const tag = e.tagName.toLowerCase(), a = { ...e.attrs };
  const st = css(e.style); if (st) a.style = (a.style ? a.style + ';' : '') + st;
  if (tag === 'input') { if (e.value !== '') a.value = e.value; if (e.checked) a.checked = ''; }
  if (e.disabled) a.disabled = '';
  if (tag === 'select') { /* options are not El children here */ }
  const at = Object.entries(a).map(([k, v]) => (v === '' && (k === 'checked' || k === 'disabled') ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');
  if (tag === 'input') return `<${tag}${at}>`;
  return `<${tag}${at}>${esc(e._text)}${e.children.map(html).join('')}</${tag}>`;
}
async function state(drive) {
  const doc = { ids: {}, listeners: {}, createElement: (t) => new El(t, doc) };
  doc.getElementById = (id) => doc.ids[id] || null;
  doc.addEventListener = (e, f) => { (doc.listeners[e] = doc.listeners[e] || []).push(f); };
  doc.removeEventListener = (e, f) => { doc.listeners[e] = (doc.listeners[e] || []).filter((x) => x !== f); };
  doc.dispatchEvent = (ev) => { for (const f of (doc.listeners[ev.type] || []).slice()) f(ev); return true; };
  doc.defaultView = { CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }, Option: class { constructor(t, v) { this.textContent = t; this.value = v; } }, requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, setTimeout: () => 0, clearTimeout: () => {} };
  const root = doc.createElement('div'), shell = await createCoreShell({ brushFn: null });
  shell.commitDoc(extend(D.createDoc('render'), { length: 300, family: 'bowl', first: { w: 33 } }));
  const panel = require(path.join(T, 'app/core/panel.js')).mount(root, shell);
  const by = (a) => root.all().find((e) => e.attrs && e.attrs['aria-label'] === a);
  const label = (text) => root.all().find((e) => e.tagName === 'LABEL' && e.children[0] && e.children[0].textContent === text);
  const type = (text, v) => { const f = label(text).children[1]; f.value = String(v); f.oninput(); };
  type('length m', 300);
  drive({ panel, by, type });
  const pickers = label('bank °').parent, msg = root.all().filter((e) => e.attrs && e.attrs.class === 'message').map((e) => e.textContent).filter(Boolean);
  const words = root.all().filter((e) => e.tagName === 'LABEL' && /then-row|picker inline/.test(e.attrs.class || '') && /bank/.test(e.textContent)).map((e) => e.all().filter((c) => c.tagName === '#TEXT' || c.tagName === 'SPAN').map((c) => c._text).filter(Boolean).join(' ').replace(/\s+/g, ' '));
  const out = { pickers: html(pickers), msg, words };
  panel.unmount();
  return out;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const index = fs.readFileSync(path.join(T, 'app/index.html'), 'utf8'), style = index.slice(index.indexOf('<style>'), index.indexOf('</style>') + 8);
  const links = [...index.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => `<link rel="stylesheet" href="${'file:///' + path.join(T, 'app', m[1]).replace(/\\/g, '/')}">`).join('\n');
  const S = {
    A: await state(({ panel, type }) => { type('bank °', 30); panel.secondAdd('bank', { then: '0', from: '60' }); }),
    B: await state(({ panel, by, type }) => { type('bank °', -20); const b = by('bank flows through its marks'); b.checked = true; b.onchange(); const at = by('bank at'); at.value = '80'; at.oninput(); panel.secondAdd('bank', { then: '27', from: '150' }); panel.secondAdd('bank', { then: '-28', from: '230' }); }),
  };
  const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  for (const [k, s] of Object.entries(S)) {
    const page = `<!doctype html><html><head><meta charset="utf-8">${style}\n${links}</head><body><div id="left"><aside id="palette"><section><h3>Extend at the head</h3>${s.pickers}</section>${s.msg.map((m) => `<p class="message">${esc(m)}</p>`).join('')}</aside></div></body></html>`;
    const file = path.join(OUT, `box_${k}.html`); fs.writeFileSync(file, page);
    const png = path.join(OUT, `box_${k}.png`);
    const r = spawnSync(edge, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${path.join(OUT, 'edge-profile')}`, `--screenshot=${png}`, '--window-size=320,760', 'file:///' + file.replace(/\\/g, '/')], { encoding: 'utf8', windowsHide: true, timeout: 60000 });
    console.log(k, fs.existsSync(png) ? `${png} (${fs.statSync(png).size} bytes)` : `NO SHOT: ${r.status} ${(r.stderr || '').slice(0, 300)}`);
    console.log(k, 'the bank rows read:', JSON.stringify(s.words));
    console.log(k, 'messages:', JSON.stringify(s.msg));
  }
})().catch((e) => { console.error(e); process.exit(1); });
