// l249_shots.js (pane A, L249): the before/after page's pictures, from the REAL branch with no override (packet L249, "For his eye"): per look, per tree
// (BEFORE = the base c9fe4f1, AFTER = the branch tip), the File menu open, a dialog open, and one hovered label window (the pointer on a bank mark's dot).
// Set-up as C's L248 refactor_shots.js and my L242/L244 themed_screens.js: Coast Esses laid from his pieces folder READ-ONLY (a stand-in native side,
// nothing written there), the Free view, RISE 5000 / BACK 1500 / LOOK 70. The dialog is askChoice's own markup (.ask-veil > .ask-card > h2, p, .ask-row)
// with my words, so no command runs. Headless Chrome through the builder's own launcher (soundrender.js launchChrome: --mute-audio, the browser cap);
// document.title is zz-headless-test first on the blank page and kept by an observer (BUILDING.md's headless rule).
// usage: BEFORE=<tree> AFTER=<tree> node l249_shots.js <out dir> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const TREES = { before: path.resolve(process.env.BEFORE), after: path.resolve(process.env.AFTER) };
const { chromePath, launchChrome } = require(path.join(TREES.after, 'app/test/soundrender.js'));
const OUT = path.resolve(process.argv[2]);
const LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const PIECE = 'Coast Esses', RISE = 5000, BACK = 1500, LOOK = 70;
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');   // read only
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look, tag, log) {
  const T = TREES[tag];
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180a-l249-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 300)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");   // first, on the blank page
  await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };
    // each frame's dots on the marks' canvas (css px of that canvas, and their colour), as L242's themed_screens.js recorded them
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
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  await ev("const p = document.querySelector('#pieces'); if (p && p.open) p.open = false; return true;");
  await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Free'); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;");
  const key = async (code, k, ms) => { const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); };
  await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
  await key('Space', ' ', RISE); await key('KeyS', 's', BACK);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 });
  for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); }
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(2500);
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'webp', quality: 88 }); fs.writeFileSync(path.join(OUT, `${look}_${tag}_${name}.webp`), Buffer.from(d.result.data, 'base64')); };
  // the File menu
  await ev("document.querySelector('#m-file').open = true; await new Promise((r) => setTimeout(r, 500)); return true;"); await shot('menu');
  await ev("document.querySelector('#m-file').open = false; await new Promise((r) => setTimeout(r, 300)); return true;");
  // a dialog
  await ev(`const doc = document, veil = doc.createElement('div'); veil.className = 'ask-veil'; veil.id = 'a-l249-ask';
    const card = doc.createElement('div'); card.className = 'ask-card'; card.setAttribute('role', 'alertdialog');
    const h = doc.createElement('h2'); h.textContent = 'Save the track before you close?';
    const p = doc.createElement('p'); p.textContent = 'Untitled has two pieces and a saved piece laid since the last save.';
    const row = doc.createElement('div'); row.className = 'ask-row';
    for (const [t, c] of [["Don't save", 'ask-quiet'], ['Cancel', ''], ['Save', 'ask-main']]) { const b = doc.createElement('button'); b.textContent = t; if (c) b.className = c; row.appendChild(b); }
    card.append(h, p, row); veil.appendChild(card); doc.body.appendChild(veil); await new Promise((r) => setTimeout(r, 500)); return true;`);
  await shot('dialog');
  await ev("const v = document.getElementById('a-l249-ask'); if (v) v.remove(); await new Promise((r) => setTimeout(r, 300)); return true;");
  // a hovered label window: the pointer on a bank mark's dot (the commoner dot colour; the one farthest from any other colour, right of the column)
  const mb = await ev("const c = [...document.querySelectorAll('canvas')].find((x) => x.getAttribute('aria-label') === 'later changes'); if (!c) return null; const r = c.getBoundingClientRect(); return { left: r.left, top: r.top };");
  const dots = await ev('return window.__dots;') || [];
  const count = {}; for (const d of dots) count[d.colour] = (count[d.colour] || 0) + 1;
  const bankC = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
  const far = (x) => Math.min(...dots.filter((o) => o.colour !== bankC).map((o) => Math.hypot(o.x - x.x, o.y - x.y)), 1e9);
  const bd = mb && dots.filter((d) => d.colour === bankC && d.x + mb.left > 300).sort((p, q) => far(q) - far(p))[0];
  let hover = null;
  if (bd) { hover = { x: Math.round(mb.left + bd.x), y: Math.round(mb.top + bd.y) }; await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: hover.x, y: hover.y }); await sleep(800); await shot('label'); }
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(300);
  const probe = await ev(`const g = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).borderTopLeftRadius : null; }, s = getComputedStyle(document.documentElement);
    return { factor: s.getPropertyValue('--radius-factor').trim(), button: g('#palette button'), menu: g('.more-menu'), left: g('#left'), exportBtn: g('header #install > button'),
      winRadius: s.getPropertyValue('--mark-win-radius').trim(), winGlow: s.getPropertyValue('--mark-win-glow').trim(), title: document.title };`);
  log.push({ look, tag, themeOn, dots: dots.length, hover, probe, pageErrors: errors });
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold a file; left in temp */ }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const log = [];
  for (const l of LOOKS) for (const tag of ['before', 'after']) { await one(l, tag, log); console.log(JSON.stringify(log[log.length - 1])); }
  fs.writeFileSync(path.join(OUT, 'shots_log.json'), JSON.stringify(log, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
