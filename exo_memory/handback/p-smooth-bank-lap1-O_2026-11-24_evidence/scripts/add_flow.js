// one-off: add the flowing bank to the branch's src/core/extend.js (run once, from the branch worktree)
const fs = require('fs'), f = 'src/core/extend.js'; let t = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const rep = (a, b) => { if (t.split(a).length !== 2) throw new Error('not once: ' + a.slice(0, 80)); t = t.replace(a, b); };
rep(`function extend(doc, opts = {}) {
  let { length,`, `/**
 * THE FLOWING BANK (bankShape 'flow', with through: { phi: [{ at, target }, …] }; the keeper, 2026-11-24 02:46: "lets try improve the track builder so it can do those type
 * of smooth banked turns"; plan: lighthouse exo_memory/loop/plan_t180_smooth_banked_turns_2026-11-24.md, Part 2). Every other bank this file lays starts and ends each ramp
 * at REST (S′ = S″ = 0 at both ends: the first ramp, each change, each second bank), so a roll laid as a chain of changes halts at every mark, and a car feels each halt as
 * a step in the roll (measured on the flow lap: nine halts on one piece the checker passed clean, since it reads the roll over a 20 m chord). A flowing bank is one curve
 * over the piece: it starts at the piece before it (value, slope, and curvature 0), passes the first target at its transition (or at the piece's end) and each \`through\`
 * mark exactly, and arrives at the last of them at REST, holding it to the piece's end. Between the marks it is the curve of least bending, ∫ (φ″² + FLOW_TENSION·φ′²) ds,
 * which carries the roll across a mark instead of stopping it there: the least-bending curve through given points is the cubic spline with its knots at those points, so a
 * knot is inserted at each mark that has none within FLOW_SNAP_M (document.js insertKnots, Boehm: every other channel keeps its curve). Solved once, as a KKT system
 * (piecewise.cjs denseSolve: the bending's Gram matrix, read by 3-point Gauss per span, exact for these polynomials, with the marks and the start's curvature as constraints).
 * C2 at both of the piece's ends, so the next piece, which continues value and slope by a line, meets it C2 (test/core_bank_flow.test.js).
 */
const FLOW_SNAP_M = 1;   // a mark with a knot nearer than this is not given its own (marks are KNOT_GAP_M apart, so the knot of the last mark always lies after the mark before it)
const FLOW_TENSION = 0;   // λ in ∫ (φ″² + λ·φ′²), 1/m²: the plan's way out if a monotone run overshoots (row 5); 0 is the curve of least bending alone
const GAUSS3 = [[-Math.sqrt(0.6), 5 / 9], [0, 8 / 9], [Math.sqrt(0.6), 5 / 9]];
/** The flowing bank's marks, checked (BAD_SECOND, by name): the first target at its transition, then each through mark, strictly after it by KNOT_GAP_M, inside the piece. */
function flowMarks(list, first, length) {
  if (list === undefined || list === null) return [first];
  if (!Array.isArray(list)) throw new D.CoreError('BAD_SECOND', \`through.phi is a list of { at, target }, got \${typeof list}\`);
  const out = [first];
  list.forEach((it, k) => {
    const { at, target } = it || {}, prev = out[out.length - 1];
    if (!Number.isFinite(at) || !Number.isFinite(target)) throw new D.CoreError('BAD_SECOND', \`the bank's mark \${k + 1}: its at (m) and its target (rad) must each be a finite number, got \${at} and \${target}\`);
    if (!(at > prev.at)) throw new D.CoreError('BAD_SECOND', \`the bank's mark \${k + 1} at \${at} m must come after the one before it (\${prev.at} m)\`);
    if (at - prev.at < KNOT_GAP_M - 1e-9) throw new D.CoreError('BAD_SECOND', \`the bank's mark \${k + 1} at \${at} m is under \${KNOT_GAP_M} m after the one before it (\${prev.at} m)\`);
    if (at > length + 1e-9) throw new D.CoreError('BAD_SECOND', \`the bank's mark \${k + 1} at \${at} m is past the piece's length (\${length} m)\`);
    out.push({ at, target });
  });
  return out;
}
/** The flowing bank laid on \`piece\` (the piece as laid, every other channel final): knots at the marks, then the bank's control points solved. Returns the new piece. */
function flowBank(piece, marks, v0, m0) {
  const near = (P, s) => P.knots.some((h) => Math.abs(h - s) < FLOW_SNAP_M);
  const ins = [...new Set(marks.map((m) => +m.at.toFixed(4)).filter((s) => s > 0.5 && s < piece.length - 0.5 && !near(piece, s)))].sort((a, b) => a - b);
  const P = D.insertKnots(piece, ins), U = D.knotVector(P), L = P.length, n = P.channels.phi.length, dec = D.DEC.phi;
  const last = marks[marks.length - 1], anchor = last.at >= L - 0.5 ? L : P.knots.reduce((a, h) => (Math.abs(h - last.at) < Math.abs(a - last.at) ? h : a), L);
  // fixed: the joint's two (the head's value and slope continued) and every point whose support reaches past the anchor (the hold), with the last three always
  const fixed = new Map([[0, v0], [1, v0 + (m0 * U[4]) / 3]]);
  for (let i = 2; i < n; i++) if (U[i + 4] > anchor + 1e-9 || i >= n - 3) fixed.set(i, last.target);
  const free = []; for (let i = 0; i < n; i++) if (!fixed.has(i)) free.push(i);
  const pos = new Map(free.map((i, k) => [i, k])), nf = free.length;
  // the bending's Gram matrix over [0, anchor] (the hold adds nothing), 3-point Gauss per span: φ″ is linear and φ′ quadratic on a span, so both squares are read exactly
  const Q = Array.from({ length: n }, () => new Float64Array(n));
  for (let k = 3; k < n; k++) {
    const a = U[k], b = Math.min(U[k + 1], anchor); if (!(b > a)) continue;
    for (const [x, w] of GAUSS3) {
      const s = (a + b) / 2 + ((b - a) / 2) * x, B = basis(U, s), W = (w * (b - a)) / 2;
      for (let p = 0; p < 4; p++) for (let q = 0; q < 4; q++) Q[B.first + p][B.first + q] += W * (B.D2[p] * B.D2[q] + FLOW_TENSION * B.D1[p] * B.D1[q]);
    }
  }
  // the constraints, each a row over all n points: curvature 0 at the start, and each mark before the last passed exactly
  const rows = [];
  { const B = basis(U, 0), r = new Float64Array(n); for (let p = 0; p < 4; p++) r[B.first + p] = B.D2[p]; rows.push({ r, d: 0 }); }
  for (const m of marks.slice(0, -1)) { const B = basis(U, Math.min(m.at, L)), r = new Float64Array(n); for (let p = 0; p < 4; p++) r[B.first + p] = B.N[p]; rows.push({ r, d: m.target }); }
  const live = rows.filter(({ r }) => free.some((i) => Math.abs(r[i]) > 0));
  const nc = live.length, A = Array.from({ length: nf + nc }, () => new Array(nf + nc).fill(0)), rhs = new Array(nf + nc).fill(0);
  for (const i of free) {
    const a = pos.get(i); for (const j of free) A[a][pos.get(j)] = Q[i][j];
    for (const [j, c] of fixed) rhs[a] -= Q[i][j] * c;
  }
  live.forEach(({ r, d }, c) => {
    let v = d; for (const [j, x] of fixed) v -= r[j] * x;
    for (const i of free) { A[nf + c][pos.get(i)] = r[i]; A[pos.get(i)][nf + c] = r[i]; }
    rhs[nf + c] = v;
  });
  const x = nf + nc ? denseSolve(A, rhs) : [];
  const C = new Array(n);
  for (let i = 0; i < n; i++) C[i] = Number((fixed.has(i) ? fixed.get(i) : x[pos.get(i)]).toFixed(dec)) + 0;
  return { ...P, channels: { ...P.channels, phi: C } };
}

function extend(doc, opts = {}) {
  let { length,`);
