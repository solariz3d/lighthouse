// render265b.js (pane A, L265, the second render): the mock again, the camera ON the turn, straight down, at true scale. Nothing is exaggerated.
//   node render265b.js <builder tree at c522ea6> <evidence dir> <raw dir>
// PART 1 rebuilds even265.js's documents with the same code (the base, the 8-grab and 4-grab befores, the level prototype E2 on each) and checks them against
// even265.json's committed figures. PART 2 (headless Chrome through the shared launcher: --headless=new, --mute-audio; the title zz-headless-test first): each
// document restored on the real page, then for each framing the camera placed by his own controls: the focus a click on a red sends ('t180-camera-focus', s),
// a right-drag down (the free look; the pitch stops at the free camera's -89 degrees), and wheel notches (in free mode 4 m along the view each). The pose is
// read back ('t180:view') with the road's height and the outer edge's place, so each picture's scale is a number. Pictures only; nothing is saved.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT, RAW] = process.argv.slice(2), T = path.resolve(T0);
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(RAW, { recursive: true });
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R2 = (x) => Math.round(x * 1e4) / 1e4;
const out = { started: new Date().toISOString(), tree: T, measured: {}, check: {}, frames: [], shots: [], composites: [], titles: [], errors: [], state: [] };

// ── PART 1: even265.js's code, unchanged where copied ──
let base = D.createDoc('even');
for (const p of [{ length: 200, turn: 0 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 150, turn: 0 }])
  base = TB.extendCorner(base, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, turnAs: 'corner' }));
