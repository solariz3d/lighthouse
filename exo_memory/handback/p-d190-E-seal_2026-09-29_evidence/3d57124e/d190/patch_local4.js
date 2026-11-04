const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let s = fs.readFileSync(f, 'utf8');
const a = "(it was off by up to 0.95 deg on the local scheme)`, () => {`,"; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => "(it was off by up to 0.95 deg on the local scheme)`, () => {"); fs.writeFileSync(f, s); console.log('fixed');
