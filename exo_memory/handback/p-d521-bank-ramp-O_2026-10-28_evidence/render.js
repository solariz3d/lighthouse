// render.js (D521, O): HIS piece (a 100 m straight, then 100 m turning +11.70° as a corner, bank −54.05°, width 31 m) rendered on the real page, headless, muted,
// titled zz-headless-test, at 2560 x 1440, BEFORE (laid by the base tree's extend: today's quintic) and AFTER (the new tree's, bankShape 'rounded'), from the same
// camera. The page is served from the NEW tree (the renderer is the same in both; only the document differs); each document comes in as the autosave to restore,
// as app/test/sculpt-frame.test.js loads its tracks. BelowNormal; Chrome through the shared launcher (its browser slot); every process ended.
//   node render.js <base tree> <new tree> <out dir>
'use strict';
const os = require('os'), fs = require('fs'), path = require('path'), http = require('http');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [BASE, NEW, OUT] = process.argv.slice(2);
const { chromePath, launchChrome, connect } = require(path.join(NEW, 'app/test/soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEG = Math.PI / 180;
function hisDoc(tree, shape) {
  const D = require(path.join(tree, 'src/core/document.js')), { extend } = require(path.join(tree, 'src/core/extend.js')), { extendCorner } = require(path.join(tree, 'src/core/turnby.js'));
  return D.serialize(extendCorner(extend(D.createDoc('his piece'), { length: 100 }), { length: 100, turnDeg: 11.70, targets: { phi: -54.05 * DEG, w: 31 }, ...(shape ? { bankShape: shape } : {}) }));
}
const docs = { before: hisDoc(BASE, null), after: hisDoc(NEW, 'rounded') };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };
const pre = (text) => `(() => {
  document.title = 'zz-headless-test';
  let left = ${JSON.stringify(JSON.stringify({ schema: 1, kind: 'core', name: null, doc: text }))};
  window.__TAURI__ = { core: { invoke: (cmd, args) => { if (cmd === 'open_autosave') { const t = left; left = null; return Promise.resolve(t); } if (/^list_/.test(cmd)) return Promise.resolve([]); return Promise.resolve(null); } } };
})();`;
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(NEW, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(NEW))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const exe = chromePath(); if (!exe) throw new Error('no Chrome found');
  const { ch, dir, tgt } = await launchChrome(exe, ['--hide-scrollbars', '--window-size=2560,1440'], 't180d521-');
  let ws; const log = [];
  try {
    let send; ({ ws, send } = await connect(tgt.webSocketDebuggerUrl));
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 300)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 2560, height: 1440, deviceScaleFactor: 1, mobile: false });
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
      // the same camera for both: the free view, focused on the joint's station (the straight's end, s = 100 m)
      await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 112 } })); return true;"); await sleep(3000);
      await ev("document.title = 'zz-headless-test'; return true;");
      const png = Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64');
      const file = path.join(OUT, `d521-his-piece-${name}.png`); fs.writeFileSync(file, png);
      log.push(`${name}: restored ${restored}, pieces on show ${pieces}, ${png.length} B -> ${file}`);
    }
  } finally {
    try { ws && ws.close(); } catch (e) { /* closing */ }
    ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may still hold it */ }
  }
  console.log(log.join('\n'));
})().catch((e) => { console.error('render failed:', e.message); process.exit(1); });
