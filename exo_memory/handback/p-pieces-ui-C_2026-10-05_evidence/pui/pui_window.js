// pieces_window.js <exe> <out folder>: the REAL-window check of D240's saved-pieces UI, in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
// APP DATA FOLDER of its own (T180_TEST_APP_DATA: F2, the keeper's folder is never the run's). Real mouse clicks (CDP Input.dispatchMouseEvent) select the pieces on the track.
// The keeper's folder is snapshotted before and after (read only); the run refuses to start while any t180-track-builder.exe is running.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/c-piecesui-look-wt/';   // C: my look worktree at 62f5d39
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
  spawnSync('powershell', ['-NoProfile', '-Command', `Add-Type @"\nusing System; using System.Runtime.InteropServices;\npublic class W { [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f); [DllImport("user32.dll")] public static extern bool EnumWindows(EP f, IntPtr l); public delegate bool EP(IntPtr h, IntPtr l); [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p); [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h); }\n"@\n$pid0=${app.pid}\n[W]::EnumWindows({ param($h,$l) $p=0; [void][W]::GetWindowThreadProcessId($h,[ref]$p); if ($p -eq $pid0 -and [W]::IsWindowVisible($h)) { [void][W]::SetWindowPos($h,[IntPtr]::Zero,-2600,60,1400,860,0x0014) }; $true }, [IntPtr]::Zero) | Out-Null`], { encoding: 'utf8', timeout: 30000 });
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


// ── C's NON-AUTHOR attacks on D240's UI (62f5d39). Everything after the set-up above (copied from A's driver) is C's. ─────────────────────────
// track-backups is made a FILE before launch, so the backup that Apply delete writes first CANNOT be written: the refusal path is real.
fs.writeFileSync(path.join(dataDir, 'track-backups'), 'not a folder: the backup must fail');
// a closed lap (6 pieces) and a track with a jump in it, as codes
let lap = extend(D.createDoc('closed lap'), { length: 300, family: 'bowl' });
for (let i = 0; i < 4; i++) lap = extend(lap, { length: Math.PI * 90, transition: 40, targets: { kh: 1 / 180 } });
lap = extend(lap, { length: 60, transition: 40, targets: { kh: 0 } });
lap = require(W + 'src/core/close.js').close(lap).doc;
const lapCode = CODE.coreToCode(lap);
let jump = extend(D.createDoc('jump'), { length: 250, family: 'bowl' }); jump = D.appendPiece(jump, D.flightPiece({ gap: 28, drop: 1.5, land: -2 * Math.PI / 180 }));
jump = extend(jump, { length: 200, transition: 80, targets: { kh: 1 / 300 } }); jump = extend(jump, { length: 150, transition: 60, targets: { kh: 0 } });
const jumpCode = CODE.coreToCode(jump);

