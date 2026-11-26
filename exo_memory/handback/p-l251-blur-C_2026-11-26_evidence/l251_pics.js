// l251_pics.js (pane C, L251): for his eye, per look, a hovered bank mark's label window over the road, from a tree (the branch, or 40e931e beside it). The real page
// (app/index.html of TREE) in headless Chrome by the tree's own launcher (app/test/soundrender.js: --mute-audio), titled zz-headless-test first and kept; a stand-in for the
// native side serving his pieces READ-ONLY (each file read once into memory; nothing is written there). Steps (pane A's L242 shots, themed_screens.js, with the camera
// set by the page's own 't180-camera-focus' so both trees see the same view): two Extends, the Pieces bin, PIECE clicked (the ghost and its marks), the camera focused
// on the station FOCUS of the way along the ghost; then the bank-coloured dot nearest the view's middle is hovered and the picture taken (full, and a crop around the
// dot). On a tree whose windows are elements, the shown window's computed backdrop-filter, corner and fill are read.
// usage: TREE=<tree> node l251_pics.js <out dir> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE), PIECE = process.env.PIECE || 'Coast Esses', FOCUS = +(process.env.FOCUS || 0.35), WHEEL = +(process.env.WHEEL || 0), AT1 = process.env.AT1 ? +process.env.AT1 : null, ONLY = process.env.ONLY ? +process.env.ONLY : null;
const { chromePath, launchChrome, connect } = require(path.join(T, 'app/test/soundrender.js'));
const outRoot = process.argv[2], LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['sigil', 'aqua', 'skyline', 'skyline-night', 'glass', 'aurora'];
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look) {
  const out = path.join(outRoot, look); fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180c-l251-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const shot = async (name, clip) => fs.writeFileSync(path.join(out, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `document.title = 'zz-headless-test'; new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); window.localStorage.setItem('t180.guide.done', '1'); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };
    (() => { const P = CanvasRenderingContext2D.prototype, arc0 = P.arc, fill0 = P.fill, C = P.clearRect; let pend = null;
      const lab = (c) => c.canvas.getAttribute('aria-label');
      window.__dots = []; window.__dotsNext = [];
      P.arc = function (x, y, r) { if (lab(this) === 'later changes' && r < 6) pend = { x, y }; return arc0.apply(this, arguments); };
      P.fill = function () { if (pend) { window.__dotsNext.push({ x: pend.x, y: pend.y, colour: String(this.fillStyle) }); pend = null; } return fill0.apply(this, arguments); };
      P.clearRect = function () { if (lab(this) === 'later changes') { window.__dots = window.__dotsNext; window.__dotsNext = []; } return C.apply(this, arguments); };
    })();`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  const themeOn = await ev("return document.documentElement.getAttribute('data-theme') || 'sigil';");
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1500)); return true;`);
  if (AT1 !== null) await ev(`const f = document.querySelector('#palette input[aria-label="bank at"]'); f.value = '${AT1}'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 1500)); return f.value;`);   // the first bank mark brought near the camera, in the panel's own box (this page only: nothing is saved)
  const g = await ev("let g = null; document.dispatchEvent(new CustomEvent('t180:ghost-request', { detail: { reply: (x) => { g = x; } } })); return g ? { s0: g.s0, s1: g.samples[g.samples.length - 1].s } : null;");
  const s = g ? g.s0 + (g.s1 - g.s0) * FOCUS : null;
  await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${s} } })); return true;`); await sleep(2500);
  for (let i = 0; i < WHEEL; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 500, deltaX: 0, deltaY: 120 }); await sleep(120); }   // the camera pulled back WHEEL notches, the same on both trees
  if (WHEEL) await sleep(1500);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(2500);
  await shot('rest.png');
  const mb = await ev("const c = [...document.querySelectorAll('canvas')].find((x) => x.getAttribute('aria-label') === 'later changes'); const r = c.getBoundingClientRect(); return { left: r.left, top: r.top };");
  const bank = await ev("const c = document.createElement('canvas').getContext('2d'); c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--mark-bank').trim() || '#4d86ff'; return c.fillStyle;");
  const dots = (await ev('return window.__dots;')) || [];
  const hs = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); return (l || []).map((h) => ({ x: h.x + r.left, y: h.y + r.top }));");   // a dot within a handle's reach hovers the handle, not the mark
  const banks = dots.filter((d) => String(d.colour).toLowerCase() === String(bank).toLowerCase()).map((d) => ({ x: mb.left + d.x, y: mb.top + d.y }))
    .filter((d) => d.x > 330 && d.x < 1450 && d.y > 160 && d.y < 860 && hs.every((h) => Math.hypot(h.x - d.x, h.y - d.y) > 16)).sort((p, q) => Math.hypot(p.x - 900, p.y - 520) - Math.hypot(q.x - 900, q.y - 520));
  let hover = null, win = null, clip = null;
  if (banks.length) {
    hover = banks[ONLY !== null ? Math.min(ONLY, banks.length - 1) : 0]; await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: hover.x, y: hover.y }); await sleep(800);
    clip = { x: Math.max(0, Math.round(hover.x - 330)), y: Math.max(0, Math.round(hover.y - 230)), width: 660, height: 300 };
    await shot('hover_bank.png'); await shot('hover_bank_crop.png', clip);
    win = await ev("const e = [...document.querySelectorAll('[data-mark-window]')].find((x) => getComputedStyle(x).display !== 'none'); if (!e) return null; const s = getComputedStyle(e), b = e.getBoundingClientRect(); return { layer: e.getAttribute('data-mark-window'), words: e.textContent, box: [b.left, b.top, b.width, b.height].map(Math.round), backdropFilter: s.backdropFilter, radius: s.borderTopLeftRadius, background: s.backgroundColor, under: (() => { const p = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return p ? p.tagName + (p.getAttribute('aria-label') ? '[' + p.getAttribute('aria-label') + ']' : '') : null; })() };");
  }
  const nodes = await ev("return document.querySelectorAll('[data-mark-window]').length;");
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  const dotColours = {}; for (const d of dots) { const k = String(d.colour).toLowerCase(); dotColours[k] = (dotColours[k] || 0) + 1; }
  return { look, themeOn, tree: T, focus: s, wheel: WHEEL, at1: AT1, handlesSeen: hs.length, dotColours, dotsAt: dots.map((d) => [Math.round(mb.left + d.x), Math.round(mb.top + d.y), String(d.colour).toLowerCase()]), bankColour: bank, bankDots: banks.length, hover, clip, window: win, windowNodes: nodes, title: 'zz-headless-test', pageErrors: errors };
}
(async () => { const all = []; for (const l of LOOKS) all.push(await one(l)); console.log(JSON.stringify(all, null, 1)); })().catch((e) => { console.error(e); process.exit(1); });
