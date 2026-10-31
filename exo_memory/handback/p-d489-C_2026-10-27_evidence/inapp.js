// inapp.js (C, D489): node inapp.js <t180 tree> <out.json> [look]
// The real page (app/index.html) in headless Chrome on the machine's GPU (muted, titled zz-headless-test), at a 2560 x 1440 view, DPR 1, frames uncapped,
// in the Aurora look (or the one named). For three tracks (empty; 12 x 100 m turns; 30 x 1,000 m pieces), 3 s of frames are recorded:
//   cpu    every animation-frame callback's time in the frame (ms)
//   gpu    the preview frame's WebGL2 commands timed on the GPU (EXT_disjoint_timer_query_webgl2), split at the frame's first draw (the sky pass,
//          drawn first, after the clear, as renderer.js draw does): sky = clear + the sky's full-screen strip, rest = everything after it (the road,
//          lines, ghost, overlay)
//   gap    the time between frames (uncapped, so it is the slowest of CPU, GPU and compositor per frame)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]), LOOK = process.argv[4] || 'aurora';
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app', 'test', 'soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const W = 2560, H = 1440;
const PRE = `(() => { document.title = 'zz-headless-test';
  const ft = window.__ft = { on: false, frames: [], pend: [], cpu: new Map() };
  const gls = [];
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...rest) {
    const gl = gc.call(this, kind, ...rest);
    if (gl && kind === 'webgl2' && !gl.__wrapped) {
      gl.__wrapped = true; gl.__tq = gl.getExtension('EXT_disjoint_timer_query_webgl2'); gls.push(gl);
      const da = gl.drawArrays.bind(gl), de = gl.drawElements.bind(gl);
      const mark = () => { const f = gl.__f; if (f && !f.split) { f.split = true; f.first = true; } };
      gl.drawArrays = (m, a, n) => { const f = gl.__f; const first = f && !f.split; da(m, a, n); if (first) { f.split = true; f.firstWasStrip4 = (m === gl.TRIANGLE_STRIP && a === 0 && n === 4); gl.endQuery(gl.__tq.TIME_ELAPSED_EXT); f.q2 = gl.createQuery(); gl.beginQuery(gl.__tq.TIME_ELAPSED_EXT, f.q2); } else if (f) f.draws++; };
      gl.drawElements = (...a) => { const f = gl.__f; if (f) f.draws++; de(...a); };
    }
    return gl;
  };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (fn) => raf((ts) => {
    const gl = gls[0], go = ft.on && gl && gl.__tq;
    if (go) { gl.__f = { ts, q1: gl.createQuery(), q2: null, split: false, draws: 0 }; gl.beginQuery(gl.__tq.TIME_ELAPSED_EXT, gl.__f.q1); }
    const t0 = performance.now();
    try { return fn(ts); } finally {
      const dt = performance.now() - t0;
      if (ft.on) ft.cpu.set(ts, (ft.cpu.get(ts) || 0) + dt);
      if (go) { const f = gl.__f; gl.endQuery(gl.__tq.TIME_ELAPSED_EXT); gl.__f = null; if (f.split) ft.pend.push(f); else { gl.deleteQuery(f.q1); } }
    }
  });
  window.__collect = async () => {
    const gl = gls[0], out = [];
    for (const f of ft.pend) {
      for (let k = 0; k < 400 && !gl.getQueryParameter(f.q2, gl.QUERY_RESULT_AVAILABLE); k++) await new Promise((r) => setTimeout(r, 5));
      const dis = gl.getParameter(gl.__tq.GPU_DISJOINT_EXT);
      out.push({ ts: f.ts, sky: gl.getQueryParameter(f.q1, gl.QUERY_RESULT) / 1e6, rest: gl.getQueryParameter(f.q2, gl.QUERY_RESULT) / 1e6, strip: f.firstWasStrip4, draws: f.draws, dis });
      gl.deleteQuery(f.q1); gl.deleteQuery(f.q2);
    }
    ft.pend = []; const cpu = [...ft.cpu.entries()]; ft.cpu.clear();
    const c = gl.canvas; return { gpu: out, cpu, canvas: [c.width, c.height], renderer: gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL) };
  };
})();`;
const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
const f3 = (x) => (x === null ? '-' : x.toFixed(3));
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), [`--window-size=${W},${H}`, '--disable-frame-rate-limit', '--disable-gpu-vsync'], 't180c489-');
  const errors = [], rows = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text).slice(0, 200)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    const FIELD = (re) => `[...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || ''))`;
    const setField = (re, v) => ev(`const f = ${FIELD(re)}; f.value = '${v}'; f.dispatchEvent(new Event('input', { bubbles: true })); return true;`);
    const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: extra.button || 'none', buttons: extra.buttons || 0, clickCount: extra.clickCount || 0 });
    const load = async () => {
      await send('Page.navigate', { url: `${base}/app/lib/cjs.js` });
      for (let i = 0; i < 50; i++) { await sleep(100); try { if ((await ev('return location.href;')) === `${base}/app/lib/cjs.js`) break; } catch (e) { /* loading */ } }
      await ev(`document.title = 'zz-headless-test'; localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(LOOK))}); localStorage.setItem('t180.guide.done', '1'); return true;`);
      const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: PRE })).result.identifier;
      await send('Page.navigate', { url: `${base}/app/index.html` });
      for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;")) break; } catch (e) { /* loading */ } }
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
      await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
    };
    const extend = async (n, metres, turn) => {
      await setField('/metres added/', metres);
      for (let i = 0; i < n; i++) { await setField('/turn/i', turn(i)); const p = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Extend' && x.offsetParent); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];"); await mouse('mouseMoved', p[0], p[1]); await mouse('mousePressed', p[0], p[1], { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', p[0], p[1], { button: 'left', buttons: 0, clickCount: 1 }); await sleep(metres > 500 ? 600 : 150); }
    };
    const record = async (label) => {
      await mouse('mouseMoved', 1200, 400); await sleep(2500);
      const pieces = await ev("const m = document.body.innerText.match(/\\d+ pieces?/); return m ? m[0] : '0 pieces';");
      await ev('window.__ft.on = true; return true;'); await sleep(3000); await ev('window.__ft.on = false; return true;'); await sleep(100);
      const r = await ev('return await window.__collect();');
      const g = r.gpu.filter((x) => x.strip && !x.dis), sky = g.map((x) => x.sky), rest = g.map((x) => x.rest), tot = g.map((x) => x.sky + x.rest);
      const ts = r.cpu.map(([t]) => t).sort((a, b) => a - b), gap = ts.slice(1).map((t, i) => t - ts[i]), cpu = r.cpu.map(([, ms]) => ms);
      const row = { look: LOOK, track: label, pieces, canvas: r.canvas, frames: r.cpu.length, gpuFrames: g.length, notStrip: r.gpu.filter((x) => !x.strip).length, disjoint: r.gpu.filter((x) => x.dis).length,
        skyMedian: pct(sky, 0.5), skyP95: pct(sky, 0.95), restMedian: pct(rest, 0.5), restP95: pct(rest, 0.95), gpuMedian: pct(tot, 0.5), gpuP95: pct(tot, 0.95),
        cpuMedian: pct(cpu, 0.5), cpuP95: pct(cpu, 0.95), gapMedian: pct(gap, 0.5), gapP95: pct(gap, 0.95), draws: pct(g.map((x) => x.draws), 0.5), renderer: r.renderer };
      rows.push(row);
      console.log(`${LOOK} | ${label.padEnd(22)} | ${pieces.padEnd(10)} canvas ${r.canvas.join('x')} | frames ${row.frames} (gpu ${row.gpuFrames}, not-strip ${row.notStrip}, disjoint ${row.disjoint}) | GPU sky ${f3(row.skyMedian)} / p95 ${f3(row.skyP95)} | GPU rest ${f3(row.restMedian)} / ${f3(row.restP95)} | GPU frame ${f3(row.gpuMedian)} / ${f3(row.gpuP95)} | CPU ${f3(row.cpuMedian)} / ${f3(row.cpuP95)} | gap ${f3(row.gapMedian)} / ${f3(row.gapP95)} | draws ${row.draws}`);
    };
    await load(); await record('empty');
    await extend(12, 100, (i) => (i % 2 ? 12 : -12)); await record('12 x 100 m turns');
    await load(); await extend(30, 1000, (i) => (i % 3 ? 20 : -15)); await record('30 x 1,000 m');
    if (process.env.CSS_CYCLE) {
      // D489 addition: the panel following the cycle by CSS. Twenty changes of the skin's green and violet tokens on the root, 150 ms apart, each timed
      // with the style and layout it causes forced at once (offsetHeight); then the same with no change, as the control. Paint and compositing are not in it.
      const css = await ev(`const r = document.documentElement, out = [], ctl = []; const g = ['#6ff5c0', '#6fe3f5', '#9f8cff', '#ff8fb8'];
        for (let i = 0; i < 20; i++) { await new Promise((z) => setTimeout(z, 150)); const t0 = performance.now(); const c = g[i % 4];
          r.style.setProperty('--accent', c); r.style.setProperty('--violet', g[(i + 2) % 4]); r.style.setProperty('--green-glow', c + '73'); r.style.setProperty('--violet-glow', g[(i + 2) % 4] + '73'); r.style.setProperty('--road-edge', c);
          void document.body.offsetHeight; out.push(performance.now() - t0); }
        for (let i = 0; i < 20; i++) { await new Promise((z) => setTimeout(z, 150)); const t0 = performance.now(); void document.body.offsetHeight; ctl.push(performance.now() - t0); }
        for (const k of ['--accent', '--violet', '--green-glow', '--violet-glow', '--road-edge']) r.style.removeProperty(k); return { out, ctl };`);
      const row = { cssChange: { median: pct(css.out, 0.5), p95: pct(css.out, 0.95), max: Math.max(...css.out) }, control: { median: pct(css.ctl, 0.5), p95: pct(css.ctl, 0.95) } };
      rows.push(row);
      console.log(`CSS token change (5 properties on the root, style + layout forced): median ${f3(row.cssChange.median)} ms p95 ${f3(row.cssChange.p95)} max ${f3(row.cssChange.max)} | control (no change) median ${f3(row.control.median)} p95 ${f3(row.control.p95)}`);
    }
    console.log('renderer: ' + (rows[0] && rows[0].renderer));
    if (errors.length) console.log('page errors: ' + JSON.stringify(errors.slice(0, 5)));
  } finally {
    fs.writeFileSync(OUT, JSON.stringify({ rows, errors }, null, 1));
    try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
