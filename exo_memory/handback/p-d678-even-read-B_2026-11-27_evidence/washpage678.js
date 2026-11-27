// washpage678.js (pane B, D678 Track 2, the Even read, registration section 1.4, the page half): is the lavender wash the next piece's ghost, on the real page?
//   node washpage678.js <builder tree, 437590e> <out dir>
// A's render678.js PART 1 and PART 2, cut to what the question needs: four documents made as A made them (bankW1 before and after Even, bankT2b before, flatT2b
// after), each restored on the real page (app/index.html with A's __TAURI__ stand-in), the Ground grid, the camera on the turn's middle as A's 'middle' frame.
// Then, for each: (1) the page as it opens (the drag handles on, his default) — a PNG, the lavender pixels in the view counted, and the preview's own ghost read
// back ('t180:ghost-request': its samples) against the placed track ('t180:track-request'); (2) his own control, "drag handles" unticked (panel.js:1112 clears
// the ghost; with it off the ghost shows only while the pointer is on Extend) — the same three reads. Refuted if the wash stays with the ghost gone.
// Headless Chrome through the builder's shared launcher (--headless=new, --mute-audio), the title zz-headless-test. Pictures stay local. Nothing is saved.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), zlib = require('zlib');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true });
const D = require(path.join(T, 'src/core/document.js'));
const F = require(path.join(T, 'test/even_fixtures.js'));
const R = (x) => (Number.isFinite(x) ? Math.round(x * 1e4) / 1e4 : x);
const out = { started: new Date().toISOString(), tree: T, rows: [], errors: [], titles: [], state: [] };

function evenDrag(sh, { from, to }, hold, value) {   // A's render678.js evenDrag
  sh.selectPiece(from); if (to !== from) sh.selectPiece(to, { extend: true });
  sh.beginSculpt({ tool: 'even', hold });
  const b = sh.getState().brush; if (!(b && b.mode === 'even')) throw new Error(`the drag did not open: ${sh.getState().message}`);
  sh.sculptTo(value - b.value0); sh.endSculpt();
  return sh.getState().message;
}

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

