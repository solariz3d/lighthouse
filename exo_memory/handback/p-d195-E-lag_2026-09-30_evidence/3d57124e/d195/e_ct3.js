const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d195-wt/test/core_chord.test.js'; let s = fs.readFileSync(f, 'utf8');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 70)); s = s.replace(a, () => b); }
rep("const { extend } = require('../src/core/extend.js');", "const { extend, channelFn } = require('../src/core/extend.js');");
s += `
test('5 · a cup after a legacy piece that ENDS ON A WIDTH SLOPE (a hand-built linear width: 0.1 m/m at the joint): the join is the chord\'s END row, the joint is within 1 mm', () => {
  const ch = Object.fromEntries(D.CHANNELS.map((c) => [c, c === 'w' ? (s) => 20 + 0.1 * s : c === 'r' ? () => 8 : () => 0]));
  const legacy = D.appendPiece(D.createDoc('slope'), D.roadPiece({ length: 100, family: 'bowl', from: null, channels: ch }));
  const d = extend(legacy, { length: 120, transition: 60, targets: { c: 60 } }), m = measure(d);
  assert.ok(m.chords > 0); assert.ok(m.joint <= 1, \`joint \${m.joint} mm\`); assert.ok(m.inside <= 1, \`inside \${m.inside} mm\`);
});
test('5 · a lap that STARTS in a cup and ENDS on a legacy piece that is still narrowing (31 → 12 over its last 40 m): the lap seam and every joint meet within 1 mm', () => {
  const Rr = 180, Q = (Math.PI * Rr) / 2, fam = 'bowl', W1 = 12, W2 = 31;
  const legacyEdge = (w, r) => D.legacyEdgeDeg(fam, w, r);
  let d = extend(D.createDoc('mirror'), { length: 60, family: fam, first: { w: W1, c: 40 } });
  d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, w: W2, c: 40 } }); d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: 40 } });
  const P = d.pieces[d.pieces.length - 1], e = legacyEdge(W2, D.channelAt(P, 'r', P.length).v);
  d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: e } });
  const from = D.endState(d), chs = Object.fromEntries(D.CHANNELS.map((c) => [c, channelFn(from[c], c === 'kh' ? 1 / Rr : c === 'w' ? W1 : undefined, c === 'w' ? Q : 40)]));
  d = D.appendPiece(d, D.roadPiece({ length: Q, family: fam, from, channels: chs, knotM: undefined, cup: false }));
  const r = close(d, { edited: [d.pieces.length - 1] }); assert.equal(r.converged, true, r.report);
  const m = measure(r.doc); assert.ok(m.chords > 0, \`chords \${m.chords}\`); assert.ok(m.joint <= 1, \`joint \${m.joint} mm\`);
  const segs = A.toSegments(r.doc), path = A.toPath(r.doc).path, mesh = buildMesh(path, segs), pcs = mesh._state.pieces; let last = pcs.length - 1; while (last > 0 && !(pcs[last] && pcs[last].last)) last--;
  const mm = rowGap(pcs[last].last, pcs[0].first) * 1000; assert.ok(mm <= 1, \`the lap seam is \${mm.toFixed(2)} mm\`);
});
`;
fs.writeFileSync(f, s);
