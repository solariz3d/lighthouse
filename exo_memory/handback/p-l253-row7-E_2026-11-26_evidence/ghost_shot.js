// ghost_shot.js (pane E, L253; scratch, never committed): one picture of the real page at 1400 x 860 with a saved piece's ghost up, for his eye.
// usage: node ghost_shot.js <tree> <look> <out.png>
// Headless only, through the tree's own launcher (app/test/soundrender.js launchChrome: --headless=new, --mute-audio, a browser slot); the page titled
// 'zz-headless-test' before anything else is done and kept so. The native side is a stand-in serving one saved piece "bend" (no recipe), as row 7b does.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const [TREE, LOOK = 'sigil', OUT] = process.argv.slice(2);
const REPO = path.resolve(TREE);
const { chromePath, launchChrome } = require(path.join(REPO, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l253e-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('socket')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(JSON.stringify(d.result).slice(0, 400)); return d.result.result.value; };
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
    const { createCoreShell } = require(path.join(REPO, 'app/core/coreshell.js')), PC = require(path.join(REPO, 'src/core/piece.js'));
    const s = await createCoreShell({ autosaveMs: 0 }); s.extend({ length: 120, family: 'bowl' });
    const text = PC.serialize(PC.saveRun(s.getState().history.present, 0, 0, { name: 'bend' }));
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.title = 'zz-headless-test'; window.__TAURI__ = { core: { invoke: (cmd, a) => cmd === 'list_pieces' ? Promise.resolve(['bend'])
      : cmd === 'open_piece' && a && a.name === 'bend' ? Promise.resolve(${JSON.stringify(text)}) : /^list_/.test(cmd) ? Promise.resolve([]) : Promise.resolve(null) }, event: { listen: () => Promise.resolve(() => {}) } };` });
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev(`document.title = 'zz-headless-test'; localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(LOOK))}); return true;`);
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; return true;");
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); for (let i = 0; i < 2; i++) { b.click(); await new Promise((r) => setTimeout(r, 250)); } return true;");
    await ev(`document.getElementById('pieces').open = true; for (let i = 0; i < 40 && !document.querySelector('#pieces-bin .piece-row[data-piece="bend"]'); i++) await new Promise((r) => setTimeout(r, 100));
      const row = document.querySelector('#pieces-bin .piece-row[data-piece="bend"]'); if (row) row.click(); return !!row;`);
    await sleep(1500);
    const r = await ev(`const at = (t) => { const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === t); const q = b.getBoundingClientRect(); return t + ' ' + Math.round(q.top) + '-' + Math.round(q.bottom); };
      return { title: document.title, at: ['Extend', 'Place piece', 'Cancel piece'].map(at), note: (document.querySelector('[aria-label="saved piece shown"]') || {}).textContent };`);
    const png = Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64');
    fs.writeFileSync(OUT, png);
    console.log(JSON.stringify({ look: LOOK, ...r, errors, bytes: png.length }));
  } finally { try { ws.close(); } catch (e) { /* */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ } }
})().catch((e) => { console.error(e); process.exit(1); });
