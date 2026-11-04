// reloaddbg.js <exe> <work>: wv583.js's launch step alone (attach, Page/Runtime/Log enable, auto-attach, the init script, Page.reload ignoreCache), then
// every second for 30 s: the page targets and what an evaluate in the page returns. Kills what it started.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const [, , EXE, WORK] = process.argv, PORT = 9400 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const D = {}; for (const k of ['appdata', 'export', 'steam', 'profile']) { D[k] = path.join(WORK, k); fs.mkdirSync(D[k], { recursive: true }); }
  const child = spawn(EXE, [], { env: { ...process.env, T180_TEST_APP_DATA: D.appdata, T180_TEST_EXPORT_FOLDER: D.export, T180_TEST_STEAM_PATH: D.steam, WEBVIEW2_USER_DATA_FOLDER: D.profile, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT}` }, stdio: 'ignore' });
  let page = null;
  for (let i = 0; i < 120 && !page; i++) { await sleep(500); try { const j = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); page = j.find((t) => t.type === 'page' && /^https?:\/\//.test(t.url)); } catch (e) {} }
  console.log('page', page && page.url);
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method && !/^(Runtime.console|Log.entry)/.test(d.method)) console.log('   event', d.method, JSON.stringify(d.params).slice(0, 160)); };
  const send = (method, params = {}, ms = 5000) => Promise.race([new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }), sleep(ms).then(() => ({ TIMEOUT: method }))]);
  for (const [m, p] of [['Page.enable'], ['Runtime.enable'], ['Log.enable'], ['Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true }], ['Page.addScriptToEvaluateOnNewDocument', { source: "try { localStorage.setItem('t180.guide.done', '1'); } catch (e) {}" }], ['Page.reload', { ignoreCache: true }]]) {
    const t = Date.now(); const r = await send(m, p || {}); console.log(m, Date.now() - t, 'ms', JSON.stringify(r).slice(0, 160));
  }
  for (let s = 0; s < 30; s++) {
    await sleep(1000);
    const r = await send('Runtime.evaluate', { expression: "(async () => { return document.readyState + ' ' + document.documentElement.dataset.menubar + ' ' + location.href; })()", awaitPromise: true, returnByValue: true }, 3000);
    console.log(s, JSON.stringify(r.result ? r.result.result : r).slice(0, 200));
  }
  try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) {}
  process.exit(0);
})();
