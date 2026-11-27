// o_mock_road.js (pane O, L260 same lap; scratch): the Track overlay window as it OPENS, in Road (the chair's 07:24:20Z requirement, his 01:19-01:23 words).
// The same real page and stand-in as o_mock_overlay.js, SIGIL and Skyline; injected and marked "mock · not built": the title, the grouped list in Road's
// state (every layout pickable; one with no AI line "(no AI line: placed by its start)"; his own exports marked), the mode select reading Road with a made
// track's words, the door A button. The made track drawn is OUR OWN shape (through today's Line path, as in o_mock_overlay.js); names are placeholders.
// Headless rule as before. Pictures only, uncommitted.
//   node o_mock_road.js <f3cd425 tree> <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js')), { encodeAiLine, EXTRA } = require(path.join(T, 'src/export/ailine.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const BYTES = {};
let made = D.createDoc('mock');
for (const p of [{ length: 300, turn: 0 }, { length: 260, turn: 120, bank: 10 }, { length: 200, turn: 0 }, { length: 180, turn: -40 }, { length: 220, turn: 140, bank: 12 }, { length: 250, turn: 0 }, { length: 200, turn: 100, bank: 8 }])
  made = TB.extendCorner(made, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank || 0, width: 31, turnAs: 'corner' }));
{ const P = toPath(made, { step: 0.5 }).path.samples, pts = [], ext = []; let next = 0;
  for (const q of P) { if (q.s + 1e-9 < next) continue; next += 2; const e = {}; for (const f of EXTRA) e[f] = 0; e.sideLeft = 15.5; e.sideRight = 15.5; [e.nx, e.ny, e.nz] = q.U; [e.fx, e.fy, e.fz] = q.T; e.length = q.s; pts.push({ pos: q.pos.slice(), length: q.s, id: pts.length }); ext.push(e); }
  BYTES['line made'] = encodeAiLine({ points: pts, extra: ext, open: true }); BYTES.madeM = P[P.length - 1].s; }
const CSS = `header .overlay-door { white-space: nowrap; } header .overlay-door[aria-pressed="true"] { box-shadow: inset 0 0 0 1px var(--accent, #c9a227); }
  .reference-panel .rp-mock { font-weight: 400; font-size: 10px; color: var(--dim, #8a847a); letter-spacing: .04em; text-transform: uppercase; margin-left: 8px; }
  .reference-panel .rp-pick optgroup { font-style: normal; font-weight: 600; color: var(--dim, #8a847a); } .reference-panel .rp-pick option { color: var(--text, #ebe6dc); font-weight: 400; }`;
