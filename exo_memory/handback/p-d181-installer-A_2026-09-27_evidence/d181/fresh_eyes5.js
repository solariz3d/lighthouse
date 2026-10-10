// Session 5 (D181), on the REBUILT installer, from a FRESH data folder, following the guide's own five steps:
//   1 place "sakura flow" (the guide: 'try "sakura flow"');  2 place "turn" (the guide: 'e.g. "turn"'), select it in
//   the track list and drag its first handle slider (pointerdown, input, pointerup: the events a real drag makes);
//   3 Close the loop;  4 the colours step: Next;  then name + Save, and 5 Export (its dialog answered, if it can be,
//   by scripts/prove_render_dialog.ps1, process-scoped); then Install to AC into a fake AC folder (root set with the
//   app's own set_ac_root command). PrintWindow captures of the app's window only. No AC launch; see-it read back.
const { spawn, spawnSync } = require('child_process'), path = require('path'), fs = require('fs');
const HERE = __dirname, EXE = path.join(HERE, 'throwaway', 'app', 't180-track-builder.exe'), PORT = 9471, REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const EXPORT_DIR = path.join(HERE, 'export-out'), FAKE_AC = path.join(HERE, 'fake-ac'), SHOTS = path.join(HERE, 'shots'), SHOT_PS = path.join(HERE, '..', 'd180', 'shot.ps1');
fs.mkdirSync(EXPORT_DIR, { recursive: true }); fs.mkdirSync(path.join(FAKE_AC, 'content', 'tracks'), { recursive: true }); fs.mkdirSync(SHOTS, { recursive: true });
const portTaken = () => spawnSync('powershell', ['-NoProfile', '-Command', `[bool](Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue)`], { encoding: 'utf8' }).stdout.trim() === 'True';
function ownerIsOurs(root) {
  const ps = spawnSync('powershell', ['-NoProfile', '-Command', `$l = Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if (-not $l) { 'none' } else { $p = $l.OwningProcess; $c = @(); for ($i = 0; $i -lt 8 -and $p; $i++) { $c += $p; $p = (Get-CimInstance Win32_Process -Filter "ProcessId=$p").ParentProcessId }; $c -join ',' }`], { encoding: 'utf8' }).stdout.trim();
  return ps !== 'none' && ps.split(',').map(Number).includes(root);
}
if (!fs.existsSync(EXE)) { console.log(`no installed exe at ${EXE}: nothing started`); process.exit(1); }
if (portTaken()) { console.log(`port ${PORT} is taken: nothing started`); process.exit(1); }
const child = spawn(EXE, [], { env: { ...process.env, WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${PORT}` }, stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [], note = (s) => { log.push(s); console.log(s); fs.appendFileSync(path.join(HERE, 'fresh_eyes5.progress'), s + '\n'); };
const hardStop = setTimeout(() => { note('HARD TIMEOUT 12 min'); spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); process.exit(2); }, 12 * 60 * 1000);
(async () => {
  let ws;
  try {
    let page = null;
    for (let i = 0; i < 60 && !page; i++) { await sleep(500); try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page'); } catch (e) { /* not up */ } }
    if (!page) throw new Error('no page');
    if (!ownerIsOurs(child.pid)) throw new Error(`port ${PORT} is not the app this script started: not connecting`);
    ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const call = (method, params) => new Promise((res) => { const my = ++id; ws.addEventListener('message', function h(m) { const d = JSON.parse(m.data); if (d.id === my) { ws.removeEventListener('message', h); res(d); } }); ws.send(JSON.stringify({ id: my, method, params })); });
    const errs = []; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.method === 'Runtime.exceptionThrown') errs.push('EXCEPTION ' + String((d.params.exceptionDetails.exception || {}).description || d.params.exceptionDetails.text).split(String.fromCharCode(10)).slice(0, 3).join(' | ')); if (d.method === 'Runtime.consoleAPICalled' && (d.params.type === 'error' || d.params.type === 'warning')) errs.push(d.params.type.toUpperCase() + ' ' + d.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 300)); });
    await call('Runtime.enable', {});
    const ev = async (expr) => { const r = await call('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) return { error: (r.result.exceptionDetails.exception || {}).description || r.result.exceptionDetails.text }; return { value: r.result.result.value }; };
    const shot = (name) => { const out = path.join(SHOTS, `${name}.png`); const r = spawnSync('powershell', ['-NoProfile', '-File', SHOT_PS, '-ProcId', String(child.pid), '-Out', out], { encoding: 'utf8' }); note(`  [shot ${name}: ${r.stdout.trim()}]`); };
    const text = async (sel) => (await ev(`(document.querySelector(${JSON.stringify(sel)}) || {}).innerText || ''`)).value || '';
    const msg = async () => (await ev("(() => { const m = document.querySelector('#palette .message'); return m ? { text: m.textContent, role: m.getAttribute('role'), ok: m.classList.contains('ok') } : null; })()")).value;
    const guide = async () => (await text('.guide-card')).replace(/\n+/g, ' / ').slice(0, 260);
    const state = async () => ({ status: (await text('#status')).trim(), message: await msg(), reds: (await text('#reds')).trim().slice(0, 300), guide: await guide() });
    const click = async (label) => (await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(label)}); if (!b) return 'NO BUTTON'; if (b.disabled) return 'DISABLED'; b.click(); return 'clicked'; })()`)).value;
    await sleep(4000);
    note(`start: ${JSON.stringify(await state())}`); shot('41-start');
    // STEP 1
    note(`1 place "sakura flow": ${await click('sakura flow')}`); await sleep(3000);
    note(`  → ${JSON.stringify(await state())}`); shot('42-step1');
    // STEP 2: a single word, selected in the list, one handle dragged
    note(`2 place "turn": ${await click('turn')}`); await sleep(2500);
    note(`  select it: ${JSON.stringify((await ev("(() => { const li = [...document.querySelectorAll('ol.track li')].reverse().find((x) => /\\bturn$/.test(x.textContent.trim())); if (!li) return 'NO turn IN THE LIST'; li.click(); return li.textContent.trim(); })()")).value)}`);
    await sleep(2000);
    const drag = (await ev(`(async () => {
      const input = document.querySelector('#handles input[type=range]');
      if (!input) return { error: 'no handle slider', handles: (document.querySelector('#handles') || {}).innerText };
      const name = input.dataset.handle, min = Number(input.min), max = Number(input.max), before = Number(input.value);
      const want = before + (max - before) * 0.3;
      input.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 1500));
      input.value = String(want); input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 800));
      const after = Number(input.value);
      input.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      return { name, min, max, before, want, after };
    })()`)).value;
    await sleep(2500);
    note(`  drag the first handle: ${JSON.stringify(drag)}`);
    note(`  → ${JSON.stringify(await state())}`); shot('43-step2');
    // STEP 3
    note(`3 close the loop: ${await click('Close the loop')}`);
    for (let k = 0; k < 45; k++) { await sleep(2000); if (/closed loop/.test((await state()).status) || /not|refus|could/i.test(((await msg()) || {}).text || '')) break; }
    note(`  → ${JSON.stringify(await state())}`); shot('44-step3');
    // STEP 4: reading
    note(`4 the colours step, Next: ${await click('Next')}`); await sleep(1000);
    note(`  → ${JSON.stringify(await state())}`);
    // NAME + SAVE
    note(`name + Save: ${JSON.stringify((await ev("(() => { const n = document.querySelector('#name'); n.value = 'Guided First'; n.dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('#save').click(); return 'clicked'; })()")).value)}`);
    await sleep(2500); note(`  → ${JSON.stringify(await state())}`);
    // STEP 5: EXPORT through the real button
    note(`5 export: ${await click('Export…')}`);
    const dlg = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(REPO, 'scripts', 'prove_render_dialog.ps1'), '-ProcId', String(child.pid), '-Dir', EXPORT_DIR, '-TimeoutSec', '30'], { encoding: 'utf8', timeout: 90000 });
    note(`  the dialog: ${(dlg.stdout || '').trim().slice(0, 240)} ${dlg.error ? dlg.error.code : ''}`);
    for (let k = 0; k < 30; k++) { await sleep(2000); const st = await state(); if (st.message && /exported|not|refus|fail/i.test(st.message.text)) break; }
    note(`  → ${JSON.stringify(await state())}`); shot('45-step5');
    note(`  exported: ${fs.readdirSync(EXPORT_DIR).join(', ') || '(none)'}`);
    // if the dialog is still open, close it with Escape on the page is not possible; the tree kill at the end closes it
    // INSTALL TO AC into the fake AC folder
    note(`set_ac_root: ${JSON.stringify(await ev(`window.__TAURI__.core.invoke('set_ac_root', { path: ${JSON.stringify(FAKE_AC)} }).then((r) => r)`))}`);
    note(`install: ${await click('Install to AC')}`);
    for (let k = 0; k < 90; k++) { await sleep(2000); const t = await text('#install'); if (/installed|not installed|name the track|pick|fail/i.test(t)) break; }
    note(`  install panel: ${(await text('#install')).trim().slice(0, 400)}`); shot('46-installed');
    note(`  fake AC content/tracks: ${fs.readdirSync(path.join(FAKE_AC, 'content', 'tracks')).join(', ') || '(none)'}`);
    note(`install tooltip: ${JSON.stringify((await ev("document.querySelector('#install').title")).value)}`);
    note(`page errors during the session (${errs.length}):`); for (const e of errs) note(`  ${e}`);
    note(`see-it disabled: ${(await ev("[...document.querySelectorAll('button')].find(b => b.textContent === 'See it in Assetto').disabled")).value}`);
  } catch (e) { note(`FAILED: ${e.message}`); }
  finally {
    clearTimeout(hardStop);
    if (ws) ws.close();
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' }); await sleep(3000);
    note(`killed its tree; still running: ${spawnSync('tasklist', ['/FI', `PID eq ${child.pid}`], { encoding: 'utf8' }).stdout.includes(String(child.pid))}`);
    fs.writeFileSync(path.join(HERE, 'fresh_eyes5.log'), log.join('\n') + '\n');
  }
})();
