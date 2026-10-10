const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 90)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/core/adapter.js', [
["function cupSegmentsRuns(P, n, at, join = null) {\n  const s = (j) => (P.length * j) / n, E = Array.from({ length: n + 1 }, (_, j) => at(s(j))), out = new Array(n);\n  const wTol = (w) => 1e-9 * Math.max(1, w), cTol = 1e-9;\n  let j = 0;\n  if (join) j = morphZone(P, n, E, s, join, out);   // the first metres of a cup that follows a legacy piece\n  while (j < n) {",
 "function cupSegmentsRuns(P, n, at, join = null, tail = null) {\n  const s = (j) => (P.length * j) / n, E = Array.from({ length: n + 1 }, (_, j) => at(s(j))), out = new Array(n);\n  const wTol = (w) => 1e-9 * Math.max(1, w), cTol = 1e-9;\n  let j = 0;\n  if (join) j = morphZone(P, n, E, s, join, out);   // the first metres of a cup that follows a legacy piece\n  const nr = tail ? tailZone(P, n, E, s, tail, out, j) : n;   // the last metres of a cup that closes onto a legacy start: the runs stop where the fade begins\n  while (j < nr) {"],
["    let k = j; while (k + 1 < n && Math.abs(E[k + 2].w - wRun) <= wTol(wRun)) k++;   // the run is segments j..k",
 "    let k = j; while (k + 1 < nr && Math.abs(E[k + 2].w - wRun) <= wTol(wRun)) k++;   // the run is segments j..k"],
["/**\n * The LOCAL cup segments (cupRuns: false)",
 `/**
 * THE MORPH INTO A LEGACY CROSS-SECTION (D190 round 3, R3): the mirror of morphZone, for a cup that CLOSES a lap onto a legacy start (the zip at
 * s = 0 joins the cup's last row to the legacy start's first row: B measured 23.2 mm on a 16 m bowl and 148.2 mm on a 24 m half-pipe where the r
 * cap binds). close() holds c at the seam to the legacy start's rendered edge, so the two shapes agree at the edge and differ inside the road; the
 * last metres of the cup (at least MORPH_M, from the last segment boundary at or before length − MORPH_M, and never into the head morph) fade
 * the difference d = T.psi − cupProfile(c end).psi in by smoothstep, and the width the same way: the last row IS the legacy start's first row.
 * T is that first row's profile (the legacy piece's first segment). Returns the index of the first segment of the zone (the runs stop there).
 */
function tailZone(P, n, E, s, T, out, jStart) {
  if (!T || !Array.isArray(T.psi)) return n;
  const Cend = cupProfile(P.family, E[n].w, E[n].c);
  if (T.psi.length !== Cend.psi.length || T.u.length !== Cend.u.length) return n;
  const dpsi = T.psi.map((x, i) => x - Cend.psi[i]), du = T.u.map((x, i) => x - Cend.u[i]);
  if (dpsi.every((x) => Math.abs(x) < 1e-9) && du.every((x) => Math.abs(x) < 1e-9)) return n;
  let m0 = n; while (m0 > jStart && s(m0) > P.length - MORPH_M + 1e-9) m0--;   // s(m0) <= length - MORPH_M (or the piece is too short: the zone is what is left after the head morph)
  m0 = Math.max(m0, jStart); if (m0 >= n) return n;
  const a0 = s(m0), Lz = P.length - a0, mu = (x) => smooth((x - a0) / Lz);
  const at = (j) => { const cw = cupProfile(P.family, E[j].w, E[j].c), m = mu(s(j)); return { font: cw.font, material: cw.material, u: cw.u.map((x, i) => x + m * du[i]), psi: cw.psi.map((x, i) => x + m * dpsi[i]) }; };
  for (let j = m0; j < n; j++) { const B = at(j + 1); out[j] = { profile: B, blend: { from: at(j), s0: 0, length: s(j + 1) - s(j) }, end: B }; }
  return m0;
}

/**
 * The LOCAL cup segments (cupRuns: false)`],
]);
