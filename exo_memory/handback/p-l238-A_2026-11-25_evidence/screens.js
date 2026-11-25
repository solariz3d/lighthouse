// screens.js (pane A, L238): two screenshots of the real page (app/index.html) in headless Chrome, with a stand-in for the native side that serves HIS saved pieces (read from his pieces folder)
// and their recipes: (1) a saved piece clicked: the ghost, the boxes filled, Place piece visible; (2) the same after one box (the length) is changed.
// usage: TREE=<builder tree> node screens.js <out dir> [piece name]      Nothing is written into his folder.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-piece';
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const TWEAK = process.env.TWEAK ? JSON.parse(process.env.TWEAK) : process.env.CONTROL ? ['length m', '220'] : ['extra turn °', '70'];   // one box changed: the piece's first extra turn 92 -> 70 (a length of 220 would put its later marks past its end)
const out = process.argv[2], NAME = process.argv[3] || 'Smooth S as driven';
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l238-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');                                   // a short lead to attach the piece to
  if (!process.env.CONTROL) await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  if (!process.env.CONTROL) await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(NAME)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  const state = await ev(`const f = (t) => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.children[0] && x.children[0].textContent === t); return l ? l.children[1].value : null; };
    const pb = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Place piece');
    const note = document.querySelector('#palette [aria-label="saved piece shown"]');
    return { place: pb ? getComputedStyle(pb).display : 'none', length: f('length m'), turn: f('turn °'), bank: f('bank °'), note: note ? note.textContent : null, menuOpen: document.getElementById('pieces').open };`);
  await ev("const pb = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Place piece'); if (pb) pb.scrollIntoView({ block: 'center' }); return true;"); await sleep(500);
  fs.writeFileSync(path.join(out, 'piece_clicked.png'), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  await ev("const l = [...document.querySelectorAll('#palette label')].find((x) => x.children[0] && x.children[0].textContent === " + JSON.stringify(TWEAK[0]) + "); const i = l.children[1]; i.value = " + JSON.stringify(TWEAK[1]) + "; i.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, " + (+process.env.WAIT2 || 1200) + ")); return true;");
  const state2 = await ev(`const pb = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Place piece'); const l = [...document.querySelectorAll('#palette label')].find((x) => x.children[0] && x.children[0].textContent === 'length m');
    return { place: pb ? getComputedStyle(pb).display : 'none', length: l.children[1].value };`);
  fs.writeFileSync(path.join(out, 'piece_tweaked.png'), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  console.log(JSON.stringify({ name: NAME, state, state2, pageErrors: errors }, null, 1));
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
})().catch((e) => { console.error(e); process.exit(1); });
