// rows.js (D479, pane E): the rehearsal's rows as a table; skips the lowio banner line before the JSON object
'use strict';
const fs = require('fs');
const txt = fs.readFileSync(process.argv[2], 'utf8'), j = JSON.parse(txt.slice(txt.indexOf('{')));
console.log('mode', j.mode, 'outcome', j.outcome, 'code', j.code, 'rows', j.rows.length);
const extra = process.argv[3] ? process.argv[3].split(',') : [];
for (const r of j.rows) {
  console.log([r.seat, (r.sid || '').slice(0, 8), r.kind, r.verdict, r.bytes, r.offset, r.toOffset, r.localSize, r.reason || '', ...extra.map((k) => `${k}=${JSON.stringify(r[k])}`), (r.why || '').slice(0, 140)].join(' | '));
}
if (process.argv[4] === 'keys') console.log(Object.keys(j.rows[0] || {}).join(','), '\nTOP', Object.keys(j).join(','));
