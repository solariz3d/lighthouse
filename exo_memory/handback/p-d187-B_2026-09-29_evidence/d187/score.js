// score.js (pane B; L130-R on L, re-created on D for D187 from B's own session record, with run 2's fixes merged): score the readout
// against E's seal (readout_check_registration_2026-09-29.md, sha256 57448e2a…, on L; its thresholds as B holds them) in the REAL app
// window, launched OFF-SCREEN, captured with scripts/prove_render.ps1 (PrintWindow, the app's own window only). A's numbers are computed
// HERE, in node, from src/core/readout.js on a document built from the same field strings the page was given. What the page DISPLAYS is
// read from the DOM text and the drawn boxes' rectangles, and from the capture's pixels.
//   node score.js --exe <exe> --wt <worktree> --out <folder> [--quick]   (--quick: controls + M4/M5 on track 0 only)
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const exe = arg('--exe'), WT = path.resolve(arg('--wt')), out = path.resolve(arg('--out')), QUICK = process.argv.includes('--quick');
const PR = require(path.join(WT, 'scripts', 'prove_render.js'));
const D = require(path.join(WT, 'src/core/document.js')), X = require(path.join(WT, 'src/core/extend.js')), RD = require(path.join(WT, 'src/core/readout.js'));
const PANEL = require(path.join(WT, 'app/core/panel.js')), MATH = require(path.join(WT, 'app/camera/math.js')), H = require(path.join(WT, 'test/core_helpers.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEG = Math.PI / 180, J = JSON.stringify;
fs.mkdirSync(out, { recursive: true });
const log = (...a) => { const s = a.map((x) => (typeof x === 'string' ? x : J(x))).join(' '); fs.appendFileSync(path.join(out, 'score.log'), s + '\n'); console.log(s); };

// ── A's numbers, in node ──
const MINUS = '−';
const parseNum = (s) => { const m = /^([+−-]?)(\d+\.\d)\s?(m|°)$/.exec(String(s).trim()); if (!m) return null; const v = Number(m[2]); return { v: m[1] === MINUS || m[1] === '-' ? -v : v, sign: m[1], unit: m[3], text: s }; };
const fieldsToOpts = (f) => PANEL.extendOptions(f);
const aCand = (doc, f) => { const r = RD.candidateReadout(doc, fieldsToOpts(f)); return { length: r.lengthM, turn: r.turnDeg, climb: r.climbDeg, bank: r.bankToDeg - r.bankFromDeg }; };
const aPiece = (doc, i) => { const r = RD.pieceReadout(doc, i); return { length: r.lengthM, turn: r.turnDeg, climb: r.climbDeg, bank: r.bankToDeg - r.bankFromDeg, type: r.type, id: r.id }; };
function cmp(text, a, unit) {
  const p = parseNum(text); const bad = [];
  if (!p) return { ok: false, text, a, bad: ['unparsable or no unit'] };
  if (p.unit !== unit) bad.push(`unit ${p.unit} not ${unit}`);
  if (Math.abs(p.v - a) > 0.05 + 1e-9) bad.push(`off by ${(p.v - a).toFixed(4)}`);
  if (unit === '°') { if (p.v === 0 && p.sign) bad.push('0.0 carries a sign'); if (p.v !== 0 && !p.sign) bad.push('no sign'); if (p.v !== 0 && Math.sign(p.v) !== Math.sign(a)) bad.push('sign flipped'); }
  return { ok: bad.length === 0, text, a: +a.toFixed(6), bad };
}
function cmpSet(disp, a) { return { length: cmp(disp.length, a.length, 'm'), turn: cmp(disp.turn, a.turn, '°'), climb: cmp(disp.climb, a.climb, '°'), bank: cmp(disp.bank, a.bank, '°') }; }
const allOk = (c) => Object.values(c).every((x) => x.ok);
const labelParts = (text) => { const [l1, l2] = String(text).split('\n'); const m = /^turn (\S+) · climb (\S+) · bank (\S+)$/.exec(l2 || ''); return m ? { length: l1, turn: m[1], climb: m[2], bank: m[3] } : null; };

// the fixtures (the seal §1)
const TRACKS = H.gen().slice(0, 5);
const pieceFields = (p) => ({ length: String(p.length), turn: String(p.kh[1] * 100 / DEG), climb: String(p.kv[1] * 100 / DEG), bank: String(p.bank[1] / DEG), width: String(p.width[1]) });
const E_SETS = [[100, 0, 0, 0], [150, 90, 0, 0], [150, -90, 0, 0], [400, 180, 0, 30], [60, 45, 8, -15], [20, 5, 0, 0], [2000, 720, 0, 0], [300, 0, -12, 0], [300, 0.04, 0, 0], [300, 0.06, 0, 0], [250, -33.35, 2.25, 12.45], [180, 60, 0, 89]];
function fieldsFor(doc, [L, dT, dC, dB]) {
  const base = { length: String(L), turn: '0', climb: '0', bank: '0', width: '' };
  const at = (k, v) => aCand(doc, { ...base, [k]: String(v) });
  const solve = (k, want) => { const a0 = at(k, 0)[k], a1 = at(k, 1)[k]; return (want - a0) / (a1 - a0); };
  const bank0 = RD.candidateReadout(doc, fieldsToOpts(base)).bankFromDeg;
  return { length: String(L), turn: String(solve('turn', dT)), climb: String(solve('climb', dC)), bank: String(bank0 + dB), width: '' };
}
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
/** S: 30 single-field edits from mulberry32(130): the field ⌊4r⌋, then a value uniform in length [20, 2000], turn [−120, 120] °/100m,
 *  climb [−10, 10] °/100m, bank [−15, 89] °, to 0.01 (B's ranges, stated on L before its run 1). */
function editsS() {
  const r = mulberry32(130), F = ['length', 'turn', 'climb', 'bank'], R = { length: [20, 2000], turn: [-120, 120], climb: [-10, 10], bank: [-15, 89] };
  return Array.from({ length: 30 }, () => { const f = F[Math.floor(r() * 4)], [a, b] = R[f]; return { field: f, value: (a + (b - a) * r()).toFixed(2) }; });
}

// ── PNG ──
function readPng(file) {
  const b = fs.readFileSync(file); let o = 8, w = 0, h = 0, ct = 0; const idat = [];
  while (o < b.length) { const n = b.readUInt32BE(o), t = b.toString('ascii', o + 4, o + 8), d = b.subarray(o + 8, o + 8 + n); if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8) throw new Error('png: not 8-bit'); } else if (t === 'IDAT') idat.push(d); o += 12 + n; }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : null; if (!bpp) throw new Error(`png: colour type ${ct}`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(w * h * bpp), stride = w * bpp;
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), row = px.subarray(y * stride, (y + 1) * stride), up = y ? px.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? row[i - bpp] : 0, c = up ? up[i] : 0, u = i >= bpp && up ? up[i - bpp] : 0, x = src[i];
      row[i] = f === 0 ? x : f === 1 ? x + a : f === 2 ? x + c : f === 3 ? x + ((a + c) >> 1) : x + (() => { const p = a + c - u, pa = Math.abs(p - a), pb = Math.abs(p - c), pc = Math.abs(p - u); return pa <= pb && pa <= pc ? a : pb <= pc ? c : u; })();
    }
  }
  return { w, h, bpp, at: (x, y) => { const i = (y * w + x) * bpp; return [px[i], px[i + 1], px[i + 2]]; } };
}
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const contrast = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
const median = (arr) => { const s = arr.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
/** The seal's M5 (a) and (b) inside one rect (device px): background = the rect's median pixel per channel; ink = every pixel more than 12
 *  (sum |dRGB|) from it; ink HEIGHT = the tallest run of consecutive rows holding ink; contrast = median ink vs background. */
function inkOf(img, r, inset = 0) {
  const x0 = Math.max(0, Math.round(r.x + inset)), y0 = Math.max(0, Math.round(r.y + inset)), x1 = Math.min(img.w, Math.round(r.x + r.w - inset)), y1 = Math.min(img.h, Math.round(r.y + r.h - inset));
  const all = [[], [], []]; for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const p = img.at(x, y); all[0].push(p[0]); all[1].push(p[1]); all[2].push(p[2]); }
  if (!all[0].length) return { bg: null, ink: null, inkPixels: 0, inkHeight: 0, contrast: 0, diag: null };
  const bg = all.map(median), ink = [[], [], []], rows = [];
  for (let y = y0; y < y1; y++) { let any = false; for (let x = x0; x < x1; x++) { const p = img.at(x, y); if (Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 12) { any = true; ink[0].push(p[0]); ink[1].push(p[1]); ink[2].push(p[2]); } } rows.push(any); }
  let best = 0, run = 0; for (const a of rows) { run = a ? run + 1 : 0; best = Math.max(best, run); }
  const inkMed = ink[0].length ? ink.map(median) : null;
  // DIAGNOSTIC, NOT THE SEAL'S MEASURE: the pixels brighter than half white (the text), their median against the rect's median
  const txt = [[], [], []], trows = [];
  for (let y = y0; y < y1; y++) { let any = false; for (let x = x0; x < x1; x++) { const p = img.at(x, y); if (lum(p) > 0.5) { any = true; txt[0].push(p[0]); txt[1].push(p[1]); txt[2].push(p[2]); } } trows.push(any); }
  let tb = 0, tr = 0; for (const a of trows) { tr = a ? tr + 1 : 0; tb = Math.max(tb, tr); }
  const txtMed = txt[0].length ? txt.map(median) : null;
  return { bg, ink: inkMed, inkPixels: ink[0].length, inkHeight: best, contrast: inkMed ? contrast(inkMed, bg) : 0, diag: { brightHeight: tb, brightContrast: txtMed ? +contrast(txtMed, bg).toFixed(2) : 0 } };
}

