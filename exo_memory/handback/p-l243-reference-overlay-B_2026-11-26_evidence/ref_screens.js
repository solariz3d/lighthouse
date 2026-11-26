// ref_screens.js (pane B, L243): the reference track overlay in the real page (app/index.html of TREE) in headless Chrome, after pane A's L242 harness.
// A stand-in for the native side serves his pieces folder read-only and the three reference tracks of the LOCAL key (out/reference-key.json) under
// their aliases only ("reference track 1"...), so no track's name reaches the page or a picture. Nothing is written into the AC folder or the pieces folder.
// Steps: two Extends, the Pieces bin, Coast Esses shown and PLACED; then per reference: View ▸ Reference track…, pick it; Overhead (zoomed out to hold
// the reference whole) and Free (L241's camera: RISE/BACK/LOOK). Also the overhead with no reference (the control).
// usage: TREE=<builder tree> node ref_screens.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = process.env.TREE || 'C:/Consonance/t180-wt-l243';
const PIECE = process.env.PIECE || 'Coast Esses';
const RISE = +(process.env.RISE || 2500), BACK = +(process.env.BACK || 1200), LOOK = +(process.env.LOOK || 40);   // from the start (t180-camera-focus s = 0), up and back
const ZOOM = process.env.ZOOM ? JSON.parse(process.env.ZOOM) : { 'reference track 1': 7, 'reference track 2': 18, 'reference track 3': 20 };
const { chromePath, launchChrome } = require(T + '/app/test/soundrender.js');
const outRoot = process.argv[2]; fs.mkdirSync(outRoot, { recursive: true });
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const key = JSON.parse(fs.readFileSync(path.join(T, 'out', 'reference-key.json'), 'utf8'));
const ALIASES = Object.keys(key).filter((k) => k.startsWith('reference track'));
// the shape bytes, up to hasGrid (what read_reference_line sends), read here in node: the read's own time is measured the same way the native side reads
const shapes = {}, readMs = {};
for (const a of ALIASES) {
  const t0 = process.hrtime.bigint(), fd = fs.openSync(path.join(AC, key[a].track, key[a].layout, 'ai', 'fast_lane.ai'), 'r');
  const head = Buffer.alloc(16); fs.readSync(fd, head, 0, 16, 0); const n = head.readInt32LE(4), end = 16 + n * 20 + 4 + n * 72 + 4;
  const b = Buffer.alloc(end); fs.readSync(fd, b, 0, end, 0); fs.closeSync(fd);
  readMs[a] = Number(process.hrtime.bigint() - t0) / 1e6; shapes[a] = b.toString('base64');
}
// the banked reference's free view: the nudge (the panel's own) that brings its most-banked point onto the user's start, 40 m ahead of it
const { readAiShape, ribbonOf, placeAt, apply } = require(T + '/src/reference/ribbon.js');
function bankNudge(a, anchor) {
  const sh = readAiShape(Buffer.from(shapes[a], 'base64')), r = ribbonOf(sh), M = placeAt(r, anchor);
  let k = 0; sh.extra.forEach((e, j) => { if (Math.abs(e.camber) > Math.abs(sh.extra[k].camber)) k = j; });
  // turned so the banked stretch runs the user's way, then moved so its most-banked point is 35 m to the left of the user's road, 120 m on from the start
  const n = sh.points.length, P = sh.points.map((q) => q.pos), f = [P[(k + 1) % n][0] - P[(k - 1 + n) % n][0], 0, P[(k + 1) % n][2] - P[(k - 1 + n) % n][2]];
  let yawDeg = 0, best = -2;
  for (let y = -180; y < 180; y += 0.5) { const t = apply(placeAt(r, anchor, { yawDeg: y }), f, 0), l = Math.hypot(t[0], t[2]), d = (t[0] * anchor.T[0] + t[2] * anchor.T[2]) / l; if (d > best) { best = d; yawDeg = y; } }
  const p = apply(placeAt(r, anchor, { yawDeg }), P[k]), left = [anchor.T[2], 0, -anchor.T[0]];
  const want = [anchor.pos[0] + left[0] * 35 + anchor.T[0] * 120, anchor.pos[1], anchor.pos[2] + left[2] * 35 + anchor.T[2] * 120];
  return { dx: Math.round(want[0] - p[0]), dz: Math.round(want[2] - p[2]), dy: Math.round(want[1] - p[1]), yawDeg, atPoint: k, camberDeg: +(sh.extra[k].camber * 180 / Math.PI).toFixed(1) };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };

