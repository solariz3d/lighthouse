// measure.js: D404's drag frame-time harness on the real page, in headless Chrome (the machine's own GPU).
//   const M = require('./measure.js'); const r = await M.run({ repo, look, kind: 'turn'|'stretch'|'bank', length: 1000, ms: 4000, noblur: false, profile: false, trace: false })
// One run: a fresh page in the look, the Extend length field set, the handle found on the overlay canvas, a real (trusted) mouse press on it, then the pointer
// is moved back and forth every ~8 ms for `ms` while every animation frame is timed, then released. Frame time = the gap between consecutive animation-frame
// timestamps (Chrome run without its frame-rate limit and vsync, so an idle page runs far faster than a display); scriptMs = the time the page's own animation-frame
// callbacks took inside that frame.
const P = require('./pagelib.js'); const fs = require('fs');
const sleep = P.sleep;
const LOOKS = { aqua: 'aqua', skyline: 'skyline', glass: 'glass', aurora: 'aurora', sigil: 'sigil' };
const PRE = `(() => {
  const raf = window.requestAnimationFrame.bind(window); window.__ft = { on: false, frames: new Map(), moves: 0 };
  window.requestAnimationFrame = (fn) => raf((ts) => { const t0 = performance.now(); try { return fn(ts); } finally { if (window.__ft.on) { const f = window.__ft.frames.get(ts) || { ts, n: 0, ms: 0 }; f.n++; f.ms += performance.now() - t0; window.__ft.frames.set(ts, f); } } });
})();`;
const NOBLUR = `(() => { const s = document.createElement('style'); s.id = 'd404-noblur'; s.textContent = '*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; animation: none !important; }'; document.head.appendChild(s); })();`;

const pct = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))]; };
const stats = (a) => ({ n: a.length, median: +pct(a, 0.5).toFixed(2), p95: +pct(a, 0.95).toFixed(2), p99: +pct(a, 0.99).toFixed(2), max: +Math.max(...a).toFixed(2), over69: +(a.filter((v) => v > 6.94).length / a.length).toFixed(3), over42: +(a.filter((v) => v > 4.17).length / a.length).toFixed(3), over167: +(a.filter((v) => v > 16.7).length / a.length).toFixed(3) });

/** the cluster centres of a colour on the overlay canvas: [{x, y, n}] biggest first (css px of the stage) */
const FIND = (rgb) => `
  const want = ${JSON.stringify(rgb)}, out = [];
  for (const c of document.querySelectorAll('#stage canvas')) {
    let ctx = null; try { ctx = c.getContext('2d'); } catch (e) {} if (!ctx) continue;
    const d = ctx.getImageData(0, 0, c.width, c.height).data, cells = new Map();
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4; if (d[k + 3] < 200) continue; if (Math.abs(d[k] - want[0]) < 14 && Math.abs(d[k + 1] - want[1]) < 14 && Math.abs(d[k + 2] - want[2]) < 14) { const key = (x >> 5) + ',' + (y >> 5); const a = cells.get(key) || [0, 0, 0]; a[0] += x; a[1] += y; a[2]++; cells.set(key, a); } }
    const list = [...cells.entries()].map(([k, a]) => ({ cx: +k.split(',')[0], cy: +k.split(',')[1], x: a[0] / a[2], y: a[1] / a[2], n: a[2] }));
    const groups = []; for (const c1 of list) { let g = groups.find((g) => Math.abs(g.cx - c1.cx) <= 1 && Math.abs(g.cy - c1.cy) <= 1); if (!g) { g = { cx: c1.cx, cy: c1.cy, sx: 0, sy: 0, n: 0 }; groups.push(g); } g.sx += c1.x * c1.n; g.sy += c1.y * c1.n; g.n += c1.n; }
    for (const g of groups) out.push({ x: g.sx / g.n, y: g.sy / g.n, n: g.n, sx: c.clientWidth / c.width });
  }
  return out.sort((a, b) => b.n - a.n);`;
const COLOUR = { turn: [185, 104, 255], stretch: [255, 255, 255], bank: [77, 134, 255], width: [255, 90, 90], climb: [255, 210, 61], cup: [61, 220, 110] };
const FIELD = { turn: '/turn/i', stretch: '/metres|length/i', bank: '/bank/i' };

