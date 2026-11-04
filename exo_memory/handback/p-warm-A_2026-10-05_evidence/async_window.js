// pieces_window.js <exe> <out folder>: the REAL-window TIMING check of the async previews (D240 follow-up), in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
// APP DATA FOLDER of its own (T180_TEST_APP_DATA: F2, the keeper's folder is never the run's). Real mouse clicks (CDP Input.dispatchMouseEvent) select the pieces on the track.
// The keeper's folder is snapshotted before and after (read only); the run refuses to start while any t180-track-builder.exe is running.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/a-piecesui-wt/';
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

// TIMING: the real-window check of the async previews (D240 follow-up). Two tracks are put in the run's own app data BEFORE the window starts (tracks/eq-big46.t180track, eq-biglap.t180track):
// a 46-piece 13.1 km open track (the middle delete's) and an 8-piece 14.3 km near-closed lap (Close's), as the probes measured them synchronously (8.5-10.3 s and 10.4 s).
fs.mkdirSync(path.join(dataDir, 'tracks'), { recursive: true });
let big = extend(D.createDoc('big46'), { length: 300, family: 'bowl' });
for (let i = 0; i < 45; i++) big = extend(big, { length: i % 3 === 2 ? 250 : 300, transition: 60, targets: { kh: (i % 2 ? -1 : 1) / 300 } });
fs.writeFileSync(path.join(dataDir, 'tracks', 'eq-big46.t180track'), D.serialize(big));
const CL = require(W + 'src/core/close.js');
let lap = extend(D.createDoc('biglap'), { length: 3000, family: 'bowl' });
for (let i = 0; i < 4; i++) { lap = extend(lap, { length: (Math.PI * 1000) / 2, transition: 60, targets: { kh: 1 / 1000 } }); lap = extend(lap, { length: i % 2 ? 3000 : 1000, transition: 60, targets: { kh: 0 } }); }
const farLap = D.checkDoc({ ...lap, pieces: lap.pieces.slice(0, -1), nextId: lap.nextId }), openLap = D.checkDoc({ ...CL.close(farLap, { edited: [0] }).doc, closed: false });
const nearLap = D.checkDoc({ ...openLap, pieces: openLap.pieces.map((p, k) => (k === 2 ? { ...p, channels: { ...p.channels, kh: p.channels.kh.map((v, i, a) => (i >= 3 && i <= a.length - 4 ? v + 1e-4 : v)) } } : p)) });
fs.writeFileSync(path.join(dataDir, 'tracks', 'eq-biglap.t180track'), D.serialize(nearLap));

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
const status = `(() => ({ status: document.getElementById('status').textContent, info: (document.querySelector('#palette p.head') || {}).textContent, msg: [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | ') }))()`;
const openTrack = (name) => `(async () => { const o = document.getElementById('open'); o.replaceChildren(new Option('x', ''), new Option(${JSON.stringify(name)}, ${JSON.stringify(name)})); o.value = ${JSON.stringify(name)}; await o.onchange({ target: o }); return true; })()`;
// IN-PAGE STOPWATCH: t0 at the click, then every 25 ms (a timer, so a frozen page cannot sample) what the page shows. Also the largest gap between animation frames and between the timer's own ticks:
// a page that is frozen by the check shows one huge gap; a page that is not shows only the ghost's build.
const measure = (label, clickJs, previewAria, applyText) => `(async () => {
  const q = (aria) => document.querySelector('[aria-label=' + JSON.stringify(aria) + ']'), apply = () => [...document.querySelectorAll('button')].find((b) => b.textContent === ${JSON.stringify(applyText)});
  const t0 = performance.now(), out = { label: ${JSON.stringify(label)}, samples: [], tPreview: null, tApplyOn: null, tCheckLine: null, maxFrameGap: 0, maxTickGap: 0, seenSeconds: [] };
  let lastF = t0, lastT = t0, raf = 0, stop = false;
  const frame = () => { const n = performance.now(); out.maxFrameGap = Math.max(out.maxFrameGap, n - lastF); lastF = n; if (!stop) raf = requestAnimationFrame(frame); }; raf = requestAnimationFrame(frame);
  const r = ${clickJs}; out.click = r;
  await new Promise((done) => { const id = setInterval(() => {
    const n = performance.now(), el = q(${JSON.stringify(previewAria)}), text = el ? el.textContent : '', line = q('overlap check');
    out.maxTickGap = Math.max(out.maxTickGap, n - lastT); lastT = n;
    if (out.tPreview === null && /^Preview:/.test(text)) out.tPreview = Math.round(n - t0);
    if (line && /Checking/.test(line.textContent)) { if (out.tCheckLine === null) out.tCheckLine = Math.round(n - t0); const m = /… (\\d+) s/.exec(line.textContent); if (m && !out.seenSeconds.includes(+m[1])) out.seenSeconds.push(+m[1]); }
    const a = apply(); if (a && !a.disabled && out.tApplyOn === null && out.tPreview !== null) { out.tApplyOn = Math.round(n - t0); out.finalLine = line ? line.textContent : null; out.timeLine = (q('overlap check time') || {}).textContent || null; out.applyDisplay = a.style.display; }
    if (out.tApplyOn !== null || n - t0 > 90000) { clearInterval(id); done(); } }, 25); });
  stop = true; cancelAnimationFrame(raf); out.maxFrameGap = Math.round(out.maxFrameGap); out.maxTickGap = Math.round(out.maxTickGap); out.total = Math.round(performance.now() - t0); return out;
})()`;

