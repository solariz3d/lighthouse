// patch-c8.js (D467, C's §8 re-read, pane E): part 1 compares with the lap before the drag; part 3 counts the window too and says how it reads; the straight-start
// frame row restored beside the curvedMid one; a comment on the curvedMid rows; rows 33-34. CRLF kept; each anchor once.
'use strict';
const fs = require('fs');
const W = 'C:/Users/nname/Downloads/t180-wt-e467/';
const edit = (rel, fn) => { const f = W + rel, raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n'); s = fn(s); fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s); };
const once = (s, from, to, what) => { const n = s.split(from).length - 1; if (n !== 1) throw new Error(`${what}: anchor found ${n} times: ${from.slice(0, 90)}`); return s.replace(from, () => to); };

edit('app/core/closejob.js', (s) => {
  s = once(s, ` *   3  no road outside the window (the pieces the drag changed) moves further from where it was before the drag than the drag itself moved the open lap (displacementOf,
 *      C's measure: each piece's largest move, sample for sample);`,
` *   3  the LAP-WIDE largest move of the result, from where the road was before the drag (displacementOf, C's measure: each piece's largest move, sample for sample,
 *      the window's pieces counted too), is no larger than the drag's own largest move of the open lap. It reads lap-wide on purpose: piece by piece it would refuse
 *      everything, since the road before the window moves 0 during a drag. The window's pieces count because they carry the first start piece's new end with them
 *      (C §8.2: on sculpt-tools' lap the window moved 72.91 m against a 12.89 m drag), so they can be the lap's largest move;`, 'part 3 comment');
  s = once(s, ` *   1  the validator adds no red the open lap did not have (the live checker's job, as Close's one press compares them: same reason within RED_NEAR_M).`,
` *   1  the validator finds no red in the result that the lap BEFORE THE DRAG (\`base\`) did not have (the live checker's job; same reason within RED_NEAR_M counts as
 *      had). Not the open lap: a crossing the drag itself made is in the open lap, and comparing with it would let the start pieces keep a crossing D421c's tries
 *      would clear (C §8.1, his track after Smooth ramps).`, 'part 1 comment');
  s = once(s, "function barMiss(open, closed, { base, edited }) {\n  const win = new Set(edited || []);\n  const drag = displacementOf(base, open).reduce((m, x) => Math.max(m, x.maxM), 0);\n  const outside = displacementOf(base, closed).filter((x) => !win.has(x.piece)).reduce((m, x) => Math.max(m, x.maxM), 0);\n  if (outside > drag + 1e-6) return `move road you did not touch up to ${fmtM(outside)}, further than your drag moved it (${fmtM(drag)})`;",
    "function barMiss(open, closed, { base, edited }) {   // eslint-disable-line no-unused-vars -- `edited` stays in the shape the release sends; part 3 counts every piece\n  const drag = displacementOf(base, open).reduce((m, x) => Math.max(m, x.maxM), 0);\n  const moved = displacementOf(base, closed).reduce((m, x) => Math.max(m, x.maxM), 0);\n  if (moved > drag + 1e-6) return `move the track up to ${fmtM(moved)}, further than your drag moved it (${fmtM(drag)})`;", 'part 3 code');
  s = once(s, "  const job = createCheckJob(), mine = redsOf(closed, job), was = redsOf({ ...open, closed: false }, job);",
    "  const job = createCheckJob(), mine = redsOf(closed, job), was = redsOf(base, job);   // C §8.1: the lap before the drag, not the open lap", 'part 1 code');
  return s;
});

edit('app/test/sculpt-tools.test.js', (s) => {
  // the comment on the curvedMid lap: one passing spot
  s = once(s, "/** D467: a lap whose start pieces curve gently (1/600 m) and whose start straight, 500 m, is in the middle: there a small Bend away from the seam passes the bar. */",
    "/** D467: a lap whose start pieces curve gently (1/600 m) and whose start straight, 500 m, is in the middle: there a small Bend away from the seam passes the bar.\n" +
    " *  s0 450 is this lap's ONE passing spot (C §8.3: s0 700, 950, 1200, 1500 and 1800 fail part 3 at every size), so a later change to the close could tip it, and the\n" +
    " *  rows on it would then fail on the lap, not on a defect: look here first. */", 'curvedMid comment');
  // row 28 and 29's miss words follow part 3's new words
  s = once(s, "  assert.match(first.refused.message, /move road you did not touch/, first.refused.message);", "  assert.match(first.refused.message, /move the track up to/, first.refused.message);", 'row 28 words');
  s = s.replace(/\n*$/, '\n') + `
// D467, C's re-read (exo_memory/handback/p-d467-review-C_2026-10-25.md §8.1): PART 1 COMPARES WITH THE LAP BEFORE THE DRAG. A crossing the drag itself made is in the
// open lap, so comparing with the open lap let the start pieces keep it where D421c's tries would have cleared it (his track after Smooth ramps: two crossings, 0 before).
test('row 33 (D467 bar): part 1 counts a red as new when the lap before the drag did not have it, even when the open lap already did', async () => {
  const base = (await closedLap()).getState().history.present;
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); s.close();
  const crossing = s.getState().history.present, all = base.pieces.map((_, i) => i);
  assert.ok(!redsOf(base).includes('self-intersection') && redsOf(crossing).includes('self-intersection'), 'control: the lap before is clean, the result crosses itself');
  assert.ok(redsOf({ ...crossing, closed: false }).includes('self-intersection'), 'control: the open lap already crosses itself where the result does');
  const why = CJ.barMiss({ ...crossing, closed: false }, crossing, { base, edited: all });
  assert.match(why || '', /^add \\d+ reds? \\(/, \`the result's reds are new against the lap before the drag: \${why}\`);
});

test('row 34 (D467 bar): a Bend that makes the open lap cross itself, which the window close clears: the start pieces miss and the closed lap does not cross', async () => {
  // a narrow stadium (900 m straights, 40 m half turns); the Bend in the middle of the back straight swings it into the start straight
  const s = await createCoreShell({ autosaveMs: 0, closeRunner: fakeRunner((args) => realClose(args)) });
  s.extend({ length: 900, family: 'bowl' }); s.extend({ length: Math.PI * 40, transition: 30, targets: { kh: 1 / 40 } }); s.extend({ length: 900, transition: 30, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 40, transition: 30, targets: { kh: 1 / 40 } }); s.close();
  const base = s.getState().history.present; assert.equal(base.closed, true, s.getState().message);
  const L = base.pieces.reduce((a, P) => a + P.length, 0), mid = (d) => { const o = createCheckJob().run({ doc: d, csp: true }); return (o.result.red || []).filter((x) => x.reason === 'self-intersection' && (x.s ?? x.s0) > 40 && (x.s ?? x.s0) < L - 40); };
  assert.equal(mid(base).length, 0, 'control: the lap does not cross itself');
  s.beginBrush({ tool: 'bend', s0: 900 + Math.PI * 40 + 450, r: 120 }); s.brushTo(4e-3);
  const open = s.getState().history.present; assert.ok(mid({ ...open, closed: false }).length > 0, 'control: the drag makes the open lap cross itself');
  s.endBrush(); const a = await s.brushRelease();
  assert.equal(a.history.present.closed, true, a.message);
  assert.equal(a.keptBend, null, \`the start pieces were not taken: \${a.message}\`);
  assert.equal(mid(a.history.present).length, 0, 'the closed lap does not cross itself');
});
`;
  return s;
});

edit('app/test/sculpt-wash.test.js', (s) => {
  // the 95d23f1 frame row restored, on this file's straight-start lap, beside the curvedMid one
  return s.replace(/\n*$/, '\n') + `
// D467, C's re-read (§8.3): the frame row as it was at 95d23f1, on this file's STRAIGHT-START lap (a 400 m straight, two half turns), restored beside the curved-start one:
// it is green, and it is the one row where a straight-start lap's start pieces are taken in a real release, past the bar.
test('row D467 frame (straight start): the preview draws the start pieces\\' hatch after such a release, and not after an undo', async () => {
  const P = require('../preview/preview.js');
  const counts = []; let q = [], now = 0;
  const win = { devicePixelRatio: 1, document: { hidden: false, activeElement: null, body: {}, addEventListener() {}, removeEventListener() {} }, addEventListener() {}, removeEventListener() {}, requestAnimationFrame: (fn) => { q.push(fn); return q.length; }, cancelAnimationFrame() {}, setTimeout: () => 0, clearTimeout() {} };
  const gl = new Proxy({ getShaderParameter: () => true, getProgramParameter: () => true, createShader: () => ({}), createProgram: () => ({}), createBuffer: () => ({}), getUniformLocation: (p, n) => n, getAttribLocation: () => 0, drawArrays: (m, f, n) => { counts.push(n); } }, { get: (t, k) => (k in t ? t[k] : () => 0) });
  const canvas = { clientWidth: 800, clientHeight: 500, width: 0, height: 0, getContext: () => gl, addEventListener() {}, removeEventListener() {} };
  const s = await closedTrack(), pv = P.createPreview({ canvas, shell: s, win });
  const step = (n = 1) => { for (let i = 0; i < n; i++) { const f = q; q = []; now += 16; for (const g of f) g(now); } };
  const drawnOnce = () => { step(80); counts.length = 0; step(1); return counts.slice(); };
  const hatchSizes = () => { const t = pv.track(), k = sculptCues(t, null, true); assert.ok(k && k.length === 2, 'the track has two start pieces to hatch'); return k.map((c) => c.positions.length / 3); };
  s.setSculpt(true); s.beginBrush({ tool: 'bend', s0: 400 + Math.PI * R + 200, r: 100 }); s.brushTo(2e-4); s.endBrush(); const a = await s.brushRelease();
  assert.equal(P.startMovedOf(a), true, \`control: this release moved the start pieces (\${a.message})\`);
  const after = drawnOnce(), sizes = hatchSizes();
  for (const n of sizes) assert.ok(after.includes(n), \`a line list of \${n} vertices (a start piece's hatch) is drawn: \${JSON.stringify(after)}\`);
  s.undo(); assert.equal(P.startMovedOf(s.getState()), false);
  const undone = drawnOnce(), sizes2 = hatchSizes();
  assert.ok(!sizes2.every((n) => undone.includes(n)), \`after the undo the hatch is not drawn: \${JSON.stringify(undone)} against \${JSON.stringify(sizes2)}\`);
  pv.dispose();
});
`;
});
console.log('patched');
