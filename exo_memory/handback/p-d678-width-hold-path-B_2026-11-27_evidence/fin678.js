// fin678.js (pane B, D678): Finish on E's lap from a level head and from E's brushed head (+1.37 end-5 r20): per new piece, the knots, the bank's largest
// difference (degrees) and where, the turn's (steps), and finishToStart's report fields; on one tree. A control: the level head's first new piece with the held
// piece's knots inserted by Boehm (insertKnots) BEFORE close is not reachable from outside, so this prints the knot counts beside the difference instead.
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), TB = require(path.join(T, 'src/core/turnby.js')), F = require(path.join(T, 'src/core/finish.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const lap = () => { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } }); };
const doc = (s) => s.getState().history.present, total = (d) => d.pieces.reduce((a, P) => a + (P.length || 0), 0);
(async () => {
  const s0 = await createCoreShell({ autosaveMs: 0 }); s0.commitDoc(lap()); const dl = doc(s0);
  const s1 = await createCoreShell({ autosaveMs: 0 }); s1.commitDoc(lap()); s1.beginBrush({ mode: 'rate', channel: 'w', s0: total(doc(s1)) - 5, r: 20 }); s1.brushTo(1.37); s1.endBrush(); const dh = doc(s1);
  const a = F.finishToStart(dl), b = F.finishToStart(dh), n = dl.pieces.length;
  console.log('report keys', Object.keys(a).filter((k) => k !== 'doc').join(','));
  for (const k of ['bankBudget', 'window', 'iterations', 'converged']) if (k in a) console.log(k, JSON.stringify(a[k]), '|', JSON.stringify(b[k]));
  for (let i = n; i < a.doc.pieces.length; i++) {
    const P = a.doc.pieces[i], Q = b.doc.pieces[i]; let mp = 0, xp = 0, mk = 0, xk = 0, pl = 0;
    for (let x = 0; x <= P.length; x += 0.01) { const dp = Math.abs(D.channelValue(P, 'phi', x) - D.channelValue(Q, 'phi', x)); if (dp > mp) { mp = dp; xp = x; } const dk = Math.abs(D.channelValue(P, 'kh', x) - D.channelValue(Q, 'kh', x)); if (dk > mk) { mk = dk; xk = x; } pl = Math.max(pl, Math.abs(D.channelValue(P, 'phi', x))); }
    console.log(`new piece ${i - n}: length ${P.length} / ${Q.length}, knots ${P.knots.length} level / ${Q.knots.length} held, bank largest ${(pl * 180 / Math.PI).toFixed(3)} deg, bank apart ${(mp * 180 / Math.PI).toFixed(4)} deg at ${xp.toFixed(2)}, turn apart ${(mk * 1e9).toFixed(1)} steps at ${xk.toFixed(2)}`);
  }
  // the pieces as LAID (before Finish's bank and close): the route Finish lays, from both heads, compared
  const r = F.finishPlan ? 'finishPlan' : null; console.log('exports', Object.keys(F).join(','));
})().catch((e) => { console.error(e); process.exit(1); });
