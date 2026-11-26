// ref_screens250.js (pane B, L250; from L243's ref_screens.js): his Coast Esses with ONE reference (REF, an alias of the LOCAL key
// out/reference-key.json) as Line and, when ROAD=<file of read_reference_road's bytes> is given, as Road; overhead and from his start; in each skin
// of SKINS (sigil = no data-theme). The page is the branch's real app/index.html in headless Chrome; the native side is a stand-in serving his pieces
// folder read only, the reference's shape bytes up to its grid (what read_reference_line sends) and the road bytes, under the alias only, so no
// track's name reaches the page or a picture. Nothing is written into the AC folder or the pieces folder.
// FRAME TIME: each animation frame's own time with gl.finish() after it (the preview's frame, its JS and the GL work done), median of 90 frames with
// the reference shown and hidden; headless Chrome, so his GPU is not measured.
// usage: TREE=<builder tree> REF='reference track 1' SKINS=sigil,skyline [ROAD=<bytes file>] node ref_screens250.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-l243';
const PIECE = process.env.PIECE || 'Coast Esses';
const SKINS = (process.env.SKINS || 'sigil,skyline').split(','), REF = process.env.REF || 'reference track 1';
const MODES = process.env.ROAD ? ['line', 'road'] : ['line'];
const RISE = +(process.env.RISE || 2500), BACK = +(process.env.BACK || 1200), LOOK = +(process.env.LOOK || 40), ZOOM = +(process.env.ZOOM || 7);
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const outRoot = process.argv[2]; fs.mkdirSync(outRoot, { recursive: true });
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const key = JSON.parse(fs.readFileSync(path.join(T, 'out', 'reference-key.json'), 'utf8'));
const fd = fs.openSync(path.join(AC, key[REF].track, key[REF].layout, 'ai', 'fast_lane.ai'), 'r');
const head = Buffer.alloc(16); fs.readSync(fd, head, 0, 16, 0); const n = head.readInt32LE(4), end = 16 + n * 20 + 4 + n * 72 + 4;
const shape = Buffer.alloc(end); fs.readSync(fd, shape, 0, end, 0); fs.closeSync(fd);
const road = process.env.ROAD ? fs.readFileSync(process.env.ROAD) : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };

(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (q.url.startsWith('/__bytes/')) { const b = q.url === '/__bytes/line' ? shape : road; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(b); return; }
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(outRoot, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const list = [{ track: REF, layout: '', hasAi: true, uiLength: null }, { track: 'reference track 9', layout: '', hasAi: false, uiLength: null }];
  const stand = `
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)}; window.__LIST = ${JSON.stringify(list)};
    const bytes = (k) => fetch('/__bytes/' + k).then((r) => { if (!r.ok) throw 'no such road'; return r.arrayBuffer(); });
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve(window.__LIST);
      if (cmd === 'read_reference_line') return a.track === ${JSON.stringify(REF)} ? bytes('line') : Promise.reject('no AI line there');
      if (cmd === 'read_reference_road') return a.track === ${JSON.stringify(REF)} ? bytes('road') : Promise.reject('no road there');
      return Promise.resolve(null); } } };
    const raf = window.requestAnimationFrame.bind(window); window.__frameMs = [];
    let gl = null; window.requestAnimationFrame = (fn) => raf((t) => { const a = performance.now(); fn(t); if (!gl) { const c = document.querySelector('#preview canvas'); gl = c && (c.getContext('webgl2') || c.getContext('webgl')); } if (gl) gl.finish(); window.__frameMs.push(performance.now() - a); });`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  const placed = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Place piece' && x.offsetParent); if (!b) return false; b.click(); await new Promise((r) => setTimeout(r, 1500)); return true;");
  const cam = (m) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(m)}); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
  const park = async () => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(1500); };
  const wheel = async (notches) => { for (let i = 0; i < Math.abs(notches); i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 450, deltaX: 0, deltaY: notches > 0 ? 120 : -120 }); await sleep(220); } await sleep(1200); };
  const press = async (code, k, ms) => { if (!(ms > 0)) return; const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); await sleep(300); };
  const fromStart = async () => {
    await cam('Build'); await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 0 } })); await new Promise((r) => setTimeout(r, 800)); return true;"); await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
    await press('Space', ' ', RISE); await press('KeyS', 's', BACK);
    if (LOOK) { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 }); for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 }); await sleep(600); }
  };
  const frames = (k = 90) => ev(`window.__frameMs.length = 0; await new Promise((r) => { const w = () => (window.__frameMs.length >= ${k} ? r() : setTimeout(w, 50)); w(); }); const a = window.__frameMs.slice(0, ${k}).sort((x, y) => x - y); return { median: +a[a.length >> 1].toFixed(2), p90: +a[Math.floor(a.length * 0.9)].toFixed(2) };`);
  // the panel, opened by the View menu item
  await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
  const gpu = await ev("const c = document.querySelector('#preview canvas'); const gl = c && (c.getContext('webgl2') || c.getContext('webgl')); const x = gl && gl.getExtension('WEBGL_debug_renderer_info'); return { canvases: document.querySelectorAll('#preview canvas').length, found: !!gl, webgl2: !!(c && c.getContext('webgl2')), renderer: x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : null };");
  const results = [];
  for (const skin of SKINS) {
    await ev(`const r = document.documentElement; if (${JSON.stringify(skin)} === 'sigil') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', ${JSON.stringify(skin)}); await new Promise((q) => setTimeout(q, 900)); return true;`);
    for (const mode of MODES) {
      const info = await ev(`const p = window.__t180Reference(); if (p.setMode) await p.setMode(${JSON.stringify(mode)}); const t = performance.now(); const info = await p.pick(${JSON.stringify(REF)}, ''); return { info, ms: performance.now() - t, state: p.state() };`);
      await cam('Overhead'); await wheel(ZOOM); await park(); await shot(`${skin}_${mode}_overhead.png`);
      const shown = await frames(); await ev('await window.__t180Reference().show(false); return true;'); const hidden = await frames(); await ev('await window.__t180Reference().show(true); return true;');
      await wheel(-ZOOM);
      await fromStart(); await park(); await shot(`${skin}_${mode}_start.png`);
      results.push({ skin, mode, pickMs: +info.ms.toFixed(1), state: info.state, frameMsShown: shown, frameMsHidden: hidden });
    }
  }
  await ev('await window.__t180Reference().clear(); return true;');
  const afterClear = await ev("let i = 1; document.dispatchEvent(new CustomEvent('t180:reference-request', { detail: { reply: (x) => { i = x; } } })); return i;");
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ placed, gpu, results, afterClear, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