async function run(o) {
  const h = await P.open(o.repo, { args: [...(o.capped ? [] : ['--disable-frame-rate-limit', '--disable-gpu-vsync']), ...(o.args || [])], srRepo: o.srRepo });
  const res = { look: o.look, kind: o.kind, length: o.length, noblur: !!o.noblur };
  try {
    await h.load({ storage: { 't180.settings.theme': JSON.stringify(o.look), 't180.guide.done': '1', ...(o.storage || {}) }, preScript: PRE, ready: "await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;" });
    if (o.hook) await o.hook(h);
    // out of the way: the first-run guide
    await h.ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;`);
    await h.ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => /metres added/.test(e.getAttribute('aria-label') || e.title || '')); f.value = '${o.length}'; f.dispatchEvent(new Event('input', { bubbles: true })); await new Promise((r) => setTimeout(r, 1200)); return true;`);
    if (o.noblur) await h.ev(NOBLUR + '; return true;');
    await sleep(600);
    const found = await h.ev(FIND(COLOUR[o.kind]));
    if (!found.length) throw new Error('no handle of colour ' + o.kind);
    // the biggest cluster at the stage's offset: the overlay canvas is at the stage's top-left
    const off = await h.ev(`const r = document.getElementById('stage').getBoundingClientRect(); return [r.left, r.top];`);
    let pick = found[0]; if (o.kind === 'turn') pick = found.filter((c) => c.n > 30).sort((a, b) => b.x - a.x)[0] || found[0];
    const hx = pick.x * pick.sx + off[0], hy = pick.y * pick.sx + off[1];
    res.handle = [Math.round(hx), Math.round(hy), pick.n];
    const field = (re) => h.ev(`const f = [...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || '')); return f ? f.value : null;`);
    res.fieldBefore = await field(FIELD[o.kind]);
    // idle baseline (no drag): the same frames timed with the page at rest
    await h.ev(`window.__ft.frames.clear(); window.__ft.on = true; await new Promise((r) => setTimeout(r, 1500)); window.__ft.on = false; return true;`);
    const idle = await h.ev(`return [...window.__ft.frames.values()].map((f) => [f.ts, f.ms]);`);
    // the drag
    await h.mouse('mouseMoved', hx, hy); await sleep(50);
    await h.mouse('mousePressed', hx, hy, { button: 'left', buttons: 1, clickCount: 1 }); await sleep(100);
    if (o.profile) await h.send('Profiler.enable'), await h.send('Profiler.setSamplingInterval', { interval: 200 }), await h.send('Profiler.start');
    if (o.trace) { h.traceEvents = []; h.setOnEvent((d) => { if (d.method === 'Tracing.dataCollected') h.traceEvents.push(...d.params.value); }); await h.send('Tracing.start', { categories: 'devtools.timeline,cc,gpu,viz,toplevel,blink,v8', transferMode: 'ReportEvents' }); }
    await h.ev(`window.__ft.frames.clear(); window.__ft.on = true; return true;`);
    const t0 = Date.now(); let k = 0, moves = 0; const amp = o.amp || (o.kind === 'turn' ? 250 : o.kind === 'stretch' ? 220 : 160);
    while (Date.now() - t0 < o.ms) {
      const t = (Date.now() - t0) / 1000, dx = Math.sin(t * Math.PI * 1.0) * amp;
      const x = o.kind === 'stretch' ? hx : hx + dx, y = o.kind === 'stretch' ? hy - dx : hy;   // the length handle is dragged forward (up the screen)
      await h.mouse('mouseMoved', x, y, { buttons: 1 }); moves++; await sleep(4);
      if (o.shotMid && !res.midShot && Date.now() - t0 > o.ms / 2) { res.midShot = true; await h.shot(o.shotMid); }
    }
    const dur = Date.now() - t0;
    await h.ev(`window.__ft.on = false; return true;`);
    let prof = null; if (o.profile) prof = (await h.send('Profiler.stop')).result.profile;
    if (o.trace) { const done = new Promise((r) => h.setOnEvent((d) => { if (d.method === 'Tracing.dataCollected') h.traceEvents.push(...d.params.value); if (d.method === 'Tracing.tracingComplete') r(); })); await h.send('Tracing.end'); await done; }
    res.fieldDuring = await field(FIELD[o.kind]);
    await h.mouse('mouseReleased', hx, hy, { button: 'left', buttons: 0, clickCount: 1 });
    await sleep(300);
    const fr = await h.ev(`return [...window.__ft.frames.values()].map((f) => [f.ts, f.ms]);`);
    const gaps = (arr) => { const a = [...arr].sort((x, y) => x[0] - y[0]); const out = []; for (let i = 1; i < a.length; i++) out.push(a[i][0] - a[i - 1][0]); return out; };
    res.moves = moves; res.dragMs = dur; res.frames = fr.length; res.fps = +(fr.length / (dur / 1000)).toFixed(1);
    // the frames in which the page did real work (a ghost rebuilt: its animation-frame callbacks ran more than 1 ms): the cost of such a frame is the time to the NEXT frame
    { const a = [...fr].sort((x, y) => x[0] - y[0]), cost = [], sc = []; for (let i = 0; i + 1 < a.length; i++) if (a[i][1] > 1) { cost.push(a[i + 1][0] - a[i][0]); sc.push(a[i][1]); } res.work = cost.length ? { frames: cost.length, cost: stats(cost), script: stats(sc) } : null; }
    res.capped = !!o.capped;
    res.frame = stats(gaps(fr)); res.script = stats(fr.map((f) => f[1])); res.idle = { frame: stats(gaps(idle)), script: stats(idle.map((f) => f[1])) };
    res.errors = h.errors.slice(0, 3);
    if (o.profile && prof) res.profile = prof;
    if (o.trace) res.traceSummary = summariseTrace(h.traceEvents);
    if (o.shot) await h.shot(o.shot);
  } finally { await h.close(); }
  return res;
}
/** where the time of a drag went, from a Chrome trace: by thread kind and by event name (complete events, ph X, durations in ms) */
function summariseTrace(ev) {
  const tname = new Map(), pname = new Map();
  for (const e of ev) if (e.ph === 'M') { if (e.name === 'thread_name') tname.set(e.pid + ':' + e.tid, e.args.name); if (e.name === 'process_name') pname.set(e.pid, e.args.name); }
  const byThread = {}, byName = {}, counts = {};
  let t0 = Infinity, t1 = 0;
  for (const e of ev) if (e.ph === 'X' && e.dur !== undefined) { if (e.ts < t0) t0 = e.ts; if (e.ts + e.dur > t1) t1 = e.ts + e.dur; }
  for (const e of ev) {
    if (e.ph !== 'X' || e.dur === undefined) continue;
    const th = (pname.get(e.pid) || e.pid) + '/' + (tname.get(e.pid + ':' + e.tid) || e.tid), key = e.name;
    const T = byThread[th] || (byThread[th] = {}); const a = T[key] || (T[key] = [0, 0]); a[0]++; a[1] += e.dur / 1000;
  }
  const out = {};
  for (const [th, T] of Object.entries(byThread)) { const list = Object.entries(T).sort((x, y) => y[1][1] - x[1][1]).slice(0, 12).map(([n, a]) => [n, a[0], +a[1].toFixed(1)]); const tot = list.reduce((x, y) => x + y[2], 0); if (tot > 20) out[th] = list; }
  return { windowMs: +((t1 - t0) / 1000).toFixed(0), threads: out };
}
module.exports = { run, stats, pct, summariseTrace };
if (require.main === module) {
  const a = Object.fromEntries(process.argv.slice(2).map((s) => { const [k, v] = s.split('='); return [k, v === undefined ? true : (isNaN(+v) ? v : +v)]; }));
  run({ repo: a.repo, look: a.look || 'aqua', kind: a.kind || 'turn', length: a.length || 1000, ms: a.ms || 4000, noblur: !!a.noblur, shot: a.shot }).then((r) => { delete r.profile; console.log(JSON.stringify(r)); process.exit(0); }).catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
}
