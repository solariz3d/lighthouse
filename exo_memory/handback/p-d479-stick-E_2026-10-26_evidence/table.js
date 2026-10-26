// table.js (D479, pane E): READ-ONLY. Per seat: the local transcript now, what the ledger would give the laptop, today's tail
// files the ledger does not name, and how many exports since the agreed state (the laptop's last import) left a tail file.
'use strict';
const fs = require('fs'), path = require('path');
const dir = 'D:/consonance-L-20260911/consonance-tails', j = JSON.parse(fs.readFileSync(path.join(dir, 'ledger.json'), 'utf8'));
const exp = (() => { const t = fs.readFileSync(process.argv[2], 'utf8'); return JSON.parse(t.slice(t.indexOf('{'))); })();
const local = Object.fromEntries(exp.rows.map((r) => [r.sid, { size: fs.statSync(r.path).size, inst: r.path.split(/[\\/]/).slice(-2, -1)[0].replace('C--Consonance-instances-', '') }]));
const files = fs.readdirSync(dir).map((n) => ({ n, st: fs.statSync(path.join(dir, n)) }));
const MB = (b) => (b / 1048576).toFixed(1) + ' MiB';
console.log('seat | instance | local now | ledger pending to (laptop gets) | owed vs ledger | exports since agreed | today (10-26) files');
for (const [sid, s] of Object.entries(j.seats)) {
  const ag = s.agreed ? s.agreed.offset : 0, p = s.pending, L = local[sid];
  const mine = files.filter((f) => f.n.startsWith(sid + '.' + ag + '-'));
  const today = mine.filter((f) => f.st.mtime.toISOString().startsWith('2026-10-26')).map((f) => `${f.n.slice(sid.length + 1)} (${f.st.size} B)`);
  console.log([s.seat, L.inst, L.size, p.toOffset, `${L.size - p.toOffset} B = ${MB(L.size - p.toOffset)}`, mine.length, today.join('; ') || 'none'].join(' | '));
}
