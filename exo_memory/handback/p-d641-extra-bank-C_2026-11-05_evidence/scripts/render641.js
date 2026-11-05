// render641.js <repo> <out dir> <prefix>: D641, the builder's own page in headless Chrome (--headless=new, --mute-audio, titled zz-headless-test; every child process
// hidden by winhide.js; run at BelowNormal). His HUD's piece after a placed 1,000 m straight: length 2040.48, turn +90 as a corner, cup 15.5, width 31, bank +65.3; then
// the extra bank handle dragged by real mouse events (Input.dispatchMouseEvent), and shots in the Free view. Writes only under <out dir>.
'use strict';
require('./winhide.js');
const os = require('os'); os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const http = require('http'), fs = require('fs'), path = require('path');
const [REPO, OUT, PREFIX = ''] = process.argv.slice(2).map((x, i) => (i < 2 ? path.resolve(x) : x));
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml' };
const W = 1600, H = 1000;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), [`--window-size=${W},${H}`], 't180d641-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 600)}`); return d.result.result.value; };
  const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);
  try {
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });   // the page counts as focused, so the camera's keys are read as held
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; return true;");
    log('page ready; title', await ev('return document.title;'));
    // the panel's fields by their label, typed as a person types (value, then the input event the panel listens to)
    await ev(`window.__f = (t) => { const l = [...document.querySelectorAll('label')].find((e) => e.firstChild && e.firstChild.textContent === t && e.offsetParent !== null); if (!l) throw new Error('no field ' + t); return l.querySelector('input, select'); };
      window.__type = (t, v) => { const f = window.__f(t); f.value = String(v); f.dispatchEvent(new Event('input', { bubbles: true })); if (f.oninput) {} return f.value; };
      window.__btn = (t) => { const b = [...document.querySelectorAll('button')].find((e) => e.textContent.trim() === t && e.offsetParent !== null); if (!b) throw new Error('no button ' + t); b.click(); return true; };
      window.__handles = () => new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: res } })); setTimeout(() => res(null), 500); });
      window.__readout = () => [...document.querySelectorAll('[data-readout]')].map((e) => e.dataset.readout + '=' + e.textContent.trim()).join(' | ');
      return true;`);
    const frames = (n) => ev(`for (let i = 0; i < ${n}; i++) await new Promise((r) => requestAnimationFrame(() => r())); return true;`);
    await ev("window.__type('length m', 1000); return true;"); await frames(10); await ev("return window.__btn('Extend');"); await frames(30);
    log('placed the 1,000 m straight; pieces', await ev("return document.querySelectorAll('[data-piece], .piece-row').length;"));
    for (const [t, v] of [['length m', 2040.48], ['turn °', 90], ['cup °', 15.5], ['width m', 31], ['bank °', 65.3]]) { await ev(`window.__type(${JSON.stringify(t)}, ${JSON.stringify(v)}); return true;`); await frames(6); }
    await ev("return window.__btn('Free');"); await frames(60); await sleep(1500); await frames(20);
    const shot = async (name) => { await frames(20); await sleep(400); const r = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, `${PREFIX}${name}.png`); fs.writeFileSync(f, Buffer.from((r.result || r).data, "base64")); log('shot', f, 'readout:', await ev('return window.__readout();')); };
    const hs = await ev('return await window.__handles();');
    log('handles', JSON.stringify((hs || []).map((h) => [h.kind, h.side, Math.round(h.x), Math.round(h.y)])));
    await shot('0-piece-bank-65');
    // the stage's offset on the page, so a handle's preview px become page px for the mouse
    const off = await ev("const r = document.getElementById('preview').getBoundingClientRect(); return [r.left, r.top];");
    const eb = (hs || []).find((h) => h.kind === 'extra:bank:0' && h.side === 1) || (hs || []).find((h) => h.kind === 'extra:bank:0');
    if (!eb) throw new Error('no extra bank handle on screen');
    const x0 = off[0] + eb.x, y0 = off[1] + eb.y;
    const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1, ...extra });
    // one long quick drag straight down the screen from the extra bank handle: 300 steps of 8 px, as his hand would scrub it
    await mouse('mouseMoved', x0, y0, { buttons: 0 }); await mouse('mousePressed', x0, y0);
    const seen = [];
    for (let i = 1; i <= 300; i++) { await mouse('mouseMoved', x0, y0 + i * 8); if (i % 15 === 0) { await frames(2); seen.push(`${i * 8}px ${await ev("return (document.querySelector('[data-readout=\"bank\"]') || {}).textContent || '';")}`); } }
    await mouse('mouseReleased', x0, y0 + 2400); await frames(30);
    log('drag, the HUD bank every 120 px:', seen.join(' ; '));
    // the guide box off the view (its own close), then each state in three views: Overhead and Side (the camera bar), and Free pulled back by the wheel
    await ev("const b = [...document.querySelectorAll('button')].find((e) => e.textContent.trim() === 'Skip' && e.offsetParent !== null); if (b) b.click(); return true;"); await frames(10);
    // the preview's own focus ('t180-camera-focus' { s }: free camera above and behind the station, looking at it), then pulled back by the wheel. The new piece runs
    // from s 1000 (the placed straight's end) to 3040.48; its extra bank's change from 1020.24 into it, so 2020 on
    const views = async (name) => {
      const c = await ev("const r = document.getElementById('preview').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];");
      // the Free view flown by its own keys (preview.js KEYS: Space up, the arrows look, Shift sprints), the same flight for every state, from the same start (Build, then Free)
      const KEY = { Space: [' ', 32], ArrowRight: ['ArrowRight', 39], ArrowDown: ['ArrowDown', 40], ArrowLeft: ['ArrowLeft', 37], KeyW: ['w', 87], KeyS: ['s', 83], ShiftLeft: ['Shift', 16] };
      const hold = async (codes, ms) => {
        for (const k of codes) await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code: k, key: KEY[k][0], windowsVirtualKeyCode: KEY[k][1] });
        const t0 = Date.now(); while (Date.now() - t0 < ms) await frames(1);
        for (const k of codes.slice().reverse()) await send('Input.dispatchKeyEvent', { type: 'keyUp', code: k, key: KEY[k][0], windowsVirtualKeyCode: KEY[k][1] });
      };
      const FLY = JSON.parse(process.env.FLY || '[[["ShiftLeft","Space"],1500],[["ArrowRight"],500],[["ArrowDown"],350]]');
      await ev("return window.__btn('Build');"); await frames(10); await ev("return window.__btn('Free');"); await frames(30); await sleep(400);
      await ev("if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); return true;");   // the fields let go of the keys (never a canvas click: it selects a piece)
      for (const [codes, ms] of FLY) await hold(codes, ms);
      await sleep(600); await shot(`${name}-free`);
    };
    await views('1-long-drag-stop');
    // the extra bank typed in its own row ("extra bank °"), as a value he could reach: his HUD's −294.70, back to level, and more bank
    for (const [name, v] of [['2-his-hud-minus294.7', -294.7], ['3-level-0', 0], ['4-more-plus90', 90]]) {
      await ev(`window.__type('extra bank °', ${v}); return true;`); await frames(20);
      await views(name);
    }
    log('page errors', errors.length ? errors.join(' || ').slice(0, 800) : 'none');
  } finally {
    try { ws.close(); } catch (e) { /* closing */ }
    ch.kill(); srv.close(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
