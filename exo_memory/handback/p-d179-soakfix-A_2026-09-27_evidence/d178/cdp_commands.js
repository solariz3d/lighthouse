// Start the INSTALLED app once with WebView2's remote debugging on a local port, call only READ-ONLY native commands
// through the page's own __TAURI__.core.invoke, print their SHAPES (never a value that could be a path), and kill the
// app's own process tree. The launch command (see_it_in_assetto) and every writing command are NOT called.
const { spawn, spawnSync } = require('child_process'), path = require('path');
const exe = path.join(__dirname, 'throwaway3', 'app', 't180-track-builder.exe'), PORT = 9471;   // checked free before the start; 9333 is another seat's headless Edge
// Only a debugger port owned by a DESCENDANT of the app this script started is ever connected to.
function ownerIsOurs(port, root) {
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', `$l = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if (-not $l) { 'none' } else { $p = $l.OwningProcess; $chain = @(); for ($i = 0; $i -lt 8 -and $p; $i++) { $chain += $p; $p = (Get-CimInstance Win32_Process -Filter "ProcessId=$p").ParentProcessId }; $chain -join ',' }`], { encoding: 'utf8' }).stdout.trim();
  return ps !== 'none' && ps.split(',').map(Number).includes(root);
}
if (spawnSync('powershell', ['-NoProfile', '-Command', `[bool](Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue)`], { encoding: 'utf8' }).stdout.trim() === 'True') { console.log(`port ${PORT} is taken before the start: nothing started`); process.exit(1); }
const child = spawn(exe, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT}` }, stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shape = (v) => (v === null ? 'null' : Array.isArray(v) ? `array(${v.length})` : typeof v === 'string' ? `string(${v.length} chars)` : `${typeof v}: ${JSON.stringify(v)}`);
(async () => {
  try {
    let page = null;
    for (let i = 0; i < 40 && !page; i++) { await sleep(500); try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch (e) { /* not up yet */ } }
    if (!page) throw new Error('no debuggable page came up');
    if (!ownerIsOurs(PORT, child.pid)) throw new Error(`port ${PORT} is not held by the app this script started: not connecting`);
    const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const call = (method, params) => new Promise((res) => { const my = ++id; ws.addEventListener('message', function h(m) { const d = JSON.parse(m.data); if (d.id === my) { ws.removeEventListener('message', h); res(d); } }); ws.send(JSON.stringify({ id: my, method, params })); });
    await sleep(3000);
    const ev = async (expr) => { const r = await call('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result.exceptionDetails ? { error: r.result.exceptionDetails.exception ? r.result.exceptionDetails.exception.description || r.result.exceptionDetails.exception.value : r.result.exceptionDetails.text } : { value: r.result.result.value }; };
    console.log('page:', page.url.replace(/^.*\/\/[^/]+/, ''));
    console.log('title:', JSON.stringify((await ev('document.title')).value));
    for (const cmd of ['get_see_it_setting', 'get_ac_root', 'list_tracks']) {
      const r = await ev(`window.__TAURI__.core.invoke('${cmd}')`);
      console.log(`${cmd}:`, r.error ? `ERROR ${String(r.error).slice(0, 160)}` : shape(r.value));
    }
    console.log('see-it button disabled:', (await ev("[...document.querySelectorAll('button')].find(b => b.textContent === 'See it in Assetto').disabled")).value);
    console.log('see-it checkbox checked:', (await ev("[...document.querySelectorAll('label')].find(l => /launches the game/.test(l.textContent)).querySelector('input').checked")).value);
    console.log('starter phrases in the palette:', (await ev("[...document.querySelectorAll('button')].filter(b => ['sakura flow','bowl hairpin','S','spiral climb'].includes(b.textContent)).length")).value);
    ws.close();
  } catch (e) { console.log('FAILED:', e.message); }
  finally { spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); await sleep(1500); console.log('killed its tree; still running:', spawnSync('tasklist', ['/FI', `PID eq ${child.pid}`], { encoding: 'utf8' }).stdout.includes(String(child.pid))); }
})();
