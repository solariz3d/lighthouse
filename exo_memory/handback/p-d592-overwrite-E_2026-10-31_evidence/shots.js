// shots.js (D592, pane E): both overwrite questions on the real page (app/index.html of the d592 worktree) in HEADLESS Chrome, in every look, as PNGs.
// The page's own askChoice (app/askdialog.js) shows the page's own questions (app/core/overwrite.js saveQuestion / installQuestion), both loaded through the
// page's own loader (window.loadCjs), so the card is the one Save and Export to Assetto Corsa show. Never a window: Chrome is started --headless=new.
//   node shots.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = 'C:/Users/nname/Downloads/t180-wt-e592';
const { chromePath, launchChrome } = require(path.join(REPO, 'app/test/soundrender.js'));
const OUT = process.argv[2];
const LOOKS = ['sigil', 'aqua', 'skyline', 'skyline-night', 'glass', 'aurora'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(REPO))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180d592-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('the DevTools socket failed')); });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 400)}`); return d.result.result.value; };
  const shot = async (file) => fs.writeFileSync(file, Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  const written = [];
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
    for (const look of LOOKS) {
      await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
      await send('Page.navigate', { url: base });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
      const theme = await ev('return document.documentElement.dataset.theme || "(none)";');
      const ask = (q) => `const get = (p) => fetch('../' + p).then((r) => r.text()); const OW = await window.loadCjs('app/core/overwrite.js', get); const { askChoice } = await window.loadCjs('app/askdialog.js', get);
        window.__ans = askChoice(document, OW.${q}); await new Promise((r) => setTimeout(r, 400)); return !!document.querySelector('.ask-card');`;
      const close = "document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return await window.__ans;";
      if (!(await ev(ask("saveQuestion({ name: 'ELYSIUM', savedAt: new Date(2026, 9, 22, 19, 37).getTime() })")))) throw new Error(`${look}: the save card did not show`);
      const f1 = path.join(OUT, `${look}-save.png`); await shot(f1); written.push(f1);
      const a1 = await ev(close);
      if (!(await ev(ask("installQuestion({ folder: 't180b_ELYSIUM', written: '2026-10-22T19:37:36.000Z' })")))) throw new Error(`${look}: the install card did not show`);
      const f2 = path.join(OUT, `${look}-install.png`); await shot(f2); written.push(f2);
      const a2 = await ev(close);
      console.log(`${look} (data-theme ${theme}): save card shot, Escape answered ${a1}; install card shot, Escape answered ${a2}`);
    }
  } finally {
    try { ws.close(); } catch (e) { /* closing */ }
    ch.kill(); srv.close(); await sleep(500);
    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  }
  for (const f of written) console.log(`${f} ${fs.statSync(f).size} bytes`);
})().catch((e) => { console.error(e.stack || e.message); process.exit(1); });
