// verify.js (D450 delete, pane E): re-hash every file in the backup's SHA256SUMS.txt and compare
'use strict';
const fs = require('fs'), crypto = require('crypto'), path = require('path');
const root = 'C:/Users/nname/t180-cleanup-backup-2026-10-24';
const lines = fs.readFileSync(path.join(root, 'SHA256SUMS.txt'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
let ok = 0, bad = [];
for (const l of lines) {
  const m = /^([0-9a-f]{64})  (.+)$/.exec(l); if (!m) { bad.push('bad line: ' + l); continue; }
  const f = path.join(root, m[2]);
  try { const h = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'); if (h === m[1]) ok++; else bad.push('differs: ' + m[2]); } catch (e) { bad.push('unreadable: ' + m[2]); }
}
console.log('lines', lines.length, 'equal', ok, 'not', bad.length); for (const b of bad.slice(0, 20)) console.log(' ', b);
