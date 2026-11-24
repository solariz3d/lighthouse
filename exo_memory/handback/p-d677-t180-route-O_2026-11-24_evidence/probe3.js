'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const { mountPanel, piece, read, LEAD, D } = require('./route.js');
// one corner piece, turn T, extra turn -T from f, L m: the built heading's peak and where it is, and the end heading
(async () => {
  const rows = [];
  for (const L of [200, 210]) for (const T of [130, 150, 170, 190]) for (const f of [70, 90, 110]) {
    const p = await mountPanel(); const r = await piece(p, { L, turn: T, rows: [['turn', -T, f]] });
    if (!r.laid) { rows.push(`L ${L} T ${T} f ${f}: refused ${r.msg.split('|').find((x) => /BAD|needs/.test(x)) || ''}`.slice(0, 200)); continue; }
    const h = read(D.parse(p.shell.text())).filter((x) => x.s >= LEAD - 5), pk = h.reduce((a, x) => (x.h > a.h ? x : a)), e = h[h.length - 1];
    rows.push(`L ${L} T ${T} f ${f}: peak ${pk.h.toFixed(1)} at ${(pk.s - LEAD).toFixed(1)}, end ${e.h.toFixed(1)}`);
  }
  console.log(rows.join('\n'));
})();
