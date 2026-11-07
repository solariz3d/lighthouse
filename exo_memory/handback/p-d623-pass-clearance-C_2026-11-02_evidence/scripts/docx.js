// docx.js <tree>: a crossing made with the core's own pieces: a straight, a 270° turn (rising by climbDeg as a rate, then level), a straight back across the
// first; the real road gap over the lead at the crossing, and the rule's findings, for a few climbs
'use strict';
const T = process.argv[2];
const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), { extendTurnBy } = require(T + '/src/core/turnby.js'), AD = require(T + '/src/core/adapter.js');
const { passClearance } = require(T + '/src/validate/passclear.js');
const DEG = Math.PI / 180;
function crossDoc(climbDeg) {
  let d = extend(D.createDoc('crossing'), { length: 200, family: 'bowl' });
  d = extendTurnBy(d, { length: 240, ...(climbDeg ? { climbDeg } : {}) }, 135 * DEG);
  d = extendTurnBy(d, { length: 240, ...(climbDeg ? { climbDeg: -climbDeg } : {}) }, 135 * DEG);
  d = extend(d, { length: 300 });
  return d;
}
for (const c of [0, 1, 2, 3, 4]) {
  let d; try { d = crossDoc(c); } catch (e) { console.log(`climb ${c}: refused by the core: ${e.message}`); continue; }
  const { segments, path: p0 } = AD.toPath(d, { step: 2 }), path = AD.offsetPath(d, segments, p0), S = path.samples;
  const lead = S.filter((q) => segments[q.seg].id === d.pieces[0].id), last = S.filter((q) => segments[q.seg].id === d.pieces[d.pieces.length - 1].id);
  let best = null; for (const a of last) for (const b of lead) { const dd = Math.hypot(a.pos[0] - b.pos[0], a.pos[2] - b.pos[2]); if (!best || dd < best.dd) best = { dd, gap: a.pos[1] - b.pos[1], sa: a.s, sb: b.s }; }
  const f = passClearance(path, segments);
  console.log(`climb ${c}: pieces ${d.pieces.map((p) => p.id).join(',')}, width ${JSON.stringify(segments[0].profile.u.slice(0, 1).concat(segments[0].profile.u.slice(-1)))}; crossing ${best.dd.toFixed(1)} m apart in plan, road gap ${best.gap.toFixed(2)} m (lead s ${best.sb}, last s ${best.sa.toFixed(0)}); findings ${f.length}${f.length ? `, worst short ${Math.max(...f.map((x) => x.shortM)).toFixed(2)}` : ''}`);
}
