// edit25.js (pane B, L271 amendment): row 25's banked rim press. CRLF file: normalised to LF, each replacement exact and unique, written back CRLF.
'use strict';
const fs = require('fs'), F = process.argv[2];
let t = fs.readFileSync(F, 'utf8'); const crlf = t.includes('\r\n'); t = t.replace(/\r\n/g, '\n');
const rep = (a, b) => { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`not unique (${n}): ${a.slice(0, 80)}`); t = t.replace(a, () => b); };
rep(`test('row 25 (D519, amended D520): Grab on the road: the pressed point follows the pointer and a rim keeps the far rim (built again and read),`,
    `test('row 25 (D519, amended D520, L271): Grab on the road: the pressed point follows the pointer (a rim press, along the road\'s slope) and a rim keeps the far rim (built again and read),`);
rep(`  const m0 = built().path.samples.find((x) => x.s === 100), pose = { eye: [m0.pos[0] - m0.T[0] * 60, m0.pos[1] + 50, m0.pos[2] - m0.T[2] * 60], target: m0.pos.slice(), up: [0, 1, 0], fov: Math.PI / 3 };
  const VP = M.viewProj(pose, 900 / 600), scr =`,
    `  const aim = (q) => ({ eye: [q.pos[0] - q.T[0] * 60, q.pos[1] + 50, q.pos[2] - q.T[2] * 60], target: q.pos.slice(), up: [0, 1, 0], fov: Math.PI / 3 });   // L271: re-aimed once, for the banked press
  const m0 = built().path.samples.find((x) => x.s === 100);
  let pose = aim(m0), VP = M.viewProj(pose, 900 / 600);
  const scr =`);
rep(`slopeWant = A.pos.map((q, k) => q + F.R[k] * e * cx * cx + F.U0[k] * (e * cx * cy + v));`,
    `slopeWant = A.pos.map((q, k) => q + F.R[k] * e * cx * cx + F.U0[k] * (e * cx * cy + v));
    const wholeAcross = A.pos.map((q, k) => q + F.R[k] * e + F.U0[k] * (e * cx * cy + v));   // where the pull taken whole across (the rise kept) would put it: the row's own control`);
rep(`far: gap(ZG.acrossAt(t2.path, t2.segments, m2, fu).pos, ZG.acrossAt(t.path, t.segments, m, fu).pos) };`,
    `far: gap(ZG.acrossAt(t2.path, t2.segments, m2, fu).pos, ZG.acrossAt(t.path, t.segments, m, fu).pos), across: gap(wholeAcross, slopeWant) };`);
rep(`  for (const o of opened) assert.ok(!['kh', 'kv', 'length'].includes(o.channel) && !['bend', 'climb', 'stretch'].includes(o.tool), \`never a re-route: \${o.tool}\`);
});`,
    `  for (const o of opened) assert.ok(!['kh', 'kv', 'length'].includes(o.channel) && !['bend', 'climb', 'stretch'].includes(o.tool), \`never a re-route: \${o.tool}\`);
  // L271, AMENDED (C's read, C6): on the cupped road above the pull's share across (e·cx²) is within 1 cm of the whole pull, so that press pins the rise along the slope
  // but cannot tell the share from the whole. The rim half is pressed again on a BANKED road, where the chord slopes with the bank: two pieces laid at the head
  // (200 m banking to 20°, 150 m held), the view moved there, the rim at u -1 pulled level (no screen-vertical part) 40 px outward
  shell.commitDoc(extend(extend(shell.getState().history.present, { length: 200, targets: { phi: 20 * DEG } }), { length: 150 }));
  const tb = built(), Lb = tb.path.samples[tb.path.samples.length - 1].s, mb = tb.path.samples.reduce((a, q) => (Math.abs(q.s - (Lb - 75)) < Math.abs(a.s - (Lb - 75)) ? q : a));
  pose = aim(mb); VP = M.viewProj(pose, 900 / 600);
  const out = Math.sign(scr(ZG.acrossAt(tb.path, tb.segments, mb, -1).pos)[0] - scr(ZG.acrossAt(tb.path, tb.segments, mb, 0).pos)[0]);
  r = press(-1, 40 * out, 0, { s: mb.s });
  assert.ok(r.across > 0.05, \`control: the pull whole across would land \${r.across} m from the slope grab's place, so this press tells the two apart\`);
  assert.ok(r.slopeMiss < 0.01, \`on the banked road the rim point is \${r.slopeMiss} m from the slope grab's place (\${r.miss} m from the pointer)\`); assert.ok(r.far < 0.01, \`and the far rim moved \${r.far} m\`);
});`);
fs.writeFileSync(F, crlf ? t.replace(/\n/g, '\r\n') : t); console.log('edited, crlf', crlf);
