const fs = require('fs'), WT = process.argv[2];
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/document.js', [
  // header
  ["// width w and the cross-section's rise rate r. Every road joint",
   "// width w, the cross-section's rise rate r and (D190) the CUP c, the cross-section's edge angle. Every road joint"],
  // schema, channels, dec
  ["// core/2 (D186) adds the OFFSET channels h and l; a core/1 file is read and upgraded with both at zero (parse).\nconst SCHEMA = 't180b.core/2', OLD_SCHEMAS = Object.freeze(['t180b.core/1']), GENERATOR = 't180-track-builder/core 0.2.0';",
   "// core/2 (D186) adds the OFFSET channels h and l; a core/1 file is read and upgraded with both at zero (parse).\n// core/3 (D190) adds the CUP channel c (degrees). A /1 or /2 road piece loads as a LEGACY piece: its cross-section is the old\n// profileAt(family, w, r), unchanged, and nothing of c reaches its render. A piece is a CUP piece only when P.cup is true, which is\n// written as a `c` array in its canonical text; a legacy piece's c is zeros in memory and absent in the text (src/core/README.md \"the cup\").\nconst SCHEMA = 't180b.core/3', OLD_SCHEMAS = Object.freeze(['t180b.core/1', 't180b.core/2']), GENERATOR = 't180-track-builder/core 0.3.0';"],
  ["const CHANNELS = Object.freeze(['kh', 'kv', 'phi', 'w', 'r', 'h', 'l']);",
   "const CHANNELS = Object.freeze(['kh', 'kv', 'phi', 'w', 'r', 'h', 'l', 'c']);\n// c is the cross-section's edge angle ψ at u = ±w/2, in DEGREES, in [0, CUP_MAX]. 150: the bowl's two walls touch at 159.681° (the D190 seal, V2)\nconst CUP_MAX = 150, CUP_JOINT_DEG = 0.05;"],
  ["const DEC = Object.freeze({ m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, h: 4, l: 4, rad: 9 });",
   "const DEC = Object.freeze({ m: 4, kh: 9, kv: 9, phi: 9, w: 4, r: 6, h: 4, l: 4, c: 6, rad: 9 });\nconst { FLOORS } = require('../geom/fonts.js');"],
  // pieceEnd: a legacy piece's c is its rendered end edge
  ["/** The end value and slope of every channel (ref 09 §1: c(L) = P_last, c′(L) = 3(P_last − P_prev)/(L − last interior knot)). */\nfunction pieceEnd(P) {\n  const h = P.length - (P.knots.length ? P.knots[P.knots.length - 1] : 0), out = {};\n  for (const ch of CHANNELS) { const c = P.channels[ch], n = c.length; out[ch] = { v: c[n - 1], m: (3 * (c[n - 1] - c[n - 2])) / h }; }\n  return out;\n}",
   "/**\n * The edge angle (degrees) the OLD profile renders at width w and rise rate r: the family's measured floor, each quarter's rise capped at\n * r·w/8 (ref 09 §3), the sum over the four quarters. Exactly adapter.js profileAt's arithmetic, for its last quarter (test: core_cup).\n */\nfunction legacyEdgeDeg(family, w, r) {\n  const F = FLOORS[family], quarter = w / 8; let prev = 0;\n  F.forEach((target, i) => { prev += Math.min(target - (i ? F[i - 1] : 0), Math.max(0, r) * quarter); });\n  return prev;\n}\n/** The end value and slope of every channel (ref 09 §1: c(L) = P_last, c′(L) = 3(P_last − P_prev)/(L − last interior knot)). A LEGACY piece's cup is the edge it renders (held, slope 0). */\nfunction pieceEnd(P) {\n  const h = P.length - (P.knots.length ? P.knots[P.knots.length - 1] : 0), out = {};\n  for (const ch of CHANNELS) { const c = P.channels[ch], n = c.length; out[ch] = { v: c[n - 1], m: (3 * (c[n - 1] - c[n - 2])) / h }; }\n  if (!P.cup) out.c = { v: legacyEdgeDeg(P.family, out.w.v, out.r.v), m: 0 };\n  return out;\n}\n/** True when the last road piece is a cup piece (a piece extended after it is one too). */\nfunction endIsCup(doc) { for (let i = doc.pieces.length - 1; i >= 0; i--) if (doc.pieces[i].type === 'road') return !!doc.pieces[i].cup; return false; }"],
  // roadPiece: the cup flag
  ["function roadPiece({ id, length, family = 'bowl', from = null, channels, knotM = KNOT_M, knots }) {",
   "function roadPiece({ id, length, family = 'bowl', from = null, channels, knotM = KNOT_M, knots, cup = false }) {"],
  ["    if (src === undefined && OFFSETS.includes(ch)) {",
   "    if (ch === 'c' && !cup) { out.c = new Array(K.length + 4).fill(0); continue; }   // a legacy piece: zeros, never rendered\n    if (src === undefined && OFFSETS.includes(ch)) {"],
  ["  return { id: id || null, type: 'road', length: L, family, knots: K, channels: out };\n}",
   "  const P = { id: id || null, type: 'road', length: L, family, knots: K, channels: out };\n  return cup ? { ...P, cup: true } : P;\n}"],
  // jointProblem
  ["function jointProblem(prevEnd, P) {\n  const h = P.knots.length ? P.knots[0] : P.length;\n  for (const ch of CHANNELS) {\n    const c = P.channels[ch],",
   "function jointProblem(prevEnd, P, prevCup = false) {\n  const h = P.knots.length ? P.knots[0] : P.length;\n  for (const ch of CHANNELS) {\n    if (ch === 'c') {   // cup ↔ cup: C1 like the others; legacy ↔ cup: the RENDERED edge must be continuous (0.05°); legacy ↔ legacy: nothing\n      if (prevCup && P.cup) { /* falls through to the general test */ }\n      else if (prevCup || P.cup) {\n        const here = P.cup ? P.channels.c[0] : legacyEdgeDeg(P.family, P.channels.w[0], P.channels.r[0]);\n        if (Math.abs(here - prevEnd.c.v) > CUP_JOINT_DEG) return `the cup starts at ${here}°, the previous piece ends at ${prevEnd.c.v}° (a legacy piece's cup is the edge it renders)`;\n        continue;\n      } else continue;\n    }\n    const c = P.channels[ch],"],
  ["      const p = jointProblem(want, P); if (p)", "      const p = jointProblem(want, P, !!prev.cup); if (p)"],
  // checkDoc: cup flag and bounds
  ["    for (const ch of CHANNELS) { const c = P.channels && P.channels[ch]; if (!Array.isArray(c) || c.length !== P.knots.length + 4 || !c.every(Number.isFinite)) bad(`${at}: channel ${ch} needs ${P.knots.length + 4} finite control points`); }",
   "    for (const ch of CHANNELS) { const c = P.channels && P.channels[ch]; if (!Array.isArray(c) || c.length !== P.knots.length + 4 || !c.every(Number.isFinite)) bad(`${at}: channel ${ch} needs ${P.knots.length + 4} finite control points`); }\n    if (P.cup !== undefined && P.cup !== true) bad(`${at}: cup is true on a cup piece and absent on a legacy piece, got ${P.cup}`);\n    // a cup piece's c stays in [0, CUP_MAX]: every control point is, so the curve is (its basis is non-negative and sums to 1: the convex hull, ref 03 §1b)\n    if (P.cup && P.channels.c.some((v) => v < 0 || v > CUP_MAX)) throw new CoreError('BAD_CUP', `${at}: the cup must stay within 0 to ${CUP_MAX}°, but a control point is ${Math.min(...P.channels.c)} to ${Math.max(...P.channels.c)}° (the walls of a ${CUP_MAX}°+ bowl touch)`);"],
  // canonical text
  ["  : JSON.stringify({ id: P.id, type: 'road', length: P.length, family: P.family, knots: P.knots, channels: Object.fromEntries(CHANNELS.map((ch) => [ch, P.channels[ch]])) }));",
   "  : JSON.stringify({ id: P.id, type: 'road', length: P.length, family: P.family, knots: P.knots, channels: Object.fromEntries(CHANNELS.filter((ch) => ch !== 'c' || P.cup).map((ch) => [ch, P.channels[ch]])) }));"],
  // parse: upgrades + cup
  ["  const upgrade = o.schema !== SCHEMA;   // a core/1 file has no offsets: they are zero, one per control point",
   "  const upgrade = o.schema === 't180b.core/1';   // a core/1 file has no offsets: they are zero, one per control point; core/1 and /2 have no cup: legacy pieces"],
  ["    : { id: P.id, type: P.type, length: q(P.length, DEC.m), family: P.family, knots: (P.knots || []).map((t) => q(t, DEC.m)),\n      channels: Object.fromEntries(CHANNELS.map((ch) => [ch, (upgrade && OFFSETS.includes(ch) ? new Array(((P.knots || []).length) + 4).fill(0) : ((P.channels || {})[ch] || [])).map((x) => q(x, DEC[ch]))])) }));",
   "    : cupOf(P, { id: P.id, type: P.type, length: q(P.length, DEC.m), family: P.family, knots: (P.knots || []).map((t) => q(t, DEC.m)),\n      channels: Object.fromEntries(CHANNELS.map((ch) => [ch, ((upgrade && OFFSETS.includes(ch)) || (ch === 'c' && !((P.channels || {}).c)) ? new Array(((P.knots || []).length) + 4).fill(0) : ((P.channels || {})[ch] || [])).map((x) => q(x, DEC[ch]))])) }));"],
  ["/** Parse a document; every number is quantised as it enters",
   "/** A road piece read from text is a cup piece exactly when its text carries a `c` array (the only way the canonical text says so). */\nfunction cupOf(P, out) { return P && P.channels && Array.isArray(P.channels.c) ? { ...out, cup: true } : out; }\n/** Parse a document; every number is quantised as it enters"],
  // exports
  ["  SCHEMA, OLD_SCHEMAS, CHANNELS, OFFSETS, FAMILIES, DEC, KNOT_M, CoreError,",
   "  SCHEMA, OLD_SCHEMAS, CHANNELS, OFFSETS, FAMILIES, DEC, KNOT_M, CUP_MAX, CUP_JOINT_DEG, legacyEdgeDeg, endIsCup, CoreError,"],
]);
