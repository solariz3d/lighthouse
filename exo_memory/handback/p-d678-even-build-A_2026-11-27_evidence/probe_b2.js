// probe_b2.js: find a crossing on which an Even drag is refused by the pass clearance (row B2). Usage: node probe_b2.js TREE
'use strict';
const path = require('path');
const TREE = process.argv[2];
const D = require(path.join(TREE, 'src/core/document.js'));
const { extend } = require(path.join(TREE, 'src/core/extend.js'));
const { extendTurnBy } = require(path.join(TREE, 'src/core/turnby.js'));
const AD = require(path.join(TREE, 'src/core/adapter.js'));
const { passClearance } = require(path.join(TREE, 'src/validate/passclear.js'));
const F = require(path.join(TREE, 'test/even_fixtures.js'));
const DEG = Math.PI / 180;
function crossing(climbDeg, bank, piece) {
  let d = extend(D.createDoc('crossing'), { length: 200, family: 'bowl' });
  d = extendTurnBy(d, { length: 240, climbDeg }, 135 * DEG);
  d = extendTurnBy(d, { length: 240, climbDeg: -climbDeg }, 135 * DEG);
  d = extend(d, { length: 300 });
  d = D.refineKnots(d, d.pieces[piece].id, 0, d.pieces[piece].length, 20).doc;
  const pieces = d.pieces.map((P, i) => (i === piece ? { ...P, channels: { ...P.channels, phi: P.channels.phi.map((x, k, c) => (k < 2 || k >= c.length - 2 ? x : bank)) } } : P));
  return D.checkDoc({ ...d, pieces });
}
const breaks = (d) => { const tp = AD.toPath(d, { step: 2 }); return passClearance(tp.path, tp.segments, { apronM: d.edgeApronM }).length; };
(async () => {
  for (const piece of (process.env.PIECES || "0,3").split(",").map(Number)) for (const climb of (process.env.CLIMBS || "1,1.25,1.5").split(",").map(Number)) for (const bank of [-0.15, 0.15]) for (const hold of ['left', 'right']) {
    let d; try { d = crossing(climb, bank, piece); } catch (e) { console.log(JSON.stringify({ piece, climb, bank, err: e.message.slice(0, 80) })); continue; }
    const b0 = breaks(d), sh = await F.shellOn(d);
    sh.selectPiece(piece);
    sh.beginSculpt({ tool: 'even', hold });
    const b = sh.getState().brush; if (!b || b.mode !== 'even') { console.log(JSON.stringify({ piece, climb, bank, hold, open: (sh.getState().message || '').slice(0, 80) })); continue; }
    const out = [];
    for (const dv of [4, 8, 12]) { const before = F.present(sh); sh.sculptTo(dv); const m = sh.getState().message || ''; out.push([dv, F.present(sh) === before ? 'same' : 'moved', m.slice(0, 16)]); }
    sh.endSculpt();
    console.log(JSON.stringify({ piece, climb, bank, hold, w0: b.value0, breaksBefore: b0, steps: out }));
  }
})();
