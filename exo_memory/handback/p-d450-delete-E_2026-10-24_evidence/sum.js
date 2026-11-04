// sum.js (D450 part 2 step 2, pane E): totals of a del.ps1 result file. Usage: node sum.js result-A-dry.jsonl
'use strict';
const fs = require('fs');
const rows = fs.readFileSync(process.argv[2], 'utf8').replace(/^﻿/, '').trim().split('\n').map((l) => JSON.parse(l));
const r = rows.filter((x) => !x.meta);
const ok = r.filter((x) => x.ok), skip = r.filter((x) => x.skip), err = r.filter((x) => x.error);
const add = (a, k) => a.reduce((s, x) => s + (Number(x[k]) || 0), 0);
console.log(rows.filter((x) => x.meta).map((x) => JSON.stringify(x)).join('\n'));
console.log('rows', r.length, 'ok', ok.length, 'removed', r.filter((x) => x.removed).length, 'skipped', skip.length, 'errors', err.length);
console.log('du of the ok rows', add(ok, 'du'), 'B', (add(ok, 'du') / 2 ** 30).toFixed(2), 'GiB');
console.log('backup files', add(ok, 'backedUp'), 'bytes', add(ok, 'backupBytes'), (add(ok, 'backupBytes') / 2 ** 30).toFixed(2), 'GiB; not backed up', add(ok, 'notBackedUp'));
const by = {}; for (const x of ok) { const k = x.g; by[k] = by[k] || { n: 0, du: 0, bk: 0 }; by[k].n++; by[k].du += Number(x.du) || 0; by[k].bk += Number(x.backupBytes) || 0; }
for (const [k, v] of Object.entries(by)) console.log(' ', k, v.n, 'du', (v.du / 2 ** 30).toFixed(3), 'GiB, backup', (v.bk / 2 ** 30).toFixed(3), 'GiB');
for (const x of skip) console.log('SKIP', x.path, '::', x.skip);
for (const x of err) console.log('ERROR', x.path, '::', x.error);
const big = ok.slice().sort((a, b) => b.backupBytes - a.backupBytes).slice(0, 6);
for (const x of big) console.log('  largest backup', x.path, x.backupBytes, 'files', x.backedUp);
