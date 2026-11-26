// ft.js (pane O, L250): the frame time with a reference's kn5 ROAD drawn, in the real page of the builder branch, headless Chrome.
// After pane B's ref_screens.js (L243). The page's own rAF loop draws every frame; a wrapper installed before the page's scripts times each frame
// callback (CPU: the page's work and the GL calls it issues) and keeps the frame-to-frame interval (where a GPU that cannot keep up shows).
// The roads are the native side's own bytes (kn5road.rs encode, dumped by its ignored measurement row) served by ALIAS only, decoded in the page
// by a decoder written from the format in kn5road.rs's header. Placed at his start by the AI line's start (as B's Road picture), up normals (as B's).
// Read only: his pieces folder and AC's tracks folder are read, nothing is written to either. usage: node ft.js <tree> <roads dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.argv[2], ROADS = process.argv[3];
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const { readAiShape, ribbonOf } = require(T + '/src/reference/ribbon.js');
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const key = JSON.parse(fs.readFileSync('C:/Consonance/t180-wt-l243/out/reference-key.json', 'utf8'));
const cases = ['reference track 1', 'reference track 2', 'reference track 3', 'the largest layout'];
const starts = {};
for (const a of cases.slice(0, 3)) starts[a] = ribbonOf(readAiShape(fs.readFileSync(path.join(AC, key[a].track, key[a].layout, 'ai', 'fast_lane.ai')))).start;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.wav': 'audio/wav', '.jpg': 'image/jpeg' };
const q = (v, p) => { const s = v.slice().sort((a, b) => a - b); return s.length ? +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2) : null; };

(async () => {
  const srv = http.createServer((rq, s) => {
    const u = decodeURIComponent(rq.url.split('?')[0]);
    if (u.startsWith('/__road/')) { const n = +u.slice(8); const f = path.join(ROADS, cases[n] + '.road'); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(b); }); return; }
    const p = path.normalize(path.join(T, u));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250o-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `
    (() => { const raf = window.requestAnimationFrame.bind(window); window.__frames = [];
      window.requestAnimationFrame = (cb) => raf((t) => { const a = performance.now(); try { cb(t); } finally { window.__frames.push([t, performance.now() - a]); if (window.__frames.length > 400000) window.__frames.shift(); } }); })();
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base + '/app/index.html' });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify('Coast Esses') + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  const placed = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Place piece' && x.offsetParent); if (!b) return false; b.click(); await new Promise((r) => setTimeout(r, 1500)); return true;");
  const gpu = await ev("const c = document.createElement('canvas').getContext('webgl'); const x = c && c.getExtension('WEBGL_debug_renderer_info'); return x ? c.getParameter(x.UNMASKED_RENDERER_WEBGL) : 'unknown';");
  const cam = (m) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(m)}); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
  const wheel = async (notches) => { for (let i = 0; i < Math.abs(notches); i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 450, deltaX: 0, deltaY: notches > 0 ? 120 : -120 }); await sleep(220); } await sleep(1200); };
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 });
  // the page's decoder of the native bytes, from kn5road.rs's header; and a window of frames
  await ev(`window.__decode = (buf) => { const dv = new DataView(buf), u = (o) => dv.getUint32(o, true);
      if (new TextDecoder().decode(new Uint8Array(buf, 0, 8)) !== 'T180ROAD' || u(8) !== 1) throw new Error('not a road');
      const j = u(12), head = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 16, j))); let o = 16 + j; const n = u(o); o += 4; const batches = [];
      for (let k = 0; k < n; k++) { const nv = u(o), ni = u(o + 4); o += 8; const positions = new Float32Array(buf, o, nv * 3); o += nv * 12; const indices = new Uint16Array(buf, o, ni); o += ni * 2 + (ni % 2) * 2;
        const normals = new Float32Array(nv * 3); for (let i = 1; i < normals.length; i += 3) normals[i] = 1; batches.push({ positions, normals, indices }); }
      if (o !== buf.byteLength) throw new Error('bytes after the last batch'); return { head, batches }; };
    window.__window = async (ms) => { window.__frames.length = 0; await new Promise((r) => setTimeout(r, ms)); return window.__frames.slice(); }; return true;`);
  // every rAF callback of one frame shares its timestamp: a frame is the callbacks of one timestamp, its work their sum
  const byFrame = (fr) => { const m = new Map(); for (const [t, c] of fr) m.set(t, (m.get(t) || 0) + c); return [...m].sort((a, b) => a[0] - b[0]); };
  const stats = (fr) => { const f = byFrame(fr), cb = f.map((x) => x[1]), iv = f.slice(1).map((x, i) => x[0] - f[i][0]); return { callbacks: fr.length, frames: f.length, workMed: q(cb, 0.5), workP95: q(cb, 0.95), workMax: q(cb, 1), intervalMed: q(iv, 0.5), intervalP95: q(iv, 0.95), intervalMax: q(iv, 1) }; };
  const show = async (n) => ev(`const buf = await (await fetch('/__road/${n}')).arrayBuffer(); const t0 = performance.now(); const { head, batches } = window.__decode(buf); const decodeMs = performance.now() - t0;
      let first = null; const tStart = performance.now();
      let r = null; document.dispatchEvent(new CustomEvent('t180:reference', { detail: { ribbon: { batches, edges: new Float32Array(0), start: ${JSON.stringify(starts[cases[n]] || null)} || { pos: Array.from(batches[0].positions.slice(0, 3)), T: [0, 0, 1] }, lengthM: 0, width: {}, closed: true, points: 0 }, nudge: {}, reply: (x) => { r = x; } } }));
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); await new Promise((res) => setTimeout(res, 300)); const m = new Map(); for (const [t, c] of window.__frames) if (t >= tStart) m.set(t, (m.get(t) || 0) + c); first = [...m].sort((a, b) => a[0] - b[0]).slice(0, 3).map((x) => x[1]);
      return { bytes: buf.byteLength, triangles: head.triangles, batches: batches.length, decodeMs: +decodeMs.toFixed(1), firstThreeFramesWorkMs: first.map((x) => +x.toFixed(1)), shown: !!r };`);
  const drawn = () => ev("let p = null; document.dispatchEvent(new CustomEvent('t180-probe', { detail: { reply: (x) => { p = x; } } })); const s = p && p.stats; return s ? { trianglesInFrame: s.triangles, drawsInFrame: s.draws, uploadsSoFar: s.uploads } : null;");
  const hide = () => ev("document.dispatchEvent(new CustomEvent('t180:reference', { detail: { ribbon: null } })); await new Promise((r) => setTimeout(r, 300)); return true;");
  const out = { placed, gpu, views: {} };
  for (const view of ['overhead, zoomed out 20 notches', 'build view at his start']) {
    if (view.startsWith('overhead')) { await cam('Overhead'); await wheel(20); }
    else { await cam('Build'); await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 0 } })); await new Promise((r) => setTimeout(r, 1500)); return true;"); }
    const rows = [];
    rows.push({ case: 'none (control)', ...(await drawn()), ...stats(await ev('return await window.__window(4000);')) });
    for (let n = 0; n < cases.length; n++) {
      const s = await show(n); await sleep(1000);
      rows.push({ case: cases[n], ...s, ...(await drawn()), ...stats(await ev('return await window.__window(4000);')) });
      await hide();
    }
    rows.push({ case: 'none again (control)', ...(await drawn()), ...stats(await ev('return await window.__window(4000);')) });
    out.views[view] = rows;
  }
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  out.pageErrors = errors;
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
