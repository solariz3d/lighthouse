// wv582.js <built exe> <work dir>: D582 step 4, the BUILT app under WebView2. Every kept path in <work dir> (the app's test seams: T180_TEST_APP_DATA,
// T180_TEST_EXPORT_FOLDER, T180_TEST_STEAM_PATH, and WEBVIEW2_USER_DATA_FOLDER for the WebView2 profile), a CDP port by WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS.
// Refuses to start while t180-track-builder.exe or acs.exe runs. Drives: launch, one Extend (250 m straight), File ▸ Export… (to the seam folder),
// File ▸ Export for Blender… (the same). Counts CSP violations from the page, its frames and workers (Log, console, securitypolicyviolation), and page
// errors. Then ONE deliberate violation (a cross-origin image) as the instrument's control. Kills only the process it started. Writes <work dir>/wv582.json.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const [, , EXE, WORK] = process.argv;
const PORT = 9387;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tasklist = () => execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' }).toLowerCase();
const running = (name) => tasklist().split('\n').filter((l) => l.startsWith(`"${name}"`)).length;
const out = { started: new Date().toISOString(), exe: EXE, steps: [], csp: [], cspControl: [], pageErrors: [], targets: [] };
const save = () => fs.writeFileSync(path.join(WORK, 'wv582.json'), JSON.stringify(out, null, 2));
(async () => {
  for (const n of ['t180-track-builder.exe', 'acs.exe']) if (running(n)) { console.log(`STOP: ${n} is running; nothing launched`); process.exit(3); }
  const D = {}; for (const k of ['appdata', 'export', 'steam', 'profile']) { D[k] = path.join(WORK, k); fs.mkdirSync(D[k], { recursive: true }); }
  if (fs.readdirSync(D.export).length) throw new Error('the export folder is not empty');
  const env = { ...process.env, T180_TEST_APP_DATA: D.appdata, T180_TEST_EXPORT_FOLDER: D.export, T180_TEST_STEAM_PATH: D.steam,
    WEBVIEW2_USER_DATA_FOLDER: D.profile, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT}` };
  const child = spawn(EXE, [], { env, detached: false, stdio: 'ignore' });
  out.pid = child.pid; console.log(`launched pid ${child.pid}`);
  let ws;
  const kill = () => { try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) { /* gone */ } };
  try {
    try { execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${child.pid}).PriorityClass = 'BelowNormal'`], { stdio: 'ignore' }); } catch (e) { /* best effort */ }
    let page = null;
    for (let i = 0; i < 120 && !page; i++) { await sleep(500); try { const j = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); page = j.find((t) => t.type === 'page'); } catch (e) { /* not yet */ } }
    if (!page) throw new Error('no page target on the CDP port');
    out.pageUrl = page.url;
    ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const pend = new Map();
    const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pend.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) })); });
    const isCsp = (t) => /Content Security Policy|Content-Security-Policy|Refused to (load|execute|apply|connect|create|frame|evaluate)/i.test(t || '');
    let control = false;
    const note = (where, text) => { (control ? out.cspControl : out.csp).push(`${where}: ${String(text).slice(0, 300)}`); };
    ws.onmessage = async (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pend.has(msg.id)) { const p = pend.get(msg.id); pend.delete(msg.id); msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result); return; }
      const where = msg.sessionId ? `session ${msg.sessionId.slice(0, 6)}` : 'page';
      if (msg.method === 'Log.entryAdded') (out.console = out.console || []).push(`${where} log ${msg.params.entry.level} ${msg.params.entry.source}: ${String(msg.params.entry.text).slice(0, 300)}${msg.params.entry.url ? ' <' + msg.params.entry.url + '>' : ''}`);
      if (msg.method === 'Runtime.consoleAPICalled') (out.console = out.console || []).push(`${where} console.${msg.params.type}: ${msg.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300)}`);
      if (msg.method === 'Log.entryAdded' && (msg.params.entry.source === 'security' || isCsp(msg.params.entry.text))) note(where, msg.params.entry.text);
      if (msg.method === 'Runtime.consoleAPICalled') { const t = msg.params.args.map((a) => a.value || a.description || '').join(' '); if (isCsp(t)) note(where, t); }
      if (msg.method === 'Runtime.exceptionThrown') out.pageErrors.push(`${where}: ${(msg.params.exceptionDetails.exception || {}).description || msg.params.exceptionDetails.text}`.slice(0, 300));
      if (msg.method === 'Target.attachedToTarget') {
        const s = msg.params.sessionId; out.targets.push(`${msg.params.targetInfo.type} ${msg.params.targetInfo.url.slice(0, 80)}`);
        try { await send('Runtime.enable', {}, s); await send('Log.enable', {}, s); await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true }, s); } catch (e) { /* a short-lived worker */ }
        try { await send('Runtime.runIfWaitingForDebugger', {}, s); } catch (e) { /* gone */ }
      }
    };
    const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result.value; };
    const step = async (name, fn) => { const t0 = Date.now(); try { const r = await fn(); out.steps.push({ name, ok: true, ms: Date.now() - t0, result: r }); console.log(`ok   ${name}: ${String(r).slice(0, 200)}`); } catch (e) { out.steps.push({ name, ok: false, error: String(e).slice(0, 400) }); console.log(`FAIL ${name}: ${String(e).slice(0, 300)}`); throw e; } finally { save(); } };
    await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true });
    await send('Page.addScriptToEvaluateOnNewDocument', { source: "try { localStorage.setItem('t180.guide.done', '1'); } catch (e) {} window.__cspv = []; document.addEventListener('securitypolicyviolation', (e) => window.__cspv.push(e.violatedDirective + ' ' + e.blockedURI));" });
    await step('launch (reloaded under the instruments)', async () => {
      await send('Page.reload', { ignoreCache: true });
      for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) return `menus ready; ${await ev('return location.href;')}`; } catch (e) { /* loading */ } }
      throw new Error('menus NOT ready');
    });
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;");
    const field = (label, v) => `{ const lab = [...document.querySelectorAll('#palette *')].find((e) => e.childNodes.length && e.firstChild.nodeType === 3 && e.firstChild.textContent.trim() === ${JSON.stringify(label)}); const i = lab && (lab.querySelector('input') || lab.parentElement.querySelector('input:not([type=checkbox])')); if (!i) throw new Error('no field ' + ${JSON.stringify(label)}); i.value = ${JSON.stringify(String(v))}; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }`;
    await step('one Extend (250 m straight)', async () => {
      const before = await ev("return document.querySelector('#palette .head').textContent;");
      await ev(`${field('turn °', 0)} ${field('length m', 250)} const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); return true;`);
      await sleep(3000);
      const after = await ev("return document.querySelector('#palette .head').textContent;");
      if (after === before) throw new Error(`the head did not change: ${after}`);
      return `${before} -> ${after}`;
    });
    await step('seven more Extends, a square lap (File ▸ Export refuses an open loop)', async () => {
      for (const t of [90, 0, 90, 0, 90, 0, 80]) await ev(`${field('turn °', t)} ${field('length m', t ? 100 : 250)} const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;`);
      await sleep(3000); return ev("return document.querySelector('#palette .head').textContent;");
    });
    await step('Build ▸ Close the loop', async () => {
      const found = await ev("document.querySelector('#m-build summary').click(); await new Promise((r) => setTimeout(r, 200)); const b = [...document.querySelectorAll('#m-build button, #m-build [role=menuitem]')].find((x) => /^Close the loop/.test(x.textContent.trim())); if (!b) return false; b.click(); return true;");
      if (!found) throw new Error('no Close the loop item');
      for (let i = 0; i < 60; i++) { await sleep(500); const h = await ev("return document.querySelector('#palette .head').textContent;"); if (/closed/.test(h) && !/open/.test(h)) return h; }
      throw new Error('the loop did not close: ' + await ev("return document.querySelector('#palette .head').textContent;"));
    });
    const listing = (d) => { const r = []; const walk = (p) => { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); if (fs.statSync(q).isDirectory()) walk(q); else r.push(`${path.relative(D.export, q)} ${fs.statSync(q).size}`); } }; walk(d); return r; };
    await step('File ▸ Export… to the temp folder', async () => {
      const n0 = listing(D.export).length;
      const pre = await ev("const b = document.getElementById('export'); const T = window.__TAURI__; let seam = 'no __TAURI__'; try { seam = T ? await T.core.invoke('test_export_folder') : seam; } catch (e) { seam = 'invoke failed: ' + e; } return { disabled: b.disabled, title: (b.title || '').slice(0, 160), seam, red: (document.getElementById('reds') || {}).textContent ? document.getElementById('reds').textContent.slice(0, 200) : '' };");
      out.exportPre = pre; console.log('export button: ' + JSON.stringify(pre));
      if (pre.disabled) throw new Error('the Export button is disabled: ' + pre.title);
      if (!pre.seam || typeof pre.seam !== 'string' || !/[A-Za-z]:/.test(pre.seam)) throw new Error('the export seam gave no folder (a native dialog would open): ' + JSON.stringify(pre.seam));
      await ev("document.getElementById('export').click(); return true;");
      out.exportSamples = []; for (let i = 0; i < 20; i++) { await sleep(150); out.exportSamples.push(await ev("return document.getElementById('status').textContent + ' || iframes ' + document.querySelectorAll('iframe').length + ' || ' + [...document.querySelectorAll('.message')].map((e) => e.textContent.slice(0, 80)).join(' / ');")); }
      for (let i = 0; i < 60; i++) { await sleep(500); const msg = await ev("return [document.getElementById('status'), ...document.querySelectorAll('.message')].filter(Boolean).map((e) => e.textContent).join(' | ');"); if (/not exported|refus|failed|could not|not closed|close it first/i.test(msg)) throw new Error(msg.slice(0, 300)); if (/exported /.test(msg) && listing(D.export).length > n0) return `${msg.slice(0, 160)} | files ${listing(D.export).length - n0}`; }
      throw new Error(`no export within 120 s; files ${listing(D.export).length - n0}; status ${await ev("return (document.getElementById('status') || {}).textContent || '';")}`);
    });
    await step('File ▸ Export for Blender… to the temp folder', async () => {
      const n0 = listing(D.export).length;
      await ev("document.getElementById('exportblender').click(); return true;");
      for (let i = 0; i < 40; i++) { await sleep(250); if (await ev("return !!document.querySelector('.ask-card');")) break; }
      const card = await ev("const c = document.querySelector('.ask-card'); return c ? c.textContent.slice(0, 200) : null;");
      if (!card) throw new Error('the Export for Blender dialog did not open');
      await ev("const f = document.querySelector('.ask-card .bx-fbx'); if (f) f.checked = false; const b = [...document.querySelectorAll('.ask-card button')].find((x) => x.textContent.trim() === 'Export…'); b.click(); return true;");
      for (let i = 0; i < 240; i++) { await sleep(500); const msg = await ev("return [document.getElementById('status'), ...document.querySelectorAll('.message')].filter(Boolean).map((e) => e.textContent).join(' | ');"); if (/exported for Blender into/.test(msg) && listing(D.export).some((l) => /\.glb /.test(l))) return `${msg.slice(0, 200)} | new files ${listing(D.export).length - n0}`; if (/could not|failed|refus/i.test(msg)) throw new Error(msg.slice(0, 300)); }
      throw new Error('no Blender export within 120 s');
    });
    out.files = listing(D.export);
    out.pageListener = await ev('return window.__cspv;');
    await sleep(1500);
    control = true;
    await step('CONTROL: a deliberate violation (a cross-origin image) is seen', async () => {
      await ev("const i = new Image(); i.src = 'https://example.com/csp-control.png'; document.body.appendChild(i); return true;"); await sleep(2500);
      const l = await ev('return window.__cspv.length;');
      if (!out.cspControl.length && l <= out.pageListener.length) throw new Error('the control violation was NOT seen: the instrument is blind');
      return `seen: ${out.cspControl.length} log line(s), listener ${l - out.pageListener.length}`;
    });
    out.verdict = { cspViolations: out.csp.length + out.pageListener.length, pageErrors: out.pageErrors.length };
    console.log(`CSP violations ${out.csp.length} (log/console) + ${out.pageListener.length} (listener); page errors ${out.pageErrors.length}; targets ${out.targets.length}; files ${out.files.length}`);
  } catch (e) { out.fatal = String(e).slice(0, 500); console.log('FATAL ' + out.fatal); process.exitCode = 1; }
  finally { try { ws && ws.close(); } catch (e) { /* closed */ } kill(); await sleep(1500); out.leftRunning = running('t180-track-builder.exe'); save(); console.log(`killed pid ${out.pid}; t180-track-builder.exe left running: ${out.leftRunning}`); }
})();
