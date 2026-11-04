const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let s = fs.readFileSync(f, 'utf8');
const a = 'have = A.profileOf ? A.profileOf(g, g.length) : g.profile;';
if (s.split(a).length !== 2) throw new Error('anchor'); s = s.replace(a, () => 'have = PF.atSegment ? PF.atSegment(g, g.length) : PF.normalize(g.profile);');
fs.writeFileSync(f, s); console.log('fixed');
