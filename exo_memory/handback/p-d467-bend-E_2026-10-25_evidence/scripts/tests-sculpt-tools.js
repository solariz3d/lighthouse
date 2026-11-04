// tests-sculpt-tools.js (D467, pane E): the new rows 25-27 and the rows whose rule changed (6, 20, 21, 23, 24), AMENDED by name. CRLF kept; each block found once.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/Downloads/t180-wt-e467/app/test/sculpt-tools.test.js';
const raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
/** Replace the whole test block that starts with `test(<head>` (up to its closing "\n});\n") by `to`. */
const block = (head, to) => {
  const i = s.indexOf(head); if (i < 0 || s.indexOf(head, i + 1) >= 0) throw new Error('block not found once: ' + head.slice(0, 70));
  const j = s.indexOf('\n});\n', i); if (j < 0) throw new Error('no end: ' + head.slice(0, 70));
  s = s.slice(0, i) + to + s.slice(j + 5);
};

block("test('row 6: the window close first;", `// AMENDED (D467, the librarian's ruling on E's D463 §6(2), the keeper's "what do you think" of 19:00): a closed-lap release away from the seam tries the lap's START
// PIECES first (the first and last road pieces), so the user's bend is kept whole; that put one try ahead of the window. Was (D421c): four tries, the window first.
test('row 6: the start pieces first, then the window close; refused, the whole-lap close with the window protected; refused again, the drag is dropped whole and named', async () => {
  // refused four times, then converged: the fifth job is the whole lap with the window protected
  const r1 = fakeRunner((args, n) => (n < 5 ? { refused: { code: 'CLOSE_WINDOW', message: 'close: can\\'t close using only the window' } } : realClose(args)));
  const s = await closedLap({ closeRunner: r1 });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(5e-4); s.endBrush(); const a = await s.brushRelease();
  assert.equal(r1.calls.length, 5); for (let k = 0; k < 4; k++) assert.ok(Array.isArray(r1.calls[k].window), \`try \${k + 1} has a window\`); assert.equal(r1.calls[4].whole, true); assert.deepEqual(r1.calls[4].edited, r1.calls[1].window, 'the window is protected');
  assert.equal(a.history.present.closed, true, a.message);
  // refused every time: the drag is dropped whole, by name, and the track is the very one from before the drag
  const r2 = fakeRunner(() => ({ refused: { code: 'CLOSE_WINDOW', message: 'no' } }));
  const t = await closedLap({ closeRunner: r2 }), before = t.getState().history.present, n0 = t.getState().history.past.length;
  t.beginBrush({ tool: 'bend', s0: 450, r: 80 }); t.brushTo(5e-4); t.endBrush(); const b = await t.brushRelease();
  assert.equal(b.history.present, before, 'the track is as it was'); assert.equal(b.history.past.length, n0, 'no undo step'); assert.equal(b.brush, null);
  assert.match(b.message, /^ROUTE_NO_CLOSE: /);
});
`);

