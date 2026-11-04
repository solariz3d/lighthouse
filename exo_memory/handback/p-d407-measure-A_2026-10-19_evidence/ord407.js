// ord407.js: D407's orbit / edit / place on an ordinary track, on the real page (headless Chrome, uncapped), one look.
//   const O = require('./ord407.js'); const r = await O.run({ repo, look, build: 12, ms: 3000, places: 30 })
// An ordinary track = `build` pieces placed by real clicks on Extend (100 m, turn 12 deg alternating). Then: ORBIT (right-button drag on the canvas, 3 s),
// EDIT (real ArrowUp/ArrowDown key presses in the Turn field: each is a field change that refreshes the ghost) and PLACE (real clicks on Extend).
// Per event: the key/click's own CDP round trip (the handlers run before it returns), and the animation frames after it (script ms and gap).
const P = require('./pagelib.js'), M = require('./measure.js'); const sleep = P.sleep;
const PRE = `(() => {
  const raf = window.requestAnimationFrame.bind(window); window.__ft = { on: false, frames: new Map(), ev: [] };
  for (const type of ['input', 'click']) { let a = 0; window.addEventListener(type, () => { a = performance.now(); }, true); window.addEventListener(type, () => { if (window.__ft.on) window.__ft.ev.push([type, a, performance.now() - a]); }, false); }
  window.requestAnimationFrame = (fn) => raf((ts) => { const t0 = performance.now(); try { return fn(ts); } finally { if (window.__ft.on) { const f = window.__ft.frames.get(ts) || { ts, n: 0, ms: 0 }; f.n++; f.ms += performance.now() - t0; window.__ft.frames.set(ts, f); } } });
})();`;
const FR = `return [...window.__ft.frames.values()].map((f) => [f.ts, f.ms]);`;
const stats = M.stats;
const gaps = (fr) => { const a = [...fr].sort((x, y) => x[0] - y[0]), o = []; for (let i = 1; i < a.length; i++) o.push(a[i][0] - a[i - 1][0]); return o; };
const FIELD = (re) => `[...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || ''))`;
/** per event (an input or a click): the handler's own time plus the page's animation-frame work in the next 120 ms (frames whose callbacks ran more than 0.5 ms), summed = what one event costs the main thread */
function cost(evs, fr) {
  evs = [...evs].sort((x, y) => x[1] - y[1]); const rows = evs.map(([type, a, d], i) => { const end = Math.min(a + 120, i + 1 < evs.length ? evs[i + 1][1] : Infinity); const own = fr.filter((f) => f[0] >= a && f[0] < end && f[1] > 0.5).reduce((s, f) => s + f[1], 0); const worst = Math.max(0, ...fr.filter((f) => f[0] >= a && f[0] < end).map((f) => f[1])); return { handler: d, frames: own, total: d + own, worstFrame: worst }; });
  const col = (k) => (rows.length ? stats(rows.map((r) => r[k])) : null);
  return { handler: col('handler'), frames: col('frames'), total: col('total'), worstFrame: col('worstFrame') };
}
async function run(o) {
  const h = await P.open(o.repo, { args: ['--disable-frame-rate-limit', '--disable-gpu-vsync'] });
  const res = { look: o.look, build: o.build };
  try {
    await h.load({ storage: { 't180.settings.theme': JSON.stringify(o.look), 't180.guide.done': '1' }, preScript: PRE, ready: "await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;" });
    await h.ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;`);
    const setField = (re, v) => h.ev(`const f = ${FIELD(re)}; f.value = '${v}'; f.dispatchEvent(new Event('input', { bubbles: true })); return true;`);
    const btn = async (text) => { const r = await h.ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(text)} && x.offsetParent); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];`); if (!r) throw new Error('no button ' + text); return r; };
    const click = async (p) => { await h.mouse('mouseMoved', p[0], p[1]); await h.mouse('mousePressed', p[0], p[1], { button: 'left', buttons: 1, clickCount: 1 }); const t = Date.now(); await h.mouse('mouseReleased', p[0], p[1], { button: 'left', buttons: 0, clickCount: 1 }); return Date.now() - t; };
    await setField('/metres added/', '100');
    const ext = await btn('Extend');
    for (let i = 0; i < o.build; i++) { await setField('/turn/i', i % 2 ? '12' : '-12'); await click(await btn('Extend')); await sleep(120); }
    await h.mouse('mouseMoved', 700, 300); await sleep(800);
    res.pieces = await h.ev(`const m = document.body.innerText.match(/(\\d+)\\s+pieces?/i); return m ? m[1] : null;`);
    const win = async (fn) => { await h.ev(`window.__ft.frames.clear(); window.__ft.on = true; return true;`); const out = await fn(); await sleep(250); await h.ev(`window.__ft.on = false; return true;`); const fr = await h.ev(FR); return { out, fr }; };
    // ORBIT: the right button on the canvas, away from the track
    {
      const canvas = await h.ev(`const r = document.getElementById('stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height];`); const cx = canvas[0] + canvas[2] * 0.6, cy = canvas[1] + canvas[3] * 0.5;
      const w = await win(async () => { await h.mouse('mouseMoved', cx, cy); await h.mouse('mousePressed', cx, cy, { button: 'right', buttons: 2, clickCount: 1 }); const t0 = Date.now(); let n = 0; while (Date.now() - t0 < (o.ms || 3000)) { const t = (Date.now() - t0) / 1000; await h.mouse('mouseMoved', cx + Math.sin(t * 3) * 200, cy + Math.cos(t * 2) * 60, { buttons: 2 }); n++; await sleep(4); } await h.mouse('mouseReleased', cx, cy, { button: 'right', buttons: 0, clickCount: 1 }); return n; });
      const gp = gaps(w.fr); res.orbit = { moves: w.out, frames: w.fr.length, frame: gp.length ? stats(gp) : null, script: stats(w.fr.map((f) => f[1])) };
    }
    // EDIT: key presses in the Turn field
    {
      await setField('/turn/i', '10'); await sleep(300);
      const VALS = ['5', '23', '-8', '14', '-19', '2', '31', '-3'];
      const key = async (i) => { await h.ev('const f = ' + FIELD('/turn/i') + '; f.focus(); f.select(); return true;'); const t = Date.now(); await h.send('Input.insertText', { text: VALS[i % VALS.length] }); return Date.now() - t; };
      const per = [];
      const w = await win(async () => { for (let i = 0; i < (o.edits || 40); i++) { per.push(await key(i)); await sleep(60); } });
      const field = await h.ev(`return [window.__turnBefore, document.activeElement && document.activeElement.value];`);
      const evs = await h.ev(`return window.__ft.ev.filter((e) => e[0] === 'input');`);
      res.edit = { keys: per.length, field, inputs: evs.length, ...cost(evs, w.fr) };
    }
    // PLACE: real clicks on Extend
    {
      await h.ev(`document.activeElement && document.activeElement.blur(); return true;`);
      const evs = [], frs = [];
      for (let i = 0; i < (o.places || 30); i++) {
        await setField('/turn/i', i % 2 ? '12' : '-12'); await sleep(200);
        await h.ev(`window.__ft.frames.clear(); window.__ft.ev.length = 0; window.__ft.on = true; return true;`);
        await click(await btn('Extend')); await sleep(300); await h.ev(`window.__ft.on = false; return true;`);
        evs.push(...(await h.ev(`return window.__ft.ev.filter((e) => e[0] === 'click');`))); frs.push(...(await h.ev(FR)));
        await h.mouse('mouseMoved', 700, 300);
      }
      res.place = { places: evs.length, ...cost(evs, frs) };
    }
    res.errors = h.errors.slice(0, 3);
  } finally { await h.close(); }
  return res;
}
module.exports = { run };
if (require.main === module) { const a = Object.fromEntries(process.argv.slice(2).map((s) => { const [k, v] = s.split('='); return [k, isNaN(+v) ? v : +v]; })); run({ repo: a.repo, look: a.look || 'aqua', build: a.build || 12, ms: a.ms, places: a.places, edits: a.edits }).then((r) => { console.log(JSON.stringify(r)); process.exit(0); }).catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); }); }
