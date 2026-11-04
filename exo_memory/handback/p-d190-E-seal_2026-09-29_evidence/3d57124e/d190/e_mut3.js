const fs = require('fs'); const W = 'C:/Users/nname/Desktop/a-d188-wt/';
function patch(f, pairs) { let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ' anchor: ' + a.slice(0, 90)); s = s.replace(a, () => b); } if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('patched', f); }
patch(W + 'test/core_cup_seam.test.js', [["test('R3 (c): validation reds a lap seam", `test('R3 (b): a closing cup piece too short to fade (8 m, straight after a legacy piece) is REFUSED by name with the seam\'s real step (B: 148.2 mm half-pipe 24, 23.2 mm bowl 16), never closed over it; at 12 m it closes and the seam is matched', () => {
  const build = (fam, w, len) => { let d = extend(D.createDoc('short'), { length: 300, family: fam, first: { w } }); const edge = D.legacyEdgeDeg(fam, w, D.channelAt(d.pieces[0], 'r', 300).v);
    for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / Rr } }); return extend(d, { length: len, transition: Math.min(6, len), targets: { kh: 0, c: edge } }); };
  for (const [fam, w, mm] of [['half-pipe', 24, 148.2], ['bowl', 16, 23.2]]) {
    assert.throws(() => closed(build(fam, w, 8)), (e) => e.code === 'CUP_SEAM' && new RegExp(String(mm).replace('.', '\\.')).test(e.message), \`\${fam}: not refused by name with the step\`);
    const r = closed(build(fam, w, 12)); assert.equal(r.converged, true, r.report); assert.ok(seamMm(r.doc) <= 1, \`\${fam}: 12 m closes but the seam is \${seamMm(r.doc)} mm\`);
  }
});
test('R3 (c): validation reds a lap seam`]]);
patch(W + 'test/core_cup_mutation.test.js', [
["for (const t of ['core_cup.test.js', 'core_cup_readers.test.js']) fs.copyFileSync", "for (const t of ['core_cup.test.js', 'core_cup_readers.test.js', 'core_cup_seam.test.js']) fs.copyFileSync"],
["try { for (const f of ['core_cup.test.js', 'core_cup_readers.test.js']) {", "try { for (const f of ['core_cup.test.js', 'core_cup_readers.test.js', 'core_cup_seam.test.js']) {"],
["const r = runTests(dir, m.pattern, m.file === 'readers' ? 'core_cup_readers.test.js' : 'core_cup.test.js');", "const r = runTests(dir, m.pattern, m.file === 'readers' ? 'core_cup_readers.test.js' : m.file === 'seam' ? 'core_cup_seam.test.js' : 'core_cup.test.js');"],
["  // row 5: legacy stays legacy", `  // R3: the cup -> legacy lap seam (round 3)
  { id: 'M41 (R3) no reverse morph: a cup that closes onto a legacy start is drawn to its own shape', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'const nr = tail ? tailZone(P, n, E, s, tail, out, j) : n;', 'const nr = n;']] },
  { id: 'M42 (R3) the reverse morph never fades in (the tail keeps the cup shape)', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'mu = (x) => smooth((x - a0) / Lz);', 'mu = (x) => 0;']] },
  { id: 'M43 (R3) the reverse morph carries no difference (the legacy shape is dropped)', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'psi: cw.psi.map((x, i) => x + m * dpsi[i]) }; };\n  for (let j = m0', 'psi: cw.psi }; };\n  for (let j = m0']] },
  { id: 'M44 (R3) close() does not hold the cup at the legacy start\'s edge', file: 'seam', pattern: 'R3', edits: [[C + 'close.js', 'if (!!F.cup === !!L.cup) return null;', 'return null;']] },
  { id: 'M45 (R3) close() never refuses a seam it cannot fade', file: 'seam', pattern: 'R3', edits: [[C + 'close.js', 'if (lap && lap.m > SEAM_MAX_M) throw', 'if (false) throw']] },
  { id: 'M46 (R3) close() lets a cup that leaves [0, 150] out of the seam hold through as a plain error', file: 'seam', pattern: 'R3', edits: [[C + 'close.js', "if (held && e instanceof D.CoreError && e.code === 'BAD_CUP') throw", "if (false) throw"]] },
  { id: 'M47 (R3) the mirror: a cup START does not fade out of the legacy END', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'if (seam && pi === firstRoad && P.cup) join =', 'if (false) join =']] },
  { id: 'M48 (R3) validation does not red a joint step', file: 'seam', pattern: 'R3', edits: [['validate/index.js', "if (jointStep.has(j)) raw.segReds.push", "if (false) raw.segReds.push"]] },
  { id: 'M49 (R3) jointSteps ignores the lap seam', file: 'seam', pattern: 'R3', edits: [['geom/profile.js', 'if (closed && segments.length > 1 && road(a)', 'if (false && segments.length > 1 && road(a)']] },
  // row 5: legacy stays legacy`]]);
