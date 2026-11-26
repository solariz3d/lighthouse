// refactor_shots.js (pane C, L248): the spec draft laid over the REAL page as one CSS override (refactor_override.css), before and after, in all six looks.
// The page is builder 0ab6cc8's app/index.html, served read-only from a tree given in TREE; nothing in it is written. The native side is a stand-in that
// serves his pieces folder READ-ONLY (as A's L242 themed_screens.js did, whose set-up steps and camera this copies: Coast Esses, Free view, RISE 5000,
// BACK 1500, LOOK 70). Headless Chrome per BUILDING.md: --mute-audio, never focused, document.title "zz-headless-test" first and kept.
// Per look: Coast Esses laid; (before) the File menu open, then a dialog open; the override injected; (after) the same two. For skyline-night also the
// left column docked and floating (after). The dialog is askChoice's own DOM (app/askdialog.js: .ask-veil > .ask-card > h2, p, .ask-row), built in the
// page with words of mine, so no real command runs on his laid track.
// usage: TREE=<builder tree at 0ab6cc8> node refactor_shots.js <out dir>     then: node refactor_page.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');
const T = path.resolve(process.env.TREE || 'C:/Consonance/c-l248-wt');
const OUT = path.resolve(process.argv[2] || '.');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PIECE = 'Coast Esses', RISE = 5000, BACK = 1500, LOOK = 70;
const LOOKS = ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'], FLOAT_LOOK = 'skyline-night';
const OVERRIDE = fs.readFileSync(path.join(__dirname, 'refactor_override.css'), 'utf8');
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');   // read only
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look, log) {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180c-l248-'));
  const ch = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--window-size=1500,900', '--use-angle=d3d11', 'about:blank'], { stdio: 'ignore' });
  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await sleep(50);   // Chrome writes its port here when it listens
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
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
      return Promise.resolve(null); } } };`;
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
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(2000);
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'webp', quality: 88 }); fs.writeFileSync(path.join(OUT, `${look}_${name}.webp`), Buffer.from(d.result.data, 'base64')); };
  const menu = async (open) => { await ev(`const d = document.querySelector('#m-file'); d.open = ${open}; await new Promise((r) => setTimeout(r, 500)); return true;`); };
  const dialog = async (open) => ev(open ? `
      const doc = document, veil = doc.createElement('div'); veil.className = 'ask-veil'; veil.id = 'c-l248-ask';
      const card = doc.createElement('div'); card.className = 'ask-card'; card.setAttribute('role', 'alertdialog');
      const h = doc.createElement('h2'); h.textContent = 'Save the track before you close?';
      const p = doc.createElement('p'); p.textContent = 'Untitled has two pieces and a saved piece laid since the last save.';
      const row = doc.createElement('div'); row.className = 'ask-row';
      for (const [t, c] of [['Save', 'ask-main'], ["Don't save", 'ask-quiet'], ['Cancel', 'ask-quiet']]) { const b = doc.createElement('button'); b.textContent = t; b.className = c; row.appendChild(b); }
      card.append(h, p, row); veil.appendChild(card); doc.body.appendChild(veil); await new Promise((r) => setTimeout(r, 500)); return true;`
    : "const v = document.getElementById('c-l248-ask'); if (v) v.remove(); await new Promise((r) => setTimeout(r, 200)); return true;");
  const states = async (tag) => { await menu(true); await shot(`${tag}_menu`); await menu(false); await dialog(true); await shot(`${tag}_dialog`); await dialog(false); };
  await states('before');
  // the override, then a data-theme write so app/lib/tokens.js re-reads the canvas tokens (its MutationObserver)
  await ev(`const s = document.createElement('style'); s.id = 'c-l248-override'; s.textContent = ${JSON.stringify(OVERRIDE)}; document.head.appendChild(s);
    const r = document.documentElement, t = r.getAttribute('data-theme'); if (t !== null) r.setAttribute('data-theme', t); else { r.setAttribute('data-theme', ''); r.removeAttribute('data-theme'); }
    await new Promise((q) => setTimeout(q, 700)); return true;`);
  await states('after');
  if (look === FLOAT_LOOK) { await shot('after_docked'); await ev("document.documentElement.classList.add('c-float'); await new Promise((r) => setTimeout(r, 700)); return true;"); await shot('after_floating'); }
  const probe = await ev(`const g = (sel, k) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[k] : null; };
    return { rf: getComputedStyle(document.documentElement).getPropertyValue('--rf').trim(), button: g('#palette button', 'borderRadius'), menu: g('.more-menu', 'borderRadius'), left: g('#left', 'borderRadius'),
      exportBtn: g('header #install > button', 'borderRadius'), title: document.title };`);
  log.push({ look, themeOn, probe, pageErrors: errors });
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold a file; left in temp */ }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const log = [];
  for (const l of LOOKS) { await one(l, log); console.log(JSON.stringify(log[log.length - 1])); }
  fs.writeFileSync(path.join(OUT, 'shots_log.json'), JSON.stringify(log, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
