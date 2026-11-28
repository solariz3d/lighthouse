// tim271.js (pane A, L271 item 2 (c)): D678's tim678.js (lighthouse exo_memory/handback/p-d678-even-build-A_2026-11-27_evidence/tim678.js) with one addition: the
// RELEASE of Even's drag is timed too, since L271 item 2 (a) moved the pass-clearance guard there. One drag step on his largest lap (by road length) from the copies
// in DIR, through the real core shell of TREE:
//   - the Width tool's step and a grab's step at the middle of the run Even levels below (today's drags, the bar); Even's drag step on that run;
//   - each: a warm-up step, then 5 timed steps of different sizes (each applies its whole delta to the drag's base, as a drag does; Even's 5 are 5 different snapped
//     widths), and one step profiled; then Even's release, timed (the guard, once).
// The run: the first two-piece run from the middle of the lap outward that Even does not refuse (read with PICK's even.js, so every tree times the same place).
// Prints milliseconds, counts and booleans only: no name, no place, no geometry. Usage: node tim271.js TREE DIR PICKTREE
'use strict';
const fs = require('fs'), path = require('path'), inspector = require('inspector');
const TREE = path.resolve(process.argv[2]), DIR = path.resolve(process.argv[3]), PICK = path.resolve(process.argv[4]);
const D = require(path.join(TREE, 'src/core/document.js')), SC = require(path.join(TREE, 'src/core/sculpt.js'));
const G = require(path.join(TREE, 'src/geom/index.js')), ZG = require(path.join(TREE, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(TREE, 'app/core/coreshell.js'));
const EVP = require(path.join(PICK, 'src/core/even.js'));
const hasEven = fs.existsSync(path.join(TREE, 'src/core/even.js'));

const T = () => process.hrtime.bigint(), ms = (a, b) => +(Number(b - a) / 1e6).toFixed(1);
const med = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1]; };
const docs = [];
for (const f of fs.readdirSync(DIR).filter((x) => /^t\d+\.(t180)?track$/.test(x))) {
  try { const d = D.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const off = SC.pieceOffsets(d), n = d.pieces.length; docs.push({ d, L: off[n - 1] + (d.pieces[n - 1].length || 0) }); } catch (e) { /* a refused file */ }
}
docs.sort((a, b) => b.L - a.L);
const { d, L } = docs[0], n = d.pieces.length, off = SC.pieceOffsets(d);
let pick = null;
for (let k = 0; k < n && pick === null; k++) for (const sgn of [1, -1]) { const p = Math.floor(n / 2) + sgn * k; if (p < 0 || p + 1 >= n) continue; try { EVP.evenWindow(d, { from: p, to: p + 1 }); pick = p; break; } catch (e) { /* next */ } }
const s0 = off[pick] + (d.pieces[pick].length + d.pieces[pick + 1].length) / 2;
const out = { tree: path.basename(path.resolve(TREE)), files: docs.length, roadM: Math.round(L), pieces: n, closed: !!d.closed, hasEven };

function profile(fn) {
  const s = new inspector.Session(); s.connect();
  const post = (m, p) => new Promise((ok, no) => s.post(m, p || {}, (e, r) => (e ? no(e) : ok(r))));
  return (async () => {
    await post('Profiler.enable'); await post('Profiler.setSamplingInterval', { interval: 200 }); await post('Profiler.start');
    fn();
    const { profile: P } = await post('Profiler.stop'); s.disconnect();
    const byId = new Map(P.nodes.map((x) => [x.id, x])), dt = new Map();
    for (let i = 0; i < P.samples.length; i++) dt.set(P.samples[i], (dt.get(P.samples[i]) || 0) + (P.timeDeltas[i] || 0) / 1000);
    const WANT = (process.env.WANT || 'brushTo,endBrush,even,evenIn,cutOf,refineEnds,refineKnots,passClearanceGuard,passClearance,resolvedOf,toSegments,rimReader,levelTo,fitHeight,solve,bankPlan,settle,checkDoc,restOf,pieceOffsets,evenWindow,buildPath,routeMovedDetail,dragTo,follow,sculpt,brush').split(',');
    const parent = new Map(); for (const x of P.nodes) for (const c of x.children || []) parent.set(c, x.id);
    const incl = {};
    for (const [id, t] of dt) {
      const seen = new Set();
      for (let q = id; q !== undefined; q = parent.get(q)) { const fnn = byId.get(q).callFrame.functionName; for (const wnt of WANT) if (fnn === wnt && !seen.has(wnt)) { seen.add(wnt); incl[wnt] = (incl[wnt] || 0) + t; } }
    }
    const total = [...dt.values()].reduce((a, b) => a + b, 0);
    const self = {}; for (const [id, t] of dt) { const fnn = byId.get(id).callFrame.functionName || '(anon)'; self[fnn] = (self[fnn] || 0) + t; }
    const topSelf = Object.entries(self).sort((x, y) => y[1] - x[1]).slice(0, 14).map(([k, v]) => [k, +v.toFixed(0)]);
    return { sampledMs: +total.toFixed(0), topSelf, inclusiveMs: Object.fromEntries(Object.entries(incl).map(([k, v]) => [k, +v.toFixed(0)]).sort((a, b) => b[1] - a[1])) };
  })();
}

