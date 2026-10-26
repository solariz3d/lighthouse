'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/test/core_close_local.test.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
const rows = `
// D469 (P; C's D467 review §5: on TEST 10 the start try [p1, p23] is refused and the close falls through to [p5, p23]). A lap from public words whose first piece is
// a cup laid flat (c 0) and whose last piece's cup fade ends C1 (flat 15, then 0 0: a file from before D459, or 0.4.19's closer; TEST 10's p23 ends 15 15 0 0).
function flatCupLap() {
  const DEG = Math.PI / 180, Q3 = (Math.PI * 300) / 2, { extendTurnBy } = require('../src/core/turnby.js');
  let d = extend(D.createDoc('cup seam'), { length: 1000, family: 'bowl', first: { c: 0 } });
  for (let i = 0; i < 3; i++) { d = extendTurnBy(d, { length: Q3 }, 90 * DEG); d = extend(d, { length: 300 }); }
  d = extendTurnBy(d, { length: Q3 }, 90 * DEG); d = extend(d, { length: 300, targets: { c: 15 } }); d = extend(d, { length: 400, targets: { c: 0 } });
  const open = { ...C.close(d).doc, closed: false }, n = open.pieces[open.pieces.length - 1].channels.c.length;
  return withChannel(open, open.pieces.length - 1, 'c', (v, i) => (i < n - 2 ? 15 : 0));
}
test('row 6: a window on a lap whose cup is flat is not refused on the solve\'s float noise (D469): the cup read for the window\'s path is inside the quantum of 0, so the last piece alone, the last two and the first piece close', () => {
  const d = flatCupLap(), n = lastIdx(d);
  for (const w of [[n], [n - 1, n], [0]]) { const r = C.close(d, { window: w }); assert.equal(r.converged, true, \`window \${JSON.stringify(w)}: \${r.report}\`); assert.ok(r.doc.pieces.every((P) => !P.cup || P.channels.c.every((v) => v >= 0)), \`window \${JSON.stringify(w)}: no stored cup point is negative\`); }
});
test('row 7: the seam\'s cup curvature rows respect c ≥ 0 (D469): where they would take p1\'s flat cup below 0 they are left out, the cup stays C1 at the seam like cupHome\'s straight fade, the close succeeds and says so, and the other channels stay C2 there', () => {
  const Cn = require('../src/core/continuity.js'), d = flatCupLap(), n = lastIdx(d);
  const r = C.close(d, { window: [0, n] }); assert.equal(r.converged, true, r.report);
  assert.ok(r.doc.pieces[0].channels.c.every((v) => v >= 0) && r.doc.pieces[n].channels.c.every((v) => v >= 0), 'no cup point of p1 or the last piece is below 0');
  assert.match(r.report, /cup.*curvature.*left out|left out.*cup/i, \`the report says the cup's curvature row was left out: \${r.report}\`);
  const seam = Cn.jointSteps(r.doc).filter((e) => e.joint.endsWith('|' + r.doc.pieces[0].id));
  for (const e of seam) if (e.ch !== 'c') assert.ok(Math.abs(e.dkDeg) <= Cn.TOL_K, \`\${e.ch} is C2 at the seam (steps \${e.dkDeg.toFixed(4)} °/m²)\`);
  assert.ok(seam.find((e) => e.ch === 'c').dm < 1e-4, 'the cup is C1 at the seam');
  // control: with the cup row kept the close would need a negative cup, which the document refuses; the fallback is what the row above proves
  const near = nearLap(); const r2 = C.close(near, { window: [lastIdx(near)] }); assert.equal(r2.converged, true, r2.report); assert.doesNotMatch(r2.report, /left out/, 'a lap whose seam needs no fallback does not report one');
});
`;
s = s.replace(/\s*$/, '') + EOL + rows.split('\n').join(EOL); fs.writeFileSync(p, s); console.log('rows 6, 7 written');
