'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, LEAD, D, DEG, TB, extend, RP } = require('./route.js');
(async () => {
  const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
  const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
  const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
  const S = extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
  const p = await mountPanel();
  for (const s of [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }]) await piece(p, s);
  const C = D.parse(p.shell.text());
  const f = (t) => `${t.deg.toFixed(1)}°, 80 % of it over ${t.span.toFixed(1)} m (${(t.s10 - LEAD).toFixed(1)} to ${(t.s90 - LEAD).toFixed(1)}), radius ${t.radius.toFixed(1)} m`;
  console.log('turnOf (test/roll_profile.js), metres from the S piece start');
  console.log('S  A (0-200)', f(RP.turnOf(S, LEAD, LEAD + 200)), '| B (200-450)', f(RP.turnOf(S, LEAD + 200, LEAD + 450)));
  console.log('1c A (0-112.5)', f(RP.turnOf(C, LEAD, LEAD + 112.5)), '| B (112.5-350)', f(RP.turnOf(C, LEAD + 112.5, LEAD + 350)));
})();