block("test('row 20: the release tries the window,", `// AMENDED (D467, the librarian's ruling on E's D463 §6(2)): a window away from the seam tries the start pieces [first, last] BEFORE itself, which keeps the bend whole (E's
// measure: 100% kept on both away cases, against 51-55% by the window tries). Was (D421c): the window first. A window holding a seam piece is unchanged (its second half below).
test('row 20: away from the seam the release tries the start pieces, then the window, then the window with the last road piece, then with the last and the first, then the whole lap with the window protected', async () => {
  const r = fakeRunner((args, n) => (n < 5 ? { refused: { code: 'CLOSE_WINDOW', message: 'no' } } : realClose(args)));
  const s = await closedLap({ closeRunner: r });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(5e-4); s.endBrush(); const a = await s.brushRelease();
  const P = a.history.present.pieces, road = P.map((x, i) => (x.type === 'road' ? i : -1)).filter((i) => i >= 0), last = road[road.length - 1], first = road[0];
  assert.equal(r.calls.length, 5); const w = r.calls[1].window, sorted = (xs) => [...new Set(xs)].sort((x, y) => x - y);
  assert.ok(!w.includes(last) && !w.includes(first), 'control: the window holds neither seam piece');
  assert.deepEqual(r.calls[0].window, [first, last], 'first the start pieces, the window left as the drag made it');
  assert.deepEqual(r.calls[2].window, sorted([...w, last]), 'then the window and the last road piece');
  assert.deepEqual(r.calls[3].window, sorted([...w, last, first]), 'then the window and both pieces beside the seam');
  assert.equal(r.calls[4].whole, true); assert.deepEqual(r.calls[4].edited, w, 'the whole lap protects the window the drag changed');
  assert.equal(a.history.present.closed, true, a.message);
  // a window that already holds the last piece is not tried twice, and gets no start-pieces try: the window, then + the first, then the whole lap
  const r2 = fakeRunner((args, n) => (n < 3 ? { refused: { code: 'CLOSE_WINDOW', message: 'no' } } : realClose(args)));
  const t = await closedLap({ closeRunner: r2 }), n = t.getState().history.present.pieces.length;
  t.beginBrush({ tool: 'bend', s0: t.getState().history.present.pieces.slice(0, n - 1).reduce((x, p) => x + p.length, 0) + 30, r: 20 }); t.brushTo(5e-4); t.endBrush(); await t.brushRelease();
  const w2 = r2.calls[0].window; assert.ok(w2.includes(n - 1), 'control: this window holds the last piece');
  assert.equal(r2.calls.length, 3); assert.deepEqual(r2.calls[1].window, sorted([...w2, 0]), 'then + the first'); assert.equal(r2.calls[2].whole, true);
});
`);

block("test('row 21: with the real close,", `// AMENDED (D467, the librarian's ruling on E's D463 §6(2)): with the real close a Bend away from the seam now closes on its FIRST try, the start pieces, and the window's
// pieces are the very ones the drag made. Was (D421c): the window refused, then the window and the last piece closed, re-solving the bent piece.
test('row 21: with the real close, a Bend away from the seam closes with the start pieces on the first try; the window\\'s pieces stay as dragged, and only the start pieces and the joints after them change', async () => {
  const r = fakeRunner((args) => realClose(args));
  const s = await closedLap({ closeRunner: r });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  const last = open.pieces.length - 1;
  assert.equal(r.calls.length, 1, \`one try (\${r.calls.length})\`); assert.deepEqual(r.calls[0].window, [0, last], 'the start pieces');
  for (const i of win) assert.equal(a.history.present.pieces[i], open.pieces[i], \`piece \${i} is in the window: the very piece the drag made\`);
  const moved = new Set([0, last]); for (const i of [...moved]) moved.add((i + 1) % open.pieces.length);   // a moved piece rebuilds the joint of the piece after it (round the seam for the last)
  a.history.present.pieces.forEach((P, i) => { if (!moved.has(i)) assert.equal(P, open.pieces[i], \`piece \${i} is outside the start pieces and their joints: the very same object\`); });
});
`);

block("test('row 23 (D464): a Bend away from the seam that the re-close partly takes back says how much'", `// AMENDED (D467): away from the seam the bend is now kept whole (the start pieces close the lap), so this row's case says the start moved; the partial take-back words
// (D464) still serve a close that keeps less than 0.9 by a later try, shown with a runner that refuses the start pieces. Was: the real close kept 0.55 here and said so.
test('row 23 (D464, D467): a later try that partly takes the bend back says how much', async () => {
  const s = await closedLap({ closeRunner: fakeRunner((args, n) => (n === 1 ? { refused: { code: 'CLOSE_WINDOW', message: 'no' } } : realClose(args))) });
  const base = s.getState().history.present;
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces;
  s.endBrush(); const a = await s.brushRelease();
  const kept = keptShare(base, open, a.history.present, win, 'kh');
  assert.ok(kept >= 0.5 && kept < 0.9, \`part of the bend is taken back (kept \${kept.toFixed(3)})\`);
  const pct = Math.round((1 - kept) * 100);
  assert.match(a.message, new RegExp(\`closing it took back \${pct}% of your bend\`), a.message);
  assert.ok(!/undone|start of the lap moved/.test(a.message), a.message);
});
`);

