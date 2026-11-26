// look250r.js (pane B, L250 repair): the reference panel's look in the real page, in each of the six looks. The branch's app/index.html in headless
// Chrome; the native side is a stand-in whose one reference is a circle built here with the builder's own encodeAiLine (no AC file is read, no other
// author's track is in the page). For each look: the panel's computed ground, words, edge and corner, the contrast of its words and its dim words on
// its ground (WCAG), and a picture of the window. Prints JSON.
// usage: TREE=<builder tree> node look250r.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-l243';
const LOOKS = (process.env.LOOKS || 'sigil,aqua,aurora,glass,skyline,skyline-night').split(',');
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const { encodeAiLine, EXTRA } = require(T + '/src/export/ailine.js');
const outRoot = process.argv[2]; fs.mkdirSync(outRoot, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
/** a circle of radius r, n points, as an installed line with a grid after it (as app/test/reference-panel.test.js's aiLine) */
function aiLine(r, n) {
  const points = [], extra = [];
  for (let k = 0; k < n; k++) { const ph = (2 * Math.PI * k) / n; points.push({ pos: [r * Math.cos(ph), 0, r * Math.sin(ph)], length: 0, id: k }); const e = {}; for (const f of EXTRA) e[f] = 0; Object.assign(e, { sideLeft: 5, sideRight: 5, ny: 1 }); extra.push(e); }
  const b = encodeAiLine({ version: 7, points, extra, open: false });
  const g = Buffer.concat([b.subarray(0, b.length - 4), Buffer.alloc(4), Buffer.alloc(512, 7)]); g.writeInt32LE(1, b.length - 4);
  return g;
}
const LINE = aiLine(150, 300);

(async () => {
  const srv = http.createServer((q, s) => {
    if (q.url === '/__bytes/line') { s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(LINE); return; }
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250r-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name, clip) => fs.writeFileSync(path.join(outRoot, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const stand = `
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces' || cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve([{ track: 'reference track 1', layout: '', hasAi: true, uiLength: '950' }, { track: 'reference track 2', layout: '', hasAi: false, uiLength: null }]);
      if (cmd === 'read_reference_line') return a.track === 'reference track 1' ? fetch('/__bytes/line').then((r) => r.arrayBuffer()) : Promise.reject('no AI line there');
      if (cmd === 'read_reference_road') return Promise.reject('no road in the stand-in');
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  for (let i = 0; i < 3; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
  await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
  await ev("await window.__t180Reference().pick('reference track 1', ''); return true;");
  const results = [];
  for (const look of LOOKS) {
    await ev(`const r = document.documentElement; if (${JSON.stringify(look)} === 'sigil') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', ${JSON.stringify(look)}); await new Promise((q) => setTimeout(q, 900)); return true;`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(600);
    const r = await ev(`
      const rgb = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const v = m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number); return { c: v.slice(0, 3), a: v.length > 3 ? v[3] : 1 }; };
      const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
      const box = document.querySelector('.reference-panel'), cs = getComputedStyle(box), ro = getComputedStyle(box.querySelector('.rp-readout')), clr = getComputedStyle([...box.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Clear'));
      const ground = rgb(cs.backgroundColor), text = rgb(cs.color), dim = rgb(ro.color), btn = rgb(clr.color);
      const rect = box.getBoundingClientRect();
      const inline = [box, ...box.querySelectorAll('*')].filter((e) => e.getAttribute('style') && e !== box).length;
      return { ground: cs.backgroundColor, text: cs.color, dim: ro.color, edge: cs.borderTopColor, corner: cs.borderTopLeftRadius, groundAlpha: ground && ground.a,
        textOnGround: ground && text ? ratio(text.c, ground.c) : null, dimOnGround: ground && dim ? ratio(dim.c, ground.c) : null, clearOnGround: ground && btn ? ratio(btn.c, ground.c) : null,
        boxStyle: box.getAttribute('style'), inlineInside: inline, rect: { x: Math.floor(rect.x) - 4, y: Math.floor(rect.y) - 4, width: Math.ceil(rect.width) + 8, height: Math.ceil(rect.height) + 8 },
        readout: box.querySelector('.rp-readout').textContent };`);
    await shot(`look_${look}.png`); await shot(`look_${look}_panel.png`, r.rect);
    results.push({ look, ...r });
  }
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ results, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
