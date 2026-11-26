// vary.js (pane A, L251 read of C's 40e931e..6a3ea79): the chair's variations on the real page, in headless Chrome (the builder's launchChrome: --mute-audio, the browser
// cap; titled zz-headless-test first and kept). TREE is the builder tree served. Coast Esses comes from his pieces folder READ-ONLY through a stand-in native side
// (nothing written), shown as a ghost after two Extends, so the road carries later-change marks (dots).
//   pointer: (1) a mark pressed on its dot and dragged to where its own label window sits, released there; (2) the length handle pressed and dragged toward and through
//            its own readout window. Both by real mouse events on a path read off the windows' boxes (the canvas's drawn boxes at the base, the elements at the tip, the
//            same placement maths); what the page reads after each (the panel's fields, the values band, the dots) is printed, to compare tree against tree
//   zorder:  per look, for every thing a window could meet (the values band, the view tag, #left, an open menu, a dialog, the guide card, the camera bar), which paints on
//            top at that thing's centre: at the base the windows' canvas (it covers the stage), at the tip a shown window moved there for the reading
//   fit:     per look, each shown window's text against its box (the canvas measured it; the element draws it with the page's own type)
//   theme:   a window shown in aqua, the look switched to aurora with no pointer move: the window's blur and corner after
//   sculpt:  Sculpt mode (Tab), the pointer on the road: the brush box's window, and a 40-step sculpt drag's window nodes
// usage: TREE=<tree> node vary.js <mode,mode,...> [look ...]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE);
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const MODES = (process.argv[2] || 'pointer').split(',');
const LOOKS = process.argv.slice(3).length ? process.argv.slice(3) : ['sigil', 'glass', 'aqua', 'aurora', 'skyline', 'skyline-night'];
const W = 1400, H = 860, PIECE = 'Coast Esses';
const PIECES = path.join(process.env.APPDATA, 'com.solariz3d.t180-track-builder', 'pieces');
const files = {}; for (const f of fs.readdirSync(PIECES)) if (/\.t180(piece|recipe)$/.test(f)) files[f] = fs.readFileSync(path.join(PIECES, f), 'utf8');   // read only
const names = Object.keys(files).filter((f) => f.endsWith('.t180piece')).map((f) => f.replace(/\.t180piece$/, ''));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };
const out = { tree: T, modes: MODES };

