'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p466/';
function edit(file, oldS, newS) { const p = W + file, s = fs.readFileSync(p, 'utf8'); if (s.includes(String.fromCharCode(13,10))) { oldS = oldS.split(String.fromCharCode(10)).join(String.fromCharCode(13,10)); newS = newS.split(String.fromCharCode(10)).join(String.fromCharCode(13,10)); } if (s.split(oldS).length !== 2) throw new Error(`${file}: anchor found ${s.split(oldS).length - 1} times`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
// 1. row 10h: a case that reaches the tNext line (D466: on 0.4.20 the kinds() delete needs no joint edit at all)
edit('test/core_piece.test.js',
`  const o = PC.deleteRun(d, 2); D.checkDoc(o); assert.equal(o.pieces[2].tube, true); assert.ok(Math.abs(o.pieces[2].channels.t[0] - 2 * D.pieceEnd(d.pieces[1]).c.v) < 1e-5 && o.pieces[2].channels.t[0] > 70, 'a tube starts at twice the edge the cup before it ends at');
});`,
`  const o = PC.deleteRun(d, 2); D.checkDoc(o); assert.equal(o.pieces[2].tube, true); assert.ok(Math.abs(o.pieces[2].channels.t[0] - 2 * D.pieceEnd(d.pieces[1]).c.v) < 1e-5 && o.pieces[2].channels.t[0] > 70, 'a tube starts at twice the edge the cup before it ends at');
  // D466 (P): since D459 a ramp holds its target EXACTLY (extend.js fitWithHold), so kinds()'s two cups both end at 40.000° and the delete above re-joins the sides AS THEY ARE: the
  // tNext line of deleteRun is never reached by it (on 0.4.19 the first cup's fitted end rang to 39.72°, which is why it was). The rule needs a track whose sides do NOT join: a
  // second cup that ramps on to 60 and a tube that starts from it at 120; deleting that cup must bring the tube to 2 × 40 = 80 (tNext), never to the head's own sweep (a cup has none: 0)
  let k = extend(D.createDoc('del kinds 2'), { length: 100, family: 'bowl' }); k = extend(k, { length: 80, transition: 40, targets: { c: 40 } }); k = extend(k, { length: 80, transition: 40, targets: { c: 60 } }); k = extend(k, { length: 80, transition: 40, targets: { t: 300, w: 30 } });
  assert.ok(Math.abs(k.pieces[3].channels.t[0] - 120) < 1e-5, \`control: the tube starts at 2 × 60 = 120 (got \${k.pieces[3].channels.t[0]})\`);
  assert.throws(() => D.checkDoc({ ...k, pieces: [k.pieces[0], k.pieces[1], k.pieces[3]] }), /JOINT/, 'control: without the second cup the sides do not join as they are (120/2 against 40), so the delete must edit the joint');
  const o2 = PC.deleteRun(k, 2); D.checkDoc(o2); assert.equal(o2.pieces[2].tube, true);
  assert.ok(Math.abs(o2.pieces[2].channels.t[0] - 80) < 1e-5 && Math.abs(o2.pieces[2].channels.t[1] - 80) < 1e-5, \`the tube after the 40° cup starts flat at 2 × 40 = 80 (tNext), got \${o2.pieces[2].channels.t.slice(0, 2)}\`);
  assertOnlyTheJoint(k, o2, 2, 2, 'tube after cup');
  // and after a LEGACY head the same rule: twice the rendered edge of the bowl (legacyEdgeDeg), which is what the deleted cups started from
  const o3 = PC.deleteRun(k, 1, 2); D.checkDoc(o3); const rim = D.pieceEnd(k.pieces[0]).c.v; assert.ok(rim > 1 && rim < 40, \`control: the bowl renders an edge of \${rim}°\`);
  assert.ok(Math.abs(o3.pieces[1].channels.t[0] - 2 * rim) < 1e-5, \`the tube after the bowl starts at twice its rendered edge, \${2 * rim} (tNext), got \${o3.pieces[1].channels.t[0]}\`);
});`);
// 2. the ringing row: cases that still ring past the cap, under 0 and under the asked value with the D459 fit (fitWithHold + c2Ends); the 30 m case no longer rings at all
edit('test/core_xsec.test.js',
`  const s = extend(start(), { length: 60, transition: 10, targets: { e: 20, s: 0.95 } }); assert.ok(last(s).channels.s.every((v) => v >= 0.5 && v <= 0.95 + 1e-9));
});`,
`  const s = extend(start(), { length: 60, transition: 10, targets: { e: 20, s: 0.95 } }); assert.ok(last(s).channels.s.every((v) => v >= 0.5 && v <= 0.95 + 1e-9));
  // D466 (P): with the D459 fit (the quintic, its hold pinned, c2Ends) the 30 m case above no longer rings at all, so it no longer tells whether the clamp is there. These do
  // (measured against a copy of extend.js with the clamp removed, KE2-6: without it the fit's control points reach c + e = 155.37°, e = −33.1° and e = −32.69°):
  // a 100 m piece with a 50 m ramp to the cap on a 90° cup; an 8 m piece on an EMPTY track with a 4 m ramp to 60°; a 100 m piece with a 50 m ramp down to −30° on a bowl
  const long = extend(extend(start(), { length: 120, targets: { c } }), { length: 100, transition: 50, targets: { e: 150 - c } }), lp = last(long);
  assert.ok(lp.channels.e.every((v) => v >= 0 && v <= 150 - c + 1e-9) && lp.channels.c.every((v, i) => v + lp.channels.e[i] <= 150 + 1e-9), \`a 50 m ramp to the cap stays at the cap: e \${Math.min(...lp.channels.e)} to \${Math.max(...lp.channels.e)}\`);
  const empty = extend(D.createDoc('empty'), { length: 8, transition: 4, targets: { e: 60 } }), ep = empty.pieces[0];
  assert.ok(ep.channels.e.every((v) => v >= 0 && v <= 60 + 1e-9), \`a 4 m ramp on an empty track stays in [0, 60]: e \${Math.min(...ep.channels.e)} to \${Math.max(...ep.channels.e)}\`);
  const down = extend(start(), { length: 100, transition: 50, targets: { e: -30 } }), dp = last(down);
  assert.ok(dp.channels.e.every((v) => v >= -30 - 1e-9 && v <= 0 + 1e-9), \`a 50 m ramp down to −30° stays in [−30, 0]: e \${Math.min(...dp.channels.e)} to \${Math.max(...dp.channels.e)}\`);
  for (const dd of [long, empty, down]) assert.doesNotThrow(() => D.checkDoc(dd));
});`);
