// hiddenprobe.js <exe> <work>: the hidden launch's proof. Starts <exe> through hidden-launch.ps1 (its own desktop) with the test seams, muted, and a CDP port;
// waits for the page's menus; enumerates its windows on the user's desktop and on t180-measure (winenum.ps1); kills its process tree. Refuses while the
// builder or the game runs.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [, , EXE, WORK] = process.argv, PORT = 9400 + Math.floor(Math.random() * 500), HERE = __dirname;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const running = (n) => execFileSync('tasklist', ['/FO', 'CSV', '/NH'], { encoding: 'utf8' }).toLowerCase().split('\n').filter((l) => l.startsWith(`"${n}"`)).length;
(async () => {
  for (const n of ['t180-track-builder.exe', 'acs.exe']) if (running(n)) { console.log(`STOP: ${n} is running`); process.exit(3); }
  const D = {}; for (const k of ['appdata', 'export', 'steam', 'profile']) { D[k] = path.join(WORK, k); fs.mkdirSync(D[k], { recursive: true }); }
  const env = { ...process.env, T180_TEST_APP_DATA: D.appdata, T180_TEST_EXPORT_FOLDER: D.export, T180_TEST_STEAM_PATH: D.steam, WEBVIEW2_USER_DATA_FOLDER: D.profile,
    WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT} --mute-audio` };
  const out = execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(HERE, 'hidden-launch.ps1'), EXE], { env, encoding: 'utf8' });
  const pid = +/pid (\d+)/.exec(out)[1]; console.log(`launched hidden: pid ${pid}`);
  let ready = 'not ready';
  try {
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      let j; try { j = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); } catch (e) { continue; }
      const page = j.find((t) => t.type === 'page' && /^https?:/.test(t.url)); if (!page) continue;
      const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
      const v = await new Promise((r) => { ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id === 1) r(d.result.result.value); }; ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: "document.documentElement.dataset.menubar + ' ' + document.visibilityState + ' ' + location.href", returnByValue: true } })); });
      ws.close(); ready = v; if (/^ready /.test(v)) break;
    }
    console.log(`page: ${ready}`);
    console.log(execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(HERE, 'winenum.ps1'), String(pid)], { encoding: 'utf8' }).trim());
  } finally {
    try { execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' }); } catch (e) {}
    await sleep(1500); console.log(`after kill: t180-track-builder.exe running ${running('t180-track-builder.exe')}`);
  }
})();
