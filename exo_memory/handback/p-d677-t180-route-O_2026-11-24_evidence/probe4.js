'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, read, shape, LEAD, D, DEG, TB, extend } = require('./route.js');
const crypto = require('crypto');
const M = (pairs) => [{ s: LEAD, deg: 0 }, ...pairs.map(([at, deg]) => ({ s: LEAD + at, deg }))];
const say = (id, t, marks) => { const r = shape(D.parse(t), marks); console.log(`${id}  [sha256 ${crypto.createHash('sha256').update(t).digest('hex').slice(0, 12)}]\n  turn A ${r.turnA}\n  turn B ${r.turnB}\n  bank ${r.bank}; range ${r.range}\n  halts: ${r.halts}`); };
(async () => {
  const mode = process.argv[2];
  if (mode === 'scan') {
    for (const f of [76, 78, 80, 82]) for (const T of [170, 175, 180, 185]) {
      const p = await mountPanel(); const r = await piece(p, { L: 200, turn: T, rows: [['turn', -T, f]] }); if (!r.laid) { console.log(f, T, 'refused'); continue; }
      const h = read(D.parse(p.shell.text())).filter((x) => x.s >= LEAD - 5), pk = h.reduce((a, x) => (x.h > a.h ? x : a));
      console.log(`f ${f} T ${T}: peak ${pk.h.toFixed(1)} at ${(pk.s - LEAD).toFixed(1)}`);
    }
    return;
  }
  const T = Number(process.argv[3]), f = Number(process.argv[4]), x = Number(process.argv[5] || 110);
  const p = await mountPanel();
  for (const s of [{ L: 200, turn: T, bank: -27, flow: true, at: 55, rows: [['turn', -T, f], ['bank', 0, x], ['bank', 26, x + 45]] }, { L: 150, bank: 0, flow: true, at: 100 }]) { const r = await piece(p, s); console.log('  sent', JSON.stringify(r.sent)); if (!r.laid) { console.log('REFUSED', r.msg); return; } }
  say(`1c one corner piece: turn ${T}, extra turn -${T} from ${f}; bank -27 flow at 55, 0 at ${x}, 26 at ${x + 45}; then the ease-out`, p.shell.text(), M([[55, -27], [x, 0], [x + 45, 26], [200, 26], [300, 0]]));
})();
