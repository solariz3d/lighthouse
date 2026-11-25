'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const R = require('path').resolve(process.env.ROUTE_TREE || 'G:/consonance-scratch/o-route-t180');
const { mountPanel, piece, shape, read, LEAD, D, DEG, TB, extend } = require('./route.js');
const A = require(R + '/src/core/adapter.js'), V = require(R + '/src/validate/index.js');
const crypto = require('crypto'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex').slice(0, 12);
const M = (pairs) => [{ s: LEAD, deg: 0 }, ...pairs.map(([at, deg]) => ({ s: LEAD + at, deg }))];
// the checker as the app runs it (full speed, as src/core/sharp.js faults), its reds and ambers on the S's stretch (track metres 290 to 760), by reason
const check = (doc) => { const { path } = A.toPath(doc), res = V.validate(path, A.toSegments(doc), { csp: true, fullSpeed: true });
  const on = (xs) => (xs || []).filter((x) => { const a = x.s0 != null ? x.s0 : x.s, b = x.s1 != null ? x.s1 : a; return b >= LEAD - 10 && a <= LEAD + 460; }).map((x) => x.reason);
  const c = (xs) => { const m = {}; for (const r of on(xs)) m[r] = (m[r] || 0) + 1; return JSON.stringify(m); };
  return `red ${c(res.red)} amber ${c(res.amber)}`; };
const steep = (doc) => { const r = read(doc).filter((x) => x.s >= LEAD - 5 && x.s <= LEAD + 310); let mr = 0, at = 0; for (let i = 8; i < r.length; i++) { const q = Math.abs(r[i].b - r[i - 8].b) / 4; if (q > mr) { mr = q; at = r[i].s - 2 - LEAD; } } return `steepest roll ${mr.toFixed(2)} °/m at ${at.toFixed(0)} m`; };
const out = (id, doc, marks) => { const t = D.serialize(doc), r = shape(doc, marks); console.log(`${id} [sha256 ${sha(t)}]\n  turn A ${r.turnA}\n  turn B ${r.turnB}\n  bank ${r.bank}; range ${r.range}\n  halts: ${r.halts}; ${steep(doc)}\n  checker: ${check(doc)}`); };
const ROUTES = {
  P: [M([[112, -27], [165, 0], [215, 26]]), [{ L: 330, turn: 90, bank: -27, flow: true, at: 112, rows: [['turn', -90, 165], ['bank', 0, 165], ['bank', 26, 215]] }]],
  '1a': [M([[55, -27], [110, 0], [155, 26], [200, 26], [300, 0]]), [{ L: 110, turn: 90, bank: -27, flow: true, at: 55, rows: [['bank', 0, 110]] }, { L: 90, turn: -90, bank: 26, flow: true, at: 45 }, { L: 150, bank: 0, flow: true, at: 100 }]],
  '1b': [M([[55, -27], [110, -27], [120, 0], [155, 26], [200, 26], [300, 0]]), [{ L: 110, turn: 90, bank: -27, flow: true, at: 55 }, { L: 90, turn: -90, bank: 0, flow: true, at: 10, rows: [['bank', 26, 45]] }, { L: 150, bank: 0, flow: true, at: 100 }]],
  '1c': [M([[55, -27], [112, 0], [157, 26], [200, 26], [300, 0]]), [{ L: 200, turn: 176, bank: -27, flow: true, at: 55, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 157]] }, { L: 150, bank: 0, flow: true, at: 100 }]],
  '1d': [M([[45, -27], [112, 0], [167, 26], [200, 26], [300, 0]]), [{ L: 200, turn: 176, bank: -27, flow: true, at: 45, rows: [['turn', -176, 80], ['bank', 0, 112], ['bank', 26, 167]] }, { L: 150, bank: 0, flow: true, at: 100 }]],
};
(async () => {
  const lead = () => extend(D.createDoc('flow'), { length: LEAD, family: 'bowl', first: { w: 33 } });
  const MARKS = [{ at: 145, deg: -27 }, { at: 200, deg: 0 }, { at: 255, deg: 25 }, { at: 300, deg: 26 }];
  const S_OPTS = { length: 300, turnDeg: 0, changes: { turnDeg: [{ from: 80, deg: 92 }, { from: 200, deg: -91 }] }, targets: { phi: -20 * DEG }, transition: { phi: 80 }, bankShape: 'flow', through: { phi: MARKS.map((m) => ({ at: m.at, target: m.deg * DEG })) } };
  out('S (the core, as he drove it)', extend(TB.extendCorner(lead(), S_OPTS), { length: 150, targets: { phi: 0 }, transition: { phi: 100 }, bankShape: 'flow' }), M([[80, -20], [145, -27], [200, 0], [255, 25], [300, 26], [400, 0]]));
  for (const [id, [marks, pieces]] of Object.entries(ROUTES)) {
    const p = await mountPanel(); let ok = true;
    for (const [k, s] of pieces.entries()) { const r = await piece(p, s); console.log(`  ${id} piece ${k + 1} sent ${JSON.stringify(r.sent)}`); if (!r.laid) { console.log(`${id} piece ${k + 1} REFUSED: ${r.msg}`); ok = false; break; } }
    if (ok) out(id, D.parse(p.shell.text()), marks);
  }
})();
