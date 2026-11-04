// ownmut2.js (D467 re-ruled, pane E): the bar's code (B), and D467's own (M) again on the re-ruled tree, each put back or bent one at a time, and its rows run.
// A mutant whose anchor is not found once is NOT APPLIED and counts as nothing.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const root = 'C:/Users/nname/Downloads/t180-wt-e467';
const ST = 'app/test/sculpt-tools.test.js', WASH = 'app/test/sculpt-wash.test.js', CJ = 'app/core/closejob.js', CS = 'app/core/coreshell.js', PV = 'app/preview/preview.js';
const M = [
  // the bar
  ['B1 part 3 removed', CJ, "  if (outside > drag + 1e-6) return `move road", "  if (false) return `move road", ST, 'row (28|29)\\b'],
  ['B2 part 3 ten times looser', CJ, 'if (outside > drag + 1e-6) return', 'if (outside > 10 * drag + 1e-6) return', ST, 'row (28|29)\\b'],
  ['B3 part 3 counts the window too', CJ, '.filter((x) => !win.has(x.piece)).reduce(', '.reduce(', ST, 'row (21|25|26)\\b'],
  ['B4 part 2 removed', CJ, "  if (!closed.spawns && hasStart(base) && !hasStart(closed)) return 'leave no straight long enough for the start';\n", '', ST, 'row 30\\b'],
  ['B5 part 2 asks it of a lap that never had one', CJ, 'if (!closed.spawns && hasStart(base) && !hasStart(closed))', 'if (!closed.spawns && !hasStart(closed))', ST, 'row 30\\b'],
  ['B6 part 2 asks it of a hand-placed start', CJ, 'if (!closed.spawns && hasStart(base) && !hasStart(closed))', 'if (hasStart(base) && !hasStart(closed))', ST, 'row 30\\b'],
  ['B7 part 1 removed', CJ, "  if (fresh.length) return `add", "  if (false) return `add", ST, 'row 31\\b'],
  ['B8 part 1 compares the result with itself', CJ, 'was = redsOf({ ...open, closed: false }, job);', 'was = redsOf(closed, job);', ST, 'row 31\\b'],
  ['B9 runClose ignores the bar', CJ, '  if (bar) { const why = barMiss(doc, res.doc, bar);', '  if (false) { const why = barMiss(doc, res.doc, bar);', ST, 'row (28|29)\\b'],
  ['B10 the release never asks for the bar', CS, "const jobFor = (w) => (w === startTry ? { doc: open, window: w, bar: { base: b.base, edited: win } } : { doc: open, window: w });", "const jobFor = (w) => ({ doc: open, window: w });", ST, 'row (21|28|29)\\b'],
  ['B11 the runner drops the bar', 'app/core/closerunner.js', "...(window ? { window } : {}), ...(bar ? { bar } : {}) });", "...(window ? { window } : {}) });", ST, 'row 32\\b'],
  ['B12 the bar asked of every try', CS, "const jobFor = (w) => (w === startTry ? { doc: open, window: w, bar: { base: b.base, edited: win } } : { doc: open, window: w });", "const jobFor = (w) => ({ doc: open, window: w, bar: { base: b.base, edited: win } });", ST, 'row (22|23|27|28|29)\\b'],
  // D467's own, on the re-ruled tree
  ['M1 no start-pieces try', CS, "const startTry = firstR !== lastR && !win.includes(firstR) && !win.includes(lastR) ? [firstR, lastR] : null;", 'const startTry = null;', ST, 'row (21|25|26)\\b'],
  ['M2 the start-pieces try also at the seam', CS, "const startTry = firstR !== lastR && !win.includes(firstR) && !win.includes(lastR) ? [firstR, lastR] : null;", 'const startTry = firstR !== lastR ? [firstR, lastR] : null;', ST, 'row (22|27)\\b'],
  ['M3 the start pieces tried after the window', CS, "const tries = [...(startTry ? [startTry] : []), ...[win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length)];", "const tries = [...[win, withSeam(lastR), withSeam(lastR, firstR)].filter((w, k, all) => !k || w.length !== all[k - 1].length), ...(startTry ? [startTry] : [])];", ST, 'row (6|20|21|25)\\b'],
  ['M4 a start close is not told apart', CS, 'const byStart = !!startTry && r.tried === startTry;', 'const byStart = false;', ST, 'row 26\\b'],
  ['M5 the kept bend not named', CS, 'const keptBend = byStart ? Object.freeze({ doc: closed, pieces: Object.freeze([...startTry]) }) : null;', 'const keptBend = null;', ST, 'row 26\\b'],
  ['M6 the kept bend outlives its document', PV, 'return !!(st && st.keptBend && st.history && st.keptBend.doc === st.history.present);', 'return !!(st && st.keptBend);', ST, 'row 26\\b'],
  ['M7 the cues ignore a moved start', PV, 'kept = !!startMoved && !!track.path.closed;', 'kept = false;', WASH, 'D467'],
  ['M8 the moved first piece drawn light', PV, 'alpha: kept ? HATCH_ALPHA : HATCH_FIRST_ALPHA', 'alpha: HATCH_FIRST_ALPHA', WASH, 'D467'],
  ['M9 the frame does not pass the moved start', PV, 'sculptCues(track, hoverNow(), startMovedOf(shell.getState()))', 'sculptCues(track, hoverNow())', WASH, 'D467 frame'],
  ['M10 the start words say only closed again', CS, 'return `the lap is closed again: to keep your ${word}, the start of the lap moved (${report})`;', 'return `the lap is closed again: ${report}`;', ST, 'row 26\\b'],
];
let applied = 0, caught = 0, notApplied = 0;
for (const [name, rel, from, to, test, pat] of M) {
  const f = path.join(root, rel), orig = fs.readFileSync(f, 'utf8'), lf = orig.split('\r\n').join('\n');
  if (lf.split(from).length !== 2) { notApplied++; console.log('NOT APPLIED', name); continue; }
  const mut = lf.replace(from, () => to); fs.writeFileSync(f, orig.includes('\r\n') ? mut.split('\n').join('\r\n') : mut);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...(pat ? ['--test-name-pattern=' + pat] : []), path.join(root, test)], { cwd: root, encoding: 'utf8', timeout: 600000 });
    const failed = r.status !== 0 && /^# fail [1-9]/m.test(r.stdout);
    applied++; if (failed) caught++;
    console.log((failed ? 'caught     ' : 'NOT CAUGHT ') + name + '  (' + ((/^# fail \d+/m.exec(r.stdout) || ['?'])[0]) + ')');
  } finally { fs.writeFileSync(f, orig); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
