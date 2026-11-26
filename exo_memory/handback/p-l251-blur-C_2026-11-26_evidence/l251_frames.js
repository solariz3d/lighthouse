// l251_frames.js (pane C, L251): THE FRAME INTERVAL WITH EIGHT WINDOWS, 40e931e's canvas windows against the branch's element windows (each look's blur), on the real
// page of each tree, in headless Chrome by the tree's own launcher (--mute-audio), titled zz-headless-test first and kept, without the frame-rate limit or vsync (so a
// frame's whole cost shows as its interval). A 1,000 m piece typed, the camera focused on it and strafing the whole time (a held key), so the view redraws under the
// windows every frame. Eight windows moved every frame (a drag's worth: 3 px a frame, the words changing), drawn by each tree's own markwindow.js: at 40e931e
// drawWindow on a canvas over #preview (as the marks' layer did), on the branch layer() over #preview. Control: the same page with no windows. Every animation frame's
// timestamp for SECONDS, after a second's settle. Order ABBA per round (round 1 base, branch; round 2 branch, base; ...), each case its own page load.
// usage: BASE=<tree> TIP=<tree> node l251_frames.js <rounds> [look]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const BASE = path.resolve(process.env.BASE), TIP = path.resolve(process.env.TIP), ROUNDS = +(process.argv[2] || 2), LOOK = process.argv[3] || 'aqua', SECONDS = 6;
const { chromePath, launchChrome, connect } = require(path.join(TIP, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css', '.woff2': 'font/woff2' };
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };

// the page side: eight windows a frame, by the tree's own markwindow.js (and tokens.js), loaded as the page loads its CommonJS
const DRIVE = (n) => `
  const load = async (p) => { const src = await (await fetch(p)).text(); const m = { exports: {} }; new Function('module', 'exports', 'require', src)(m, m.exports, () => { throw new Error('no require here'); }); return m.exports; };
  const MW = await load('/app/core/markwindow.js'), TK = await load('/app/lib/tokens.js'), T = window.__t180Tokens || TK.createTokens(window);
  const stage = document.getElementById('preview'), W = stage.clientWidth, H = stage.clientHeight, N = ${n}, colours = ['#4d86ff', '#b968ff', '#ffd23d', '#ff5a5a', '#3ddc6e', '#ffffff', '#3fd0c9', '#4d86ff'];
  let draw = () => {}, kind = 'none';
  if (N > 0 && typeof MW.layer === 'function') {
    kind = 'elements'; const L = MW.layer(stage, window, T, { z: 4, name: 'l251-measure' });
    draw = (f) => { L.begin(); for (let k = 0; k < N; k++) L.put({ x: 60 + ((k * 170 + f * 3) % (W - 300)), y: 80 + k * 80, w: 230, h: 42 }, ['Extra bank · ' + (300 + f % 500) + '.00 m → end', 'drag to start earlier or later'], colours[k], { edge: 1.5, firstY: 12 }); L.end(); };
  } else if (N > 0) {
    kind = 'canvas'; const c = document.createElement('canvas'); c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:4'; stage.append(c);
    const dpr = window.devicePixelRatio || 1; c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); const ctx = c.getContext('2d');
    draw = (f) => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); for (let k = 0; k < N; k++) MW.drawWindow(ctx, T, { x: 60 + ((k * 170 + f * 3) % (W - 300)), y: 80 + k * 80, w: 230, h: 42 }, ['Extra bank · ' + (300 + f % 500) + '.00 m → end', 'drag to start earlier or later'], colours[k], { edge: 1.5, firstY: 12 }); };
  }
  const ts = []; let f = 0, t0 = null;
  await new Promise((done) => { const step = (t) => { if (t0 === null) t0 = t; draw(f++); if (t - t0 > 1000) ts.push(t); if (t - t0 < ${(SECONDS + 1) * 1000}) requestAnimationFrame(step); else done(); }; requestAnimationFrame(step); });
  const shown = document.querySelectorAll('[data-mark-window="l251-measure"]').length, bf = (() => { const e = document.querySelector('[data-mark-window="l251-measure"]'); return e ? getComputedStyle(e).backdropFilter : null; })();
  return { kind, ts, shown, bf };`;

async function run(tree, n) {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(tree, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(tree)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--window-size=1400,860', '--disable-frame-rate-limit', '--disable-gpu-vsync'], 't180c-l251-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 200)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.title = 'zz-headless-test'; new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true }); try { localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(LOOK))}); localStorage.setItem('t180.guide.done', '1'); } catch (e) {}` });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("await new Promise((r) => setTimeout(r, 800)); return !!document.querySelector('#palette input') && document.querySelectorAll('#stage canvas').length >= 2;")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
  await ev("const f = [...document.querySelectorAll('#palette input')].find((e) => /metres added/.test(e.getAttribute('aria-label') || e.title || '')); f.value = '1000'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 1500)); return true;");
  await ev("let g = null; document.dispatchEvent(new CustomEvent('t180:ghost-request', { detail: { reply: (x) => { g = x; } } })); if (g) document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: g.s0 + 300 } })); await new Promise((r) => setTimeout(r, 2000)); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); return true;");
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1395, y: 855 });
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code: 'KeyD', key: 'd', windowsVirtualKeyCode: 68 });
  const r = await ev(DRIVE(n));
  await send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'KeyD', key: 'd', windowsVirtualKeyCode: 68 });
  const pose = await ev("let v = null; document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => { v = x; } } })); return v && v.pose ? v.pose.eye.map((x) => Math.round(x)) : null;");
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* left in temp */ }
  const iv = r.ts.slice(1).map((t, i) => t - r.ts[i]), mean = iv.reduce((a, b) => a + b, 0) / iv.length;
  return { kind: r.kind, windows: n, shown: r.shown, blur: r.bf, frames: iv.length, meanMs: +mean.toFixed(3), p50: +pct(iv, 0.5).toFixed(3), p95: +pct(iv, 0.95).toFixed(3), p99: +pct(iv, 0.99).toFixed(3), over16: +(100 * iv.filter((x) => x > 16.7).length / iv.length).toFixed(2), camEye: pose, errors };
}
(async () => {
  console.log(`l251 frames: look ${LOOK}, ${ROUNDS} rounds ABBA, ${SECONDS} s a case, base ${BASE}, tip ${TIP}`);
  for (let r = 1; r <= ROUNDS; r++) {
    const order = r % 2 ? [['base', BASE], ['tip', TIP]] : [['tip', TIP], ['base', BASE]];
    for (const [name, tree] of order) for (const n of [8, 0]) { const x = await run(tree, n); console.log(JSON.stringify({ round: r, tree: name, ...x })); }
  }
})().catch((e) => { console.error(e); process.exit(1); });
