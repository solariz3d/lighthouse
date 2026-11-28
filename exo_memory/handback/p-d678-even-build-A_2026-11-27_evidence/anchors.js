// anchors.js <tree>: each mutant's anchor in test/core_even_mutation.test.js, counted in its file (must be exactly 1). Reads the MUTANTS array's TEXT; the harness is not required.
'use strict';
const fs = require('fs'), path = require('path');
const T = process.argv[2], src = fs.readFileSync(path.join(T, 'test/core_even_mutation.test.js'), 'utf8').replace(/\r\n/g, '\n');
const a = src.indexOf('const PCLT ='), b = src.indexOf('\nconst FILES');
const body = src.slice(a, b);
const MUTANTS = new Function("const EV = 'src/core/even.js', CS = 'app/core/coreshell.js', VI = 'src/validate/index.js', DOC = 'src/core/document.js';\n" + body + '\nreturn MUTANTS;')();
let bad = 0;
for (const m of MUTANTS) for (const [file, from] of m.edits) {
  const t = fs.readFileSync(path.join(T, file), 'utf8').replace(/\r\n/g, '\n'), n = t.split(from).length - 1;
  if (n !== 1) { bad++; console.log('NOT ONCE', n, m.id.slice(0, 40), file); }
}
console.log('mutants', MUTANTS.length, 'edits', MUTANTS.reduce((k, m) => k + m.edits.length, 0), 'not exactly once', bad);
console.log('ids', MUTANTS.map((m) => m.id.split(' ')[0]).join(' '));
