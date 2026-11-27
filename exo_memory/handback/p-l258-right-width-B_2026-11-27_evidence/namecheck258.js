// namecheck258.js (pane B, L258): every installed track folder and layout name (4+ characters, not the builder's own t180b_) against the files named.
// Prints counts and term numbers (0-based) only, never a name. usage: node namecheck258.js <survey.json> <file or dir>...
'use strict';
const fs = require('fs'), path = require('path');
const [survey, ...targets] = process.argv.slice(2);
const rows = require(path.resolve(survey)), names = new Set();
for (const r of rows) { names.add(r.track); if (r.layout) names.add(r.layout); }
const terms = [...names].filter((n) => n.length >= 4 && !/^t180b/i.test(n)), esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = targets.flatMap((t) => (fs.statSync(t).isDirectory() ? fs.readdirSync(t).map((f) => path.join(t, f)).filter((f) => fs.statSync(f).isFile()) : [t]));
let hits = 0; const by = {};
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const [i, t] of terms.entries()) if (new RegExp(`(^|[^a-z0-9])${esc(t)}([^a-z0-9]|$)`, 'im').test(text)) { hits++; by[i] = (by[i] || 0) + 1; }
}
console.log(`terms ${terms.length}, files ${files.length}, hits ${hits}, by term ${JSON.stringify(by)}`);
