// e_page.js (pane E, L250 read; scratch): the merged branch's REAL page (app/index.html) in headless Chrome, with a stand-in native side.
//   A  the heaviest layouts the panel can pick, as Road (layout 61: most triangles; layout 29: most bytes), and the largest installed (layout 3, no AI
//      line): pick time, the panel's own read/build split, long tasks on the page's thread, the JS heap, the frame interval shown and hidden
//   B  the nudge box typed with 1e400 and 1e39: what the input holds, what the panel keeps, what the preview draws
//   C  a save through the page (its Save button, save_track and save_undo as sent to the native side) with and without a Road reference shown
//   D  pictures: Skyline with the panel open; Skyline overhead zoomed out with NO reference (the START and PIT labels)
// Names: the stand-in sees aliases only ("reference A/B/L"); the AI lines and road bytes are read from AC's folder / the dump read only, by env
// (T180_E_LINE_A, T180_E_LINE_B: paths, never printed). Headless per BUILDING.md: --headless=new, --mute-audio, never focused, title 'zz-headless-test'.
// usage: TREE=<tree> DUMP=<dump dir> T180_E_LINE_A=<fast_lane.ai> T180_E_LINE_B=<fast_lane.ai> node e_page.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const T = path.resolve(process.env.TREE), DUMP = process.env.DUMP, OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const upToGrid = (p) => { const fd = fs.openSync(p, 'r'); const h = Buffer.alloc(16); fs.readSync(fd, h, 0, 16, 0); const n = h.readInt32LE(4), end = 16 + n * 20 + 4 + n * 72 + 4; const b = Buffer.alloc(end); fs.readSync(fd, b, 0, end, 0); fs.closeSync(fd); return b; };
const BYTES = { lineA: upToGrid(process.env.T180_E_LINE_A), lineB: upToGrid(process.env.T180_E_LINE_B), roadA: fs.readFileSync(path.join(DUMP, 'layout61.road')), roadB: fs.readFileSync(path.join(DUMP, 'layout29.road')) };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };

(async () => {
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/__e/')) { const b = BYTES[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250e-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const shot = async (name, clip) => fs.writeFileSync(path.join(OUT, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  await ev("document.title = 'zz-headless-test'; return true;");
  const list = [{ track: 'reference A', layout: '', hasAi: true, uiLength: null }, { track: 'reference B', layout: '', hasAi: true, uiLength: null }, { track: 'reference L', layout: '', hasAi: false, uiLength: null }];
  const stand = `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    window.__LIST = ${JSON.stringify(list)}; window.__sent = [];
    const bytes = (k) => fetch('/__e/' + k).then((r) => r.arrayBuffer());
    const A = { 'reference A': 'A', 'reference B': 'B' };
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'save_track' || cmd === 'save_undo' || cmd === 'save_autosave') window.__sent.push({ cmd, a: JSON.parse(JSON.stringify(a || {})) });
      if (cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve(window.__LIST);
      if (cmd === 'read_reference_line') return A[a.track] ? bytes('line' + A[a.track]) : Promise.reject('no AI line there (The system cannot find the path specified. (os error 3))');
      if (cmd === 'read_reference_road') return A[a.track] ? bytes('road' + A[a.track]) : Promise.reject('no road there');
      return Promise.resolve(null); } } };
    window.__long = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push({ at: e.startTime, ms: e.duration }); }).observe({ type: 'longtask', buffered: true }); } catch (e) { window.__long = null; }`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 3; i++) await click('Extend');
  const cam = (m) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(m)}); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
  const park = async () => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(1500); };
  const wheel = async (notches) => { for (let i = 0; i < Math.abs(notches); i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 450, deltaX: 0, deltaY: notches > 0 ? 120 : -120 }); await sleep(220); } await sleep(1200); };
  const skin = (s) => ev(`const r = document.documentElement; if (${JSON.stringify(s)} === 'sigil') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', ${JSON.stringify(s)}); await new Promise((q) => setTimeout(q, 900)); return true;`);
  const interval = (ms = 2000) => ev(`const t = []; await new Promise((r) => { const s = performance.now(); const f = (x) => { t.push(x); if (x - s < ${ms}) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); }); const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b); return { frames: d.length, median: +d[d.length >> 1].toFixed(2), p95: +d[Math.floor(d.length * 0.95)].toFixed(2), max: +d[d.length - 1].toFixed(2) };`);
  const out = { gpu: null, A: [], B: [], C: null, pageErrors: errors };

  // D (first, before any reference): Skyline overhead zoomed out, NO reference
  await skin('skyline'); await cam('Overhead'); await wheel(7); await park(); await shot('D_skyline_overhead_no_reference.png');
  await wheel(-7); await skin('sigil');

  // the panel, opened by the View menu item
  await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
  out.gpu = await ev("const c = document.querySelector('#preview canvas'); const gl = c && (c.getContext('webgl2') || c.getContext('webgl')); const x = gl && gl.getExtension('WEBGL_debug_renderer_info'); return x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : null;");

  // C, part 1: a save with no reference shown
  const save = async (name) => ev(`window.__sent.length = 0; document.getElementById('name').value = ${JSON.stringify(name)}; await document.getElementById('save').onclick(); await new Promise((r) => setTimeout(r, 400)); return window.__sent.map((x) => ({ cmd: x.cmd, name: x.a.name, text: x.a.text }));`);
  const plain = await save('E plain');

  // A: Road, the heaviest pickable layouts, then the largest (no AI line)
  await ev("await window.__t180Reference().setMode('road'); return true;");
  for (const [alias, which] of [['reference A', 'layout 61'], ['reference B', 'layout 29']]) {
    const hidden0 = await interval();
    const r = await ev(`window.__long.length = 0; const h0 = performance.memory ? performance.memory.usedJSHeapSize : null; const t = performance.now(); await window.__t180Reference().pick(${JSON.stringify(alias)}, ''); const ms = performance.now() - t; const h1 = performance.memory ? performance.memory.usedJSHeapSize : null;
      const st = window.__t180Reference().state(); return { ms: +ms.toFixed(1), timing: st.timing, triangles: st.triangles, kind: st.kind, readout: st.readout, heapMB: h0 && h1 ? +((h1 - h0) / 1e6).toFixed(1) : null, longTasks: window.__long.map((x) => +x.ms.toFixed(0)) };`);
    const shown = await interval();
    out.A.push({ which, ...r, frameHiddenBefore: hidden0, frameShown: shown });
  }
  const l = await ev("const p = window.__t180Reference(); const o = [...document.querySelectorAll('.reference-panel select')][0]; const opt = [...o.options].find((x) => x.textContent.startsWith('reference L')); await p.pick('reference L', ''); const st = p.state(); return { option: opt && { text: opt.textContent, disabled: opt.disabled }, error: st.error, drawn: st.shown };");
  out.A.push({ which: 'layout 3 (the largest installed)', ...l });

  // C, part 2: a save with a Road reference shown and nudged
  await ev("const p = window.__t180Reference(); await p.pick('reference A', ''); await p.setNudge({ dx: 25, dz: -10, dy: 3, yawDeg: 15 }); return true;");
  const shownSave = await save('E plain');
  const h = (s) => crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 16);
  out.C = { plain: plain.map((x) => ({ cmd: x.cmd, sha: h(x.text), bytes: String(x.text).length })), shown: shownSave.map((x) => ({ cmd: x.cmd, sha: h(x.text), bytes: String(x.text).length })),
    same: plain.length === shownSave.length && plain.every((x, i) => x.cmd === shownSave[i].cmd && x.text === shownSave[i].text), mentionsReference: shownSave.some((x) => /reference/i.test(String(x.text))) };

  // B: the nudge box typed with 1e400 and 1e39 (focus, select all, insertText, then change)
  for (const typed of ['1e400', '1e39', '250']) {
    const r = await ev(`const i = document.querySelector('.reference-panel input[aria-label^="move the reference: x"]'); i.focus(); i.select(); return true;`);
    await send('Input.insertText', { text: typed });
    const after = await ev(`const i = document.querySelector('.reference-panel input[aria-label^="move the reference: x"]'); i.dispatchEvent(new Event('change')); await new Promise((r) => setTimeout(r, 200)); const ref = await new Promise((res) => document.dispatchEvent(new CustomEvent('t180:reference-request', { detail: { reply: res } }))); const st = window.__t180Reference().state();
      return { inputValue: i.value, valueAsNumber: String(i.valueAsNumber), badInput: i.validity.badInput, panelDx: String(st.nudge.dx), drawnStartX: ref ? String(ref.start[0]) : null, error: st.error };`);
    out.B.push({ typed, ...after, r });
  }
  await ev(`const i = document.querySelector('.reference-panel input[aria-label^="move the reference: x"]'); i.blur(); return true;`);

  // D: Skyline with the panel open, the reference shown (the panel's region, then the whole view)
  await ev("await window.__t180Reference().setNudge({ dx: 0, dz: 0, dy: 0, yawDeg: 0 }); return true;");
  await skin('skyline'); await park(); await shot('D_skyline_panel.png', { x: 1150, y: 40, width: 350, height: 420 }); await shot('D_skyline_whole.png');

  await ev('await window.__t180Reference().clear(); return true;');
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