// ── the window ──
function ps(script) { const r = spawnSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf8', timeout: 60000 }); return (r.stdout || '').trim() + (r.stderr ? ` ERR ${r.stderr.trim()}` : ''); }
function offScreen(pid) {
  return ps(`Add-Type @"
using System; using System.Runtime.InteropServices;
public static class OS { public delegate bool EnumProc(IntPtr h, IntPtr l);
 [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
 [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
 [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
 [DllImport("user32.dll")] public static extern IntPtr GetWindow(IntPtr h, uint c);
 [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);
 [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
 [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
 public static string Move(uint want) { IntPtr found = IntPtr.Zero;
  EnumWindows((h, l) => { uint p; GetWindowThreadProcessId(h, out p); if (p == want && IsWindowVisible(h) && GetWindow(h, 4) == IntPtr.Zero) { found = h; return false; } return true; }, IntPtr.Zero);
  if (found == IntPtr.Zero) return "none"; SetWindowPos(found, IntPtr.Zero, -12000, -12000, 0, 0, 0x0001 | 0x0004 | 0x0010);
  RECT r; GetWindowRect(found, out r); return r.L + "," + r.T + "," + (r.R - r.L) + "x" + (r.B - r.T); } }
"@
[OS]::Move([uint32]${pid})`);
}
async function cdpConnect(port, deadline, onEvent) {
  let page = null;
  while (!page && Date.now() < deadline) { try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = list.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch { /* not up */ } if (!page) await sleep(300); }
  if (!page) throw new Error(`no app page on port ${port}`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('DevTools websocket failed')); });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } else if (d.method && onEvent) onEvent(d); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(J({ id: i, method, params })); });
  const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(`page: ${r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text}`); return r.result.value; };
  return { send, evaluate, close: () => ws.close() };
}
async function until(fn, what, ms = 30000) { const end = Date.now() + ms; while (Date.now() < end) { const v = await fn(); if (v) return v; await sleep(250); } throw new Error(`timed out waiting for ${what}`); }

