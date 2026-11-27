// fincheck678.js (pane B, D678 ruling 1, as registered in §3.0): on E's five brushed lap heads, Finish on tree X against tree R (346e2a0):
// F-2b the first new piece's knots and w control points equal R's (where the hold was laid before close); F-4 the lap closes: closed, checkDoc passes again,
// close's residual gap under 1 mm, the plan word and window those of the level lap on X; and the knot counts of the new pieces (pieces 2 and 3 the level lap's).
// usage: node fincheck678.js <tree X> <tree R>
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path');
const load = (T) => { T = path.resolve(T); return { T, D: require(path.join(T, 'src/core/document.js')), TB: require(path.join(T, 'src/core/turnby.js')), F: require(path.join(T, 'src/core/finish.js')), C: require(path.join(T, 'src/core/close.js')), shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell }; };
const X = load(process.argv[2]), R = load(process.argv[3]);
const lap = (t) => { const Rr = 180, Q = (Math.PI * Rr) / 2; let d = t.TB.extendCorner(t.D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = t.TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } }); return t.TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
const sh = async (t, sculpt) => { const s = await t.shell({ autosaveMs: 0 }); s.commitDoc(lap(t)); if (sculpt) s.setSculpt(true); return s; };
const brush = (d, r, delta) => async (t) => { const s = await sh(t, false); s.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s)) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grab = (d, r, dw) => async (t) => { const s = await sh(t, true); s.beginFollow({ s0: total(doc(s)) - d, r }); s.brushTo({ w: dw }); s.endBrush(); s.setSculpt(false); return s; };
const HEADS = { 'brush +1.37 end-5 r20': brush(5, 20, 1.37), 'brush +5 end-30 r40': brush(30, 40, 5), 'grab +2 end-10 r20': grab(10, 20, 2), 'grab +2 end-0 r10': grab(0, 10, 2), 'grab -2 end-2 r5': grab(2, 5, -2) };
(async () => {
  const lx = X.F.finishToStart(doc(await sh(X, false))), n = lx.doc.pieces.length - 3;
  console.log(`level lap on X: plan ${lx.plan.word}, window ${JSON.stringify(lx.window)}, knots ${lx.doc.pieces.slice(n).map((P) => P.knots.length).join('/')}`);
  let f2 = 0, f4 = 0, kn = 0;
  for (const [name, mk] of Object.entries(HEADS)) {
    const fx = X.F.finishToStart(doc(await mk(X))), fr = R.F.finishToStart(doc(await mk(R)));
    const Px = fx.doc.pieces[n], Pr = fr.doc.pieces[n];
    const knotsSame = JSON.stringify(Px.knots) === JSON.stringify(Pr.knots), wSame = JSON.stringify(Px.channels.w) === JSON.stringify(Pr.channels.w);
    let wd = 0; if (Px.channels.w.length === Pr.channels.w.length) Px.channels.w.forEach((v, i) => { wd = Math.max(wd, Math.abs(v - Pr.channels.w[i])); });
    let checked = true; try { X.D.checkDoc(fx.doc); } catch (e) { checked = `${e.code}: ${e.message}`; }
    const rs = X.C.residual(fx.doc), gapOk = rs.gapM < 1e-3;
    const closes = fx.doc.closed === true && checked === true && gapOk && fx.plan.word === lx.plan.word && JSON.stringify(fx.window) === JSON.stringify(lx.window);
    const knots = fx.doc.pieces.slice(n).map((P) => P.knots.length), knotsLevel = knots.slice(1).join('/') === lx.doc.pieces.slice(n + 1).map((P) => P.knots.length).join('/');
    if (knotsSame && wSame) f2++; if (closes) f4++; if (knotsLevel) kn++;
    console.log(`${name}: F-2b first piece knots ${Px.knots.length} (R ${Pr.knots.length}) same ${knotsSame}, w points same ${wSame} (largest ${wd}); F-4 closed ${fx.doc.closed}, checkDoc ${checked}, gap ${(rs.gapM * 1000).toFixed(4)} mm, plan ${fx.plan.word}, window ${JSON.stringify(fx.window)}: ${closes}; knots ${knots.join('/')}, pieces 2 and 3 the level lap's ${knotsLevel}; report "${fx.plan.report.slice(0, 160)}"`);
  }
  console.log(`F-2b ${f2} of 5; F-4 ${f4} of 5; pieces 2 and 3 at the level lap's knots ${kn} of 5`);
})().catch((e) => { console.error('fincheck678 failed:', e); process.exit(1); });
