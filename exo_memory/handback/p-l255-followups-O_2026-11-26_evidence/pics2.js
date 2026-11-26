// pics.js (pane O, L255): pictures for his eye, from the real page of a builder tree in HEADLESS Chrome (the repo's own launcher), local only.
// A clicked field (the track name, a real mouse click with focus emulation on, the pointer then moved away) in two looks, and Export with a real pointer
// on it in aurora, skyline and skyline-night, at rest and hovered. usage: node pics.js <tree> <out dir> <tag>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const [T, OUT, TAG] = process.argv.slice(2);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l255o-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  const load = async (look) => {
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); const st = document.createElement('style'); st.textContent = '#hovertip { display: none !important; }'; document.head.appendChild(st); return true;"); await sleep(300);
  };
  const rectOf = (sel) => ev(`const r = (${sel}).getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom];`);
  const shot = async (name, r, pad) => { const clip = { x: Math.max(0, r[0] - pad), y: Math.max(0, r[1] - pad), width: r[2] - r[0] + 2 * pad, height: r[3] - r[1] + 2 * pad, scale: 2 }; fs.writeFileSync(path.join(OUT, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip })).result.data, 'base64')); };
  const park = async () => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 850 }); await sleep(350); };
  const out = { stripCorner: {} };
  for (const look of ['sigil', 'aqua', 'skyline', 'glass', 'aurora', 'skyline-night']) { await load(look); out.stripCorner[look] = await ev("const e = document.querySelector('[aria-label=\"piece values\"]'); const p = document.createElement('i'); p.style.borderRadius = 'var(--r3)'; document.body.appendChild(p); const r3 = getComputedStyle(p).borderTopLeftRadius; p.remove(); return e ? [getComputedStyle(e).borderTopLeftRadius, r3] : 'missing';"); }
  for (const look of ['skyline', 'aurora']) {   // a clicked field: a light look and a dark one
    await load(look); await park();
    const r = await rectOf("document.getElementById('name')");
    await shot(`${TAG}_field_${look}_rest.png`, r, 14);
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });
    const at = [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2];
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: at[0], y: at[1], button: 'left', buttons: 1, clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: at[0], y: at[1], button: 'left', buttons: 0, clickCount: 1 });
    await park();
    out[`field ${look}`] = await ev("const f = document.getElementById('name'), s = getComputedStyle(f); return { focused: document.activeElement === f, focusVisible: f.matches(':focus-visible'), border: s.borderTopColor, outline: s.outlineStyle + ' ' + s.outlineWidth + ' ' + s.outlineColor };");
    await shot(`${TAG}_field_${look}_clicked.png`, r, 14);
    await ev("document.activeElement && document.activeElement.blur(); return true;");
    await send('Emulation.setFocusEmulationEnabled', { enabled: false });
  }
  for (const look of ['aurora', 'skyline', 'skyline-night']) {   // Export at rest and hovered
    await load(look); await park();
    const r = await rectOf("document.querySelector('header #install > button')");
    await shot(`${TAG}_export_${look}_rest.png`, r, 8);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: (r[0] + r[2]) / 2, y: (r[1] + r[3]) / 2 }); await sleep(350);
    out[`export ${look}`] = await ev("const b = document.querySelector('header #install > button'), s = getComputedStyle(b); return { hovered: b.matches(':hover'), background: s.backgroundImage === 'none' ? s.backgroundColor : s.backgroundImage.slice(0, 60) };");
    await shot(`${TAG}_export_${look}_hovered.png`, r, 8);
    await park();
  }
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ out, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