(async () => {
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/__o/')) { const b = BYTES[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l260r-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const out = { errors, shots: [], titles: [], state: [] };
  const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88, ...(clip ? { clip: { ...clip, scale: 2 } } : {}) }); fs.writeFileSync(path.join(OUT, name), Buffer.from(r.result.data, 'base64')); out.shots.push(name); };
  const rect = (sel) => ev(`const r = (${sel}).getBoundingClientRect(); return { x: Math.max(0, r.left - 8), y: Math.max(0, r.top - 8), width: r.width + 16, height: r.height + 16 };`);
  const stand = `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_tracks') return Promise.resolve(['eq-my oval', 'eq-hill climb', 'eq-test 3']);
      if (cmd === 'list_reference_tracks') return Promise.resolve([{ track: 'made S', layout: '', hasAi: true, uiLength: null }]);
      if (cmd === 'read_reference_line') return fetch('/__o/line made').then((r) => r.arrayBuffer());
      if (cmd === 'read_reference_road') return Promise.reject('the mock serves its line only');
      return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    for (const look of ['sigil', 'skyline']) {
      await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev(`localStorage.clear(); ${look === 'sigil' ? '' : `localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))});`} return true;`);
      await send('Page.navigate', { url: base });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      out.titles.push(await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title + ' ' + (document.documentElement.dataset.theme || 'sigil');"));
      for (let i = 0; i < 3; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
      await ev("document.dispatchEvent(new CustomEvent('t180:reference-panel')); await new Promise((r) => setTimeout(r, 1200)); await window.__t180Reference().pick('made S', ''); await new Promise((r) => setTimeout(r, 1500)); return true;");
      await ev(`const st = document.createElement('style'); st.textContent = ${JSON.stringify(CSS)}; document.head.appendChild(st);
        const P = document.querySelector('.reference-panel'), t = P.querySelector('.rp-head span'); t.textContent = 'Track overlay'; const m = document.createElement('span'); m.className = 'rp-mock'; m.textContent = 'mock · not built'; t.after(m);
        const mode = [...P.querySelectorAll('select')].find((x) => !x.classList.contains('rp-pick')); mode.replaceChildren(); for (const [v, w] of [['road', 'Road (its road as built)'], ['line', 'Line (its centre and width)']]) { const o = document.createElement('option'); o.value = v; o.textContent = w; mode.append(o); } mode.value = 'road';
        const s = P.querySelector('select.rp-pick'); s.replaceChildren();
        const o = (txt, sel, dis) => { const x = document.createElement('option'); x.textContent = txt; if (sel) x.selected = true; if (dis) x.disabled = true; return x; };
        s.append(o('None'));
        const g1 = document.createElement('optgroup'); g1.label = 'Your tracks (saved)'; g1.append(o('my oval', true), o('hill climb'), o('test 3 (open now: its saved file)'), o('old one (cannot be read: a newer builder saved it)', false, true));
        const g2 = document.createElement('optgroup'); g2.label = 'Assetto Corsa (installed)'; g2.append(o('reference 1'), o('reference 2 · layout one'), o('reference 3 (no AI line: placed by its start)'), o('t180 export 1 (your export; no AI line: placed by its start)'), o('t180 export 2 (your export; no AI line: placed by its start)'));
        s.append(g1, g2);
        P.querySelector('.rp-readout').textContent = 'your track "my oval", its road as built, from its saved file: ${Math.round(BYTES.madeM).toLocaleString('en-US')} m, open, 31 m wide · read 2 ms, built 210 ms';
        const nt = P.querySelector('.rp-note'); if (nt) nt.textContent = 'Road: your track as the builder builds it from its saved file (the file is read, never written). The window opens in Road, so every track in the list can be shown; Line draws only a line. Its start sits on your start; your road is drawn over it. Read only: nothing is saved, undone or exported.';
        const b = document.createElement('button'); b.className = 'overlay-door'; b.textContent = 'Track overlay'; b.setAttribute('aria-pressed', 'true'); document.getElementById('install').before(b);
        return true;`);
      out.state.push(await ev("const P = document.querySelector('.reference-panel'), s = P.querySelector('select.rp-pick'); return { look: document.documentElement.dataset.theme || 'sigil', mode: [...P.querySelectorAll('select')].find((x) => !x.classList.contains('rp-pick')).selectedOptions[0].textContent, options: s.options.length, disabled: [...s.options].filter((x) => x.disabled).length };"));
      await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Overhead'); if (b) b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;");
      for (let w = 0; w < 10; w++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 750, y: 450, deltaX: 0, deltaY: 240 }); await sleep(120); }
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 890 }); await sleep(1200);
      await shot(`${look}_road_window.jpg`);
      await ev("const s = document.querySelector('.reference-panel select.rp-pick'); s.size = 12; return true;"); await sleep(300);
      await shot(`${look}_road_list.jpg`, await rect("document.querySelector('.reference-panel')"));
    }
  } catch (e) { out.fatal = String(e && e.message || e); }
  finally { try { ws.close(); } catch (e) { /* */ } try { ch.kill(); } catch (e) { /* */ } await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { out.profileLeft = dir; } srv.close(); }
  fs.writeFileSync(path.join(OUT, 'mock_road_run.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
})();
