// tests-bar.js (D467 re-ruled after C's review, pane E): rows 21, 25, 26 AMENDED to a lap whose start try passes the bar; new rows 28-31; sculpt-wash's frame row
// AMENDED to that lap. CRLF kept; each block found once.
'use strict';
const fs = require('fs');
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const editFile = (rel, fn) => { const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n'); s = fn(s); fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s); };
const blockIn = (s, head, to) => {
  const i = s.indexOf(head); if (i < 0 || s.indexOf(head, i + 1) >= 0) throw new Error('block not found once: ' + head.slice(0, 70));
  const j = s.indexOf('\n});\n', i); if (j < 0) throw new Error('no end: ' + head.slice(0, 70));
  return s.slice(0, i) + to + s.slice(j + 5);
};
const once = (s, from, to) => { const n = s.split(from).length - 1; if (n !== 1) throw new Error(`anchor found ${n} times: ${from.slice(0, 80)}`); return s.replace(from, () => to); };

const RERULE = `// AMENDED (D467 re-ruled after C's review, exo_memory/handback/p-d467-review-C_2026-10-25.md §3): the start-pieces close is taken only when its result passes the bar
// (closejob.js barMiss). On this file's lap it never does (C: a Bend closed within 0.53 m by the window tries swung the lap 72.9 m and left no start straight), so this row
// moves to a lap whose start pieces curve gently and whose start straight is in the middle (curvedMidLap), with a smaller bend, where the bar passes.`;

editFile('app/test/sculpt-tools.test.js', (s) => {
  // the lap the passing rows use, beside the file's own laps
  s = once(s, "async function closedLap(opts = {}) {",
    "/** D467: a lap whose start pieces curve gently (1/600 m) and whose start straight, 500 m, is in the middle: there a small Bend away from the seam passes the bar. */\n" +
    "async function curvedMidLap(opts = {}) {\n" +
    "  const s = await createCoreShell({ autosaveMs: 0, ...opts });\n" +
    "  s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } });\n" +
    "  for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });\n" +
    "  s.extend({ length: 500, transition: 40, targets: { kh: 0 } });\n" +
    "  for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });\n" +
    "  s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } });\n" +
    "  s.close(); assert.equal(s.getState().history.present.closed, true, s.getState().message); return s;\n" +
    "}\n" +
    "async function closedLap(opts = {}) {");

  s = blockIn(s, "// AMENDED (D467, the librarian's ruling on E's D463 §6(2)): with the real close a Bend away from the seam now closes on its FIRST try",
`// AMENDED (D467, the librarian's ruling on E's D463 §6(2)): with the real close a Bend away from the seam closes on its FIRST try, the start pieces, and the window's
// pieces are the very ones the drag made. Was (D421c): the window refused, then the window and the last piece closed, re-solving the bent piece.
${RERULE}
test('row 21: with the real close, a small Bend away from the seam that passes the bar closes with the start pieces on the first try; the window\\'s values stay as dragged, and only the start pieces and the joints after them change', async () => {
  const r = fakeRunner((args) => realClose(args));
  const s = await curvedMidLap({ closeRunner: r }), base = s.getState().history.present;
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(1e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  const last = open.pieces.length - 1;
  assert.equal(r.calls.length, 1, \`one try (\${r.calls.length})\`); assert.deepEqual(r.calls[0].window, [0, last], 'the start pieces'); assert.ok(r.calls[0].bar, 'asked with the bar');
  const moved = new Set([0, last]); for (const i of [...moved]) moved.add((i + 1) % open.pieces.length);   // a moved piece rebuilds the joint of the piece after it (round the seam for the last)
  for (const i of win) {
    const o = open.pieces[i], c = a.history.present.pieces[i], b0 = base.pieces[i];
    if (!moved.has(i)) assert.equal(c, o, \`piece \${i} is in the window and no joint of a start piece: the very piece the drag made\`);
    o.channels.kh.forEach((v, k) => { if (v !== b0.channels.kh[k]) assert.equal(c.channels.kh[k], v, \`piece \${i} knot \${k}: every value the bend set is kept\`); });
  }
  a.history.present.pieces.forEach((P, i) => { if (!moved.has(i)) assert.equal(P, open.pieces[i], \`piece \${i} is outside the start pieces and their joints: the very same object\`); });
});
`);

  s = blockIn(s, "test('row 25 (D467): a Bend away from the seam keeps its full value after release'",
`${RERULE}
test('row 25 (D467): a small Bend away from the seam that passes the bar keeps its full value after release', async () => {
  const s = await curvedMidLap({ closeRunner: fakeRunner((args) => realClose(args)) });
  const base = s.getState().history.present;
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(1e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces;
  s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  const kept = keptShare(base, open, a.history.present, win, 'kh');
  assert.ok(Math.abs(kept - 1) < 1e-9, \`the whole bend is kept (kept \${kept})\`);
  assert.equal(CJ.barMiss(open, a.history.present, { base, edited: win }), null, 'and the lap it keeps passes the bar');
});
`);

  s = blockIn(s, "test('row 26 (D467): the start pieces that moved are named for the hatch",
`${RERULE}
test('row 26 (D467): the start pieces that moved are named for the hatch, and the message says why; an undo ends the hatch', async () => {
  const s = await curvedMidLap({ closeRunner: fakeRunner((args) => realClose(args)) });
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(1e-4); s.endBrush(); const a = await s.brushRelease();
  const last = a.history.present.pieces.length - 1;
  assert.match(a.message, /^the lap is closed again: to keep your bend, the start of the lap moved/, a.message);
  assert.ok(a.keptBend && a.keptBend.doc === a.history.present, 'the kept bend names the document it was made on');
  assert.deepEqual(a.keptBend.pieces, [0, last], 'the start pieces');
  assert.equal(startMovedOf(a), true, 'the preview hatches the start pieces');
  s.undo(); assert.equal(startMovedOf(s.getState()), false, 'after an undo the hatch is gone');
  assert.equal(startMovedOf(null), false); assert.equal(startMovedOf({}), false);
});
`);

  // the new rows, at the end of the file
  s = s.replace(/\n*$/, '\n') + `
// D467 RE-RULED (C's review, exo_memory/handback/p-d467-review-C_2026-10-25.md §3-§5; the librarian's ruling): THE BAR. The start-pieces close is taken only when its
// result passes closejob.js barMiss: (3) no road outside the window moves further than the drag moved the open lap, (2) the exporter's start straight still fits, (1) the
// validator adds no red the open lap did not have. Otherwise it is refused by name (CLOSE_BAR) and the release falls through to D421c's tries, saying what they took back.
const { startLayout } = require('../core/coreshell.js');
const AD = require('../../src/core/adapter.js');
const hasStart = (d) => { const segs = AD.toSegments(d); try { startLayout(segs, (p) => AD.offsetPath(d, segs, p), { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch }, {}); return true; } catch (e) { if (e.code === 'NO_START_STRAIGHT') return false; throw e; } };
const { createCheckJob } = require('../validate-ui/checkjob.js');
const redsOf = (d) => { const o = createCheckJob().run({ doc: d, csp: true }); assert.ok(o.result, \`checked: \${o.error || o.how}\`); return (o.result.red || []).map((x) => x.reason); };

test('row 28 (D467 bar): C\\'s lap case, a Bend the start pieces would close by swinging the lap 72 m: it falls through to the window tries, says what they took back, and the start straight stays', async () => {
  const r = fakeRunner((args) => realClose(args));
  const s = await closedLap({ closeRunner: r });
  assert.equal(hasStart(s.getState().history.present), true, 'control: the lap has its start straight');
  s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(3e-4); s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  assert.ok(r.calls.length > 1, \`the start pieces were not taken (\${r.calls.length} tries)\`);
  const first = realClose(r.calls[0]); assert.equal(first.refused && first.refused.code, 'CLOSE_BAR', 'the first try was refused by the bar');
  assert.match(first.refused.message, /move road you did not touch/, first.refused.message);
  assert.match(a.message, /closing it took back \\d+% of your bend/, a.message);
  assert.equal(a.keptBend, null, 'nothing hatched');
  assert.equal(hasStart(a.history.present), true, 'the export still has its start straight');
});

test('row 29 (D467 bar): a lap whose two long straights run side by side (a hairpin of 36 m), the case C saw on a smoothed track: it falls through and the road does not cross itself', async () => {
  const s = await createCoreShell({ autosaveMs: 0, closeRunner: fakeRunner((args) => realClose(args)) });
  s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 36, transition: 20, targets: { kh: 1 / 36 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 36, transition: 20, targets: { kh: 1 / 36 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); s.close();
  const base = s.getState().history.present; assert.equal(base.closed, true, s.getState().message);
  assert.ok(!redsOf(base).includes('self-intersection'), 'control: the lap does not cross itself');
  s.beginBrush({ tool: 'bend', s0: 700 + Math.PI * 36 * 0.5, r: 60 }); s.brushTo(3e-4);
  const open = s.getState().history.present, win = s.getState().brush.changedPieces; s.endBrush(); const a = await s.brushRelease();
  assert.deepEqual(win, [1], 'control: the bend is in the first hairpin, away from the seam');
  assert.equal(a.history.present.closed, true, a.message);
  assert.equal(a.keptBend, null, \`the start pieces were not taken: \${a.message}\`);
  assert.ok(!redsOf(a.history.present).includes('self-intersection'), 'the closed lap does not cross itself');
  // and what the bar spared it: the start pieces alone would have made it cross
  const raw = CJ.runClose({ doc: open, window: [0, open.pieces.length - 1] });
  assert.ok(redsOf(raw.doc).includes('self-intersection'), 'control: closed by the start pieces, the road crosses itself');
});

test('row 30 (D467 bar): part 2 alone: a result with no straight long enough for the start misses, when the lap before had one', async () => {
  const base = (await closedLap()).getState().history.present, curved = (await curvedNoStraight()).getState().history.present;
  const all = base.pieces.map((_, i) => i);   // every piece in the window, so part 3 measures nothing
  assert.equal(CJ.barMiss({ ...base, closed: false }, base, { base, edited: all }), null, 'control: the lap itself passes');
  assert.equal(CJ.barMiss({ ...base, closed: false }, curved, { base, edited: all }), 'leave no straight long enough for the start');
  assert.equal(CJ.barMiss({ ...curved, closed: false }, curved, { base: curved, edited: all }), null, 'a lap that had no start straight cannot lose one');
});

test('row 31 (D467 bar): part 1 alone: a result with reds the open lap did not have misses, and names the first', async () => {
  const base = (await closedLap()).getState().history.present;
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); s.close();
  const crossing = s.getState().history.present, all = base.pieces.map((_, i) => i);
  assert.ok(redsOf(crossing).length > 0, 'control: this lap has reds');
  const why = CJ.barMiss({ ...base, closed: false }, crossing, { base, edited: all });
  assert.match(why, /^add \\d+ reds? \\(\\w[\\w-]* at \\d+\\.\\d\\d km\\)$/, why);
});

/** D467: a lap with no straight at all (its start pieces curve, and so does everything else). */
async function curvedNoStraight() {
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }); for (let i = 0; i < 4; i++) s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } });
  s.close(); assert.equal(s.getState().history.present.closed, true, s.getState().message); return s;
}
`;
  return s;
});

editFile('app/test/sculpt-wash.test.js', (s) => {
  s = once(s, "  const s = await closedTrack(), pv = P.createPreview({ canvas, shell: s, win });",
    "  // AMENDED (D467 re-ruled after C's review): the start pieces are taken only within the bar, which this file's lap does not pass, so the row uses a lap whose start\n" +
    "  // pieces curve gently and whose start straight is in the middle, with a small bend (sculpt-tools.test.js curvedMidLap, built the same way)\n" +
    "  const s = await createCoreShell({ autosaveMs: 0 }), Q = (Math.PI * R) / 2;\n" +
    "  s.extend({ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }); for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });\n" +
    "  s.extend({ length: 500, transition: 40, targets: { kh: 0 } }); for (const len of [Q, Q]) s.extend({ length: len, transition: 40, targets: { kh: 1 / R } });\n" +
    "  s.extend({ length: 200, transition: 40, targets: { kh: 1 / 600 } }); s.close(); assert.equal(s.getState().history.present.closed, true, s.getState().message);\n" +
    "  const pv = P.createPreview({ canvas, shell: s, win });");
  s = once(s, "  s.setSculpt(true); s.beginBrush({ tool: 'bend', s0: 400 + Math.PI * R + 200, r: 100 }); s.brushTo(2e-4); s.endBrush(); const a = await s.brushRelease();",
    "  s.setSculpt(true); s.beginBrush({ tool: 'bend', s0: 450, r: 80 }); s.brushTo(1e-4); s.endBrush(); const a = await s.brushRelease();");
  return s;
});
console.log('written');
