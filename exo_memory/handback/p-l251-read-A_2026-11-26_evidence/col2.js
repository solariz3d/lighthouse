// col2.js (pane A, L251 read): C's label windows and A's l254 column together, in a SCRATCH merge of l254-left-column onto 6a3ea79 (uncommitted, never committed).
// Headless Chrome through the tree's own launchChrome (--mute-audio), titled zz-headless-test first and kept. No saved piece (his folder is not read here): two Extends.
// Per look: the column armed (the pointer on it), then the length handle hovered so its readout window shows, and the pointer kept there past the column's delay and fade.
//   (1) does the column clear while a window is shown, and is the window untouched by it (the same node, the same words, no element added or removed);
//   (2) paint order at the column's place (x 130, clear of the 24 px strip): a magenta 40 x 20 box INSIDE each window layer's own container, so it paints exactly where
//       that layer's windows paint; the screen's pixel there with the column cleared (expect the box: nothing of the column paints) and with the column back by Tab
//       (expect the column over it, as the canvas windows were at 40e931e);
//   (3) the readout still shown with the column back.
// usage: TREE=<merged tree> node col2.js <out dir> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const { decode } = require(path.join(T, 'app/test/png.js'));
const OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['aqua', 'sigil'];
const W = 1500, H = 900, PX = 130, PY = 450;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };

async function one(look) {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${W},${H}`], 't180a-l251c2-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  const mv = (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0 });
  const px = async (x, y) => { const d = await send('Page.captureScreenshot', { format: 'png', clip: { x: x - 1, y: y - 1, width: 3, height: 3, scale: 1 } }); return decode(Buffer.from(d.result.data, 'base64')).px(1, 1); };
  const magenta = (c) => c[0] > 230 && c[1] < 40 && c[2] > 230;
  const shot = async (name) => { const d = await send('Page.captureScreenshot', { format: 'webp', quality: 88 }); fs.writeFileSync(path.join(OUT, `${look}_${name}.webp`), Buffer.from(d.result.data, 'base64')); };
  await send('Runtime.enable'); await send('Page.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); localStorage.setItem('t180.guide.done', '1'); } catch (e) {}
    window.__TAURI__ = { core: { invoke: (cmd) => /^list_/.test(cmd) ? Promise.resolve([]) : Promise.resolve(null) }, event: { listen: () => Promise.resolve(() => {}) } };` });
  await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("for (const t of ['✕', 'Skip']) { const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === t); if (b && b.offsetParent) b.click(); } return true;"); await sleep(300);
  for (let i = 0; i < 2; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend' && x.offsetParent); b.click(); await new Promise((r) => setTimeout(r, 600)); return true;");
  await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
  const colState = () => ev("const L = document.getElementById('left'); return { cleared: L.classList.contains('cleared'), opacity: getComputedStyle(L).opacity };");
  const shown = () => ev("return [...document.querySelectorAll('[data-mark-window]')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { if (!e.__l251) e.__l251 = Math.random().toString(36).slice(2, 8); const b = e.getBoundingClientRect(); return { layer: e.getAttribute('data-mark-window'), tag: e.__l251, words: e.textContent.split('\\n')[0].slice(0, 40), box: [b.left, b.top, b.width, b.height].map(Math.round) }; });");
  const rec = { look };
  // the column armed, then the length handle hovered (its readout shows) and held there past the delay (400 ms) and the fade (200 ms)
  await mv(120, PY); await sleep(250);
  const h = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); const h = (l || []).find((x) => x.kind === 'length'); return h ? [Math.round(h.x + r.left), Math.round(h.y + r.top)] : null;");
  if (!h) { rec.error = 'no length handle'; } else {
    rec.handle = h;
    await mv(h[0] - 30, h[1]); await sleep(50); await mv(h[0], h[1]); await sleep(150);
    rec.atHover = { column: await colState(), windows: await shown() };
    await ev("window.__m = { added: 0, removed: 0 }; window.__mo = new MutationObserver((ms) => { for (const m of ms) { window.__m.added += [...m.addedNodes].filter((n) => n.nodeType === 1).length; window.__m.removed += [...m.removedNodes].filter((n) => n.nodeType === 1).length; } }); for (const l of document.querySelectorAll('[data-mark-windows]')) window.__mo.observe(l, { childList: true }); return true;");
    await sleep(1200);
    rec.afterClear = { column: await colState(), windows: await shown(), mutations: await ev('return window.__m;') };
    rec.sameWindowAcrossClear = JSON.stringify(rec.atHover.windows) === JSON.stringify(rec.afterClear.windows);
    rec.containers = await ev("return [...document.querySelectorAll('[data-mark-windows]')].map((e) => e.getAttribute('data-mark-windows') + ' z' + getComputedStyle(e).zIndex);");
    await shot('cleared_readout');
    const probe = async () => {
      const out = {};
      for (const L of ['later changes', 'drag handles']) {
        const ok = await ev(`const box = document.querySelector('[data-mark-windows="${L}"]'); if (!box) return false; const s = box.getBoundingClientRect(), b = document.createElement('div'); b.id = 'l251probe';
          b.style.cssText = 'position:absolute;pointer-events:none;background:#ff00ff;width:40px;height:20px;left:' + (${PX} - s.left - 20) + 'px;top:' + (${PY} - s.top - 10) + 'px'; box.append(b); return true;`);
        if (!ok) { out[L] = 'no container'; continue; }
        await sleep(120); const c = await px(PX, PY); out[L] = magenta(c) ? 'WINDOW SHOWS' : `covered ${c.join(',')}`;
        await ev("const b = document.getElementById('l251probe'); if (b) b.remove(); return true;"); await sleep(80);
      }
      return out;
    };
    rec.paintCleared = await probe();
    // the column back by Tab (focus emulation on, so :focus-visible holds); the pointer stays on the handle
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });
    await ev("document.querySelector('header #install > button').focus(); return true;");
    for (let i = 0; i < 30; i++) { await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); if (await ev("return !!document.activeElement.closest('#left');")) break; }
    await sleep(700);
    rec.columnBack = { column: await colState(), windows: await shown() };
    rec.paintShown = await probe();
    await shot('column_back');
    await send('Emulation.setFocusEmulationEnabled', { enabled: false });
  }
  rec.pageErrors = errors.slice();
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  return rec;
}

(async () => { const all = []; for (const l of LOOKS) { const r = await one(l); all.push(r); console.log(JSON.stringify(r)); } fs.writeFileSync(path.join(OUT, 'col2_log.json'), JSON.stringify(all, null, 1)); })().catch((e) => { console.error(e); process.exit(1); });
