// fixstep.js: D678 item 2, Even's drag step on the FIXTURES (test/even_fixtures.js, flat and B-, the run 200..440), measured through the core shell as a drag
// does it (sculptTo, each step its whole delta on the drag's base), against the bar the Sculpt drags already keep: D421a's core step bar, 3 x 6.9 ms = 20.7 ms
// (test/core_sculpt_modes.test.js STEP_BAR_MS). A warm-up step, then 5 steps; the median. And a step split by function (the inspector's sampling profile).
// usage: node fixstep.js <tree>    prints one JSON line per (fixture, hold)
'use strict';
const path = require('path'), inspector = require('inspector');
const TREE = process.argv[2];
const F = require(path.join(TREE, 'test', 'even_fixtures.js'));
const T = () => process.hrtime.bigint(), ms = (a, b) => +(Number(b - a) / 1e6).toFixed(1);
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
function profile(fn, WANT) {
  const s = new inspector.Session(); s.connect();
  const post = (m, p) => new Promise((ok, no) => s.post(m, p || {}, (e, r) => (e ? no(e) : ok(r))));
  return (async () => {
    await post('Profiler.enable'); await post('Profiler.setSamplingInterval', { interval: 100 }); await post('Profiler.start');
    for (let k = 0; k < 10; k++) fn(k);
    const { profile: P } = await post('Profiler.stop'); s.disconnect();
    const byId = new Map(P.nodes.map((x) => [x.id, x])), dt = new Map(), parent = new Map();
    for (let i = 0; i < P.samples.length; i++) dt.set(P.samples[i], (dt.get(P.samples[i]) || 0) + (P.timeDeltas[i] || 0) / 1000);
    for (const x of P.nodes) for (const c of x.children || []) parent.set(c, x.id);
    const incl = {};
    for (const [id, t] of dt) { const seen = new Set(); for (let q = id; q !== undefined; q = parent.get(q)) { const f = byId.get(q).callFrame.functionName; if (WANT.includes(f) && !seen.has(f)) { seen.add(f); incl[f] = (incl[f] || 0) + t; } } }
    return Object.fromEntries(Object.entries(incl).map(([k, v]) => [k, +(v / 10).toFixed(1)]).sort((a, b) => b[1] - a[1]));
  })();
}
const WANT = ['sculptTo', 'even', 'evenWindow', 'refineEnds', 'evenIn', 'rimReader', 'levelTo', 'fitHeight', 'shiftOf', 'bankPlan', 'toSegments', 'pieceOffsets', 'passClearanceGuard', 'passClearance', 'resolvedOf', 'checkDoc', 'settle'];
(async () => {
  for (const fx of ['flat', 'B-']) for (const hold of ['left', 'right']) {
    const base = F.fixture(fx), sh = await F.shellOn(base), run = F.runPieces(base);
    sh.selectPiece(run.from); sh.selectPiece(run.to, { extend: true });
    sh.beginSculpt({ tool: 'even', hold });
    const b = sh.getState().brush;
    if (!(b && b.mode === 'even')) { console.log(JSON.stringify({ fx, hold, refused: (sh.getState().message || '').split(':')[0] })); continue; }
    sh.sculptTo(0.5); const steps = []; for (const dv of [1, 1.5, 2, 2.5, 3]) { const t0 = T(); sh.sculptTo(dv); steps.push(ms(t0, T())); }
    const split = await profile((k) => sh.sculptTo(3.5 + k * 0.1), WANT);
    console.log(JSON.stringify({ fx, hold, stepMs: steps, medianMs: med(steps), barMs: 20.7, within: med(steps) <= 20.7, meanSplitMs: split }));
    sh.endSculpt(); if (sh.whenEvenChecked) await sh.whenEvenChecked();
  }
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
