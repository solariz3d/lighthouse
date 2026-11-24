'use strict';
const { mountPanel, piece, read, LEAD, D } = require('./route.js');
(async () => {
  const p = await mountPanel();
  for (const s of [{ L: 110, turn: 90, bank: -27, flow: true, at: 55 }, { L: 90, turn: -90, bank: 0, flow: true, at: 10, rows: [['bank', 26, 45]] }]) { const r = await piece(p, s); console.log(r.laid, JSON.stringify(r.sent)); }
  const r = read(D.parse(p.shell.text()));
  for (const x of r) if (x.s >= LEAD + 100 && x.s <= LEAD + 170 && (x.s * 2) % 4 === 0) console.log((x.s - LEAD).toFixed(0), x.b.toFixed(2));
  const q = await mountPanel(); const z = await piece(q, { L: 300, turn: 0, bank: -20, flow: true, at: 80, rows: [['turn', 92, 80], ['turn', -91, 200], ['bank', -27, 145], ['bank', 0, 200], ['bank', 25, 255], ['bank', 26, 300]] });
  console.log('2z sent', JSON.stringify(z.sent));
})();
