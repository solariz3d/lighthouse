// undoprobe.js (pane B, D242 item 7): REPRODUCE in the real page what Undo leaves in the Extend panel. Serves <root>, opens app/index.html?mode=core in
// Chrome OFF-SCREEN (-12000,-12000) over CDP, and drives the panel as a person does: Extend a 300 m straight; type X (length 120, turn 30, bank 20, bank
// "at start" ticked); read the fields, ticks, readout ("the piece Extend would add") and info line; Extend; Undo; read them all again, and whether a ghost
// is shown; then Extend again and read the info line. No hook into the page: only what is on it.   node undoprobe.js <root> <out.json>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(process.argv[2]), OUT = process.argv[3], WIDTH = 1818, HEIGHT = 1100;
const PORT = 8965 + Math.floor(Math.random() * 300), DBG = 9700 + Math.floor(Math.random() * 300);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// in-page helpers, as a string: find a field by its label text, type into it as a person does (value + input event), click a button by its text
const LIB = `
  window.__p = {
    field: (t) => { const l = [...document.querySelectorAll('label')].find((x) => x.children[0] && x.children[0].textContent.trim() === t); return l && l.querySelector('input, select'); },
    type: (t, v) => { const f = __p.field(t); if (!f) throw new Error('no field ' + t); f.value = String(v); f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); },
    tick: (k, on) => { const b = document.querySelector('input[aria-label="' + k + ' at the start"]'); if (!b) throw new Error('no box ' + k); if (b.checked !== on) b.click(); },
    click: (t) => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent === t && x.offsetParent !== null); if (!b) throw new Error('no button ' + t); b.click(); },
    state: () => {
      const names = ['length m', 'turn °/100m', 'climb °/100m', 'bank °', 'width m', 'cup °'];
      const fields = Object.fromEntries(names.map((n) => [n, __p.field(n) ? __p.field(n).value : null]));
      const ticks = Object.fromEntries([...document.querySelectorAll('input[type=checkbox][aria-label$=" at the start"]')].map((b) => [b.getAttribute('aria-label').replace(' at the start', ''), b.checked]));
      const ro = document.querySelector('[aria-label="the piece Extend would add"]'), info = [...document.querySelectorAll('p, div, span')].find((e) => /\\d+ pieces? · /.test(e.textContent) && e.children.length === 0);
      return { fields, ticks, readout: ro ? ro.textContent.replace(/\\s+/g, ' ').trim() : null, info: info ? info.textContent : null };
    },
  };`;
(async () => {
  await new Promise((r) => srv.listen(PORT, '127.0.0.1', r));
  const udd = fs.mkdtempSync(path.join(os.tmpdir(), 'b-undo-')), chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const proc = cp.spawn(chrome, [`--remote-debugging-port=${DBG}`, `--user-data-dir=${udd}`, '--no-first-run', '--no-default-browser-check', '--window-position=-12000,-12000', `--window-size=${WIDTH + 20},${HEIGHT + 120}`, `http://127.0.0.1:${PORT}/app/index.html?mode=core`], { stdio: 'ignore' });
  try {
    let tab = null; for (let i = 0; i < 60 && !tab; i++) { await sleep(500); try { const l = await (await fetch(`http://127.0.0.1:${DBG}/json`)).json(); tab = l.find((t) => t.type === 'page' && /index\.html/.test(t.url)); } catch (e) { /* not up yet */ } }
    if (!tab) throw new Error('no page tab');
    const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
    let id = 0; const wait = new Map(), errors = [], ghosts = [];
    ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text) + ' ' + String((d.params.exceptionDetails.exception || {}).description || '').slice(0, 200)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async (js) => { const r = await send('Runtime.evaluate', { expression: js, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(js.slice(0, 60) + ': ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result.result.value; };
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
    await send('Page.reload'); await sleep(7000);
    await ev(LIB);
    // a ghost is shown when the preview gets 't180-ghost'; count those and the clears from here on
    await ev(`(() => { window.__g = []; document.addEventListener('t180-ghost', () => __g.push('ghost')); document.addEventListener('t180-ghost-clear', () => __g.push('clear')); return 1; })()`);
    const out = { root: ROOT };
    await ev(`__p.type('length m', 300)`); await ev(`__p.click('Extend')`); await sleep(400);
    out.afterStraight = await ev(`__p.state()`);
    await ev(`__p.type('length m', 120)`); await ev(`__p.type('turn °/100m', 30)`); await ev(`__p.type('bank °', 20)`); await ev(`__p.tick('bank', true)`); await sleep(200);
    out.typedX = await ev(`__p.state()`);
    await ev(`__g.length = 0`); await ev(`__p.click('Extend')`); await sleep(400);
    out.afterExtendX = await ev(`__p.state()`);
    await ev(`__g.length = 0`); await ev(`__p.click('Undo')`); await sleep(400);
    out.afterUndo = await ev(`__p.state()`); out.afterUndo.ghostEvents = await ev(`__g.slice()`);
    out.readoutAfterUndoEqualsTypedX = out.afterUndo.readout === out.typedX.readout;
    await ev(`__p.click('Extend')`); await sleep(400);
    out.afterExtendAgain = await ev(`__p.state()`);
    out.infoAgainEqualsInfoX = out.afterExtendAgain.info === out.afterExtendX.info;
    out.pageErrors = errors; fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    console.log(JSON.stringify(out, null, 1));
    ws.close();
  } finally { proc.kill(); srv.close(); await sleep(500); try { fs.rmSync(udd, { recursive: true, force: true }); } catch (e) { /* the browser still holds it */ } }
})().catch((e) => { console.error('PROBE FAILED', e.message); process.exit(1); });
