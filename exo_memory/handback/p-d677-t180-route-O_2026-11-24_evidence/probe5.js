'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, read, LEAD, D, DEG, TB, extend } = require('./route.js');
const crypto = require('crypto'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 12);
const RV = require(require('path').resolve(process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180') + '/src/validate/index.js');
const sharp = (doc) => { const r = read(doc).filter((x) => x.s >= LEAD - 5 && x.s <= LEAD + 310); let m = 0, at = 0, mr = 0, rat = 0; for (let i = 8; i < r.length; i++) { const k = Math.abs(r[i].h - r[i - 8].h) / 4; if (k > m) { m = k; at = r[i].s - 2 - LEAD; } const q = Math.abs(r[i].b - r[i - 8].b) / 4; if (q > mr) { mr = q; rat = r[i].s - 2 - LEAD; } } return `sharpest turn ${m.toFixed(2)} °/m (radius ${(1 / (m * DEG)).toFixed(0)} m) at ${at.toFixed(0)} m; steepest roll ${mr.toFixed(2)} °/m at ${rat.toFixed(0)} m`; };
const verdict = (doc) => { try { const v = (RV.validate || RV.check || RV.default)(doc); return JSON.stringify(v && (v.summary || v.verdict || v.level || Object.keys(v))).slice(0, 200); } catch (e) { return 'validate: ' + e.message.slice(0, 120); } };
(async () => {
  const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
  const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
  const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
  const S = extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' });
  console.log('S', sha(D.serialize(S)), sharp(S));
  const p = await mountPanel();
  for (const s of [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }]) await piece(p, s);
  const C = D.parse(p.shell.text()); console.log('1c', sha(p.shell.text()), sharp(C));
  console.log('validate exports', Object.keys(RV).join(',').slice(0, 300));
  // the proposal, asked of the core without building it: the panel's turn-0 options (2z) with turnDeg 0 in place of targets.kh 0
  const q = await mountPanel(); const z = await piece(q, { L: 300, turn: 0, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] });
  const o = JSON.parse(JSON.stringify(z.sent)); delete o.targets.kh; o.turnDeg = 0;
  q.shell.extend(o); const e = await piece(q, { L: 150, bank: 0, flow: true, at: 100 });
  console.log('2z refused as typed:', !z.laid, '| with turnDeg 0:', sha(q.shell.text()), q.shell.text() === D.serialize(S) ? 'the same bytes as S' : 'differs from S', '| ease-out laid', e.laid);
})();
