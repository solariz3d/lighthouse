// render595.js <tree> <out dir> [views]: D595, from O's D521 render.js. HIS piece (a 100 m straight, then 100 m turning +11.70° as a corner, bank −54.05°, width 31 m,
// nothing ticked) laid three ways by the tree's own core: BEFORE (the beginning: the quintic, no shape; the 10-28 "before"), TODAY (the rounded ramp, bankShape 'rounded',
// installed since 0.4.28) and NEW (the smooth S, the panel's thirds). Rendered on the real page, headless Chrome (app/test/soundrender.js launchChrome: no window), muted,
// titled zz-headless-test, BelowNormal. Views, the same camera for all three documents:
//   page   the D521 page's own: t180-camera-focus at s = 112
//   behind close up at the joint, from behind: focus at s = 92, then the free camera moved forward (wheel)
//   side   close up at the joint, from the side: as behind, then turned left by a mouse drag and moved
// Refuses to start while acs.exe runs. Writes <out>/d595-<doc>-<view>.png and prints one line each.
'use strict';
const os = require('os'), fs = require('fs'), path = require('path'), http = require('http'), { execFileSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [TREE, OUT, VIEWS = 'page,behind,side'] = process.argv.slice(2);
if (execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' }).toLowerCase().includes('"acs.exe"')) { console.log('STOP: acs.exe is running'); process.exit(3); }
const { chromePath, launchChrome, connect } = require(path.join(TREE, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEG = Math.PI / 180;
const D = require(path.join(TREE, 'src/core/document.js')), { extend } = require(path.join(TREE, 'src/core/extend.js')), { extendCorner } = require(path.join(TREE, 'src/core/turnby.js'));
const hisDoc = (shape) => D.serialize(extendCorner(extend(D.createDoc('his piece'), { length: 100 }), { length: 100, turnDeg: 11.70, targets: { phi: -54.05 * DEG, w: 31 }, ...(shape ? { bankShape: shape } : {}) }));
const ALL = { before: hisDoc(null), today: hisDoc('rounded'), new: hisDoc({ rise: 1 / 3, fall: 1 / 3 }) }, docs = process.env.DOCS ? Object.fromEntries(process.env.DOCS.split(',').map((k) => [k, ALL[k]])) : ALL;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };
const pre = (text) => `(() => {
  document.title = 'zz-headless-test';
  let left = ${JSON.stringify(JSON.stringify({ schema: 1, kind: 'core', name: null, doc: text }))};
  window.__TAURI__ = { core: { invoke: (cmd, args) => { if (cmd === 'open_autosave') { const t = left; left = null; return Promise.resolve(t); } if (/^list_/.test(cmd)) return Promise.resolve([]); return Promise.resolve(null); } } };
})();`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(TREE, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(TREE))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const exe = chromePath(); if (!exe) throw new Error('no Chrome found');
  const W = 1920, Hh = 1080;
  const { ch, dir, tgt } = await launchChrome(exe, ['--hide-scrollbars', `--window-size=${W},${Hh}`], 't180d595-');
  let ws; const log = [];
  try {
    let send; ({ ws, send } = await connect(tgt.webSocketDebuggerUrl));
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 300)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: Hh, deviceScaleFactor: 1, mobile: false });
    const canvasCentre = async () => ev("const c = [...document.querySelectorAll('#stage canvas')].sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0]; const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];");
    const wheel = async (n, at) => { for (let i = 0; i < n; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: at[0], y: at[1], deltaX: 0, deltaY: +(process.env.WHEEL || 100) }); await sleep(60); } };
    const drag = async (dx, at) => { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: at[0], y: at[1], button: 'right', buttons: 2, clickCount: 1 }); for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: at[0] + (dx * i) / 10, y: at[1], button: 'right', buttons: 2 }); await sleep(30); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: at[0] + dx, y: at[1], button: 'right', buttons: 0, clickCount: 1 }); };
    for (const [name, text] of Object.entries(docs)) {
      await send('Page.navigate', { url: `${base}/app/lib/cjs.js` }); await sleep(500);
      await ev(`document.title = 'zz-headless-test'; localStorage.clear(); localStorage.setItem('t180.settings.theme', JSON.stringify('sigil')); localStorage.setItem('t180.guide.done', '1'); return true;`);
      const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: pre(text) })).result.identifier;
      await send('Page.navigate', { url: `${base}/app/index.html` });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;")) break; } catch (e) { /* loading */ } }
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
      await ev("document.title = 'zz-headless-test'; return true;");
      await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
      const restored = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (!b) return false; b.click(); return true;");
      let pieces = 0; for (let i = 0; i < 60; i++) { await sleep(250); pieces = await ev("let t = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => { t = x; } } })); return t && t.segments ? new Set(t.segments.map((g) => g.id)).size : 0;"); if (pieces >= 2) break; }
      const checker = await ev("const e = document.getElementById('reds') || document.querySelector('.validate'); return e ? e.textContent.replace(/\\s+/g, ' ').slice(0, 120) : '';").catch(() => '');
      for (const view of VIEWS.split(',')) {
        // page: the D521 page's camera (focus s = 112); behind: the same kind of camera at the joint (focus s = 100) with the joint's region clipped at 2x;
        // side: the app's own Side camera (the head's piece, the bank ramp, from the side)
        if (view === 'side') { await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Side'); if (!b) throw new Error('no Side button'); b.click(); return true;"); await sleep(2500); }
        else { await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${view === 'page' ? 112 : 100} } })); return true;`); await sleep(2500); }
        await ev("document.title = 'zz-headless-test'; return true;");
        const clip = view === 'behind' ? { x: 480, y: 120, width: 960, height: 540, scale: 2 } : undefined;
        const png = Buffer.from((await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) })).result.data, 'base64');
        const file = path.join(OUT, `d595-${name}-${view}.png`); fs.writeFileSync(file, png);
        log.push(`${name} ${view}: restored ${restored}, pieces ${pieces}, ${png.length} B -> ${file}${view === 'page' ? ` | checker: ${checker}` : ''}`);
      }
    }
  } finally {
    try { ws && ws.close(); } catch (e) { /* closing */ }
    ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold it */ }
  }
  console.log(log.join('\n'));
})().catch((e) => { console.error('render failed:', e.message); process.exit(1); });