(async () => {
  // PART 1: the documents, as A made them
  const DOCS = {};
  for (const [key, fx, start, even] of [['bankW1', 'B-', 'W1', true], ['bankT2b', 'B-', 'T2b', false], ['flatT2b', 'flat', 'T2b', true]]) {
    const base = F.fixture(fx), sh = await F.startOf(base, start);
    DOCS[`${key}_before`] = F.present(sh);
    if (even) { evenDrag(sh, F.runPieces(F.present(sh)), 'left', 16); DOCS[`${key}_after`] = F.present(sh); }
  }
  delete DOCS.flatT2b_before;   // the four: bankW1_before (no wash predicted), bankW1_after (wash), bankT2b_before (wash, no Even), flatT2b_after (none)
  // PART 2: the page
  const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const PAY = Object.fromEntries(Object.entries(DOCS).map(([k, d]) => [k, JSON.stringify({ schema: 1, kind: 'core', name: 'even turn', doc: D.serialize(d) })]));
  const srv = http.createServer((qq, s) => {
    const u = decodeURIComponent(qq.url.split('?')[0]);
    if (u.startsWith('/__a/')) { const b = PAY[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'text/plain' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const baseUrl = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const VW = 900, VH = 1000;
  let ch = null, ws = null, dir = null;
  try {
    const L = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${VW},${VH}`], 't180d678b-'); ch = L.ch; dir = L.dir;
    out.browserPid = ch && ch.pid;
    ws = new WebSocket(L.tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') out.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
    const shotPng = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); const b = Buffer.from(r.result.data, 'base64'); fs.writeFileSync(file, b); return decodePng(b); };
    const mouse = (p) => send('Input.dispatchMouseEvent', p);
    await send('Runtime.enable'); await send('Page.enable');
    const stand = (which) => `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        if (cmd === 'open_autosave') return fetch('/__a/${which}').then((r) => r.text());
        if (cmd === 'list_tracks' || cmd === 'list_pieces' || cmd === 'list_track_backups') return Promise.resolve([]);
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    // the ghost the preview holds now, against the placed track: its first station, its count, and how far its centre lies from the placed centre at the same s
    const READ = `const ask = (name) => new Promise((res) => { document.dispatchEvent(new CustomEvent(name, { detail: { reply: (x) => res(x) } })); setTimeout(() => res(undefined), 1000); });
      const g = await ask('t180:ghost-request'), t = await ask('t180:track-request');
      const hb = document.querySelector('input[aria-label="drag handles"]');
      if (!g) return { ghost: g === null ? 'none' : 'no answer', handles: hb ? hb.checked : 'no box' };
      const P = t && t.path && t.path.samples, byS = new Map(); if (P) for (const x of P) byS.set(Math.round(x.s * 1000), x);
      let n = 0, h = 0, hAt = null, v = 0, first = null;
      for (const x of g.samples) { const y = byS.get(Math.round(x.s * 1000)); if (!y) continue; n++; if (first === null) first = x.s;
        const dh = Math.hypot(x.pos[0] - y.pos[0], x.pos[2] - y.pos[2]), dv = Math.abs(x.pos[1] - y.pos[1]); if (dh > h) { h = dh; hAt = x.s; } if (dv > v) v = dv; }
      return { ghost: 'shown', handles: hb ? hb.checked : 'no box', samples: g.samples.length, s0: g.s0, firstSharedS: first, shared: n, offPlacedHorizM: h, at: hAt, offPlacedVertM: v };`;
    for (const which of Object.keys(DOCS)) {
      const added = await send('Page.addScriptToEvaluateOnNewDocument', { source: stand(which) });
      await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: baseUrl.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev('localStorage.clear(); return true;');
      await send('Page.navigate', { url: baseUrl });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      out.titles.push(await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title;"));
      out.state.push({ which, restore: await ev("for (let i = 0; i < 25; i++) { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (b) { b.click(); return 'restored'; } await new Promise((r) => setTimeout(r, 200)); } return 'no restore button';") });
      await sleep(1500);
      out.state.push({ which, hud: await ev("for (let i = 0; i < 50; i++) { const h = document.querySelector('.preview-hud'); if (h && !/building the road/.test(h.textContent)) return h.textContent.slice(0, 80); await new Promise((r) => setTimeout(r, 200)); } const h = document.querySelector('.preview-hud'); return 'still: ' + (h && h.textContent.slice(0, 80));") });
      await ev("Object.defineProperty(HTMLCanvasElement.prototype, 'requestPointerLock', { value: undefined, configurable: true }); return true;");
      out.state.push({ which, grid: await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Ground'); if (!b) return 'no Ground button'; b.click(); await new Promise((r) => setTimeout(r, 300)); return 'ground';") });
      // A's 'middle' frame: the focus on s 365, a right-drag down, no wheel
      await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 365 } })); return true;");
      await sleep(300);
      await mouse({ type: 'mouseMoved', x: 450, y: 400 });
      await mouse({ type: 'mousePressed', x: 450, y: 400, button: 'right', buttons: 2, clickCount: 1 });
      for (let k = 1; k <= 10; k++) { await mouse({ type: 'mouseMoved', x: 450, y: 400 + k * 50, button: 'right', buttons: 2 }); await sleep(20); }
      await mouse({ type: 'mouseReleased', x: 450, y: 900, button: 'right', buttons: 0, clickCount: 1 });
      await mouse({ type: 'mouseMoved', x: 600, y: 500 });
      await sleep(2500);
      const on = await ev(READ), imgOn = await shotPng(path.join(OUT, `wash_${which}_handles-on.png`));
      // his control: untick "drag handles" (the box's own change handler, as his click runs it)
      out.state.push({ which, untick: await ev("const hb = document.querySelector('input[aria-label=\"drag handles\"]'); if (!hb) return 'no box'; hb.click(); return 'checked=' + hb.checked;") });
      await mouse({ type: 'mouseMoved', x: 600, y: 520 });
      await sleep(2500);
      const off = await ev(READ), imgOff = await shotPng(path.join(OUT, `wash_${which}_handles-off.png`));
      out.rows.push({ which, on: { ...on, lavenderPx: lavender(imgOn) }, off: { ...off, lavenderPx: lavender(imgOff) } });
      if (added.result && added.result.identifier) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: added.result.identifier });
    }
  } catch (e) { out.fatal = String(e && e.stack || e).slice(0, 600); }
  finally {
    try { if (ws) ws.close(); } catch (e) { /* */ }
    try { if (ch) ch.kill(); } catch (e) { /* */ }
    await sleep(800); try { if (dir) fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { out.profileLeft = dir; }
    srv.close();
  }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'washpage678.json'), JSON.stringify(out, null, 1));
  for (const r of out.rows) console.log(JSON.stringify({ which: r.which, on: r.on, off: r.off }, (k, v) => (typeof v === 'number' ? R(v) : v)));
  console.log('errors', out.errors.length, 'titles', [...new Set(out.titles)].join('|'), 'fatal', out.fatal || 'none');
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
