// make_blur_mock.js (pane C, L245): the blur mock. For each look (glass, aqua, aurora, skyline, skyline-night):
//   1. find A's canvas label window in hover_bank.png: the pixels that differ from rest.png, the densest large connected region (the window's filled box);
//   2. crop the same 640 x 360 region, around the window, out of hover_bank.png (left) and rest.png (right), lossless PNG;
//   3. write blur_mock.html: per look, left the crop of A's picture as it is, right the crop of rest.png with the same label as an HTML window at the same
//      place, styled with that look's #left panel CSS from app/themes/<look>.css at builder 0ab6cc8 (copied into the page below, values verbatim).
// Then it screenshots the page per look (shots/<look>.png) for checking. Headless Chrome through the DevTools protocol; nothing in the builder is touched.
// usage: node make_blur_mock.js <A's pics dir> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const { spawn } = require('child_process');
const [PICS, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const LOOKS = ['glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const CW = 640, CH = 360;

// each look's #left panel rule (app/themes/<look>.css at 0ab6cc8), its var()s resolved from the same file; --tex (the texture tile) left out
const PANEL = {
  glass: { file: 'app/themes/glass.css:73-79', bg: 'linear-gradient(155deg, rgba(215, 242, 255, .12) 0%, rgba(110, 175, 215, .06) 18%, rgba(6, 22, 36, .88) 42%, rgba(4, 14, 24, .92) 100%)',
    border: 'rgba(205, 240, 255, .58)', radius: '0', blur: 'blur(18px) saturate(160%) brightness(1.08)', shadow: 'inset 0 1px 0 rgba(255, 255, 255, .55), inset 1px 0 0 rgba(255, 255, 255, .22), 0 0 0 1px rgba(0, 10, 20, .5)',
    clip: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)', text: '#f0f9ff', font: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif', note: 'the facet cut at 10 px, not the panel\'s 22 px (a 42 px window)' },
  aqua: { file: 'app/themes/aqua.css:87-94', bg: 'radial-gradient(120% 34px at 50% 0%, rgba(255, 255, 255, .26), transparent 100%), linear-gradient(180deg, rgba(10, 110, 135, .90) 0%, rgba(4, 64, 80, .93) 26%, rgba(2, 40, 52, .95) 100%)',
    border: 'rgba(150, 245, 255, .70)', radius: '18px', blur: 'blur(14px) saturate(170%)', shadow: 'inset 0 1px 0 rgba(255, 255, 255, .62), 0 0 0 1px rgba(0, 30, 40, .6)', text: '#f2fdff', font: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
  aurora: { file: 'app/themes/aurora.css:73-79', bg: 'radial-gradient(70% 220px at 20% 0%, rgba(111, 245, 192, .2), transparent 70%), radial-gradient(60% 200px at 85% 0%, rgba(160, 120, 255, .3), transparent 70%), rgba(8, 10, 30, .84)',
    border: 'rgba(150, 200, 255, .2)', radius: '16px', blur: 'blur(16px) saturate(1.4)', shadow: 'inset 0 1px 0 rgba(111, 245, 192, .22)', text: '#eaf6ff', font: 'Bahnschrift, "DIN Alternate", "Segoe UI", system-ui, sans-serif' },
  skyline: { file: 'app/themes/skyline.css:67-72', bg: 'linear-gradient(180deg, rgba(255, 255, 255, .85) 0, rgba(255, 255, 255, 0) 120px), rgba(255, 255, 255, .8)',
    border: 'rgba(255, 255, 255, .95)', radius: '16px', blur: 'blur(18px) saturate(1.3)', shadow: 'inset 0 1px 0 #fff, inset 0 0 0 1px rgba(120, 180, 240, .25)', text: '#0b2747', font: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
  'skyline-night': { file: 'app/themes/skyline-night.css:65-70', bg: 'linear-gradient(180deg, rgba(120, 180, 255, .12) 0, rgba(120, 180, 255, 0) 120px), rgba(14, 30, 62, .82)',
    border: 'rgba(120, 180, 255, .35)', radius: '16px', blur: 'blur(18px) saturate(1.2)', shadow: 'inset 0 1px 0 rgba(170, 215, 255, .25), inset 0 0 0 1px rgba(90, 150, 230, .2)', text: '#e8f2ff', font: '"Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif' },
};
const LABEL = ['Bank 4 · passes 25.00° at 255.00 m', 'drag to move it'];

async function chrome() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-l245-chrome-'));
  const ch = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--use-angle=d3d11', '--ignore-gpu-blocklist', 'about:blank'], { stdio: 'ignore' });
  const portFile = path.join(dir, 'DevToolsActivePort');
  for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 50));   // Chrome writes its port here once it listens
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(), page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 500)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  const close = () => { try { ws.close(); } catch (e) { /* closed */ } ch.kill(); setTimeout(() => { try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome still holds a file: left in temp */ } }, 1500); };
  return { send, ev, errors, close };
}

