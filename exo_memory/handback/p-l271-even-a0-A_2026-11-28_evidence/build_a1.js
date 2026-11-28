// build_a1.js (pane A, L271 "Amended 02:5x"): A1's reading, the fallback switch, the kept edge's move, and the words, applied to the worktree.
// usage: node build_a1.js <worktree> <B's even.js>
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.argv[2], BSRC = fs.readFileSync(process.argv[3], 'utf8');
function editor(rel) {
  const f = path.join(WT, rel); let s = fs.readFileSync(f, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
  const lf = s.replace(/\r\n/g, '\n');
  s = lf;
  return {
    rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor ${n}x: ${a.slice(0, 80)}`); s = s.replace(a, () => b); },
    save() { fs.writeFileSync(f, EOL === '\r\n' ? s.replace(/\n/g, '\r\n') : s); },
  };
}

// ── src/core/even.js ──
const E = editor('src/core/even.js');
E.rep("const HOLDS = Object.freeze(['left', 'right', 'centre']);\n", `const HOLDS = Object.freeze(['left', 'right', 'centre']);
// THE FALLBACK (L271, lighthouse exo_memory/loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md "Amended 02:5x"): what Even does with a kept edge where the
// window's ends do not support a reading of the road under it (readSupported). 'keep': the edge kept where it is now, at the new width (B's line, fitChannel; the
// hand-back's A1B). 'refuse': refused by name, EVEN_UNREAD, and nothing changed (A1R). Which is the keeper's call; until he answers it is unset (null), which refuses.
const EVEN_FALLBACK = null;
const FALLBACKS = Object.freeze(['keep', 'refuse']);
`);

E.rep(`/** The same, for the HELD RIM's reference: where the road is still changing at one window end and at rest at the other (the end lies in a taper the road
 *  had before any bump: an Extend easing from the empty track's head, say), the end at rest gives the value for the whole window, since the taper's value at
 *  the end is not the road the run sits on. Both at rest, or both changing: eased between them. L is the road's length (a window end at the track's end
 *  looks inward). */
const REST_SPAN_M = 10, REST_M = 1e-3;   // "changing": more than 1 mm over the 10 m beyond the end
const EVEN_AGREE_M = 0.01;   // the window's two ends read as one road within 1 cm (evenIn)
function moving(doc, off, ch, x, dir, L) {
  const y = x + dir * REST_SPAN_M, z = y < 0 || y > L ? x - dir * REST_SPAN_M : y;
  return Math.abs(valueAt(doc, off, ch, z) - valueAt(doc, off, ch, x)) > REST_M;
}
function restOf(doc, off, ch, win, L) {
  const x0 = win.w0, x1 = win.w1, ma = moving(doc, off, ch, x0, -1, L), mb = moving(doc, off, ch, x1, 1, L);
  if (ma === mb) return easeOf(doc, off, ch, win);
  const v = valueAt(doc, off, ch, ma ? x1 : x0);
  return () => v;
}
`, `/**
 * A1 (L271 item 1; lighthouse exo_memory/handback/p-l271-even-a0-A_2026-11-28.md, 1.1 to 1.3): the road before any grab, the HELD RIM's reference, read from the
 * window's two ends ONLY WHERE THE ENDS SUPPORT IT. The road before the grabs is not in the document, so no rule from the ends is right everywhere; this one keeps
 * A0's reading wherever it was exact and says where it has none. An end is AT REST when its value holds within 1 mm at 10, 20 and 30 m beyond it (A0 tested 10 m
 * only, and a grab centred just outside an end passed it); an end with no road at all beyond it (the track's start, its open end) is an EDGE; else MOVING. Per
 * channel (w, then l) the reading is supported when both ends are at rest and agree within 1 cm (eased between them), or when one end is at rest and the other
 * either heads toward its value over the 10 m inward (or is already within 1 mm of it) or is an edge within 1 cm of it (the value at rest, for the whole window).
 * Anything else: { ok: false, why }. STILL WRONG, SILENTLY, ON SOME ROADS: a road whose own width changes inside the run with no bump, read as above (the
 * hand-back's WC5, 1.47 m, and WC6, 2.92 m); so every Even says how far it moved the kept edge (keptMove), and none of it is silent.
 */
const REST_SPAN_M = 10, REST_M = 1e-3, REST_AT_M = Object.freeze([10, 20, 30]);   // "changing": more than 1 mm at 10, 20 or 30 m beyond the end
const EVEN_AGREE_M = 0.01;   // the window's two ends read as one road within 1 cm
function endState(doc, off, ch, x, dir, L) {
  const v = valueAt(doc, off, ch, x); let n = 0;
  for (const d of REST_AT_M) { const z = x + dir * d; if (z < 0 || z > L) continue; n++; if (Math.abs(valueAt(doc, off, ch, z) - v) > REST_M) return { kind: 'moving', v }; }
  return { kind: n ? 'rest' : 'edge', v };
}
const WHAT = { w: 'width', l: 'line' };
function readSupported(doc, off, win, L) {
  const x0 = win.w0, x1 = win.w1, fns = {};
  for (const ch of ['w', 'l']) {
    const a = endState(doc, off, ch, x0, -1, L), b = endState(doc, off, ch, x1, 1, L);
    let f = null, why = null;
    if (a.kind === 'rest' && b.kind === 'rest') {
      if (Math.abs(a.v - b.v) <= EVEN_AGREE_M) f = easeOf(doc, off, ch, win);
      else why = \`the road's \${WHAT[ch]} differs at the stretch's two ends\`;
    } else if (a.kind === 'rest' || b.kind === 'rest') {
      const [r, o, xo, dir] = a.kind === 'rest' ? [a, b, x1, 1] : [b, a, x0, -1];
      const inward = valueAt(doc, off, ch, Math.min(L, Math.max(0, xo - dir * REST_SPAN_M)));
      const ok = o.kind === 'edge' ? Math.abs(o.v - r.v) <= EVEN_AGREE_M : Math.abs(inward - r.v) <= Math.abs(o.v - r.v) + REST_M;
      if (ok) { const v = r.v; f = () => v; }
      else why = o.kind === 'edge' ? \`the stretch reaches the track's \${dir < 0 ? 'start' : 'open end'}, where the road's \${WHAT[ch]} is still changing\` : \`the road's \${WHAT[ch]} is changing away from the road at the stretch's other end\`;
    } else why = a.kind === 'edge' || b.kind === 'edge' ? \`the stretch reaches the track's \${a.kind === 'edge' ? 'start' : 'open end'}, and the road's \${WHAT[ch]} is still changing at its other end\` : \`the road's \${WHAT[ch]} is still changing at both ends of the stretch\`;
    if (!f) return { ok: false, why };
    fns[ch] = f;
  }
  return { ok: true, w: fns.w, l: fns.l };
}
/** The road read from the window's ends (readSupported) laid over the window: { ok, why, dStar, offS }. */
function refOf(doc, off, win, L) {
  const rd = readSupported(doc, off, win, L);
  if (!rd.ok) return { ok: false, why: rd.why };
  const dS = levelTo(doc, { w: rd.w, l: rd.l }, win);
  return { ok: true, why: null, dStar: dS, offS: SC.pieceOffsets(dS) };
}
const unreadRefusal = (hold, why) => refuse('EVEN_UNREAD', \`\${why}, so Even cannot read the road under it from its ends and cannot put the \${hold} edge back where the road had it: keep the middle instead, or pick a stretch whose ends lie on road no grab reaches\`);
`);

// B's one fit, copied whole from d678-even-b (its doc comment and the function)
const bi = BSRC.indexOf("/**\n * The window's control points of channel `ch` fitted by least squares"), bj = BSRC.indexOf('\n}\n', BSRC.indexOf('function fitChannel(', bi));
if (bi < 0 || bj < 0) throw new Error("B's fitChannel not found");
const FIT = BSRC.slice(bi, bj + 3).replace(' * B fits the sideways offset l with it (the kept edge) and then the height h (the plane of the road as built).\n',
  " * Copied whole from d678-even-b (B, D678 6.2). Here it fits only the sideways offset l, for the fallback 'keep' (EVEN_FALLBACK): the kept edge where it is now.\n");
if (FIT === BSRC.slice(bi, bj + 3)) throw new Error("B's fitChannel comment line not found");
E.rep("/**\n * The window's h control points fitted by least squares", FIT + "\n/**\n * The window's h control points fitted by least squares");

E.rep("function even(doc, { from, to, value, hold = 'centre', ramp = EVEN_RAMP_M, margin = EVEN_MARGIN_M } = {}) {",
  "function even(doc, { from, to, value, hold = 'centre', ramp = EVEN_RAMP_M, margin = EVEN_MARGIN_M, fallback = EVEN_FALLBACK } = {}) {");
E.rep("  if (!HOLDS.includes(hold)) refuse('EVEN_HOLD', `hold is one of ${HOLDS.join(', ')}, got ${hold}`);\n  const W = C.W;\n  return evenIn(C.doc, { off: W.off, L: W.L, lo: W.lo, hi: W.hi, win: W.win, w0: W.win.w0, w1: W.win.w1, value, hold, given: doc, memo: C.memo });\n}\n",
  `  if (!HOLDS.includes(hold)) refuse('EVEN_HOLD', \`hold is one of \${HOLDS.join(', ')}, got \${hold}\`);
  if (fallback !== null && !FALLBACKS.includes(fallback)) refuse('EVEN_FALLBACK', \`the fallback is one of \${FALLBACKS.join(', ')}, got \${fallback}\`);
  const W = C.W;
  return evenIn(C.doc, { off: W.off, L: W.L, lo: W.lo, hi: W.hi, win: W.win, w0: W.win.w0, w1: W.win.w1, value, hold, given: doc, memo: C.memo, fallback });
}

/**
 * Which reading Even will use for a run and a hold, with its refusals, before any width is given (the shell asks as a drag opens, so a stretch whose road cannot be
 * read is refused then, not at its first step): { reading: 'road' | 'kept' | 'centre', why }. Shares the drag's cut and memo (cutOf).
 */
function evenReading(doc, { from, to, hold = 'centre', ramp = EVEN_RAMP_M, margin = EVEN_MARGIN_M, fallback = EVEN_FALLBACK } = {}) {
  const C = cutOf(doc, { from, to, ramp, margin });
  if (!HOLDS.includes(hold)) refuse('EVEN_HOLD', \`hold is one of \${HOLDS.join(', ')}, got \${hold}\`);
  if (fallback !== null && !FALLBACKS.includes(fallback)) refuse('EVEN_FALLBACK', \`the fallback is one of \${FALLBACKS.join(', ')}, got \${fallback}\`);
  if (hold === 'centre') return { reading: 'centre', why: null };
  const W = C.W, f = () => refOf(C.doc, W.off, W.win, W.L);
  const ref = C.memo ? (C.memo.has('ref') ? C.memo.get('ref') : (C.memo.set('ref', f()), C.memo.get('ref'))) : f();
  if (!ref.ok && fallback !== 'keep') unreadRefusal(hold, ref.why);
  return { reading: ref.ok ? 'road' : 'kept', why: ref.why };
}
`);

E.rep("function evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold, given = doc, memo = null }) {",
  "function evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold, given = doc, memo = null, fallback = EVEN_FALLBACK }) {");
E.rep(`  let rim0 = null, rim1 = null, rimS = null, dStar = null, offS = null;
  if (side) {
    // the road before any grab or stroke, read from the window's two ends; where they disagree (the road's own width or offset changes across the window, a
    // 31 m straight into a 12 m turn) there is no one road to read back, and the held rim is held where it is now
    const ref = once('ref', () => {
      const rw = restOf(doc, off, 'w', win, L), rl = restOf(doc, off, 'l', win, L), one = [rw, rl].every((f) => Math.abs(f(w0) - f(w1)) <= EVEN_AGREE_M);
      const dS = one ? levelTo(doc, { w: rw, l: rl }, win) : doc;
      return { dStar: dS, offS: SC.pieceOffsets(dS) };
    });
    dStar = ref.dStar; offS = ref.offS;
    rim0 = once(\`rim0\${side}\`, () => rimReader(doc, side)); rim1 = rimReader(d1, side); rimS = once(\`rimS\${side}\`, () => rimReader(dStar, side));
  }
`, `  let rim0 = null, rim1 = null, rimS = null, dStar = null, offS = null, reading = 'centre', why = null;
  if (side) {
    // the road before any grab or stroke, read from the window's two ends where they support it (A1, readSupported); where they do not, the fallback (EVEN_FALLBACK):
    // 'keep' holds the edge where it is now, anything else refuses by name
    const ref = once('ref', () => refOf(doc, off, win, L));
    if (!ref.ok && fallback !== 'keep') unreadRefusal(hold, ref.why);
    reading = ref.ok ? 'road' : 'kept'; why = ref.why;
    rim0 = once(\`rim0\${side}\`, () => rimReader(doc, side)); rim1 = rimReader(d1, side);
    if (ref.ok) { dStar = ref.dStar; offS = ref.offS; rimS = once(\`rimS\${side}\`, () => rimReader(dStar, side)); }
  }
`);
E.rep(`      else {
        const s = Math.min(L, Math.max(0, sI)), F0 = rim0(s), F1 = rim1(s), lamStar = valueAt(dStar, offS, 'l', s) + rimS(s);`,
`      else if (reading === 'road') {
        const s = Math.min(L, Math.max(0, sI)), F0 = rim0(s), F1 = rim1(s), lamStar = valueAt(dStar, offS, 'l', s) + rimS(s);`);
E.rep("  const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL).pieces }));",
`  // the fallback 'keep': the kept edge where it is now at the new width, one least-squares fit over the whole window (B's line, D678 6.2)
  const resL2 = reading === 'kept' ? fitChannel(d1, 'l', (s) => { const x = Math.min(L, Math.max(0, s)); return valueAt(doc, off, 'l', x) + rim0(x) - rim1(x); }, win) : resL;
  const c1 = freeze(D.checkDoc({ ...d1, pieces: SC.settle(d1, 'l', resL2).pieces }));`);
E.rep(`  const changed = []; out.pieces.forEach((P, p) => { if (P !== given.pieces[p]) changed.push(p); });
  return { doc: out, changed, window: Object.freeze({ lo, hi, w0, w1 }), value, hold, shiftAt: shiftOf(doc, out, plan) };`,
`  const changed = []; out.pieces.forEach((P, p) => { if (P !== given.pieces[p]) changed.push(p); });
  // HOW FAR THE KEPT EDGE MOVED (L271 point 3: every Even says it): its largest move across the road, every 1 m over the window, the rim read on the
  // cross-sections. Computed when asked (the release's words), not at every step of a drag, since it reads the whole new document once. { m, at }.
  let kept = null;
  const keptMove = side ? () => {
    if (kept) return kept;
    const r = rimReader(out, side), offO = SC.pieceOffsets(out); let m = 0, at = lo;
    for (let s = Math.ceil(w0); s <= Math.floor(w1); s++) { const e = Math.abs(valueAt(out, offO, 'l', s) + r(s) - valueAt(doc, off, 'l', s) - rim0(s)); if (e > m) { m = e; at = s; } }
    return (kept = Object.freeze({ m, at }));
  } : null;
  // a bank anywhere in the window: the road read from the ends is the road "under the bank as Even finds it" (L271 point 4; call 11 keeps the bank as found)
  const banked = doc.pieces.some((P, p) => P.type === 'road' && off[p] + P.length >= w0 && off[p] <= w1 && (P.channels.phi || []).some((x) => Math.abs(x) > 1e-9));
  return { doc: out, changed, window: Object.freeze({ lo, hi, w0, w1 }), value, hold, shiftAt: shiftOf(doc, out, plan), reading, why, banked, keptMove };`);
E.rep("module.exports = { even, evenWindow, shiftOf, HOLDS, ", "module.exports = { even, evenWindow, evenReading, shiftOf, HOLDS, EVEN_FALLBACK, FALLBACKS, ");
E.rep("_internal: { weight, rimReader, levelTo, fitHeight, builtPhi, refineEnds, cutOf } };", "_internal: { weight, rimReader, levelTo, fitHeight, fitChannel, builtPhi, refineEnds, cutOf, readSupported, endState } };");
E.save();

// ── app/core/evenwords.js: the words ──
const W = editor('app/core/evenwords.js');
W.rep("  const where = res.hold === 'centre' ? 'the middle is laid smooth between the stretch\\'s ends, and both edges move' : `the ${res.hold} edge is laid where Even reads the road's own edge from the stretch's ends, so it can move`;",
`  const where = res.hold === 'centre' ? 'the middle is laid smooth between the stretch\\'s ends, and both edges move' : keptWords(res);`);
W.rep("function evenDone(res) {", `/**
 * What Even did with the kept edge, and how far it moved it (L271 point 3: a silent metre move is what that lap exists to stop). res.reading is 'road' (the road under
 * the stretch read from its ends, A1) or 'kept' (no reading: the edge kept where it is, the fallback 'keep'); the move is res.keptMove() (even.js) or, in the job, the
 * plain res.kept { m, at }. Throws on a result that carries neither: a sentence with no figure would be the silent move again.
 */
function keptWords(res) {
  const k = typeof res.keptMove === 'function' ? res.keptMove() : res.kept;
  if (!k || !Number.isFinite(k.m) || !(res.reading === 'road' || res.reading === 'kept')) throw new Error('Even\\'s words need the reading it used and how far the kept edge moved');
  const m = \`\${k.m.toFixed(2)} m\`;
  if (res.reading === 'kept') return \`the \${res.hold} edge is kept where it is (it moved \${m} at most), because Even could not read the road under the stretch from its ends: \${res.why}\`;
  return \`the \${res.hold} edge is put back where the road had it, read from the stretch's ends\${res.banked ? ' under the bank as Even finds it' : ''}: it moved \${m} across at most, at \${km(k.at)}\`;
}

function evenDone(res) {`);
W.rep("  const { before, after, window: win, value, hold } = req || {};", "  const { before, after, window: win, value, hold, reading, why, kept, banked } = req || {};");
W.rep("  return evenWords(before, { doc: after, window: win, value, hold, shiftAt: EV.shiftOf(before, after) }, { bounded: true });",
  "  return evenWords(before, { doc: after, window: win, value, hold, reading, why, kept, banked, shiftAt: EV.shiftOf(before, after) }, { bounded: true });");
W.save();

// ── app/core/coreshell.js ──
const S = editor('app/core/coreshell.js');
S.rep("    const req = Object.freeze({ before, after, window: res.window, value: res.value, hold: res.hold });",
  "    const req = Object.freeze({ before, after, window: res.window, value: res.value, hold: res.hold, reading: res.reading, why: res.why, banked: res.banked, kept: res.keptMove ? res.keptMove() : null });   // plain data for the job (L271: the words carry the reading and the kept edge's move)");
S.rep("    if (T.mode === 'even' && attempt(() => EV.evenWindow(d, run || { from: piece, to: piece })) === null) return st;",
  "    if (T.mode === 'even' && attempt(() => EV.evenWindow(d, run || { from: piece, to: piece })) === null) return st;\n    // and a stretch whose road Even cannot read from its ends, with an edge kept and no fallback set (L271, EVEN_UNREAD), is refused as the drag opens too\n    if (T.mode === 'even' && hold && hold !== 'centre' && attempt(() => EV.evenReading(d, { ...(run || { from: piece, to: piece }), hold })) === null) return st;");
S.save();
console.log('applied');
