// jump_window.js <exe> <out folder>: the REAL-window check of D243 item 1 (the Add-jump control), in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
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







// ───────── D243 item 1: the Add-jump control in the REAL window (our debug build, its own app data) ─────────
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
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 700)}`); return true; } });
  try {
    A = await launch();
    const shot = async (name) => { const r = await A.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.data, 'base64')); return name; };
    const mouse = (type, x, y, o = {}) => A.send('Input.dispatchMouseEvent', { type, x, y, button: o.button || 'none', buttons: o.buttons || 0, clickCount: o.clickCount || 0 });
    const clickAt = async (x, y) => { await mouse('mouseMoved', x, y); await mouse('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1 }); };
    const fields = () => A.ev(`(() => { const out = {}; for (const l of document.querySelectorAll('#palette label.picker')) { const t = l.children[0].textContent.trim(), i = l.children[1]; if (i && i.tagName === 'INPUT' && i.type === 'number') out[t] = i.value; } return out; })()`);
    const setField = (label, val) => A.ev(`(() => { const l = [...document.querySelectorAll('#palette label.picker')].find((x) => x.children[0].textContent.trim() === ${JSON.stringify(label)}); const i = l.children[1]; i.value = ${JSON.stringify(String(val))}; i.dispatchEvent(new Event('input')); return i.value; })()`);
    const infoNow = async () => (await A.ev(status)).info;
    const note = () => A.ev(textOf('jump flight'));
    const statusLine = () => A.ev(`(() => { const m = [...document.querySelectorAll('#palette p.message')].map((e) => e.textContent).filter(Boolean); return m.join(' | '); })()`);
    const handles = () => A.ev(`(() => { let h = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (l) => { h = l; } } })); return (h || []).map((x) => x.id); })()`);
    const pixels = () => A.ev(`(() => { const c = document.querySelector('canvas[aria-label="flights"]'); if (!c) return null; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let cyan = 0, red = 0, other = 0; for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const r = d[i], g = d[i + 1], b = d[i + 2]; if (r > 90 && r < 175 && g > 190 && b > 225) cyan++; else if (r > 225 && g < 150 && b < 150) red++; else other++; } return { cyan, red, other }; })()`);
    const trackNow = () => A.ev(`(() => { let t = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => { t = x; } } })); if (!t) return null; const kinds = t.segments.map((g) => g.kind + ':' + (g.part || '') + ':' + g.id); const gi = t.segments.findIndex((g) => g.kind === 'gap'); let landPitch = null, afterPitch = null; if (gi >= 0) { const S = t.path.samples; const li = S.findIndex((m) => m.seg === gi + 1); if (li >= 0) landPitch = Math.asin(S[li].T[1]) * 180 / Math.PI; const last = t.segments[t.segments.length - 1]; if (last.id !== t.segments[gi].id) { const ai = S.findIndex((m) => t.segments[m.seg] && t.segments[m.seg].id === last.id); if (ai >= 0) afterPitch = Math.asin(S[ai].T[1]) * 180 / Math.PI; } } return { n: t.segments.length, gap: gi >= 0, kinds: kinds.filter((x, i) => i === gi || i === gi + 1 || i === t.segments.length - 1), landPitch, afterPitch }; })()`);
    const rectOf = (text) => A.ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(text)}); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
    const camera = async (m) => { await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: ${JSON.stringify(m)} } }))`); await sleep(1500); };

    k.start = await A.ev(status); await sleep(1500);
    k.jumpFieldsStart = { gap: (await fields())['jump gap m'], drop: (await fields())['drop m (+ down)'], land: (await fields())['landing °'] };
    k.hintAtStart = await note(); await A.ev(`document.querySelector('[aria-label="jump flight"]').scrollIntoView({ block: 'center' })`); await sleep(400); await shot('1_hint.png');
    // the empty track: Add jump is refused in plain words
    const rb = await rectOf('Add jump'); await clickAt(rb.x, rb.y); await sleep(500); k.refusedOnEmpty = await statusLine(); k.emptyPieces = await infoNow(); await shot('2_refused_empty.png');
    // three pieces, then the Build view
    for (let i = 0; i < 3; i++) { const re = await rectOf('Extend'); await clickAt(re.x, re.y); await sleep(900); }
    await camera('build'); k.pieces3 = await infoNow();
    // a jump the car clears at 460 km/h (a flat take-off, gap 15): the ghost, its words, its arcs
    await setField('jump gap m', 15); await setField('drop m (+ down)', 1); await setField('landing °', -2); await sleep(900);
    k.noteClear = await note(); k.pixelsClear = await pixels(); k.handlesDuringJump = await handles(); await A.ev(`document.querySelector('[aria-label="jump flight"]').scrollIntoView({ block: 'center' })`); await sleep(300); await shot('3_ghost_arc_build.png');
    await camera('side'); await sleep(500); k.pixelsSide = await pixels(); await shot('3b_ghost_arc_side.png'); await camera('overhead'); k.pixelsOverhead = await pixels(); await shot('3c_ghost_arc_overhead.png'); await camera('build');
    // a long gap: the heavier fall does not reach it: drawn red, and the words say the speed it needs
    await setField('jump gap m', 120); await setField('drop m (+ down)', 3); await setField('landing °', -3); await sleep(900); k.noteLong = await note(); k.pixelsLong = await pixels(); await shot('4_long_gap_red.png');
    // back to a good one; HOVER the real button: the ghost is up while the pointer is on it, gone when it leaves, and the Extend handles come back
    await setField('jump gap m', 15); await setField('drop m (+ down)', 1); await setField('landing °', -2); await mouse('mouseMoved', 5, 5); await sleep(300);
    const hb = await rectOf('Add jump'); await mouse('mouseMoved', hb.x, hb.y); await sleep(700); k.onHover = { pixels: await pixels(), handles: (await handles()).length }; await mouse('mouseMoved', 40, 40); await sleep(1800); k.afterLeave = { pixels: await pixels(), handles: (await handles()).length };
    // Add jump with a real click: one piece more, the flight stays drawn (the placed track's), the message says what next
    const before = await infoNow(); const rj = await rectOf('Add jump'); await clickAt(rj.x, rj.y); await sleep(1200);
    k.afterAdd = { before, after: await infoNow(), status: await statusLine(), pixels: await pixels(), handles: (await handles()).length }; k.track1 = await trackNow(); await camera('side'); k.placedFlightSide = await pixels(); await shot('5_after_add_side.png'); await camera('build'); await shot('5_after_add.png');
    // the same again: refused in plain words
    await clickAt(rj.x, rj.y); await sleep(600); k.refusedTwice = { status: await statusLine(), pieces: await infoNow() };
    // the next Extend lays the landing road: road, flight, road; the new road starts at the landing pitch
    const re2 = await rectOf('Extend'); await clickAt(re2.x, re2.y); await sleep(1200); k.afterExtend = { info: await infoNow(), track: await trackNow(), pixels: await pixels() }; await camera('side'); k.afterExtendSide = await pixels(); await camera('overhead'); k.afterExtendOverhead = await pixels(); await shot('6_after_extend_overhead.png'); await camera('build'); await shot('6_after_extend.png');
    // Undo twice: the road, then the flight; the dashed arc goes with the flight
    const ru = await A.ev(`(() => { const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Undo'); const r = b.getBoundingClientRect(); b.scrollIntoView({ block: 'center' }); const r2 = b.getBoundingClientRect(); return { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 }; })()`);
    await clickAt(ru.x, ru.y); await sleep(700); await clickAt(ru.x, ru.y); await sleep(1000); k.afterUndo2 = { info: await infoNow(), pixels: await pixels(), track: await trackNow() }; await shot('7_after_undo.png');
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('jump_window: ' + e.message); process.exit(1); });
