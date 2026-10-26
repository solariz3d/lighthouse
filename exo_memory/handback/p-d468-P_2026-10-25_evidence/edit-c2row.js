'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/test/core_joint_c2.test.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// D468 (P): THE BANK PLAN IS C2. 3c accepted Finish's edges-only exemption for 0.4.20, so Finish's added bank still stepped in curvature at its joints: by exactly
// BANK_ACCEL (0.0115 °/m²) at the closer's first joint and the seam of every Finish measured (seven laps, his two among them) and at every relaxed joint of a lap
// bankLap banks. finish.js bankPlan now projects onto a curvature-equality row per joint in its own sweeps (0 curvature where the plan meets road outside it).
test("row 10: through Finish and through bankLap, the added bank is C2: the bank's second derivative steps at no joint from the closer's first to the seam, and at no joint of a banked lap", () => {
  const bad = [];
  for (const [what, open] of [['rolled cup', rolledCup()], ['P 210/300/30', pLap(210, 300, 30)]]) {
    const n0 = open.pieces.length, r = F.finishToStart(open), doc = r.doc;
    assert.equal(doc.closed, true, \`control: \${what} closes (\${r.plan.report})\`);
    const steps = Cn.jointSteps(doc, { channels: ['phi'] }).filter((e) => e.k >= n0 - 1), ids = steps.map((e) => e.joint);
    assert.ok(steps.length >= 3 && ids[ids.length - 1].endsWith('|' + doc.pieces[0].id), \`control: \${what}: the closer's joints and the seam are read (\${ids.join(' ')})\`);
    for (const e of steps) if (Math.abs(e.dkDeg) > Cn.TOL_K) bad.push(\`\${what} \${e.joint}: phi'' steps by \${e.dkDeg.toFixed(4)} °/m²\`);
  }
  // a closed lap of upright curves banked whole (core_close_banks_lap's lap, closed by Close, which banks it; bankLapWith again on top adds nothing)
  const Q = (Math.PI * 300) / 2; let l = D.createDoc('lap');
  l = extend(l, { length: 100, family: 'bowl' }); l = extendTurnBy(l, { length: Q }, 90 * DEG); l = extend(l, { length: 100 }); l = extend(l, { length: Q / 2, targets: { kh: 1 / 300 } }); l = extendTurnBy(l, { length: Q / 2 }, 67.5 * DEG);
  l = extend(l, { length: 100, targets: { phi: -20 * DEG } }); l = extendTurnBy(l, { length: Q }, 90 * DEG); l = extend(l, { length: 100, targets: { phi: 0 } }); l = extendTurnBy(l, { length: Q }, 90 * DEG);
  const c = require(path.join(T, 'app/core/closejob.js')).runCloseBest({ doc: l }); assert.equal(c.converged, true, \`control: the lap closes (\${c.report})\`);
  const b = F.bankLapWith(c.doc), steps = Cn.jointSteps(b.doc, { channels: ['phi'] });
  assert.ok(steps.length === 9 && b.doc.pieces.some((P, k) => k > 0 && P.channels.phi.some((x) => Math.abs(x) > 1 * DEG) && !l.pieces[k].channels.phi.some((x) => Math.abs(x) > 1 * DEG)), 'control: nine joints read, and a curve laid flat carries a bank');
  for (const e of steps) if (Math.abs(e.dkDeg) > Cn.TOL_K) bad.push(\`the banked lap \${e.joint}: phi'' steps by \${e.dkDeg.toFixed(4)} °/m²\`);
  assert.deepEqual(bad, [], \`the added bank is C2 at every joint (bar \${Cn.TOL_K} °/m²)\`);
});
`;
s = s.replace(/\s*$/, '') + EOL + row.split('\n').join(EOL);
fs.writeFileSync(p, s); console.log('row 10 appended');
