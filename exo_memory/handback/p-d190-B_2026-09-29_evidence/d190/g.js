// g.js (pane B, D190 row 8 and ruling 1's seam look): the real app, OFF-SCREEN, PrintWindow of its own window only (scripts/prove_render.ps1).
// A 100 m legacy bowl straight, then Extend 120 m with cup 31 (toward a half-pipe: the half-pipe's edge is 30.6), then 120 m with cup 90.
// Captures from the build view, the side, and the chase and free views pulled close, for the keeper's G and for seam slivers.
//   node g.js --exe <exe> --wt <tree> --out <dir>
'use strict';
const { spawn, spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const exe = arg('--exe'), WT = path.resolve(arg('--wt')), out = path.resolve(arg('--out')), PR = require(path.join(WT, 'scripts', 'prove_render.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)), J = JSON.stringify;
fs.mkdirSync(out, { recursive: true });
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
  const port = await PR.freePort(), dataDir = path.join(process.env.APPDATA, JSON.parse(fs.readFileSync(path.join(WT, 'src-tauri', 'tauri.conf.json'), 'utf8')).identifier);
  const restore = PR.guardAutosave(dataDir, out);
  const flags = `--remote-debugging-port=${port} --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`;
  const app = spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: flags, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(out) }, stdio: 'ignore' });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  const hard = setTimeout(() => { kill(); process.exit(2); }, 600000); const R = { exceptions: [], shots: {} };
  try {
    R.window = await until(async () => { const r = offScreen(app.pid); return r.startsWith('none') ? null : r; }, 'window', 60000);
    const cdp = await cdpConnect(port, Date.now() + 60000, (d) => { if (d.method === 'Runtime.exceptionThrown') R.exceptions.push(d.params.exceptionDetails.text); });
    if (!PR.portOwner(port, app.pid).ours) throw new Error('port not ours'); await cdp.send('Runtime.enable');
    await until(async () => cdp.evaluate(`!!document.querySelector('#preview canvas') && [...document.querySelectorAll('#palette h3')].some((h) => h.textContent === 'Equation track')`), 'builder');
    const FIELD = { length: 'length m', turn: 'turn °/100m', climb: 'climb °/100m', bank: 'bank °', cup: 'cup °', width: 'width m' };
    const setFields = (f) => cdp.evaluate(`(() => { for (const [k, v] of ${J(Object.entries(f).map(([k, v]) => [FIELD[k], v]))}) { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === k); const i = l.querySelector('input,select'); i.value = v; i.dispatchEvent(new Event('input')); } return Object.fromEntries([...document.querySelectorAll('[data-readout]')].map((e) => [e.getAttribute('data-readout'), e.textContent])); })()`);
    const click = (t) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${J(t)}); if (!b) return false; b.click(); return true; })()`);
    const count = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => res(t && t.segments ? new Set(t.segments.map((g) => g.id)).size : 0) } })); setTimeout(() => res(-1), 1000); })`);
    const ext = async (f) => { const n = await count(); R.readouts = R.readouts || []; R.readouts.push({ fields: f, panel: await setFields(f) }); await click('Extend'); await until(async () => (await count()) === n + 1, 'placed', 10000); };
    const mode = (m) => cdp.evaluate(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: ${J(m)} } }))`);
    const canvasAt = () => cdp.evaluate(`(() => { const q = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const wheel = async (dy, n) => { const c = await canvasAt(); for (let i = 0; i < n; i++) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: dy }); };
    const key = async (code, key, ms) => { await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) }); await sleep(ms); await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: key.toUpperCase().charCodeAt(0) }); };
    const shoot = async (name) => { await sleep(1500); const file = path.join(out, `${name}.png`); const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(WT, 'scripts', 'prove_render.ps1'), '-ProcId', String(app.pid), '-Out', file], { encoding: 'utf8', timeout: 60000 }); let cap; try { cap = JSON.parse(r.stdout.trim().split('\n').pop()); } catch { cap = { ok: false }; } R.shots[name] = cap.ok ? path.basename(file) : cap; };
    await ext({ length: '100', turn: '', climb: '', bank: '', cup: '', width: '' });
    await ext({ length: '120', turn: '', climb: '', bank: '', cup: '31', width: '' });
    await setFields({ length: '120', cup: '90' });
    await shoot('G1-build-ghost-to-90');
    await ext({ length: '120', turn: '', climb: '', bank: '', cup: '90', width: '' });
    await setFields({ length: '60', cup: '' });
    await mode('build'); await shoot('G2-build-after-90');
    await mode('side'); await shoot('G3-side');
    await mode('overhead'); await shoot('G4-overhead');
    await mode('chase'); await wheel(-100, 8); await shoot('G5-chase-close');
    await mode('free'); await key('KeyS', 's', 1200); await key('KeyQ', 'q', 250); await shoot('G6-free-close-back');
    await key('KeyS', 's', 1500); await shoot('G7-free-further-back');
    // ROUND 2 (B's X1, in the window): a lap whose four turns are cup 150 and never return, closed onto the legacy start straight
    await click('New'); await until(async () => (await count()) === 0, 'new', 10000);
    await ext({ length: '300', turn: '', climb: '', bank: '', cup: '', width: '' });
    for (let i = 0; i < 4; i++) await ext({ length: String(Math.PI * 90), turn: String(100 / 180 * 180 / Math.PI), climb: '', bank: '', cup: '150', width: '' });
    await ext({ length: '60', turn: '0', climb: '', bank: '', cup: '', width: '' });
    R.closeClicked = await click('Close the loop'); await sleep(3000);
    R.statusAfterClose = await cdp.evaluate(`(document.querySelector('#palette .message') || {}).textContent || ''`);
    R.validationLine = await cdp.evaluate(`([...document.querySelectorAll('body *')].filter((e) => e.children.length === 0 && /\\blap\\b/.test(e.textContent) && /red|amber/.test(e.textContent)).map((e) => e.textContent.trim())[0]) || ''`);
    R.redList = await cdp.evaluate(`[...document.querySelectorAll('li')].map((e) => e.textContent.trim()).filter((t) => /step|seam|red/i.test(t)).slice(0, 5)`);
    await mode('build'); await shoot('L1-lap-seam-build');
    await mode('chase'); await shoot('L2-lap-seam-chase');
    await mode('overhead'); await shoot('L3-lap-overhead');
    cdp.close();
  } catch (e) { R.error = e.stack || e.message; } finally { clearTimeout(hard); kill(); R.autosave = restore(); fs.writeFileSync(path.join(out, 'report.json'), J(R, null, 1)); console.log(J({ error: R.error || null, exceptions: R.exceptions, shots: R.shots, readouts: R.readouts, autosave: R.autosave })); }
})();