(async () => {
  let A = null, cleaned = false;
  const cleanup = () => {
    if (cleaned) return; cleaned = true;
    const keeperAfter = snapshot(keeperDir), kk = new Set([...Object.keys(keeperBefore), ...Object.keys(keeperAfter)]);
    report.keeperFiles = Object.keys(keeperBefore).length; report.keeperChanged = [...kk].filter((x) => keeperBefore[x] !== keeperAfter[x]);
    report.runAppData = Object.keys(snapshot(dataDir)).sort(); report.ended = new Date().toISOString();
    fs.writeFileSync(path.join(out, 'timing_report.json'), JSON.stringify(report, null, 1));
  };
  const hard = setTimeout(() => { if (A) A.kill(); report.error = 'hard timeout'; step('HARD TIMEOUT'); setTimeout(() => { cleanup(); console.error('hard timeout, cleaned up'); process.exit(2); }, 2000); }, 600000);
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 700)}`); return true; } });
  try {
    A = await launch();
    const shot = async (name) => { const r = await A.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.data, 'base64')); return name; };
    const mouse = async (x, y) => { await A.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await A.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 }); await A.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1 }); await sleep(600); };
    const where = (id) => A.ev(`(() => { const st = document.getElementById('preview'), r = st.getBoundingClientRect(); let track = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { track = t; } } }));
      let acc = 0; const spans = track.segments.map((g) => { const a = acc; acc += g.length; return { id: g.id, a, b: acc }; }); let best = null;
      for (let y = 10; y < r.height - 10; y += 6) for (let x = 10; x < r.width - 10; x += 6) { if (y + r.top < 215 && x + r.left > 1020) continue; let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (v) => { h = v; } } })); if (!h || !Number.isFinite(h.s) || h.px > 12) continue; const sp = spans.find((q) => h.s >= q.a && h.s < q.b); if (!sp || sp.id !== ${JSON.stringify(id)}) continue; if (!best || h.px < best.px) best = { x: x + r.left, y: y + r.top, px: h.px, s: h.s }; }
      return best; })()`);
    const cpu = () => { const out = []; for (let i = 0; i < 3; i++) { const r = spawnSync('powershell', ['-NoProfile', '-Command', '(Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average'], { encoding: 'utf8', timeout: 20000 }); out.push(Number((r.stdout || '').trim())); } return out; };
    k.cpuBusyPercentBefore = cpu(); k.onscreen = process.env.ONSCREEN === '1';
    k.start = await A.ev(status);
    // ── the MIDDLE DELETE on the 46-piece, 13.1 km track ──
    await A.ev(openTrack('big46')); await sleep(2500); k.big46 = await A.ev(status);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(2500);
    let pick = null, pid = null; for (const id of ['p43', 'p42', 'p44', 'p41', 'p40', 'p38', 'p30', 'p21']) { pick = await where(id); if (pick) { pid = id; break; } } k.picked = { id: pid, at: pick }; if (!pick) throw new Error('no middle piece is pickable on screen');
    await mouse(pick.x, pick.y); k.selected = await A.ev(`(document.querySelector('[aria-label="selection"]') || {}).textContent`);
    k.cpuBeforeDelete = cpu(); k.delete = await A.ev(measure('middle delete, 46 pieces, 13.1 km', `(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Delete selected'); b.click(); return 'clicked'; })()`, 'delete preview', 'Apply delete'));
    await shot('t1_delete_after_check.png');
    // Cancel while it checks: Apply must never come on, and the page must stay alive
    await A.ev(click('button', 'Cancel delete')); await sleep(500);
    k.deleteCancelMid = await A.ev(`(async () => { const t0 = performance.now(); const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Delete selected'); b.click(); await new Promise((r) => setTimeout(r, 1500));
      const mid = { previewShown: /^Preview:/.test((document.querySelector('[aria-label="delete preview"]') || {}).textContent || ''), line: (document.querySelector('[aria-label="overlap check"]') || {}).textContent || null, applyDisabled: ([...document.querySelectorAll('button')].find((x) => x.textContent === 'Apply delete') || {}).disabled };
      [...document.querySelectorAll('button')].find((x) => x.textContent === 'Cancel delete').click(); await new Promise((r) => setTimeout(r, 14000));
      const after = { previewText: (document.querySelector('[aria-label="delete preview"]') || {}).textContent || '', applyDisplay: ([...document.querySelectorAll('button')].find((x) => x.textContent === 'Apply delete') || {}).style.display, msg: [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | ') };
      return { mid, after, ms: Math.round(performance.now() - t0) }; })()`);
    // ── CLOSE on the 14.3 km near-closed lap ──
    await A.ev(openTrack('biglap')); await sleep(2500); k.biglap = await A.ev(status);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(2500);
    k.cpuBeforeClose = cpu(); k.close = await A.ev(measure('Close, 8 pieces, 14.3 km', `(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Close the loop'); b.click(); return 'clicked'; })()`, 'close preview', 'Apply'));
    await shot('t2_close_after_check.png');
    k.afterClose = await A.ev(status);
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('async_window: ' + e.message); process.exit(1); });
