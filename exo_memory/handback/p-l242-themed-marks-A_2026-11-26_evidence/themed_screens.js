// themed_screens.js (pane A, L242): for each theme, the mark and handle windows. The real page (app/index.html of TREE) in headless Chrome, a stand-in for the native side
// serving his pieces folder read-only (nothing written there), the theme set as the app saves it (localStorage t180.settings.theme) before the page loads.
// Steps, as L241's pictures: a 2-piece lead, the Pieces bin, a click on PIECE (the ghost, its numbers in the boxes), the Free view, the same camera (RISE/BACK/LOOK);
// then per theme: rest.png, hover_bank.png (the pointer on a bank mark's dot), drag_handle.png (a field handle pressed and moved 40 px, the picture taken mid-drag).
// usage: TREE=<builder tree> node themed_screens.js <out dir> [theme ...]      (default: all six)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-declutter';
const PIECE = process.env.PIECE || 'Coast Esses';
const BAR_DY = +(process.env.BAR_DY || 22);
const RISE = +(process.env.RISE || 5000), BACK = +(process.env.BACK || 1500), LOOK = +(process.env.LOOK || 70);
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const outRoot = process.argv[2], THEMES = process.argv.slice(3).length ? process.argv.slice(3) : ['sigil', 'aqua', 'skyline', 'skyline-night', 'glass', 'aurora'];
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };

async function one(theme) {
  const out = path.join(outRoot, theme); fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l242-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(out, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(theme))}); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };
    // record each frame's dots on the marks' canvas, and the handles' bars (a rect, then its fill) on the handles' canvas: css px of the canvas, and their colour
    (() => { const P = CanvasRenderingContext2D.prototype, arc0 = P.arc, rect0 = P.rect, fill0 = P.fill, C = P.clearRect; let pend = null;
      const lab = (c) => c.canvas.getAttribute('aria-label');
      window.__dots = []; window.__dotsNext = []; window.__bars = []; window.__barsNext = [];
      P.arc = function (x, y, r) { if (lab(this) === 'later changes' && r < 6) pend = { k: 'dot', x, y }; return arc0.apply(this, arguments); };
      P.rect = function (x, y, w, h) { if (lab(this) === 'drag handles' && w >= 12 && w <= 16 && h <= 8) pend = { k: 'bar', x: x + w / 2, y: y + h / 2 }; return rect0.apply(this, arguments); };
      P.fill = function () { if (pend) { (pend.k === 'dot' ? window.__dotsNext : window.__barsNext).push({ x: pend.x, y: pend.y, colour: String(this.fillStyle) }); pend = null; } return fill0.apply(this, arguments); };
      P.clearRect = function () { const l = lab(this); if (l === 'later changes') { window.__dots = window.__dotsNext; window.__dotsNext = []; } if (l === 'drag handles') { window.__bars = window.__barsNext; window.__barsNext = []; } return C.apply(this, arguments); };
    })();`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  const themeOn = await ev("return document.documentElement.getAttribute('data-theme') || 'sigil';");
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Free'); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;");
  const key = async (code, k, ms) => { if (!(ms > 0)) return; const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); await sleep(300); };
  await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
  await key('Space', ' ', RISE); await key('KeyS', 's', BACK);
  if (LOOK) { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 }); for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 }); await sleep(600); }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(2500);
  await shot('rest.png');
  const boxOf = (labl) => ev(`const c = [...document.querySelectorAll('canvas')].find((x) => x.getAttribute('aria-label') === ${JSON.stringify(labl)}); if (!c) return null; const r = c.getBoundingClientRect(); return { left: r.left, top: r.top };`);
  const mb = await boxOf('later changes'), hb = await boxOf('drag handles'),   // the bars are placed by the marks canvas's box: the handles canvas's own box read 24 px lower than where its bars land (seen in the pictures)
    dots = await ev('return window.__dots;'), bars = await ev('return window.__bars;');
  // the bank's dot: the commoner dot colour (5 bank marks, 2 turn), the one farthest from any turn dot, right of the column
  const count = {}; for (const d of dots || []) count[d.colour] = (count[d.colour] || 0) + 1;
  const cols = Object.keys(count).sort((a, b) => count[b] - count[a]), bankC = cols[0], turnC = cols[1];
  const far = (x) => Math.min(...(dots || []).filter((o) => o.colour !== bankC).map((o) => Math.hypot(o.x - x.x, o.y - x.y)), 1e9);
  const bd = (dots || []).filter((d) => d.colour === bankC && d.x + mb.left > 270).sort((p, q) => far(q) - far(p))[0];
  let hover = null;
  if (bd && mb) { hover = { x: mb.left + bd.x, y: mb.top + bd.y }; await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: hover.x, y: hover.y }); await sleep(700); await shot('hover_bank.png'); }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(500);
  // a field handle: the bank's own bar (the bank's colour) nearest the middle of the view, else any bar
  const pickBar = (bars || []).filter((b) => b.x + mb.left > 300 && b.y + mb.top > 150 && b.y + mb.top < 700).sort((p, q) => (p.colour === bankC ? 0 : 1) - (q.colour === bankC ? 0 : 1) || Math.abs(p.x - 600) - Math.abs(q.x - 600))[0];
  let drag = null;
  if (pickBar && mb) {
    drag = { x: mb.left + pickBar.x, y: mb.top + pickBar.y - BAR_DY, colour: pickBar.colour };   // BAR_DY: measured, not explained: the bars land 22 px above where the recorded rect plus the canvas box put them (sigil drag picture, red bar 686 -> 664)
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: drag.x, y: drag.y }); await sleep(200);
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: drag.x, y: drag.y, button: 'left', buttons: 1, clickCount: 1 });
    for (let i = 1; i <= 8; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: drag.x, y: drag.y - 5 * i, button: 'left', buttons: 1 }); await sleep(40); }
    await sleep(500); await shot('drag_handle.png');
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: drag.x, y: drag.y - 40, button: 'left', buttons: 0, clickCount: 1 }); await sleep(300);
  }
  const style = await ev("const s = getComputedStyle(document.documentElement); return Object.fromEntries(['--mark-win-font', '--mark-win-radius', '--mark-win-bg', '--mark-win-glow', '--mark-bank', '--mark-turn'].map((k) => [k, s.getPropertyValue(k).trim()]));");
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  return { bars: (bars || []).map((b) => [Math.round(b.x + mb.left), Math.round(b.y + mb.top), b.colour]), hb, theme, themeOn, dots: (dots || []).length, bankColour: bankC, turnColour: turnC, hover, drag, style, pageErrors: errors };
}
(async () => { const all = []; for (const t of THEMES) all.push(await one(t)); console.log(JSON.stringify(all, null, 1)); })().catch((e) => { console.error(e); process.exit(1); });