(async () => {
  const port = await PR.freePort();
  const dataDir = path.join(process.env.APPDATA, JSON.parse(fs.readFileSync(path.join(WT, 'src-tauri', 'tauri.conf.json'), 'utf8')).identifier);
  const restore = PR.guardAutosave(dataDir, out);
  const flags = `--remote-debugging-port=${port} --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`;
  const app = spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: flags, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(out) }, stdio: 'ignore' });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  const hard = setTimeout(() => { kill(); console.error('hard timeout: killed', app.pid); process.exit(2); }, 1500000);
  const R = { pid: app.pid, port, exceptions: [], controls: {}, M: {} };
  try {
    R.window = await until(async () => { const r = offScreen(app.pid); return r.startsWith('none') ? null : r; }, 'the app window', 60000);
    log('window', R.window);
    const cdp = await cdpConnect(port, Date.now() + 60000, (d) => { if (d.method === 'Runtime.exceptionThrown') R.exceptions.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text); if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') R.exceptions.push('console.error: ' + d.params.args.map((a) => a.value || a.description).join(' ')); });
    const owner = PR.portOwner(port, app.pid); if (!owner.ours) throw new Error(`port ${port} is held by pid ${owner.pid}, not the app`);
    await cdp.send('Runtime.enable');
    await until(async () => cdp.evaluate(`!!document.querySelector('#preview canvas') && [...document.querySelectorAll('#palette h3')].some((h) => h.textContent === 'Equation track')`), 'the equation builder');
    R.geo = await cdp.evaluate(`({ innerW: innerWidth, innerH: innerHeight, dpr: devicePixelRatio })`); log('geo', R.geo);

    const FIELD = { length: 'length m', turn: 'turn °/100m', climb: 'climb °/100m', bank: 'bank °', width: 'width m' };
    const setFields = (f) => cdp.evaluate(`(() => { for (const [k, v] of ${J(Object.entries(f).map(([k, v]) => [FIELD[k], v]))}) { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === k); const i = l.querySelector('input,select'); i.value = v; i.dispatchEvent(new Event('input')); }
      return Object.fromEntries([...document.querySelectorAll('[data-readout]')].map((e) => [e.getAttribute('data-readout'), e.textContent])); })()`);
    const clickBtn = (text) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${J(text)}); if (!b) return false; b.click(); return true; })()`);
    const pieceCount = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => res(t && t.segments ? new Set(t.segments.map((g) => g.id)).size : 0) } })); setTimeout(() => res(-1), 1000); })`);
    const extendWith = async (f) => { const n0 = await pieceCount(); await setFields(f); if (!(await clickBtn('Extend'))) throw new Error('no Extend button'); await until(async () => (await pieceCount()) === n0 + 1, 'the piece to be placed', 10000); };
    const labelsNow = () => cdp.evaluate(`(() => { const layer = document.querySelector('[aria-label="piece readouts"]'), st = document.getElementById('preview').getBoundingClientRect();
      const dom = layer ? [...layer.children].filter((e) => e.style.display !== 'none' && e.isConnected && getComputedStyle(e).display !== 'none' && layer.style.display !== 'none').map((e) => { const q = e.getBoundingClientRect(); return { text: e.textContent, rect: { x: q.left - st.left, y: q.top - st.top, w: q.width, h: q.height } }; }) : [];
      return new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:labels', { detail: { reply: (r) => res({ dom, reported: r, preview: [st.left, st.top, st.width, st.height] }) } })); setTimeout(() => res({ dom, reported: null, preview: [st.left, st.top, st.width, st.height] }), 1000); }); })()`);
    const view = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: res } })); setTimeout(() => res(null), 1000); })`);
    const setMode = async (m) => { await cdp.evaluate(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: ${J(m)} } }))`); await until(async () => { const v = await view(); return v && v.mode === m; }, `mode ${m}`, 5000); };
    const canvasAt = () => cdp.evaluate(`(() => { const q = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const wheel = async (dy, n) => { const c = await canvasAt(); for (let i = 0; i < n; i++) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: dy, modifiers: 8 }); };
    const settle = async () => { let prev = null; for (let i = 0; i < 60; i++) { await sleep(150); const v = await view(); const k = v && v.pose ? J(v.pose.eye.map((x) => +x.toFixed(4))) : null; if (k && k === prev) return v; prev = k; } return view(); };
    const trackNow = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => res(t && t.path ? { samples: t.path.samples.map((m) => ({ s: m.s, pos: m.pos, U: m.U })) } : null) } })); setTimeout(() => res(null), 2000); })`);
    const probeNow = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180-probe', { detail: { reply: res } })); setTimeout(() => res(null), 2000); })`);
    const shoot = async (name, rectDev) => {
      await sleep(800);
      const file = path.join(out, `${name}.png`), args = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(WT, 'scripts', 'prove_render.ps1'), '-ProcId', String(app.pid), '-Out', file];
      if (rectDev) args.push('-Rect', rectDev.map(Math.round).join(','));
      const r = spawnSync('powershell', args, { encoding: 'utf8', timeout: 60000 });
      let cap; try { cap = JSON.parse(r.stdout.trim().split('\n').pop()); } catch { cap = { ok: false, reason: r.stderr || r.stdout }; }
      if (cap.ok && cap.title !== 'T-180 Track Builder') { fs.rmSync(file, { force: true }); cap = { ok: false, reason: `captured "${cap.title}"; deleted` }; }
      return { file: cap.ok ? file : null, cap };
    };
    const headScreen = (v, pv) => { if (!v || !v.head) return null; const W = pv[2], Hh = pv[3], VP = MATH.viewProj(v.pose, W / Hh), c = MATH.apply(VP, v.head.pos); return c[3] > 0 ? { x: (c[0] / c[3] * 0.5 + 0.5) * W, y: (1 - (c[1] / c[3] * 0.5 + 0.5)) * Hh, onScreen: Math.abs(c[0] / c[3]) <= 1 && Math.abs(c[1] / c[3]) <= 1 } : null; };
    const hitsBox = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

    // ── track 0's first 3 pieces ──
    let docN = D.createDoc('untitled');
    const T0 = TRACKS[0].pieces.map(pieceFields);
    for (const f of T0.slice(0, 3)) { await extendWith(f); docN = X.extend(docN, fieldsToOpts(f)); }
    log('placed 3 pieces of track 0');
    const ESETS = E_SETS.map((e) => fieldsFor(docN, e));
    const S = editsS();
    async function runM2(start) {
      await setFields(start); let cur = { ...start }; const steps = [];
      for (const e of S) { cur = { ...cur, [e.field]: e.value }; const disp = await setFields({ [e.field]: e.value }); const a = aCand(docN, cur), c = cmpSet(disp, a); steps.push({ edit: e, disp, ok: allOk(c), bad: Object.entries(c).filter(([, x]) => !x.ok).map(([k, x]) => `${k}: ${x.text} vs ${x.a} ${x.bad.join(',')}`) }); }
      return { steps, fails: steps.filter((s) => !s.ok).length };
    }
    async function runM1E() {
      const rows = [];
      for (let i = 0; i < ESETS.length; i++) { const disp = await setFields(ESETS[i]); const a = aCand(docN, ESETS[i]), c = cmpSet(disp, a); rows.push({ e: i + 1, fields: ESETS[i], disp, a, ok: allOk(c), bad: Object.entries(c).filter(([, x]) => !x.ok).map(([k, x]) => `${k}: ${x.text} vs ${x.a} ${x.bad.join(',')}`) }); }
      return rows;
    }

    // ── CONTROLS K1, K2: planted on EACH input (the driver's input events do not bubble; run 1 on L listened on #palette and never fired) ──
    await cdp.evaluate(`(() => { const cells = () => [...document.querySelectorAll('[data-readout]')]; let prev = cells().map((e) => e.textContent);
      window.__bK1 = () => { const now = cells().map((e) => e.textContent); cells().forEach((e, i) => { e.textContent = prev[i]; }); prev = now; };
      document.querySelectorAll('#palette input').forEach((i) => i.addEventListener('input', window.__bK1)); return true; })()`);
    const k1 = await runM2(ESETS[0]);
    await cdp.evaluate(`(document.querySelectorAll('#palette input').forEach((i) => i.removeEventListener('input', window.__bK1)), delete window.__bK1, true)`);
    R.controls.K1 = { failsOf30: k1.fails, caught: k1.fails >= 25 }; log('K1', R.controls.K1);
    await cdp.evaluate(`(() => { window.__bK2 = () => { const e = document.querySelector('[data-readout="turn"]'); const t = e.textContent; e.textContent = t.startsWith('+') ? '−' + t.slice(1) : t.startsWith('−') ? '+' + t.slice(1) : t; };
      document.querySelectorAll('#palette input').forEach((i) => i.addEventListener('input', window.__bK2)); return true; })()`);
    const k2 = await runM1E();
    await cdp.evaluate(`(document.querySelectorAll('#palette input').forEach((i) => i.removeEventListener('input', window.__bK2)), delete window.__bK2, true)`);
    R.controls.K2 = { failingSets: k2.filter((r) => !r.ok).map((r) => r.e), caught: k2.some((r) => !r.ok) }; log('K2', R.controls.K2);

    if (!QUICK) {
      const m1e = await runM1E(); R.M.M1_E = m1e;
      log('M1 E SUMMARY', { ok: m1e.filter((r) => r.ok).length, of: m1e.length, e7turn: m1e[6].disp.turn, e9turn: m1e[8].disp.turn, e10turn: m1e[9].disp.turn, e11: m1e[10].disp, e11a: m1e[10].a, bad: m1e.filter((r) => !r.ok) });
      const m3 = [];
      for (let i = 0; i < ESETS.length; i++) {
        const ghost = await setFields(ESETS[i]); await sleep(100);
        const n0 = await pieceCount(); await clickBtn('Extend'); await until(async () => (await pieceCount()) === n0 + 1, 'placed', 10000);
        const d1 = X.extend(docN, fieldsToOpts(ESETS[i])), id = d1.pieces[d1.pieces.length - 1].id;
        let lab = null; for (let t = 0; t < 20 && !lab; t++) { await sleep(150); const L = await labelsNow(); const rep = L.reported && L.reported.drawn.find((d) => d.piece === id); if (rep && L.dom.some((d) => d.text === rep.text)) lab = rep; }
        const parts = lab ? labelParts(lab.text) : null;
        const same = parts ? ['length', 'turn', 'bank'].every((k) => parts[k] === ghost[k]) : false;
        m3.push({ e: i + 1, id, ghost, label: lab && lab.text, same, climbToo: parts ? parts.climb === ghost.climb : null });
        await clickBtn('Undo'); await until(async () => (await pieceCount()) === n0, 'undone', 10000);
      }
      R.M.M3 = m3; log('M3 SUMMARY', { same: m3.filter((r) => r.same).length, of: m3.length, climbAlsoSame: m3.filter((r) => r.climbToo).length, bad: m3.filter((r) => !r.same) });
      const m2 = await runM2(ESETS[0]); R.M.M2 = m2; log('M2', { fails: m2.fails, bad: m2.steps.filter((s) => !s.ok) });
    }

    // ── the rest of track 0; E4's ghost on it ──
    for (const f of T0.slice(3)) { await extendWith(f); docN = X.extend(docN, fieldsToOpts(f)); }
    const E4 = fieldsFor(docN, E_SETS[3]); const e4disp = await setFields(E4); R.E4 = { fields: E4, disp: e4disp, a: aCand(docN, E4) }; log('E4 on track 0', R.E4);
    const headId = docN.pieces[docN.pieces.length - 1].id;

    // ── K3, K4, K5 (planted by a stylesheet in build at zoom 1, removed after) ──
    await setMode('build'); let v = await settle(); let L = await labelsNow(); let hs = headScreen(v, L.preview);
    const plant = (css) => cdp.evaluate(`(() => { const s = document.createElement('style'); s.id = '__bplant'; s.textContent = ${J(css)}; document.head.append(s); return true; })()`);
    const unplant = () => cdp.evaluate(`(() => { const s = document.getElementById('__bplant'); if (s) s.remove(); return true; })()`);
    const M4geo = (Lx, hsx) => { if (!hsx) return { head: null, overlaps: [] }; const box = { x: hsx.x - 6, y: hsx.y - 6, w: 12, h: 12 }; return { head: hsx, overlaps: Lx.dom.filter((d) => hitsBox(box, d.rect)).map((d) => d.text.split('\n')[0]) }; };
    if (L.dom.length && hs) {
      const d0 = L.dom[0];
      await plant(`[aria-label="piece readouts"] > div:first-child { left: ${Math.round(hs.x - d0.rect.w / 2)}px !important; top: ${Math.round(hs.y - d0.rect.h / 2)}px !important; }`);
      await sleep(400); const Lk = await labelsNow(); const g = M4geo(Lk, hs); await unplant();
      R.controls.K3 = { overlaps: g.overlaps.length, caught: g.overlaps.length > 0 };
    } else R.controls.K3 = { caught: false, note: 'no label drawn in build at zoom 1' };
    log('K3', R.controls.K3);
    const measureLabels = async (name, extraRect) => {
      const Lm = await labelsNow(), shot = await shoot(name, extraRect), dpr = R.geo.dpr;
      if (!shot.file) return { shot: shot.cap, labels: [] };
      const img = readPng(shot.file), cx = shot.cap.clientX, cy = shot.cap.clientY, pv = Lm.preview;
      const dev = (r) => ({ x: cx + (pv[0] + r.x) * dpr, y: cy + (pv[1] + r.y) * dpr, w: r.w * dpr, h: r.h * dpr });
      const labels = Lm.dom.map((d) => ({ text: d.text, rect: d.rect, ...inkOf(img, dev(d.rect), 3) }));
      return { shot: shot.cap, file: shot.file, labels, Lm, img, dev };
    };
    await plant(`[aria-label="piece readouts"] > div { font-size: 6px !important; }`); await sleep(500);
    const k4 = await measureLabels('K4-build-z1'); await unplant();
    R.controls.K4 = { inkHeights: k4.labels.map((x) => x.inkHeight), caught: k4.labels.some((x) => x.inkHeight < 11) }; log('K4', R.controls.K4);
    await plant(`[aria-label="piece readouts"] > div { color: rgb(20,22,26) !important; }`); await sleep(500);
    const k5 = await measureLabels('K5-build-z1'); await unplant();
    R.controls.K5 = { contrasts: k5.labels.map((x) => +x.contrast.toFixed(2)), caught: k5.labels.some((x) => x.contrast < 4.5) }; log('K5', R.controls.K5);
    // K6 (added on D): the base's see-through box planted back into the fixed display, which M5 (b) must catch
    await plant(`[aria-label="piece readouts"] > div { background: rgba(10,12,16,0.94) !important; box-shadow: none !important; border: 1px solid #3a4250 !important; }`); await sleep(500);
    const k6 = await measureLabels('K6-build-z1'); await unplant();
    R.controls.K6 = { contrasts: k6.labels.map((x) => +x.contrast.toFixed(2)), caught: k6.labels.some((x) => x.contrast < 4.5) }; log('K6', R.controls.K6);

    // ── M4 and M5: every mode × zoom, the zoom READ BACK from the camera's pose ──
    const samples = (await trackNow()).samples;
    const chaseHeight = (e) => { let best = null; for (const m of samples) { const d = [e[0] - m.pos[0], e[1] - m.pos[1], e[2] - m.pos[2]], hgt = d[0] * m.U[0] + d[1] * m.U[1] + d[2] * m.U[2]; if (!(hgt > 0)) continue; const off = Math.hypot(d[0] - hgt * m.U[0], d[1] - hgt * m.U[1], d[2] - hgt * m.U[2]); if (!best || off < best.off) best = { off, hgt }; } return best ? best.hgt : NaN; };
    const distOf = (mode, vv, pb) => { const e = vv.pose.eye, h = vv.head.pos; if (mode === 'overhead') return e[1] - pb.bounds.max[1]; if (mode === 'chase') return chaseHeight(e); return Math.hypot(e[0] - h[0], e[1] - h[1], e[2] - h[2]); };
    const panelRects = () => cdp.evaluate(`[...document.querySelectorAll('[data-readout]')].map((e) => { const q = e.getBoundingClientRect(); return { k: e.getAttribute('data-readout'), text: e.textContent, x: q.left - 4, y: q.top - 4, w: q.width + 8, h: q.height + 8 }; })`);
    R.M.M45 = [];
    for (const mode of ['build', 'overhead', 'side', 'chase', 'free']) {
      await setMode(mode); let base = null;
      for (const [zname, wheelDy, n] of [['z1', 0, 0], ['z0.05', -100, 6], ['z50', 100, 16]]) {
        if (n) await wheel(wheelDy, n);
        const vv = await settle(); const pb = await probeNow(); const d = distOf(mode, vv, pb); if (zname === 'z1') base = d;
        const zoomRead = mode === 'free' ? null : d / base;
        const Lm = await labelsNow(); const hsm = headScreen(vv, Lm.preview), geo = M4geo(Lm, hsm && hsm.onScreen ? hsm : null);
        const hsDev = hsm && hsm.onScreen ? [(Lm.preview[0] + hsm.x) * R.geo.dpr - 7.5, (Lm.preview[1] + hsm.y) * R.geo.dpr - 7.5, 15, 15] : null;
        const m = await measureLabels(`${mode}-${zname}`, zname === 'z1' ? hsDev : null);
        const pr = await panelRects(); const panel = m.img ? pr.map((q) => ({ k: q.k, text: q.text, ...inkOf(m.img, { x: m.shot.clientX + q.x * R.geo.dpr, y: m.shot.clientY + q.y * R.geo.dpr, w: q.w * R.geo.dpr, h: q.h * R.geo.dpr }) })) : [];
        let pix = null;
        if (zname === 'z1' && hsDev) {
          await cdp.evaluate(`(() => { const l = document.querySelector('[aria-label="piece readouts"]'); l.style.display = 'none'; return true; })()`);
          const off = await shoot(`${mode}-${zname}-labels-off`, hsDev);
          await cdp.evaluate(`(() => { const l = document.querySelector('[aria-label="piece readouts"]'); l.style.display = ''; return true; })()`);
          pix = { on: m.shot.drawn, off: off.cap.drawn, share: off.cap.drawn ? m.shot.drawn / off.cap.drawn : null };
        }
        const rects = Lm.dom.map((x) => x.rect); let pairs = 0; for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) if (hitsBox(rects[i], rects[j])) pairs++;
        const headLabel = Lm.reported ? Lm.reported.drawn.some((x) => x.piece === headId) : false;
        const minOf = (arr) => (arr.length ? Math.min(...arr) : null);
        const row = { mode, zoom: zname, zoomRead: zoomRead === null ? 'n/a (free: the wheel dollies)' : +zoomRead.toFixed(4), headOnScreen: !!(hsm && hsm.onScreen), drawn: Lm.dom.length, culled: Lm.reported ? Lm.reported.culled.length : null, headLabel,
          m4: { overlaps: geo.overlaps, pixel: pix },
          m5: { labels: m.labels.map((x) => ({ first: x.text.split('\n')[0], inkHeight: x.inkHeight, contrast: +x.contrast.toFixed(2), diag: x.diag })), overlapPairs: pairs, panel: panel.map((q) => ({ k: q.k, text: q.text, inkHeight: q.inkHeight, contrast: +q.contrast.toFixed(2) })) },
          labelsText: Lm.reported ? Lm.reported.drawn.map((x) => ({ piece: x.piece, text: x.text })) : [], file: m.file && path.basename(m.file) };
        R.M.M45.push(row);
        log('M45', { mode, z: zname, zoomRead: row.zoomRead, headOn: row.headOnScreen, drawn: row.drawn, culled: row.culled, headLabel, overlaps: geo.overlaps.length, pixel: pix && `${pix.on}/${pix.off}`, minInk: minOf(m.labels.map((x) => x.inkHeight)), minC: minOf(m.labels.map((x) => x.contrast)), pairs, panelMinInk: minOf(panel.map((q) => q.inkHeight)), panelMinC: minOf(panel.map((q) => q.contrast)) });
      }
    }
    if (!QUICK) {
      const seen = new Map(); for (const row of R.M.M45) for (const l of row.labelsText) seen.set(l.piece, l.text);
      const m1p = [{ track: 0, pieces: docN.pieces.length, seen: seen.size, rows: [...seen].map(([id, t]) => { const i = docN.pieces.findIndex((P) => P.id === id), c = cmpSet(labelParts(t), aPiece(docN, i)); return { id, t, ok: allOk(c), bad: Object.entries(c).filter(([, x]) => !x.ok).map(([k, x]) => `${k}: ${x.text} vs ${x.a}`) }; }) }];
      for (let t = 1; t < 5; t++) {
        await clickBtn('New'); await until(async () => (await pieceCount()) === 0, 'a new document', 10000);
        let dt = D.createDoc('untitled'); for (const f of TRACKS[t].pieces.map(pieceFields)) { await extendWith(f); dt = X.extend(dt, fieldsToOpts(f)); }
        const seenT = new Map();
        for (const mode of ['overhead', 'build', 'side', 'chase']) { await setMode(mode); for (const [dy, n] of [[0, 0], [100, 16], [-100, 6]]) { if (n) await wheel(dy, n); await settle(); const Lm = await labelsNow(); if (Lm.reported) for (const x of Lm.reported.drawn) if (Lm.dom.some((d) => d.text === x.text)) seenT.set(x.piece, x.text); } }
        m1p.push({ track: t, pieces: dt.pieces.length, seen: seenT.size, rows: [...seenT].map(([id, tx]) => { const i = dt.pieces.findIndex((P) => P.id === id), c = cmpSet(labelParts(tx), aPiece(dt, i)); return { id, t: tx, ok: allOk(c), bad: Object.entries(c).filter(([, x]) => !x.ok).map(([k, x]) => `${k}: ${x.text} vs ${x.a}`) }; }) });
      }
      R.M.M1_P = m1p; log('M1 P', m1p.map((x) => ({ track: x.track, pieces: x.pieces, labelled: x.seen, bad: x.rows.filter((r) => !r.ok) })));
    }
    await clickBtn('New'); await until(async () => (await pieceCount()) === 0, 'empty', 10000); await sleep(800);
    const Le = await labelsNow(); R.M.M6_empty = { drawn: Le.dom.length, reported: Le.reported && Le.reported.drawn.length, exceptionsSoFar: R.exceptions.length }; log('M6 empty', R.M.M6_empty);
    cdp.close();
  } catch (e) { R.error = e.stack || e.message; log('ERROR', R.error); } finally {
    clearTimeout(hard); kill(); R.autosave = restore();
    fs.writeFileSync(path.join(out, 'report.json'), J(R, null, 1));
    log('done', { error: R.error || null, exceptions: R.exceptions, autosave: R.autosave });
  }
})();
