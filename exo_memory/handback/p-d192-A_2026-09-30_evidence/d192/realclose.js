// realclose.js (A, D192): the REAL window's X. Launches the app OFF-SCREEN (its own WebView2 profile, the keeper's autosave put back), drives the
// builder-mode switch through the page's own select over the DevTools port, then sends WM_CLOSE (Process.CloseMainWindow, what the X sends)
// and reports whether the process EXITED. Every scenario is a fresh process.
//   node realclose.js --exe <exe> --wt <tree with scripts/prove_render.js> --out <dir> [--only A,B] [--wait 8000]
'use strict';
const { spawn, spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const exe = arg('--exe'), WT = path.resolve(arg('--wt')), out = path.resolve(arg('--out')), waitMs = Number(arg('--wait', 8000)), only = (arg('--only', '') || '').split(',').filter(Boolean);
const PR = require(path.join(WT, 'scripts', 'prove_render.js'));
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
 public static string Move(uint want) { IntPtr found = IntPtr.Zero;
  EnumWindows((h, l) => { uint p; GetWindowThreadProcessId(h, out p); if (p == want && IsWindowVisible(h) && GetWindow(h, 4) == IntPtr.Zero) { found = h; return false; } return true; }, IntPtr.Zero);
  if (found == IntPtr.Zero) return "none"; SetWindowPos(found, IntPtr.Zero, -12000, -12000, 0, 0, 0x0001 | 0x0004 | 0x0010); return "moved"; } }
"@
[OS]::Move([uint32]${pid})`);
}
async function cdpConnect(port, deadline) {
  let page = null;
  while (!page && Date.now() < deadline) { try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = list.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch { /* not up yet */ } if (!page) await sleep(300); }
  if (!page) throw new Error(`no app page on port ${port}`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('DevTools websocket failed')); });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(J({ id: i, method, params })); });
  const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(`page: ${r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text}`); return r.result.value; };
  return { send, evaluate, close: () => ws.close() };
}
async function until(fn, what, ms = 30000) { const end = Date.now() + ms; let v; while (Date.now() < end) { try { v = await fn(); } catch { v = null; } if (v) return v; await sleep(250); } throw new Error(`timed out waiting for ${what}`); }

/** A page in `mode`, loaded and settled (the query has the mode, the document is complete, the builder drew its palette). */
const ready = (cdp, mode) => until(() => cdp.evaluate(`(() => { const q = new URLSearchParams(location.search).get('mode'), sel = document.getElementById('mode'), pal = document.getElementById('palette');
  return document.readyState === 'complete' && !!sel && !!pal && sel.value === ${J(mode)} && (q === ${J(mode)} || (${J(mode)} === 'core' && !q)) && pal.children.length > 0; })()`), `the ${mode} page`);
const switchTo = async (cdp, mode) => { await cdp.evaluate(`(() => { const s = document.getElementById('mode'); s.value = ${J(mode)}; s.dispatchEvent(new Event('change')); return true; })()`); await sleep(800); await ready(cdp, mode); await sleep(2500); };

async function scenario(name, steps) {
  const tag = name[0], dir = path.join(out, `run-${tag}`); fs.mkdirSync(dir, { recursive: true });
  const port = await PR.freePort(), restore = PR.guardAutosave(path.join(process.env.APPDATA, JSON.parse(fs.readFileSync(path.join(WT, 'src-tauri', 'tauri.conf.json'), 'utf8')).identifier), dir);
  const env = { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${port}`, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(dir) };
  const app = spawn(exe, [], { env, stdio: 'ignore', windowsHide: false }); let exited = false, exitAt = 0; app.on('exit', () => { exited = true; exitAt = Date.now(); });
  const res = { scenario: name, pid: app.pid };
  try {
    const cdp = await cdpConnect(port, Date.now() + 60000);
    await until(() => cdp.evaluate(`document.readyState === 'complete' && !!document.getElementById('mode')`), 'the first page'); res.moved = offScreen(app.pid);
    await ready(cdp, 'core'); await sleep(2500);
    for (const step of steps) await step(cdp, res);
    res.closeSent = ps(`(Get-Process -Id ${app.pid}).CloseMainWindow()`); const t0 = Date.now();
    while (!exited && Date.now() - t0 < waitMs) await sleep(100);
    res.exited = exited; res.exitMs = exited ? exitAt - t0 : null;
    cdp.close();
  } catch (e) { res.error = String(e.message || e); }
  finally { if (!exited) { spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); res.killed = true; } await sleep(1200); res.autosave = restore(); }
  return res;
}
const failAutosave = async (cdp, res) => { res.patched = await cdp.evaluate(`(async () => { const real = window.__TAURI_INTERNALS__; const inv = (c, a, o) => (/autosave/.test(c) ? Promise.reject(new Error('planted: ' + c + ' failed')) : real.invoke(c, a, o));
  try { window.__TAURI_INTERNALS__ = Object.create(real, { invoke: { value: inv } }); } catch (e) { return 'cannot replace: ' + e.message; }
  try { await window.__TAURI__.core.invoke('clear_autosave'); return 'PLANT INEFFECTIVE'; } catch (e) { return 'plant works: ' + e.message; } })()`); };
const SCEN = {
  G: ['G pieces with an unsaved edit: the autosave is flushed on close', [(c) => switchTo(c, 'pieces'), async (c, r) => { r.placed = await c.evaluate(`(() => { const b = document.querySelector('#palette button.piece'); if (!b) return 'no piece button'; b.click(); return b.textContent; })()`); }]],
  Z: ['Z probe', [async (c, r) => { r.desc = await c.evaluate(`JSON.stringify({ internals: Object.getOwnPropertyDescriptor(window.__TAURI_INTERNALS__, 'invoke'), frozen: Object.isFrozen(window.__TAURI_INTERNALS__), coreDesc: Object.getOwnPropertyDescriptor(window.__TAURI__.core, 'invoke'), coreFrozen: Object.isFrozen(window.__TAURI__.core), src: String(window.__TAURI__.core.invoke).slice(0, 200) })`); }]],
  A: ['A core, fresh start', []],
  B: ['B pieces, fresh (core -> pieces)', [(c) => switchTo(c, 'pieces')]],
  C: ['C pieces -> core', [(c) => switchTo(c, 'pieces'), (c) => switchTo(c, 'core')]],
  D: ['D core -> pieces -> core -> pieces', [(c) => switchTo(c, 'pieces'), (c) => switchTo(c, 'core'), (c) => switchTo(c, 'pieces')]],
  E: ['E pieces with a failing autosave', [(c) => switchTo(c, 'pieces'), failAutosave]],
  F: ['F core after pieces with a failing autosave planted in pieces', [(c) => switchTo(c, 'pieces'), failAutosave, (c) => switchTo(c, 'core')]],
};
(async () => {
  const results = [];
  for (const k of Object.keys(SCEN)) { if (only.length && !only.includes(k)) continue; const r = await scenario(SCEN[k][0], SCEN[k][1]); results.push(r); console.log(J(r)); }
  fs.writeFileSync(path.join(out, 'results.json'), J(results, null, 1));
  console.log(results.map((r) => `${r.exited ? 'CLOSED ' : 'STAYED OPEN'}  ${r.scenario}${r.error ? '  ERROR ' + r.error : ''}`).join('\n'));
})();
