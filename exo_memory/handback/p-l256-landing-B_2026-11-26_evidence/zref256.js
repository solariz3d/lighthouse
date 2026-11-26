// zref256.js (pane B, L256 step 2, l251): which paints on top where a small window on the view (L251: page elements) meets the reference panel (L250). The tree's
// app/index.html in headless Chrome at 1400 x 860, SIGIL; the native side is a stand-in whose one reference is a circle built with the builder's own encodeAiLine (no
// AC file is read). Pane A's z-order method (p-l251-read-A_2026-11-26_evidence/vary.js "zorder"): a magenta box put where a layer's windows paint (at a tree with
// elements, INSIDE that layer's container; at a tree with the canvas, right after that layer's canvas with its z-index), and the screen's pixel read at the panel's
// centre: magenta means the layer paints over the panel.
// Two orders, each in a fresh page, since an element made later paints over one made earlier at the same z:
//   panelFirst: the reference panel opened, then the length handle hovered (the handles' windows made after the panel);
//   handleFirst: the length handle hovered, then the panel opened.
// Prints JSON. usage: TREE=<builder tree> node zref256.js
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-landing-1126';
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const { encodeAiLine, EXTRA } = require(T + '/src/export/ailine.js');
const { decode } = require(T + '/app/test/png.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
function aiLine(r, n) {
  const points = [], extra = [];
  for (let k = 0; k < n; k++) { const ph = (2 * Math.PI * k) / n; points.push({ pos: [r * Math.cos(ph), 0, r * Math.sin(ph)], length: 0, id: k }); const e = {}; for (const f of EXTRA) e[f] = 0; Object.assign(e, { sideLeft: 5, sideRight: 5, ny: 1 }); extra.push(e); }
  const b = encodeAiLine({ version: 7, points, extra, open: false });
  const g = Buffer.concat([b.subarray(0, b.length - 4), Buffer.alloc(4), Buffer.alloc(512, 7)]); g.writeInt32LE(1, b.length - 4);
  return g;
}
const LINE = aiLine(150, 300);

(async () => {
  const srv = http.createServer((q, s) => {
    if (q.url === '/__bytes/line') { s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(LINE); return; }
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l256b3-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const move = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: Math.round(x), y: Math.round(y) });
  const pixel = async (x, y) => { const d = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.round(x) - 1, y: Math.round(y) - 1, width: 3, height: 3, scale: 1 } }); return decode(Buffer.from(d.result.data, 'base64')).px(1, 1); };
  const magenta = (c) => c[0] > 230 && c[1] < 40 && c[2] > 230;
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  const stand = `
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces' || cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve([{ track: 'reference track 1', layout: '', hasAi: true, uiLength: '950' }]);
      if (cmd === 'read_reference_line') return fetch('/__bytes/line').then((r) => r.arrayBuffer());
      if (cmd === 'read_reference_road') return Promise.reject('no road in the stand-in');
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  const load = async () => {
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    for (let i = 0; i < 2; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 500)); return true;");
    await move(900, 700); await sleep(500);
  };
  const openPanel = async () => {
    await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
    await ev("await window.__t180Reference().pick('reference track 1', ''); return true;");
  };
  const hoverHandle = async () => {
    const h = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); const h = (l || []).find((x) => x.kind === 'length'); return h ? { x: h.x + r.left, y: h.y + r.top } : null;");
    if (!h) return null;
    await move(h.x, h.y); await sleep(500);
    const shown = await ev("return [...document.querySelectorAll('[data-mark-window=\"drag handles\"]')].filter((e) => getComputedStyle(e).display !== 'none').length;");
    await move(900, 700); await sleep(400);
    return { at: [Math.round(h.x), Math.round(h.y)], readoutsShown: shown };
  };
  const probe = async () => {
    const tip = await ev("return (await (await fetch('/app/core/markwindow.js')).text()).includes('function layer(');");
    const p = await ev("const b = document.querySelector('.reference-panel').getBoundingClientRect(); return [b.left + b.width / 2, b.top + 30];");
    const facts = await ev(`const panel = document.querySelector('.reference-panel'), kids = [...panel.parentElement.children];
      const lay = (L) => document.querySelector('[data-mark-windows="' + L + '"]') || document.querySelector('canvas[aria-label="' + L + '"]');
      const row = (L) => { const e = lay(L); if (!e) return null; return { el: e.tagName + (e.getAttribute('data-mark-windows') !== null ? '[data-mark-windows]' : '[canvas]'), parent: e.parentElement.id || e.parentElement.tagName, z: getComputedStyle(e).zIndex,
        sameParentAsPanel: e.parentElement === panel.parentElement, afterPanel: !!(panel.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) }; };
      return { panelParent: panel.parentElement.id, panelZ: getComputedStyle(panel).zIndex, panelIndex: kids.indexOf(panel), handles: row('drag handles'), labels: row('later changes') };`);
    const out = { tree: tip ? 'elements (L251)' : 'canvas (before L251)', point: p.map(Math.round), ...facts };
    for (const L of ['drag handles', 'later changes']) {
      const ok = tip
        ? await ev(`const box = document.querySelector('[data-mark-windows="${L}"]'); if (!box) return false; const s = box.getBoundingClientRect(), b = document.createElement('div'); b.id = 'zref256';
            b.style.cssText = 'position:absolute;pointer-events:none;background:#ff00ff;width:40px;height:20px;left:' + (${p[0]} - s.left - 20) + 'px;top:' + (${p[1]} - s.top - 10) + 'px'; box.append(b); return true;`)
        : await ev(`const c = document.querySelector('canvas[aria-label="${L}"]'); if (!c) return false; const s = c.parentElement.getBoundingClientRect(), b = document.createElement('div'); b.id = 'zref256';
            b.style.cssText = 'position:absolute;pointer-events:none;background:#ff00ff;width:40px;height:20px;z-index:' + getComputedStyle(c).zIndex + ';left:' + (${p[0]} - s.left - 20) + 'px;top:' + (${p[1]} - s.top - 10) + 'px'; c.after(b); return true;`);
      if (!ok) { out[L] = 'no window layer yet'; continue; }
      await sleep(150); out[L] = magenta(await pixel(p[0], p[1])) ? 'WINDOW OVER THE PANEL' : 'under the panel';
      await ev("const b = document.getElementById('zref256'); if (b) b.remove(); return true;");
    }
    return out;
  };
  const results = {};
  await load(); await openPanel(); const h1 = await hoverHandle(); results.panelFirst = { hover: h1, ...(await probe()) };
  await load(); const h2 = await hoverHandle(); await openPanel(); results.handleFirst = { hover: h2, ...(await probe()) };
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ results, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
