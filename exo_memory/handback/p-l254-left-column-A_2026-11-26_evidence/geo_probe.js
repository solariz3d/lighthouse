// geo_probe.js (pane A, L254): where the left column and everything placed against it sit, in the real page of TREE, per look and window size.
// Headless per BUILDING.md: the builder's launchChrome (--mute-audio), document.title = 'zz-headless-test' before anything else.
// usage: TREE=<builder tree> node geo_probe.js [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const LOOKS = process.argv.slice(2).length ? process.argv.slice(2) : ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const SIZES = [[1400, 860], [1000, 700]];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.wav': 'audio/wav' };
(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180a-l254g-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  const out = { chrome: (await send('Browser.getVersion')).result.product, rows: [] };
  for (const look of LOOKS) for (const [w, h] of SIZES) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(500);
    out.rows.push({ look, size: `${w}x${h}`, ...(await ev(`const R = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.right * 10) / 10, Math.round(r.bottom * 10) / 10]; };
      const L = document.getElementById('left'), s = getComputedStyle(L), hud = document.querySelector('.preview-hud');
      return { theme: document.documentElement.getAttribute('data-theme'), header: R(document.querySelector('header')), banner: R(document.getElementById('banner')), left: R(L), leftScrollH: L.scrollHeight, leftClientW: L.clientWidth,
        margin: s.margin, radius: s.borderRadius, opacity: s.opacity, clip: s.clipPath, maxH: s.maxHeight, cols: getComputedStyle(document.body).gridTemplateColumns,
        hud: R(hud), hudText: hud && hud.textContent.trim().slice(0, 40), hudTop: getComputedStyle(document.getElementById('stage')).getPropertyValue('--hud-top'),
        values: R(document.querySelector('[aria-label="piece values"]')), guideOpen: R(document.querySelector('.guide-open')), guideCard: R(document.querySelector('.guide-card')),
        cameraBar: R(document.querySelector('#camera [role="toolbar"]')), cameraKeys: R(document.querySelector('#camera .camera-keys')), canvas: R(document.querySelector('#preview canvas')),
        exportBanner: R(document.getElementById('exportbanner')), openSupported: (() => { try { document.querySelector('select:open'); return true; } catch (e) { return false; } })() };`)) });
  }
  console.log(JSON.stringify(out, null, 1));
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
})().catch((e) => { console.error(e); process.exit(1); });
