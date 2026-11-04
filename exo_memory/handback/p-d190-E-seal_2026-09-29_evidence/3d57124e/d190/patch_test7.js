const fs = require('fs');
function patch(f, pairs) { let s = fs.readFileSync(f, 'utf8'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ' anchor: ' + a.slice(0, 70)); s = s.replace(a, () => b); } fs.writeFileSync(f, s); console.log('patched', f); }
patch('C:/Users/nname/Desktop/a-d188-wt/test/core_cup_export.test.js', [
  ["/** The seal's lap: an uncupped start straight, four turns at cup c, a closing straight back to the edge the start renders. */",
   "/** The seal's lap: an uncupped start straight, four turns at cup c (the last turn's first 40 m return the cup to the edge the start renders, so the grid's straight is uncupped), a closing straight. */"],
  ["  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c } });\n  d = extend(d, { length: 60, transition: 40, targets: { kh: 0, c: cupStart ? c : edge } });",
   "  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr, c: i === 3 && !cupStart ? edge : c } });\n  d = extend(d, { length: 60, transition: 40, targets: { kh: 0, c: cupStart ? c : edge } });"],
  ["a closed lap whose four turns carry a cup of 90° and of 150° (the start straight left uncupped, the last straight\n// ramping back to the edge the start renders)", "a closed lap whose turns carry a cup of 90° and of 150° (the start straight left uncupped, the last turn's first 40 m\n// returning the cup to the edge the start renders)"],
]);
patch('C:/Users/nname/Desktop/a-d188-wt/test/core_cup_mutation.test.js', [
  ["'if (P.cup && P.channels.c.some((v) => v < 0 || v > CUP_MAX))', 'if (false)'", "'if (P.cup && P.channels.c.some((v) => v < -CUP_EPS || v > CUP_MAX + CUP_EPS))', 'if (false)'"],
  ["'if (cup) piece.channels.c = piece.channels.c.map(', 'if (false) piece.channels.c = piece.channels.c.map('", "'const c = piece.channels.c = piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x))), n = c.length;', 'const c = piece.channels.c, n = c.length;'"],
]);
