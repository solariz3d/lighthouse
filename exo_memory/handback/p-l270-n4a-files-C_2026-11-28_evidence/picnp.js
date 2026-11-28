// picnp.js <tree> <label> <out dir>: pane C, L270 role 2, the no-preview case on the page. Built from B's washpage678.js (in git,
// handback/p-d678-even-read-B_2026-11-27_evidence/), which P's pic678.js was copied from: its page stand-in, restore, READ, decodePng and lavender count
// (verbatim), cut to this case. The document: noprev.js's (A's flat turn, one width grab with one rim held at s 575 over r 30 to 16 m), made with the tree's
// own core and restored on the tree's own page (drag handles on, his default). Then: the panel's "no preview" note and cup lines read from the page text; the
// preview's ghost read back against the placed track ('t180:ghost-request', 't180:track-request'), its head (the shared station with the largest s) in 3D;
// pictures at the focus s 600 (looking down the head's straight onto the next piece) and from higher (B's right-drag). Headless Chrome through the builder's
// launcher (--headless=new, --mute-audio, no window to focus), the title zz-headless-test set before the page's own script. Pictures stay local. Nothing is saved.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), zlib = require('zlib');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, LABEL, OUT] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const D = require(path.join(T, 'src/core/document.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);
const out = { started: new Date().toISOString(), tree: LABEL, rows: [], errors: [], titles: [], state: [] };
// a PNG (8-bit RGB or RGBA, no interlace: what Page.captureScreenshot writes) to { w, h, ch, px }
function decodePng(buf) {
  let p = 8, w = 0, h = 0, ct = 0, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); if (data[8] !== 8 || data[12] !== 0) throw new Error('png: not 8-bit non-interlaced'); ct = data[9]; }
    else if (type === 'IDAT') idat.push(data); else if (type === 'IEND') break;
    p += 12 + len;
  }
  const ch = ct === 6 ? 4 : ct === 2 ? 3 : 0; if (!ch) throw new Error(`png: colour type ${ct}`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * ch, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[dst + x - ch] : 0, b = y > 0 ? px[dst - stride + x] : 0, c = x >= ch && y > 0 ? px[dst - stride + x - ch] : 0, v = raw[src + x];
      let o;
      if (f === 0) o = v; else if (f === 1) o = v + a; else if (f === 2) o = v + b; else if (f === 3) o = v + ((a + b) >> 1);
      else if (f === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); o = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      else throw new Error(`png: filter ${f}`);
      px[dst + x] = o & 255;
    }
  }
  return { w, h, ch, px };
}
// lavender: blue well over red, red over green, and not dark (the ghost violet #b9a8ff at 0.42 over the dark road is about (84, 77, 115)). Counted in the view
// only: x from 270 (right of the panel) to 890, y from 200 (below the HUD) to 860 (above the camera bar); the annotation box A drew is not drawn here.
function lavender(img) {
  let n = 0; const { w, ch, px } = img;
  for (let y = 200; y < 860; y++) for (let x = 270; x < 890; x++) { const i = (y * w + x) * ch, r = px[i], g = px[i + 1], b = px[i + 2]; if (b >= 70 && b - r >= 15 && r - g >= 3 && b - g >= 25) n++; }
  return n;
}


