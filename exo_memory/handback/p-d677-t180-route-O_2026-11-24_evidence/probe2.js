'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, shape, LEAD, D } = require('./route.js');
const M = (pairs) => [{ s: LEAD, deg: 0 }, ...pairs.map(([at, deg]) => ({ s: LEAD + at, deg }))];
const crypto = require('crypto');
async function run(id, pieces, marks) {
  const p = await mountPanel();
  for (const [k, s] of pieces.entries()) { const r = await piece(p, s); if (process.env.SENT) console.log(`  piece ${k + 1} sent ${JSON.stringify(r.sent)}`); if (!r.laid) { console.log(`${id}: piece ${k + 1} REFUSED: ${r.msg}`); return null; } }
  const t = p.shell.text(), r = shape(D.parse(t), marks);
  console.log(`${id}  [sha256 ${crypto.createHash('sha256').update(t).digest('hex').slice(0, 12)}]\n  turn A ${r.turnA}\n  turn B ${r.turnB}\n  bank ${r.bank}; range ${r.range}\n  halts: ${r.halts}`);
  return r;
}
(async () => {
  const P = { L: 330, turn: 90, bank: -27, flow: true, at: 112, rows: [['turn', -90, 165], ['bank', 0, 165], ['bank', 26, 215]] };
  await run('P', [P], M([[112, -27], [165, 0], [215, 26]]));
  await run('2a P with turn at the start ticked', [{ ...P, early: ['turn'] }], M([[112, -27], [165, 0], [215, 26]]));
  await run('2a2 P with turn and bank at the start ticked', [{ ...P, early: ['turn', 'bank'] }], M([[112, -27], [165, 0], [215, 26]]));
  const r1 = Number(process.argv[2] || 82), r2 = Number(process.argv[3] || -100);
  await run(`2b rate ${r1} early, then ${r2} from 110, 0 from 200`, [{ as: 'rate', L: 220, turn: r1, early: ['turn'], bank: -27, flow: true, at: 55, rows: [['turn', r2, 110], ['turn', 0, 200], ['bank', 0, 110], ['bank', 26, 155]] }, { L: 150, bank: 0, flow: true, at: 100 }], M([[55, -27], [110, 0], [155, 26], [220, 26], [320, 0]]));
})();
