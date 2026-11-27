// dg5e678.js (pane E, D678 Track 2): drag-ghost row 5's documents, built on several trees by my own code (the row's steps copied, its assertions not), to
// re-derive its pin and B's stated reason for the new one: the hash of the placed pieces and the three corners with wd and the corners' w taken out (the row's
// second pin); each corner's channels but w and wd against the REF tree's as curves, every 0.05 m, in steps of D.DEC; each corner's end point (the corner appended
// to the placed pieces, the adapter's path at step 0.25, its last sample) against REF's; the corners' knot counts; and each corner's width end against the head's.
// usage: node dg5e678.js <refTree> <tree> [<tree> ...]   (the first tree is REF)
'use strict';
const path = require('path'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { T, D: require(path.join(T, 'src/core/document.js')), TB: require(path.join(T, 'src/core/turnby.js')), A: require(path.join(T, 'src/core/adapter.js')),
  shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell }; };
const trees = process.argv.slice(2).map(load), REF = trees[0];
const hashOf = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const noWd = (P) => { const { wd, ...channels } = P.channels; return { ...P, channels }; };
const noW = (P) => { const { w, ...channels } = noWd(P).channels; return { ...P, channels }; };
async function build(t) {
  const sh0 = await t.shell({ brushFn: null, autosaveMs: 0 }); sh0.extend({ length: 300 });
  sh0.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); sh0.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = sh0.exportDoc(), calls = [{ length: 1500, turnDeg: 33, targets: { phi: 0.1 } }, { length: 400, turnDeg: -75, climbDeg: 4 }, { length: 2200 }];
  const docs = calls.map((o) => t.TB.extendCorner(doc0, o));
  return { doc0, docs, parts: [doc0.pieces, ...docs.map((d) => d.pieces.at(-1))] };
}
(async () => {
  const built = []; for (const t of trees) built.push(await build(t));
  const R = built[0];
  trees.forEach((t, k) => {
    const b = built[k], headW = t.D.pieceEnd(b.doc0.pieces.at(-1)).w;
    console.log(`${t.T}: placed ${hashOf(b.parts[0].map(noWd))}, placed + corners but w ${hashOf([b.parts[0].map(noWd), ...b.parts.slice(1).map(noW)])}, head w ${headW.v} (${headW.m}), corner knots ${b.parts.slice(1).map((P) => P.knots.length).join('/')}`);
    if (k === 0) return;
    b.parts.slice(1).forEach((P, i) => {
      const Q = R.parts[i + 1]; let worst = 0, at = '';
      for (const ch of Object.keys(P.channels)) { if (ch === 'w' || ch === 'wd') continue; const step = 10 ** -t.D.DEC[ch], L = Math.min(P.length, Q.length);
        for (let x = 0; x <= L + 1e-9; x += 0.05) { const d = Math.abs(t.D.channelValue(P, ch, Math.min(x, L)) - REF.D.channelValue(Q, ch, Math.min(x, L))) / step; if (d > worst) { worst = d; at = `${ch} at ${x.toFixed(2)}`; } } }
      const e1 = t.A.toPath(b.docs[i], { step: 0.25 }).path.samples.at(-1).pos, e0 = REF.A.toPath(R.docs[i], { step: 0.25 }).path.samples.at(-1).pos;
      const endW = t.D.pieceEnd(P).w;
      console.log(`  corner ${i + 1} (${P.length} m): lengths ${P.length === Q.length ? 'same' : `${Q.length} vs ${P.length}`}, channels but w within ${worst.toFixed(3)} steps of REF (${at}), end ${Math.hypot(...e1.map((v, j) => v - e0[j])).toExponential(3)} m from REF's, width ends ${endW.v} (${endW.m}) against the head's ${headW.v}`);
    });
  });
})().catch((e) => { console.error('dg5e678 failed:', e); process.exit(1); });
