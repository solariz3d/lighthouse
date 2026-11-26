// o_page_r2.js (pane O, L250 second read; scratch, after pane E's e_page_r.js): the branch's REAL page (app/index.html) in headless Chrome with a stand-in
// native side, every action through the panel's own controls (its selects, a nudge box, Show, Clear), what is DRAWN read from the preview itself
// ('t180:reference-request'), every native call logged. Aliases only:
//   "reference N" a layout with no AI line (patch N_PATCH: the road within 40 m of its start, kn5road.rs encode, with its header's start)
//   "reference A" a layout with an AI line (patch A_PATCH as its road; its own fast_lane.ai up to hasGrid as its line, read only from AC)
//   "reference R" a layout whose AI line the native side refuses (reference.rs read_shape's words for a short line)
// Headless per BUILDING.md: the shared launcher (--headless=new, --mute-audio), never focused, title 'zz-headless-test' set first and kept.
// usage: TREE=<tree> PATCH=<patch dir> N_PATCH=<n> A_PATCH=<n> AC=<content\tracks> node o_page_r2.js <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE), PATCH = process.env.PATCH, OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
// list_layouts, as reference.rs orders it (pane E's start_survey.js copy), only to find layout A_PATCH's fast_lane.ai
function listLayouts(tracks) {
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
  const names = fs.readdirSync(tracks).filter((n) => isDir(path.join(tracks, n)));
  names.sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  const out = [];
  for (const t of names) {
    const td = path.join(tracks, t), layouts = [];
    if (isDir(path.join(td, 'ai')) || isFile(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
    try { const ls = fs.readdirSync(path.join(td, 'ui')).filter((l) => isFile(path.join(td, 'ui', l, 'ui_track.json'))); ls.sort(); layouts.push(...ls); } catch (e) { /* no ui */ }
    try { const ls = fs.readdirSync(td).filter((l) => isDir(path.join(td, l, 'ai')) && l !== 'ai' && !layouts.includes(l)); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    if (!layouts.length) layouts.push('');
    for (const l of layouts) out.push(path.join(td, l, 'ai', 'fast_lane.ai'));
  }
  return out;
}
const aiFile = listLayouts(process.env.AC)[Number(process.env.A_PATCH) - 1], raw = fs.readFileSync(aiFile), np = raw.readInt32LE(4), end = 16 + np * 20 + 4 + np * 72 + 4;
const BYTES = { 'road N': fs.readFileSync(path.join(PATCH, `${process.env.N_PATCH}.road`)), 'road A': fs.readFileSync(path.join(PATCH, `${process.env.A_PATCH}.road`)), 'line A': raw.subarray(0, end) };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
(async () => {
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/__o/')) { const b = BYTES[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': 'application/octet-stream' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l250o2-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const out = { steps: [], errors };
  try {
    await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
    const list = [{ track: 'reference A', layout: '', hasAi: true, uiLength: null }, { track: 'reference N', layout: '', hasAi: false, uiLength: null }, { track: 'reference R', layout: '', hasAi: true, uiLength: null }];
    const stand = `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__LIST = ${JSON.stringify(list)}; window.__calls = [];
      window.__TAURI__ = { core: { invoke: (cmd, a) => {
        window.__calls.push(cmd + (a && a.track ? ' ' + a.track.split(' ')[1] : ''));
        if (cmd === 'list_tracks') return Promise.resolve([]);
        if (cmd === 'list_reference_tracks') return Promise.resolve(window.__LIST);
        const who = a && a.track && a.track.split(' ')[1];
        if (cmd === 'read_reference_line') {
          if (who === 'A') return fetch('/__o/line A').then((r) => r.arrayBuffer());
          if (who === 'R') return Promise.reject('the AI line ends at 382736 bytes; its 4160 points need 382744');
          return Promise.reject('no AI line there (The system cannot find the path specified. (os error 3))');
        }
        if (cmd === 'read_reference_road') return fetch('/__o/road ' + who).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject('no kn5 in that folder')));
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    for (let i = 0; i < 3; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
    await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
    const pickSel = "document.querySelector('.reference-panel select.rp-pick')", modeSel = "[...document.querySelectorAll('.reference-panel select')].find((s) => s !== document.querySelector('.reference-panel select.rp-pick'))";
    const change = (sel, v) => ev(`const s = ${sel}; s.value = ${JSON.stringify(v)}; s.dispatchEvent(new Event('change', { bubbles: true })); return s.value;`);
    let mark = 0;
    // one record: the panel's state, what the PREVIEW draws, the select as it stands, and the native calls since the last record
    const rec = async (label, extra = {}) => {
      const r = await ev(`const p = window.__t180Reference(), st = p.state(), s = ${pickSel}, o = s.options[s.selectedIndex];
        let drawn = 'no reply'; document.dispatchEvent(new CustomEvent('t180:reference-request', { detail: { reply: (x) => { drawn = x; } } }));
        return { mode: st.mode, picked: st.picked, kind: st.kind, shown: st.shown, showOn: st.showOn, nudge: st.nudge, error: st.error, readout: st.readout,
          drawn: drawn && typeof drawn === 'object' ? (drawn.kind || 'line') + (drawn.placedBy ? ' placed by ' + drawn.placedBy : '') : drawn,
          select: { value: s.value, selectedIndex: s.selectedIndex, text: o ? o.textContent : null, disabled: o ? o.disabled : null, colour: getComputedStyle(s).color },
          calls: window.__calls.slice(${mark}) };`);
      mark = await ev('return window.__calls.length;');
      out.steps.push({ label, ...r, ...extra }); return r;
    };
    const waitFor = async (cond, ms = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const st = await ev('const st = window.__t180Reference().state(); return { picked: st.picked, kind: st.kind, error: st.error, mode: st.mode };'); if (cond(st)) return true; await sleep(60); } return false; };
    const panelShot = async (name) => { const r = await ev("const b = document.querySelector('.reference-panel').getBoundingClientRect(); return [b.left, b.top, b.width, b.height];");
      fs.writeFileSync(path.join(OUT, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { x: r[0], y: r[1], width: r[2], height: r[3], scale: 2 } })).result.data, 'base64')); };
    const N = 'reference N\u0000', A = 'reference A\u0000', R = 'reference R\u0000';
    await rec('opened (Line)');
    out.optionsLine = await ev(`return [...${pickSel}.options].map((o) => ({ text: o.textContent, disabled: o.disabled }));`);

    // ---- vary 1: N as Road, then Line, then Road ----
    await change(modeSel, 'road'); await sleep(200);
    out.optionsRoad = await ev(`return [...${pickSel}.options].map((o) => ({ text: o.textContent, disabled: o.disabled }));`);
    await change(pickSel, N); await waitFor((s) => s.picked === N && s.kind === 'road'); await rec('1. N picked as Road');
    await change(modeSel, 'line'); await sleep(800); await rec('1. the mode to Line (N held)'); await panelShot('panel_N_held_in_Line.png');
    await change(modeSel, 'road'); await waitFor((s) => s.picked === N && s.kind === 'road'); await rec('1. the mode back to Road');

    // ---- vary 4: the held state ----
    await change(modeSel, 'line'); await sleep(600); await rec('4. held again (Line)');
    await ev("const i = document.querySelector('.reference-panel input[aria-label^=\"move the reference: x\"]'); i.value = '5'; i.dispatchEvent(new Event('change', { bubbles: true })); return true;"); await sleep(300);
    await rec('4a. held, a nudge x = 5 typed in its box');
    await ev("const b = document.querySelector('.reference-panel input[aria-label=\"show the reference\"]'); b.click(); return b.checked;"); await sleep(300); await rec('4b. held, Show off');
    await change(modeSel, 'road'); await waitFor((s) => s.picked === N && s.kind === 'road'); await sleep(200); await rec('4b. Road with Show off');
    await ev("const b = document.querySelector('.reference-panel input[aria-label=\"show the reference\"]'); b.click(); return b.checked;"); await sleep(300); await rec('4b. Show on, in Road');
    await change(modeSel, 'line'); await sleep(500); await ev("const b = document.querySelector('.reference-panel input[aria-label=\"show the reference\"]'); b.click(); return true;"); await sleep(200);
    await ev("const b = document.querySelector('.reference-panel input[aria-label=\"show the reference\"]'); b.click(); return true;"); await sleep(300); await rec('4b. held, Show off and on again');
    await change(modeSel, 'road'); await waitFor((s) => s.picked === N && s.kind === 'road'); await rec('4c. mode change 1 of 2: Road');
    await change(modeSel, 'line'); await sleep(500); await rec('4c. mode change 2 of 2: Line');
    await change(modeSel, 'road'); await waitFor((s) => s.picked === N && s.kind === 'road'); await rec('4c. and Road again');
    // a refused pick while held: N held in Line, then R picked (its line refused); then Road
    await change(modeSel, 'line'); await sleep(500); await rec('4d. held');
    await change(pickSel, R); await waitFor((s) => s.error || s.picked === R); await sleep(200); await rec('4d. R picked while N held: its line refused');
    await change(modeSel, 'road'); await sleep(1200); await rec('4d. then Road');
    // A picked while N is held: A drawn as Line; Road draws A
    await change(pickSel, N); await waitFor((s) => s.picked === N && s.kind === 'road'); await change(modeSel, 'line'); await sleep(500); await rec('4e. N held');
    await change(pickSel, A); await waitFor((s) => s.picked === A && s.kind); await rec('4e. A picked while N held');
    await change(modeSel, 'road'); await waitFor((s) => s.picked === A && s.kind === 'road'); await rec('4e. then Road');
    // Clear while held
    await change(pickSel, N); await waitFor((s) => s.picked === N && s.kind === 'road'); await change(modeSel, 'line'); await sleep(500); await rec('4f. N held');
    await ev("const b = [...document.querySelectorAll('.reference-panel button')].find((x) => x.textContent.trim() === 'Clear'); b.click(); return true;"); await sleep(400); await rec('4f. Clear while held');
    await change(modeSel, 'road'); await sleep(800); await rec('4f. then Road');
    out.title = await ev('return document.title;');
  } finally {
    fs.writeFileSync(path.join(OUT, 'page_r2.json'), JSON.stringify(out, null, 1));
    try { ws.close(); } catch (e) { /* */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e); process.exit(1); });
