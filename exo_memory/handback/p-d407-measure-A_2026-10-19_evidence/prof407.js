// prof407.js <repo> <what: release|place|edit> [length]: a CPU profile of the main thread across just that action on the real page (attribution only: not a timing of record)
const P = require('./pagelib.js'), sleep = P.sleep;
const [repo, what, len0] = process.argv.slice(2), L = +(len0 || 1000);
const FIELD = (re) => `[...document.querySelectorAll('#palette input')].find((e) => e.type !== 'checkbox' && ${re}.test(e.getAttribute('aria-label') || e.title || '') && !/start/i.test(e.getAttribute('aria-label') || ''))`;
function summarise(prof, top = 45) {
  const byId = new Map(prof.nodes.map((n) => [n.id, n])); const self = new Map(); let total = 0;
  for (let i = 0; i < prof.samples.length; i++) { const n = byId.get(prof.samples[i]), dt = (prof.timeDeltas[i] || 0) / 1000; total += dt; const cf = n.callFrame; if (cf.functionName === '(idle)' || cf.functionName === '(program)') continue; const k = `${cf.functionName || '(anon)'} ${cf.url.split('/').slice(-2).join('/')}:${cf.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + dt); }
  const parent = new Map(); for (const n of prof.nodes) for (const c of n.children || []) parent.set(c, n.id);
  const incl = new Map(); for (let i = 0; i < prof.samples.length; i++) { const dt = (prof.timeDeltas[i] || 0) / 1000; const seen = new Set(); let id = prof.samples[i]; while (id) { const cf = byId.get(id).callFrame; const k = `${cf.functionName || '(anon)'} ${cf.url.split('/').slice(-2).join('/')}:${cf.lineNumber + 1}`; if (!seen.has(k)) { seen.add(k); incl.set(k, (incl.get(k) || 0) + dt); } id = parent.get(id); } }
  const f = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, top).map(([k, v]) => `${v.toFixed(1).padStart(8)} ms  ${k}`).join('\n');
  return `total sampled ${total.toFixed(0)} ms\n--- self\n${f(self)}\n--- inclusive\n${f(incl)}`;
}
(async () => {
  const h = await P.open(repo, { args: ['--disable-frame-rate-limit', '--disable-gpu-vsync'] });
  try {
    await h.load({ storage: { 't180.settings.theme': '"aqua"', 't180.guide.done': '1' }, ready: "await new Promise((r) => setTimeout(r, 1500)); return !!document.querySelector('#palette input[aria-label]') && document.querySelectorAll('#stage canvas').length >= 2;" });
    await h.ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Skip'); if (b && b.offsetParent) b.click(); return true;`);
    const setField = (re, v) => h.ev(`const f = ${FIELD(re)}; f.value = '${v}'; f.dispatchEvent(new Event('input', { bubbles: true })); return true;`);
    const btn = async (t) => h.ev(`const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === ${JSON.stringify(t)} && x.offsetParent); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2];`);
    const click = async (p) => { await h.mouse('mouseMoved', p[0], p[1]); await h.mouse('mousePressed', p[0], p[1], { button: 'left', buttons: 1, clickCount: 1 }); await h.mouse('mouseReleased', p[0], p[1], { button: 'left', buttons: 0, clickCount: 1 }); };
    if (what === 'release') {
      await setField('/metres added/', String(L)); await sleep(1200);
      const M = require('./measure.js'); // reuse its handle finder is not exported: find the turn handle by colour here
      const found = await h.ev(`const want = [185, 104, 255]; const out = []; for (const c of document.querySelectorAll('#stage canvas')) { let ctx = null; try { ctx = c.getContext('2d'); } catch (e) {} if (!ctx) continue; const d = ctx.getImageData(0, 0, c.width, c.height).data; let sx = 0, sy = 0, n = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const k = (y * c.width + x) * 4; if (d[k + 3] < 200) continue; if (Math.abs(d[k] - want[0]) < 14 && Math.abs(d[k + 1] - want[1]) < 14 && Math.abs(d[k + 2] - want[2]) < 14) { sx += x; sy += y; n++; } } if (n) out.push([sx / n, sy / n, n, c.clientWidth / c.width]); } return out;`);
      const off = await h.ev(`const r = document.getElementById('stage').getBoundingClientRect(); return [r.left, r.top];`);
      const c = found.sort((a, b) => b[2] - a[2])[0]; const hx = c[0] * c[3] + off[0], hy = c[1] * c[3] + off[1];
      await h.mouse('mouseMoved', hx, hy); await sleep(50); await h.mouse('mousePressed', hx, hy, { button: 'left', buttons: 1, clickCount: 1 });
      for (let i = 0; i < 40; i++) { await h.mouse('mouseMoved', hx + Math.sin(i / 6) * 200, hy, { buttons: 1 }); await sleep(8); }
      await h.mouse('mouseMoved', hx + 60, hy, { buttons: 1 }); await sleep(200);
      await h.send('Profiler.enable'); await h.send('Profiler.setSamplingInterval', { interval: 100 }); await h.send('Profiler.start');
      await h.mouse('mouseReleased', hx + 60, hy, { button: 'left', buttons: 0, clickCount: 1 }); await sleep(Math.max(1500, L / 4));
    } else {
      await setField('/metres added/', '100'); const ext = await btn('Extend');
      for (let i = 0; i < 12; i++) { await setField('/turn/i', i % 2 ? '12' : '-12'); await click(await btn('Extend')); await sleep(120); }
      await h.mouse('mouseMoved', 700, 300); await sleep(800);
      await h.send('Profiler.enable'); await h.send('Profiler.setSamplingInterval', { interval: 100 }); await h.send('Profiler.start');
      if (what === 'place') for (let i = 0; i < 20; i++) { await setField('/turn/i', i % 2 ? '12' : '-12'); await sleep(150); await click(await btn('Extend')); await sleep(250); await h.mouse('mouseMoved', 700, 300); }
      else { const V = ['5', '23', '-8', '14', '-19', '2', '31', '-3']; for (let i = 0; i < 40; i++) { await h.ev('const f = ' + FIELD('/turn/i') + '; f.focus(); f.select(); return true;'); await h.send('Input.insertText', { text: V[i % 8] }); await sleep(60); } }
    }
    const prof = (await h.send('Profiler.stop')).result.profile;
    console.log(what, L, '\n' + summarise(prof));
  } finally { await h.close(); }
  process.exit(0);
})().catch((e) => { console.log('FAILED', e.stack || e); process.exit(1); });
