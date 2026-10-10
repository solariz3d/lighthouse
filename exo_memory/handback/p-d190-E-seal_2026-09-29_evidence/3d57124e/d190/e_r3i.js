const fs = require('fs');
function patch(f, pairs) { let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ' anchor: ' + a.slice(0, 90)); s = s.replace(a, () => b); } if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('patched', f); }
const W = 'C:/Users/nname/Desktop/a-d188-wt/';
{ const f = W + 'src/core/close.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  const i = s.indexOf("  let out;\n  try { out = freeze"), j = s.indexOf("  if (held && converged) {"); if (i < 0 || j < 0) throw new Error('close anchors');
  s = s.slice(0, i) + "  const out = freeze(D.checkDoc({ ...stored, closed: converged }));\n" + s.slice(j);
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('close.js catch removed'); }
{ const f = W + 'test/core_cup_mutation.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  const i = s.indexOf("  { id: 'M46 (R3)"), j = s.indexOf("  { id: 'M47 (R3)"); if (i < 0 || j < 0) throw new Error('M46');
  s = s.slice(0, i) + s.slice(j); if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('M46 removed'); }
patch(W + 'src/core/README.md', [["If the\n  cup cannot reach that edge inside the last piece without leaving [0, 150], or the piece is too short to fade, `close()` refuses by name (`CUP_SEAM`), and\n  never reports converged over a step.",
"A cup\n  piece that is followed by a legacy piece anywhere in the track (a loaded file can hold one) fades the same way. If the closing piece is too short to fade\n  (an 8 m cup piece straight after a legacy piece leaves the seam 148 mm on a 24 m half-pipe), `close()` refuses by name (`CUP_SEAM`), and never reports\n  converged over a step."]]);
patch(W + 'test/core_cup_seam.test.js', [["test('R3 (a) mirror: a lap that STARTS in a cup and ends on a legacy piece meets within 1 mm at the seam too (the cup start is held to the legacy end\'s rendered edge)', () => {", "XX"]]);