(async () => {
  const sh = await createCoreShell({}); sh.commitDoc(d); sh.setSculpt(true);
  const DELTAS = [0.5, 1, 1.5, 2, 1.25];
  // ── the Width tool ──
  sh.beginBrush({ tool: 'width', s0, r: 30 });
  if (!sh.getState().brush) out.widthRefused = (sh.getState().message || '').split(':')[0];
  else {
    sh.brushTo(0.25); const steps = []; for (const dv of DELTAS) { const t0 = T(); sh.brushTo(dv); steps.push(ms(t0, T())); }
    out.widthStepMs = steps; out.widthStepMedianMs = med(steps); out.widthProfile = await profile(() => sh.brushTo(1.75));
    out.widthMessage = !!sh.getState().message; sh.endBrush(); sh.undo();
  }
  // ── a grab (today's: the outer rim pressed, pulled out through the zone grab's follow) ──
  const rs = sh.getState().resolved, pathB = G.buildPath(rs.segments, { step: 1, closed: !!d.closed, ...(rs.start ? { start: rs.start } : {}) });
  const fr = ZG.frameAt(pathB, rs.segments, s0, -1);
  if (!fr) out.grabNoFrame = true;
  else {
    const dl = (e) => ZG.follow(fr.R.map((k) => -k * e), fr, {});
    sh.beginFollow({ s0: fr.s, r: 30 });
    if (!sh.getState().brush) out.grabRefused = (sh.getState().message || '').split(':')[0];
    else {
      sh.brushTo(dl(0.25)); const steps = []; for (const dv of DELTAS) { const x = dl(dv); const t0 = T(); sh.brushTo(x); steps.push(ms(t0, T())); }
      out.grabStepMs = steps; out.grabStepMedianMs = med(steps); const x = dl(1.75); out.grabProfile = await profile(() => sh.brushTo(x));
      out.grabMessage = !!sh.getState().message; sh.endBrush(); sh.undo();
    }
  }
  // ── Even's drag step on the run, then its release ──
  if (hasEven) {
    sh.selectPiece(pick); sh.selectPiece(pick + 1, { extend: true });
    sh.beginSculpt({ tool: 'even', hold: 'left' });
    const b = sh.getState().brush;
    if (!(b && b.mode === 'even')) out.evenRefused = (sh.getState().message || '').split(':')[0];
    else {
      const t00 = T(); sh.sculptTo(0.5); out.evenFirstStepMs = ms(t00, T());
      const steps = []; for (const dv of [1, 1.5, 2, 2.5, 3]) { const t0 = T(); sh.sculptTo(dv); steps.push(ms(t0, T())); }
      out.evenStepMs = steps; out.evenStepMedianMs = med(steps); out.evenProfile = await profile(() => sh.sculptTo(3.5));
      out.evenMessage = !!sh.getState().message;
      const t1 = T(); sh.endSculpt(); out.evenReleaseMs = ms(t1, T()); out.evenReleaseRefused = /^PASS_CLEARANCE/.test(sh.getState().message || '');
      if (sh.whenEvenChecked) await sh.whenEvenChecked(); sh.undo();
    }
  }
  console.log(JSON.stringify(out));
})().catch((e) => { console.error('FATAL', e && e.stack || e); process.exitCode = 1; });
