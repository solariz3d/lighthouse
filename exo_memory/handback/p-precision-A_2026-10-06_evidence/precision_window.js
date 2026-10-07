// near_window.js <exe> <out folder>: the REAL-window check of D250 item 3 (length and width handles at the NEAR end), in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
// APP DATA FOLDER of its own (T180_TEST_APP_DATA). Real mouse input (CDP Input.dispatchMouseEvent). The keeper's folder is snapshotted before and after (read only).
// APP DATA FOLDER of its own (T180_TEST_APP_DATA: F2, the keeper's folder is never the run's). Real mouse clicks (CDP Input.dispatchMouseEvent) select the pieces on the track.
// The keeper's folder is snapshotted before and after (read only); the run refuses to start while any t180-track-builder.exe is running.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-precision-wt/';
const PR = require(W + 'scripts/prove_render.js'), CODE = require(W + 'src/doc/code.js'), D = require(W + 'src/core/document.js'), PC = require(W + 'src/core/piece.js'), { extend } = require(W + 'src/core/extend.js');
const [exe, outArg] = process.argv.slice(2);
const out = path.resolve(outArg), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(out, { recursive: true });
const keeperDir = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder');   // READ ONLY
const dataDir = path.join(out, 'appdata'); fs.rmSync(dataDir, { recursive: true, force: true }); fs.mkdirSync(dataDir, { recursive: true });
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
function snapshot(dir) { const m = {}; if (!fs.existsSync(dir)) return m; const walk = (d, rel) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name; if (e.isDirectory()) walk(p, r); else m[r] = sha(p); } }; walk(dir, ''); return m; }
const report = { exe: path.basename(exe), started: new Date().toISOString(), errors: [], console: [], checks: {} };
const running = spawnSync('tasklist', ['/FI', 'IMAGENAME eq t180-track-builder.exe', '/FO', 'CSV', '/NH'], { encoding: 'utf8' }).stdout || '';
const ours = spawnSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Name t180-track-builder -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq '${path.resolve(exe)}' } | Measure-Object).Count`], { encoding: 'utf8' }).stdout.trim();   // D251: only a copy of THIS exe blocks the run: the keeper's installed app may be open; the run has its own app data (T180_TEST_APP_DATA), profile and DevTools port
if (/t180-track-builder\.exe/i.test(running) && Number(ours) > 0) { console.error('refusing to run: a t180-track-builder.exe is already running (the keeper\'s app shares the app data folder unless T180_TEST_APP_DATA is set):\n' + running); process.exit(3); }
const stepLog = path.join(out, 'steps.log'); fs.writeFileSync(stepLog, '');
const step = (s) => fs.appendFileSync(stepLog, `${new Date().toISOString()} ${s}\n`);
const keeperBefore = snapshot(keeperDir);
const profile = PR.profileDir(out);

// the track under test: a straight, two turns, a straight, a short straight (open), as a share code
let doc = extend(D.createDoc('window pieces'), { length: 300, family: 'bowl' });
doc = extend(doc, { length: 150, transition: 60, targets: { kh: 1 / 180 } }); doc = extend(doc, { length: 150, transition: 60, targets: { kh: 1 / 180 } });
doc = extend(doc, { length: 100, transition: 60, targets: { kh: 0 } }); doc = extend(doc, { length: 80 });
const code = CODE.coreToCode(doc);

async function launch() {
  const port = await PR.freePort();
  const env = { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${port}`, WEBVIEW2_USER_DATA_FOLDER: profile, T180_TEST_APP_DATA: dataDir };
  const app = spawn(exe, [], { env, stdio: 'ignore', windowsHide: false });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  let page = null; const dl = Date.now() + 60000;
  while (!page && Date.now() < dl) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = l.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch (_) { /* not up yet */ } if (!page) await sleep(300); }
  if (!page) { kill(); throw new Error('no app page on our DevTools port'); }
  const owner = PR.portOwner(port, app.pid); if (!owner.ours) { kill(); throw new Error(`DevTools port held by pid ${owner.pid}, not ours`); }
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws')); });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
    if (d.method === 'Runtime.exceptionThrown') { const e = d.params.exceptionDetails; report.errors.push(((e.exception && e.exception.description) || e.text || '').split('\n').slice(0, 3).join(' | ').slice(0, 300)); }
    if (d.method === 'Runtime.consoleAPICalled' && /error|warning/.test(d.params.type)) report.console.push(`${d.params.type}: ` + d.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300)); };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(method + ': ' + d.error.message)) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { step(`ev ${expr.slice(0, 100).replace(/\s+/g, ' ')}`); const r = await Promise.race([send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }), sleep(30000).then(() => { throw new Error('evaluate did not answer in 30 s: ' + expr.slice(0, 90)); })]); if (r.exceptionDetails) throw new Error('page: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text)); return r.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  if (process.env.ONSCREEN !== '1') spawnSync('powershell', ['-NoProfile', '-Command', `Add-Type @"\nusing System; using System.Runtime.InteropServices;\npublic class W { [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f); [DllImport("user32.dll")] public static extern bool EnumWindows(EP f, IntPtr l); public delegate bool EP(IntPtr h, IntPtr l); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p); [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h); }\n"@\n$pid0=${app.pid}\n[W]::EnumWindows({ param($h,$l) $p=0; [void][W]::GetWindowThreadProcessId($h,[ref]$p); if ($p -eq $pid0 -and [W]::IsWindowVisible($h)) { [void][W]::SetWindowPos($h,[IntPtr]::Zero,-2600,60,1400,860,0x0014) }; $true }, [IntPtr]::Zero) | Out-Null`], { encoding: 'utf8', timeout: 30000 });
  const end = Date.now() + 40000;
  for (;;) { const r = await ev(`(() => ({ extend: [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Extend'), share: !!document.querySelector('#share textarea'), pieces: !!document.querySelector('[aria-label="saved pieces"]'), tauri: !!(window.__TAURI__ && window.__TAURI__.core) }))()`); if (r.extend && r.share && r.pieces && r.tauri) break; if (Date.now() > end) { kill(); throw new Error(`the page did not come up ${JSON.stringify(r)}`); } await sleep(300); }
  await sleep(800);
  return { app, ev, send, kill, close: () => ws.close() };
}
const click = (sel, text) => `(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => x.textContent.trim() === ${JSON.stringify(text)}); if (!b) throw new Error('no button ${text}'); if (b.disabled) return 'disabled'; b.click(); return 'clicked'; })()`;
const textOf = (aria) => `(() => { const e = document.querySelector('[aria-label=${JSON.stringify(aria)}]'); return e ? e.textContent : null; })()`;
const paste = (c) => `(async () => { const t = document.querySelector('#share textarea'); t.value = ${JSON.stringify(c)}; const b = [...document.querySelectorAll('#share button')].find((x) => x.textContent === 'Paste code'); await b.onclick(); return document.querySelector('#share .t-share-note').textContent; })()`;
const status = `(() => ({ status: document.getElementById('status').textContent, info: (document.querySelector('#palette p.head') || {}).textContent, msg: [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | ') }))()`;
const rowsJs = `(() => [...document.querySelectorAll('[data-piece]')].map((r) => r.textContent))()`;

