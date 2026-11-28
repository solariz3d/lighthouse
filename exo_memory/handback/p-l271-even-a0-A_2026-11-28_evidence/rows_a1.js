// rows_a1.js: L271 "Amended 02:5x" rows: new rows for A1, the switch, the words and the banked claim, and the rows amended by name. usage: node rows_a1.js <worktree>
'use strict';
const fs = require('fs'), path = require('path');
const WT = process.argv[2];
function editor(rel) {
  const f = path.join(WT, rel); const raw = fs.readFileSync(f, 'utf8'); const crlf = raw.includes('\r\n'); let s = raw.replace(/\r\n/g, '\n');
  return {
    rep(a, b) { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor ${n}x: ${a.slice(0, 80)}`); s = s.replace(a, () => b); },
    append(t) { s = s.replace(/\n*$/, '\n') + t; },
    save() { fs.writeFileSync(f, crlf ? s.replace(/\n/g, '\r\n') : s); },
  };
}
const NEW_WORDS = (hold) => `the ${hold} edge is put back where the road had it, read from the stretch's ends: it moved \\\\d+\\\\.\\\\d\\\\d m across at most, at \\\\d+\\\\.\\\\d\\\\d km`;

// ── test/core_even.test.js ──
const C = editor('test/core_even.test.js');
C.rep(`test('where the road\\'s own width changes across the window (a 31 m straight into a 12 m turn), the held rim is held where it is now, not read back from the window\\'s ends', () => {`,
`// AMENDED BY NAME (L271, "Amended 02:5x"; the hand-back p-l271-even-a0-A_2026-11-28.md 1.3, its WC1): with A1 this road's ends do not support a reading, so the
// rim is held where it is now only with the fallback 'keep' (measured 0.0043 m, so the bar is 0.01 m, was 0.1 m for A0's 0.077), and with the switch unset Even
// refuses it by name (EVEN_UNREAD) and changes nothing.
test('where the road\\'s own width changes across the window (a 31 m straight into a 12 m turn), the held rim is held where it is now with the fallback \\'keep\\', not read back from the window\\'s ends, and refused by name with the switch unset', () => {`);
C.rep(`  const r = EV.even(d, { from: 1, to: 4, value: 16, hold: 'left' }), S = F.stations(200, 440);
  const held = Math.max(...S.map((s) => Math.abs(F.rimAcross(r.doc, s, 'left') - F.rimAcross(d, s, 'left'))));
  assert.ok(held <= 0.1, \`the held rim moved \${held} m\`);`,
`  const r = EV.even(d, { from: 1, to: 4, value: 16, hold: 'left', fallback: 'keep' }), S = F.stations(200, 440);
  const held = Math.max(...S.map((s) => Math.abs(F.rimAcross(r.doc, s, 'left') - F.rimAcross(d, s, 'left'))));
  assert.ok(held <= 0.01, \`the held rim moved \${held} m\`);
  assert.throws(() => EV.even(d, { from: 1, to: 4, value: 16, hold: 'left' }), refusedAs('EVEN_UNREAD'), 'the switch unset: refused by name');`);
C.append(`
// ── L271 (lighthouse exo_memory/loop/packet_t180_even_a0_and_slope_grab_on_L_2026-11-28.md, "Amended 02:5x"; the hand-back p-l271-even-a0-A_2026-11-28.md 1.1 to
// 1.3): A1, the road under the stretch read from the window's ends ONLY where they support it; the switch EVEN_FALLBACK for where they do not ('keep': the edge
// where it is now, B's line; 'refuse'; unset until the keeper chooses, which refuses); how far the kept edge moved (keptMove); the banked claim ("under the bank as
// Even finds it"). The figures are the hand-back's table (a1_271.out, a1_built.out).
const edgeMove = (after, before, hold, a, b) => Math.max(...F.stations(Math.ceil(a), Math.floor(b)).map((s) => Math.abs(F.rimAcross(after, s, hold) - F.rimAcross(before, s, hold))));
const runEnd = (doc, p) => SC.pieceOffsets(doc)[p] + doc.pieces[p].length;
// WC3 of the table: a road whose own width steps 12 -> 18 m inside the turn, with no grab; its window's ends are both at rest and disagree by 6 m
const wc3 = () => { let d = D.createDoc('wc3'); for (const p of [[200, 0, 12], [60, 30, 12], [60, 30, 12], [60, 30, 18], [60, 30, 18], [150, 0, 18]]) d = require('../src/core/turnby.js').extendCorner(d, require('../app/core/panel.js').extendOptions({ length: p[0], turn: p[1], climb: 0, bank: 0, width: p[2], turnAs: 'corner' })); return Object.freeze(d); };

test('A1-1: the fallback switch is unset (null) until the keeper chooses; a fallback Even does not know is refused by name', () => {
  assert.equal(EV.EVEN_FALLBACK, null);
  assert.deepEqual([...EV.FALLBACKS], ['keep', 'refuse']);
  const base = F.fixture('flat');
  assert.throws(() => EV.even(base, { ...F.runPieces(base), value: 16, hold: 'left', fallback: 'guess' }), refusedAs('EVEN_FALLBACK'));
});

for (const fallback of [undefined, 'refuse']) {
  test(\`A1-2: a run from the track's start with an edge kept, the fallback \${fallback === undefined ? 'unset' : "'refuse'"}: refused by name (EVEN_UNREAD), nothing changed (A0 put the edge 9.31 m off, silently)\`, () => {
    const base = F.fixture('flat'), before = D.serialize(base);
    for (const hold of ['left', 'right']) assert.throws(() => EV.even(base, { from: 0, to: 1, value: 16, hold, ...(fallback ? { fallback } : {}) }), refusedAs('EVEN_UNREAD'), hold);
    assert.throws(() => EV.evenReading(base, { from: 0, to: 1, hold: 'left', ...(fallback ? { fallback } : {}) }), refusedAs('EVEN_UNREAD'), 'and asked before any width');
    assert.equal(D.serialize(base), before);
  });
}

test("A1-3: the same run with the fallback 'keep': Even says it kept the edge, and the edge is where it was within 0.01 m over the run", () => {
  const base = F.fixture('flat');
  for (const hold of ['left', 'right']) {
    const r = EV.even(base, { from: 0, to: 1, value: 16, hold, fallback: 'keep' });
    assert.equal(r.reading, 'kept', hold);
    assert.deepEqual(EV.evenReading(base, { from: 0, to: 1, hold, fallback: 'keep' }).reading, 'kept');
    const m = edgeMove(r.doc, base, hold, 0, runEnd(base, 1));
    assert.ok(m <= 0.01, \`\${hold}: the kept edge moved \${m} m over the run\`);
  }
});

test("A1-4: a road whose own width steps inside the run (WC3, no grab): refused by name with the switch unset; with 'keep' the edge stays within 0.01 m (A0: 2.92 m off, silently)", () => {
  const d = wc3(), run = { from: 1, to: 4 };
  assert.ok(Math.abs(F.at(d, 'w', 150) - 12) < 1e-6 && Math.abs(F.at(d, 'w', 500) - 18) < 1e-6, 'control: 12 m before the run, 18 m after it');
  assert.throws(() => EV.even(d, { ...run, value: 16, hold: 'left' }), refusedAs('EVEN_UNREAD'));
  for (const hold of ['left', 'right']) {
    const r = EV.even(d, { ...run, value: 16, hold, fallback: 'keep' }), m = edgeMove(r.doc, d, hold, SC.pieceOffsets(d)[1], runEnd(d, 4));
    assert.ok(m <= 0.01, \`\${hold}: \${m} m\`);
  }
});

test('A1-5: where the ends support a reading (flat, after one grab, T1), Even reads the road: the kept edge goes back to the untouched road within 0.01 m, and its own figure for the move is the move measured', async () => {
  const base = F.fixture('flat'), start = F.present(await F.startOf(base, 'T1')), run = F.runPieces(start);
  for (const hold of ['left', 'right']) {
    const r = EV.even(start, { ...run, value: 16, hold });
    assert.equal(r.reading, 'road', hold);
    const back = edgeMove(r.doc, base, hold, F.RUN.lo, F.RUN.hi);
    assert.ok(back <= 0.01, \`\${hold}: \${back} m from the untouched road\`);
    const k = r.keptMove(), moved = edgeMove(r.doc, start, hold, F.WIN.w0, F.WIN.w1);
    assert.ok(Math.abs(k.m - moved) <= 0.01, \`\${hold}: Even says \${k.m} m, measured \${moved} m\`);
  }
});

test('A1-6: a grab centred 5 m outside the window\\'s start (B-, at 145) fools a 10 m test but not A1\\'s 10, 20 and 30 m: that end reads as moving; the track\\'s start reads as an edge', async () => {
  const sh = await F.shellOn(F.fixture('B-')); F.grab(sh, 145, 16);
  const d = F.present(sh), off = SC.pieceOffsets(d), L = runEnd(d, d.pieces.length - 1), I = EV._internal, x0 = EV.evenWindow(d, F.runPieces(d)).win.w0;
  assert.ok(Math.abs(F.at(d, 'w', x0) - F.at(d, 'w', x0 - 10)) <= 1e-3, \`control: the width 10 m beyond the end equals the end's (\${F.at(d, 'w', x0)}, \${F.at(d, 'w', x0 - 10)})\`);
  assert.equal(I.endState(d, off, 'w', x0, -1, L).kind, 'moving');
  assert.equal(I.endState(d, off, 'w', 0, -1, L).kind, 'edge', 'the track\\'s start has no road before it');
});

for (const id of ['T1', 'T2b']) {
  test(\`A1-7: B- \${id}: the road is read "under the bank as Even finds it": Even says the stretch is banked, and the kept edge is within 0.01 m of that road (L271 point 4)\`, async () => {
    const start = F.present(await F.startOf(F.fixture('B-'), id)), run = F.runPieces(start), I = EV._internal;
    const C = I.cutOf(start, run), rd = I.readSupported(C.doc, C.W.off, C.W.win, C.W.L), ref = I.levelTo(C.doc, { w: rd.w, l: rd.l }, C.W.win);
    for (const hold of ['left', 'right']) {
      const r = EV.even(start, { ...run, value: 16, hold });
      assert.equal(r.reading, 'road'); assert.equal(r.banked, true);
      const m = edgeMove(r.doc, ref, hold, F.RUN.lo, F.RUN.hi);
      assert.ok(m <= 0.01, \`\${hold}: \${m} m from the road read under the bank\`);
    }
  });
}
test('A1-7: an unbanked stretch is not said to be banked', () => {
  const base = F.fixture('flat'); assert.equal(EV.even(base, { ...F.runPieces(base), value: 16, hold: 'left' }).banked, false);
});

test("A1-8: the middle kept ('centre') reads nothing and is never refused for its ends: a run from the track's start is levelled", () => {
  const base = F.fixture('flat'), r = EV.even(base, { from: 0, to: 1, value: 16, hold: 'centre' });
  assert.equal(r.reading, 'centre'); assert.equal(r.keptMove, null);
  assert.equal(EV.evenReading(base, { from: 0, to: 1, hold: 'centre' }).reading, 'centre');
});
`);
C.save();

// ── app/test/sculpt-even.test.js ──
const S = editor('app/test/sculpt-even.test.js');
S.rep(`  assert.match(msg(sh), /the right edge is laid where Even reads the road's own edge from the stretch's ends, so it can move/);`,
`  // AMENDED BY NAME again (L271, "Amended 02:5x" point 3): the words say which reading Even used and how far the kept edge moved
  assert.match(msg(sh), new RegExp(\`${NEW_WORDS('right')}\`));`);
S.append(`
// L271 ("Amended 02:5x"): a stretch whose road Even cannot read from its ends, with an edge kept and the switch unset, is refused by name as the drag opens and
// when the width is typed, and nothing changes (the hand-back p-l271-even-a0-A_2026-11-28.md 1.3: a run from the track's start, A0 9.31 m off)
test('U1: a run from the track\\'s start with an edge kept is refused by name (EVEN_UNREAD) as the drag opens and when typed, and nothing changes', async () => {
  const base = F.fixture('flat'), sh = await F.shellOn(base);
  sh.selectPiece(0); sh.selectPiece(1, { extend: true });
  sh.beginSculpt({ tool: 'even', hold: 'left' });
  assert.match(msg(sh), /^EVEN_UNREAD: /); assert.equal(sh.getState().brush, null, 'no drag opened'); assert.equal(F.present(sh), base);
  sh.evenRun({ value: '16', hold: 'right' });
  assert.match(msg(sh), /^EVEN_UNREAD: /); assert.equal(F.present(sh), base);
  sh.evenRun({ value: '16', hold: 'centre' });
  assert.match(msg(sh), /^Even: 16 m wide/, 'the middle kept is levelled');
});
`);
S.save();

// ── app/test/sculpt-even-sentence.test.js ──
const W = editor('app/test/sculpt-even-sentence.test.js');
W.rep(`test('W1: the message says the kept edge is laid where Even reads the road\\'s own edge and can move, and the middle is laid smooth; never that an edge stays', async () => {`,
`// AMENDED BY NAME (L271, "Amended 02:5x" point 3): the kept edge's words say which reading Even used and how far that edge moved
test('W1: the message says the kept edge is put back where the road had it, read from the stretch\\'s ends, and how far it moved; the middle is laid smooth; never that an edge stays', async () => {`);
W.rep("    assert.match(m, new RegExp(`the ${hold} edge is laid where Even reads the road's own edge from the stretch's ends, so it can move`), `${hold}: ${m}`);",
  `    assert.match(m, new RegExp(\`${NEW_WORDS('${hold}')}\`), \`\${hold}: \${m}\`);`);
W.rep(`  assert.match(await said(base, { from: 0, to: 1 }, 'left'), /, from the track's start, and back to the road within 50 m after it;/);`,
`  // AMENDED BY NAME (L271): from the track's start with an edge kept Even now refuses (EVEN_UNREAD, U1), so the window's words are read with the middle kept
  assert.match(await said(base, { from: 0, to: 1 }, 'centre'), /, from the track's start, and back to the road within 50 m after it;/);`);
W.append(`
// W4 to W7 (L271, "Amended 02:5x" points 3 and 4): every Even with an edge kept says which reading it used and how far that edge moved, with the figure true to
// the road; on a banked stretch the road is read "under the bank as Even finds it"; the fallback 'keep' says it kept the edge and why; and a result with no
// reading cannot be said at all
const moveOf = (after, before, hold, a, b) => Math.max(...F.stations(Math.ceil(a), Math.floor(b)).map((s) => Math.abs(F.rimAcross(after, s, hold) - F.rimAcross(before, s, hold))));
test('W4: after one grab (T1), the words say the kept edge moved the metres it moved, and where', async () => {
  const start = F.present(await F.startOf(F.fixture('flat'), 'T1')), m = await said(start, F.runPieces(start), 'right');
  const x = m.match(/the right edge is put back where the road had it, read from the stretch's ends: it moved (\\d+\\.\\d\\d) m across at most, at (\\d+\\.\\d\\d) km/);
  assert.ok(x, m);
  const sh = await F.shellOn(start), run = F.runPieces(start); sh.selectPiece(run.from); sh.selectPiece(run.to, { extend: true }); sh.evenRun({ value: '16', hold: 'right' });
  const moved = moveOf(F.present(sh), start, 'right', F.WIN.w0, F.WIN.w1);
  assert.ok(moved > 1, \`control: the edge moved metres (\${moved} m)\`);
  assert.ok(Math.abs(Number(x[1]) - moved) <= 0.01, \`said \${x[1]} m, measured \${moved} m\`);
  assert.ok(Number(x[2]) * 1000 >= F.WIN.w0 - 10 && Number(x[2]) * 1000 <= F.WIN.w1 + 10, \`at \${x[2]} km, inside the window\`);
});
test('W5: on a banked stretch the road is read "under the bank as Even finds it"; on a flat one it is not said', async () => {
  for (const [fx, banked] of [['B-', true], ['flat', false]]) {
    const base = F.fixture(fx), m = await said(base, F.runPieces(base), 'left');
    (banked ? assert.match : assert.doesNotMatch)(m, /read from the stretch's ends under the bank as Even finds it:/, \`\${fx}: \${m}\`);
  }
});
test("W6: with the fallback 'keep', the words say the edge was kept where it is, how far it moved, and why the road could not be read", () => {
  const base = F.fixture('flat'), r = EV.even(base, { from: 0, to: 1, value: 16, hold: 'left', fallback: 'keep' });
  assert.match(EVW.evenDone(r), /the left edge is kept where it is \\(it moved 0\\.0\\d m at most\\), because Even could not read the road under the stretch from its ends: the stretch reaches the track's start/);
});
test('W7: a result with an edge kept but no reading or no figure is not said (it throws): a sentence without the move would be the silent move again', () => {
  const base = F.fixture('flat'), r = EV.even(base, { ...F.runPieces(base), value: 16, hold: 'left' });
  assert.doesNotThrow(() => EVW.evenDone(r));
  assert.throws(() => EVW.evenDone({ ...r, reading: undefined }), /need the reading/);
  assert.throws(() => EVW.evenDone({ ...r, keptMove: null, kept: null }), /need the reading/);
});
`);
W.save();

// ── app/test/core-pieces-ui.test.js ──
const U = editor('app/test/core-pieces-ui.test.js');
U.rep("    assert.match(shell.getState().message, new RegExp(`^Even: ${w} m wide from 0\\\\.30 km to 0\\\\.60 km.*the ${held} edge is laid where Even reads the road's own edge from the stretch's ends, so it can move`));",
  "    // AMENDED BY NAME again (L271, \"Amended 02:5x\" point 3): the words say the reading and how far the kept edge moved\n    assert.match(shell.getState().message, new RegExp(`^Even: ${w} m wide from 0\\\\.30 km to 0\\\\.60 km.*" + NEW_WORDS('${held}') + "`));");
U.save();
console.log('rows applied');
