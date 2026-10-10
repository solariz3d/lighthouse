const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let s = fs.readFileSync(f, 'utf8');
const a = "  const d = extend(D.createDoc('m'), { length: 50, first: { c: 100 } }), P = d.pieces[0];\n  const bad = { ...d, pieces: [{ ...P, channels: { ...P.channels, c: P.channels.c.map(() => 165) } }] };";
const b = "  const d = extend(D.createDoc('m'), { length: 50, first: { c: 100 } }), P0 = d.pieces[0];\n  const bad = { ...d, pieces: [{ ...P0, channels: { ...P0.channels, c: P0.channels.c.map(() => 165) } }] };";
if (s.split(a).length !== 2) throw new Error('anchor'); s = s.replace(a, () => b); fs.writeFileSync(f, s); console.log('fixed');
