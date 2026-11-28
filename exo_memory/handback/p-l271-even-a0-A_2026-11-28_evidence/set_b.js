// set_b.js (pane A, L271, his "B" at 03:41): Even's fallback is A1B, and A1R is TAKEN OUT (no switch, no EVEN_UNREAD, no open-time reading). Also the harness's
// three anchors item 2 moved (H9, X1m, X5m). usage: node set_b.js <worktree>
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.argv[2];
function editor(rel) {
  const f = path.join(WT, rel); const raw = fs.readFileSync(f, 'utf8'); const crlf = raw.includes('\r\n'); let s = raw.replace(/\r\n/g, '\n');
  return {
    rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor ${n}x: ${a.slice(0, 90)}`); s = s.replace(a, () => b); },
    all(a, b) { const n = s.split(a).length - 1; if (n < 1) throw new Error(`${rel}: none of: ${a.slice(0, 60)}`); s = s.split(a).join(b); return n; },
    line(re) { const m = s.match(re); if (!m) throw new Error(`${rel}: no line ${re}`); return m[0]; },
    has(a) { return s.includes(a); },
    save() { fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s); },
  };
}
const HIS = 'his "B" at 03:41 (lighthouse exo_memory/briefs/t180_sculpt_even.md:106)';

// ── src/core/even.js ──
const E = editor('src/core/even.js');
E.rep(`// THE FALLBACK (L271, lighthouse exo_memory/loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md "Amended 02:5x"): what Even does with a kept edge where the
// window's ends do not support a reading of the road under it (readSupported). 'keep': the edge kept where it is now, at the new width (B's line, fitChannel; the
// hand-back's A1B). 'refuse': refused by name, EVEN_UNREAD, and nothing changed (A1R). Which is the keeper's call; until he answers it is unset (null), which refuses.
const EVEN_FALLBACK = null;
const FALLBACKS = Object.freeze(['keep', 'refuse']);
`, `// THE FALLBACK (L271; ${HIS}): where the window's ends do not support a reading of the road under the stretch (readSupported), the kept edge is kept where it
// is now, at the new width: B's line, one least-squares fit over the window (fitChannel; the hand-back's A1B), and the words say so. A1R, a refusal by name, was
// built behind a switch for his answer and taken out with it: no stretch is refused for the road under it.
`);
E.rep("const unreadRefusal = (hold, why) => refuse('EVEN_UNREAD', `${why}, so Even cannot read the road under it from its ends and cannot put the ${hold} edge back where the road had it: keep the middle instead, or pick a stretch whose ends lie on road no grab reaches`);\n", '');
E.rep(" * Returns { doc, changed (piece indices), window { lo, hi, w0, w1 } (lap distance), value, hold, shiftAt (s -> the centre's move across the road, in its built plane, m) }.",
  " * Returns { doc, changed (piece indices), window { lo, hi, w0, w1 } (lap distance), value, hold, shiftAt (s -> the centre's move across the road, in its built plane, m),\n * reading ('road', 'kept' or 'centre'), why (no reading: the reason), banked, keptMove (() -> { m, at }: the kept edge's largest move, or null) }.");
E.rep("function even(doc, { from, to, value, hold = 'centre', ramp = EVEN_RAMP_M, margin = EVEN_MARGIN_M, fallback = EVEN_FALLBACK } = {}) {", "function even(doc, { from, to, value, hold = 'centre', ramp = EVEN_RAMP_M, margin = EVEN_MARGIN_M } = {}) {");
E.rep("  if (fallback !== null && !FALLBACKS.includes(fallback)) refuse('EVEN_FALLBACK', `the fallback is one of ${FALLBACKS.join(', ')}, got ${fallback}`);\n  const W = C.W;\n  return evenIn(C.doc, { off: W.off, L: W.L, lo: W.lo, hi: W.hi, win: W.win, w0: W.win.w0, w1: W.win.w1, value, hold, given: doc, memo: C.memo, fallback });",
  "  const W = C.W;\n  return evenIn(C.doc, { off: W.off, L: W.L, lo: W.lo, hi: W.hi, win: W.win, w0: W.win.w0, w1: W.win.w1, value, hold, given: doc, memo: C.memo });");
E.rep(`/**
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

`, '');
E.rep("function evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold, given = doc, memo = null, fallback = EVEN_FALLBACK }) {", "function evenIn(doc, { off, L, lo, hi, win, w0, w1, value, hold, given = doc, memo = null }) {");
E.rep(`    // the road before any grab or stroke, read from the window's two ends where they support it (A1, readSupported); where they do not, the fallback (EVEN_FALLBACK):
    // 'keep' holds the edge where it is now, anything else refuses by name
    const ref = once('ref', () => refOf(doc, off, win, L));
    if (!ref.ok && fallback !== 'keep') unreadRefusal(hold, ref.why);
`, `    // the road before any grab or stroke, read from the window's two ends where they support it (A1, readSupported); where they do not, the edge is kept where it
    // is now (A1B, his "B"; fitChannel below)
    const ref = once('ref', () => refOf(doc, off, win, L));
`);
E.rep("  // the fallback 'keep': the kept edge where it is now at the new width, one least-squares fit over the whole window (B's line, D678 6.2)",
  "  // no reading (A1B, his \"B\"): the kept edge where it is now at the new width, one least-squares fit over the whole window (B's line, D678 6.2)");
E.rep(" * Copied whole from d678-even-b (B, D678 6.2). Here it fits only the sideways offset l, for the fallback 'keep' (EVEN_FALLBACK): the kept edge where it is now.",
  " * Copied whole from d678-even-b (B, D678 6.2). Here it fits only the sideways offset l, where Even has no reading (A1B): the kept edge where it is now.");
E.rep(`, read only WHERE THE ENDS SUPPORT IT (readSupported, L271's A1); where they do not, the
//     switch EVEN_FALLBACK says what happens (unset: refused by name, EVEN_UNREAD), read from`, `, read only WHERE THE ENDS SUPPORT IT (readSupported, L271's A1); where they do not, the
//     rim is held where it is now (A1B, his "B"; fitChannel), read from`);
E.rep("module.exports = { even, evenWindow, evenReading, shiftOf, HOLDS, EVEN_FALLBACK, FALLBACKS, ", "module.exports = { even, evenWindow, shiftOf, HOLDS, ");
for (const gone of ['EVEN_FALLBACK', 'FALLBACKS', 'unreadRefusal', 'evenReading', 'EVEN_UNREAD', 'fallback']) if (E.has(gone)) throw new Error(`even.js still names ${gone}`);
E.save();

// ── app/core/coreshell.js: the open-time reading goes (nothing to refuse there now) ──
const S = editor('app/core/coreshell.js');
S.rep("\n    // and a stretch whose road Even cannot read from its ends, with an edge kept and no fallback set (L271, EVEN_UNREAD), is refused as the drag opens too\n    if (T.mode === 'even' && hold && hold !== 'centre' && attempt(() => EV.evenReading(d, { ...(run || { from: piece, to: piece }), hold })) === null) return st;", '');
S.save();

// ── app/core/evenwords.js, app/core/panel.js: the words for A1B ──
const W = editor('app/core/evenwords.js');
W.rep("or 'kept' (no reading: the edge kept where it is, the fallback 'keep')", "or 'kept' (no reading: the edge kept where it is, A1B, his \"B\")");
W.rep("or, with the fallback 'keep',\n * kept where it is;", "or, where they do not (A1B),\n * kept where it is;");
W.save();
const P = editor('app/core/panel.js');
P.rep("(where Even cannot read them, it says so), and the message says how far it moved;", "(where Even cannot read them, that edge is kept where it is), and the message says which, and how far it moved;");
P.rep("(where it cannot read them it says so, and the message says how far that edge moved)", "(where it cannot read them, that edge is kept where it is; the message says which, and how far that edge moved)");
P.save();

// ── test/core_even.test.js ──
const C = editor('test/core_even.test.js');
C.rep(`// AMENDED BY NAME (L271, "Amended 02:5x"; the hand-back p-l271-even-a0-A_2026-11-28.md 1.3, its WC1): with A1 this road's ends do not support a reading, so the
// rim is held where it is now only with the fallback 'keep' (measured 0.0043 m, so the bar is 0.01 m, was 0.1 m for A0's 0.077), and with the switch unset Even
// refuses it by name (EVEN_UNREAD) and changes nothing.
test('where the road\\'s own width changes across the window (a 31 m straight into a 12 m turn), the held rim is held where it is now with the fallback \\'keep\\', not read back from the window\\'s ends, and refused by name with the switch unset', () => {`,
`// AMENDED BY NAME (L271; the hand-back p-l271-even-a0-A_2026-11-28.md 1.3, its WC1, and ${HIS}): with A1 this road's ends do not support a
// reading, so the rim is held where it is now, B's line (measured 0.0043 m, so the bar is 0.01 m, was 0.1 m for A0's 0.077), and Even says it kept it.
test('where the road\\'s own width changes across the window (a 31 m straight into a 12 m turn), the held rim is held where it is now (A1B), not read back from the window\\'s ends', () => {`);
C.rep(`  if (EV.EVEN_FALLBACK === 'keep') assert.equal(EV.even(d, { from: 1, to: 4, value: 16, hold: 'left' }).reading, 'kept', 'the switch at \\'keep\\': kept');
  else assert.throws(() => EV.even(d, { from: 1, to: 4, value: 16, hold: 'left' }), refusedAs('EVEN_UNREAD'), 'the switch unset: refused by name');
`, "  assert.equal(r.reading, 'kept', 'no reading: the edge kept');\n");
C.rep(`// AMENDED BY NAME (L271, "Amended 02:5x"): these rows measure the height, the outside and the joints, not the reading. After a grab at 470 the window's far end
// (490) sits on the grab, so A1 does not read the road there and, with the switch unset, refuses by name; the rows run with the fallback 'keep' named, which
// reads the road where the ends support it (485, and 175 with 465) and keeps the edge where they do not (470), and the refusal is asserted beside them.
`, `// L271: these rows measure the height, the outside and the joints, not the reading. After a grab at 470 the window's far end (490) sits on the grab, so A1 does
// not read the road there and keeps the edge where it is (A1B); after 485, and 175 with 465, it reads the road.
`);
C.rep("    if (grabs[0] === 470 && EV.EVEN_FALLBACK !== 'keep') assert.throws(() => EV.even(st, { ...F.runPieces(st), value: 16, hold: 'left' }), refusedAs('EVEN_UNREAD'), 'the switch unset: refused by name');\n", '');
C.rep(`// 1.3): A1, the road under the stretch read from the window's ends ONLY where they support it; the switch EVEN_FALLBACK for where they do not ('keep': the edge
// where it is now, B's line; 'refuse'; unset until the keeper chooses, which refuses); how far the kept edge moved (keptMove); the banked claim ("under the bank as
// Even finds it").`, `// 1.3): A1, the road under the stretch read from the window's ends ONLY where they support it; where they do not, the edge kept where it is now, B's line
// (A1B, ${HIS}; A1R, a refusal, is not built); how far the kept edge moved (keptMove); the banked claim ("under the bank as Even finds it").`);
C.rep(`// THE SWITCH BOTH WAYS: the rows below that depend on EVEN_FALLBACK read it, and test/core_even_mutation.test.js runs them with it set in every copy
// (EVEN_FALLBACK_RUN=keep); A1-1 pins it to what the run set, so a build that sets it without saying so fails here
test('A1-1: the fallback switch is unset (null) until the keeper chooses (or what EVEN_FALLBACK_RUN set); a fallback Even does not know is refused by name', () => {
  assert.equal(EV.EVEN_FALLBACK, process.env.EVEN_FALLBACK_RUN || null);
  assert.deepEqual([...EV.FALLBACKS], ['keep', 'refuse']);
  const base = F.fixture('flat');
  assert.throws(() => EV.even(base, { ...F.runPieces(base), value: 16, hold: 'left', fallback: 'guess' }), refusedAs('EVEN_FALLBACK'));
});

for (const fallback of EV.EVEN_FALLBACK === 'keep' ? ['refuse'] : [undefined, 'refuse']) {
  test(\`A1-2: a run from the track's start with an edge kept, the fallback \${fallback === undefined ? 'unset' : "'refuse'"}: refused by name (EVEN_UNREAD), nothing changed (A0 put the edge 9.31 m off, silently)\`, () => {
    const base = F.fixture('flat'), before = D.serialize(base);
    for (const hold of ['left', 'right']) assert.throws(() => EV.even(base, { from: 0, to: 1, value: 16, hold, ...(fallback ? { fallback } : {}) }), refusedAs('EVEN_UNREAD'), hold);
    assert.throws(() => EV.evenReading(base, { from: 0, to: 1, hold: 'left', ...(fallback ? { fallback } : {}) }), refusedAs('EVEN_UNREAD'), 'and asked before any width');
    assert.equal(D.serialize(base), before);
  });
}

test("A1-3: the same run with the fallback 'keep': Even says it kept the edge, and the edge is where it was within 0.01 m over the run", () => {`,
`test('A1-1: no stretch is refused for the road under it (A1R is not built): from the track\\'s start, a width stepping inside the run, and a window end on a grab, the edge is kept and Even says so', async () => {
  const sh = await F.shellOn(F.fixture('B-')); F.grab(sh, 470, 16); const g = F.present(sh);
  for (const [id, d, run] of [['start', F.fixture('flat'), { from: 0, to: 1 }], ['WC3', wc3(), { from: 1, to: 4 }], ['B- a grab at 470', g, F.runPieces(g)]]) {
    for (const hold of ['left', 'right']) {
      const r = EV.even(d, { ...run, value: 16, hold });
      assert.equal(r.reading, 'kept', \`\${id} \${hold}\`); assert.ok(typeof r.why === 'string' && r.why.length > 0, \`\${id} \${hold}: the reason\`);
    }
  }
});

test('A1-3: a run from the track\\'s start (A0: 9.31 m off, silently): Even says it kept the edge, and the edge is where it was within 0.01 m over the run', () => {`);
C.rep("    const r = EV.even(base, { from: 0, to: 1, value: 16, hold, fallback: 'keep' });\n    assert.equal(r.reading, 'kept', hold);\n    assert.deepEqual(EV.evenReading(base, { from: 0, to: 1, hold, fallback: 'keep' }).reading, 'kept');",
  "    const r = EV.even(base, { from: 0, to: 1, value: 16, hold });\n    assert.equal(r.reading, 'kept', hold);");
C.rep(`test("A1-4: a road whose own width steps inside the run (WC3, no grab): refused by name with the switch unset; with 'keep' the edge stays within 0.01 m (A0: 2.92 m off, silently)", () => {`,
  "test('A1-4: a road whose own width steps inside the run (WC3, no grab): the edge stays within 0.01 m (A0: 2.92 m off, silently)', () => {");
C.rep("  if (EV.EVEN_FALLBACK !== 'keep') assert.throws(() => EV.even(d, { ...run, value: 16, hold: 'left' }), refusedAs('EVEN_UNREAD'));\n  else assert.equal(EV.even(d, { ...run, value: 16, hold: 'left' }).reading, 'kept');\n", '');
C.rep("  assert.equal(EV.evenReading(base, { from: 0, to: 1, hold: 'centre' }).reading, 'centre');\n", '');
C.rep("test(\"A1-8: the middle kept ('centre') reads nothing and is never refused for its ends: a run from the track's start is levelled\", () => {",
  "test(\"A1-8: the middle kept ('centre') reads nothing: a run from the track's start is levelled, with no kept edge to measure\", () => {");
C.all(", fallback: 'keep' }", ' }');
for (const gone of ['EVEN_FALLBACK', 'FALLBACKS', 'evenReading', 'EVEN_UNREAD', 'fallback:']) if (C.has(gone)) throw new Error(`core_even.test.js still names ${gone}`);
C.save();

// ── app/test/sculpt-even.test.js: U1 becomes the kept edge through the shell ──
const U = editor('app/test/sculpt-even.test.js');
U.rep("const F = require('../../test/even_fixtures.js');\nconst EV = require('../../src/core/even.js');", "const F = require('../../test/even_fixtures.js');");
U.rep(`// L271 ("Amended 02:5x"): a stretch whose road Even cannot read from its ends, with an edge kept and the switch unset, is refused by name as the drag opens and
// when the width is typed, and nothing changes (the hand-back p-l271-even-a0-A_2026-11-28.md 1.3: a run from the track's start, A0 9.31 m off)
test('U1: a run from the track\\'s start with an edge kept is refused by name (EVEN_UNREAD) as the drag opens and when typed, and nothing changes', async () => {
  const base = F.fixture('flat'), sh = await F.shellOn(base);
  sh.selectPiece(0); sh.selectPiece(1, { extend: true });
  sh.beginSculpt({ tool: 'even', hold: 'left' });
  if (EV.EVEN_FALLBACK === 'keep') {   // the switch both ways: at 'keep' the drag opens and the typed width keeps the edge, said
    assert.ok(sh.getState().brush, 'the drag opened'); sh.endSculpt();
    sh.evenRun({ value: '16', hold: 'right' });
    assert.match(msg(sh), /the right edge is kept where it is \\(it moved 0\\.0\\d m at most\\)/); sh.undo();
  } else {
    assert.match(msg(sh), /^EVEN_UNREAD: /); assert.equal(sh.getState().brush, null, 'no drag opened'); assert.equal(F.present(sh), base);
    sh.evenRun({ value: '16', hold: 'right' });
    assert.match(msg(sh), /^EVEN_UNREAD: /); assert.equal(F.present(sh), base);
  }
  sh.evenRun({ value: '16', hold: 'centre' });
  assert.match(msg(sh), /^Even: 16 m wide/, 'the middle kept is levelled');
});`, `// L271 (${HIS}): a stretch whose road Even cannot read from its ends keeps the edge where it is (A1B), through the shell as in the core, and the
// message says so (the hand-back p-l271-even-a0-A_2026-11-28.md 1.3: a run from the track's start, where A0 put the edge 9.31 m off, silently)
test('U1: a run from the track\\'s start with an edge kept: the drag opens, and the typed width keeps the edge where it is, said', async () => {
  const base = F.fixture('flat'), sh = await F.shellOn(base);
  sh.selectPiece(0); sh.selectPiece(1, { extend: true });
  sh.beginSculpt({ tool: 'even', hold: 'left' });
  assert.ok(sh.getState().brush, 'the drag opened'); sh.endSculpt();
  sh.evenRun({ value: '16', hold: 'right' });
  assert.match(msg(sh), /the right edge is kept where it is \\(it moved 0\\.0\\d m at most\\), because Even could not read the road under the stretch from its ends: /);
});`);
if (U.has('EVEN_UNREAD') || U.has('EVEN_FALLBACK')) throw new Error('sculpt-even.test.js still names the switch');
U.save();

// ── app/test/sculpt-even-sentence.test.js: W6 needs no option now ──
const N = editor('app/test/sculpt-even-sentence.test.js');
N.rep("the fallback 'keep' says it kept the edge and why", "where there is no reading (A1B) the words say it kept the edge and why");
N.rep("test(\"W6: with the fallback 'keep', the words say the edge was kept where it is, how far it moved, and why the road could not be read\", () => {\n  const base = F.fixture('flat'), r = EV.even(base, { from: 0, to: 1, value: 16, hold: 'left', fallback: 'keep' });",
  "test('W6: where Even has no reading (A1B), the words say the edge was kept where it is, how far it moved, and why the road could not be read', () => {\n  const base = F.fixture('flat'), r = EV.even(base, { from: 0, to: 1, value: 16, hold: 'left' });");
N.rep("  // AMENDED BY NAME (L271): from the track's start with an edge kept Even now refuses (EVEN_UNREAD, U1), so the window's words are read with the middle kept\n  assert.match(await said(base, { from: 0, to: 1 }, 'centre'),",
  "  // AMENDED BY NAME (L271): read with the middle kept, so the window's words are tested apart from the kept edge's (from the track's start that edge is kept, U1)\n  assert.match(await said(base, { from: 0, to: 1 }, 'centre'),");
N.save();

// ── test/core_even_mutation.test.js ──
const M = editor('test/core_even_mutation.test.js');
M.rep(`// THE SWITCH BOTH WAYS (L271, "Amended 02:5x"): EVEN_FALLBACK_RUN=keep (or refuse) sets src/core/even.js's EVEN_FALLBACK in every copy, the control's too, and the
// inner runs see the same variable (A1-1 pins the switch to it). Unset, the copies are the source as it is.
const RUN_FALLBACK = process.env.EVEN_FALLBACK_RUN || null;
if (RUN_FALLBACK !== null && !['keep', 'refuse'].includes(RUN_FALLBACK)) throw new Error(\`EVEN_FALLBACK_RUN is keep or refuse, got \${RUN_FALLBACK}\`);
function setSwitch(dir) {
  if (RUN_FALLBACK === null) return;
  const f = path.join(dir, EV), src = fs.readFileSync(f, 'utf8').replace(/\\r\\n/g, '\\n'), from = 'const EVEN_FALLBACK = null;', n = src.split(from).length - 1;
  if (n !== 1) throw new Error(\`the switch's line occurs \${n} times in \${EV}\`);
  fs.writeFileSync(f, src.replace(from, \`const EVEN_FALLBACK = '\${RUN_FALLBACK}';\`));
}
`, '');
M.rep('  setSwitch(dir);\n', '');
M.rep(M.line(/^  \{ id: 'H9 [^\n]*\n/m), "  // H9 AMENDED BY NAME (L271): A0's agree rule is gone; the same fault on A1's line (two ends at rest read back however far apart they are)\n  { id: 'H9 the held rim is read back from the window\\'s ends even where they disagree (the road\\'s own width changing across the window)', pattern: 'A1-1|A1-4', edits: [[EV, 'if (Math.abs(a.v - b.v) <= EVEN_AGREE_M) f = easeOf(doc, off, ch, win);', 'f = easeOf(doc, off, ch, win);']] },\n");
M.rep(M.line(/^  \{ id: 'A1m4 [^\n]*\n/m), '');
M.rep(M.line(/^  \{ id: 'A1m5 [^\n]*\n/m), '');
M.rep(M.line(/^  \{ id: 'A1m9 [^\n]*\n/m), '');
M.rep("pattern: 'A1-2|A1-3', edits: [[EV, \"const ok = o.kind === 'edge'", "pattern: 'A1-1|A1-3', edits: [[EV, \"const ok = o.kind === 'edge'");
M.rep("{ id: 'X1m the knots over the window\\'s reaches are not cut', pattern: 'X1|X3', edits: [[EV, 'const cut = refineEnds(doc, off, L, lo, hi, margin + ramp);', 'const cut = doc;']] },",
  "{ id: 'X1m the knots over the window\\'s reaches are not cut', pattern: 'X1|X3', edits: [[EV, 'const cut0 = refineEnds(doc, off, L, lo, hi, margin + ramp), cut = cut0 === doc ? doc : freeze(cut0);', 'const cut0 = doc, cut = doc;']] },   // AMENDED BY NAME (L271: item 2 moved the line into cutOf)");
M.rep("{ id: 'X5m the window is not taken again on the cut track (the carry side still reaches back)', pattern: 'coarse knots', edits: [[EV, 'const W = cut === doc ? W0 : evenWindow(cut, { from, to, ramp, margin });', 'const W = W0;']] },",
  "{ id: 'X5m the window is not taken again on the cut track (the carry side still reaches back)', pattern: 'coarse knots', edits: [[EV, 'W: cut === doc ? W0 : evenWindow(cut, { from, to, ramp, margin })', 'W: W0']] },   // AMENDED BY NAME (L271: item 2 moved the line into cutOf)");
M.rep("  // L271 \"Amended 02:5x\": A1's reading, the fallback, the kept edge's move and the banked claim, in the core and the words",
  "  // L271: A1's reading, its fallback A1B (his \"B\"), the kept edge's move and the banked claim, in the core and the words");
for (const gone of ['EVEN_FALLBACK', 'setSwitch', 'evenReading']) if (M.has(gone)) throw new Error(`the harness still names ${gone}`);
M.save();
console.log('A1B set; A1R taken out');