rep(`  if (bankShape !== undefined && bankShape !== null && bankShape !== 'rounded' && bankShape !== 'swell' && !isShares(bankShape)) throw new D.CoreError('BAD_SHAPE', \`bankShape is 'rounded', 'swell', { rise, fall } or left out, got \${bankShape}\`);`,
`  if (bankShape !== undefined && bankShape !== null && bankShape !== 'rounded' && bankShape !== 'swell' && bankShape !== 'flow' && !isShares(bankShape)) throw new D.CoreError('BAD_SHAPE', \`bankShape is 'rounded', 'swell', 'flow', { rise, fall } or left out, got \${bankShape}\`);
  // THE FLOWING BANK (flowBank, above): through marks only on the bank, only with bankShape 'flow', never with the bank's changes, and after a first target
  const through = opts.through === undefined || opts.through === null ? null : opts.through, flow = bankShape === 'flow';
  if (through !== null) {
    if (typeof through !== 'object' || Array.isArray(through)) throw new D.CoreError('BAD_TARGET', \`through maps the bank (phi) to its marks, got \${through}\`);
    const other = Object.keys(through).find((k) => k !== 'phi'); if (other) throw new D.CoreError('BAD_TARGET', \`through is for the bank only (phi), got "\${other}"\`);
    if (through.phi !== undefined && !flow) throw new D.CoreError('BAD_TARGET', \`through marks the bank's flowing curve: it needs bankShape 'flow', got \${bankShape}\`);
  }
  if (flow) {
    if (!(targets && Number.isFinite(targets.phi))) throw new D.CoreError('BAD_TARGET', "bankShape 'flow' passes the bank through its marks from a first target: give targets.phi (and its transition)");
    if ((changes && changes.phi !== undefined && changes.phi !== null) || (second && second.phi !== undefined && second.phi !== null)) throw new D.CoreError('BAD_TARGET', "a flowing bank's marks are its through list: give through or the bank's changes, one or the other");
  }`);
rep(`  const shape = bankShape === 'rounded' || bankShape === 'swell' || isShares(bankShape) ? bankShape : null;`,
`  const shape = bankShape === 'rounded' || bankShape === 'swell' || isShares(bankShape) ? bankShape : null;   // 'flow' is laid as a plain bank first, then solved (flowBank)`);
rep(`  if (opts.bankCheck !== false) bankAsBuilt(doc, laid, deferred);`,
`  if (flow) {   // the first target's mark is its transition (the piece's end when it has none); the marks are checked before anything is solved
    const marks = flowMarks(through && through.phi, { at: Lof('phi'), target: targets.phi }, length);
    laid = flowBank(laid, marks, from.phi.v, held ? from.phi.m : 0);
  }
  if (opts.bankCheck !== false) bankAsBuilt(doc, laid, deferred);`);
rep(`const D = require('./document.js');\n`, `const D = require('./document.js');\nconst { basis, denseSolve } = require('../../tools/piecewise.cjs');\n`);
fs.writeFileSync(f, t.replace(/\n/g, '\r\n'));
console.log('ok');
