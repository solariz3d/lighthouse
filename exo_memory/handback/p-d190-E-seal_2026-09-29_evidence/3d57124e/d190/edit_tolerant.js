const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/document.js', [
  // channelAt: a legacy piece built without a c array reads zeros
  ["function channelAt(P, ch, s) {\n  const b = basis(knotVector(P), Math.min(Math.max(s, 0), P.length)), c = P.channels[ch];",
   "function channelAt(P, ch, s) {\n  const c = P.channels[ch];\n  if (c === undefined && ch === 'c' && !P.cup) return { v: 0, d1: 0, d2: 0 };   // a legacy piece may be built without a c array (its c is never rendered)\n  const b = basis(knotVector(P), Math.min(Math.max(s, 0), P.length));"],
  // pieceEnd
  ["  for (const ch of CHANNELS) { const c = P.channels[ch], n = c.length; out[ch] = { v: c[n - 1], m: (3 * (c[n - 1] - c[n - 2])) / h }; }\n  if (!P.cup) out.c",
   "  for (const ch of CHANNELS) { const c = P.channels[ch]; if (c === undefined && ch === 'c' && !P.cup) continue; const n = c.length; out[ch] = { v: c[n - 1], m: (3 * (c[n - 1] - c[n - 2])) / h }; }\n  if (!P.cup) out.c"],
  // checkDoc: a legacy piece may omit c
  ["    for (const ch of CHANNELS) { const c = P.channels && P.channels[ch]; if (!Array.isArray(c)",
   "    for (const ch of CHANNELS) { const c = P.channels && P.channels[ch]; if (ch === 'c' && c === undefined && !P.cup) continue; if (!Array.isArray(c)"],
  // insertKnot
  ["  for (const ch of CHANNELS) {\n    const Q = boehm(U, P.channels[ch], tq);",
   "  for (const ch of CHANNELS) {\n    if (ch === 'c' && P.channels.c === undefined && !P.cup) continue;\n    const Q = boehm(U, P.channels[ch], tq);"],
  // fillCup + export
  ["/** True when the last road piece is a cup piece",
   "/** The document with every legacy road piece that was built without a c array given zeros for it (the same object when none was). */\nfunction fillCup(doc) {\n  if (!doc.pieces.some((P) => P.type === 'road' && P.channels && P.channels.c === undefined && !P.cup)) return doc;\n  return { ...doc, pieces: doc.pieces.map((P) => (P.type === 'road' && P.channels && P.channels.c === undefined && !P.cup ? { ...P, channels: { ...P.channels, c: new Array(P.knots.length + 4).fill(0) } } : P)) };\n}\n/** True when the last road piece is a cup piece"],
  ["CUP_MAX, CUP_JOINT_DEG, legacyEdgeDeg, endIsCup,", "CUP_MAX, CUP_JOINT_DEG, legacyEdgeDeg, endIsCup, fillCup,"],
]);
edit('src/core/close.js', [
  ["function close(doc, opts = {}) {\n  D.checkDoc(doc);", "function close(doc, opts = {}) {\n  D.checkDoc(doc); doc = D.fillCup(doc);"],
]);
