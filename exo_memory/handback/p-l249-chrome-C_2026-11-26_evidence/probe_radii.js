// probe_radii.js (pane C, L249): the computed corners and shadows of aqua's and aurora's chrome in the REAL page, served read-only from TREE.
// index.html's --r1..--r4 are pane A's (not on l249-c), so with STUB=1 a stand-in for them is injected, written as the packet names them: --rN is its px at
// factor 1 times --radius-factor, defined on :root, with SIGIL's 0.5 as a :where() default so the skin's own [data-theme] factor wins. STUB=0 shows what
// l249-c alone draws (no scale: a var() with no value). Headless Chrome per BUILDING.md: --mute-audio, never focused, title "zz-headless-test" first and kept.
// No pieces folder is read; nothing in the tree is written. The dialog is askChoice's own DOM built in the page (app/askdialog.js), words of mine.
// usage: TREE=<builder tree> STUB=0|1 node probe_radii.js <look> [<look> ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn } = require('child_process');
const T = path.resolve(process.env.TREE), STUB = process.env.STUB === '1';
const LOOKS = process.argv.slice(2);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCALE = ':where(:root) { --radius-factor: .5; } :root { --r1: calc(2px * var(--radius-factor)); --r2: calc(4px * var(--radius-factor)); --r3: calc(8px * var(--radius-factor)); --r4: calc(12px * var(--radius-factor)); }';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look) {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180c-l249-'));
  const ch = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--window-size=1500,900', 'about:blank'], { stdio: 'ignore' });
  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await sleep(50);
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); } catch (e) {}
    window.__TAURI__ = { core: { invoke: () => Promise.resolve(null) } };` });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  if (STUB) await ev(`const s = document.createElement('style'); s.id = 'c-l249-scale'; s.textContent = ${JSON.stringify(SCALE)}; document.head.appendChild(s); await new Promise((r) => setTimeout(r, 300)); return true;`);
  await ev(`const d = document.querySelector('#m-file'); d.open = true; await new Promise((r) => setTimeout(r, 500));
    const v = document.createElement('div'); v.className = 'ask-veil'; v.id = 'c-l249-ask'; const c = document.createElement('div'); c.className = 'ask-card';
    const h = document.createElement('h2'); h.textContent = 'A dialog'; const row = document.createElement('div'); row.className = 'ask-row';
    for (const [t, k] of [['Main', 'ask-main'], ['Quiet', 'ask-quiet']]) { const b = document.createElement('button'); b.textContent = t; b.className = k; row.appendChild(b); }
    c.append(h, row); v.appendChild(c); document.body.appendChild(v); await new Promise((r) => setTimeout(r, 400)); return true;`);
  const read = () => ev(`const g = (sel, k) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[k] : '(none)'; };
    return { factor: getComputedStyle(document.documentElement).getPropertyValue('--radius-factor').trim(), r: ['--r1', '--r2', '--r3', '--r4'].map((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim()).join(' | '),
      hover: getComputedStyle(document.documentElement).getPropertyValue('--hover').trim(), accentHover: getComputedStyle(document.documentElement).getPropertyValue('--accent-hover').trim(),
      panelButton: g('#palette button', 'borderRadius'), menu: g('#m-file .more-menu', 'borderRadius'), menuItem: g('#m-file .more-menu button, #m-file .more-menu .menu-row', 'borderRadius'),
      left: g('#left', 'borderRadius'), exportBtn: g('header #install > button', 'borderRadius'), cameraDock: g('#camera [role="toolbar"]', 'borderRadius'), cameraHint: g('#camera p', 'borderRadius'),
      field: g('header input, header select', 'borderRadius'), panelSelect: g('#side select', 'borderRadius'), panelSelectCount: document.querySelectorAll('#side select').length, dialog: g('.ask-card', 'borderRadius'), dialogButton: g('.ask-card .ask-main', 'borderRadius'),
      dialogShadow: g('.ask-card', 'boxShadow'), exportShadow: g('header #install > button', 'boxShadow'), nameShadow: g('header h1', 'textShadow'), markWinRadius: getComputedStyle(document.documentElement).getPropertyValue('--mark-win-radius').trim(), title: document.title };`);
  const rest = await read();
  // hover the first panel button with the real pointer, and read its shadow and fill
  const box = await ev("const r = document.querySelector('#palette button').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2];");
  await ev("document.getElementById('c-l249-ask').remove(); document.querySelector('#m-file').open = false; return true;"); await sleep(300);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box[0], y: box[1] }); await sleep(400);
  const hov = await ev("const e = document.querySelector('#palette button'); const s = getComputedStyle(e); return { hovered: e.matches(':hover'), boxShadow: s.boxShadow, background: s.backgroundColor + ' ' + s.backgroundImage.slice(0, 60), border: s.borderColor };");
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* left in temp */ }
  return { look, tree: T, stub: STUB, rest, hoveredPanelButton: hov, pageErrors: errors };
}

(async () => { for (const l of LOOKS) console.log(JSON.stringify(await one(l), null, 1)); })().catch((e) => { console.error(e); process.exit(1); });
