// filemenu_probe.js (pane O, L255): the File title's box and the open File menu's box, at widths 900 to 1400 in 10 px steps (and 979.2 and 1279.2, the 125%
// widths), in every look, headless; plus each other menu's box at 900. Read only. usage: node filemenu_probe.js <tree>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.argv[2];
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l255o-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error('page'); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  const out = {};
  for (const look of ['sigil', 'aqua', 'skyline', 'glass', 'aurora', 'skyline-night']) {
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    const rows = [];
    const widths = []; for (let w = 900; w <= 1400; w += 10) widths.push(w);
    for (const [w, dpr] of [...widths.map((w) => [w, 1]), [979.2, 1.25], [1279.2, 1.25]]) {
      await send('Emulation.setDeviceMetricsOverride', { width: Math.round(w * dpr), height: 860, deviceScaleFactor: dpr, mobile: false }); await sleep(120);
      await send('Emulation.setDeviceMetricsOverride', { width: Math.round(w * dpr / dpr), height: 860, deviceScaleFactor: dpr, mobile: false }); await sleep(120);
      rows.push(await ev("const d = document.getElementById('m-file'); d.open = true; await new Promise((r) => setTimeout(r, 80)); const t = d.querySelector('summary').getBoundingClientRect(), m = d.querySelector('.more-menu').getBoundingClientRect(); d.open = false; return [window.innerWidth, Math.round(t.left), Math.round(t.right), Math.round(m.left), Math.round(m.right)];"));
    }
    await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 860, deviceScaleFactor: 1, mobile: false }); await sleep(200);
    const others = await ev("const o = {}; for (const d of document.querySelectorAll('header details.more')) { d.open = true; await new Promise((r) => setTimeout(r, 80)); const m = d.querySelector('.more-menu').getBoundingClientRect(); o[d.id] = [Math.round(m.left), Math.round(m.right)]; d.open = false; } return o;");
    const bad = rows.filter((r) => r[3] < 0 || r[4] > r[0]);
    out[look] = { outside: bad.map((r) => `${r[0]}: title ${r[1]}..${r[2]}, menu ${r[3]}..${r[4]}`), at900: rows[0], at1400: rows[widths.length - 1], others900: others };
  }
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify(out, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