async function makeDoc() {   // noprev.js's construction
  const SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js')), G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
  const FLAT = [{ length: 200, turn: 0, bank: 0 }, ...[1, 2, 3, 4].map(() => ({ length: 60, turn: 30, bank: 0 })), { length: 150, turn: 0, bank: 0 }];
  const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
  let d = D.createDoc('even'); for (const p of FLAT) d = TB.extendCorner(d, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: p.bank, width: 12, turnAs: 'corner' }));
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  const pr = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, 575, -1), e = 16 - at(pr, 'w', 575), delta = ZG.follow(fr.R.map((k) => -k * e), fr, {});
  sh.beginFollow({ s0: fr.s, r: 30 }); sh.brushTo(delta); sh.endBrush();
  return sh.getState().history.present;
}
(async () => {
  const doc = await makeDoc(), last = doc.pieces[doc.pieces.length - 1];
  out.docHead = { w: R(D.channelAt(last, 'w', last.length).v), l: R(D.channelAt(last, 'l', last.length).v) };
  const PAY = JSON.stringify({ schema: 1, kind: 'core', name: 'no preview', doc: D.serialize(doc) });
  const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const srv = http.createServer((qq, s) => {
    const u = decodeURIComponent(qq.url.split('?')[0]);
    if (u === '/__a/doc') { s.writeHead(200, { 'content-type': 'text/plain' }); s.end(PAY); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const baseUrl = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const VW = 900, VH = 1000;
  let ch = null, ws = null, dir = null;
  try {
    const L = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${VW},${VH}`], 't180l270c-'); ch = L.ch; dir = L.dir;
    out.browserPid = ch && ch.pid;
    ws = new WebSocket(L.tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') out.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
    const shotPng = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); const b = Buffer.from(r.result.data, 'base64'); fs.writeFileSync(file, b); return decodePng(b); };
    const mouse = (p) => send('Input.dispatchMouseEvent', p);
    await send('Runtime.enable'); await send('Page.enable');
    const stand = `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        if (cmd === 'open_autosave') return fetch('/__a/doc').then((r) => r.text());
        if (cmd === 'list_tracks' || cmd === 'list_pieces' || cmd === 'list_track_backups') return Promise.resolve([]);
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    const READ = `const ask = (name) => new Promise((res) => { document.dispatchEvent(new CustomEvent(name, { detail: { reply: (x) => res(x) } })); setTimeout(() => res(undefined), 1000); });
      const g = await ask('t180:ghost-request'), t = await ask('t180:track-request');
      const hb = document.querySelector('input[aria-label="drag handles"]');
      if (!g) return { ghost: g === null ? 'none' : 'no answer', handles: hb ? hb.checked : 'no box' };
      const P = t && t.path && t.path.samples, byS = new Map(); if (P) for (const x of P) byS.set(Math.round(x.s * 1000), x);
      let n = 0, h = 0, hAt = null, v = 0, head = null;
      for (const x of g.samples) { const y = byS.get(Math.round(x.s * 1000)); if (!y) continue; n++;
        const dh = Math.hypot(x.pos[0] - y.pos[0], x.pos[2] - y.pos[2]), dv = Math.abs(x.pos[1] - y.pos[1]); if (dh > h) { h = dh; hAt = x.s; } if (dv > v) v = dv;
        if (!head || x.s > head.s) head = { s: x.s, d3: Math.hypot(x.pos[0] - y.pos[0], x.pos[1] - y.pos[1], x.pos[2] - y.pos[2]), dh, dv }; }
      return { ghost: 'shown', handles: hb ? hb.checked : 'no box', samples: g.samples.length, s0: g.s0, shared: n, offPlacedHorizM: h, at: hAt, offPlacedVertM: v, head };`;
    const TEXT = `const lines = document.body.innerText.split(String.fromCharCode(10)).map((x) => x.trim()).filter(Boolean);
      return { noPreview: lines.filter((x) => /no preview/i.test(x)).slice(0, 3), cupLines: lines.filter((x) => /cup/i.test(x)).slice(0, 6),
        widthInputs: [...document.querySelectorAll('input')].filter((x) => /width/i.test((x.getAttribute('aria-label') || '') + (x.id || '') + (x.name || ''))).map((x) => ((x.getAttribute('aria-label') || x.id || x.name) + '=' + x.value)).slice(0, 4) };`;
    const added = await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: baseUrl.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev('localStorage.clear(); return true;');
    await send('Page.navigate', { url: baseUrl });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    out.titles.push(await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title;"));
    out.state.push({ restore: await ev("for (let i = 0; i < 25; i++) { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (b) { b.click(); return 'restored'; } await new Promise((r) => setTimeout(r, 200)); } return 'no restore button';") });
    await sleep(1500);
    out.state.push({ hud: await ev("for (let i = 0; i < 50; i++) { const h = document.querySelector('.preview-hud'); if (h && !/building the road/.test(h.textContent)) return h.textContent.slice(0, 80); await new Promise((r) => setTimeout(r, 200)); } const h = document.querySelector('.preview-hud'); return 'still: ' + (h && h.textContent.slice(0, 80));") });
    await ev("Object.defineProperty(HTMLCanvasElement.prototype, 'requestPointerLock', { value: undefined, configurable: true }); return true;");
    out.state.push({ grid: await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Ground'); if (!b) return 'no Ground button'; b.click(); await new Promise((r) => setTimeout(r, 300)); return 'ground';") });
    await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 600 } })); return true;");
    await mouse({ type: 'mouseMoved', x: 600, y: 500 });
    await sleep(2500);
    const text = await ev(TEXT), read1 = await ev(READ), img1 = await shotPng(path.join(OUT, `noprev_${LABEL}_focus600_handles-on.png`));
    // higher: B's right-drag down
    await mouse({ type: 'mouseMoved', x: 450, y: 400 });
    await mouse({ type: 'mousePressed', x: 450, y: 400, button: 'right', buttons: 2, clickCount: 1 });
    for (let k = 1; k <= 10; k++) { await mouse({ type: 'mouseMoved', x: 450, y: 400 + k * 40, button: 'right', buttons: 2 }); await sleep(20); }
    await mouse({ type: 'mouseReleased', x: 450, y: 800, button: 'right', buttons: 0, clickCount: 1 });
    await mouse({ type: 'mouseMoved', x: 600, y: 500 });
    await sleep(2500);
    const read2 = await ev(READ), img2 = await shotPng(path.join(OUT, `noprev_${LABEL}_higher_handles-on.png`));
    out.rows.push({ text, focus600: { ...read1, lavenderPx: lavender(img1) }, higher: { ...read2, lavenderPx: lavender(img2) } });
    if (added.result && added.result.identifier) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: added.result.identifier });
  } catch (e) { out.fatal = String(e && e.stack || e).slice(0, 600); }
  finally {
    try { if (ws) ws.close(); } catch (e) { /* */ }
    try { if (ch) ch.kill(); } catch (e) { /* */ }
    await sleep(800); try { if (dir) fs.rmSync(dir, { recursive: true, force: true }); out.profileRemoved = true; } catch (e) { out.profileLeft = dir; }
    srv.close();
  }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, `picnp_${LABEL}.json`), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, (k, v) => (typeof v === 'number' ? R(v) : v)));
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
