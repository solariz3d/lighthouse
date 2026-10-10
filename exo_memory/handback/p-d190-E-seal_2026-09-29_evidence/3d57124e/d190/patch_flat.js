const fs = require('fs');
function patch(f, pairs) { let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ' anchor: ' + a.slice(0, 70)); s = s.replace(a, () => b); } if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('patched', f); }
const W = 'C:/Users/nname/Desktop/a-d188-wt/';
patch(W + 'src/core/adapter.js', [
  ["const CFLAT_DEG = 1e-3;", "const CFLAT_DEG = 0.02;"],
  ["Where neither c nor the width moves by more than CFLAT_DEG (the fit's ringing decays for a long way\n * after a transition, so c is never exactly constant)", "Where neither c nor the width moves by more than CFLAT_DEG = 0.02° (the fit's ringing decays for\n * about a hundred metres after a transition, so c is never exactly constant)"],
]);
patch(W + 'src/core/README.md', [["Where c and the width stay within 0.001° of one anchor the", "Where c and the width stay within 0.02° of one anchor the"]]);
patch(W + 'test/core_cup.test.js', [
  ["test('row 1b: the default scheme emits a seam zip where c changes and NONE where it does not (measured, and the reason cupRuns exists): the 200 m piece\\'s constant tail has none', () => {\n  let d = extend(D.createDoc('r'), { length: 60 }); d = extend(d, { length: 200, transition: 40, targets: { c: 90 } });",
   "test('row 1b: the default scheme emits a seam zip where c changes and NONE where it is held (measured, and the reason cupRuns exists): the last 100 m of a 400 m piece has none', () => {\n  let d = extend(D.createDoc('r'), { length: 60 }); d = extend(d, { length: 400, transition: 40, targets: { c: 90 } });"],
  ["tail = idx.filter((k) => k > idx[0] + 25);", "tail = idx.filter((k) => k > idx[0] + 150);"],
]);
