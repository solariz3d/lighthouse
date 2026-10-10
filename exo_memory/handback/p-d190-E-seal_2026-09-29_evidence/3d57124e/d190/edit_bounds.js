const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/document.js', [
  ["const CUP_MAX = 150, CUP_JOINT_DEG = 0.05;", "const CUP_MAX = 150, CUP_JOINT_DEG = 0.05, CUP_EPS = 1e-9;   // CUP_EPS: the float noise a solver leaves on a control point at a limit (close.js)"],
  ["if (P.cup && P.channels.c.some((v) => v < 0 || v > CUP_MAX))", "if (P.cup && P.channels.c.some((v) => v < -CUP_EPS || v > CUP_MAX + CUP_EPS))"],
]);
edit('src/core/extend.js', [
  ["  if (cup) piece.channels.c = piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x)));   // the fit's ringing never leaves [0, 150]",
   "  if (cup) {\n    const c = piece.channels.c = piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x))), n = c.length;   // the fit's ringing never leaves [0, 150]\n    // a cup that ends AT a limit ends flat, so the piece after it can continue C1 without a control point past the limit (its end slope was a rounding away from 0)\n    if (c[n - 1] <= 1e-3 || c[n - 1] >= D.CUP_MAX - 1e-3) c[n - 2] = c[n - 1];\n  }"],
]);
