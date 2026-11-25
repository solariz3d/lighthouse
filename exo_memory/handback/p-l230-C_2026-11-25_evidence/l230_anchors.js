// L230 (pane C): every string literal in a mutation harness that names panel.js, which occurs in panel.js at the base (27e2084):
// its count at the base and at the tip (2e70b9f). An anchor that is once at the base must be once at the tip.
// node l230_anchors.js <worktree> <base panel.js text file> <harness...>
const fs = require('fs'), path = require('path');
const [wt, baseFile, ...harness] = process.argv.slice(2);
const base = fs.readFileSync(baseFile, 'utf8'), tip = fs.readFileSync(path.join(wt, 'app/core/panel.js'), 'utf8');
const count = (hay, s) => { let n = 0, i = 0; while ((i = hay.indexOf(s, i)) !== -1) { n++; i += s.length; } return n; };
const lits = (src) => { const out = []; const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\$]|\\.)*)`/g; let m; while ((m = re.exec(src))) { const raw = m[0]; try { const v = Function(`'use strict'; return ${raw}`)(); if (typeof v === 'string' && v.length >= 12) out.push(v); } catch (e) { /* not a plain literal */ } } return out; };
let checked = 0, bad = 0;
for (const h of harness) {
  const src = fs.readFileSync(path.join(wt, h), 'utf8');
  const seen = new Set();
  for (const v of lits(src)) {
    if (seen.has(v)) continue; seen.add(v);
    const b = count(base, v); if (b === 0) continue;
    const t = count(tip, v); checked++;
    if (b !== t || (b === 1 && t !== 1)) { bad++; console.log('MOVED', h, JSON.stringify(v.slice(0, 90)), 'base', b, 'tip', t); }
  }
  console.log(h, 'literals found in base panel.js:', [...seen].filter((v) => count(base, v) > 0).length, 'of which once at base:', [...seen].filter((v) => count(base, v) === 1).length);
}
console.log('checked', checked, 'changed count', bad);
