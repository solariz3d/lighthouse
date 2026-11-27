// even265.js (pane A, L265): his example measured (the width along a turn after every Sculpt tool that exists), two candidate designs as PROTOTYPES (computed here,
// never in the builder), and the mock on the real page. One run, through heavy-run at BelowNormal.
//   node even265.js <builder tree at c522ea6> <out dir> [--no-mock]
// PART 1 (node, the core shell): a turn of 4 pieces (60 m, 30 degrees each, left) at 12 m between a 200 m lead and a 150 m exit, flat. Each scenario starts from that
// base unless it says "after". Every 1 m over the turn: the width w, the lateral offset l, the inner (left) edge l + w/2 and the outer (right) edge l - w/2, and the
// spread (max - min) of each; outside the turn, the largest change from the base. PART 2 (headless Chrome, --mute-audio, title zz-headless-test first): the page with
// the scuffed turn restored, then the levelled one, overhead, a mock panel marked "mock · not built", and one picture with both. Pictures only; nothing is saved.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0), NO_MOCK = process.argv.includes('--no-mock');
fs.mkdirSync(OUT, { recursive: true });
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
const R2 = (x) => Math.round(x * 1e4) / 1e4;
const out = { started: new Date().toISOString(), tree: T, setup: {}, rows: [], protos: [], errors: [], mock: null };

// ── the base: lead 200 m, the turn (pieces 1..4), exit 150 m; 12 m wide, flat ──
let base = D.createDoc('even');
for (const p of [{ length: 200, turn: 0 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 150, turn: 0 }])
  base = TB.extendCorner(base, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, turnAs: 'corner' }));
base = Object.freeze(base);
const OFF = SC.pieceOffsets(base), LO = OFF[1], HI = OFF[4] + base.pieces[4].length, MID = (LO + HI) / 2;
out.setup = { pieces: base.pieces.map((P) => ({ type: P.type, length: P.length, knots: P.knots.length })), turn: { from: R2(LO), to: R2(HI), mid: R2(MID) }, width: 12, grabRadius: 30, toolRadius: 60 };

const at = (doc, ch, s) => { const off = SC.pieceOffsets(doc); for (let i = 0; i < doc.pieces.length; i++) { const P = doc.pieces[i]; if (P.type === 'road' && s >= off[i] - 1e-9 && s <= off[i] + P.length + 1e-9) return D.channelAt(P, ch, Math.min(P.length, Math.max(0, s - off[i]))).v; } return NaN; };
const stats = (xs) => { const mn = Math.min(...xs), mx = Math.max(...xs), mean = xs.reduce((a, b) => a + b, 0) / xs.length; return { min: R2(mn), max: R2(mx), spread: R2(mx - mn), mean: R2(mean) }; };
/** the turn's numbers: every 1 m from LO to HI; and outside it (from 0 to the end) the largest change from the base, in w and l */
function measure(doc, name, extra = {}) {
  const S = []; for (let s = LO; s <= HI + 1e-9; s += 1) S.push(s);
  const w = S.map((s) => at(doc, 'w', s)), l = S.map((s) => at(doc, 'l', s));
  const inner = w.map((x, i) => l[i] + x / 2), outer = w.map((x, i) => l[i] - x / 2);
  const L = SC.pieceOffsets(doc), end = L[L.length - 1] + doc.pieces[doc.pieces.length - 1].length;
  let outside = 0; for (let s = 0; s <= end + 1e-9; s += 1) { if (s >= LO - 1e-9 && s <= HI + 1e-9) continue; outside = Math.max(outside, Math.abs(at(doc, 'w', s) - at(base, 'w', s)), Math.abs(at(doc, 'l', s) - at(base, 'l', s))); }
  const row = { name, w: stats(w), l: stats(l), inner: stats(inner), outer: stats(outer), rmsFrom16: R2(Math.sqrt(w.reduce((a, x) => a + (x - 16) ** 2, 0) / w.length)), outsideMaxChange: R2(outside), profile: w.filter((x, i) => i % 10 === 0).map(R2), ...extra };
  out.rows.push(row); return row;
}

