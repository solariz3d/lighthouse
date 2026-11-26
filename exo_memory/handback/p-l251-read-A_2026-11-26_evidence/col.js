// col.js (pane A, L251 read): a label window shown where the l254 left column sits, in a SCRATCH merge of l254-left-column onto 6a3ea79 (uncommitted). Headless Chrome
// through the builder's launchChrome (--mute-audio, the browser cap), titled zz-headless-test first and kept. Coast Esses from his pieces folder READ-ONLY (a stand-in
// native side), shown as a ghost after two Extends; the Free view flown up, back and to the right (as l254_shots.js) so the road runs under the column.
// Per look: the column armed and cleared; a mark's dot under it (x 40..240, clear of the 24 px strip) hovered, so its label shows; is the column still cleared, is the label
// shown, and does it show through (the screen's pixels at its centre with the label and with it hidden); then the column brought back by Tab (focus emulation on): does it
// cover the label. usage: TREE=<merged tree> node col.js <out dir> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const { decode } = require(path.join(T, 'app/test/png.js'));
const OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['aqua', 'sigil'];
const W = 1500, H = 900, PIECE = 'Coast Esses';
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');   // read only
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look) {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${W},${H}`], 't180a-l251c-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  const mv = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0 });
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); localStorage.setItem('t180.guide.done', '1'); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => cmd === 'list_pieces' ? Promise.resolve(window.__NAMES) : cmd === 'open_piece' ? Promise.resolve(window.__FILES[a.name + '.t180piece'])
      : cmd === 'open_recipe' ? Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null) : /^list_/.test(cmd) ? Promise.resolve([]) : Promise.resolve(null) }, event: { listen: () => Promise.resolve(() => {}) } };
    (() => { const P = CanvasRenderingContext2D.prototype, arc0 = P.arc, fill0 = P.fill, C = P.clearRect; let pend = null; const lab = (c) => c.canvas.getAttribute && c.canvas.getAttribute('aria-label');
      window.__dots = []; window.__next = [];
      P.arc = function (x, y, r) { if (lab(this) === 'later changes' && r < 6) pend = { x, y }; return arc0.apply(this, arguments); };
      P.fill = function () { if (pend) { window.__next.push(pend); pend = null; } return fill0.apply(this, arguments); };
      P.clearRect = function () { if (lab(this) === 'later changes') { window.__dots = window.__next; window.__next = []; } return C.apply(this, arguments); }; })();` });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("for (const t of ['✕', 'Skip']) { const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === t); if (b && b.offsetParent) b.click(); } return true;"); await sleep(300);
  for (let i = 0; i < 2; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend' && x.offsetParent); b.click(); await new Promise((r) => setTimeout(r, 600)); return true;");
  // (second take) no saved piece's ghost: its Place piece row holds the column shown by design (L254). The next piece's own ghost and its drag handles instead: a
  // handle under the cleared column, hovered, shows its readout window there
  await ev("const f = [...document.querySelectorAll('#palette input')].find((e) => /metres added/.test(e.getAttribute('aria-label') || e.title || '')); f.value = '600'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 1500)); return true;");
  await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Free'); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;");
  const key = async (code, k, ms) => { const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); };
  await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
  await key('Space', ' ', 5000); await key('KeyS', 's', 1500); await key('KeyD', 'd', 1500);
  // the column armed (the pointer on it) and cleared (the pointer off it, past the delay and the fade)
  await mv(120, 450); await sleep(200); await mv(1300, 700); await sleep(1200);
  const rec = { look, column: await ev("const L = document.getElementById('left'); return { cleared: L.classList.contains('cleared'), opacity: getComputedStyle(L).opacity };") };
  const handlesNow = () => ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const s = document.getElementById('stage').getBoundingClientRect(); return (l || []).map((h) => [h.x + s.left, h.y + s.top, h.kind]);");
  const inBand = (l) => l.filter(([x, y]) => x > 40 && x < 200 && y > 100 && y < H - 120);
  // the camera nudged (D or A, 200 ms at a time, at most 30) until a handle sits under the column, clear of the strip
  let dots = await handlesNow(), nudges = [];
  // steer by the handle nearest the column's middle (x 120) among those at a usable height; 120 ms holds
  for (let i = 0; i < 15 && !inBand(dots).length && dots.length; i++) {
    const ok = dots.filter(([, y]) => y > 100 && y < H - 120); if (!ok.length) break;
    const t = ok.reduce((a, b) => (Math.abs(b[0] - 120) < Math.abs(a[0] - 120) ? b : a)), k = t[0] > 120 ? ['KeyD', 'd'] : ['KeyA', 'a'];
    await key(k[0], k[1], 400); await sleep(300); nudges.push(k[1]); dots = await handlesNow();
  }
  const under = inBand(dots);
  rec.nudges = nudges.join(''); rec.handlesAt = dots.map((h) => `${h[2]}@${Math.round(h[0])},${Math.round(h[1])}`);
  rec.handles = dots.length; rec.handlesUnderColumn = under.map((h) => `${h[2]}@${Math.round(h[0])},${Math.round(h[1])}`);
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'webp', quality: 88 }); fs.writeFileSync(path.join(OUT, `${look}_${name}.webp`), Buffer.from(d.result.data, 'base64')); };
  const px = async (x, y) => { const d = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.round(x) - 1, y: Math.round(y) - 1, width: 3, height: 3, scale: 1 } }); const img = decode(Buffer.from(d.result.data, 'base64')); return img.px(1, 1); };
  if (under.length) {
    const [x, y] = under[0]; await mv(x, y); await sleep(600);
    const wins = await ev("return [...document.querySelectorAll('[data-mark-window]')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { const b = e.getBoundingClientRect(); return { layer: e.getAttribute('data-mark-window'), words: e.textContent.split('\\n')[0].slice(0, 50), box: [b.left, b.top, b.width, b.height].map(Math.round) }; });");
    rec.hovered = [Math.round(x), Math.round(y)]; rec.windows = wins;
    rec.columnAfterHover = await ev("const L = document.getElementById('left'); return { cleared: L.classList.contains('cleared'), opacity: getComputedStyle(L).opacity };");
    const w = wins.find((v) => v.layer === 'later changes') || wins[0];
    if (w) {
      const c = [w.box[0] + 8, w.box[1] + w.box[3] / 2];   // inside the window, at its left (its fill, not its words)
      rec.windowPoint = c.map(Math.round); rec.windowUnderColumn = c[0] < 248;
      const on = await px(...c);
      await ev("for (const e of document.querySelectorAll('[data-mark-windows]')) e.style.visibility = 'hidden'; return true;"); await sleep(150);
      const off = await px(...c);
      await ev("for (const e of document.querySelectorAll('[data-mark-windows]')) e.style.visibility = ''; return true;"); await sleep(150);
      rec.clearedPixel = { withWindow: on, without: off, differ: on.some((v, i) => Math.abs(v - off[i]) > 12) };
      await shot('cleared_window');
      // the column back by Tab (keyboard focus brings it back; the pointer stays where it is, so the window stays shown)
      await send('Emulation.setFocusEmulationEnabled', { enabled: true });
      await ev("document.querySelector('header #install > button').focus(); return true;");
      for (let i = 0; i < 30; i++) { await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); if (await ev("return !!document.activeElement.closest('#left');")) break; }
      await sleep(600);
      rec.columnBack = await ev("const L = document.getElementById('left'); return { cleared: L.classList.contains('cleared'), opacity: getComputedStyle(L).opacity, windowsShown: [...document.querySelectorAll('[data-mark-window]')].filter((e) => getComputedStyle(e).display !== 'none').length };");
      const on2 = await px(...c);
      await ev("for (const e of document.querySelectorAll('[data-mark-windows]')) e.style.visibility = 'hidden'; return true;"); await sleep(150);
      const off2 = await px(...c);
      await ev("for (const e of document.querySelectorAll('[data-mark-windows]')) e.style.visibility = ''; return true;");
      rec.shownPixel = { withWindow: on2, without: off2, maxChannelDiff: Math.max(...on2.map((v, i) => Math.abs(v - off2[i]))) };
      await shot('column_back');
      await send('Emulation.setFocusEmulationEnabled', { enabled: false });
    }
  }
  rec.pageErrors = errors.slice();
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  return rec;
}

(async () => { const all = []; for (const l of LOOKS) { const r = await one(l); all.push(r); console.log(JSON.stringify(r)); } fs.writeFileSync(path.join(OUT, 'col_log.json'), JSON.stringify(all, null, 1)); })().catch((e) => { console.error(e); process.exit(1); });
