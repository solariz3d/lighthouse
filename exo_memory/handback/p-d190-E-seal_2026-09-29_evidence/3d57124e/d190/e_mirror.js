const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup_seam.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const i = s.indexOf("test('R3 (a) mirror:"), nx = s.indexOf("test('R3", i + 10);
if (i < 0 || nx < 0) throw new Error("anchors");
const body = `/** A file can hold a LEGACY piece after a cup piece (Extend never makes one): cup start straight and turns, the last cup turn returning to the edge the legacy piece renders, then a legacy last piece. */
function mirrorDoc(fam, w) {
  let d = extend(D.createDoc('m'), { length: 60, family: fam, first: { w, c: 60 } });
  d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: 60 } }); d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: 60 } });
  const P = d.pieces[d.pieces.length - 1], e = D.legacyEdgeDeg(fam, D.channelAt(P, 'w', P.length).v, D.channelAt(P, 'r', P.length).v);
  d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: e } });
  const from = D.endState(d), channels = Object.fromEntries(D.CHANNELS.map((ch) => [ch, channelFn(from[ch], ch === 'kh' ? 1 / Rr : undefined, 40)]));
  return D.appendPiece(d, D.roadPiece({ length: Q, family: fam, from, channels, knotM: undefined, cup: false }));
}
test('R3 (a) mirror: a lap that STARTS in a cup and ends on a legacy piece meets within 1 mm at the lap seam, and so does the cup -> legacy joint inside it (B-class step: 148 mm half-pipe 24, 23 mm bowl 16 before)', () => {
  for (const [fam, w] of [['half-pipe', 24], ['bowl', 16]]) {
    const d = mirrorDoc(fam, w); assert.deepEqual(d.pieces.map((p) => !!p.cup), [true, true, true, true, false], 'built: cup pieces then a legacy last piece');
    const r = close(d, { edited: [d.pieces.length - 1] }); assert.equal(r.converged, true, r.report);
    const worst = PF.jointSteps(A.toSegments(r.doc), true).reduce((m, x) => Math.max(m, x.m), 0);
    assert.ok(worst <= 1e-3, \`\${fam} \${w}: a joint steps \${(worst * 1000).toFixed(2)} mm\`);
    const mm = seamMm(r.doc); assert.ok(mm <= 1, \`\${fam} \${w}: the lap seam is \${mm.toFixed(2)} mm\`);
  }
});
`;
s = s.slice(0, i) + body + s.slice(nx);
// the X1 test was between: keep everything from j up to (but excluding) end, which is already in the slice above
s = s.replace("const { extend } = require('../src/core/extend.js');", "const { extend, channelFn } = require('../src/core/extend.js');").replace("const V = require('../src/validate/index.js');", "const V = require('../src/validate/index.js');\nconst PF = require('../src/geom/profile.js');");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('mirror test replaced');
