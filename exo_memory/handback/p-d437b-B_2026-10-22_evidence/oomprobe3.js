// oomprobe3.js (D437b, B): a SANDBOXED srcdoc iframe (sandbox="allow-scripts", an opaque origin, no second site to serve) that fills its V8 heap,
// either on its own main thread or in a blob: worker it makes. Does the page live? Same browser-side readings as oomprobe2.js.
//   node oomprobe3.js <worktree> <main|worker>
const path = require('path'), fs = require('fs'), http = require('http'), os = require('os'), { spawn } = require('child_process');
const [WT, WHERE = 'main'] = process.argv.slice(2);
const { chromePath } = require(path.join(WT, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FILL = "const a = []; let n = 0; try { for (;;) { a.push({ n, s: 'x' + n, v: [n, n + 1, n + 2] }); n++; if (n % 1e7 === 0) say({ n }); } } catch (e) { say({ caught: String(e) }); }";
const FRAME = WHERE === 'main'
  ? `<script>const say = (m) => parent.postMessage(JSON.stringify(m), '*'); onmessage = () => { say({ stage: 'building' }); setTimeout(() => { ${FILL} }, 0); };<\/script>`
  : `<script>const say = (m) => parent.postMessage(JSON.stringify(m), '*'); onmessage = () => { const src = "const say = (m) => postMessage(m); onmessage = () => { ${FILL.replace(/"/g, '\\"')} };"; const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))); w.onmessage = (e) => say(e.data); w.onerror = (e) => say({ onerror: e.message }); w.postMessage(1); };<\/script>`;
const PAGE = `<!doctype html><title>oom</title><body><canvas id=c width=200 height=100></canvas><script>
const c = document.getElementById('c').getContext('2d'); c.fillStyle = 'red'; c.fillRect(0, 0, 200, 100);
window.big = []; for (let i = 0; i < 2e6; i++) big.push({ i, x: [i, i] });
window.log = []; addEventListener('message', (e) => log.push(String(e.data)));
window.go = () => { const f = document.createElement('iframe'); f.sandbox = 'allow-scripts'; f.srcdoc = ${JSON.stringify(FRAME).split('</').join('<\\/')}; f.onload = () => f.contentWindow.postMessage('go', '*'); document.body.append(f); return 'started'; };
</script>`;
(async () => {
  const s1 = await new Promise((r) => { const s = http.createServer((q, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(PAGE); }); s.listen(0, '127.0.0.1', () => r(s)); });
  const port = 9300 + Math.floor(Math.random() * 600), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'b437oom-'));
  const ch = spawn(chromePath(), ['--headless=new', '--mute-audio', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let ver; for (let i = 0; i < 100 && !ver; i++) { await sleep(200); try { ver = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch (e) { /* not up */ } }
  const ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map(); const events = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (/Crashed|Destroyed/.test(d.method || '')) events.push(`${d.method}`); };
  const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const procs = async () => { const d = await send('SystemInfo.getProcessInfo'); return (d.result ? d.result.processInfo : []).filter((p) => p.type === 'renderer').map((p) => p.id).join(','); };
  await send('Target.setDiscoverTargets', { discover: true });
  const tg = (await send('Target.getTargets')).result.targetInfos.find((t) => t.type === 'page');
  const sess = (await send('Target.attachToTarget', { targetId: tg.targetId, flatten: true })).result.sessionId;
  const ev = async (e) => { const d = await Promise.race([send('Runtime.evaluate', { expression: e, returnByValue: true }, sess), sleep(3000).then(() => null)]); return d && d.result && d.result.result ? d.result.result.value : '(no answer)'; };
  await send('Page.navigate', { url: `http://127.0.0.1:${s1.address().port}/` }, sess); await sleep(3000);
  console.log(`sandboxed iframe, fill on its ${WHERE}; renderers before: ${await procs()}; page:`, await ev('go()'));
  let L = ''; const t0 = Date.now();
  for (let i = 0; i < 50; i++) { await sleep(1000); L = await ev('JSON.stringify(log.slice(-2))'); if (i === 2) console.log('renderers while it runs:', await procs(), '| page answers:', L); if (/onerror|caught/.test(L) || (L === '(no answer)' && i > 25) || events.length) break; }
  console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s: last log ${L}`); await sleep(2000);
  console.log('renderers after:', await procs(), '| events:', events.join(' ') || 'none');
  console.log('page answers after:', await ev("'objects ' + big.length + ', pixel ' + Array.from(document.getElementById('c').getContext('2d').getImageData(5, 5, 1, 1).data).join(',') + ', frames ' + document.querySelectorAll('iframe').length"));
  ws.close(); ch.kill(); s1.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  process.exit(0);
})();
