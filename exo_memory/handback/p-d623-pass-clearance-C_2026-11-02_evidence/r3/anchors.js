// anchors.js <tree>: for app/test/mutation.test.js's rows, how many times each `from` appears in its file (the tree's own); prints the rows not exactly once
'use strict';
const fs = require('fs'), path = require('path'), T = process.argv[2];
const src = fs.readFileSync(path.join(T, 'app/test/mutation.test.js'), 'utf8').replace(/\r\n/g, '\n');
const a = src.indexOf('const MUTATIONS = ['), b = src.indexOf('\n];', a);
const MUT = eval('(' + src.slice(a + 'const MUTATIONS = '.length, b + 2) + ')');
let n = 0;
for (const m of MUT) {
  const f = m.root === 'scripts' ? path.join(T, 'scripts', m.file) : path.join(T, 'app', m.file);
  const t = fs.readFileSync(f, 'utf8'), c = t.split(m.from).length - 1;
  if (c !== 1) { n++; console.log(c, m.id, m.file); }
}
console.log('rows', MUT.length, 'not once', n);
