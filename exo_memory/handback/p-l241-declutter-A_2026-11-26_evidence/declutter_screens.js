// declutter_screens.js (pane A, L241): his view of the turn marks, before and after. The real page (app/index.html of TREE) in headless Chrome, with a stand-in for the
// native side that serves HIS saved pieces read-only from his pieces folder (nothing is written there). Steps: a 2-piece lead, the Pieces bin, a click on PIECE (the ghost
// with its numbers in the boxes, as in his screenshot), the Free view; then three pictures: at rest, the pointer over one bank mark, the pointer over one turn mark.
// usage: TREE=<builder tree> node declutter_screens.js <out dir> [hover json]
//   The marks are found by recording the dots the marks' canvas draws (after-tree). For the before-tree, pass the after run's printed "hover" json so the pointer goes to
//   the same screen points (same page, same camera).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-declutter';
const PIECE = process.env.PIECE || 'Smooth S straight';
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const out = process.argv[2], hoverGiven = process.argv[3] ? JSON.parse(process.argv[3]) : null;
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l241-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(out, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };
    // record the dots the marks' canvas draws each frame (arc, then fill): css px of the canvas, and their colour
    (() => { const P = CanvasRenderingContext2D.prototype, arc0 = P.arc, fill0 = P.fill; let pend = null;
      window.__dots = []; window.__dotsNext = [];
      P.arc = function (x, y, r, a, b) { if (this.canvas.getAttribute('aria-label') === 'later changes' && r < 6) pend = { x, y, r }; return arc0.apply(this, arguments); };
      P.fill = function () { if (pend && this.canvas.getAttribute('aria-label') === 'later changes') { window.__dotsNext.push({ ...pend, colour: String(this.fillStyle) }); pend = null; } return fill0.apply(this, arguments); };
      const C = P.clearRect; P.clearRect = function () { if (this.canvas.getAttribute('aria-label') === 'later changes') { window.__dots = window.__dotsNext; window.__dotsNext = []; } return C.apply(this, arguments); };
    })();`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  const view = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Free'); if (!b) return 'no Free button'; b.click(); await new Promise((r) => setTimeout(r, 1200)); return 'Free';");
  // nearer his screenshot's camera (above the S, looking down at it): fly up with Space for RISE ms, back with S for BACK ms, then a right-button look drag LOOK px down
  const RISE = +(process.env.RISE || 1500), BACK = +(process.env.BACK || 0), LOOK = +(process.env.LOOK || 160);
  const key = async (code, k, ms) => { if (!(ms > 0)) return; await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: k === ' ' ? 32 : k.toUpperCase().charCodeAt(0) }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: k === ' ' ? 32 : k.toUpperCase().charCodeAt(0) }); await sleep(300); };
  await ev("document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;");
  await key('Space', ' ', RISE); await key('KeyS', 's', BACK);
  if (LOOK) { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 }); for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 }); await sleep(600); }
  // the pointer off the stage's marks: at the bottom-left corner of the page
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(2500);   // past any 2 s flash
  await shot('rest.png');
  const canvasBox = await ev("const c = [...document.querySelectorAll('canvas')].find((x) => x.getAttribute('aria-label') === 'later changes'); if (!c) return null; const r = c.getBoundingClientRect(); return { left: r.left, top: r.top };");
  const dots = await ev('return window.__dots;');
  let hover = hoverGiven;
  if (!hover) {
    const count = {}; for (const d of dots || []) count[d.colour] = (count[d.colour] || 0) + 1;
    const cols = Object.keys(count).sort((a, b) => count[b] - count[a]);   // the S has 5 bank marks and 2 turn marks: the commoner colour is the bank's
    const pick = (col) => { const d = (dots || []).filter((x) => x.colour === col), other = (dots || []).filter((x) => x.colour !== col), far = (x) => Math.min(...other.map((o) => Math.hypot(o.x - x.x, o.y - x.y)), 1e9); const m = d.filter((x) => x.x > 270).sort((p, q) => far(q) - far(p))[0]; return m && canvasBox ? { x: canvasBox.left + m.x, y: canvasBox.top + m.y, colour: col } : null; };
    hover = { bank: pick(cols[0]), turn: pick(cols[1]) };
  }
  const state = {};
  for (const k of ['bank', 'turn']) {
    const h = hover[k]; if (!h) { state[k] = 'no dot found'; continue; }
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: h.x, y: h.y }); await sleep(600);
    await shot(`hover_${k}.png`);
    state[k] = await ev("return [...document.querySelectorAll('canvas')].length;");
  }
  console.log(JSON.stringify({ tree: T, piece: PIECE, view, dotsAtRest: (dots || []).length, dots: (dots || []).map((d) => [Math.round(d.x + (canvasBox ? canvasBox.left : 0)), Math.round(d.y + (canvasBox ? canvasBox.top : 0)), d.colour]), dotColours: [...new Set((dots || []).map((d) => d.colour))], hover, pageErrors: errors }, null, 1));
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
})().catch((e) => { console.error(e); process.exit(1); });
