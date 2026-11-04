// amend-3031.js (D467, C's §8 re-read, pane E): rows 30 and 31 AMENDED by name. Part 3 now counts every piece (C §8.2), so `edited: all` no longer switches it off;
// the open lap is the result's own geometry opened, which makes the drag's move the result's. Row 31's rule changed with part 1's baseline (C §8.1). CRLF kept.
'use strict';
const fs = require('fs');
const f = 'C:/Users/nname/Downloads/t180-wt-e467/app/test/sculpt-tools.test.js';
const raw = fs.readFileSync(f, 'utf8'); let s = raw.split('\r\n').join('\n');
const block = (head, to) => {
  const i = s.indexOf(head); if (i < 0 || s.indexOf(head, i + 1) >= 0) throw new Error('block not found once: ' + head.slice(0, 70));
  const j = s.indexOf('\n});\n', i); if (j < 0) throw new Error('no end: ' + head.slice(0, 70));
  s = s.slice(0, i) + to + s.slice(j + 5);
};
block("test('row 30 (D467 bar): part 2 alone:", `// AMENDED (D467, C's re-read §8.2): part 3 now counts every piece, so \`edited\` no longer switches it off; the open lap given is the result's own geometry, opened,
// which makes the drag's largest move the result's and leaves part 3 nothing to refuse. Was: every piece in \`edited\`.
test('row 30 (D467 bar): part 2 alone: a result with no straight long enough for the start misses, when the lap before had one', async () => {
  const base = (await closedLap()).getState().history.present, curved = (await curvedNoStraight()).getState().history.present;
  const opened = (d) => ({ ...d, closed: false }), all = base.pieces.map((_, i) => i);
  assert.equal(CJ.barMiss(opened(base), base, { base, edited: all }), null, 'control: the lap itself passes');
  assert.equal(CJ.barMiss(opened(curved), curved, { base, edited: all }), 'leave no straight long enough for the start');
  assert.equal(CJ.barMiss(opened(curved), curved, { base: curved, edited: all }), null, 'a lap that had no start straight cannot lose one');
  const placed = require('../../src/core/document.js').setSpawns(curved, { line: { along: 100 }, grid: { count: 6, rowGapM: 16, colGapM: 6 } });
  assert.equal(CJ.barMiss(opened(placed), placed, { base, edited: all }), null, 'a start placed by hand needs no straight');
});
`);
block("test('row 31 (D467 bar): part 1 alone:", `// AMENDED (D467, C's re-read §8.1 and §8.2): part 1 compares with the lap before the drag now (row 33 is the new side of it), and part 3 counts every piece, so this
// row holds the other side, with the open lap given as the result's own geometry: a red the lap before the drag already had is not new. Was: a result with reds the
// open lap did not have misses (every piece in \`edited\`).
test('row 31 (D467 bar): part 1 alone: a red the lap before the drag already had is not new, and the result passes', async () => {
  const s = await createCoreShell({ autosaveMs: 0 });
  s.extend({ length: 700, family: 'bowl' }); s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 700, transition: 20, targets: { kh: 0 } });
  s.extend({ length: Math.PI * 30, transition: 20, targets: { kh: 1 / 30 } }); s.extend({ length: 60, transition: 20, targets: { kh: 0 } }); s.close();
  const crossing = s.getState().history.present, all = crossing.pieces.map((_, i) => i);
  assert.ok(redsOf(crossing).length > 0, 'control: this lap has reds');
  assert.equal(CJ.barMiss({ ...crossing, closed: false }, crossing, { base: crossing, edited: all }), null, 'every red was there before the drag');
});
`);
fs.writeFileSync(f, raw.includes('\r\n') ? s.split('\n').join('\r\n') : s);
console.log('amended');
