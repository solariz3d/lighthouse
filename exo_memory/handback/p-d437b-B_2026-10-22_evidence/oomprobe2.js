// oomprobe2.js (D437b, B): the same question as oomprobe.js, answered from the BROWSER's side of the protocol: Target.targetCrashed for the page,
// and SystemInfo.getProcessInfo (every renderer's id) before the worker starts, while it runs, and after. MODE 'objects' fills the V8 heap with
// objects; 'buffers' allocates 64 MB ArrayBuffers (outside the V8 heap); 'objects-guarded' fills it with objects but the worker gives up once
// its own count passes a budget (no OOM at all; the control).
//   node oomprobe2.js <worktree> <mode> [--iframe]   (--iframe: the worker is made inside a cross-origin iframe, on a second port)
const path = require('path'), fs = require('fs'), http = require('http'), os = require('os'), { spawn } = require('child_process');
const [WT, MODE = 'objects'] = process.argv.slice(2), IFRAME = process.argv.includes('--iframe');
const { chromePath } = require(path.join(WT, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = {
  objects: `self.onmessage = () => { const a = []; let n = 0; postMessage({ stage: 'building' }); try { for (;;) { a.push({ n, s: 'x' + n, v: [n, n + 1, n + 2] }); n++; if (n % 1e7 === 0) postMessage({ n }); } } catch (e) { postMessage({ caught: String(e) }); } };`,
  buffers: `self.onmessage = () => { const a = []; postMessage({ stage: 'building' }); try { for (let i = 0; ; i++) { a.push(new Float64Array(8 << 20)); if (i % 8 === 0) postMessage({ mb: (i + 1) * 64 }); } } catch (e) { postMessage({ caught: String(e), mb: a.length * 64 }); } };`,
};
const inner = (wurl) => `const log = []; window.log = log; const w = new Worker('${wurl}'); w.onmessage = (e) => log.push('msg ' + JSON.stringify(e.data)); w.onerror = (e) => { log.push('onerror ' + e.message); e.preventDefault(); }; w.postMessage('go');`;
const PAGE = (port2) => `<!doctype html><title>oom</title><body><canvas id=c width=200 height=100></canvas><script>
const c = document.getElementById('c').getContext('2d'); c.fillStyle = 'red'; c.fillRect(0, 0, 200, 100);
window.big = []; for (let i = 0; i < 2e6; i++) big.push({ i, x: [i, i] });
window.log = [];
window.go = () => { ${IFRAME ? `const f = document.createElement('iframe'); f.src = 'http://127.0.0.1:${port2}/frame'; document.body.append(f); window.addEventListener('message', (e) => log.push(String(e.data)));` : inner('w.js')} return 'started'; };
</script>`;
const FRAME = `<!doctype html><script>${inner('w.js').replace("log.push('msg ' + JSON.stringify(e.data))", "parent.postMessage('msg ' + JSON.stringify(e.data), '*')").replace("log.push('onerror ' + e.message)", "parent.postMessage('onerror ' + e.message, '*')")}</script>`;
const serve = (h) => new Promise((r) => { const s = http.createServer(h); s.listen(0, '127.0.0.1', () => r(s)); });
(async () => {
  const wjs = (s) => { s.writeHead(200, { 'content-type': 'text/javascript' }); s.end(W[MODE]); };
  const s2 = await serve((q, s) => (q.url.startsWith('/w.js') ? wjs(s) : (s.writeHead(200, { 'content-type': 'text/html' }), s.end(FRAME))));
  const s1 = await serve((q, s) => (q.url.startsWith('/w.js') ? wjs(s) : (s.writeHead(200, { 'content-type': 'text/html' }), s.end(PAGE(s2.address().port)))));
  const port = 9300 + Math.floor(Math.random() * 600), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'b437oom-'));
  const ch = spawn(chromePath(), ['--headless=new', '--mute-audio', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let ver; for (let i = 0; i < 100 && !ver; i++) { await sleep(200); try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch (e) { /* not up */ } }
  const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map(); const events = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (/Crashed|Detached|Destroyed/.test(d.method || '')) events.push(`${d.method} ${JSON.stringify(d.params).slice(0, 160)}`); };
  const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const procs = async () => { const d = await send('SystemInfo.getProcessInfo'); return (d.result ? d.result.processInfo : []).filter((p) => p.type === 'renderer').map((p) => p.id).join(','); };
  await send('Target.setDiscoverTargets', { discover: true });
  const tg = (await send('Target.getTargets')).result.targetInfos.find((t) => t.type === 'page');
  const sess = (await send('Target.attachToTarget', { targetId: tg.targetId, flatten: true })).result.sessionId;
  const ev = async (e) => { const d = await Promise.race([send('Runtime.evaluate', { expression: e, returnByValue: true }, sess), sleep(3000).then(() => null)]); return d && d.result && d.result.result ? d.result.result.value : '(no answer)'; };
  await send('Page.navigate', { url: `http://127.0.0.1:${s1.address().port}/` }, sess); await sleep(3000);
  console.log(`mode ${MODE}${IFRAME ? ' in a cross-origin iframe' : ''}; renderers before: ${await procs()}; page:`, await ev('go()'));
  const t0 = Date.now(); let L = '';
  for (let i = 0; i < 50; i++) { await sleep(1000); L = await ev('JSON.stringify(log.slice(-3))'); if (i === 2) console.log('renderers while it runs:', await procs()); if (/onerror|caught/.test(L) || (L === '(no answer)' && i > 25) || events.length) break; }
  console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: last log ${L}`);
  await sleep(2000);
  console.log('renderers after:', await procs());
  console.log('events:', events.join(' | ') || 'none');
  console.log('page answers after:', await ev("'title ' + document.title + ', page objects ' + big.length + ', canvas pixel ' + Array.from(document.getElementById('c').getContext('2d').getImageData(5, 5, 1, 1).data).join(',')"));
  ws.close(); ch.kill(); s1.close(); s2.close(); await sleep(500);
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  process.exit(0);
})();