const click0 = click;








// ───────── D244 / D244b: the drag handles and Sculpt in the REAL window (our debug build, its own app data) ─────────
const sleepMs = sleep;
(async () => {
  let A = null, cleaned = false;
  const cleanup = () => {
    if (cleaned) return; cleaned = true;
    const keeperAfter = snapshot(keeperDir), kk = new Set([...Object.keys(keeperBefore), ...Object.keys(keeperAfter)]);
    report.keeperFiles = Object.keys(keeperBefore).length; report.keeperChanged = [...kk].filter((x) => keeperBefore[x] !== keeperAfter[x]);
    report.runAppData = Object.keys(snapshot(dataDir)).sort(); report.ended = new Date().toISOString();
    fs.writeFileSync(path.join(out, 'window_report.json'), JSON.stringify(report, null, 1));
  };
  const hard = setTimeout(() => { if (A) A.kill(); report.error = 'hard timeout'; step('HARD TIMEOUT'); setTimeout(() => { cleanup(); console.error('hard timeout, cleaned up'); process.exit(2); }, 2000); }, 420000);
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 600)}`); return true; } });
  try {
    A = await launch();
    const shot = async (name) => { const r = await A.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.data, 'base64')); return name; };
    const mouse = (type, x, y, o = {}) => A.send('Input.dispatchMouseEvent', { type, x, y, button: o.button || 'none', buttons: o.buttons || 0, clickCount: o.clickCount || 0, modifiers: o.mods || 0 });
    const drag = async (x0, y0, x1, y1, mods = 0, steps = 6) => {
      await mouse('mouseMoved', x0, y0, { mods }); await mouse('mousePressed', x0, y0, { button: 'left', buttons: 1, clickCount: 1, mods });
      for (let i = 1; i <= steps; i++) { await mouse('mouseMoved', x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps, { button: 'left', buttons: 1, mods }); await sleep(35); }
      await sleep(80); await mouse('mouseReleased', x1, y1, { button: 'left', buttons: 0, clickCount: 1, mods });
    };
    const click = async (x, y, mods = 0) => { await mouse('mouseMoved', x, y, { mods }); await mouse('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1, mods }); await mouse('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1, mods }); };
    const handlesNow = () => A.ev(`(() => { let h = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (l) => { h = l; } } })); const r = document.getElementById('preview').getBoundingClientRect(); return { left: r.left, top: r.top, w: r.width, h: r.height, list: h }; })()`);
    const fields = () => A.ev(`(() => { const out = {}; for (const l of document.querySelectorAll('#palette label.picker')) { const t = l.children[0].textContent.trim(), i = l.children[1]; if (i && i.tagName === 'INPUT' && i.type === 'number') out[t] = i.value; } return out; })()`);
    const infoNow = async () => (await A.ev(status)).info;
    const poseNow = () => A.ev(`(() => { let v = null; document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: (x) => { v = x; } } })); return v && v.pose ? { eye: v.pose.eye, target: v.pose.target } : null; })()`);
    const trackNow = () => A.ev(`(() => { let t = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => { t = x; } } })); if (!t) return null; return { ids: t.segments.map((g) => g.id), n: t.path.samples.length, seg: t.path.samples.map((m) => m.seg), pos: t.path.samples.map((m) => m.pos.map((v) => Math.round(v * 1e9) / 1e9)), roll: t.path.samples.map((m) => Math.round(m.roll * 1e9) / 1e9) }; })()`);
    const waitHandles = async (n, ms = 9000) => { const t0 = Date.now(); for (;;) { const h = await handlesNow(); if (h.list && h.list.length >= n) return h; if (Date.now() - t0 > ms) return h; await sleep(250); } };
    const find = (h, id) => h.list.find((x) => x.id === id);
    const page = (h, p) => ({ x: h.left + p.x, y: h.top + p.y });

    k.start = await A.ev(status); await sleep(1500);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'build' } }))`); await sleep(1200);
    for (let i = 0; i < 2; i++) { await A.ev(click0('button', 'Extend')); await sleep(1000); }
    const FIELD = { length: 'length m', width: 'width m', bank: 'bank °', cup: 'cup °', turn: 'turn °/100m', climb: 'climb °/100m' };
    const setField = async (kind, val) => { const r = await A.ev(`(() => { const l = [...document.querySelectorAll('#palette label.picker')].find((x) => x.children[0].textContent.trim() === ${JSON.stringify(FIELD[kind])}); const i = l.children[1]; i.value = ${JSON.stringify(String(val))}; i.dispatchEvent(new Event('input')); return i.value; })()`); await sleep(400); return r; };
    const fieldOf = async (kind) => (await fields())[FIELD[kind]];
    // press ON the handle, travel px along (sign: + the way a positive drag runs, - the other way) its own on-screen arrow, release; Shift = CDP modifier 8
    const dragPx = async (id, px, mods = 0, steps = 8) => {
      const H = await waitHandles(10), h = find(H, id); if (!h) throw new Error('no handle ' + id);
      const p0 = page(H, h), len = Math.hypot(h.dx, h.dy), ux = h.dx / len, uy = h.dy / len;
      await drag(p0.x, p0.y, p0.x + ux * px, p0.y + uy * px, mods, steps); await sleep(450);
      return { pxPerM: Math.round(len * 100) / 100 };
    };
    const dbl = async (id) => {
      const H = await waitHandles(10), h = find(H, id), p = page(H, h);
      await mouse('mouseMoved', p.x, p.y); await mouse('mousePressed', p.x, p.y, { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', p.x, p.y, { button: 'left', buttons: 0, clickCount: 1 });
      await mouse('mousePressed', p.x, p.y, { button: 'left', buttons: 1, clickCount: 2 }); await mouse('mouseReleased', p.x, p.y, { button: 'left', buttons: 0, clickCount: 2 }); await sleep(500);
    };
    k.infoBefore = await infoNow();
    // ── turn from 2 to EXACTLY 0, no Shift: 2 is 40 px of 0.05, so 40 px lands on it; 37 px is 0.15 short of it, inside the 6 px hold
    const trial = {};
    for (const [label, px, mods] of [['noShift_40px', -40, 0], ['noShift_37px', -37, 0], ['noShift_43px', -43, 0], ['noShift_30px_not_held', -30, 0]]) {
      await setField('turn', 2); const before = await fieldOf('turn'); const info = await dragPx('turn:1', px, mods); trial[label] = { before, after: await fieldOf('turn'), px, ...info };
    }
    // ── with Shift (a tenth: 0.005 a pixel): 2 to 0 is 400 px, done as one slow 400 px drag and as two 200 px drags; 397 px is inside the hold
    for (const [label, parts] of [['shift_400px_one_drag', [-400]], ['shift_397px_one_drag', [-397]], ['shift_2x200px', [-200, -200]], ['shift_103_7px_not_held', [-103.7]]]) {
      await setField('turn', 2); const before = await fieldOf('turn'); const infos = []; for (const px of parts) infos.push(await dragPx('turn:1', px, 8, 40)); trial[label] = { before, after: await fieldOf('turn'), parts, pxPerM: infos[0].pxPerM };
    }
    k.turnTo0 = trial; await shot('1_turn_to_0.png');
    // ── zoom independence: the same 20 px, in the Build view and again after the mouse wheel zoomed the camera OUT (the handles must stay reachable, so no overhead view: its guide card covers them)
    const zoom = {};
    for (const [label, wheel] of [['build', 0], ['zoomedOut', 700]]) {
      if (wheel) { const H0 = await waitHandles(10); for (let i = 0; i < 7; i++) { await A.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: H0.left + H0.w / 2, y: H0.top + H0.h / 2, deltaX: 0, deltaY: wheel / 7 }); await sleep(150); } await sleep(1200); }
      await setField('turn', 0); await setField('width', 31); await setField('length', 100);
      const t = await dragPx('turn:1', 20), w = await dragPx('width:1', -20), l = await dragPx('length:0', 20);
      zoom[label] = { turn: await fieldOf('turn'), width: await fieldOf('width'), length: await fieldOf('length'), pxPerMeter: { turn: t.pxPerM, width: w.pxPerM, length: l.pxPerM } };
    }
    k.zoom = zoom; await shot('1b_zoomed_out.png');
    // ── the double-click: turn to 0, bank to 0, length back to what it was before the drag
    const reset = {};
    await setField('turn', 2); await setField('bank', 6); await dbl('turn:1'); reset.turn = { from: 2, to: await fieldOf('turn') }; await dbl('bank:1'); reset.bank = { from: 6, to: await fieldOf('bank') };
    await setField('length', 100); await dragPx('length:0', 40); reset.length = { before: 100, dragged: await fieldOf('length') }; await dbl('length:0'); reset.length.afterDoubleClick = await fieldOf('length');
    await setField('width', 31); await dragPx('width:1', -50); reset.width = { before: 31, dragged: await fieldOf('width') }; await dbl('width:1'); reset.width.afterDoubleClick = await fieldOf('width');
    await setField('cup', 8); await dragPx('cup:1', 40); reset.cup = { before: 8, dragged: await fieldOf('cup') }; await dbl('cup:1'); reset.cup.afterDoubleClick = await fieldOf('cup');
    k.reset = reset; k.noDocumentEdit = k.infoBefore === (await infoNow());
    // ── the label while hovering (a screenshot) and while dragging (a screenshot with the pointer held)
    await setField('turn', 2); { const H = await waitHandles(10), h = find(H, 'turn:1'), p = page(H, h); await mouse('mouseMoved', p.x, p.y); await sleep(500); await shot('2_hover_turn.png');
      const len = Math.hypot(h.dx, h.dy), ux = h.dx / len, uy = h.dy / len; await mouse('mousePressed', p.x, p.y, { button: 'left', buttons: 1, clickCount: 1 }); for (let i = 1; i <= 8; i++) { await mouse('mouseMoved', p.x - ux * 5 * i, p.y - uy * 5 * i, { button: 'left', buttons: 1 }); await sleep(40); } await sleep(300); await shot('3_dragging_turn.png'); k.fieldWhileDragging = await fieldOf('turn');
      await mouse('mouseReleased', p.x - ux * 40, p.y - uy * 40, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(400); }
    await shot('4_end.png');
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('handles_window: ' + e.message); process.exit(1); });