base = Object.freeze(base);
const OFF = SC.pieceOffsets(base), LO = OFF[1], HI = OFF[4] + base.pieces[4].length;
const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
const stats = (xs) => { const mn = Math.min(...xs), mx = Math.max(...xs); return { min: R2(mn), max: R2(mx), spread: R2(mx - mn) }; };
function measure(doc) {
  const S = []; for (let s = LO; s <= HI + 1e-9; s += 1) S.push(s);
  const w = S.map((s) => at(doc, 'w', s)), l = S.map((s) => at(doc, 'l', s)), outer = w.map((x, i) => l[i] - x / 2), inner = w.map((x, i) => l[i] + x / 2);
  const part = (a, b) => S.map((s, i) => [s, w[i]]).filter(([s]) => s >= a && s <= b).map(([, x]) => x);
  return { w: stats(w), outer: stats(outer), inner: stats(inner), wFrom210To430: stats(part(LO + 10, HI - 10)), wFrom230To410: stats(part(LO + 30, HI - 30)) };
}
async function shellOn(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); sh.setSculpt(true); return sh; }
const msg = (sh) => sh.getState().message;
function grab(sh, s, want, r = 30) {
  const d = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), push = fr.R.map((k) => -k * e);
  const delta = ZG.follow(push, fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${msg(sh)}`);
  sh.brushTo(delta); sh.endBrush();
}
const doc = (sh) => sh.getState().history.present;
const weight = (s, lo, hi, ramp) => (s >= lo && s <= hi ? 1 : ((d) => (d >= ramp ? 0 : 1 - SC.smootherstep(d / ramp)))(s < lo ? lo - s : s - hi));
const q = (x, dec) => { const v = Number(x.toFixed(dec)); return Object.is(v, -0) ? 0 : v; };
const isLinked = (d, a, b, ch) => a >= 0 && !d.pieces.slice(a + 1, b).some((P) => P.type === 'flight') && (!D.OPTIONAL[ch] || !!(d.pieces[a][D.OPTIONAL[ch]] && d.pieces[b][D.OPTIONAL[ch]]));
function settle(d, ch, res) {
  let a = -1;
  for (let b = 0; b < d.pieces.length; b++) {
    if (d.pieces[b].type !== 'road') continue;
    const Pb = d.pieces[b], rb = res[b];
    if (!isLinked(d, a, b, ch)) { if (a >= 0 && rb) { rb.ctrl[0] = Pb.channels[ch][0]; rb.ctrl[1] = Pb.channels[ch][1]; rb.changed = rb.changed.filter((i) => i > 1); } a = b; continue; }
    const Pa = d.pieces[a], ra = res[a], n = Pa.channels[ch].length;
    const all = ra && rb && ra.changed.includes(n - 1) && ra.changed.includes(n - 2) && rb.changed.includes(0) && rb.changed.includes(1);
    if (all) { const h = Pa.length - (Pa.knots.length ? Pa.knots[Pa.knots.length - 1] : 0), hb = Pb.knots.length ? Pb.knots[0] : Pb.length; const v = q(ra.ctrl[n - 1], D.DEC[ch]), m = (3 * (v - q(ra.ctrl[n - 2], D.DEC[ch]))) / h; rb.ctrl[0] = v; rb.ctrl[1] = v + (m * hb) / 3; }
    else { if (ra) { ra.ctrl[n - 1] = Pa.channels[ch][n - 1]; ra.ctrl[n - 2] = Pa.channels[ch][n - 2]; ra.changed = ra.changed.filter((i) => i < n - 2); } if (rb) { rb.ctrl[0] = Pb.channels[ch][0]; rb.ctrl[1] = Pb.channels[ch][1]; rb.changed = rb.changed.filter((i) => i > 1); } }
    a = b;
  }
  return d.pieces.map((P, p) => { const x = res[p]; if (!x || !x.changed.length) return P; return { ...P, channels: { ...P.channels, [ch]: P.channels[ch].map((v, i) => (x.changed.includes(i) ? q(x.ctrl[i], D.DEC[ch]) : v)) } }; });
}
function proto(d, set, { lo, hi, ramp, mode }) {
  let cur = d;
  for (const [ch, val] of Object.entries(set)) {
    const off = SC.pieceOffsets(cur), W0 = lo - ramp, W1 = hi + ramp;
    const res = cur.pieces.map((P, p) => {
      if (P.type !== 'road' || off[p] + P.length < W0 || off[p] > W1) return null;
      const t = D.knotVector(P), c = P.channels[ch], ctrl = c.slice(), changed = [];
      for (let i = 0; i < c.length; i++) {
        if (off[p] + t[i] < W0 - 1e-9 || off[p] + t[i + 4] > W1 + 1e-9) continue;
        const g = weight(off[p] + SC.knotAverage(t, i), lo, hi, ramp);
        ctrl[i] = mode === 'to' ? c[i] + g * (val - c[i]) : c[i] + g * val; changed.push(i);
      }
      return { ctrl, changed };
    });
    cur = Object.freeze(D.checkDoc({ ...cur, pieces: settle(cur, ch, res) }));
  }
  return cur;
}

(async () => {
  const sh8 = await shellOn(base); for (let s = LO + 15; s < HI; s += 30) grab(sh8, s, 16); const before8 = doc(sh8);
  const sh4 = await shellOn(base); for (const k of [0, 1, 2, 3]) grab(sh4, OFF[1 + k] + 30, 16); const before4 = doc(sh4);
  const E2 = { lo: LO - 20, hi: HI + 20, ramp: 30, mode: 'to' };   // even265.js's E2: a level to 16 m (l to -2, the inner edge held), ramps 30 m outside the run
  const after8 = proto(before8, { w: 16, l: -2 }, E2), after4 = proto(before4, { w: 16, l: -2 }, E2);
  const DOCS = { before8, after8, before4, after4 };
  for (const [k, d] of Object.entries(DOCS)) out.measured[k] = measure(d);
  // the check against the committed figures (even265.json, run 11:08:39Z)
  const J = JSON.parse(fs.readFileSync(path.join(OUT, 'even265.json'), 'utf8')), row = (p) => J.rows.find((r) => r.name.startsWith(p));
  const pairs = [['before8', row('T2b')], ['before4', row('T2a')], ['after8', row('E2 a LEVEL to 16 m (l to -2, the inner edge held), ramps 30 m outside the run, after T2b')]];
  for (const [k, r] of pairs) out.check[k] = { committed: { w: r.w.spread, wMin: r.w.min, wMax: r.w.max, outer: r.outer.spread, inner: r.inner.spread }, now: { w: out.measured[k].w.spread, wMin: out.measured[k].w.min, wMax: out.measured[k].w.max, outer: out.measured[k].outer.spread, inner: out.measured[k].inner.spread } };
  out.check.same = pairs.every(([k, r]) => r.w.spread === out.measured[k].w.spread && r.w.min === out.measured[k].w.min && r.w.max === out.measured[k].w.max && r.outer.spread === out.measured[k].outer.spread);
  console.log(JSON.stringify(out.measured), 'same as committed:', out.check.same);
  const lAt = Object.fromEntries(Object.entries(DOCS).map(([k, d]) => [k, Object.fromEntries([205, 320].map((s) => [s, { w: R2(at(d, 'w', s)), l: R2(at(d, 'l', s)) }]))]));

  // ── PART 2: the page ──
  const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const PAY = Object.fromEntries(Object.entries(DOCS).map(([k, d]) => [k, JSON.stringify({ schema: 1, kind: 'core', name: 'mock turn', doc: D.serialize(d) })]));
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
  const FRAMES = [
    { id: 'start', sc: 205, notches: 0, label: "the turn's start, s 205" },
    { id: 'middle', sc: 320, notches: 0, label: "the turn's middle, s 320" },
    { id: 'close', sc: 320, notches: 5, label: "the turn's middle, closer" },
    { id: 'higher', sc: 320, notches: -10, label: "the turn's middle, higher" },
    { id: 'far', sc: 320, notches: -29, label: 'most of the turn' },
  ];
  const TEXT = {
    before8: ['BEFORE · today\'s tools', '8 grabs on the outer edge, each pulled to 16 m'],
    after8: ['AFTER · Even width (prototype)', 'the turn brought to 16 m, inner edge held'],
    before4: ['BEFORE · today\'s tools', '4 grabs, one per piece, each pulled to 16 m'],
    after4: ['AFTER · Even width (prototype)', 'from the 4-grab turn, to 16 m, inner edge held'],
  };
  const imgs = {};
  let ch = null, dir = null, ws = null;
  try {
    const L = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${VW},${VH}`], 't180l265b-'); ch = L.ch; dir = L.dir;
    ws = new WebSocket(L.tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') out.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
    const shot = async (file) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 }); fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); return r.result.data; };
    const mouse = (p) => send('Input.dispatchMouseEvent', p);
    await send('Runtime.enable'); await send('Page.enable');
    const stand = (which) => `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        if (cmd === 'open_autosave') return fetch('/__a/${which}').then((r) => r.text());
        if (cmd === 'list_tracks' || cmd === 'list_pieces' || cmd === 'list_track_backups') return Promise.resolve([]);
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    for (const which of ['before8', 'after8', 'before4', 'after4']) {
      const added = await send('Page.addScriptToEvaluateOnNewDocument', { source: stand(which) });
      await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: baseUrl.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev('localStorage.clear(); return true;');
      await send('Page.navigate', { url: baseUrl });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      out.titles.push(await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title;"));
      out.state.push({ which, restore: await ev("for (let i = 0; i < 25; i++) { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (b) { b.click(); return 'restored'; } await new Promise((r) => setTimeout(r, 200)); } return 'no restore button';") });
      await sleep(1500);
      out.state.push({ which, hud: await ev("for (let i = 0; i < 50; i++) { const h = document.querySelector('.preview-hud'); if (h && !/building the road/.test(h.textContent)) return h.textContent; await new Promise((r) => setTimeout(r, 200)); } const h = document.querySelector('.preview-hud'); return 'still: ' + (h && h.textContent);") });
      // the look without the pointer lock: the preview's own fallback, the plain drag (preview.js lockLook); headless gives no movementX to a locked pointer
      out.state.push({ which, lock: await ev("Object.defineProperty(HTMLCanvasElement.prototype, 'requestPointerLock', { value: undefined, configurable: true }); return typeof document.createElement('canvas').requestPointerLock;") });
      const m = out.measured[which], [h1, h2] = TEXT[which];
      await ev(`const P = document.createElement('div'); P.id = 'a265mock'; P.style.cssText = 'position:fixed;right:10px;top:56px;z-index:50;width:236px;padding:6px 8px;background:rgba(18,18,22,.9);color:#eee;font:11px/1.4 system-ui,sans-serif;border:1px solid rgba(255,255,255,.2);border-radius:5px;pointer-events:none';
        P.innerHTML = ${JSON.stringify(`<div style="font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#e0b84a">mock · not built</div><div style="font-weight:600">${h1}</div><div style="color:#ccc">${h2}</div><div style="color:#ccc">width over the turn ${m.w.min.toFixed(2)} to ${m.w.max.toFixed(2)} m</div>`)};
        document.body.appendChild(P); return true;`);
      for (const F of FRAMES) {
        await ev(`document.dispatchEvent(new CustomEvent('t180-camera-focus', { detail: { s: ${F.sc + 45} } })); return true;`);
        await sleep(300);
        await mouse({ type: 'mouseMoved', x: 450, y: 400 });
        await mouse({ type: 'mousePressed', x: 450, y: 400, button: 'right', buttons: 2, clickCount: 1 });
        for (let k = 1; k <= 10; k++) { await mouse({ type: 'mouseMoved', x: 450, y: 400 + k * 50, button: 'right', buttons: 2 }); await sleep(20); }
        await mouse({ type: 'mouseReleased', x: 450, y: 900, button: 'right', buttons: 0, clickCount: 1 });
        for (let k = 0; k < Math.abs(F.notches); k++) { await mouse({ type: 'mouseWheel', x: 600, y: 500, deltaX: 0, deltaY: F.notches > 0 ? -100 : 100 }); await sleep(30); }
        await mouse({ type: 'mouseMoved', x: 600, y: 500 });
        await sleep(1000);
        const v = await ev(`const v = await new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => res(x) } })); setTimeout(() => res(null), 1000); });
          const t = await new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => res(x) } })); setTimeout(() => res(null), 1000); });
          const cv = [...document.querySelectorAll('canvas')].sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
          if (!v || !v.pose) return { error: 'no view' };
          const S = t && t.path && t.path.samples; let smp = null; if (S) { let best = Infinity; for (const x of S) { const d = Math.abs(x.s - ${F.sc}); if (d < best) { best = d; smp = x; } } }
          const hud = document.querySelector('.preview-hud');
          return { mode: v.mode, eye: v.pose.eye.slice(), target: v.pose.target.slice(), up: v.pose.up.slice(), fov: v.pose.fov, canvas: [cv.clientWidth, cv.clientHeight], hud: hud && hud.textContent,
            sample: smp ? { s: smp.s, pos: [smp.pos[0], smp.pos[1], smp.pos[2]], L: [smp.L[0], smp.L[1], smp.L[2]] } : null };`);
        const rec = { which, frame: F.id, ...v };
        if (v && v.eye && v.sample) {
          const d = [0, 1, 2].map((k) => v.target[k] - v.eye[k]), n = Math.hypot(...d);
          rec.pitchDeg = R2(Math.asin(d[1] / n) * 180 / Math.PI);
          rec.heightM = R2(v.eye[1] - v.sample.pos[1]);
          rec.pxPerM = R2(v.canvas[1] / (2 * rec.heightM * Math.tan(v.fov / 2)));
          rec.viewM = [R2(v.canvas[0] / rec.pxPerM), R2(v.canvas[1] / rec.pxPerM)];
          const u = lAt[which][F.sc] ? lAt[which][F.sc].l - lAt[which][F.sc].w / 2 : null;   // the outer (right) edge's u at sc (u + = left)
          if (u !== null) { const e = [0, 1, 2].map((k) => v.sample.pos[k] + v.sample.L[k] * u); rec.outerEdgeAtSc = e.map(R2); rec.outerEdgeFromViewCentreM = R2(Math.hypot(e[0] - v.eye[0], e[2] - v.eye[2])); }
        }
        out.frames.push(rec);
        const file = path.join(RAW, `${which}_${F.id}.jpg`); imgs[`${which}_${F.id}`] = await shot(file); out.shots.push(path.basename(file));
      }
      out.titles.push(await ev('return document.title;'));
      if (added.result && added.result.identifier) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: added.result.identifier });
    }
    // the same pose for before and after: compare the eyes frame by frame
    for (const F of FRAMES) for (const [a, b] of [['before8', 'after8'], ['before4', 'after4'], ['before8', 'before4']]) {
      const A = out.frames.find((r) => r.which === a && r.frame === F.id), B = out.frames.find((r) => r.which === b && r.frame === F.id);
      if (A && B && A.eye && B.eye) out.state.push({ samePose: `${a}/${b} ${F.id}`, eyeDiffM: R2(Math.hypot(...A.eye.map((x, k) => x - B.eye[k]))), upDiff: R2(Math.hypot(...A.up.map((x, k) => x - B.up[k]))) });
    }
    // ONE LOOK per framing and pair: before and after side by side, at the page's own pixels (no scaling)
    await send('Page.navigate', { url: 'about:blank' }); await sleep(300);
    await send('Emulation.setDeviceMetricsOverride', { width: 2 * VW + 24, height: VH + 52, deviceScaleFactor: 1, mobile: false });
    for (const [pair, b, a, what] of [['8grabs', 'before8', 'after8', '8 grabs, each pulled to 16 m'], ['4grabs', 'before4', 'after4', '4 grabs, one per piece, each pulled to 16 m']]) for (const F of FRAMES) {
      const r = out.frames.find((x) => x.which === b && x.frame === F.id); if (!r || !imgs[`${b}_${F.id}`] || !imgs[`${a}_${F.id}`]) continue;
      const head = `Sculpt ▸ Even, his turn: before (${what}) and after · ${F.label} · straight down, ${Math.round(r.heightM)} m up, ${r.pxPerM.toFixed(1)} px a metre · true scale, nothing exaggerated`;
      await ev(`document.title = 'zz-headless-test'; document.body.style.cssText = 'margin:0;background:#111;color:#eee;font:14px system-ui,sans-serif';
        document.body.innerHTML = ${JSON.stringify(`<div style="padding:8px 12px;font-weight:600;white-space:nowrap">${head} <span style="color:#e0b84a;font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin-left:8px">mock · not built</span></div>`)}
          + '<div style="display:flex;gap:8px;padding:0 8px"><img style="width:${VW}px;height:${VH}px" src="data:image/jpeg;base64,${imgs[`${b}_${F.id}`]}"><img style="width:${VW}px;height:${VH}px" src="data:image/jpeg;base64,${imgs[`${a}_${F.id}`]}"></div>';
        await new Promise((r) => setTimeout(r, 300)); return true;`);
      const name = `even2_${pair}_${F.id}.jpg`; await shot(path.join(OUT, name)); out.composites.push(name);
      out.titles.push(await ev('return document.title;'));
    }
  } catch (e) { out.fatal = String(e && e.stack || e); }
  finally { try { ws && ws.close(); } catch (e) { /* */ } try { ch && ch.kill(); } catch (e) { /* */ } await sleep(800); try { dir && fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { out.profileLeft = dir; } srv.close(); }
  out.ended = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'render265b.json'), JSON.stringify(out, (k, v) => (typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 1e6) / 1e6 : v), 1));
  console.log('frames', out.frames.map((r) => `${r.which} ${r.frame} pitch ${r.pitchDeg} h ${r.heightM} px/m ${r.pxPerM} edge-from-centre ${r.outerEdgeFromViewCentreM} mode ${r.mode}`).join('\n'));
  console.log('composites', out.composites.join(' '), 'errors', out.errors.length, 'titles', [...new Set(out.titles)].join('|'), out.fatal || '');
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
