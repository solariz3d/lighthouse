// record.js: add or replace one unit's row in table.jsonl.  node record.js '<json>'
const fs = require('fs'), path = require('path');
const f = path.join(__dirname, 'table.jsonl');
const row = JSON.parse(process.argv[2] === '-' ? require('fs').readFileSync(0, 'utf8') : process.argv[2]);
const need = ['id', 'W', 'phrases', 'earliest', 'class', 'step', 'carried', 'asof'];
for (const k of need) if (row[k] === undefined) throw new Error('missing ' + k);
const CL = ['RING', 'DIGEST', 'OWN-NOTE', 'PROXY', 'CARRY', 'INFER', 'NONE', 'NT'];
if (!CL.includes(row.class)) throw new Error('class ' + row.class);
if (row.class === 'NT' && !row.ntReason) throw new Error('NT needs ntReason');
if ((row.class === 'INFER' || row.class === 'NONE') && row.phrasesFound === undefined) throw new Error('INFER/NONE needs phrasesFound');
const rows = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const i = rows.findIndex((r) => r.id === row.id);
if (i >= 0) rows[i] = row; else rows.push(row);
fs.writeFileSync(f, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
console.log('recorded', row.id, row.class, '(' + rows.length + ' rows)');
