// l249_radius_probe.js (pane E, L249): do skyline.css and skyline-night.css still beat the page's one radius scale anywhere?
// A's index.html (the scale) is not written yet, so a STAND-IN BASE is injected: the radius rules of C's L248 override (R1-R5, C1), with every
// `!important` and the `html:root body` prefix removed, so they sit at the base's own specificity, as A's rules in index.html will. Then the computed
// border-radius of each element the spec's table names is read, per look. Run once on this worktree (AFTER) and once with BEFORE=1, which serves
// the two theme files as they were at c9fe4f1: the control, which must show the old theme radii beating the scale, or the probe proves nothing.
// Headless per BUILDING.md: --headless=new, --mute-audio, never focused, document.title 'zz-headless-test' first and kept. Writes nothing in the tree.
// usage: node l249_radius_probe.js <worktree> <L248 override css>    (BEFORE=1 for the control)
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn, execFileSync } = require('child_process');
const [TREE, OVR] = process.argv.slice(2).map((p) => path.resolve(p));
const BEFORE = process.env.BEFORE === '1';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.css': 'text/css', '.wav': 'audio/wav' };

// the stand-in base: the override's lines 6-31 (the scale and the radius rules), demoted to base specificity
const ovr = fs.readFileSync(OVR, 'utf8').split('\n');
const start = ovr.findIndex((l) => /^\/\* R1, R2/.test(l)), end = ovr.findIndex((l) => /^\/\* P1/.test(l));
if (start < 0 || end < 0) throw new Error('override layout changed: R1 or P1 header not found');
// the override's per-look factor lines (:root[data-theme=...] { --rf }) are dropped and its --rf renamed to the packet's --radius-factor, so the factor
// that drives the scale is the one each theme file sets; SIGIL's 0.5 stays as the base default
const BASE = ovr.slice(start, end).filter((l) => !/^:root\[data-theme=/.test(l)).join('\n')
  .replace(/--rf\b/g, '--radius-factor').replace(/ !important/g, '').replace(/html:root body /g, '').replace(/html:root\[data-theme="([\w-]+)"\] body /g, '[data-theme="$1"] ');
if (/!important/.test(BASE)) throw new Error('stand-in base still carries !important');
if (/data-theme="skyline/.test(BASE)) throw new Error('stand-in base still sets a skyline factor of its own');

const OLD = {};
if (BEFORE) for (const t of ['skyline', 'skyline-night']) OLD[`/app/themes/${t}.css`] = execFileSync('git', ['-C', TREE, 'show', `c9fe4f1:app/themes/${t}.css`]);

// what the spec's table says at factor 1 (briefs/t180_ui_refactor_spec.md §1-§3)
const WANT = [
  ['a panel button (r2)', '#palette button', '4px'],
  ['a menu title (r2)', '.more > summary', '4px'],
  ['a menu (r3)', '.more-menu', '8px'],
  ['a row in a menu (r3 - 8, concentric)', '.more-menu .menu-row', '0px'],
  ['a button in a menu (r3 - 8, concentric)', '.more-menu button', '0px'],
  ['a field (r1)', '#palette input, #side input, input[type="number"]', '2px'],
  ['the left column (square, docked)', '#left', '0px'],
  ['the camera dock (r2)', '#camera [role="toolbar"]', '4px'],
  ['the camera hint (r1)', '#camera p', '2px'],
  ['the HUD strip (r2)', '.preview-hud', '4px'],
  ['the guide card (r3)', '.guide-card', '8px'],
  ['Export (the one capsule)', 'header #install > button', '999px'],
];

async function one(look) {
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (OLD[u]) { s.writeHead(200, { 'content-type': 'text/css' }); s.end(OLD[u]); return; }
    const p = path.normalize(path.join(TREE, u));
    if (!p.startsWith(TREE)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 't180e-l249-'));
  const ch = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', '--window-size=1500,900', 'about:blank'], { stdio: 'ignore' });
  try {
    const portFile = path.join(dir, 'DevToolsActivePort');
    for (let i = 0; i < 200 && !fs.existsSync(portFile); i++) await sleep(50);
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
    let id = 0; const pend = new Map();
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 300)}`); return d.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await ev("document.title = 'zz-headless-test'; return true;");
    const stand = `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      try { window.localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); } catch (e) {}
      window.__TAURI__ = { core: { invoke: () => Promise.resolve(null) } };`;
    await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    const on = await ev("return document.documentElement.getAttribute('data-theme') || 'sigil';");
    if (on !== look) throw new Error(`${look}: the page wore ${on}`);
    // the stand-in base goes in index.html's place: before the theme links, so a theme rule of equal or higher specificity still wins, as in the page
    await ev(`const s = document.createElement('style'); s.id = 'standin-base'; s.textContent = ${JSON.stringify(BASE)};
      const first = document.querySelector('link[rel="stylesheet"][href^="themes/"]'); first.parentNode.insertBefore(s, first); return true;`);
    const got = await ev(`return ${JSON.stringify(WANT)}.map(([what, sel, want]) => { const e = document.querySelector(sel);
      return [what, sel, want, e ? getComputedStyle(e).borderTopLeftRadius : 'NO ELEMENT']; });`);
    const factor = await ev("return getComputedStyle(document.documentElement).getPropertyValue('--radius-factor').trim();");
    return { got, factor };
  } finally { ch.kill(); srv.close(); }
}

(async () => {
  let bad = 0;
  for (const look of ['skyline', 'skyline-night']) {
    const { got, factor } = await one(look);
    console.log(`${BEFORE ? 'BEFORE (c9fe4f1 theme files)' : 'AFTER (this worktree)'} ${look}: --radius-factor = ${factor || '(unset)'}`);
    for (const [what, sel, want, is] of got) { const ok = is === want; if (!ok) bad++; console.log(`  ${ok ? 'ok ' : 'OFF'} ${what}: ${is}${ok ? '' : `  (the scale says ${want}; ${sel})`}`); }
  }
  console.log(`${bad} off the scale`);
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
