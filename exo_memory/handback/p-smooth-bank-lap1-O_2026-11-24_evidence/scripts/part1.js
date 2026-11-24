// Part 1: the turn's size with today's fields, the S in ONE piece (base turn 0, an extra turn A and an extra turn B), bank off. usage: node part1.js <tree>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const T = process.argv[2], D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), RP = require(T + '/test/roll_profile.js');
const LEAD = 300, RUN = 80;
const lead = () => extend(D.createDoc('p1'), { length: LEAD, family: 'bowl', first: { w: 33 } });
const bar = (t, A) => A ? Math.abs(t.deg - 92) <= 3 && t.span >= 51 && t.radius >= 40 : Math.abs(-t.deg - 91) <= 3 && t.span >= 41 && t.radius >= 32;
console.log('one piece: run-in RUN m straight, then turn A (+92) over SA m, then turn B (-91) over SB m; a 150 m straight after');
for (const [SA, SB] of [[60, 50], [80, 70], [100, 80], [110, 90], [120, 100], [130, 110]]) {
  let d;
  try { d = TB.extendCorner(lead(), { length: RUN + SA + SB, turnDeg: 0, changes: { turnDeg: [{ from: RUN, deg: 92 }, { from: RUN + SA, deg: -91 }] } }); }
  catch (e) { console.log(SA, SB, 'REFUSED', e.code, e.message.slice(0, 120)); continue; }
  d = extend(d, { length: 150 });
  const s0 = LEAD + RUN, tA = RP.turnOf(d, s0 - 10, s0 + SA), tB = RP.turnOf(d, s0 + SA, s0 + SA + SB + 10);
  const f = (t) => `${t.deg.toFixed(1)}°, middle 80 % ${t.span.toFixed(0)} m (${(t.s10 - LEAD).toFixed(0)}-${(t.s90 - LEAD).toFixed(0)}), radius ${t.radius.toFixed(1)}`;
  console.log(`SA ${SA} SB ${SB}: A ${f(tA)} ${bar(tA, true) ? 'PASS' : 'fail'} | B ${f(tB)} ${bar(tB, false) ? 'PASS' : 'fail'} | pieces ${d.pieces.length}`);
}