(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(path.normalize(T))) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l243-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails)}`); return d.result.result.value; };
  const shot = async (name) => fs.writeFileSync(path.join(outRoot, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
  const list = ALIASES.map((a) => ({ track: a, layout: '', hasAi: true, uiLength: null })).concat([{ track: 'reference track 4', layout: '', hasAi: false, uiLength: null }]);
  const stand = `
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)}; window.__SHAPES = ${JSON.stringify(shapes)}; window.__LIST = ${JSON.stringify(list)};
    const b64 = (s) => { const t = atob(s), u = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) u[i] = t.charCodeAt(i); return u.buffer; };
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (cmd === 'list_tracks') return Promise.resolve([]);
      if (cmd === 'list_reference_tracks') return Promise.resolve(window.__LIST);
      if (cmd === 'read_reference_line') return window.__SHAPES[a.track] ? Promise.resolve(b64(window.__SHAPES[a.track])) : Promise.reject('no AI line there');
      return Promise.resolve(null); } } };`;
  await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
  await send('Page.navigate', { url: base });
  for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
  await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
  const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)}); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
  for (let i = 0; i < 2; i++) await click('Extend');
  await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
  await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1200)); return true;`);
  const placed = await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Place piece' && x.offsetParent); if (!b) return false; b.click(); await new Promise((r) => setTimeout(r, 1500)); return true;");
  const trackInfo = await ev("let t = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => { t = x; } } })); const p = t && t.path; return p ? { lengthM: p.lengthM || p.samples[p.samples.length - 1].s, samples: p.samples.length, start: p.samples[0].pos, closed: !!p.closed } : null;");
  const cam = (m) => ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(m)}); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
  const park = async () => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 895 }); await sleep(1500); };
  const wheel = async (notches) => { for (let i = 0; i < Math.abs(notches); i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 900, y: 450, deltaX: 0, deltaY: notches > 0 ? 120 : -120 }); await sleep(220); } await sleep(1200); };
  const press = async (code, k, ms) => { if (!(ms > 0)) return; const vk = k === ' ' ? 32 : k.toUpperCase().charCodeAt(0); await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', code, key: k, windowsVirtualKeyCode: vk }); await sleep(ms); await send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: k, windowsVirtualKeyCode: vk }); await sleep(300); };
  const freeCam = async (rise = RISE) => {
    await cam('Build'); await ev("document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: 0 } })); await new Promise((r) => setTimeout(r, 800)); return true;"); await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
    await press('Space', ' ', rise); await press('KeyS', 's', BACK);
    if (LOOK) { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 900, y: 300, button: 'right', buttons: 2, clickCount: 1 }); for (let i = 1; i <= 10; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 + (LOOK * i) / 10, button: 'right', buttons: 2 }); await sleep(30); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 900, y: 300 + LOOK, button: 'right', buttons: 0, clickCount: 1 }); await sleep(600); }
  };
  // the control: no reference
  await cam('Overhead'); await park(); await shot('0_overhead_no_reference.png');
  // the panel, opened by the View menu item
  await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
  if (process.env.KN5) {   // the kn5 road of one reference, through the same shadow pass and placement (KN5=<alias>)
    const al = process.env.KN5, info = await ev(`const p = window.__t180Reference(); return await p.pick(${JSON.stringify(al)}, '');`);
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'kn5mesh.json'), 'utf8'));
    await send('Runtime.evaluate', { expression: 'window.__KN5 = ' + JSON.stringify(data) + '; 1', returnByValue: true });
    const got = await ev(`const b64 = (s) => { const t = atob(s), u = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) u[i] = t.charCodeAt(i); return u.buffer; };
      const batches = window.__KN5.meshes.map((m) => { const pos = new Float32Array(b64(m.pos)); const nrm = new Float32Array(pos.length); for (let i = 1; i < nrm.length; i += 3) nrm[i] = 1; return { positions: pos, normals: nrm, indices: new Uint16Array(b64(m.idx)) }; });
      let r = null; document.dispatchEvent(new CustomEvent('t180:reference', { detail: { ribbon: { batches, edges: new Float32Array(0), start: window.__KN5.start, lengthM: 0, width: {}, closed: true, points: 0 }, nudge: {}, reply: (x) => { r = x; } } }));
      return { batches: batches.length, tris: batches.reduce((n, b) => n + b.indices.length / 3, 0), info: r };`);
    await cam('Overhead'); await wheel(ZOOM[al] || 7); await park(); await shot('kn5_overhead.png'); await wheel(-(ZOOM[al] || 7));
    await freeCam(); await park(); await shot('kn5_free.png');
    try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
    console.log(JSON.stringify({ kn5: got, ribbonInfo: info, pageErrors: errors }, null, 1)); return;
  }
  const results = [];
  for (const [i, a] of ALIASES.entries()) {
    const t0 = Date.now();
    const info = await ev(`const p = window.__t180Reference(); const info = await p.pick(${JSON.stringify(a)}, ''); const t = performance.now(); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return { info, state: p.state(), frameMs: performance.now() - t };`);
    await cam('Overhead'); await wheel(ZOOM[a] || 12); await park(); await shot(`${i + 1}_overhead.png`); await wheel(-(ZOOM[a] || 12));   // the zoom is kept per mode: put it back
    let nudge = null;
    if (key[a].kind === 'banked') { nudge = bankNudge(a, info.info.anchor); await ev(`await window.__t180Reference().setNudge(${JSON.stringify(nudge)}); return true;`); }
    await freeCam(nudge ? 700 : RISE); await park(); await shot(`${i + 1}_free.png`);
    if (nudge) { nudge.after = (await ev('return window.__t180Reference().state();')).nudge; await ev('await window.__t180Reference().setNudge({ dx: 0, dz: 0, dy: 0, yawDeg: 0 }); return true;'); }
    results.push({ alias: a, kind: key[a].kind, readMsNode: readMs[a], wallMs: Date.now() - t0, nudge, ...info });
  }
  const pickNone = await ev('const p = window.__t180Reference(); await p.pick(null); let i = 1; document.dispatchEvent(new CustomEvent(\'t180:reference-request\', { detail: { reply: (x) => { i = x; } } })); return i;');
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
  console.log(JSON.stringify({ placed, trackInfo, results, afterNone: pickNone, pageErrors: errors }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
