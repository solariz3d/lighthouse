// wv583.js <built exe> <work dir> <track file> [steps]: D583, the BUILT app under WebView2 on a long track, with the JS heap of every isolate sampled each second.
// Seams as wv582.js (D582): T180_TEST_APP_DATA (the track is COPIED into <work>/appdata/tracks), T180_TEST_EXPORT_FOLDER, T180_TEST_STEAM_PATH (a fake Steam
// with a fake Assetto Corsa: <work>/steam/steamapps/common/assettocorsa/content/tracks), WEBVIEW2_USER_DATA_FOLDER, and a CDP port. Refuses to start while
// t180-track-builder.exe or acs.exe runs; kills only the process it started.
//   steps (comma list, default open,export,install): open = File ▸ Open… the track, wait until every isolate's heap is still for 20 s (the load);
//   export = File ▸ Export… into the seam folder; install = Export to Assetto Corsa into the fake AC.
// Every second: Runtime.getHeapUsage of the page and of each attached worker / frame (usedSize), and the sum; a crash of any target (Inspector.targetCrashed,
// Target.targetCrashed, a session detached while working) is recorded with the time. Writes <work>/wv583.json and a samples CSV.
'use strict';
require('./winhide.js');   // D614 (A's copy): every child process hidden
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const [, , EXE, WORK, TRACK, STEPS = 'open,export,install'] = process.argv;
const PORT = 9400 + Math.floor(Math.random() * 500);   // a port of its own each run: a WebView2 left from the last run must not answer for this one
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tasklist = () => execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' }).toLowerCase();
const running = (name) => tasklist().split('\n').filter((l) => l.startsWith(`"${name}"`)).length;
const out = { started: new Date().toISOString(), exe: EXE, track: TRACK, steps: [], marks: [], crashes: [], pageErrors: [], targets: {}, samples: [] };
const save = () => { fs.writeFileSync(path.join(WORK, 'wv583.json'), JSON.stringify({ ...out, samples: undefined, nSamples: out.samples.length }, null, 2)); fs.writeFileSync(path.join(WORK, 'wv583-samples.csv'), out.samples.map((s) => [s.t, s.mark, s.sum, ...Object.entries(s.by).map(([k, v]) => `${k}=${v}`)].join(',')).join('\n')); };
const MB = (b) => Math.round(b / 1048576);
const keepAlive = setInterval(() => {}, 1000);
process.on('unhandledRejection', (e) => { console.log('UNHANDLED ' + String(e && e.stack || e).slice(0, 400)); });
process.on('exit', (c) => { try { out.exitCode = c; save(); } catch (e) {} console.log('exit ' + c); });
(async () => {
  for (const n of ['t180-track-builder.exe', 'acs.exe']) if (running(n)) { console.log(`STOP: ${n} is running; nothing launched`); process.exit(3); }
  const D = {}; for (const k of ['appdata', 'export', 'steam', 'profile']) { D[k] = path.join(WORK, k); fs.mkdirSync(D[k], { recursive: true }); }
  const acTracks = path.join(D.steam, 'steamapps', 'common', 'assettocorsa', 'content', 'tracks'); fs.mkdirSync(acTracks, { recursive: true });
  fs.mkdirSync(path.join(D.appdata, 'tracks'), { recursive: true });
  const base = path.basename(TRACK); fs.copyFileSync(TRACK, path.join(D.appdata, 'tracks', base));
  const undo = TRACK.replace(/\.t180track$/, '.t180undo'); if (fs.existsSync(undo)) fs.copyFileSync(undo, path.join(D.appdata, 'tracks', path.basename(undo)));
  const name = base.replace(/^eq-/, '').replace(/\.t180track$/, '');
  if (fs.readdirSync(D.export).length) throw new Error('the export folder is not empty');
  const env = { ...process.env, T180_TEST_APP_DATA: D.appdata, T180_TEST_EXPORT_FOLDER: D.export, T180_TEST_STEAM_PATH: D.steam,
    WEBVIEW2_USER_DATA_FOLDER: D.profile, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT} --mute-audio` };
  // NEVER ON THE USER'S SCREEN (the chair, 2026-10-31: a visible run was taken for his own builder): the app starts on a desktop of its own
  // (hidden-launch.ps1: CreateDesktop, then CreateProcess with lpDesktop), muted; right after, winenum.ps1 must find none of its windows on the user's desktop
  const launched = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'hidden-launch.ps1'), EXE], { env, encoding: 'utf8' });
  const child = { pid: Number(/pid (\d+)/.exec(launched)[1]) };
  out.pid = child.pid; console.log(`launched pid ${child.pid}; track ${name}`);
  let ws, sampler = null, mark = 'launch';
  const kill = () => {
    try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) { /* gone */ }
    // and any WebView2 process left on THIS run's own profile folder (only ours: the profile path is this run's)
    try { execFileSync('powershell', ['-NoProfile', '-Command', `$p = '${D.profile.replace(/'/g, "''")}'; Get-CimInstance Win32_Process -Filter "Name='msedgewebview2.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($p) } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`], { stdio: 'ignore' }); } catch (e) { /* none */ }
  };
  const T0 = Date.now(), at = () => ((Date.now() - T0) / 1000).toFixed(1);
  try {
    try { execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${child.pid}).PriorityClass = 'BelowNormal'`], { stdio: 'ignore' }); } catch (e) { /* best effort */ }
    let page = null;
    for (let i = 0; i < 120 && !page; i++) { await sleep(500); try { const j = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); page = j.find((t) => t.type === 'page' && /^https?:\/\//.test(t.url)); } catch (e) { /* not yet */ } }   // the app's page, not the about:blank before it navigates (reloading that cancels the app's own load)
    if (!page) throw new Error('no page target on the CDP port');
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const pend = new Map(), sessions = new Map();
    let closed = false; ws.onclose = (e) => { closed = true; let alive = '?'; try { alive = tasklist().includes('"' + child.pid + '"') ? 'alive' : 'GONE'; } catch (x) {} let procs = ''; try { procs = execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' }).split('\n').filter((l) => /msedgewebview2|t180/i.test(l)).length; } catch (x) {} out.crashes.push({ t: at(), what: `the CDP socket closed: code ${e && e.code} reason ${e && e.reason} clean ${e && e.wasClean}; app pid ${alive}; webview/t180 processes ${procs}`, mark }); console.log('SOCKET CLOSED ' + JSON.stringify(out.crashes[out.crashes.length - 1])); };
    const send = (method, params = {}, sessionId, timeoutMs = 30000) => new Promise((res, rej) => { if (closed) { rej(new Error('socket closed')); return; } const i = ++id; const to = setTimeout(() => { pend.delete(i); rej(new Error(`timeout ${method}`)); }, timeoutMs); pend.set(i, { res: (v) => { clearTimeout(to); res(v); }, rej: (e) => { clearTimeout(to); rej(e); } }); ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) })); });
    ws.onmessage = async (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pend.has(msg.id)) { const p = pend.get(msg.id); pend.delete(msg.id); msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result); return; }
      const where = msg.sessionId ? (sessions.get(msg.sessionId) || {}).label || msg.sessionId.slice(0, 6) : 'page';
      if (msg.method === 'Inspector.targetCrashed') out.crashes.push({ t: at(), what: `${where}: target crashed`, mark });
      if (msg.method === 'Target.targetCrashed') out.crashes.push({ t: at(), what: `target crashed ${msg.params.targetId.slice(0, 8)} status ${msg.params.status} code ${msg.params.errorCode}`, mark });
      if (msg.method === 'Runtime.exceptionThrown') out.pageErrors.push(`${at()} ${where}: ${(msg.params.exceptionDetails.exception || {}).description || msg.params.exceptionDetails.text}`.slice(0, 300));
      if (msg.method === 'Target.detachedFromTarget') { const s = sessions.get(msg.params.sessionId); if (s) { s.gone = at(); out.marks.push({ t: at(), mark: `detached ${s.label}` }); } }
      if (msg.method === 'Target.attachedToTarget') {
        const s = msg.params.sessionId, ti = msg.params.targetInfo, label = `${ti.type}:${(ti.url.split('/').pop() || ti.url).slice(0, 30) || 'about'}#${sessions.size}`;
        sessions.set(s, { label, type: ti.type }); out.targets[label] = at();
        try { await send('Runtime.enable', {}, s); await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, s); } catch (e) { /* short-lived */ }
        try { await send('Runtime.runIfWaitingForDebugger', {}, s); } catch (e) { /* gone */ }
      }
    };
    const ev = async (expr, ms = 30000) => { const r = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }, undefined, ms); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
    const sample = async () => {
      const by = {}; let sum = 0;
      try { const h = await send('Runtime.getHeapUsage', {}, undefined, 5000); by.page = MB(h.usedSize); sum += h.usedSize; } catch (e) { by.page = 'x'; }
      for (const [s, info] of sessions) { if (info.gone) continue; try { const h = await send('Runtime.getHeapUsage', {}, s, 5000); by[info.label] = MB(h.usedSize); sum += h.usedSize; } catch (e) { by[info.label] = 'x'; } }
      out.samples.push({ t: at(), mark, sum: MB(sum), by }); if (out.samples.length % 10 === 0) console.log(`  ${at()} s ${mark}: ${MB(sum)} MB (${Object.entries(by).map(([k, v]) => k.split(':').pop() + ' ' + v).join(', ')})`);
    };
    const startSampling = () => { if (sampler) return; const loop = async () => { while (sampler && !closed) { const t = Date.now(); await sample(); await sleep(Math.max(0, 1000 - (Date.now() - t))); } }; sampler = true; loop(); };
    const step = async (nm, fn) => { mark = nm; out.marks.push({ t: at(), mark: `begin ${nm}` }); const t0 = Date.now(); try { const r = await fn(); out.steps.push({ name: nm, ok: true, s: (Date.now() - t0) / 1000, result: r }); console.log(`ok   ${nm} (${((Date.now() - t0) / 1000).toFixed(1)} s): ${String(r).slice(0, 220)}`); } catch (e) { out.steps.push({ name: nm, ok: false, s: (Date.now() - t0) / 1000, error: String(e).slice(0, 400) }); console.log(`FAIL ${nm}: ${String(e).slice(0, 300)}`); throw e; } finally { out.marks.push({ t: at(), mark: `end ${nm}` }); save(); } };
    const peakSince = (t) => { const s = out.samples.filter((x) => +x.t >= +t); const p = s.reduce((a, x) => (x.sum > a.sum ? x : a), { sum: 0 }); return p.sum ? `peak ${p.sum} MB at ${p.t} s (${Object.entries(p.by).map(([k, v]) => `${k} ${v}`).join(', ')})` : 'no samples'; };
    await send('Page.enable'); await send('Runtime.enable'); await send('Inspector.enable').catch(() => {});
    await send('Target.setDiscoverTargets', { discover: true }).catch(() => {});
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: "try { localStorage.setItem('t180.guide.done', '1'); } catch (e) {}" });
    await step('launch', async () => {
      // no reload: the driver can attach while the app's first navigation is still in flight, and a reload then reloads about:blank and cancels it
      for (let i = 0; i < 300; i++) { await sleep(200); try { if (await ev("return /^https?:/.test(location.href) && document.documentElement.dataset.menubar === 'ready';", 5000)) return 'menus ready'; } catch (e) { /* loading */ } }
      throw new Error('menus NOT ready');
    });
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;");
    const onUser = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, 'winenum.ps1'), String(child.pid)], { encoding: 'utf8' });
    out.userDesktop = (/windows on the user's desktop: (\d+)/.exec(onUser) || [])[1];
    console.log(`windows on the user's desktop: ${out.userDesktop}`);
    if (out.userDesktop !== '0') throw new Error("a window of this run is on the user's desktop: stopped");
    startSampling(); await sleep(3000);
    const statusText = () => ev("return [document.getElementById('status'), ...document.querySelectorAll('.message'), document.querySelector('.t-install-note')].filter(Boolean).map((e) => e.textContent).join(' | ');", 10000);
    const want = STEPS.split(',');
    if (want.includes('open')) await step('open', async () => {
      const t0 = at();
      const r = await ev(`document.getElementById('m-file').open = true; const head = document.querySelector('#open .menu-list-head'); head.click();
        for (let i = 0; i < 50; i++) { await new Promise((r) => setTimeout(r, 100)); const row = [...document.querySelectorAll('#open .menu-row')].find((x) => x.dataset.value === ${JSON.stringify(name)}); if (row) { row.click(); return 'clicked'; } }
        return 'no row: ' + [...document.querySelectorAll('#open .menu-row, #open .menu-row-none')].map((x) => x.textContent).join('/');`);
      if (r !== 'clicked') throw new Error(r);
      // the load: until the page's head names the track and every isolate's heap has been still (within 40 MB or 3%) for 20 s; at most 900 s
      let still = 0, prev = null, headAt = null;
      for (let i = 0; i < 900 && !closed; i++) {
        await sleep(1000);
        if (!headAt) { try { const h = await ev("return (document.getElementById('name') || {}).value + ' | ' + (document.querySelector('#palette .head') ? document.querySelector('#palette .head').textContent : '');", 5000); if (h.startsWith(name + ' | ') && /closed|open/.test(h)) headAt = at(); } catch (e) { /* busy */ } }
        const s = out.samples[out.samples.length - 1];
        if (i % 10 === 9) console.log(`  [open loop ${i}] headAt ${headAt} still ${still} prev ${prev} last sample ${s ? s.t + ' ' + s.sum : 'none'} closed ${closed}`);
        if (!s) continue;
        still = prev !== null && Math.abs(s.sum - prev) <= Math.max(40, prev * 0.03) ? still + 1 : 0; prev = s.sum;
        if (headAt && still >= 20) return `loaded: head shown at ${(headAt - t0).toFixed(1)} s, still from ${(at() - 20 - t0).toFixed(1)} s; ${peakSince(t0)}; settled ${s.sum} MB (${Object.entries(s.by).map(([k, v]) => `${k} ${v}`).join(', ')})`;
      }
      throw new Error(`no settled load: ${closed ? 'the page went away' : 'timeout'}; ${peakSince(t0)}`);
    });
    const listing = (d) => { const r = []; const walk = (p) => { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); if (fs.statSync(q).isDirectory()) walk(q); else r.push([path.relative(d, q), fs.statSync(q).size]); } }; walk(d); return r; };
    const waitFor = async (t0, ok, limitS) => {
      for (let i = 0; i < limitS && !closed; i++) {
        await sleep(1000);
        if (out.crashes.length) throw new Error(`a target crashed: ${JSON.stringify(out.crashes)}; ${peakSince(t0)}`);
        let msg; try { msg = await statusText(); } catch (e) { continue; }
        if (/not exported|refus|failed|could not|out of memory|stopped/i.test(msg)) throw new Error(`${msg.slice(0, 300)}; ${peakSince(t0)}`);
        const r = ok(msg); if (r) return `${r}; ${peakSince(t0)}`;
      }
      throw new Error(`${closed ? 'the page went away' : 'timeout'}; crashes ${JSON.stringify(out.crashes)}; ${peakSince(t0)}`);
    };
    if (want.includes('export')) await step('export', async () => {
      const t0 = at(), n0 = listing(D.export).length;
      await ev("document.getElementById('export').click(); return true;");
      return waitFor(t0, (msg) => (/exported /.test(msg) && listing(D.export).length > n0 ? `${msg.slice(0, 140)} | files ${listing(D.export).length - n0}, kn5 ${(listing(D.export).find(([p]) => p.endsWith('.kn5')) || [0, 0])[1]} B` : null), 1500);
    });
    if (want.includes('install')) await step('install', async () => {
      const t0 = at();
      await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Export to Assetto Corsa'); if (!b) throw new Error('no install button'); b.click(); return true;");
      return waitFor(t0, (msg) => { const got = listing(acTracks); return /exported|installed|written/i.test(msg) && got.some(([p]) => p.endsWith('.kn5')) ? `${msg.slice(0, 160)} | files ${got.length}, kn5 ${(got.find(([p]) => p.endsWith('.kn5')) || [0, 0])[1]} B` : null; }, 1500);
    });
    sampler = null; await sleep(1200);
    out.files = { export: listing(D.export), ac: listing(acTracks) };
    console.log(`crashes ${out.crashes.length}; page errors ${out.pageErrors.length}; samples ${out.samples.length}; overall ${peakSince(0)}`);
  } catch (e) { out.fatal = String(e).slice(0, 600); console.log('FATAL ' + out.fatal); process.exitCode = 1; }
  finally { sampler = null; try { ws && ws.close(); } catch (e) { /* closed */ } kill(); await sleep(1500); out.leftRunning = running('t180-track-builder.exe'); save(); console.log(`killed pid ${out.pid}; t180-track-builder.exe left running: ${out.leftRunning}`); clearInterval(keepAlive); }
})();
