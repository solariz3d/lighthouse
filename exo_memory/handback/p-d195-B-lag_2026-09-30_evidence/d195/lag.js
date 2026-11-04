// lag.js (pane B, D195): the empty-track preview in the REAL window, OFF-SCREEN. Polls the preview's own drawn view (the 't180:view'
// reply) every few ms: whether it draws at all, how long a wheel notch and a W press take to show, where the camera looks through a ghost
// shown and hidden, a placed piece and Undo, W1 (repeats after B) and per-axis (W+D) on an empty track, and every camera mode.
//   node lag.js --exe <exe> --wt <tree> --out <dir>
'use strict';
const { spawn, spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const { offScreen, cdpConnect, until, sleep } = require('./whelpers.js');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const exe = arg('--exe'), WT = path.resolve(arg('--wt')), out = path.resolve(arg('--out')), PR = require(path.join(WT, 'scripts', 'prove_render.js'));
const J = JSON.stringify;
fs.mkdirSync(out, { recursive: true });

(async () => {
  const port = await PR.freePort(), dataDir = path.join(process.env.APPDATA, JSON.parse(fs.readFileSync(path.join(WT, 'src-tauri', 'tauri.conf.json'), 'utf8')).identifier);
  const restore = PR.guardAutosave(dataDir, out);
  const flags = `--remote-debugging-port=${port} --disable-features=CalculateNativeWinOcclusion --disable-backgrounding-occluded-windows --disable-renderer-backgrounding`;
  const app = spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: flags, WEBVIEW2_USER_DATA_FOLDER: PR.profileDir(out) }, stdio: 'ignore' });
  const kill = () => { if (app.exitCode === null) spawnSync('taskkill', ['/PID', String(app.pid), '/T', '/F'], { stdio: 'ignore' }); };
  const hard = setTimeout(() => { kill(); process.exit(2); }, 400000);
  const R = { exceptions: [] };
  try {
    R.window = await until(async () => { const r = offScreen(app.pid); return r.startsWith('none') ? null : r; }, 'window', 60000);
    const cdp = await cdpConnect(port, Date.now() + 60000, (d) => { if (d.method === 'Runtime.exceptionThrown') R.exceptions.push(`${d.params.exceptionDetails.text} ${((d.params.exceptionDetails.exception || {}).description || '').slice(0, 200)}`); });
    if (!PR.portOwner(port, app.pid).ours) throw new Error('port not ours');
    await cdp.send('Runtime.enable');
    await until(async () => cdp.evaluate(`!!document.querySelector('#preview canvas') && [...document.querySelectorAll('#palette h3')].some((h) => h.textContent === 'Equation track')`), 'builder');
    await sleep(1500);
    const view = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:view', { detail: { reply: res } })); setTimeout(() => res(null), 500); })`);
    const r3 = (a) => a && a.map((x) => +x.toFixed(3));
    const snap = async () => { const v = await view(); return v ? { mode: v.mode, eye: r3(v.pose && v.pose.eye), target: r3(v.pose && v.pose.target), head: r3(v.head && v.head.pos) } : null; };
    const canvasAt = () => cdp.evaluate(`(() => { const q = document.querySelector('#preview canvas').getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`);
    const key = (type, k, code, extra = {}) => cdp.send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0), ...extra });
    const click = (t) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === ${J(t)}); if (!b) return false; b.click(); return true; })()`);
    const hover = (on) => cdp.evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Extend'); b.dispatchEvent(new MouseEvent(${J(on ? 'mouseenter' : 'mouseleave')})); return true; })()`);
    const count = () => cdp.evaluate(`new Promise((res) => { document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => res(t && t.segments ? new Set(t.segments.map((g) => g.id)).size : 0) } })); setTimeout(() => res(-1), 500); })`);
    const moved = (b, n) => !!(n && n.eye && (!b || !b.eye || Math.hypot(...n.eye.map((x, i) => x - b.eye[i])) > 1e-3));
    /** ms from `act` until `changed(before, now)` holds on the drawn view; null if not within `ms`. */
    const latency = async (act, changed, ms = 3000) => { const b = await snap(), t0 = Date.now(); await act(); while (Date.now() - t0 < ms) { const n = await snap(); if (changed(b, n)) return { ms: Date.now() - t0, before: b, after: n }; await sleep(8); } return { ms: null, before: b, after: await snap() }; };
    const mode = async (m) => { await cdp.evaluate(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: ${J(m)} } }))`); await sleep(400); };

    R.empty0 = await snap();
    const c = await canvasAt();
    R.wheel = await latency(() => cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: -100 }), moved);
    R.W = await latency(() => key('keyDown', 'w', 'KeyW'), (b, n) => !!(n && n.mode === 'free' && moved(b, n))); await sleep(300); await key('keyUp', 'w', 'KeyW'); R.afterW = await snap();
    // W1 on the empty track: B back to build; a fresh W takes over; after B again, W's auto-repeats alone must not
    await key('keyDown', 'b', 'KeyB'); await key('keyUp', 'b', 'KeyB'); await sleep(300); const m0 = (await snap()).mode;
    await key('keyDown', 'w', 'KeyW'); await sleep(200); await key('keyUp', 'w', 'KeyW'); await sleep(200); const m1 = (await snap()).mode;
    await key('keyDown', 'b', 'KeyB'); await key('keyUp', 'b', 'KeyB'); await sleep(300);
    for (let i = 0; i < 5; i++) { await key('keyDown', 'w', 'KeyW', { autoRepeat: true }); await sleep(40); }
    await key('keyUp', 'w', 'KeyW'); await sleep(200);
    R.W1 = { afterB: m0, freshW: m1, afterRepeatsOnly: (await snap()).mode };
    // per-axis on the empty track: W then D held together, in free
    await key('keyDown', 'w', 'KeyW'); await sleep(150); const a = await snap(); await key('keyDown', 'd', 'KeyD'); await sleep(400); const b2 = await snap();
    await key('keyUp', 'd', 'KeyD'); await key('keyUp', 'w', 'KeyW');
    R.perAxis = { mode: b2 && b2.mode, movedWhileWD: a && b2 && a.eye && b2.eye ? +Math.hypot(...b2.eye.map((x, i) => x - a.eye[i])).toFixed(3) : null };
    R.modes = {};
    for (const m of ['build', 'overhead', 'side', 'chase', 'free']) { await mode(m); const s = await snap(); R.modes[m] = s && s.eye ? (s.eye.every(Number.isFinite) ? 'draws' : 'NaN') : 'no pose'; }
    await mode('build'); await sleep(1500);
    R.buildEmpty = await snap();
    await hover(true); await sleep(1200); R.ghostOn = await snap();
    await hover(false); await sleep(1500); R.ghostOff = await snap();
    const n0 = await count(); await click('Extend'); await until(async () => (await count()) === n0 + 1, 'placed', 10000); await sleep(2000); R.placed = await snap();
    await hover(true); await sleep(800); await hover(false); await sleep(1500); R.placedGhostOff = await snap();
    await click('Undo'); await until(async () => (await count()) === n0, 'undone', 10000); await sleep(2000); R.undone = await snap();
    const shot = path.join(out, 'empty-after-undo.png');
    spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(WT, 'scripts', 'prove_render.ps1'), '-ProcId', String(app.pid), '-Out', shot], { encoding: 'utf8', timeout: 60000 });
    R.shot = fs.existsSync(shot) ? path.basename(shot) : null;
    cdp.close();
  } catch (e) { R.error = e.stack || e.message; } finally {
    clearTimeout(hard); kill(); R.autosave = restore();
    fs.writeFileSync(path.join(out, 'report.json'), J(R, null, 1)); console.log(J(R));
  }
})();
