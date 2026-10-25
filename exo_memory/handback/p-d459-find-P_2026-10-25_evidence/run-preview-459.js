// run-preview-459.js (D459, P; from run-preview-436.js): standing rule 1 added: document.title = "zz-headless-test" first on every document: the builder's own page (app/index.html of a worktree, served over a local port) in headless Chrome (--headless=new --mute-audio),
// with a FAKE native side injected before the page boots (window.__TAURI__.core.invoke answers list_tracks / open_track with the given track text; every
// other command resolves to nothing). The page opens the track through its own Open control; with `press`, it then presses the page's own "Close the loop"
// button (shell.closeBest: the keeper's press, D339) and waits for the lap to close; then the camera is sent to each station by the preview's own
// 't180-camera-focus' event (D242) and the page is shot, from the preview's focus view and after 9 wheel notches in. Nothing in t180 is written.
//   node run-preview-436.js <worktree> <track file> <outdir> <prefix> <stationsCSV> [press]
const path = require('path'), fs = require('fs'), http = require('http'), os = require('os'), { spawn } = require('child_process');
const [WT, TRACKFILE, OUT, PREFIX, STATIONS_CSV, PRESS] = process.argv.slice(2);
const { chromePath } = require(path.join(WT, 'app/test/soundrender.js'));
const TRACK = fs.readFileSync(TRACKFILE, 'utf8'); const STATIONS = STATIONS_CSV.split(',').map(Number); const press = PRESS === 'press';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FAKE = `document.title = 'zz-headless-test'; document.addEventListener('DOMContentLoaded', () => { document.title = 'zz-headless-test'; }); window.__TAURI__ = { core: { invoke: (cmd, args) => {
  if (cmd === 'list_tracks') return Promise.resolve(['eq-TEST 10']);
  if (cmd === 'open_track') return Promise.resolve(${JSON.stringify(TRACK)});
  if (cmd === 'list_track_backups' || cmd === 'list_pieces') return Promise.resolve([]);
  return Promise.resolve(null);
} } };`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(WT, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(WT))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const port = 9300 + Math.floor(Math.random() * 600), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p436prev-'));
  const ch = spawn(chromePath(), ['--headless=new', '--mute-audio', '--hide-scrollbars', '--enable-unsafe-swiftshader', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', '--window-size=1400,860', 'about:blank'], { stdio: 'ignore' });
  let tgt; for (let i = 0; i < 100 && !tgt; i++) { await sleep(200); try { tgt = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch (e) { /* not up yet */ } }
  if (!tgt) throw new Error('headless Chrome did not answer');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('socket')); });
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name), Buffer.from(r.result.data, 'base64')); console.log('wrote', name); };
  const status = () => ev("return (document.getElementById('status') || { textContent: '' }).textContent;");
  const head = () => ev("return (document.querySelector('#palette .head') || { textContent: '?' }).textContent;");
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: FAKE });
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev("localStorage.clear(); localStorage.setItem('t180.settings.theme', JSON.stringify('sigil')); return true;");
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    console.log('menubar', await ev("return document.documentElement.dataset.menubar || 'not mounted';"), 'errors', errors.length);
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    await ev("const sel = document.getElementById('open'); const o = document.createElement('option'); o.value = 'TEST 10'; o.textContent = 'TEST 10'; sel.append(o); sel.value = 'TEST 10'; sel.dispatchEvent(new Event('change')); return true;");
    const want = press ? 20 : 23;
    for (let i = 0; i < 100; i++) { await sleep(500); const n = await ev("return Number((document.querySelector('#palette .head') || { textContent: '' }).textContent.match(/^(\\d+) piece/) ? RegExp.$1 : 0);"); if (n >= want) break; }
    console.log('opened:', await head(), '|', await status());
    await ev("document.title = 'zz-headless-test'; return document.title;"); await sleep(8000);
    if (press) {
      await shot(`${PREFIX}-before-press.png`);
      const clicked = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Close the loop'); if (!b) return 'no button'; b.click(); return 'clicked';");
      console.log('Close the loop:', clicked); const t0 = Date.now();
      for (let i = 0; i < 240; i++) { await sleep(500); const n = await ev("return Number((document.querySelector('#palette .head') || { textContent: '' }).textContent.match(/^(\\d+) piece/) ? RegExp.$1 : 0);"); if (n >= 23) break; }
      console.log('after the press', Math.round((Date.now() - t0) / 100) / 10, 's:', await head(), '|', await status());
      const words = await ev("const b = document.querySelector('[aria-label=\"close\"]'); return b ? b.textContent.slice(0, 300) : '';"); console.log('close box:', words);
      await sleep(2000); await shot(`${PREFIX}-after-press-2s.png`);
    }
    await sleep(12000);   // the full mesh builds a slice a frame
    for (const s of STATIONS) {
      await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${s} } })); return true;`); await sleep(2500);
      await shot(`${PREFIX}-s${s}.png`);
      const rc = await ev("const r = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };");
      for (let i = 0; i < 9; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: rc.x, y: rc.y, deltaX: 0, deltaY: -100 }); await sleep(80); }
      await sleep(2000); await shot(`${PREFIX}-close-s${s}.png`);
    }
    console.log('page errors:', errors.slice(0, 5).join(' | ') || 'none');
  } finally { try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
