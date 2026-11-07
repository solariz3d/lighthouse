// repin.js: set core_cup_fixtures' sha256 pin of each sealed manifest to that file's own sha256 (run in the tree); prints each change; fails on a missing pin
'use strict';
const fs = require('fs'), crypto = require('crypto'), T = 'test/core_cup_fixtures.test.js';
let s = fs.readFileSync(T, 'utf8'), n = 0;
for (const m of ['manifest.d604.json', 'manifest.d609.json', 'manifest.lighthull.json']) {
  const p = 'test/fixtures/' + m; if (!fs.existsSync(p)) continue;
  const h = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  const key = "sha(fs.readFileSync(path.join(FX, '" + m + "'))), '", i = s.indexOf(key);
  if (i < 0 || s.indexOf(key, i + 1) >= 0) throw new Error('pin for ' + m + ' not found exactly once');
  const a = i + key.length, old = s.slice(a, a + 64);
  if (!/^[0-9a-f]{64}$/.test(old)) throw new Error('pin for ' + m + ' is not a sha256');
  if (old !== h) { s = s.slice(0, a) + h + s.slice(a + 64); n++; console.log('repinned ' + m + ' ' + old.slice(0, 8) + ' -> ' + h.slice(0, 8)); }
}
if (n) fs.writeFileSync(T, s);
