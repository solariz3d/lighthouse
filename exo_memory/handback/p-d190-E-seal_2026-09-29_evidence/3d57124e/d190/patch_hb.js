const fs = require('fs'), f = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d190-A_2026-09-29.md'; let s = fs.readFileSync(f, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor ' + a); s = s.replace(a, () => b); };
rep('`test/core_cup.test.js` (34 tests)', '`test/core_cup.test.js` (37 tests)');
rep('(these four exercise `cupRuns`)', '(M18–M20 exercise `cupRuns`)');
fs.writeFileSync(f, s); console.log('ok');
