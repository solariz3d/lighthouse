// probe.js (C, D484): node probe.js <checkout> <label> <outdir> [--profile] [--runs=N]
// release-frame.test.js row 4 as it is (aqua, a 12-piece track of 100 m turns, 32 Turn-field changes 60 ms apart by Input.insertText), in headless Chrome (--mute-audio,
// title zz-headless-test), with every animation-frame callback timed BY WHERE IT WAS REGISTERED and every input event timed between a capture and a bubble listener.
// Per change: the handler ms, the row's own cost (handler + every frame > 0.5 ms until the next change or 120 ms), the largest single piece, and the frames by origin.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = path.resolve(process.argv[2]), LABEL = process.argv[3], OUT = path.resolve(process.argv[4]);
const PROFILE = process.argv.includes('--profile'), RUNS = +((process.argv.find((x) => x.startsWith('--runs=')) || '--runs=1').slice(7));
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app', 'test', 'soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const PRE = `(() => { const raf = window.requestAnimationFrame.bind(window), where = new WeakMap(); const ft = window.__ft = { on: false, frames: new Map(), ev: [] };
  const origin = (fn) => { let o = where.get(fn); if (!o) { const l = (new Error().stack || '').split('\\n')[3] || '?'; o = l.trim().replace(/^at /, '').replace(/https?:\\/\\/[^/]+\\//, '').replace(/:\\d+\\)?$/, ')'); where.set(fn, o); } return o; };
  window.requestAnimationFrame = (fn) => { const o = origin(fn); return raf((ts) => { const t0 = performance.now(); try { return fn(ts); } finally { if (ft.on) { const dt = performance.now() - t0; const f = ft.frames.get(ts) || { ms: 0, by: {} }; f.ms += dt; f.by[o] = (f.by[o] || 0) + dt; ft.frames.set(ts, f); } } }); };
  for (const type of ['input']) { let a = 0; window.addEventListener(type, () => { a = performance.now(); }, true); window.addEventListener(type, () => { if (ft.on) ft.ev.push([type, a, performance.now() - a]); }, false); }
  document.title = 'zz-headless-test'; })();`;
const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--window-size=1400,860', '--disable-frame-rate-limit', '--disable-gpu-vsync'], 't180c484-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text).slice(0, 200)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  const FIELD = (re) => `[...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || ''))`;
  const setField = (re, v) => ev(`const f = ${FIELD(re)}; f.value = '${v}'; f.dispatchEvent(new Event('input', { bubbles: true })); return true;`);
  const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: extra.button || 'none', buttons: extra.buttons || 0, clickCount: extra.clickCount || 0 });
  const load = async () => {
    await send('Page.navigate', { url: `${base}/app/lib/cjs.js` });
    for (let i = 0; i < 50; i++) { await sleep(100); try { if ((await ev('return location.href;')) === `${base}/app/lib/cjs.js`) break; } catch (e) { /* loading */ } }
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', '"aqua"'); localStorage.setItem('t180.guide.done', '1'); return true;`);
    const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: PRE })).result.identifier;
    await send('Page.navigate', { url: `${base}/app/index.html` });
    for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;")) break; } catch (e) { /* loading */ } }
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
    await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
  };
  const out = [];
  for (let k = 0; k < RUNS; k++) {
    await load(); await setField('/metres added/', 100);
    for (let i = 0; i < 12; i++) { await setField('/turn/i', i % 2 ? 12 : -12); const p = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Extend' && x.offsetParent); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];"); await mouse('mouseMoved', p[0], p[1]); await mouse('mousePressed', p[0], p[1], { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', p[0], p[1], { button: 'left', buttons: 0, clickCount: 1 }); await sleep(120); }
    await mouse('mouseMoved', 700, 300); await sleep(800);
    const pieces = await ev("return document.body.innerText.match(/\\d+ pieces?/)[0];");
    if (PROFILE) { await send('Profiler.enable'); await send('Profiler.setSamplingInterval', { interval: 100 }); await send('Profiler.start'); }
    await ev('window.__ft.frames.clear(); window.__ft.ev.length = 0; window.__ft.on = true; return true;');
    const VALS = ['5', '23', '-8', '14', '-19', '2', '31', '-3'];
    for (let i = 0; i < 32; i++) { await ev(`const f = ${FIELD('/turn/i')}; f.focus(); f.select(); return true;`); await send('Input.insertText', { text: VALS[i % VALS.length] }); await sleep(60); }
    await sleep(200); await ev('window.__ft.on = false; return true;');
    if (PROFILE) { const prof = (await send('Profiler.stop')).result.profile; fs.writeFileSync(path.join(OUT, `${LABEL}-${k}.cpuprofile`), JSON.stringify(prof)); }
    const evs = (await ev("return window.__ft.ev.filter((e) => e[0] === 'input');")).sort((a, b) => a[1] - b[1]);
    const fr = await ev('return [...window.__ft.frames.entries()].map(([ts, f]) => [ts, f.ms, f.by]);');
    const per = evs.map(([, a, d], i) => {
      const end = Math.min(a + 120, i + 1 < evs.length ? evs[i + 1][1] : Infinity), mine = fr.filter(([ts, ms]) => ts >= a && ts < end && ms > 0.5);
      const by = {}; for (const [, , b] of mine) for (const [o, ms] of Object.entries(b)) by[o] = +((by[o] || 0) + ms).toFixed(2);
      return { handler: +d.toFixed(2), cost: +(d + mine.reduce((s, [, ms]) => s + ms, 0)).toFixed(2), frames: mine.length, frameMs: mine.map(([, ms]) => +ms.toFixed(2)), largest: +Math.max(d, ...mine.map(([, ms]) => ms)).toFixed(2), by };
    });
    const costs = per.map((x) => x.cost), larg = per.map((x) => x.largest), hand = per.map((x) => x.handler);
    const row = { label: LABEL, run: k, pieces, changes: evs.length, p95: pct(costs, 0.95), median: pct(costs, 0.5), handlerP95: pct(hand, 0.95), handlerMedian: pct(hand, 0.5), largestP95: pct(larg, 0.95), per };
    out.push(row);
    console.log(`${LABEL} run ${k}: ${pieces}, ${evs.length} changes; row cost p95 ${row.p95.toFixed(2)} median ${row.median.toFixed(2)} | handler p95 ${row.handlerP95.toFixed(2)} median ${row.handlerMedian.toFixed(2)} | largest single piece p95 ${row.largestP95.toFixed(2)}`);
  }
  fs.writeFileSync(path.join(OUT, `${LABEL}.json`), JSON.stringify({ runs: out, errors }, null, 1));
  if (errors.length) console.log('page errors: ' + JSON.stringify(errors.slice(0, 5)));
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
