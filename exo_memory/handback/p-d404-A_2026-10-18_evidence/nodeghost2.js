const path = require('path'); const repo = process.argv[2], L = +process.argv[3] || 1000;
const { createCoreShell } = require(path.join(repo, 'app/core/coreshell.js')); const { createTrackModel } = require(path.join(repo, 'app/preview/trackmodel.js'));
(async () => {
  const sh = await createCoreShell({ brushFn: null, autosaveMs: 0 }); sh.extend({ length: 300 });
  const tm = createTrackModel(); tm.update(sh.getState().resolved);
  const T = (f) => { const t = process.hrtime.bigint(); const r = f(); return [r, Number(process.hrtime.bigint() - t) / 1e6]; };
  const med = (a) => { const b = a.slice(50).sort((x, y) => x - y); return b[b.length >> 1]; }, p95 = (a) => { const b = a.slice(50).sort((x, y) => x - y); return b[Math.floor(b.length * 0.95)]; };
  const R = { cand: [], ghost: [], readout: [] };
  for (let i = 0; i < 200; i++) {
    const turn = 5 + i * 0.37, o = { length: L, turnDeg: turn };
    let c, a, b;
    try { [c, a] = T(() => sh.candidate(o, { coarse: !!process.env.COARSE })); R.cand.push(a); [, b] = T(() => tm.ghostFor(c, { cheap: true })); R.ghost.push(b); const [, r] = T(() => sh.candidateReadout(o)); R.readout.push(r); } catch (e) { console.log('ERR', e.message); break; }
  }
  console.log(`L=${L}`, Object.entries(R).map(([k, v]) => `${k} ${med(v).toFixed(1)} ms (p95 ${p95(v).toFixed(1)})`).join(', '));
})();