function serve(root) {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(root, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(root)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': p.endsWith('.png') ? 'image/png' : 'text/html; charset=utf-8' }); s.end(b); }); });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv)));
}

(async () => {
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  const srv = await serve(PICS), base = `http://127.0.0.1:${srv.address().port}`;
  const C = await chrome();
  await C.send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  await C.send('Page.navigate', { url: base + '/glass/rest.png' }); await new Promise((r) => setTimeout(r, 400));
  const found = {};
  for (const look of LOOKS) {
    found[look] = await C.ev(`
      const load = (u) => new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = u; });
      const [h, s] = await Promise.all([load('${base}/${look}/hover_bank.png'), load('${base}/${look}/rest.png')]);
      const W = h.width, H = h.height, px = (img) => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H).data; };
      const a = px(h), b = px(s), mask = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) { const k = i * 4; if (Math.max(Math.abs(a[k] - b[k]), Math.abs(a[k + 1] - b[k + 1]), Math.abs(a[k + 2] - b[k + 2])) > 40) mask[i] = 1; }
      const seen = new Uint8Array(W * H), comps = [];
      for (let i = 0; i < W * H; i++) { if (!mask[i] || seen[i]) continue; let x0 = W, y0 = H, x1 = 0, y1 = 0, n = 0; const st = [i]; seen[i] = 1;
        while (st.length) { const j = st.pop(), x = j % W, y = (j - x) / W; n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          for (const q of [j - 1, j + 1, j - W, j + W]) if (q >= 0 && q < W * H && mask[q] && !seen[q] && Math.abs((q % W) - x) <= 1) { seen[q] = 1; st.push(q); } }
        comps.push({ x0, y0, x1, y1, n, fill: n / ((x1 - x0 + 1) * (y1 - y0 + 1)) }); }
      const box = comps.filter((c) => (c.x1 - c.x0) > 80 && (c.y1 - c.y0) > 20 && c.y0 > 44).sort((p, q) => q.n - p.n)[0];
      const cx = Math.max(0, Math.min(W - ${CW}, Math.round((box.x0 + box.x1) / 2 - ${CW} / 2))), cy = Math.max(44, Math.min(H - ${CH}, Math.round(box.y0 - 70)));
      const crop = (img) => { const c = document.createElement('canvas'); c.width = ${CW}; c.height = ${CH}; c.getContext('2d').drawImage(img, cx, cy, ${CW}, ${CH}, 0, 0, ${CW}, ${CH}); return c.toDataURL('image/png'); };
      return { box, crop: { x: cx, y: cy }, comps: comps.length, hover: crop(h), rest: crop(s) };`);
    const f = found[look]; console.log(`${look}: window box x ${f.box.x0}-${f.box.x1}, y ${f.box.y0}-${f.box.y1} (fill ${f.box.fill.toFixed(2)}, ${f.box.n} px of ${f.comps} changed regions); crop at ${f.crop.x},${f.crop.y}`);
  }
  // the page
  const css = (look) => { const P = PANEL[look]; return `.win.${look} { background: ${P.bg}; border: 1px solid ${P.border}; border-radius: ${P.radius}; backdrop-filter: ${P.blur}; -webkit-backdrop-filter: ${P.blur}; box-shadow: ${P.shadow};${P.clip ? ` clip-path: ${P.clip};` : ''} color: ${P.text}; font-family: ${P.font}; }\n.blurless .win.${look} { backdrop-filter: none; -webkit-backdrop-filter: none; }`; };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const rows = LOOKS.map((look) => { const f = found[look], P = PANEL[look], x = f.box.x0 - f.crop.x, y = f.box.y0 - f.crop.y;
    return `<section><h2>${look}</h2><div class="pair">
  <figure><div class="frame"><img alt="${look}: A's hover_bank.png, the canvas window" src="${f.hover}"></div><figcaption>Today, built: the canvas window (A's <code>hover_bank.png</code>, L242). No blur: a canvas cannot see what is behind it.</figcaption></figure>
  <figure><div class="frame"><img alt="${look}: rest.png" src="${f.rest}"><div class="win ${look}" style="left:${x}px;top:${y}px" title="drag me">${LABEL.map(esc).join('<br>')}</div><div class="win ${look} moved" style="left:330px;top:205px" title="drag me">${LABEL.map(esc).join('<br>')}<span class="tag">moved over the road</span></div></div><figcaption>The same label as an HTML window in this look's left-panel glass (<code>${P.file}</code>): <code>backdrop-filter: ${P.blur}</code>, radius ${P.radius}, its border and sheen.${P.note ? ' Changed: ' + P.note + '.' : ''} The upper window is where A's sits (over open sky, so the blur has little to show); the lower one is the same window moved over the road, where it does. Both can be dragged.</figcaption></figure>
</div></section>`; }).join('\n');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>T-180: the label windows, canvas or blurred glass</title>
<style>
:root { color-scheme: dark; } body { margin: 0; padding: 24px 28px 48px; background: #0b0d11; color: #e6e9ef; font: 14px/1.5 "Segoe UI", system-ui, sans-serif; }
h1 { font: 600 20px/1.3 "Segoe UI", system-ui, sans-serif; margin: 0 0 6px; } h2 { font: 600 15px "Segoe UI", system-ui, sans-serif; margin: 28px 0 10px; text-transform: capitalize; letter-spacing: .02em; }
p.lead { margin: 0 0 12px; color: #aab2c0; max-width: 1300px; } label.tog { display: inline-flex; gap: 8px; align-items: center; cursor: pointer; padding: 6px 12px; border: 1px solid #2a3140; border-radius: 6px; background: #141922; }
.pair { display: flex; flex-wrap: wrap; gap: 20px; } figure { margin: 0; width: ${CW}px; } figcaption { color: #9aa3b2; font-size: 12.5px; margin-top: 6px; }
.frame { position: relative; width: ${CW}px; height: ${CH}px; overflow: hidden; border-radius: 4px; outline: 1px solid #252b36; } .frame img { display: block; width: ${CW}px; height: ${CH}px; user-select: none; -webkit-user-drag: none; }
.win { position: absolute; padding: 3px 6px; font-size: 12px; font-weight: 600; line-height: 18px; white-space: nowrap; cursor: grab; user-select: none; touch-action: none; } .win:active { cursor: grabbing; }
.win .tag { position: absolute; right: 4px; bottom: -17px; font: 600 10px "Segoe UI", system-ui, sans-serif; color: #ffd23d; text-shadow: 0 1px 2px #000; white-space: nowrap; }
${LOOKS.map(css).join('\n')}
code { font-size: 12px; color: #c8d0dc; }
</style></head><body>
<h1>The label windows: today's canvas box, or the look's own blurred glass</h1>
<p class="lead">Five looks, A's real pictures from L242 (builder 0ab6cc8, Coast Esses, Free view), cropped 1:1 around the label. Left: the window as the app draws it now, on a canvas. Right: the same picture without the window (A's <code>rest.png</code>), with the same words in an HTML box styled with that look's left-panel CSS, so the blur is the browser's real <code>backdrop-filter</code> over the real render. The windows on the right can be dragged.</p>
<label class="tog"><input type="checkbox" id="blur" checked> blur on (untick to see the same glass with no blur)</label>
${rows}
<script>
document.getElementById('blur').addEventListener('change', (e) => document.body.classList.toggle('blurless', !e.target.checked));
for (const w of document.querySelectorAll('.win')) {
  let d = null;
  w.addEventListener('pointerdown', (e) => { d = { x: e.clientX - w.offsetLeft, y: e.clientY - w.offsetTop }; w.setPointerCapture(e.pointerId); });
  w.addEventListener('pointermove', (e) => { if (!d) return; const f = w.parentElement; w.style.left = Math.max(0, Math.min(f.clientWidth - w.offsetWidth, e.clientX - d.x)) + 'px'; w.style.top = Math.max(0, Math.min(f.clientHeight - w.offsetHeight, e.clientY - d.y)) + 'px'; });
  w.addEventListener('pointerup', () => { d = null; });
}
</script></body></html>`;
  fs.writeFileSync(path.join(OUT, 'blur_mock.html'), html);
  console.log(`blur_mock.html: ${fs.statSync(path.join(OUT, 'blur_mock.html')).size} bytes`);
  // check it: load the page and screenshot each look's pair
  await C.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
  await C.send('Page.navigate', { url: 'file:///' + path.join(OUT, 'blur_mock.html').replace(/\\/g, '/') }); await new Promise((r) => setTimeout(r, 1200));
  const info = await C.ev(`return [...document.querySelectorAll('section')].map((s) => { const r = s.getBoundingClientRect(), w = s.querySelector('.win'), cs = getComputedStyle(w); return { y: r.top + scrollY, h: r.height, bf: cs.backdropFilter, radius: cs.borderRadius, font: cs.fontFamily }; });`);
  for (let i = 0; i < LOOKS.length; i++) {
    const s = info[i]; const shot = await C.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: s.y, width: 1400, height: s.h, scale: 1 } });
    fs.writeFileSync(path.join(OUT, 'shots', `${LOOKS[i]}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`${LOOKS[i]}: computed backdrop-filter "${s.bf}", radius ${s.radius}, font ${s.font}`);
  }
  console.log(`page errors: ${C.errors.length ? C.errors.join(' | ') : 0}`);
  C.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
