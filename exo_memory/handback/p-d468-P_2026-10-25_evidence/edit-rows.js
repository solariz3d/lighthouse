'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
edit('test/core_finish_bank.test.js',
`test('row 4: a straight gets none: a finish that is only a straight keeps the laid bank', () => {`,
`// AMENDED by D468 (P; the bank plan is C2, finish.js bankPlan's curvature rows and its box): a straight gets none OF ITS OWN. A turn's bank ramps from its third
// control point (its first two are pinned at the joint), so for the joint to be C2 the straight's third point from that joint carries the turn's end curvature:
// about 1.5° at one control point, the bank's smooth end over the straight's first span (the other way, a turn's third point at 0 too, reached every corner's
// exit a knot later: 24.4° against D447 §10's 32.5°). Every other point of the straight is as laid.
const TAIL_DEG = 2;
test('row 4: a straight gets none of its own: a finish that is only a straight keeps the laid bank, but for the tail of a neighbouring roll-off on its third point from the joint (D468)', () => {`);
edit('test/core_finish_bank.test.js',
`  for (const P of r.doc.pieces.slice(n0)) if (Math.max(...P.channels.kh.map(Math.abs)) < 1e-9) assert.ok(P.channels.phi.every((x) => Math.abs(x - P.channels.phi[0]) < 1e-9), \`\${P.id}, a straight, keeps its laid bank\`);`,
`  for (const P of r.doc.pieces.slice(n0)) if (Math.max(...P.channels.kh.map(Math.abs)) < 1e-9) {
    const ph = P.channels.phi, n = ph.length;
    assert.ok(ph.every((x, i) => (i === 2 || i === n - 3 ? Math.abs(x - ph[0]) < TAIL_DEG * DEG : Math.abs(x - ph[0]) < 1e-9)), \`\${P.id}, a straight, keeps its laid bank but for the roll-off's tail on its third point from each joint (≤ \${TAIL_DEG}°): \${ph.map((x) => ((x - ph[0]) / DEG).toFixed(2)).join(' ')}\`);
    assert.ok(Math.abs(ph[0] - ph[1]) < 1e-9 && Math.abs(ph[n - 1] - ph[n - 2]) < 1e-9, \`\${P.id}: the joints themselves meet the laid bank flat\`);
  }`);
edit('test/core_close_banks_lap.test.js',
`test('row 9: a straight next to a curve keeps the bank it was laid with', () => {
  const r = closed(), open = lap(); assert.equal(r.converged, true, r.report);
  for (const i of [0, 2]) assert.deepEqual(r.doc.pieces[i].channels.phi, open.pieces[i].channels.phi, \`\${open.pieces[i].id}, a straight between curves\`);
});`,
`// AMENDED by D468 (P; the bank plan is C2, finish.js bankPlan's curvature rows): a straight next to a curve keeps the bank it was laid with but for the TAIL of the
// curve's roll-off on its third control point from the joint (about 1.5°, the bank's smooth end over the straight's first span: a turn's bank ramps from its third
// point, and the joint is C2 only if the straight's third point carries that curvature or the turn's is 0 too, which reached every corner's exit a knot later,
// 24.4° against D447 §10's 32.5°). The joint itself (the first two points) and every other point are byte for byte as laid.
const TAIL_DEG = 2;
test('row 9: a straight next to a curve keeps the bank it was laid with, but for the tail of the roll-off on its third point from the joint (D468)', () => {
  const r = closed(), open = lap(); assert.equal(r.converged, true, r.report);
  for (const i of [0, 2]) {
    const got = r.doc.pieces[i].channels.phi, was = open.pieces[i].channels.phi, n = got.length;
    got.forEach((x, k) => { if (k === 2 || k === n - 3) assert.ok(Math.abs(x - was[k]) < TAIL_DEG * DEG, \`\${open.pieces[i].id} point \${k}: the roll-off's tail, \${((x - was[k]) / DEG).toFixed(2)}°, within \${TAIL_DEG}°\`); else assert.equal(x, was[k], \`\${open.pieces[i].id} point \${k}, a straight between curves, as laid\`); });
  }
});`);
