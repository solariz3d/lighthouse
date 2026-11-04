// probe.js (pane B, D235): serve <root>, open app/index.html?mode=<mode> in Chrome OFF-SCREEN (-12000,-12000) over CDP at <width>, and measure EVERY .picker
// field (input not checkbox/radio/file, select): its right edge against the content edge of its section, #left's scrollWidth vs clientWidth, and for each select
// whether its LONGEST option's text (canvas measureText in the select's own font, + 28 px for padding and the arrow) fits its clientWidth.
//   node probe.js <root> <mode core|pieces> <out.json> [width=1818]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(process.argv[2]), MODE = process.argv[3], OUT = process.argv[4], WIDTH = Number(process.argv[5] || 1818), HEIGHT = 1100;
const PORT = 8965 + Math.floor(Math.random() * 300), DBG = 9700 + Math.floor(Math.random() * 300);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  await new Promise((r) => srv.listen(PORT, '127.0.0.1', r));
  const udd = fs.mkdtempSync(path.join(os.tmpdir(), 'b-scroll-')), chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const proc = cp.spawn(chrome, [`--remote-debugging-port=${DBG}`, `--user-data-dir=${udd}`, '--no-first-run', '--no-default-browser-check', '--window-position=-12000,-12000', `--window-size=${WIDTH + 20},${HEIGHT + 120}`, `http://127.0.0.1:${PORT}/app/index.html?mode=${MODE}`], { stdio: 'ignore' });
  try {
    let tab = null; for (let i = 0; i < 60 && !tab; i++) { await sleep(500); try { const l = await (await fetch(`http://127.0.0.1:${DBG}/json`)).json(); tab = l.find((t) => t.type === 'page' && /index\.html/.test(t.url)); } catch (e) { /* not up yet */ } }
    if (!tab) throw new Error('no page tab');
    const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
    let id = 0; const wait = new Map(), errors = []; ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text) + ' ' + String((d.params.exceptionDetails.exception || {}).description || '').slice(0, 200)); };
    const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Runtime.enable'); await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
    await send('Page.reload'); await sleep(7000);
    const js = `(() => {
      const left = document.getElementById('left'); if (!left) return { error: 'no #left' };
      const ctx = document.createElement('canvas').getContext('2d');
      const contentRight = (e) => { const s = e.closest('section, #palette, aside'); if (!s) return null; const r = s.getBoundingClientRect(), cs = getComputedStyle(s); return r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth || 0); };
      const els = [...document.querySelectorAll('label.picker')].flatMap((l) => [...l.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=file]), select')]).filter((e) => e.offsetParent !== null);
      const fields = els.map((e) => { const r = e.getBoundingClientRect(), lab = e.closest('label'), name = (lab && lab.children[0] && lab.children[0].textContent) || e.getAttribute('aria-label') || e.tagName, cr = contentRight(e);
        const o = { name: name.slice(0, 22), tag: e.tagName.toLowerCase(), right: Math.round(r.right * 10) / 10, width: Math.round(r.width), contentRight: cr == null ? null : Math.round(cr * 10) / 10 };
        o.over = cr == null ? null : Math.round((r.right - cr) * 10) / 10;
        if (e.tagName === 'SELECT') { const cs = getComputedStyle(e); ctx.font = cs.font; const texts = [...e.options].map((x) => x.text), widths = texts.map((t) => ctx.measureText(t).width), k = widths.indexOf(Math.max(...widths, 0));
          o.longest = texts[k] || ''; o.longestPx = Math.round(widths[k] || 0); o.clientWidth = e.clientWidth; o.fits = (widths[k] || 0) + 28 <= e.clientWidth; o.options = texts.length; }
        return o; });
      return { mode: new URLSearchParams(location.search).get('mode'), leftClientWidth: left.clientWidth, leftScrollWidth: left.scrollWidth, leftOffsetWidth: left.offsetWidth, pickers: document.querySelectorAll('label.picker').length, visibleFields: fields.length, overContent: fields.filter((f) => f.over > 0.5).length, selectsNotFitting: fields.filter((f) => f.tag === 'select' && !f.fits).map((f) => f.name + ': ' + f.longest + ' (' + f.longestPx + '+28 > ' + f.clientWidth + ')'), fields };
    })()`;
    const res = await send('Runtime.evaluate', { expression: js, returnByValue: true }), out = res.result.result.value || { error: JSON.stringify(res.result.exceptionDetails || res.result).slice(0, 300) };
    out.pageErrors = errors; fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    console.log(JSON.stringify({ ...out, fields: out.fields ? `${out.fields.length} fields` : undefined }));
    ws.close();
  } finally { proc.kill(); srv.close(); await sleep(500); try { fs.rmSync(udd, { recursive: true, force: true }); } catch (e) { /* the browser still holds it */ } }
})().catch((e) => { console.error('PROBE FAILED', e.message); process.exit(1); });
