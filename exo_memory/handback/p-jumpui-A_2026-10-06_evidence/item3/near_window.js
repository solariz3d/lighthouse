// near_window.js <exe> <out folder>: the REAL-window check of D250 item 3 (length and width handles at the NEAR end), in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
// APP DATA FOLDER of its own (T180_TEST_APP_DATA). Real mouse input (CDP Input.dispatchMouseEvent). The keeper's folder is snapshotted before and after (read only).
// APP DATA FOLDER of its own (T180_TEST_APP_DATA: F2, the keeper's folder is never the run's). Real mouse clicks (CDP Input.dispatchMouseEvent) select the pieces on the track.
// The keeper's folder is snapshotted before and after (read only); the run refuses to start while any t180-track-builder.exe is running.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-jumpui-wt/';
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
if (/t180-track-builder\.exe/i.test(running)) { console.error('refusing to run: a t180-track-builder.exe is already running (the keeper\'s app shares the app data folder unless T180_TEST_APP_DATA is set):\n' + running); process.exit(3); }
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
    // ── D244: the handles on the ghost of an EMPTY track's first piece
    // (on an EMPTY track the Build camera frames the ghost's far end and the mid-piece handles are behind it, so the whole ghost is looked at from overhead first)
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1500);
    let H = await waitHandles(10); k.initialHandles = (H.list || []).map((x) => x.id); await shot('1_ghost_handles_empty_overhead.png');
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'build' } }))`); await sleep(1200); await shot('1b_build_view_empty.png');
    // two pieces placed with the Extend button, so the Build camera sits behind the head and the whole ghost is ahead of it (the way the track is built)
    for (let i = 0; i < 2; i++) { await A.ev(click0('button', 'Extend')); await sleep(1000); }
    H = await waitHandles(10); k.handlesAfterTwoPieces = (H.list || []).map((x) => x.id); await shot('1c_ghost_handles_build.png');
    { const by = Object.fromEntries((H.list || []).map((x) => [x.id, x])); k.nearEnd = Object.fromEntries(Object.entries(by).map(([id, x]) => [id, { x: Math.round(x.x), y: Math.round(x.y) }])); k.nearEndCheck = { lengthBelowTurn: by['length:0'].y > by['turn:1'].y, widthBelowTurn: by['width:1'].y > by['turn:1'].y, widthLevelWithLength: Math.abs(by['width:1'].y - by['length:0'].y) < 60, bankBetween: by['bank:1'].y < by['length:0'].y && by['bank:1'].y > by['turn:1'].y }; }
    k.infoBefore = await infoNow(); const f0 = await fields(); k.fieldsBefore = f0;
    // each kind: press on the handle, drag along its arrow by m metres, release; the field it types into, before and after
    const FIELD = { length: 'length m', width: 'width m', bank: 'bank °', cup: 'cup °', turn: 'turn °/100m', climb: 'climb °/100m' };
    const run = {};
    for (const [id, m] of [['length:0', 20], ['width:1', 1], ['width:-1', 1], ['bank:1', 2], ['bank:-1', 2], ['cup:1', 3], ['turn:1', 4], ['turn:-1', 4], ['climb:0', 4]]) {
      H = await waitHandles(10); const h = find(H, id); if (!h) { run[id] = 'handle not found'; continue; }
      const kind = id.split(':')[0], before = (await fields())[FIELD[kind]], p0 = page(H, h), len = Math.hypot(h.dx, h.dy);
      await drag(p0.x, p0.y, p0.x + h.dx * m, p0.y + h.dy * m); await sleep(500);
      run[id] = { field: FIELD[kind], before, after: (await fields())[FIELD[kind]], m, pxPerM: Math.round(len * 100) / 100 };
    }
    k.drags = run; k.infoAfterDrags = await infoNow(); k.noDocumentEdit = k.infoBefore === k.infoAfterDrags; await shot('2_after_drags.png');
    // Shift is a tenth, Ctrl snaps
    const fresh = async (kind, val) => A.ev(`(() => { const l = [...document.querySelectorAll('#palette label.picker')].find((x) => x.children[0].textContent.trim() === ${JSON.stringify(FIELD[kind])}); const i = l.children[1]; i.value = ${JSON.stringify(String(val))}; i.dispatchEvent(new Event('input')); return i.value; })()`);
    await fresh('length', 100); await sleep(300); H = await waitHandles(10); let h = find(H, 'length:0'), p0 = page(H, h);
    await drag(p0.x, p0.y, p0.x + h.dx * 20, p0.y + h.dy * 20, 8); await sleep(400); k.shiftFine = { from: 100, m: 20, to: (await fields())['length m'], expect: '102 (a tenth of 20)' };
    await fresh('length', 100); await sleep(300); H = await waitHandles(10); h = find(H, 'length:0'); p0 = page(H, h);
    await drag(p0.x, p0.y, p0.x + h.dx * 23, p0.y + h.dy * 23, 2); await sleep(400); k.ctrlSnap = { from: 100, m: 23, to: (await fields())['length m'], expect: 'a multiple of 10' };
    // hover: the name and value (a screenshot of the label), the cursor
    await fresh('length', 160); await sleep(300); H = await waitHandles(10); h = find(H, 'bank:1'); p0 = page(H, h); await mouse('mouseMoved', p0.x, p0.y); await sleep(400); await shot('3_hover_bank.png');
    k.cursorOnHandle = await A.ev(`document.getElementById('preview').style.cursor`); await mouse('mouseMoved', H.left + 40, H.top + 40); await sleep(200); k.cursorOff = await A.ev(`document.getElementById('preview').style.cursor`);
    // the camera's right-drag still works, and a left-drag on a handle did not move the camera
    const pose0 = await poseNow(); await mouse('mouseMoved', H.left + 300, H.top + 200); await mouse('mousePressed', H.left + 300, H.top + 200, { button: 'right', buttons: 2, clickCount: 1 });
    for (let i = 1; i <= 8; i++) { await mouse('mouseMoved', H.left + 300 + i * 12, H.top + 200 + i * 4, { button: 'right', buttons: 2 }); await sleep(30); } await mouse('mouseReleased', H.left + 396, H.top + 232, { button: 'right', buttons: 0, clickCount: 1 }); await sleep(500);
    const pose1 = await poseNow(); k.cameraRightDrag = { moved: JSON.stringify(pose0) !== JSON.stringify(pose1) };
    H = await waitHandles(10); h = find(H, 'width:1'); p0 = page(H, h); const poseA = await poseNow(); await drag(p0.x, p0.y, p0.x + h.dx, p0.y + h.dy); await sleep(400); const poseB = await poseNow(); k.handleDragLeavesCamera = JSON.stringify(poseA) === JSON.stringify(poseB);
    // Extend places what was dragged: the piece, one undo step
    await fresh('length', 160); await sleep(300); const wBefore = (await fields())['width m'];
    k.extendClick = await A.ev(click0('button', 'Extend')); await sleep(1200); k.infoAfterExtend = await infoNow(); await shot('4_after_extend.png');
    // build a short track with the handles: turn the next piece with the turn handle, extend twice
    for (let i = 0; i < 3; i++) {
      H = await waitHandles(10); const th = find(H, 'turn:1'); if (!th) break; const q = page(H, th); await drag(q.x, q.y, q.x + th.dx * 6, q.y + th.dy * 6); await sleep(500);
      await A.ev(click0('button', 'Extend')); await sleep(1200);
    }
    k.infoTrack = await infoNow(); await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1500); await shot('5_track_overhead.png');
    k.ghostAfterExtend = (await waitHandles(10)).list.length;
    // brush clash: armed, a press ON a handle is the handle's (no brush stroke), elsewhere on the track it is the brush's
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'build' } }))`); await sleep(1500);   // (the overhead view puts the ghost under the guide card)
    await A.ev(`(() => { const c = document.querySelector('[aria-label="brush on"]'); c.checked = true; return c.checked; })()`);
    H = await waitHandles(10); h = find(H, 'length:0'); p0 = page(H, h); const l0 = (await fields())['length m']; await drag(p0.x, p0.y, p0.x + h.dx * 10, p0.y + h.dy * 10); await sleep(500);
    k.armedPressOnHandle = { lengthBefore: l0, lengthAfter: (await fields())['length m'], brushRan: /brush:/.test(await infoNow()) };
    await A.ev(`(() => { const c = document.querySelector('[aria-label="brush on"]'); c.checked = false; c.dispatchEvent(new Event('change')); return c.checked; })()`);

    // ── D244b: Sculpt
    const sw = await A.ev(`(() => { const c = document.querySelector('[aria-label="sculpt on"]'); c.checked = true; c.dispatchEvent(new Event('change')); return c.checked; })()`); k.sculptOn = sw; await sleep(500);
    k.sculptChannels = await A.ev(`(() => [...document.querySelector('[aria-label="brush channel"]').options].map((o) => o.value))()`); k.sculptModeDisabled = await A.ev(`document.querySelector('[aria-label="brush mode"]').disabled`);
    k.noHandlesUntilSelected = (await handlesNow()).list.length; k.sculptHint = await A.ev(textOf('sculpt hint'));
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1200);
    // a real click on a piece: the pick sweep finds where piece p2 is on screen
    const where = await A.ev(`(() => { const st = document.getElementById('preview'), r = st.getBoundingClientRect(); let track = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { track = t; } } }));
      let acc = 0; const spans = track.segments.map((g) => { const a = acc; acc += g.length; return { id: g.id, a, b: acc }; }); const hits = [];
      for (let y = 20; y < r.height - 20; y += 6) for (let x = 20; x < r.width - 20; x += 6) { let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (v) => { h = v; } } })); if (!h || !Number.isFinite(h.s) || h.px > 5) continue; const sp = spans.filter((q) => h.s >= q.a && h.s <= q.b); const ids = new Set(sp.map((q) => q.id)); if (ids.has('p2')) { const s2 = sp.filter((q) => q.id === 'p2'); hits.push({ x: x + r.left, y: y + r.top, s: h.s, mid: (Math.min(...s2.map((q) => q.a)) + Math.max(...s2.map((q) => q.b))) / 2 }); } }
      hits.sort((p, q) => Math.abs(p.s - p.mid) - Math.abs(q.s - q.mid)); return hits[0] || null; })()`);
    k.where = where; if (!where) throw new Error('p2 is not pickable on screen');
    await click(where.x, where.y); await sleep(700); k.selection = await A.ev(textOf('selection')); k.sculptHintSelected = await A.ev(textOf('sculpt hint'));
    H = await waitHandles(4); k.sculptHandles = (H.list || []).map((x) => x.id); await shot('6_sculpt_selected.png');
    // drag the left bank handle up: the piece's roll changes, the centreline is the same, one undo step, Undo restores
    const T0 = await trackNow(); const inP2 = (i) => T0.ids[T0.seg[i]] === 'p2';   // (a piece is many path segments: the id of each sample's segment)
    h = find(H, 'bank:1'); p0 = page(H, h); k.undoBefore = await infoNow(); await drag(p0.x, p0.y, p0.x + h.dx * 3, p0.y + h.dy * 3); await sleep(900);
    const T1 = await trackNow(); await shot('7_sculpt_dragged.png');
    const maxPosDiff = Math.max(...T1.pos.map((p, i) => Math.max(...p.map((v, c) => Math.abs(v - T0.pos[i][c]))))), rollInside = Math.max(...T1.roll.map((v, i) => (inP2(i) ? Math.abs(v - T0.roll[i]) : 0))), rollOutside = Math.max(...T1.roll.map((v, i) => (inP2(i) ? 0 : Math.abs(v - T0.roll[i]))));
    k.sculptDrag = { samples: [T0.n, T1.n], centrelineMaxDiffM: maxPosDiff, rollChangedInsideP2: rollInside, rollChangedOutside: rollOutside, info: await infoNow(), msg: (await A.ev(status)).msg };
    // Undo ONCE: back to the same roll everywhere (one undo step for the whole drag)
    await A.ev(click0('#palette button', 'Undo')); await sleep(900); const T2 = await trackNow();
    k.afterUndoOnce = { rollMaxDiffFromBefore: Math.max(...T2.roll.map((v, i) => Math.abs(v - T0.roll[i]))), posMaxDiff: Math.max(...T2.pos.map((p, i) => Math.max(...p.map((v, c) => Math.abs(v - T0.pos[i][c]))))), pieces: T2.ids.length === T0.ids.length };
    // a width drag too, then Sculpt off: the turn brush is offered again and the Extend handles are back
    H = await waitHandles(4); h = find(H, 'width:-1'); if (h) { p0 = page(H, h); await drag(p0.x, p0.y, p0.x + h.dx * 1.5, p0.y + h.dy * 1.5); await sleep(900); const T3 = await trackNow(); k.sculptWidth = { centrelineMaxDiffM: Math.max(...T3.pos.map((p, i) => Math.max(...p.map((v, c) => Math.abs(v - T0.pos[i][c]))))), msg: (await A.ev(status)).msg }; await A.ev(click0('#palette button', 'Undo')); await sleep(600); }
    await A.ev(`(() => { const c = document.querySelector('[aria-label="sculpt on"]'); c.checked = false; c.dispatchEvent(new Event('change')); return c.checked; })()`); await sleep(600);
    k.sculptOff = { channels: await A.ev(`(() => [...document.querySelector('[aria-label="brush channel"]').options].map((o) => o.value))()`), handles: (await waitHandles(10)).list.length };
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'build' } }))`); await sleep(1200); await shot('8_end.png');
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('handles_window: ' + e.message); process.exit(1); });
