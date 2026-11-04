const fs = require('fs'), WT = process.argv[2];
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/extend.js', [
  ["//   extend(doc, { length, transition, targets: { kh, kv, phi, w, r }, family, knotM })  -> a new document, one piece longer",
   "//   extend(doc, { length, transition, targets: { kh, kv, phi, w, r, c }, family, knotM })  -> a new document, one piece longer"],
  ["// m, r in °/m. A channel with no target continues.",
   "// m, r in °/m, c (the CUP, D190) in degrees, 0 to 150. A channel with no target continues. A piece is a CUP piece when a c target is\n// given, or when it is extended after a cup piece (the cup then continues like any channel); otherwise it is a LEGACY piece, rendered by\n// the old profileAt, unchanged. The first piece of a track takes a cup with first: { c }; a cup that follows a legacy piece starts at the\n// edge that piece renders (D.pieceEnd), held. The fit of a short transition can ring past its target (measured: 174.65° for a 150° target\n// over 10 m), so the cup's control points are clamped to [0, 150] after the fit: the document never holds a cup outside that range."],
  ["  const Lt = transition === undefined ? length : transition;",
   "  if (targets.c !== undefined && targets.c !== null && !(Number.isFinite(targets.c) && targets.c >= 0 && targets.c <= D.CUP_MAX)) throw new D.CoreError('BAD_CUP', 'the cup target must be from 0 to ' + D.CUP_MAX + ' degrees, got ' + targets.c);\n  const Lt = transition === undefined ? length : transition;"],
  ["  let from = D.endState(doc), held = true;\n  if (!from) {",
   "  let from = D.endState(doc), held = true;\n  const cup = (targets.c !== undefined && targets.c !== null) || D.endIsCup(doc) || (!from && !!first && first.c !== undefined);\n  if (!from) {"],
  ["  const channels = Object.fromEntries(D.CHANNELS.map((ch) => [ch, channelFn(from[ch], targets[ch], Lt)]));\n  return D.appendPiece(doc, D.roadPiece({ length, family: fam, from: held ? from : null, channels, knotM }));",
   "  const channels = Object.fromEntries(D.CHANNELS.map((ch) => [ch, channelFn(from[ch], targets[ch], Lt)]));\n  const piece = D.roadPiece({ length, family: fam, from: held ? from : null, channels, knotM, cup });\n  if (cup) piece.channels.c = piece.channels.c.map((x) => Math.min(D.CUP_MAX, Math.max(0, x)));   // the fit's ringing never leaves [0, 150]\n  return D.appendPiece(doc, piece);"],
]);
edit('src/core/extend.js', [
  ["    const f = { kh: 0, kv: 0, phi: 0, w: WIDTHS[fam], r: RATES[fam], h: 0, l: 0, ...(first || {}) };\n",
   "    const f = { kh: 0, kv: 0, phi: 0, w: WIDTHS[fam], r: RATES[fam], h: 0, l: 0, ...(first || {}) };\n    if (f.c === undefined) f.c = D.legacyEdgeDeg(fam, f.w, f.r);   // a cup asked for on an empty track starts at the edge the family renders\n"],
]);
