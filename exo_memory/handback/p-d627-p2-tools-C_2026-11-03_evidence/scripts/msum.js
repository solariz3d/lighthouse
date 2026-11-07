// msum.js <memory-sweep.json>: the findings' shape only (set, project, file, mtime) — never the matched wording. READ-ONLY.
'use strict';
const fs = require('fs');
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log('registry_loaded', j.registry_loaded, j.registry_reason || '');
console.log('sets', JSON.stringify(j.sets).slice(0, 400));
for (const f of j.findings) {
  const keys = Object.keys(f).join(',');
  let mt = ''; try { mt = fs.statSync(f.path || f.file).mtime.toISOString().slice(0, 10); } catch (_) {}
  console.log(keys, '|', f.set || f.kind || '', '|', String(f.project || '').slice(0, 50), '|', String(f.path || f.file || '').replace(/^.*projects[\\/]/, '').slice(0, 90), '| mtime', mt);
}
