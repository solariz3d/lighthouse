// e_page_r.js (pane E, L250 RE-READ; scratch, never committed): the repaired branch's REAL page (app/index.html) in headless Chrome, a stand-in native side.
//   Two of the 15 layouts with no AI line (layout 3, the largest; layout 53, the start highest above its road), each picked as Road THROUGH THE PANEL'S
//   OWN SELECTS (mode, then the layout): the option's words, the pick time, the readout, long tasks, the frame interval while shown; an overhead picture.
//   Then, with one shown: the mode select changed to Line, and back to Road (pane E's V3j in the real page).
// The stand-in sees aliases only ("reference N3", "reference N53"); the road bytes are the dump (kn5road.rs encode, read only from AC). read_reference_line
// for them is refused with the words reference.rs:73 forms for a missing fast_lane.ai ("no AI line there (<io error>)"; the io error's text is the OS's).
// Headless per BUILDING.md: --headless=new, --mute-audio (the shared launcher), never focused, title 'zz-headless-test' set first and kept.
// usage: TREE=<tree> DUMP=<dump dir> node e_page_r.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE), DUMP = process.env.DUMP, OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const BYTES = { N3: fs.readFileSync(path.join(DUMP, '3.road')), N53: fs.readFileSync(path.join(DUMP, '53.road')) };
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
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250re-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(OUT, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  const out = { picks: [], modeSwitch: null, errors };
  try {
    await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
    const list = [{ track: 'reference N3', layout: '', hasAi: false, uiLength: null }, { track: 'reference N53', layout: '', hasAi: false, uiLength: null }];
    const stand = `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__LIST = ${JSON.stringify(list)}; window.__calls = [];
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        window.__calls.push(cmd);
        if (cmd === 'list_tracks') return Promise.resolve([]);
        if (cmd === 'list_reference_tracks') return Promise.resolve(window.__LIST);
        if (cmd === 'read_reference_line') return Promise.reject('no AI line there (The system cannot find the path specified. (os error 3))');
        if (cmd === 'read_reference_road') return fetch('/__e/' + a.track.split(' ')[1]).then((r) => r.arrayBuffer());
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };
      window.__long = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(e.duration); }).observe({ type: 'longtask', buffered: true }); } catch (e) { window.__long = null; }`;
    await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    for (let i = 0; i < 3; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
    await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 800)); return true;");
    const sel = (i) => `[...document.querySelectorAll('.reference-panel select')][${i}]`;   // 0: the layout, 1: the mode
    const change = (i, v) => ev(`const s = ${sel(i)}; s.value = ${JSON.stringify(v)}; s.dispatchEvent(new Event('change', { bubbles: true })); return s.value;`);
    const state = () => ev("const p = window.__t180Reference(); const st = p.state(); return { mode: st.mode, kind: st.kind, picked: st.picked, triangles: st.triangles, error: st.error, readout: st.readout, timing: st.timing };");
    const opts = () => ev(`return [...${sel(0)}.options].map((o) => ({ text: o.textContent, disabled: o.disabled }));`);
    out.optionsLine = await opts();
    await change(1, 'road'); await sleep(300);
    out.optionsRoad = await opts(); out.idleReadoutRoad = (await state()).readout;
    const cam = (m) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(m)}); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
    await cam('Overhead');
    for (const alias of ['N3', 'N53']) {
      await ev('window.__long && (window.__long.length = 0); return true;');
      const t0 = Date.now(); await change(0, `reference ${alias}\u0000`);
      let st = await state(); for (let i = 0; i < 200 && st.picked !== `reference ${alias}\u0000` && !st.error; i++) { await sleep(50); st = await state(); }
      const ms = Date.now() - t0;
      const frames = await ev("const t = []; await new Promise((r) => { const s = performance.now(); const f = (x) => { t.push(x); if (x - s < 2000) requestAnimationFrame(f); else r(); }; requestAnimationFrame(f); }); const d = t.slice(1).map((x, i) => x - t[i]).sort((a, b) => a - b); return { n: d.length, median: +d[Math.floor(d.length / 2)].toFixed(1), p95: +d[Math.floor(d.length * 0.95)].toFixed(1) };");
      out.picks.push({ alias, msUntilShown: ms, ...st, longTasksMs: await ev('return window.__long ? window.__long.map((x) => Math.round(x)) : null;'), frames });
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(1200);
      await shot(`overhead_${alias}.png`);
      for (let i = 0; i < 8; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 450, deltaX: 0, deltaY: 120 }); await sleep(200); }
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(1500);
      await shot(`overhead_${alias}_out.png`);
      await cam('Overhead');
    }
    // V3j in the real page: N53 shown as Road; the mode select to Line; back to Road
    const calls0 = await ev('return window.__calls.length;');
    await change(1, 'line'); await sleep(800); const inLine = await state();
    await change(1, 'road'); await sleep(1500); const back = await state();
    out.modeSwitch = { inLine, backInRoad: back, nativeCallsDuring: await ev(`return window.__calls.slice(${calls0});`) };
    out.title = await ev('return document.title;');
  } finally {
    fs.writeFileSync(path.join(OUT, 'page_r.json'), JSON.stringify(out, null, 1));
    try { ws.close(); } catch (e) { /* */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e); process.exit(1); });