// ── the shell, one per scenario, its document the base ──
async function shellOn(doc) { const sh = await createCoreShell({}); sh.commitDoc(doc); sh.setSculpt(true); return sh; }   // Sculpt on: the grab (beginFollow) needs it
const msg = (sh) => sh.getState().message;
/** his gesture: press the OUTER (right) rim at s and pull it straight out until the width there reads `want` (the zone grab's follow, as the panel sends it) */
function grab(sh, s, want, r = 30) {
  const d = sh.getState().history.present, rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s, -1); if (!fr) throw new Error(`no frame at ${s}`);
  const e = want - at(d, 'w', s), push = fr.R.map((k) => -k * e);   // straight out along the right (-R), e metres
  const delta = ZG.follow(push, fr, {}); if (!delta) throw new Error(`no follow at ${s}`);
  sh.beginFollow({ s0: fr.s, r }); if (!sh.getState().brush) throw new Error(`beginFollow at ${s}: ${msg(sh)}`);
  sh.brushTo(delta); const m = msg(sh); sh.endBrush();
  return { s: R2(fr.s), e: R2(e), follow: Object.fromEntries(Object.entries(delta).map(([k, v]) => [k, R2(v)])), message: m };
}
const doc = (sh) => sh.getState().history.present;

// ── the prototypes (NOT the builder's code): a flat-topped window. weight 1 on [lo, hi], a smootherstep ramp to 0 over `ramp` m beyond each end. `to`: bring each
// control point to the value (a level); `add`: add the same amount (a flat-topped brush). The joints as src/core/sculpt.js settle builds them (value, then slope) ──
const weight = (s, lo, hi, ramp) => (s >= lo && s <= hi ? 1 : ((d) => (d >= ramp ? 0 : 1 - SC.smootherstep(d / ramp)))(s < lo ? lo - s : s - hi));
const q = (x, dec) => { const v = Number(x.toFixed(dec)); return Object.is(v, -0) ? 0 : v; };
const isLinked = (d, a, b, ch) => a >= 0 && !d.pieces.slice(a + 1, b).some((P) => P.type === 'flight') && (!D.OPTIONAL[ch] || !!(d.pieces[a][D.OPTIONAL[ch]] && d.pieces[b][D.OPTIONAL[ch]]));
function settle(d, ch, res) {   // a copy of src/core/sculpt.js settle without the cup case (no cup here)
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
  const pieces = d.pieces.map((P, p) => { const x = res[p]; if (!x || !x.changed.length) return P; return { ...P, channels: { ...P.channels, [ch]: P.channels[ch].map((v, i) => (x.changed.includes(i) ? q(x.ctrl[i], D.DEC[ch]) : v)) } }; });
  return pieces;
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
  const run = async (name, f) => { try { await f(); } catch (e) { out.errors.push(`${name}: ${e && e.message || e}`); } };
  let scuffed4 = null, scuffed8 = null;
  measure(base, 'T0 the base: the turn at 12 m');
  await run('T1', async () => { const sh = await shellOn(base); const g = grab(sh, MID, 16); measure(doc(sh), 'T1 his gesture: the outer rim grabbed at the turn\'s middle and pulled out to 16 m (grab radius 30 m)', { grabs: [g] }); });
  await run('T2a', async () => { const sh = await shellOn(base); const gs = []; for (const k of [0, 1, 2, 3]) gs.push(grab(sh, OFF[1 + k] + 30, 16)); scuffed4 = doc(sh); measure(scuffed4, 'T2a by hand: 4 grabs, one at each piece\'s middle, each pulled until it reads 16 m (a perfect snap at each spot)', { grabs: gs }); });
  await run('T2b', async () => { const sh = await shellOn(base); const gs = []; for (let s = LO + 15; s < HI; s += 30) gs.push(grab(sh, s, 16)); scuffed8 = doc(sh); measure(scuffed8, 'T2b by hand: 8 grabs every 30 m (one grab radius apart), each pulled until it reads 16 m', { grabs: gs }); });
  await run('T3', async () => { const sh = await shellOn(base); const g = grab(sh, MID, 16, 120); measure(doc(sh), 'T3 a wider brush: one grab at the middle with radius 120 m (the whole turn), pulled to 16 m', { grabs: [g] }); });
  await run('T4', async () => { const sh = await shellOn(base); sh.setSculpt(true); sh.beginSculpt({ channel: 'w', from: 1, to: 4 }); if (!sh.getState().brush) throw new Error(msg(sh)); sh.sculptTo(4); const m = msg(sh); sh.endSculpt(); measure(doc(sh), 'T4 a selected run: the 4 turn pieces selected, their width handle dragged to 16 m (the run\'s centre reads 16)', { message: m }); });
  await run('T4b', async () => { const sh = await shellOn(base); sh.setSculpt(true); for (const i of [1, 2, 3, 4]) { const d0 = doc(sh), P = d0.pieces[i]; const mid = D.channelAt(P, 'w', P.length / 2).v; sh.beginSculpt({ channel: 'w', piece: i }); if (!sh.getState().brush) throw new Error(msg(sh)); sh.sculptTo(16 - mid); sh.endSculpt(); } measure(doc(sh), 'T4b one piece at a time: each turn piece selected alone, its width handle dragged to 16 m'); });
  await run('T5', async () => { const sh = await shellOn(base); sh.beginBrush({ tool: 'width', s0: MID, r: 60 }); if (!sh.getState().brush) throw new Error(msg(sh)); sh.brushTo(4); const m = msg(sh); sh.endBrush(); measure(doc(sh), 'T5 the Width tool at the turn\'s middle, radius 60 m (the tools\' default), +4 m', { message: m }); });
  for (const lam of [4, 16, 64]) await run(`T6 ${lam}`, async () => {
    if (!scuffed8) throw new Error('no T2b');
    const sh = await shellOn(scuffed8);
    for (const ch of ['w', 'l']) { sh.beginBrush({ tool: 'smooth', channel: ch, s0: MID, r: (HI - LO) / 2 }); if (!sh.getState().brush) throw new Error(`${ch}: ${msg(sh)}`); sh.brushTo(lam); sh.endBrush(); }
    measure(doc(sh), `T6 Smooth after T2b: width, then the lateral offset, over the turn (radius ${(HI - LO) / 2} m), strength ${lam}`, { message: msg(sh) });
  });
  // the prototypes: E1 a flat-topped ADD; E2 a LEVEL (to 16 m, the inner edge held: l to -2), with its ramps outside the run (and one knot span of margin, so the run itself is even
  // to its joints), or inside the run (the neighbours untouched). On the base, and on the scuffed T2b.
  await run('E', async () => {
    const span = 20;   // document.js KNOT_M
    const variants = [
      ['E1 a flat-topped ADD (+4 m width, l -2) over the run, ramps 30 m outside it', 'add', { w: 4, l: -2 }, { lo: LO - span, hi: HI + span, ramp: 30 }],
      ['E2 a LEVEL to 16 m (l to -2, the inner edge held), ramps 30 m outside the run', 'to', { w: 16, l: -2 }, { lo: LO - span, hi: HI + span, ramp: 30 }],
      ['E2i a LEVEL to 16 m (l to -2), ramps 30 m INSIDE the run (the neighbours untouched)', 'to', { w: 16, l: -2 }, { lo: LO + 30, hi: HI - 30, ramp: 30 }],
    ];
    for (const [name, mode, set, win] of variants) for (const [startName, start] of [['on the base', base], ['after T2b', scuffed8]]) {
      if (!start) continue;
      const d = proto(start, set, { ...win, mode }), row = measure(d, `${name}, ${startName}`, { prototype: true });
      // outside the prototype's own window the document must be the same bits
      const off = SC.pieceOffsets(d); let same = 0, diff = 0; d.pieces.forEach((P, i) => { if (P === start.pieces[i]) same++; else diff++; });
      row.piecesSameObject = same; row.piecesChanged = diff;
      if (name.startsWith('E2 ') && startName === 'after T2b') out.levelled = D.serialize(d);
    }
  });
  if (scuffed8) out.scuffed = D.serialize(scuffed8);
  fs.writeFileSync(path.join(OUT, 'even265.json'), JSON.stringify({ ...out, scuffed: undefined, levelled: undefined }, null, 1));
  console.log(out.rows.map((r) => `${r.name.slice(0, 60).padEnd(60)} w ${r.w.min}..${r.w.max} spread ${r.w.spread} | inner ${r.inner.spread} outer ${r.outer.spread} | outside ${r.outsideMaxChange}`).join('\n'));
  if (out.errors.length) console.log('ERRORS', out.errors);
  if (NO_MOCK || !out.scuffed || !out.levelled) { console.log(NO_MOCK ? 'no mock asked' : 'no mock: a document is missing'); return; }

  // ── PART 2: the mock on the real page ──
  const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const PAY = { before: JSON.stringify({ schema: 1, kind: 'core', name: 'mock turn', doc: out.scuffed }), after: JSON.stringify({ schema: 1, kind: 'core', name: 'mock turn', doc: out.levelled }) };
  const srv = http.createServer((qq, s) => {
    const u = decodeURIComponent(qq.url.split('?')[0]);
    if (u.startsWith('/__a/')) { const b = PAY[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'text/plain' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const baseUrl = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const mock = { errors: [], shots: [], titles: [], state: [] }; out.mock = mock;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let ch = null, dir = null, ws = null;
  try {
    const L = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l265-'); ch = L.ch; dir = L.dir;
    ws = new WebSocket(L.tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') mock.errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
    const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 }); const b = Buffer.from(r.result.data, 'base64'); fs.writeFileSync(path.join(OUT, name), b); mock.shots.push(name); return r.result.data; };
    await send('Runtime.enable'); await send('Page.enable');
    const stand = (which) => `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        if (cmd === 'open_autosave') return fetch('/__a/${which}').then((r) => r.text());
        if (cmd === 'list_tracks' || cmd === 'list_pieces' || cmd === 'list_track_backups') return Promise.resolve([]);
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    const W = (k) => out.rows.find((r) => r.name.startsWith(k));
    const before = W('T2b'), after = W('E2 a LEVEL to 16 m (l to -2, the inner edge held), ramps 30 m outside the run, after T2b');
    const chart = (row, colour) => { const p = row.profile, xs = p.map((v, i) => 8 + i * (264 / (p.length - 1))), y = (v) => 70 - (v - 11) * 11; return `<svg width="280" height="80" style="display:block;background:rgba(0,0,0,.25);border-radius:4px"><line x1="8" x2="272" y1="${y(16)}" y2="${y(16)}" stroke="#888" stroke-dasharray="3 3"/><text x="274" y="${y(16) + 4}" fill="#aaa" font-size="9" text-anchor="end">16 m</text><line x1="8" x2="272" y1="${y(12)}" y2="${y(12)}" stroke="#555" stroke-dasharray="2 4"/><text x="274" y="${y(12) + 4}" fill="#888" font-size="9" text-anchor="end">12 m</text><polyline fill="none" stroke="${colour}" stroke-width="2" points="${xs.map((x, i) => `${x.toFixed(1)},${y(p[i]).toFixed(1)}`).join(' ')}"/></svg>`; };
    const panel = (which) => {
      const row = which === 'before' ? before : after;
      const head = which === 'before' ? 'BEFORE · today\'s tools: 8 grabs on the outer edge, each pulled to 16 m' : 'AFTER · Even width: the turn brought to 16.00 m, inner edge held';
      const line = `width over the turn ${row.w.min.toFixed(2)} to ${row.w.max.toFixed(2)} m · spread ${row.w.spread.toFixed(2)} m · outer edge spread ${row.outer.spread.toFixed(2)} m`;
      const tool = which === 'after' ? `<div style="margin-top:8px;padding:6px 8px;border:1px solid rgba(255,255,255,.18);border-radius:4px"><b>Even</b> &nbsp;width <span style="padding:1px 6px;border:1px solid #777;border-radius:3px">16.00 m</span> &nbsp;over the selected run (4 pieces) · ramps 30 m beyond each end · hold the inner edge ☑ &nbsp;<span style="padding:1px 8px;border:1px solid #aaa;border-radius:3px">Even it</span> &nbsp;<span style="color:#aaa">or pick the value from the road</span></div>` : '';
      return `const P = document.createElement('div'); P.id = 'a265mock'; P.style.cssText = 'position:fixed;right:16px;top:64px;z-index:50;width:330px;padding:10px 12px;background:rgba(18,18,22,.92);color:#eee;font:12px/1.45 system-ui,sans-serif;border:1px solid rgba(255,255,255,.2);border-radius:6px';
        P.innerHTML = ${JSON.stringify(`<div style="font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#e0b84a">mock · not built</div><div style="font-weight:600;margin:2px 0 6px">${head}</div>${chart(row, which === 'before' ? '#ff7a59' : '#58d68d')}<div style="margin-top:6px;color:#ccc">${line}</div>${tool}`)};
        document.body.appendChild(P); return true;`;
    };
    const imgs = {};
    for (const which of ['before', 'after']) {
      const added = await send('Page.addScriptToEvaluateOnNewDocument', { source: stand(which) }); mock.state.push({ which, standId: added.result && added.result.identifier });
      await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: baseUrl.replace('index.html', 'lib/cjs.js') }); await sleep(300);
      await ev('localStorage.clear(); return true;');
      await send('Page.navigate', { url: baseUrl });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
      mock.titles.push(await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title;"));
      mock.state.push({ which, restore: await ev("for (let i = 0; i < 25; i++) { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Restore it'); if (b) { b.click(); return 'restored'; } await new Promise((r) => setTimeout(r, 200)); } return 'no restore button';") });
      await sleep(1500);
      mock.state.push({ which, overhead: await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Overhead'); if (b) b.click(); await new Promise((r) => setTimeout(r, 1500)); return !!b;") });
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 890 }); await sleep(600);
      await ev(panel(which));
      await sleep(400);
      imgs[which] = await shot(`even_${which}.jpg`);
      // and nearer: three wheel notches in at the screen's centre
      for (let k = 0; k < 3; k++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 650, y: 450, deltaX: 0, deltaY: -240 }); await sleep(150); }
      await sleep(900); await shot(`even_${which}_near.jpg`);
      mock.titles.push(await ev('return document.title;'));
      if (added.result && added.result.identifier) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: added.result.identifier });   // the next look's stand-in only
    }
    // ONE LOOK: both, side by side, on one page
    await send('Page.navigate', { url: 'about:blank' }); await sleep(300);
    await ev(`document.title = 'zz-headless-test'; document.body.style.cssText = 'margin:0;background:#111;color:#eee;font:14px system-ui,sans-serif';
      document.body.innerHTML = '<div style="padding:8px 12px;font-weight:600">Sculpt ▸ Even, his turn: before and after <span style="color:#e0b84a;font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin-left:10px">mock · not built</span></div>'
        + '<div style="display:flex;gap:8px;padding:0 8px"><img style="width:740px" src="data:image/jpeg;base64,${imgs.before}"><img style="width:740px" src="data:image/jpeg;base64,${imgs.after}"></div>';
      return true;`);
    await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 510, deviceScaleFactor: 1, mobile: false }); await sleep(600);
    await shot('even_before_after.jpg');
    mock.titles.push(await ev('return document.title;'));
  } catch (e) { mock.fatal = String(e && e.message || e); }
  finally { try { ws && ws.close(); } catch (e) { /* */ } try { ch && ch.kill(); } catch (e) { /* */ } await sleep(800); try { dir && fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { mock.profileLeft = dir; } srv.close(); }
  fs.writeFileSync(path.join(OUT, 'even265.json'), JSON.stringify({ ...out, scuffed: undefined, levelled: undefined }, null, 1));
  console.log('mock', JSON.stringify(mock));
})();
