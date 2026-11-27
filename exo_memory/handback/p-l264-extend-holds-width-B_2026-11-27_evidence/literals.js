// literals.js (pane B, L264): would any mutation harness's edit on a changed file stop applying? Every string literal (12+ characters) in every *mutation*.test.js
// that occurred EXACTLY once in the file at the base, counted again in the tree: any count not 1 is a mutant that no longer applies. usage:
// node literals.js <tree> <base sha> <changed file>...
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [tree, base, ...files] = process.argv.slice(2), T = path.resolve(tree);
const harn = ['test', 'app/test'].flatMap((d) => fs.readdirSync(path.join(T, d)).filter((f) => /mutation.*\.test\.js$/.test(f)).map((f) => path.join(d, f)));
const lit = /'((?:[^'\\\n]|\\.){12,})'|"((?:[^"\\\n]|\\.){12,})"|`((?:[^`\\$\n]|\\.){12,})`/g;
const unq = (s) => s.replace(/\\(.)/g, '$1');
let checked = 0; const bad = [];
for (const f of files) {
  const was = execFileSync('git', ['-C', T, 'show', `${base}:${f}`], { encoding: 'utf8', maxBuffer: 1 << 28 }).replace(/\r\n/g, '\n'), now = fs.readFileSync(path.join(T, f), 'utf8').replace(/\r\n/g, '\n');
  for (const h of harn) {
    const src = fs.readFileSync(path.join(T, h), 'utf8');
    for (const m of src.matchAll(lit)) {
      const s = unq(m[1] || m[2] || m[3]);
      if (was.split(s).length - 1 !== 1) continue;
      checked++; const n = now.split(s).length - 1;
      if (n !== 1) bad.push(`${h}: ${n} times now in ${f}: ${s.slice(0, 90)}`);
    }
  }
}
console.log(`harnesses ${harn.length}; literals that occurred once in the base's ${files.join(', ')}: ${checked}; not once now: ${bad.length}`);
for (const b of bad) console.log('  ' + b);
