// m5.js (pane C, D187 scratch): E's M5 (and M4 geometric) scored from PrintWindow captures of the REAL app window, launched
// OFF-SCREEN. 5 modes × zoom {1, 0.05, 50}, a 5-piece track placed and E4's ghost (400 m, turn 45 °/100 m, bank 30°) typed.
//   node m5.js --exe <app exe> --wt <worktree> --out <folder>
// Safety as scripts/prove_render.js (its helpers reused): own DevTools port and WebView2 profile, the keeper's autosave backed up
// and put back, the port's owner checked, only the PID this run started is killed. No AC.
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const { readPng, scoreRect } = require('./png.js');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const exe = arg('--exe'), WT = arg('--wt'), out = path.resolve(arg('--out'));
const PR = require(path.join(WT, 'scripts', 'prove_render.js')), CM = require(path.join(WT, 'app', 'camera', 'math.js'));

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
  while (!page && Date.now() < deadline) { try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); page = list.find((t) => t.type === 'page' && /app\/index\.html/.test(t.url)); } catch { /* not up */ } if (!page) await sleep(300); }
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
  const hard = setTimeout(() => { kill(); console.error('hard timeout: killed', app.pid); process.exit(2); }, 600000);
  const rep = { pid: app.pid, port, states: [] };
  try {
    rep.window = await until(async () => { const r = offScreen(app.pid); return r.startsWith('none') ? null : r; }, 'the app window', 60000);
    const cdp = await cdpConnect(port, Date.now() + 60000);
    const owner = PR.portOwner(port, app.pid); if (!owner.ours) throw new Error(`port ${port} is held by pid ${owner.pid}, not the app`);
    await until(() => cdp.evaluate(`!!document.querySelector('#preview canvas') && [...document.querySelectorAll('#palette h3')].some((h) => h.textContent === 'Equation track')`), 'the equation builder');
    const J = JSON.stringify;
    const setField = (label, value) => cdp.evaluate(`(() => { const l = [...document.querySelectorAll('#palette label')].find((x) => x.firstChild && x.firstChild.textContent === ${J(label)}); const i = l.querySelector('input,select'); i.value = ${J(String(value))}; i.dispatchEvent(new Event('input')); i.dispatchEvent(new Event('change')); return true; })()`);
    const at = (text) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent === ${J(text)}); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const mouse = (type, x, y, extra = {}) => cdp.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, ...extra });
    const click = async (text) => { const r = await at(text); if (!r) throw new Error(`no button ${text}`); for (const t of ['mouseMoved', 'mousePressed', 'mouseReleased']) await mouse(t, r.x, r.y); };
    const ev = (name) => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent(${J(name)}, { detail: { reply: res } })); setTimeout(() => res(null), 1500); })`);
    const setMode = (mode) => cdp.evaluate(`(document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: ${J(mode)} } })), true)`);
    const canvasAt = () => cdp.evaluate(`(() => { const q = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const wheel = async (dy, n) => { const c = await canvasAt(); for (let i = 0; i < n; i++) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: dy, modifiers: 8 }); };
    const geo = () => cdp.evaluate(`(() => { const p = document.getElementById('preview').getBoundingClientRect(); const cells = [...document.querySelectorAll('[data-readout]')].map((e) => { const q = e.getBoundingClientRect(); return { k: e.getAttribute('data-readout'), text: e.textContent, x: q.left, y: q.top, w: q.width, h: q.height }; }); return { dpr: devicePixelRatio, stage: [p.left, p.top, p.width, p.height], cells }; })()`);
    for (const [len, turn, bank] of [[250, 0, 0], [220, 30, 10], [220, 30, 10], [300, -20, -8], [180, 0, 0]]) { await setField('length m', len); await setField('turn °/100m', turn); await setField('bank °', bank); await click('Extend'); }
    await setField('length m', 400); await setField('turn °/100m', 45); await setField('bank °', 30);   // E4's ghost
    const shoot = async (mode, zoomAsked) => {
      await sleep(2500);
      // the labels are read BEFORE and AFTER the capture; if they moved (the camera still easing), the capture is taken again, so a
      // label's rect is scored over the pixels it was actually painted on (D187: two base readings of ~1.05 were a moving view)
      let g, view, labels, track, cap, file, tries = 0, still = false;
      const sig = (l) => JSON.stringify(l && l.drawn.map((d) => [d.piece, d.rect.x, d.rect.y]));
      for (; tries < 4 && !still; tries++) {
        if (tries) await sleep(1500);
        g = await geo(); view = await ev('t180:view'); labels = await ev('t180:labels'); track = await ev('t180:track-request');
        file = path.join(out, `${mode}-z${zoomAsked}.png`);
        const r = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(WT, 'scripts', 'prove_render.ps1'), '-ProcId', String(app.pid), '-Out', file], { encoding: 'utf8', timeout: 60000 });
        try { cap = JSON.parse(r.stdout.trim().split('\n').pop()); } catch { cap = { ok: false, reason: r.stderr || r.stdout }; }
        still = sig(await ev('t180:labels')) === sig(labels);
      }
      const st = { mode, zoomAsked, tries, still, capture: { ok: cap.ok, w: cap.width, h: cap.height, clientX: cap.clientX, clientY: cap.clientY, reason: cap.reason }, dpr: g.dpr, stage: g.stage };
      const segs = track && track.segments ? track.segments : [], road = segs.filter((s) => s.kind === 'road'), headId = road.length ? road[road.length - 1].id : null;
      st.headId = headId; st.drawn = labels ? labels.drawn.map((d) => ({ piece: d.piece, rect: d.rect })) : null; st.culled = labels ? labels.culled : null;
      st.headDrawn = !!(labels && labels.drawn.some((d) => d.piece === headId));
      // M4 geometric: the head projected the way labels.js does, then head ± 6 px inside no rect
      if (view && view.pose && view.head) {
        const W = g.stage[2], H = g.stage[3], c = CM.apply(CM.viewProj(view.pose, W / H), view.head.pos);
        const hp = c[3] > 0 ? { x: (c[0] / c[3] * 0.5 + 0.5) * W, y: (1 - (c[1] / c[3] * 0.5 + 0.5)) * H } : null;
        st.headScreen = hp && [Math.round(hp.x), Math.round(hp.y)]; st.headOnScreen = !!(hp && hp.x >= 0 && hp.y >= 0 && hp.x <= W && hp.y <= H);
        st.m4Hit = hp && labels ? labels.drawn.filter((d) => hp.x + 6 > d.rect.x && hp.x - 6 < d.rect.x + d.rect.w && hp.y + 6 > d.rect.y && hp.y - 6 < d.rect.y + d.rect.h).map((d) => d.piece) : null;
        const e = view.pose.eye; st.eyeDist = +Math.hypot(e[0] - view.head.pos[0], e[1] - view.head.pos[1], e[2] - view.head.pos[2]).toFixed(2);
      }
      // (c) overlaps
      const D = st.drawn || []; st.overlaps = [];
      for (let i = 0; i < D.length; i++) for (let j = i + 1; j < D.length; j++) { const a = D[i].rect, b = D[j].rect; if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) st.overlaps.push([D[i].piece, D[j].piece]); }
      if (cap.ok) {
        const img = readPng(file), d = g.dpr, toDev = (x, y, w, h) => ({ x: cap.clientX + x * d, y: cap.clientY + y * d, w: w * d, h: h * d });
        st.labelScores = D.map((l) => ({ piece: l.piece, ...scoreRect(img, toDev(g.stage[0] + l.rect.x, g.stage[1] + l.rect.y, l.rect.w, l.rect.h)) }));
        // a panel cell's box is tight on its text, so its glyphs touch the box's edge: scored with 4 css px of the panel around it
        st.panelScores = g.cells.map((c) => ({ k: c.k, text: c.text, ...scoreRect(img, toDev(c.x - 4, c.y - 4, c.w + 8, c.h + 8)) }));
      }
      rep.states.push(st);
    };
    for (const mode of ['build', 'overhead', 'side', 'chase', 'free']) {
      await setMode(mode); await shoot(mode, 1);
      await wheel(-100, 12); await shoot(mode, 0.05);     // 48 steps of ×1.15 nearer: clamps at ZOOM.min from 1 (in free: flies forward)
      await wheel(100, 40); await shoot(mode, 50);        // 160 steps back: clamps at ZOOM.max (in free: flies back)
      await wheel(-100, 28);                              // back towards zoom 1 for the next mode is not needed: each view keeps its own zoom
    }
    cdp.close();
  } catch (e) { rep.error = e.message; } finally {
    clearTimeout(hard); kill(); rep.autosave = restore();
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(rep, null, 1));
    const f = (x) => (x == null ? '-' : x);
    console.log(JSON.stringify({ error: rep.error || null, window: rep.window, autosave: rep.autosave }));
    for (const s of rep.states) {
      const ls = s.labelScores || [], minC = ls.length ? Math.min(...ls.map((x) => x.contrast)) : null, minH = ls.length ? Math.min(...ls.map((x) => x.inkHeight)) : null;
      const pc = s.panelScores || [];
      console.log(`${s.still ? ' ' : '!'}${s.mode.padEnd(8)} z${String(s.zoomAsked).padEnd(4)} eye ${f(s.eyeDist)} head ${s.headOnScreen ? 'on' : 'OFF'}-screen · drawn ${s.drawn ? s.drawn.length : '-'} culled ${s.culled ? s.culled.length : '-'} · head label ${s.headDrawn ? 'DRAWN' : 'MISSING'} · min contrast ${f(minC)} · min ink ${f(minH)} px · overlaps ${s.overlaps.length} · M4 hits ${s.m4Hit ? s.m4Hit.length : '-'} · panel min contrast ${pc.length ? Math.min(...pc.map((x) => x.contrast)) : '-'} ink ${pc.length ? Math.min(...pc.map((x) => x.inkHeight)) : '-'}`);
    }
  }
})();