(async () => {
  let A = null, cleaned = false;
  const cleanup = () => {
    if (cleaned) return; cleaned = true;
    const keeperAfter = snapshot(keeperDir), kk = new Set([...Object.keys(keeperBefore), ...Object.keys(keeperAfter)]);
    report.keeperFiles = Object.keys(keeperBefore).length; report.keeperChanged = [...kk].filter((x) => keeperBefore[x] !== keeperAfter[x]);
    report.runAppData = Object.keys(snapshot(dataDir)).sort(); report.ended = new Date().toISOString();
    fs.writeFileSync(path.join(out, 'window_report.json'), JSON.stringify(report, null, 1));
  };
  const hard = setTimeout(() => { if (A) A.kill(); report.error = 'hard timeout'; step('HARD TIMEOUT'); setTimeout(() => { cleanup(); process.exit(2); }, 2000); }, 420000);
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 500)}`); return true; } });
  try {
    A = await launch();
    const mouse = async (x, y, shift) => { const m = shift ? 8 : 0; await A.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, modifiers: m }); await A.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1, modifiers: m }); await A.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1, modifiers: m }); await sleep(500); };
    const key = async (kk, mods) => { const vk = { z: 90, y: 89 }[kk], code = { z: 'KeyZ', y: 'KeyY' }[kk]; await A.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: kk, code, windowsVirtualKeyCode: vk, modifiers: mods }); await A.send('Input.dispatchKeyEvent', { type: 'keyUp', key: kk, code, windowsVirtualKeyCode: vk, modifiers: mods }); await sleep(700); };
    const blur = () => A.ev(`(() => { if (document.activeElement) document.activeElement.blur(); return 1; })()`);
    await A.ev(`(() => { const s = document.createElement('style'); s.textContent = '.guide-card{display:none!important}'; document.head.append(s); return 1; })()`);
    const whereNow = async () => { await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1500); return (await A.ev(`(() => { const st = document.getElementById('preview'), r = st.getBoundingClientRect(); let track = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { track = t; } } }));
      const segs = track.segments; let acc = 0; const spans = segs.map((g) => { const a = acc; acc += g.length; return { id: g.id, a, b: acc }; });
      const hits = {}; for (let y = 20; y < r.height - 20; y += 8) for (let x = 20; x < r.width - 20; x += 8) { let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (v) => { h = v; } } })); if (!h || !Number.isFinite(h.s) || h.px > 6) continue;
        const sp = spans.find((q) => h.s >= q.a && h.s < q.b); if (!sp) continue; (hits[sp.id] = hits[sp.id] || []).push({ x, y, s: h.s, mid: (sp.a + sp.b) / 2 }); }
      const pick = {}; for (const [id, list] of Object.entries(hits)) { list.sort((p, q) => Math.abs(p.s - p.mid) - Math.abs(q.s - q.mid)); pick[id] = { x: list[0].x + r.left, y: list[0].y + r.top }; } return pick; })()`)); };
    const sel = () => A.ev(textOf('selection'));
    const st = () => A.ev(status);
    const nPieces = async () => { const m = /(\d+) piece/.exec((await st()).info || ''); return m ? +m[1] : null; };
    const backups = () => { const b = path.join(dataDir, 'track-backups'); return fs.existsSync(b) && fs.statSync(b).isDirectory() ? fs.readdirSync(b) : (fs.existsSync(b) ? 'IS-A-FILE' : []); };

    // ── 1 · THE OPEN TRACK (A's: 5 pieces) ──
    k.paste = await A.ev(paste(code)); await sleep(1500);
    let w = await whereNow(); k.pickable = Object.keys(w);
    if (!w.p2 || !w.p3 || !w.p4) throw new Error('p2/p3/p4 not pickable: ' + JSON.stringify(w));
    // A1 · a selection, then UNDO (real Ctrl+Z on the page), then REDO: the same document comes back, the selection must NOT
    await mouse(w.p2.x, w.p2.y, false); await mouse(w.p4.x, w.p4.y, true); k.a1_selected = await sel();
    await blur(); await key('z', 2); k.a1_afterUndo = { sel: await sel(), pieces: await nPieces() };
    await key('y', 2); k.a1_afterRedo = { sel: await sel(), pieces: await nPieces() };
    await A.ev(`(() => { const i = document.querySelector('[aria-label="piece name"]'); i.value = 'stale'; return 1; })()`);
    k.a1_save = await A.ev(click('button', 'Save as piece')); await sleep(900);
    k.a1_saveMsg = (await st()).msg; k.a1_savedFile = fs.existsSync(path.join(dataDir, 'pieces', 'stale.t180piece'));
    k.a1_delete = await A.ev(click('button', 'Delete selected')); await sleep(600); k.a1_deleteMsg = (await st()).msg; k.a1_piecesAfter = await nPieces();
    // A2 · a selection, then a DIFFERENT change (Extend): Delete must refuse, not delete by stale numbers
    await mouse(w.p2.x, w.p2.y, false); k.a2_selected = await sel();
    await A.ev(click('button', 'Extend')); await sleep(1200); k.a2_afterExtend = { sel: await sel(), pieces: await nPieces() };
    await A.ev(click('button', 'Delete selected')); await sleep(600); k.a2_deleteMsg = (await st()).msg; k.a2_pieces = await nPieces();
    await blur(); await key('z', 2); k.a2_undoExtend = await nPieces();
    // A3 · the delete PREVIEW, Apply while the backup CANNOT be written (track-backups is a file): refused by name, nothing deleted
    w = await whereNow(); await mouse(w.p3.x, w.p3.y, false); k.a3_selected = await sel();
    await A.ev(click('button', 'Delete selected')); await sleep(2500); k.a3_preview = { box: (await A.ev(textOf('delete preview')) || '').slice(0, 300), pieces: await nPieces(), backups: backups() };
    await A.ev(click('button', 'Apply delete')); await sleep(1500); k.a3_applyRefused = { msg: (await st()).msg, pieces: await nPieces(), backups: backups() };
    // then the backup CAN be written: Apply goes through, ONE undo step, and the copy is the track from before
    fs.rmSync(path.join(dataDir, 'track-backups'));
    const beforeText = await A.ev(`(async () => { let c = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { c = t; } } })); return document.getElementById('status').textContent; })()`);
    await A.ev(click('button', 'Apply delete')); await sleep(1500); k.a3_applied = { msg: (await st()).msg, pieces: await nPieces(), backups: backups() };
    await blur(); await key('z', 2); k.a3_oneUndo = await nPieces(); void beforeText;
    // A4 · preview open, then the track changes (Extend): the preview must be dropped, Apply gone
    w = await whereNow(); await mouse(w.p3.x, w.p3.y, false); await A.ev(click('button', 'Delete selected')); await sleep(2500);
    const nb = backups().length;
    await A.ev(click('button', 'Extend')); await sleep(1200);
    k.a4_afterChange = { box: await A.ev(textOf('delete preview')), applyVisible: await A.ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Apply delete'); return !!b && b.style.display !== 'none'; })()`), pieces: await nPieces(), newBackups: backups().length - nb };
    await blur(); await key('z', 2);
    // A5 · CANCEL: nothing changes, no backup written
    w = await whereNow(); await mouse(w.p3.x, w.p3.y, false); await A.ev(click('button', 'Delete selected')); await sleep(2500);
    const nb2 = backups().length, p5 = await nPieces();
    await A.ev(click('button', 'Cancel delete')); await sleep(600); k.a5_cancel = { pieces: [p5, await nPieces()], newBackups: backups().length - nb2, box: await A.ev(textOf('delete preview')) };
    // A6 · RENAME a saved piece to its own name in other case ("Run" → "run"), and to a free name; the files stay in the run's pieces folder
    await mouse(w.p2.x, w.p2.y, false);
    await A.ev(`(() => { const i = document.querySelector('[aria-label="piece name"]'); i.value = 'Run'; return 1; })()`); await A.ev(click('button', 'Save as piece')); await sleep(1200);
    const rename = async (from, to) => { await A.ev(`(() => { const b = document.querySelector('[aria-label="rename ${from}"]'); b.click(); return 1; })()`); await sleep(500); await A.ev(`(() => { const i = document.querySelector('[aria-label="new name"]'); i.value = ${JSON.stringify(to)}; [...document.querySelectorAll('button')].find((x) => x.textContent === 'OK').click(); return 1; })()`); await sleep(1200); return (await st()).msg; };
    k.a6_renameCase = { msg: await rename('Run', 'run'), files: fs.readdirSync(path.join(dataDir, 'pieces')) };
    k.a6_renameFree = { msg: await rename('Run', 'Run2'), files: fs.readdirSync(path.join(dataDir, 'pieces')) };
    await A.ev(`(() => { document.querySelector('[aria-label="delete the saved piece Run2"]').click(); return 1; })()`).catch(() => null); await sleep(400);
    await A.ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === 'Yes, delete'); if (b) b.click(); return !!b; })()`); await sleep(1000);
    k.a6_afterDelete = fs.readdirSync(path.join(dataDir, 'pieces'));

    // ── 2 · THE CLOSED LAP: a shift-click across the start/finish seam ──
    k.b_paste = await A.ev(paste(lapCode)); await sleep(1500);
    w = await whereNow(); k.b_pickable = Object.keys(w);
    const last = `p${lap.pieces.length}`;
    if (w[last] && w.p1) { await mouse(w[last].x, w[last].y, false); await mouse(w.p1.x, w.p1.y, true); k.b_seamSelection = await sel(); }
    await A.ev(click('button', 'Delete selected')); await sleep(600); k.b_deleteMsg = (await st()).msg; k.b_pieces = await nPieces();

    // ── 3 · A TRACK WITH A JUMP: select across the flight, save it, delete across it ──
    k.c_paste = await A.ev(paste(jumpCode)); await sleep(1500);
    w = await whereNow(); k.c_pickable = Object.keys(w);
    if (w.p1 && w.p3) { await mouse(w.p1.x, w.p1.y, false); await mouse(w.p3.x, w.p3.y, true); k.c_selection = await sel();
      await A.ev(`(() => { const i = document.querySelector('[aria-label="piece name"]'); i.value = 'with jump'; return 1; })()`); await A.ev(click('button', 'Save as piece')); await sleep(1200);
      const f = path.join(dataDir, 'pieces', 'with jump.t180piece'); k.c_saved = { msg: (await st()).msg, file: fs.existsSync(f), flights: fs.existsSync(f) ? (fs.readFileSync(f, 'utf8').match(/"type":"flight"/g) || []).length : null };
      await mouse(w.p1.x, w.p1.y, false); await mouse(w.p3.x, w.p3.y, true);
      await A.ev(click('button', 'Delete selected')); await sleep(2500); k.c_delete = { msg: (await st()).msg, box: (await A.ev(textOf('delete preview')) || '').slice(0, 200), pieces: await nPieces() }; }
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); } finally { clearTimeout(hard); if (A) A.kill(); await sleep(1500); cleanup(); }
  console.log(JSON.stringify(report, null, 1));
})();
