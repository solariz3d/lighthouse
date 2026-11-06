// ---- mine (D642 review of 57cf0a0): what sliding a MARK costs. One slide per process (cold JIT, cold probe memo): his p2's extra bank made at −88.45 from 500 through the
// panel, then its mark slid with panel.secondDrag (the mark drag's own path, which walks) from 420 to 540 m and back by 1 m, a frame after each move, every move timed
// (secondDrag + frame). MODE rolling: his bank eased over the whole piece (the walk asks the core's probe); MODE early: the same with the bank "early" (no moving first ramp,
// no probe): the flat analogue. The adapter's bankPlan calls (the probe roads, and the candidate's own build) counted per move. Prints one JSON line.
const MODE = process.env.MODE || 'rolling';
const AD = require(WT + '/src/core/adapter.js'); let plans = 0; const bp = AD.bankPlan; AD.bankPlan = (...a) => { plans++; return bp(...a); };
const q = (xs, f) => { const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(f * s.length))].toFixed(2); };
(async () => {
  const p = await his();
  if (MODE === 'early') { const box = p.root.all().find((e) => e.tagName === 'INPUT' && e.attrs.type === 'checkbox' && e.attrs['aria-label'] === 'bank at the start'); box.checked = true; box.onchange(); p.tick(); }
  p.panel.secondExtra(xOf(p, 'bank').id, -88.45); p.tick();
  const made = p.panel.options().changes.phi[0];
  const path = []; for (let f = 420; f <= 540; f++) path.push(f); for (let f = 539; f >= 420; f--) path.push(f);
  const ts = [], pr = []; let worst = { ms: 0 };
  for (const f of path) { plans = 0; const t0 = process.hrtime.bigint(); p.panel.secondDrag({ field: 'bank', index: 0 }, f); p.tick(); const ms = Number(process.hrtime.bigint() - t0) / 1e6; ts.push(ms); pr.push(plans); if (ms > worst.ms) worst = { ms: +ms.toFixed(2), asked: f, kept: p.panel.options().changes.phi[0].from, plans }; }
  p.panel.unmount();
  console.log(JSON.stringify({ mode: MODE, made: { from: made.from, targetDeg: +(made.target / DEG).toFixed(2) }, moves: ts.length, medianMs: q(ts, 0.5), p95Ms: q(ts, 0.95), maxMs: worst.ms, worst, plansTotal: pr.reduce((a, b) => a + b, 0), plansMax: Math.max(...pr), plansMedian: q(pr, 0.5) }));
})().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
