// o_fit.js (pane O, L260 track 6, plan only; scratch): where does each door at the top fit? menubar-page row 17's OWN measure (its BAR expression,
// copied verbatim from app/test/menubar-page.test.js at f3cd425) at row 17's twelve widths, in SIGIL and Skyline, for: no door (today), A "Track overlay"
// (a header button before Export), A2 "Overlay" (the same button, short), B "Overlay ▾" (a menu title of its own after View). Prints numbers only.
// Headless rule as o_mock_overlay.js. No picture.
//   node o_fit.js <f3cd425 tree>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const T = path.resolve(process.argv[2]);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const BAR = (d) => `const d = ${d}, lines = (e) => { const r = d.createRange(); r.selectNodeContents(e); return new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size; };
  const head = d.querySelector('header'), wb = d.getElementById('winctl').getBoundingClientRect(), box = (s) => d.querySelector(s).getBoundingClientRect().width;
  const parts = [...d.querySelectorAll('header details > summary')].concat([...d.querySelectorAll('#install > button')]);
  return { width: d.documentElement.getBoundingClientRect().width, overflow: head.scrollWidth - head.clientWidth, win: { left: wb.left, right: wb.right, width: wb.width },
    drag: box('header .drag'), h1: box('header h1'), name: box('#name'),
    parts: parts.map((e) => { const b = e.getBoundingClientRect(); return { text: e.textContent.trim(), lines: lines(e), right: b.right, width: b.width }; }) };`;
const DOOR = {
  none: '',
  A: "const b = document.createElement('button'); b.className = 'overlay-door'; b.textContent = 'Track overlay'; b.style.whiteSpace = 'nowrap'; document.getElementById('install').before(b);",
  A2: "const b = document.createElement('button'); b.className = 'overlay-door'; b.textContent = 'Overlay'; b.style.whiteSpace = 'nowrap'; document.getElementById('install').before(b);",
  B: "const d = document.createElement('details'); d.className = 'more'; d.innerHTML = '<summary>Overlay ▾</summary><div class=\"more-menu\"></div>'; document.getElementById('m-view').after(d);",
};
(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l260f-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text).slice(0, 200)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 300)}`); return d.result.result.value; };
  const out = { errors, rows: [] };
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', { source: "document.title = 'zz-headless-test'; new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });" });
    for (const look of ['sigil', 'skyline']) for (const w of [900, 979, 980, 999, 1000, 1099, 1100, 1279, 1280, 1319, 1320, 1400]) for (const door of Object.keys(DOOR)) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 860, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(200);
      await ev(`localStorage.clear(); ${look === 'sigil' ? '' : `localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))});`} return true;`);
      await send('Page.navigate', { url: base });
      for (let i = 0; i < 150; i++) { await sleep(150); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      await ev(`${DOOR[door]} return true;`); await sleep(250);
      const m = await ev(BAR('document'));
      const doorPart = door === 'none' ? null : await ev(`const e = document.querySelector('${door === 'B' ? 'header details:last-of-type > summary' : '.overlay-door'}'); const r = e.getBoundingClientRect(); const rg = document.createRange(); rg.selectNodeContents(e); return { right: Math.round(r.right), width: Math.round(r.width), lines: new Set([...rg.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size };`);
      out.rows.push({ look, w, door, overflow: Math.round(m.overflow), drag: Math.round(m.drag), winInside: m.win.left >= 0 && m.win.right <= m.width + 0.5, partsOneLine: m.parts.every((p) => p.lines === 1), partsLeftOfWin: m.parts.every((p) => p.right <= m.win.left + 0.5), doorPart, title: await ev('return document.title;') });
    }
  } catch (e) { out.fatal = String(e && e.message || e); }
  finally { try { ws.close(); } catch (e) { /* */ } try { ch.kill(); } catch (e) { /* */ } await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { out.profileLeft = dir; } srv.close(); }
  const ok = (r) => r.overflow <= 0 && r.drag >= 24 && r.winInside && r.partsOneLine && r.partsLeftOfWin && (!r.doorPart || r.doorPart.lines === 1);
  out.summary = {}; for (const look of ['sigil', 'skyline']) for (const door of Object.keys(DOOR)) { const rs = out.rows.filter((r) => r.look === look && r.door === door); out.summary[`${look} ${door}`] = { fitsAt: rs.filter(ok).map((r) => r.w), failsAt: rs.filter((r) => !ok(r)).map((r) => `${r.w} (overflow ${r.overflow}, drag ${r.drag})`) }; }
  console.log(JSON.stringify(out, null, 1));
})();
