// render152.js <root holding base/ and way1/ worktrees> <out folder>: pane E, L152. ONE headless Chrome (muted, no window, titled zz-headless-test), his S on fc3cc63
// and on 17767bd, as still pictures of the piece. Built from C's render6.js (lighthouse exo_memory/handback/p-l142-C_2026-11-06_evidence/scripts): the real page served
// over http, real mouse events, the browser and the server closed at the end and its temp profile removed. NOT a timing run: no frame is timed.
// His S, in his order: length 1000, turn −90 (corner), bank 17.39; the extra turn's handle dragged a little to make its row, +180 typed into it; then the extra bank's
// handle dragged a little to make its row, −34.78 typed into it. Marks are left where the build puts them (fc3cc63: 500; 17767bd: 380).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L152: renders of his S, one headless Chrome, a few frames (BelowNormal; NOT a timing session)' });
const { chromePath, launchChrome, connect } = require(path.join(ROOT, 'base/app/test/soundrender.js'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.glsl': 'text/plain' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const log = []; const say = (...a) => { const l = a.join(' '); log.push(l); console.log(l); };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const CHROME = chromePath(); if (!CHROME) throw new Error('no Chrome here');
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(ROOT, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(ROOT)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  let ch, dir, ws; const errors = [];
  try {
    let tgt; ({ ch, dir, tgt } = await launchChrome(CHROME, ['--window-size=1400,1000'], 't180l152e-')); say('chrome pid', ch.pid);
    let send; ({ ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 200)); }));
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 300)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1000, deviceScaleFactor: 1, mobile: false });
    const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, Buffer.from(r.result.data, 'base64')); say('wrote', f); return f; };
    const setField = (label, v) => ev(`const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === ${JSON.stringify(label)}); if (!l) return 'no ' + ${JSON.stringify(label)}; const i = l.querySelector('input'); i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input')); return true;`);
    const handles = () => ev("return new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: res } })); setTimeout(() => res(null), 500); }).then((l) => { const r = document.getElementById('preview').getBoundingClientRect(); return (l || []).map((h) => ({ ...h, px: h.x + r.left, py: h.y + r.top })); });");
    const camera = (name) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${JSON.stringify(name)}); if (b) b.click(); return !!b;`);
    const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
    const state = () => ev("const rows = [...document.querySelectorAll('#palette .then-row input')].map((i) => [i.getAttribute('aria-label'), i.value]); const f = (t) => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === t); return l ? l.querySelector('input').value : null; }; const msg = [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | '); return { length: f('length m'), turn: f('turn °'), bank: f('bank °'), rows, msg };");
    const typeRow = (aria, v) => ev(`const i = [...document.querySelectorAll('#palette .then-row input')].find((x) => x.getAttribute('aria-label') === ${JSON.stringify(aria)}); if (!i) return 'no row ' + ${JSON.stringify(aria)}; i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input')); return true;`);
    const nudge = async (kind, px) => { const hs = await handles(); const h = hs.find((x) => x.kind === kind && x.side === 1) || hs.find((x) => x.kind === kind); if (!h) { say('NO handle', kind, JSON.stringify(hs.map((x) => x.kind))); return false; }
      const n = Math.hypot(h.dx || 0, h.dy || 0) || 1, ux = kind.includes('turn') ? -1 : (h.dx || 0) / n, uy = kind.includes('turn') ? 0 : (h.dx || h.dy) ? (h.dy || 0) / n : -1;
      await mouse('mouseMoved', h.px, h.py); await mouse('mousePressed', h.px, h.py); for (let i = 1; i <= 10; i++) await mouse('mouseMoved', h.px + ux * px * i / 10, h.py + uy * px * i / 10); await mouse('mouseReleased', h.px + ux * px, h.py + uy * px); await sleep(1500); return true; };
    for (const tree of ['base', 'way1']) {
      await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/${tree}/app/index.html` });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      await ev("document.title = 'zz-headless-test'; return true;");
      for (let i = 0; i < 100; i++) { await sleep(200); if (await ev("return !!document.querySelector('#preview canvas') && !![...document.querySelectorAll('#palette button')].find((b) => b.textContent === 'Extend');")) break; }
      say(tree, 'guide', await ev("const b = [...document.querySelectorAll('button')].find((x) => ['✕', '×', 'Close'].includes(x.textContent.trim()) || x.getAttribute('aria-label') === 'close the guide'); if (b) b.click(); return b ? 'closed' : null;")); await sleep(500);
      // his p1: a 1,000 m straight, placed with Extend (his error save holds exactly that)
      say(tree, 'length', await setField('length m', 1000)); await sleep(800);
      say(tree, 'Extend p1', await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent === 'Extend'); if (b) b.click(); return !!b;")); await sleep(2500);
      // the ghost: his S
      say(tree, 'turn', await setField('turn °', -90)); say(tree, 'bank', await setField('bank °', 17.39)); await sleep(1500);
      say(tree, 'camera Free', await camera('Free')); await sleep(2500);
      say(tree, 'handles', JSON.stringify((await handles()).map((x) => [x.kind, x.side, Math.round(x.px), Math.round(x.py)])));
      say(tree, 'extra turn made', await nudge('extra:turnDeg:0', 40), 'typed', await typeRow('extra turn', 180)); await sleep(1800);
      say(tree, 'extra bank made', await nudge('extra:bank:0', -30), 'typed', await typeRow('extra bank', -34.78)); await sleep(2200);
      say(tree, 'state', JSON.stringify(await state()));
      await shot(`l152-S-${tree}-free`);
      // closer: the wheel toward the S itself (Free view zooms toward the pointer), at the extra bank's mark and the S's hand change; two frames
      const hs = await handles(), xb = hs.find((x) => x.kind === 'extra:bank:0' && x.side === 1), xt = hs.find((x) => x.kind === 'extra:turnDeg:0' && x.side === 1);
      const aim = xb && xt ? { x: (xb.px + xt.px) / 2, y: (xb.py + xt.py) / 2 } : { x: 850, y: 370 };
      say(tree, 'aim', JSON.stringify(aim));
      for (const [label, n] of [['near', +(process.env.NEAR || 8)], ['closer', +(process.env.CLOSER || 6)]]) {
        for (let i = 0; i < n; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: aim.x, y: aim.y, deltaX: 0, deltaY: -120 }); await sleep(150); }
        await sleep(1800); await shot(`l152-S-${tree}-${label}`);
      }
    }
    say('page errors', errors.length ? errors.join(' | ') : 'none');
  } finally {
    try { ws && ws.close(); } catch (e) { /* closing */ }
    if (ch) { ch.kill(); say('closed chrome', ch.pid); }
    srv.close(); await sleep(800);
    try { if (dir) fs.rmSync(dir, { recursive: true, force: true }); say('profile removed'); } catch (e) { say('profile not removed:', e.message); }
    fs.writeFileSync(path.join(OUT, 'render.log'), log.join('\n') + '\n');
  }
})().catch((e) => { console.error('render failed:', e.message); process.exit(1); });
