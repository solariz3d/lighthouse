'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/test/core_close_banks_lap.test.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// D468 follow-up (A's review §2b; the chair, 2026-10-26T05:02Z): WHEN THE PLAN REACHES ITS SWEEP BUDGET IT SAYS SO. On this lap at R 200 (tighter than any row above)
// the alternating projections stop at BANK_SWEEPS with the acceleration about 5% past BANK_ACCEL at one triple; at R 300 every plan converges. Reaching the budget
// used to be silent: the plan now carries it (plan.budget), bankLapWith hands it on, and the press's report (and Finish's) names it in user words.
function lapAt(R) {
  const QR = (Math.PI * R) / 2; let d = D.createDoc(\`lap R \${R}\`);
  d = extend(d, { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: QR }, 90 * DEG);
  d = extend(d, { length: 100 }); d = extend(d, { length: QR / 2, targets: { kh: 1 / R } }); d = extendTurnBy(d, { length: QR / 2 }, 67.5 * DEG);
  d = extend(d, { length: 100, targets: { phi: -20 * DEG } }); d = extendTurnBy(d, { length: QR }, 90 * DEG);
  d = extend(d, { length: 100, targets: { phi: 0 } }); d = extendTurnBy(d, { length: QR }, 90 * DEG);
  return d;
}
test('row 20: where the bank plan reaches its sweep budget the press says so in user words (this lap at R 200), and where every plan converges it says nothing (R 300)', () => {
  const { close } = require('../src/core/close.js'), F = require('../src/core/finish.js');
  for (const [R, expect] of [[200, true], [300, false]]) {
    const open = lapAt(R), r = CJ.runCloseBest({ doc: open }); assert.equal(r.converged, true, \`R \${R}: \${r.report}\`);
    const said = /smoothness limit/.test(r.report);
    assert.equal(said, expect, \`R \${R}: the press's report \${expect ? 'names' : 'does not name'} the budget: \${r.report}\`);
    if (expect) assert.match(r.report, /the bank on the lap stopped about \d+% past its smoothness limit at one point \(p\d+\)/, \`R \${R}: the words: \${r.report}\`);
    // and the plan itself, on the lap closed without the press (close() on its last piece), says the same through bankLapWith
    const c = close(open, { window: [open.pieces.length - 1] }); assert.equal(c.converged, true, \`R \${R}: \${c.report}\`);
    const b = F.bankLapWith(c.doc);
    assert.equal(!!b.budget, expect, \`R \${R}: bankLapWith \${expect ? 'carries' : 'carries no'} budget: \${JSON.stringify(b.budget)}\`);
    if (expect) assert.ok(b.budget.sweeps > 0 && b.budget.overPct > 0 && b.budget.overPct < 50 && typeof b.budget.at === 'string', \`R \${R}: the budget names its sweeps, how far past the limit and where: \${JSON.stringify(b.budget)}\`);
  }
});
`;
s = s.replace(/\s*$/, '') + EOL + row.split('\n').join(EOL); fs.writeFileSync(p, s); console.log('row 20 written');
