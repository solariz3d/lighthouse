// run-export-437.js (D437, P): the builder's own page (app/index.html of a worktree, served over a local port) in headless Chrome
// (--headless=new --mute-audio, never a window), with a FAKE native side injected before the page boots (window.__TAURI__.core.invoke
// answers list_tracks / open_track with the given track text, get_ac_root with a fake folder, install_track with an ok; every other command
// resolves to nothing). The page opens the track through its own Open control, the preview builds, and then the page's own
// "Export to Assetto Corsa" button (app/install/index.js, the keeper's press) is clicked. Through the export:
//   - the renderer's JS heap: Chrome's own V8 trace (--js-flags=--trace-gc, --enable-logging=stderr) into <out>/<prefix>-chrome-stderr.log;
//   - the renderer PROCESS: working set and private bytes every 250 ms from a PowerShell poller into <out>/<prefix>-renderer-mem.log;
//   - the crash, if any: CDP Inspector.targetCrashed / Target.targetCrashed, logged with its time.
// Nothing in t180 is written; nothing of the keeper's is touched.
//   node run-export-437.js <worktree> <track file> <outdir> <prefix>
const path = require('path'), fs = require('fs'), http = require('http'), os = require('os'), { spawn } = require('child_process');
const [WT, TRACKFILE, OUT, PREFIX] = process.argv.slice(2);
const { chromePath } = require(path.join(WT, 'app/test/soundrender.js'));
const TRACK = fs.readFileSync(TRACKFILE, 'utf8');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now(); const stamp = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(7) + ' s';
const log = (...a) => console.log(stamp(), ...a);
const FAKE = `window.__TAURI__ = { core: { invoke: (cmd, args) => {
  if (cmd === 'list_tracks') return Promise.resolve(['eq-ELYSIUM']);
  if (cmd === 'open_track') return Promise.resolve(${JSON.stringify(TRACK)});
  if (cmd === 'list_track_backups' || cmd === 'list_pieces') return Promise.resolve([]);
  if (cmd === 'get_ac_root') return Promise.resolve('C:\\\\fake-d437\\\\assettocorsa');
  if (cmd === 'get_see_it_setting') return Promise.resolve(false);
  if (cmd === 'install_track') { window.__d437installed = { folder: args && args.folder, files: args && args.files ? args.files.length : -1, at: Date.now() }; return Promise.resolve({ folder: 'C:\\\\fake-d437\\\\assettocorsa\\\\content\\\\tracks\\\\' + (args && args.folder), moved: [] }); }
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
  const port = 9300 + Math.floor(Math.random() * 600), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p437exp-'));
  const errLog = fs.createWriteStream(path.join(OUT, `${PREFIX}-chrome-stderr.log`));
  const ch = spawn(chromePath(), ['--headless=new', '--mute-audio', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--enable-logging=stderr', '--v=0', '--js-flags=--trace-gc', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', '--window-size=1400,860', 'about:blank'], { stdio: ['ignore', 'pipe', 'pipe'] });
  ch.stdout.on('data', (d) => errLog.write(d)); ch.stderr.on('data', (d) => errLog.write(d));
  let tgt; for (let i = 0; i < 100 && !tgt; i++) { await sleep(200); try { tgt = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch (e) { /* not up yet */ } }
  if (!tgt) throw new Error('headless Chrome did not answer');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('socket')); });
  let id = 0; const pend = new Map(); const errors = []; let crashed = null;
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text);
    if (d.method === 'Inspector.targetCrashed') { crashed = stamp(); log('*** Inspector.targetCrashed: the renderer died'); } };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const sendT = (method, params, ms) => Promise.race([send(method, params), sleep(ms).then(() => ({ timeout: true }))]);
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  const status = () => ev("return (document.getElementById('status') || { textContent: '' }).textContent;");
  const head = () => ev("return (document.querySelector('#palette .head') || { textContent: '?' }).textContent;");
  const jsHeap = () => ev("const m = performance.memory; return m ? { usedMB: +(m.usedJSHeapSize / 1048576).toFixed(1), totalMB: +(m.totalJSHeapSize / 1048576).toFixed(1), limitMB: +(m.jsHeapSizeLimit / 1048576).toFixed(1) } : null;");
  // the renderer process, by its command line (this run's user-data-dir), polled from PowerShell every 250 ms
  const memLog = path.join(OUT, `${PREFIX}-renderer-mem.log`);
  const ps = `$dir = '${dir.replace(/\\/g, '\\\\').replace(/'/g, "''")}'; $p = $null; for ($i = 0; $i -lt 200 -and -not $p; $i++) { $p = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*--type=renderer*' -and $_.CommandLine -like ('*' + $dir + '*') } | Select-Object -First 1; if (-not $p) { Start-Sleep -Milliseconds 250 } }; if (-not $p) { 'no renderer found'; exit 1 }; ('renderer pid ' + $p.ProcessId); while ($true) { try { $q = Get-Process -Id $p.ProcessId -ErrorAction Stop; ('{0} ws {1} private {2}' -f (Get-Date -Format 'HH:mm:ss.fff'), $q.WorkingSet64, $q.PrivateMemorySize64) } catch { ('{0} renderer gone' -f (Get-Date -Format 'HH:mm:ss.fff')); break }; Start-Sleep -Milliseconds 250 }`;
  const poller = spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: ['ignore', fs.openSync(memLog, 'w'), 'ignore'] });
  try {
    await send('Runtime.enable'); await send('Page.enable'); await send('Inspector.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: FAKE });
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev("localStorage.clear(); localStorage.setItem('t180.settings.theme', JSON.stringify('sigil')); return true;");
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    log('menubar', await ev("return document.documentElement.dataset.menubar || 'not mounted';"), 'errors', errors.length, 'js heap', JSON.stringify(await jsHeap()));
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    await ev("const sel = document.getElementById('open'); const o = document.createElement('option'); o.value = 'ELYSIUM'; o.textContent = 'ELYSIUM'; sel.append(o); sel.value = 'ELYSIUM'; sel.dispatchEvent(new Event('change')); return true;");
    for (let i = 0; i < 100; i++) { await sleep(500); const n = await ev("return Number((document.querySelector('#palette .head') || { textContent: '' }).textContent.match(/^(\\d+) piece/) ? RegExp.$1 : 0);"); if (n >= 44) break; }
    log('opened:', await head(), '|', await status(), '| js heap', JSON.stringify(await jsHeap()));
    // let the preview build: wait until the status text and the heap stop moving, up to 150 s
    let last = '', still = 0;
    for (let i = 0; i < 300; i++) { await sleep(500); const h = await sendT('Runtime.evaluate', { expression: "JSON.stringify([document.getElementById('status') && document.getElementById('status').textContent, Math.round(performance.memory.usedJSHeapSize / 1048576 / 20)])", returnByValue: true }, 2000); const cur = h.timeout ? 'busy' : h.result.result.value; if (cur === last) still++; else { still = 0; last = cur; } if (still >= 20) break; }
    await sleep(5000);
    log('preview settled:', await status(), '| js heap', JSON.stringify(await jsHeap()));
    const buttons = await ev("return [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter((t) => /Export|Assetto|Install/i.test(t));");
    log('export-like buttons:', JSON.stringify(buttons));
    log('before the press: js heap', JSON.stringify(await jsHeap()));
    // the press: not awaited (the export runs on the page's main thread and blocks the protocol until it is done or dead)
    const pressId = ++id; pend.set(pressId, () => {});
    ws.send(JSON.stringify({ id: pressId, method: 'Runtime.evaluate', params: { expression: "(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Export to Assetto Corsa'); if (!b) return 'no button'; b.click(); return 'clicked'; })()", returnByValue: true } }));
    log('pressed Export to Assetto Corsa');
    const tp = Date.now(); let done = null;
    for (let i = 0; i < 1200 && !crashed && !done; i++) {   // up to 10 min
      await sleep(500);
      const h = await sendT('Runtime.evaluate', { expression: "JSON.stringify({ status: document.getElementById('status') && document.getElementById('status').textContent.slice(0, 300), installed: window.__d437installed || null, heapMB: Math.round(performance.memory.usedJSHeapSize / 1048576) })", returnByValue: true }, 1500);
      if (h.timeout) { if (i % 20 === 0) log('page busy (main thread blocked)'); continue; }
      const v = JSON.parse(h.result.result.value);
      if (i % 4 === 0) log('page answers:', v.status, '| heap', v.heapMB, 'MB');
      if (v.installed || /exported|installed|not exported|refused|red|cannot|failed/i.test(v.status || '')) { done = v; }
    }
    if (crashed) log('RESULT: the renderer CRASHED', ((Date.now() - tp) / 1000).toFixed(1), 's after the press');
    else if (done) log('RESULT: the export finished', ((Date.now() - tp) / 1000).toFixed(1), 's after the press:', JSON.stringify(done).slice(0, 600));
    else log('RESULT: neither finished nor crashed within the wait');
    if (!crashed) { try { log('after: js heap', JSON.stringify(await sendT('Runtime.evaluate', { expression: "JSON.stringify({u: Math.round(performance.memory.usedJSHeapSize/1048576), t: Math.round(performance.memory.totalJSHeapSize/1048576)})", returnByValue: true }, 3000))); } catch (e) { /* gone */ } }
    log('page errors:', errors.slice(0, 5).join(' | ') || 'none');
  } finally { await sleep(1500); try { poller.kill(); } catch (e) { /* done */ } try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(800); errLog.end(); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ } }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
