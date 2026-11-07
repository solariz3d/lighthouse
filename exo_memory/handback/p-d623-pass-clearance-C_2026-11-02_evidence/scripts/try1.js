// try1.js <tree>: the rule on test/geom_fixtures crossing(h) for a few h: the real road gap at the crossing, and the rule's worst finding
'use strict';
const T = process.argv[2];
const G = require(T + '/src/geom/index.js'), F = require(T + '/test/geom_fixtures.js'), { passClearance } = require(T + '/src/validate/passclear.js');
for (const [h, roll] of [[3, 0], [4, 0], [4.5, 0], [5, 0], [6, 0], [4, Math.PI], [3.5, Math.PI], [5, Math.PI / 4], [0, 0]]) {
  const segs = F.crossing(h, { tailRoll: roll }), p = G.buildPath(segs, { step: 2 }), S = p.samples;
  // the real gap: the 'over' station nearest above the lead's centre line, its height over the lead
  const lead = S.filter((q) => segs[q.seg].id === 'lead'), over = S.filter((q) => segs[q.seg].id === 'over');
  let best = null; for (const a of over) for (const b of lead) { const dx = a.pos[0] - b.pos[0], dz = a.pos[2] - b.pos[2], d = Math.hypot(dx, dz); if (!best || d < best.d) best = { d, gap: a.pos[1] - b.pos[1], sa: a.s, sb: b.s }; }
  const t0 = Date.now(), f = passClearance(p, segs), worst = f.reduce((m, x) => (!m || x.shortM > m.shortM ? x : m), null);
  console.log(`h ${h} roll ${(roll * 180 / Math.PI).toFixed(0)}: road gap ${best.gap.toFixed(3)} at lead s ${best.sb} / over s ${best.sa}; findings ${f.length} (${Date.now() - t0} ms); worst ${worst ? `s ${worst.s} u ${worst.u.toFixed(2)} other ${worst.otherS} gap ${worst.gapM.toFixed(3)} short ${worst.shortM.toFixed(3)} roadGap ${worst.roadGapM === null ? '-' : worst.roadGapM.toFixed(3)} hull ${worst.hullM.toFixed(3)} clip ${worst.clip}` : 'none'}`);
}
