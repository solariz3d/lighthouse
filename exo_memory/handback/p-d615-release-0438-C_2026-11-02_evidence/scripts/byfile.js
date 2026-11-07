// byfile.js <tap> <test file>...: each file's own top-level test titles (test('…' / "…" / `…`), found in the TAP as ok / not ok / missing
'use strict';
const fs = require('fs');
const tap = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/), res = new Map();
for (const l of tap) { const m = /^(ok|not ok) \d+ - (.*?)(?: # (?:SKIP|TODO).*)?$/.exec(l); if (m) res.set(m[2], m[1]); }
for (const f of process.argv.slice(3)) {
  const s = fs.readFileSync(f, 'utf8'), titles = [];
  for (const m of s.matchAll(/^test\((['"`])((?:\\.|(?!\1).)*)\1/gm)) titles.push(m[2].replace(/\\(['"`\\])/g, '$1'));
  let ok = 0, bad = 0, miss = 0;
  for (const t of titles) { const r = res.get(t) || (t.includes('${') ? [...res.keys()].some((k) => k.startsWith(t.split('${')[0])) && 'ok' : undefined); if (r === 'ok') ok++; else if (r === 'not ok') bad++; else miss++; }
  console.log(`${f}: ${titles.length} titles; ok ${ok}, not ok ${bad}, not matched ${miss}`);
}
