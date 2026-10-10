// d224_window.js: the REAL-window check for the Extend hotfix. Launches OUR build (own target dir) with a DevTools port of our own,
// moves the window off-screen, takes a pixel reading of the preview canvas on the EMPTY track, presses Extend once, waits, takes it again,
// and records every page exception and console error. Never touches the keeper's installed app; the keeper's autosave is put back.
//   node d224_window.js <exe> <out folder>
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const { spawn, spawnSync } = require('child_process');
const PR = require('C:/Users/nname/Desktop/worktrees/a-d224-wt/scripts/prove_render.js');
const [exe, out] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(out, { recursive: true });

function png(buf) {   // minimal PNG decode (8-bit RGB/RGBA, non-interlaced): { w, h, ch, px }
  let o = 8, w = 0, h = 0, ch = 4; const idat = [];
  while (o < buf.length) { const len = buf.readUInt32BE(o), type = buf.toString('latin1', o + 4, o + 8), d = buf.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ch = d[9] === 6 ? 4 : 3; } else if (type === 'IDAT') idat.push(d); o += 12 + len; }
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * ch, px = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) { const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) { const a = x >= ch ? px[y * stride + x - ch] : 0, b = y ? px[(y - 1) * stride + x] : 0, c = x >= ch && y ? px[(y - 1) * stride + x - ch] : 0;
      let v = row[x]; if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1; else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[y * stride + x] = v & 255; } }
  return { w, h, ch, px };
}
/** distinct colours (5-bit per channel) and the share of pixels farther than 12 from the corner pixel's colour (the clear colour) */
function readPixels(b) {
  const p = png(b), bg = [p.px[0], p.px[1], p.px[2]], seen = new Set(); let drawn = 0, n = 0;
  for (let y = 0; y < p.h; y += 2) for (let x = 0; x < p.w; x += 2) { const i = (y * p.w + x) * p.ch, r = p.px[i], g = p.px[i + 1], bl = p.px[i + 2]; n++; seen.add((r >> 3) << 10 | (g >> 3) << 5 | (bl >> 3)); if (Math.abs(r - bg[0]) + Math.abs(g - bg[1]) + Math.abs(bl - bg[2]) > 12) drawn++; }
  return { width: p.w, height: p.h, corner: bg, sampled: n, drawn, drawnShare: +(drawn / n).toFixed(4), distinctColours: seen.size };
}

(async () => {
  const dataDir = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder');
  const restore = PR.guardAutosave(dataDir, out);
  const port = await PR.freePort();
  const env = { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${port}`, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(out) };
  const app = spawn(exe, [], { env, stdio: 'ignore', windowsHide: false });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  const hard = setTimeout(() => { kill(); console.error('hard timeout, killed ' + app.pid); process.exit(2); }, 300000);
  const report = { exe: path.basename(exe), pid: app.pid, started: new Date().toISOString(), errors: [], console: [] };
  try {
    let page = null; const dl = Date.now() + 60000;
    while (!page && Date.now() < dl) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = l.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch (_) {} if (!page) await sleep(300); }
    if (!page) throw new Error('no app page on our DevTools port');
    const owner = PR.portOwner(port, app.pid); if (!owner.ours) throw new Error('DevTools port held by pid ' + owner.pid + ', not ours: refusing to attach');
    const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws')); });
    let id = 0; const pending = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data);
      if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
      if (d.method === 'Runtime.exceptionThrown') { const e = d.params.exceptionDetails; report.errors.push(((e.exception && e.exception.description) || e.text || '').split('\n').slice(0, 3).join(' | ').slice(0, 300)); }
      if (d.method === 'Runtime.consoleAPICalled' && /error|warning/.test(d.params.type)) report.console.push(d.params.type + ': ' + d.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300)); };
    const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (d) => (d.error ? rej(new Error(method + ': ' + d.error.message)) : res(d.result))); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error('page: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text)); return r.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Page.reload', { ignoreCache: true }); await sleep(2500);
    // off-screen: move the app's own window out of view (SetWindowPos); it stays un-minimised so it still renders
    const move = spawnSync('powershell', ['-NoProfile', '-Command', `Add-Type @"\nusing System; using System.Runtime.InteropServices;\npublic class W { [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f); [DllImport("user32.dll")] public static extern bool EnumWindows(EP f, IntPtr l); public delegate bool EP(IntPtr h, IntPtr l); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p); [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h); }\n"@\n$pid0=${app.pid}; $done=0\n[W]::EnumWindows({ param($h,$l) $p=0; [void][W]::GetWindowThreadProcessId($h,[ref]$p); if ($p -eq $pid0 -and [W]::IsWindowVisible($h)) { [void][W]::SetWindowPos($h,[IntPtr]::Zero,-2600,60,1400,860,0x0014); $script:done++ }; $true }, [IntPtr]::Zero) | Out-Null\nWrite-Output $done`], { encoding: 'utf8', timeout: 30000 });
    report.movedOffscreen = (move.stdout || '').trim();
    const rdy = await (async () => { const end = Date.now() + 30000; while (Date.now() < end) { const r = await ev(`(() => ({ canvas: !!document.querySelector('#preview canvas'), extend: [...document.querySelectorAll('button')].some((b) => b.textContent.trim() === 'Extend'), tauri: !!(window.__TAURI__ && window.__TAURI__.core) }))()`); if (r.canvas && r.extend && r.tauri) return r; await sleep(300); } throw new Error('the app did not come up (canvas, Extend, native side)'); })();
    report.ready = rdy;
    await ev(`(() => { const st = document.createElement('style'); st.textContent = '.guide-card{display:none!important}'; document.head.append(st); return true; })()`);
    const rect = await ev(`(() => { const q = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: q.left, y: q.top, width: q.width, height: q.height }; })()`);
    const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale: 1 }, captureBeyondViewport: false }); const b = Buffer.from(r.data, 'base64'); fs.writeFileSync(path.join(out, name + '.png'), b); return readPixels(b); };
    const state = () => ev(`JSON.stringify({ status: (document.getElementById('status') || {}).textContent || '', mode: (document.getElementById('mode') || {}).value, words: document.querySelectorAll('#palette .word, #palette [data-word]').length })`);
    report.before = { state: JSON.parse(await state()), canvas: rect, pixels: await shot('empty-track') };
    // press Extend ONCE: a real mouse event at the button's centre
    const at = await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Extend'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, disabled: b.disabled }; })()`);
    if (at.disabled) throw new Error('Extend is disabled');
    const N = Number(process.env.EXT || 1);   // how many times Extend is pressed (default ONE)
    for (let k = 0; k < N; k++) { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: at.x, y: at.y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); await sleep(1500); }
    report.extendPresses = N;
    await sleep(2000);
    report.after = { state: JSON.parse(await state()), pixels: await shot('after-extend') };
    // the preview's own read-only numbers, when the page exposes them (window hook), else null
    report.afterProbe = await ev(`(() => { try { const c = document.querySelector('#preview canvas'); return { cssWidth: c.clientWidth, cssHeight: c.clientHeight, placeholder: !!document.querySelector('#preview .placeholder'), previewText: (document.querySelector('#preview .placeholder') || {}).textContent || null, errorBanner: [...document.querySelectorAll('#preview [role=alert], #preview .error')].map((x) => x.textContent.slice(0, 200)) }; } catch (e) { return { err: String(e) }; } })()`);
    ws.close();
  } catch (e) { report.error = e.message; } finally { clearTimeout(hard); kill(); report.autosave = restore(); report.ended = new Date().toISOString(); }
  fs.writeFileSync(path.join(out, 'window_report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('d224_window: ' + e.message); process.exit(1); });
