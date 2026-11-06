// render.js (pane C, L140): the builder's real page in headless Chrome (muted, no window, titled zz-headless-test), three states of the "extra" handles, as PNGs.
//   node render.js <worktree> <out folder>
// The page is the worktree's app/index.html served over http, as app/test/blenderexport-page.test.js serves it (outside the app: no native side). Mouse events are real
// (Input.dispatchMouseEvent), so the handles' own press, drag and release run. The browser and the server are closed at the end, and its temp profile removed.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const WT = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
const { chromePath, launchChrome, connect } = require(process.env.SR || path.join(WT, 'app/test/soundrender.js'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.dds': 'application/octet-stream' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];
const say = (...a) => { const l = a.join(' '); log.push(l); console.log(l); };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const CHROME = chromePath(); if (!CHROME) throw new Error('no Chrome here');
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(WT, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(WT)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  let ch, dir, ws;
  const errors = [];
  try {
    let tgt; ({ ch, dir, tgt } = await launchChrome(CHROME, ['--window-size=1400,' + (process.env.H || 860)], 't180l140-'));
    say('chrome pid', ch.pid);
    let send; ({ ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text)); }));
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: +(process.env.H || 860), deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; return true;");
    for (let i = 0; i < 100; i++) { await sleep(200); if (await ev("return !!document.querySelector('#preview canvas') && !![...document.querySelectorAll('#palette button')].find((b) => b.textContent === 'Extend');")) break; }
    const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, Buffer.from(r.result.data, 'base64')); say('wrote', f); return f; };
    const setField = (label, v) => ev(`const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === ${JSON.stringify(label)}); if (!l) return 'no ' + ${JSON.stringify(label)}; const i = l.querySelector('input'); i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input')); return true;`);
    const handles = () => ev("return new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: res } })); setTimeout(() => res(null), 500); }).then((l) => { const r = document.getElementById('preview').getBoundingClientRect(); return (l || []).map((h) => ({ ...h, px: h.x + r.left, py: h.y + r.top })); });");
    const camera = (name) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${JSON.stringify(name)}); if (b) b.click(); return !!b;`);
    const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
    // the piece: a 1,000 m corner of +90° on an empty track; then hover Extend so the ghost and its handles show
    say('guide closed', await ev("const b = [...document.querySelectorAll('button')].find((x) => ['✕', '×', 'Close'].includes(x.textContent.trim()) || x.getAttribute('aria-label') === 'close the guide'); if (b) b.click(); return b ? b.textContent || b.getAttribute('aria-label') : null;")); await sleep(500);
    say('length', await setField('length m', process.env.LEN || 60));   // 60 m: the overhead frames the piece's far end at ~8.8 px a metre, so a longer ghost runs off the preview
    say('turn', await setField('turn °', -90));
    say('camera Overhead', await camera('Overhead')); await sleep(2000);
    const pv = await ev("const r = document.getElementById('preview').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height };");
    for (let n = 0; n < +(process.env.NOTCHES || 0); n++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: pv.x + 320, y: pv.y + 200, deltaX: 0, deltaY: 120 }); await sleep(200); }
    say('camera Free', await camera('Free')); await sleep(2000);
    const state = () => ev("const rows = [...document.querySelectorAll('#palette .then-row input')].map((i) => [i.getAttribute('aria-label'), i.value]); const f = (t) => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === t); return l ? l.querySelector('input').value : null; }; const msg = [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | '); return { bank: f('bank °'), turn: f('turn °'), rows, msg };");
    const dragH = async (kind, px) => {
      const hs = await handles(); const h = hs.find((x) => x.kind === kind && x.side === 1) || hs.find((x) => x.kind === kind);
      say('handles', JSON.stringify(hs.map((x) => [x.kind, x.side, Math.round(x.px), Math.round(x.py)])));
      if (!h) { say('NO handle', kind); return; }
      const n = Math.hypot(h.dx || 0, h.dy || 0) || 1, ux = kind.includes('turn') ? -1 : (h.dx || 0) / n, uy = kind.includes('turn') ? 0 : (h.dx || h.dy) ? (h.dy || 0) / n : -1;
      await mouse('mouseMoved', h.px, h.py); await mouse('mousePressed', h.px, h.py);
      for (let i = 1; i <= 10; i++) await mouse('mouseMoved', h.px + ux * px * i / 10, h.py + uy * px * i / 10);
      await mouse('mouseReleased', h.px + ux * px, h.py + uy * px); await sleep(1800);
      say('after drag', kind, 'at', Math.round(h.px), Math.round(h.py), JSON.stringify(await state()));
      // then the exact value typed, so both orders end on equal numbers: the bank field, or the extra's row
      const put = kind === 'bank' ? "const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === 'bank °'); const i = l && l.querySelector('input'); if (!i) return 'no bank field'; i.value = '40'; i.dispatchEvent(new Event('input')); return true;" : "const i = [...document.querySelectorAll('#palette .then-row input')].find((x) => x.getAttribute('aria-label') === '" + (kind.includes('turn') ? 'extra turn' : 'extra bank') + "'); if (!i) return 'no row'; i.value = '" + (kind.includes('turn') ? '90' : '-40') + "'; i.dispatchEvent(new Event('input')); return true;";
      say('typed', kind, await ev(put)); await sleep(1800); say('after', kind, JSON.stringify(await state()));
    };
    const ORDER = (process.env.ORDER || 'bank,xturn,xbank').split(',');
    for (const st of ORDER) await dragH(st === 'bank' ? 'bank' : st === 'xturn' ? 'extra:turnDeg:0' : 'extra:bank:0', st === 'xturn' ? 120 : st === 'bank' ? 120 : -160);
    say('final', JSON.stringify(await state()));
    await shot('l142-order-' + ORDER.join('-'));
    say('page errors', errors.length ? errors.join(' | ') : 'none');
  } finally {
    try { ws && ws.close(); } catch (e) { /* closing */ }
    if (ch) { ch.kill(); say('closed chrome', ch.pid); }
    srv.close(); await sleep(500);
    try { if (dir) fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { say('profile not removed (Chrome may hold it):', e.message); }
    fs.writeFileSync(path.join(OUT, 'render.log'), log.join('\n') + '\n');
  }
})().catch((e) => { console.error('render failed:', e.message); process.exit(1); });
