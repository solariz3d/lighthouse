// o_mock.js (pane O, L259 track 5, plan only; scratch): a MOCK of the follow control for his eye, in the REAL page of f3cd425, headless.
// Nothing is built: the Follow block is injected into the real reference panel's DOM and wears its classes and the page's look tokens.
// The shadow is OUR OWN shape: his road (three Extends, as the page lays them) continued by our own corners, made into an AI line by the
// builder's own encodeAiLine, served by a stand-in native side. No other author's track is read, drawn or written.
// Headless rule: the shared launcher (--headless=new, --mute-audio), never focused, document.title 'zz-headless-test' set first and kept.
//   node o_mock.js <f3cd425 tree> <out dir>
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, OUT] = process.argv.slice(2), T = path.resolve(T0);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js'));
const { toPath } = require(path.join(T, 'src/core/adapter.js')), { encodeAiLine, EXTRA } = require(path.join(T, 'src/export/ailine.js'));
const { extendOptions } = require(path.join(T, 'app/core/panel.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const BYTES = {};
// our own continuation: corners typed as a person would (turn and climb as corners, degrees), the bank and width at each piece's end
const MORE = [{ length: 140, turn: 38, bank: 8 }, { length: 90, turn: 0, bank: 0 }, { length: 160, turn: -72, bank: -12, climb: 3 }, { length: 120, turn: 0, bank: 0, climb: -3 }, { length: 150, turn: 55, bank: 10 }, { length: 130, turn: -20, bank: 0 }];
function lineOf(doc) {
  const P = toPath(doc, { step: 0.5 }).path.samples, pts = [], ext = []; let next = 0;
  for (const q of P) { if (q.s + 1e-9 < next) continue; next += 2;
    const e = {}; for (const f of EXTRA) e[f] = 0; e.sideLeft = 15.5; e.sideRight = 15.5; [e.nx, e.ny, e.nz] = q.U; [e.fx, e.fy, e.fz] = q.T; e.length = q.s;
    pts.push({ pos: q.pos.slice(), length: q.s, id: pts.length }); ext.push(e); }
  return { buf: encodeAiLine({ points: pts, extra: ext, open: true }), xz: P.map((q) => [q.pos[0], q.pos[2]]), s: P.map((q) => q.s), L: P[P.length - 1].s };
}
(async () => {
  const srv = http.createServer((q, s) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    if (u.startsWith('/__o/')) { const b = BYTES[u.slice(5)]; if (!b) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': u.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); s.end(b); return; }
    const p = path.normalize(path.join(T, u)); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1500,900'], 't180l259o-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: name.endsWith('.jpg') ? 'jpeg' : 'png', ...(name.endsWith('.jpg') ? { quality: 88 } : {}), ...(clip ? { clip: { ...clip, scale: 2 } } : {}) }); fs.writeFileSync(path.join(OUT, name), Buffer.from(r.result.data, 'base64')); };
  const out = { errors, shots: [] };
  try {
    await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: 900, deviceScaleFactor: 1, mobile: false });
    const stand = `document.title = 'zz-headless-test';
      new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
      window.__calls = []; window.__auto = null;
      window.__TAURI__ = { core: { invoke: (cmd, a) => { window.__calls.push(cmd);
        if (cmd === 'list_tracks') return Promise.resolve([]);
        if (cmd === 'save_autosave') { window.__auto = a && a.text; return Promise.resolve(null); }
        if (cmd === 'list_reference_tracks') return Promise.resolve([{ track: 'reference S', layout: '', hasAi: true, uiLength: null }]);
        if (cmd === 'read_reference_line') return fetch('/__o/line S').then((r) => (r.ok ? r.arrayBuffer() : Promise.reject('not ready')));
        if (cmd === 'read_reference_road') return Promise.reject('the mock serves its line only');
        return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
    await send('Page.addScriptToEvaluateOnNewDocument', { source: stand });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    out.title0 = await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return document.title;");
    for (let i = 0; i < 3; i++) await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
    let text = null; for (let i = 0; i < 40 && !text; i++) { await sleep(250); text = await ev('return window.__auto;'); }
    if (!text) throw new Error('no autosave from the page');
    const doc0 = D.parse(JSON.parse(text).doc); let doc = doc0;
    for (const p of MORE) doc = TB.extendCorner(doc, extendOptions({ length: p.length, turn: p.turn, climb: p.climb || 0, bank: p.bank, width: 31, turnAs: 'corner' }));
    const his = toPath(doc0, { step: 0.5 }).path.samples, line = lineOf(doc); BYTES['line S'] = line.buf;
    out.hisM = +his[his.length - 1].s.toFixed(1); out.shadowM = +line.L.toFixed(1); out.pieces = { his: doc0.pieces.length, shadow: doc.pieces.length };
    await ev("const d = document.getElementById('m-view'); d.open = true; await new Promise((r) => setTimeout(r, 300)); const b = [...d.querySelectorAll('button, [role=menuitem], .menu-item')].find((x) => x.textContent.trim() === 'Reference track…'); if (!b) throw new Error('no View item'); b.click(); await new Promise((r) => setTimeout(r, 1200)); d.open = false; return true;");
    await ev("await window.__t180Reference().pick('reference S', ''); await new Promise((r) => setTimeout(r, 1500)); return true;");
    out.panel = await ev("const st = window.__t180Reference().state(); return { picked: st.picked, kind: st.kind, error: st.error };");
    const hisM = Math.round(out.hisM), endM = Math.round(out.shadowM - 40);
    const css = `.reference-panel .rp-follow { border-top: 1px solid var(--line, #24221f); margin-top: 8px; padding-top: 8px; }
      .reference-panel .rp-follow .rp-fhead { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; margin-bottom: 6px; }
      .reference-panel .rp-follow .rp-mock { font-weight: 400; font-size: 10px; color: var(--dim, #8a847a); letter-spacing: .04em; text-transform: uppercase; }
      .reference-panel .rp-follow .rp-frow { display: grid; grid-template-columns: 38px 1fr; gap: 3px 8px; align-items: center; margin-bottom: 5px; }
      .reference-panel .rp-follow .rp-frow input { width: 70px; }
      .reference-panel .rp-follow .rp-fbtns { display: flex; gap: 8px; margin: 6px 0 2px; }
      .reference-panel .rp-follow .rp-fread { color: var(--dim, #8a847a); font-size: 11px; }
      .reference-panel .rp-follow .rp-fread b { color: var(--text, #ebe6dc); font-weight: 600; }
      .reference-panel .rp-follow .rp-fwarn { color: var(--text, #ebe6dc); font-size: 11px; border-left: 2px solid var(--accent, #c9a227); padding-left: 6px; margin-top: 4px; }`;
    const block = (body) => `<div class="rp-fhead"><span>Follow the shadow</span><span class="rp-mock">mock · not built</span></div>
      <div class="rp-frow"><span>From</span><span>your road's end, ${hisM} m along it (on it: 0.0 m off, 0.0° off)</span>
      <span>To</span><span><input type="number" value="${endM}" aria-label="follow to, metres along the shadow"> m along &nbsp;<button>Pick on the shadow</button></span></div>${body}`;
    const states = [
      ['mock_1_ready', `<div class="rp-fread"><b>${endM - hisM} m to follow.</b> Reads its AI line for the way and its kn5 for the shape. Lays 8 m pieces (4 m where 8 miss), each steered onto the shadow, then joins them into the fewest that stay inside 2 m across, 1 m up, heading 1°, bank 3°, pitch 1.5°, width 2 m.</div>
        <div class="rp-fbtns"><button>Follow</button></div>`],
      ['mock_2_ghost', `<div class="rp-fread"><b>Ghost: 14 pieces over ${endM - hisM} m</b> (steered as 96, joined to 14). Every measure inside; the closest is heading, 0.6° of 1°, at 512 m. Nothing is laid until Lay, and Lay is one undo step: each piece is an ordinary one you can select, change or delete.</div>
        <div class="rp-fbtns"><button>Lay 14 pieces</button><button>Discard</button></div>`],
      ['mock_3_marked', `<div class="rp-fread"><b>Ghost: 14 pieces over ${endM - hisM} m.</b> Made: ${endM - hisM - 60} m.</div>
        <div class="rp-fwarn">Not made, 520 to 580 m: the road is not the same on both sides there (5.2 m left of its centre, 7.9 m right). This build lays one width for both sides, so it is laid at its full width on its centre; the right width (being built) would make it.</div>
        <div class="rp-fbtns"><button>Lay 14 pieces</button><button>Discard</button></div>`],
      ['mock_4_stopped', `<div class="rp-fread"><b>Stopped at 640 m:</b> the builder refused the next piece: "too close to another pass of the road; a road over another must keep its underside 3.1 m clear for a car." Track ▸ Edge apron sets the apron that check counts. The ghost runs to 640 m: 11 pieces.</div>
        <div class="rp-fbtns"><button>Lay 11 pieces</button><button>Discard</button></div>`],
    ];
    await ev(`const st = document.createElement('style'); st.textContent = ${JSON.stringify(css)}; document.head.appendChild(st); const f = document.createElement('div'); f.className = 'rp-follow'; document.querySelector('.reference-panel').appendChild(f); return true;`);
    for (const [name, body] of states) {
      await ev(`document.querySelector('.reference-panel .rp-follow').innerHTML = ${JSON.stringify(block(body))}; return true;`); await sleep(300);
      const r = await ev("const r = document.querySelector('.reference-panel').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height };");
      if (name === 'mock_1_ready') { await ev("const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Overhead'); if (b) b.click(); await new Promise((r) => setTimeout(r, 1500)); return !!b;"); for (let w = 0; w < 14; w++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 750, y: 450, deltaX: 0, deltaY: 240 }); await sleep(120); } await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 890 }); await sleep(1200); await shot('mock_0_window.jpg'); out.shots.push('mock_0_window.jpg'); }
      await shot(name + '.jpg', { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: r.width + 16, height: r.height + 16 }); out.shots.push(name + '.jpg');
    }
    // the sketch: what the preview would draw for the ghost, top-down, from the same shapes (his road solid, the shadow see-through, the ghost's joints ticked)
    const all = toPath(doc, { step: 0.5 }).path.samples, xs = all.map((q) => q.pos[0]), zs = all.map((q) => q.pos[2]);
    const [x0, x1, z0, z1] = [Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs)], W = 900, H = 420, pad = 50, k = Math.min((W - 2 * pad) / (z1 - z0), (H - 2 * pad) / (x1 - x0)), ox = (W - (z1 - z0) * k) / 2, oy = (H - (x1 - x0) * k) / 2;
    const X = (q) => (ox + (q.pos[2] - z0) * k).toFixed(1), Z = (q) => (oy + (q.pos[0] - x0) * k).toFixed(1);   // drawn along z, so the long way fills the frame
    const poly = (qs) => qs.map((q) => `${X(q)},${Z(q)}`).join(' ');
    const ghostEnd = endM, ghost = all.filter((q) => q.s >= out.hisM && q.s <= ghostEnd), hisQ = all.filter((q) => q.s <= out.hisM);
    const joints = []; for (let s = out.hisM + (ghostEnd - out.hisM) / 14, j = 0; j < 13; s += (ghostEnd - out.hisM) / 14, j++) { const q = all.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)); joints.push(q); }
    const mark = all.filter((q) => q.s >= hisM + 520 && q.s <= hisM + 580);
    const svg = `<!doctype html><html><head><title>zz-headless-test</title><style>body{margin:0;background:#0b0b0a;font:12px system-ui;color:#ebe6dc}</style></head><body>
      <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${W}" height="${H}" fill="#121110"/>
      <polyline points="${poly(all)}" fill="none" stroke="#8a847a" stroke-opacity=".35" stroke-width="${(31 * k).toFixed(1)}" stroke-linejoin="round"/>
      <polyline points="${poly(hisQ)}" fill="none" stroke="#ebe6dc" stroke-width="${(31 * k * 0.55).toFixed(1)}" stroke-linejoin="round"/>
      <polyline points="${poly(ghost)}" fill="none" stroke="#c9a227" stroke-opacity=".9" stroke-width="2" stroke-dasharray="6 4"/>
      <polyline points="${poly(mark)}" fill="none" stroke="#e0603a" stroke-width="4"/>
      ${joints.map((q) => `<circle cx="${X(q)}" cy="${Z(q)}" r="3" fill="#c9a227"/>`).join('')}
      <text x="16" y="22" fill="#ebe6dc">SKETCH, our own shape (not another author's): the shadow see-through, his road solid, the ghost dashed with its joints, the not-made stretch red</text>
      <text x="16" y="${H - 14}" fill="#8a847a">mock of what the preview would draw after Follow; nothing here is built</text></svg></body></html>`;
    BYTES['sketch.html'] = Buffer.from(svg);
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/__o/sketch.html` }); await sleep(800);
    out.titleSketch = await ev('return document.title;');
    await shot('mock_5_sketch.png'); out.shots.push('mock_5_sketch.png');
    out.calls = await ev('return window.__calls ? window.__calls.slice(0, 40) : null;').catch(() => null);
  } catch (e) { out.fatal = String(e && e.message || e); }
  finally { try { ws.close(); } catch (e) { /* */ } try { ch.kill(); } catch (e) { /* */ } await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { out.profileLeft = dir; } srv.close(); }
  fs.writeFileSync(path.join(OUT, 'mock_run.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out));
})();
