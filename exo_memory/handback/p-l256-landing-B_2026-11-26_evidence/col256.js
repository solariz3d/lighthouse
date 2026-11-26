// col256.js (pane B, L256 step 2, from look256.js): the reference panel beside the docked, clearing left column (L254), in the merged page, in each look, at
// 1400 x 860 and 900 x 600. The tree's app/index.html in headless Chrome; the native side is a stand-in whose one reference is a circle built here with the
// builder's own encodeAiLine (no AC file is read, no other author's track is in the page). For each look and size:
//   SHOWN (the pointer on the column) and CLEARED (the pointer left on the preview, past the delay and the fade): #left's box, class and opacity; the panel's box
//   and opacity; whether the panel overlaps the column, the view tag or the values band; what is under the panel's centre, its pick select's centre and its
//   Clear button's centre (elementFromPoint: inside the panel or not); a picture of the window.
//   Then the pointer moved onto the panel's centre (the column must stay cleared: the panel is not the strip), and keyboard focus put in the panel's pick
//   select (it must stay cleared: the panel is not in the column). Then the pointer on the strip (x 10): the column comes back.
// Prints JSON. usage: TREE=<builder tree> node col256.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-landing-1126';
const LOOKS = (process.env.LOOKS || 'sigil,aqua,aurora,glass,skyline,skyline-night').split(',');
const SIZES = [[1400, 860], [900, 600]];
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const { encodeAiLine, EXTRA } = require(T + '/src/export/ailine.js');
const outRoot = process.argv[2]; fs.mkdirSync(outRoot, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
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
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180l256b2-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(outRoot, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  const move = async (x, y) => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
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
  // the page's focus leaves the clicked Extend button (a mouse click does not hold the column, but blur it so nothing in the column has focus)
  await ev("if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); return true;");
  const read = `
    const r4 = (b) => ({ x: Math.round(b.x), y: Math.round(b.y), right: Math.round(b.right), bottom: Math.round(b.bottom) });
    const over = (a, b) => !!a && !!b && a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom;
    const left = document.getElementById('left'), box = document.querySelector('.reference-panel'), hud = document.querySelector('.preview-hud'), band = document.querySelector('[aria-label="piece values"]');
    const L = left.getBoundingClientRect(), P = box.getBoundingClientRect(), H = hud ? hud.getBoundingClientRect() : null, B = band && getComputedStyle(band).display !== 'none' ? band.getBoundingClientRect() : null;
    const at = (el) => { const b = el.getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2, hit = document.elementFromPoint(x, y); return { x: Math.round(x), y: Math.round(y), inPanel: !!hit && box.contains(hit), inLeft: !!hit && left.contains(hit), hit: hit ? hit.tagName + (hit.id ? '#' + hit.id : '') + (hit.className && typeof hit.className === 'string' ? '.' + hit.className.split(' ')[0] : '') : null }; };
    const clr = [...box.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Clear');
    return { cleared: left.classList.contains('cleared'), leftOpacity: getComputedStyle(left).opacity, leftPE: getComputedStyle(left).pointerEvents,
      left: r4(L), panel: r4(P), panelShown: getComputedStyle(box).display !== 'none', panelOpacity: getComputedStyle(box).opacity,
      gapPanelToColumn: Math.round(P.x - L.right), overlapColumn: over(L, P), overlapHud: over(H, P), overlapBand: over(B, P), hud: H ? r4(H) : null, band: B ? r4(B) : null,
      centre: at(box), pick: at(box.querySelector('.rp-pick')), clear: at(clr), active: document.activeElement ? document.activeElement.tagName + '.' + (document.activeElement.className || '') : null };`;
  const results = [];
  for (const [w, h] of SIZES) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(800);
    for (const look of LOOKS) {
      await ev(`const r = document.documentElement; if (${JSON.stringify(look)} === 'sigil') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', ${JSON.stringify(look)}); await new Promise((q) => setTimeout(q, 900)); return true;`);
      const row = { look, size: `${w}x${h}` };
      await move(120, Math.round(h / 2)); await sleep(500);
      row.shown = await ev(read); await shot(`col_${look}_${w}_shown.png`);
      // off the column onto open preview, below the panel and left of it: past the 400 ms delay and the .2 s fade
      await move(Math.round(w * 0.45), h - 40); await sleep(1000);
      row.clearedState = await ev(read); await shot(`col_${look}_${w}_cleared.png`);
      const c = row.clearedState.centre; await move(c.x, c.y); await sleep(700);
      row.pointerOnPanel = await ev(read);
      await ev("const s = document.querySelector('.reference-panel .rp-pick'); s.focus({ focusVisible: true }); await new Promise((q) => setTimeout(q, 700)); return true;");
      row.focusInPanel = await ev(read);
      await ev("if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); return true;");
      await move(10, Math.round(h / 2)); await sleep(500);
      row.onStrip = await ev(read);
      await move(120, Math.round(h / 2)); await sleep(300);
      results.push(row);
    }
  }
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ results, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
