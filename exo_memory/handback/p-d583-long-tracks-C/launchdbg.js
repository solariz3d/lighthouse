// launchdbg.js <exe> <work>: launch the built app with the test seams and a CDP port, and print every 2 s for 40 s what the page is: its targets, url,
// readyState, the menubar flag, the head of its text, console errors. Kills only what it started.
'use strict';
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const [, , EXE, WORK] = process.argv, PORT = 9400 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const D = {}; for (const k of ['appdata', 'export', 'steam', 'profile']) { D[k] = path.join(WORK, k); fs.mkdirSync(D[k], { recursive: true }); }
  const child = spawn(EXE, [], { env: { ...process.env, T180_TEST_APP_DATA: D.appdata, T180_TEST_EXPORT_FOLDER: D.export, T180_TEST_STEAM_PATH: D.steam, WEBVIEW2_USER_DATA_FOLDER: D.profile, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT}` }, stdio: 'ignore' });
  console.log('pid', child.pid, 'port', PORT);
  child.on('exit', (c) => console.log('APP EXITED', c));
  const logs = [];
  let ws = null, id = 0; const pend = new Map();
  for (let t = 0; t < 40; t += 2) {
    await sleep(2000);
    let j = []; try { j = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch (e) { console.log(t, 'no CDP yet'); continue; }
    const page = j.find((x) => x.type === 'page');
    if (page && !ws) {
      ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
      ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') logs.push('EXC ' + JSON.stringify(d.params.exceptionDetails).slice(0, 300)); if (d.method === 'Runtime.consoleAPICalled' && /error|warn/.test(d.params.type)) logs.push(d.params.type + ' ' + d.params.args.map((a) => a.value || a.description).join(' ').slice(0, 300)); if (d.method === 'Log.entryAdded') logs.push('LOG ' + d.params.entry.level + ' ' + d.params.entry.text.slice(0, 300)); };
      const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
      ws.send = ws.send.bind(ws); global.send = send;
      await send('Runtime.enable'); await send('Log.enable');
    }
    let st = '';
    if (ws) { const r = await Promise.race([global.send('Runtime.evaluate', { expression: "JSON.stringify({ url: location.href, rs: document.readyState, mb: document.documentElement.dataset.menubar, text: (document.body ? document.body.innerText : '').slice(0, 80) })", returnByValue: true }), sleep(3000).then(() => ({ timeout: true }))]); st = r.timeout ? 'EVAL TIMEOUT' : (r.result && r.result.result ? r.result.result.value : JSON.stringify(r).slice(0, 200)); }
    console.log(t, j.length + ' targets', '::', st);
    while (logs.length) console.log('   ', logs.shift());
  }
  try { execFileSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) {}
  process.exit(0);
})();
