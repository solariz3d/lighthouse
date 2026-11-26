// l254_shots.js (pane A, L254): the pictures for his eye (packet L254, "For his eye"), from the REAL branch with no override: per look, the left column SHOWN (the
// pointer on it) and CLEARED (the pointer on the preview, the delay and the fade past), and in one look (SIGIL) three frames of the fade, the transition paused at
// 0, 100 and 200 ms. Set-up as my L249 l249_shots.js (C's L248 refactor_shots.js): Coast Esses from his pieces folder READ-ONLY (a stand-in native side, nothing
// written there), here PLACED (Place piece) so no ghost row holds the column; the Free view, RISE 5000 / BACK 1500 / LOOK 70, at 1500 x 900. Headless Chrome through
// the builder's own launcher (soundrender.js launchChrome: --mute-audio, the browser cap); document.title is zz-headless-test first on the blank page and kept by an
// observer (BUILDING.md's headless rule). usage: AFTER=<tree> node l254_shots.js <out dir> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.AFTER);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const OUT = path.resolve(process.argv[2]);
const LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const PIECE = 'Coast Esses', RISE = 5000, BACK = 1500, LOOK = 70, W = 1500, H = 900;
const STRAFE = Number(process.env.STRAFE || 0);   // ms of D held after the rise, so the road runs under the column (its place is what clearing it shows)
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');   // read only
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };
const ON = [120, 450], OFF = [1300, 300], EDGE = [5, 450];

async function one(look, log) {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${W},${H}`], 't180a-l254-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 300)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");   // first, on the blank page
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  const stand = `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  const themeOn = await ev("return document.documentElement.getAttribute('data-theme') || 'sigil';");
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)} && x.offsetParent); if (!b) return false; b.click(); await new Promise((r) => setTimeout(r, 600)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  await ev("const p = document.querySelector('#pieces'); if (p && p.open) p.open = false; return true;");
  const placed = await click('Place piece'); await sleep(1500);
  const piecesNow = await ev("const m = document.body.innerText.match(/(\\d+) pieces?/); return m ? Number(m[1]) : null;");
  await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Free'); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;");
  const key = async (code, k, ms) => { const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); };
  await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
  await key('Space', ' ', RISE); await key('KeyS', 's', BACK); if (STRAFE) await key('KeyD', 'd', STRAFE);
  // for the pictures only: the hover card (the pointer rests on a titled field to hold the column shown) would cover the column; it is not what is shown here
  await ev("const st = document.createElement('style'); st.textContent = '#hovertip { display: none !important; }'; document.head.appendChild(st); return true;");
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 });
  for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); }
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 });
  const mv = (p) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] });
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'webp', quality: 88 }); fs.writeFileSync(path.join(OUT, `${look}_${name}.webp`), Buffer.from(d.result.data, 'base64')); };
  const state = () => ev("const L = document.getElementById('left'), r = L.getBoundingClientRect(), s = document.getElementById('left-return'); return { opacity: getComputedStyle(L).opacity, cleared: L.classList.contains('cleared'), box: [r.left, r.top, r.right, r.bottom].map(Math.round), strip: s ? [s.getBoundingClientRect().width, getComputedStyle(s).pointerEvents] : null, title: document.title };");
  // SHOWN: the pointer on the column
  await mv(EDGE); await sleep(400); await mv(ON); await sleep(2000);
  const shown = await state(); await shot('shown');
  // CLEARED: the pointer on the preview, past the delay and the fade
  await mv(OFF); await sleep(1400);
  const cleared = await state(); await shot('cleared');
  const rec = { look, themeOn, placed, pieces: piecesNow, shown, cleared, pageErrors: errors };
  if (look === 'sigil') {
    // the fade in three frames: back through the strip, onto the column, off it; the moment it is cleared its opacity transition is paused and set to 0, 100 and 200 ms
    await mv(EDGE); await sleep(700); await mv(ON); await sleep(300); await mv(OFF);
    rec.fade = [];
    rec.fadePaused = await ev("const L = document.getElementById('left'); for (let i = 0; i < 200 && !L.classList.contains('cleared'); i++) await new Promise((r) => setTimeout(r, 5)); const a = L.getAnimations().find((x) => x.transitionProperty === 'opacity'); if (!a) return false; a.pause(); window.__fade = a; return true;");
    if (rec.fadePaused) {
      for (const t of [0, 100, 200]) {
        await ev(`window.__fade.currentTime = ${t}; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return true;`);
        rec.fade.push({ t, opacity: await ev("return getComputedStyle(document.getElementById('left')).opacity;") }); await shot(`fade${t}`);
      }
      await ev('window.__fade.finish(); return true;');
    }
  }
  log.push(rec);
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold a file; left in temp */ }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const log = [];
  for (const l of LOOKS) { await one(l, log); console.log(JSON.stringify(log[log.length - 1])); }
  fs.writeFileSync(path.join(OUT, 'shots_log.json'), JSON.stringify(log, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
