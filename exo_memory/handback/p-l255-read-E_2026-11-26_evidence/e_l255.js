// e_l255.js (pane E, L255 read; scratch, never committed): O's chrome follow-ups VARIED on the real page (app/index.html) in headless Chrome.
// usage: TREE=<tree> node e_l255.js <out dir> [parts, comma separated: fields,selects,menus,export,titles,strip,longfile]
//   fields   a field focused by Tab (Shift+Tab off, Tab back) and by a real click with the pointer LEFT ON it, each look: its borders against rest, the ring
//            (outline), any box-shadow, and the ring's pixels 1..4 px outside the middle of each side (drawn and not clipped)
//   selects  every visible select in the left column, opened by a real click: focus, :focus-visible, :open, outline, border against rest; then Escape
//   menus    every menu on the bar, opened, at 900, 950, 990, 1000, 1010 px wide (860 and 600 high): its box against the window
//   export   Export to Assetto Corsa at rest, hovered by a real pointer, pressed (held, moved off, released off, so no click): fill, text, corner, the share
//            of its pixels that change, and its text against its own fill's pixels (text and shadow hidden, the 2nd and 98th percentile); the corner
//            with --radius-factor .75 set on <html>
//   titles   every menu title hovered by a real pointer, the share of its pixels that change (SIGIL's dead hover)
//   strip    the values strip's computed corner against the look's --r3
//   longfile the File menu with a saved track whose name is long (a stand-in native side lists it), opened at 900 and 1400: its box
// Headless per BUILDING.md: --headless=new, --mute-audio (the shared launcher), never focused, title 'zz-headless-test' set first and kept.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const T = path.resolve(process.env.TREE), OUT = path.resolve(process.argv[2]); fs.mkdirSync(OUT, { recursive: true });
const PARTS = (process.argv[3] || 'fields,selects,menus,export,titles,strip,longfile').split(',');
const { chromePath, launchChrome } = require(path.join(T, 'app/test/soundrender.js'));
const { decode } = require(path.join(T, 'app/test/png.js'));
const LOOKS = ['sigil', 'aqua', 'skyline', 'glass', 'aurora', 'skyline-night'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const rgbOf = (s) => (String(s).match(/[\d.]+/g) || []).slice(0, 3).map(Number);
(async () => {
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(T, decodeURIComponent(q.url.split('?')[0]))); if (!p.startsWith(T)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}/app/index.html`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--hide-scrollbars', '--window-size=1400,860'], 't180e-l255-');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('devtools')); });
  let id = 0; const pend = new Map(); let errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text).slice(0, 300)); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result && d.result.exceptionDetails).slice(0, 400)}`); return d.result.result.value; };
  const size = (w, h) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  const grab = async (clip) => decode(Buffer.from((await send('Page.captureScreenshot', clip ? { format: 'png', clip: { ...clip, scale: 1 } } : { format: 'png' })).result.data, 'base64'));
  const savePng = async (name) => fs.writeFileSync(path.join(OUT, name), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
  const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, ...extra });
  const park = async () => { await mouse('mouseMoved', 700, 600); await sleep(300); };   // over the 3D view, away from the bar and the column
  const key = async (k, code, vk, modifiers = 0) => { await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers }); await sleep(150); };
  const out = { tree: T, parts: PARTS };
  const stand = (names) => `window.__TAURI__ = { core: { invoke: (cmd) => { if (cmd === 'list_tracks') return Promise.resolve(${JSON.stringify(names)}); if (/^list_/.test(cmd)) return Promise.resolve([]); return Promise.resolve(null); } }, event: { listen: () => Promise.resolve(() => {}) } };`;
  let standId = null;
  async function load(look, w = 1400, h = 860) {
    errors = [];
    await size(w, h);
    await send('Page.navigate', { url: base.replace('index.html', 'lib/cjs.js') }); await sleep(300);
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', ${JSON.stringify(JSON.stringify(look))}); return true;`);
    await send('Page.navigate', { url: base });
    for (let i = 0; i < 150; i++) { await sleep(200); try { if (await ev("return document.documentElement.dataset.menubar === 'ready';")) break; } catch (e) { /* loading */ } }
    await ev("document.title = 'zz-headless-test'; new MutationObserver(() => { if (document.title !== 'zz-headless-test') document.title = 'zz-headless-test'; }).observe(document.head, { subtree: true, childList: true, characterData: true }); return true;");
    if ((await ev("return document.documentElement.dataset.menubar || 'not mounted';")) !== 'ready') throw new Error(`${look}: menus not mounted ${errors.join(' | ')}`);
    await ev("const b = [...document.querySelectorAll('#guide button')].find((x) => x.textContent.trim() === '✕'); if (b) b.click(); return true;"); await sleep(300);
    await ev("const st = document.createElement('style'); st.id = 'e-no-card'; st.textContent = '#hovertip { display: none !important; }'; document.head.appendChild(st); return true;");
  }
  const accent = () => ev("const p = document.createElement('i'); p.style.color = 'var(--accent)'; document.body.appendChild(p); const c = getComputedStyle(p).color; p.remove(); return c;");
  try {
    await send('Runtime.enable'); await send('Page.enable'); await send('Emulation.setFocusEmulationEnabled', { enabled: true });
    // ── fields ──
    if (PARTS.includes('fields')) {
      out.fields = [];
      for (const look of LOOKS) {
        await load(look); await park();
        const acc = rgbOf(await accent());
        // the targets: the name field in the bar, the first number field in the column, the column's rightmost text or number field, one number field in Settings
        const marks = await ev(`const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
          const tag = (e, k) => { e.setAttribute('data-e', k); return k; };
          const o = []; const n = document.getElementById('name'); if (n && vis(n)) o.push(tag(n, 'name (bar)'));
          const nums = [...document.querySelectorAll('#left input[type=number], #left input[type=text], #left input:not([type])')].filter(vis);
          if (nums[0]) o.push(tag(nums[0], 'first field in the column'));
          const edge = nums.slice().sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)[0]; if (edge && edge !== nums[0]) o.push(tag(edge, 'rightmost field in the column'));
          return o;`);
        // Settings opened, a number field in it
        const inMenu = await ev(`const d = document.getElementById('m-settings'); d.open = true; await new Promise((r) => setTimeout(r, 400));
          const f = [...d.querySelectorAll('input[type=number], input[type=text]')].find((e) => e.getBoundingClientRect().width > 0); if (!f) { d.open = false; return null; } f.setAttribute('data-e', 'a field in Settings'); return 'a field in Settings';`);
        if (inMenu) marks.push(inMenu);
        for (const m of marks) for (const mode of ['tab', 'click']) {
          const sel = `document.querySelector('[data-e="${m}"]')`;
          if (m === 'a field in Settings') await ev("const d = document.getElementById('m-settings'); if (!d.open) { d.open = true; await new Promise((r) => setTimeout(r, 400)); } return true;");
          await ev(`${sel}.scrollIntoView({ block: 'nearest' }); return true;`);
          const read = `const e = ${sel}, s = getComputedStyle(e), r = e.getBoundingClientRect(); return { focused: document.activeElement === e, fv: e.matches(':focus-visible'), hover: e.matches(':hover'), borders: [s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor], bw: s.borderTopWidth, outline: [s.outlineStyle, s.outlineWidth, s.outlineColor, s.outlineOffset].join(' '), shadow: s.boxShadow, rect: [r.left, r.top, r.right, r.bottom] };`;
          const rest = await ev(read);
          if (mode === 'tab') {
            const window_mods = (await ev(`const t = ${sel}; const all = [...document.querySelectorAll('button, input, select, textarea, summary, a[href], [tabindex]')].filter((e) => e.tabIndex >= 0 && !e.disabled && e.getClientRects().length); const i = all.indexOf(t); if (i > 0) { all[i - 1].focus(); return 'forward'; } all[i + 1].focus(); return 'back';`) === 'back' ? 8 : 0); await key('Tab', 'Tab', 9, window_mods);
          } else {
            const [l, t, r, b] = rest.rect; const x = (l + r) / 2, y = (t + b) / 2;
            await mouse('mouseMoved', x, y); await mouse('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1 });
          }
          await sleep(300);
          const now = await ev(read);
          const img = await grab();
          const [l, t, r, b] = now.rect, mx = Math.round((l + r) / 2), my = Math.round((t + b) / 2);
          const near = (p) => Math.abs(p[0] - acc[0]) + Math.abs(p[1] - acc[1]) + Math.abs(p[2] - acc[2]) < 60;
          const side = (pts) => pts.some(([x, y]) => x >= 0 && y >= 0 && x < img.w && y < img.h && near(img.px(x, y)));
          const sides = {
            top: side([1, 2, 3, 4].map((d) => [mx, Math.floor(t) - d])), bottom: side([1, 2, 3, 4].map((d) => [mx, Math.ceil(b) - 1 + d])),
            left: side([1, 2, 3, 4].map((d) => [Math.floor(l) - d, my])), right: side([1, 2, 3, 4].map((d) => [Math.ceil(r) - 1 + d, my])),
          };
          const borderChanged = JSON.stringify(now.borders) !== JSON.stringify(rest.borders);
          out.fields.push({ look, field: m, mode, focused: now.focused, focusVisible: now.fv, pointerOnIt: now.hover, ring: now.outline, ringSidesDrawn: Object.values(sides).filter(Boolean).length, sides, borderRest: rest.borders[0], borderFocused: now.borders[0], borderChanged, shadowRest: rest.shadow, shadowFocused: now.shadow, frames: (now.outline.startsWith('solid') ? 1 : 0) + (borderChanged ? 1 : 0) });
          if (look === 'skyline' || look === 'aqua') if (m === 'name (bar)' || m === 'first field in the column') await savePng(`field_${look}_${m.split(' ')[0]}_${mode}.png`);
          await ev("document.activeElement && document.activeElement.blur(); return true;"); await park();
        }
        await ev("const d = document.getElementById('m-settings'); d.open = false; return true;");
        if (errors.length) out.fields.push({ look, errors: errors.slice() });
      }
    }
    // ── selects ──
    if (PARTS.includes('selects')) {
      out.selects = [];
      for (const look of LOOKS) {
        await load(look); await park();
        const list = await ev(`const o = []; [...document.querySelectorAll('#left select, header select')].forEach((e, i) => { const r = e.getBoundingClientRect(); if (r.width > 0 && r.height > 0) { e.setAttribute('data-es', String(i)); o.push({ i: String(i), label: (e.getAttribute('aria-label') || e.title || e.name || e.id || '').slice(0, 40), rect: [r.left, r.top, r.right, r.bottom] }); } }); return o;`);
        for (const s of list.slice(0, 3)) {
          const sel = `document.querySelector('[data-es="${s.i}"]')`;
          const read = `const e = ${sel}, st = getComputedStyle(e); let open = 'unknown'; try { open = e.matches(':open'); } catch (x) { /* no :open */ } return { focused: document.activeElement === e, fv: e.matches(':focus-visible'), open, appearance: st.appearance, border: st.borderTopColor, outline: [st.outlineStyle, st.outlineWidth].join(' '), value: e.value };`;
          await ev(`${sel}.scrollIntoView({ block: 'nearest' }); return true;`);
          const r = await ev(`const r = ${sel}.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom];`);
          const rest = await ev(read);
          const x = (r[0] + r[2]) / 2, y = (r[1] + r[3]) / 2;
          await mouse('mouseMoved', x, y); await mouse('mousePressed', x, y, { button: 'left', buttons: 1, clickCount: 1 }); await mouse('mouseReleased', x, y, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(400);
          const opened = await ev(read);
          await key('Escape', 'Escape', 27); await sleep(200);
          const afterEsc = await ev(read);
          await park(); const afterEscParked = await ev(read);
          out.selects.push({ look, select: s.label, rest, openedByMouse: opened, afterEscape: afterEsc, afterEscapePointerOff: afterEscParked });
          await ev("document.activeElement && document.activeElement.blur(); return true;");
        }
        // a select focused by mouse and closed by choosing: the same select clicked, then a pointer click elsewhere on nothing (the list closes), focus kept?
      }
    }
    // ── menus ──
    if (PARTS.includes('menus')) {
      out.menus = [];
      for (const look of LOOKS) {
        await load(look);
        for (const h of [860, 600]) for (const w of [900, 950, 990, 1000, 1010]) {
          await size(w, h); await sleep(250);
          const m = await ev(`const o = []; for (const d of document.querySelectorAll('header details.more')) { d.open = true; await new Promise((r) => setTimeout(r, 120));
            const t = d.querySelector('summary').getBoundingClientRect(), r = d.querySelector('.more-menu').getBoundingClientRect(); o.push([d.id, Math.round(r.left), Math.round(r.right), Math.round(r.bottom), Math.round(t.left), Math.round(t.right), getComputedStyle(d.querySelector('.more-menu')).overflowY, d.querySelector('.more-menu').scrollHeight > d.querySelector('.more-menu').clientHeight + 1]); d.open = false; }
            return [window.innerWidth, window.innerHeight, o];`);
          const off = m[2].filter(([, l, r, b]) => l < 0 || r > m[0]).map((x) => `${x[0]} ${x[1]}..${x[2]}`);
          const below = m[2].filter(([, , , b, , , oy, scrolls]) => b > m[1]).map((x) => `${x[0]} bottom ${x[3]} (${x[6]}${x[7] ? ', scrolls' : ''})`);
          out.menus.push({ look, w, h, inner: [m[0], m[1]], off, below, boxes: m[2].map((x) => `${x[0]} ${x[1]}..${x[2]} b${x[3]} title ${x[4]}..${x[5]}`) });
          if (look === 'skyline' && h === 860 && (w === 900 || w === 990)) { await ev("document.getElementById('m-file').open = true; return true;"); await sleep(300); await savePng(`menu_file_${look}_${w}.png`); await ev("document.getElementById('m-file').open = false; return true;"); }
        }
        await size(1400, 860);
        if (errors.length) out.menus.push({ look, errors: errors.slice() });
      }
    }
    // ── export ──
    if (PARTS.includes('export')) {
      out.export = [];
      const B = "document.querySelector('header #install > button')";
      const look3 = `const e = ${B}, s = getComputedStyle(e); return { bg: s.backgroundColor, img: s.backgroundImage.slice(0, 80), color: s.color, border: s.borderTopColor, radius: s.borderTopLeftRadius, shadow: s.boxShadow.slice(0, 60), textShadow: s.textShadow.slice(0, 50), hover: e.matches(':hover'), active: e.matches(':active'), disabled: e.disabled };`;
      for (const look of LOOKS) {
        await load(look); await park();
        const r = await ev(`const r = ${B}.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom];`);
        const clip = { x: Math.floor(r[0]), y: Math.floor(r[1]), width: Math.ceil(r[2] - r[0]), height: Math.ceil(r[3] - r[1]) };
        const textOn = async () => {
          // its own fill: the text and its shadow hidden, then the text colour against the 2nd and 98th percentile of the fill's luminance
          const s = await ev(look3);
          await ev(`${B}.style.setProperty('-webkit-text-fill-color', 'transparent', 'important'); ${B}.style.setProperty('text-shadow', 'none', 'important'); return true;`); await sleep(60);
          const tb = await ev(`const g = document.createRange(); g.selectNodeContents(${B}); const r = g.getBoundingClientRect(); return [Math.floor(r.left), Math.floor(r.top), Math.ceil(r.right - r.left), Math.ceil(r.bottom - r.top)];`);
          const img = await grab({ x: tb[0], y: tb[1], width: tb[2], height: tb[3] });
          await ev(`${B}.style.removeProperty('-webkit-text-fill-color'); ${B}.style.removeProperty('text-shadow'); return true;`);
          const L = []; for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) L.push(img.px(x, y));
          L.sort((a, b) => lum(a) - lum(b));
          const lo = L[Math.floor(L.length * 0.02)], hi = L[Math.floor(L.length * 0.98)], tc = rgbOf(s.color);
          return { ...s, contrastOnFill: +Math.min(ratio(tc, lo), ratio(tc, hi)).toFixed(2), fillLo: lo, fillHi: hi };
        };
        const rest = await textOn(); const restImg = await grab(clip);
        await mouse('mouseMoved', (r[0] + r[2]) / 2, (r[1] + r[3]) / 2); await sleep(350);
        const hov = await textOn(); const hovImg = await grab(clip);
        await mouse('mousePressed', (r[0] + r[2]) / 2, (r[1] + r[3]) / 2, { button: 'left', buttons: 1, clickCount: 1 }); await sleep(200);
        const prs = await textOn(); const prsImg = await grab(clip);
        await mouse('mouseMoved', 700, 600, { buttons: 1 }); await mouse('mouseReleased', 700, 600, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(300);
        const changed = (a, b) => { let n = 0; for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) { const p = a.px(x, y), q = b.px(x, y); if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) > 6) n++; } return +(100 * n / (a.w * a.h)).toFixed(1); };
        const factor = await ev(`document.documentElement.style.setProperty('--radius-factor', '.75'); await new Promise((r) => setTimeout(r, 50)); const v = getComputedStyle(${B}).borderTopLeftRadius; document.documentElement.style.removeProperty('--radius-factor'); return v;`);
        const r2 = await ev("const p = document.createElement('i'); p.style.width = 'var(--r2)'; p.style.display = 'block'; document.body.appendChild(p); const w = getComputedStyle(p).width; p.remove(); return w;");
        out.export.push({ look, rest, hovered: hov, pressed: prs, pixelsChangedHover: changed(restImg, hovImg), pixelsChangedPressVsHover: changed(hovImg, prsImg), radiusAtFactor075: factor, r2, errors: errors.slice() });
        if (['aurora', 'skyline', 'skyline-night'].includes(look)) { await mouse('mouseMoved', (r[0] + r[2]) / 2, (r[1] + r[3]) / 2); await sleep(350); fs.writeFileSync(path.join(OUT, `export_${look}_hovered.png`), Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { x: clip.x - 30, y: 0, width: clip.width + 60, height: 44, scale: 2 } })).result.data, 'base64')); await park(); }
      }
    }
    // ── titles ──
    if (PARTS.includes('titles')) {
      out.titles = [];
      for (const look of LOOKS) {
        await load(look); await park();
        const ids = await ev("return [...document.querySelectorAll('header details.more')].map((d) => d.id);");
        const row = { look };
        for (const i of ids) {
          const r = await ev(`const r = document.querySelector('#${i} > summary').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom];`);
          const clip = { x: Math.floor(r[0]) - 2, y: Math.floor(r[1]) - 2, width: Math.ceil(r[2] - r[0]) + 4, height: Math.ceil(r[3] - r[1]) + 4 };
          const a = await grab(clip); await mouse('mouseMoved', (r[0] + r[2]) / 2, (r[1] + r[3]) / 2); await sleep(300); const b = await grab(clip);
          const bg = await ev(`return getComputedStyle(document.querySelector('#${i} > summary')).backgroundColor;`);
          await park();
          let n = 0; for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) { const p = a.px(x, y), q = b.px(x, y); if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) > 6) n++; }
          row[i] = `${(100 * n / (a.w * a.h)).toFixed(1)}% (${bg})`;
        }
        out.titles.push(row);
      }
    }
    // ── strip ──
    if (PARTS.includes('strip')) {
      out.strip = [];
      for (const look of LOOKS) {
        await load(look);
        await ev("const b = [...document.querySelectorAll('#palette button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 600)); return true;");
        out.strip.push({ look, ...(await ev("const r3 = (() => { const p = document.createElement('i'); p.style.display = 'block'; p.style.width = 'var(--r3)'; document.body.appendChild(p); const w = getComputedStyle(p).width; p.remove(); return w; })(); const l = document.querySelector('[aria-label=\"piece values\"]'); if (!l) return { r3, strip: 'not found' }; return { r3, strip: getComputedStyle(l).borderTopLeftRadius, inline: (l.style.cssText.match(/border-radius:[^;]*/) || [''])[0] };")) });
      }
    }
    // ── longfile ──
    if (PARTS.includes('longfile')) {
      out.longfile = [];
      const longName = 'eq-' + 'a saved track whose name runs on for a long while and then more'.slice(0, 61);
      const { identifier } = (await send('Page.addScriptToEvaluateOnNewDocument', { source: stand([longName, 'eq-short']) })).result; standId = identifier;
      for (const look of ['sigil', 'skyline']) {
        await load(look, 1400, 860);
        // File opened and its Open… list unfolded once (the list is filled on the first open); then the window narrowed and widened under it, the box read at each
        await ev(`const d = document.getElementById('m-file'); d.open = true; await new Promise((r) => setTimeout(r, 500));
          const head = [...d.querySelectorAll('.menu-list-head')].find((b) => /^Open/.test(b.textContent.trim())); if (head) { head.click(); await new Promise((r) => setTimeout(r, 600)); } return true;`);
        for (const w of Array.from({ length: 51 }, (_, k) => 900 + 10 * k)) {
          await size(w, 860); await sleep(150);
          const m = await ev(`const d = document.getElementById('m-file'); const mm = d.querySelector('.more-menu').getBoundingClientRect(); const rows = [...d.querySelectorAll('.menu-row')].map((x) => x.textContent.trim().length);
            return { open: d.open, rows, box: [Math.round(mm.left), Math.round(mm.right)], inner: window.innerWidth };`);
          out.longfile.push({ look, w, ...m, off: m.box[0] < 0 || m.box[1] > m.inner });
          if (look === 'skyline' && (w === 900 || w === 1000 || w === 1050)) await savePng(`longfile_${look}_${w}.png`);
        }
        out.longfile.push({ look, errors: errors.slice() });
      }
      await size(1400, 860);
    }
    // ── settings: how far the Settings menu runs past the window's bottom, and what is past it ──
    if (PARTS.includes('settings')) {
      out.settings = [];
      for (const look of ['sigil', 'skyline']) {
        await load(look);
        for (const [w, h] of [[1400, 860], [900, 600], [1920, 1080]]) {
          await size(w, h); await sleep(200);
          out.settings.push({ look, w, h, ...(await ev(`const d = document.getElementById('m-settings'); d.open = true; await new Promise((r) => setTimeout(r, 400));
            const m = d.querySelector('.more-menu'), r = m.getBoundingClientRect(), s = getComputedStyle(m);
            const past = [...m.querySelectorAll('button, input, select, label, h3, .menu-check')].filter((e) => e.getBoundingClientRect().top >= innerHeight).map((e) => (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30));
            const res = { bottom: Math.round(r.bottom), inner: innerHeight, overflowY: s.overflowY, maxHeight: s.maxHeight, pageScrolls: document.scrollingElement.scrollHeight > innerHeight, past }; d.open = false; return res;`)) });
        }
      }
      await size(1400, 860);
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: standId }); standId = null;
    }
    out.title = await ev('return document.title;');
  } finally {
    fs.writeFileSync(path.join(OUT, 'e_l255.json'), JSON.stringify(out, null, 1));
    try { ws.close(); } catch (e) { /* */ } ch.kill(); srv.close(); await sleep(300); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
  }
})().catch((e) => { console.error(e); process.exit(1); });
