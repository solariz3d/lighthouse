// render154.js <root holding base/ and lab/ worktrees> <out folder>: pane E, L154. ONE headless Chrome (soundrender.js launchChrome: muted, no window), page titled
// zz-headless-test, closed after and its profile removed. NOT a timing run: nothing is timed.
// The camera is placed AT the tick, not the far default that failed in L152: a render-only, in-memory twin of preview.focus() is served (never written to the repo),
// lookAt(eyeStation, up, back, targetStation) on GHOST stations. Each patch anchor must occur exactly once or the run stops.
// Scenes per tree (base dabf7bf, lab 890c2a7):
//   good  his good piece: p1 a 1,000 m straight laid with Extend; turn -90, bank 50; the extra bank's handle nudged across, 0 typed (from 500). Frames: at the tick; hovering
//         the extra handle.
//   S     his S: turn -90, bank 17.39; extra turn +180, extra bank -34.78 (from 380 by way 1, 500 for the turn). Frames: wide over both ticks; at the 380 tick;
//         MID-DRAG of the 380 tick pressed on the tick itself (held, not released); after release. On lab only: MID-SLIDE of the extra bank's handle along the road (held).
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(process.argv[2]), OUT = path.resolve(process.argv[3]);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L154: renders at the tick, one headless Chrome, a few frames (BelowNormal; NOT a timing session)' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const { chromePath, launchChrome, connect } = require(path.join(ROOT, 'base/app/test/soundrender.js'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.glsl': 'text/plain' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const log = []; const say = (...a) => { const l = a.join(' '); log.push(l); console.log(l); };
const once = (s, a, b, what) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`patch ${what}: anchor found ${n} times`); return s.replace(a, b); };
const PATCH = {
  'app/preview/preview.js': (s) => once(s, '    focus(s) {', "    zzLookAt(m, t, up, back) { const eye = [0, 1, 2].map((k) => m.pos[k] + m.U[k] * up - m.T[k] * back); const c = ctx(canvas.clientWidth > 0 && canvas.clientHeight > 0 ? canvas.clientWidth / canvas.clientHeight : 1.6); if (rig.mode !== 'free' && c) rig.setMode('free', c); const ok = rig.free.lookFrom(eye, t.pos.slice()); said(); return ok; },\n    focus(s) {", 'preview zzLookAt'),
  'app/preview/index.js': (s) => once(s, "  doc.addEventListener('t180-camera-focus', focusNow);", "  doc.addEventListener('t180-camera-focus', focusNow); doc.addEventListener('zz-look', (e) => p.zzLookAt(e.detail.m, e.detail.t, e.detail.up, e.detail.back));", 'index zz-look'),
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const CHROME = chromePath(); if (!CHROME) throw new Error('no Chrome here');
  const srv = http.createServer((q, s) => {
    const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, ''), p = path.normalize(path.join(ROOT, rel)); if (!p.startsWith(ROOT)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; }
      const key = rel.replace(/\\/g, '/').replace(/^(base|lab)\//, ''); let body = b;
      if (PATCH[key]) { try { body = Buffer.from(PATCH[key](b.toString('utf8').replace(/\r\n/g, '\n'))); say('patched', rel); } catch (x) { say('PATCH FAILED', x.message); } }
      s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(body); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  let ch, dir, ws; const errors = [];
  try {
    let tgt; ({ ch, dir, tgt } = await launchChrome(CHROME, ['--window-size=1400,1000'], 't180l154e-')); say('chrome pid', ch.pid);
    let send; ({ ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 200)); }));
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 300)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1000, deviceScaleFactor: 1, mobile: false });
    const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, `${name}.png`); fs.writeFileSync(f, Buffer.from(r.result.data, 'base64')); say('wrote', f); return f; };
    const setField = (label, v) => ev(`const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === ${JSON.stringify(label)}); if (!l) return 'no ' + ${JSON.stringify(label)}; const i = l.querySelector('input'); i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input')); return true;`);
    const handles = () => ev("return new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: res } })); setTimeout(() => res(null), 500); }).then((l) => { const r = document.getElementById('preview').getBoundingClientRect(); return (l || []).map((h) => ({ ...h, px: h.x + r.left, py: h.y + r.top })); });");
    const camera = (name) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${JSON.stringify(name)}); if (b) b.click(); return !!b;`);
    // C's fixed helper shape: a move with no button held says button 'none'
    const mouse = (type, x, y, buttons) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' && !buttons ? 'none' : 'left', buttons: buttons || 0, clickCount: type === 'mouseMoved' ? 0 : 1 });
    const state = () => ev("const rows = [...document.querySelectorAll('#palette .then-row input')].map((i) => [i.getAttribute('aria-label'), i.value]); const f = (t) => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === t); return l ? l.querySelector('input').value : null; }; return { length: f('length m'), turn: f('turn °'), bank: f('bank °'), rows };");
    const typeRow = (aria, v) => ev(`const i = [...document.querySelectorAll('#palette .then-row input')].find((x) => x.getAttribute('aria-label') === ${JSON.stringify(aria)}); if (!i) return 'no row ' + ${JSON.stringify(aria)}; i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input')); return true;`);
    const nudge = async (kind, px) => { const hs = await handles(); const h = hs.find((x) => x.kind === kind && x.side === 1) || hs.find((x) => x.kind === kind); if (!h) { say('NO handle', kind, JSON.stringify(hs.map((x) => x.kind))); return false; }
      const n = Math.hypot(h.dx || 0, h.dy || 0) || 1, ux = kind.includes('turn') ? -1 : (h.dx || 0) / n, uy = kind.includes('turn') ? 0 : (h.dx || h.dy) ? (h.dy || 0) / n : -1;
      await mouse('mouseMoved', h.px, h.py); await mouse('mousePressed', h.px, h.py, 1); for (let i = 1; i <= 10; i++) await mouse('mouseMoved', h.px + ux * px * i / 10, h.py + uy * px * i / 10, 1); await mouse('mouseReleased', h.px + ux * px, h.py + uy * px); await sleep(1500); return true; };
    // the camera: eye `up` m above and `back` m behind the ghost station at piece metre `eyeAt`, looking at the station at `lookAt`
    const look = async (eyeAt, lookAt, up, back) => { const r = await ev(`const g = await new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:ghost-request', { detail: { reply: res } })); setTimeout(() => res(null), 500); }); if (!g || !g.samples) return { error: 'no ghost' }; const near = (x) => { let b = g.samples[0]; for (const m of g.samples) if (Math.abs(m.s - x) < Math.abs(b.s - x)) b = m; return b; }; const m = near(g.s0 + ${eyeAt}), t = near(g.s0 + ${lookAt}); document.dispatchEvent(new CustomEvent('zz-look', { detail: { m, t, up: ${up}, back: ${back} } })); return { s0: g.s0, eye: m.s, at: t.s };`); say('look', eyeAt, lookAt, up, back, JSON.stringify(r)); await sleep(2200); };
    const away = async () => { await mouse('mouseMoved', 1380, 980); await sleep(700); };
    const fresh = async (tree) => {
      await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/${tree}/app/index.html` });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      await ev("document.title = 'zz-headless-test'; return true;");
      for (let i = 0; i < 100; i++) { await sleep(200); if (await ev("return !!document.querySelector('#preview canvas') && !![...document.querySelectorAll('#palette button')].find((b) => b.textContent === 'Extend');")) break; }
      await ev("const b = [...document.querySelectorAll('button')].find((x) => ['✕', '×', 'Close'].includes(x.textContent.trim()) || x.getAttribute('aria-label') === 'close the guide'); if (b) b.click(); return !!b;"); await sleep(500);
      await setField('length m', 1000); await sleep(800);
      await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent === 'Extend'); if (b) b.click(); return !!b;"); await sleep(2500);
    };
    for (const tree of ['base', 'lab']) {
      // GOOD
      await fresh(tree);
      await setField('turn °', -90); await setField('bank °', 50); await sleep(1500); await camera('Free'); await sleep(2000);
      say(tree, 'good: extra bank made', await nudge('extra:bank:0', -30), 'typed', await typeRow('extra bank', 0)); await sleep(2000);
      say(tree, 'good state', JSON.stringify(await state()));
      await look(500, 500, 35, 45); await away(); await shot(`l154-good-${tree}-tick`);
      { const hs = await handles(), xh = hs.find((x) => x.kind === 'extra:bank:0' && x.side === 1) || hs.find((x) => x.kind === 'extra:bank:0');
        if (xh) { await mouse('mouseMoved', xh.px, xh.py); await sleep(1200); await shot(`l154-good-${tree}-hover`); } else say(tree, 'good: NO extra bank handle on screen at the tick'); }
      // S
      await fresh(tree);
      await setField('turn °', -90); await setField('bank °', 17.39); await sleep(1500); await camera('Free'); await sleep(2000);
      say(tree, 'S: extra turn made', await nudge('extra:turnDeg:0', 40), 'typed', await typeRow('extra turn', 180)); await sleep(1800);
      say(tree, 'S: extra bank made', await nudge('extra:bank:0', -30), 'typed', await typeRow('extra bank', -34.78)); await sleep(2200);
      say(tree, 'S state', JSON.stringify(await state()));
      await look(300, 470, 70, 120); await away(); await shot(`l154-S-${tree}-both`);
      await look(380, 380, 35, 45); await away(); await shot(`l154-S-${tree}-tick380`);
      // MID-DRAG on the tick itself: pressed at the road's centre on the 380 tick (between the extra bank handle's two sides, or 40 px in from its one side), dragged
      // toward the extra turn's handle, held for the frame
      { const hs = await handles(); say(tree, 'handles at 380', JSON.stringify(hs.map((x) => [x.kind, x.side, Math.round(x.px), Math.round(x.py)])));
        const sides = hs.filter((x) => x.kind === 'extra:bank:0'), xt = hs.find((x) => x.kind === 'extra:turnDeg:0');
        let c = null; if (sides.length >= 2) c = { x: (sides[0].px + sides[1].px) / 2, y: (sides[0].py + sides[1].py) / 2 }; else if (sides.length === 1) c = { x: sides[0].px, y: sides[0].py + 40 };
        if (!c) say(tree, 'NO tick to press'); else {
          const to = xt ? { x: c.x + (xt.px - c.x) * 0.4, y: c.y + (xt.py - c.y) * 0.4 } : { x: c.x, y: c.y - 80 };
          say(tree, 'tick press at', Math.round(c.x), Math.round(c.y), 'toward', Math.round(to.x), Math.round(to.y));
          await mouse('mouseMoved', c.x, c.y); await sleep(300); await mouse('mousePressed', c.x, c.y, 1);
          for (let i = 1; i <= 12; i++) { await mouse('mouseMoved', c.x + (to.x - c.x) * i / 12, c.y + (to.y - c.y) * i / 12, 1); await sleep(60); }
          await sleep(1200); say(tree, 'mid-drag state', JSON.stringify(await state())); await shot(`l154-S-${tree}-middrag`);
          await mouse('mouseReleased', to.x, to.y); await sleep(1800); say(tree, 'after-release state', JSON.stringify(await state())); await away(); await shot(`l154-S-${tree}-released`);
        } }
      // lab only: MID-SLIDE of the extra bank's handle along the road (his move), held
      if (tree === 'lab') {
        await look(380, 420, 45, 70);
        const hs = await handles(), xh = hs.find((x) => x.kind === 'extra:bank:0' && x.side === 1) || hs.find((x) => x.kind === 'extra:bank:0');
        if (!xh || !xh.slideAxis) say(tree, 'slide: no handle or no slideAxis', JSON.stringify(xh ? Object.keys(xh) : null));
        const ax = xh && xh.slideAxis ? xh.slideAxis : { dx: 0, dy: -1 }, n = Math.hypot(ax.dx, ax.dy) || 1, ux = ax.dx / n, uy = ax.dy / n;
        if (xh) { await mouse('mouseMoved', xh.px, xh.py); await sleep(500); await mouse('mousePressed', xh.px, xh.py, 1);
          for (let i = 1; i <= 14; i++) { await mouse('mouseMoved', xh.px + ux * 70 * i / 14, xh.py + uy * 70 * i / 14, 1); await sleep(60); }
          await sleep(1200); say(tree, 'mid-slide state', JSON.stringify(await state())); await shot(`l154-S-${tree}-midslide`);
          await mouse('mouseReleased', xh.px + ux * 70, xh.py + uy * 70); await sleep(1500); say(tree, 'after-slide state', JSON.stringify(await state())); }
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
