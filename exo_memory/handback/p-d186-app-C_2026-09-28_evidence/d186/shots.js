// shots.js (pane C, D186 scratch): the equation builder in the REAL app window, launched OFF-SCREEN, captured with PrintWindow
// (scripts/prove_render.ps1: the app's own window only). Three captures: extend at the head, a brush, the water.
//   node shots.js --exe <app exe> --out <folder>
// Safety as scripts/prove_render.js (its helpers are reused): its own DevTools port and WebView2 profile, the keeper's autosave
// backed up and put back, the port's owner checked before attaching, and only the PID this run started is killed. No AC.
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const WT = 'C:/Users/nname/AppData/Local/Temp/c-d186-wt';
const PR = require(path.join(WT, 'scripts', 'prove_render.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const exe = arg('--exe'), out = path.resolve(arg('--out'));

function ps(script) { const r = spawnSync('powershell', ['-NoProfile', '-Command', script], { encoding: 'utf8', timeout: 60000 }); return (r.stdout || '').trim() + (r.stderr ? ` ERR ${r.stderr.trim()}` : ''); }
/** Move the process's top-level window off every screen (no activation, size kept). */
function offScreen(pid) {
  return ps(`Add-Type @"
using System; using System.Runtime.InteropServices; using System.Text;
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

async function cdpConnect(port, deadline) {
  let page = null;
  while (!page && Date.now() < deadline) {
    try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = list.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch { /* not up yet */ }
    if (!page) await sleep(300);
  }
  if (!page) throw new Error(`no app page on the DevTools port ${port}`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('DevTools websocket failed')); });
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(`page: ${r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text}`); return r.result.value; };
  return { send, evaluate, close: () => ws.close() };
}
async function until(fn, what, ms = 30000) { const end = Date.now() + ms; while (Date.now() < end) { const v = await fn(); if (v) return v; await sleep(250); } throw new Error(`timed out waiting for ${what}`); }

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const port = await PR.freePort();
  const dataDir = path.join(process.env.APPDATA, JSON.parse(fs.readFileSync(path.join(WT, 'src-tauri', 'tauri.conf.json'), 'utf8')).identifier);
  const restore = PR.guardAutosave(dataDir, out);
  const flags = `--remote-debugging-port=${port} --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`;
  const app = spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: flags, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(out) }, stdio: 'ignore' });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  const hard = setTimeout(() => { kill(); console.error('hard timeout: killed', app.pid); process.exit(2); }, 300000);
  const rep = { pid: app.pid, port, shots: {}, steps: [] };
  try {
    rep.window = await until(async () => { const r = offScreen(app.pid); return r.startsWith('none') ? null : r; }, 'the app window', 60000);
    const cdp = await cdpConnect(port, Date.now() + 60000);
    const owner = PR.portOwner(port, app.pid); if (!owner.ours) throw new Error(`port ${port} is held by pid ${owner.pid}, not the app`);
    rep.portOwner = owner.pid;
    await cdp.send('Runtime.enable'); const logs = []; 
    try { await until(() => cdp.evaluate(`!!document.querySelector('#preview canvas') && [...document.querySelectorAll('#palette h3')].some((h) => h.textContent === 'Equation track')`), 'the equation builder and the preview'); } catch (e) { rep.page = await cdp.evaluate(`({ url: location.href, mode: (document.getElementById('mode') || {}).value, palette: (document.getElementById('palette') || {}).textContent, preview: (document.getElementById('preview') || {}).textContent, status: (document.getElementById('status') || {}).textContent })`); throw e; }
    const J = JSON.stringify;
    const setField = (label, value) => cdp.evaluate(`(() => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === ${J(label)}); const i = l.querySelector('input,select'); if (i.type === 'checkbox') i.checked = ${J(!!value)}; else i.value = ${J(String(value))}; i.dispatchEvent(new Event('change')); return true; })()`);
    const at = (sel, text) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll(${J(sel)})].find((x) => x.textContent === ${J(text)}); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const mouse = async (type, x, y, extra = {}) => cdp.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, ...extra });
    const click = async (text) => { const r = await at('#palette button', text); if (!r) throw new Error(`no button ${text}`); for (const t of ['mouseMoved', 'mousePressed', 'mouseReleased']) await mouse(t, r.x, r.y); };
    const info = () => cdp.evaluate(`[document.querySelector('#palette p.head').textContent, document.querySelector('#palette p.message').textContent, [...document.querySelectorAll('#palette ul.reds li')].map((l) => l.textContent)]`);
    const key = async (k) => { for (const type of ['keyDown', 'keyUp']) await cdp.send('Input.dispatchKeyEvent', { type, key: k, text: k, code: `Key${k.toUpperCase()}`, windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0) }); };
    const probe = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180-probe', { detail: { reply: res } })); setTimeout(() => res(null), 2000); })`);
    const rect = () => cdp.evaluate(`(() => { const c = document.querySelector('#preview canvas').getBoundingClientRect(), d = devicePixelRatio; return [c.left * d, c.top * d, c.width * d, c.height * d].map(Math.round).join(','); })()`);
    const shoot = async (name) => {
      await sleep(2500);
      const file = path.join(out, `window-${name}.png`), r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(WT, 'scripts', 'prove_render.ps1'), '-ProcId', String(app.pid), '-Out', file, '-Rect', await rect()], { encoding: 'utf8', timeout: 60000 });
      let cap; try { cap = JSON.parse(r.stdout.trim().split('\n').pop()); } catch { cap = { ok: false, reason: r.stderr || r.stdout }; }
      if (cap.ok && cap.title !== 'T-180 Track Builder') { fs.rmSync(file, { force: true }); cap = { ok: false, reason: `captured "${cap.title}", not the app; deleted` }; }
      rep.shots[name] = { file: cap.ok ? file : null, capture: cap, probe: await probe(), info: await info() };
    };
    // 1 · EXTEND at the head: a straight, then turns, the build view following the head; the last one's ghost shown by hovering
    await setField('length m', 250); await click('Extend');
    await setField('length m', 220); await setField('turn °/100m', 30); await setField('bank °', 12); await click('Extend');
    await setField('turn °/100m', 30); await click('Extend');
    await setField('turn °/100m', 0); await setField('bank °', 0); await setField('length m', 180);
    const ext = await at('#palette button', 'Extend'); await mouse('mouseMoved', ext.x, ext.y);   // hover: the ghost of the next piece
    rep.steps.push({ after: 'extend ×3 + hover', info: await info() });
    await shoot('extend-at-head');
    await click('Extend');
    // 2 · A BRUSH: the rate brush on the climb rate, dragged up on the track in the build view (a pick finds a station on screen)
    await setField('on', true);   // the first 'on' is the brush's
    await cdp.evaluate(`(() => { const s = [...document.querySelectorAll('#palette select')].find((x) => x.getAttribute('aria-label') === 'brush mode'); s.value = 'rate'; s.dispatchEvent(new Event('change')); const c = [...document.querySelectorAll('#palette select')].find((x) => x.getAttribute('aria-label') === 'brush channel'); c.value = 'kv'; c.dispatchEvent(new Event('change')); return true; })()`);
    await setField('radius m', 80);
    await key('c'); await sleep(2500);   // the overhead view: the whole track, to pick a station in its middle
    const hit = await cdp.evaluate(`(() => { const st = document.getElementById('preview'), q = st.getBoundingClientRect(); let best = null;
      for (let y = q.height * 0.2; y < q.height * 0.85; y += 12) for (let x = q.width * 0.2; x < q.width * 0.8; x += 12) { let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (r) => { h = r; } } })); if (h && (!best || Math.abs(h.s - 400) < Math.abs(best.s - 400))) best = { x: x + q.left, y: y + q.top, s: h.s }; }
      return best; })()`);
    if (!hit) throw new Error('no track station found under the preview to brush');
    await mouse('mouseMoved', hit.x, hit.y); await mouse('mousePressed', hit.x, hit.y);
    for (let k = 1; k <= 20; k++) { await mouse('mouseMoved', hit.x, hit.y - k * 12, { buttons: 1 }); await sleep(40); }
    await mouse('mouseReleased', hit.x, hit.y - 240);
    await key('c'); await sleep(2500);   // the side view: the climb the brush made shows in profile
    rep.steps.push({ after: `brush at s ${hit.s}`, info: await info() });
    await shoot('brush');
    // 3 · THE WATER: close the loop, pour at 250 km/h, the overhead view
    await setField('on', false);
    await click('Close the loop'); await sleep(1500);
    await cdp.evaluate(`(() => { const l = [...document.querySelectorAll('#palette label')].filter((x) => x.firstChild && x.firstChild.textContent === 'on')[1]; const i = l.querySelector('input'); i.checked = true; i.dispatchEvent(new Event('change')); return true; })()`);
    await sleep(2500);
    await key('b'); await key('c');   // the build view, then overhead
    rep.steps.push({ after: 'close + water', info: await info() });
    await shoot('water');
    cdp.close();
  } catch (e) { rep.error = e.message; } finally {
    clearTimeout(hard); kill(); rep.autosave = restore();
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(rep, null, 1));
    console.log(JSON.stringify({ page: rep.page || null, error: rep.error || null, window: rep.window, shots: Object.fromEntries(Object.entries(rep.shots).map(([k, v]) => [k, { ok: v.capture.ok, drawn: v.capture.drawn, rectPixels: v.capture.rectPixels, mode: v.probe && v.probe.mode, info: v.info }])), steps: rep.steps, autosave: rep.autosave }, null, 1));
  }
})();
