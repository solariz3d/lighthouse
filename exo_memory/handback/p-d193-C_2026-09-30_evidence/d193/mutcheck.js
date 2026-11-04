// every mutant's `from` string must occur exactly once in its file (what "applied" means), read without running any mutant
const fs = require('fs'), path = require('path'), WT = 'C:/Users/nname/Desktop/c-d193-wt';
for (const f of ['app/test/core-mutation.test.js', 'app/test/mutation.test.js']) {
  if (!fs.existsSync(path.join(WT, f))) continue;
  const src = fs.readFileSync(path.join(WT, f), 'utf8');
  const m = src.match(/const MUTATIONS = \[[\s\S]*?\n\];/); if (!m) { console.log(f, 'no MUTATIONS'); continue; }
  const MUT = eval(m[0].replace('const MUTATIONS = ', '(').replace(/;$/, '') + ')');
  let bad = 0, n = 0;
  for (const x of MUT) { if (!/core\/(panel|coreshell)\.js$/.test(x.file)) continue; n++; const t = fs.readFileSync(path.join(WT, x.root || 'app', x.file), 'utf8').replace(/\r\n/g, '\n'); const c = t.split(x.from).length - 1; if (c !== 1) { bad++; console.log('  NOT 1:', x.id, 'count', c); } }
  console.log(f, 'mutants on panel/coreshell:', n, 'not applicable:', bad);
}
