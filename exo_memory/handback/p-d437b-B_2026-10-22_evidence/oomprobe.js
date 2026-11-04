// oomprobe.js (D437b, B): does a Web Worker that runs out of V8 heap take the page with it, in headless Chrome? Serves a page whose worker
// pushes objects until it dies; logs what the page sees (worker onerror / message / nothing), whether the page still answers, and any crash.
//   node oomprobe.js <worktree>
const path = require('path'), fs = require('fs'), http = require('http'), os = require('os'), { spawn } = require('child_process');
const WT = process.argv[2];
const { chromePath } = require(path.join(WT, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGE = `<!doctype html><title>oom</title><body><canvas id=c width=200 height=100></canvas><script>
window.log = [];
const c = document.getElementById('c').getContext('2d'); c.fillStyle = 'red'; c.fillRect(0, 0, 200, 100);
const big = []; for (let i = 0; i < 2e6; i++) big.push({ i, x: [i, i] });   // the page holds a heap of its own, as the builder's does
window.go = () => { const w = new Worker('w.js'); window.w = w;
  w.onmessage = (e) => log.push('msg ' + JSON.stringify(e.data).slice(0, 200));
  w.onerror = (e) => { log.push('onerror ' + (e.message || '') + ' ' + e.filename + ':' + e.lineno); e.preventDefault(); };
  w.onmessageerror = () => log.push('messageerror');
  w.postMessage('go'); return 'started'; };
</script>`;
const W = `self.onmessage = () => { const a = []; let n = 0; self.postMessage({ stage: 'building' });
  try { for (;;) { a.push({ n, s: 'x' + n, v: [n, n + 1, n + 2] }); n++; if (n % 5e6 === 0) self.postMessage({ n }); } } catch (e) { self.postMessage({ caught: String(e) }); } };`;
(async () => {
  const srv = http.createServer((q, s) => { if (q.url.startsWith('/w.js')) { s.writeHead(200, { 'content-type': 'text/javascript' }); s.end(W); } else { s.writeHead(200, { 'content-type': 'text/html' }); s.end(PAGE); } });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const port = 9300 + Math.floor(Math.random() * 600), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'b437oom-'));
  const ch = spawn(chromePath(), ['--headless=new', '--mute-audio', '--hide-scrollbars', '--enable-logging=stderr', '--v=0', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
  let err = ''; ch.stderr.on('data', (d) => { err += d; }); ch.on('exit', (c) => console.log('chrome exited', c));
  let tgt; for (let i = 0; i < 100 && !tgt; i++) { await sleep(200); try { tgt = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch (e) { /* not up */ } }
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map(); let crashed = false;
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Inspector.targetCrashed') crashed = true; };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (e) => { const d = await Promise.race([send('Runtime.evaluate', { expression: e, returnByValue: true }), sleep(3000).then(() => null)]); return d && d.result && d.result.result ? d.result.result.value : '(no answer)'; };
  await send('Inspector.enable'); await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/` }); await sleep(3000);
  const rlist = () => require('child_process').execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq ${ch.pid} } | ForEach-Object { $p = Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue; if ($p) { '{0}:{1}:{2}' -f $_.ProcessId, [math]::Round($p.WorkingSet64/1MB), ($_.CommandLine -replace '.*--type=([a-z-]+).*','$1') } }"`).toString().trim().split(/s+/).join(' '); console.log('children before (pid:MB:type):', rlist());
  console.log('before:', await ev('go()'), 'heap MB', await ev('Math.round(performance.memory.usedJSHeapSize/1048576)'));
  const t0 = Date.now();
  for (let i = 0; i < 40 && !crashed; i++) { await sleep(500); const L = await ev('JSON.stringify(log)'); if (/onerror|caught/.test(L) || i % 10 === 0) console.log(((Date.now() - t0) / 1000).toFixed(1), 's log', L.slice(-300)); if (/onerror|caught/.test(L)) break; if (L === "(no answer)" && i > 20) break; if (i === 2 || i === 6 || i === 12) console.log('children at', i, rlist()); }
  console.log('crashed:', crashed); console.log('children after:', rlist()); try { console.log('renderers:', require('child_process').execSync(`powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*--type=renderer*' -and $_.CommandLine -like '*${path.basename(dir)}*' } | ForEach-Object { $p = Get-Process -Id $_.ProcessId; '{0} ws {1} MB cpu {2}' -f $_.ProcessId, [math]::Round($p.WorkingSet64/1MB), $p.CPU }"`).toString()); } catch (e) { console.log('ps failed', e.message); } try { console.log('targets:', JSON.stringify((await (await fetch(`http://127.0.0.1:${port}/json`)).json()).map((t) => t.type + ' ' + t.url))); } catch (e) { console.log('json failed', e.message); }
  if (!crashed) { console.log('page answers after:', await ev("document.title + ' ' + big.length + ' pixel ' + Array.from(document.getElementById('c').getContext('2d').getImageData(5,5,1,1).data).join(',')")); console.log('a new worker still runs:', await ev("(() => { const w2 = new Worker('data:text/javascript,postMessage(42)'); return 'made'; })()")); }
  ws.close(); ch.kill(); srv.close(); await sleep(500);
  console.log('stderr tail:', err.split('\n').filter((l) => /oom|memory|heap|fatal/i.test(l)).slice(-6).join('\n'));
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  process.exit(0);
})();
