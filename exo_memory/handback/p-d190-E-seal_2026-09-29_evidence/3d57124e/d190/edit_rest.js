const fs = require('fs'), WT = process.argv[2];
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
// ── close.js: the cup is a seam channel only when the first and the last road pieces are both cup pieces ──────────────────────────
edit('src/core/close.js', [
  ["        if (prev >= 0 && i < 2) {",
   "        if (prev >= 0 && i < 2 && (ch !== 'c' || (doc.pieces[prev].cup && P.cup))) {   // the cup joins only cup to cup (a legacy piece's c is a placeholder)"],
  ["  for (const ch of ['kh', 'kv', 'w', 'r']) { r.push(L.channels[ch].at(-1) - F.channels[ch][0]); names.push(`${ch} value at the seam`); }\n  for (const ch of D.CHANNELS) {\n    const cl = L.channels[ch]",
   "  const cupBoth = !!(F.cup && L.cup);   // the cup continues round the seam only when both ends are cup pieces (a mixed seam is reported, not solved)\n  for (const ch of cupBoth ? ['kh', 'kv', 'w', 'r', 'c'] : ['kh', 'kv', 'w', 'r']) { r.push(L.channels[ch].at(-1) - F.channels[ch][0]); names.push(`${ch} value at the seam`); }\n  for (const ch of D.CHANNELS) {\n    if (ch === 'c' && !cupBoth) continue;\n    const cl = L.channels[ch]"],
  ["    for (const ch of ['kh', 'kv', 'w', 'r']) J.push(valueRow(ch, 'value'));\n    for (const ch of D.CHANNELS) J.push(valueRow(ch, 'slope'));",
   "    for (const ch of cupBoth ? ['kh', 'kv', 'w', 'r', 'c'] : ['kh', 'kv', 'w', 'r']) J.push(valueRow(ch, 'value'));\n    for (const ch of D.CHANNELS) { if (ch === 'c' && !cupBoth) continue; J.push(valueRow(ch, 'slope')); }"],
  ["  const edited = new Set(opts.edited || [roadIdx[roadIdx.length - 1]]),",
   "  const cupBoth = !!(doc.pieces[roadIdx[0]].cup && doc.pieces[roadIdx[roadIdx.length - 1]].cup);\n  const edited = new Set(opts.edited || [roadIdx[roadIdx.length - 1]]),"],
  ["  const out = freeze(D.checkDoc({ ...stored, closed: converged }));\n  return { doc: out, converged, iterations: it, turns: ms.turns, gapM: ms.gapM, tangentRad: ms.tangentRad,",
   "  const out = freeze(D.checkDoc({ ...stored, closed: converged }));\n  // a seam between a cup piece and a legacy one is not solved (the cup would have to move to a rendered edge): its step is reported\n  const endE = D.pieceEnd(stored.pieces[roadIdx[roadIdx.length - 1]]).c.v, startP = stored.pieces[roadIdx[0]];\n  const cupSeamStepDeg = cupBoth || !(startP.cup || stored.pieces[roadIdx[roadIdx.length - 1]].cup) ? 0 : Math.abs(endE - (startP.cup ? startP.channels.c[0] : D.legacyEdgeDeg(startP.family, startP.channels.w[0], startP.channels.r[0])));\n  return { doc: out, converged, iterations: it, turns: ms.turns, gapM: ms.gapM, tangentRad: ms.tangentRad, cupSeamStepDeg,"],
  ["    report: converged ? `closed in ${it} step(s): ${(ms.gapM * 1000).toFixed(3)} mm, tangent ${ms.tangentRad.toExponential(1)} rad`",
   "    report: converged ? `closed in ${it} step(s): ${(ms.gapM * 1000).toFixed(3)} mm, tangent ${ms.tangentRad.toExponential(1)} rad${cupSeamStepDeg > D.CUP_JOINT_DEG ? `; the cup steps ${cupSeamStepDeg.toFixed(2)}° at the seam (a cup meets a legacy piece there)` : ''}`"],
]);
// ── sculpt.js: a cup brush needs cup pieces ───────────────────────────────────────────────────────────────────────────────────────
edit('src/core/sculpt.js', [
  ["  const res = doc.pieces.map((P, p) => {\n    if (P.type !== 'road' || off[p] + P.length < s0 - rUsed || off[p] > s0 + rUsed) return null;\n    return brushControls(",
   "  const res = doc.pieces.map((P, p) => {\n    if (P.type !== 'road' || off[p] + P.length < s0 - rUsed || off[p] > s0 + rUsed) return null;\n    if (channel === 'c' && !P.cup) throw new D.CoreError('NOT_CUP', 'a cup brush reaches piece ' + P.id + ', which has no cup (a legacy piece renders the old profile): extend with a cup target first, or brush only cup pieces');\n    return brushControls("],
  ["    const linked = a >= 0 && !(doc.pieces.slice(a + 1, b).some((P) => P.type === 'flight') && (channel === 'kh' || channel === 'kv'));\n    if (!linked) {                                             // an unlinked start (the lap's first piece, or level after a flight)\n      if (a >= 0 && rb) {",
   "    const linked = a >= 0 && !(doc.pieces.slice(a + 1, b).some((P) => P.type === 'flight') && (channel === 'kh' || channel === 'kv')) && (channel !== 'c' || (doc.pieces[a].cup && Pb.cup));\n    if (!linked) {                                             // an unlinked start (the lap's first piece, or level after a flight)\n      if (channel === 'c' && a >= 0 && doc.pieces[a].cup && res[a]) { const Pa0 = doc.pieces[a], n0 = Pa0.channels.c.length; res[a].ctrl[n0 - 1] = Pa0.channels.c[n0 - 1]; res[a].ctrl[n0 - 2] = Pa0.channels.c[n0 - 2]; res[a].changed = res[a].changed.filter((i) => i < n0 - 2); }   // a cup piece before a legacy one keeps the edge it hands over\n      if (a >= 0 && rb) {"],
  ["  value: { channels: ['phi', 'w', 'r', 'h', 'l'], what: 'a value channel: bank, width, rise, height or lateral offset' },",
   "  value: { channels: ['phi', 'w', 'r', 'h', 'l', 'c'], what: 'a value channel: bank, width, rise, height, lateral offset or cup (cup pieces only)' },"],
]);
// ── readout.js: cupFromDeg and cupToDeg ─────────────────────────────────────────────────────────────────────────────────────────
edit('src/core/readout.js', [
  ["//   { type: 'road', id, lengthM, turnDeg, climbDeg, bankFromDeg, bankToDeg, pitchFromDeg, pitchToDeg, offsets }",
   "//   { type: 'road', id, lengthM, turnDeg, climbDeg, bankFromDeg, bankToDeg, cupFromDeg, cupToDeg, pitchFromDeg, pitchToDeg, offsets }"],
  ["//   piece's climb, a flight setting it to its landing pitch; pitchTo = pitchFrom + climb.\n",
   "//   piece's climb, a flight setting it to its landing pitch; pitchTo = pitchFrom + climb. cupFrom/To = the cup c(0) and c(L), degrees, of a\n//   CUP piece (D190); of a LEGACY piece the edge its road renders, profileAt(family, w, r) at each end (D.legacyEdgeDeg).\n"],
  ["//   { type: 'flight', id, lengthM, turnDeg: 0, climbDeg, bankFromDeg, bankToDeg, pitchFromDeg, pitchToDeg, offsets: null }",
   "//   { type: 'flight', id, lengthM, turnDeg: 0, climbDeg, bankFromDeg, bankToDeg, cupFromDeg, cupToDeg, pitchFromDeg, pitchToDeg, offsets: null }"],
  ["//   landing pitch − take-off pitch. The bank is carried through a jump.",
   "//   landing pitch − take-off pitch. The bank and the cup are carried through a jump."],
  ["    let bank = 0; for (let j = i - 1; j >= 0; j--) if (doc.pieces[j].type === 'road') { bank = D.pieceEnd(doc.pieces[j]).phi.v; break; }",
   "    let bank = 0, cupEnd = 0; for (let j = i - 1; j >= 0; j--) if (doc.pieces[j].type === 'road') { const e = D.pieceEnd(doc.pieces[j]); bank = e.phi.v; cupEnd = e.c.v; break; }"],
  ["climbDeg: (P.land - pose.p) * DEG, bankFromDeg: bank * DEG, bankToDeg: bank * DEG,\n",
   "climbDeg: (P.land - pose.p) * DEG, bankFromDeg: bank * DEG, bankToDeg: bank * DEG, cupFromDeg: cupEnd, cupToDeg: cupEnd,\n"],
  ["    bankFromDeg: D.channelAt(P, 'phi', 0).v * DEG, bankToDeg: D.channelAt(P, 'phi', P.length).v * DEG,\n",
   "    bankFromDeg: D.channelAt(P, 'phi', 0).v * DEG, bankToDeg: D.channelAt(P, 'phi', P.length).v * DEG,\n    cupFromDeg: P.cup ? D.channelAt(P, 'c', 0).v : D.legacyEdgeDeg(P.family, D.channelAt(P, 'w', 0).v, D.channelAt(P, 'r', 0).v),\n    cupToDeg: P.cup ? D.channelAt(P, 'c', P.length).v : D.legacyEdgeDeg(P.family, D.channelAt(P, 'w', P.length).v, D.channelAt(P, 'r', P.length).v),\n"],
]);
