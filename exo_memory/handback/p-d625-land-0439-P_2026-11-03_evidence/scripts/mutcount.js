// mutcount.js <tap>: per test file, rows whose title says "applied" (a mutant row): ok vs not ok; rows saying NOT APPLIED; and controls. Files from each row's location.
'use strict';
const L = require('fs').readFileSync(process.argv[2], 'utf8').split(/\r?\n/), per = new Map();
for (let i = 0; i < L.length; i++) {
  const m = /^(\s*)(ok|not ok) \d+ - (.*?)(?: # (SKIP|TODO).*)?$/.exec(L[i]); if (!m) continue;
  let file = '?'; for (let j = i + 1; j < Math.min(L.length, i + 30); j++) { const g = /location: '.*?([^\/]+\.test\.js):\d+/.exec(L[j]); if (g) { file = g[1]; break; } if (/^\s*(ok|not ok) \d+ - /.test(L[j])) break; }
  const t = m[3], e = per.get(file) || { applied: 0, caught: 0, red: 0, notApplied: 0, control: [] }; per.set(file, e);
  if (/NOT APPLIED/i.test(t)) e.notApplied++;
  else if (/\bapplied\b/i.test(t) && /caught|mutat/i.test(t)) { e.applied++; if (m[2] === 'ok') e.caught++; else e.red++; }
  if (/^control|unmutated/i.test(t)) e.control.push(m[2]);
}
let A = 0, C = 0, N = 0;
for (const [f, e] of [...per].filter(([, e]) => e.applied || e.notApplied || e.control.length).sort()) { A += e.applied; C += e.caught; N += e.notApplied; console.log(`${f}: applied ${e.applied} / caught ${e.caught} / NOT APPLIED ${e.notApplied}${e.red ? ` / NOT CAUGHT ${e.red}` : ''}${e.control.length ? ` · control ${e.control.join(',')}` : ''}`); }
console.log(`all harnesses: applied ${A} / caught ${C} / NOT APPLIED ${N}`);
