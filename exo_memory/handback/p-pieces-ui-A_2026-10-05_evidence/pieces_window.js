// pieces_window.js <exe> <out folder>: the REAL-window check of D240's saved-pieces UI, in OUR build (own target dir), with a DevTools port, a WebView2 profile and an
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
  const k = new Proxy(report.checks, { set(t, p, v) { t[p] = v; step(`CHECK ${String(p)} ${String(JSON.stringify(v)).slice(0, 500)}`); return true; } });
  try {
    A = await launch();
    const shot = async (name) => { const r = await A.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name), Buffer.from(r.data, 'base64')); return name; };
    const mouse = async (x, y, shift) => { const m = shift ? 8 : 0; await A.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, modifiers: m }); await A.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1, modifiers: m }); await A.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', buttons: 0, clickCount: 1, modifiers: m }); await sleep(500); };
    k.start = await A.ev(status);
    k.paste = await A.ev(paste(code)); await sleep(1500); k.afterPaste = await A.ev(status);
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1500);
    // WHERE EACH PIECE IS ON SCREEN (page coordinates): sweep the preview with the preview's own pick, keep the middle-most hit of each piece
    const whereNow = () => A.ev(`(() => { const st = document.getElementById('preview'), r = st.getBoundingClientRect(); let track = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { track = t; } } }));
      const segs = track.segments, ids = []; let acc = 0; const spans = segs.map((g) => { const a = acc; acc += g.length; return { id: g.id, a, b: acc }; });
      const hits = {}; for (let y = 20; y < r.height - 20; y += 8) for (let x = 20; x < r.width - 20; x += 8) { let h = null; document.dispatchEvent(new CustomEvent('t180-pick', { detail: { x, y, reply: (v) => { h = v; } } })); if (!h || !Number.isFinite(h.s) || h.px > 6) continue; if (y + r.top < 215 && x + r.left > 1020) continue; /* the getting-started card is over that corner */ const sp = spans.find((q) => h.s >= q.a && h.s < q.b); if (!sp) continue; (hits[sp.id] = hits[sp.id] || []).push({ x, y, s: h.s, mid: (sp.a + sp.b) / 2 }); }
      const pick = {}; for (const [id, list] of Object.entries(hits)) { list.sort((p, q) => Math.abs(p.s - p.mid) - Math.abs(q.s - q.mid)); pick[id] = { x: list[0].x + r.left, y: list[0].y + r.top, n: list.length }; } return { rect: { left: r.left, top: r.top, w: r.width, h: r.height }, pick }; })()`);
    const where = await whereNow(); k.where = where; step('WHERE ' + JSON.stringify(where.pick));
    if (!where.pick.p2 || !where.pick.p4) throw new Error('the pieces are not both pickable on screen: ' + JSON.stringify(where.pick));
    await shot('1_loaded.png');
    // SELECT with real clicks: p2, then shift-click p4
    await mouse(where.pick.p2.x, where.pick.p2.y, false); k.selectP2 = await A.ev(textOf('selection')); await shot('2_selected_p2.png');
    await mouse(where.pick.p4.x, where.pick.p4.y, true); k.selectP2toP4 = await A.ev(textOf('selection')); await shot('3_selected_run.png');
    // SAVE AS PIECE: the file in the run's pieces folder is the core's text
    await A.ev(`(() => { const i = document.querySelector('[aria-label="piece name"]'); i.value = 'window run'; return true; })()`);
    k.saveClick = await A.ev(click('button', 'Save as piece')); await sleep(1200);
    const pf = path.join(dataDir, 'pieces', 'window run.t180piece');
    const saved = fs.existsSync(pf) ? fs.readFileSync(pf, 'utf8') : null;
    k.saved = { file: !!saved, equalsCore: saved === PC.serialize(PC.saveRun(doc, 1, 3, { name: 'window run' })), parses: !!saved && (() => { try { PC.parse(saved); return true; } catch (e) { return e.message; } })() };
    k.rows = await A.ev(rowsJs); await A.ev(`document.querySelector('[aria-label="saved pieces"]').scrollIntoView({ block: 'center' })`); await sleep(600); await shot('4_library.png');
    // a second save under the same name is refused, and the file is untouched
    k.saveAgain = await A.ev(`(async () => { const i = document.querySelector('[aria-label="piece name"]'); i.value = 'window run'; [...document.querySelectorAll('button')].find((b) => b.textContent === 'Save as piece').click(); await new Promise((r) => setTimeout(r, 900)); return [...document.querySelectorAll('#palette .message')].map((m) => m.textContent).filter(Boolean).join(' | '); })()`);
    k.saveAgainFileSame = fs.readFileSync(pf, 'utf8') === saved;
    // ADD AT HEAD, plain then mirrored
    const count = async () => (await A.ev(status)).info;
    k.before = await count();
    k.addClick = await A.ev(click('button', 'Add at head')); await sleep(1500); k.afterAdd = await count();
    k.mirrorOn = await A.ev(`(() => { const c = document.querySelector('[aria-label="mirror on insert"]'); c.checked = true; return c.checked; })()`);
    k.addMirrorClick = await A.ev(click('button', 'Add at head')); await sleep(1500); k.afterMirror = await count(); k.addMsg = (await A.ev(status)).msg;
    await shot('5_added.png');
    // UNDO twice: back to the five pieces
    for (let i = 0; i < 2; i++) { await A.ev(click('#palette button', 'Undo')); await sleep(900); }
    k.afterUndo = await count();
    // DELETE IN THE MIDDLE: select p3 (a real click), Delete selected shows the preview and writes nothing
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1200);
    const w3 = await whereNow(); await mouse(w3.pick.p3.x, w3.pick.p3.y, false); k.selectP3 = await A.ev(textOf('selection'));
    const bk = path.join(dataDir, 'track-backups'), bkList = () => (fs.existsSync(bk) ? fs.readdirSync(bk) : []);
    k.backupsBefore = bkList();
    k.deleteClick = await A.ev(click('button', 'Delete selected')); await sleep(2500);
    k.preview = await A.ev(textOf('delete preview')); k.previewInfo = await count(); k.backupsDuringPreview = bkList(); await A.ev(`document.querySelector('[aria-label="delete preview"]').scrollIntoView({ block: 'center' })`); await sleep(600); await shot('6b_delete_preview_words.png'); await A.ev(`document.getElementById('palette').scrollTo(0, 0); true`); await sleep(400); await shot('6_delete_preview.png');
    k.applyClick = await A.ev(click('button', 'Apply delete')); await sleep(2500);
    k.afterApply = { info: await count(), msg: (await A.ev(status)).msg, backups: bkList() };
    if (k.afterApply.backups.length) { const f = path.join(bk, k.afterApply.backups[0]); k.backupIsTheTrackBefore = fs.readFileSync(f, 'utf8') === D.serialize(doc) || 'differs: ' + path.basename(f); }
    await shot('7_after_delete.png');
    await A.ev(click('#palette button', 'Undo')); await sleep(1000); k.afterDeleteUndo = await count();
    // DELETE AT THE END: simple, no preview
    await A.ev(`document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }))`); await sleep(1200);
    const w5 = await whereNow(); if (w5.pick.p5) { await mouse(w5.pick.p5.x, w5.pick.p5.y, false); k.selectP5 = await A.ev(textOf('selection')); k.endDelete = await A.ev(click('button', 'Delete selected')); await sleep(1500); k.afterEndDelete = { info: await count(), preview: await A.ev(textOf('delete preview')), msg: (await A.ev(status)).msg }; await A.ev(click('#palette button', 'Undo')); await sleep(900); k.afterEndUndo = await count(); }
    // RENAME and DELETE the library entry
    k.renameClick = await A.ev(click('button', 'Rename')); await sleep(500);
    await A.ev(`(() => { const i = document.querySelector('[aria-label="new name"]'); i.value = 'renamed run'; return true; })()`);
    k.okClick = await A.ev(click('button', 'OK')); await sleep(1200);
    k.afterRename = { files: fs.readdirSync(path.join(dataDir, 'pieces')), rows: await A.ev(rowsJs) };
    k.delClick = await A.ev(`(() => { const b = document.querySelector('[aria-label="delete the saved piece renamed run"]'); b.click(); return 'clicked'; })()`); await sleep(400);
    k.confirmShown = await A.ev(`[...document.querySelectorAll('button')].some((b) => b.textContent === 'Yes, delete')`);
    k.yesClick = await A.ev(click('button', 'Yes, delete')); await sleep(1200);
    k.afterDelete = { files: fs.readdirSync(path.join(dataDir, 'pieces')), rows: await A.ev(rowsJs) }; await shot('8_end.png');
    A.close(); A.kill(); A = null;
  } catch (e) { report.error = e.stack || e.message; step('ERROR ' + report.error); if (A) A.kill(); } finally {
    clearTimeout(hard); await sleep(1500); cleanup();
  }
  console.log(JSON.stringify(report, null, 1));
})().catch((e) => { console.error('pieces_window: ' + e.message); process.exit(1); });
