// dg5curves678.js (pane B, D678): drag-ghost row 5's road on several trees. The placed pieces and the three corners (TB.extendCorner from a head whose width is
// still changing, +0.0839 m per m). Per tree: the row's two hashes (the placed pieces without wd; placed + corners without w and wd). Against a reference tree:
// every corner channel but w and wd, as curves every 0.05 m, the largest difference in steps of its DEC; the knots counted; the end of each corner (the
// adapter's path, last sample) apart in m. usage: node dg5curves678.js <tree> <ref tree> [<ref tree> ...]
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), crypto = require('crypto');
const load = (T) => { T = path.resolve(T); return { T, D: require(path.join(T, 'src/core/document.js')), TB: require(path.join(T, 'src/core/turnby.js')), A: require(path.join(T, 'src/core/adapter.js')), shell: require(path.join(T, 'app/core/coreshell.js')).createCoreShell }; };
const hashOf = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const noWd = (P) => { const { wd, ...channels } = P.channels; return { ...P, channels }; }, noW = (P) => { const { w, ...channels } = noWd(P).channels; return { ...P, channels }; };
async function road(t) {
  const s = await t.shell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 300 });
  s.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); s.extend({ length: 75, transition: 30, targets: { w: 25 } });
  const doc0 = s.exportDoc(), corners = [TB(t).extendCorner(doc0, { length: 1500, turnDeg: 33, targets: { phi: 0.1 } }), TB(t).extendCorner(doc0, { length: 400, turnDeg: -75, climbDeg: 4 }), TB(t).extendCorner(doc0, { length: 2200 })];
  return { doc0, corners, parts: [doc0.pieces, ...corners.map((d) => d.pieces.at(-1))] };
}
const TB = (t) => t.TB;
(async () => {
  const [X, ...refs] = process.argv.slice(2).map(load), x = await road(X);
  const head = X.D.pieceEnd(x.doc0.pieces.at(-1)).w;
  console.log(`head width ${head.v} m, slope ${head.m} per m`);
  for (const t of [X, ...refs]) { const r = t === X ? x : await road(t); console.log(`${t.T}: placed (wd out) ${hashOf(r.parts[0].map(noWd))}; placed + corners (w, wd out) ${hashOf([r.parts[0].map(noWd), ...r.parts.slice(1).map(noW)])}; corner knots ${r.parts.slice(1).map((P) => P.knots.length).join('/')}`); }
  for (const R of refs) {
    const r = await road(R); console.log(`\n${X.T} against ${R.T}:`);
    ['1500 m, 33 deg', '400 m, -75 deg, climb 4', '2200 m, straight'].forEach((name, i) => {
      const P = x.parts[i + 1], Q = r.parts[i + 1], worst = {};
      if (P.length !== Q.length) { console.log(`  ${name}: lengths ${P.length} / ${Q.length}`); return; }
      for (const ch of Object.keys(P.channels)) { if (ch === 'w' || ch === 'wd') continue; const step = 10 ** -X.D.DEC[ch]; let m = 0, at = 0;
        for (let k = 0; k <= P.length * 20; k++) { const s = k / 20, d = Math.abs(X.D.channelValue(P, ch, s) - R.D.channelValue(Q, ch, s)); if (d > m) { m = d; at = s; } }
        worst[ch] = `${+(m / step).toFixed(3)}${m ? ` at ${at.toFixed(2)}` : ''}`; }
      const e1 = X.A.toPath(x.corners[i], { step: 0.25 }).path.samples.at(-1).pos, e2 = R.A.toPath(r.corners[i], { step: 0.25 }).path.samples.at(-1).pos;
      console.log(`  ${name}: knots ${P.knots.length} / ${Q.knots.length}; steps apart: ${Object.entries(worst).map(([c, v]) => `${c} ${v}`).join(', ')}; end apart ${Math.hypot(...e1.map((v, k) => v - e2[k])).toExponential(2)} m; width ends ${JSON.stringify(X.D.pieceEnd(P).w)}`);
    });
  }
})().catch((e) => { console.error('dg5curves678 failed:', e); process.exit(1); });