(async () => {
  const srv = http.createServer((q, s) => { const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; } fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); }); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', `--window-size=${W},${H}`], 't180a-l251r-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(), errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(d.params.exceptionDetails).slice(0, 240)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result).slice(0, 400)}`); return d.result.result.value; };
  const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: extra.button || 'none', buttons: extra.buttons || 0, clickCount: extra.clickCount || 0 });
  await send('Runtime.enable'); await send('Page.enable'); await send('DOM.enable');
  await ev("document.title = 'zz-headless-test'; return true;");
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  out.chrome = (await send('Browser.getVersion')).result.product;
  // the stand-in native side, and a recorder of what the two canvases draw each frame: the dots (arcs under 6 px) and the windows' boxes (fillRect / roundRect) and words
  const stand = (look) => `document.title = 'zz-headless-test';
    new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document, { subtree: true, childList: true, characterData: true });
    try { localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); localStorage.setItem('t180.guide.done', '1'); } catch (e) {}
    window.__FILES = ${JSON.stringify(files)}; window.__NAMES = ${JSON.stringify(names)};
    window.__TAURI__ = { core: { invoke: (cmd, a) => {
      if (cmd === 'list_pieces') return Promise.resolve(window.__NAMES);
      if (cmd === 'open_piece') return Promise.resolve(window.__FILES[a.name + '.t180piece']);
      if (cmd === 'open_recipe') return Promise.resolve(window.__FILES[a.name + '.t180recipe'] || null);
      if (/^list_/.test(cmd)) return Promise.resolve([]);
      return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };
    (() => { const P = CanvasRenderingContext2D.prototype, o = { arc: P.arc, fill: P.fill, fillRect: P.fillRect, roundRect: P.roundRect, fillText: P.fillText, clearRect: P.clearRect }; let pend = null;
      const lab = (c) => c.canvas.getAttribute && c.canvas.getAttribute('aria-label');
      window.__cv = {}; const cur = (c) => { const k = lab(c); if (!k) return null; return (window.__cv[k] = window.__cv[k] || { next: { dots: [], boxes: [], words: [] }, last: { dots: [], boxes: [], words: [] } }); };
      P.clearRect = function () { const r = cur(this); if (r && arguments[0] === 0 && arguments[1] === 0) { r.last = r.next; r.next = { dots: [], boxes: [], words: [] }; } return o.clearRect.apply(this, arguments); };
      P.arc = function (x, y, rad) { const r = cur(this); if (r && rad < 6) pend = { x, y, colour: null }; return o.arc.apply(this, arguments); };
      P.fill = function () { const r = cur(this); if (r && pend) { pend.colour = String(this.fillStyle); r.next.dots.push(pend); pend = null; } return o.fill.apply(this, arguments); };
      P.fillRect = function (x, y, w, h) { const r = cur(this); if (r && h >= 18 && w >= 30) r.next.boxes.push({ x, y, w, h }); return o.fillRect.apply(this, arguments); };
      if (o.roundRect) P.roundRect = function (x, y, w, h) { const r = cur(this); if (r && h >= 18 && w >= 30) r.next.boxes.push({ x, y, w, h }); return o.roundRect.apply(this, arguments); };
      P.fillText = function (t) { const r = cur(this); if (r) r.next.words.push(String(t)); return o.fillText.apply(this, arguments); };
    })();`;
  let standId = null;
  const load = async (look) => {
    errors.length = 0;
    if (standId) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: standId });
    standId = (await send('Page.addScriptToEvaluateOnNewDocument', { source: stand(look) })).result.identifier;
    await send('Emulation.setEmulatedMedia', { features: [] });
    await send('Page.navigate', { url: `http://127.0.0.1:${srv.address().port}/app/index.html` });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("for (const t of ['✕', 'Skip']) { const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === t); if (b && b.offsetParent) b.click(); } return true;"); await sleep(300);
    const click = (txt) => ev(`const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === ${JSON.stringify(txt)} && x.offsetParent); if (!b) return false; b.click(); await new Promise((r) => setTimeout(r, 600)); return true;`);
    for (let i = 0; i < 2; i++) await click('Extend');
    await ev("document.querySelector('#pieces summary').click(); await new Promise((r) => setTimeout(r, 800)); return true;");
    await ev(`const r = document.querySelector('.piece-row[data-piece=' + JSON.stringify(${JSON.stringify(PIECE)}) + ']'); r.click(); await new Promise((r2) => setTimeout(r2, 1500)); const p = document.querySelector('#pieces'); if (p && p.open) p.open = false; return true;`);
    await mouse('mouseMoved', 1300, 700); await sleep(2600);   // the pointer off everything, past the 2 s a just-added mark shows its label
    return ev("return document.documentElement.getAttribute('data-theme') || 'sigil';");
  };
  // the windows shown now: at the tip the elements; at the base the boxes and words the canvas drew last frame
  const shownWins = (layerName) => ev(`const tip = !!document.querySelector('[data-mark-windows]');
    if (tip) return [...document.querySelectorAll('[data-mark-window' + (${JSON.stringify(layerName)} ? '="' + ${JSON.stringify(layerName)} + '"' : '') + ']')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { const b = e.getBoundingClientRect(); return { tip, x: b.left, y: b.top, w: b.width, h: b.height, words: e.textContent }; });
    const st = document.getElementById('preview').getBoundingClientRect(), r = (window.__cv[${JSON.stringify(layerName)}] || { last: { boxes: [], words: [] } }).last;
    return r.boxes.map((b) => ({ tip, x: b.x + st.left, y: b.y + st.top, w: b.w, h: b.h, words: r.words.join('\\n') }));`);
  const readState = () => ev("const vals = [...document.querySelectorAll('#palette input')].filter((e) => e.type !== 'checkbox').map((e) => (e.getAttribute('aria-label') || '?') + '=' + e.value); const band = document.querySelector('[aria-label=\"piece values\"]'); const d = (window.__cv['later changes'] || { last: { dots: [] } }).last.dots.map((p) => Math.round(p.x) + ',' + Math.round(p.y)); return { fields: vals.join(' | '), band: band ? band.innerText.replace(/\\s+/g, ' ').trim() : null, dots: d.join(' ') };");
  const inside = (p, w) => w.some((b) => p[0] >= b.x && p[0] <= b.x + b.w && p[1] >= b.y && p[1] <= b.y + b.h);

  if (MODES.includes('pointer')) {
    const look = 'aqua'; out.pointer = { look: await load(look) };
    const st = await ev("const r = document.getElementById('preview').getBoundingClientRect(); return [r.left, r.top];");
    const dots = await ev("return (window.__cv['later changes'] || { last: { dots: [] } }).last.dots;");
    out.pointer.dots = dots.length;
    // (1) the mark: hover its dot, read its window, press, drag to the window's centre in 20 steps, hold, release there
    const d = dots.map((p) => ({ x: p.x + st[0], y: p.y + st[1] })).filter((p) => p.x > 300 && p.x < W - 100 && p.y > 140 && p.y < H - 160)[0];
    if (d) {
      await mouse('mouseMoved', d.x, d.y); await sleep(500);
      const w0 = await shownWins('later changes'); out.pointer.markWindowBefore = w0.map((b) => ({ x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), words: b.words.split('\n')[0] }));
      const target = w0[0] ? [w0[0].x + w0[0].w / 2, w0[0].y + w0[0].h / 2] : [d.x + 40, d.y - 40];
      await mouse('mousePressed', d.x, d.y, { button: 'left', buttons: 1, clickCount: 1 }); await sleep(60);
      let over = 0;
      for (let i = 1; i <= 20; i++) { const p = [d.x + (target[0] - d.x) * i / 20, d.y + (target[1] - d.y) * i / 20]; await mouse('mouseMoved', p[0], p[1], { buttons: 1 }); await sleep(30); if (inside(p, await shownWins('later changes'))) over++; }
      await sleep(200);
      const during = await shownWins('later changes'); out.pointer.markWindowAtRelease = during.map((b) => b.words.split('\n')[0]);
      await mouse('mouseReleased', target[0], target[1], { button: 'left', buttons: 0, clickCount: 1 }); await sleep(800);
      out.pointer.markStepsOverAWindow = over; out.pointer.markPath = { from: [Math.round(d.x), Math.round(d.y)], to: target.map(Math.round) };
      out.pointer.afterMark = await readState();
    } else out.pointer.mark = 'no dot in the open part of the view';
    // (2) the length handle: hover it, read its readout window, press, drag toward the window's centre and as far again past it, release
    await mouse('mouseMoved', 1300, 700); await sleep(600);
    const h = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); const h = (l || []).find((x) => x.kind === 'length'); return h ? { x: h.x + r.left, y: h.y + r.top } : null;");
    if (h) {
      await mouse('mouseMoved', h.x, h.y); await sleep(500);
      const w1 = await shownWins('drag handles'); out.pointer.readoutBefore = w1.map((b) => ({ x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), words: b.words.split('\n')[0] }));
      // HANDLE_THROUGH (x,y) gives both trees the same path: the base's recorder cannot read a readout the handles drew once (that canvas redraws only on change)
      const c = process.env.HANDLE_THROUGH ? process.env.HANDLE_THROUGH.split(',').map(Number) : w1[0] ? [w1[0].x + w1[0].w / 2, w1[0].y + w1[0].h / 2] : [h.x + 60, h.y - 30];
      await mouse('mousePressed', h.x, h.y, { button: 'left', buttons: 1, clickCount: 1 }); await sleep(60);
      let over = 0; const seen = new Set();
      for (let i = 1; i <= 40; i++) { const p = [h.x + (c[0] - h.x) * i / 20, h.y + (c[1] - h.y) * i / 20]; await mouse('mouseMoved', p[0], p[1], { buttons: 1 }); await sleep(30); const s = await shownWins('drag handles'); if (inside(p, s)) over++; if (s[0]) seen.add(s[0].words.split('\n')[0]); }
      await mouse('mouseReleased', h.x + (c[0] - h.x) * 2, h.y + (c[1] - h.y) * 2, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(800);
      out.pointer.handleStepsOverAWindow = over; out.pointer.readoutWordsSeen = seen.size; out.pointer.handlePath = { from: [Math.round(h.x), Math.round(h.y)], through: c.map(Math.round) };
      out.pointer.afterHandle = await readState();
    } else out.pointer.handle = 'no length handle';
    out.pointer.pageErrors = errors.slice(); console.log("MODE pointer " + JSON.stringify(out.pointer));
  }

  // a shown window at the tip (the length handle hovered): its element, for the readings below
  const hoverReadout = async () => {
    await mouse('mouseMoved', 1300, 700); await sleep(400);
    const h = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); const h = (l || []).find((x) => x.kind === 'length'); return h ? { x: h.x + r.left, y: h.y + r.top } : null;");
    if (!h) return null; await mouse('mouseMoved', h.x, h.y); await sleep(500); return h;
  };
  // the node painted on top at (x, y), pointer-events or not
  const topAt = async (x, y) => { const r = await send('DOM.getNodeForLocation', { x: Math.round(x), y: Math.round(y), ignorePointerEventsNone: true }); if (!r.result) return null; const d = await send('DOM.describeNode', { backendNodeId: r.result.backendNodeId }); const n = d.result && d.result.node; return n ? `${n.nodeName}${(n.attributes || []).reduce((s, v, i, a) => (i % 2 === 0 && (v === 'id' || v === 'aria-label' || v === 'data-mark-window' || v === 'class') ? `${s}[${v}=${a[i + 1]}]` : s), '')}` : null; };

  if (MODES.includes('zorder')) {
    // which paints on top, by pixels: a magenta box in the layer's own place in the paint order (at the tip a real window of that layer, moved there and filled; at the
    // base a box put right after that layer's canvas, with the canvas's z-index, which is where the canvas's drawn windows sat), and the screen's pixel at the point
    const { decode } = require(path.join(T, 'app/test/png.js'));
    const pixel = async (x, y) => { const d = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.round(x) - 1, y: Math.round(y) - 1, width: 3, height: 3, scale: 1 } }); const img = decode(Buffer.from(d.result.data, 'base64')); return img.px(1, 1); };
    const magenta = (c) => c[0] > 230 && c[1] < 40 && c[2] > 230;
    out.zorder = {};
    for (const look of LOOKS) {
      const got = (out.zorder[look] = { look: await load(look) });
      // tip or base by the module itself (a layer's container is made only at its first window)
      const tip = await ev("return (await (await fetch('/app/core/markwindow.js')).text()).includes('function layer(');");
      got.tree = tip ? 'tip (elements)' : 'base (canvas)';
      // one mark label and one readout shown once, so at the tip both layers' containers exist
      { const s = await ev("const r = document.getElementById('preview').getBoundingClientRect(), d = (window.__cv['later changes'] || { last: { dots: [] } }).last.dots[0]; return d ? [d.x + r.left, d.y + r.top] : null;"); if (s) { await mouse('mouseMoved', s[0], s[1]); await sleep(500); } }
      await hoverReadout(); await mouse('mouseMoved', 1300, 700); await sleep(400);
      got.containers = await ev("return [...document.querySelectorAll('[data-mark-windows]')].map((e) => e.getAttribute('data-mark-windows') + ' z' + getComputedStyle(e).zIndex);");
      const place = async (L, p) => {
        // at the tip a magenta box INSIDE that layer's own container, where its windows paint
        if (tip) return ev(`const box = document.querySelector('[data-mark-windows="${L}"]'); if (!box) return false; const s = box.getBoundingClientRect(), b = document.createElement('div'); b.id = 'l251probe';
          b.style.cssText = 'position:absolute;pointer-events:none;background:#ff00ff;width:40px;height:20px;left:' + (${p[0]} - s.left - 20) + 'px;top:' + (${p[1]} - s.top - 10) + 'px'; box.append(b); return true;`);
        return ev(`const c = document.querySelector('canvas[aria-label="${L}"]'); if (!c) return false; const s = c.parentElement.getBoundingClientRect(), b = document.createElement('div'); b.id = 'l251probe';
          b.style.cssText = 'position:absolute;pointer-events:none;background:#ff00ff;width:40px;height:20px;z-index:' + getComputedStyle(c).zIndex + ';left:' + (${p[0]} - s.left - 20) + 'px;top:' + (${p[1]} - s.top - 10) + 'px'; c.after(b); return true;`);
      };
      const unplace = () => ev("if (window.__mv) { window.__mv.e.style.cssText = window.__mv.was; window.__mv = null; } const b = document.getElementById('l251probe'); if (b) b.remove(); return true;");
      const read = async (name, p) => { for (const L of ['later changes', 'drag handles']) { const ok = await place(L, p); if (!ok) { got[`${name} / ${L}`] = 'no window of this layer'; continue; } await sleep(120); got[`${name} / ${L}`] = magenta(await pixel(p[0], p[1])) ? 'WINDOW ON TOP' : 'under'; await unplace(); } };
      const centre = (sel, dx = 40, dy = 15) => ev(`const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return b.width && b.height ? [b.left + Math.min(b.width / 2, ${dx}), b.top + Math.min(b.height / 2, ${dy})] : null;`);
      for (const [name, sel] of [['values band', '[aria-label="piece values"]'], ['view tag', '.preview-hud'], ['#left', '#left'], ['camera bar', '#camera [role="toolbar"]'], ['Show the guide', '.guide-open']]) { const p = await centre(sel); if (p) await read(name, p); else got[name] = 'absent'; }
      // an open menu
      await ev("document.getElementById('m-file').open = true; return true;"); await sleep(300);
      { const p = await centre('#m-file .more-menu', 60, 40); if (p) await read('File menu', p); }
      await ev("document.getElementById('m-file').open = false; return true;"); await sleep(200);
      // a dialog: the save question's own markup
      await ev(`const m = { exports: {} }; new Function('module', 'exports', await (await fetch('/app/askdialog.js')).text())(m, m.exports);
        m.exports.askChoice(document, { title: 'L251 read', message: 'z-order', cancelValue: 'c', buttons: [{ label: 'OK', value: 'c', kind: 'main', default: true }] }); await new Promise((r) => setTimeout(r, 300)); return true;`);
      { const p = await centre('.ask-card', 60, 30); if (p) await read('dialog', p); }
      await ev("for (const v of document.querySelectorAll('.ask-veil')) v.remove(); return true;"); await sleep(200);
      // the guide's card (role dialog), opened
      await ev("const b = document.querySelector('.guide-open'); if (b) b.click(); await new Promise((r) => setTimeout(r, 400)); return true;");
      { const p = await centre('.guide-card', 60, 30); if (p) await read('guide card', p); else got['guide card'] = 'absent'; }
      got.pageErrors = errors.slice(); console.log("MODE zorder " + JSON.stringify(got));
    }
  }

  if (MODES.includes('fit')) {
    out.fit = {};
    for (const look of LOOKS) {
      const got = (out.fit[look] = { look: await load(look) });
      const h = await hoverReadout(); if (!h) { got.readout = 'no handle'; continue; }
      const dots = await ev("const s = document.getElementById('preview').getBoundingClientRect(); return ((window.__cv['later changes'] || { last: { dots: [] } }).last.dots).map((p) => [p.x + s.left, p.y + s.top]);");
      const read = () => ev(`return [...document.querySelectorAll('[data-mark-window]')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { const s = getComputedStyle(e), b = e.getBoundingClientRect(), r = document.createRange(); r.selectNodeContents(e);
        const t = [...r.getClientRects()]; const right = Math.max(...t.map((q) => q.right)), bottom = Math.max(...t.map((q) => q.bottom)), edge = parseFloat((/inset 0px 0px 0px ([\\d.]+)px/.exec(s.boxShadow) || [0, 0])[1]);
        return { layer: e.getAttribute('data-mark-window'), words: e.textContent.split('\\n')[0].slice(0, 40), box: [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)], textRight: Math.round((right - b.left) * 10) / 10, roomRight: Math.round((b.width - edge) * 10) / 10, textBottom: Math.round((bottom - b.top) * 10) / 10, roomBottom: Math.round((b.height - edge) * 10) / 10, letterSpacing: s.letterSpacing, font: s.font.slice(0, 60), stageW: document.getElementById('preview').clientWidth, inStage: b.left >= document.getElementById('preview').getBoundingClientRect().left && b.right <= document.getElementById('preview').getBoundingClientRect().right }; });`);
      got.readout = await read();
      if (dots[0]) { await mouse('mouseMoved', dots[0][0], dots[0][1]); await sleep(500); got.markLabel = (await read()).filter((x) => x.layer === 'later changes'); }
      got.pageErrors = errors.slice(); console.log("MODE fit " + JSON.stringify(got));
    }
  }

  if (MODES.includes('theme')) {
    await load('aqua'); await hoverReadout();
    const before = await ev("const e = [...document.querySelectorAll('[data-mark-window]')].find((x) => getComputedStyle(x).display !== 'none'); const s = getComputedStyle(e); return { bf: s.backdropFilter, r: s.borderTopLeftRadius, bg: s.backgroundColor, words: e.textContent };");
    await ev("document.documentElement.setAttribute('data-theme', 'aurora'); await new Promise((r) => setTimeout(r, 400)); return true;");
    const after = await ev("const e = [...document.querySelectorAll('[data-mark-window]')].find((x) => getComputedStyle(x).display !== 'none'); const s = getComputedStyle(e), want = getComputedStyle(document.documentElement).getPropertyValue('--mark-win-blur').trim(), t = document.createElement('div'); t.style.backdropFilter = want; document.body.append(t); const w = getComputedStyle(t).backdropFilter; t.remove(); return { bf: s.backdropFilter, want: w, r: s.borderTopLeftRadius, wantR: getComputedStyle(document.documentElement).getPropertyValue('--mark-win-radius').trim(), bg: s.backgroundColor, wantBg: getComputedStyle(document.documentElement).getPropertyValue('--mark-win-bg').trim(), words: e.textContent };");
    out.theme = { before, after, pageErrors: errors.slice() }; console.log("MODE theme " + JSON.stringify(out.theme));
  }

  if (MODES.includes('sculpt')) {
    await load('aqua'); await mouse('mouseMoved', 1300, 700); await sleep(300);
    await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur(); return true;');
    const onRoad = await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); const h = (l || []).find((x) => x.kind === 'turnDeg') || (l || []).find((x) => x.kind === 'length'); return h ? [h.x + r.left, h.y + r.top] : null;");
    // Sculpt mode by Tab with the page focused (keys.js: Tab on the page or the stage toggles Sculpt; Build ▸ Sculpt mode is the same switch)
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }); await sleep(800);
    const brushes = async () => ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); return (l || []).filter((h) => /^brush/.test(h.kind)).map((h) => h.kind);");
    // a point on the PLACED road (the brush glyph shows only there, panel.js brushModel's sculptHover): the stage scanned on a 40 x 30 px grid, the first point whose
    // hover raises a brush handle
    let road = null, tried = 0;
    const st = await ev("const r = document.getElementById('stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height];");
    scan: for (let y = st[1] + 60; y < st[1] + st[3] - 40; y += 30) for (let x = st[0] + 300; x < st[0] + st[2] - 60; x += 40) { tried++; await mouse('mouseMoved', x, y); await sleep(40); if ((await brushes()).length) { road = [x, y]; break scan; } }
    if (!road) road = onRoad || [700, 492];
    const sc = { sculpt: await ev("const s = document.querySelector('#banner .brush-strip'); return !!(s && s.offsetParent);"), at: road.map(Math.round), scanned: tried };
    await mouse('mouseMoved', road[0] - 2, road[1]); await sleep(200); await mouse('mouseMoved', road[0], road[1]); await sleep(600);
    sc.brushHandles = await brushes(); sc.shown = await ev("return [...document.querySelectorAll('[data-mark-window]')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => ({ layer: e.getAttribute('data-mark-window'), words: e.textContent.slice(0, 60), bf: getComputedStyle(e).backdropFilter, pe: getComputedStyle(e).pointerEvents }));");
    await ev("window.__m = { added: 0, removed: 0 }; window.__mo = new MutationObserver((ms) => { for (const m of ms) { window.__m.added += [...m.addedNodes].filter((n) => n.nodeType === 1).length; window.__m.removed += [...m.removedNodes].filter((n) => n.nodeType === 1).length; } }); for (const l of document.querySelectorAll('[data-mark-windows]')) window.__mo.observe(l, { childList: true }); return true;");
    const count = () => ev("return document.querySelectorAll('[data-mark-window]').length;"), n0 = await count(), counts = new Set();
    await mouse('mousePressed', road[0], road[1], { button: 'left', buttons: 1, clickCount: 1 }); await sleep(60);
    for (let i = 1; i <= 40; i++) { await mouse('mouseMoved', road[0], road[1] - i * 2, { buttons: 1 }); await sleep(25); counts.add(await count()); }
    await mouse('mouseReleased', road[0], road[1] - 80, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(500);
    sc.nodesBefore = n0; sc.nodesDuring = [...counts]; sc.mutations = await ev('window.__mo.takeRecords(); return window.__m;'); sc.pageErrors = errors.slice();
    out.sculpt = sc; console.log("MODE sculpt " + JSON.stringify(out.sculpt));
  }

  console.log(JSON.stringify(out, null, 1));
  try { ws.close(); } catch (e) { /* closing */ }
  ch.kill(); srv.close(); await sleep(800); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* Chrome may hold it */ }
})().catch((e) => { console.error(e); process.exit(1); });
