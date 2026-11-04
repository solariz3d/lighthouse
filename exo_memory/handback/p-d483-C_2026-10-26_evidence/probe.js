// probe.js (C, D482 part 2): node probe.js <checkout> <label> <outdir> [modes] [--profile]
// drag-frame.test.js's own load and stretch drag (1,000 m, aqua, +-220 px, 3 s), in headless Chrome (--mute-audio, title zz-headless-test), with every
// requestAnimationFrame callback timed BY WHERE IT WAS REGISTERED (the caller's stack line, cached per function), in two phases:
// idle (2 s, no pointer press) and drag. A work frame is one whose callbacks ran > 1 ms, as in the harness.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const REPO = path.resolve(process.argv[2]), LABEL = process.argv[3], OUT = path.resolve(process.argv[4]);
const MODES = (process.argv[5] && !process.argv[5].startsWith('--') ? process.argv[5] : 'plain,bank,cup,edge,stack').split(',');
const KIND = ((process.argv.find((x) => x.startsWith('--handle=')) || '--handle=length').slice(9)), FIELD_RE = KIND === 'length' ? '/metres|length/i' : '/turn/i', AMP = KIND === 'length' ? 220 : 250; const ZOOM = +((process.argv.find((x) => x.startsWith('--zoom=')) || '--zoom=0').slice(7)); const PROFILE = process.argv.includes('--profile'), PLACED = process.argv.includes('--placed');
const { chromePath, launchChrome, connect } = require(path.join(REPO, 'app', 'test', 'soundrender.js'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.css': 'text/css' };
const FIELDS = { bank: { '/^degrees of bank/': 20 }, cup: { '/^cup:/': 30 }, edge: { '/^left edge/': 20 }, stack: { '/^degrees of bank/': 20, '/^cup:/': 30, '/^left edge/': 20 }, plain: {} };
const PRE = `(() => { const raf = window.requestAnimationFrame.bind(window), where = new WeakMap(); window.__ft = { on: false, frames: new Map() };
  const origin = (fn) => { let o = where.get(fn); if (!o) { const l = (new Error().stack || '').split('\\n')[3] || '?'; o = l.trim().replace(/^at /, '').replace(/https?:\\/\\/[^/]+\\//, '').replace(/:\\d+\\)?$/, ')'); where.set(fn, o); } return o; };
  window.requestAnimationFrame = (fn) => { const o = origin(fn); return raf((ts) => { const t0 = performance.now(); try { return fn(ts); } finally { if (window.__ft.on) { const dt = performance.now() - t0; const f = window.__ft.frames.get(ts) || { ms: 0, by: {} }; f.ms += dt; f.by[o] = (f.by[o] || 0) + dt; window.__ft.frames.set(ts, f); } } }); };
  document.title = 'zz-headless-test'; })();`;
const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = http.createServer((q, s) => {
    const p = path.normalize(path.join(REPO, decodeURIComponent(q.url.split('?')[0])));
    if (!p.startsWith(REPO)) { s.writeHead(403); s.end(); return; }
    fs.readFile(p, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' }); s.end(b); });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${srv.address().port}`;
  const { ch, dir, tgt } = await launchChrome(chromePath(), ['--window-size=1400,860', '--disable-frame-rate-limit', '--disable-gpu-vsync'], 't180c483-');
  const errors = [];
  const { ws, send } = await connect(tgt.webSocketDebuggerUrl, (d) => { if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.text).slice(0, 200)); });
  const ev = async (expr) => { const d = await send('Runtime.evaluate', { expression: `(async () => { ${expr} })()`, awaitPromise: true, returnByValue: true }); if (!d.result || d.result.exceptionDetails) throw new Error(`page: ${JSON.stringify(d.result ? d.result.exceptionDetails : d).slice(0, 500)}`); return d.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 860, deviceScaleFactor: 1, mobile: false });
  const load = async () => {
    await send('Page.navigate', { url: `${base}/app/lib/cjs.js` });
    for (let i = 0; i < 50; i++) { await sleep(100); try { if ((await ev('return location.href;')) === `${base}/app/lib/cjs.js`) break; } catch (e) { /* loading */ } }
    await ev(`localStorage.clear(); localStorage.setItem('t180.settings.theme', '"aqua"'); localStorage.setItem('t180.guide.done', '1'); return true;`);
    const id = (await send('Page.addScriptToEvaluateOnNewDocument', { source: PRE })).result.identifier;
    await send('Page.navigate', { url: `${base}/app/index.html` });
    for (let i = 0; i < 200; i++) { await sleep(200); try { if (await ev("await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;")) break; } catch (e) { /* loading */ } }
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: id });
    await ev("document.title = 'zz-headless-test'; const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;");
  };
  const findHandle = (rgb) => ev(`
    const want = ${JSON.stringify(rgb)}, hits = [], off = document.getElementById('stage').getBoundingClientRect();
    for (const c of document.querySelectorAll('#stage canvas')) {
      let ctx = null; try { ctx = c.getContext('2d'); } catch (e) {} if (!ctx) continue;
      const d = ctx.getImageData(0, 0, c.width, c.height).data, cells = new Map();
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4; if (d[k + 3] < 200) continue; if (Math.abs(d[k] - want[0]) < 14 && Math.abs(d[k + 1] - want[1]) < 14 && Math.abs(d[k + 2] - want[2]) < 14) { const key = (x >> 5) + ',' + (y >> 5), a = cells.get(key) || [0, 0, 0]; a[0] += x; a[1] += y; a[2]++; cells.set(key, a); } }
      const groups = []; for (const [k, a] of cells) { const cx = +k.split(',')[0], cy = +k.split(',')[1]; let g = groups.find((g) => Math.abs(g.cx - cx) <= 1 && Math.abs(g.cy - cy) <= 1); if (!g) { g = { cx, cy, sx: 0, sy: 0, n: 0 }; groups.push(g); } g.sx += a[0]; g.sy += a[1]; g.n += a[2]; }
      for (const g of groups) if (g.n > 30) hits.push({ x: g.sx / g.n * c.clientWidth / c.width + off.left, y: g.sy / g.n * c.clientWidth / c.width + off.top, n: g.n });
    }
    hits.sort((a, b) => b.n - a.n); return hits[0] || null;`);
  const mouse = (type, x, y, extra = {}) => send('Input.dispatchMouseEvent', { type, x, y, button: extra.button || 'none', buttons: extra.buttons || 0, clickCount: extra.clickCount || 0 });
  const fieldNow = () => ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${FIELD_RE}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || '')); return f ? f.value : null;`);
  const collect = async (secs) => {
    const frames = await ev('return [...window.__ft.frames.values()];');
    const work = frames.filter((f) => f.ms > 1), by = {};
    for (const f of frames) for (const [o, ms] of Object.entries(f.by)) { const b = by[o] || (by[o] = { over05: 0, ms: 0, list: [] }); b.ms += ms; if (ms > 0.5) b.over05++; b.list.push(ms); }
    const byOut = Object.entries(by).map(([o, b]) => ({ origin: o, calls: b.list.length, over05PerSec: +(b.over05 / secs).toFixed(1), msPerSec: +(b.ms / secs).toFixed(1), p95: +pct(b.list, 0.95).toFixed(3), max: +Math.max(...b.list).toFixed(2) })).sort((a, b) => b.msPerSec - a.msPerSec);
    return { framesPerSec: +(frames.length / secs).toFixed(1), workPerSec: +(work.length / secs).toFixed(1), p95: work.length ? +pct(work.map((f) => f.ms), 0.95).toFixed(2) : null, median: work.length ? +pct(work.map((f) => f.ms), 0.5).toFixed(2) : null, by: byOut.slice(0, 8) };
  };
  const rows = [];
  for (const mode of MODES) {
    await load();
    if (PLACED) await ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => /metres added/.test(e.getAttribute('aria-label') || e.title || '')); f.value = '100'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 600)); const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Extend'); b.click(); await new Promise((r) => setTimeout(r, 1200)); return true;`);
    for (const [re, v] of Object.entries(FIELDS[mode])) await ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '')); f.value = '${v}'; f.dispatchEvent(new Event('input', { bubbles: true })); return true;`);
    await ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => /metres added/.test(e.getAttribute('aria-label') || e.title || '')); f.value = '1000'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 1200)); return true;`);
    await sleep(250);
    // idle: the pointer in a corner, nothing pressed
    await mouse('mouseMoved', 5, 5); await sleep(300);
    await ev('window.__ft.frames.clear(); window.__ft.on = true; return true;'); await sleep(2000); await ev('window.__ft.on = false; return true;');
    const idle = await collect(2);
    if (PLACED) { for (let z = 0; z < ZOOM; z++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 400, deltaX: 0, deltaY: -100 }); await sleep(120); } await mouse('mouseMoved', 5, 5); await sleep(1500); }
    const listed = PLACED || KIND !== 'length' ? await ev("let l = null; document.dispatchEvent(new CustomEvent('t180:handles-request', { detail: { reply: (x) => { l = x; } } })); const r = document.getElementById('stage').getBoundingClientRect(); return { l, left: r.left, top: r.top };") : null;
    const lh = listed && listed.l ? listed.l.find((x) => x.kind === KIND) : null, ax = lh && Math.hypot(lh.dx, lh.dy) > 0 ? [lh.dx / Math.hypot(lh.dx, lh.dy), lh.dy / Math.hypot(lh.dx, lh.dy)] : [0, -1];
    if (PLACED || KIND !== 'length') console.error('DEBUG ' + JSON.stringify({ zoom: ZOOM, spreadX: listed && listed.l && listed.l.length ? Math.max(...listed.l.map((x) => x.x)) - Math.min(...listed.l.map((x) => x.x)) : null, lh }));
    const h = PLACED || KIND !== 'length' ? (lh ? { x: lh.x + listed.left, y: lh.y + listed.top } : null) : await findHandle([255, 255, 255]); if (!h) { const row = { label: LABEL, mode, placed: PLACED, idle, drag: 'no handle', listed }; rows.push(row); console.log(JSON.stringify(row)); continue; }
    const before = await fieldNow();
    await mouse('mouseMoved', h.x, h.y); await sleep(50); await mouse('mousePressed', h.x, h.y, { button: 'left', buttons: 1, clickCount: 1 }); await sleep(100);
    if (PROFILE) { await send('Profiler.enable'); await send('Profiler.setSamplingInterval', { interval: 200 }); await send('Profiler.start'); }
    await ev('window.__ft.frames.clear(); window.__ft.on = true; return true;');
    const t0 = Date.now(); let moves = 0;
    while (Date.now() - t0 < 3000) { const d = Math.sin(((Date.now() - t0) / 1000) * Math.PI) * AMP; await mouse('mouseMoved', h.x + ax[0] * d, h.y + ax[1] * d, { buttons: 1 }); moves++; await sleep(4); }
    const frozen = await ev("const last = (a) => { for (let i = (a || []).length - 1; i >= 0; i--) if (a[i] && a[i].profile) return a[i]; return null; }; let g = null, t = null; document.dispatchEvent(new CustomEvent('t180:ghost-request', { detail: { reply: (x) => { g = x; } } })); document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (x) => { t = x; } } })); const gs = last(g && g.segments), ts = last(t && t.segments); return { ghostKeys: g ? Object.keys(g).join(',') : null, ghostHeadFrozen: gs ? Object.isFrozen(gs) : null, trackPath: !!(t && t.path), trackHeadFrozen: ts ? Object.isFrozen(ts) : null, ghostHeadKnots: gs ? gs.profile.u.length : null, segs: g && g.segments ? g.segments.length : null, roadSegs: g && g.segments ? g.segments.filter((x) => x && x.profile).length : null, segFrozen: gs ? Object.isFrozen(gs) : null, profFrozen: gs ? [Object.isFrozen(gs.profile), Object.isFrozen(gs.profile.u), Object.isFrozen(gs.profile.psi)] : null, blendFrom: gs && gs.blend ? [gs.blend.from === gs.profile, Object.isFrozen(gs.blend), Object.isFrozen(gs.blend.from)] : null, fractions: gs && gs.fractions ? [gs.fractions.length, Object.isFrozen(gs.fractions)] : null, keys: gs ? Object.keys(gs).join(',') : null, jsonLen: gs ? JSON.stringify(gs).length : null, profJson: gs ? JSON.stringify(gs.profile).length : null };");
    await ev('window.__ft.on = false; return true;');
    if (PROFILE) { const prof = (await send('Profiler.stop')).result.profile; fs.writeFileSync(path.join(OUT, `${LABEL}-${mode}.cpuprofile`), JSON.stringify(prof)); }
    const during = await fieldNow();
    const drag = await collect(3); drag.moves = moves; drag.held = during !== before; drag.frozen = frozen;
    await mouse('mouseReleased', h.x, h.y, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(600);
    const pieces = await ev("let n = null; document.dispatchEvent(new CustomEvent('t180:track-request', { detail: { reply: (t) => { n = t && t.segments ? t.segments.length : 0; } } })); return n;"); const row = { label: LABEL, mode, handle: KIND, placed: PLACED, trackSegments: pieces, idle, drag }; rows.push(row);
    console.log(JSON.stringify(row));
  }
  fs.writeFileSync(path.join(OUT, `${LABEL}.json`), JSON.stringify({ rows, errors }, null, 1));
  if (errors.length) console.log('page errors: ' + JSON.stringify(errors.slice(0, 5)));
  try { ws.close(); } catch (e) { /* closing */ } ch.kill(); srv.close(); await sleep(400); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* held */ }
})().catch((e) => { console.error(e.stack || e); process.exit(1); });