block("test('row 24 (D464): a re-close that keeps the drag says only that the lap is closed again'", `// AMENDED (D467): the first try away from the seam is now the start pieces, whose close says the start moved; a close that keeps the drag by the WINDOW try still says only
// "closed again", so the runner refuses the start pieces first. Was: the runner closed the first try, which was the window.
test('row 24 (D464, D467): a re-close by the window that keeps the drag says only that the lap is closed again', async () => {
  // the runner refuses the start pieces, then answers with the dragged lap itself, closed: every bit of the bend is kept
  const s = await closedLap({ closeRunner: fakeRunner((args, n) => (n === 1 ? { refused: { code: 'CLOSE_WINDOW', message: 'no' } } : { out: { converged: true, doc: { ...args.doc, closed: true }, report: 'kept as dragged' } })) });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4);
  s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.message, 'the lap is closed again: kept as dragged');
  assert.equal(a.keptBend, null, 'the start did not move: nothing to hatch');
});

// D467 (the librarian's ruling on E's D463 §6(2), the keeper's "what do you think" of 19:00): KEEP THE USER'S WHOLE BEND. Away from the seam a closed-lap release first closes
// the lap with its start pieces (the first and last road pieces), leaving the window as the drag made it; the start pieces that moved are hatched, and the message says why.
// At the seam (a window holding the first or last road piece) nothing changes: no start-pieces try, and a close that takes the bend back says so (D464).
const { startMovedOf } = require('../preview/preview.js');

test('row 25 (D467): a Bend away from the seam keeps its full value after release', async () => {
  const s = await closedLap({ closeRunner: fakeRunner((args) => realClose(args)) });
  const base = s.getState().history.present;
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces;
  s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  const kept = keptShare(base, open, a.history.present, win, 'kh');
  assert.ok(Math.abs(kept - 1) < 1e-9, \`the whole bend is kept (kept \${kept})\`);
});

test('row 26 (D467): the start pieces that moved are named for the hatch, and the message says why; an undo ends the hatch', async () => {
  const s = await closedLap({ closeRunner: fakeRunner((args) => realClose(args)) });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4); s.endBrush(); const a = await s.brushRelease();
  const last = a.history.present.pieces.length - 1;
  assert.match(a.message, /^the lap is closed again: to keep your bend, the start of the lap moved/, a.message);
  assert.ok(a.keptBend && a.keptBend.doc === a.history.present, 'the kept bend names the document it was made on');
  assert.deepEqual(a.keptBend.pieces, [0, last], 'the start pieces');
  assert.equal(startMovedOf(a), true, 'the preview hatches the start pieces');
  s.undo(); assert.equal(startMovedOf(s.getState()), false, 'after an undo the hatch is gone');
  assert.equal(startMovedOf(null), false); assert.equal(startMovedOf({}), false);
});

test('row 27 (D467): at the seam nothing changes: no start-pieces try, the bend is said to be undone, nothing hatched', async () => {
  const r = fakeRunner((args) => realClose(args));
  const s = await closedLap({ closeRunner: r });
  s.beginBrush({ tool: 'bend', s0: 150, r: 80 }); s.brushTo(3e-4);
  const win = s.getState().brush.changedPieces; s.endBrush(); const a = await s.brushRelease();
  assert.deepEqual(win, [0], 'control: the bend is on the seam piece');
  assert.deepEqual(r.calls[0].window, [0], 'the first try is the window itself, as before');
  assert.match(a.message, /your bend was undone to close the lap; bend further from the start, or open the lap first/, a.message);
  assert.equal(a.keptBend, null); assert.equal(startMovedOf(a), false);
});
`);

fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s);
console.log('written');
